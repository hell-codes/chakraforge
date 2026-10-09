export type Vector2D = { x: number; y: number };
export type Vector3D = { x: number; y: number; z: number };

export type SimulationMode = 'HISTORICAL' | 'COUNTERFACTUAL';

export type SimulationPhase =
  | 'IDLE'
  | 'INITIALIZING'
  | 'FORMATION_FORMING'
  | 'READY'
  | 'APPROACHING'
  | 'ENTERING'
  | 'PENETRATING'
  | 'SUPPORT_APPROACHING'
  | 'SUPPORT_BLOCKED'
  | 'DEEP_PENETRATION'
  | 'ISOLATED'
  | 'SURROUNDED'
  | 'ESCAPE_ATTEMPT'
  | 'ESCAPE_SUCCESS'
  | 'ESCAPE_FAILURE'
  | 'HISTORICAL_END'
  | 'COMPLETE'
  | 'ERROR'
  | 'BREACHING'
  | 'SUPPORTED'
  | 'ESCAPING'
  | 'DEFEATED'
  | 'COUNTERFACTUAL_ANALYSIS';

export interface NavNode {
  id: string;
  x: number;
  y: number;
  ringIndex: number; // 0 = outside, 1 = central formation, 7 = outer vanguard
  angle: number; // in radians
  isGateNode?: boolean;
  gateId?: string;
}

export interface NavEdge {
  from: string;
  to: string;
  weight: number;
  isGateTransition?: boolean;
  gateId?: string;
  isBlocked?: boolean;
}

export type HeroType =
  // Pandava Heroes
  | 'ABHIMANYU'
  | 'BHIMA'
  | 'YUDHISHTHIRA'
  | 'SATYAKI'
  | 'DHRISHTADYUMNA'
  // Kaurava Commanders
  | 'DRONA'
  | 'JAYADRATHA'
  | 'KARNA'
  | 'KRIPA'
  | 'ASHWATTHAMAN'
  | 'DUHSHASANA';

export type AgentRole = 'PANDAVA_INFILTRATOR' | 'TACTICAL_LEADER' | 'RECON_SCOUT' | 'SUPPORT_UNIT' | 'KAURAVA_COMMANDER';
export type AgentStatus = 'ACTIVE' | 'TRAPPED' | 'COMPLETED' | 'ELIMINATED' | 'ISOLATED' | 'BLOCKED';

export type StrategyType =
  | 'RANDOM'
  | 'GREEDY'
  | 'SHORTEST_PATH'
  | 'INFORMATION_AWARE'
  | 'COMMUNICATION_AWARE'
  | 'COORDINATED'
  | 'ADAPTIVE';

export type InformationLevel = 'FULL' | 'PARTIAL' | 'LIMITED';
export type CommunicationLevel = 'NONE' | 'RESTRICTED' | 'NORMAL' | 'HIGH';
export type EnvironmentDynamics = 'STATIC' | 'SLOW' | 'DYNAMIC' | 'HIGHLY_DYNAMIC';
export type FormationComplexity = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Gate {
  id: string;
  ringIndex: number;
  angle: number; // in radians
  width: number; // in radians
  state: 'OPEN' | 'CLOSING' | 'CLOSED' | 'OPENING';
  transitionProgress: number; // 0 (closed) to 1 (fully open)
  period: number; // step period
  phaseOffset: number;
  isDynamic: boolean;
  isBreachGate?: boolean; // The fateful gate 4 / outer breach sealed by Jayadratha
}

export interface RingObstacle {
  id: string;
  ringIndex: number;
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  angularVelocity: number;
  currentAngleOffset: number;
}

export interface TacticalCohort {
  id: string;
  name: string;
  ringIndex: number;
  angle: number;
  warriorCount: number;
  unitType: 'INFANTRY' | 'CHARIOT_DIVISION' | 'CAVALRY' | 'ELEPHANTRY' | 'GATE_GUARD';
  commanderName?: string;
  color: string;
}

export interface ExitCandidatePath {
  id: string;
  targetGateId: string;
  gateRingIndex: number;
  gateAngle: number;
  waypoints: Vector2D[];
  distance: number;
  enemyThreatDensity: number; // 0 to 1
  gateState: 'OPEN' | 'CLOSING' | 'CLOSED';
  successProbability: number; // 0 to 100%
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedSteps: number;
}

export interface ChakravyuhaConfig {
  ringCount: number; // 2 to 8 (Droṇa Parva has 7 outer + central hub)
  baseRadius: number;
  ringWidth: number;
  ringSpacing: number;
  complexity: FormationComplexity;
  dynamics: EnvironmentDynamics;
  rotationSpeeds?: number[];
  gateCountPerRing?: number[];
  centralFormationRadius?: number;
  enableDynamicGates?: boolean;
  enableRingRotation?: boolean;
}

export interface AgentPerception {
  visibleAgents: { id: string; position: Vector2D; status: AgentStatus; role: AgentRole; team: 'PANDAVA' | 'KAURAVA' }[];
  visibleObstacles: { x: number; y: number; radius: number }[];
  visibleGates: { ringIndex: number; angle: number; isOpen: boolean; distance: number }[];
  knownTarget: Vector2D | null;
  isInBlockedZone: boolean;
}

export interface KnownGateMemory {
  ringIndex: number;
  angle: number;
  isOpen: boolean;
  lastObservedStep: number;
  confidence: number;
}

export interface AgentState {
  id: string;
  index: number;
  name: string;
  heroType?: HeroType;
  team: 'PANDAVA' | 'KAURAVA';
  role: AgentRole;
  strategy: StrategyType;
  position: Vector2D;
  velocity: Vector2D;
  heading: number; // radians
  speed: number;
  maxSpeed: number;
  status: AgentStatus;
  health?: number;
  stamina?: number;
  
  // Tactical State & Layer
  currentLayer: number; // 0 (outside) to 7 (central formation)
  supportStatus: 'SUPPORTED' | 'SUPPORT_BLOCKED' | 'ISOLATED';
  
  // Navigation & Memory
  pathHistory: Vector2D[];
  currentWaypoint: Vector2D | null;
  plannedPath: Vector2D[];
  targetLocation: Vector2D;
  
  // Epistemic State
  informationLevel: InformationLevel;
  exitKnowledgePercent: number; // 0% in Historical, up to 100% in Counterfactual
  visionRadius: number;
  visionFov: number; // Field of view in radians
  perception: AgentPerception;
  knownTarget: Vector2D | null;
  knownGates: KnownGateMemory[];
  
  // Counterfactual Exit Analysis
  counterfactualPaths: ExitCandidatePath[];
  bestPredictedExit: ExitCandidatePath | null;
  
  // Communication State
  communicationLevel: CommunicationLevel;
  isCommSevered: boolean;
  messagesSent: number;
  messagesReceived: number;
  commCooldown: number;
  recentMessages: string[];
  
  // Performance Diagnostics
  collisionCount: number;
  stepsTaken: number;
  distanceTraveled: number;
  distanceToTarget: number;
  stuckSteps: number;
  
  // Explainable AI Reasoning
  currentAction: string;
  decisionReason: string;
  decisionExplanation: string;
  decisionFactors: { factor: string; weight: number; impact: string }[];
}

export type CommMessageType = 
  | 'TARGET_DISCOVERED'
  | 'GATE_BLOCKED'
  | 'GATE_OPENED'
  | 'ROUTE_SUGGESTION'
  | 'CONGESTION_ALERT'
  | 'REGROUP_PING'
  | 'HELP_REQUEST'
  | 'JAYADRATHA_SEAL';

export interface CommPacket {
  id: string;
  step: number;
  senderId: string;
  receiverId: string | 'BROADCAST';
  type: CommMessageType;
  payload: any;
  senderPos: Vector2D;
  receiverPos: Vector2D;
  transmittedStep: number;
  deliverStep: number;
  status: 'IN_FLIGHT' | 'DELIVERED' | 'DROPPED';
}

export type EventCategory = 
  | 'MOVEMENT'
  | 'COMMUNICATION'
  | 'DISCOVERY'
  | 'GATE_CHANGE'
  | 'COLLISION'
  | 'FAILURE'
  | 'SUCCESS'
  | 'FORMATION'
  | 'STORY_PHASE';

export interface SimulationEvent {
  id: string;
  step: number;
  timestamp: number;
  category: EventCategory;
  agentId?: string;
  title: string;
  description: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export interface ScenarioConfig {
  seed: number;
  mode: SimulationMode; // 'HISTORICAL' | 'COUNTERFACTUAL'
  agentCount: number;
  strategy: StrategyType;
  informationLevel: InformationLevel;
  communicationLevel: CommunicationLevel;
  environmentDynamics: EnvironmentDynamics;
  formationComplexity: FormationComplexity;
  ringCount: number;
  maxSteps: number;
  communicationRange: number;
  communicationBudgetPerStep: number;
  communicationDelay: number;
  visionRadiusOverride?: number;
  enableDynamicGates: boolean;
  enableRingRotation: boolean;
  randomInitialPositions: boolean;
  
  // Counterfactual Variables
  supportBlocked: boolean; // true = Jayadratha halts Pandavas (Historical default); false = support maintained
  exitKnowledgePercent: number; // 0 = Historical (no exit known); 25, 50, 100% in counterfactual
  commReliabilityPercent: number; // 0 to 100%
  enemyDensity: 'LOW' | 'MEDIUM' | 'HIGH';
  formationMobility: 'STATIC' | 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface MetricsSnapshot {
  step: number;
  phase: SimulationPhase;
  mode: SimulationMode;
  successRate: number; // 0 to 1
  completionTime: number; // in steps or seconds
  avgSteps: number;
  movementEfficiency: number; // optimal_dist / actual_dist (0 to 1)
  totalCollisions: number;
  activeCount: number;
  completedCount: number;
  trappedCount: number;
  eliminatedCount: number;
  commOverhead: number; // total messages sent
  successfulComms: number;
  coordinationScore: number; // 0 to 100
  avgDistanceToTarget: number;
  groupCohesion: number; // normalized dispersion
  routeDeviation: number; // ratio of detour
  infoUtilization: number; // 0 to 1
  deadlockCount: number;
  
  // Scenario Diagnostics
  abhimanyuStatus: string;
  abhimanyuLayer: number;
  supportBlocked: boolean;
  exitKnowledgePercent: number;
}

export interface ExperimentTrialResult {
  trialIndex: number;
  seed: number;
  success: boolean;
  completionSteps: number;
  totalDistance: number;
  movementEfficiency: number;
  collisions: number;
  messagesSent: number;
  coordinationScore: number;
  trappedAgents: number;
  completedAgents: number;
  isolationSteps: number;
}

export interface ExperimentSummary {
  experimentId: string;
  title: string;
  variableName: string;
  variableValues: (string | number)[];
  config: ScenarioConfig;
  trialsCount: number;
  completedTrials: number;
  successRate: number;
  meanSteps: number;
  stdSteps: number;
  meanCollisions: number;
  stdCollisions: number;
  meanCoordinationScore: number;
  stdCoordinationScore: number;
  meanEfficiency: number;
  meanCommOverhead: number;
  meanIsolationSteps: number;
  results: ExperimentTrialResult[];
  timestamp: number;
}
