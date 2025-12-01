import Link from 'next/link';

export default function MetricsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/vertex/technical" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
          ← Back to Technical Vertex
        </Link>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 text-sm font-medium rounded-full mb-3">
              Measurement
            </span>
            <h1 className="text-4xl font-bold text-white mb-2">
              Metrics & Measurement
            </h1>
            <p className="text-xl text-slate-300">
              Tracking success and system health
            </p>
          </div>

          <div className="prose prose-invert prose-blue max-w-none">
            <h2>Why Measurement Matters</h2>
            <p>
              "What gets measured gets managed." In family systems work, metrics serve three 
              critical functions: they provide objective feedback on progress, help identify 
              areas needing attention, and create accountability for all participants.
            </p>
            <p>
              However, family systems are not mechanical. Over-reliance on metrics can miss 
              the human dimension. The art is finding the right balance between quantitative 
              tracking and qualitative understanding.
            </p>

            <h2>The Seven Dimensions of System Health</h2>

            <h3>1. Emotional Wellbeing</h3>
            <p>
              How people <em>feel</em> is perhaps the most important indicator of system health.
            </p>
            <p><strong>What to Track:</strong></p>
            <ul>
              <li><strong>Stress Levels:</strong> Self-reported stress on 1-10 scale, tracked weekly</li>
              <li><strong>Emotional Regulation:</strong> Frequency of emotional outbursts or shutdowns</li>
              <li><strong>Mood Stability:</strong> Consistency of emotional state day-to-day</li>
              <li><strong>Anxiety/Depression:</strong> Standardized screening tools (PHQ-9, GAD-7)</li>
              <li><strong>Life Satisfaction:</strong> Overall happiness and fulfillment ratings</li>
            </ul>
            <p><strong>Success Indicators:</strong></p>
            <ul>
              <li>Stress levels trending downward over time</li>
              <li>Increased emotional stability and regulation</li>
              <li>Reduced anxiety and depression symptoms</li>
              <li>Higher life satisfaction scores</li>
            </ul>

            <h3>2. Communication Quality</h3>
            <p>
              Healthy systems communicate clearly, respectfully, and effectively.
            </p>
            <p><strong>What to Track:</strong></p>
            <ul>
              <li><strong>Frequency:</strong> How often do key parties communicate?</li>
              <li><strong>Mode:</strong> In-person, phone, text, email—what's being used?</li>
              <li><strong>Content:</strong> What topics are discussed? What's avoided?</li>
              <li><strong>Conflict Resolution:</strong> How many conflicts escalate vs. resolve?</li>
              <li><strong>Respectfulness:</strong> Tone, language, listening behavior</li>
            </ul>
            <p><strong>Success Indicators:</strong></p>
            <ul>
              <li>Regular, consistent communication patterns</li>
              <li>Appropriate modes for different topics</li>
              <li>Difficult topics can be discussed without escalation</li>
              <li>Conflicts resolve more quickly over time</li>
              <li>All parties report feeling heard</li>
            </ul>

            <h3>3. Stability and Consistency</h3>
            <p>
              Children especially need predictability. Adults benefit from routine too.
            </p>
            <p><strong>What to Track:</strong></p>
            <ul>
              <li><strong>Schedule Adherence:</strong> How often are custody/visitation schedules followed?</li>
              <li><strong>Routine Maintenance:</strong> Consistency of meals, bedtimes, homework time</li>
              <li><strong>Promise Keeping:</strong> Commitments made vs. commitments kept</li>
              <li><strong>Environmental Stability:</strong> Frequency of moves, job changes, relationship changes</li>
            </ul>
            <p><strong>Success Indicators:</strong></p>
            <ul>
              <li>95%+ adherence to established schedules</li>
              <li>Daily routines consistently maintained</li>
              <li>Commitments reliably kept</li>
              <li>Minimal unexpected disruptions</li>
            </ul>

            <h3>4. Individual Functioning</h3>
            <p>
              Each person must be able to manage their own life responsibilities.
            </p>
            <p><strong>What to Track:</strong></p>
            <ul>
              <li><strong>School/Work Performance:</strong> Grades, attendance, productivity</li>
              <li><strong>Self-Care:</strong> Sleep, nutrition, hygiene, medical compliance</li>
              <li><strong>Social Connections:</strong> Friendships, extracurricular activities</li>
              <li><strong>Developmental Progress:</strong> Age-appropriate skill acquisition</li>
              <li><strong>Problem Behaviors:</strong> Frequency of concerning behaviors</li>
            </ul>
            <p><strong>Success Indicators:</strong></p>
            <ul>
              <li>Maintained or improved academic/work performance</li>
              <li>Consistent self-care across all domains</li>
              <li>Active social life and meaningful relationships</li>
              <li>Meeting developmental milestones</li>
              <li>Reduced problem behaviors</li>
            </ul>

            <h3>5. Relationship Quality</h3>
            <p>
              The connections between people are what make a system a system.
            </p>
            <p><strong>What to Track:</strong></p>
            <ul>
              <li><strong>Parent-Child Bond:</strong> Attachment security, time together, affection</li>
              <li><strong>Co-Parent Relationship:</strong> Cooperation level, respect, alignment</li>
              <li><strong>Sibling Relationships:</strong> Conflict frequency, cooperation, support</li>
              <li><strong>Extended Family:</strong> Quality of relationships with grandparents, etc.</li>
            </ul>
            <p><strong>Success Indicators:</strong></p>
            <ul>
              <li>Secure attachment behaviors increasing</li>
              <li>Co-parents able to collaborate on children's needs</li>
              <li>Siblings showing mutual support</li>
              <li>Healthy extended family involvement</li>
            </ul>

            <h3>6. System Boundaries</h3>
            <p>
              Clear, healthy boundaries protect individuals and maintain system integrity.
            </p>
            <p><strong>What to Track:</strong></p>
            <ul>
              <li><strong>Parental Coalition:</strong> Are parents united or split?</li>
              <li><strong>Generational Hierarchy:</strong> Do parents lead and children follow?</li>
              <li><strong>Privacy:</strong> Are individual boundaries respected?</li>
              <li><strong>Triangulation:</strong> Frequency of two-person conflicts pulling in third parties</li>
              <li><strong>External Boundaries:</strong> Appropriate involvement of outside parties</li>
            </ul>
            <p><strong>Success Indicators:</strong></p>
            <ul>
              <li>Parents able to present unified front</li>
              <li>Clear generational boundaries maintained</li>
              <li>Personal privacy respected</li>
              <li>Reduced triangulation</li>
              <li>Healthy external boundaries</li>
            </ul>

            <h3>7. Adaptive Capacity</h3>
            <p>
              Healthy systems can respond effectively to change and challenges.
            </p>
            <p><strong>What to Track:</strong></p>
            <ul>
              <li><strong>Problem-Solving:</strong> How effectively are new problems addressed?</li>
              <li><strong>Flexibility:</strong> Can the system adjust plans when needed?</li>
              <li><strong>Resource Utilization:</strong> Does the family access help when needed?</li>
              <li><strong>Learning:</strong> Do patterns improve over time based on experience?</li>
            </ul>
            <p><strong>Success Indicators:</strong></p>
            <ul>
              <li>Problems resolved more quickly over time</li>
              <li>System can adjust to changing circumstances</li>
              <li>Family seeks and accepts appropriate help</li>
              <li>Patterns evolve based on what works</li>
            </ul>

            <h2>Measurement Methods</h2>

            <h3>Quantitative Approaches</h3>
            <ul>
              <li><strong>Weekly Check-Ins:</strong> Simple 1-10 ratings on key dimensions</li>
              <li><strong>Behavioral Counts:</strong> Tracking specific behaviors (arguments, missed schedules, etc.)</li>
              <li><strong>Standardized Assessments:</strong> PHQ-9, GAD-7, SCARED, etc.</li>
              <li><strong>Time Tracking:</strong> Quality time together, communication frequency</li>
              <li><strong>Objective Data:</strong> School grades, attendance records, medical compliance</li>
            </ul>

            <h3>Qualitative Approaches</h3>
            <ul>
              <li><strong>Narrative Updates:</strong> Weekly journal entries on how things are going</li>
              <li><strong>Milestone Reflections:</strong> Deeper reflection at 25%, 50%, 75%, 100%</li>
              <li><strong>Stakeholder Interviews:</strong> Regular check-ins with all involved parties</li>
              <li><strong>Case Conferencing:</strong> Team discussions of progress and challenges</li>
            </ul>

            <h2>Implementation Guidelines</h2>

            <h3>Start Simple</h3>
            <p>
              Don't try to track everything at once. Begin with 3-5 key metrics that matter 
              most for your specific situation. Add more as the system becomes comfortable 
              with measurement.
            </p>

            <h3>Make It Easy</h3>
            <p>
              If tracking is burdensome, it won't happen. Use simple tools:
            </p>
            <ul>
              <li>Text-based check-ins ("Rate your week 1-10")</li>
              <li>Shared spreadsheets or apps</li>
              <li>Visual trackers (charts, graphs)</li>
              <li>Pre-scheduled reminders</li>
            </ul>

            <h3>Review Regularly</h3>
            <p>
              Data is useless if no one looks at it. Build in regular review points:
            </p>
            <ul>
              <li><strong>Weekly:</strong> Quick scan of the week's data</li>
              <li><strong>Monthly:</strong> Deeper look at trends</li>
              <li><strong>Quarterly:</strong> Major progress review and protocol adjustment</li>
            </ul>

            <h3>Celebrate Progress</h3>
            <p>
              When metrics improve, acknowledge it! Recognition reinforces positive change 
              and maintains motivation.
            </p>

            <h3>Adjust Metrics as Needed</h3>
            <p>
              As the system evolves, what you measure may need to evolve too. Early on, you 
              might track conflict frequency; later, you might shift to tracking quality of 
              collaboration.
            </p>

            <h2>Common Pitfalls</h2>

            <h3>Over-Measurement</h3>
            <p>
              Tracking too many things creates burden and reduces compliance. Keep it simple.
            </p>

            <h3>Gaming the Metrics</h3>
            <p>
              People will optimize for what's measured, sometimes in unhealthy ways. Make sure 
              you're measuring what actually matters, not just what's easy to count.
            </p>

            <h3>Ignoring Context</h3>
            <p>
              Numbers without context can mislead. A "bad week" might be perfectly normal if 
              there was a major external stressor. Always consider the story behind the data.
            </p>

            <h3>Using Metrics as Weapons</h3>
            <p>
              Data should inform, not blame. "You only did X 3 times this week!" creates 
              defensiveness. "Let's look at what made it hard to do X this week" creates learning.
            </p>

            <div className="mt-8 p-6 bg-blue-600/20 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-lg font-bold text-white mb-2">📊 Remember</h3>
              <p className="text-slate-300 mb-0">
                Metrics are a tool for learning, not a tool for judgment. The goal is continuous 
                improvement, not perfect scores. Some of the most important changes—increased trust, 
                deeper connection, greater resilience—are hard to quantify but unmistakable when 
                they happen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
