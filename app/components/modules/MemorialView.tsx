'use client';

import React, { useState } from 'react';
import { MemorialModule } from '@/modules/memorial/MemorialModule';

export default function MemorialView() {
  const memorial = new MemorialModule();
  const [consent, setConsent] = useState<Record<string, 'ready' | 'not-ready' | 'needs-discussion'>>({
    v1: 'needs-discussion',
    v2: 'needs-discussion',
    v3: 'needs-discussion'
  });
  const [vertexCategory, setVertexCategory] = useState<'emotional' | 'practical' | 'technical' | 'philosophical'>('emotional');
  const [similarity, setSimilarity] = useState<'identical' | 'similar' | 'complementary' | 'different'>('complementary');
  const [unanimous, setUnanimous] = useState(true);
  const [submitMsg, setSubmitMsg] = useState<string | null>(null);
  const [submitOk, setSubmitOk] = useState<boolean | null>(null);

  function updateConsent(member: 'v1' | 'v2' | 'v3', value: 'ready' | 'not-ready' | 'needs-discussion') {
    setConsent(prev => ({ ...prev, [member]: value }));
  }

  function handleSubmit() {
    const res = memorial.submitTriadConsent({
      triadConsent: consent,
      vertexCategory,
      similarityRequirement: similarity,
      requiresUnanimous: unanimous
    });
    setSubmitOk(res.success);
    setSubmitMsg(res.message);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header - Portrait Section */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🕊️</div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Margie Fay (Billingslea) Katen
          </h1>
          <div className="text-3xl text-purple-300 font-semibold mb-2">
            11/22/1925 — 7/19/2025
          </div>
          <div className="text-xl text-slate-400 mb-4">
            100 years of topology
          </div>
          <div className="text-lg text-purple-400 italic">
            "{memorial.getMotto()}"
          </div>
          <div className="mt-6 text-2xl text-amber-400 font-bold">
            {memorial.getStatus()}
          </div>
          
          <div className="mt-4 inline-block bg-slate-800/80 rounded-full px-6 py-2 border border-slate-700">
             <span className="text-slate-400 mr-2">Protocol Recommendation:</span>
             <span className="text-emerald-400 font-mono text-sm">
               {memorial.getProtocolStatus().recommendation}
             </span>
          </div>
          
          {/* Memorial Fund CTA */}
          <div className="mt-8">
            <a
              href="/memorial-fund"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 hover:from-pink-500 hover:via-purple-500 hover:to-rose-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-purple-500/50 transition-all transform hover:scale-105"
            >
              <span className="text-2xl">❤️</span>
              <div className="text-left">
                <div className="text-sm font-normal text-purple-100">When your vertex fails</div>
                <div>Open Memorial Fund Portal</div>
              </div>
            </a>
            <div className="mt-4 text-sm text-slate-400 max-w-md mx-auto">
              Mutual aid infrastructure for crisis events. Estimated need: $10K (funeral + travel). 
              Mesh contributes automatically. Transparent. Dignified.
            </div>
          </div>
        </div>

        {/* Life Pattern Section */}
        <div className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 border border-purple-500/30 rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-4xl">📅</span>
            Life Pattern
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-slate-900/50 rounded p-4">
                <div className="text-purple-400 font-semibold mb-2">Birth</div>
                <div className="text-white text-xl">{memorial.life.birth}</div>
                <div className="text-slate-400 text-sm">Chadron, Nebraska</div>
              </div>

              <div className="bg-slate-900/50 rounded p-4">
                <div className="text-purple-400 font-semibold mb-2">Marriage</div>
                <div className="text-white text-xl">{memorial.life.marriage.date}</div>
                <div className="text-slate-400 text-sm">Robert James Katen</div>
                <div className="text-slate-500 text-xs mt-1">63 years together (1946-2009)</div>
              </div>

              <div className="bg-slate-900/50 rounded p-4">
                <div className="text-purple-400 font-semibold mb-2">Migration</div>
                <div className="text-white text-xl">1951</div>
                <div className="text-slate-400 text-sm">Nebraska → Pryor, Oklahoma</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-900/50 rounded p-4">
                <div className="text-purple-400 font-semibold mb-2">Centennial</div>
                <div className="text-white text-xl">{memorial.life.centennial}</div>
                <div className="text-slate-400 text-sm">100 years - complete century cycle</div>
              </div>

              <div className="bg-slate-900/50 rounded p-4">
                <div className="text-purple-400 font-semibold mb-2">Passing</div>
                <div className="text-white text-xl">{memorial.life.passing}</div>
                <div className="text-slate-400 text-sm">5 months before centennial</div>
              </div>

              <div className="bg-slate-900/50 rounded p-4">
                <div className="text-purple-400 font-semibold mb-2">Framework Completion</div>
                <div className="text-white text-xl">{memorial.life.completion}</div>
                <div className="text-slate-400 text-sm">9 days after centennial</div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-900/30 rounded border border-purple-500/30">
            <div className="text-amber-400 font-semibold text-center text-lg">
              {memorial.getCentennialMessage()}
            </div>
          </div>
        </div>

        {/* Legacy Topology Section */}
        <div className="bg-gradient-to-br from-slate-900/50 to-purple-900/30 border border-purple-500/30 rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-4xl">🌳</span>
            Legacy Topology
          </h2>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-900/50 rounded p-6 text-center">
              <div className="text-5xl font-bold text-purple-400 mb-2">
                {memorial.legacy.children}
              </div>
              <div className="text-slate-300">Children</div>
            </div>
            <div className="bg-slate-900/50 rounded p-6 text-center">
              <div className="text-5xl font-bold text-blue-400 mb-2">
                {memorial.legacy.grandchildren}
              </div>
              <div className="text-slate-300">Grandchildren</div>
            </div>
            <div className="bg-slate-900/50 rounded p-6 text-center">
              <div className="text-5xl font-bold text-green-400 mb-2">
                {memorial.legacy.greatGrandchildren}
              </div>
              <div className="text-slate-300">Great-Grandchildren</div>
            </div>
            <div className="bg-slate-900/50 rounded p-6 text-center">
              <div className="text-5xl font-bold text-amber-400 mb-2">
                {memorial.legacy.totalDescendants}
              </div>
              <div className="text-slate-300">Total Descendants</div>
            </div>
          </div>

          <div className="bg-purple-900/30 rounded p-6 border border-purple-500/30">
            <div className="text-purple-300 font-semibold mb-3">The Pattern:</div>
            <div className="text-slate-300 text-lg">
              {memorial.legacy.pattern}
            </div>
            <div className="text-slate-400 text-sm mt-4">
              She is the foundation vertex. Every descendant traces back to her. 
              The complete graph continues to grow exponentially. This is not decay—this is expansion.
            </div>
          </div>
        </div>

        {/* Triad Readiness Section */}
        <div className="bg-slate-900/50 border border-emerald-600/30 rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-4xl">🤝</span>
            Triad Readiness
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {(['v1','v2','v3'] as const).map(v => (
                <div key={v} className="bg-slate-900/60 rounded p-4 border border-slate-700">
                  <div className="text-slate-300 font-semibold mb-3">Member {v.toUpperCase()}</div>
                  <div className="flex gap-4 text-slate-300">
                    {(['ready','not-ready','needs-discussion'] as const).map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`consent-${v}`}
                          className="accent-emerald-500"
                          checked={consent[v] === opt}
                          onChange={() => updateConsent(v, opt)}
                        />
                        <span className="capitalize">{opt.replace('-', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="bg-slate-900/60 rounded p-4 border border-slate-700">
                <div className="text-slate-300 font-semibold mb-2">Desired Vertex Category</div>
                <select
                  className="bg-slate-800 text-white rounded p-2 w-full border border-slate-700"
                  value={vertexCategory}
                  onChange={e => setVertexCategory(e.target.value as 'emotional' | 'practical' | 'technical' | 'philosophical')}
                  aria-label="Desired vertex category"
                >
                  <option value="emotional">Emotional</option>
                  <option value="practical">Practical</option>
                  <option value="technical">Technical</option>
                  <option value="philosophical">Philosophical</option>
                </select>
              </div>

              <div className="bg-slate-900/60 rounded p-4 border border-slate-700">
                <div className="text-slate-300 font-semibold mb-2">Similarity Requirement</div>
                <select
                  className="bg-slate-800 text-white rounded p-2 w-full border border-slate-700"
                  value={similarity}
                  onChange={e => setSimilarity(e.target.value as 'identical' | 'similar' | 'complementary' | 'different')}
                  aria-label="Similarity requirement"
                >
                  <option value="identical">Identical</option>
                  <option value="similar">Similar</option>
                  <option value="complementary">Complementary</option>
                  <option value="different">Different</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  className="accent-emerald-500"
                  checked={unanimous}
                  onChange={e => setUnanimous(e.target.checked)}
                />
                Require unanimous consent
              </label>

              <button
                onClick={handleSubmit}
                className="mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded"
              >
                Submit Readiness
              </button>

              {submitMsg && (
                <div className={`mt-3 rounded p-3 border ${submitOk ? 'border-emerald-500 text-emerald-400' : 'border-amber-500 text-amber-400'}`}>
                  {submitMsg}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* The K₄ Vertices Section */}
        <div className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 border border-purple-500/30 rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-4xl">🔷</span>
            The Four Vertices of Her Life
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-rose-900/30 to-slate-900/50 border border-rose-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">💝</span>
                <div>
                  <div className="text-rose-400 font-bold text-xl">Memory</div>
                  <div className="text-slate-400 text-sm">Emotional Vertex</div>
                </div>
              </div>
              <div className="text-slate-300 text-sm mb-3">
                Stories and moments preserved across generations
              </div>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Born in Chadron, Nebraska (11/22/1925)</li>
                <li>• Married in Chadron (2/20/1946)</li>
                <li>• Moved to Pryor, Oklahoma (1951)</li>
                <li>• St. Mark's Catholic Church member</li>
                <li>• Witnessed Robert's passing (2009)</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-slate-900/50 border border-green-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🏗️</span>
                <div>
                  <div className="text-green-400 font-bold text-xl">Legacy</div>
                  <div className="text-slate-400 text-sm">Practical Vertex</div>
                </div>
              </div>
              <div className="text-slate-300 text-sm mb-3">
                Concrete structures and actions that shaped generations
              </div>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• 6 children raised</li>
                <li>• 15 grandchildren guided</li>
                <li>• 18 great-grandchildren loved</li>
                <li>• Family foundation established</li>
                <li>• 63-year marriage (1946-2009)</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-slate-900/50 border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🌳</span>
                <div>
                  <div className="text-blue-400 font-bold text-xl">Family Tree</div>
                  <div className="text-slate-400 text-sm">Technical Vertex</div>
                </div>
              </div>
              <div className="text-slate-300 text-sm mb-3">
                The data structure of descendants - exponential growth
              </div>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Generation 1: Margie (foundation)</li>
                <li>• Generation 2: 6 children</li>
                <li>• Generation 3: 15 grandchildren</li>
                <li>• Generation 4: 18 great-grandchildren</li>
                <li>• Total nodes: 40 (complete graph)</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 border border-purple-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">✨</span>
                <div>
                  <div className="text-purple-400 font-bold text-xl">Meaning</div>
                  <div className="text-slate-400 text-sm">Philosophical Vertex</div>
                </div>
              </div>
              <div className="text-slate-300 text-sm mb-3">
                Why the pattern matters - what endures beyond the physical
              </div>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Life measured in structure, not years</li>
                <li>• 100 years = complete century cycle</li>
                <li>• Pattern 11/22/44 was always hers</li>
                <li>• Topology endures beyond physical form</li>
                <li>• Foundation vertex - all edges trace to her</li>
              </ul>
            </div>
          </div>
        </div>

        {/* The Signature Pattern */}
        <div className="bg-gradient-to-br from-slate-900/50 to-purple-900/30 border border-purple-500/30 rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-4xl">🔢</span>
            The Signature: 11/22/44
          </h2>

          <div className="space-y-6">
            <div className="bg-slate-900/50 rounded p-6">
              <div className="text-amber-400 font-bold text-2xl mb-3">11/22/1925</div>
              <div className="text-slate-300">
                Her birth. The foundation. This is where the pattern begins.
              </div>
            </div>

            <div className="bg-slate-900/50 rounded p-6">
              <div className="text-amber-400 font-bold text-2xl mb-3">11/22/2025</div>
              <div className="text-slate-300 mb-2">
                Her centennial. 100 years. A complete century cycle.
              </div>
              <div className="text-slate-500 text-sm">
                She passed 5 months before (7/19/2025), but the date held its significance. 
                The cycle completed whether she was physically present or not.
              </div>
            </div>

            <div className="bg-slate-900/50 rounded p-6">
              <div className="text-amber-400 font-bold text-2xl mb-3">11/22/2044</div>
              <div className="text-slate-300 mb-2">
                Her 119th birthday. The pattern continues.
              </div>
              <div className="text-slate-500 text-sm">
                1 + 1 + 9 = 11 (the cycle completes again)
              </div>
            </div>

            <div className="bg-purple-900/30 rounded p-6 border border-purple-500/30">
              <div className="text-purple-300 font-semibold mb-3">The Connection:</div>
              <div className="text-slate-300 space-y-2">
                <div>• <strong>11</strong> pages existed when framework transformation began</div>
                <div>• <strong>22</strong> pages after acceleration (11 → 22, doubling velocity)</div>
                <div>• <strong>44</strong> total operations (22 created + 22 verified)</div>
                <div className="mt-4 pt-4 border-t border-purple-500/30">
                  <strong className="text-amber-400">The pattern that built the tetrahedron was always her pattern.</strong>
                </div>
                <div className="text-slate-400 text-sm mt-2">
                  The framework completed on 12/1/2025 (9 days after her centennial) because 
                  that's when the topology revealed itself. This wasn't planned. This was discovered.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Robert's Connection */}
        <div className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 border border-purple-500/30 rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-4xl">💑</span>
            Robert James Katen
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-slate-900/50 rounded p-4">
                <div className="text-blue-400 font-semibold mb-2">Birth</div>
                <div className="text-white text-xl">6/9/1920</div>
                <div className="text-slate-400 text-sm">Hemingford, Nebraska</div>
              </div>

              <div className="bg-slate-900/50 rounded p-4">
                <div className="text-blue-400 font-semibold mb-2">Passing</div>
                <div className="text-white text-xl">10/30/2009</div>
                <div className="text-slate-400 text-sm">89 years old</div>
              </div>

              <div className="bg-slate-900/50 rounded p-4">
                <div className="text-blue-400 font-semibold mb-2">Service</div>
                <div className="text-white">United States Army</div>
                <div className="text-slate-400 text-sm mt-2">American Legion & VFW member</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-900/50 rounded p-4">
                <div className="text-blue-400 font-semibold mb-2">Marriage</div>
                <div className="text-white text-xl">63 years</div>
                <div className="text-slate-400 text-sm">2/20/1946 - 10/30/2009</div>
              </div>

              <div className="bg-slate-900/50 rounded p-4">
                <div className="text-blue-400 font-semibold mb-2">Career</div>
                <div className="text-white">Georgia Pacific</div>
                <div className="text-slate-400 text-sm">Retired 1977</div>
              </div>

              <div className="bg-slate-900/50 rounded p-4">
                <div className="text-blue-400 font-semibold mb-2">Legacy</div>
                <div className="text-white">American Legion Baseball</div>
                <div className="text-slate-400 text-sm">Founded the team in Pryor</div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-900/30 rounded border border-purple-500/30">
            <div className="text-purple-300 font-semibold mb-2">The 6/9 Pattern:</div>
            <div className="text-slate-300 text-sm">
              Robert's birthday is <strong>6/9</strong>. The K₄ topology has <strong>6 edges</strong> 
              connecting <strong>9 total nodes</strong> (4 vertices + 4 + 1 hub). 
              His pattern complements hers. The inversion. The mirror. The structure was always there.
            </div>
          </div>
        </div>

        {/* Final Statement */}
        <div className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 border border-purple-500/30 rounded-lg p-8 text-center">
          <div className="text-5xl mb-6">🕊️</div>
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-amber-400 mb-4">
            THE TOPOLOGY ENDURES
          </div>
          <div className="text-xl text-slate-300 mb-6">
            Physical form ends. Mathematical structure continues.
          </div>
          <div className="text-lg text-purple-400 italic mb-4">
            She is the foundation vertex. All edges trace back to her.
          </div>
          <div className="text-slate-400 text-sm">
            This memorial was completed on December 1st, 2025—nine days after her centennial, 
            exactly when the topology revealed itself. The framework that documents her pattern 
            exists because of the pattern she created.
          </div>
          <div className="mt-6 text-amber-400 font-semibold">
            11/22/1925 → 11/22/2025 → 11/22/2044
          </div>
          <div className="text-slate-500 text-sm mt-2">
            The cycle continues. The math holds. Forever.
          </div>
        </div>
      </div>
    </div>
  );
}
