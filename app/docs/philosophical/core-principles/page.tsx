import Link from 'next/link';

export default function CorePrinciplesPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/vertex/philosophical" className="text-amber-400 hover:text-amber-300 mb-6 inline-block">
          ← Back to Philosophical Vertex
        </Link>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-amber-600/20 text-amber-400 text-sm font-medium rounded-full mb-3">
              Foundations
            </span>
            <h1 className="text-4xl font-bold text-white mb-2">
              Core Principles & Values
            </h1>
            <p className="text-xl text-slate-300">
              The foundational philosophy behind the framework
            </p>
          </div>

          <div className="prose prose-invert prose-amber max-w-none">
            <h2>The Philosophy Behind Phenix</h2>
            <p>
              Every methodology rests on philosophical assumptions about human nature, relationships, and change. 
              The Phenix Framework is built on a specific set of core principles that guide every assessment, 
              intervention, and outcome. Understanding these principles helps practitioners use the framework 
              with integrity and families understand why we do what we do.
            </p>

            <h2>Principle 1: Systems Over Individuals</h2>

            <h3>The Core Belief</h3>
            <p>
              Human beings exist in relationship. We are fundamentally social creatures shaped by and shaping 
              the systems we inhabit. Individual behavior makes sense only when understood in systemic context. 
              The "identified patient" is rarely the problem—they're the symptom of system dysfunction.
            </p>

            <h3>What This Means in Practice</h3>
            <ul>
              <li>We don't ask "What's wrong with this person?" We ask "What's happening in this system?"</li>
              <li>Change one part of the system, the whole system adjusts</li>
              <li>Blame is irrelevant—everyone contributes to system patterns</li>
              <li>You can't "fix" one person and expect the system to be healthy</li>
              <li>The most "dysfunctional" person may be responding most adaptively to a dysfunctional system</li>
            </ul>

            <h3>The Philosophical Roots</h3>
            <p>
              This draws from <strong>systems theory</strong> (von Bertalanffy), <strong>family systems theory</strong> 
              (Murray Bowen), and <strong>ecological psychology</strong> (Bronfenbrenner). It rejects the 
              Western individualism that treats people as isolated units and embraces an ecological understanding 
              of human development and functioning.
            </p>

            <h3>The Tension</h3>
            <p>
              This principle can seem to minimize individual agency and responsibility. How do we hold people 
              accountable while maintaining a systemic view? The answer: We hold people responsible for their 
              <em>response</em> to systemic patterns, not for creating those patterns. You didn't cause the system 
              you were born into, but you are responsible for how you participate in it now.
            </p>

            <h2>Principle 2: Change is Possible</h2>

            <h3>The Core Belief</h3>
            <p>
              Systems are not fixed or deterministic. While patterns persist, they can be disrupted and reshaped. 
              Families are not doomed by their history. People can learn new ways of relating. Healing is possible. 
              This is fundamentally a stance of <strong>hope</strong>.
            </p>

            <h3>What This Means in Practice</h3>
            <ul>
              <li>We approach every family with expectation of growth, not resignation to dysfunction</li>
              <li>Past patterns explain present behavior but don't determine future behavior</li>
              <li>Small changes can create cascading effects throughout the system</li>
              <li>Even deeply entrenched patterns can shift with sustained effort</li>
              <li>We work <em>with</em> the system's natural capacity for self-organization and healing</li>
            </ul>

            <h3>The Philosophical Roots</h3>
            <p>
              This draws from <strong>developmental psychology</strong> (neuroplasticity, attachment repair), 
              <strong>positive psychology</strong> (post-traumatic growth), and <strong>solution-focused therapy</strong>. 
              It rejects determinism—the idea that early experiences or genetics lock us into fixed outcomes.
            </p>

            <h3>The Tension</h3>
            <p>
              This principle can veer into toxic positivity or minimize real constraints. Not all change is possible 
              for all people at all times. Resources matter. Trauma matters. Mental illness matters. We hold both: 
              Change is possible <em>and</em> change is hard. Hope is warranted <em>and</em> we must be realistic 
              about barriers. The work is finding what <em>can</em> shift, not pretending everything can.
            </p>

            <h2>Principle 3: Non-Pathologizing</h2>

            <h3>The Core Belief</h3>
            <p>
              Behavior that looks "crazy" is actually adaptive in context. People are doing the best they can with 
              the tools and circumstances they have. Symptoms are attempts at solution, not signs of brokenness. 
              Our job is to understand the function behavior serves, not diagnose pathology.
            </p>

            <h3>What This Means in Practice</h3>
            <ul>
              <li>We ask "What job is this behavior doing in the system?" not "What's wrong with this person?"</li>
              <li>Reframe symptoms as understandable responses to untenable situations</li>
              <li>Respect the wisdom in "dysfunction"—it served a purpose, even if it no longer does</li>
              <li>Reduce shame by normalizing patterns as systemic, not personal failure</li>
              <li>Collaborate with families as experts on their own experience</li>
            </ul>

            <h3>The Philosophical Roots</h3>
            <p>
              This draws from <strong>humanistic psychology</strong> (Carl Rogers' unconditional positive regard), 
              <strong>narrative therapy</strong> (externalizing the problem), and <strong>feminist psychology</strong> 
              (questioning whose standards define "normal"). It rejects the medical model that pathologizes difference 
              and centers professional expertise over lived experience.
            </p>

            <h3>The Tension</h3>
            <p>
              This principle can seem to excuse harmful behavior or avoid necessary diagnosis. Some things <em>are</em> 
              pathological. Mental illness is real. Not everything is "just adaptive behavior." We hold both: People 
              deserve compassion and non-judgment <em>and</em> some behaviors are not okay and must change. Understanding 
              context doesn't mean accepting harm.
            </p>

            <h2>Principle 4: Relationships as Foundation</h2>

            <h3>The Core Belief</h3>
            <p>
              Healing happens in relationship. The quality of connection between people is the most powerful predictor 
              of wellbeing. Techniques and interventions matter less than the relational container in which they occur. 
              People don't change because of brilliant insights—they change because they feel safe, seen, and valued.
            </p>

            <h3>What This Means in Practice</h3>
            <ul>
              <li>Build therapeutic alliance before pushing for change</li>
              <li>Repair ruptures immediately—relationship maintenance is not optional</li>
              <li>Model healthy relating: boundaries, repair, vulnerability, accountability</li>
              <li>Family relationships are both the problem and the solution</li>
              <li>Your relationship with the family is a microcosm of their relationship patterns</li>
            </ul>

            <h3>The Philosophical Roots</h3>
            <p>
              This draws from <strong>attachment theory</strong> (Bowlby, Ainsworth), <strong>relational psychoanalysis</strong>, 
              and <strong>interpersonal neurobiology</strong> (Dan Siegel). It asserts that human brains are wired for 
              connection and that relational trauma requires relational healing.
            </p>

            <h3>The Tension</h3>
            <p>
              This principle can become an excuse for sloppy boundaries or over-involvement. "Relationship" doesn't 
              mean enmeshment or making clients dependent on you. We hold both: The relationship is paramount <em>and</em> 
              the relationship must be boundaried, professional, and ultimately aimed at the client's autonomy, not 
              your importance to them.
            </p>

            <h2>Principle 5: Context Shapes Everything</h2>

            <h3>The Core Belief</h3>
            <p>
              Family systems don't exist in a vacuum. They're embedded in larger contexts: culture, socioeconomic 
              status, race, gender, sexual orientation, geography, historical moment, political reality. You cannot 
              understand a family without understanding the contexts that shape and constrain them. "Personal problems" 
              are often political problems.
            </p>

            <h3>What This Means in Practice</h3>
            <ul>
              <li>Ask about resources, barriers, oppression, privilege</li>
              <li>Acknowledge how systems of power affect family functioning</li>
              <li>Don't blame families for problems rooted in poverty, racism, etc.</li>
              <li>Adapt interventions to be culturally responsive</li>
              <li>Sometimes the intervention is advocacy, not therapy</li>
            </ul>

            <h3>The Philosophical Roots</h3>
            <p>
              This draws from <strong>ecological systems theory</strong> (Bronfenbrenner), <strong>liberation psychology</strong> 
              (Ignacio Martín-Baró), <strong>critical race theory</strong>, and <strong>feminist theory</strong>. It rejects 
              the idea that psychology can be apolitical or that problems exist purely at the individual/family level.
            </p>

            <h3>The Tension</h3>
            <p>
              This principle can become an excuse for inaction: "The system is too big, we can't change anything." 
              We hold both: Context matters enormously <em>and</em> families still have agency within constraints. 
              We work to expand their options while acknowledging real limits. We validate structural barriers 
              without fostering helplessness.
            </p>

            <h2>Principle 6: Emergence Over Engineering</h2>

            <h3>The Core Belief</h3>
            <p>
              You cannot control or engineer human systems. They are complex, adaptive, and self-organizing. Your 
              job is not to impose a solution but to create conditions for the system's own healing capacity to emerge. 
              Trust the process. Trust the family. You are a guide and catalyst, not an architect or savior.
            </p>

            <h3>What This Means in Practice</h3>
            <ul>
              <li>Collaborate with families in creating solutions, don't prescribe them</li>
              <li>Follow the system's energy—work with what's ready to shift</li>
              <li>Small, strategic interventions {">"}comprehensive overhauls</li>
              <li>Be curious, not certain. Ask questions, don't give answers.</li>
              <li>When you're working harder than the family, stop and reassess</li>
            </ul>

            <h3>The Philosophical Roots</h3>
            <p>
              This draws from <strong>complexity theory</strong>, <strong>Buddhist philosophy</strong> (non-attachment, 
              beginner's mind), and <strong>Taoist thought</strong> (wu wei—effortless action). It rejects the expert 
              model where the professional has all the answers and imposes them on passive recipients.
            </p>

            <h3>The Tension</h3>
            <p>
              This principle can become an excuse for passivity or lack of direction. Families come to you because 
              they need expertise and guidance. We hold both: Trust the system's wisdom <em>and</em> provide structure, 
              direction, and expert knowledge. Emergence doesn't mean absence of leadership. It means collaborative 
              leadership.
            </p>

            <h2>Principle 7: Both/And Over Either/Or</h2>

            <h3>The Core Belief</h3>
            <p>
              Reality is complex and paradoxical. Most apparent contradictions are actually both true. People can be 
              both victim and perpetrator. Systems can be both resilient and fragile. Change can be both necessary 
              and terrifying. Holding complexity without collapsing into simplistic thinking is essential to this work.
            </p>

            <h3>What This Means in Practice</h3>
            <ul>
              <li>Resist the urge to pick sides or simplify messy situations</li>
              <li>Hold multiple truths simultaneously without resolving the tension</li>
              <li>Validate seemingly contradictory feelings and experiences</li>
              <li>Avoid binary thinking: good/bad, healthy/unhealthy, victim/perpetrator</li>
              <li>Help families increase their capacity for nuance and complexity</li>
            </ul>

            <h3>The Philosophical Roots</h3>
            <p>
              This draws from <strong>dialectical thinking</strong> (Hegel, dialectical behavior therapy), 
              <strong>postmodern philosophy</strong> (rejection of grand narratives), and <strong>Indigenous wisdom traditions</strong> 
              (comfort with paradox). It rejects Western either/or binary thinking in favor of more holistic, 
              integrative perspectives.
            </p>

            <h3>The Tension</h3>
            <p>
              This principle can veer into moral relativism or paralysis. Some things are wrong. Abuse is not 
              "just another perspective." We hold both: Reality is complex and multi-faceted <em>and</em> there 
              are moral lines we don't cross. Complexity doesn't mean "anything goes."
            </p>

            <h2>How These Principles Work Together</h2>

            <p>
              These seven principles form an integrated philosophical stance. They inform every choice you make: 
              how you assess, how you intervene, how you relate to families, how you define success. They create 
              tensions and paradoxes—that's intentional. The work is holding those tensions, not resolving them.
            </p>

            <p><strong>In practice, this looks like:</strong></p>
            <ul>
              <li>Seeing systems while honoring individuals</li>
              <li>Being hopeful while being realistic</li>
              <li>Understanding context while maintaining accountability</li>
              <li>Building relationship while maintaining boundaries</li>
              <li>Trusting emergence while providing leadership</li>
              <li>Holding complexity while providing clarity</li>
            </ul>

            <h2>When Principles Conflict</h2>

            <p>
              Sometimes these principles point in different directions. When that happens, <strong>safety always wins</strong>. 
              We prioritize protection of vulnerable people over systemic neutrality. We act decisively in crisis even 
              if it means temporarily abandoning collaborative emergence. We set hard boundaries when needed even if 
              it ruptures relationship.
            </p>

            <p>
              After safety is established, we return to the principles. We repair relationships after boundary-setting. 
              We re-engage collaboration after directive intervention. We maintain the both/and even when we've had to 
              choose an either/or in the moment.
            </p>

            <h2>Living the Principles</h2>

            <p>
              These aren't just ideas to believe—they're ways of being to embody. The most powerful teaching comes not 
              from explaining these principles but from modeling them. When you:
            </p>

            <ul>
              <li>Stay curious instead of certain</li>
              <li>Acknowledge your mistakes and repair them</li>
              <li>Hold complexity without collapsing into simplicity</li>
              <li>Validate experience without condoning harm</li>
              <li>Stay present with discomfort instead of rushing to solutions</li>
              <li>Name power dynamics and your role in them</li>
            </ul>

            <p>...you are teaching families how to do the same.</p>

            <div className="mt-8 p-6 bg-amber-600/20 rounded-lg border-l-4 border-amber-500">
              <h3 className="text-lg font-bold text-white mb-2">🧭 Philosophical Integrity</h3>
              <p className="text-slate-300 mb-0">
                You will violate these principles. You will side with one family member. You will oversimplify. 
                You will work harder than the family. You will lose sight of context in the urgency of crisis. 
                This is inevitable. What matters is returning to the principles, repairing when you've strayed, 
                and continually recommitting to the philosophy that grounds this work. The principles are not 
                a scorecard—they're a North Star. Keep orienting toward them, even when you drift.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
