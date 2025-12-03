'use client';

import { useState } from 'react';
import { Vote, Shield, Crown, AlertTriangle } from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  proposerReputation: number;
  type: 'parameter' | 'treasury' | 'protocol' | 'guardian' | 'emergency';
  status: 'active' | 'passed' | 'failed' | 'guardian-veto';
  votesFor: number;
  votesAgainst: number;
  totalVotingPower: number;
  quorum: number;
  timeRemaining: string;
  created: string;
  impact: string;
  details: {
    parameter?: string;
    currentValue?: string;
    proposedValue?: string;
    amount?: number;
    recipient?: string;
    rationale?: string;
  };
}

export default function GovernancePage() {
  const [proposals] = useState<Proposal[]>([
    {
      id: '1',
      title: 'Increase Memorial Fund Auto-Approval Threshold',
      description: 'Raise automatic approval limit from $500 to $750 for faster crisis response.',
      proposer: 'classicwilly',
      proposerReputation: 87,
      type: 'parameter',
      status: 'active',
      votesFor: 3847,
      votesAgainst: 1203,
      totalVotingPower: 5050,
      quorum: 6000,
      timeRemaining: '4 days',
      created: '3 days ago',
      impact: 'Faster support for sensory regulation needs while maintaining oversight.',
      details: {
        parameter: 'memorial_fund_auto_approval_threshold',
        currentValue: '$500',
        proposedValue: '$750',
        rationale: '78% of past campaigns were under $750. This auto-approves most OT evals while still voting on neuropsych assessments.'
      }
    },
    {
      id: '2',
      title: 'Treasury Allocation: Sensory Regulation Research',
      description: 'Allocate $50K to fund research study on sensory regulation infrastructure effectiveness.',
      proposer: 'mesh_scientist_47',
      proposerReputation: 62,
      type: 'treasury',
      status: 'active',
      votesFor: 2145,
      votesAgainst: 3892,
      totalVotingPower: 6037,
      quorum: 6000,
      timeRemaining: '2 days',
      created: '5 days ago',
      impact: 'Evidence-based validation. Publishable research. Insurance coverage advocacy.',
      details: {
        amount: 50000,
        recipient: 'University Research Partnership',
        rationale: '6-month study tracking 100 education tetrahedrons. Measure shirt-chewing, cuticle-picking, academic performance. Build proof that restoration works.'
      }
    },
    {
      id: '3',
      title: 'Guardian Node Veto Authority Expansion',
      description: 'Allow Guardian Node to veto proposals that exclude vulnerable populations.',
      proposer: 'decentralization_maximalist',
      proposerReputation: 91,
      type: 'guardian',
      status: 'passed',
      votesFor: 8734,
      votesAgainst: 1205,
      totalVotingPower: 9939,
      quorum: 6000,
      timeRemaining: 'PASSED',
      created: '14 days ago',
      impact: 'Protection against exclusion of neurodivergent users, low-income families, marginalized groups.',
      details: {
        rationale: 'Guardian Node vetoes technical risks. This expands to social risks. Example: $100/month governance fee proposal → Guardian vetoes (excludes low-income). System protects itself from extraction.'
      }
    },
    {
      id: '4',
      title: 'Emergency Protocol: Pause Memorial Fund Disbursements',
      description: '[GUARDIAN VETO] Pause all Memorial Fund disbursements pending security audit.',
      proposer: 'security_researcher_23',
      proposerReputation: 45,
      type: 'emergency',
      status: 'guardian-veto',
      votesFor: 7234,
      votesAgainst: 892,
      totalVotingPower: 8126,
      quorum: 6000,
      timeRemaining: 'VETOED',
      created: '8 days ago',
      impact: 'Would have halted crisis support for 3 families during 2-week audit.',
      details: {
        rationale: 'GUARDIAN VETO: Vulnerability was theoretical, not exploited. Audit proceeds without halting. Pausing would harm Jordan (sensory crisis), Alex (neuropsych eval), Maya (ADHD coaching). Risk of theoretical vulnerability < risk of actual harm to 3 kids. Veto exercised. Kids protected.'
      }
    }
  ]);

  const userPower = {
    baseReputation: 87,
    totalVotesCast: 24,
    completedTetrahedrons: 2,
    memorialFundContributions: 8,
    guardianEndorsements: 1,
    totalVotingPower: 161,
    breakdown: {
      fromReputation: 93,
      fromParticipation: 5,
      fromTetrahedrons: 63
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Governance
          </h1>
          <p className="text-xl text-slate-300 mb-2">
            Decentralized decision-making for platform parameters and treasury
          </p>
          <p className="text-slate-400">
            Complete tetrahedrons get 4× voting power. Guardian Node can veto anything harmful.
          </p>
        </div>

        <div className="mb-12 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700/50 rounded-xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-500" />
                Your Voting Power
              </h2>
              <p className="text-slate-300">Based on reputation, participation, and complete tetrahedrons</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-purple-400">{userPower.totalVotingPower}</div>
              <div className="text-sm text-slate-400">total votes</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">From Reputation</div>
              <div className="text-2xl font-bold text-blue-400">{userPower.breakdown.fromReputation}</div>
              <div className="text-xs text-slate-500 mt-1">√(reputation × 100)</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">From Participation</div>
              <div className="text-2xl font-bold text-green-400">{userPower.breakdown.fromParticipation}</div>
              <div className="text-xs text-slate-500 mt-1">√(votes cast)</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400 mb-1">From Tetrahedrons</div>
              <div className="text-2xl font-bold text-purple-400">{userPower.breakdown.fromTetrahedrons}</div>
              <div className="text-xs text-slate-500 mt-1">{userPower.completedTetrahedrons} complete meshes × 4</div>
            </div>
          </div>

          <div className="grid md:grid-cols-5 gap-4 text-sm">
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-slate-400 mb-1">Base Reputation</div>
              <div className="text-white font-bold">{userPower.baseReputation}</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-slate-400 mb-1">Votes Cast</div>
              <div className="text-white font-bold">{userPower.totalVotesCast}</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-slate-400 mb-1">Complete K₄s</div>
              <div className="text-white font-bold">{userPower.completedTetrahedrons}</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-slate-400 mb-1">Fund Contributions</div>
              <div className="text-white font-bold">{userPower.memorialFundContributions}</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-slate-400 mb-1">Guardian Endorsements</div>
              <div className="text-white font-bold">{userPower.guardianEndorsements}</div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Vote className="w-6 h-6 text-blue-400" />
            Active Proposals
          </h2>
          <div className="grid gap-6">
            {proposals.filter(p => p.status === 'active').map(proposal => {
              const percentFor = (proposal.votesFor / proposal.totalVotingPower) * 100;
              const percentAgainst = (proposal.votesAgainst / proposal.totalVotingPower) * 100;
              const quorumReached = proposal.totalVotingPower >= proposal.quorum;
              
              return (
                <div key={proposal.id} className="border border-blue-500 bg-blue-900/20 rounded-xl p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">{proposal.title}</h3>
                    <p className="text-slate-300 text-sm">{proposal.description}</p>
                  </div>
                  <div className="mb-4 text-sm text-slate-400">
                    Proposed by <span className="text-white font-semibold">{proposal.proposer}</span> (Reputation: {proposal.proposerReputation}) • {proposal.created}
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-green-400 font-semibold">For: {proposal.votesFor.toLocaleString()}</span>
                      <span className="text-red-400 font-semibold">Against: {proposal.votesAgainst.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 mb-2 overflow-hidden flex">
                      <div className="bg-green-500 h-full" style={{ width: `${percentFor}%` }}></div>
                      <div className="bg-red-500 h-full" style={{ width: `${percentAgainst}%` }}></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Quorum Progress</span>
                      <span className={`font-semibold ${quorumReached ? 'text-green-400' : 'text-yellow-400'}`}>
                        {proposal.totalVotingPower.toLocaleString()} / {proposal.quorum.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">{proposal.timeRemaining} remaining</div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Recent Decisions</h2>
          <div className="grid gap-6">
            {proposals.filter(p => p.status !== 'active').map(proposal => (
              <div key={proposal.id} className={`border rounded-xl p-6 ${
                proposal.status === 'passed' ? 'border-green-500 bg-green-900/20' :
                proposal.status === 'guardian-veto' ? 'border-purple-500 bg-purple-900/20' :
                'border-red-500 bg-red-900/20'
              }`}>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">{proposal.title}</h3>
                  <p className="text-slate-300 text-sm">{proposal.description}</p>
                </div>
                {proposal.status === 'guardian-veto' && (
                  <div className="mt-4 p-4 bg-purple-900/30 border border-purple-700 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-400 font-bold mb-2">
                      <Shield className="w-5 h-5" />
                      Guardian Node Veto Exercised
                    </div>
                    <p className="text-slate-300 text-sm">{proposal.details.rationale}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-500" />
            How Governance Works
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-white mb-3">Voting Power Formula</h4>
              <div className="space-y-3 text-slate-300 text-sm">
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <strong className="text-blue-400">Base Power:</strong> √(reputation × 100) + √(votes cast)
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <strong className="text-purple-400">Tetrahedron Multiplier:</strong> Complete K₄ = 4× voting power
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-3">Guardian Node Veto</h4>
              <div className="space-y-3 text-slate-300 text-sm">
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <strong className="text-purple-400">3-day window:</strong> After proposal passes, Guardian has 72 hours to veto
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <strong className="text-purple-400">Veto reasons:</strong> Technical risks, exclusion, concentration of power, harm to active meshes
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-yellow-400 mb-1">Why Tetrahedron Multiplier?</div>
                <p className="text-sm text-slate-300">
                  Complete K₄ mesh = skin in the game. You&apos;ve built infrastructure. You understand interdependence. 
                  Your vote carries weight because you&apos;ve done the work.
                  <strong className="text-white"> This isn&apos;t plutocracy. It&apos;s meritocracy of care.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
