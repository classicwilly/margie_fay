# G.O.D. GOVERNANCE

**Decentralized decision-making for platform parameters, treasury allocation, and protocol upgrades.**

---

## Governance Principles

### 1. Tetrahedron-Weighted Voting
**Complete K₄ graphs get 4x voting weight.**

- Individual vote: Base weight from reputation + participation
- Tetrahedron vote: 4 vertices voting together = 4x multiplier
- Incentivizes mesh formation and collective decision-making

### 2. Reputation-Based Power
**Quadratic voting prevents whale dominance.**

- Voting weight = √(reputation × 100) + √(votes cast)
- Reputation earned through:
  - Successful proposals (+5-10 points)
  - Voting participation (+0.5 per vote)
  - Memorial Fund contributions (+1-5 points)
  - Guardian Node endorsements (+10 points)
- Reputation lost through:
  - Failed/malicious proposals (-5-20 points)
  - Inactivity (decay over time)
  - Community reports (Guardian review)

### 3. Guardian Node Veto Power
**Trusted experts can block harmful proposals.**

- Guardian Nodes are high-reputation (80+) community members
- Can veto any proposal within 3-day window after vote passes
- Must provide public reasoning for veto
- Can be added/removed via governance vote
- Examples: Healthcare experts, security auditors, legal advisors

### 4. Time-Locked Execution
**7-day delay between vote passing and execution.**

- Voting period: 7 days (1 day for emergency proposals)
- Execution delay: 7 days after voting ends
- Guardian veto window: First 3 days of execution delay
- Prevents rushed decisions, allows community review

### 5. Minimum Quorum
**10% of total voting power must participate.**

- Prevents small group from controlling decisions
- Scales with platform growth
- Abstain votes count toward quorum but not outcome

---

## What's Governed

### Parameter Changes
**Adjust platform settings without code changes.**

Examples:
- Memorial Fund platform fee (currently 2%)
- Vesting periods (currently 90 days)
- Request limits per year (currently 1 major request)
- Reputation thresholds for actions
- Voting power calculations

### Treasury Allocation
**Decide how platform funds are spent.**

Treasury sources:
- Memorial Fund platform fees (2% of contributions)
- Governance transaction fees
- Community donations
- Grant funding

Allocation decisions:
- Development funding (features, infrastructure)
- Security audits
- Community grants (projects building on G.O.D.)
- Operations (servers, maintenance)
- Marketing/growth initiatives

### Protocol Upgrades
**Smart contract changes and new features.**

Requires high quorum (20%) and supermajority (66%):
- Memorial Fund DAO contract upgrades
- Governance DAO changes
- Health Mesh protocol additions
- Guardian Node authority modifications
- Mesh topology rules

### Guardian Node Management
**Add or remove trusted experts.**

Requirements to become Guardian:
- Reputation ≥ 80
- Active for 6+ months
- Specialized expertise (healthcare, security, legal, etc.)
- Community endorsements (3+ high-rep members)
- Background verification

Reasons for removal:
- Inactivity (no votes/vetoes in 90 days)
- Abuse of veto power (frivolous vetoes)
- Community vote (66% supermajority)
- Self-resignation

### Emergency Actions
**Immediate response to critical threats.**

Emergency proposals:
- Created only by Guardian Nodes
- 1-day voting period (vs. 7-day standard)
- Requires 2/3 Guardian approval
- No execution delay (immediate)
- Examples: Security vulnerabilities, exploit response, critical bug fixes

---

## Proposal Lifecycle

### 1. Creation
**Reputation ≥ 25 to create proposals.**

Proposer submits:
- Proposal type (parameter/treasury/upgrade/guardian/emergency)
- Title (short, descriptive)
- Description (detailed explanation + rationale)
- Calldata (encoded function call for execution)

Platform validates:
- Proposer has sufficient reputation
- Proposal type matches permissions
- Emergency proposals only from Guardians

### 2. Voting Period
**7 days for standard proposals, 1 day for emergency.**

Voters can:
- Vote FOR, AGAINST, or ABSTAIN
- Change vote before period ends
- Vote individually or as tetrahedron (4x weight)

Voting weight calculated:
```
individual_weight = √(reputation × 100) + √(votes_cast)
tetrahedron_weight = (sum of 4 individual weights) × 4
```

Real-time tracking:
- FOR votes vs. AGAINST votes
- Quorum progress (need 10% of total voting power)
- Time remaining

### 3. Finalization
**Voting period ends, outcome determined.**

Quorum check:
- Total votes (FOR + AGAINST + ABSTAIN) ≥ 10% of voting power?
- If not: Proposal DEFEATED

Outcome:
- FOR votes > AGAINST votes → SUCCEEDED
- FOR votes ≤ AGAINST votes → DEFEATED

Reputation updates:
- Successful proposal: Proposer +5 reputation
- Failed proposal: No change (not penalized for trying)

### 4. Execution Delay
**7-day waiting period before execution.**

Guardian veto window (first 3 days):
- Guardians can review proposal impact
- Can veto if harmful to mesh
- Must provide public reasoning
- Vetoed proposals cannot be executed

After 7 days:
- Anyone can trigger execution
- Smart contract call executes proposal's calldata
- Changes take effect immediately
- Proposal marked EXECUTED

---

## Tetrahedron Voting

### Why 4x Multiplier?
**Incentivizes collective decision-making and mesh formation.**

Individual voting:
- You vote alone
- Get your personal voting weight
- No coordination required

Tetrahedron voting:
- 4 vertices must vote together (same direction)
- All 4 must be in agreement (FOR, AGAINST, or ABSTAIN)
- Get combined weight × 4
- Requires mesh coordination

Example:
```
Individual votes:
- Alice (rep 60): weight = √(6000) + √(10) = 80.6
- Bob (rep 50): weight = √(5000) + √(8) = 73.5
- Carol (rep 70): weight = √(7000) + √(12) = 86.9
- Dave (rep 55): weight = √(5500) + √(9) = 77.1

Voting separately: 80.6 + 73.5 + 86.9 + 77.1 = 318.1

Voting as K₄: (80.6 + 73.5 + 86.9 + 77.1) × 4 = 1,272.4

4x multiplier!
```

### How It Works
**Smart contract verifies tetrahedron structure.**

1. One vertex initiates tetrahedron vote
2. Provides addresses of 4 vertices (including themselves)
3. All 4 must vote same way (FOR/AGAINST/ABSTAIN)
4. Contract verifies they form complete K₄ (would need mesh data)
5. If valid: Apply 4x multiplier to combined weight
6. All 4 marked as having voted (can't vote again)

Future enhancement:
- Automatic K₄ detection (scan mesh graph)
- Suggested tetrahedron formations
- Multi-tetrahedron voting (clusters)

---

## Reputation System

### How Reputation is Earned
**0-100 scale, reflects contributions and participation.**

Sources:
- **Proposals (+5-10):** Successful governance proposals
- **Voting (+0.5/vote):** Active participation in decisions
- **Memorial Fund (+1-5):** Contributing to mutual aid
- **Guardian Endorsements (+10):** Recognition from trusted experts
- **Mesh Formation (+2):** Creating new tetrahedrons
- **Protocol Usage (+1):** Active use of platform features
- **Community Reports (+5-20):** Helping others, bug reports, documentation

### Reputation Decay
**Prevents inactive members from controlling governance.**

Decay rules:
- Lose 1 reputation per 30 days of inactivity
- Inactivity = no votes, proposals, or platform usage
- Stops at 0 (can't go negative)
- Reactivate by participating again

### Reputation Requirements
**Different actions require different reputation levels.**

| Action | Min Reputation |
|--------|----------------|
| Vote on standard proposals | 0 |
| Vote on critical proposals (upgrades, guardian management) | 50 |
| Create standard proposals | 25 |
| Create treasury proposals | 40 |
| Create protocol upgrade proposals | 60 |
| Become Guardian Node | 80 |

---

## Guardian Node System

### Role of Guardians
**Prevent mesh harm through veto power.**

Powers:
- Veto proposals within 3-day window
- Create emergency proposals
- Adjust reputation (manual corrections)
- Pause contracts (emergency only)

Responsibilities:
- Review all passing proposals
- Assess impact on mesh health
- Provide public reasoning for vetoes
- Respond to security threats
- Guide protocol development

### Guardian Selection
**Community-driven process with verification.**

Requirements:
1. Reputation ≥ 80 (top 5% of users)
2. Active for 6+ months
3. Specialized expertise in relevant domain
4. 3+ endorsements from high-rep members
5. Background verification (identity, credentials)

Process:
1. Nomination (self or community)
2. Community discussion (forum/discord)
3. Governance proposal created
4. 7-day voting period
5. If passes: Guardian role granted

Removal process:
- Inactivity (90 days)
- Community vote (66% supermajority)
- Self-resignation

### Veto Accountability
**Guardians must justify vetoes publicly.**

Veto process:
1. Proposal passes vote
2. 7-day execution delay begins
3. Guardian identifies potential harm
4. Guardian submits veto with reasoning
5. Veto published publicly (on-chain event)
6. Community can dispute veto via new proposal

Valid veto reasons:
- Security vulnerability introduced
- Economic attack vector created
- Contradicts platform principles
- Legal/regulatory risk
- Technical infeasibility

Invalid veto reasons:
- Personal disagreement
- Political bias
- Competitive interest

---

## Treasury Management

### Current Balance
**~$150K (as of December 2025)**

Sources:
- Memorial Fund fees: $120K (2% of $6M distributed)
- Community donations: $25K
- Grant funding: $5K

### Allocation Priorities
**Decided by governance votes.**

Q1 2026 Budget (proposed):
- Development: $50K (Health Mesh, Guardian Node AI)
- Security audits: $30K (Memorial Fund DAO, Governance contracts)
- Operations: $20K (Servers, infrastructure, maintenance)
- Community grants: $15K (Projects building on G.O.D.)
- Marketing: $10K (Educational content, user acquisition)
- Reserve: $25K (Emergency fund)

### Allocation Process
**Treasury proposal → Vote → Execution.**

1. Community member creates treasury proposal
   - Amount requested
   - Purpose/justification
   - Deliverables/milestones
   - Timeline

2. 7-day voting period
   - Quorum: 10% of voting power
   - Passes if FOR > AGAINST

3. 7-day execution delay
   - Guardian review
   - Community discussion

4. Execution
   - Funds transferred to recipient
   - Milestones tracked
   - Progress reported

---

## Quadratic Voting Math

### Why Quadratic?
**Prevents whales from dominating governance.**

Linear voting problem:
- User with 10,000 reputation = 10,000 votes
- User with 100 reputation = 100 votes
- Whale has 100x power (can override 100 people)

Quadratic voting solution:
- User with 10,000 reputation = √10,000 = 100 votes
- User with 100 reputation = √100 = 10 votes
- Whale has 10x power (more reasonable, 10 people can match)

### Formula
```
voting_weight = √(reputation × 100) + √(votes_cast)
```

Examples:
- Rep 25, 5 votes cast: √2,500 + √5 = 50 + 2.2 = 52.2 weight
- Rep 50, 10 votes cast: √5,000 + √10 = 70.7 + 3.2 = 73.9 weight
- Rep 100, 50 votes cast: √10,000 + √50 = 100 + 7.1 = 107.1 weight

### Tetrahedron Multiplier
**4x for coordinated voting.**

Without tetrahedron:
- 4 users with rep 50: 4 × 70.7 = 282.8 combined weight

With tetrahedron:
- Same 4 users voting as K₄: 282.8 × 4 = 1,131.2 combined weight

Incentivizes mesh formation!

---

## Proposal Examples

### Example 1: Parameter Change
**Reduce Memorial Fund platform fee from 2% to 1.5%**

Type: Parameter Change
Proposer: 0x1234...5678 (Rep: 72)
Description:
> Community feedback suggests 2% platform fee is too high for mutual aid operations. Data shows 78% of contributors would give more if fee was lower. Reducing to 1.5% would increase net aid by estimated 15% while still maintaining platform sustainability.

Voting Results:
- FOR: 12,450 weight (75%)
- AGAINST: 3,200 weight (19%)
- ABSTAIN: 890 weight (6%)
- Quorum: 16,540 / 5,000 (331% ✓)

Status: SUCCEEDED → Waiting execution delay

### Example 2: Treasury Allocation
**Allocate $50K for Health Mesh Development**

Type: Treasury Allocation
Proposer: 0xabcd...ef01 (Rep: 84)
Description:
> Fund development of Health Mesh modules for Q1 2026:
> - Vitals Dashboard ($15K, 4 weeks)
> - Medication Tracker ($12K, 3 weeks)
> - Guardian Node health monitoring ($18K, 5 weeks)
> - Emergency protocol system ($5K, 2 weeks)
>
> Deliverables: Working prototypes, smart contract audits, documentation
> Team: 2 full-stack devs, 1 solidity dev, 1 UX designer

Voting Results:
- FOR: 18,900 weight (78%)
- AGAINST: 4,100 weight (17%)
- ABSTAIN: 1,200 weight (5%)
- Quorum: 24,200 / 5,000 (484% ✓)

Status: SUCCEEDED → Executed → $50K transferred

### Example 3: Guardian Management
**Add New Guardian Node: Dr. Sarah Chen**

Type: Guardian Management
Proposer: 0x9876...5432 (Rep: 88)
Description:
> Dr. Sarah Chen has 15 years emergency medicine experience, specializes in triage protocols and crisis response. She has:
> - Reputation: 92 (top 2% of platform)
> - Active member for 2+ years
> - Created 8 successful governance proposals
> - Contributed $12K to Memorial Fund
> - Helped 23 families in crisis
> - Endorsed by 5 existing Guardians
>
> Will focus on Health Mesh governance, medical crisis protocols, and Guardian Node health monitoring oversight.

Voting Results:
- FOR: 21,300 weight (85%)
- AGAINST: 2,800 weight (11%)
- ABSTAIN: 1,500 weight (6%)
- Quorum: 25,600 / 5,000 (512% ✓)

Status: SUCCEEDED → Executed → Guardian role granted

---

## Future Enhancements

### Delegation
**Assign your voting power to trusted representatives.**

- Vote on every proposal yourself (time-consuming)
- OR delegate to someone you trust
- Can revoke delegation anytime
- Delegated votes count toward your participation

### Snapshot Voting
**Gasless voting via off-chain signatures.**

Current: On-chain votes cost gas (transaction fees)
Future: Sign vote message off-chain, submit to snapshot
- Free to vote (no gas)
- Results tallied off-chain
- Final execution on-chain

### Multi-Sig Treasury
**Require multiple Guardian approvals for large allocations.**

Current: Governance vote → Automatic execution
Future: Governance vote → Guardian multi-sig → Execution
- Adds extra security layer
- Prevents malicious proposals slipping through
- Requires 3/5 Guardian signatures for >$25K

### Mesh-Based Voting
**Weight by mesh position, not just reputation.**

Ideas:
- Bridge vertices get bonus weight (connect clusters)
- Hub vertices penalized (single points of failure)
- Isolated vertices require K₄ formation to vote
- Cluster voting (entire mesh votes together)

### Conviction Voting
**Vote weight increases the longer you maintain position.**

Current: All votes same weight regardless of timing
Future: Weight increases over time if you don't change vote
- Vote early with conviction → More weight
- Last-minute voters → Less weight
- Prevents swing voting manipulation

---

## Get Involved

### Start Voting
**Your voice matters, regardless of reputation.**

- Browse active proposals: `/governance`
- Read descriptions, check voting status
- Cast your vote (FOR/AGAINST/ABSTAIN)
- Earn +0.5 reputation per vote

### Create Proposals
**Need 25+ reputation to propose.**

Ways to earn reputation:
- Vote on proposals (+0.5 each)
- Contribute to Memorial Fund (+1-5)
- Form tetrahedrons (+2)
- Help community members (+1-3)
- Submit bug reports (+2-5)

### Form Tetrahedrons
**4x voting power when voting as K₄.**

- Find 3 other members
- Coordinate voting strategy
- All 4 vote same way
- Get 4x multiplier

### Become Guardian
**High bar, but path is clear.**

Requirements:
- Reputation ≥ 80 (achievable through consistent participation)
- Active for 6+ months
- Specialized expertise
- Community endorsements

Path:
1. Participate actively (vote, propose, contribute)
2. Build reputation organically
3. Develop expertise in domain (health, security, etc.)
4. Get community endorsements
5. Create self-nomination proposal

---

⚡ **G.O.D. GOVERNANCE** ⚡

⚡ **BY THE MESH, FOR THE MESH** ⚡

⚡ **TETRAHEDRON-WEIGHTED • REPUTATION-BASED • GUARDIAN-PROTECTED** ⚡
