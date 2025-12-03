'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Bell, BookOpen, Brain, Calendar, Heart, Users, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
            Education Tetrahedron
          </h1>
          <p className="text-2xl text-slate-300 mb-6">
            Student-centered learning mesh. <span className="text-blue-400 font-bold">KIDS HAVE POWER.</span>
          </p>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            When the teacher is overwhelmed → student falls behind → by the time anyone notices, they're 2 years behind and think they're "stupid."
            <br/><br/>
            <span className="text-red-400 font-semibold">The bottleneck kills learning.</span>
            <br/><br/>
            <span className="text-green-400 font-semibold">The mesh gives students control: lead IEPs, veto interventions, choose partners, own their data.</span>
          </p>
        </div>

        {/* Problem Visualization */}
        <div className="bg-linear-to-br from-red-950/50 to-orange-950/50 border-2 border-red-500/50 rounded-2xl p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <h2 className="text-2xl font-bold text-red-400">Hub-and-Spoke Education Collapse</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                <div className="font-semibold text-red-300 mb-2">Teacher Overwhelmed</div>
                <div className="text-sm text-slate-300">30 students, 1 teacher → can&apos;t individualize → misses early warning signs</div>
              </div>
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                <div className="font-semibold text-red-300 mb-2">Parent Disconnected</div>
                <div className="text-sm text-slate-300">Only hears from school when there&apos;s a problem → can&apos;t help → surprised by report card</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                <div className="font-semibold text-red-300 mb-2">Student Isolated</div>
                <div className="text-sm text-slate-300">Learning alone → doesn&apos;t know what they don&apos;t know → afraid to ask for help</div>
              </div>
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                <div className="font-semibold text-red-300 mb-2">Specialist Reactive</div>
                <div className="text-sm text-slate-300">Called in after failing → no daily context → student sees specialist as "punishment"</div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-red-950/80 border-l-4 border-red-400 rounded">
            <div className="font-bold text-red-200 mb-1">Result: CASCADE COLLAPSE</div>
            <div className="text-slate-300 text-sm">
              Hub fails → learning stops → confidence dies → student believes they're broken
            </div>
          </div>
        </div>

        {/* Solution: The Mesh */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            The Solution: Learning Mesh (K₄)
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Configuration 1: Neurotypical */}
            <div className="bg-linear-to-br from-blue-900/30 to-green-900/30 border border-blue-500/50 rounded-xl p-6 hover:border-blue-400/50 transition-all">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="text-lg font-bold mb-3 text-blue-300">Neurotypical Student</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-blue-300">Student:</span> Controls data sharing, leads conferences, chooses study buddy</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-green-300">Teacher:</span> Guides instruction (student provides feedback)</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-purple-300">Parent:</span> Attends student-led conferences</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-amber-300">Study Buddy:</span> Student-selected peer</div>
                </div>
              </div>
            </div>

            {/* Configuration 2: Neurodivergent */}
            <div className="bg-linear-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/50 rounded-xl p-6 hover:border-purple-400/50 transition-all">
              <div className="text-3xl mb-3">🧩</div>
              <h3 className="text-lg font-bold mb-3 text-purple-300">Neurodivergent (ADHD/Autism)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-blue-300">Student:</span> Leads IEP meetings, vetos accommodations, controls disclosure</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-green-300">Teacher:</span> Implements student-chosen accommodations</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-purple-300">Parent:</span> Advocates WITH student (teen input)</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-amber-300">Specialist:</span> Student-selected expert</div>
                </div>
              </div>
            </div>

            {/* Configuration 3: Struggling */}
            <div className="bg-linear-to-br from-red-900/30 to-orange-900/30 border border-red-500/50 rounded-xl p-6 hover:border-red-400/50 transition-all">
              <div className="text-3xl mb-3">📖</div>
              <h3 className="text-lg font-bold mb-3 text-red-300">Struggling Student</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-blue-300">Student:</span> Tracks own progress, sets goals, vetos ineffective methods</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-green-300">Teacher:</span> Implements interventions (student feedback)</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-purple-300">Parent:</span> Encouragement (student sets boundaries)</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-amber-300">Tutor:</span> Student co-designs lessons</div>
                </div>
              </div>
            </div>

            {/* Configuration 4: Gifted */}
            <div className="bg-linear-to-br from-green-900/30 to-cyan-900/30 border border-green-500/50 rounded-xl p-6 hover:border-green-400/50 transition-all">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-lg font-bold mb-3 text-green-300">Gifted Student</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-blue-300">Student:</span> Designs curriculum, vetos busywork, teaches peers</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-green-300">Teacher:</span> Mentors projects, learns from student</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-purple-300">Parent:</span> Student researches enrichment</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mt-1 flex-shrink-0"></div>
                  <div className="text-slate-300"><span className="font-semibold text-amber-300">Mentor:</span> Student finds expert</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-green-950/50 to-blue-950/50 border-2 border-green-500/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div className="text-xl font-bold text-green-300">NO SINGLE POINT OF FAILURE</div>
            </div>
            <div className="text-slate-300">
              When teacher overwhelmed → Parent + Learning Partner step up<br/>
              When student struggling → All 3 adults see it immediately, coordinate response<br/>
              When parent working late → Teacher + Learning Partner cover check-ins<br/>
              <span className="text-green-400 font-semibold mt-2 block">The mesh catches the student.</span>
            </div>
          </div>
        </div>

        {/* Core Modules */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Core Modules</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Module 1: Learning Dashboard */}
            <div className="bg-linear-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-xl p-6 hover:border-blue-400/50 transition-all">
              <Activity className="w-10 h-10 text-blue-400 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-blue-300">Learning Dashboard</h3>
              <p className="text-slate-400 text-sm mb-3">
                <span className="text-blue-400 font-bold">STUDENT CONTROLS ALL DATA SHARING.</span> Real-time comprehension tracking.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• <span className="text-blue-400">Student sets privacy toggles</span> (who sees grades, comprehension, emotions)</li>
                <li>• Class heatmap anonymous by default (opt-in to reveal name)</li>
                <li>• Student sets own goals + can modify teacher suggestions</li>
                <li>• Progress toward mastery (student owns data)</li>
              </ul>
            </div>

            {/* Module 2: Concept Tracker */}
            <div className="bg-linear-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 transition-all">
              <BookOpen className="w-10 h-10 text-purple-400 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-purple-300">Concept Tracker</h3>
              <p className="text-slate-400 text-sm mb-3">
                Skill tree visualization. Master building blocks before advancing.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Mastery levels (not started → mastered)</li>
                <li>• Prerequisite concept detection</li>
                <li>• Parent sees gaps (knows what to review)</li>
                <li>• Tutor focuses on un-mastered skills</li>
              </ul>
            </div>

            {/* Module 3: Assignment Coordinator */}
            <div className="bg-linear-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6 hover:border-green-400/50 transition-all">
              <Calendar className="w-10 h-10 text-green-400 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-green-300">Assignment Coordinator</h3>
              <p className="text-slate-400 text-sm mb-3">
                No more "I forgot my homework." All vertices see workload.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Break large projects into steps</li>
                <li>• Time estimates per task</li>
                <li>• Parent gets notifications (due in 2 days)</li>
                <li>• Learning Partner sees student's schedule</li>
              </ul>
            </div>

            {/* Module 4: Comprehension Check-ins */}
            <div className="bg-linear-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-xl p-6 hover:border-amber-400/50 transition-all">
              <Zap className="w-10 h-10 text-amber-400 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-amber-300">Comprehension Check-ins</h3>
              <p className="text-slate-400 text-sm mb-3">
                Did they actually learn it? Real-time feedback during lessons.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Students respond via app (teacher sees who's confused)</li>
                <li>• Post-lesson self-assessment (1-5 scale)</li>
                <li>• Flag confusion before it compounds</li>
                <li>• Tutor sees all confusion flags</li>
              </ul>
            </div>

            {/* Module 5: Study Session Logger */}
            <div className="bg-linear-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-400/50 transition-all">
              <Brain className="w-10 h-10 text-cyan-400 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-cyan-300">Study Session Logger</h3>
              <p className="text-slate-400 text-sm mb-3">
                Track what actually works. AI learns optimal study patterns.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Log duration, strategy, distractions</li>
                <li>• AI analyzes: What correlates with better scores?</li>
                <li>• Reports: "You score 15% higher with Pomodoros"</li>
                <li>• All vertices see study analytics</li>
              </ul>
            </div>

            {/* Module 6: Executive Function */}
            <div className="bg-linear-to-br from-red-900/20 to-rose-900/20 border border-red-500/30 rounded-xl p-6 hover:border-red-400/50 transition-all">
              <Users className="w-10 h-10 text-red-400 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-red-300">Executive Function Support</h3>
              <p className="text-slate-400 text-sm mb-3">
                Neurodivergent brains need scaffolding. Consistent systems across contexts.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Task breakdown (large → subtasks)</li>
                <li>• Visual schedules (picture/text-based)</li>
                <li>• Timers and reminders</li>
                <li>• All vertices use same systems</li>
              </ul>
            </div>

            {/* Module 7: Social-Emotional */}
            <div className="bg-linear-to-br from-pink-900/20 to-purple-900/20 border border-pink-500/30 rounded-xl p-6 hover:border-pink-400/50 transition-all">
              <Heart className="w-10 h-10 text-pink-400 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-pink-300">Social-Emotional Check-ins</h3>
              <p className="text-slate-400 text-sm mb-3">
                Learning requires emotional safety. Track mood, triggers, coping.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Daily mood check-in (emoji slider)</li>
                <li>• Trigger logging (what made you anxious?)</li>
                <li>• Coping strategy tracker</li>
                <li>• All vertices see deterioration early</li>
              </ul>
            </div>

            {/* Module 8: Guardian Node */}
            <div className="bg-linear-to-br from-indigo-900/20 to-violet-900/20 border border-indigo-500/30 rounded-xl p-6 hover:border-indigo-400/50 transition-all">
              <Bell className="w-10 h-10 text-indigo-400 mb-3" />
              <h3 className="text-xl font-bold mb-2 text-indigo-300">Guardian Node AI</h3>
              <p className="text-slate-400 text-sm mb-3">
                Early warning system. Detects learning crisis before student fails.
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Monitors: Comprehension, mood, completion rates</li>
                <li>• Detects: Patterns (struggling 3 weeks in a row)</li>
                <li>• Alerts: All 4 vertices (coordinate response)</li>
                <li>• Suggests: Interventions (back up, change method)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Education Crisis Fund Example */}
        <div className="bg-linear-to-br from-amber-950/50 to-orange-950/50 border-2 border-amber-500/50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-amber-300">Education Crisis Fund Integration</h2>
          <p className="text-slate-300 mb-6">
            When Guardian Node detects education crisis (neuropsych eval needed, tutoring required, assistive tech), 
            Memorial Fund auto-activates. Mesh contributes. No child lacks services due to family income.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-amber-900/30 border border-amber-500/30 rounded-xl p-6">
              <h3 className="font-bold text-amber-200 mb-3">Example: Dyslexia Evaluation</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Student: Alex (8th grade)</span>
                </div>
                <div className="flex justify-between">
                  <span>Need: Neuropsych evaluation</span>
                  <span className="font-semibold text-amber-300">$3,000</span>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  • Neuropsych testing: $2,500<br/>
                  • Follow-up report: $300<br/>
                  • Parent consultation: $200
                </div>
              </div>
            </div>

            <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-6">
              <h3 className="font-bold text-green-200 mb-3">Mesh Response</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Mesh size:</span>
                  <span className="font-semibold">50 people</span>
                </div>
                <div className="flex justify-between">
                  <span>Collected:</span>
                  <span className="font-semibold text-green-300">$3,200</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-semibold text-green-300">48 hours</span>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  42 contributors ($30-$500 each)<br/>
                  → Diagnosis within 1 week<br/>
                  → IEP implemented<br/>
                  → Tutoring started<br/>
                  → 6 months later: Reading at grade level
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-950/50 border-l-4 border-green-400 rounded">
            <div className="font-semibold text-green-300 mb-1">Early Detection = Changed Trajectory</div>
            <div className="text-slate-400 text-sm">
              Without mesh: Wait 9 months for school testing, Alex falls further behind, believes he's "stupid"<br/>
              With mesh: Evaluation within 2 weeks, interventions started immediately, Alex learns "my brain just works different"
            </div>
          </div>
        </div>

        {/* Hub vs Mesh Comparison */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Hub-and-Spoke vs Learning Mesh</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Hub-and-Spoke Column */}
            <div className="bg-linear-to-br from-red-950/30 to-orange-950/30 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-red-400">Hub-and-Spoke (Current System)</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="text-red-400 mt-0.5">✗</div>
                  <div>
                    <div className="font-semibold text-red-300">Teacher-centered</div>
                    <div className="text-slate-400">All information flows through teacher (bottleneck)</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="text-red-400 mt-0.5">✗</div>
                  <div>
                    <div className="font-semibold text-red-300">Student passive</div>
                    <div className="text-slate-400">Learning done TO student, no ownership</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="text-red-400 mt-0.5">✗</div>
                  <div>
                    <div className="font-semibold text-red-300">Data siloed</div>
                    <div className="text-slate-400">Teacher knows one thing, parent another, tutor a third</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="text-red-400 mt-0.5">✗</div>
                  <div>
                    <div className="font-semibold text-red-300">Reactive</div>
                    <div className="text-slate-400">Wait until student failing, then scramble to help</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="text-red-400 mt-0.5">✗</div>
                  <div>
                    <div className="font-semibold text-red-300">Inconsistent strategies</div>
                    <div className="text-slate-400">Teacher uses one method, tutor another, parent a third</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Mesh Column */}
            <div className="bg-linear-to-br from-green-950/30 to-blue-950/30 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-green-400">Learning Mesh (Education Tetrahedron)</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="text-green-400 mt-0.5">✓</div>
                  <div>
                    <div className="font-semibold text-green-300">Student-centered</div>
                    <div className="text-slate-400">Student owns learning data, all vertices support</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="text-green-400 mt-0.5">✓</div>
                  <div>
                    <div className="font-semibold text-green-300">Student active</div>
                    <div className="text-slate-400">Tracks own comprehension, builds agency</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="text-green-400 mt-0.5">✓</div>
                  <div>
                    <div className="font-semibold text-green-300">Data shared</div>
                    <div className="text-slate-400">All 4 vertices see same real-time data, coordinate</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="text-green-400 mt-0.5">✓</div>
                  <div>
                    <div className="font-semibold text-green-300">Proactive</div>
                    <div className="text-slate-400">Guardian Node detects crisis early, intervene before failing</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="text-green-400 mt-0.5">✓</div>
                  <div>
                    <div className="font-semibold text-green-300">Consistent strategies</div>
                    <div className="text-slate-400">All vertices use same methods across contexts (scaffolding works)</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="text-center space-y-4">
          <Link 
            href="/architect" 
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105"
          >
            Build Your Learning Tetrahedron →
          </Link>
          
          <div>
            <Link 
              href="/EDUCATION_TETRAHEDRON.md" 
              className="text-blue-400 hover:text-blue-300 underline text-sm"
            >
              Read Full Documentation
            </Link>
          </div>

          <div className="pt-6 text-slate-500 text-sm italic">
            "Hub-and-spoke education is collapsing. Build the mesh."
          </div>
        </div>
      </div>
    </div>
  );
}
