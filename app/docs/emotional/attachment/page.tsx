import Link from 'next/link';

export default function AttachmentPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-purple-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/vertex/emotional" className="text-purple-600 hover:text-purple-800 mb-6 inline-block">
          ← Back to Emotional Vertex
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full mb-3">
              Theory
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Attachment & Bonding
            </h1>
            <p className="text-xl text-gray-600">
              Building and maintaining secure connections
            </p>
          </div>

          <div className="prose prose-purple max-w-none">
            <h2>What is Attachment?</h2>
            <p>
              Attachment is the deep emotional bond between a child and caregiver, formed in the first 
              years of life. This bond becomes the template for all future relationships. How we learned 
              to connect (or disconnect) in childhood shapes how we relate to others throughout life.
            </p>
            <p>
              Attachment isn't just about love—it's about safety. When a child's needs are consistently 
              met with warmth and reliability, they learn the world is safe, they are worthy, and 
              relationships are trustworthy. When needs are inconsistently met or ignored, very different 
              lessons are learned.
            </p>

            <h2>The Four Attachment Styles</h2>

            <h3>Secure Attachment (~60% of population)</h3>
            <p><strong>In childhood, looks like:</strong></p>
            <ul>
              <li>Child explores confidently when caregiver is present</li>
              <li>Seeks comfort from caregiver when distressed</li>
              <li>Is soothed relatively quickly by caregiver</li>
              <li>Happy to see caregiver return after separation</li>
              <li>Balance of independence and connection</li>
            </ul>
            <p><strong>In adulthood, looks like:</strong></p>
            <ul>
              <li>Comfortable with intimacy and independence</li>
              <li>Can express needs and emotions clearly</li>
              <li>Trusts others and believes they're worthy of love</li>
              <li>Handles conflict without becoming overwhelmed</li>
              <li>Can be alone without feeling abandoned</li>
            </ul>
            <p><strong>Develops when:</strong> Caregiver is consistently responsive, attuned, and emotionally available</p>

            <h3>Anxious-Preoccupied Attachment (~20%)</h3>
            <p><strong>In childhood, looks like:</strong></p>
            <ul>
              <li>Clingy, anxious behavior with caregiver</li>
              <li>Extremely distressed by separation</li>
              <li>Difficult to soothe even when caregiver returns</li>
              <li>Ambivalent—both seeks and resists comfort</li>
              <li>Doesn't explore much; stays close to caregiver</li>
            </ul>
            <p><strong>In adulthood, looks like:</strong></p>
            <ul>
              <li>Craves intimacy but worries about being abandoned</li>
              <li>Needs constant reassurance</li>
              <li>Highly sensitive to relationship shifts</li>
              <li>Can be clingy or demanding in relationships</li>
              <li>Struggles with jealousy and fear of rejection</li>
              <li>Self-worth depends on partner's validation</li>
            </ul>
            <p><strong>Develops when:</strong> Caregiver is inconsistent—sometimes responsive, sometimes not. Child 
            can't predict whether needs will be met.</p>

            <h3>Dismissive-Avoidant Attachment (~25%)</h3>
            <p><strong>In childhood, looks like:</strong></p>
            <ul>
              <li>Appears independent, doesn't seek caregiver</li>
              <li>Shows little distress at separation</li>
              <li>Doesn't seem to need or want comfort</li>
              <li>Avoids or ignores caregiver upon return</li>
              <li>May appear emotionally flat or shut down</li>
            </ul>
            <p><strong>In adulthood, looks like:</strong></p>
            <ul>
              <li>Highly values independence and self-sufficiency</li>
              <li>Uncomfortable with emotional intimacy</li>
              <li>Dismisses importance of close relationships</li>
              <li>Suppresses emotions, appears distant</li>
              <li>Partners feel shut out or kept at arm's length</li>
              <li>May have difficulty recognizing own emotional needs</li>
            </ul>
            <p><strong>Develops when:</strong> Caregiver is emotionally unavailable, dismissive of needs, or rejecting. 
            Child learns to not need anyone.</p>

            <h3>Fearful-Avoidant (Disorganized) Attachment (~5-10%)</h3>
            <p><strong>In childhood, looks like:</strong></p>
            <ul>
              <li>Confused, contradictory behavior</li>
              <li>Approaches caregiver then pulls away</li>
              <li>Appears dazed, frozen, or dissociated</li>
              <li>No consistent strategy for getting needs met</li>
              <li>Often seen in abused or neglected children</li>
            </ul>
            <p><strong>In adulthood, looks like:</strong></p>
            <ul>
              <li>Desires intimacy but deeply fears it</li>
              <li>Push-pull dynamic in relationships</li>
              <li>Difficulty trusting others or self</li>
              <li>May repeat trauma patterns</li>
              <li>Intense relationships that are unstable</li>
              <li>High emotional reactivity</li>
            </ul>
            <p><strong>Develops when:</strong> Caregiver is source of both comfort and fear (often due to abuse, severe 
            neglect, or caregiver's own unresolved trauma)</p>

            <h2>Attachment in Family Systems</h2>

            <h3>How Attachment Affects Parenting</h3>
            <p>
              Parents tend to pass down their attachment patterns. An anxious parent may be overprotective; 
              an avoidant parent may seem emotionally distant; a disorganized parent may be unpredictable.
            </p>
            <p><strong>The good news:</strong> Awareness and effort can break intergenerational patterns. Secure 
            attachment can be earned through therapy, conscious parenting, and healthy adult relationships.</p>

            <h3>Attachment in Divorce/Separation</h3>
            <p>
              Divorce disrupts attachment security for children who suddenly have limited access to one parent. 
              Critical interventions:
            </p>
            <ul>
              <li><strong>Maintain consistency:</strong> Predictable schedules help children feel secure</li>
              <li><strong>Both parents stay involved:</strong> Unless safety issues, children need both attachment figures</li>
              <li><strong>Manage transitions carefully:</strong> Handoffs can trigger attachment distress</li>
              <li><strong>Co-parent cooperation:</strong> Even if you're not together, united parenting provides security</li>
              <li><strong>Extra reassurance:</strong> Children need to hear they're loved and the divorce isn't their fault</li>
            </ul>

            <h3>Attachment in Step-Families</h3>
            <p>
              Children may resist bonding with step-parents, especially if they feel it betrays their biological parent. 
              Building secure attachment takes time:
            </p>
            <ul>
              <li>Go slowly—don't force connection</li>
              <li>Build trust through consistency</li>
              <li>Respect the biological parent-child bond</li>
              <li>Let attachment develop naturally over months/years</li>
              <li>Step-parent provides support, not replacement</li>
            </ul>

            <h2>Building Secure Attachment</h2>

            <h3>For Parents with Young Children</h3>
            <p><strong>The key: Attunement</strong> - Noticing, understanding, and responding to your child's cues</p>
            <ul>
              <li><strong>Respond promptly to distress:</strong> Crying babies aren't manipulating; they're communicating</li>
              <li><strong>Be physically affectionate:</strong> Hugs, cuddles, eye contact, warm touch</li>
              <li><strong>Repair ruptures:</strong> When you mess up (you will), reconnect warmly</li>
              <li><strong>Provide safe base:</strong> Child can explore knowing you're there if needed</li>
              <li><strong>Manage your own emotions:</strong> Can't co-regulate child if you're dysregulated</li>
              <li><strong>Be present:</strong> Quality time matters more than quantity</li>
            </ul>

            <h3>For Parents with Older Children/Teens</h3>
            <p>
              Attachment needs don't end at age 5—they just look different:
            </p>
            <ul>
              <li><strong>Stay available:</strong> Even if they seem to not need you, they do</li>
              <li><strong>Respect growing autonomy:</strong> Secure base shifts to launching pad</li>
              <li><strong>Show interest:</strong> In their lives, friends, interests</li>
              <li><strong>Maintain rituals:</strong> Weekly dinner, bedtime check-ins, whatever works</li>
              <li><strong>Be safe to come to:</strong> Don't overreact when they share hard stuff</li>
              <li><strong>Repair is still crucial:</strong> "I'm sorry I lost my temper" builds security</li>
            </ul>

            <h3>Earning Secure Attachment as an Adult</h3>
            <p>
              If you didn't have secure attachment as a child, you can develop it through:
            </p>
            <ul>
              <li><strong>Therapy:</strong> Especially attachment-focused or trauma therapy</li>
              <li><strong>Secure relationships:</strong> Healthy friendships/partnerships can rewire attachment</li>
              <li><strong>Conscious parenting:</strong> Breaking patterns with your own children heals you too</li>
              <li><strong>Self-awareness:</strong> Understanding your patterns is the first step to changing them</li>
              <li><strong>Inner child work:</strong> Giving yourself the care you didn't receive</li>
            </ul>

            <h2>Attachment Repair After Rupture</h2>

            <h3>What is a Rupture?</h3>
            <p>
              Any moment when connection is broken: harsh words, physical separation, emotional unavailability, 
              misattunement. Ruptures are inevitable and not inherently damaging—<em>if they're repaired</em>.
            </p>

            <h3>The Repair Process</h3>
            <ol>
              <li><strong>Notice the rupture:</strong> "I see you're upset with me" or "Something's off between us"</li>
              <li><strong>Take responsibility:</strong> "I was harsh" or "I wasn't listening well"</li>
              <li><strong>Validate feelings:</strong> "It makes sense that hurt your feelings"</li>
              <li><strong>Apologize genuinely:</strong> "I'm sorry. That wasn't okay"</li>
              <li><strong>Reconnect:</strong> Physical affection, eye contact, warm tone</li>
              <li><strong>Move forward:</strong> Don't dwell, but don't rug-sweep either</li>
            </ol>

            <h3>Why Repair Matters</h3>
            <p>
              Children (and adults) who experience rupture followed by repair learn:
            </p>
            <ul>
              <li>Conflict is normal and survivable</li>
              <li>Relationships can heal</li>
              <li>You're worth coming back for</li>
              <li>Emotions don't destroy connections</li>
              <li>People can take responsibility and change</li>
            </ul>
            <p>
              Actually, relationships <em>with</em> rupture and repair are often stronger than relationships 
              with no conflict (which may indicate avoidance, not closeness).
            </p>

            <h2>Red Flags: Attachment Trauma</h2>
            <p>Seek professional help if you see:</p>
            <ul>
              <li><strong>In children:</strong> Extreme clinginess or extreme avoidance, no preference for caregiver over 
              strangers, indiscriminate affection with anyone, inability to be soothed, aggressive behavior, developmental 
              delays</li>
              <li><strong>In adults:</strong> Pattern of unstable relationships, inability to trust, extreme fear of abandonment, 
              complete emotional shutdown, repeating abusive relationships, inability to recognize own needs</li>
            </ul>

            <h2>Assessment: What's Your Attachment Style?</h2>
            <p>Quick self-assessment questions:</p>
            <ul>
              <li>Do you worry about being abandoned by people you love?</li>
              <li>Do you feel uncomfortable when people get too close?</li>
              <li>Do you need a lot of reassurance that you're loved?</li>
              <li>Can you depend on others and let others depend on you?</li>
              <li>Do you feel okay being alone?</li>
              <li>Can you express emotions and needs clearly?</li>
            </ul>
            <p>
              <strong>Mostly yes to needing reassurance, worrying about abandonment:</strong> Anxious-Preoccupied<br/>
              <strong>Mostly yes to discomfort with closeness, valuing independence extremely:</strong> Dismissive-Avoidant<br/>
              <strong>Yes to both wanting and fearing closeness:</strong> Fearful-Avoidant<br/>
              <strong>Comfortable with intimacy and autonomy, can handle conflict:</strong> Secure
            </p>

            <h2>Resources for Attachment Healing</h2>
            <ul>
              <li><strong>Books:</strong> "Attached" by Levine & Heller, "The Power of Attachment" by Diane Poole Heller</li>
              <li><strong>Therapy modalities:</strong> Attachment-based therapy, EMDR for trauma, emotionally focused therapy (EFT)</li>
              <li><strong>Parenting programs:</strong> Circle of Security, Trust-Based Relational Intervention</li>
              <li><strong>For couples:</strong> Hold Me Tight workshops (based on EFT)</li>
            </ul>

            <div className="mt-8 p-6 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-purple-900 mb-2">💜 Attachment Hope</h3>
              <p className="text-purple-800 mb-0">
                Your attachment style is not your destiny. While early experiences shape us, they don't 
                trap us. Every secure relationship you build—with a therapist, friend, partner, or your 
                own children—rewires your attachment system. It's never too late to earn secure attachment. 
                The brain remains plastic, and love remains powerful, at every age.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
