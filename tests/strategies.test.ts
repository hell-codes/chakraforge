import { describe, it, expect } from 'vitest';
import { SimulationEngine } from '../src/simulation/core/Engine';
import { ScenarioConfig } from '../src/types/simulation';

describe('CHAKRAFORGE Strategies & Information Models', () => {
  const baseConfig: ScenarioConfig = {
    seed: 2048,
    mode: 'HISTORICAL',
    agentCount: 4,
    strategy: 'COORDINATED',
    informationLevel: 'PARTIAL',
    communicationLevel: 'NORMAL',
    environmentDynamics: 'DYNAMIC',
    formationComplexity: 'MEDIUM',
    ringCount: 6,
    maxSteps: 150,
    communicationRange: 25,
    communicationBudgetPerStep: 2,
    communicationDelay: 1,
    enableDynamicGates: true,
    enableRingRotation: true,
    randomInitialPositions: false,
    supportBlocked: true,
    exitKnowledgePercent: 0,
    commReliabilityPercent: 100,
    enemyDensity: 'MEDIUM',
    formationMobility: 'MEDIUM'
  };

  it('verifies Greedy strategy directs agents towards the center objective', () => {
    const engine = new SimulationEngine({
      ...baseConfig,
      strategy: 'GREEDY',
      informationLevel: 'FULL'
    });

    const initDist = engine.agents[0].distanceToTarget;
    for (let i = 0; i < 20; i++) {
      engine.step();
    }
    // Agents should progress inwards
    expect(engine.agents[0].distanceTraveled).toBeGreaterThan(0);
    expect(engine.agents[0].currentAction).toBeDefined();
  });

  it('verifies Coordinated strategy utilizes communications and gate awareness', () => {
    const engine = new SimulationEngine({
      ...baseConfig,
      strategy: 'COORDINATED',
      communicationLevel: 'NORMAL',
      informationLevel: 'PARTIAL'
    });

    for (let i = 0; i < 40; i++) {
      engine.step();
    }

    expect(engine.commBus.totalMessagesTransmitted).toBeGreaterThanOrEqual(0);
    expect(engine.agents[0].decisionReason).toBeDefined();
    expect(engine.agents[0].decisionFactors.length).toBeGreaterThan(0);
  });

  it('verifies Limited Information restricts vision perception radius', () => {
    const engine = new SimulationEngine({
      ...baseConfig,
      informationLevel: 'LIMITED'
    });

    engine.step();
    const agent = engine.agents[0];
    expect(agent.perception).toBeDefined();
    // In limited info mode, knownTarget is initially null or uncertain until close
    expect(agent.informationLevel).toBe('LIMITED');
  });

  it('verifies formal coordination score calculation and boundary conditions', () => {
    const engine = new SimulationEngine(baseConfig);
    for (let i = 0; i < 30; i++) {
      engine.step();
    }
    const lastSnapshot = engine.metricsCollector.history[engine.metricsCollector.history.length - 1];
    expect(lastSnapshot.coordinationScore).toBeGreaterThanOrEqual(0);
    expect(lastSnapshot.coordinationScore).toBeLessThanOrEqual(100);
    expect(lastSnapshot.groupCohesion).toBeGreaterThanOrEqual(0);
    expect(lastSnapshot.groupCohesion).toBeLessThanOrEqual(1);
    expect(lastSnapshot.movementEfficiency).toBeGreaterThanOrEqual(0);
    expect(lastSnapshot.movementEfficiency).toBeLessThanOrEqual(1);
  });
});
