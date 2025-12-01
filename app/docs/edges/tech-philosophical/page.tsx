import Link from 'next/link';

export default function TechPhilosophicalEdgePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/vertex/technical" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
          ← Back to Technical Vertex
        </Link>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-3xl">⚙️</span>
              <span className="text-2xl text-gray-400">→</span>
              <span className="text-3xl">🔆</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Tech-Philosophical Bridge
              </h1>
              <p className="text-slate-300">
                Ethics of systems: Why we build what we build
              </p>
            </div>
          </div>

          <div className="prose prose-invert prose-amber max-w-none">
            <h2>The Ethical Architecture of Systems</h2>
            <p>
              Every protocol you design, every metric you choose, every intervention you make—these are not neutral technical decisions. They are <em>moral</em> choices. They embody values. They privilege certain outcomes over others. They shape what becomes possible.
            </p>
            <p>
              This edge asks the question that technical work often tries to avoid: <em>Why this? Why this way? In service of what?</em>
            </p>

            <h2>Core Principle: Systems Embody Values Whether We Intend It or Not</h2>
            <p>
              You can't build a value-neutral system. The question isn't <em>whether</em> your system embodies values—it's <em>which</em> values, and whether you've made that choice consciously.
            </p>

            <h3>Example: Custody Schedule Design</h3>
            <p>Consider two different custody schedules:</p>
            <p>
              <strong>Schedule A: Strict 50/50</strong> — Embodies values: equality, fairness, clear boundaries. Privileges parental rights. May sacrifice child stability and school continuity.
            </p>
            <p>
              <strong>Schedule B: Primary Residence with Flexible Time</strong> — Embodies values: stability, child-centeredness. Privileges child's routine. May sacrifice strict parental equality.
            </p>
            <p>
              Neither is "right." But each embodies different philosophical commitments. The tech-philosophical edge is where you make these choices consciously.
            </p>

            <h2>The Ethics of Protocol Design</h2>

            <h3>Question 1: Whose Flourishing Are We Serving?</h3>
            <p>
              When you design a protocol, you're choosing whose needs come first:
            </p>
            <ul>
              <li><strong>Child-centered protocols</strong> prioritize children's wellbeing</li>
              <li><strong>Parent-centered protocols</strong> prioritize adult relationships</li>
              <li><strong>System-centered protocols</strong> balance individual needs against collective health</li>
            </ul>
            <p>
              Context matters. A family with a suicidal teen needs child-centered work. A blended family on the brink needs parent-centered work. But you must be explicit about whose flourishing is primary.
            </p>

            <h3>Question 2: What Are We Optimizing For?</h3>
            <p>Your metrics reveal your values:</p>
            <ul>
              <li><strong>If you measure conflict-free exchanges</strong> → You value harmony (might miss necessary conflict)</li>
              <li><strong>If you measure authentic emotional expression</strong> → You value honesty (might miss need for boundaries)</li>
              <li><strong>If you measure academic performance</strong> → You value achievement (might miss emotional wellbeing)</li>
            </ul>
            <p>
              Every metric is a statement of what we believe matters. Choose carefully. Include multiple dimensions.
            </p>

            <h3>Question 3: What Power Dynamics Are We Creating?</h3>
            <p>
              Systems create power—who has it, who doesn't, who decides.
            </p>
            <p>
              When you create a protocol where parents must "agree on all major decisions," you're giving either parent veto power. This prevents unilateral control but also means the conflict-avoidant parent can block everything.
            </p>
            <p>
              When you create "parallel parenting," you prevent endless arguments but fragment the child's experience across two different worlds.
            </p>
            <p>
              Neither is wrong. Both have moral consequences you need to anticipate and own.
            </p>

            <h3>Question 4: What Does "Success" Mean?</h3>
            <ul>
              <li><strong>Compliance success:</strong> Everyone follows the protocol (but may be miserable)</li>
              <li><strong>Harmony success:</strong> No fighting (but important issues avoided)</li>
              <li><strong>Functioning success:</strong> Everyone is "doing okay" (but not thriving)</li>
              <li><strong>Flourishing success:</strong> People growing and connected (but may involve discomfort)</li>
            </ul>
            <p>
              This framework leans toward flourishing—that's a philosophical choice, not technical. We believe humans are capable of more than functioning. But you might work with a family where functioning IS profound victory.
            </p>

            <h2>When Systems Thinking Can Harm</h2>
            <p>
              <strong>Dangerous:</strong> "The child's anxiety is just a symptom of parental conflict. Fix the parents, child will be fine." This can lead to ignoring the child's actual suffering.
            </p>
            <p>
              <strong>Ethical:</strong> "The child's anxiety is connected to parental conflict, but the child is also a person with their own suffering that deserves direct attention. We work on multiple levels."
            </p>
            <p>
              Systems thinking can become reductionist—treating people as cogs. The philosophical edge insists: We're working with systems of PEOPLE, and people have inherent dignity beyond their function.
            </p>

            <h2>The Practitioner's Moral Position</h2>
            <p>
              You are not neutral. Your presence changes the system. Your protocols embody values.
            </p>

            <h3>You are ethically responsible for:</h3>
            <ul>
              <li><strong>Being clear about your values:</strong> If you believe children's needs come before parents' convenience, say so</li>
              <li><strong>Acknowledging trade-offs:</strong> "This will stabilize the system but constrain freedom. That's the trade-off"</li>
              <li><strong>Naming power:</strong> "Mom has more power as primary parent. Dad, you'll work harder to maintain connection. That's not fair but it's reality"</li>
              <li><strong>Refusing harm:</strong> Even if a family wants something harmful to a vulnerable member, you have responsibility to refuse</li>
            </ul>

            <h2>Philosophical Questions in Technical Choices</h2>

            <h3>Protocol Timeline: Fast or Slow?</h3>
            <p>
              <strong>Fast protocols</strong> embody urgency, decisiveness, belief in transformation. <strong>Slow protocols</strong> embody patience, respect for complexity, sustainable change. This isn't technical—it's philosophical.
            </p>

            <h3>Stakeholder Involvement: Who Decides?</h3>
            <ul>
              <li>Do you involve children in decision-making or protect them?</li>
              <li>Do you include extended family or keep boundaries tight?</li>
              <li>Do you defer to parents as experts or assert professional knowledge?</li>
            </ul>
            <p>
              These are questions about autonomy, power, and respect—not technique.
            </p>

            <h3>Metrics: What Gets Counted?</h3>
            <p>
              If you measure only what's easy to count (number of conflicts, checklist completion), you miss what matters most (depth of connection, sense of meaning, quality of repair).
            </p>
            <p>
              This framework balances quantitative and qualitative metrics—but even that embodies a philosophical stance about the limits of measurement.
            </p>

            <h2>When Philosophy Constrains Technical Work (In a Good Way)</h2>

            <h3>Example 1: The Efficiency Trap</h3>
            <p>
              <strong>Technical impulse:</strong> "Streamlined communication protocol—logistics only, no emotions. More efficient."
            </p>
            <p>
              <strong>Philosophical constraint:</strong> "Humans are not machines. Emotional connection matters. If we strip all feeling, we gain efficiency but lose humanity."
            </p>
            <p>
              <strong>Revised:</strong> Logistics via text, plus scheduled calls for emotional check-ins. Efficiency AND humanity.
            </p>

            <h3>Example 2: The Control Fantasy</h3>
            <p>
              <strong>Technical impulse:</strong> "We'll create a protocol covering every scenario. Plan for everything."
            </p>
            <p>
              <strong>Philosophical constraint:</strong> "Life is not controllable. The more rigid the protocol, the more brittle. We need space for emergence and surprise."
            </p>
            <p>
              <strong>Revised:</strong> Core structures plus explicit permission to deviate. Build in regular review. Honor the mystery.
            </p>

            <h3>Example 3: The Neutrality Myth</h3>
            <p>
              <strong>Technical impulse:</strong> "We're neutral facilitators. We just implement what the family wants."
            </p>
            <p>
              <strong>Philosophical constraint:</strong> "Neutrality is impossible. By choosing what to measure and prioritize, we're already influencing. Better to own our stance."
            </p>
            <p>
              <strong>Revised:</strong> Be transparent. "This framework prioritizes children's wellbeing. If that's not your priority, this may not be right for you."
            </p>

            <h2>Living on This Edge: Practitioner Reflection</h2>

            <h3>Questions to Ask Yourself:</h3>
            <ul>
              <li>What do I believe about human nature? (Good, selfish, malleable, fixed?)</li>
              <li>What do I believe about change? (Is it possible? How? Who drives it?)</li>
              <li>What do I believe about suffering? (Always bad? Can it be generative?)</li>
              <li>What do I believe about family? (Sacred? Social construct? What makes a "good" family?)</li>
              <li>What do I believe about my role? (Expert? Facilitator? Witness? All of the above?)</li>
            </ul>

            <h3>When Your Values Conflict with the System's Values:</h3>
            <ul>
              <li><strong>If it's safety:</strong> You have moral and legal obligation to intervene</li>
              <li><strong>If it's values difference:</strong> Name your concern, respect autonomy, potentially decline if gap is too wide</li>
              <li><strong>If it's cultural:</strong> Approach with humility. Your values are shaped by your culture. Can you find common ground without imposing?</li>
            </ul>

            <h2>The Both/And of Technical and Philosophical</h2>
            <p>
              The temptation is to pick a side: pure technical (mechanically efficient but morally hollow) or pure philosophical (values-rich but structurally vague).
            </p>
            <p>
              This edge asks you to hold both: <strong>Be technically rigorous AND philosophically grounded.</strong>
            </p>
            <ul>
              <li>Design clear protocols AND ask what values they embody</li>
              <li>Measure outcomes AND ask what you might be missing</li>
              <li>Follow evidence-based practices AND honor unmeasurable dimensions of humanity</li>
            </ul>
            <p>
              The technical makes sure you actually help people. The philosophical makes sure you help them in ways that honor their humanity.
            </p>

            <div className="mt-8 p-6 bg-amber-600/20 rounded-lg">
              <p className="text-sm font-medium text-white" style={{marginBottom: '0.5rem'}}>🔆 <strong>The Question That Grounds This Work</strong></p>
              <p className="text-sm text-slate-300" style={{margin: 0}}>
                Before you design any system, ask: If this works perfectly—if everyone follows the protocol, if all metrics improve—will these people be more fully human? Will they flourish? If the answer is no, go back to the drawing board. Technical excellence in service of the wrong ends is still wrong.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
