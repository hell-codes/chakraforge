import {
  ScenarioConfig,
  AgentState,
  SimulationEvent,
  MetricsSnapshot,
  SimulationPhase,
  HeroType,
  AgentRole
} from '../../types/simulation';
import { ChakravyuhaFormation } from '../formation/Chakravyuha';
import { VisionModel } from '../information/VisionModel';
import { CommBus } from '../communication/CommBus';
import { StrategyEngine } from '../strategies/StrategyEngine';
import { MetricsCollector } from '../metrics/MetricsCollector';
import { PRNG, distance2D, normalizeAngle } from '../utils/math';

// Mahabharata-authentic narrative events for each phase
const MAHABHARATA_EVENTS = {
  APPROACHING: [
    { title: 'Abhimanyu Sounds the Conch', desc: 'Abhimanyu blows the Devadatta conch. The sound echoes across Kurukshetra as he charges toward the Chakravyūha.' },
    { title: 'Droṇa Observes the Vanguard', desc: '"Let him come," Droṇa commands. "Only the one who knows the exit can truly threaten us."' },
    { title: 'Pandava War Drums Beat', desc: 'Bhīma and Yudhiṣṭhira advance behind Abhimanyu, war elephants trumpeting across the 13th-day battlefield.' }
  ],
  ENTERING: [
    { title: 'The Outer Breach Yields', desc: 'Abhimanyu\'s chariot wheels thunder through the outer vanguard gate. Kaurava archers scatter before his onslaught.' },
    { title: 'Kṛpācārya Signals Alarm', desc: 'Commander Kṛpācārya signals: "The Arjuna-born has entered! Seal the formation!"' },
    { title: 'Arrows Fill the Sky', desc: 'Abhimanyu fires seventy-seven arrows in quick succession, cutting down two Kaurava chariot captains.' }
  ],
  PENETRATING: [
    { title: 'Tier Breached — Kaurava Ranks Break', desc: 'Abhimanyu\'s chariot cuts through the second tier\'s infantry. His horses trample enemy formations.' },
    { title: 'Karṇa Engages at Distance', desc: 'Karṇa fires celestial arrows at Abhimanyu but cannot penetrate his Lunar dynasty armor.' },
    { title: 'Droṇa Marvels', desc: '"Even his father Arjuna could not have done better," Droṇa admits watching Abhimanyu\'s penetration from his command ring.' }
  ],
  SUPPORT_BLOCKED: [
    { title: 'Jayadratha Invokes His Boon!', desc: 'King Jayadratha invokes his boon from Lord Śiva: for one day, he gains the power to hold back all Pandavas except Arjuna at the outer breach.' },
    { title: 'Bhīma is Turned Back!', desc: 'Bhīma charges the breach three times. Each time Jayadratha\'s divine force repels him. "I cannot pass!" Bhīma roars in anguish.' },
    { title: 'The Gate is Sealed', desc: 'The outer breach closes behind Abhimanyu like a stone door. He is alone in the spiral. No reinforcement can follow.' }
  ],
  ISOLATED: [
    { title: 'Communication Severed', desc: 'The inner rings close behind Abhimanyu. His conch calls to Yudhiṣṭhira go unanswered — the stone formation absorbs all sound.' },
    { title: 'Abhimanyu Fights Alone', desc: '"Let them come! I was born of Arjuna and Subhadrā — I am a warrior by blood and destiny!" Abhimanyu vows to fight to his last breath.' },
    { title: 'Six Maharathis Close In', desc: 'Droṇa, Karṇa, Kṛpācārya, Aśvatthāman, Śalya, and Duḥśāsana begin converging from all six inner ring sectors.' }
  ],
  SURROUNDED: [
    { title: 'Kaurava Strategy: Break His Bow', desc: 'Droṇa orders: "Break his bow, kill his horses — do not let him fire. Six maharathis must act in unison!"' },
    { title: 'Abhimanyu\'s Bow is Cut', desc: 'Karṇa fires from behind — a violation of warrior dharma — and severs Abhimanyu\'s Gāṇḍīva-strength bow.' },
    { title: 'Fighting with Chariot Wheel', desc: 'His bow severed, his charioteer slain, Abhimanyu lifts a broken chariot wheel as his final weapon and charges.' },
    { title: 'The Six Close the Ring', desc: 'Six maharathis press in simultaneously from all directions. Abhimanyu stands at the center of the formation he could not exit.' }
  ]
};

export class SimulationEngine {
  public config: ScenarioConfig;
  public formation: ChakravyuhaFormation;
  public agents: AgentState[] = [];
  public kauravaCommanders: AgentState[] = [];
  public commBus: CommBus;
  public strategyEngine: StrategyEngine;
  public metricsCollector: MetricsCollector;
  public events: SimulationEvent[] = [];
  
  public currentStep: number = 0;
  public phase: SimulationPhase = 'APPROACHING';
  public isRunning: boolean = false;
  public isFinished: boolean = false;

  private prng: PRNG;
  private eventIdCounter: number = 0;
  private surroundedCombatSteps: number = 0;
  public hasBreachedInnerCore: boolean = false;
  private innerCoreBreachedStep: number = 0;
  // Track which narrative events have been fired per phase
  private phaseNarrativeIndex: Partial<Record<SimulationPhase, number>> = {};
  // Step at which each phase was first entered
  private phaseEnteredAt: Partial<Record<SimulationPhase, number>> = {};
  // Whether outer ring unlock has been triggered
  private outerRingsUnlocked: boolean = false;

  constructor(config: ScenarioConfig) {
    this.config = config;
    this.prng = new PRNG(config.seed);
    this.commBus = new CommBus();
    this.strategyEngine = new StrategyEngine(config.seed);
    this.metricsCollector = new MetricsCollector();

    this.formation = new ChakravyuhaFormation(
      {
        ringCount: config.ringCount,
        baseRadius: 3.5,
        ringWidth: 0.6,
        ringSpacing: 3.2,
        complexity: config.formationComplexity,
        dynamics: config.environmentDynamics,
        rotationSpeeds: [],
        gateCountPerRing: [],
        centralFormationRadius: 2.0
      },
      config.seed
    );

    this.initializeAgents();
  }

  public initializeAgents(): void {
    this.agents = [];
    this.kauravaCommanders = [];
    this.currentStep = 0;
    this.phase = 'APPROACHING';
    this.isFinished = false;
    this.surroundedCombatSteps = 0;
    this.phaseNarrativeIndex = {};
    this.phaseEnteredAt = {};
    this.outerRingsUnlocked = false;
    this.hasBreachedInnerCore = false;
    this.innerCoreBreachedStep = 0;
    this.commBus.reset();
    this.metricsCollector.reset();
    this.events = [];
    this.formation.setJayadrathaSeal(false);
    this.formation.buildFormation();

    const totalRings = this.config.ringCount;
    const outerRing = this.formation.rings[this.formation.rings.length - 1];
    const outerRadius = outerRing ? outerRing.radius : (3.5 + totalRings * 3.2);

    // Outer gate is at angle PI/2 (North = positive Y). Abhimanyu approaches from above (higher Y).
    // Position him directly north of the outer ring's gate
    const startY = outerRadius + 6.0;

    // 1. SPAWN HERO AGENT: ABHIMANYU
    const abhimanyu: AgentState = {
      id: 'agent-abhimanyu',
      index: 0,
      name: 'Abhimanyu',
      heroType: 'ABHIMANYU',
      team: 'PANDAVA',
      role: 'PANDAVA_INFILTRATOR',
      strategy: this.config.strategy,
      position: { x: 0, y: startY },        // North of outer ring
      velocity: { x: 0, y: -0.76 },         // Moving south toward center at hero charge speed
      heading: -Math.PI / 2,                 // South
      speed: 0.76,
      maxSpeed: 0.95,
      status: 'ACTIVE',
      health: 100,
      stamina: 100,
      currentLayer: 0,
      supportStatus: 'SUPPORTED',
      pathHistory: [{ x: 0, y: startY }],
      currentWaypoint: null,
      plannedPath: [{ x: 0, y: 0 }],
      targetLocation: { x: 0, y: 0 },
      informationLevel: this.config.informationLevel,
      exitKnowledgePercent: this.config.mode === 'HISTORICAL' ? 0 : this.config.exitKnowledgePercent,
      visionRadius: 14.0,
      visionFov: Math.PI * 2,
      perception: {
        visibleAgents: [],
        visibleObstacles: [],
        visibleGates: [],
        knownTarget: { x: 0, y: 0 },
        isInBlockedZone: false
      },
      knownTarget: { x: 0, y: 0 },
      knownGates: [],
      counterfactualPaths: [],
      bestPredictedExit: null,
      communicationLevel: this.config.communicationLevel,
      isCommSevered: false,
      messagesSent: 0,
      messagesReceived: 0,
      commCooldown: 0,
      recentMessages: [],
      collisionCount: 0,
      stepsTaken: 0,
      distanceTraveled: 0,
      distanceToTarget: startY,
      stuckSteps: 0,
      currentAction: 'Charging Toward Chakravyūha Outer Gate',
      decisionReason: 'Vanguard spearhead — Abhimanyu possesses knowledge of the outer gate entry per Drona Parva Adhyaya 34.',
      decisionExplanation: 'Heading due south, aiming for the North outer breach gate of the Chakravyūha.',
      decisionFactors: [
        { factor: 'Entry Knowledge', weight: 0.9, impact: 'Knows outer gate location' },
        { factor: 'Heroic Resolve', weight: 0.1, impact: 'Son of Arjuna advances without hesitation' }
      ]
    };
    this.agents.push(abhimanyu);

    // 2. SPAWN PANDAVA SUPPORT HEROES (Following behind Abhimanyu)
    const supportHeroes: { name: string; heroType: HeroType; role: AgentRole; offsetX: number; offsetY: number }[] = [
      { name: 'Bhīma', heroType: 'BHIMA', role: 'SUPPORT_UNIT', offsetX: -3.0, offsetY: startY + 2.5 },
      { name: 'Yudhiṣṭhira', heroType: 'YUDHISHTHIRA', role: 'TACTICAL_LEADER', offsetX: 0.0, offsetY: startY + 4.5 },
      { name: 'Sātyaki', heroType: 'SATYAKI', role: 'SUPPORT_UNIT', offsetX: 3.0, offsetY: startY + 2.8 },
      { name: 'Dhṛṣṭadyumna', heroType: 'DHRISHTADYUMNA', role: 'TACTICAL_LEADER', offsetX: -1.5, offsetY: startY + 6.0 }
    ];

    const actualSupportCount = Math.min(supportHeroes.length, Math.max(1, this.config.agentCount - 1));

    for (let i = 0; i < actualSupportCount; i++) {
      const s = supportHeroes[i];
      const agent: AgentState = {
        id: `agent-${s.heroType.toLowerCase()}`,
        index: i + 1,
        name: s.name,
        heroType: s.heroType,
        team: 'PANDAVA',
        role: s.role,
        strategy: this.config.strategy === 'RANDOM' ? 'RANDOM' : 'COORDINATED',
        position: { x: s.offsetX, y: s.offsetY },
        velocity: { x: 0, y: -0.3 },
        heading: -Math.PI / 2,
        speed: 0.35,
        maxSpeed: 0.45,
        status: 'ACTIVE',
        health: 100,
        stamina: 100,
        currentLayer: 0,
        supportStatus: 'SUPPORTED',
        pathHistory: [{ x: s.offsetX, y: s.offsetY }],
        currentWaypoint: null,
        plannedPath: [{ x: 0, y: 0 }],
        targetLocation: { x: 0, y: 0 },
        informationLevel: this.config.informationLevel,
        exitKnowledgePercent: 0,
        visionRadius: 11.0,
        visionFov: Math.PI * 2,
        perception: { visibleAgents: [], visibleObstacles: [], visibleGates: [], knownTarget: { x: 0, y: 0 }, isInBlockedZone: false },
        knownTarget: { x: 0, y: 0 },
        knownGates: [],
        counterfactualPaths: [],
        bestPredictedExit: null,
        communicationLevel: this.config.communicationLevel,
        isCommSevered: false,
        messagesSent: 0,
        messagesReceived: 0,
        commCooldown: 0,
        recentMessages: [],
        collisionCount: 0,
        stepsTaken: 0,
        distanceTraveled: 0,
        distanceToTarget: Math.sqrt(s.offsetX * s.offsetX + s.offsetY * s.offsetY),
        stuckSteps: 0,
        currentAction: 'Advancing in Rear Formation',
        decisionReason: `${s.name} advances behind Abhimanyu as promised to Yudhiṣṭhira.`,
        decisionExplanation: `${s.name} follows the vanguard through the outer breach corridor.`,
        decisionFactors: [{ factor: 'Loyalty', weight: 0.8, impact: 'Sworn to follow' }]
      };
      this.agents.push(agent);
    }

    // 3. SPAWN KAURAVA DEFENSE COMMANDERS
    const kauravaList: { name: string; heroType: HeroType; ringIndex: number; angle: number }[] = [
      { name: 'Guru Droṇācārya', heroType: 'DRONA', ringIndex: 1, angle: Math.PI * 0.25 },
      { name: 'King Jayadratha', heroType: 'JAYADRATHA', ringIndex: totalRings, angle: Math.PI / 2 + 0.1 },
      { name: 'Karṇa', heroType: 'KARNA', ringIndex: 2, angle: Math.PI * 0.75 },
      { name: 'Kṛpācārya', heroType: 'KRIPA', ringIndex: 3, angle: -Math.PI * 0.2 },
      { name: 'Aśvatthāman', heroType: 'ASHWATTHAMAN', ringIndex: 2, angle: -Math.PI * 0.5 },
      { name: 'Duḥśāsana', heroType: 'DUHSHASANA', ringIndex: 3, angle: Math.PI * 1.1 }
    ];

    for (let k = 0; k < kauravaList.length; k++) {
      const c = kauravaList[k];
      const ring = this.formation.rings.find((r) => r.index === c.ringIndex) || this.formation.rings[0];
      const posX = Math.cos(c.angle) * ring.radius;
      const posY = Math.sin(c.angle) * ring.radius;

      const commander: AgentState = {
        id: `kaurava-${c.heroType.toLowerCase()}`,
        index: 100 + k,
        name: c.name,
        heroType: c.heroType,
        team: 'KAURAVA',
        role: 'KAURAVA_COMMANDER',
        strategy: 'GREEDY',
        position: { x: posX, y: posY },
        velocity: { x: 0, y: 0 },
        heading: c.angle + Math.PI,
        speed: 0.2,
        maxSpeed: 0.35,
        status: 'ACTIVE',
        health: 100,
        stamina: 100,
        currentLayer: c.ringIndex,
        supportStatus: 'SUPPORTED',
        pathHistory: [{ x: posX, y: posY }],
        currentWaypoint: null,
        plannedPath: [],
        targetLocation: { x: 0, y: 0 },
        informationLevel: 'FULL',
        exitKnowledgePercent: 100,
        visionRadius: 16.0,
        visionFov: Math.PI * 2,
        perception: { visibleAgents: [], visibleObstacles: [], visibleGates: [], knownTarget: null, isInBlockedZone: false },
        knownTarget: null,
        knownGates: [],
        counterfactualPaths: [],
        bestPredictedExit: null,
        communicationLevel: 'HIGH',
        isCommSevered: false,
        messagesSent: 0,
        messagesReceived: 0,
        commCooldown: 0,
        recentMessages: [],
        collisionCount: 0,
        stepsTaken: 0,
        distanceTraveled: 0,
        distanceToTarget: 0,
        stuckSteps: 0,
        currentAction: c.heroType === 'JAYADRATHA' ? 'Holding North Outer Breach' : 'Commanding Defensive Sector',
        decisionReason: 'Kaurava defensive formation protocol.',
        decisionExplanation: `${c.name} stationed on Ring ${c.ringIndex} per Droṇa\'s concentric defense array.`,
        decisionFactors: [{ factor: 'Formation Defense', weight: 1.0, impact: 'Protect Central Formation' }]
      };
      this.kauravaCommanders.push(commander);
    }

    this.metricsCollector.registerInitialPositions(this.agents);

    this.addEvent(
      'STORY_PHASE',
      '⚔️ Chakravyūha Deployed — 13th Day of Kurukshetra',
      `Guru Droṇācārya arrays ${totalRings} concentric rings of warriors around Duryodhana. ${actualSupportCount + 1} Pandava heroes prepare to breach the outer vanguard. The 13th day battle begins.`,
      'info'
    );
  }

  public step(): MetricsSnapshot {
    if (this.isFinished) {
      return this.metricsCollector.history[this.metricsCollector.history.length - 1];
    }

    this.currentStep++;

    // 1. Unlock outer ring rotation after Abhimanyu is safely inside (step 55+)
    if (!this.outerRingsUnlocked && this.currentStep >= 55) {
      this.formation.unlockOuterRings(this.currentStep);
      this.outerRingsUnlocked = true;
    }

    // 2. Update Formation dynamics & gates
    const { gateChanges } = this.formation.update(this.currentStep);
    for (const gc of gateChanges) {
      this.addEvent(
        'GATE_CHANGE',
        `Ring ${gc.ringIndex} Gate ${gc.state}`,
        `Gate on Ring ${gc.ringIndex} shifted to ${gc.state}. Abhimanyu must adjust path.`,
        gc.state === 'OPEN' ? 'info' : 'warning'
      );
    }

    // 3. Process Communication with empirical reliability
    const commReliability = typeof this.config.commReliabilityPercent === 'number'
      ? this.config.commReliabilityPercent
      : this.config.communicationLevel === 'NONE'
      ? 0
      : this.config.communicationLevel === 'RESTRICTED'
      ? 25
      : this.config.communicationLevel === 'NORMAL'
      ? 75
      : 100;

    const { deliveredPackets } = this.commBus.update(
      this.currentStep,
      this.agents,
      this.config.communicationLevel,
      this.config.communicationRange,
      commReliability
    );

    for (const pkt of deliveredPackets) {
      this.addEvent(
        'COMMUNICATION',
        `📡 Signal: ${pkt.type}`,
        `From ${pkt.senderId}: ${pkt.type}`,
        'info',
        pkt.senderId
      );
    }

    const abhimanyu = this.agents[0];
    const distToCenter = Math.sqrt(abhimanyu.position.x * abhimanyu.position.x + abhimanyu.position.y * abhimanyu.position.y);
    const outerRadius = this.formation.rings[this.formation.rings.length - 1]?.radius || 23;

    // Calculate current ring layer of Abhimanyu
    let currentLayer = 0;
    const sortedRings = [...this.formation.rings].sort((a, b) => a.radius - b.radius);
    if (distToCenter > sortedRings[sortedRings.length - 1].radius + 0.8) {
      currentLayer = 0; // Outside formation
    } else {
      for (const ring of sortedRings) {
        if (distToCenter <= ring.radius + ring.thickness) {
          currentLayer = ring.index;
          break;
        }
      }
      // If inside all rings, he's in the central formation
      if (currentLayer === 0 && distToCenter <= sortedRings[0].radius) {
        currentLayer = 1;
      }
    }
    abhimanyu.currentLayer = currentLayer;

    // --- PHASE STATE MACHINE: each transition fires ONCE, sequentially ---

    // A. APPROACHING -> ENTERING (crosses outer ring boundary)
    if (this.phase === 'READY' || this.phase === 'APPROACHING') {
      if (distToCenter <= outerRadius + 0.5) {
        this.phase = 'ENTERING';
        this.phaseEnteredAt['ENTERING'] = this.currentStep;
        this.addEvent(
          'STORY_PHASE',
          '⚡ Abhimanyu Breaches the North Gate!',
          'Abhimanyu\'s chariot crashes through the outer vanguard gate with celestial fury. Kaurava archers scatter before him.',
          'success',
          abhimanyu.id
        );
        this.fireNarrativeEvent('ENTERING');
      }
    }

    // B. ENTERING -> PENETRATING (inside outer ring, moving through first tier)
    if (this.phase === 'ENTERING') {
      if (distToCenter <= outerRadius - 2.0 || this.currentStep > (this.phaseEnteredAt['ENTERING'] || 0) + 20) {
        this.phase = 'PENETRATING';
        this.phaseEnteredAt['PENETRATING'] = this.currentStep;
        this.addEvent(
          'STORY_PHASE',
          '🏹 Penetrating the Outer Tiers',
          `Abhimanyu drives his chariot through the ${this.config.ringCount}th ring. Kaurava captains fall before his arrows. He advances to the inner spiral.`,
          'info',
          abhimanyu.id
        );
        this.fireNarrativeEvent('PENETRATING');
      }
    }

    // C. PENETRATING/DEEP_PENETRATION -> SUPPORT_BLOCKED (Jayadratha seals the outer breach)
    // Historical: fires at step 60 OR when Abhimanyu is 2+ rings deep
    const abhimanyuIsInside = distToCenter <= outerRadius - 3.0;
    const jayadrathaTime = this.currentStep >= 55 || (abhimanyuIsInside && this.currentStep >= 42);

    if (jayadrathaTime && !this.formation.isJayadrathaSealed &&
        (this.phase === 'PENETRATING' || this.phase === 'ENTERING' || this.phase === 'DEEP_PENETRATION')) {
      const isHistorical = this.config.mode === 'HISTORICAL';
      const shouldBlockSupport = isHistorical || this.config.supportBlocked;

      if (shouldBlockSupport) {
        this.formation.setJayadrathaSeal(true);
        this.phase = 'SUPPORT_BLOCKED';
        this.phaseEnteredAt['SUPPORT_BLOCKED'] = this.currentStep;
        abhimanyu.supportStatus = 'SUPPORT_BLOCKED';

        // Halt Pandava support heroes at the breach
        for (let i = 1; i < this.agents.length; i++) {
          const supportHero = this.agents[i];
          supportHero.status = 'BLOCKED';
          supportHero.velocity = { x: 0, y: 0 };
          supportHero.currentAction = 'Halted at North Breach by Jayadratha\'s Divine Boon';
          supportHero.decisionReason = 'Jayadratha\'s boon from Lord Śiva blocks all Pandavas except Arjuna.';
        }

        this.addEvent(
          'STORY_PHASE',
          '🚫 Jayadratha Seals the Breach!',
          'King Jayadratha invokes his divine boon from Lord Śiva! The outer gate slams shut like a stone fortress door. Bhīma, Yudhiṣṭhira, and Sātyaki are physically repelled. Abhimanyu is alone inside.',
          'error',
          'kaurava-jayadratha'
        );
        this.fireNarrativeEvent('SUPPORT_BLOCKED');
      } else {
        // Counterfactual: support pierces through
        this.phase = 'SUPPORTED';
        abhimanyu.supportStatus = 'SUPPORTED';
        this.addEvent(
          'STORY_PHASE',
          '✅ Counterfactual: Pandava Support Pierces!',
          'In this counterfactual scenario, Jayadratha\'s boon is nullified. Bhīma, Yudhiṣṭhira, and Sātyaki pour through the breach behind Abhimanyu!',
          'success'
        );
      }
    }

    // D. SUPPORT_BLOCKED -> ISOLATED (inner rings rotate closed, comms severed)
    const deepInside = distToCenter <= outerRadius - (3.0 * this.config.ringCount * 0.35);
    const isolationTime = this.currentStep >= (this.phaseEnteredAt['SUPPORT_BLOCKED'] || 999) + 28;

    if (this.formation.isJayadrathaSealed && isolationTime &&
        (this.phase === 'SUPPORT_BLOCKED' || this.phase === 'PENETRATING')) {
      this.phase = 'ISOLATED';
      this.phaseEnteredAt['ISOLATED'] = this.currentStep;
      abhimanyu.supportStatus = 'ISOLATED';
      if (!abhimanyu.isCommSevered) {
        abhimanyu.isCommSevered = true;
        this.addEvent(
          'STORY_PHASE',
          '📵 Communication Severed — Abhimanyu Isolated!',
          'The rotating inner rings close behind Abhimanyu. His conch blasts cannot reach Yudhiṣṭhira outside. All radio contact is lost. He fights alone through the deepening spiral.',
          'warning',
          abhimanyu.id
        );
        this.fireNarrativeEvent('ISOLATED');
      }
    } else if (!this.formation.isJayadrathaSealed && deepInside &&
               (this.phase === 'SUPPORTED' || this.phase === 'PENETRATING')) {
      this.phase = 'DEEP_PENETRATION';
      this.phaseEnteredAt['DEEP_PENETRATION'] = this.currentStep;
    }

    // E. SURROUNDED (Abhimanyu reaches the inner 2 rings — Kaurava maharathis converge)
    const innerRingCount = Math.min(2, this.config.ringCount);
    const isInInnerRings = (currentLayer > 0 && currentLayer <= innerRingCount) || distToCenter <= 6.5;

    if (isInInnerRings &&
        this.phase !== 'SURROUNDED' &&
        this.phase !== 'HISTORICAL_END' &&
        this.phase !== 'ESCAPE_SUCCESS' &&
        this.phase !== 'ESCAPE_FAILURE') {
      this.phase = 'SURROUNDED';
      this.phaseEnteredAt['SURROUNDED'] = this.currentStep;
      this.addEvent(
        'STORY_PHASE',
        '🔴 Kaurava Maharathis Converge on Abhimanyu!',
        'Droṇa, Karṇa, Aśvatthāman, Kṛpācārya, Śalya, and Duḥśāsana close the final ring. Six of the greatest warriors of the age surround Abhimanyu in the Central Formation.',
        'warning',
        abhimanyu.id
      );
      this.fireNarrativeEvent('SURROUNDED');
    }

    // Dynamic Health & Stamina tracking
    if (this.phase !== 'SURROUNDED' && this.phase !== 'HISTORICAL_END') {
      // Stamina depletes with effort; collisions drain more
      abhimanyu.stamina = Math.max(15, Math.round(100 - abhimanyu.stepsTaken * 0.05 - abhimanyu.collisionCount * 0.1));
      // Health drops as he fights through the rings
      abhimanyu.health = Math.max(20, Math.round(100 - abhimanyu.collisionCount * 0.15 - abhimanyu.stepsTaken * 0.02));
    }

    // F. TERMINAL CONDITIONS
    if (this.config.mode === 'HISTORICAL') {
      if (this.phase === 'SURROUNDED') {
        this.surroundedCombatSteps++;
        // Dramatic health decay during surrounded combat
        abhimanyu.stamina = Math.max(0, (abhimanyu.stamina ?? 0) - 1);
        abhimanyu.health = Math.max(0, (abhimanyu.health ?? 0) - 1.5);

        // Fire narrative combat events every 15 steps of SURROUNDED
        if (this.surroundedCombatSteps % 15 === 0) {
          this.fireNarrativeEvent('SURROUNDED');
        }

        // After 60 surrounded combat steps — Abhimanyu falls heroically
        if (this.surroundedCombatSteps >= 60) {
          this.phase = 'HISTORICAL_END';
          abhimanyu.status = 'ELIMINATED';
          abhimanyu.health = 0;
          abhimanyu.stamina = 0;
          this.isFinished = true;
          this.addEvent(
            'STORY_PHASE',
            '⚔️ The Heroic Last Stand — Abhimanyu Falls',
            'Surrounded in the Central Formation, his bow severed, his charioteer slain, Abhimanyu fights with a chariot wheel until his last breath. He falls per Drona Parva Adhyaya 48 — but his legend endures as the greatest single warrior feat of the Kurukshetra war.',
            'error',
            abhimanyu.id
          );
        }
      }
    } else {
      // COUNTERFACTUAL MODE
      if (this.config.exitKnowledgePercent > 0) {
        // Keep live counterfactual candidates populated for Inspector HUD
        const { paths, bestExit } = this.strategyEngine.evaluateExitCandidatePaths(abhimanyu, this.formation);
        abhimanyu.counterfactualPaths = paths;
        abhimanyu.bestPredictedExit = bestExit;

        // 1. Detect when Abhimanyu breaches the inner core
        if (!this.hasBreachedInnerCore && (isInInnerRings || distToCenter <= 7.0)) {
          this.hasBreachedInnerCore = true;
          this.innerCoreBreachedStep = this.currentStep;
          this.addEvent(
            'STORY_PHASE',
            '⚡ Abhimanyu Breaches the Inner Core!',
            'Abhimanyu reaches the core of the Chakravyūha! Facing the Kaurava commanders, he prepares his counterfactual reverse breakthrough.',
            'info',
            abhimanyu.id
          );
        }

        // 2. ONLY start escape attempt AFTER reaching the inner core & clashing for at least 6 steps
        if (this.hasBreachedInnerCore && bestExit && (this.currentStep >= (this.innerCoreBreachedStep || 0) + 6)) {
          if ((this.phase as string) !== 'ESCAPE_ATTEMPT' && this.phase !== 'ESCAPE_SUCCESS') {
            this.phase = 'ESCAPE_ATTEMPT';
            this.phaseEnteredAt['ESCAPE_ATTEMPT'] = this.currentStep;
            this.addEvent(
              'STORY_PHASE',
              '💨 Counterfactual: Breakout via Alternate Flank Gate!',
              `With ${this.config.exitKnowledgePercent}% exit knowledge, Abhimanyu bypasses the congested North entrance and breaks through the alternate flank corridor with ${bestExit.successProbability}% confidence!`,
              'info',
              abhimanyu.id
            );
          }
          const exitDest = { x: bestExit.waypoints[bestExit.waypoints.length - 1].x, y: bestExit.waypoints[bestExit.waypoints.length - 1].y };
          abhimanyu.targetLocation = exitDest;
          abhimanyu.knownTarget = exitDest;
        }

        // 3. SUCCESS: Only triggered once Abhimanyu has breached the core AND subsequently reached outside safety
        const distToExitDest = abhimanyu.targetLocation ? distance2D(abhimanyu.position, abhimanyu.targetLocation) : 999;
        const hasReachedOuterSafety = distToCenter >= outerRadius + 0.3 ||
                                      distToExitDest <= 2.5 ||
                                      (distToCenter >= outerRadius - 0.4 && abhimanyu.currentLayer === 0);

        if (this.hasBreachedInnerCore && this.phase === 'ESCAPE_ATTEMPT' && hasReachedOuterSafety) {
          this.phase = 'ESCAPE_SUCCESS';
          abhimanyu.status = 'COMPLETED';
          abhimanyu.health = Math.max(10, (abhimanyu.health ?? 0) - 0.5);
          this.isFinished = true;
          this.addEvent(
            'STORY_PHASE',
            '🌟 Counterfactual Victory — Abhimanyu Escapes!',
            `With exit knowledge and tactical courage, Abhimanyu successfully breaks out of the Chakravyūha through the alternate flank gate into freedom! The tragic fate of history is overcome.`,
            'success',
            abhimanyu.id
          );
        }
      } else if (this.hasBreachedInnerCore && this.config.exitKnowledgePercent === 0) {
        // Without exit knowledge, even in What-If mode, surrounded combat commences
        this.phase = 'SURROUNDED';
      }
    }

    // G. Safety step limit
    if (this.currentStep >= 800 && !this.isFinished) {
      this.isFinished = true;
      this.phase = 'COMPLETE';
      this.addEvent(
        'STORY_PHASE',
        'Simulation Step Limit Reached',
        'Simulation reached the 800-step safety threshold.',
        'info'
      );
    }

    // 4. Update Agent Kinematics
    for (const agent of this.agents) {
      if (agent.status === 'COMPLETED' || agent.status === 'ELIMINATED' || agent.status === 'BLOCKED') {
        continue;
      }

      agent.stepsTaken++;

      // Epistemic Perception Filter
      agent.perception = VisionModel.filterPerception(agent, this.agents, this.formation, this.config.informationLevel);

      // Strategy Engine Decision
      const decision = this.strategyEngine.computeDecision(
        agent,
        this.agents,
        this.formation,
        this.commBus,
        this.currentStep
      );

      agent.velocity = decision.desiredVelocity;
      agent.currentAction = decision.newAction;
      agent.decisionReason = decision.decisionReason;
      agent.decisionExplanation = decision.decisionExplanation;
      agent.decisionFactors = decision.factors;
      agent.plannedPath = decision.plannedWaypoints;

      // Broadcast messages if allowed
      if (decision.broadcastMessage && !agent.isCommSevered && this.config.communicationLevel !== 'NONE') {
        this.commBus.sendPacket({
          senderId: agent.id,
          receiverId: 'BROADCAST',
          type: decision.broadcastMessage.type,
          payload: decision.broadcastMessage.payload,
          senderPos: { ...agent.position },
          receiverPos: { x: 0, y: 0 },
          transmittedStep: this.currentStep,
          deliverStep: this.currentStep + this.config.communicationDelay,
          status: 'IN_FLIGHT'
        });
        agent.messagesSent++;
      }

      // Move & Check Collision
      const candidatePos = {
        x: agent.position.x + agent.velocity.x,
        y: agent.position.y + agent.velocity.y
      };

      const { collided, resolvedPos, collidedRing } = this.formation.checkCollision(agent.position, candidatePos);

      if (collided) {
        agent.collisionCount++;
        agent.stuckSteps++;
        agent.position = resolvedPos;
        if (agent.stuckSteps === 3) {
          this.addEvent('COLLISION', `${agent.name} Deflected`, `Hit Ring ${collidedRing} stone barrier — rerouting via gate orbit.`, 'warning', agent.id);
        }
      } else {
        agent.stuckSteps = Math.max(0, agent.stuckSteps - 1);
        const distMoved = distance2D(agent.position, candidatePos);
        agent.distanceTraveled += distMoved;
        agent.position = candidatePos;
      }

      // Update heading
      if (Math.abs(agent.velocity.x) > 0.01 || Math.abs(agent.velocity.y) > 0.01) {
        agent.heading = Math.atan2(agent.velocity.y, agent.velocity.x);
      }

      if (this.currentStep % 2 === 0) {
        agent.pathHistory.push({ ...agent.position });
        if (agent.pathHistory.length > 300) agent.pathHistory.shift();
      }

      agent.distanceToTarget = distance2D(agent.position, formationTarget(this.formation));
    }

    // 5. Update Kaurava Commanders (Patrol their ring sectors)
    for (const cmd of this.kauravaCommanders) {
      if (cmd.heroType !== 'JAYADRATHA') {
        const ring = this.formation.rings.find((r) => r.index === cmd.currentLayer);
        if (ring) {
          const currentAngle = Math.atan2(cmd.position.y, cmd.position.x) + ring.rotationSpeed;
          cmd.position.x = Math.cos(currentAngle) * ring.radius;
          cmd.position.y = Math.sin(currentAngle) * ring.radius;
        }
      } else {
        // Jayadratha stays at the outer breach gate during SUPPORT_BLOCKED
        if (this.formation.isJayadrathaSealed) {
          const outerRing = this.formation.rings[this.formation.rings.length - 1];
          if (outerRing) {
            const gate = outerRing.gates[0];
            const gateWorldAngle = normalizeAngle(gate.angle + outerRing.currentRotation);
            cmd.position.x = Math.cos(gateWorldAngle) * (outerRing.radius + 0.5);
            cmd.position.y = Math.sin(gateWorldAngle) * (outerRing.radius + 0.5);
          }
        }
      }
    }

    // 6. Record Metrics Snapshot
    const snapshot = this.metricsCollector.record(
      this.currentStep,
      this.agents,
      this.formation,
      this.commBus
    );

    snapshot.phase = this.phase;
    snapshot.mode = this.config.mode;
    snapshot.abhimanyuStatus = abhimanyu.status;
    snapshot.abhimanyuLayer = abhimanyu.currentLayer;
    snapshot.supportBlocked = this.formation.isJayadrathaSealed;
    snapshot.exitKnowledgePercent = abhimanyu.exitKnowledgePercent;

    return snapshot;
  }

  /**
   * Fires the next Mahabharata narrative event for a given phase
   */
  private fireNarrativeEvent(phase: string): void {
    const events = MAHABHARATA_EVENTS[phase as keyof typeof MAHABHARATA_EVENTS];
    if (!events) return;
    const idx = this.phaseNarrativeIndex[phase as SimulationPhase] || 0;
    if (idx < events.length) {
      const ev = events[idx];
      this.addEvent('STORY_PHASE', ev.title, ev.desc, 'info', 'agent-abhimanyu');
      this.phaseNarrativeIndex[phase as SimulationPhase] = idx + 1;
    }
  }

  private addEvent(
    category: SimulationEvent['category'],
    title: string,
    description: string,
    severity: SimulationEvent['severity'] = 'info',
    agentId?: string
  ): void {
    this.eventIdCounter++;
    this.events.unshift({
      id: `ev-${this.eventIdCounter}`,
      step: this.currentStep,
      timestamp: Date.now(),
      category,
      title,
      description,
      severity,
      agentId
    });

    if (this.events.length > 80) this.events.pop();
  }
}

function formationTarget(formation: ChakravyuhaFormation): { x: number; y: number } {
  return formation.targetPos;
}
