import Link from 'next/link';

export default function RelationshipsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/vertex/emotional" className="text-purple-400 hover:text-purple-300 mb-6 inline-block">
          ← Back to Emotional Vertex
        </Link>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-purple-600/20 text-purple-400 text-sm font-medium rounded-full mb-3">
              Assessment
            </span>
            <h1 className="text-4xl font-bold text-white mb-2">
              Relationship Mapping
            </h1>
            <p className="text-xl text-slate-300">
              Understanding interpersonal dynamics
            </p>
          </div>

          <div className="prose prose-invert prose-purple max-w-none">
            <h2>Understanding Relationship Dynamics</h2>
            <p>
              Relationships are the connective tissue of family systems. Understanding who connects 
              to whom, how, and why is essential for effective intervention. Relationship mapping 
              makes invisible dynamics visible, revealing patterns that might otherwise remain hidden.
            </p>

            <h2>Core Relationship Dimensions</h2>

            <h3>Closeness vs. Distance</h3>
            <p>
              How emotionally close or distant are various dyads (two-person relationships) in the system?
            </p>
            <ul>
              <li><strong>Enmeshed:</strong> No boundaries, over-involved, can't function independently</li>
              <li><strong>Close:</strong> Connected, emotionally intimate, healthy interdependence</li>
              <li><strong>Distant:</strong> Limited connection, minimal emotional sharing</li>
              <li><strong>Cut-off:</strong> No contact, relationship severed</li>
            </ul>
            <p><strong>Map it:</strong> Use line thickness (thick = close, thin = distant) or distance between people</p>

            <h3>Conflict vs. Harmony</h3>
            <p>
              What's the typical interaction pattern between these two people?
            </p>
            <ul>
              <li><strong>Chronic Conflict:</strong> Frequent arguments, tension, unresolved issues</li>
              <li><strong>Occasional Conflict:</strong> Normal disagreements, usually resolved</li>
              <li><strong>Neutral:</strong> Neither conflictual nor especially warm</li>
              <li><strong>Harmonious:</strong> Easy, comfortable, mutually supportive</li>
            </ul>
            <p><strong>Map it:</strong> Use line style (zigzag = conflict, smooth = harmony) or color coding</p>

            <h3>Power and Influence</h3>
            <p>
              Who has power in this relationship? Is it balanced or asymmetrical?
            </p>
            <ul>
              <li><strong>Symmetrical:</strong> Equal power, mutual influence</li>
              <li><strong>Complementary:</strong> One leads, one follows (appropriate in parent-child)</li>
              <li><strong>Unbalanced:</strong> One dominates, other submits (problematic in adult relationships)</li>
            </ul>
            <p><strong>Map it:</strong> Arrow direction showing influence flow, or size of symbols</p>

            <h3>Communication Patterns</h3>
            <p>
              How do these two people communicate?
            </p>
            <ul>
              <li><strong>Open:</strong> Honest, direct, frequent communication</li>
              <li><strong>Guarded:</strong> Careful, limited topics, superficial</li>
              <li><strong>Triangulated:</strong> Communication through third party</li>
              <li><strong>Non-existent:</strong> No communication</li>
            </ul>

            <h2>Mapping Methods</h2>

            <h3>The Genogram</h3>
            <p>
              A genogram is a family tree with relationship information overlaid. It shows:
            </p>
            <ul>
              <li><strong>Structure:</strong> Who's related to whom, marriages, divorces, children</li>
              <li><strong>Demographics:</strong> Ages, locations, occupations</li>
              <li><strong>Medical/Psychological:</strong> Health conditions, substance use, mental health</li>
              <li><strong>Relationships:</strong> Quality of connections between members</li>
              <li><strong>Patterns:</strong> Recurring themes across generations</li>
            </ul>
            <p><strong>Genogram Symbols:</strong></p>
            <ul>
              <li>Square = male, Circle = female, Triangle = pregnancy</li>
              <li>X through symbol = deceased</li>
              <li>Marriage: straight line connecting two people</li>
              <li>Divorce: two slashes through marriage line</li>
              <li>Children: vertical lines down from marriage line</li>
              <li>Close relationship: three parallel lines</li>
              <li>Conflictual: zigzag line</li>
              <li>Cut-off: broken line</li>
            </ul>

            <h3>The Ecomap</h3>
            <p>
              An ecomap shows the family's relationships with external systems and resources:
            </p>
            <ul>
              <li>Family unit in center circle</li>
              <li>External systems in surrounding circles (school, work, extended family, church, 
              therapist, legal system, friends, etc.)</li>
              <li>Lines show nature of connection (strong, weak, stressful, supportive)</li>
            </ul>
            <p>Useful for identifying support networks and sources of stress.</p>

            <h3>The Sociogram</h3>
            <p>
              A snapshot of relationships at a specific moment in time:
            </p>
            <ul>
              <li>Each person represented by a symbol</li>
              <li>Positioning shows emotional distance (closer together = closer relationship)</li>
              <li>Lines show type of connection</li>
              <li>Can show alliances, coalitions, triangles</li>
            </ul>

            <h2>Common Relationship Patterns</h2>

            <h3>Triangulation</h3>
            <p>
              When two people have tension, they pull in a third to stabilize. The classic example: 
              parents in conflict focus on a child's problems, temporarily uniting them.
            </p>
            <p><strong>How to spot it:</strong> Look for three-person configurations where two people's issues 
            are expressed through or managed via the third.</p>
            <p><strong>Map it:</strong> Draw triangle with the person "in the middle" at the apex</p>

            <h3>Coalitions</h3>
            <p>
              When two family members ally against a third, especially across generational boundaries.
            </p>
            <p><strong>Example:</strong> Mother and child allied against father</p>
            <p><strong>Problem:</strong> Undermines parental authority, burdens child, excludes one parent</p>
            <p><strong>Map it:</strong> Strong connection line between allies, weak or conflictual to excluded member</p>

            <h3>Scapegoating</h3>
            <p>
              One member consistently blamed for system problems, even when they're not at fault.
            </p>
            <p><strong>Function:</strong> Allows others to avoid examining their own contributions</p>
            <p><strong>Map it:</strong> Multiple arrows pointing to the scapegoat from others</p>

            <h3>The Over-functioner/Under-functioner Dyad</h3>
            <p>
              One person does too much, the other too little. The more one does, the less the other does.
            </p>
            <p><strong>Map it:</strong> Different sized symbols, or labels showing responsibility distribution</p>

            <h3>Pursuer-Distancer Pattern</h3>
            <p>
              One person seeks closeness and connection, the other needs space. The more one pursues, 
              the more the other distances, which triggers more pursuit.
            </p>
            <p><strong>Map it:</strong> Arrows showing direction of pursuit/retreat</p>

            <h2>Creating Your Own Relationship Map</h2>

            <h3>Step 1: Identify All Relevant People</h3>
            <p>Who are the key players in this system? Include:</p>
            <ul>
              <li>All household members</li>
              <li>Non-custodial parents</li>
              <li>Step-parents and step-siblings</li>
              <li>Grandparents and extended family if significantly involved</li>
              <li>New partners/significant others</li>
            </ul>

            <h3>Step 2: Map Primary Relationships</h3>
            <p>For each pair of people, consider:</p>
            <ul>
              <li>How close or distant are they?</li>
              <li>Is the relationship primarily harmonious or conflictual?</li>
              <li>Who has power/influence?</li>
              <li>How do they communicate?</li>
            </ul>

            <h3>Step 3: Identify Patterns</h3>
            <p>Look for:</p>
            <ul>
              <li>Triangles: Where are they? Who's typically in the middle?</li>
              <li>Coalitions: Who's allied with whom?</li>
              <li>Isolated members: Who's on the periphery?</li>
              <li>Central members: Who's over-connected to everyone?</li>
              <li>Cut-offs: Who's not in relationship with whom?</li>
            </ul>

            <h3>Step 4: Consider History</h3>
            <p>How did these patterns develop? Are they:</p>
            <ul>
              <li>Long-standing ("It's always been this way")?</li>
              <li>Recent ("Since the divorce...")?</li>
              <li>Reactive ("When X happened, Y started...")?</li>
              <li>Multigenerational ("Just like how Grandma and Mom were")?</li>
            </ul>

            <h3>Step 5: Assess Functionality</h3>
            <p>Which patterns are:</p>
            <ul>
              <li><strong>Healthy:</strong> Appropriate closeness, clear boundaries, mutual support</li>
              <li><strong>Problematic:</strong> Enmeshment, cut-offs, chronic conflict, inappropriate coalitions</li>
              <li><strong>Adaptive:</strong> May not be ideal but serving a protective function right now</li>
            </ul>

            <h2>Using Maps for Intervention</h2>

            <h3>Identify Leverage Points</h3>
            <p>
              Where could small changes create big ripples? Often, intervening in central relationships 
              (like the parental dyad) affects many other relationships.
            </p>

            <h3>Break Triangles</h3>
            <p>
              Help two people deal with their issues directly instead of through a third party. 
              Support the "middle person" in stepping out of the triangle.
            </p>

            <h3>Strengthen Appropriate Boundaries</h3>
            <p>
              If parent-child boundary is weak, strengthen parental subsystem. If couple is too distant, 
              create opportunities for connection.
            </p>

            <h3>Redistribute Connection</h3>
            <p>
              If one child is over-connected to parents and siblings are distant, create opportunities 
              for all children to connect.
            </p>

            <h3>Heal Cut-Offs (When Appropriate)</h3>
            <p>
              Sometimes cut-offs protect people from abuse—these should not be healed. But some cut-offs 
              are reactive and might benefit from careful repair work.
            </p>

            <h2>Tools and Templates</h2>

            <h3>Quick Assessment Questions</h3>
            <p>For each important relationship in the system:</p>
            <ul>
              <li>How would you describe this relationship in one sentence?</li>
              <li>On a scale of 1-10, how close/connected do these two people feel?</li>
              <li>How often do they conflict? How do conflicts usually resolve?</li>
              <li>What does this relationship need more of? Less of?</li>
              <li>If you could change one thing about this relationship, what would it be?</li>
            </ul>

            <div className="mt-8 p-6 bg-purple-600/20 rounded-lg border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-white mb-2">🗺️ Mapping Wisdom</h3>
              <p className="text-slate-300 mb-0">
                A relationship map is not the territory—it's just one representation of reality. 
                Different family members may draw very different maps of the same system. That's 
                valuable information too. The goal isn't to create the "correct" map, but to gain 
                insight into how relationships function and where change is needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
