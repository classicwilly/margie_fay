import Link from 'next/link';

export default function ProtocolDevelopmentPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/vertex/technical" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
          ← Back to Technical Vertex
        </Link>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 text-sm font-medium rounded-full mb-3">
              Implementation
            </span>
            <h1 className="text-4xl font-bold text-white mb-2">
              Protocol Development Guide
            </h1>
            <p className="text-xl text-slate-300">
              How to create effective deployment protocols
            </p>
          </div>

          <div className="prose prose-invert prose-blue max-w-none">
            <h2>What Is a Deployment Protocol?</h2>
            <p>
              A deployment protocol is a customized roadmap for implementing change in a family 
              system. Unlike generic advice, protocols are tailored to specific system configurations, 
              taking into account structure type, node characteristics, operating systems, and 
              stakeholder involvement.
            </p>

            <h2>Core Components of an Effective Protocol</h2>

            <h3>1. Master Overview</h3>
            <p>
              The master overview provides the 30,000-foot view of the entire intervention:
            </p>
            <ul>
              <li><strong>System Profile:</strong> Current configuration and key characteristics</li>
              <li><strong>Primary Objectives:</strong> What success looks like for this specific system</li>
              <li><strong>Strategic Approach:</strong> Overall methodology based on system type</li>
              <li><strong>Risk Factors:</strong> Potential obstacles and mitigation strategies</li>
              <li><strong>Timeline:</strong> Realistic phasing of intervention stages</li>
            </ul>

            <h3>2. Individual Protocols</h3>
            <p>
              Each node (person) in the system receives a tailored protocol addressing their 
              specific needs, operating system, and role:
            </p>
            <ul>
              <li><strong>Node Profile:</strong> Age, role, operating system (Technical/Emotional/Practical/Analytical)</li>
              <li><strong>Personalized Objectives:</strong> What this individual needs to achieve</li>
              <li><strong>Communication Guidelines:</strong> How to interact with this person effectively</li>
              <li><strong>Action Steps:</strong> Concrete tasks tailored to their OS and capacity</li>
              <li><strong>Support Needs:</strong> Resources and assistance this person requires</li>
            </ul>

            <h3>3. Stakeholder Templates</h3>
            <p>
              External parties often play crucial roles. Templates help them understand their part:
            </p>
            <ul>
              <li><strong>Legal Professionals:</strong> What attorneys, mediators, and courts need to know</li>
              <li><strong>Therapeutic Support:</strong> Guidance for therapists and counselors</li>
              <li><strong>Educational Systems:</strong> Information for schools and teachers</li>
              <li><strong>Extended Family:</strong> How relatives can help or stay out of the way</li>
            </ul>

            <h3>4. Timeline and Milestones</h3>
            <p>
              Change takes time, and realistic pacing prevents burnout and resistance:
            </p>
            <ul>
              <li><strong>Milestone 0% - Assessment:</strong> Understanding the current state</li>
              <li><strong>Milestone 25% - Foundation:</strong> Establishing basic structures</li>
              <li><strong>Milestone 50% - Implementation:</strong> Active change in progress</li>
              <li><strong>Milestone 75% - Integration:</strong> New patterns becoming habitual</li>
              <li><strong>Milestone 100% - Maintenance:</strong> System operating in new equilibrium</li>
            </ul>

            <h3>5. Success Metrics</h3>
            <p>
              Measurable indicators help track progress across multiple dimensions:
            </p>
            <ul>
              <li><strong>Emotional Wellbeing:</strong> Stress levels, emotional regulation, relationship quality</li>
              <li><strong>Communication:</strong> Clarity, respect, conflict resolution effectiveness</li>
              <li><strong>Stability:</strong> Consistency, predictability, routine maintenance</li>
              <li><strong>Individual Functioning:</strong> School/work performance, self-care, development</li>
              <li><strong>System Health:</strong> Boundary clarity, hierarchy, flexibility</li>
            </ul>

            <h3>6. Contingency Plans</h3>
            <p>
              Family systems are unpredictable. Protocols must include backup plans:
            </p>
            <ul>
              <li><strong>Escalation Scenarios:</strong> What to do if conflict intensifies</li>
              <li><strong>Regression Plans:</strong> How to respond to backward movement</li>
              <li><strong>External Shocks:</strong> Handling unexpected life events</li>
              <li><strong>Non-Compliance:</strong> Strategies when members don't follow the plan</li>
            </ul>

            <h2>Development Process</h2>

            <h3>Phase 1: Comprehensive Assessment</h3>
            <p>
              Before writing a protocol, gather complete information:
            </p>
            <ol>
              <li><strong>Structure Identification:</strong> What type of system are you working with?</li>
              <li><strong>Node Mapping:</strong> Who are the key players and what are their characteristics?</li>
              <li><strong>State Assessment:</strong> What is the current emotional and functional state?</li>
              <li><strong>Operating Systems:</strong> How does each person process information and make decisions?</li>
              <li><strong>Stakeholder Analysis:</strong> Who else is involved or needs to be?</li>
              <li><strong>Constraints:</strong> What are the time, resource, and situational limitations?</li>
            </ol>

            <h3>Phase 2: Strategic Planning</h3>
            <p>
              Use assessment data to create strategy:
            </p>
            <ul>
              <li><strong>Identify Leverage Points:</strong> Where can small changes create big effects?</li>
              <li><strong>Sequence Interventions:</strong> What must happen first, second, third?</li>
              <li><strong>Match to Operating Systems:</strong> Tailor approach to how each person thinks</li>
              <li><strong>Account for Resistance:</strong> Anticipate and plan for pushback</li>
              <li><strong>Build Support Systems:</strong> Identify allies and resources</li>
            </ul>

            <h3>Phase 3: Protocol Drafting</h3>
            <p>
              Write clear, actionable protocols that people can actually follow:
            </p>
            <ul>
              <li><strong>Use Simple Language:</strong> Avoid jargon; write for the audience</li>
              <li><strong>Be Specific:</strong> "Talk weekly" not "communicate more"</li>
              <li><strong>Include Rationale:</strong> Explain why each step matters</li>
              <li><strong>Provide Examples:</strong> Show what success looks like</li>
              <li><strong>Build in Flexibility:</strong> Allow for adaptation as circumstances change</li>
            </ul>

            <h3>Phase 4: Review and Refinement</h3>
            <p>
              Protocols should be living documents:
            </p>
            <ul>
              <li><strong>Stakeholder Review:</strong> Get input from those who will implement it</li>
              <li><strong>Feasibility Check:</strong> Is this realistic given real-world constraints?</li>
              <li><strong>Gap Analysis:</strong> What's missing? What's unclear?</li>
              <li><strong>Revision Cycles:</strong> Iterate based on feedback</li>
            </ul>

            <h2>Best Practices</h2>

            <h3>DO:</h3>
            <ul>
              <li>✓ Start with thorough assessment before prescribing solutions</li>
              <li>✓ Customize to the specific system configuration</li>
              <li>✓ Match language and approach to each person's operating system</li>
              <li>✓ Build in realistic timelines with buffer for setbacks</li>
              <li>✓ Include clear metrics so progress can be measured</li>
              <li>✓ Provide contingency plans for likely obstacles</li>
              <li>✓ Write in clear, accessible language</li>
              <li>✓ Review and update protocols as circumstances change</li>
            </ul>

            <h3>DON'T:</h3>
            <ul>
              <li>✗ Use generic, one-size-fits-all templates</li>
              <li>✗ Overwhelm people with too many steps at once</li>
              <li>✗ Ignore operating system preferences (forcing logic on emotional thinkers)</li>
              <li>✗ Set unrealistic timelines that set people up to fail</li>
              <li>✗ Write protocols in overly technical or academic language</li>
              <li>✗ Create rigid plans with no room for adaptation</li>
              <li>✗ Forget to include the "why" behind recommended actions</li>
              <li>✗ Neglect to involve stakeholders in the planning process</li>
            </ul>

            <h2>Using the Phenix Protocol Generator</h2>
            <p>
              This framework's protocol generation system (Step 8 of the wizard) automates much 
              of the protocol development process. Based on your inputs across all previous steps, 
              it creates:
            </p>
            <ul>
              <li>A comprehensive master overview of your system</li>
              <li>Individual protocols for each node you've defined</li>
              <li>Stakeholder templates for relevant external parties</li>
              <li>A realistic 90-day timeline with five milestones</li>
              <li>Measurable success metrics across seven dimensions</li>
              <li>Contingency plans for four common scenarios</li>
            </ul>
            <p>
              The generated protocol is provided in markdown format for easy editing, 
              distribution, and integration into your existing documentation systems.
            </p>

            <div className="mt-8 p-6 bg-blue-600/20 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-lg font-bold text-white mb-2">⚡ Pro Tip</h3>
              <p className="text-slate-300 mb-0">
                The best protocols are co-created with the family, not imposed on them. Use the 
                generated protocol as a starting point for discussion, not a rigid prescription. 
                The family's buy-in is more important than having a "perfect" plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
