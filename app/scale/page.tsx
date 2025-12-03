'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Network, Globe, Zap } from 'lucide-react';

export default function ScalePage() {
  const [activeScale, setActiveScale] = useState<'local' | 'regional' | 'national' | 'global'>('local');

  const scales = [
    {
      id: 'local',
      name: 'Local Mesh',
      icon: Users,
      size: '4-16 families',
      tetrahedrons: '1-4',
      description: 'Single neighborhood or community. 4 anchor families each support 3-4 others.',
      examples: ['One block', 'One apartment complex', 'One church/temple', 'One school community'],
      metrics: {
        people: '16-64',
        anchors: 4,
        resilience: 'Can survive loss of 1 anchor family'
      },
      color: 'from-green-600 to-emerald-600'
    },
    {
      id: 'regional',
      name: 'Regional Network',
      icon: Network,
      size: '4-16 neighborhoods',
      tetrahedrons: '16-64',
      description: 'Multiple neighborhoods form mesh of meshes. Each local mesh connects to 3 others.',
      examples: ['City district', 'Suburban area', 'Rural county', 'Multi-congregation network'],
      metrics: {
        people: '256-1,024',
        anchors: 16,
        resilience: 'Can survive loss of 4 anchor families'
      },
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'national',
      name: 'National Grid',
      icon: Zap,
      size: '64-256 regions',
      tetrahedrons: '1,024-16,384',
      description: 'Regional networks connect across state/provincial boundaries. Protocol standardization.',
      examples: ['State network', 'Multi-state alliance', 'National denomination', 'Professional network'],
      metrics: {
        people: '16,384-262,144',
        anchors: 64,
        resilience: 'Can survive loss of 16 regional networks'
      },
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'global',
      name: 'Global Mesh',
      icon: Globe,
      size: 'Unlimited',
      tetrahedrons: '4B+',
      description: 'Protocol operates at planetary scale. Same math, different languages and cultures.',
      examples: ['International movements', 'Diaspora networks', 'Global faith communities', 'Humanity'],
      metrics: {
        people: '4+ billion',
        anchors: '1M+',
        resilience: 'Protocol survives regional failures'
      },
      color: 'from-amber-600 to-orange-600'
    }
  ];

  const currentScale = scales.find(s => s.id === activeScale)!;
  const Icon = currentScale.icon;

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
            <h1 className="text-4xl font-bold text-white mb-3">
              Scale-Invariant Architecture
            </h1>
            <p className="text-xl text-slate-400">
              Same protocol. 4 people or 4 billion. The math doesn&apos;t change.
            </p>
          </div>
        </div>

        {/* Scale Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {scales.map(scale => {
            const ScaleIcon = scale.icon;
            return (
              <button
                key={scale.id}
                onClick={() => setActiveScale(scale.id as 'local'|'regional'|'national'|'global')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  activeScale === scale.id
                    ? `border-white bg-linear-to-br ${scale.color} text-white`
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/30 hover:text-white'
                }`}
              >
                <ScaleIcon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-semibold">{scale.name}</div>
                <div className="text-xs opacity-80 mt-1">{scale.size}</div>
              </button>
            );
          })}
        </div>

        {/* Current Scale Details */}
        <div className={`bg-linear-to-br ${currentScale.color} rounded-2xl p-8 mb-8 text-white shadow-2xl`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 rounded-xl p-4">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{currentScale.name}</h2>
              <p className="text-white/80 text-lg">{currentScale.tetrahedrons} tetrahedrons</p>
            </div>
          </div>

          <p className="text-xl text-white/90 mb-6">{currentScale.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
              <div className="text-2xl font-bold mb-1">{currentScale.metrics.people}</div>
              <div className="text-sm text-white/80">People Connected</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
              <div className="text-2xl font-bold mb-1">{currentScale.metrics.anchors}</div>
              <div className="text-sm text-white/80">Anchor Points</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
              <div className="text-sm text-white/90">{currentScale.metrics.resilience}</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Examples:</h3>
            <div className="grid grid-cols-2 gap-2">
              {currentScale.examples.map((example, i) => (
                <div key={i} className="bg-white/10 rounded-lg px-3 py-2 text-sm backdrop-blur">
                  • {example}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The Math */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">The Mathematics of Scale</h2>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">K₄ Complete Graph (Tetrahedron)</h3>
              <div className="text-slate-300 space-y-2">
                <p>• <strong className="text-white">4 vertices</strong> = 4 anchor points</p>
                <p>• <strong className="text-white">6 edges</strong> = all vertices connected</p>
                <p>• <strong className="text-white">0 single points of failure</strong> = distributed resilience</p>
                <p className="text-sm text-purple-300 mt-3">This configuration is scale-invariant. Works for families or nations.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Fractal Growth Pattern</h3>
              <div className="text-slate-300 space-y-2">
                <p>• <strong className="text-white">1 K₄</strong> = 4 families = 16 people (4 per family avg)</p>
                <p>• <strong className="text-white">4 K₄s</strong> = 16 families = 64 people (one neighborhood)</p>
                <p>• <strong className="text-white">16 K₄s</strong> = 64 families = 256 people (district)</p>
                <p>• <strong className="text-white">4 billion people</strong> = 1 billion families = 250 million K₄s</p>
                <p className="text-sm text-green-300 mt-3">Each level maintains the same topology. Mesh of meshes.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Resilience at Every Scale</h3>
              <div className="text-slate-300 space-y-2">
                <p>• <strong className="text-white">Local mesh (4 families)</strong>: Survives 1 family moving away</p>
                <p>• <strong className="text-white">Regional network (16 meshes)</strong>: Survives 4 meshes failing</p>
                <p>• <strong className="text-white">National grid (64 regions)</strong>: Survives 16 regional failures</p>
                <p>• <strong className="text-white">Global mesh</strong>: Survives entire nations going offline</p>
                <p className="text-sm text-amber-300 mt-3">Protocol doesn&apos;t depend on central servers or authorities.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Protocol Invariants */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">What Changes vs What Stays Constant</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">🔒 Invariants (Never Change)</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>✓ K₄ topology (4 vertices, complete graph)</li>
                <li>✓ No single points of failure</li>
                <li>✓ Distributed decision-making</li>
                <li>✓ Mesh communication (not hub-and-spoke)</li>
                <li>✓ Opt-in participation</li>
                <li>✓ Privacy-first design</li>
                <li>✓ Local autonomy</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 border border-pink-500/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-pink-300 mb-4">🔄 Variants (Adapt to Scale)</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• Communication tools (chat → forums → federated)</li>
                <li>• Coordination frequency (weekly → monthly → quarterly)</li>
                <li>• Governance structures (informal → elected → constitutional)</li>
                <li>• Data storage (local → regional → distributed)</li>
                <li>• Languages and cultures</li>
                <li>• Legal frameworks</li>
                <li>• Technology stacks</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Deployment Strategy */}
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Deployment Strategy: Start Small, Scale Fast</h2>
          
          <div className="space-y-4 text-slate-300">
            <div className="flex items-start gap-3">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">1</div>
              <div>
                <h3 className="text-white font-semibold mb-1">Prove at Family Scale</h3>
                <p className="text-sm">4 families test the protocol. Fix what breaks. Document what works.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">2</div>
              <div>
                <h3 className="text-white font-semibold mb-1">Expand to Neighborhood</h3>
                <p className="text-sm">16 families (4 K₄s) demonstrate mesh resilience. Each anchor supports 3 others.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">3</div>
              <div>
                <h3 className="text-white font-semibold mb-1">Connect Neighborhoods</h3>
                <p className="text-sm">64 families (16 K₄s) create regional network. Protocol handles mesh-of-meshes.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">4</div>
              <div>
                <h3 className="text-white font-semibold mb-1">Go Exponential</h3>
                <p className="text-sm">Each successful mesh spawns 3-4 more. Fractal growth. No central coordination required.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white text-lg font-semibold mb-2">
              The topology determines everything.
            </p>
            <p className="text-slate-300">
              You don&apos;t need permission. You don&apos;t need a headquarters. You don&apos;t need a CEO.
              You need 3 other families who want to build something resilient. Start there.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
