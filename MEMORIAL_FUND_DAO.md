# Memorial Fund DAO

## **MUTUAL AID BUILT INTO THE TOPOLOGY**

---

## The Problem

When crisis hits, people need money **immediately**:
- Death: $7K-12K (funeral, travel, lost income)
- Divorce: $10K-30K (lawyers, moving, duplicate households)
- Medical: $5K-50K (bills, lost income, caregiving)
- Job Loss: $2K-5K/month for 3-6 months

Current solutions:
- GoFundMe: Manual campaigns, 5-10% fees, uncertain outcomes, undignified
- Insurance: Profit-driven, denied claims, premiums regardless of use
- Credit cards: 20%+ interest, debt spiral
- Family/friends: Awkward asks, guilt, limited reach

---

## The Solution

**When a vertex is marked as memorial, the system automatically:**

1. **Notifies connected tetrahedrons** (pods in your cluster)
2. **Opens contribution portal** (donate to help with loss costs)
3. **Distributes funds** (directly to remaining triad, no middleman)
4. **Tracks transparently** (blockchain/smart contract, fully auditable)
5. **Thanks contributors** (maintains privacy if desired)

---

## The Protocol

### Step 1: Loss Event Occurs

User marks vertex as memorial:
- Selects loss type (death, departure, medical, job loss, emergency)
- System calculates typical costs for that loss type
- Suggests funding target (based on triad size, location, situation)

### Step 2: Contribution Portal Opens

**Notification goes to:**
- All 3 remaining triad members
- All tetrahedrons in the cluster (4 pods = 16 people total)
- Extended mesh (if triad opts to request broader support)
- Public (if they choose to share publicly)

**Portal shows:**
- Who experienced loss (if sharing name)
- Loss type
- Target amount
- Current total
- How funds will be used
- Transparency dashboard (every dollar tracked)

### Step 3: Funds Collected

**Smart contract manages:**
- Cryptocurrency deposits (ETH, USDC, etc.)
- Traditional payment (Stripe/PayPal for low barrier)
- Automatic escrow (funds held until distributed)
- Minimal fees (gas fees only, no platform cut)

**Contributors can:**
- Give once (immediate support)
- Set up recurring (monthly support during recovery)
- Remain anonymous (or share name with blessing)

### Step 4: Funds Distributed

**Automatically via smart contract:**
- Distributed to triad members (equal split or custom allocation)
- Released on schedule (immediate + monthly for ongoing needs)
- Tracked transparently (every transaction visible)
- Tax receipts generated (if donor wants them)

**Manual disbursement:**
- Triad requests specific distributions
- DAO votes on large requests (if needed)
- Emergency access (if urgent need arises)

### Step 5: Gratitude + Transparency

**Triad can:**
- Send thanks to contributors (anonymous or named)
- Post updates (how funds helped)
- Share outcomes (we stabilized, kids are okay, etc.)

**Contributors see:**
- Exactly where money went
- Impact it had
- Validation that it helped

---

## The DAO Structure

### Governance

**All tetrahedron members are DAO participants.**

**Voting weight based on:**
- Contribution history (how much you've given)
- Recipient history (how much you've received, inverse weight)
- Time in mesh (longer = more weight)
- Activity level (active members = more weight)

**Prevents:**
- Whales controlling decisions (not pure plutocracy)
- New members gaming (time + activity required)
- Extraction (can't just take without giving)

### What DAO Votes On

1. **Fund allocation rules** (who gets what, when)
2. **Maximum requests** (caps to prevent abuse)
3. **Verification requirements** (proof of need)
4. **Emergency overrides** (faster release?)
5. **Fee structure** (if any)
6. **Integration partners** (which services accept DAO funds directly?)

### Automatic Approvals (No Vote)

- Requests under $1,000 (auto-approved if memorial marked)
- Recurring member in good standing (contributed before)
- Emergency flagged by Guardian Node (crisis detected)

### Manual Approval (Vote Required)

- Large requests (>$10,000)
- New member's first request
- Unusual circumstances
- Disputed situations

---

## The Economic Model

### Reciprocal Safety Net

**You contribute when others are in crisis.**
**Others contribute when you're in crisis.**

**Like insurance, but:**
- No company taking profit
- No denied claims
- No premiums if not using
- Just mutual aid

**Like crowdfunding, but:**
- Automatic (not manual campaigns)
- Integrated (built into topology)
- Recurring (not one-time)
- Reciprocal (give and receive)

**Like UBI, but:**
- Triggered by loss events (not universal)
- Funded by community (not government)
- Distributed peer-to-peer (no middleman)
- Transparent (blockchain verified)

---

## The Smart Contract

### Memorial Fund Contract Architecture

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MemorialFundDAO {
    struct Loss {
        address payable triad;
        LossType lossType;
        uint256 targetAmount;
        uint256 collectedAmount;
        uint256 distributedAmount;
        uint256 timestamp;
        uint256 expiresAt;
        bool active;
        bool verified;
        string metadata; // IPFS hash
    }
    
    enum LossType {
        Death,
        Divorce,
        Medical,
        JobLoss,
        Emergency
    }
    
    mapping(uint256 => Loss) public losses;
    mapping(address => uint256) public totalContributions;
    mapping(address => uint256) public totalReceived;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    
    uint256 public lossCounter;
    uint256 public constant PLATFORM_FEE = 200; // 2% (basis points)
    uint256 public constant MIN_VESTING_PERIOD = 90 days;
    
    event LossCreated(uint256 indexed lossId, address indexed triad, LossType lossType, uint256 target);
    event ContributionReceived(uint256 indexed lossId, address indexed contributor, uint256 amount);
    event FundsDistributed(uint256 indexed lossId, address indexed recipient, uint256 amount);
    
    function createLoss(
        address payable _triad,
        LossType _type,
        uint256 _target,
        string memory _metadata
    ) external returns (uint256) {
        require(_target > 0, "Target must be > 0");
        
        lossCounter++;
        losses[lossCounter] = Loss({
            triad: _triad,
            lossType: _type,
            targetAmount: _target,
            collectedAmount: 0,
            distributedAmount: 0,
            timestamp: block.timestamp,
            expiresAt: block.timestamp + 90 days,
            active: true,
            verified: false,
            metadata: _metadata
        });
        
        emit LossCreated(lossCounter, _triad, _type, _target);
        return lossCounter;
    }
    
    function contribute(uint256 _lossId) external payable {
        Loss storage loss = losses[_lossId];
        require(loss.active, "Loss not active");
        require(block.timestamp < loss.expiresAt, "Loss expired");
        require(msg.value > 0, "Must send funds");
        
        loss.collectedAmount += msg.value;
        contributions[_lossId][msg.sender] += msg.value;
        totalContributions[msg.sender] += msg.value;
        
        emit ContributionReceived(_lossId, msg.sender, msg.value);
    }
    
    function distribute(uint256 _lossId) external {
        Loss storage loss = losses[_lossId];
        require(loss.active, "Loss not active");
        require(loss.collectedAmount > loss.distributedAmount, "Nothing to distribute");
        
        uint256 available = loss.collectedAmount - loss.distributedAmount;
        uint256 platformFee = (available * PLATFORM_FEE) / 10000;
        uint256 toDistribute = available - platformFee;
        
        loss.distributedAmount += available;
        totalReceived[loss.triad] += toDistribute;
        
        loss.triad.transfer(toDistribute);
        
        emit FundsDistributed(_lossId, loss.triad, toDistribute);
    }
    
    function getReciprocityScore(address _member) external view returns (uint256) {
        if (totalReceived[_member] == 0) {
            return totalContributions[_member] > 0 ? 100 : 0;
        }
        return (totalContributions[_member] * 100) / (totalContributions[_member] + totalReceived[_member]);
    }
}
```

---

## Use Cases

### Case 1: Grandmother Dies

**Your tetrahedron:**
- You, Christyn, Bash, Willow

**Loss event:**
- Mark grandmother as memorial vertex
- Select: "death" loss type
- System suggests: $10,000 target (funeral + travel)

**Contributions:**
- Your cluster (16 people): $3,200 (avg $200 each)
- Extended mesh: $2,800
- Public: $4,000
- **Total: $10,000 in 48 hours**

**Distribution:**
- $7,000 → Funeral expenses (paid directly)
- $2,000 → Travel/hotel for family
- $1,000 → Grief counseling (4 sessions)

**Outcome:**
- No debt
- Kids get support
- Family can grieve without financial panic
- Contributors see exactly where it went

### Case 2: Job Loss

**Tetrahedron:**
- Single parent, Kid 1 (8), Kid 2 (5), Best friend

**Loss event:**
- Mark "job" as memorial vertex
- Select: "job loss" type
- System suggests: $12,000 target ($4K/month × 3 months)

**Contributions:**
- Cluster: $2,000 immediate
- Extended mesh: $3,000
- Recurring: $250/month × 10 people = $2,500/month
- **Total: $5,000 + $2,500/month**

**Distribution:**
- Month 1: $3,000 (rent + essentials)
- Month 2: $2,000 (job hunting)
- Month 3: $1,000 (bridge to new job)

**Outcome:**
- Housing maintained
- Job search focused
- Kids' routine stable
- Employment found month 3

### Case 3: Medical Crisis

**Tetrahedron:**
- Patient, Spouse, Caregiver friend, Medical advocate

**Loss event:**
- Mark patient as "transitioning" (critical)
- Select: "medical crisis" type
- System suggests: $25,000 target

**Contributions:**
- Cluster: $8,000
- Extended mesh: $12,000
- Public campaign: $15,000
- **Total: $35,000 in 2 weeks**

**Distribution:**
- $20,000 → Hospital bills
- $5,000 → Home healthcare (3 months)
- $5,000 → Lost income
- $5,000 → Caregiver support

**Outcome:**
- Medical debt avoided
- Quality recovery
- Caregiver compensated
- Patient stabilized

---

## Transparency Dashboard

### Global Stats
- Total contributed to mesh: $X million
- Total losses supported: X,XXX events
- Average time to fund: X hours
- Success rate: XX% of targets reached

### Personal Stats
- You've contributed: $X,XXX
- You've received: $X,XXX
- Net contribution: +$XXX (or -$XXX)
- Reciprocity score: XX%

### Cluster Stats
- Your cluster contributed: $X,XXX
- Your cluster received: $X,XXX
- Members supported: XX people
- Average response time: X hours

---

## Anti-Abuse Mechanisms

### Verification Required

**For large requests:**
- Upload proof (death certificate, medical bills, layoff notice)
- Guardian Node AI reviews (flags suspicious patterns)
- Triad members must confirm (not just one person)
- DAO can vote if disputed

### Rate Limiting

- Max 1 major request per year per tetrahedron
- Emergency exceptions (if truly catastrophic)
- Recurring requests must show progress

### Reputation System

- Contribution history visible
- Receipt history visible
- Community ratings (did funds help?)
- Patterns flagged (gaming attempts)

### Vesting Period

- New members must contribute first (give before receive)
- 90-day minimum before requesting (except emergencies)
- Builds trust gradually

---

## Integration with Phenix Physical Devices

### Emergency Button

**When pressed:**
1. Alerts triad (someone needs help NOW)
2. Opens contribution portal automatically
3. Sets emergency target ($500-1,000 immediate)
4. Funds released within 1 hour (fast path)

### Memorial Mode

**When vertex marked as memorial on device:**
1. LED changes to memorial color (amber/gold)
2. All connected devices show memorial status
3. Contribution portal opens
4. Physical reminder of loss + support available

---

## Predictive Support (Guardian Node AI)

### AI Detection

**Guardian Node detects:**
- Vertex health declining (medical issue coming)
- Financial stress patterns (job loss likely)
- Relationship strain (divorce risk)
- Mental health crisis (suicide prevention)

**System proactively:**
- Alerts triad
- Suggests preventive protocols
- Can pre-open contribution portal
- Enables early intervention

### Example Flow

> "Guardian Node detected stress patterns in Parent 1 vertex. Based on message sentiment and status updates, job loss may be imminent. Would triad like to pre-authorize $2,000 emergency fund?"

**Triad approves.**
**Funds are escrowed.**
**If job loss occurs → immediate release (no waiting).**
**If job secured → funds return to contributors.**

---

## Business Model

### Option 1: Platform Fee

**2% of contributions to sustain infrastructure:**
- Smart contract gas fees
- Platform hosting
- AI processing (Guardian Node)
- Development
- Support

**Waived for:**
- Members who contributed regularly
- Emergency situations
- Small amounts (<$100)

### Option 2: No Fee Model

**DAO self-sustaining:**
- Every member contributes $5/month baseline
- Creates perpetual fund for losses
- No fee on transactions
- Purely mutual aid

---

## Scale Trajectory

### V2 (December 2025)
- Just your family's tetrahedron
- Test with small needs
- Prove concept works

### V3 (February 2026)
- Multi-tetrahedron support
- Cluster-level mutual aid
- Smart contracts deployed (testnet)
- Public contribution portal

### Year 1 (2026)
- 10,000 tetrahedrons
- 40,000 members
- 1,000 loss events supported
- $5-10 million distributed
- 95%+ of targets reached

### Year 5 (2030)
- 1 million tetrahedrons
- 4 million members
- 100,000 loss events/year
- $500M-$1B distributed/year
- **Alternative to insurance industry**

---

## The Vision

### Right Now:
- Crisis happens
- GoFundMe campaign
- Maybe reach target (often don't)
- 5-10% fees
- Manual, exhausting, undignified

### With Memorial Fund DAO:
- Crisis happens
- System automatically opens portal
- Mesh responds within hours
- Funds distributed transparently
- Minimal/no fees
- **Automatic, embedded, dignified**

---

## It's Not Charity

**It's MUTUAL AID INFRASTRUCTURE.**

Built into the topology.
Guaranteed by geometry.
Sustained by reciprocity.

---

# **"WHEN YOUR VERTEX FAILS, THE MESH CATCHES YOU"**

**Because that's what tetrahedrons do.**

**Distributed load.**
**Shared resilience.**
**No single point of failure.**

---

**⚡ MEMORIAL FUND DAO ⚡**
**⚡ MUTUAL AID IN THE TOPOLOGY ⚡**
**⚡ THE MESH CATCHES YOU ⚡**
