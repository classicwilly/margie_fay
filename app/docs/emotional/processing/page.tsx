import Link from 'next/link';

export default function ProcessingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/vertex/emotional" className="text-purple-400 hover:text-purple-300 mb-6 inline-block">
          ← Back to Emotional Vertex
        </Link>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-purple-600/20 text-purple-400 text-sm font-medium rounded-full mb-3">
              Foundations
            </span>
            <h1 className="text-4xl font-bold text-white mb-2">
              Emotional Processing Guide
            </h1>
            <p className="text-xl text-slate-300">
              Supporting healthy emotional expression
            </p>
          </div>

          <div className="prose prose-invert prose-purple max-w-none">
            <h2>Why Emotional Processing Matters</h2>
            <p>
              Emotions are information. They tell us what we need, what's working, what's not, 
              and what matters to us. In family systems, unprocessed emotions don't disappear—they 
              go underground, emerging as anxiety, depression, anger, or physical symptoms.
            </p>
            <p>
              Healthy emotional processing allows feelings to flow through the system without 
              getting stuck or causing damage. It's not about being "positive" all the time—it's 
              about being <em>real</em> and dealing with reality as it is.
            </p>

            <h2>The Emotional Processing Cycle</h2>

            <h3>1. Awareness</h3>
            <p>
              Before you can process an emotion, you must first notice it. Many people are so 
              disconnected from their feelings that they don't recognize what they're experiencing.
            </p>
            <p><strong>Practice:</strong> Body scan. Several times daily, pause and ask: "What am I feeling right now?" 
            Notice sensations in your body—tight chest, clenched jaw, fluttery stomach. These are emotional signals.</p>
            <ul>
              <li>Anger: heat, tension, energy to move</li>
              <li>Sadness: heaviness, fatigue, throat tightness</li>
              <li>Fear: cold, shakiness, gut tightness</li>
              <li>Joy: lightness, warmth, expansion</li>
            </ul>

            <h3>2. Naming</h3>
            <p>
              "Name it to tame it." Research shows that simply labeling an emotion reduces its 
              intensity and moves it from the reactive emotional brain to the thoughtful rational brain.
            </p>
            <p><strong>Practice:</strong> Use feeling words. Expand beyond "fine," "good," "bad." Try: frustrated, 
            overwhelmed, disappointed, anxious, grateful, content, irritated, hurt, excited, peaceful.</p>

            <h3>3. Acceptance</h3>
            <p>
              Don't judge the emotion. It's not "stupid" or "wrong" to feel what you feel. Emotions 
              simply are. Judging them adds a second layer of suffering on top of the original feeling.
            </p>
            <p><strong>Practice:</strong> "I'm feeling [emotion]. That makes sense given [situation]." This validates 
            your experience without requiring you to act on every feeling.</p>

            <h3>4. Expression</h3>
            <p>
              Emotions need a way out. Healthy expression releases emotional energy without causing harm.
            </p>
            <p><strong>Healthy Expression Methods:</strong></p>
            <ul>
              <li><strong>Talking:</strong> Share feelings with safe people using "I feel" statements</li>
              <li><strong>Writing:</strong> Journal, letters (that may or may not be sent)</li>
              <li><strong>Physical:</strong> Cry, exercise, dance, scream into pillows</li>
              <li><strong>Creative:</strong> Art, music, poetry as emotional outlets</li>
            </ul>
            <p><strong>Unhealthy Expression (avoid):</strong> Dumping on others, passive aggression, self-harm, 
            substance use, lashing out destructively</p>

            <h3>5. Integration</h3>
            <p>
              What is this emotion teaching you? What do you need? What action (if any) is called for?
            </p>
            <p><strong>Practice:</strong> Ask the emotion questions:</p>
            <ul>
              <li>"What are you trying to protect me from?"</li>
              <li>"What do you need right now?"</li>
              <li>"What would help you feel better?"</li>
            </ul>

            <h2>Special Considerations for Different Ages</h2>

            <h3>Children (Ages 3-12)</h3>
            <p>
              Children are still developing emotional vocabulary and regulation skills. They need:
            </p>
            <ul>
              <li><strong>Co-regulation:</strong> Adult stays calm and helps child calm down</li>
              <li><strong>Emotion naming:</strong> "I see you're feeling frustrated"</li>
              <li><strong>Simple tools:</strong> Feelings charts, color zones, breathing exercises</li>
              <li><strong>Safe expression:</strong> Hitting pillows okay, hitting people not okay</li>
              <li><strong>Validation:</strong> "It's okay to be upset. Let's figure this out together"</li>
            </ul>

            <h3>Teens (Ages 13-18)</h3>
            <p>
              Adolescent brains are under massive reconstruction. Emotions are intense and unpredictable.
            </p>
            <ul>
              <li><strong>Space + Connection:</strong> They need room to feel but also need you available</li>
              <li><strong>Less talking, more presence:</strong> Sit with them; don't lecture</li>
              <li><strong>Normalize intensity:</strong> "Teen emotions are like emotions with the volume at 11"</li>
              <li><strong>Teach ahead:</strong> Discuss healthy processing when they're NOT in crisis</li>
              <li><strong>Respect privacy:</strong> They won't share everything; that's developmentally appropriate</li>
            </ul>

            <h3>Adults</h3>
            <p>
              Adults often carry decades of unprocessed emotion. Permission to feel may be revolutionary.
            </p>
            <ul>
              <li><strong>Emotional permission:</strong> You're allowed to feel whatever you feel</li>
              <li><strong>Therapy:</strong> Professional help for deep or traumatic emotions</li>
              <li><strong>Somatic work:</strong> Body-based approaches for emotions stored physically</li>
              <li><strong>Community:</strong> Safe friends or groups for processing</li>
            </ul>

            <h2>Processing in Relationships</h2>

            <h3>"I Feel" Statements</h3>
            <p>Formula: "I feel [emotion] when [specific behavior] because [impact on me]."</p>
            <p>Example: "I feel anxious when you don't text that you'll be late because I don't know if you're safe."</p>
            <p><strong>Not:</strong> "You make me so angry!" (blame) or "I feel like you're an idiot" (not a feeling)</p>

            <h3>Hold Space for Others</h3>
            <p>When someone shares emotions with you:</p>
            <ul>
              <li><strong>Listen without fixing:</strong> Most people need to be heard, not advised</li>
              <li><strong>Validate, don't minimize:</strong> "That sounds really hard" not "It could be worse"</li>
              <li><strong>Reflect back:</strong> "So you're feeling overwhelmed by everything on your plate?"</li>
              <li><strong>Ask what they need:</strong> "Would you like me to just listen, or do you want suggestions?"</li>
            </ul>

            <h3>Repair After Emotional Flooding</h3>
            <p>
              When emotions overwhelm your capacity to process well (yelling, shutting down, etc.):
            </p>
            <ol>
              <li><strong>Take a break:</strong> "I need 20 minutes to calm down"</li>
              <li><strong>Self-soothe:</strong> Walk, breathe, journal, whatever helps you regulate</li>
              <li><strong>Return and repair:</strong> "I'm sorry I yelled. I was overwhelmed. Can we try again?"</li>
              <li><strong>Name what happened:</strong> "I got flooded and couldn't think clearly"</li>
              <li><strong>Resume the conversation:</strong> When both parties are regulated</li>
            </ol>

            <h2>Emotional Processing Tools</h2>

            <h3>The Feelings Wheel</h3>
            <p>
              Start with broad categories (mad, sad, glad, scared, shame) then move inward to more 
              specific words (mad → frustrated → irritated; sad → disappointed → let down).
            </p>

            <h3>RAIN Technique</h3>
            <ul>
              <li><strong>R</strong>ecognize: What am I feeling?</li>
              <li><strong>A</strong>llow: Let it be here without resistance</li>
              <li><strong>I</strong>nvestigate: What does this feel like in my body? What does it need?</li>
              <li><strong>N</strong>urture: Offer yourself compassion</li>
            </ul>

            <h3>Grounding Techniques</h3>
            <p>When emotions are overwhelming:</p>
            <ul>
              <li><strong>5-4-3-2-1:</strong> Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste</li>
              <li><strong>Box breathing:</strong> In for 4, hold for 4, out for 4, hold for 4</li>
              <li><strong>Cold water:</strong> Splash face or hold ice cube</li>
              <li><strong>Movement:</strong> Shake out your body, stretch, walk</li>
            </ul>

            <h3>Emotion Tracking</h3>
            <p>
              Keep a simple log: Date, situation, feeling, intensity (1-10), what helped. Over time, 
              patterns emerge that reveal triggers and effective coping strategies.
            </p>

            <h2>When to Seek Professional Help</h2>
            <p>Consider therapy or specialized support if:</p>
            <ul>
              <li>Emotions regularly feel overwhelming or unmanageable</li>
              <li>Emotional patterns interfere with work, school, or relationships</li>
              <li>Persistent anxiety, depression, or emotional numbness</li>
              <li>History of trauma that's unresolved</li>
              <li>Thoughts of self-harm or suicide</li>
              <li>Substance use to manage emotions</li>
            </ul>

            <div className="mt-8 p-6 bg-purple-600/20 rounded-lg border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-white mb-2">💜 Remember</h3>
              <p className="text-slate-300 mb-0">
                You don't have to be perfect at emotional processing. No one is. The goal is progress: 
                noticing your feelings more often, expressing them more healthily, letting them inform 
                rather than control you. Every time you pause and check in with your emotions, you're 
                building emotional intelligence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
