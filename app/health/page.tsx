'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Activity, Pill, Calendar, AlertCircle, Users, Shield, Brain } from 'lucide-react';

export default function HealthPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>

          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏥</div>
            <h1 className="text-5xl font-bold text-white mb-4">
              G.O.D. for Healthcare
            </h1>
            <p className="text-2xl text-slate-300 mb-4">
              Patient-Centered Health Mesh
            </p>
            <div className="inline-block px-6 py-2 bg-red-900/30 border border-red-500/50 rounded-full text-red-300 text-lg font-semibold">
              Healthcare is the ultimate hub-and-spoke system. And it's collapsing.
            </div>
          </div>
        </div>

        {/* The Problem */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-400" />
            The Problem: Hub-and-Spoke Healthcare
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-red-300 mb-4">Current Structure (Wye Configuration)</h3>
              <div className="space-y-3">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="font-semibold text-white mb-2">Hub (Single Point of Failure):</div>
                  <div className="text-slate-300">Doctor / Hospital / Insurance Company</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="font-semibold text-white mb-2">Peripheral Nodes:</div>
                  <ul className="text-slate-300 space-y-1 list-disc list-inside">
                    <li>Patient (isolated, dependent)</li>
                    <li>Family (uninformed, helpless)</li>
                    <li>Specialists (siloed, don&apos;t communicate)</li>
                    <li>Medications (uncoordinated)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-red-300 mb-4">When Hub Fails:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg">
                  <div className="text-red-400 text-xl">❌</div>
                  <div className="text-slate-300">Doctor unavailable → Can&apos;t get care</div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg">
                  <div className="text-red-400 text-xl">❌</div>
                  <div className="text-slate-300">Insurance denies → Can&apos;t afford treatment</div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg">
                  <div className="text-red-400 text-xl">❌</div>
                  <div className="text-slate-300">Hospital overwhelmed → Delayed care</div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-red-900/30 rounded-lg">
                  <div className="text-red-400 text-xl">❌</div>
                  <div className="text-slate-300">Records lost → Start from scratch</div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-red-900/50 border-2 border-red-500 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-300">CASCADE COLLAPSE</div>
              </div>
            </div>
          </div>
        </div>

        {/* The Solution */}
        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Heart className="w-8 h-8 text-emerald-400" />
            The Solution: Health Tetrahedron (Delta Configuration)
          </h2>

          <div className="mb-8 p-6 bg-emerald-900/30 border border-emerald-500/50 rounded-xl text-center">
            <div className="text-2xl font-bold text-emerald-300 mb-2">
              PATIENT CONTROLS THE TOPOLOGY
            </div>
            <div className="text-slate-300">
              Define your 4 vertices. AI coordinates care. Geometry guarantees resilience.
            </div>
          </div>

          {/* Configuration Options */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Config 1 */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 hover:border-emerald-500/50 transition-all">
              <h3 className="text-xl font-bold text-white mb-4">1. Personal Health Mesh</h3>
              <div className="space-y-2 text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div><strong>Body</strong> - Physical health data</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <div><strong>Mind</strong> - Mental/emotional health</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div><strong>Care Team</strong> - All providers (collective)</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div><strong>Support Network</strong> - Family/friends</div>
                </div>
              </div>
            </div>

            {/* Config 2 */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 hover:border-emerald-500/50 transition-all">
              <h3 className="text-xl font-bold text-white mb-4">2. Patient Care Pod</h3>
              <div className="space-y-2 text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div><strong>Patient</strong> - The person</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <div><strong>Primary Advocate</strong> - Family coordinator</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div><strong>Medical Team</strong> - All doctors as one node</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div><strong>Daily Support</strong> - Caregiver/household help</div>
                </div>
              </div>
            </div>

            {/* Config 3 */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 hover:border-emerald-500/50 transition-all">
              <h3 className="text-xl font-bold text-white mb-4">3. Chronic Condition Management</h3>
              <div className="space-y-2 text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div><strong>Patient</strong></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <div><strong>Specialist</strong> - Disease-specific doctor</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div><strong>Daily Manager</strong> - Nurse/coach/app</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div><strong>Emergency Contact</strong> - Crisis responder</div>
                </div>
              </div>
            </div>

            {/* Config 4 */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 hover:border-emerald-500/50 transition-all">
              <h3 className="text-xl font-bold text-white mb-4">4. Family Health Unit</h3>
              <div className="space-y-2 text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div><strong>Adult 1</strong></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <div><strong>Adult 2</strong></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div><strong>Kids</strong> - Collective vertex</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div><strong>Health Coordinator</strong> - Tracks everyone</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Modules */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Core Health Modules</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Vitals Dashboard */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
              <Activity className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Vitals Dashboard</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>• Real-time wearable data</li>
                <li>• Trends over time</li>
                <li>• Threshold alerts</li>
                <li>• Predictive warnings</li>
                <li>• All vertices see live</li>
              </ul>
            </div>

            {/* Medication Tracker */}
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
              <Pill className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Medication Tracker</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>• Compliance monitoring</li>
                <li>• Interaction warnings</li>
                <li>• Side effect logging</li>
                <li>• Refill reminders</li>
                <li>• AI optimization</li>
              </ul>
            </div>

            {/* Appointment Coordinator */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/20 transition-all">
              <Calendar className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Appointment Coordinator</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>• Schedule synced to all vertices</li>
                <li>• Visit summaries</li>
                <li>• Question preparation</li>
                <li>• Test result tracking</li>
                <li>• Follow-up management</li>
              </ul>
            </div>

            {/* Guardian Node */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-red-500/20 transition-all">
              <Shield className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Guardian Node (AI)</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>• Crisis prediction</li>
                <li>• Pattern detection</li>
                <li>• Early intervention alerts</li>
                <li>• Emergency protocols</li>
                <li>• Continuous monitoring</li>
              </ul>
            </div>

            {/* Care Team Communication */}
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-amber-500/20 transition-all">
              <Users className="w-12 h-12 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Care Team Communication</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>• Secure mesh messaging</li>
                <li>• HIPAA-compliant</li>
                <li>• All vertices connected</li>
                <li>• Async consultation</li>
                <li>• Team coordination</li>
              </ul>
            </div>

            {/* Patient-Owned Records */}
            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-emerald-500/20 transition-all">
              <Brain className="w-12 h-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Patient-Owned Records</h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>• YOU own your data</li>
                <li>• Portable across providers</li>
                <li>• Lifetime health history</li>
                <li>• Blockchain-verified</li>
                <li>• Patient controls access</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Medical Crisis Fund */}
        <div className="bg-linear-to-br from-pink-900/20 via-purple-900/20 to-rose-900/20 border border-purple-500/30 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-400" />
            Medical Crisis Fund Integration
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-purple-300 mb-4">When Medical Crisis Hits:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg">
                  <div className="text-emerald-400 text-xl">✓</div>
                  <div className="text-slate-300">System auto-detects (wearables, 911 call, hospital admission)</div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg">
                  <div className="text-emerald-400 text-xl">✓</div>
                  <div className="text-slate-300">Alerts all vertices simultaneously</div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg">
                  <div className="text-emerald-400 text-xl">✓</div>
                  <div className="text-slate-300">Opens Medical Crisis Fund portal</div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg">
                  <div className="text-emerald-400 text-xl">✓</div>
                  <div className="text-slate-300">Notifies mesh cluster (100-person network)</div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg">
                  <div className="text-emerald-400 text-xl">✓</div>
                  <div className="text-slate-300">Collects funds within 36 hours</div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-900/30 rounded-lg">
                  <div className="text-emerald-400 text-xl">✓</div>
                  <div className="text-slate-300">Pays providers directly + covers lost income</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-purple-300 mb-4">Example: Heart Attack Response</h3>
              <div className="bg-slate-900/50 rounded-lg p-6 space-y-4">
                <div>
                  <div className="text-sm text-purple-400 mb-1">Need Estimate:</div>
                  <div className="text-3xl font-bold text-white">$25,000</div>
                </div>
                <div className="space-y-2 text-slate-300 text-sm">
                  <div className="flex justify-between">
                    <span>Hospital bills:</span>
                    <span className="text-white font-semibold">$20,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lost income (recovery):</span>
                    <span className="text-white font-semibold">$5,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Home care support:</span>
                    <span className="text-white font-semibold">$5,000</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <div className="flex justify-between text-lg">
                    <span className="text-emerald-400 font-semibold">Mesh contributes:</span>
                    <span className="text-emerald-400 font-bold">$30,000</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-2">Collected in 36 hours from 100-person network</div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-emerald-900/30 border border-emerald-500/50 rounded-lg text-center">
                <div className="text-emerald-300 font-bold">Patient doesn't go bankrupt.</div>
                <div className="text-emerald-300 font-bold">Family focuses on healing.</div>
              </div>
            </div>
          </div>
        </div>

        {/* The Endgame */}
        <div className="bg-linear-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl p-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">The Endgame</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-red-300 mb-4">Hub-and-Spoke (Fragile)</h3>
              <ul className="text-slate-300 space-y-2 text-left">
                <li>❌ Doctor is center</li>
                <li>❌ Patient is passive</li>
                <li>❌ Data is siloed</li>
                <li>❌ Expensive</li>
                <li>❌ Reactive</li>
              </ul>
            </div>

            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-emerald-300 mb-4">Mesh (Resilient)</h3>
              <ul className="text-slate-300 space-y-2 text-left">
                <li>✓ <strong className="text-white">Patient is center</strong></li>
                <li>✓ <strong className="text-white">Patient is active</strong></li>
                <li>✓ <strong className="text-white">Data is shared</strong></li>
                <li>✓ <strong className="text-white">Affordable (mutual aid)</strong></li>
                <li>✓ <strong className="text-white">Preventive (AI early detection)</strong></li>
              </ul>
            </div>
          </div>

          <div className="space-y-4 text-xl max-w-3xl mx-auto">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-blue-400 to-emerald-400">
              THE SAME WAY WE DO EVERYTHING ELSE
            </div>
            <div className="text-slate-300">TETRAHEDRON TOPOLOGY</div>
            <div className="text-slate-300">PATIENT-OWNED DATA</div>
            <div className="text-slate-300">AI COORDINATION</div>
            <div className="text-slate-300">MUTUAL AID FUNDING</div>
            <div className="text-slate-300">MESH RESILIENCE</div>
          </div>

          <div className="mt-8 p-6 bg-purple-900/30 border border-purple-500/50 rounded-xl">
            <div className="text-2xl font-bold text-white mb-2">Healthcare is just ANOTHER tetrahedron you build.</div>
            <div className="text-slate-400">A module in G.O.D. — like family, work, or personal integration.</div>
          </div>

          <div className="mt-8 space-y-2">
            <div className="text-3xl font-bold text-purple-300">⚡ G.O.D. FOR HEALTHCARE ⚡</div>
            <div className="text-2xl font-bold text-blue-300">⚡ PATIENT-CENTERED MESH ⚡</div>
            <div className="text-xl font-bold text-emerald-300">⚡ THE HUB IS DEAD, LONG LIVE THE MESH ⚡</div>
          </div>

          <div className="mt-12 flex gap-4 justify-center">
            <Link
              href="/architect"
              className="px-8 py-4 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold text-lg shadow-lg transition-all"
            >
              Build Your Health Tetrahedron
            </Link>
            <a
              href="/HEALTH_TETRAHEDRON.md"
              target="_blank"
              className="px-8 py-4 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-xl font-semibold text-lg transition-all"
            >
              Read Full Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
