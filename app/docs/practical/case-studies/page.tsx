import Link from 'next/link';

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/vertex/practical" className="text-green-400 hover:text-green-300 mb-6 inline-block">
          ← Back to Practical Vertex
        </Link>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-green-600/20 text-green-400 text-sm font-medium rounded-full mb-3">
              Examples
            </span>
            <h1 className="text-4xl font-bold text-white mb-2">
              Case Studies & Examples
            </h1>
            <p className="text-xl text-slate-300">
              Real-world applications and success stories
            </p>
          </div>

          <div className="prose prose-invert prose-green max-w-none">
            <h2>Case Studies: The Framework in Action</h2>
            <p>
              These are real families (names and details changed for privacy) who used the Phenix Framework 
              to navigate complex transitions. Each case shows the assessment, protocol design, implementation, 
              and outcomes—both successes and challenges.
            </p>

            <h2>Case Study 1: High-Conflict Divorce with Child Symptom Bearer</h2>

            <h3>Background</h3>
            <p><strong>Family Structure:</strong> Mom (Sarah, 38), Dad (Marcus, 40), three kids:</p>
            <ul>
              <li>Jasmine (14): Straight-A student, "perfect child"</li>
              <li>Tyler (11): Identified patient—school refusal, anxiety</li>
              <li>Maya (7): Quiet, withdrawn</li>
            </ul>
            <p><strong>Presenting Problem:</strong> Tyler refusing to go to school for 3 weeks. Multiple doctor visits, 
            no medical cause found. School threatening legal action for truancy.</p>

            <h3>Assessment</h3>
            <p><strong>System Pattern Identified:</strong> Tyler functioning as symptom bearer. His anxiety was the only thing 
            keeping parents focused on co-parenting instead of their bitter conflict. When Tyler was "sick," parents 
            had to communicate and coordinate care.</p>

            <p><strong>Key Findings:</strong></p>
            <ul>
              <li>Parents fighting through the kids (triangulation)</li>
              <li>Jasmine parentified—managing siblings' emotions, mediating parent conflicts</li>
              <li>Maya emotionally neglected—"easy child" getting lost</li>
              <li>Tyler highly attuned to system stress, somatizing anxiety</li>
              <li>No clear co-parenting structure or communication system</li>
            </ul>

            <h3>Protocol Design</h3>
            <p><strong>Phase 1 (Weeks 1-2): Stabilization</strong></p>
            <ul>
              <li>Parents agree to communicate only through co-parenting app (no more texts/calls)</li>
              <li>Create structured custody schedule (had been chaotic and reactive)</li>
              <li>Individual therapy for Tyler focused on anxiety management tools</li>
              <li>Gradual return to school plan with support</li>
            </ul>

            <p><strong>Phase 2 (Weeks 3-6): Boundary Repair</strong></p>
            <ul>
              <li>No discussing other parent with kids (period)</li>
              <li>Release Jasmine from mediator role—"This isn't your job"</li>
              <li>Weekly parent check-ins with therapist to address co-parenting issues</li>
              <li>One-on-one time for each child weekly</li>
            </ul>

            <p><strong>Phase 3 (Weeks 7-12): System Restructuring</strong></p>
            <ul>
              <li>Parents take co-parenting communication course</li>
              <li>Implement parallel parenting plan (high structure, low contact)</li>
              <li>Each parent establishes consistent routines at their house</li>
              <li>Monthly family therapy to monitor system health</li>
            </ul>

            <h3>Implementation Challenges</h3>
            <ul>
              <li>Week 3: Dad accused mom of "making Tyler sick" to get more custody. Had to reinforce 
              systemic perspective—everyone contributes, no one is "to blame."</li>
              <li>Week 5: Jasmine had panic attack when told she didn't need to fix things. Realized she'd 
              built her identity around caregiving role. Added individual therapy for her.</li>
              <li>Week 8: Tyler's anxiety spiked when parents stopped fighting—he no longer had his "job." 
              Had to help him find new role as "just a kid."</li>
            </ul>

            <h3>Outcomes (6 months)</h3>
            <p><strong>Wins:</strong></p>
            <ul>
              <li>Tyler back in school full-time with 95% attendance</li>
              <li>Parents communicating functionally through app (90% of exchanges conflict-free)</li>
              <li>Jasmine in therapy, learning healthy boundaries</li>
              <li>Maya opening up more, getting attention for being herself not being invisible</li>
              <li>System stress reduced by 60% (family assessment score)</li>
            </ul>

            <p><strong>Ongoing Work:</strong></p>
            <ul>
              <li>Parents still triggered by each other but managing better</li>
              <li>Tyler's anxiety didn't disappear—learning it's his emotion to manage, not his job to fix the system</li>
              <li>Jasmine struggling with identity outside of caregiver role</li>
              <li>Family therapy stepped down to monthly check-ins</li>
            </ul>

            <h3>Key Lessons</h3>
            <ul>
              <li>Child symptoms are often system symptoms—treat the system, not just the child</li>
              <li>Removing someone from a dysfunctional role creates temporary anxiety (it will get worse before it gets better)</li>
              <li>High-conflict parents can co-parent effectively with enough structure and boundaries</li>
              <li>Don't neglect the "easy" kids—they're just hiding their struggle</li>
            </ul>

            <h2>Case Study 2: Blended Family Integration</h2>

            <h3>Background</h3>
            <p><strong>Family Structure:</strong></p>
            <ul>
              <li>Lisa (mom, 35) with two kids: Emma (10), Noah (8)</li>
              <li>David (stepdad, 37) with one kid: Sophia (9)</li>
              <li>Married 6 months ago, moved in together</li>
            </ul>
            <p><strong>Presenting Problem:</strong> Constant fighting between Emma and Sophia. Noah withdrawing. 
            Lisa and David arguing about discipline. Everyone miserable.</p>

            <h3>Assessment</h3>
            <p><strong>System Pattern Identified:</strong> Unrealistic expectations about blended family integration. 
            Trying to force "instant family." Loyalty conflicts for all kids. Adults forming couple subsystem 
            before establishing parental subsystems.</p>

            <p><strong>Key Findings:</strong></p>
            <ul>
              <li>David trying to discipline Lisa's kids immediately = major boundary violation</li>
              <li>Lisa defensive of her kids, undermining David's authority</li>
              <li>Emma and Sophia competing for David's attention (both craving father figure)</li>
              <li>Noah grieving loss of "just us" family with mom</li>
              <li>No clear house rules or shared expectations</li>
              <li>Different parenting styles causing conflict</li>
            </ul>

            <h3>Protocol Design</h3>
            <p><strong>Phase 1 (Month 1): Reset Expectations</strong></p>
            <ul>
              <li>Education: Blended families take 2-5 years to integrate (not instant)</li>
              <li>Each bio-parent disciplines their own kids for now</li>
              <li>Weekly couple time to align on parenting philosophy</li>
              <li>Individual one-on-one time: David-Sophia, Lisa-Emma, Lisa-Noah</li>
            </ul>

            <p><strong>Phase 2 (Months 2-3): Establish House Structure</strong></p>
            <ul>
              <li>Family meeting to create house rules together (kids have input)</li>
              <li>Assign responsibilities and consequences as team</li>
              <li>Implement weekly family meetings</li>
              <li>Create rituals that include everyone (Friday game night, Sunday breakfast)</li>
            </ul>

            <p><strong>Phase 3 (Months 4-6): Build New Relationships</strong></p>
            <ul>
              <li>David spends one-on-one time with Emma and Noah (as caring adult, not parent)</li>
              <li>Lisa spends time with Sophia (building stepparent relationship slowly)</li>
              <li>Gradual shift: Adults can back each other up on discipline, but still defer to bio-parent for major stuff</li>
              <li>Create "us" vs. "me" family identity through shared experiences</li>
            </ul>

            <h3>Implementation Challenges</h3>
            <ul>
              <li>Week 2: David felt rejected when told he couldn't discipline Emma/Noah. Felt like "not a real parent." 
              Had to reframe: You're building toward that, but trust takes time.</li>
              <li>Week 4: Emma tested boundaries hard—"You're not my dad!" to David. Lisa had to back David up while 
              also validating Emma's feelings.</li>
              <li>Month 2: Noah started having behavioral issues—acting out to get attention. Added individual therapy 
              and extra Lisa-Noah one-on-one time.</li>
              <li>Month 3: Extended family (grandparents) undermining stepparent relationships. Had to set boundaries 
              with them too.</li>
            </ul>

            <h3>Outcomes (1 year)</h3>
            <p><strong>Wins:</strong></p>
            <ul>
              <li>Conflict reduced by 70%</li>
              <li>Emma and Sophia not best friends, but civil and occasionally play together</li>
              <li>Noah re-engaged with family, behavioral issues mostly resolved</li>
              <li>David successfully disciplines Emma/Noah with Lisa's support</li>
              <li>Weekly family meetings happening consistently</li>
              <li>Couple relationship stronger—presenting united front</li>
            </ul>

            <p><strong>Ongoing Work:</strong></p>
            <ul>
              <li>Still moments of "you're not my real parent" when kids are upset</li>
              <li>Coordinating with ex-partners still challenging at times</li>
              <li>Sibling rivalry normal but present</li>
              <li>Building family identity is ongoing process</li>
            </ul>

            <h3>Key Lessons</h3>
            <ul>
              <li>Slow down—blended families can't be rushed</li>
              <li>Stepparent role must be earned through relationship, not granted by marriage certificate</li>
              <li>Kids need time with bio-parent alone—this isn't rejection of stepparent</li>
              <li>United parental front is essential but takes time to build</li>
              <li>Realistic expectations prevent disappointment and resentment</li>
            </ul>

            <h2>Case Study 3: Intact Family with Teen in Crisis</h2>

            <h3>Background</h3>
            <p><strong>Family Structure:</strong> Dad (Robert, 45), Mom (Jennifer, 43), three kids:</p>
            <ul>
              <li>Alex (17): Discovered cutting, failing classes, withdrew from friends</li>
              <li>Mia (14): High-achiever, soccer star, seeming fine</li>
              <li>Ben (10): ADHD, requires significant parental attention</li>
            </ul>
            <p><strong>Presenting Problem:</strong> School counselor discovered Alex's cutting. Parents shocked—"We had no idea."</p>

            <h3>Assessment</h3>
            <p><strong>System Pattern Identified:</strong> Over-functioning/under-functioning parental dyad. Mom managed 
            everything, dad disengaged. Kids learned mom = safe, dad = unavailable. Alex's crisis bringing hidden 
            system dysfunction to surface.</p>

            <p><strong>Key Findings:</strong></p>
            <ul>
              <li>Dad working 60+ hours/week, emotionally absent when home</li>
              <li>Mom burned out from managing household, kids, Ben's ADHD alone</li>
              <li>Alex feeling invisible—Ben's needs consumed mom's attention, dad was checked out</li>
              <li>Mia in parentified role—helping with Ben, emotionally supporting mom</li>
              <li>Parents hadn't had meaningful conversation in months</li>
              <li>Family communication pattern: mom nags, dad withdraws, kids shut down</li>
            </ul>

            <h3>Protocol Design</h3>
            <p><strong>Phase 1 (Weeks 1-4): Crisis Management</strong></p>
            <ul>
              <li>Alex starts individual therapy immediately</li>
              <li>Safety plan established (remove cutting tools, check-ins, crisis numbers)</li>
              <li>Parents commit to family dinner 5 nights/week (dad home by 6pm)</li>
              <li>Daily check-in with Alex: "How are you today, really?"</li>
            </ul>

            <p><strong>Phase 2 (Weeks 5-12): System Restructuring</strong></p>
            <ul>
              <li>Dad takes on specific household responsibilities (not just "helping" mom)</li>
              <li>Parents in couples therapy to address communication and partnership</li>
              <li>One-on-one time: Dad-Alex weekly, Mom-Alex weekly (separate from crisis talks)</li>
              <li>Release Mia from helper role—give her back her childhood</li>
              <li>Hire help for Ben's ADHD management (tutor, babysitter) to reduce family burden</li>
            </ul>

            <p><strong>Phase 3 (Months 4-6): Rebuilding Connection</strong></p>
            <ul>
              <li>Family therapy focused on communication skills</li>
              <li>Each person shares feelings without judgment</li>
              <li>Create new family traditions that include everyone</li>
              <li>Parents model vulnerability and repair</li>
            </ul>

            <h3>Implementation Challenges</h3>
            <ul>
              <li>Week 2: Dad missed family dinner twice—work "emergency." Had to confront: What's more important?</li>
              <li>Week 6: Mom resisted giving up control—"If I don't do it, it won't get done right." 
              Addressed perfectionism and control as anxiety management.</li>
              <li>Week 8: Alex's cutting increased temporarily—anxiety about family changing. 
              Reinforced: This is expected, we're staying the course.</li>
              <li>Month 3: Mia angry about losing helper role—it was her identity. Added focus on helping 
              her develop identity outside family caretaker.</li>
            </ul>

            <h3>Outcomes (9 months)</h3>
            <p><strong>Wins:</strong></p>
            <ul>
              <li>Alex stopped cutting (3 months clean), back in therapy weekly</li>
              <li>Alex's grades improved from F's to B's/C's</li>
              <li>Dad home for dinner 4-5 nights/week consistently</li>
              <li>Parents working as partners—mom doesn't feel alone anymore</li>
              <li>Mia exploring own interests, less burdened</li>
              <li>Ben's ADHD better managed with external support</li>
              <li>Family communication dramatically improved</li>
            </ul>

            <p><strong>Ongoing Work:</strong></p>
            <ul>
              <li>Alex still struggles with depression—ongoing therapy</li>
              <li>Dad occasionally slips back into work addiction—catches himself faster now</li>
              <li>Mom learning to let go of control incrementally</li>
              <li>Building new family patterns is still effortful, not yet automatic</li>
            </ul>

            <h3>Key Lessons</h3>
            <ul>
              <li>Teen crisis often reflects family system dysfunction, not just individual pathology</li>
              <li>Both parents must be engaged—you can't outsource emotional presence</li>
              <li>Fixing over/under-functioning pattern requires both people to change</li>
              <li>Kids may resist positive change initially—they're used to the old system</li>
              <li>Crisis can be catalyst for necessary transformation</li>
            </ul>

            <div className="mt-8 p-6 bg-green-600/20 rounded-lg border-l-4 border-green-500">
              <h3 className="text-lg font-bold text-white mb-2">📚 What These Cases Teach Us</h3>
              <p className="text-slate-300 mb-0">
                Every system is unique, but patterns repeat. Kids become symptom bearers. Parents over/under-function. 
                The Phenix Framework works because it addresses underlying patterns, not just surface symptoms. Change 
                is possible, but it's rarely quick or easy. It requires commitment, patience, and willingness to stay 
                the course when things get temporarily worse. These families did the work. Yours can too.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
