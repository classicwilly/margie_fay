'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, DollarSign, Users, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Loss {
  id: number;
  triad: string;
  lossType: 'Death' | 'Divorce' | 'Medical' | 'JobLoss' | 'Emergency';
  targetAmount: number;
  collectedAmount: number;
  status: 'Pending' | 'Active' | 'Funded' | 'Distributed';
  createdAt: Date;
  expiresAt: Date;
  metadataURI: string;
  emergency: boolean;
  contributors: number;
}

interface GlobalStats {
  totalLosses: number;
  activeLosses: number;
  totalCollected: number;
  totalDistributed: number;
  successRate: number;
}

export default function MemorialFundPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'my-contributions' | 'my-requests'>('active');
  const [selectedLoss, setSelectedLoss] = useState<Loss | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');

  // Mock data - will be replaced with smart contract calls
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalLosses: 0,
    activeLosses: 0,
    totalCollected: 0,
    totalDistributed: 0,
    successRate: 0
  });

  const [activeLosses, setActiveLosses] = useState<Loss[]>([]);

  const lossTypeColors = {
    Death: { bg: 'bg-amber-900/30', border: 'border-amber-500/50', text: 'text-amber-400' },
    Divorce: { bg: 'bg-purple-900/30', border: 'border-purple-500/50', text: 'text-purple-400' },
    Medical: { bg: 'bg-red-900/30', border: 'border-red-500/50', text: 'text-red-400' },
    JobLoss: { bg: 'bg-blue-900/30', border: 'border-blue-500/50', text: 'text-blue-400' },
    Emergency: { bg: 'bg-orange-900/30', border: 'border-orange-500/50', text: 'text-orange-400' }
  };

  const lossTypeEmoji = {
    Death: '🕊️',
    Divorce: '💔',
    Medical: '🏥',
    JobLoss: '💼',
    Emergency: '🚨'
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProgressPercentage = (collected: number, target: number) => {
    return Math.min((collected / target) * 100, 100);
  };

  const handleContribute = (loss: Loss) => {
    setSelectedLoss(loss);
  };

  const submitContribution = () => {
    // TODO: Call smart contract
    console.log('Contributing', contributionAmount, 'to loss', selectedLoss?.id);
    setSelectedLoss(null);
    setContributionAmount('');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="w-12 h-12 text-purple-400 animate-pulse" />
              <h1 className="text-5xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Memorial Fund DAO
              </h1>
            </div>
            <p className="text-xl text-slate-300 mb-2">
              When Your Vertex Fails, The Mesh Catches You
            </p>
            <p className="text-sm text-slate-500 mb-4">
              Mutual aid infrastructure • Built into the topology • Sustained by reciprocity
            </p>
            
            {/* Memorial Link */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-900/30 border border-cyan-500/30 rounded-lg">
              <span className="text-2xl">🐢</span>
              <Link href="/memorial/robyn" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                In Memory of Robyn Francis
              </Link>
              <span className="text-slate-500 text-sm">July 7, 2024</span>
            </div>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <div className="text-sm text-slate-400">Total Losses</div>
            </div>
            <div className="text-3xl font-bold text-white">{globalStats.totalLosses}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <div className="text-sm text-slate-400">Active Now</div>
            </div>
            <div className="text-3xl font-bold text-white">{globalStats.activeLosses}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <div className="text-sm text-slate-400">Total Distributed</div>
            </div>
            <div className="text-3xl font-bold text-white">
              {formatAmount(globalStats.totalDistributed)}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <div className="text-sm text-slate-400">Success Rate</div>
            </div>
            <div className="text-3xl font-bold text-white">{globalStats.successRate}%</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'active'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Losses
          </button>
          <button
            onClick={() => setActiveTab('my-contributions')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'my-contributions'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Contributions
          </button>
          <button
            onClick={() => setActiveTab('my-requests')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'my-requests'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Requests
          </button>
        </div>

        {/* Active Losses */}
        {activeTab === 'active' && (
          <div>
            {activeLosses.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Active Losses</h3>
                <p className="text-slate-400">The mesh is stable. Check back later.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {activeLosses.map((loss) => {
                  const colors = lossTypeColors[loss.lossType];
                  const emoji = lossTypeEmoji[loss.lossType];
                  const progress = getProgressPercentage(loss.collectedAmount, loss.targetAmount);

                  return (
                    <div
                      key={loss.id}
                      className={`bg-white/5 backdrop-blur-sm rounded-xl border ${colors.border} p-6 hover:bg-white/10 transition-all`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{emoji}</div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-white">
                                {loss.lossType} Support
                              </h3>
                              {loss.emergency && (
                                <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                                  EMERGENCY
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-slate-400">
                              Loss ID #{loss.id} • {loss.contributors} contributors
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${colors.text}`}>
                            {formatAmount(loss.collectedAmount)}
                          </div>
                          <div className="text-sm text-slate-400">
                            of {formatAmount(loss.targetAmount)} target
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colors.bg} transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                          <span>{Math.round(progress)}% funded</span>
                          <span>
                            Expires {new Date(loss.expiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleContribute(loss)}
                          className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all font-semibold"
                        >
                          Contribute
                        </button>
                        <button className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all">
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Create Loss Request */}
            <div className="mt-8 bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/50 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Need Support?</h3>
              <p className="text-slate-300 mb-6">
                If you&apos;ve experienced a loss, the mesh is here to catch you.
              </p>
              <button className="px-8 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all font-semibold">
                Create Loss Request
              </button>
            </div>
          </div>
        )}

        {/* My Contributions Tab */}
        {activeTab === 'my-contributions' && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold text-white mb-2">Your Contributions</h3>
            <p className="text-slate-400 mb-8">Connect wallet to view your contribution history</p>
            <button className="px-8 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all font-semibold">
              Connect Wallet
            </button>
          </div>
        )}

        {/* My Requests Tab */}
        {activeTab === 'my-requests' && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-white mb-2">Your Loss Requests</h3>
            <p className="text-slate-400 mb-8">Connect wallet to view your request history</p>
            <button className="px-8 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all font-semibold">
              Connect Wallet
            </button>
          </div>
        )}

        {/* Contribution Modal */}
        {selectedLoss && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-md w-full p-8">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">
                  {lossTypeEmoji[selectedLoss.lossType]}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Contribute to Loss #{selectedLoss.id}
                </h3>
                <p className="text-slate-400">
                  {selectedLoss.lossType} support fund
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-white mb-2 font-medium">
                  Contribution Amount (USD)
                </label>
                <input
                  type="number"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  placeholder="50"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
                <div className="flex gap-2 mt-2">
                  {[25, 50, 100, 250].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setContributionAmount(amount.toString())}
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm hover:bg-white/10 transition-all"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedLoss(null)}
                  className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={submitContribution}
                  disabled={!contributionAmount || parseFloat(contributionAmount) <= 0}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Contribute
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-br from-emerald-900/30 to-green-900/30 border border-green-500/50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-green-400 text-3xl mb-2">1️⃣</div>
              <h4 className="font-bold text-white mb-1">Loss Occurs</h4>
              <p className="text-slate-300">
                Member marks vertex as memorial. System calculates typical costs and suggests target amount.
              </p>
            </div>
            <div>
              <div className="text-green-400 text-3xl mb-2">2️⃣</div>
              <h4 className="font-bold text-white mb-1">Mesh Responds</h4>
              <p className="text-slate-300">
                Connected tetrahedrons are notified. Contributors give what they can. Funds held in smart contract.
              </p>
            </div>
            <div>
              <div className="text-green-400 text-3xl mb-2">3️⃣</div>
              <h4 className="font-bold text-white mb-1">Funds Distributed</h4>
              <p className="text-slate-300">
                Once verified, funds distributed directly to triad. Transparent tracking. Zero middleman fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
