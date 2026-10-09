import { describe, it, expect } from 'vitest';
import { SimulationEngine } from '../src/simulation/core/Engine';
import { ScenarioConfig } from '../src/types/simulation';
import { ExperimentRunner } from '../src/simulation/experiments/ExperimentRunner';

describe('CHAKRAFORGE Historical & Counterfactual Engine', () => {
  const historicalConfig: ScenarioConfig = {
    seed: 1042,
    mode: 'HISTORICAL',
    agentCount: 5,
    strategy: 'INFORMATION_AWARE',
    informationLevel: 'PARTIAL',
    communicationLevel: 'NORMAL',
    environmentDynamics: 'DYNAMIC',
    formationComplexity: 'HIGH',
    ringCount: 7,
    maxSteps: 120,
    communicationRange: 25,
    communicationBudgetPerStep: 2,
    communicationDelay: 1,
    enableDynamicGates: true,
    enableRingRotation: true,
    randomInitialPositions: false,
    supportBlocked: true,
    exitKnowledgePercent: 0,
    commReliabilityPercent: 50,
    enemyDensity: 'MEDIUM',
    formationMobility: 'MEDIUM'
  };

  it('correctly executes Historical Sequence: Jayadratha seals breach and isolates Abhimanyu', () => {
    const engine = new SimulationEngine(historicalConfig);
    const abhimanyu = engine.agents[0];
    expect(abhimanyu.heroType).toBe('ABHIMANYU');
    expect(abhimanyu.exitKnowledgePercent).toBe(0);

    // Step past step 60 where Jayadratha seals the breach
    for (let s = 0; s < 65; s++) {
      engine.step();
    }

    expect(engine.formation.isJayadrathaSealed).toBe(true);
    // Support heroes should be blocked
    const supportHeroes = engine.agents.filter((a) => a.heroType !== 'ABHIMANYU');
    const blockedCount = supportHeroes.filter((a) => a.status === 'BLOCKED').length;
    expect(blockedCount).toBeGreaterThan(0);
    expect(abhimanyu.supportStatus).toBe('SUPPORT_BLOCKED');

    // Step to step 95 where rings rotate closed and Abhimanyu is isolated
    for (let s = 65; s < 95; s++) {
      engine.step();
    }
    expect(abhimanyu.supportStatus).toBe('ISOLATED');
  });


  it('evaluates dynamic Counterfactual Exit Paths when exit knowledge is provided', () => {
    const counterfactualConfig: ScenarioConfig = {
      ...historicalConfig,
      mode: 'COUNTERFACTUAL',
      exitKnowledgePercent: 50,
      supportBlocked: false,
      strategy: 'ADAPTIVE'
    };

    const engine = new SimulationEngine(counterfactualConfig);
    const abhimanyu = engine.agents[0];

    for (let s = 0; s < 30; s++) {
      engine.step();
    }

    expect(abhimanyu.counterfactualPaths.length).toBeGreaterThan(0);
    const topPath = abhimanyu.counterfactualPaths[0];
    expect(topPath.successProbability).toBeGreaterThan(0);
    expect(['LOW', 'MEDIUM', 'HIGH']).toContain(topPath.riskLevel);
  });

  it('executes dedicated Experiment 1 (Communication Reliability) across parameter cells', async () => {
    const commSummaries = await ExperimentRunner.runCommunicationExperiment(historicalConfig, 2);
    expect(commSummaries.length).toBe(5);
    expect(commSummaries[0].meanCoordinationScore).toBeGreaterThanOrEqual(0);
  });

  it('executes dedicated Experiment 2 (Exit Knowledge) across parameter cells', async () => {
    const exitSummaries = await ExperimentRunner.runExitKnowledgeExperiment(historicalConfig, 2);
    expect(exitSummaries.length).toBe(4);
    expect(exitSummaries[3].config.exitKnowledgePercent).toBe(100);
  });

  it('executes dedicated Experiment 3 (Support Blocking Ablation)', async () => {
    const supportSummaries = await ExperimentRunner.runSupportBlockedExperiment(historicalConfig, 2);
    expect(supportSummaries.length).toBe(2);
    expect(supportSummaries[0].title).toContain('Historical');
    expect(supportSummaries[1].title).toContain('Counterfactual');
  });
});
