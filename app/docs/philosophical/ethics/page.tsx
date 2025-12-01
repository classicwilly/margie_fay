import Link from 'next/link';

export default function EthicsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-amber-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/vertex/philosophical" className="text-amber-600 hover:text-amber-800 mb-6 inline-block">
          ← Back to Philosophical Vertex
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full mb-3">
              Ethics
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Ethics & Responsibility
            </h1>
            <p className="text-xl text-gray-600">
              Moral considerations in family systems work
            </p>
          </div>

          <div className="prose prose-amber max-w-none">
            <h2>Ethics in Family Systems Work</h2>
            <p>
              Family systems work places you at the intersection of multiple, sometimes conflicting, ethical 
              obligations. You're responsible to individuals, to the system, to broader society, to your profession, 
              and to your own integrity. This creates inevitable ethical dilemmas that demand careful navigation.
            </p>

            <h2>Core Ethical Commitments</h2>

            <h3>1. Do No Harm (Non-Maleficence)</h3>
            <p><strong>The Principle:</strong> Your first responsibility is to not make things worse. Given the power you hold and 
            the vulnerability of families in crisis, the potential for harm is real.</p>

            <p><strong>What This Means:</strong></p>
            <ul>
              <li>Work within your scope of competence—refer out when needed</li>
              <li>Don't experiment on families with interventions you're not trained in</li>
              <li>Monitor for iatrogenic effects (harm caused by your intervention)</li>
              <li>If your approach is making things worse, stop and pivot</li>
              <li>Attend to your own biases and countertransference</li>
            </ul>

            <p><strong>Common Ways We Cause Harm:</strong></p>
            <ul>
              <li>Pushing families to address issues they're not ready for</li>
              <li>Siding with one family member against another</li>
              <li>Imposing our values as if they're universal truths</li>
              <li>Pathologizing cultural differences or non-mainstream lifestyles</li>
              <li>Creating dependency rather than building autonomy</li>
              <li>Failing to recognize when we're re-traumatizing someone</li>
            </ul>

            <h3>2. Promote Wellbeing (Beneficence)</h3>
            <p><strong>The Principle:</strong> Beyond not harming, you have a positive obligation to promote the wellbeing of those 
            you serve. This means actively working toward their flourishing.</p>

            <p><strong>What This Means:</strong></p>
            <ul>
              <li>Provide competent, evidence-informed care</li>
              <li>Advocate for families when they face systemic barriers</li>
              <li>Connect families to resources and support</li>
              <li>Work toward the highest good for all involved</li>
              <li>Continue your own learning and professional development</li>
            </ul>

            <p><strong>The Tension:</strong> What happens when promoting one person's wellbeing seems to conflict with another's? 
            When a teen wants autonomy and a parent wants control? When one partner wants divorce and the other wants 
            to stay together? We hold both needs and help the system find a solution that honors everyone's humanity, 
            even if it doesn't give everyone what they want.</p>

            <h3>3. Respect Autonomy</h3>
            <p><strong>The Principle:</strong> People have the right to make their own decisions, even decisions you disagree with. 
            Your job is to inform, support, and facilitate—not to control.</p>

            <p><strong>What This Means:</strong></p>
            <ul>
              <li>Informed consent—people understand what they're agreeing to</li>
              <li>Collaborative goal-setting—families decide what they want to work on</li>
              <li>Respect for "no"—if someone doesn't want to participate, you can't force them</li>
              <li>Cultural humility—their values may differ from yours; that doesn't make them wrong</li>
              <li>Right to quit—families can end services even if you think they still need help</li>
            </ul>

            <p><strong>The Limits:</strong> Autonomy is not absolute. When someone's choices endanger themselves or others 
            (especially children), you have an obligation to intervene. When someone's mental state impairs their 
            decision-making capacity, more directive intervention may be needed. Autonomy is the default, but safety 
            overrides it.</p>

            <h3>4. Justice & Fairness</h3>
            <p><strong>The Principle:</strong> Treat people equitably. Be aware of power dynamics and work to level the playing field. 
            Recognize how systemic oppression affects families and don't blame them for structural problems.</p>

            <p><strong>What This Means:</strong></p>
            <ul>
              <li>Sliding scale fees or pro bono work for those who can't afford services</li>
              <li>Adapting interventions to be culturally responsive</li>
              <li>Advocating for families facing systemic barriers (poverty, racism, etc.)</li>
              <li>Not pathologizing adaptive responses to oppression</li>
              <li>Using your privilege to amplify marginalized voices</li>
            </ul>

            <p><strong>Self-Reflection:</strong> Who gets your best work? Who do you unconsciously favor? What biases shape 
            your judgments? Justice requires ongoing examination of our own complicity in systems of oppression.</p>

            <h3>5. Fidelity & Trustworthiness</h3>
            <p><strong>The Principle:</strong> Keep your promises. Be reliable. Maintain appropriate boundaries. Earn and protect trust.</p>

            <p><strong>What This Means:</strong></p>
            <ul>
              <li>Show up on time, prepared, present</li>
              <li>Maintain confidentiality (within legal/ethical limits)</li>
              <li>Follow through on commitments</li>
              <li>Be honest about your limitations and mistakes</li>
              <li>Dual relationships and conflicts of interest are carefully managed or avoided</li>
            </ul>

            <p><strong>Why It Matters:</strong> Families are entrusting you with their most vulnerable selves. Betraying that 
            trust—through gossip, breach of confidentiality, sexual boundary violations, financial exploitation, or 
            simple unreliability—damages not just your relationship with them but their capacity to trust others.</p>

            <h2>Specific Ethical Dilemmas</h2>

            <h3>Dilemma 1: Conflicting Loyalties</h3>
            <p><strong>The Situation:</strong> In family therapy, you're responsible to multiple people whose interests may conflict. 
            A teen wants you to keep a secret from parents. A parent wants you to "fix" their child. Partners want 
            you to take sides in their conflict.</p>

            <p><strong>The Navigation:</strong></p>
            <ul>
              <li>Be clear from the start: You serve the family system, not any individual</li>
              <li>Establish ground rules about confidentiality (what you will/won't share)</li>
              <li>Maintain systemic neutrality—validate all perspectives</li>
              <li>If someone's safety is at risk, your primary loyalty is to protection</li>
              <li>Sometimes you need individual sessions to tend to each person's needs</li>
            </ul>

            <h3>Dilemma 2: Mandatory Reporting</h3>
            <p><strong>The Situation:</strong> You become aware of child abuse or neglect. Legally, you must report. But reporting 
            may destroy the therapeutic relationship, re-traumatize the child, or put the family in crisis.</p>

            <p><strong>The Navigation:</strong></p>
            <ul>
              <li>Inform families upfront about the limits of confidentiality</li>
              <li>If possible, involve the family in the reporting process</li>
              <li>Report what you're legally required to—no more, no less</li>
              <li>Continue to support the family through the process if they'll allow it</li>
              <li>Recognize the complexity: Sometimes reporting causes harm even as it prevents harm</li>
            </ul>

            <h3>Dilemma 3: Cultural Values vs. Professional Values</h3>
            <p><strong>The Situation:</strong> A family's cultural practices conflict with your professional or personal values. 
            Corporal punishment, arranged marriage, gender role expectations, attitudes toward LGBTQ+ identities.</p>

            <p><strong>The Navigation:</strong></p>
            <ul>
              <li>Distinguish between cultural difference and harm</li>
              <li>Lean into cultural humility—recognize your values are not universal</li>
              <li>When practices cause actual harm, name that gently and explore alternatives</li>
              <li>When it's just difference, bracket your judgment and work within their framework</li>
              <li>If you genuinely can't work with a family's values, refer to someone who can</li>
            </ul>

            <h3>Dilemma 4: Unequal Power in the System</h3>
            <p><strong>The Situation:</strong> One family member has significantly more power than others. A parent whose income 
            controls the family. A partner whose temper silences everyone. An able-bodied family member making 
            decisions for a disabled member.</p>

            <p><strong>The Navigation:</strong></p>
            <ul>
              <li>Name power dynamics explicitly (with care for safety)</li>
              <li>Create space for less powerful voices to be heard</li>
              <li>Individual sessions may be needed to speak freely</li>
              <li>Sometimes empowering the less powerful means confronting the more powerful</li>
              <li>If power imbalance prevents safe/honest work, family therapy may not be the right modality</li>
            </ul>

            <h3>Dilemma 5: Harm Reduction vs. Abstinence</h3>
            <p><strong>The Situation:</strong> A family member is engaging in risky behavior (substance use, unsafe sex, etc.). 
            Ideally they'd stop. Realistically, they may not be ready. Do you support harm reduction strategies 
            or insist on complete cessation?</p>

            <p><strong>The Navigation:</strong></p>
            <ul>
              <li>Meet people where they are, not where you wish they were</li>
              <li>Harm reduction is ethical when abstinence isn't realistic</li>
              <li>Continue to name risks and offer support for change</li>
              <li>Balance: Support their autonomy <em>and</em> don't collude with self-destruction</li>
              <li>If behavior endangers others (especially children), more directive intervention needed</li>
            </ul>

            <h2>Boundary Ethics</h2>

            <h3>Professional Boundaries</h3>
            <p>
              Boundaries protect both you and families. They're not about being cold or distant—they're about 
              maintaining a relationship that serves the work.
            </p>

            <p><strong>Clear boundaries include:</strong></p>
            <ul>
              <li>Defined session times and consistent scheduling</li>
              <li>Clear policies about contact between sessions</li>
              <li>Financial boundaries—transparent fees, consistent billing</li>
              <li>No dual relationships—don't be their therapist and their friend/business partner/etc.</li>
              <li>Physical boundaries—appropriate touch (or no touch, depending on your approach)</li>
              <li>Emotional boundaries—you care, but you're not enmeshed in their lives</li>
            </ul>

            <p><strong>Boundary violations to avoid:</strong></p>
            <ul>
              <li>Sexual or romantic relationships with clients (ever, even after termination)</li>
              <li>Financial exploitation or inappropriate gifts</li>
              <li>Self-disclosure that serves your needs, not theirs</li>
              <li>Social media connections that blur professional/personal lines</li>
              <li>Fostering dependency rather than autonomy</li>
            </ul>

            <h3>The Gray Areas</h3>
            <p>
              Some boundary questions don't have clear answers. Is it okay to attend a client's wedding? Can you accept 
              a small gift? Should you hug a client who's crying? These depend on context, cultural norms, your 
              theoretical orientation, and your own comfort level.
            </p>

            <p><strong>Questions to ask:</strong></p>
            <ul>
              <li>Whose needs does this serve—mine or theirs?</li>
              <li>Does this enhance or complicate the therapeutic relationship?</li>
              <li>How would this look to an ethics board or supervisor?</li>
              <li>Am I making an exception I wouldn't make for other clients?</li>
              <li>What would happen if I said no?</li>
            </ul>

            <h2>Ethical Self-Care</h2>

            <p>
              You have an ethical obligation to take care of yourself. Not because you "deserve" it (though you do), 
              but because your wellbeing directly affects your capacity to serve families ethically.
            </p>

            <p><strong>When you're burned out, you:</strong></p>
            <ul>
              <li>Miss important clinical information</li>
              <li>React defensively instead of therapeutically</li>
              <li>Make errors in judgment</li>
              <li>Blur boundaries because you're desperate for connection</li>
              <li>Become cynical or detached</li>
              <li>Can't hold hope for families</li>
            </ul>

            <p><strong>Ethical self-care includes:</strong></p>
            <ul>
              <li>Reasonable caseload limits</li>
              <li>Regular supervision and consultation</li>
              <li>Your own therapy when needed</li>
              <li>Time off and boundaries around work hours</li>
              <li>Professional development and intellectual stimulation</li>
              <li>Community and peer support</li>
              <li>Attention to your physical, emotional, spiritual health</li>
            </ul>

            <h2>Organizational Ethics</h2>

            <p>
              Ethics extend beyond the therapy room to the organizations and systems you work within.
            </p>

            <h3>When Your Organization Asks You to Compromise Ethics</h3>
            <ul>
              <li>Pressure to see too many clients to maintain quality care</li>
              <li>Insurance companies denying necessary treatment</li>
              <li>Policies that discriminate against marginalized populations</li>
              <li>Pressure to document in ways that aren't accurate</li>
              <li>Conflicts of interest (e.g., kickbacks for referrals)</li>
            </ul>

            <p><strong>Your Options:</strong></p>
            <ul>
              <li>Advocate internally for policy changes</li>
              <li>Document your ethical concerns in writing</li>
              <li>Consult with ethics committees or licensing boards</li>
              <li>Refuse to comply with unethical directives (and accept consequences)</li>
              <li>Leave the organization if necessary (not always an option, but sometimes the right one)</li>
            </ul>

            <h2>Ethical Decision-Making Framework</h2>

            <p>When facing an ethical dilemma, use this process:</p>

            <ol>
              <li><strong>Identify the ethical issue clearly:</strong> What principles are in conflict? Whose interests are at stake?</li>
              <li><strong>Gather information:</strong> What are the facts? What are the options? What does the law require? What do 
              professional ethics codes say?</li>
              <li><strong>Consult:</strong> Talk to supervisors, colleagues, ethics committees. You don't have to decide alone.</li>
              <li><strong>Consider consequences:</strong> For each option, what are the likely outcomes for all stakeholders?</li>
              <li><strong>Identify your values and biases:</strong> What's driving your inclination one way or another? Is it ethical 
              reasoning or personal preference?</li>
              <li><strong>Decide and act:</strong> Make the best decision you can with the information you have.</li>
              <li><strong>Evaluate and reflect:</strong> How did it turn out? What did you learn? Would you do it differently next time?</li>
            </ol>

            <h2>Living with Moral Uncertainty</h2>

            <p>
              Here's the hard truth: Sometimes there is no clearly "right" answer. You'll make your best judgment, 
              and you might still wonder if you did the right thing. You'll violate one ethical principle to honor 
              another. You'll hurt someone even as you're trying to help.
            </p>

            <p>
              This is <strong>moral distress</strong>—the anguish of having to choose between competing goods or the 
              lesser of evils. It's uncomfortable, but it's also a sign you're taking ethics seriously. If you're 
              never distressed, you're either in an easier job or not paying attention.
            </p>

            <p><strong>How to bear moral uncertainty:</strong></p>
            <ul>
              <li>Accept that you won't always get it right</li>
              <li>Develop tolerance for ambiguity</li>
              <li>Use consultation and supervision to share the burden</li>
              <li>Document your reasoning so you can explain your decisions</li>
              <li>Make repair when you realize you've erred</li>
              <li>Practice self-compassion—this work is hard</li>
            </ul>

            <h2>Accountability</h2>

            <p>
              Ethical practice requires accountability. You need structures and relationships that help you see 
              your blind spots and correct your course.
            </p>

            <p><strong>Build accountability through:</strong></p>
            <ul>
              <li>Regular clinical supervision</li>
              <li>Peer consultation groups</li>
              <li>Ethics training and continuing education</li>
              <li>Willingness to be challenged and receive feedback</li>
              <li>Relationship with your licensing board's ethics standards</li>
              <li>Openness to client feedback and complaints</li>
            </ul>

            <div className="mt-8 p-6 bg-amber-50 rounded-lg border-l-4 border-amber-500">
              <h3 className="text-lg font-bold text-amber-900 mb-2">⚖️ Ethics as Practice, Not Perfection</h3>
              <p className="text-amber-800 mb-0">
                You will make ethical mistakes. You will look back on decisions and cringe. You will prioritize 
                the wrong thing, miss important information, let your biases cloud your judgment. This is inevitable. 
                What matters is that you stay committed to ethical reflection, seek consultation when uncertain, 
                make repair when you err, and continue learning. Ethics is not about being perfect—it's about being 
                accountable, humble, and committed to doing better. That's enough.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
