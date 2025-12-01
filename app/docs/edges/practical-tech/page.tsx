import Link from 'next/link';

export default function PracticalTechEdgePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/vertex/practical" className="text-green-400 hover:text-green-300 mb-6 inline-block">
          ← Back to Practical Vertex
        </Link>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🛠️</span>
              <span className="text-2xl text-gray-400">→</span>
              <span className="text-3xl">⚙️</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Practical-Tech Bridge
              </h1>
              <p className="text-slate-300">
                Systematizing action: Building repeatable practical processes
              </p>
            </div>
          </div>

          <div className="prose prose-invert prose-blue max-w-none">
            <h2>From Ad-Hoc to Systematic: Building Repeatable Excellence</h2>
            <p>
              You've done the work. You've helped families. You have practical wisdom—things you know work. But it's all in your head, adapted on the fly, different every time. This edge is about taking that wisdom and systematizing it: creating protocols, documenting processes, building frameworks that others can use.
            </p>
            <p>
              It's the bridge from "I know what to do" to "here's how anyone can do it."
            </p>

            <h2>Core Principle: Systematize Success, Stay Flexible in Application</h2>
            <p>
              The tension: You want consistent, reliable processes (technical thinking), but every family is different (practical reality).
            </p>
            <p>
              <strong>The answer:</strong> Systematize the STRUCTURE, flex the CONTENT.
            </p>
            <p>
              Example: You always do a family assessment before creating a protocol. That's the STRUCTURE (repeatable). But the questions you ask and how deep you go depends on the family. That's the FLEXIBILITY (contextual).
            </p>

            <h2>When to Systematize Practical Wisdom</h2>

            <h3>Systematize When:</h3>
            <ul>
              <li>You've done it successfully 5+ times and see a pattern</li>
              <li>You're training others and need to transfer knowledge</li>
              <li>You keep reinventing the wheel and wasting time</li>
              <li>Quality is inconsistent and you need standards</li>
              <li>You want to scale your impact beyond what you can personally do</li>
            </ul>

            <h3>Don't Systematize When:</h3>
            <ul>
              <li>You've only done it once or twice (not enough data)</li>
              <li>It's highly intuitive and context-dependent (some things can't be protocolized)</li>
              <li>The system would be more complex than just doing it intuitively</li>
              <li>You're still learning and the process needs to evolve</li>
            </ul>

            <h2>The Systematization Process</h2>

            <h3>Step 1: Extract the Pattern</h3>
            <p>
              Look at 3-5 successful cases. What did you do that worked?
            </p>
            <p>
              <strong>Example:</strong> You've helped 5 high-conflict co-parenting situations. What's common?
            </p>
            <ul>
              <li>You always start by establishing communication boundaries (no texting after 9pm, logistics only via email)</li>
              <li>You always create a parenting plan calendar BEFORE dealing with emotional issues</li>
              <li>You always meet with each parent separately first, then together</li>
              <li>You always build in a "cooling off" protocol for when conflict escalates</li>
            </ul>
            <p>
              Those are your PATTERNS. Now you can systematize them.
            </p>

            <h3>Step 2: Document the Steps</h3>
            <p>
              Turn patterns into a sequence. What happens first, second, third?
            </p>
            <p>
              <strong>Example Protocol: High-Conflict Co-Parenting Setup</strong>
            </p>
            <p>
              <strong>Phase 1: Individual Assessment (Week 1-2)</strong><br/>
              - Meet each parent separately<br/>
              - Assess conflict level (1-10 scale)<br/>
              - Identify each parent's core concerns<br/>
              - Explain the process and get buy-in
            </p>
            <p>
              <strong>Phase 2: Communication Structure (Week 3-4)</strong><br/>
              - Establish communication boundaries (written, specific)<br/>
              - Set up tools (shared calendar, co-parenting app)<br/>
              - Create escalation protocol (what to do when conflict starts)<br/>
              - Practice with low-stakes topic
            </p>
            <p>
              <strong>Phase 3: Parenting Plan (Week 5-8)</strong><br/>
              - Draft custody/visitation schedule<br/>
              - Define decision-making process<br/>
              - Create holiday/vacation plan<br/>
              - Document everything in writing
            </p>
            <p>
              Now you have a SYSTEM. You can hand this to another practitioner and they can follow it.
            </p>

            <h3>Step 3: Build in Decision Points</h3>
            <p>
              Protocols need flexibility. Add "if/then" logic.
            </p>
            <p>
              <strong>Example:</strong><br/>
              - IF conflict level is 8-10 → Start with parallel parenting (minimal communication)<br/>
              - IF conflict level is 4-7 → Start with structured co-parenting (bounded communication)<br/>
              - IF conflict level is 1-3 → Move quickly to collaborative co-parenting
            </p>
            <p>
              This keeps the system from being rigid while maintaining structure.
            </p>

            <h3>Step 4: Create Tools and Templates</h3>
            <p>
              Systematization means: don't reinvent every time. Build reusable tools.
            </p>
            <ul>
              <li><strong>Assessment questionnaires</strong> you use every time</li>
              <li><strong>Email templates</strong> for common communications</li>
              <li><strong>Parenting plan templates</strong> you customize</li>
              <li><strong>Conflict de-escalation scripts</strong> parents can use</li>
              <li><strong>Progress tracking sheets</strong> to monitor over time</li>
            </ul>

            <h3>Step 5: Test and Refine</h3>
            <p>
              Use your system with 2-3 new cases. What works? What doesn't? Iterate.
            </p>
            <p>
              <strong>Common issues:</strong>
            </p>
            <ul>
              <li>Too many steps → Simplify</li>
              <li>Too vague → Add specificity</li>
              <li>Doesn't account for common scenarios → Add decision points</li>
              <li>Takes too long → Compress timeline or make some steps optional</li>
            </ul>

            <h2>Examples: Practical Wisdom → Technical System</h2>

            <h3>Example 1: The Bedtime Routine Protocol</h3>
            <p>
              <strong>Practical wisdom:</strong> "Consistent bedtime routines help kids feel secure and sleep better."
            </p>
            <p>
              <strong>Systematized version:</strong>
            </p>
            <p>
              <strong>Step 1:</strong> Choose bedtime (age-appropriate: 7pm for toddlers, 8pm for young kids, 9pm for preteens)<br/>
              <strong>Step 2:</strong> Build 30-min routine (same order every night): Bath/shower → PJs → Teeth → Story → Song → Lights out<br/>
              <strong>Step 3:</strong> Create visual chart (pictures of each step) for young kids<br/>
              <strong>Step 4:</strong> Implement for 2 weeks without deviation<br/>
              <strong>Step 5:</strong> Troubleshoot common issues (resists bath = move to morning; takes too long = set timer)<br/>
              <strong>Step 6:</strong> Maintain 80% consistency (2 nights/week can be flexible for special occasions)
            </p>
            <p>
              Now this isn't just "do a bedtime routine"—it's a PROTOCOL anyone can follow.
            </p>

            <h3>Example 2: The Family Meeting System</h3>
            <p>
              <strong>Practical wisdom:</strong> "Regular family meetings improve communication and reduce conflict."
            </p>
            <p>
              <strong>Systematized version:</strong>
            </p>
            <p>
              <strong>Frequency:</strong> Weekly, same day/time (Sunday 6pm recommended)<br/>
              <strong>Duration:</strong> 20-30 minutes max<br/>
              <strong>Structure:</strong><br/>
              - Appreciations (5 min): Each person shares one thing they appreciate about another family member<br/>
              - Calendar review (5 min): Who's doing what this week<br/>
              - Problem-solving (10 min): ONE issue maximum, follow 5-step process (name problem, brainstorm solutions, pick one, assign who does what, set check-in)<br/>
              - Fun planning (5 min): Plan one family activity for the week<br/>
              <strong>Rules:</strong><br/>
              - No phones<br/>
              - Everyone gets to talk<br/>
              - No blaming, only problem-solving<br/>
              - If it escalates, table it and schedule a separate conversation
            </p>
            <p>
              This is now REPEATABLE and can be taught to any family.
            </p>

            <h3>Example 3: The Repair Conversation Protocol</h3>
            <p>
              <strong>Practical wisdom:</strong> "After a fight, couples need to repair quickly or resentment builds."
            </p>
            <p>
              <strong>Systematized version:</strong>
            </p>
            <p>
              <strong>Timing:</strong> Within 24 hours of conflict<br/>
              <strong>Setting:</strong> Private, no kids present, phones away<br/>
              <strong>Process:</strong><br/>
              1. Check readiness: "Are you ready to talk about what happened?" (If no, schedule specific time)<br/>
              2. Person A speaks (3 min max): "When you [specific behavior], I felt [emotion]. What I needed was [need]."<br/>
              3. Person B reflects back: "I hear you saying..." (Must get it right before proceeding)<br/>
              4. Person B responds (3 min): "I'm sorry for [specific behavior]. What I should have done was [alternative]. Can you forgive me?"<br/>
              5. Person A: Accept apology OR "I'm working on forgiving but I'm not there yet"<br/>
              6. Reverse roles if needed<br/>
              7. Physical reconnection: Hug, hold hands, or agreed-upon touch
            </p>
            <p>
              Now "repair after conflict" is a SYSTEM with clear steps.
            </p>

            <h2>Building Process Documentation</h2>

            <h3>What to Document:</h3>
            <ul>
              <li><strong>Purpose:</strong> Why does this process exist? What problem does it solve?</li>
              <li><strong>When to use it:</strong> What situations call for this protocol?</li>
              <li><strong>Steps:</strong> Exact sequence, with time estimates</li>
              <li><strong>Decision points:</strong> If/then logic for variations</li>
              <li><strong>Tools needed:</strong> Worksheets, templates, apps, etc.</li>
              <li><strong>Common pitfalls:</strong> What usually goes wrong and how to fix it</li>
              <li><strong>Success indicators:</strong> How do you know it's working?</li>
            </ul>

            <h3>How to Document:</h3>
            <ul>
              <li><strong>Written protocols:</strong> Step-by-step guides (like this framework's protocol generator creates)</li>
              <li><strong>Flowcharts:</strong> Visual decision trees for complex processes</li>
              <li><strong>Checklists:</strong> Simple tick-boxes for routine tasks</li>
              <li><strong>Video demonstrations:</strong> Show don't tell for tricky techniques</li>
              <li><strong>Case examples:</strong> Real applications with before/after</li>
            </ul>

            <h2>The Limits of Systematization</h2>

            <h3>What Can't (And Shouldn't) Be Systematized:</h3>
            <ul>
              <li><strong>Attunement:</strong> Reading emotional cues and responding appropriately—requires human intuition</li>
              <li><strong>Timing:</strong> Knowing when to push and when to back off—contextual wisdom</li>
              <li><strong>Creativity:</strong> Novel solutions to unprecedented problems—can't be protocolized</li>
              <li><strong>Presence:</strong> Being fully with someone in their pain—this is art, not science</li>
            </ul>
            <p>
              Systems serve humans. When the system starts constraining human responsiveness, abandon the system.
            </p>

            <h2>Systematization for Scale</h2>
            <p>
              Why systematize? So you can help more people.
            </p>
            <ul>
              <li><strong>Train others:</strong> Your protocols become teaching tools for new practitioners</li>
              <li><strong>Self-serve resources:</strong> Families can use your systems without you (workbooks, online courses)</li>
              <li><strong>Quality control:</strong> Systems ensure consistent excellence even when you're not personally delivering</li>
              <li><strong>Efficiency:</strong> Don't reinvent the wheel—use proven processes and spend energy on customization</li>
            </ul>

            <div className="mt-8 p-6 bg-blue-600/20 rounded-lg">
              <p className="text-sm font-medium text-white" style={{marginBottom: '0.5rem'}}>🔧 <strong>The Both/And Truth</strong></p>
              <p className="text-sm text-slate-300" style={{margin: 0}}>
                A good system is invisible. It holds structure so you can be present. It handles the predictable so you have energy for the unexpected. It documents wisdom so it doesn't die with you. Build systems that serve humans, not systems that humans serve. Systematize the repeatable. Stay human in the moment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
