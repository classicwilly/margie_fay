'use client';

import Link from 'next/link';
import { BookOpen, Waves, Heart, Lightbulb, Wrench, ArrowRight, Sparkles } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section - 741 Hz Theme */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full mb-6">
            <Waves className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-mono text-sm">741 Hz - Awakening Intuition</span>
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-4">
            Phenix Framework
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400 mt-2">
              Documentation
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            The complete guide to understanding and implementing tetrahedron-based personal systems.
            Built on the resonance of clarity, expression, and awakening.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Back to Home
            </Link>
            <Link
              href="/hub"
              className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all"
            >
              Go to Hub
            </Link>
          </div>
        </div>

        {/* Four Vertices of Documentation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Technical Vertex */}
          <Link href="/docs/technical/systems-thinking">
            <div className="group bg-linear-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition-all cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-linear-to-r from-blue-600 to-cyan-600 flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Technical</h2>
              <p className="text-slate-300 mb-4">
                Systems thinking, protocol development, and the mathematics of tetrahedron structures.
              </p>
              <div className="flex items-center gap-2 text-blue-400 group-hover:gap-3 transition-all">
                <span className="font-semibold">Explore</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Practical Vertex */}
          <Link href="/docs/practical/toolkit">
            <div className="group bg-linear-to-br from-green-600/10 to-emerald-600/10 border border-green-500/20 rounded-2xl p-8 hover:border-green-500/40 transition-all cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-linear-to-r from-green-600 to-emerald-600 flex items-center justify-center mb-6">
                <Wrench className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Practical</h2>
              <p className="text-slate-300 mb-4">
                Daily practices, toolkits, quick references, and real-world implementation guides.
              </p>
              <div className="flex items-center gap-2 text-green-400 group-hover:gap-3 transition-all">
                <span className="font-semibold">Explore</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Emotional Vertex */}
          <Link href="/docs/emotional/processing">
            <div className="group bg-linear-to-br from-pink-600/10 to-rose-600/10 border border-pink-500/20 rounded-2xl p-8 hover:border-pink-500/40 transition-all cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-linear-to-r from-pink-600 to-rose-600 flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Emotional</h2>
              <p className="text-slate-300 mb-4">
                Processing frameworks, attachment theory, relationship dynamics, and emotional resilience.
              </p>
              <div className="flex items-center gap-2 text-pink-400 group-hover:gap-3 transition-all">
                <span className="font-semibold">Explore</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Philosophical Vertex */}
          <Link href="/docs/philosophical/ethics">
            <div className="group bg-linear-to-br from-purple-600/10 to-violet-600/10 border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/40 transition-all cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-linear-to-r from-purple-600 to-violet-600 flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Philosophical</h2>
              <p className="text-slate-300 mb-4">
                Ethics, human flourishing, the nature of systems, and the deeper meaning of structure.
              </p>
              <div className="flex items-center gap-2 text-purple-400 group-hover:gap-3 transition-all">
                <span className="font-semibold">Explore</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>

        {/* 741 Hz Information Box */}
        <div className="bg-linear-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-8 mb-16">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 rounded-full bg-linear-to-r from-purple-600 to-blue-600 flex items-center justify-center shrink-0">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">Why 741 Hz?</h3>
              <p className="text-slate-300 mb-4">
                In the ancient Solfeggio frequencies, 741 Hz represents the frequency of awakening intuition and expanding consciousness.
                It's associated with expression, solutions, and cleaning toxins from cells.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-purple-400 font-bold mb-1">Expression</div>
                  <div className="text-sm text-slate-400">Speaking truth, clarity of communication</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-blue-400 font-bold mb-1">Intuition</div>
                  <div className="text-sm text-slate-400">Awakening inner wisdom and insight</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-cyan-400 font-bold mb-1">Solutions</div>
                  <div className="text-sm text-slate-400">Problem-solving and creative thinking</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/docs/practical/quick-reference"
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group"
            >
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                Quick Reference
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-slate-400">Essential concepts and quick lookup guide</p>
            </Link>

            <Link
              href="/docs/practical/toolkit"
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group"
            >
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                Toolkit
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-slate-400">Practical tools and templates</p>
            </Link>

            <Link
              href="/docs/practical/case-studies"
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group"
            >
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                Case Studies
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-slate-400">Real-world examples and implementations</p>
            </Link>

            <Link
              href="/docs/technical/systems-thinking"
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group"
            >
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                Systems Thinking
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-slate-400">Understanding the tetrahedron framework</p>
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-16 text-slate-500 text-sm">
          <p>Built with resonance. Tuned to 741 Hz.</p>
          <p className="mt-2">Awakening intuition through structured systems.</p>
        </div>
      </div>
    </div>
  );
}
