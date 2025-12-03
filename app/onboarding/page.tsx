'use client';

import { useState } from 'react';
import { ArrowRight, Users, Heart, Shield, Sparkles } from 'lucide-react';

type PainPoint = 'coparenting' | 'education' | 'health' | 'work' | 'unsure';
type UserType = 'parent' | 'teacher' | 'healthcare' | 'individual';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [painPoint, setPainPoint] = useState<PainPoint | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [meshConfig, setMeshConfig] = useState<any>(null);

  const painPoints = [
    {
      id: 'coparenting' as PainPoint,
      icon: '👨‍👩‍👧‍👦',
      title: 'Co-parenting After Divorce',
      pain: 'Handoffs are chaos. Communication is impossible. Kids are caught in the middle.',
      relief: 'Structured mesh with both parents, kids, and optional fifth element for coordination.'
    },
    {
      id: 'education' as PainPoint,
      icon: '📚',
      title: 'My Kid is Struggling',
      pain: 'School says they\'re fine. You know they\'re not. No one is listening.',
      relief: 'Education tetrahedron: Student leads, you support, teacher implements, specialist guides.'
    },
    {
      id: 'health' as PainPoint,
      icon: '🏥',
      title: 'Healthcare Coordination',
      pain: 'Specialists don\'t talk. PCP doesn\'t know what psychiatrist prescribed. Records are chaos.',
      relief: 'Health mesh: You own data, all providers see same info, Guardian Node watches patterns.'
    },
    {
      id: 'work' as PainPoint,
      icon: '💼',
      title: 'Work-Life Balance',
      pain: 'Burnout. No boundaries. Family needs vs. career demands. Something has to give.',
      relief: 'Work tetrahedron: You, partner, boss, support person. Transparent needs, clear boundaries.'
    },
    {
      id: 'unsure' as PainPoint,
      icon: '🤔',
      title: 'I\'m Not Sure Yet',
      pain: 'Life is overwhelming. Everything feels like too much. I need help but don\'t know where to start.',
      relief: 'Start with your mesh. We\'ll figure out which tetrahedron you need as we go.'
    }
  ];

  const configureMesh = (pain: PainPoint, type: UserType) => {
    const configs: Record<PainPoint, any> = {
      coparenting: {
        name: 'Co-parenting Mesh',
        vertices: [
          { name: 'You', role: 'Parent 1', color: 'blue' },
          { name: 'Co-parent', role: 'Parent 2', color: 'purple' },
          { name: 'Child', role: 'Kid(s)', color: 'green' },
          { name: 'Coordinator', role: 'Fifth Element (Optional)', color: 'amber' }
        ],
        modules: ['Handoff Calendar', 'Status Sharing', 'Memorial Fund', 'Decision Voting'],
        nextSteps: [
          'Invite your co-parent (we\'ll send them a link)',
          'Add your kids (they get their own accounts with privacy controls)',
          'Decide if you need a Fifth Element (therapist, mediator, trusted friend)',
          'Install first module: Handoff Calendar'
        ]
      },
      education: {
        name: 'Education Tetrahedron',
        vertices: [
          { name: 'Student', role: 'Your Kid (THEY lead)', color: 'blue' },
          { name: 'Parent', role: 'You (support)', color: 'purple' },
          { name: 'Teacher', role: 'School', color: 'green' },
          { name: 'Specialist', role: 'Tutor/Therapist/Coach', color: 'amber' }
        ],
        modules: ['Learning Dashboard', 'Student-Led IEP', 'Guardian Node', 'Memorial Fund'],
        nextSteps: [
          'Set up your kid\'s account (THEY own their data, YOU support)',
          'Invite teacher (with student permission)',
          'Add specialist if you have one',
          'Configure Guardian Node to watch patterns'
        ]
      },
      health: {
        name: 'Health Mesh',
        vertices: [
          { name: 'You', role: 'Patient (you own data)', color: 'blue' },
          { name: 'PCP', role: 'Primary Care', color: 'purple' },
          { name: 'Specialist', role: 'Psychiatrist/Therapist', color: 'green' },
          { name: 'Support', role: 'Caregiver/Partner', color: 'amber' }
        ],
        modules: ['Medication Tracker', 'Symptom Log', 'Secure Records', 'Guardian Node'],
        nextSteps: [
          'Import your health records (you control who sees what)',
          'Invite providers (they see only what you share)',
          'Add support person if you have one',
          'Set up Guardian Node to detect med interactions, symptom patterns'
        ]
      },
      work: {
        name: 'Work-Life Mesh',
        vertices: [
          { name: 'You', role: 'Employee', color: 'blue' },
          { name: 'Manager', role: 'Boss', color: 'purple' },
          { name: 'Partner', role: 'Home Support', color: 'green' },
          { name: 'Advocate', role: 'HR/Mentor', color: 'amber' }
        ],
        modules: ['Boundary Tracker', 'Capacity Dashboard', 'PTO Planner', 'Burnout Monitor'],
        nextSteps: [
          'Set your capacity limits (work hours, meeting max, focus time)',
          'Invite your manager (they see your capacity, not personal details)',
          'Add your partner (coordinate home responsibilities)',
          'Optional: Add HR or mentor as advocate'
        ]
      },
      unsure: {
        name: 'Your First Mesh',
        vertices: [
          { name: 'You', role: 'Center', color: 'blue' },
          { name: 'Support 1', role: 'Partner/Friend', color: 'purple' },
          { name: 'Support 2', role: 'Family/Therapist', color: 'green' },
          { name: 'Support 3', role: 'Professional/Other', color: 'amber' }
        ],
        modules: ['Status Sharing', 'Memorial Fund', 'Guardian Node', 'Module Explorer'],
        nextSteps: [
          'Identify 3 people in your life who support you',
          'Invite them to your mesh',
          'Share what you need (we help you figure this out)',
          'Explore modules as needs emerge'
        ]
      }
    };

    return configs[pain];
  };

  const handlePainSelect = (pain: PainPoint) => {
    setPainPoint(pain);
    setStep(2);
  };

  const handleTypeSelect = (type: UserType) => {
    setUserType(type);
    if (painPoint) {
      setMeshConfig(configureMesh(painPoint, type));
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Welcome to G.O.D.
          </h1>
          <p className="text-xl text-slate-300">
            Generative Oscillatory Dynamics
          </p>
          <p className="text-slate-400 mt-2">
            We build infrastructure for humans navigating broken systems.
          </p>
        </div>

        {/* Progress */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-500' : 'bg-slate-700'}`}>
            1
          </div>
          <div className={`w-20 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-purple-500' : 'bg-slate-700'}`}>
            2
          </div>
          <div className={`w-20 h-1 ${step >= 3 ? 'bg-purple-500' : 'bg-slate-700'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-pink-500' : 'bg-slate-700'}`}>
            3
          </div>
        </div>

        {/* Step 1: Pain Point Selection */}
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              What brought you here?
            </h2>
            <p className="text-slate-300 mb-8 text-center max-w-2xl mx-auto">
              Choose the pain point that resonates most. We'll build your mesh around it.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {painPoints.map((point) => (
                <button
                  key={point.id}
                  onClick={() => handlePainSelect(point.id)}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-purple-500 transition-all text-left group"
                >
                  <div className="text-5xl mb-4">{point.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400">
                    {point.title}
                  </h3>
                  <p className="text-red-400 text-sm mb-3 italic">
                    "{point.pain}"
                  </p>
                  <p className="text-green-400 text-sm">
                    ✓ {point.relief}
                  </p>
                  <div className="flex items-center justify-end mt-4 text-purple-400 group-hover:translate-x-2 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: User Type */}
        {step === 2 && (
          <div>
            <button 
              onClick={() => setStep(1)} 
              className="text-slate-400 hover:text-white mb-6 flex items-center gap-2"
            >
              ← Back
            </button>

            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Tell us about you
            </h2>
            <p className="text-slate-300 mb-8 text-center max-w-2xl mx-auto">
              This helps us configure your mesh with the right language and defaults.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { id: 'parent', icon: Heart, label: 'Parent/Caregiver', desc: 'Managing family needs' },
                { id: 'teacher', icon: Users, label: 'Educator/Provider', desc: 'Supporting students/clients' },
                { id: 'healthcare', icon: Shield, label: 'Healthcare Worker', desc: 'Coordinating care' },
                { id: 'individual', icon: Sparkles, label: 'Individual', desc: 'Managing my own life' }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id as UserType)}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-purple-500 transition-all text-center group flex flex-col items-center"
                >
                  <type.icon className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-bold text-white mb-2">
                    {type.label}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {type.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Mesh Configuration */}
        {step === 3 && meshConfig && (
          <div>
            <button 
              onClick={() => setStep(2)} 
              className="text-slate-400 hover:text-white mb-6 flex items-center gap-2"
            >
              ← Back
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Your {meshConfig.name}
              </h2>
              <p className="text-slate-300">
                Here&apos;s what we&apos;re building for you.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              {/* Vertices */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Your 4 Vertices (K₄ Graph)
                </h3>
                <div className="space-y-3">
                  {meshConfig.vertices.map((vertex: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg">
                      <div className={`w-4 h-4 rounded-full bg-${vertex.color}-500 mt-1 flex-shrink-0`}></div>
                      <div>
                        <div className="font-semibold text-white">{vertex.name}</div>
                        <div className="text-sm text-slate-400">{vertex.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                  <p className="text-sm text-blue-300">
                    💡 <strong>Complete K₄ = Full mesh.</strong> All 4 vertices connected means everyone sees the same info (with your permission controls).
                  </p>
                </div>
              </div>

              {/* Modules */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Your Starting Modules
                </h3>
                <div className="space-y-2 mb-4">
                  {meshConfig.modules.map((module: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-slate-200">{module}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                  <p className="text-sm text-purple-300">
                    🔧 <strong>Modules are sovereign.</strong> Add more later, remove what doesn't work. Your mesh, your rules.
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="mt-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-xl p-8 max-w-5xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Next Steps</h3>
              <ol className="space-y-3">
                {meshConfig.nextSteps.map((step: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {i + 1}
                    </div>
                    <span className="text-slate-200 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex gap-4">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-all">
                  Create My Account
                </button>
                <button className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:border-slate-400 transition-all">
                  Learn More First
                </button>
              </div>
            </div>

            {/* Philosophy Footer */}
            <div className="mt-8 text-center text-slate-400 text-sm max-w-3xl mx-auto">
              <p className="mb-2">
                <strong className="text-slate-200">You&apos;re not building something new.</strong>
              </p>
              <p>
                Kids have always had mesh topology. You&apos;ve always known how to coordinate support. 
                The system made you forget. We&apos;re just removing the shame so the infrastructure can resurface.
              </p>
              <p className="mt-4 text-green-400">
                <strong>This is restoration, not innovation.</strong>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
