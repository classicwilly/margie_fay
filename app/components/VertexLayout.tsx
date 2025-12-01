'use client';

import Link from 'next/link';
import { VertexConfig, VERTEX_COLORS, VertexType } from '@/app/types/vertex';

interface VertexLayoutProps {
  config: VertexConfig;
  children?: React.ReactNode;
}

export default function VertexLayout({ config, children }: VertexLayoutProps) {
  const colors = VERTEX_COLORS[config.type as VertexType];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Vertex Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <nav className="mb-4">
            <Link 
              href="/" 
              className="text-slate-400 hover:text-white transition-colors"
            >
              &larr; Back to Hub
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: colors.main + '20' }}
            >
              {config.icon}
            </div>
            <div>
              <h1 
                className="text-3xl font-bold"
                style={{ color: colors.main }}
              >
                {config.name} Vertex
              </h1>
              <p className="text-slate-400">{config.description}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Content Area */}
          <div className="lg:col-span-3">
            {children || (
              <>
                {/* Long Description */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8">
                  <p className="text-slate-300 leading-relaxed">
                    {config.longDescription}
                  </p>
                </div>

                {/* Characteristics */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">Characteristics</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {config.characteristics.map((char, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/30 border border-slate-800"
                      >
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: colors.main }}
                        />
                        <span className="text-slate-300">{char}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">Documents</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {config.documents.map((doc) => (
                      <Link
                        key={doc.id}
                        href={doc.path}
                        className="block p-4 rounded-lg border-2 transition-all hover:shadow-lg bg-slate-900/50"
                        style={{ borderColor: '#334155' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = colors.main;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#334155';
                        }}
                      >
                        {doc.category && (
                          <span 
                            className="inline-block px-2 py-0.5 text-xs rounded mb-2"
                            style={{ 
                              backgroundColor: colors.main + '20',
                              color: colors.main 
                            }}
                          >
                            {doc.category}
                          </span>
                        )}
                        <h3 className="font-semibold text-white mb-1">{doc.title}</h3>
                        <p className="text-sm text-slate-400">{doc.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Edge Navigation Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold text-white mb-4">
                Connected Edges
              </h2>
              <div className="space-y-3">
                {config.connectedEdges.map((edge, index) => {
                  const targetColors = VERTEX_COLORS[edge.toVertex];
                  return (
                    <Link
                      key={index}
                      href={edge.path}
                      className="block p-4 rounded-lg border-2 transition-all hover:shadow-md bg-slate-800/50"
                      style={{ borderColor: '#475569' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = targetColors.main;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#475569';
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white text-sm">{edge.title}</h3>
                        <span style={{ color: targetColors.main }}>&rarr;</span>
                      </div>
                      <p className="text-xs text-slate-400">{edge.description}</p>
                    </Link>
                  );
                })}
              </div>

              {/* Other Vertices */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Other Vertices
                </h2>
                <div className="space-y-2">
                  {(['technical', 'emotional', 'practical', 'philosophical'] as const)
                    .filter((v) => v !== config.type)
                    .map((vertexType) => {
                      const vc = VERTEX_COLORS[vertexType];
                      return (
                        <Link
                          key={vertexType}
                          href={'/vertex/' + vertexType}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                        >
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: vc.main }}
                          />
                          <span className="text-slate-300 text-sm capitalize">{vertexType}</span>
                        </Link>
                      );
                    })}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}