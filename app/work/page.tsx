'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, TrendingUp, AlertCircle, Users, DollarSign, Heart, Shield, Bell } from 'lucide-react';

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
            Work Tetrahedron
          </h1>
          <p className="text-2xl text-slate-300 mb-6">
            Career resilience mesh. Boss as bottleneck is dead.
          </p>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            When your boss is toxic → you can&apos;t escape<br/>
            When layoffs come → you&apos;re alone and terrified<br/>
            When you&apos;re burning out → no one sees it coming
            <br/><br/>
            <span className="text-red-400 font-semibold">The hub kills careers.</span>
          </p>
        </div>

        {/* Problem Visualization */}
        <div className="bg-linear-to-br from-red-950/50 to-orange-950/50 border-2 border-red-500/50 rounded-2xl p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <h2 className="text-2xl font-bold text-red-400">Hub-and-Spoke Work Collapse</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                <div className="font-semibold text-red-300 mb-2">Boss Overwhelmed</div>
                <div className="text-sm text-slate-300">12 reports, can&apos;t mentor → you&apos;re invisible → passed over for promotion</div>
              </div>
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                <div className="font-semibold text-red-300 mb-2">Peer Isolation</div>
                <div className="text-slate-300 text-sm">Everyone competing → can&apos;t ask for help → toxic culture → burnout</div>
              </div>
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                <div className="font-semibold text-red-300 mb-2">No Income Stability</div>
                <div className="text-sm text-slate-300">One employer → layoff = catastrophe → savings gone in 60 days</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                <div className="font-semibold text-red-300 mb-2">Burnout Invisible</div>
                <div className="text-sm text-slate-300">Working 60 hours → sleep failing → then breakdown → medical leave</div>
              </div>
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                <div className="font-semibold text-red-300 mb-2">Toxic Workplace</div>
                <div className="text-sm text-slate-300">Boss takes credit → public criticism → can&apos;t leave (need money) → damaged</div>
              </div>
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                <div className="font-semibold text-red-300 mb-2">Career Pivot Terrifying</div>
                <div className="text-sm text-slate-300">Alone in dark → no network → imposter syndrome → give up, stay miserable</div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-red-950/80 border-l-4 border-red-400 rounded">
            <div className="font-bold text-red-200 mb-1">Result: CASCADE COLLAPSE</div>
            <div className="text-slate-300 text-sm">
              Hub fails → career dies → income stops → you believe you&apos;re unemployable
            </div>
          </div>
        </div>

        {/* Solution: The Mesh */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 bg-linear-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
            The Solution: Work Mesh (K₄)
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Configuration 1: Employee */}
            <div className="bg-linear-to-br from-blue-900/30 to-green-900/30 border border-blue-500/50 rounded-xl p-6 hover:border-blue-400/50 transition-all">
              <div className="text-3xl mb-3">💼</div>
              <h3 className="text-lg font-bold mb-3 text-blue-300">Employee Support</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-blue-300">You:</span> Track burnout, skills, goals</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-green-300">Manager:</span> Resources, advocacy</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-purple-300">Mentor:</span> Career strategy, long-term</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-amber-300">Peer Ally:</span> Collaboration, support</div>
                </div>
              </div>
            </div>

            {/* Configuration 2: Freelancer */}
            <div className="bg-linear-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/50 rounded-xl p-6 hover:border-purple-400/50 transition-all">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-lg font-bold mb-3 text-purple-300">Freelancer Collective</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-blue-300">Freelancer 1:</span> Web dev specialist</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-green-300">Freelancer 2:</span> Designer, brand expert</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-purple-300">Freelancer 3:</span> Content strategist</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-amber-300">Freelancer 4:</span> PM, client relations</div>
                </div>
              </div>
            </div>

            {/* Configuration 3: Startup */}
            <div className="bg-linear-to-br from-green-900/30 to-cyan-900/30 border border-green-500/50 rounded-xl p-6 hover:border-green-400/50 transition-all">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-lg font-bold mb-3 text-green-300">Startup Co-founders</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-blue-300">CEO:</span> Vision, fundraising</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-green-300">CTO:</span> Product, engineering</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-purple-300">COO:</span> Operations, team</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-amber-300">CFO:</span> Finance, legal</div>
                </div>
              </div>
            </div>

            {/* Configuration 4: Career Transition */}
            <div className="bg-linear-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/50 rounded-xl p-6 hover:border-amber-400/50 transition-all">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-bold mb-3 text-amber-300">Career Transition</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-blue-300">You:</span> Pivoting industries</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-green-300">Career Coach:</span> Resume, interviews</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-purple-300">Industry Contact:</span> Insider perspective</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-amber-300">Accountability:</span> Emotional support</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-green-950/50 to-blue-950/50 border-2 border-green-500/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-400" />
              <div className="text-xl font-bold text-green-300">NO SINGLE POINT OF FAILURE</div>
            </div>
            <div className="text-slate-300">
              When boss toxic → Mentor + Peer help you exit safely<br/>
              When burnout approaching → All 3 see early signs, intervene<br/>
              When layoff coming → Network mobilizes, you land softly<br/>
              <span className="text-green-400 font-semibold mt-2 block">The mesh catches you.</span>
            </div>
          </div>
        </div>

        {/* Core Modules */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Core Modules</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Module 1 */}
            <div className="bg-linear-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-xl p-6 hover:border-blue-400/50 transition-all">
              <TrendingUp className="w-10 h-10 text-blue-400 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-blue-300">Skills Tracker</h3>
              <p className="text-slate-400 text-sm mb-3">
                What you know, what you&apos;re learning, what you need. Skills gap analysis for next role.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Skills inventory (hard + soft skills)</li>
                <li>• Proficiency levels (beginner → expert)</li>
                <li>• Skills in demand (what employers want)</li>
                <li>• Action plan (courses, projects, mentorship)</li>
              </ul>
            </div>

            {/* Module 2 */}
            <div className="bg-linear-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-xl p-6 hover:border-red-400/50 transition-all">
              <Heart className="w-10 h-10 text-red-400 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-red-300">Burnout Monitor</h3>
              <p className="text-slate-400 text-sm mb-3">
                Early warning system. Detects burnout before breakdown.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Work hours (creeping up from 40 to 60?)</li>
                <li>• Sleep quality (deteriorating?)</li>
                <li>• Mood tracking (stressed every day?)</li>
                <li>• Alert all vertices when crisis detected</li>
              </ul>
            </div>

            {/* Module 3 */}
            <div className="bg-linear-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 transition-all">
              <Briefcase className="w-10 h-10 text-purple-400 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-purple-300">Project Portfolio</h3>
              <p className="text-slate-400 text-sm mb-3">
                Show what you&apos;ve built. Quantifiable impact. Interview stories ready.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Project cards (role, skills, impact)</li>
                <li>• Quantified results (revenue, performance, time saved)</li>
                <li>• Portfolio website generator</li>
                <li>• Promotion proof of impact</li>
              </ul>
            </div>

            {/* Module 4 */}
            <div className="bg-linear-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6 hover:border-green-400/50 transition-all">
              <Users className="w-10 h-10 text-green-400 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-green-300">Network Map</h3>
              <p className="text-slate-400 text-sm mb-3">
                Professional relationships visualized. Touch-point reminders. Introduction pathways.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Contact cards (name, role, company, last contact)</li>
                <li>• Relationship strength (strong/medium/weak)</li>
                <li>• Job hunting: Filter by target company</li>
                <li>• Network health monitoring</li>
              </ul>
            </div>

            {/* Module 5 */}
            <div className="bg-linear-to-br from-amber-900/20 to-yellow-900/20 border border-amber-500/30 rounded-xl p-6 hover:border-amber-400/50 transition-all">
              <DollarSign className="w-10 h-10 text-amber-400 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-amber-300">Income Stability Dashboard</h3>
              <p className="text-slate-400 text-sm mb-3">
                Track runway, diversify income, plan for gaps. Freelancer income cliff detection.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Primary + secondary income tracking</li>
                <li>• Runway calculation (months until $0)</li>
                <li>• Income diversity risk assessment</li>
                <li>• Pipeline health (booked work next 60 days)</li>
              </ul>
            </div>

            {/* Module 6 */}
            <div className="bg-linear-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-400/50 transition-all">
              <AlertCircle className="w-10 h-10 text-cyan-400 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-cyan-300">Toxic Workplace Detector</h3>
              <p className="text-slate-400 text-sm mb-3">
                Quantify toxicity. Exit plan coordination. 90-day clean escape.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Physical signals (sleep, headaches, stress)</li>
                <li>• Emotional signals (dread, crying, anxiety)</li>
                <li>• Behavioral signals (procrastination, sick days)</li>
                <li>• Toxicity score + exit plan if {">"}6/10</li>
              </ul>
            </div>

            {/* Module 7 */}
            <div className="bg-linear-to-br from-indigo-900/20 to-violet-900/20 border border-indigo-500/30 rounded-xl p-6 hover:border-indigo-400/50 transition-all">
              <Bell className="w-10 h-10 text-indigo-400 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-indigo-300">Guardian Node AI</h3>
              <p className="text-slate-400 text-sm mb-3">
                Predict burnout, layoffs, income cliffs. Early intervention before crisis.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Burnout prediction (weeks before crash)</li>
                <li>• Layoff risk score (company + role data)</li>
                <li>• Income cliff detection (freelancers)</li>
                <li>• Alert all vertices, coordinate response</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Work Crisis Fund Example */}
        <div className="bg-linear-to-br from-amber-950/50 to-orange-950/50 border-2 border-amber-500/50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-amber-300">Work Crisis Fund Integration</h2>
          <p className="text-slate-300 mb-6">
            When layoff hits, toxic workplace requires immediate exit, or freelance income crashes, Memorial Fund activates. 
            Mesh covers 2-3 months expenses. You land on your feet, not in catastrophe.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-amber-900/30 border border-amber-500/30 rounded-xl p-6">
              <h3 className="font-bold text-amber-200 mb-3">Example: Layoff Bridge</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Worker: Jordan (software engineer)</span>
                </div>
                <div className="flex justify-between">
                  <span>Need: 3 months runway</span>
                  <span className="font-semibold text-amber-300">$15,000</span>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  • Rent: $2,000/mo × 3 = $6,000<br/>
                  • Bills: $1,500/mo × 3 = $4,500<br/>
                  • Health insurance (COBRA): $1,800<br/>
                  • Job search costs: $700<br/>
                  • Emergency buffer: $2,000
                </div>
              </div>
            </div>

            <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-6">
              <h3 className="font-bold text-green-200 mb-3">Mesh Response</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Mesh size:</span>
                  <span className="font-semibold">60 people</span>
                </div>
                <div className="flex justify-between">
                  <span>Collected:</span>
                  <span className="font-semibold text-green-300">$17,200</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-semibold text-green-300">48 hours</span>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  58 contributors ($50-$1,000 each)<br/>
                  → Took 2 weeks to recover from burnout<br/>
                  → 6 weeks focused job search (not desperate)<br/>
                  → 3 offers, negotiated from strength<br/>
                  → New job: $140K (was $110K, +27%)
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-950/50 border-l-4 border-green-400 rounded">
            <div className="font-semibold text-green-300 mb-1">Mesh Gives You Power</div>
            <div className="text-slate-400 text-sm">
              Without mesh: Take first desperate offer ($95K), lower than before layoff<br/>
              With mesh: Take RIGHT offer ($140K), 27% raise + better culture<br/>
              <span className="text-green-400 font-semibold">Memorial Fund = Negotiating power</span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="text-center space-y-4">
          <Link 
            href="/architect" 
            className="inline-block bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105"
          >
            Build Your Work Tetrahedron →
          </Link>
          
          <div>
            <Link 
              href="/WORK_TETRAHEDRON.md" 
              className="text-blue-400 hover:text-blue-300 underline text-sm"
            >
              Read Full Documentation
            </Link>
          </div>

          <div className="pt-6 text-slate-500 text-sm italic">
            "Boss as bottleneck is dead. Build the mesh."
          </div>
        </div>
      </div>
    </div>
  );
}
