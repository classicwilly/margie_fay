'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Settings, Download, Upload } from 'lucide-react';
import Link from 'next/link';

// Import hub services
import { hub } from '@/lib/hub/hub';
import { moduleManager } from '@/lib/hub/moduleManager';
import { moduleRegistry } from '@/lib/hub/moduleRegistry';
import type { Module, ModuleMetadata } from '@/lib/types/module';

export default function HubPage() {
  const router = useRouter();
  const [hubInitialized, setHubInitialized] = useState(false);
  const [installedModules, setInstalledModules] = useState<Module[]>([]);
  const [availableModules, setAvailableModules] = useState<ModuleMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeHub();
  }, []);

  async function initializeHub() {
    try {
      setLoading(true);
      
      // Initialize hub with default user
      await hub.initialize('default-user');
      setHubInitialized(true);

      // Get installed modules
      const installed = moduleManager.getInstalledModules();
      setInstalledModules(installed);

      // Get available modules from registry
      const registryData = moduleRegistry.getAll();
      const available = [
        ...registryData.core.map(e => e.metadata), 
        ...registryData.community.map(e => e.metadata), 
        ...registryData.private.map(e => e.metadata)
      ];
      setAvailableModules(available);
    } catch (err) {
      console.error('Failed to initialize hub:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Initializing Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Your Hub</h1>
              <p className="text-slate-300">Central coordination for your protocol</p>
            </div>
            
            <div className="flex gap-3">
              <button aria-label="Settings" className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all">
                <Settings className="w-4 h-4" />
              </button>
              <button aria-label="Export data" className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all">
                <Download className="w-4 h-4" />
              </button>
              <button aria-label="Import data" className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all">
                <Upload className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Your Tetrahedron */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Your Tetrahedron</h2>
          
          {hubInitialized && hub.getTetrahedron() && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hub.getTetrahedron()!.vertices.map((vertex: any, index: number) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => console.log('Edit vertex:', vertex)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{vertex.label}</h3>
                      <p className="text-slate-300 text-sm mb-3">{vertex.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                          {vertex.category}
                        </span>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                          {vertex.state}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Installed Modules */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Installed Modules</h2>
            <button
              onClick={() => router.push('/modules')}
              className="px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Browse Modules
            </button>
          </div>

          {installedModules.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-white mb-2">No Modules Installed</h3>
              <p className="text-slate-400 mb-6">Install modules to extend your protocol's capabilities</p>
              <button
                onClick={() => router.push('/modules')}
                className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all"
              >
                Browse Module Library
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {installedModules.map((module, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => router.push(`/modules/${module.metadata.id}`)}
                >
                  <h3 className="text-lg font-bold text-white mb-2">{module.metadata.name}</h3>
                  <p className="text-slate-300 text-sm mb-4">{module.metadata.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                      v{module.metadata.version}
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Modules */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Available Modules</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableModules
              .filter(m => !installedModules.some(im => im.metadata.id === m.id))
              .map((metadata, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-white">{metadata.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      metadata.category === 'parenting' || metadata.category === 'health'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {metadata.category}
                    </span>
                  </div>
                  
                  <p className="text-slate-300 text-sm mb-4">{metadata.description}</p>
                  
                  <button
                    onClick={() => {
                      console.log('Install module:', metadata.id);
                      router.push(`/modules/${metadata.id}`);
                    }}
                    className="w-full px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all text-sm font-medium"
                  >
                    View Module
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
