// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title MemorialFundDAO
 * @notice Decentralized mutual aid fund for tetrahedron networks
 * @dev Manages loss events, contributions, distributions with DAO governance
 * 
 * Core Principles:
 * - When your vertex fails, the mesh catches you
 * - Reciprocal safety net (give when you can, receive when you need)
 * - Transparent, auditable, peer-to-peer
 * - No middleman, minimal fees, automatic distribution
 */
contract MemorialFundDAO is ReentrancyGuard, AccessControl, Pausable {
    
    // ============ CONSTANTS ============
    
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");
    bytes32 public constant DAO_ROLE = keccak256("DAO_ROLE");
    
    uint256 public constant PLATFORM_FEE_BPS = 200; // 2% (basis points)
    uint256 public constant MIN_VESTING_PERIOD = 90 days;
    uint256 public constant AUTO_APPROVE_THRESHOLD = 1000 * 10**18; // 1000 tokens
    uint256 public constant MAX_LOSS_DURATION = 180 days;
    uint256 public constant EMERGENCY_FAST_TRACK = 1 hours;
    
    // ============ ENUMS ============
    
    enum LossType {
        Death,
        Divorce,
        Medical,
        JobLoss,
        Emergency,
        Other
    }
    
    enum LossStatus {
        Pending,
        Active,
        Funded,
        Distributed,
        Expired,
        Disputed
    }
    
    enum VerificationStatus {
        Unverified,
        Pending,
        Verified,
        Rejected
    }
    
    // ============ STRUCTS ============
    
    struct Loss {
        uint256 id;
        address payable triad;
        LossType lossType;
        LossStatus status;
        VerificationStatus verificationStatus;
        uint256 targetAmount;
        uint256 collectedAmount;
        uint256 distributedAmount;
        uint256 createdAt;
        uint256 expiresAt;
        uint256 verifiedAt;
        string metadataURI; // IPFS hash with loss details
        address[] contributors;
        bool emergencyFlagged;
    }
    
    struct Member {
        address wallet;
        uint256 totalContributed;
        uint256 totalReceived;
        uint256 joinedAt;
        uint256 reciprocityScore;
        uint256 reputationScore;
        bool isActive;
        bool inGoodStanding;
    }
    
    struct Contribution {
        address contributor;
        uint256 amount;
        uint256 timestamp;
        bool recurring;
        uint256 recurringEndDate;
    }
    
    // ============ STATE VARIABLES ============
    
    uint256 public lossCounter;
    uint256 public totalFundsDistributed;
    uint256 public totalFundsCollected;
    uint256 public activeLossCount;
    
    mapping(uint256 => Loss) public losses;
    mapping(address => Member) public members;
    mapping(uint256 => mapping(address => Contribution)) public contributions;
    mapping(uint256 => uint256[]) public lossContributions; // lossId => contributionIds
    mapping(address => uint256[]) public memberLosses; // member => lossIds
    mapping(address => uint256[]) public memberContributions; // member => lossIds
    
    // Governance
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => uint256) public votesFor;
    mapping(uint256 => uint256) public votesAgainst;
    
    // ============ EVENTS ============
    
    event LossCreated(
        uint256 indexed lossId,
        address indexed triad,
        LossType lossType,
        uint256 targetAmount,
        bool emergency
    );
    
    event ContributionReceived(
        uint256 indexed lossId,
        address indexed contributor,
        uint256 amount,
        bool recurring
    );
    
    event FundsDistributed(
        uint256 indexed lossId,
        address indexed recipient,
        uint256 amount,
        uint256 platformFee
    );
    
    event LossVerified(
        uint256 indexed lossId,
        address indexed verifier,
        VerificationStatus status
    );
    
    event EmergencyFlagged(
        uint256 indexed lossId,
        address indexed flaggedBy
    );
    
    event MemberJoined(
        address indexed member,
        uint256 timestamp
    );
    
    event ReciprocityUpdated(
        address indexed member,
        uint256 score
    );
    
    // ============ MODIFIERS ============
    
    modifier onlyVerifiedMember() {
        require(members[msg.sender].isActive, "Not active member");
        require(members[msg.sender].inGoodStanding, "Not in good standing");
        _;
    }
    
    modifier onlyAfterVesting() {
        require(
            block.timestamp >= members[msg.sender].joinedAt + MIN_VESTING_PERIOD,
            "Vesting period not complete"
        );
        _;
    }
    
    modifier lossExists(uint256 _lossId) {
        require(_lossId > 0 && _lossId <= lossCounter, "Loss does not exist");
        _;
    }
    
    modifier lossActive(uint256 _lossId) {
        require(losses[_lossId].status == LossStatus.Active, "Loss not active");
        require(block.timestamp < losses[_lossId].expiresAt, "Loss expired");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(GUARDIAN_ROLE, msg.sender);
        _grantRole(DAO_ROLE, msg.sender);
    }
    
    // ============ CORE FUNCTIONS ============
    
    /**
     * @notice Create a new loss event (memorial vertex marked)
     * @param _triad Address of the triad (remaining 3 vertices)
     * @param _lossType Type of loss event
     * @param _targetAmount Target funding amount
     * @param _metadataURI IPFS hash containing loss details
     * @param _emergency Whether this is an emergency requiring fast-track
     */
    function createLoss(
        address payable _triad,
        LossType _lossType,
        uint256 _targetAmount,
        string memory _metadataURI,
        bool _emergency
    ) external onlyVerifiedMember onlyAfterVesting whenNotPaused returns (uint256) {
        require(_triad != address(0), "Invalid triad address");
        require(_targetAmount > 0, "Target must be > 0");
        
        // Check rate limiting (1 major request per year)
        uint256[] memory previousLosses = memberLosses[_triad];
        for (uint256 i = 0; i < previousLosses.length; i++) {
            Loss memory prevLoss = losses[previousLosses[i]];
            if (
                prevLoss.targetAmount >= AUTO_APPROVE_THRESHOLD &&
                block.timestamp < prevLoss.createdAt + 365 days
            ) {
                revert("Rate limit: 1 major request per year");
            }
        }
        
        lossCounter++;
        
        Loss storage newLoss = losses[lossCounter];
        newLoss.id = lossCounter;
        newLoss.triad = _triad;
        newLoss.lossType = _lossType;
        newLoss.targetAmount = _targetAmount;
        newLoss.createdAt = block.timestamp;
        newLoss.expiresAt = block.timestamp + MAX_LOSS_DURATION;
        newLoss.metadataURI = _metadataURI;
        newLoss.emergencyFlagged = _emergency;
        
        // Auto-approve small requests or emergency requests
        if (_targetAmount < AUTO_APPROVE_THRESHOLD || _emergency) {
            newLoss.status = LossStatus.Active;
            newLoss.verificationStatus = VerificationStatus.Verified;
            newLoss.verifiedAt = block.timestamp;
            activeLossCount++;
        } else {
            newLoss.status = LossStatus.Pending;
            newLoss.verificationStatus = VerificationStatus.Pending;
        }
        
        memberLosses[_triad].push(lossCounter);
        
        emit LossCreated(lossCounter, _triad, _lossType, _targetAmount, _emergency);
        
        return lossCounter;
    }
    
    /**
     * @notice Contribute funds to a loss event
     * @param _lossId ID of the loss event
     */
    function contribute(uint256 _lossId) 
        external 
        payable 
        lossExists(_lossId) 
        lossActive(_lossId) 
        whenNotPaused 
        nonReentrant 
    {
        require(msg.value > 0, "Must send funds");
        
        Loss storage loss = losses[_lossId];
        
        // Record contribution
        if (contributions[_lossId][msg.sender].amount == 0) {
            loss.contributors.push(msg.sender);
        }
        
        contributions[_lossId][msg.sender].contributor = msg.sender;
        contributions[_lossId][msg.sender].amount += msg.value;
        contributions[_lossId][msg.sender].timestamp = block.timestamp;
        
        loss.collectedAmount += msg.value;
        totalFundsCollected += msg.value;
        
        // Update member stats
        if (!members[msg.sender].isActive) {
            _registerMember(msg.sender);
        }
        
        members[msg.sender].totalContributed += msg.value;
        memberContributions[msg.sender].push(_lossId);
        
        // Update reciprocity score
        _updateReciprocityScore(msg.sender);
        
        emit ContributionReceived(_lossId, msg.sender, msg.value, false);
        
        // Check if target reached
        if (loss.collectedAmount >= loss.targetAmount) {
            loss.status = LossStatus.Funded;
        }
    }
    
    /**
     * @notice Distribute collected funds to triad
     * @param _lossId ID of the loss event
     */
    function distributeFunds(uint256 _lossId) 
        external 
        lossExists(_lossId) 
        whenNotPaused 
        nonReentrant 
    {
        Loss storage loss = losses[_lossId];
        
        require(
            loss.status == LossStatus.Active || loss.status == LossStatus.Funded,
            "Cannot distribute"
        );
        require(loss.collectedAmount > loss.distributedAmount, "Nothing to distribute");
        require(
            loss.verificationStatus == VerificationStatus.Verified,
            "Loss not verified"
        );
        
        // For emergency, allow fast-track distribution after 1 hour
        if (loss.emergencyFlagged) {
            require(
                block.timestamp >= loss.createdAt + EMERGENCY_FAST_TRACK,
                "Emergency fast-track period not elapsed"
            );
        }
        
        uint256 availableAmount = loss.collectedAmount - loss.distributedAmount;
        uint256 platformFee = (availableAmount * PLATFORM_FEE_BPS) / 10000;
        uint256 distributionAmount = availableAmount - platformFee;
        
        loss.distributedAmount += availableAmount;
        loss.status = LossStatus.Distributed;
        totalFundsDistributed += distributionAmount;
        activeLossCount--;
        
        // Update recipient stats
        members[loss.triad].totalReceived += distributionAmount;
        _updateReciprocityScore(loss.triad);
        
        // Transfer funds
        (bool success, ) = loss.triad.call{value: distributionAmount}("");
        require(success, "Transfer failed");
        
        emit FundsDistributed(_lossId, loss.triad, distributionAmount, platformFee);
    }
    
    // ============ GOVERNANCE FUNCTIONS ============
    
    /**
     * @notice Verify a loss event (Guardian Node or DAO vote)
     * @param _lossId ID of the loss event
     * @param _approved Whether verification is approved
     */
    function verifyLoss(uint256 _lossId, bool _approved) 
        external 
        onlyRole(GUARDIAN_ROLE) 
        lossExists(_lossId) 
    {
        Loss storage loss = losses[_lossId];
        
        require(
            loss.verificationStatus == VerificationStatus.Pending,
            "Not pending verification"
        );
        
        if (_approved) {
            loss.verificationStatus = VerificationStatus.Verified;
            loss.verifiedAt = block.timestamp;
            loss.status = LossStatus.Active;
            activeLossCount++;
        } else {
            loss.verificationStatus = VerificationStatus.Rejected;
            loss.status = LossStatus.Disputed;
        }
        
        emit LossVerified(_lossId, msg.sender, loss.verificationStatus);
    }
    
    /**
     * @notice Flag loss as emergency for fast-track
     * @param _lossId ID of the loss event
     */
    function flagEmergency(uint256 _lossId) 
        external 
        onlyRole(GUARDIAN_ROLE) 
        lossExists(_lossId) 
    {
        losses[_lossId].emergencyFlagged = true;
        emit EmergencyFlagged(_lossId, msg.sender);
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @notice Get reciprocity score for a member
     * @param _member Address of the member
     * @return score Reciprocity score (0-100)
     */
    function getReciprocityScore(address _member) public view returns (uint256) {
        Member memory member = members[_member];
        
        if (member.totalReceived == 0) {
            return member.totalContributed > 0 ? 100 : 0;
        }
        
        uint256 total = member.totalContributed + member.totalReceived;
        return (member.totalContributed * 100) / total;
    }
    
    /**
     * @notice Get loss details
     * @param _lossId ID of the loss event
     */
    function getLoss(uint256 _lossId) 
        external 
        view 
        lossExists(_lossId) 
        returns (Loss memory) 
    {
        return losses[_lossId];
    }
    
    /**
     * @notice Get all losses for a member
     * @param _member Address of the member
     */
    function getMemberLosses(address _member) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return memberLosses[_member];
    }
    
    /**
     * @notice Get all contributions for a member
     * @param _member Address of the member
     */
    function getMemberContributions(address _member) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return memberContributions[_member];
    }
    
    /**
     * @notice Get global mesh stats
     */
    function getGlobalStats() 
        external 
        view 
        returns (
            uint256 totalLosses,
            uint256 activeLosses,
            uint256 totalCollected,
            uint256 totalDistributed,
            uint256 successRate
        ) 
    {
        totalLosses = lossCounter;
        activeLosses = activeLossCount;
        totalCollected = totalFundsCollected;
        totalDistributed = totalFundsDistributed;
        successRate = lossCounter > 0 
            ? (totalFundsDistributed * 100) / totalFundsCollected 
            : 0;
    }
    
    // ============ INTERNAL FUNCTIONS ============
    
    function _registerMember(address _member) internal {
        members[_member] = Member({
            wallet: _member,
            totalContributed: 0,
            totalReceived: 0,
            joinedAt: block.timestamp,
            reciprocityScore: 0,
            reputationScore: 100,
            isActive: true,
            inGoodStanding: true
        });
        
        emit MemberJoined(_member, block.timestamp);
    }
    
    function _updateReciprocityScore(address _member) internal {
        uint256 score = getReciprocityScore(_member);
        members[_member].reciprocityScore = score;
        emit ReciprocityUpdated(_member, score);
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
    
    function withdrawPlatformFees() 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
        nonReentrant 
    {
        uint256 balance = address(this).balance;
        uint256 distributionTotal = totalFundsDistributed;
        uint256 platformFees = balance > distributionTotal 
            ? balance - distributionTotal 
            : 0;
        
        require(platformFees > 0, "No fees to withdraw");
        
        (bool success, ) = msg.sender.call{value: platformFees}("");
        require(success, "Withdrawal failed");
    }
    
    receive() external payable {}
}
