import { describe, it, expect } from 'vitest';
import { SimulationEngine } from '../src/simulation/core/Engine';
import { ScenarioConfig } from '../src/types/simulation';
import { ExperimentRunner } from '../src/simulation/experiments/ExperimentRunner';

describe('CHAKRAFORGE Simulation Engine', () => {
  const baseConfig: ScenarioConfig = {
    seed: 1042,
    mode: 'HISTORICAL',
    agentCount: 4,
    strategy: 'COORDINATED',
    informationLevel: 'PARTIAL',
    communicationLevel: 'NORMAL',
    environmentDynamics: 'DYNAMIC',
    formationComplexity: 'MEDIUM',
    ringCount: 5,
    maxSteps: 120,
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

  it('initializes deterministic agents and concentric formation rings', () => {
    const engine = new SimulationEngine(baseConfig);
    expect(engine.agents.length).toBe(4);
    expect(engine.formation.rings.length).toBe(5);
    expect(engine.currentStep).toBe(0);
    expect(engine.isFinished).toBe(false);
  });

  it('produces identical deterministic execution given the same seed', () => {
    const engine1 = new SimulationEngine({ ...baseConfig, seed: 777 });
    const engine2 = new SimulationEngine({ ...baseConfig, seed: 777 });

    for (let i = 0; i < 30; i++) {
      engine1.step();
      engine2.step();
    }

    expect(engine1.currentStep).toBe(engine2.currentStep);
    expect(engine1.agents[0].position.x).toBeCloseTo(engine2.agents[0].position.x, 5);
    expect(engine1.agents[0].position.y).toBeCloseTo(engine2.agents[0].position.y, 5);
  });

  it('enforces communication restrictions when set to NONE', () => {
    const engine = new SimulationEngine({ ...baseConfig, communicationLevel: 'NONE' });
    for (let i = 0; i < 20; i++) {
      engine.step();
    }
    expect(engine.commBus.totalMessagesTransmitted).toBe(0);
    expect(engine.commBus.totalMessagesDelivered).toBe(0);
  });

  it('runs Monte-Carlo batch trials and generates valid metrics', () => {
    const batchSummary = ExperimentRunner.runBatch(baseConfig, 5);
    expect(batchSummary.completedTrials).toBe(5);
    expect(batchSummary.meanCoordinationScore).toBeGreaterThanOrEqual(0);
    expect(batchSummary.meanCoordinationScore).toBeLessThanOrEqual(100);
    expect(batchSummary.results.length).toBe(5);
  });
});
