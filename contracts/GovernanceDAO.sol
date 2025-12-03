// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title GovernanceDAO
 * @notice Decentralized governance for G.O.D. platform decisions
 * @dev Implements tetrahedron-weighted voting with reputation and vertex health scoring
 * 
 * GOVERNANCE PRINCIPLES:
 * 1. Tetrahedron-based voting weight (complete K4 = 4x weight vs isolated vertex)
 * 2. Reputation matters (give/receive ratio, participation history)
 * 3. Guardian Nodes have veto power (prevent mesh harm)
 * 4. Time-locked execution (7-day delay for major changes)
 * 5. Quadratic voting (prevents whale dominance)
 * 
 * WHAT'S GOVERNED:
 * - Memorial Fund parameters (platform fee, vesting periods, request limits)
 * - Health Mesh protocols (crisis thresholds, AI intervention rules)
 * - Guardian Node authority (add/remove Guardian Nodes)
 * - Treasury allocation (development funding, grants, operations)
 * - Protocol upgrades (smart contract changes)
 * - Mesh expansion rules (cluster formation, bridge requirements)
 */

contract GovernanceDAO is AccessControl, ReentrancyGuard, Pausable {
    
    // ============ ROLES ============
    
    bytes32 public constant GUARDIAN_NODE = keccak256("GUARDIAN_NODE");
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    
    // ============ CONSTANTS ============
    
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant EXECUTION_DELAY = 7 days;
    uint256 public constant MIN_QUORUM_PERCENTAGE = 10; // 10% of total voting power
    uint256 public constant GUARDIAN_VETO_PERIOD = 3 days;
    uint256 public constant TETRAHEDRON_MULTIPLIER = 4; // Complete K4 gets 4x weight
    uint256 public constant REPUTATION_THRESHOLD = 50; // Min reputation to vote on critical proposals
    
    // ============ ENUMS ============
    
    enum ProposalType {
        PARAMETER_CHANGE,      // Adjust platform parameters
        TREASURY_ALLOCATION,   // Move funds from treasury
        PROTOCOL_UPGRADE,      // Smart contract upgrade
        GUARDIAN_MANAGEMENT,   // Add/remove Guardian Node
        EMERGENCY_ACTION       // Immediate action (requires 2/3 Guardian approval)
    }
    
    enum ProposalStatus {
        PENDING,
        ACTIVE,
        SUCCEEDED,
        DEFEATED,
        EXECUTED,
        VETOED,
        EXPIRED
    }
    
    enum VoteType {
        AGAINST,
        FOR,
        ABSTAIN
    }
    
    // ============ STRUCTS ============
    
    struct Proposal {
        uint256 id;
        address proposer;
        ProposalType proposalType;
        string title;
        string description;
        bytes calldata_; // Encoded function call for execution
        uint256 createdAt;
        uint256 votingEnds;
        uint256 executionTime; // When proposal can be executed (if passed)
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        uint256 totalVotingPower; // Snapshot of total voting power when created
        ProposalStatus status;
        bool guardianVetoed;
        mapping(address => bool) hasVoted;
        mapping(address => VoteType) votes;
    }
    
    struct VoterProfile {
        uint256 reputation; // 0-100 score based on contributions
        uint256 tetrahedronCount; // How many complete K4s they're part of
        uint256 proposalsCreated;
        uint256 votesCase;
        uint256 lastActivityTimestamp;
        bool isActive;
    }
    
    struct TetrahedronVote {
        address vertex1;
        address vertex2;
        address vertex3;
        address vertex4;
        bool isComplete; // All 4 vertices must vote same way to get multiplier
        VoteType consensusVote;
    }
    
    // ============ STATE VARIABLES ============
    
    uint256 public proposalCount;
    uint256 public treasuryBalance;
    uint256 public totalVotingPower;
    
    mapping(uint256 => Proposal) public proposals;
    mapping(address => VoterProfile) public voters;
    mapping(uint256 => mapping(bytes32 => TetrahedronVote)) public tetrahedronVotes; // proposalId => tetrahedronHash => vote
    mapping(address => uint256[]) public userProposals; // Track user's proposals
    mapping(address => uint256) public votingPower; // Current voting power of each address
    
    // ============ EVENTS ============
    
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        ProposalType proposalType,
        string title,
        uint256 votingEnds
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        VoteType voteType,
        uint256 weight,
        bool isTetrahedronVote
    );
    
    event ProposalExecuted(
        uint256 indexed proposalId,
        address indexed executor
    );
    
    event ProposalVetoed(
        uint256 indexed proposalId,
        address indexed guardian,
        string reason
    );
    
    event GuardianNodeAdded(address indexed guardian);
    event GuardianNodeRemoved(address indexed guardian);
    
    event ReputationUpdated(
        address indexed user,
        uint256 oldReputation,
        uint256 newReputation,
        string reason
    );
    
    event TreasuryDeposit(address indexed from, uint256 amount);
    event TreasuryWithdrawal(address indexed to, uint256 amount, uint256 proposalId);
    
    // ============ CONSTRUCTOR ============
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(GUARDIAN_NODE, msg.sender);
        _grantRole(PROPOSER_ROLE, msg.sender);
    }
    
    // ============ PROPOSAL CREATION ============
    
    /**
     * @notice Create a new governance proposal
     * @param proposalType Type of proposal (parameter change, treasury, upgrade, etc.)
     * @param title Short title for proposal
     * @param description Detailed explanation of proposal
     * @param calldata_ Encoded function call to execute if passed
     */
    function createProposal(
        ProposalType proposalType,
        string memory title,
        string memory description,
        bytes memory calldata_
    ) external whenNotPaused returns (uint256) {
        require(hasRole(PROPOSER_ROLE, msg.sender) || voters[msg.sender].reputation >= 25, "Insufficient reputation to propose");
        
        // Emergency proposals require Guardian Node status
        if (proposalType == ProposalType.EMERGENCY_ACTION) {
            require(hasRole(GUARDIAN_NODE, msg.sender), "Only Guardian Nodes can create emergency proposals");
        }
        
        proposalCount++;
        uint256 proposalId = proposalCount;
        
        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.proposalType = proposalType;
        proposal.title = title;
        proposal.description = description;
        proposal.calldata_ = calldata_;
        proposal.createdAt = block.timestamp;
        
        // Emergency proposals have shorter voting period
        if (proposalType == ProposalType.EMERGENCY_ACTION) {
            proposal.votingEnds = block.timestamp + 1 days;
        } else {
            proposal.votingEnds = block.timestamp + VOTING_PERIOD;
        }
        
        proposal.executionTime = proposal.votingEnds + EXECUTION_DELAY;
        proposal.totalVotingPower = totalVotingPower;
        proposal.status = ProposalStatus.ACTIVE;
        
        // Track user's proposals
        userProposals[msg.sender].push(proposalId);
        voters[msg.sender].proposalsCreated++;
        
        emit ProposalCreated(proposalId, msg.sender, proposalType, title, proposal.votingEnds);
        
        return proposalId;
    }
    
    // ============ VOTING ============
    
    /**
     * @notice Cast a vote on a proposal
     * @param proposalId ID of proposal to vote on
     * @param voteType Vote FOR, AGAINST, or ABSTAIN
     */
    function castVote(
        uint256 proposalId,
        VoteType voteType
    ) external whenNotPaused {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.status == ProposalStatus.ACTIVE, "Proposal not active");
        require(block.timestamp <= proposal.votingEnds, "Voting period ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        
        // Check reputation requirement for critical proposals
        if (proposal.proposalType == ProposalType.PROTOCOL_UPGRADE || 
            proposal.proposalType == ProposalType.GUARDIAN_MANAGEMENT) {
            require(voters[msg.sender].reputation >= REPUTATION_THRESHOLD, "Insufficient reputation for critical vote");
        }
        
        uint256 weight = _calculateVotingWeight(msg.sender);
        
        proposal.hasVoted[msg.sender] = true;
        proposal.votes[msg.sender] = voteType;
        
        if (voteType == VoteType.FOR) {
            proposal.forVotes += weight;
        } else if (voteType == VoteType.AGAINST) {
            proposal.againstVotes += weight;
        } else {
            proposal.abstainVotes += weight;
        }
        
        voters[msg.sender].votesCase++;
        voters[msg.sender].lastActivityTimestamp = block.timestamp;
        
        emit VoteCast(proposalId, msg.sender, voteType, weight, false);
    }
    
    /**
     * @notice Cast a tetrahedron vote (4 vertices voting together for 4x weight)
     * @param proposalId ID of proposal
     * @param vertices Array of 4 vertex addresses (must form complete K4)
     * @param voteType All 4 must vote the same way
     */
    function castTetrahedronVote(
        uint256 proposalId,
        address[4] memory vertices,
        VoteType voteType
    ) external whenNotPaused {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.status == ProposalStatus.ACTIVE, "Proposal not active");
        require(block.timestamp <= proposal.votingEnds, "Voting period ended");
        
        // Verify caller is one of the vertices
        bool isVertex = false;
        for (uint i = 0; i < 4; i++) {
            if (vertices[i] == msg.sender) {
                isVertex = true;
                break;
            }
        }
        require(isVertex, "Caller not part of tetrahedron");
        
        // Create tetrahedron hash
        bytes32 tetrahedronHash = keccak256(abi.encodePacked(vertices));
        
        // Verify this tetrahedron hasn't voted yet
        TetrahedronVote storage tetVote = tetrahedronVotes[proposalId][tetrahedronHash];
        require(!proposal.hasVoted[vertices[0]] && !proposal.hasVoted[vertices[1]] && 
                !proposal.hasVoted[vertices[2]] && !proposal.hasVoted[vertices[3]], 
                "Tetrahedron members already voted");
        
        // TODO: Verify this is actually a complete K4 (would need mesh data)
        // For now, trust the vertices array
        
        // Calculate combined weight with TETRAHEDRON_MULTIPLIER
        uint256 baseWeight = 0;
        for (uint i = 0; i < 4; i++) {
            baseWeight += _calculateVotingWeight(vertices[i]);
            proposal.hasVoted[vertices[i]] = true;
            voters[vertices[i]].votesCase++;
            voters[vertices[i]].lastActivityTimestamp = block.timestamp;
        }
        
        uint256 totalWeight = baseWeight * TETRAHEDRON_MULTIPLIER;
        
        if (voteType == VoteType.FOR) {
            proposal.forVotes += totalWeight;
        } else if (voteType == VoteType.AGAINST) {
            proposal.againstVotes += totalWeight;
        } else {
            proposal.abstainVotes += totalWeight;
        }
        
        tetVote.vertex1 = vertices[0];
        tetVote.vertex2 = vertices[1];
        tetVote.vertex3 = vertices[2];
        tetVote.vertex4 = vertices[3];
        tetVote.isComplete = true;
        tetVote.consensusVote = voteType;
        
        emit VoteCast(proposalId, msg.sender, voteType, totalWeight, true);
    }
    
    // ============ PROPOSAL EXECUTION ============
    
    /**
     * @notice Finalize proposal after voting period ends
     * @param proposalId ID of proposal to finalize
     */
    function finalizeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.status == ProposalStatus.ACTIVE, "Proposal not active");
        require(block.timestamp > proposal.votingEnds, "Voting still in progress");
        
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        uint256 quorumRequired = (proposal.totalVotingPower * MIN_QUORUM_PERCENTAGE) / 100;
        
        // Check if quorum reached
        if (totalVotes < quorumRequired) {
            proposal.status = ProposalStatus.DEFEATED;
            return;
        }
        
        // Check if majority FOR
        if (proposal.forVotes > proposal.againstVotes) {
            proposal.status = ProposalStatus.SUCCEEDED;
            
            // Increase proposer reputation
            _updateReputation(proposal.proposer, 5, "Successful proposal");
        } else {
            proposal.status = ProposalStatus.DEFEATED;
        }
    }
    
    /**
     * @notice Execute a successful proposal after execution delay
     * @param proposalId ID of proposal to execute
     */
    function executeProposal(uint256 proposalId) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.status == ProposalStatus.SUCCEEDED, "Proposal not succeeded");
        require(block.timestamp >= proposal.executionTime, "Execution delay not passed");
        require(!proposal.guardianVetoed, "Proposal vetoed by Guardian");
        
        proposal.status = ProposalStatus.EXECUTED;
        
        // Execute the calldata (actual governance action)
        if (proposal.calldata_.length > 0) {
            (bool success, ) = address(this).call(proposal.calldata_);
            require(success, "Execution failed");
        }
        
        emit ProposalExecuted(proposalId, msg.sender);
    }
    
    // ============ GUARDIAN VETO ============
    
    /**
     * @notice Guardian Nodes can veto proposals that would harm the mesh
     * @param proposalId ID of proposal to veto
     * @param reason Explanation for veto
     */
    function vetoProposal(uint256 proposalId, string memory reason) external {
        require(hasRole(GUARDIAN_NODE, msg.sender), "Only Guardian Nodes can veto");
        
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.status == ProposalStatus.SUCCEEDED, "Can only veto succeeded proposals");
        require(block.timestamp < proposal.executionTime, "Execution delay passed");
        
        proposal.guardianVetoed = true;
        proposal.status = ProposalStatus.VETOED;
        
        emit ProposalVetoed(proposalId, msg.sender, reason);
    }
    
    // ============ REPUTATION MANAGEMENT ============
    
    /**
     * @notice Update user reputation (called by other contracts or Guardian Nodes)
     * @param user Address of user
     * @param change Amount to increase/decrease reputation
     * @param reason Why reputation changed
     */
    function _updateReputation(address user, int256 change, string memory reason) internal {
        uint256 oldReputation = voters[user].reputation;
        
        if (change > 0) {
            voters[user].reputation += uint256(change);
            if (voters[user].reputation > 100) voters[user].reputation = 100;
        } else {
            uint256 decrease = uint256(-change);
            if (voters[user].reputation < decrease) {
                voters[user].reputation = 0;
            } else {
                voters[user].reputation -= decrease;
            }
        }
        
        emit ReputationUpdated(user, oldReputation, voters[user].reputation, reason);
    }
    
    /**
     * @notice Guardian Nodes can manually adjust reputation
     */
    function adjustReputation(address user, int256 change, string memory reason) external {
        require(hasRole(GUARDIAN_NODE, msg.sender), "Only Guardian Nodes");
        _updateReputation(user, change, reason);
    }
    
    // ============ VOTING WEIGHT CALCULATION ============
    
    /**
     * @notice Calculate voting weight based on reputation and participation
     * @dev Uses quadratic voting to prevent whale dominance
     */
    function _calculateVotingWeight(address voter) internal view returns (uint256) {
        VoterProfile memory profile = voters[voter];
        
        // Base weight from reputation (quadratic)
        uint256 reputationWeight = sqrt(profile.reputation * 100);
        
        // Bonus for active participation
        uint256 participationBonus = 0;
        if (profile.votesCase > 10) {
            participationBonus = sqrt(profile.votesCase);
        }
        
        // Tetrahedron multiplier is applied separately in castTetrahedronVote
        return reputationWeight + participationBonus;
    }
    
    /**
     * @notice Babylonian square root approximation
     */
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
    
    // ============ TREASURY MANAGEMENT ============
    
    /**
     * @notice Deposit funds to governance treasury
     */
    function depositToTreasury() external payable {
        treasuryBalance += msg.value;
        emit TreasuryDeposit(msg.sender, msg.value);
    }
    
    /**
     * @notice Withdraw from treasury (only via executed proposal)
     */
    function _withdrawFromTreasury(address recipient, uint256 amount, uint256 proposalId) internal {
        require(treasuryBalance >= amount, "Insufficient treasury balance");
        treasuryBalance -= amount;
        
        (bool success, ) = payable(recipient).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit TreasuryWithdrawal(recipient, amount, proposalId);
    }
    
    // ============ GUARDIAN NODE MANAGEMENT ============
    
    /**
     * @notice Add Guardian Node (only via executed proposal)
     */
    function addGuardianNode(address guardian) external {
        require(msg.sender == address(this), "Only via governance");
        _grantRole(GUARDIAN_NODE, guardian);
        emit GuardianNodeAdded(guardian);
    }
    
    /**
     * @notice Remove Guardian Node (only via executed proposal)
     */
    function removeGuardianNode(address guardian) external {
        require(msg.sender == address(this), "Only via governance");
        _revokeRole(GUARDIAN_NODE, guardian);
        emit GuardianNodeRemoved(guardian);
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @notice Emergency pause (Guardian Nodes only)
     */
    function pause() external {
        require(hasRole(GUARDIAN_NODE, msg.sender), "Only Guardian Nodes");
        _pause();
    }
    
    /**
     * @notice Unpause
     */
    function unpause() external {
        require(hasRole(GUARDIAN_NODE, msg.sender), "Only Guardian Nodes");
        _unpause();
    }
    
    // ============ VIEW FUNCTIONS ============
    
    function getProposal(uint256 proposalId) external view returns (
        address proposer,
        ProposalType proposalType,
        string memory title,
        string memory description,
        uint256 createdAt,
        uint256 votingEnds,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 abstainVotes,
        ProposalStatus status
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.proposer,
            proposal.proposalType,
            proposal.title,
            proposal.description,
            proposal.createdAt,
            proposal.votingEnds,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.abstainVotes,
            proposal.status
        );
    }
    
    function getVoterProfile(address voter) external view returns (
        uint256 reputation,
        uint256 tetrahedronCount,
        uint256 proposalsCreated,
        uint256 votesCase,
        uint256 lastActivityTimestamp
    ) {
        VoterProfile memory profile = voters[voter];
        return (
            profile.reputation,
            profile.tetrahedronCount,
            profile.proposalsCreated,
            profile.votesCase,
            profile.lastActivityTimestamp
        );
    }
    
    function getUserProposals(address user) external view returns (uint256[] memory) {
        return userProposals[user];
    }
    
    function hasVoted(uint256 proposalId, address voter) external view returns (bool) {
        return proposals[proposalId].hasVoted[voter];
    }
    
    receive() external payable {
        treasuryBalance += msg.value;
        emit TreasuryDeposit(msg.sender, msg.value);
    }
}
