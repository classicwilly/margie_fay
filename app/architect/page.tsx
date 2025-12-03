'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Check, Loader2, Zap } from 'lucide-react';

type Step = 'welcome' | 'vertices' | 'edges' | 'protocols' | 'building' | 'flooding' | 'complete';

interface Vertex {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface Edge {
  source: string;
  target: string;
  relationship: string;
  protocol?: string;
}

interface TetrahedronConfig {
  id: string;
  name: string;
  vertices: Vertex[];
  edges: Edge[];
  purpose: string;
}

const VERTEX_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];

const AI_PROMPTS = {
  welcome: [
    "I see you're here to build something.",
    "Not to fix what's broken. To make what works visible.",
    "Tell me: what are the four anchors in your life right now?"
  ],
  vertices: [
    "Good. These four points form your tetrahedron.",
    "Each one connects to all the others. That's what makes it strong.",
    "No single point holds everything. The mesh protects itself."
  ],
  edges: [
    "Now let's define what flows between them.",
    "These connections are where the work happens.",
    "What relationship exists here? What needs to move between these points?"
  ],
  flooding: [
    "Watch what happens when we flood the structure with resin...",
    "New connections forming. Gaps filling. Edges strengthening.",
    "The mesh is taking shape."
  ],
  complete: [
    "Your tetrahedron is built.",
    "It breathes now. Delta ↔ Wye ↔ Delta.",
    "The geometry protects you."
  ]
};

export default function ArchitectPage() {
  const [step, setStep] = useState<Step>('welcome');
  const [vertices, setVertices] = useState<Vertex[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [vertexInput, setVertexInput] = useState('');
  const [edgeInput, setEdgeInput] = useState('');
  const [showEdgeSuggestions, setShowEdgeSuggestions] = useState(false);
  const [tetrahedronName, setTetrahedronName] = useState('');
  const [tetrahedronPurpose, setTetrahedronPurpose] = useState('');
  const [currentEdgeIndex, setCurrentEdgeIndex] = useState(0);
  const [isFlooding, setIsFlooding] = useState(false);
  const [config, setConfig] = useState<TetrahedronConfig | null>(null);

  // AI suggestions based on common patterns
  const vertexSuggestions = [
    { context: 'Family', vertices: ['Me', 'Partner', 'Child 1', 'Child 2'] },
    { context: 'Divorce Co-Parenting', vertices: ['Parent 1', 'Parent 2', 'Child 1', 'Child 2'] },
    { context: 'Work Team', vertices: ['Strategy', 'Execution', 'Feedback', 'Growth'] },
    { context: 'Personal Integration', vertices: ['Body', 'Mind', 'Heart', 'Soul'] },
    { context: 'Startup', vertices: ['Vision', 'Build', 'Measure', 'Learn'] },
    { context: 'Community', vertices: ['Events', 'Resources', 'Communication', 'Action'] }
  ];

  const handleVertexSubmit = (vertexName: string) => {
    if (vertexName.trim() && vertices.length < 4) {
      const newVertex: Vertex = {
        id: `vertex-${vertices.length + 1}`,
        name: vertexName.trim(),
        description: '',
        color: VERTEX_COLORS[vertices.length]
      };
      setVertices([...vertices, newVertex]);
      setVertexInput('');
      
      if (vertices.length === 3) {
        // All 4 vertices defined, move to edges
        setTimeout(() => setStep('edges'), 500);
      }
    }
  };

  const generateEdgePairs = (verts: Vertex[]): Array<[Vertex, Vertex]> => {
    const pairs: Array<[Vertex, Vertex]> = [];
    for (let i = 0; i < verts.length; i++) {
      for (let j = i + 1; j < verts.length; j++) {
        pairs.push([verts[i], verts[j]]);
      }
    }
    return pairs;
  };

  const edgePairs = generateEdgePairs(vertices);
  const currentEdge = edgePairs[currentEdgeIndex];

  const getEdgeSuggestions = (): string[] => {
    if (!currentEdge) return [];
    const [v1, v2] = currentEdge;
    return [
      `Daily communication about ${v1.name.toLowerCase()} and ${v2.name.toLowerCase()}`,
      `Shared decisions affecting both`,
      `Support when one struggles`,
      `Weekly check-ins`,
      `Emergency backup plan`
    ];
  };

  const handleEdgeSubmit = (relationship: string) => {
    if (relationship.trim() && currentEdge) {
      const newEdge: Edge = {
        source: currentEdge[0].id,
        target: currentEdge[1].id,
        relationship: relationship.trim()
      };
      setEdges([...edges, newEdge]);
      
      if (currentEdgeIndex < edgePairs.length - 1) {
        setCurrentEdgeIndex(currentEdgeIndex + 1);
      } else {
        // All edges defined, flood the structure
        setTimeout(() => {
          setStep('flooding');
          floodStructure();
        }, 500);
      }
    }
  };

  const floodStructure = async () => {
    setIsFlooding(true);
    
    // WHITE PHASE: Flood with resin (new connections)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Build complete tetrahedron config
    const newConfig: TetrahedronConfig = {
      id: `tet-${Date.now()}`,
      name: tetrahedronName || `${vertices[0].name}'s Tetrahedron`,
      vertices,
      edges,
      purpose: tetrahedronPurpose || 'Support network'
    };
    
    setConfig(newConfig);
    setIsFlooding(false);
    setStep('complete');
  };

  const handleBuild = () => {
    if (config) {
      localStorage.setItem('tetrahedron_config', JSON.stringify(config));
      window.location.href = '/hub';
    }
  };

  const handleUseSuggestion = (suggestion: string[]) => {
    const newVertices: Vertex[] = suggestion.map((name, i) => ({
      id: `vertex-${i + 1}`,
      name,
      description: '',
      color: VERTEX_COLORS[i]
    }));
    setVertices(newVertices);
    setTimeout(() => setStep('edges'), 500);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <Sparkles className="w-10 h-10 text-purple-400" />
              <h1 className="text-4xl font-bold text-white">BOB</h1>
            </div>
            <p className="text-xl text-slate-400">
              Build On Bedrock - Your AI Co-Architect
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {['Vertices', 'Edges', 'Protocols', 'Build'].map((label, i) => {
              const stepOrder = ['welcome', 'vertices', 'edges', 'protocols', 'building', 'complete'];
              const currentStepIndex = stepOrder.indexOf(step);
              const thisStepIndex = i + 1;
              const isActive = currentStepIndex >= thisStepIndex;
              
              return (
                <div key={label} className="flex-1 flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    isActive ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {isActive && currentStepIndex > thisStepIndex ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      isActive ? 'bg-purple-600' : 'bg-slate-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
          {/* Welcome */}
          {step === 'welcome' && (
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">🏗️</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Let's Build Your Resilience Infrastructure
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                I'll help you define your 4 anchor points, connect them, and generate a working system in minutes.
              </p>
              
              <button
                onClick={() => setStep('vertices')}
                className="px-8 py-4 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all font-semibold text-lg"
              >
                Start Building
              </button>

              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-slate-400 text-sm mb-4">Or try a template:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {vertexSuggestions.map(({ context, vertices: verts }) => (
                    <button
                      key={context}
                      onClick={() => handleUseSuggestion(verts)}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm hover:bg-white/10 transition-all"
                    >
                      {context}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Vertices */}
          {step === 'vertices' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Define Your 4 Vertices
                </h2>
                <p className="text-slate-400">
                  What are the 4 anchor points in your system? These could be people, areas, roles, or needs.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`p-6 rounded-xl border-2 transition-all duration-500 transform ${
                      vertices[i]
                        ? 'bg-purple-900/20 border-purple-500 shadow-lg shadow-purple-500/20 scale-100 animate-in fade-in slide-in-from-bottom-4'
                        : 'bg-white/5 border-white/10 border-dashed scale-95 hover:scale-100 hover:border-white/20'
                    }`}
                  >
                    {vertices[i] ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-purple-400 mb-1">Vertex {i + 1}</div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs text-emerald-400">Stable</span>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-white">{vertices[i].name}</div>
                      </div>
                    ) : (
                      <div className="text-slate-500 text-center py-4">
                        Vertex {i + 1}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {vertices.length < 4 && (
                <div>
                  <label className="block text-white mb-2 font-medium">
                    Vertex {vertices.length + 1} Name:
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={vertexInput}
                      onChange={(e) => setVertexInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleVertexSubmit(vertexInput)}
                      placeholder={`e.g., ${vertexSuggestions[0].vertices[vertices.length]}`}
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleVertexSubmit(vertexInput)}
                      disabled={!vertexInput.trim()}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-semibold transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edges */}
          {step === 'edges' && currentEdge && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Define Edge {currentEdgeIndex + 1} of {edgePairs.length}
                </h2>
                <p className="text-slate-400">
                  How do these vertices connect? What flows between them?
                </p>
              </div>

              <div className="bg-purple-900/20 border border-purple-500/50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-center gap-4">
                  <div className="px-6 py-4 bg-purple-600 rounded-xl text-white font-bold text-lg">
                    {currentEdge[0].name}
                  </div>
                  <div className="text-purple-400 text-2xl">↔</div>
                  <div className="px-6 py-4 bg-purple-600 rounded-xl text-white font-bold text-lg">
                    {currentEdge[1].name}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">
                  What connects these two vertices?
                </label>
                <div className="flex gap-3 mb-3">
                  <input
                    type="text"
                    value={edgeInput}
                    onChange={(e) => setEdgeInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEdgeSubmit(edgeInput)}
                    onFocus={() => setShowEdgeSuggestions(true)}
                    placeholder="e.g., Daily communication, shared decisions, support..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                    autoFocus
                  />
                  <button
                    onClick={() => handleEdgeSubmit(edgeInput)}
                    disabled={!edgeInput.trim()}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-semibold transition-all"
                  >
                    Next
                  </button>
                </div>
                {showEdgeSuggestions && (
                  <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
                    <span className="text-xs text-slate-400 mr-2">Suggestions:</span>
                    {getEdgeSuggestions().map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setEdgeInput(suggestion);
                          setShowEdgeSuggestions(false);
                        }}
                        className="px-3 py-1.5 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-300 text-sm hover:bg-purple-900/50 hover:border-purple-500/50 transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-sm text-slate-400">
                Edges defined: {edges.length} / {edgePairs.length}
              </div>
            </div>
          )}

          {/* Protocols */}
          {step === 'protocols' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Review Your Tetrahedron
                </h2>
                <p className="text-slate-400">
                  Here's what you've built. Ready to generate your system?
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Your 4 Vertices:</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {vertices.map((v, i) => (
                    <div key={v.id} className="px-4 py-3 bg-white/10 rounded-lg">
                      <div className="text-sm text-purple-300">Vertex {i + 1}</div>
                      <div className="text-white font-semibold">{v.name}</div>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-white mb-4">Your 6 Edges:</h3>
                <div className="space-y-2">
                  {edges.map((edge, i) => {
                    const source = vertices.find(v => v.id === edge.source);
                    const target = vertices.find(v => v.id === edge.target);
                    return (
                      <div key={i} className="px-4 py-2 bg-white/10 rounded-lg text-sm">
                        <span className="text-purple-300">{source?.name}</span>
                        <span className="text-slate-400 mx-2">↔</span>
                        <span className="text-purple-300">{target?.name}</span>
                        <span className="text-slate-400 mx-2">:</span>
                        <span className="text-white">{edge.relationship}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setStep('vertices');
                    setVertices([]);
                    setEdges([]);
                    setCurrentEdgeIndex(0);
                  }}
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  Start Over
                </button>
                <button
                  onClick={handleBuild}
                  className="flex-1 px-8 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all font-semibold"
                >
                  Build My System
                </button>
              </div>
            </div>
          )}

          {/* Building */}
          {step === 'building' && (
            <div className="text-center space-y-8 py-12">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-purple-400 mx-auto animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 border-4 border-purple-500/20 rounded-full animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Building Your Infrastructure...
              </h2>
              <div className="space-y-3 max-w-md mx-auto">
                <div className="flex items-center gap-3 text-left p-3 bg-green-900/20 border border-green-500/30 rounded-lg animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="text-green-400 text-xl">✓</div>
                  <div>
                    <div className="font-semibold text-white">Validating topology</div>
                    <div className="text-sm text-slate-400">K₄ complete graph verified</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-left p-3 bg-green-900/20 border border-green-500/30 rounded-lg animate-in fade-in slide-in-from-left-4 duration-500 delay-200">
                  <div className="text-green-400 text-xl">✓</div>
                  <div>
                    <div className="font-semibold text-white">Generating modules</div>
                    <div className="text-sm text-slate-400">Custom interfaces created</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-left p-3 bg-green-900/20 border border-green-500/30 rounded-lg animate-in fade-in slide-in-from-left-4 duration-500 delay-500">
                  <div className="text-green-400 text-xl">✓</div>
                  <div>
                    <div className="font-semibold text-white">Creating edge protocols</div>
                    <div className="text-sm text-slate-400">Relationship flows defined</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-left p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg animate-in fade-in slide-in-from-left-4 duration-500 delay-700">
                  <div className="text-purple-400 text-xl">⚡</div>
                  <div>
                    <div className="font-semibold text-white">Deploying to mesh</div>
                    <div className="text-sm text-slate-400">Broadcasting to distributed network...</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Complete */}
          {step === 'complete' && (
            <div className="space-y-6">
              <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Your Tetrahedron is Live!
                </h2>
                <p className="text-slate-300 text-lg">
                  Your resilience infrastructure is deployed and ready to use.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/50 rounded-xl p-6 shadow-lg shadow-green-500/10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  What You Built:
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">📐</div>
                      <div>
                        <div className="font-bold text-white">4 Vertices</div>
                        <div className="text-sm text-slate-300">Your anchor points: {vertices.map(v => v.name).join(', ')}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🔗</div>
                      <div>
                        <div className="font-bold text-white">6 Edges</div>
                        <div className="text-sm text-slate-300">Complete K₄ connectivity</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">💪</div>
                      <div>
                        <div className="font-bold text-white">0 Single Points of Failure</div>
                        <div className="text-sm text-slate-300">Remove any vertex → system stays connected</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🌐</div>
                      <div>
                        <div className="font-bold text-white">Mesh Ready</div>
                        <div className="text-sm text-slate-300">Can bridge to other tetrahedrons</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <h3 className="text-lg font-bold text-white mb-4">🚀 Next Steps:</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 group cursor-pointer hover:bg-white/5 p-3 rounded-lg transition-all">
                    <div className="text-xl">❤️</div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-purple-300 transition-colors">Set up Memorial Fund protection</div>
                      <div className="text-slate-400">Activate mutual aid for crisis events</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group cursor-pointer hover:bg-white/5 p-3 rounded-lg transition-all">
                    <div className="text-xl">🏥</div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-purple-300 transition-colors">Enable Guardian Node monitoring</div>
                      <div className="text-slate-400">AI health checks on vertex stability</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group cursor-pointer hover:bg-white/5 p-3 rounded-lg transition-all">
                    <div className="text-xl">🌉</div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-purple-300 transition-colors">Find bridge vertices to other meshes</div>
                      <div className="text-slate-400">Scale from 4 → 16 → 64 → ∞</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/"
                  className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all text-center font-medium"
                >
                  Back to Home
                </Link>
                <button
                  onClick={() => {
                    setStep('welcome');
                    setVertices([]);
                    setEdges([]);
                    setCurrentEdgeIndex(0);
                    setShowEdgeSuggestions(false);
                  }}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all font-semibold shadow-lg hover:shadow-purple-500/50"
                >
                  Build Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
