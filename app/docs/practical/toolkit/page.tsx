import Link from 'next/link';

export default function ToolkitPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-green-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/vertex/practical" className="text-green-600 hover:text-green-800 mb-6 inline-block">
          ← Back to Practical Vertex
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-3">
              Tools
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Practitioner Toolkit
            </h1>
            <p className="text-xl text-gray-600">
              Essential tools and resources for implementation
            </p>
          </div>

          <div className="prose prose-green max-w-none">
            <h2>Your Essential Toolkit</h2>
            <p>
              This toolkit provides ready-to-use resources for implementing the Phenix Framework 
              in real family systems. Each tool has been field-tested and refined through actual practice.
            </p>

            <h2>Assessment Tools</h2>

            <h3>Quick Family Assessment (15 minutes)</h3>
            <p><strong>Use this for:</strong> Initial intake, understanding current state</p>
            <p><strong>Questions to ask:</strong></p>
            <ul>
              <li>Describe your family structure in one sentence</li>
              <li>What brings you here today? What problem needs solving?</li>
              <li>On a scale 1-10, how would you rate family stress right now?</li>
              <li>Who's most affected by the current situation?</li>
              <li>What have you tried so far? What worked/didn't work?</li>
              <li>If you could wave a magic wand, what would be different 6 months from now?</li>
              <li>Who else is involved or needs to be involved?</li>
              <li>What are your biggest concerns/fears?</li>
              <li>What strengths does this family have?</li>
            </ul>

            <h3>Stress Thermometer (1 minute, use weekly)</h3>
            <p>Simple 1-10 scale:</p>
            <ul>
              <li><strong>1-3 (Cool):</strong> Calm, manageable, functioning well</li>
              <li><strong>4-6 (Warm):</strong> Some stress, coping okay, some challenges</li>
              <li><strong>7-8 (Hot):</strong> High stress, struggling to cope, need support</li>
              <li><strong>9-10 (Boiling):</strong> Crisis level, can't function, need immediate help</li>
            </ul>
            <p>Track each person weekly. Look for patterns and trends.</p>

            <h3>Communication Audit</h3>
            <p><strong>For each key relationship, assess:</strong></p>
            <ul>
              <li>Frequency of contact: Daily / Weekly / Monthly / Rarely</li>
              <li>Primary mode: In-person / Phone / Text / Email / Through others</li>
              <li>Typical topics: Logistics / Feelings / Conflicts / Positive sharing</li>
              <li>Quality rating (1-10): How satisfying is communication?</li>
              <li>What would improve it? (specific, actionable)</li>
            </ul>

            <h3>Boundary Checklist</h3>
            <p>For each subsystem (parental, parent-child, sibling), check:</p>
            <ul>
              <li>☐ Clear roles and responsibilities</li>
              <li>☐ Appropriate privacy respected</li>
              <li>☐ Age-appropriate decision-making authority</li>
              <li>☐ No triangulation or inappropriate coalitions</li>
              <li>☐ Information shared appropriately (not too much/too little)</li>
              <li>☐ Boundaries flexible enough to adjust when needed</li>
            </ul>

            <h2>Planning Tools</h2>

            <h3>SMART Goal Template</h3>
            <p>Turn vague desires into concrete goals:</p>
            <ul>
              <li><strong>S</strong>pecific: What exactly will change? ("We'll have family dinner 3x/week" not "spend more time together")</li>
              <li><strong>M</strong>easurable: How will you know you've achieved it? (Can count/observe it)</li>
              <li><strong>A</strong>chievable: Is this realistic given current resources/constraints?</li>
              <li><strong>R</strong>elevant: Does this actually address the core issue?</li>
              <li><strong>T</strong>ime-bound: When will this be accomplished by?</li>
            </ul>
            <p><strong>Example:</strong> "By the end of the month, both parents will attend Billy's soccer games together 
            without arguing, measured by Billy's report and parent self-assessment."</p>

            <h3>Action Plan Template</h3>
            <table>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Who</th>
                  <th>When</th>
                  <th>Resources Needed</th>
                  <th>Success Metric</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Set up co-parent app</td>
                  <td>Mom</td>
                  <td>This week</td>
                  <td>Phone, email</td>
                  <td>Both parents using it by Friday</td>
                </tr>
                <tr>
                  <td>First family meeting</td>
                  <td>Dad facilitates</td>
                  <td>Sunday 6pm</td>
                  <td>Agenda, snacks</td>
                  <td>Everyone attends, no major conflict</td>
                </tr>
              </tbody>
            </table>

            <h3>Weekly Planning Sheet</h3>
            <p>Keep families organized and reduce chaos:</p>
            <ul>
              <li><strong>Schedule:</strong> Who's where when (work, school, activities, custody transitions)</li>
              <li><strong>Meals:</strong> What's for dinner each night? Who's cooking?</li>
              <li><strong>Tasks:</strong> What needs to get done? Who's responsible?</li>
              <li><strong>Special notes:</strong> Appointments, deadlines, important events</li>
              <li><strong>Check-ins:</strong> When will parents/caregivers sync up?</li>
            </ul>

            <h2>Communication Tools</h2>

            <h3>"I Feel" Statement Mad Libs</h3>
            <p>Practice template: "I feel ___[emotion]___ when ___[specific behavior]___ because ___[impact on me]___."</p>
            <p><strong>Examples to use as models:</strong></p>
            <ul>
              <li>"I feel worried when you're late without calling because I don't know if you're safe."</li>
              <li>"I feel frustrated when plans change last-minute because I had already mentally prepared."</li>
              <li>"I feel appreciated when you help with dishes because it shows you care about my workload."</li>
            </ul>

            <h3>Family Meeting Agenda Template</h3>
            <ol>
              <li><strong>Check-in (5 min):</strong> How is everyone doing? Rose/Thorn/Bud (something good/challenging/looking forward to)</li>
              <li><strong>Appreciations (5 min):</strong> Each person shares one appreciation for another family member</li>
              <li><strong>Old business (10 min):</strong> Follow up on last meeting's action items</li>
              <li><strong>New business (15 min):</strong> Issues to discuss, decisions to make</li>
              <li><strong>Planning (10 min):</strong> Upcoming week's schedule</li>
              <li><strong>Fun (5 min):</strong> Plan something enjoyable together</li>
              <li><strong>Closing:</strong> Quick round of "one thing I'm grateful for today"</li>
            </ol>

            <h3>Conflict Resolution Flowchart</h3>
            <p><strong>When conflict arises:</strong></p>
            <ol>
              <li><strong>Pause:</strong> Are we both calm? If no → take 20-min break → come back</li>
              <li><strong>Define:</strong> What exactly are we disagreeing about? (Get specific, stick to one issue)</li>
              <li><strong>Listen:</strong> Each person shares their perspective without interruption</li>
              <li><strong>Validate:</strong> "I can see why you feel that way" (doesn't mean agreement)</li>
              <li><strong>Common ground:</strong> What do we agree on? What do we both want?</li>
              <li><strong>Brainstorm:</strong> What are possible solutions? (Generate multiple, don't judge yet)</li>
              <li><strong>Choose:</strong> Pick one to try. Be specific about implementation.</li>
              <li><strong>Follow-up:</strong> Set date to check in. Is it working?</li>
            </ol>

            <h3>Repair Script Templates</h3>
            <p>When you've messed up and need to repair:</p>
            <ul>
              <li>"I'm sorry I ___[specific behavior]___. That wasn't okay. I'll try to ___[what you'll do differently]___."</li>
              <li>"I got it wrong when I ___. You deserved ___. How can I make this right?"</li>
              <li>"I was ___[triggered/tired/overwhelmed]___ and took it out on you. That's not your fault. I apologize."</li>
            </ul>

            <h2>Practical Implementation Tools</h2>

            <h3>Custody Transition Checklist</h3>
            <p>Make handoffs smoother:</p>
            <ul>
              <li>☐ Child's bag packed with everything needed</li>
              <li>☐ School/activity items included</li>
              <li>☐ Medications if applicable</li>
              <li>☐ Important updates shared (illness, school issues, etc.)</li>
              <li>☐ Transition happens in neutral location if high-conflict</li>
              <li>☐ Keep it brief and child-focused</li>
              <li>☐ No arguing in front of child</li>
              <li>☐ Warm goodbye, positive hello</li>
            </ul>

            <h3>Bedtime Routine Chart (for kids)</h3>
            <p>Visual checklist reduces power struggles:</p>
            <ul>
              <li>☐ 7:00 - Bath time</li>
              <li>☐ 7:20 - Pajamas on</li>
              <li>☐ 7:30 - Brush teeth</li>
              <li>☐ 7:40 - Two books</li>
              <li>☐ 8:00 - Lights out, lullaby</li>
            </ul>
            <p>(Adjust times to fit your family; consistency matters more than specific times)</p>

            <h3>Chore Chart Templates</h3>
            <p><strong>By age group:</strong></p>
            <ul>
              <li><strong>Ages 3-5:</strong> Put toys away, help feed pets, put dirty clothes in hamper</li>
              <li><strong>Ages 6-8:</strong> Make bed, set table, water plants, simple meal prep help</li>
              <li><strong>Ages 9-12:</strong> Own laundry, dishes, vacuum, pet care, meal prep</li>
              <li><strong>Teens:</strong> Full meal cooking, bathroom cleaning, yard work, sibling care</li>
            </ul>
            <p><strong>Pro tip:</strong> Rotate chores weekly to build multiple skills and prevent resentment</p>

            <h3>Emergency Contact Template</h3>
            <p>Every family member should have access to:</p>
            <ul>
              <li>Parent 1: Name, Cell, Work, Email</li>
              <li>Parent 2: Name, Cell, Work, Email</li>
              <li>Emergency backup: (Grandparent/Trusted adult)</li>
              <li>Pediatrician: Name, Phone</li>
              <li>School: Name, Phone</li>
              <li>Poison Control: 1-800-222-1222</li>
              <li>Mental Health Crisis: 988</li>
              <li>Local ER: Address, Phone</li>
            </ul>

            <h2>Tracking and Monitoring Tools</h2>

            <h3>Weekly Progress Tracker</h3>
            <p>Simple table to track key metrics:</p>
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Mon</th>
                  <th>Tue</th>
                  <th>Wed</th>
                  <th>Thu</th>
                  <th>Fri</th>
                  <th>Sat</th>
                  <th>Sun</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Stress level (1-10)</td>
                  <td colspan="7">(Daily ratings)</td>
                </tr>
                <tr>
                  <td>Family dinner?</td>
                  <td colspan="7">(Y/N)</td>
                </tr>
                <tr>
                  <td>Major conflicts?</td>
                  <td colspan="7">(Count)</td>
                </tr>
              </tbody>
            </table>

            <h3>Milestone Celebration List</h3>
            <p>Don't forget to acknowledge progress! Celebrate when:</p>
            <ul>
              <li>First week with no major arguments</li>
              <li>Child voluntarily shares feelings</li>
              <li>Co-parents successfully coordinate without conflict</li>
              <li>Family completes first full week of new routine</li>
              <li>Teen opens up after period of shutdown</li>
              <li>Successful conflict resolution without third-party help</li>
            </ul>

            <h2>Digital Tools Recommendations</h2>

            <h3>Co-Parenting Apps</h3>
            <ul>
              <li><strong>OurFamilyWizard:</strong> Messaging, calendar, expense tracking, documentation</li>
              <li><strong>Cozi:</strong> Shared calendar, shopping lists, meal planning</li>
              <li><strong>2Houses:</strong> Calendar, info bank, photos, messages</li>
            </ul>

            <h3>Communication Apps</h3>
            <ul>
              <li><strong>For high-conflict:</strong> AppClose, TalkingParents (documented communication)</li>
              <li><strong>For cooperative:</strong> GroupMe, WhatsApp family groups</li>
            </ul>

            <h3>Mental Health Apps</h3>
            <ul>
              <li><strong>Calm/Headspace:</strong> Meditation and mindfulness</li>
              <li><strong>Moodpath:</strong> Mood tracking and mental health screening</li>
              <li><strong>Sanvello:</strong> Anxiety and depression management</li>
            </ul>

            <h2>Printable Resources</h2>

            <h3>Feelings Chart for Kids</h3>
            <p>Visual faces showing:</p>
            <ul>
              <li>Happy 😊 | Sad 😢 | Mad 😠 | Scared 😨 | Worried 😟 | Excited 🤩</li>
              <li>Frustrated 😤 | Lonely 😔 | Proud 😊 | Confused 🤔 | Calm 😌 | Overwhelmed 😵</li>
            </ul>
            <p>Child points to how they feel. Helps build emotional vocabulary.</p>

            <h3>House Rules Poster</h3>
            <p>Post where everyone can see:</p>
            <ol>
              <li>We treat each other with respect (no hitting, name-calling, or meanness)</li>
              <li>We use kind words and listen to each other</li>
              <li>We ask for what we need</li>
              <li>We take care of our space and belongings</li>
              <li>We help each other</li>
              <li>We say sorry and make repairs when we mess up</li>
            </ol>

            <h3>De-Escalation Cards</h3>
            <p>Laminated cards family members can use when getting overwhelmed:</p>
            <ul>
              <li>"I need a break"</li>
              <li>"Let's slow down"</li>
              <li>"I'm not ready to talk yet"</li>
              <li>"Can we try again?"</li>
            </ul>
            <p>Holding up a card communicates needs without having to find words when dysregulated.</p>

            <div className="mt-8 p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h3 className="text-lg font-bold text-green-900 mb-2">🛠️ Tool Philosophy</h3>
              <p className="text-green-800 mb-0">
                Tools are only useful if you actually use them. Start with 1-2 tools that address 
                your biggest pain point. Master those, then add more. A simple tool used consistently 
                beats a sophisticated tool that sits in a drawer. Customize everything to fit your 
                family's reality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
