import Link from 'next/link';

export default function CommunicationPatternsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-purple-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/vertex/emotional" className="text-purple-600 hover:text-purple-800 mb-6 inline-block">
          ← Back to Emotional Vertex
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full mb-3">
              Skills
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Communication Patterns
            </h1>
            <p className="text-xl text-gray-600">
              Healthy dialogue and conflict resolution
            </p>
          </div>

          <div className="prose prose-purple max-w-none">
            <h2>The Foundation of Healthy Communication</h2>
            <p>
              Most relationship problems aren't actually about the content of disagreements—they're 
              about how people communicate. You can disagree about almost anything and still maintain 
              a strong relationship if you communicate well. Conversely, you can agree on everything 
              and still have a terrible relationship if communication is poor.
            </p>

            <h2>The Four Horsemen (What NOT to Do)</h2>
            <p>
              Research by John Gottman identified four communication patterns that predict relationship 
              failure with over 90% accuracy. Avoid these at all costs:
            </p>

            <h3>1. Criticism</h3>
            <p>
              Attacking someone's character rather than addressing specific behavior.
            </p>
            <p><strong>Sounds like:</strong> "You're so selfish! You never think about anyone but yourself!"</p>
            <p><strong>Why it's toxic:</strong> Makes the other person defensive; feels like an attack on their identity</p>
            <p><strong>Instead, try:</strong> "I feel hurt when you make plans without checking with me first. 
            Can we talk about how to coordinate better?" (Specific behavior + feeling + request)</p>

            <h3>2. Contempt</h3>
            <p>
              Treating the other person with disrespect, mockery, or disgust. This is the single worst 
              predictor of relationship breakdown.
            </p>
            <p><strong>Sounds like:</strong> Eye rolling, sarcasm, name-calling, mockery, hostile humor</p>
            <p><strong>Why it's toxic:</strong> Communicates "you're beneath me"; impossible to problem-solve from 
            a position of contempt</p>
            <p><strong>Instead, try:</strong> Build a culture of appreciation and respect. Even in conflict, 
            maintain fundamental respect for the other person</p>

            <h3>3. Defensiveness</h3>
            <p>
              Refusing to take any responsibility; counter-attacking when confronted.
            </p>
            <p><strong>Sounds like:</strong> "It's not my fault!" "What about the time YOU..." "I didn't do anything wrong!"</p>
            <p><strong>Why it's toxic:</strong> Prevents problem-solving; escalates conflict; nobody takes ownership</p>
            <p><strong>Instead, try:</strong> "You're right, I did contribute to this problem. Let me think about 
            what I could have done differently." (Even if you think the other person contributed more)</p>

            <h3>4. Stonewalling</h3>
            <p>
              Shutting down, withdrawing, giving the silent treatment.
            </p>
            <p><strong>Looks like:</strong> Turning away, no eye contact, minimal or no responses, leaving the room</p>
            <p><strong>Why it's toxic:</strong> Leaves issues unresolved; communicates "you don't matter"; 
            creates distance</p>
            <p><strong>Instead, try:</strong> "I'm feeling overwhelmed and need a 20-minute break to calm down. 
            Can we come back to this at 7pm?" (Communicate the need for space without abandoning the conversation)</p>

            <h2>Communication Skills That Work</h2>

            <h3>Active Listening</h3>
            <p>
              Most people don't listen to understand—they listen to respond. Active listening means 
              fully focusing on what the other person is saying before formulating your reply.
            </p>
            <p><strong>How to practice:</strong></p>
            <ul>
              <li><strong>Put down devices:</strong> Give full attention</li>
              <li><strong>Make eye contact:</strong> Shows you're present</li>
              <li><strong>Don't interrupt:</strong> Let them finish their thought</li>
              <li><strong>Reflect back:</strong> "So what I'm hearing is..." or "It sounds like you're feeling..."</li>
              <li><strong>Ask clarifying questions:</strong> "Can you tell me more about that?" "What do you mean by...?"</li>
              <li><strong>Validate:</strong> "That makes sense" or "I can see why you'd feel that way" (doesn't mean you agree, 
              just that you understand)</li>
            </ul>

            <h3>"I" Statements</h3>
            <p>
              Express your own experience without blaming the other person.
            </p>
            <p><strong>Formula:</strong> "I feel [emotion] when [specific behavior] because [impact on me]."</p>
            <p><strong>Examples:</strong></p>
            <ul>
              <li>"I feel anxious when the dishes pile up because I worry we'll attract pests."</li>
              <li>"I feel disconnected when we don't talk for days because I miss feeling close to you."</li>
              <li>"I feel frustrated when plans change last-minute because I had mentally prepared for the original plan."</li>
            </ul>
            <p><strong>Not:</strong> "You make me so mad!" or "I feel like you're being lazy" ("I feel like..." followed by 
            judgment is not an I statement)</p>

            <h3>The Repair Attempt</h3>
            <p>
              When a conversation is going badly, someone needs to hit the reset button. This is a repair attempt.
            </p>
            <p><strong>Repair phrases:</strong></p>
            <ul>
              <li>"Can we start over? I don't think that came out right."</li>
              <li>"I'm sorry, I'm getting defensive. Let me try to hear what you're actually saying."</li>
              <li>"We're both getting heated. Can we take a break and try again later?"</li>
              <li>"I love you and I don't want to fight. Can we slow down?"</li>
              <li>"Timeout—I think we're misunderstanding each other."</li>
            </ul>
            <p><strong>Crucial:</strong> The other person must accept repair attempts for them to work. If someone says 
            "let's take a break," honor it.</p>

            <h3>Sandwich Technique (for delivering hard feedback)</h3>
            <p>
              Positive → Constructive Criticism → Positive
            </p>
            <p><strong>Example:</strong> "I really appreciate how you've been helping with bedtime lately. I need to 
            talk to you about the morning routine, which isn't working as well. I know we can figure this out together 
            because we make a good team."</p>
            <p><strong>Warning:</strong> Don't fake the positives or this becomes manipulative. Mean what you say.</p>

            <h3>The 5:1 Ratio</h3>
            <p>
              Research shows healthy relationships need 5 positive interactions for every 1 negative interaction. 
              Build up your positive bank account with:
            </p>
            <ul>
              <li>Genuine compliments</li>
              <li>Expressions of appreciation</li>
              <li>Affection and physical touch</li>
              <li>Laughter and playfulness</li>
              <li>Interest in each other's lives</li>
              <li>Acts of service and kindness</li>
            </ul>

            <h2>Conflict Resolution Strategies</h2>

            <h3>Step 1: Choose the Right Time and Place</h3>
            <ul>
              <li><strong>Not:</strong> When hungry, tired, or rushed</li>
              <li><strong>Not:</strong> In front of children or in public</li>
              <li><strong>Not:</strong> Via text for important issues</li>
              <li><strong>Yes:</strong> When both people are calm and have time</li>
              <li><strong>Yes:</strong> In private, face-to-face</li>
            </ul>

            <h3>Step 2: Define the Problem (One Issue at a Time)</h3>
            <ul>
              <li>State the specific issue clearly</li>
              <li>Don't bring up past grievances ("kitchen-sinking")</li>
              <li>Make sure you're both talking about the same thing</li>
            </ul>

            <h3>Step 3: Each Person Shares Their Perspective</h3>
            <ul>
              <li>Use "I" statements</li>
              <li>The listener actively listens without interrupting</li>
              <li>Reflect back to ensure understanding</li>
              <li>Validate the other's feelings (even if you disagree with their conclusion)</li>
            </ul>

            <h3>Step 4: Find Common Ground</h3>
            <ul>
              <li>What do you agree on?</li>
              <li>What do you both want?</li>
              <li>What matters to both of you?</li>
            </ul>

            <h3>Step 5: Brainstorm Solutions Together</h3>
            <ul>
              <li>Generate multiple options without judging them yet</li>
              <li>Be creative—think outside usual patterns</li>
              <li>Look for win-win solutions where both people get something they need</li>
            </ul>

            <h3>Step 6: Choose a Solution and Try It</h3>
            <ul>
              <li>Pick the option that works best for both</li>
              <li>Be specific about who does what, when</li>
              <li>Agree to reassess in a set timeframe</li>
              <li>Be willing to adjust if it doesn't work</li>
            </ul>

            <h3>Step 7: Follow Up</h3>
            <ul>
              <li>Check in: Is this working?</li>
              <li>Appreciate effort, even if results aren't perfect</li>
              <li>Adjust as needed</li>
            </ul>

            <h2>Special Communication Scenarios</h2>

            <h3>Co-Parent Communication After Divorce</h3>
            <p><strong>Best practices:</strong></p>
            <ul>
              <li><strong>Keep it businesslike:</strong> You're partners in raising children, not friends</li>
              <li><strong>Focus on kids:</strong> Only discuss matters related to the children</li>
              <li><strong>Use structured methods:</strong> Shared calendar, co-parenting app, email for non-urgent matters</li>
              <li><strong>48-hour response rule:</strong> Respond to all child-related communication within 48 hours</li>
              <li><strong>No badmouthing:</strong> Never speak negatively about the other parent to or around the children</li>
            </ul>

            <h3>Talking to Children About Difficult Topics</h3>
            <p><strong>Age-appropriate communication:</strong></p>
            <ul>
              <li><strong>Young children (3-7):</strong> Simple, concrete explanations. Lots of reassurance that they're safe 
              and loved. Answer only what they ask.</li>
              <li><strong>School age (8-12):</strong> More detail but still limit adult information. Watch for questions 
              disguised as statements. Give permission to feel however they feel.</li>
              <li><strong>Teens (13-18):</strong> More adult conversations but still protect them from being your confidant. 
              Respect their need to process on their own timeline.</li>
            </ul>

            <h3>When Someone Won't Communicate</h3>
            <p>You can't force someone to talk, but you can:</p>
            <ul>
              <li>Clearly state your need: "I need us to talk about X"</li>
              <li>Make it safe: "I won't get angry, I just want to understand"</li>
              <li>Offer options: "Would you rather write it out? Talk in the car so we don't have to make eye contact?"</li>
              <li>Set a boundary: "If we can't talk directly, we'll need help from a therapist"</li>
              <li>Accept you can't control them: Focus on what you can control (your own behavior)</li>
            </ul>

            <h2>Communication Tools</h2>

            <h3>The Speaker-Listener Technique</h3>
            <p>Structured turn-taking for difficult conversations:</p>
            <ul>
              <li><strong>Speaker:</strong> Shares one point at a time (2-3 sentences)</li>
              <li><strong>Listener:</strong> Paraphrases what they heard</li>
              <li><strong>Speaker:</strong> Confirms or clarifies</li>
              <li>Switch roles after each point is understood</li>
            </ul>

            <h3>Emotion Coaching (for parents)</h3>
            <ol>
              <li><strong>Notice emotion:</strong> "I see you're upset"</li>
              <li><strong>Name it:</strong> "You seem frustrated"</li>
              <li><strong>Validate:</strong> "It's okay to feel frustrated when things don't go your way"</li>
              <li><strong>Set limits on behavior:</strong> "But we don't hit when we're frustrated"</li>
              <li><strong>Problem-solve together:</strong> "What could you do instead?"</li>
            </ol>

            <h3>Weekly Check-Ins</h3>
            <p>Schedule regular relationship maintenance conversations:</p>
            <ul>
              <li>What went well this week?</li>
              <li>What was hard?</li>
              <li>What do we need to address?</li>
              <li>What are we looking forward to?</li>
              <li>How can I support you this coming week?</li>
            </ul>

            <h2>When Professional Help is Needed</h2>
            <p>Consider couples or family therapy if:</p>
            <ul>
              <li>The same arguments repeat without resolution</li>
              <li>Contempt or stonewalling are regular patterns</li>
              <li>There's been a betrayal that needs professional support to repair</li>
              <li>Communication has completely broken down</li>
              <li>Violence or threats are present (seek immediate help)</li>
              <li>You're considering separation but want to try to save the relationship</li>
            </ul>

            <div className="mt-8 p-6 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-purple-900 mb-2">💬 Communication Truth</h3>
              <p className="text-purple-800 mb-0">
                Perfect communication is impossible. You will misunderstand each other. You will say 
                things wrong. You will hurt each other's feelings. The goal isn't perfection—it's 
                repair. Can you catch yourself when you mess up? Can you apologize and try again? 
                Can you give each other grace? That's what makes relationships work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
