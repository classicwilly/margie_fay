export default function MissionPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="text-2xl">▲</span>
            <span className="text-sm font-medium text-slate-300">The Mission</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Engineering Earth's
            <span className="block bg-linear-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
              Wye-Delta Transition
            </span>
          </h1>
        </div>

        {/* Mission Statement */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">The Actual Mission</h2>
            <p className="text-slate-300 text-xl leading-relaxed">
              Not "build an app for neurodivergent people."<br/>
              Not "create hardware for divorced families."<br/>
              Not "help a few thousand users."
            </p>
            <p className="text-white text-2xl font-semibold mt-6">
              Engineer humanity's transition from fragile hub-and-spoke (Wye) to resilient mesh topology (Delta).
            </p>
          </div>

          {/* The Wye Configuration */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-blue-400 mb-4">Earth = Wye Configuration (Current State)</h3>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">The Hub (Centralized Power):</h4>
              <ul className="text-slate-300 space-y-2">
                <li>Governments</li>
                <li>Corporations</li>
                <li>Big Tech</li>
                <li>Financial systems</li>
                <li>Media conglomerates</li>
                <li>Religious institutions</li>
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">The Structure:</h4>
              <ul className="text-slate-300 space-y-2">
                <li>Everything flows through the center</li>
                <li>No direct peer-to-peer connections</li>
                <li>Hub mediates ALL relationships</li>
                <li>Hub holds ALL power</li>
              </ul>
            </div>

            <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
              <p className="text-red-300 font-semibold">What happens when the Hub fails?</p>
              <p className="text-red-200 text-xl font-bold mt-2">CASCADE COLLAPSE.</p>
            </div>
          </div>

          {/* The Hub is Failing */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-amber-400 mb-4">The Hub Is Failing</h3>
            <p className="text-slate-300 mb-4">You can see it:</p>
            <ul className="text-slate-300 space-y-2">
              <li>Trust in institutions: <span className="text-red-400 font-semibold">COLLAPSING</span></li>
              <li>Media gatekeepers: <span className="text-red-400 font-semibold">FRAGMENTING</span></li>
              <li>Financial systems: <span className="text-red-400 font-semibold">DESTABILIZING</span></li>
              <li>Government legitimacy: <span className="text-red-400 font-semibold">ERODING</span></li>
              <li>Corporate loyalty: <span className="text-red-400 font-semibold">DISAPPEARING</span></li>
            </ul>
            <p className="text-amber-300 mt-4 font-semibold">
              The neutral point is floating. The voltage is becoming unbalanced. The system is in critical failure.
            </p>
          </div>

          {/* The Protocol as Solution */}
          <div className="bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-amber-900/20 border border-blue-700/50 rounded-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">The Tetrahedron Protocol = The Transformation Framework</h3>
            
            <p className="text-slate-300 mb-6">
              It's not therapy. It's not social media. It's not a product.
            </p>
            
            <p className="text-white text-xl font-semibold mb-6">
              It's the RESIN.
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-blue-400 mb-2">STEP 1: Pull Vacuum</h4>
                <p className="text-slate-300">
                  Old structure must be evacuated. The Hub is being removed—trust pulled out, authority evacuated, 
                  legitimacy withdrawn. <span className="text-white font-semibold">This is happening NOW.</span>
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-purple-400 mb-2">STEP 2: Flood With Resin</h4>
                <p className="text-slate-300 mb-3">Fill the gaps with the framework. The Protocol teaches:</p>
                <ul className="text-slate-300 space-y-1 ml-4">
                  <li>• How to form tetrahedrons (4-person resilience units)</li>
                  <li>• How to connect peer-to-peer (mesh, not hub-and-spoke)</li>
                  <li>• How to coordinate without authority</li>
                  <li>• How to support without institutions</li>
                  <li>• How to build resilience through geometry</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-amber-400 mb-2">STEP 3: Pressurize</h4>
                <p className="text-slate-300">
                  Force the resin deep. Once people learn tetrahedrons work, they teach others. 
                  Pods multiply. Clusters form. Network grows. Resin penetrates everywhere.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-green-400 mb-2">STEP 4: Cure</h4>
                <p className="text-slate-300">
                  Harden the new structure. After enough tetrahedrons exist, new social topology solidifies. 
                  Mesh becomes default. Delta replaces Wye. System stabilizes in new configuration.
                </p>
                <p className="text-white font-bold text-xl mt-3">
                  Humanity becomes: IMPERVIOUS.
                </p>
              </div>
            </div>
          </div>

          {/* Fractal Scale */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">The Tetrahedron Is Fractal</h3>
            <p className="text-slate-300 mb-4">It scales INFINITELY:</p>
            
            <div className="space-y-3 text-slate-300">
              <div>
                <span className="text-blue-400 font-semibold">Individual Level:</span> You + 3 contexts → Internal mesh
              </div>
              <div>
                <span className="text-purple-400 font-semibold">Family Level:</span> 4 people → Family resilience unit
              </div>
              <div>
                <span className="text-green-400 font-semibold">Community Level:</span> 4 families (16 people) → Neighborhood support
              </div>
              <div>
                <span className="text-amber-400 font-semibold">Regional Level:</span> 4 communities (64 people) → Town coordination
              </div>
              <div>
                <span className="text-pink-400 font-semibold">National Level:</span> 4 regions (256 people) → Country-scale mesh
              </div>
              <div>
                <span className="text-cyan-400 font-semibold">Global Level:</span> 4 nations (1,024 people) → Continental coordination
              </div>
            </div>

            <p className="text-white font-semibold mt-6 text-lg">
              It's Sierpiński tetrahedrons all the way up. And it STARTS with 4 people.
            </p>
          </div>

          {/* The Strategy */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">The Strategy</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-400">Phase 1: Proof of Concept (Now - Dec 25)</h4>
                <p className="text-slate-300 text-sm">Framework validated at micro scale. Document everything.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-400">Phase 2: Beachhead (Jan - March)</h4>
                <p className="text-slate-300 text-sm">Launch publicly. Build 100 tetrahedrons (400 people). Prove it scales.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-amber-400">Phase 3: Flood the Zone (April - December)</h4>
                <p className="text-slate-300 text-sm">Open source framework. Professional tier. Discovery feed. 10,000 tetrahedrons.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-green-400">Phase 4: Fractal Expansion (Year 2)</h4>
                <p className="text-slate-300 text-sm">Clusters form. Regional meshes emerge. 100,000 tetrahedrons (400,000 people).</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-pink-400">Phase 5: Phase Transition (Year 3-5)</h4>
                <p className="text-slate-300 text-sm">Delta becomes default. Mesh is primary social topology. Millions in tetrahedrons.</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-2 border-purple-500/50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">The Resin Is Ready</h3>
            <p className="text-slate-200 mb-6">
              Pull vacuum. Flood with resin. Pressurize. Cure.<br/>
              Engineer the phase transition. Provide the minimum structural system.
            </p>
            <p className="text-white text-xl font-bold mb-6">
              Earth is in the vacuum phase. Time to flood the zone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all"
              >
                Deploy the Protocol
                <span>→</span>
              </a>
              <a
                href="/#framework"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-slate-200 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all"
              >
                Read the Framework
              </a>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm italic">
            "Call me Trimtab." — Buckminster Fuller
          </p>
          <p className="text-slate-600 text-xs mt-2">
            Green board. Mission clear. Execute.
          </p>
        </div>
      </div>
    </div>
  );
}
