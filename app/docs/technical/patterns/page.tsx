import Link from 'next/link';

export default function PatternsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/vertex/technical" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
          ← Back to Technical Vertex
        </Link>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 text-sm font-medium rounded-full mb-3">
              Reference
            </span>
            <h1 className="text-4xl font-bold text-white mb-2">
              Configuration Patterns
            </h1>
            <p className="text-xl text-slate-300">
              Common system configuration templates
            </p>
          </div>

          <div className="prose prose-invert prose-blue max-w-none">
            <h2>Introduction to Configuration Patterns</h2>
            <p>
              Just as software engineers use design patterns to solve common problems, family 
              systems practitioners can benefit from recognizing common configurations and their 
              typical solutions. This document catalogs proven patterns for various scenarios.
            </p>
            <p>
              <strong>Important:</strong> These are starting templates, not rigid prescriptions. 
              Every family is unique. Use these patterns as scaffolding, then customize based on 
              specific assessment data.
            </p>

            <h2>Divorce/Separation Patterns</h2>

            <h3>Pattern: High-Conflict Co-Parenting</h3>
            <p><strong>Characteristics:</strong></p>
            <ul>
              <li>Frequent disputes requiring legal or third-party intervention</li>
              <li>Parallel parenting structure (minimal direct communication)</li>
              <li>Children caught in loyalty conflicts</li>
              <li>High triangulation with extended family or legal system</li>
            </ul>
            <p><strong>Configuration Approach:</strong></p>
            <ul>
              <li><strong>Structure Type:</strong> Family - Divorce/Separation</li>
              <li><strong>Communication Pattern:</strong> Structured, written, through neutral platform</li>
              <li><strong>Key Nodes:</strong> Both parents (Technical OS), Children (Emotional OS), Legal rep (Technical OS)</li>
              <li><strong>Primary Goal:</strong> Reduce conflict exposure for children while maintaining both parent relationships</li>
              <li><strong>Timeline:</strong> 6-12 months to establish stable parallel parenting</li>
            </ul>
            <p><strong>Critical Interventions:</strong></p>
            <ul>
              <li>Implement structured communication protocol (email only, 48-hour response time)</li>
              <li>Clear boundaries: "business partners" not "former lovers"</li>
              <li>Shield children from adult conflict completely</li>
              <li>Parallel routines in each home (consistency without coordination)</li>
              <li>Individual therapy for children to process divided loyalty</li>
            </ul>

            <h3>Pattern: Cooperative Co-Parenting Post-Divorce</h3>
            <p><strong>Characteristics:</strong></p>
            <ul>
              <li>Mutual respect despite relationship end</li>
              <li>Ability to communicate directly about children</li>
              <li>Flexible custody arrangements based on children's needs</li>
              <li>Low legal system involvement</li>
            </ul>
            <p><strong>Configuration Approach:</strong></p>
            <ul>
              <li><strong>Structure Type:</strong> Family - Divorce/Separation</li>
              <li><strong>Communication Pattern:</strong> Direct, flexible, child-focused</li>
              <li><strong>Key Nodes:</strong> Both parents (Practical OS), Children (varies by age)</li>
              <li><strong>Primary Goal:</strong> Maintain strong relationships with both parents while adapting to two-home reality</li>
              <li><strong>Timeline:</strong> 3-6 months to stabilize new normal</li>
            </ul>
            <p><strong>Critical Interventions:</strong></p>
            <ul>
              <li>Regular co-parent check-ins to align on parenting decisions</li>
              <li>Shared calendar and information systems</li>
              <li>Flexibility protocols for schedule changes</li>
              <li>Age-appropriate child input on scheduling</li>
              <li>United front on major decisions (school, medical, etc.)</li>
            </ul>

            <h3>Pattern: One-Parent-Disengaged</h3>
            <p><strong>Characteristics:</strong></p>
            <ul>
              <li>One parent has minimal or no contact</li>
              <li>Primary parent carries full responsibility</li>
              <li>Children experience loss and/or relief</li>
              <li>Financial support may or may not be present</li>
            </ul>
            <p><strong>Configuration Approach:</strong></p>
            <ul>
              <li><strong>Structure Type:</strong> Family - Divorce/Separation (single parent reality)</li>
              <li><strong>Key Nodes:</strong> Primary parent, Children, Extended family support, Possible step-parent</li>
              <li><strong>Primary Goal:</strong> Build stable, sufficient single-parent system with adequate support</li>
              <li><strong>Timeline:</strong> 6-12 months to establish sustainable routines</li>
            </ul>
            <p><strong>Critical Interventions:</strong></p>
            <ul>
              <li>Build robust support network for primary parent (avoid burnout)</li>
              <li>Help children process absent parent without vilification or false hope</li>
              <li>Establish clear routines that one adult can manage</li>
              <li>Financial stability planning</li>
              <li>Self-care protocols for primary parent</li>
            </ul>

            <h2>Intact Family Patterns</h2>

            <h3>Pattern: Parental Conflict with Child Symptom</h3>
            <p><strong>Characteristics:</strong></p>
            <ul>
              <li>Marital tension not directly addressed</li>
              <li>Child exhibiting behavioral or emotional problems</li>
              <li>Child's symptoms distract from or stabilize parental issues</li>
              <li>Parents unite around "fixing" the child</li>
            </ul>
            <p><strong>Configuration Approach:</strong></p>
            <ul>
              <li><strong>Structure Type:</strong> Family - Intact</li>
              <li><strong>Key Nodes:</strong> Parent 1, Parent 2 (focus on marital subsystem), Symptom-bearing child</li>
              <li><strong>Primary Goal:</strong> Address parental relationship while supporting child</li>
              <li><strong>Timeline:</strong> 6-12 months (marital work takes time)</li>
            </ul>
            <p><strong>Critical Interventions:</strong></p>
            <ul>
              <li>Couples therapy for parents as primary intervention</li>
              <li>Reframe child's symptoms as system response, not individual pathology</li>
              <li>Strengthen marital boundary (parents work on their issues privately)</li>
              <li>Support child separately without making them the identified patient</li>
              <li>As parental relationship improves, child symptoms often resolve</li>
            </ul>

            <h3>Pattern: Over-Functioning/Under-Functioning Dyad</h3>
            <p><strong>Characteristics:</strong></p>
            <ul>
              <li>One partner manages most responsibilities</li>
              <li>Other partner increasingly dependent or checked out</li>
              <li>Resentment building in over-functioner</li>
              <li>Helplessness increasing in under-functioner</li>
            </ul>
            <p><strong>Configuration Approach:</strong></p>
            <ul>
              <li><strong>Structure Type:</strong> Family - Intact</li>
              <li><strong>Key Nodes:</strong> Over-functioning partner, Under-functioning partner</li>
              <li><strong>Primary Goal:</strong> Rebalance responsibility distribution</li>
              <li><strong>Timeline:</strong> 3-6 months to shift patterns</li>
            </ul>
            <p><strong>Critical Interventions:</strong></p>
            <ul>
              <li>Over-functioner must intentionally step back (hardest part)</li>
              <li>Under-functioner must step up into specific, clear responsibilities</li>
              <li>Start small with low-stakes tasks to build competence and confidence</li>
              <li>Address underlying issues (depression, anxiety, learned helplessness)</li>
              <li>Celebrate under-functioner successes; support over-functioner's discomfort with letting go</li>
            </ul>

            <h3>Pattern: Parent-Child Coalition</h3>
            <p><strong>Characteristics:</strong></p>
            <ul>
              <li>One parent forms inappropriate alliance with child</li>
              <li>Child becomes confidant, advisor, or replacement partner</li>
              <li>Other parent excluded or undermined</li>
              <li>Child burdened with adult responsibilities/information</li>
            </ul>
            <p><strong>Configuration Approach:</strong></p>
            <ul>
              <li><strong>Structure Type:</strong> Family - Intact</li>
              <li><strong>Key Nodes:</strong> Aligned parent, Excluded parent, Triangulated child</li>
              <li><strong>Primary Goal:</strong> Restore generational boundaries</li>
              <li><strong>Timeline:</strong> 6-9 months</li>
            </ul>
            <p><strong>Critical Interventions:</strong></p>
            <ul>
              <li>Strengthen marital subsystem (parents must reconnect)</li>
              <li>Clear communication: child released from adult role</li>
              <li>Align parent learns to take concerns to partner, not child</li>
              <li>Excluded parent invited back into parental leadership</li>
              <li>Child supported in age-appropriate role with peer relationships</li>
            </ul>

            <h2>Blended Family Patterns</h2>

            <h3>Pattern: Loyalty Conflicts in Step-Families</h3>
            <p><strong>Characteristics:</strong></p>
            <ul>
              <li>Children feel disloyal to biological parent when bonding with step-parent</li>
              <li>Ex-partner threatens or undermines new family</li>
              <li>Step-parent unsure of role and authority</li>
              <li>Biological parent caught in middle</li>
            </ul>
            <p><strong>Configuration Approach:</strong></p>
            <ul>
              <li><strong>Structure Type:</strong> Family - Divorce/Separation (with remarriage complexity)</li>
              <li><strong>Key Nodes:</strong> Biological parent, Step-parent, Children, Ex-partner</li>
              <li><strong>Primary Goal:</strong> Establish clear step-family structure while honoring biological ties</li>
              <li><strong>Timeline:</strong> 12-24 months (step-family formation is slow)</li>
            </ul>
            <p><strong>Critical Interventions:</strong></p>
            <ul>
              <li>Go slow: step-parent role develops gradually (friend first, authority much later)</li>
              <li>Biological parent maintains primary parenting authority initially</li>
              <li>Clear message to children: loving step-parent doesn't betray biological parent</li>
              <li>Strong couple subsystem (new marriage) is foundation</li>
              <li>Respect and maintain children's relationship with non-custodial parent</li>
              <li>Family rituals that honor both old and new family identities</li>
            </ul>

            <h2>Work Team Patterns</h2>

            <h3>Pattern: Absence of Trust (Dysfunction #1)</h3>
            <p><strong>Characteristics:</strong></p>
            <ul>
              <li>Team members don't share vulnerabilities</li>
              <li>Meetings are guarded and careful</li>
              <li>Hidden agendas and politics</li>
              <li>Low commitment to decisions</li>
            </ul>
            <p><strong>Configuration Approach:</strong></p>
            <ul>
              <li><strong>Structure Type:</strong> Work Team</li>
              <li><strong>Team Size:</strong> Any size affected, but especially problematic in small teams</li>
              <li><strong>Primary Goal:</strong> Build vulnerability-based trust</li>
              <li><strong>Timeline:</strong> 3-6 months of consistent practice</li>
            </ul>
            <p><strong>Critical Interventions:</strong></p>
            <ul>
              <li>Leader models vulnerability first (shares mistakes, asks for help)</li>
              <li>Team-building exercises focused on personal histories</li>
              <li>Regular opportunities for team members to share challenges</li>
              <li>Zero tolerance for breach of confidence</li>
              <li>Celebrate risk-taking and vulnerability</li>
            </ul>

            <h3>Pattern: Fear of Conflict (Dysfunction #2)</h3>
            <p><strong>Characteristics:</strong></p>
            <ul>
              <li>Artificial harmony in meetings</li>
              <li>Important issues not discussed</li>
              <li>Passive-aggressive behavior outside meetings</li>
              <li>Back-channel conversations and triangulation</li>
            </ul>
            <p><strong>Configuration Approach:</strong></p>
            <ul>
              <li><strong>Structure Type:</strong> Work Team</li>
              <li><strong>Primary Goal:</strong> Make productive conflict safe and normal</li>
              <li><strong>Timeline:</strong> 2-4 months</li>
            </ul>
            <p><strong>Critical Interventions:</strong></p>
            <ul>
              <li>Distinguish productive conflict (about ideas) from destructive conflict (personal attacks)</li>
              <li>Teach and practice conflict resolution skills</li>
              <li>Mine for conflict: "What are we not talking about?"</li>
              <li>Real-time permission: "Let's have that argument right now"</li>
              <li>Conflict resolution norms clearly established</li>
            </ul>

            <h2>Using These Patterns</h2>

            <h3>Step 1: Pattern Recognition</h3>
            <p>
              As you complete the configurator wizard, identify which patterns match your situation. 
              You may see elements of multiple patterns.
            </p>

            <h3>Step 2: Customization</h3>
            <p>
              Take the relevant pattern(s) and adjust based on:
            </p>
            <ul>
              <li>Specific node characteristics (ages, operating systems, etc.)</li>
              <li>Cultural and contextual factors</li>
              <li>Resources and constraints</li>
              <li>Stakeholder involvement</li>
            </ul>

            <h3>Step 3: Implementation</h3>
            <p>
              Use the pattern as a guide, not a script. Stay attuned to how the system responds 
              and adjust as needed.
            </p>

            <h3>Step 4: Iteration</h3>
            <p>
              As you implement, you'll discover what works and what doesn't for this specific 
              system. Capture your learnings and refine the pattern for future similar situations.
            </p>

            <div className="mt-8 p-6 bg-blue-600/20 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-lg font-bold text-white mb-2">🎯 Pattern Recognition</h3>
              <p className="text-slate-300 mb-0">
                Patterns are valuable because they represent accumulated wisdom from many 
                practitioners working with many families. But wisdom without adaptation is 
                rigidity. Use these patterns to accelerate your understanding, then let the 
                specific family teach you how they need it done.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
