import Link from 'next/link';

export default function QuickReferencePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/vertex/practical" className="text-green-400 hover:text-green-300 mb-6 inline-block">
          ← Back to Practical Vertex
        </Link>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-green-600/20 text-green-400 text-sm font-medium rounded-full mb-3">
              Reference
            </span>
            <h1 className="text-4xl font-bold text-white mb-2">
              Quick Reference Guide
            </h1>
            <p className="text-xl text-slate-300">
              Checklists and at-a-glance resources
            </p>
          </div>

          <div className="prose prose-invert prose-green max-w-none">
            <h2>Quick Reference Guide</h2>
            <p>
              When you're in the thick of family work, you don't have time to read entire documents. 
              This quick reference provides at-a-glance checklists, decision trees, and rapid assessment tools.
            </p>

            <h2>When to Use This Framework</h2>
            
            <h3>✅ Phenix Framework IS a good fit when:</h3>
            <ul>
              <li>Family system is experiencing major transition (divorce, blending, loss)</li>
              <li>Child/teen showing behavioral/emotional symptoms</li>
              <li>Communication patterns are dysfunctional</li>
              <li>Boundaries are unclear or violated</li>
              <li>Family members motivated to make changes</li>
              <li>You have 3-6 months to implement properly</li>
              <li>Multiple people willing to participate</li>
            </ul>

            <h3>❌ Phenix Framework is NOT the right tool when:</h3>
            <ul>
              <li>Active domestic violence or abuse (safety first, then systems work)</li>
              <li>Active substance abuse crisis (treat addiction first)</li>
              <li>Severe untreated mental illness (stabilize individual first)</li>
              <li>Immediate crisis requiring emergency intervention</li>
              <li>Only one person willing to engage (systems work requires multiple participants)</li>
              <li>Court-ordered work with uncooperative participants</li>
            </ul>

            <h2>Initial Assessment Checklist</h2>

            <h3>System Structure (Check all that apply)</h3>
            <ul>
              <li>☐ Divorce/separation in process or recent</li>
              <li>☐ Blended/step-family</li>
              <li>☐ Intact nuclear family</li>
              <li>☐ Single parent household</li>
              <li>☐ Multi-generational household</li>
              <li>☐ Co-parenting arrangement active</li>
              <li>☐ Foster/adoptive family</li>
              <li>☐ Work team or organization</li>
            </ul>

            <h3>Presenting Problems (Check all that apply)</h3>
            <ul>
              <li>☐ Child behavioral issues (aggression, defiance, withdrawal)</li>
              <li>☐ Teen crisis (substance use, self-harm, mental health)</li>
              <li>☐ High-conflict co-parenting</li>
              <li>☐ Communication breakdown</li>
              <li>☐ Boundary violations (enmeshment or disengagement)</li>
              <li>☐ Parenting disagreements</li>
              <li>☐ Sibling conflict</li>
              <li>☐ Adjustment to major transition</li>
              <li>☐ Loyalty conflicts</li>
              <li>☐ Triangulation patterns</li>
            </ul>

            <h3>System Health Indicators</h3>
            <p>Rate each 1-10 (1=crisis, 10=optimal):</p>
            <ul>
              <li>Communication quality: _____</li>
              <li>Emotional regulation: _____</li>
              <li>Boundary clarity: _____</li>
              <li>Individual functioning: _____</li>
              <li>Relationship quality: _____</li>
              <li>System stability: _____</li>
              <li>Adaptive capacity: _____</li>
            </ul>
            <p><strong>Overall system health score:</strong> _____ / 70</p>

            <h2>Common Pattern Recognition</h2>

            <h3>Pattern: Child as Symptom Bearer</h3>
            <p><strong>You see:</strong> Child with behavioral/emotional problems, but no clear individual cause</p>
            <p><strong>Look for:</strong></p>
            <ul>
              <li>Parental conflict that child is mediating or distracting from</li>
              <li>System stress the child is absorbing</li>
              <li>Child's symptom serving a function in the system</li>
            </ul>
            <p><strong>Intervention:</strong> Treat the system, not just the child. Address parental issues. Release child from burden.</p>

            <h3>Pattern: Triangulation</h3>
            <p><strong>You see:</strong> Two people communicate through a third person</p>
            <p><strong>Look for:</strong></p>
            <ul>
              <li>Parents talking about each other through the child</li>
              <li>Child carrying messages between parents</li>
              <li>Alliances that exclude or attack a third person</li>
            </ul>
            <p><strong>Intervention:</strong> Direct communication between dyads. Clear boundaries. No go-betweens.</p>

            <h3>Pattern: Parentification</h3>
            <p><strong>You see:</strong> Child taking on adult responsibilities, emotional or practical</p>
            <p><strong>Look for:</strong></p>
            <ul>
              <li>Child caring for siblings beyond age-appropriate</li>
              <li>Child managing parent's emotions</li>
              <li>Child making adult decisions</li>
            </ul>
            <p><strong>Intervention:</strong> Return child to child role. Build adult support systems. Give permission to just be a kid.</p>

            <h3>Pattern: Over/Under-Functioning Dyad</h3>
            <p><strong>You see:</strong> One person doing everything, one person doing nothing</p>
            <p><strong>Look for:</strong></p>
            <ul>
              <li>One parent manages everything, other is disengaged</li>
              <li>Resentment and burnout in over-functioner</li>
              <li>Increasing withdrawal in under-functioner</li>
            </ul>
            <p><strong>Intervention:</strong> Both must change. Over-functioner steps back. Under-functioner steps up. Negotiate specific responsibilities.</p>

            <h3>Pattern: Enmeshment</h3>
            <p><strong>You see:</strong> Boundaries too blurred, little individual identity</p>
            <p><strong>Look for:</strong></p>
            <ul>
              <li>Parent knows every detail of child's life, controls everything</li>
              <li>Family members can't function independently</li>
              <li>Lack of privacy or autonomy</li>
            </ul>
            <p><strong>Intervention:</strong> Establish clear boundaries. Build individual identity. Age-appropriate autonomy.</p>

            <h3>Pattern: Disengagement</h3>
            <p><strong>You see:</strong> Boundaries too rigid, little connection</p>
            <p><strong>Look for:</strong></p>
            <ul>
              <li>Parent doesn't know what's happening with child</li>
              <li>Family members operate independently with no connection</li>
              <li>Emotional distance, lack of warmth</li>
            </ul>
            <p><strong>Intervention:</strong> Build connection rituals. Increase communication. Shared activities.</p>

            <h2>Decision Tree: What Phase Are We In?</h2>

            <h3>START: What's the current system state?</h3>
            
            <p><strong>If CRISIS (safety concerns, immediate threat):</strong></p>
            <ul>
              <li>→ Phase 0: Crisis Stabilization (days to weeks)</li>
              <li>→ Ensure safety, meet basic needs, short-term stabilization</li>
              <li>→ Don't try to fix system yet, just stop the bleeding</li>
            </ul>

            <p><strong>If CHAOTIC (unpredictable, no structure, high stress):</strong></p>
            <ul>
              <li>→ Phase 1: Stabilization (2-4 weeks)</li>
              <li>→ Establish basic structure, create predictability</li>
              <li>→ Set ground rules, communication system, schedule</li>
            </ul>

            <p><strong>If STABLE but DYSFUNCTIONAL (patterns clear but unhealthy):</strong></p>
            <ul>
              <li>→ Phase 2: Assessment & Planning (2-4 weeks)</li>
              <li>→ Map the system, identify patterns</li>
              <li>→ Create protocol with clear goals and metrics</li>
            </ul>

            <p><strong>If READY TO IMPLEMENT:</strong></p>
            <ul>
              <li>→ Phase 3: Active Intervention (8-12 weeks)</li>
              <li>→ Execute protocol step by step</li>
              <li>→ Monitor progress, adjust as needed</li>
            </ul>

            <p><strong>If IMPROVING (new patterns taking hold):</strong></p>
            <ul>
              <li>→ Phase 4: Consolidation (4-8 weeks)</li>
              <li>→ Reinforce gains, prevent relapse</li>
              <li>→ Reduce support gradually</li>
            </ul>

            <p><strong>If STABLE and HEALTHY:</strong></p>
            <ul>
              <li>→ Phase 5: Maintenance</li>
              <li>→ Periodic check-ins, ongoing support</li>
              <li>→ Empower family to manage independently</li>
            </ul>

            <h2>Rapid Red Flags Assessment</h2>

            <h3>🚩 Immediate Red Flags (Stop and Address First)</h3>
            <ul>
              <li>Physical violence or threat of violence</li>
              <li>Child abuse or neglect (mandatory reporting)</li>
              <li>Active suicidal ideation or plan</li>
              <li>Severe substance intoxication</li>
              <li>Active psychosis or severe mental illness crisis</li>
              <li>Medical emergency</li>
            </ul>
            <p><strong>Action:</strong> Safety first. Call authorities if needed. Stabilize crisis before systems work.</p>

            <h3>⚠️ Proceed with Caution</h3>
            <ul>
              <li>History of violence (even if not current)</li>
              <li>Substance abuse (even if "controlled")</li>
              <li>Severe mental illness (even if medicated)</li>
              <li>Court involvement or legal threats</li>
              <li>One person clearly unwilling to participate</li>
              <li>Power imbalance severe enough to prevent honest communication</li>
            </ul>
            <p><strong>Action:</strong> Individual work first. Safety planning. Additional supports. May need separate sessions.</p>

            <h2>Communication Quick-Start</h2>

            <h3>The 3 Rules of Constructive Communication</h3>
            <ol>
              <li><strong>Speak for yourself:</strong> "I feel..." not "You always..."</li>
              <li><strong>Stay specific:</strong> "When you were 20 min late yesterday" not "You're never on time"</li>
              <li><strong>Request, don't demand:</strong> "Would you be willing to..." not "You need to..."</li>
            </ol>

            <h3>The STOP Protocol (When Things Heat Up)</h3>
            <ul>
              <li><strong>S</strong>top: Notice you're getting activated</li>
              <li><strong>T</strong>ake a breath: Physiological calming</li>
              <li><strong>O</strong>bserve: What's happening in me and the system?</li>
              <li><strong>P</strong>roceed: Respond instead of react</li>
            </ul>

            <h3>The Four Horsemen Checklist</h3>
            <p>If you hear these, intervene immediately:</p>
            <ul>
              <li>☐ <strong>Criticism:</strong> Attacking character ("You're so selfish")</li>
              <li>☐ <strong>Contempt:</strong> Disrespect, mockery, eye-rolling</li>
              <li>☐ <strong>Defensiveness:</strong> Playing victim, making excuses</li>
              <li>☐ <strong>Stonewalling:</strong> Shutting down, walking away</li>
            </ul>
            <p><strong>Antidotes:</strong> Gentle start-up, build culture of appreciation, take responsibility, self-soothe</p>

            <h2>Boundary Troubleshooting</h2>

            <h3>Is This Boundary Appropriate?</h3>
            <p><strong>Ask these questions:</strong></p>
            <ul>
              <li>Is this boundary age-appropriate? (What's okay for a 5yo is not okay for a 15yo)</li>
              <li>Does it respect individual autonomy while maintaining connection?</li>
              <li>Is it clear and consistent, or fuzzy and changeable?</li>
              <li>Does it serve the individual's development or the system's health?</li>
              <li>Is it flexible enough to adjust when needed?</li>
            </ul>

            <h3>Common Boundary Violations</h3>
            <table>
              <thead>
                <tr>
                  <th>Violation</th>
                  <th>What It Looks Like</th>
                  <th>Fix</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Parental boundary</td>
                  <td>Parent-child coalition against other parent</td>
                  <td>Strengthen parental subsystem, no triangulation</td>
                </tr>
                <tr>
                  <td>Generational boundary</td>
                  <td>Child in parental role, making adult decisions</td>
                  <td>Return child to child role, build adult supports</td>
                </tr>
                <tr>
                  <td>Privacy boundary</td>
                  <td>Reading teen's texts, no personal space</td>
                  <td>Age-appropriate privacy, trust-building</td>
                </tr>
                <tr>
                  <td>Information boundary</td>
                  <td>Sharing adult problems with kids</td>
                  <td>Adult problems stay with adults</td>
                </tr>
                <tr>
                  <td>Household boundary</td>
                  <td>Kids refusing rules, chaos</td>
                  <td>Clear expectations, consistent consequences</td>
                </tr>
              </tbody>
            </table>

            <h2>When to Refer Out</h2>

            <h3>Refer to Individual Therapist when:</h3>
            <ul>
              <li>Depression, anxiety, trauma symptoms beyond family systems scope</li>
              <li>Person needs individual work before family work can be effective</li>
              <li>Specific psychiatric diagnosis requiring specialized treatment</li>
            </ul>

            <h3>Refer to Psychiatrist when:</h3>
            <ul>
              <li>Medication evaluation needed</li>
              <li>Severe mental illness (schizophrenia, bipolar, severe depression)</li>
              <li>Current treatment not working, needs med adjustment</li>
            </ul>

            <h3>Refer to Substance Abuse Specialist when:</h3>
            <ul>
              <li>Active addiction interfering with family work</li>
              <li>Person unwilling to address substance use</li>
              <li>Need for detox or intensive treatment</li>
            </ul>

            <h3>Refer to Domestic Violence Services when:</h3>
            <ul>
              <li>Current violence or credible threat</li>
              <li>History of violence and power imbalance</li>
              <li>One partner afraid of the other</li>
              <li>Safety planning needed</li>
            </ul>

            <h3>Refer to Legal/Court Services when:</h3>
            <ul>
              <li>Custody disputes needing legal resolution</li>
              <li>Restraining orders needed</li>
              <li>Family law issues beyond therapeutic scope</li>
            </ul>

            <h3>Refer to Medical Doctor when:</h3>
            <ul>
              <li>Physical symptoms without clear psychological cause</li>
              <li>Need to rule out medical issues</li>
              <li>Medication side effects</li>
            </ul>

            <h2>Progress Monitoring Quick Check</h2>

            <h3>Green Lights (Keep Going)</h3>
            <ul>
              <li>✅ Conflict frequency decreasing</li>
              <li>✅ Communication quality improving</li>
              <li>✅ Individual symptoms reducing</li>
              <li>✅ Family following through on action items</li>
              <li>✅ Positive feedback from family members</li>
              <li>✅ System becoming more flexible and adaptive</li>
            </ul>

            <h3>Yellow Lights (Adjust Approach)</h3>
            <ul>
              <li>⚠️ Progress stalled for 2+ weeks</li>
              <li>⚠️ One person consistently resistant</li>
              <li>⚠️ Initial improvement followed by regression</li>
              <li>⚠️ New problems emerging as old ones resolve</li>
              <li>⚠️ Family not completing between-session tasks</li>
            </ul>
            <p><strong>Action:</strong> Reassess, adjust protocol, address resistance, simplify asks</p>

            <h3>Red Lights (Stop and Pivot)</h3>
            <ul>
              <li>🛑 Things getting worse, not better</li>
              <li>🛑 Safety concerns emerging</li>
              <li>🛑 Multiple people want to quit</li>
              <li>🛑 Your approach clearly not working</li>
              <li>🛑 System too dysregulated for this level of intervention</li>
            </ul>
            <p><strong>Action:</strong> Step back, stabilize crisis, consider referral, consult with supervisor</p>

            <h2>Common Mistakes to Avoid</h2>

            <h3>❌ Don't:</h3>
            <ul>
              <li>Take sides in family conflicts</li>
              <li>Try to fix everything at once</li>
              <li>Work harder than the family is working</li>
              <li>Ignore safety issues to "stay systemic"</li>
              <li>Force people into contact who aren't ready</li>
              <li>Proceed without buy-in from key people</li>
              <li>Blame individuals for systemic patterns</li>
              <li>Rush the process because family is impatient</li>
              <li>Continue approach that's clearly not working</li>
            </ul>

            <h3>✅ Do:</h3>
            <ul>
              <li>Maintain neutrality and systemic perspective</li>
              <li>Start with one or two highest-priority issues</li>
              <li>Match your effort to family's readiness</li>
              <li>Always prioritize safety over systems theory</li>
              <li>Go slow to go fast (build foundation first)</li>
              <li>Engage all key stakeholders</li>
              <li>Normalize patterns as systemic, not personal failure</li>
              <li>Trust the process and manage family expectations</li>
              <li>Adapt flexibly when approach isn't working</li>
            </ul>

            <h2>Emergency Contact Template</h2>

            <p><strong>Keep this accessible for all families:</strong></p>
            <ul>
              <li><strong>Suicide/Crisis:</strong> 988 Suicide & Crisis Lifeline</li>
              <li><strong>Domestic Violence:</strong> 1-800-799-7233 (National DV Hotline)</li>
              <li><strong>Child Abuse:</strong> 1-800-4-A-CHILD (1-800-422-4453)</li>
              <li><strong>Substance Abuse:</strong> 1-800-662-4357 (SAMHSA)</li>
              <li><strong>Emergency:</strong> 911</li>
              <li><strong>Poison Control:</strong> 1-800-222-1222</li>
            </ul>

            <div className="mt-8 p-6 bg-green-600/20 rounded-lg border-l-4 border-green-500">
              <h3 className="text-lg font-bold text-white mb-2">📋 Using This Guide</h3>
              <p className="text-slate-300 mb-0">
                Print this out. Keep it handy. Reference it during intake, between sessions, when you're stuck. 
                Family systems work is complex—there's no shame in needing a quick reference. Better to check 
                the guide than make a misstep. Over time, these patterns will become second nature, but until 
                then, trust the framework and trust the tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
