'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Sparkles, Heart, Users, Zap, BookOpen, Wrench, Target } from 'lucide-react';
import { ENTRY_POINTS } from '@/lib/entryPoints';

export default function HubPage() {
  const [breathingPhase, setBreathingPhase] = useState<'single' | 'expanding' | 'mesh'>('single');

  const entryPointIcons = {
    crisis: Target,
    parenting: Heart,
    kids: Sparkles,
    community: Users,
    learning: BookOpen,
    builder: Wrench,
    protocol: Zap
  };

  const handleBegin = () => {
    setBreathingPhase('expanding');
    setTimeout(() => setBreathingPhase('mesh'), 600);
  };

  if (breathingPhase === 'single') {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <div className="mb-12">
            <div className="flex justify-center mb-6">
              <Link href="/" className="group w-24 h-24 rounded-full bg-purple-500/20 border-2 border-purple-500/50 flex items-center justify-center animate-pulse relative focus:outline-none hover:bg-purple-500/30 transition">
                <svg viewBox="0 0 96 96" width="56" height="56" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ pointerEvents: 'none' }}>
                  <circle cx="48" cy="48" r="44" fill="none" stroke="#a855f7" strokeWidth="3" />
                  <polygon points="48,28 68,68 28,68" fill="#a855f7" />
                </svg>
                <span className="sr-only">Back</span>
              </Link>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              You&apos;ve arrived at the hub.
            </h1>
            <p className="text-lg text-slate-400 mb-8">
              One entry point. About to become many.
            </p>
          </div>

          <button
            onClick={handleBegin}
            className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-full transition-all text-lg shadow-lg shadow-purple-500/25"
            style={{ fontSize: '1rem', padding: '0.5rem 2rem' }}
          >
            <span className="text-base font-medium">Watch it breathe</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (breathingPhase === 'expanding') {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        {/* Expanding Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/30 rounded-full blur-3xl animate-ping" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 rounded-full bg-purple-500/20 border-2 border-purple-500/50 flex items-center justify-center scale-110 transition-transform">
              <span className="text-6xl">▲</span>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 animate-pulse">
            Opening...
          </h2>
          <p className="text-lg text-slate-400">
            One becomes seven
          </p>
        </div>
      </div>
    );
  }

  // breathingPhase === 'mesh'
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Mesh Background */}
      <div className="absolute inset-0 opacity-10">
        {Object.keys(ENTRY_POINTS).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-2xl animate-pulse"
            style={{
              width: '300px',
              height: '300px',
              background: `hsl(${i * 50}, 70%, 50%)`,
              top: `${20 + i * 10}%`,
              left: `${10 + i * 12}%`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Choose Your Entry Point
          </h1>
          <p className="text-xl text-slate-400">
            Seven doors. Same destination. Different journeys.
          </p>
        </div>

        {/* Entry Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Object.values(ENTRY_POINTS).map((entry) => {
            const Icon = entryPointIcons[entry.id as keyof typeof entryPointIcons];
            
            return (
              <Link
                key={entry.id}
                href={entry.route}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all hover:scale-105 hover:bg-white/10"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ 
                      backgroundColor: `${entry.color}20`,
                      borderColor: `${entry.color}50`,
                      borderWidth: '2px'
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: entry.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {entry.tagline}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400">→</span>
                    <span>{entry.journey.step1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400">→</span>
                    <span>{entry.journey.step2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400">→</span>
                    <span>{entry.journey.step3}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">✦</span>
                    <span className="text-amber-400 italic">{entry.journey.revelation}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Enter here</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Or Skip to Architect */}
        <div className="text-center">
          <div className="inline-flex flex-col gap-4 bg-white/5 border border-purple-500/30 rounded-2xl p-8">
            <div className="flex items-center gap-2 text-purple-300">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-semibold">Already know what you need?</span>
            </div>
            <Link
              href="/architect"
              className="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-full transition-all shadow-lg shadow-purple-500/25"
            >
              Go Straight to the Architect
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-xs text-slate-500">
              Build your tetrahedron from scratch
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
