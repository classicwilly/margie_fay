import Link from 'next/link';

export default function DailyPracticesPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/vertex/practical" className="text-green-400 hover:text-green-300 mb-6 inline-block">
          ← Back to Practical Vertex
        </Link>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-green-600/20 text-green-400 text-sm font-medium rounded-full mb-3">
              Routines
            </span>
            <h1 className="text-4xl font-bold text-white mb-2">
              Daily Practices
            </h1>
            <p className="text-xl text-slate-300">
              Sustainable routines and habits
            </p>
          </div>

          <div className="prose prose-invert prose-green max-w-none">
            <h2>Building Sustainable Daily Practices</h2>
            <p>
              Healthy family systems aren't built through occasional grand gestures—they're built through 
              small, consistent daily practices. This guide provides routines that are actually sustainable 
              for real families with real time constraints.
            </p>

            <h2>The Foundation: The 3 Non-Negotiables</h2>
            <p>
              If you do nothing else, do these three things every single day. Even in chaos, 
              even when you don't feel like it, even when everything else falls apart.
            </p>

            <h3>1. The Two-Minute Connection</h3>
            <p><strong>What:</strong> Make genuine eye contact with each family member and ask one real question</p>
            <p><strong>When:</strong> First thing in morning or right when you see them</p>
            <p><strong>Examples:</strong></p>
            <ul>
              <li>"What's one thing you're looking forward to today?"</li>
              <li>"How did you sleep?"</li>
              <li>"What's on your mind this morning?"</li>
              <li>"Anything you're worried about?"</li>
            </ul>
            <p><strong>Why it matters:</strong> Consistent micro-connections prevent disconnection. Two minutes per person 
            adds up to feeling seen and known.</p>

            <h3>2. The Gratitude Moment</h3>
            <p><strong>What:</strong> Share one thing you're grateful for from today</p>
            <p><strong>When:</strong> Dinner table or bedtime</p>
            <p><strong>Format options:</strong></p>
            <ul>
              <li>Rose/Thorn/Bud (something good/challenging/looking forward to)</li>
              <li>High/Low (best and worst part of day)</li>
              <li>Three Good Things (name three positive moments)</li>
            </ul>
            <p><strong>Why it matters:</strong> Trains brains to notice the good. Shifts family culture from complaint-focused 
            to appreciation-focused. Research shows this simple practice significantly improves mood and relationships.</p>

            <h3>3. The Physical Touch</h3>
            <p><strong>What:</strong> At least one moment of appropriate physical affection with each person</p>
            <p><strong>Examples:</strong></p>
            <ul>
              <li>Hug hello/goodbye</li>
              <li>Pat on the back</li>
              <li>Hand on shoulder</li>
              <li>High five</li>
              <li>Sitting next to each other</li>
              <li>Goodnight kiss/hug</li>
            </ul>
            <p><strong>Age adjustments:</strong> Teens may reject hugs but accept fist bumps or side-hugs. 
            Respect boundaries while maintaining some physical connection.</p>
            <p><strong>Why it matters:</strong> Physical touch releases oxytocin, the bonding hormone. It communicates 
            love in a way words alone can't.</p>

            <h2>Morning Routines</h2>

            <h3>The Calm Start (20 minutes)</h3>
            <p><strong>For parents:</strong></p>
            <ul>
              <li><strong>5 min:</strong> Wake before kids if possible. Coffee/tea in silence.</li>
              <li><strong>5 min:</strong> Review day's schedule. Identify potential stress points.</li>
              <li><strong>5 min:</strong> Personal grounding (meditation, stretching, journaling, prayer—whatever works)</li>
              <li><strong>5 min:</strong> Prep one thing that will make morning smoother (lay out clothes, prep breakfast)</li>
            </ul>
            <p><strong>Why:</strong> You can't pour from an empty cup. Starting regulated helps you help others regulate.</p>

            <h3>The Predictable Launch (varies by age)</h3>
            <p><strong>Young children (ages 2-7):</strong></p>
            <ol>
              <li>Visual schedule posted (pictures of each step)</li>
              <li>Same order every day: Wake → Potty → Brush teeth → Get dressed → Breakfast → Shoes/coat → Go</li>
              <li>Warnings before transitions: "5 more minutes then shoes"</li>
              <li>One-on-one connection moment before leaving</li>
            </ol>

            <p><strong>Older children/teens (ages 8+):</strong></p>
            <ol>
              <li>Responsibility chart on fridge (they check off as they go)</li>
              <li>Alarm 15 minutes before "must leave" time</li>
              <li>Packed backpack by door the night before</li>
              <li>Grab-and-go breakfast option if running late</li>
            </ol>

            <p><strong>Co-parenting:</strong> Keep morning routine identical at both houses as much as possible. 
            Same wake-up time, same breakfast options, same steps. Reduces adjustment stress.</p>

            <h2>After-School/Work Transition</h2>

            <h3>The Decompression Zone (30-60 min)</h3>
            <p>
              Most family conflict happens between 4-7pm. Everyone's tired, hungry, dysregulated. 
              This isn't the time for big conversations or demands.
            </p>

            <p><strong>The landing:</strong></p>
            <ul>
              <li>Greet each person warmly when they arrive</li>
              <li>Allow 15-30 min of decompression (no homework, no chores, no questions beyond "how was your day?")</li>
              <li>Offer snack and water (hanger is real)</li>
              <li>Let people transition at their own pace</li>
            </ul>

            <p><strong>Decompression activities that work:</strong></p>
            <ul>
              <li>Screen time (yes, it's okay—30 min won't ruin them)</li>
              <li>Physical activity (bike, shoot hoops, walk dog)</li>
              <li>Quiet time alone in room</li>
              <li>Creative activity (coloring, building, music)</li>
              <li>Snuggle time with parent</li>
            </ul>

            <h3>The Reset Point</h3>
            <p>After decompression, transition to evening mode:</p>
            <ul>
              <li>"Okay, decompression time's over. What do you need to get done tonight?"</li>
              <li>Review schedule: Homework, activities, chores, free time</li>
              <li>Each person shares their plan</li>
              <li>Set expectations: "Homework done before dinner" or "Chores done by 7pm"</li>
            </ul>

            <h2>Evening Routines</h2>

            <h3>Family Dinner (Even 20 Minutes Counts)</h3>
            <p>
              Research is clear: regular family meals improve mental health, academic performance, 
              and reduce risky behaviors. But "dinner" can be flexible.
            </p>

            <p><strong>Making it work:</strong></p>
            <ul>
              <li><strong>Can't do dinner?</strong> Try family breakfast on weekends</li>
              <li><strong>Someone always has practice?</strong> Pick 2-3 nights per week</li>
              <li><strong>Food doesn't matter:</strong> Pizza, takeout, fancy meal—it's about being together</li>
              <li><strong>No phones at table</strong> (yes, parents too)</li>
              <li><strong>Keep it positive:</strong> Not the time for discipline or heavy topics</li>
            </ul>

            <p><strong>Conversation starters that work:</strong></p>
            <ul>
              <li>"If you could have any superpower for a day, what would it be?"</li>
              <li>"What's something that made you laugh today?"</li>
              <li>"If you could switch lives with anyone for a day, who?"</li>
              <li>"What's the best/worst thing that happened today?"</li>
              <li>"What are you reading/watching/listening to?"</li>
            </ul>

            <h3>The Wind-Down (30-60 min before bed)</h3>
            <p><strong>For everyone:</strong></p>
            <ul>
              <li>Screens off 30-60 min before bed (including TV)</li>
              <li>Dim lights in house</li>
              <li>Calm activities only (no rough play, exciting games, intense homework)</li>
              <li>Prep for tomorrow: Lay out clothes, pack bags, check schedule</li>
            </ul>

            <p><strong>For young children:</strong></p>
            <ul>
              <li>Bath time (warm water is calming)</li>
              <li>Pajamas → Brush teeth → Potty</li>
              <li>Two books (their choice, builds agency)</li>
              <li>Song or prayer</li>
              <li>Lights out at consistent time</li>
              <li>"I love you, see you in the morning"</li>
            </ul>

            <p><strong>For teens:</strong></p>
            <ul>
              <li>Negotiate reasonable bedtime together</li>
              <li>Phone charging outside bedroom</li>
              <li>Optional parent check-in: "Want to talk about anything?"</li>
              <li>Respect need for autonomy while maintaining sleep boundaries</li>
            </ul>

            <h2>Weekly Practices</h2>

            <h3>Sunday Planning Session (20 min)</h3>
            <p>Prevents chaos by getting everyone aligned:</p>
            <ol>
              <li>Review calendar for the week (work, school, activities, appointments)</li>
              <li>Identify potential conflicts or stressors</li>
              <li>Plan meals (even just deciding who's cooking when)</li>
              <li>Assign chores/responsibilities</li>
              <li>Plan one fun thing as family</li>
            </ol>

            <h3>Family Meeting (30 min, weekly or bi-weekly)</h3>
            <p>See Toolkit for full agenda. Quick version:</p>
            <ul>
              <li>Check-in: How's everyone doing?</li>
              <li>Appreciations: Name something good about each person</li>
              <li>Review: What worked/didn't work last week?</li>
              <li>Plan: What needs to change this week?</li>
              <li>Fun: What will we do together?</li>
            </ul>

            <h3>One-on-One Time (30+ min per child)</h3>
            <p>
              Each parent should spend individual time with each child weekly. 
              This is non-negotiable for healthy attachment.
            </p>
            <p><strong>Ideas:</strong></p>
            <ul>
              <li>Get ice cream together</li>
              <li>Play their favorite game</li>
              <li>Go for a walk</li>
              <li>Do a craft project</li>
              <li>Cook together</li>
              <li>Whatever they want to do (within reason)</li>
            </ul>
            <p><strong>The rules:</strong> No screens, no siblings, no multitasking. Full presence.</p>

            <h3>Partner Check-In (for co-parents)</h3>
            <p>Even 15 minutes weekly prevents resentment buildup:</p>
            <ul>
              <li>"How are things going with the kids?"</li>
              <li>"Anything you need from me?"</li>
              <li>"What's working/not working in our co-parenting?"</li>
              <li>"Any upcoming schedule stuff to coordinate?"</li>
            </ul>

            <h2>Monthly Practices</h2>

            <h3>The Big Picture Review</h3>
            <p>Once a month, step back and assess:</p>
            <ul>
              <li>Are we making progress toward our goals?</li>
              <li>What's working well?</li>
              <li>What needs adjustment?</li>
              <li>How is each person doing?</li>
              <li>Are we having enough fun together?</li>
              <li>What do we want to focus on next month?</li>
            </ul>

            <h3>The Adventure</h3>
            <p>Once a month, do something out of the ordinary:</p>
            <ul>
              <li>Visit a new park or hiking trail</li>
              <li>Try a new restaurant or cuisine</li>
              <li>Go to a museum or cultural event</li>
              <li>Day trip to somewhere you've never been</li>
              <li>Camp in the backyard</li>
              <li>Game day marathon</li>
            </ul>
            <p><strong>Why:</strong> Creates shared positive memories. Breaks routine. Reminds everyone that life isn't just obligations.</p>

            <div className="mt-8 p-6 bg-green-600/20 rounded-lg border-l-4 border-green-500">
              <h3 className="text-lg font-bold text-white mb-2">🌱 The Truth About Consistency</h3>
              <p className="text-slate-300 mb-0">
                Consistency doesn't mean perfection. It means you do the thing more often than you don't. 
                It means when you fall off, you get back on. It means the practice becomes your default, 
                even if execution is imperfect. You're not aiming for Instagram-perfect routines—you're 
                aiming for "good enough, most of the time." That's what changes systems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
