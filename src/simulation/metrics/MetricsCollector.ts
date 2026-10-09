import { AgentState, MetricsSnapshot, ScenarioConfig } from '../../types/simulation';
import { distance2D } from '../utils/math';

export class MetricsCollector {
  public history: MetricsSnapshot[] = [];
  private initialPositions: Map<string, { x: number; y: number }> = new Map();

  public registerInitialPositions(agents: AgentState[]): void {
    this.initialPositions.clear();
    for (const a of agents) {
      this.initialPositions.set(a.id, { ...a.position });
    }
  }

  public recordSnapshot(
    step: number,
    agents: AgentState[],
    totalMessagesTransmitted: number,
    totalMessagesDelivered: number,
    config: ScenarioConfig,
    phase: string = 'READY'
  ): MetricsSnapshot {
    const totalAgents = agents.length || 1;
    let completedCount = 0;
    let activeCount = 0;
    let trappedCount = 0;
    let eliminatedCount = 0;
    let totalCollisions = 0;
    let sumSteps = 0;
    let sumDistToTarget = 0;
    let sumEfficiency = 0;

    for (const agent of agents) {
      if (agent.status === 'COMPLETED') completedCount++;
      else if (agent.status === 'ACTIVE') activeCount++;
      else if (agent.status === 'TRAPPED') trappedCount++;
      else if (agent.status === 'ELIMINATED') eliminatedCount++;

      totalCollisions += agent.collisionCount;
      sumSteps += agent.stepsTaken;
      sumDistToTarget += agent.distanceToTarget;

      const initPos = this.initialPositions.get(agent.id) || { x: 0, y: 30 };
      const euclideanInit = Math.sqrt(initPos.x * initPos.x + initPos.y * initPos.y);
      const actualTraveled = Math.max(0.1, agent.distanceTraveled);
      const eff = Math.min(1.0, euclideanInit / actualTraveled);
      sumEfficiency += eff;
    }

    const successRate = completedCount / totalAgents;
    const avgSteps = sumSteps / totalAgents;
    const avgDistanceToTarget = sumDistToTarget / totalAgents;
    const movementEfficiency = sumEfficiency / totalAgents;

    // Group Dispersion / Cohesion
    let avgX = 0;
    let avgY = 0;
    for (const a of agents) {
      avgX += a.position.x;
      avgY += a.position.y;
    }
    avgX /= totalAgents;
    avgY /= totalAgents;

    let varianceSum = 0;
    for (const a of agents) {
      const dx = a.position.x - avgX;
      const dy = a.position.y - avgY;
      varianceSum += Math.sqrt(dx * dx + dy * dy);
    }
    const meanDispersion = varianceSum / totalAgents;
    const groupCohesion = Math.max(0, 1 - Math.min(1.0, meanDispersion / 25.0));

    // Collision avoidance score
    const collisionPenalty = Math.max(0, 1.0 - totalCollisions / (totalAgents * 8));

    // Communication effectiveness ratio
    const commEffectiveness = totalMessagesTransmitted > 0
      ? totalMessagesDelivered / totalMessagesTransmitted
      : (config.communicationLevel === 'NONE' ? 1.0 : 0.5);

    // FORMAL COORDINATION SCORE FORMULA (0 - 100)
    // Cs = 100 * (0.35 * SuccessRate + 0.25 * MovementEfficiency + 0.15 * CollisionPenalty + 0.15 * GroupCohesion + 0.10 * CommEffectiveness)
    const coordinationScore = Math.round(
      100 * (
        0.35 * successRate +
        0.25 * movementEfficiency +
        0.15 * collisionPenalty +
        0.15 * groupCohesion +
        0.10 * commEffectiveness
      )
    );

    const abhimanyu = agents.find((a) => a.heroType === 'ABHIMANYU' || a.index === 0);

    const snapshot: MetricsSnapshot = {
      step,
      phase: phase as any,
      mode: config.mode || 'HISTORICAL',
      abhimanyuStatus: abhimanyu?.status || 'ACTIVE',
      abhimanyuLayer: abhimanyu?.currentLayer || 0,
      supportBlocked: config.supportBlocked ?? true,
      exitKnowledgePercent: abhimanyu?.exitKnowledgePercent || 0,
      successRate,
      completionTime: step,
      avgSteps,
      movementEfficiency,
      totalCollisions,
      activeCount,
      completedCount,
      trappedCount,
      eliminatedCount,
      commOverhead: totalMessagesTransmitted,
      successfulComms: totalMessagesDelivered,
      coordinationScore,
      avgDistanceToTarget,
      groupCohesion,
      routeDeviation: Math.max(0, 1 - movementEfficiency),
      infoUtilization: Math.min(1.0, (completedCount * 1.5 + (totalAgents - trappedCount)) / (totalAgents * 2)),
      deadlockCount: trappedCount
    };

    this.history.push(snapshot);
    return snapshot;
  }

  public record(
    step: number,
    agents: AgentState[],
    formation: any,
    commBus: any
  ): MetricsSnapshot {
    const config: ScenarioConfig = {
      communicationLevel: 'NORMAL',
      mode: 'HISTORICAL',
      supportBlocked: formation?.isJayadrathaSealed ?? true
    } as any;
    return this.recordSnapshot(
      step,
      agents,
      commBus?.totalMessagesTransmitted || 0,
      commBus?.totalMessagesDelivered || 0,
      config
    );
  }

  public reset(): void {
    this.history = [];
    this.initialPositions.clear();
  }
}

