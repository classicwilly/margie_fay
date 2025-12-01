import Link from 'next/link';

export default function PhilosophicalTechEdgePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-blue-50 to-amber-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/vertex/philosophical" className="text-amber-600 hover:text-amber-800 mb-6 inline-block">
          ← Back to Philosophical Vertex
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🔆</span>
              <span className="text-2xl text-gray-400">→</span>
              <span className="text-3xl">⚙️</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Philosophical-Tech Bridge
              </h1>
              <p className="text-gray-600">
                Principled systems: Embedding values in technical design
              </p>
            </div>
          </div>

          <div className="prose prose-blue max-w-none">
            <h2>Values Made Visible: Building Systems That Reflect Principles</h2>
            <p>
              This is the same as tech-philosophical but from the other direction. Instead of asking "What values are embedded in this system?", you start with "I have these values—how do I build systems that embody them?"
            </p>
            <p>
              It's intentional, values-first design: You decide what matters, THEN you build the technical structure to support it.
            </p>

            <h2>Core Principle: Design FROM Values, Not Toward Them</h2>
            <p>
              Most people design systems based on efficiency, convenience, or what they've seen others do. Then they hope those systems will somehow produce the outcomes they value.
            </p>
            <p>
              <strong>This edge reverses that:</strong> Start with your non-negotiable values. Then ask: What system design would make these values inevitable?
            </p>

            <h2>The Values-First Design Process</h2>

            <h3>Step 1: Name Your Non-Negotiables</h3>
            <p>
              What are the 3-5 values that MUST be present in this system?
            </p>
            <p>
              <strong>Example for a co-parenting protocol:</strong>
            </p>
            <ul>
              <li><strong>Child-centeredness:</strong> Child's needs come before parental convenience</li>
              <li><strong>Respect:</strong> Parents treat each other with dignity even when angry</li>
              <li><strong>Consistency:</strong> Child experiences predictability and stability</li>
              <li><strong>Growth:</strong> System allows for adaptation as child develops</li>
            </ul>

            <h3>Step 2: For Each Value, Ask: What Would Make This Structurally Inevitable?</h3>

            <p>
              <strong>Value: Child-centeredness</strong><br/>
              <em>Structural embodiment:</em>
            </p>
            <ul>
              <li>Before making decisions, parents must answer: "What does the CHILD need here?" (not "What do I want?")</li>
              <li>Schedule transitions at times that work for child (after school decompression, not mid-homework)</li>
              <li>Flexibility clause: If child has important event, schedule adjusts (not rigid 50/50 no matter what)</li>
            </ul>

            <p>
              <strong>Value: Respect</strong><br/>
              <em>Structural embodiment:</em>
            </p>
            <ul>
              <li>All communication must be in writing (reduces escalation, creates accountability)</li>
              <li>"No blame" rule in communication protocol (focus on what's needed, not who's at fault)</li>
              <li>24-hour cooling off period before responding to heated messages</li>
            </ul>

            <p>
              <strong>Value: Consistency</strong><br/>
              <em>Structural embodiment:</em>
            </p>
            <ul>
              <li>Written custody schedule that repeats weekly (not "we'll figure it out as we go")</li>
              <li>Same basic bedtime/mealtime routines in both homes (documented and agreed-upon)</li>
              <li>Changes require 2-week notice unless emergency</li>
            </ul>

            <p>
              <strong>Value: Growth</strong><br/>
              <em>Structural embodiment:</em>
            </p>
            <ul>
              <li>Quarterly review built into protocol ("What's working? What needs to change?")</li>
              <li>Age-milestone triggers (at 10, 13, 16, kid gets more input into schedule)</li>
              <li>Revision process is explicit, not adversarial</li>
            </ul>

            <h3>Step 3: Design Metrics That Measure What You Actually Value</h3>
            <p>
              If you value child-centeredness, don't measure "Did parents follow the schedule?" Measure "Does the child feel secure and supported?"
            </p>
            <p>
              <strong>Values-aligned metrics:</strong>
            </p>
            <ul>
              <li><strong>For child-centeredness:</strong> Child's self-report ("I feel like both my parents are there for me" 1-10 scale)</li>
              <li><strong>For respect:</strong> Number of communication exchanges that stay solution-focused vs. turn into attacks</li>
              <li><strong>For consistency:</strong> Number of last-minute changes to schedule (goal: minimize)</li>
              <li><strong>For growth:</strong> Was quarterly review completed? Were adjustments made based on child's needs?</li>
            </ul>

            <h2>Example: Designing a Family Meeting Protocol From Values</h2>

            <h3>Values to Embody:</h3>
            <ul>
              <li><strong>Equality:</strong> Everyone's voice matters equally</li>
              <li><strong>Safety:</strong> It's safe to disagree and express feelings</li>
              <li><strong>Solution-focus:</strong> We're here to solve problems, not assign blame</li>
              <li><strong>Connection:</strong> This is a time to strengthen relationships, not just logistics</li>
            </ul>

            <h3>Structural Design Based on Values:</h3>

            <p>
              <strong>For equality:</strong>
            </p>
            <ul>
              <li>Everyone gets equal speaking time (even 5-year-old)</li>
              <li>Decisions made by consensus when possible (not parent diktat)</li>
              <li>Kids can add items to agenda, not just parents</li>
            </ul>

            <p>
              <strong>For safety:</strong>
            </p>
            <ul>
              <li>"No interrupting" rule (speaking stick/object passed around)</li>
              <li>"No mocking or dismissing" rule (enforced by parent)</li>
              <li>If someone gets upset, meeting pauses for acknowledgment</li>
            </ul>

            <p>
              <strong>For solution-focus:</strong>
            </p>
            <ul>
              <li>Structured problem-solving process (5 steps: name problem, brainstorm solutions, pick one, assign action, set follow-up)</li>
              <li>"No blame" language ("I need" instead of "You never")</li>
              <li>Only ONE problem per meeting (prevents overwhelm)</li>
            </ul>

            <p>
              <strong>For connection:</strong>
            </p>
            <ul>
              <li>Start with appreciations (2-5 min of positive focus)</li>
              <li>End with something fun (group hug, joke-telling, dessert)</li>
              <li>Tone is warm, not business-meeting formal</li>
            </ul>

            <h2>Anti-Patterns: When Systems Undermine Values</h2>

            <h3>You Say You Value X, But Your System Produces Y:</h3>

            <p>
              <strong>Value: Autonomy</strong><br/>
              <strong>System: Rigid protocol with no flexibility</strong><br/>
              <em>Result:</em> People feel controlled, not empowered. System will be resisted or abandoned.
            </p>

            <p>
              <strong>Value: Transparency</strong><br/>
              <strong>System: Hidden criteria for decisions, no explanation of why</strong><br/>
              <em>Result:</em> People feel manipulated, trust erodes.
            </p>

            <p>
              <strong>Value: Compassion</strong><br/>
              <strong>System: Harsh consequences with no room for context or repair</strong><br/>
              <em>Result:</em> People feel judged and unsafe, not supported.
            </p>

            <p>
              <strong>Value: Collaboration</strong><br/>
              <strong>System: Top-down decisions with no input from stakeholders</strong><br/>
              <em>Result:</em> People comply without buy-in, passive resistance.
            </p>

            <h2>The Both/And: Structure AND Freedom</h2>
            <p>
              Values-driven design requires holding paradoxes:
            </p>

            <h3>Paradox 1: Boundaries AND Flexibility</h3>
            <p>
              You value respect (boundaries) AND compassion (flexibility). How do you build BOTH?
            </p>
            <p>
              <strong>Solution:</strong> Clear boundaries with explicit exceptions. "Bedtime is 8pm (boundary). If you're in the middle of a really good book, you can read until 8:30 (flexibility). This is not negotiable nightly, but when you ask respectfully, I consider it (both/and)."
            </p>

            <h3>Paradox 2: Consistency AND Adaptation</h3>
            <p>
              You value stability (consistency) AND growth (adaptation). How?
            </p>
            <p>
              <strong>Solution:</strong> Consistent review cycles. "We follow this system for 3 months (consistency). Then we evaluate and revise (adaptation). We don't change mid-cycle unless emergency."
            </p>

            <h3>Paradox 3: Individual Needs AND System Health</h3>
            <p>
              You value personal autonomy AND collective wellbeing. How?
            </p>
            <p>
              <strong>Solution:</strong> Differentiation within connection. "Everyone gets to make some choices just for themselves (autonomy). Some decisions we make together because they affect everyone (system). We're clear about which is which."
            </p>

            <h2>Philosophical Commitments That Shape Technical Design</h2>

            <h3>If You Believe: People Are Basically Good</h3>
            <p>
              <strong>Design implication:</strong> Build systems that assume good intent and allow for self-correction rather than systems that assume bad intent and require heavy monitoring.
            </p>

            <h3>If You Believe: Change Requires Discomfort</h3>
            <p>
              <strong>Design implication:</strong> Build systems that tolerate struggle and don't rescue people from necessary growth pain. Include support for discomfort, but don't eliminate it.
            </p>

            <h3>If You Believe: Relationships Are Primary</h3>
            <p>
              <strong>Design implication:</strong> Build systems that prioritize connection over efficiency. If a protocol damages relationships, it's failing even if it's "working."
            </p>

            <h3>If You Believe: Context Matters</h3>
            <p>
              <strong>Design implication:</strong> Build systems with flexibility built in. Not "one size fits all" but "here's the framework, customize as needed."
            </p>

            <h2>The Practitioner's Responsibility</h2>
            <p>
              When you design systems for families, you're not a neutral technician. You're embedding YOUR values into THEIR lives. Own that power.
            </p>

            <h3>Questions Before You Design:</h3>
            <ul>
              <li>What values am I prioritizing in this design?</li>
              <li>Whose values are these—mine or the family's?</li>
              <li>What values am I potentially sacrificing?</li>
              <li>Would this system work for people with different values than mine?</li>
              <li>Am I designing for efficiency or for flourishing? (They're not always the same.)</li>
            </ul>

            <h2>Values as Non-Negotiable Constraints</h2>
            <p>
              In technical design, you have constraints: time, resources, capabilities. In values-driven design, your VALUES are constraints.
            </p>

            <h3>Example: Non-Negotiable Constraint: "Do No Harm"</h3>
            <p>
              This means: Any protocol you design must not make things worse. If you're unsure whether an intervention will help or harm, don't do it yet. Gather more data first.
            </p>

            <h3>Example: Non-Negotiable Constraint: "Child Safety First"</h3>
            <p>
              This means: If there's any safety concern, that trumps parental equality, convenience, cost—everything. Safety isn't negotiable, so it shapes every decision.
            </p>

            <h3>Example: Non-Negotiable Constraint: "Respect Autonomy"</h3>
            <p>
              This means: Even if you KNOW what's best, you don't impose it without consent. You persuade, you educate, but ultimately people get to choose—even if they choose poorly.
            </p>

            <div className="mt-8 p-6 bg-linear-to-r from-amber-50 to-blue-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800" style={{marginBottom: '0.5rem'}}>🔆 <strong>Systems With Soul</strong></p>
              <p className="text-sm text-gray-700" style={{margin: 0}}>
                The most powerful systems are invisible—they hold structure so people can be fully human within them. When you design from values, you're not just creating protocols. You're building containers for human flourishing. The protocol isn't the point. The people are the point. The values are the point. The system just makes those values real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
