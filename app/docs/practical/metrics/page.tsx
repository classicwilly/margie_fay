import Link from 'next/link';

export default function MetricsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/vertex/practical" className="text-green-400 hover:text-green-300 mb-6 inline-block">
          ← Back to Practical Vertex
        </Link>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-green-600/20 text-green-400 text-sm font-medium rounded-full mb-3">
              Metrics
            </span>
            <h1 className="text-4xl font-bold text-white mb-2">
              System Metrics & Measurement
            </h1>
            <p className="text-xl text-slate-300">
              How we measure success and track system health
            </p>
          </div>

          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-3">Friction as the Primary Metric</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                In the Phenix Framework, we measure system health through a single universal metric: 
                <strong className="text-green-400"> the friction coefficient (μ)</strong>.
              </p>
              <div className="bg-black/30 border border-green-500/20 rounded-lg p-4 font-mono text-sm text-green-400">
                μ = (failures + warnings × 0.5) / totalTests
              </div>
              <p className="text-slate-300 leading-relaxed mt-4">
                When μ = 0, the system flows without resistance. When μ {">"} 0, energy is wasted as heat.
                All friction is avoidable with math.
              </p>
            </div>

            {/* K4 Topology Metrics */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white border-b border-white/10 pb-3">K4 Topology Metrics</h2>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-white mb-2">Complete Graph Verification</h3>
                <p className="text-slate-300 mb-4">
                  Every tetrahedron must be a K4 complete graph - all 6 edges must exist:
                </p>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex gap-3">
                    <span className="text-blue-400 shrink-0">•</span>
                    <span><strong>Emotional ↔ Practical</strong>: Feelings inform action, action affects feelings</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-400 shrink-0">•</span>
                    <span><strong>Emotional ↔ Philosophical</strong>: Values shape emotions, emotions reveal values</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-400 shrink-0">•</span>
                    <span><strong>Emotional ↔ Technical</strong>: Systems affect wellbeing, wellbeing affects systems</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-400 shrink-0">•</span>
                    <span><strong>Practical ↔ Philosophical</strong>: Actions embody values, values guide actions</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-400 shrink-0">•</span>
                    <span><strong>Practical ↔ Technical</strong>: Tools enable practices, practices shape tools</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-400 shrink-0">•</span>
                    <span><strong>Philosophical ↔ Technical</strong>: Principles determine architecture, architecture enforces principles</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-white mb-2">Edge Quality Indicators</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-600/10 border border-green-500/20 rounded-lg p-4">
                    <div className="text-green-400 font-bold mb-2">Strong Edge ✓</div>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Documentation exists</li>
                      <li>• Code references present</li>
                      <li>• Navigation functional</li>
                      <li>• Tests passing</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="text-yellow-400 font-bold mb-2">Weak Edge ⚠️</div>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• Missing docs</li>
                      <li>• Incomplete patterns</li>
                      <li>• Navigation gaps</li>
                      <li>• Test warnings</li>
                    </ul>
                  </div>
                  <div className="bg-red-600/10 border border-red-500/20 rounded-lg p-4">
                    <div className="text-red-400 font-bold mb-2">Missing Edge ✗</div>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>• No connection</li>
                      <li>• Pattern violation</li>
                      <li>• Dead link</li>
                      <li>• Test failures</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Time-Based Metrics */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white border-b border-white/10 pb-3">Time as the Fourth Vertex</h2>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-white mb-2">The 32-Second Master Clock</h3>
                <p className="text-slate-300 mb-4">
                  All temporal operations oscillate on the master clock:
                </p>
                <div className="bg-black/30 border border-purple-500/20 rounded-lg p-4 space-y-2 font-mono text-sm text-purple-400">
                  <div>oscillation = sin(2πt / 32)</div>
                  <div>where t = time in seconds</div>
                  <div>period = 32s (Phenix transformation cycle)</div>
                </div>
                <p className="text-slate-300 mt-4">
                  This ensures all temporal patterns align with the jitterbug transformation,
                  creating harmonic resonance throughout the system.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-white mb-2">Temporal Health Indicators</h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex gap-3">
                    <span className="text-green-400 shrink-0">✓</span>
                    <span><strong>Synchronization</strong>: All animations on master clock</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-400 shrink-0">✓</span>
                    <span><strong>Phase coherence</strong>: Related elements maintain phase relationships</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-400 shrink-0">✓</span>
                    <span><strong>Smooth transitions</strong>: No jarring jumps or discontinuities</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-400 shrink-0">✓</span>
                    <span><strong>Frame consistency</strong>: 60fps target maintained</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Audit Automation */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white border-b border-white/10 pb-3">Continuous Verification</h2>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-white mb-2">Automated Audit Script</h3>
                <p className="text-slate-300 mb-4">
                  Run <code className="px-2 py-1 bg-black/50 rounded text-green-400">.\scripts\tetrahedron-audit.ps1</code> to verify:
                </p>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex gap-3">
                    <span className="text-blue-400 shrink-0">1.</span>
                    <span>All 4 vertex pages exist and follow K4 pattern</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-400 shrink-0">2.</span>
                    <span>All 6 edges documented with correct gradient classes</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-400 shrink-0">3.</span>
                    <span>Navigation links functional in both directions</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-400 shrink-0">4.</span>
                    <span>GlobalMusic integration present in root layout</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-400 shrink-0">5.</span>
                    <span>Friction coefficient calculated and reported</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-white mb-2">Success Criteria</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔥</span>
                    <div>
                      <div className="text-white font-bold">μ = 0: FRICTIONLESS FLOW</div>
                      <div className="text-slate-300 text-sm">Math eliminates all resistance. The Phenix is complete.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <div>
                      <div className="text-white font-bold">0 {"<"} μ {"<"} 0.1: LOW FRICTION</div>
                      <div className="text-slate-300 text-sm">Minor heat generation. Nearly optimal flow.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <div className="text-white font-bold">μ ≥ 0.1: SIGNIFICANT FRICTION</div>
                      <div className="text-slate-300 text-sm">Energy wasted as heat. Optimization required.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health Dashboard */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white border-b border-white/10 pb-3">Real-Time Monitoring</h2>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-white mb-2">Key Performance Indicators</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                    <div className="text-blue-400 text-sm mb-1">Friction Coefficient</div>
                    <div className="text-2xl font-bold text-white">μ = 0.000</div>
                    <div className="text-slate-400 text-xs mt-1">Target: 0.000</div>
                  </div>
                  <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                    <div className="text-green-400 text-sm mb-1">Test Success Rate</div>
                    <div className="text-2xl font-bold text-white">100%</div>
                    <div className="text-slate-400 text-xs mt-1">61/61 passing</div>
                  </div>
                  <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                    <div className="text-purple-400 text-sm mb-1">K4 Completeness</div>
                    <div className="text-2xl font-bold text-white">6/6 edges</div>
                    <div className="text-slate-400 text-xs mt-1">All connections strong</div>
                  </div>
                  <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                    <div className="text-orange-400 text-sm mb-1">Frame Rate</div>
                    <div className="text-2xl font-bold text-white">60 fps</div>
                    <div className="text-slate-400 text-xs mt-1">Smooth as butter</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mathematical Foundation */}
            <div className="bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-green-900/20 border border-white/20 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">The Mathematical Principle</h2>
              <blockquote className="text-slate-300 leading-relaxed italic border-l-4 border-green-500 pl-4">
                "All of this friction is easily avoidable with math. When we measure what matters 
                and optimize for zero resistance, the system flows naturally. μ = 0 is not just 
                possible—it's inevitable when geometry guides our design."
              </blockquote>
              <p className="text-slate-400 text-sm mt-4">
                — The Phenix Framework philosophy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
