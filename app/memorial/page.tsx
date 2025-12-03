'use client';

import { useState } from 'react';
import { Heart, TrendingUp, Users, AlertCircle, CheckCircle2, Clock, DollarSign, Zap } from 'lucide-react';

interface MemorialCampaign {
  id: string;
  name: string;
  age: number;
  situation: string;
  need: string;
  amount: number;
  raised: number;
  contributors: number;
  meshSize: number;
  timeRemaining: string;
  status: 'active' | 'funded' | 'closed';
  domain: 'education' | 'health' | 'coparenting';
  breakdown: {
    item: string;
    cost: number;
  }[];
  impact: string;
}

export default function MemorialFundPage() {
  const [campaigns] = useState<MemorialCampaign[]>([
    {
      id: '1',
      name: 'Alex',
      age: 13,
      situation: '8th grade student falling behind despite interventions. School suspects dyslexia + ADHD but needs formal diagnosis for IEP eligibility.',
      need: 'Neuropsychological Evaluation',
      amount: 3000,
      raised: 2845,
      contributors: 38,
      meshSize: 50,
      timeRemaining: '18 hours',
      status: 'active',
      domain: 'education',
      breakdown: [
        { item: 'Neuropsych testing', cost: 2500 },
        { item: 'Follow-up recommendations report', cost: 300 },
        { item: 'Parent consultation', cost: 200 }
      ],
      impact: 'Diagnosis → IEP → Accommodations → Evidence-based interventions → Alex reading at grade level within 6 months'
    },
    {
      id: '2',
      name: 'Jordan',
      age: 11,
      situation: '6th grader with ADHD (medicated) still struggling with focus. Teacher reports shirt-chewing, restless during seated work, cuticle-picking until bleeding.',
      need: 'OT Evaluation + Sensory Regulation Kit',
      amount: 500,
      raised: 520,
      contributors: 28,
      meshSize: 50,
      timeRemaining: 'FUNDED',
      status: 'funded',
      domain: 'education',
      breakdown: [
        { item: 'Occupational therapy evaluation', cost: 300 },
        { item: 'Sensory regulation starter kit', cost: 200 }
      ],
      impact: 'OT eval identified proprioceptive + oral seeking needs. Sensory diet implemented. 2 weeks later: Shirt-chewing stopped (has chew necklace), cuticle-picking 80% reduced (has putty). Teacher: "Like a different kid."'
    },
    {
      id: '3',
      name: 'Maya',
      age: 16,
      situation: 'High school junior, gifted + ADHD (twice-exceptional). Brilliant at abstract thinking, fails due to executive function struggles. Internalizing: "I\'m broken."',
      need: 'ADHD Coaching (12 sessions)',
      amount: 1800,
      raised: 945,
      contributors: 19,
      meshSize: 50,
      timeRemaining: '4 days',
      status: 'active',
      domain: 'education',
      breakdown: [
        { item: '12 ADHD coaching sessions', cost: 150 },
        { item: 'Executive function tools/materials', cost: 150 }
      ],
      impact: 'Coaching teaches: Digital planner systems, Pomodoro technique, dopamine management, body-doubling strategies. Maya learns her brain isn\'t broken - just needs different infrastructure.'
    }
  ]);

  const [selectedCampaign, setSelectedCampaign] = useState<MemorialCampaign | null>(null);
  const [contributionAmount, setContributionAmount] = useState<number>(50);

  const CampaignCard = ({ campaign }: { campaign: MemorialCampaign }) => {
    const percentFunded = (campaign.raised / campaign.amount) * 100;
    const avgContribution = Math.round(campaign.raised / campaign.contributors);

    return (
      <div 
        className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-purple-500 transition-all cursor-pointer"
        onClick={() => setSelectedCampaign(campaign)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              {campaign.name}, {campaign.age}
              {campaign.status === 'funded' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
            </h3>
            <div className="text-sm text-slate-400 mt-1">
              {campaign.domain === 'education' && '📚 Education'}
              {campaign.domain === 'health' && '🏥 Health'}
              {campaign.domain === 'coparenting' && '👨‍👩‍👧‍👦 Co-parenting'}
            </div>
          </div>
          <div className="text-right">
            {campaign.status === 'active' && (
              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                <Clock className="w-4 h-4" />
                {campaign.timeRemaining}
              </div>
            )}
            {campaign.status === 'funded' && (
              <div className="bg-green-900/30 border border-green-700 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                FUNDED
              </div>
            )}
          </div>
        </div>

        {/* Situation */}
        <div className="mb-4">
          <div className="text-sm font-semibold text-slate-300 mb-2">Situation</div>
          <p className="text-slate-400 text-sm">{campaign.situation}</p>
        </div>

        {/* Need */}
        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg">
          <div className="text-sm font-semibold text-blue-300 mb-1">Need</div>
          <div className="text-white font-bold">{campaign.need}</div>
          <div className="text-2xl font-bold text-blue-400 mt-2">${campaign.amount.toLocaleString()}</div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-400">Progress</span>
            <span className="font-bold text-white">${campaign.raised.toLocaleString()} raised</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
            <div 
              className={`h-3 rounded-full ${
                percentFunded >= 100 ? 'bg-green-500' :
                percentFunded >= 75 ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}
              style={{ width: `${Math.min(percentFunded, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-slate-500">
            {percentFunded >= 100 ? '100%' : `${Math.round(percentFunded)}%`} funded
          </div>
        </div>

        {/* Contributors */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Users className="w-4 h-4" />
            <span>{campaign.contributors} contributors</span>
          </div>
          <div className="text-slate-400">
            Avg: ${avgContribution}
          </div>
        </div>

        {/* Mesh Info */}
        <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span>{campaign.meshSize}-person education tetrahedron mesh</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
            Memorial Fund
          </h1>
          <p className="text-xl text-slate-300 mb-2">
            Mutual aid infrastructure for education, health, and family crises
          </p>
          <p className="text-slate-400">
            When your mesh detects a crisis you can't afford, 50 people contribute $10-$100 each.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="text-3xl font-bold text-green-400">$127K</div>
            <div className="text-sm text-slate-400">Total Distributed</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="text-3xl font-bold text-blue-400">42</div>
            <div className="text-sm text-slate-400">Families Supported</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="text-3xl font-bold text-purple-400">1,247</div>
            <div className="text-sm text-slate-400">Total Contributors</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="text-3xl font-bold text-yellow-400">48hrs</div>
            <div className="text-sm text-slate-400">Avg Time to Fund</div>
          </div>
        </div>

        {/* Active Campaigns */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Active Campaigns</h2>
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {campaigns.filter(c => c.status === 'active').map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">Recently Funded</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {campaigns.filter(c => c.status === 'funded').map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500" />
            How Memorial Fund Works
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-white mb-3">When Crisis Detected</h4>
              <ol className="space-y-3 text-slate-300 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                  <div>
                    <strong className="text-white">Guardian Node detects crisis:</strong> Neuropsych eval needed, family can't afford, student falling behind.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                  <div>
                    <strong className="text-white">Automatic campaign creation:</strong> Need + amount + breakdown + impact. Transparent.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                  <div>
                    <strong className="text-white">50-person mesh notified:</strong> All vertices in education tetrahedron see campaign.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
                  <div>
                    <strong className="text-white">Contributions flow:</strong> $30-$100 per person. Progress bar updates live.
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-3">After Funding</h4>
              <ol className="space-y-3 text-slate-300 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">5</div>
                  <div>
                    <strong className="text-white">Direct payment:</strong> Funds released to provider (neuropsychologist, OT, etc). Family never sees money (no shame, no debt).
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">6</div>
                  <div>
                    <strong className="text-white">Service delivered:</strong> Eval scheduled within 1 week. Diagnosis within 2 weeks. IEP within 30 days.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">7</div>
                  <div>
                    <strong className="text-white">Impact tracked:</strong> 6 months later: "Alex reading at grade level. Says 'I'm not stupid, my brain just works different.'"
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">8</div>
                  <div>
                    <strong className="text-white">Regenerative:</strong> Contributors see impact. Mesh strengthens. System heals itself.
                  </div>
                </li>
              </ol>
            </div>
          </div>

          <div className="mt-8 p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-green-400 mb-1">This is Regenerative, Not Extractive</div>
                <p className="text-sm text-slate-300">
                  No platform takes a cut (2% goes to infrastructure only). No interest. No debt. No shame. 
                  When you help someone's kid get diagnosed, 6 months later someone helps yours get tutoring. 
                  <strong className="text-white"> The mesh remembers. The system heals itself.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Detail Modal */}
        {selectedCampaign && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50" onClick={() => setSelectedCampaign(null)}>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white">{selectedCampaign.name}, {selectedCampaign.age}</h2>
                  <div className="text-slate-400 mt-1">{selectedCampaign.need}</div>
                </div>
                <button 
                  onClick={() => setSelectedCampaign(null)}
                  className="text-slate-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Full Situation */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-2">Situation</h3>
                <p className="text-slate-300">{selectedCampaign.situation}</p>
              </div>

              {/* Breakdown */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3">Cost Breakdown</h3>
                <div className="space-y-2">
                  {selectedCampaign.breakdown.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                      <span className="text-slate-300">{item.item}</span>
                      <span className="font-bold text-white">${item.cost.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-3 bg-blue-900/30 border border-blue-700 rounded-lg font-bold">
                    <span className="text-white">Total Need</span>
                    <span className="text-blue-400 text-xl">${selectedCampaign.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Impact */}
              <div className="mb-6 p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
                <h3 className="text-lg font-bold text-green-400 mb-2">Expected Impact</h3>
                <p className="text-slate-300 text-sm">{selectedCampaign.impact}</p>
              </div>

              {/* Contribution Form */}
              {selectedCampaign.status === 'active' && (
                <div className="p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700 rounded-xl">
                  <h3 className="text-lg font-bold text-white mb-4">Contribute to {selectedCampaign.name}&apos;s Campaign</h3>
                  
                  <div className="mb-4">
                    <label className="text-sm text-slate-300 mb-2 block">Your Contribution</label>
                    <div className="flex gap-3 mb-3">
                      {[30, 50, 100, 150].map(amount => (
                        <button
                          key={amount}
                          onClick={() => setContributionAmount(amount)}
                          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                            contributionAmount === amount
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white"
                      placeholder="Custom amount"
                    />
                  </div>

                  <div className="mb-4 text-sm text-slate-400">
                    <div className="flex items-center justify-between mb-1">
                      <span>Your contribution:</span>
                      <span className="text-white font-bold">${contributionAmount}</span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span>Platform fee (2%):</span>
                      <span className="text-white">${(contributionAmount * 0.02).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-700 font-bold">
                      <span className="text-white">Total charge:</span>
                      <span className="text-blue-400">${(contributionAmount * 1.02).toFixed(2)}</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-blue-500 hover:to-purple-500 transition-all">
                    Contribute ${contributionAmount}
                  </button>

                  <p className="text-xs text-slate-500 mt-3 text-center">
                    Funds released directly to provider. {selectedCampaign.name}'s family never sees money. No debt. No shame.
                  </p>
                </div>
              )}

              {selectedCampaign.status === 'funded' && (
                <div className="p-6 bg-green-900/20 border border-green-700 rounded-xl">
                  <div className="flex items-center gap-3 text-green-400 font-bold text-lg mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                    Campaign Fully Funded
                  </div>
                  <p className="text-slate-300 text-sm">
                    Thank you to all {selectedCampaign.contributors} contributors. Funds have been released to the provider.
                  </p>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
