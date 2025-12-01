import Link from 'next/link';

export default function HumanFlourishingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-amber-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/vertex/philosophical" className="text-amber-600 hover:text-amber-800 mb-6 inline-block">
          ← Back to Philosophical Vertex
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full mb-3">
              Purpose
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Human Flourishing
            </h1>
            <p className="text-xl text-gray-600">
              What it means to thrive as individuals and systems
            </p>
          </div>

          <div className="prose prose-amber max-w-none">
            <h2>What Does It Mean to Flourish?</h2>
            <p>
              The Phenix Framework is not just about fixing what's broken. It's about helping people and systems 
              move toward flourishing—toward their fullest, most vibrant expression of aliveness. But what does 
              that actually mean? What are we aiming for?
            </p>

            <h2>Flourishing vs. Functioning</h2>

            <p>
              Many therapeutic approaches aim for "normal functioning"—symptom reduction, return to baseline, 
              ability to meet life demands. This is necessary but not sufficient. Flourishing is more than the 
              absence of pathology. It's the presence of vitality, meaning, connection, and growth.
            </p>

            <table>
              <thead>
                <tr>
                  <th>Functioning</th>
                  <th>Flourishing</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Getting through the day</td>
                  <td>Finding joy in the day</td>
                </tr>
                <tr>
                  <td>Avoiding conflict</td>
                  <td>Navigating conflict constructively</td>
                </tr>
                <tr>
                  <td>Meeting basic needs</td>
                  <td>Pursuing growth and meaning</td>
                </tr>
                <tr>
                  <td>Absence of symptoms</td>
                  <td>Presence of wellbeing</td>
                </tr>
                <tr>
                  <td>Surviving</td>
                  <td>Thriving</td>
                </tr>
              </tbody>
            </table>

            <p>
              We aim for flourishing. But we start where families are. If they're in crisis, we stabilize. 
              If they're barely functioning, we build capacity for functioning. Flourishing is the direction 
              of travel, not the prerequisite for beginning.
            </p>

            <h2>The Dimensions of Human Flourishing</h2>

            <p>
              Flourishing is multi-dimensional. It's not one thing but many things working together. 
              Drawing from positive psychology, humanistic psychology, and wisdom traditions, we identify 
              seven core dimensions:
            </p>

            <h3>1. Meaning & Purpose</h3>
            <p><strong>The Question:</strong> Does life feel meaningful? Do I have a sense of purpose beyond just getting by?</p>
            <p><strong>What This Looks Like:</strong></p>
            <ul>
              <li>Sense that your life matters and contributes to something larger than yourself</li>
              <li>Clarity about your values and living in alignment with them</li>
              <li>Feeling that your struggles serve some purpose or teach something valuable</li>
              <li>Connection to something transcendent (however you define it)</li>
            </ul>
            <p><strong>In Family Systems:</strong> The family has shared values and sense of collective purpose. Individual 
            members feel their role in the family is meaningful. Transitions and challenges are integrated into the 
            family narrative in ways that create meaning, not just trauma.</p>

            <h3>2. Authentic Connection</h3>
            <p><strong>The Question:</strong> Do I feel genuinely seen, known, and loved? Can I show up as my real self?</p>
            <p><strong>What This Looks Like:</strong></p>
            <ul>
              <li>Secure attachments where you can be vulnerable without fear</li>
              <li>Being able to express your full range of emotions and have them welcomed</li>
              <li>Feeling understood, not just tolerated</li>
              <li>Relationships where you can be imperfect and still belong</li>
            </ul>
            <p><strong>In Family Systems:</strong> Family members can be authentic without performing or hiding. Emotions 
            are expressed and received. Conflict doesn't threaten connection. Differences are honored, not punished. 
            People feel safe to need each other.</p>

            <h3>3. Autonomy & Agency</h3>
            <p><strong>The Question:</strong> Do I have choice and control over my life? Can I make decisions that reflect who I am?</p>
            <p><strong>What This Looks Like:</strong></p>
            <ul>
              <li>Feeling like an author of your life, not just a character in someone else's story</li>
              <li>Age-appropriate independence and decision-making power</li>
              <li>Ability to say no and have boundaries respected</li>
              <li>Freedom to pursue your interests and develop your identity</li>
            </ul>
            <p><strong>In Family Systems:</strong> Individual differentiation is supported, not threatened. Children develop 
            increasing autonomy appropriate to their age. Adults have lives outside the family. Enmeshment is avoided. 
            People can choose their level of involvement without guilt.</p>

            <h3>4. Competence & Growth</h3>
            <p><strong>The Question:</strong> Am I learning and developing? Do I feel capable of handling life's challenges?</p>
            <p><strong>What This Looks Like:</strong></p>
            <ul>
              <li>Sense of mastery in domains that matter to you</li>
              <li>Confidence that you can learn new things and adapt</li>
              <li>Experience of growth—becoming more than you were</li>
              <li>Challenges that stretch you without breaking you</li>
            </ul>
            <p><strong>In Family Systems:</strong> The system supports growth for all members. Failures are learning 
            opportunities, not sources of shame. Family adapts to developmental stages rather than staying rigid. 
            People are encouraged to take healthy risks and develop competencies.</p>

            <h3>5. Emotional Wellbeing</h3>
            <p><strong>The Question:</strong> Do I experience more positive than negative emotions? Can I regulate my feelings?</p>
            <p><strong>What This Looks Like:</strong></p>
            <ul>
              <li>Baseline contentment punctuated by moments of joy</li>
              <li>Ability to feel difficult emotions without being overwhelmed</li>
              <li>Capacity to return to equilibrium after stress</li>
              <li>Emotional range—access to the full spectrum of feelings</li>
            </ul>
            <p><strong>In Family Systems:</strong> Emotions are regulated at the system level—family helps members co-regulate. 
            Positive interactions outnumber negative ones (Gottman's 5:1 ratio). There's laughter, play, joy alongside 
            the hard stuff. System doesn't amplify stress but helps metabolize it.</p>

            <h3>6. Physical Vitality</h3>
            <p><strong>The Question:</strong> Do I have energy and health to engage with life? Does my body feel good?</p>
            <p><strong>What This Looks Like:</strong></p>
            <ul>
              <li>Basic health needs met (sleep, nutrition, movement, healthcare)</li>
              <li>Energy to pursue what matters to you</li>
              <li>Body experienced as source of pleasure, not just pain</li>
              <li>Stress managed well enough to not damage physical health</li>
            </ul>
            <p><strong>In Family Systems:</strong> Family supports physical health—regular meals, sleep routines, physical activity. 
            Stress doesn't manifest as chronic physical symptoms. Healthcare is accessible and utilized. Physical touch 
            and affection are present.</p>

            <h3>7. Contribution & Impact</h3>
            <p><strong>The Question:</strong> Do I make a positive difference? Am I of service to others?</p>
            <p><strong>What This Looks Like:</strong></p>
            <ul>
              <li>Feeling needed and valued for what you offer</li>
              <li>Ability to help others, not just receive help</li>
              <li>Contribution to community beyond just your immediate circle</li>
              <li>Generativity—creating something that outlasts you</li>
            </ul>
            <p><strong>In Family Systems:</strong> Each member contributes meaningfully according to their capacity. 
            Family contributes to broader community. Kids learn to help and serve. Family creates positive ripple 
            effects beyond itself.</p>

            <h2>The Flourishing System</h2>

            <p>
              A flourishing family system is characterized by:
            </p>

            <h3>Secure Base</h3>
            <p>
              The family is a safe haven—a place to return to for comfort and support. It's also a launching pad—a 
              place that encourages exploration and risk-taking. Like secure attachment, the system provides both 
              comfort and encouragement for growth.
            </p>

            <h3>Flexible Stability</h3>
            <p>
              The system has enough structure to feel predictable and safe, and enough flexibility to adapt to 
              change. It's not rigid or chaotic, but dynamically stable—able to maintain core identity while 
              evolving.
            </p>

            <h3>Differentiation & Integration</h3>
            <p>
              Individual members are differentiated—they have distinct identities, preferences, boundaries. And they're 
              integrated—they're connected, coordinated, working together. It's not sameness, and it's not isolation, 
              but unity-in-diversity.
            </p>

            <h3>Generative Conflict</h3>
            <p>
              Conflict is not avoided or destructive. It's engaged productively. Differences are explored. Problems 
              are solved. The system uses conflict as information and opportunity for growth, not as threat.
            </p>

            <h3>Shared Narrative</h3>
            <p>
              The family has a coherent story about who they are, where they've been, where they're going. This 
              narrative integrates both positive and painful experiences. It makes meaning of suffering. It honors 
              complexity without glossing over difficulty.
            </p>

            <h3>Repair Capacity</h3>
            <p>
              Ruptures happen—they're inevitable. What matters is the system's ability to repair. Apologies are 
              offered and received. Hurts are tended. Relationships are restored. The system doesn't demand perfection, 
              but it does demand repair.
            </p>

            <h3>Future Orientation</h3>
            <p>
              The family is not trapped in the past or merely surviving the present. There's a sense of possibility 
              and hope about the future. Plans are made. Dreams are shared. The family is oriented toward growth and 
              becoming, not just maintaining.
            </p>

            <h2>Barriers to Flourishing</h2>

            <p>
              What prevents families from flourishing? Understanding barriers helps us target interventions.
            </p>

            <h3>Structural Barriers</h3>
            <ul>
              <li>Poverty, lack of resources, food/housing insecurity</li>
              <li>Systemic oppression (racism, homophobia, ableism, etc.)</li>
              <li>Geographic isolation, lack of community support</li>
              <li>Inadequate access to healthcare, education, childcare</li>
            </ul>
            <p><strong>Our Response:</strong> Advocacy, resource connection, validation that "it's not just you." 
            Sometimes the intervention is helping families access resources, not just doing therapy.</p>

            <h3>Relational Barriers</h3>
            <ul>
              <li>Insecure attachment, lack of trust</li>
              <li>High-conflict relationships, chronic criticism</li>
              <li>Boundary violations, enmeshment or disengagement</li>
              <li>Unrepaired ruptures, accumulated resentment</li>
            </ul>
            <p><strong>Our Response:</strong> This is the heart of family systems work. Build secure relationships. 
            Improve communication. Repair boundaries. Facilitate forgiveness and repair.</p>

            <h3>Internal Barriers</h3>
            <ul>
              <li>Trauma, PTSD, unresolved grief</li>
              <li>Mental illness, addiction</li>
              <li>Shame, self-loathing, internalized oppression</li>
              <li>Lack of self-awareness or emotional literacy</li>
            </ul>
            <p><strong>Our Response:</strong> Individual therapy alongside family work. Address mental health. Process trauma. 
            Build emotional capacity. Refer to specialized treatment as needed.</p>

            <h3>Meaning Barriers</h3>
            <ul>
              <li>Sense of meaninglessness, nihilism</li>
              <li>Disconnection from values, moral injury</li>
              <li>Narrative of hopelessness, "why bother?"</li>
              <li>Loss of purpose, especially after major life transition</li>
            </ul>
            <p><strong>Our Response:</strong> Existential/philosophical work. Meaning-making. Narrative therapy. Reconnection 
            to what matters most. This is often overlooked but crucial.</p>

            <h2>The Role of Suffering</h2>

            <p>
              Here's a paradox: Flourishing doesn't mean the absence of suffering. In fact, the capacity to sit with 
              suffering—to metabolize pain rather than be destroyed by it—is essential to flourishing. The goal is not 
              to eliminate all discomfort but to develop a different relationship with it.
            </p>

            <p><strong>Flourishing people and systems can:</strong></p>
            <ul>
              <li>Experience pain without being defined by it</li>
              <li>Find meaning in suffering without glorifying it</li>
              <li>Grow through adversity without needing adversity to grow</li>
              <li>Hold joy and sorrow simultaneously without one negating the other</li>
              <li>Accept what can't be changed while continuing to work for what can</li>
            </ul>

            <p>
              This is <strong>tragic optimism</strong> (Viktor Frankl)—the ability to maintain hope and say yes to life 
              despite the inevitability of suffering. It's not toxic positivity or denial. It's honest acknowledgment 
              of pain alongside fierce commitment to meaning and growth.
            </p>

            <h2>Cultural Considerations</h2>

            <p>
              This description of flourishing is shaped by particular cultural assumptions—primarily Western, individualistic, 
              middle-class values. Other cultures might emphasize:
            </p>

            <ul>
              <li><strong>Collectivist cultures:</strong> Family harmony and duty over individual autonomy</li>
              <li><strong>Indigenous cultures:</strong> Connection to land, ancestors, community over individual achievement</li>
              <li><strong>Eastern philosophies:</strong> Acceptance and non-attachment over growth and striving</li>
              <li><strong>Working-class cultures:</strong> Survival, loyalty, pragmatism over self-actualization</li>
            </ul>

            <p>
              We must hold our framework lightly and adapt it to the values of the families we serve. The question 
              to always ask: <strong>What does flourishing mean for <em>you</em>? In your culture, your context, your values?</strong>
            </p>

            <h2>Measuring Flourishing</h2>

            <p>
              How do we know if a family is moving toward flourishing? Some indicators:
            </p>

            <h3>Subjective Wellbeing</h3>
            <ul>
              <li>Family members report greater life satisfaction</li>
              <li>More positive emotions, fewer negative emotions</li>
              <li>Sense that life is getting better, not worse or stagnant</li>
            </ul>

            <h3>Relational Quality</h3>
            <ul>
              <li>Increased warmth, affection, positive interactions</li>
              <li>Decreased conflict, criticism, hostility</li>
              <li>More repair after rupture</li>
              <li>Greater attunement and responsiveness</li>
            </ul>

            <h3>Adaptive Capacity</h3>
            <ul>
              <li>Family handles stressors better</li>
              <li>More flexible in responding to challenges</li>
              <li>Recovers from setbacks faster</li>
              <li>Can learn from mistakes rather than repeat them</li>
            </ul>

            <h3>Growth Indicators</h3>
            <ul>
              <li>People trying new things, taking healthy risks</li>
              <li>Development of new skills and competencies</li>
              <li>Movement toward goals and values</li>
              <li>Sense of progress, not just maintenance</li>
            </ul>

            <h3>Meaning & Engagement</h3>
            <ul>
              <li>Increased sense of purpose</li>
              <li>More engaged with life, not just going through motions</li>
              <li>Finding meaning in challenges, not just being defeated by them</li>
              <li>Contributing to others and community</li>
            </ul>

            <h2>The Practitioner's Flourishing</h2>

            <p>
              You cannot lead families to flourishing if you're not cultivating it in your own life. This work 
              demands that you practice what you preach. Are you:
            </p>

            <ul>
              <li>Maintaining your own secure relationships?</li>
              <li>Setting appropriate boundaries?</li>
              <li>Finding meaning in your work?</li>
              <li>Managing your stress and emotional health?</li>
              <li>Continuing to grow and learn?</li>
              <li>Contributing to community?</li>
              <li>Modeling the integration of joy and sorrow?</li>
            </ul>

            <p>
              If the answer is no, that's your first intervention. Not because you need to be perfect, but because 
              your own flourishing (or lack thereof) will inevitably shape your work with families. The invitation 
              is to live into these values yourself.
            </p>

            <div className="mt-8 p-6 bg-amber-50 rounded-lg border-l-4 border-amber-500">
              <h3 className="text-lg font-bold text-amber-900 mb-2">🌱 The Direction, Not the Destination</h3>
              <p className="text-amber-800 mb-0">
                Flourishing is not a finish line you cross. It's a direction you move toward. Some days you're closer, 
                some days further. Some seasons are about surviving, others about thriving. What matters is the overall 
                trajectory over time. Are families moving toward more aliveness, more connection, more meaning, more 
                capacity? That's what we're after. Not perfection. Not permanent happiness. But an upward spiral toward 
                fullness of life. That's worth working for.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
