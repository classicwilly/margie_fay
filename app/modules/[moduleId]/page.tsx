'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, Heart, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';

// Import module implementations
import { CalendarModule } from '@/modules/calendar/CalendarModule';
import { StatusModule } from '@/modules/status/StatusModule';
import { ParentingModule } from '@/modules/parenting/ParentingModule';
import { KidsModule } from '@/modules/kids/KidsModule';
import { CreatorModule } from '@/modules/creator/CreatorModule';
import { MemorialModule } from '@/modules/memorial/MemorialModule';
import { CommunityModule } from '@/modules/community/CommunityModule';

// Import hub services
import { hub } from '@/lib/hub/hub';
import { moduleManager } from '@/lib/hub/moduleManager';
import type { Module } from '@/lib/types/module';

// Import view components
import CalendarView from '@/app/components/modules/CalendarView';
import StatusView from '@/app/components/modules/StatusView';
import ParentingView from '@/app/components/modules/ParentingView';
import KidsView from '@/app/components/modules/KidsView';
import CreatorView from '@/app/components/modules/CreatorView';
import MemorialView from '@/app/components/modules/MemorialView';
import CommunityView from '@/app/components/modules/CommunityView';

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;
  
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadModule();
  }, [moduleId]);

  async function loadModule() {
    try {
      setLoading(true);
      setError(null);

      // Initialize hub with default user
      await hub.initialize('default-user');

      // Load module based on ID
      let moduleInstance: Module | null = null;
      
      switch (moduleId) {
        case 'calendar':
          moduleInstance = new CalendarModule();
          break;
        case 'status':
          moduleInstance = new StatusModule();
          break;
        case 'parenting':
          moduleInstance = new ParentingModule();
          break;
        case 'kids':
          moduleInstance = new KidsModule();
          break;
        case 'creator':
          moduleInstance = new CreatorModule();
          break;
        case 'memorial':
          moduleInstance = new MemorialModule();
          break;
        case 'community':
          moduleInstance = new CommunityModule();
          break;
        default:
          setError(`Module "${moduleId}" not found`);
          return;
      }

      // Initialize module
      await moduleInstance.initialize();

      setModule(moduleInstance);
    } catch (err) {
      console.error('Failed to load module:', err);
      setError(err instanceof Error ? err.message : 'Failed to load module');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading module...</p>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Module Not Found</h1>
          <p className="text-slate-300 mb-6">{error || 'This module does not exist.'}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Get module icon
  const getModuleIcon = () => {
    switch (moduleId) {
      case 'calendar':
        return <CalendarIcon className="w-8 h-8" />;
      case 'status':
        return <Heart className="w-8 h-8" />;
      case 'parenting':
        return <Users className="w-8 h-8" />;
      case 'kids':
        return <Sparkles className="w-8 h-8" />;
      default:
        return <div className="w-8 h-8" />;
    }
  };

  // Get module color scheme
  const getColorScheme = () => {
    switch (moduleId) {
      case 'calendar':
        return 'from-blue-600 to-cyan-600';
      case 'status':
        return 'from-red-600 to-orange-600';
      case 'parenting':
        return 'from-green-600 to-emerald-600';
      case 'kids':
        return 'from-purple-600 to-pink-600';
      default:
        return 'from-slate-600 to-slate-700';
    }
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

          <div className={`w-full rounded-2xl bg-linear-to-r ${getColorScheme()} text-white shadow-2xl p-8`}>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="bg-white/20 rounded-xl p-3">
                {getModuleIcon()}
              </div>
              <h1 className="text-3xl font-bold">{module.metadata.name}</h1>
              {module.metadata.iconEmoji && (
                <span className="text-3xl">{module.metadata.iconEmoji}</span>
              )}
            </div>
            
            <p className="text-center text-white/90 text-lg mb-4">{module.metadata.description}</p>
            
            <div className="flex items-center justify-center gap-3">
              {module.metadata.protocolFrequency && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-medium">
                  🎵 {module.metadata.protocolFrequency}
                </span>
              )}
              <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-medium">
                v{module.metadata.version}
              </span>
              {module.metadata.tetrahedral && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-medium">
                  ▲ Tetrahedral
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Module Tetrahedron */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Module Structure</h2>
            {module.metadata.vertexBalance && (
              <div className="text-sm text-slate-400">
                Balance: {Object.entries(module.metadata.vertexBalance)
                  .filter(([_, v]) => v > 0)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(' • ')}
              </div>
            )}
          </div>
          
          {/* Four Vertices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {module.vertices.map((vertex, index) => {
              const categoryColors = {
                technical: 'from-blue-600 to-cyan-600',
                practical: 'from-green-600 to-emerald-600',
                emotional: 'from-purple-600 to-pink-600',
                philosophical: 'from-amber-600 to-orange-600'
              };
              
              return (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full bg-linear-to-r ${categoryColors[vertex.category]} flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{vertex.name}</h3>
                      <p className="text-slate-300 text-sm mb-4">{vertex.description}</p>
                      
                      {/* Vertex Category Badge */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 bg-linear-to-r ${categoryColors[vertex.category]} rounded-full text-xs text-white font-medium`}>
                          {vertex.category}
                        </span>
                        {vertex.data && Object.keys(vertex.data).length > 0 && (
                          <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-slate-300">
                            {Object.keys(vertex.data).length} data points
                          </span>
                        )}
                      </div>
                      
                      {/* VPI: Vertex Metadata Display */}
                      {vertex.metadata && Object.keys(vertex.metadata).length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="space-y-2">
                            {Object.entries(vertex.metadata).slice(0, 3).map(([key, value]) => (
                              <div key={key} className="text-xs text-slate-400">
                                <span className="font-medium text-slate-300 capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                                </span>{' '}
                                {Array.isArray(value) 
                                  ? `${value.length} items`
                                  : typeof value === 'object'
                                  ? `${Object.keys(value).length} properties`
                                  : String(value)}
                              </div>
                            ))}
                            {Object.keys(vertex.metadata).length > 3 && (
                              <div className="text-xs text-slate-500">
                                +{Object.keys(vertex.metadata).length - 3} more capabilities...
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Edges Info with VPI */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">🔗 Tetrahedral Connections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-purple-400">{module.edges.length}</div>
                <div className="text-sm text-slate-300">
                  <div className="font-medium">Complete Graph Edges</div>
                  <div className="text-slate-500">K₄ connectivity pattern</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-blue-400">4</div>
                <div className="text-sm text-slate-300">
                  <div className="font-medium">Structural Vertices</div>
                  <div className="text-slate-500">Minimum resilience system</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Module Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
          {moduleId === 'calendar' && module instanceof CalendarModule && (
            <CalendarView module={module} />
          )}
          {moduleId === 'status' && module instanceof StatusModule && (
            <StatusView module={module} />
          )}
          {moduleId === 'parenting' && module instanceof ParentingModule && (
            <ParentingView module={module} />
          )}
          {moduleId === 'kids' && module instanceof KidsModule && (
            <KidsView module={module} />
          )}
          {moduleId === 'creator' && module instanceof CreatorModule && (
            <CreatorView />
          )}
          {moduleId === 'community' && module instanceof CommunityModule && (
            <CommunityView module={module} />
          )}
        </div>

        {/* Module Actions */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/hub"
              className="px-6 py-4 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-all font-medium text-center"
            >
              Go to Hub
            </Link>
            
            <button
              onClick={() => console.log('Configure module')}
              className="px-6 py-4 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all font-medium"
            >
              Configure
            </button>
            
            <button
              onClick={() => router.push('/hub')}
              className="px-6 py-4 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all font-medium"
            >
              View Hub
            </button>
          </div>
        </div>

        {/* Module-Specific UI would go here */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Module Interface</h2>
          <p className="text-slate-300 mb-6">
            Module-specific UI components will be rendered here. Each module can define its own interface
            for interacting with its vertices and managing its data.
          </p>
          
          {/* Placeholder for module-specific components */}
          <div className="bg-slate-800/50 rounded-xl p-8 text-center border-2 border-dashed border-slate-700">
            <p className="text-slate-400 text-sm">
              📦 Module UI components coming soon...
            </p>
          </div>
        </div>

        {/* Creator Module Custom View */}
        {moduleId === 'creator' && module instanceof CreatorModule && (
          <CreatorView />
        )}

        {/* Memorial Module Custom View */}
        {moduleId === 'memorial' && module instanceof MemorialModule && (
          <MemorialView />
        )}
      </div>
    </div>
  );
}
