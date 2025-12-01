import Link from 'next/link';

export default function SystemsThinkingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/vertex/technical" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
          ← Back to Technical Vertex
        </Link>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 text-sm font-medium rounded-full mb-3">
              Foundations
            </span>
            <h1 className="text-4xl font-bold text-white mb-2">
              Systems Thinking Framework
            </h1>
            <p className="text-xl text-slate-300">
              Core principles of systems analysis and design
            </p>
          </div>

          <div className="prose prose-invert prose-blue max-w-none">
            <h2>Introduction to Systems Thinking</h2>
            <p>
              Family systems are not merely collections of individuals—they are complex, 
              interconnected networks where each person's behavior affects and is affected 
              by every other member. Understanding this fundamental principle is essential 
              for effective intervention and sustainable change.
            </p>

            <h2>Core Principles</h2>
            
            <h3>1. Wholeness and Interdependence</h3>
            <p>
              The system is greater than the sum of its parts. A family cannot be understood 
              by examining individuals in isolation. Each member exists within a web of 
              relationships, and changes in one part of the system ripple throughout the whole.
            </p>
            <ul>
              <li><strong>Circular Causality:</strong> Events are interconnected in loops rather than linear chains</li>
              <li><strong>Mutual Influence:</strong> Every member both shapes and is shaped by the system</li>
              <li><strong>Emergent Properties:</strong> The system exhibits behaviors that don't exist at the individual level</li>
            </ul>

            <h3>2. Boundaries and Subsystems</h3>
            <p>
              Healthy systems maintain clear yet permeable boundaries between subsystems 
              (parental, sibling, extended family) while allowing appropriate communication 
              and exchange.
            </p>
            <ul>
              <li><strong>Clear Boundaries:</strong> Roles and responsibilities are well-defined</li>
              <li><strong>Rigid Boundaries:</strong> Over-isolation leads to disconnection</li>
              <li><strong>Diffuse Boundaries:</strong> Over-involvement creates enmeshment</li>
              <li><strong>Healthy Permeability:</strong> Appropriate information flow between subsystems</li>
            </ul>

            <h3>3. Homeostasis and Change</h3>
            <p>
              Systems naturally seek equilibrium. Even dysfunctional patterns persist because 
              they serve a stabilizing function. Change requires understanding what the current 
              pattern is maintaining.
            </p>
            <ul>
              <li><strong>Feedback Loops:</strong> Mechanisms that maintain or alter system behavior</li>
              <li><strong>Resistance to Change:</strong> Natural system defense against disruption</li>
              <li><strong>Second-Order Change:</strong> Transformation of the system's rules, not just behaviors</li>
            </ul>

            <h3>4. Hierarchy and Structure</h3>
            <p>
              Functional families maintain appropriate generational hierarchy where parents 
              lead, children follow, and everyone's voice is heard within their role.
            </p>
            <ul>
              <li><strong>Parental Leadership:</strong> Adults provide structure and guidance</li>
              <li><strong>Age-Appropriate Involvement:</strong> Children participate according to developmental stage</li>
              <li><strong>Avoiding Triangulation:</strong> Two-person conflicts stay between those two people</li>
            </ul>

            <h2>Key Concepts in Family Systems</h2>

            <h3>Differentiation of Self</h3>
            <p>
              The ability to maintain one's sense of self while remaining emotionally connected 
              to the family. High differentiation allows for both intimacy and autonomy.
            </p>

            <h3>Triangulation</h3>
            <p>
              When tension between two people becomes uncomfortable, a third person is drawn in 
              to stabilize the relationship. This is one of the most common dysfunctional patterns.
            </p>

            <h3>Genograms</h3>
            <p>
              Visual maps of family relationships across generations, revealing patterns, 
              alliances, conflicts, and structural issues that repeat through time.
            </p>

            <h3>Communication Patterns</h3>
            <p>
              How information flows through the system—who talks to whom, what topics are 
              taboo, who has access to what information—shapes the entire system's functioning.
            </p>

            <h2>Applying Systems Thinking</h2>

            <h3>Assessment Questions</h3>
            <ul>
              <li>What is the presenting problem trying to solve or maintain?</li>
              <li>Who benefits from the current pattern, even if it's dysfunctional?</li>
              <li>What would happen if this problem suddenly disappeared?</li>
              <li>How do different subsystems interact around this issue?</li>
              <li>What rules govern communication about this topic?</li>
              <li>What patterns from previous generations are being repeated?</li>
            </ul>

            <h3>Intervention Strategies</h3>
            <p>
              Effective systems interventions target the structure and patterns, not just 
              individual behaviors:
            </p>
            <ul>
              <li><strong>Reframe Problems:</strong> Shift from individual pathology to system function</li>
              <li><strong>Modify Boundaries:</strong> Strengthen, weaken, or clarify subsystem boundaries</li>
              <li><strong>Change Communication Rules:</strong> Create new channels or close inappropriate ones</li>
              <li><strong>Redistribute Power:</strong> Restore appropriate generational hierarchy</li>
              <li><strong>Break Triangles:</strong> Help two-person conflicts stay between two people</li>
            </ul>

            <h2>Common System Patterns</h2>

            <h3>The Symptom Bearer</h3>
            <p>
              One family member (often a child) exhibits symptoms that distract from or stabilize 
              other system tensions. The symptom serves a function for the whole system.
            </p>

            <h3>Enmeshment vs. Disengagement</h3>
            <p>
              Systems tend toward one extreme: enmeshed families have blurred boundaries and 
              over-involvement; disengaged families have rigid boundaries and emotional distance.
            </p>

            <h3>Parent-Child Coalition</h3>
            <p>
              When one parent forms an inappropriate alliance with a child against the other parent, 
              disrupting the marital subsystem and burdening the child with adult responsibilities.
            </p>

            <h3>Scapegoating</h3>
            <p>
              One member is consistently blamed for system problems, allowing others to avoid 
              examining their own contributions to dysfunction.
            </p>

            <h2>Integration with Phenix Framework</h2>
            <p>
              Systems thinking provides the technical foundation for all Phenix interventions. 
              Before applying emotional support, practical tools, or philosophical guidance, 
              you must understand the system's structure, patterns, and functions.
            </p>
            <p>
              The configuration wizard in this framework captures essential system information 
              that allows for accurate structural analysis. The protocols generated consider 
              not just individual needs but system-wide patterns and their functions.
            </p>

            <div className="mt-8 p-6 bg-blue-600/20 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-lg font-bold text-white mb-2">🎯 Key Takeaway</h3>
              <p className="text-slate-300 mb-0">
                Never intervene with an individual without understanding the system they're part of. 
                The "problem" is often the system's attempt at a solution. Your job is to understand 
                what it's solving for, then help the system find a healthier way to solve it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
