'use client';

import { useState } from 'react';
import { Users, Circle, CheckCircle2, XCircle, AlertCircle, Zap, Eye, Play } from 'lucide-react';
import Link from 'next/link';
import { useMeshData } from '@/lib/hooks/useMeshData';

type VertexStatus = 'complete' | 'pending' | 'missing';
type EdgeStatus = 'connected' | 'weak' | 'broken';

interface Vertex {
  id: string;
  name: string;
  role: string;
  color: string;
  status: VertexStatus;
  lastActive?: string;
}

interface Edge {
  from: string;
  to: string;
  status: EdgeStatus;
  strength: number; // 0-100
}

interface Tetrahedron {
  id: string;
  name: string;
  type: 'coparenting' | 'education' | 'health' | 'work';
  vertices: Vertex[];
  edges: Edge[];
  meshHealth: number; // 0-100
  isComplete: boolean;
}

export default function MeshVisualizationPage() {
  const { tetrahedrons: realTetrahedrons, loading, error } = useMeshData();
  
  // Demo data for now - will map realTetrahedrons to this format
  const [tetrahedrons] = useState<Tetrahedron[]>([
    {
      id: '1',
      name: 'Co-parenting Mesh',
      type: 'coparenting',
      meshHealth: 75,
      isComplete: true,
      vertices: [
        { id: 'v1', name: 'You', role: 'Parent 1', color: 'blue', status: 'complete', lastActive: '2 min ago' },
        { id: 'v2', name: 'Alex', role: 'Parent 2', color: 'purple', status: 'complete', lastActive: '1 hour ago' },
        { id: 'v3', name: 'Emma', role: 'Child', color: 'green', status: 'complete', lastActive: '5 min ago' },
        { id: 'v4', name: 'Dr. Chen', role: 'Therapist', color: 'amber', status: 'complete', lastActive: '2 days ago' }
      ],
      edges: [
        { from: 'v1', to: 'v2', status: 'connected', strength: 85 },
        { from: 'v1', to: 'v3', status: 'connected', strength: 95 },
        { from: 'v1', to: 'v4', status: 'connected', strength: 70 },
        { from: 'v2', to: 'v3', status: 'connected', strength: 90 },
        { from: 'v2', to: 'v4', status: 'weak', strength: 45 },
        { from: 'v3', to: 'v4', status: 'connected', strength: 80 }
      ]
    },
    {
      id: '2',
      name: 'Education Tetrahedron',
      type: 'education',
      meshHealth: 60,
      isComplete: false,
      vertices: [
        { id: 'v1', name: 'Emma', role: 'Student (leads)', color: 'blue', status: 'complete', lastActive: '5 min ago' },
        { id: 'v2', name: 'You', role: 'Parent', color: 'purple', status: 'complete', lastActive: '2 min ago' },
        { id: 'v3', name: 'Ms. Rodriguez', role: 'Teacher', color: 'green', status: 'pending', lastActive: 'Invited' },
        { id: 'v4', name: 'Tutor', role: 'Learning Specialist', color: 'amber', status: 'missing', lastActive: 'Not set up' }
      ],
      edges: [
        { from: 'v1', to: 'v2', status: 'connected', strength: 100 },
        { from: 'v1', to: 'v3', status: 'weak', strength: 30 },
        { from: 'v1', to: 'v4', status: 'broken', strength: 0 },
        { from: 'v2', to: 'v3', status: 'weak', strength: 40 },
        { from: 'v2', to: 'v4', status: 'broken', strength: 0 },
        { from: 'v3', to: 'v4', status: 'broken', strength: 0 }
      ]
    }
  ]);

  const getStatusIcon = (status: VertexStatus) => {
    switch (status) {
      case 'complete': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'missing': return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getEdgeColor = (status: EdgeStatus) => {
    switch (status) {
      case 'connected': return 'rgb(34, 197, 94)'; // green-500
      case 'weak': return 'rgb(234, 179, 8)'; // yellow-500
      case 'broken': return 'rgb(239, 68, 68)'; // red-500
    }
  };

  const TetrahedronVisualization = ({ tetra }: { tetra: Tetrahedron }) => {
    // Simple 2D representation of K4 graph
    // Positions for 4 vertices in a tetrahedron-like layout
    const positions = [
      { x: 150, y: 50 },  // top
      { x: 50, y: 200 },  // bottom-left
      { x: 250, y: 200 }, // bottom-right
      { x: 150, y: 250 }  // center-bottom
    ];

    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {tetra.name}
              {tetra.isComplete && <Zap className="w-5 h-5 text-yellow-400" />}
            </h3>
            <p className="text-sm text-slate-400">
              {tetra.isComplete ? 'Complete K₄ mesh' : 'Incomplete mesh - strengthen connections'}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${
              tetra.meshHealth >= 80 ? 'text-green-400' :
              tetra.meshHealth >= 60 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {tetra.meshHealth}%
            </div>
            <div className="text-xs text-slate-400">Mesh Health</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* SVG Visualization */}
          <div className="bg-slate-900 rounded-lg p-4 flex items-center justify-center">
            <svg width="300" height="300" className="w-full h-auto">
              {/* Draw edges first (behind vertices) */}
              {tetra.edges.map((edge, i) => {
                const fromIndex = tetra.vertices.findIndex(v => v.id === edge.from);
                const toIndex = tetra.vertices.findIndex(v => v.id === edge.to);
                
                if (fromIndex === -1 || toIndex === -1) return null;

                return (
                  <line
                    key={i}
                    x1={positions[fromIndex].x}
                    y1={positions[fromIndex].y}
                    x2={positions[toIndex].x}
                    y2={positions[toIndex].y}
                    stroke={getEdgeColor(edge.status)}
                    strokeWidth={edge.status === 'broken' ? 1 : 2}
                    strokeDasharray={edge.status === 'broken' ? '5,5' : 'none'}
                    opacity={edge.strength / 100}
                  />
                );
              })}

              {/* Draw vertices */}
              {tetra.vertices.map((vertex, i) => (
                <g key={vertex.id}>
                  <circle
                    cx={positions[i].x}
                    cy={positions[i].y}
                    r="30"
                    fill={`rgb(${
                      vertex.color === 'blue' ? '59, 130, 246' :
                      vertex.color === 'purple' ? '168, 85, 247' :
                      vertex.color === 'green' ? '34, 197, 94' :
                      '251, 191, 36'
                    })`}
                    opacity={vertex.status === 'missing' ? 0.3 : 0.8}
                    stroke={vertex.status === 'complete' ? '#22c55e' : 
                            vertex.status === 'pending' ? '#eab308' : '#ef4444'}
                    strokeWidth="3"
                  />
                  <text
                    x={positions[i].x}
                    y={positions[i].y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {vertex.name.split(' ')[0]}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Vertex Details */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-300 mb-2">Vertices</div>
            {tetra.vertices.map((vertex) => (
              <div 
                key={vertex.id}
                className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg"
              >
                <div className={`w-8 h-8 rounded-full bg-${vertex.color}-500 flex items-center justify-center text-white text-xs font-bold`}>
                  {vertex.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white text-sm">{vertex.name}</div>
                  <div className="text-xs text-slate-400">{vertex.role}</div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(vertex.status)}
                  <span className="text-xs text-slate-400">{vertex.lastActive}</span>
                </div>
              </div>
            ))}

            {/* Edge Strength Summary */}
            <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-700">
              <div className="text-sm font-semibold text-slate-300 mb-2">Connection Strength</div>
              <div className="space-y-2">
                {tetra.edges.map((edge, i) => {
                  const from = tetra.vertices.find(v => v.id === edge.from);
                  const to = tetra.vertices.find(v => v.id === edge.to);
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div className="text-xs text-slate-400 flex-1">
                        {from?.name} ↔ {to?.name}
                      </div>
                      <div className="flex-1 bg-slate-800 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            edge.status === 'connected' ? 'bg-green-500' :
                            edge.status === 'weak' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${edge.strength}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-slate-400 w-10 text-right">{edge.strength}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {!tetra.isComplete && (
          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-yellow-400 mb-1">Incomplete Mesh</div>
                <div className="text-sm text-slate-300 mb-3">
                  Your mesh needs all 4 vertices connected to reach full strength.
                </div>
                <div className="flex gap-2">
                  {tetra.vertices.filter(v => v.status === 'pending').length > 0 && (
                    <button className="text-sm bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1.5 rounded transition-colors">
                      Follow up with pending invites
                    </button>
                  )}
                  {tetra.vertices.filter(v => v.status === 'missing').length > 0 && (
                    <button className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded transition-colors">
                      Add missing vertex
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/mesh" className="text-slate-400 hover:text-white">
              <Eye className="w-6 h-6" />
            </Link>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Mesh Visualization
            </h1>
          </div>
          <p className="text-slate-300">
            K₄ complete graphs connecting your support systems.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="text-3xl font-bold text-blue-400">{tetrahedrons.length}</div>
            <div className="text-sm text-slate-400">Active Tetrahedrons</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="text-3xl font-bold text-green-400">
              {tetrahedrons.filter(t => t.isComplete).length}
            </div>
            <div className="text-sm text-slate-400">Complete K₄ Meshes</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="text-3xl font-bold text-purple-400">
              {tetrahedrons.reduce((sum, t) => sum + t.vertices.length, 0)}
            </div>
            <div className="text-sm text-slate-400">Total Vertices</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="text-3xl font-bold text-yellow-400">
              {Math.round(tetrahedrons.reduce((sum, t) => sum + t.meshHealth, 0) / tetrahedrons.length)}%
            </div>
            <div className="text-sm text-slate-400">Avg Mesh Health</div>
          </div>
        </div>

        {/* Tetrahedron Visualizations */}
        <div className="space-y-6">
          {tetrahedrons.map(tetra => (
            <TetrahedronVisualization key={tetra.id} tetra={tetra} />
          ))}
        </div>

        {/* Jitterbug Callout */}
        <div className="mb-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-2 border-purple-500/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Zap className="w-6 h-6 text-purple-400" />
                Watch the Jitterbug
              </h3>
              <p className="text-slate-300 mb-3">
                Your mesh doesn&apos;t stay static. It <strong className="text-white">breathes</strong> between Delta (distributed) and Wye (coordinated).
              </p>
              <p className="text-sm text-slate-400">
                Fuller's transformation showing how resilient systems oscillate between configurations. The star shifts. The center moves.
              </p>
            </div>
            <Link 
              href="/mesh/jitterbug"
              className="flex-shrink-0 ml-6 flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors font-semibold"
            >
              <Play className="w-5 h-5" />
              See Animation
            </Link>
          </div>
        </div>

        {/* What is K₄? */}
        <div className="mt-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Circle className="w-5 h-5 text-blue-400" />
            What is a K₄ Complete Graph?
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
            <div>
              <p className="mb-2">
                <strong className="text-white">K₄ = 4 vertices, all connected.</strong>
              </p>
              <p className="mb-2">
                Every vertex has a direct edge to every other vertex. No intermediaries. No single points of failure.
              </p>
              <p>
                <strong className="text-blue-400">6 edges total:</strong> Each person connected to 3 others = complete mesh.
              </p>
            </div>
            <div>
              <p className="mb-2">
                <strong className="text-white">Why this matters:</strong>
              </p>
              <ul className="space-y-1 text-slate-400">
                <li>• <strong>Distributed support:</strong> Not dependent on one person</li>
                <li>• <strong>Transparent communication:</strong> Everyone sees same info (with your permission)</li>
                <li>• <strong>Resilient system:</strong> If one edge weakens, 5 others hold</li>
                <li>• <strong>Kids know this naturally:</strong> We just gave you back the infrastructure</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
