'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Users, Wrench, Shield, Plus, Search } from 'lucide-react';
import type { CommunityEvent, Resource, MeshMetrics } from '@/modules/community/CommunityModule';

interface CommunityModuleInterface {
  getMeshMetrics(): Promise<MeshMetrics>;
  loadDemoData(): Promise<void>;
  getUpcomingEvents(): Promise<CommunityEvent[]>;
  searchResources(query: string): Promise<Resource[]>;
}

interface CommunityViewProps {
  module: CommunityModuleInterface;
}

export default function CommunityView({ module }: CommunityViewProps) {
  const [activeTab, setActiveTab] = useState<'events' | 'resources' | 'directory' | 'metrics'>('events');
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [metrics, setMetrics] = useState<MeshMetrics | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Load demo data if empty
      const currentMetrics = await module.getMeshMetrics();
      if (currentMetrics.totalFamilies === 0) {
        await module.loadDemoData();
      }

      const upcomingEvents = await module.getUpcomingEvents();
      const allResources = await module.searchResources('');
      const meshMetrics = await module.getMeshMetrics();

      setEvents(upcomingEvents);
      setResources(allResources);
      setMetrics(meshMetrics);
    } catch (error) {
      console.error('Failed to load community data:', error);
    }
  }

  const tabs = [
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'resources', label: 'Resources', icon: Wrench },
    { id: 'directory', label: 'Directory', icon: Users },
    { id: 'metrics', label: 'Mesh Health', icon: Shield }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-white/10">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'events'|'resources'|'directory'|'metrics')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-green-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Upcoming Events</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white transition-colors">
              <Plus className="w-4 h-4" />
              Create Event
            </button>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-300 mb-2">No upcoming events</p>
              <p className="text-slate-500 text-sm">Create your first community gathering</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map(event => (
                <div
                  key={event.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{event.title}</h4>
                      <p className="text-slate-300 text-sm">{event.description}</p>
                    </div>
                    {event.recurring && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                        {event.recurring}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                    <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                    <span>📍 {event.location}</span>
                    <span>👤 Hosted by {event.hostFamily}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400">{event.attendees.length} attending</span>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white text-sm transition-colors">
                      RSVP
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tools, skills, or resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-green-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-white transition-colors">
              <Plus className="w-4 h-4" />
              Add Resource
            </button>
          </div>

          {resources.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
              <Wrench className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-300 mb-2">No resources shared yet</p>
              <p className="text-slate-500 text-sm">Be the first to share a tool or skill</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map(resource => (
                <div
                  key={resource.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">
                          {resource.type === 'tool' ? '🔧' : 
                           resource.type === 'skill' ? '🎓' :
                           resource.type === 'space' ? '🏠' :
                           resource.type === 'transportation' ? '🚗' : '📦'}
                        </span>
                        <h4 className="text-lg font-semibold text-white">{resource.name}</h4>
                      </div>
                      <p className="text-slate-300 text-sm mb-2">{resource.description}</p>
                    </div>
                    {resource.available && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                        Available
                      </span>
                    )}
                  </div>

                  <div className="border-t border-white/10 pt-3 mt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Owner: {resource.owner}</span>
                      {resource.borrowable && (
                        <button className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-white text-xs transition-colors">
                          Request
                        </button>
                      )}
                    </div>
                    {resource.conditions && (
                      <p className="text-slate-500 text-xs mt-2">{resource.conditions}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Directory Tab */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-300 mb-2">Community Directory</p>
            <p className="text-slate-500 text-sm">Privacy-controlled member directory coming soon</p>
          </div>
        </div>
      )}

      {/* Metrics Tab */}
      {activeTab === 'metrics' && metrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{metrics.totalFamilies}</div>
              <div className="text-sm text-slate-400">Total Families</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{metrics.anchorFamilies}</div>
              <div className="text-sm text-slate-400">Anchor Families</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{metrics.activeConnections}</div>
              <div className="text-sm text-slate-400">Active Members</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-amber-400 mb-2">{metrics.eventsThisMonth}</div>
              <div className="text-sm text-slate-400">Events This Month</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{metrics.resourcesShared}</div>
              <div className="text-sm text-slate-400">Resources Shared</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                {Math.round(metrics.resilience * 100)}%
              </div>
              <div className="text-sm text-slate-400">Mesh Resilience</div>
            </div>
          </div>

          {/* Resilience Explanation */}
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-green-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Mesh Resilience</h4>
                <p className="text-slate-300 text-sm mb-3">
                  A resilient community has 4+ anchor families who commit to stability. 
                  This ensures the network can survive if any one family moves or becomes unavailable.
                </p>
                <div className="text-sm text-slate-400">
                  <strong className="text-green-400">Target:</strong> 4 anchor families = 100% resilience
                </div>
                {metrics.anchorFamilies < 4 && (
                  <div className="mt-3 text-sm text-amber-300">
                    ⚠️ Need {4 - metrics.anchorFamilies} more anchor {metrics.anchorFamilies === 3 ? 'family' : 'families'} for full resilience
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
