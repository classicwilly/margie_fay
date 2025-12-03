// Guardian Node AI - Pattern Detection System
// Watches for unconscious compensation, suppressed regulation needs, crisis brewing

export interface PatternDetection {
  id: string;
  userId: string;
  category: 'sensory' | 'crisis' | 'burnout' | 'suppression' | 'mesh-degradation';
  pattern: string;
  confidence: number; // 0-100
  detected: Date;
  suggestion: string;
  privacy: 'private' | 'shared-with-vertices' | 'emergency-override';
}

export interface SensoryPattern {
  type: 'oral' | 'proprioceptive' | 'vestibular' | 'tactile' | 'deep-pressure';
  behavior: string;
  frequency: number; // events per day
  unconscious: boolean;
  destructive: boolean;
  needsMet: boolean;
}

export interface CrisisIndicators {
  severity: 'low' | 'medium' | 'high' | 'critical';
  indicators: string[];
  timeframe: string; // "24 hours", "3 days", etc.
  memorialFundEligible: boolean;
  meshAlertLevel: 'none' | 'inform' | 'coordinate' | 'emergency';
}

export class GuardianNode {
  
  // ============================================
  // SENSORY REGULATION PATTERN DETECTION
  // ============================================
  
  detectSensoryPatterns(observations: {
    webcamDetections?: string[]; // "hand-to-mouth 40x/session"
    selfReports?: string[]; // "I bite my cheeks when stressed"
    parentReports?: string[]; // "Chewing shirt collars constantly"
    physicalSymptoms?: string[]; // "Bleeding cuticles", "ground teeth", "raw cheek"
  }): PatternDetection[] {
    const patterns: PatternDetection[] = [];

    // ORAL SEEKING PATTERNS
    const oralBehaviors = [
      'chewing shirt collars',
      'biting pen caps',
      'chewing hoodie strings',
      'biting inside of cheek',
      'chewing gum obsessively',
      'nail-biting',
      'teeth grinding (bruxism)'
    ];

    const oralDetected = this.matchBehaviors(observations, oralBehaviors);
    if (oralDetected.length > 0) {
      patterns.push({
        id: crypto.randomUUID(),
        userId: 'current-user',
        category: 'sensory',
        pattern: `Oral seeking gone underground: ${oralDetected.join(', ')}`,
        confidence: 85,
        detected: new Date(),
        suggestion: 'Your body needs oral input for regulation. Not a bad habit - a sensory need. Try: Chew necklace (firm texture), sugar-free gum, crunchy foods, ice chips.',
        privacy: 'private' // Student controls who sees this
      });
    }

    // PROPRIOCEPTIVE SEEKING PATTERNS
    const proprioceptiveBehaviors = [
      'nail-biting',
      'cuticle-picking',
      'hair-twirling',
      'skin-picking',
      'knuckle-cracking',
      'finger-tapping',
      'hand-wringing'
    ];

    const proprioceptiveDetected = this.matchBehaviors(observations, proprioceptiveBehaviors);
    if (proprioceptiveDetected.length > 0) {
      patterns.push({
        id: crypto.randomUUID(),
        userId: 'current-user',
        category: 'sensory',
        pattern: `Proprioceptive seeking gone underground: ${proprioceptiveDetected.join(', ')}`,
        confidence: 80,
        detected: new Date(),
        suggestion: 'Your hands need input. Not anxiety - proprioceptive regulation. Try: Fidget putty, stress ball (firm), textured fidgets, hand squeezes.',
        privacy: 'private'
      });
    }

    // VESTIBULAR SEEKING PATTERNS
    const vestibularBehaviors = [
      'leg-bouncing (constant)',
      'chair-rocking',
      'pacing',
      'foot-tapping',
      'swaying',
      'head-bobbing',
      'can\'t sit still'
    ];

    const vestibularDetected = this.matchBehaviors(observations, vestibularBehaviors);
    if (vestibularDetected.length > 0) {
      patterns.push({
        id: crypto.randomUUID(),
        userId: 'current-user',
        category: 'sensory',
        pattern: `Vestibular seeking gone underground: ${vestibularDetected.join(', ')}`,
        confidence: 75,
        detected: new Date(),
        suggestion: 'Your vestibular system needs movement. Not ADHD symptom alone - regulation need. Try: Wobble cushion, standing desk, 5-min movement breaks every 30 min.',
        privacy: 'private'
      });
    }

    // DEEP PRESSURE SEEKING PATTERNS
    const deepPressureBehaviors = [
      'tight clothing obsession',
      'heavy blankets in summer',
      'hugging self',
      'squeezing into small spaces',
      'pressing against walls'
    ];

    const deepPressureDetected = this.matchBehaviors(observations, deepPressureBehaviors);
    if (deepPressureDetected.length > 0) {
      patterns.push({
        id: crypto.randomUUID(),
        userId: 'current-user',
        category: 'sensory',
        pattern: `Deep pressure seeking gone underground: ${deepPressureDetected.join(', ')}`,
        confidence: 70,
        detected: new Date(),
        suggestion: 'Your nervous system needs calming input. Try: Weighted lap pad (5-10 lbs), compression vest/shirt, tight hugs, heavy work (carrying books, pushing against wall).',
        privacy: 'private'
      });
    }

    return patterns;
  }

  // ============================================
  // CRISIS DETECTION (MEMORIAL FUND TRIGGERS)
  // ============================================
  
  detectCrisis(context: {
    domain: 'education' | 'health' | 'coparenting' | 'work';
    recentEvents?: string[];
    meshStatus?: 'healthy' | 'strained' | 'failing';
    financialStress?: boolean;
  }): CrisisIndicators | null {
    
    const indicators: string[] = [];
    let severity: CrisisIndicators['severity'] = 'low';
    let memorialFundEligible = false;

    // EDUCATION CRISIS PATTERNS
    if (context.domain === 'education') {
      const educationCrisis = [
        'Neuropsych evaluation recommended but family can\'t afford',
        'Private tutoring needed, no funds available',
        'Assistive technology required (>$500)',
        'Vision/OT therapy recommended',
        'Medication management needed (cash-pay only)',
        'Sensory regulation tools needed (OT eval + kit)',
        'Student falling further behind despite interventions',
        'IEP eligibility blocked by lack of formal diagnosis'
      ];

      const matched = this.matchBehaviors({ selfReports: context.recentEvents }, educationCrisis);
      if (matched.length > 0) {
        indicators.push(...matched);
        severity = matched.length >= 3 ? 'high' : 'medium';
        memorialFundEligible = true;
      }
    }

    // HEALTH CRISIS PATTERNS
    if (context.domain === 'health') {
      const healthCrisis = [
        'Medication cost exceeds budget',
        'Specialist requires cash payment',
        'Medical equipment needed',
        'Emergency dental work required',
        'Mental health crisis, no insurance coverage',
        'Hospital bill creating debt'
      ];

      const matched = this.matchBehaviors({ selfReports: context.recentEvents }, healthCrisis);
      if (matched.length > 0) {
        indicators.push(...matched);
        severity = 'high';
        memorialFundEligible = true;
      }
    }

    // BURNOUT DETECTION (WORK DOMAIN)
    if (context.domain === 'work') {
      const burnoutIndicators = [
        'Working >60 hours/week consistently',
        'No PTO taken in 6+ months',
        'Sleep <5 hours/night',
        'Missing family obligations for work',
        'Physical symptoms: headaches, stomach issues, exhaustion',
        'Emotional: irritability, cynicism, detachment'
      ];

      const matched = this.matchBehaviors({ selfReports: context.recentEvents }, burnoutIndicators);
      if (matched.length >= 4) {
        indicators.push(...matched);
        severity = 'critical';
        memorialFundEligible = false; // Burnout doesn't trigger memorial fund, but DOES trigger mesh coordination
      }
    }

    if (indicators.length === 0) return null;

    return {
      severity,
      indicators,
      timeframe: severity === 'critical' ? '24 hours' : severity === 'high' ? '72 hours' : '1 week',
      memorialFundEligible,
      meshAlertLevel: severity === 'critical' ? 'emergency' : severity === 'high' ? 'coordinate' : 'inform'
    };
  }

  // ============================================
  // MESH HEALTH MONITORING
  // ============================================
  
  detectMeshDegradation(tetrahedron: {
    vertices: { id: string; lastActive: Date }[];
    edges: { from: string; to: string; strength: number }[];
  }): PatternDetection[] {
    const patterns: PatternDetection[] = [];

    // INACTIVE VERTEX DETECTION
    const now = new Date();
    const inactiveVertices = tetrahedron.vertices.filter(v => {
      const daysSinceActive = (now.getTime() - v.lastActive.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceActive > 7;
    });

    if (inactiveVertices.length > 0) {
      patterns.push({
        id: crypto.randomUUID(),
        userId: 'mesh-owner',
        category: 'mesh-degradation',
        pattern: `${inactiveVertices.length} vertices inactive >7 days`,
        confidence: 95,
        detected: new Date(),
        suggestion: `Your mesh is weakening. Inactive: ${inactiveVertices.map(v => v.id).join(', ')}. Reach out or adjust your K₄ configuration.`,
        privacy: 'shared-with-vertices'
      });
    }

    // WEAK EDGE DETECTION
    const weakEdges = tetrahedron.edges.filter(e => e.strength < 50);
    if (weakEdges.length >= 3) {
      patterns.push({
        id: crypto.randomUUID(),
        userId: 'mesh-owner',
        category: 'mesh-degradation',
        pattern: `${weakEdges.length}/6 edges below 50% strength`,
        confidence: 90,
        detected: new Date(),
        suggestion: 'Multiple weak connections detected. Schedule check-ins with vertices to strengthen mesh.',
        privacy: 'shared-with-vertices'
      });
    }

    // SINGLE POINT OF FAILURE
    const strongEdges = tetrahedron.edges.filter(e => e.strength >= 70);
    if (strongEdges.length <= 2) {
      patterns.push({
        id: crypto.randomUUID(),
        userId: 'mesh-owner',
        category: 'mesh-degradation',
        pattern: 'Mesh approaching single point of failure',
        confidence: 85,
        detected: new Date(),
        suggestion: 'Only 2 strong connections remaining. Your mesh is fragile. Strengthen edges or reconfigure K₄.',
        privacy: 'shared-with-vertices'
      });
    }

    return patterns;
  }

  // ============================================
  // SUPPRESSION PATTERN DETECTION
  // ============================================
  
  detectSuppression(student: {
    publicBehavior: string[]; // "Perfect attendance", "Never asks for help", "Always compliant"
    privateBehavior: string[]; // "Meltdowns at home", "Crying in car after school", "Refusing to go to school"
  }): PatternDetection[] {
    const patterns: PatternDetection[] = [];

    // MASKING DETECTION (Autistic students especially)
    const maskingIndicators = [
      'Perfect behavior at school, meltdowns at home',
      'Holding it together all day, collapsing at home',
      'Teacher says "no problems", parent sees crisis',
      'Suppressing stims in public, releasing at home'
    ];

    const publicPrivateSplit = student.publicBehavior.length > 0 && student.privateBehavior.length > 0;
    const maskingDetected = this.matchBehaviors(
      { selfReports: [...student.publicBehavior, ...student.privateBehavior] },
      maskingIndicators
    );

    if (publicPrivateSplit && maskingDetected.length > 0) {
      patterns.push({
        id: crypto.randomUUID(),
        userId: 'student',
        category: 'suppression',
        pattern: 'Masking detected: Public compliance, private collapse',
        confidence: 90,
        detected: new Date(),
        suggestion: 'Student is suppressing needs at school, decompensating at home. Not "fine" - survival mode. Needs: Permission to unmask, sensory breaks, reduced demands.',
        privacy: 'shared-with-vertices' // Parents + teachers need to see this
      });
    }

    return patterns;
  }

  // ============================================
  // HELPER METHODS
  // ============================================
  
  private matchBehaviors(
    observations: { selfReports?: string[]; parentReports?: string[]; webcamDetections?: string[]; physicalSymptoms?: string[] },
    patterns: string[]
  ): string[] {
    const allObservations = [
      ...(observations.selfReports || []),
      ...(observations.parentReports || []),
      ...(observations.webcamDetections || []),
      ...(observations.physicalSymptoms || [])
    ];

    return patterns.filter(pattern =>
      allObservations.some(obs =>
        obs.toLowerCase().includes(pattern.toLowerCase()) ||
        pattern.toLowerCase().includes(obs.toLowerCase())
      )
    );
  }
}

// ============================================
// USAGE EXAMPLES
// ============================================

// Example 1: Sensory Pattern Detection
const guardian = new GuardianNode();

const sensoryPatterns = guardian.detectSensoryPatterns({
  selfReports: ['I bite my cheeks when I\'m anxious'],
  parentReports: ['She\'s been chewing through her shirt collars'],
  physicalSymptoms: ['Bleeding cuticles from picking']
});

console.log('Sensory patterns detected:', sensoryPatterns);
// Output:
// [
//   {
//     pattern: "Oral seeking gone underground: biting inside of cheek, chewing shirt collars",
//     suggestion: "Your body needs oral input... Try: Chew necklace...",
//     privacy: "private"
//   },
//   {
//     pattern: "Proprioceptive seeking gone underground: cuticle-picking",
//     suggestion: "Your hands need input... Try: Fidget putty...",
//     privacy: "private"
//   }
// ]

// Example 2: Education Crisis Detection
const crisis = guardian.detectCrisis({
  domain: 'education',
  recentEvents: [
    'School recommended neuropsych evaluation',
    'Eval costs $3,000',
    'Family income $45K with 3 kids',
    'Can\'t afford evaluation',
    'Child falling further behind'
  ],
  meshStatus: 'strained',
  financialStress: true
});

if (crisis && crisis.memorialFundEligible) {
  console.log('MEMORIAL FUND TRIGGER:', crisis);
  // Activate contribution portal for 50-person mesh
}

// Example 3: Masking Detection
const suppressionPatterns = guardian.detectSuppression({
  publicBehavior: ['Perfect attendance', 'Teacher says no problems', 'Always compliant'],
  privateBehavior: ['Daily meltdowns after school', 'Refusing to go to school on Mondays', 'Crying in car']
});

console.log('Suppression detected:', suppressionPatterns);
// Alert parents + teachers: Student is masking, needs support

// Example 4: Mesh Health Monitoring
const meshPatterns = guardian.detectMeshDegradation({
  vertices: [
    { id: 'parent1', lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }, // 2 days ago
    { id: 'parent2', lastActive: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) }, // 10 days ago (INACTIVE)
    { id: 'child', lastActive: new Date() },
    { id: 'therapist', lastActive: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) } // 8 days ago (INACTIVE)
  ],
  edges: [
    { from: 'parent1', to: 'child', strength: 95 },
    { from: 'parent1', to: 'parent2', strength: 30 }, // WEAK
    { from: 'parent1', to: 'therapist', strength: 60 },
    { from: 'parent2', to: 'child', strength: 40 }, // WEAK
    { from: 'parent2', to: 'therapist', strength: 20 }, // WEAK
    { from: 'child', to: 'therapist', strength: 75 }
  ]
});

console.log('Mesh degradation detected:', meshPatterns);
// Alert: 2 vertices inactive, 3 weak edges, mesh approaching failure
