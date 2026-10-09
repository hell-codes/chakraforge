import {
  ScenarioConfig,
  ExperimentSummary,
  ExperimentTrialResult,
  StrategyType,
  InformationLevel,
  CommunicationLevel
} from '../../types/simulation';
import { SimulationEngine } from '../core/Engine';

export class ExperimentRunner {
  /**
   * Run a batch of Monte Carlo trials with identical configuration across sequential reproducible seeds.
   */
  public static async runBatch(
    baseConfig: ScenarioConfig,
    trialCount: number = 20,
    onProgress?: (completed: number, total: number) => void,
    title: string = 'Monte Carlo Batch Execution',
    variableName: string = 'Trials',
    variableValues: (string | number)[] = []
  ): Promise<ExperimentSummary> {
    const results: ExperimentTrialResult[] = [];
    const baseSeed = baseConfig.seed || 1000;

    for (let t = 0; t < trialCount; t++) {
      const trialSeed = baseSeed + t;
      if (t % 5 === 0) await new Promise(r => setTimeout(r, 0));
      const trialConfig: ScenarioConfig = {
        ...baseConfig,
        seed: trialSeed
      };

      const engine = new SimulationEngine(trialConfig);

      // Fast-forward simulation to physical completion or safe bound
      const maxSafetySteps = Math.max(trialConfig.maxSteps || 400, 400);
      while (!engine.isFinished && engine.currentStep < maxSafetySteps) {
        engine.step();
      }

      const finalSnapshot = engine.metricsCollector.history[engine.metricsCollector.history.length - 1];
      const completedAgents = engine.agents.filter((a) => a.status === 'COMPLETED').length;
      const trappedAgents = engine.agents.filter((a) => a.status === 'TRAPPED' || a.status === 'ISOLATED' || a.status === 'ELIMINATED').length;
      const totalDist = engine.agents.reduce((acc, a) => acc + a.distanceTraveled, 0);
      const abhimanyu = engine.agents[0];
      const isolationSteps = abhimanyu?.supportStatus === 'ISOLATED' ? Math.max(0, engine.currentStep - 35) : 0;

      const isTrialSuccess = trialConfig.mode === 'HISTORICAL'
        ? (engine.phase === 'HISTORICAL_END' || (abhimanyu && abhimanyu.currentLayer <= 1))
        : (engine.phase === 'ESCAPE_SUCCESS' || completedAgents > 0);

      results.push({
        trialIndex: t + 1,
        seed: trialSeed,
        success: isTrialSuccess,
        completionSteps: engine.currentStep,
        totalDistance: totalDist,
        movementEfficiency: finalSnapshot?.movementEfficiency || 0.45,
        collisions: finalSnapshot?.totalCollisions || 0,
        messagesSent: finalSnapshot?.commOverhead || 0,
        coordinationScore: finalSnapshot?.coordinationScore || 40,
        trappedAgents,
        completedAgents,
        isolationSteps
      });

      if (onProgress) {
        onProgress(t + 1, trialCount);
      }
    }

    // Statistical Aggregates
    const successCount = results.filter((r) => r.success).length;
    const successRate = successCount / trialCount;

    const meanSteps = results.reduce((acc, r) => acc + r.completionSteps, 0) / trialCount;
    const stdSteps = Math.sqrt(
      results.reduce((acc, r) => acc + Math.pow(r.completionSteps - meanSteps, 2), 0) / trialCount
    );

    const meanCollisions = results.reduce((acc, r) => acc + r.collisions, 0) / trialCount;
    const stdCollisions = Math.sqrt(
      results.reduce((acc, r) => acc + Math.pow(r.collisions - meanCollisions, 2), 0) / trialCount
    );

    const meanCoordinationScore = results.reduce((acc, r) => acc + r.coordinationScore, 0) / trialCount;
    const stdCoordinationScore = Math.sqrt(
      results.reduce((acc, r) => acc + Math.pow(r.coordinationScore - meanCoordinationScore, 2), 0) / trialCount
    );

    const meanEfficiency = results.reduce((acc, r) => acc + r.movementEfficiency, 0) / trialCount;
    const meanCommOverhead = results.reduce((acc, r) => acc + r.messagesSent, 0) / trialCount;
    const meanIsolationSteps = results.reduce((acc, r) => acc + r.isolationSteps, 0) / trialCount;

    return {
      experimentId: `exp-${Date.now()}-${baseConfig.strategy}-${baseConfig.mode}`,
      title,
      variableName,
      variableValues,
      config: baseConfig,
      trialsCount: trialCount,
      completedTrials: trialCount,
      successRate,
      meanSteps,
      stdSteps,
      meanCollisions,
      stdCollisions,
      meanCoordinationScore,
      stdCoordinationScore,
      meanEfficiency,
      meanCommOverhead,
      meanIsolationSteps,
      results,
      timestamp: Date.now()
    };
  }

  /**
   * Dedicated Experiment 1: Impact of Communication Reliability on Coordinated Penetration
   */
  public static async runCommunicationExperiment(
    baseConfig: ScenarioConfig,
    trialsPerValue: number = 10,
    onProgress?: (percent: number) => void
  ): Promise<ExperimentSummary[]> {
    const commValues = [0, 25, 50, 75, 100];
    const summaries: ExperimentSummary[] = [];

    for (let idx = 0; idx < commValues.length; idx++) {
      const commVal = commValues[idx];
      const config: ScenarioConfig = {
        ...baseConfig,
        strategy: 'COMMUNICATION_AWARE',
        commReliabilityPercent: commVal,
        communicationLevel: commVal === 0 ? 'NONE' : commVal <= 25 ? 'RESTRICTED' : commVal <= 75 ? 'NORMAL' : 'HIGH'
      };

      const summary = await this.runBatch(
        config,
        trialsPerValue,
        undefined,
        `Communication Reliability: ${commVal}%`,
        'Comm Reliability (%)',
        [commVal]
      );
      summaries.push(summary);

      if (onProgress) {
        onProgress(Math.round(((idx + 1) / commValues.length) * 100));
      }
    }

    return summaries;
  }

  /**
   * Dedicated Experiment 2: Counterfactual Exit Knowledge Analysis
   */
  public static async runExitKnowledgeExperiment(
    baseConfig: ScenarioConfig,
    trialsPerValue: number = 10,
    onProgress?: (percent: number) => void
  ): Promise<ExperimentSummary[]> {
    const exitValues = [0, 25, 50, 100];
    const summaries: ExperimentSummary[] = [];

    for (let idx = 0; idx < exitValues.length; idx++) {
      const exitVal = exitValues[idx];
      const config: ScenarioConfig = {
        ...baseConfig,
        mode: 'COUNTERFACTUAL',
        exitKnowledgePercent: exitVal,
        strategy: 'ADAPTIVE'
      };

      const summary = await this.runBatch(
        config,
        trialsPerValue,
        undefined,
        `Counterfactual Exit Knowledge: ${exitVal}%`,
        'Exit Knowledge (%)',
        [exitVal]
      );
      summaries.push(summary);

      if (onProgress) {
        onProgress(Math.round(((idx + 1) / exitValues.length) * 100));
      }
    }

    return summaries;
  }

  /**
   * Dedicated Experiment 3: "What if Support was NOT blocked by Jayadratha?"
   */
  public static async runSupportBlockedExperiment(
    baseConfig: ScenarioConfig,
    trialsPerValue: number = 15,
    onProgress?: (percent: number) => void
  ): Promise<ExperimentSummary[]> {
    const conditions = [
      { blocked: true, label: 'Historical: Jayadratha Blocks Support' },
      { blocked: false, label: 'Counterfactual: Support Maintained' }
    ];
    const summaries: ExperimentSummary[] = [];

    for (let idx = 0; idx < conditions.length; idx++) {
      const cond = conditions[idx];
      const config: ScenarioConfig = {
        ...baseConfig,
        mode: cond.blocked ? 'HISTORICAL' : 'COUNTERFACTUAL',
        supportBlocked: cond.blocked,
        strategy: 'COORDINATED'
      };

      const summary = await this.runBatch(
        config,
        trialsPerValue,
        undefined,
        cond.label,
        'Support Condition',
        [cond.label]
      );
      summaries.push(summary);

      if (onProgress) {
        onProgress(Math.round(((idx + 1) / conditions.length) * 100));
      }
    }

    return summaries;
  }

  /**
   * Dedicated Experiment 3: Strategy Comparison
   */
  public static async runStrategyComparisonExperiment(
    baseConfig: ScenarioConfig,
    trialsPerValue: number = 10,
    onProgress?: (percent: number) => void
  ): Promise<ExperimentSummary[]> {
    const strategies: StrategyType[] = ['RANDOM', 'GREEDY', 'SHORTEST_PATH', 'COORDINATED'];
    const summaries: ExperimentSummary[] = [];

    for (let idx = 0; idx < strategies.length; idx++) {
      const strat = strategies[idx];
      const config: ScenarioConfig = {
        ...baseConfig,
        mode: 'COUNTERFACTUAL',
        strategy: strat
      };

      const summary = await this.runBatch(
        config,
        trialsPerValue,
        undefined,
        `Strategy: ${strat}`,
        'Strategy',
        [strat]
      );
      summaries.push(summary);

      if (onProgress) {
        onProgress(Math.round(((idx + 1) / strategies.length) * 100));
      }
    }

    return summaries;
  }

  /**
   * Run Full 48-Cell Factorial Design Matrix Benchmark
   */
  public static async runFullMatrix(
    baseConfig: ScenarioConfig,
    trialsPerCell: number = 5,
    onProgress?: (percent: number) => void
  ): Promise<ExperimentSummary[]> {
    const strategies: StrategyType[] = ['RANDOM', 'GREEDY', 'SHORTEST_PATH', 'COORDINATED'];
    const infos: InformationLevel[] = ['FULL', 'PARTIAL', 'LIMITED'];
    const comms: CommunicationLevel[] = ['NONE', 'RESTRICTED', 'NORMAL', 'HIGH'];

    const totalCells = strategies.length * infos.length * comms.length; // 48
    let completedCells = 0;
    const summaries: ExperimentSummary[] = [];

    for (const strat of strategies) {
      for (const info of infos) {
        for (const comm of comms) {
          const config: ScenarioConfig = {
            ...baseConfig,
            strategy: strat,
            informationLevel: info,
            communicationLevel: comm
          };

          const summary = await this.runBatch(config, trialsPerCell);
          summaries.push(summary);
          completedCells++;

          if (onProgress) {
            onProgress(Math.round((completedCells / totalCells) * 100));
          }
        }
      }
    }

    return summaries;
  }
}
