export default function KidsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="text-2xl">🌟</span>
            <span className="text-sm font-medium text-slate-300">For Kids & Teens</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Your
            <span className="block bg-linear-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
              Support Team
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Understanding the tetrahedron: Your team of four people who have your back
          </p>
        </div>

        {/* Age-Specific Sections */}
        <div className="space-y-12">
          {/* Little Kids (5-9) */}
          <section className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🧸</span>
              <h2 className="text-3xl font-bold text-blue-300">For Little Kids (Ages 5-9)</h2>
            </div>

            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-semibold text-white mb-4">What's a Tetrahedron?</h3>
              <p className="text-slate-300 text-lg mb-4">
                Think of it like a super-strong tent! 🏕️ It has four corners and each corner connects to all the others. 
                That makes it really, really strong—even if one part gets wobbly, the other parts keep it standing!
              </p>

              <h3 className="text-xl font-semibold text-white mb-4">Your Support Team</h3>
              <p className="text-slate-300 text-lg mb-4">
                You have FOUR special grown-ups who are part of your team. They might be:
              </p>
              <ul className="text-slate-300 text-lg space-y-2 mb-6">
                <li>🏠 Your mom or dad</li>
                <li>👨‍👩‍👧 Your other parent</li>
                <li>👵 A grandparent, aunt, or uncle</li>
                <li>🏫 A teacher or coach</li>
                <li>👨‍⚕️ A counselor or trusted adult</li>
              </ul>

              <div className="bg-blue-800/30 border border-blue-600/50 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-blue-200 mb-3">🌈 Cool Thing About Your Team:</h4>
                <p className="text-slate-300 text-lg">
                  Even if one person is having a hard day or can't help right now, you still have THREE other people on your team! 
                  That's what makes you safe and strong.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4">What You Can Do:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-300 mb-2">✏️ Draw Your Team</h4>
                  <p className="text-slate-300 text-sm">
                    Draw four boxes, one for each person on your team. Put their names and draw a picture of them!
                  </p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-300 mb-2">🌟 Make a "Who to Call" List</h4>
                  <p className="text-slate-300 text-sm">
                    With a grown-up, make a list of who you can talk to when you need help with different things.
                  </p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-300 mb-2">💭 Talk About Feelings</h4>
                  <p className="text-slate-300 text-sm">
                    It's okay to tell your team when you're sad, scared, happy, or confused. They want to know!
                  </p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-300 mb-2">🎨 Do Fun Things Together</h4>
                  <p className="text-slate-300 text-sm">
                    Spend special time with each person on your team—play games, read books, or just hang out!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tweens (10-12) */}
          <section className="bg-purple-900/20 border border-purple-700/50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🎮</span>
              <h2 className="text-3xl font-bold text-purple-300">For Tweens (Ages 10-12)</h2>
            </div>

            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-semibold text-white mb-4">The Tetrahedron: Your Support Network</h3>
              <p className="text-slate-300 text-lg mb-4">
                A tetrahedron is a 3D shape with four corners (vertices) where each corner connects to all the others. 
                It's the strongest structure possible with just four points—it's used in engineering because it doesn't collapse easily!
              </p>
              <p className="text-slate-300 text-lg mb-6">
                Your support system works the same way: You have FOUR key people, and they're all connected to help you.
              </p>

              <h3 className="text-xl font-semibold text-white mb-4">Why Four People?</h3>
              <div className="bg-purple-800/30 border border-purple-600/50 rounded-lg p-6 mb-6">
                <ul className="text-slate-300 space-y-2">
                  <li>✅ <strong>Backup support:</strong> If one person isn't available, you have three others</li>
                  <li>✅ <strong>Different perspectives:</strong> Different people are good at helping with different things</li>
                  <li>✅ <strong>No pressure on one person:</strong> Nobody has to be perfect or do everything</li>
                  <li>✅ <strong>Stronger together:</strong> When they all communicate, you get better support</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4">Your Four Vertices Might Include:</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-300 mb-2">🏠 Parent/Guardian</h4>
                  <p className="text-slate-300 text-sm">The adult(s) you live with most of the time</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-300 mb-2">👨‍👩‍👧 Other Parent</h4>
                  <p className="text-slate-300 text-sm">If parents are separated, your other parent or co-parent</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-300 mb-2">👵 Family Member</h4>
                  <p className="text-slate-300 text-sm">Grandparent, aunt, uncle, or older sibling you trust</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-300 mb-2">🎓 Outside Adult</h4>
                  <p className="text-slate-300 text-sm">Teacher, counselor, coach, or mentor</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4">Activities to Try:</h3>
              <div className="space-y-3">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-300 mb-2">📋 Map Your Tetrahedron</h4>
                  <p className="text-slate-300 mb-2">Create a diagram showing your four people and how they connect. Who talks to who? Who coordinates?</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-300 mb-2">💡 Identify Strengths</h4>
                  <p className="text-slate-300 mb-2">Figure out what each person is best at helping with. School stuff? Feelings? Fun activities? Medical things?</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-300 mb-2">📱 Communication Plan</h4>
                  <p className="text-slate-300 mb-2">Know how to reach each person—phone, text, email, or in person. Save their contact info.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Teens (13-17) */}
          <section className="bg-amber-900/20 border border-amber-700/50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🎧</span>
              <h2 className="text-3xl font-bold text-amber-300">For Teens (Ages 13-17)</h2>
            </div>

            <div className="prose prose-invert max-w-none">
              <h3 className="text-xl font-semibold text-white mb-4">Understanding Resilience Architecture</h3>
              <p className="text-slate-300 text-lg mb-4">
                The tetrahedron isn't just geometry—it's a resilience protocol. In network theory, it's called a "complete graph K4": 
                four nodes where every node connects to every other node. This creates maximum redundancy with minimum complexity.
              </p>

              <div className="bg-amber-800/30 border border-amber-600/50 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-amber-200 mb-3">Why This Matters for You:</h4>
                <p className="text-slate-300 mb-3">
                  Traditional family structures are often "hub-and-spoke"—everything depends on one person (usually a parent). 
                  When that person is stressed, unavailable, or struggling, the whole system breaks down. Sound familiar?
                </p>
                <p className="text-slate-300">
                  The tetrahedron model distributes support. You're not dependent on one person being perfect. You have a mesh network 
                  of support, and if one connection fails, five others remain functional.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4">Building Your Support Mesh</h3>
              <p className="text-slate-300 text-lg mb-4">
                Your four vertices should be chosen strategically. Consider:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5">
                  <h4 className="font-semibold text-amber-300 mb-3">👤 Vertex 1: Primary Caregiver</h4>
                  <p className="text-slate-300 text-sm mb-2">The adult you live with most / who handles day-to-day logistics</p>
                  <p className="text-slate-400 text-xs italic">Role: Stability, daily support, practical needs</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5">
                  <h4 className="font-semibold text-amber-300 mb-3">👥 Vertex 2: Secondary Caregiver</h4>
                  <p className="text-slate-300 text-sm mb-2">Other parent, co-parent, or close family member</p>
                  <p className="text-slate-400 text-xs italic">Role: Backup support, alternate perspective, continuity</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5">
                  <h4 className="font-semibold text-amber-300 mb-3">🧠 Vertex 3: Emotional Support</h4>
                  <p className="text-slate-300 text-sm mb-2">Counselor, trusted adult, mentor, or close family friend</p>
                  <p className="text-slate-400 text-xs italic">Role: Processing feelings, objective guidance, safety valve</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5">
                  <h4 className="font-semibold text-amber-300 mb-3">🎯 Vertex 4: Peer/Future-Focused</h4>
                  <p className="text-slate-300 text-sm mb-2">Older sibling, coach, teacher, or peer mentor</p>
                  <p className="text-slate-400 text-xs italic">Role: Development, skills, social connection, aspiration</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4">Edge Maintenance: Keeping Connections Strong</h3>
              <p className="text-slate-300 mb-4">
                The tetrahedron has 6 edges (connections between vertices). You don't control all of them—adults manage their own relationships—but 
                you DO control YOUR connections to each vertex. Here's how to maintain them:
              </p>

              <div className="space-y-3 mb-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-300 mb-2">📞 Regular Check-Ins</h4>
                  <p className="text-slate-300 text-sm">Don't wait for crisis. Text, call, or visit each person regularly—even when things are fine.</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-300 mb-2">🗣️ Clear Communication</h4>
                  <p className="text-slate-300 text-sm">Tell people what you need. "I need advice" vs. "I just need to vent" helps them support you better.</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-300 mb-2">🔄 Update Them</h4>
                  <p className="text-slate-300 text-sm">Share wins, struggles, changes. They can't support what they don't know about.</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-300 mb-2">🤝 Respect Boundaries</h4>
                  <p className="text-slate-300 text-sm">Each vertex has limits. If someone can't help right now, that's why you have three others.</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4">When the System Fails</h3>
              <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6 mb-6">
                <p className="text-slate-300 mb-3">
                  <strong>If you're in immediate danger or crisis:</strong>
                </p>
                <ul className="text-slate-300 space-y-1 mb-4">
                  <li>🚨 <strong>988</strong> - Suicide & Crisis Lifeline (call or text)</li>
                  <li>📱 <strong>Text "HELLO" to 741741</strong> - Crisis Text Line</li>
                  <li>☎️ <strong>911</strong> - Emergency services</li>
                  <li>🏠 <strong>1-800-799-7233</strong> - Domestic Violence Hotline</li>
                </ul>
                <p className="text-slate-300 text-sm">
                  If your tetrahedron isn't functioning (vertices are unavailable, unsafe, or not supportive), reach out to school counselors, 
                  teachers, or other trusted adults. You have the right to a functioning support system.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4">Your Agency in the System</h3>
              <p className="text-slate-300 mb-4">
                Here's something important: <strong>You're not passive in this system.</strong> As a teen, you have increasing agency to:
              </p>
              <ul className="text-slate-300 space-y-2">
                <li>✓ Choose who you trust and lean on</li>
                <li>✓ Advocate for what you need</li>
                <li>✓ Set boundaries with adults who aren't healthy for you</li>
                <li>✓ Build your own support network outside family</li>
                <li>✓ Seek therapy or counseling independently (in many states)</li>
              </ul>

              <div className="bg-gradient-to-r from-amber-600/20 to-green-600/20 border border-amber-500/50 rounded-lg p-6 mt-8">
                <h4 className="text-lg font-semibold text-amber-200 mb-3">💡 Real Talk:</h4>
                <p className="text-slate-300">
                  You didn't choose your family situation. You didn't create whatever stress or dysfunction exists. But you CAN choose 
                  how you respond. Building a strong tetrahedron now—identifying four solid people and maintaining those connections—gives 
                  you resilience for whatever comes next. This isn't just theory. This is infrastructure for YOUR life.
                </p>
              </div>
            </div>
          </section>

          {/* Resources for All Ages */}
          <section className="bg-green-900/20 border border-green-700/50 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">📚</span>
              <h2 className="text-3xl font-bold text-green-300">Resources & Activities for All Ages</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">📖 Books About Resilience</h3>
                <ul className="text-slate-300 space-y-2 text-sm">
                  <li><strong>Ages 5-8:</strong> "The Invisible String" by Patrice Karst</li>
                  <li><strong>Ages 8-12:</strong> "What to Do When You Worry Too Much" by Dawn Huebner</li>
                  <li><strong>Ages 10-14:</strong> "The Survival Guide for Kids with ADHD" by John F. Taylor</li>
                  <li><strong>Teens:</strong> "The Teenage Brain" by Frances Jensen</li>
                  <li><strong>Teens:</strong> "Mindset" by Carol Dweck</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">🎨 Creative Activities</h3>
                <ul className="text-slate-300 space-y-2 text-sm">
                  <li>✏️ Draw or build a 3D tetrahedron model</li>
                  <li>📝 Journal about your support team</li>
                  <li>🎭 Role-play asking for help from each vertex</li>
                  <li>📱 Create a digital "support squad" contact list</li>
                  <li>🗺️ Map your emotional support network visually</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">🧘 Coping Skills</h3>
                <ul className="text-slate-300 space-y-2 text-sm">
                  <li>🌬️ Deep breathing exercises (4-7-8 technique)</li>
                  <li>🎧 Create a calm-down playlist</li>
                  <li>🏃 Physical movement (walk, dance, stretch)</li>
                  <li>✍️ Write feelings in a journal</li>
                  <li>🎨 Express through art or music</li>
                  <li>🤗 Identify your "safe person" for each vertex</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">💬 Conversation Starters</h3>
                <ul className="text-slate-300 space-y-2 text-sm">
                  <li>"Can you be one of my support people?"</li>
                  <li>"I need help with something, can we talk?"</li>
                  <li>"This is hard for me right now..."</li>
                  <li>"I'm not sure who to ask about this..."</li>
                  <li>"Can you help me understand what's happening?"</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Protocol Hub
          </a>
        </div>
      </div>
    </div>
  );
}
