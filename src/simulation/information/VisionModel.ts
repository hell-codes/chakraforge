import { AgentState, InformationLevel, AgentPerception, Vector2D } from '../../types/simulation';
import { ChakravyuhaFormation } from '../formation/Chakravyuha';
import { distance2D, normalizeAngle, angleDiff } from '../utils/math';

export class VisionModel {
  /**
   * Compute the perception for a specific agent given the global formation state
   * and the scenario's InformationLevel constraint.
   */
  public static computePerception(
    agent: AgentState,
    allAgents: AgentState[],
    formation: ChakravyuhaFormation,
    infoLevel: InformationLevel,
    currentStep: number = 0
  ): AgentPerception {
    const worldGates = formation.getWorldGates();
    const targetPos = formation.targetPos;

    // Default vision parameters based on information model
    let visionRadius = agent.visionRadius;
    let hasGlobalTarget = false;
    let hasGlobalGates = false;
    let hasGlobalTeammates = false;

    switch (infoLevel) {
      case 'FULL':
        visionRadius = 9999; // Global omniscience
        hasGlobalTarget = true;
        hasGlobalGates = true;
        hasGlobalTeammates = true;
        break;
      case 'PARTIAL':
        visionRadius = agent.visionRadius || 12.0; // Moderate local radius
        hasGlobalTarget = true; // Knows target destination but not all dynamic wall states
        hasGlobalGates = false;
        hasGlobalTeammates = false;
        break;
      case 'LIMITED':
        visionRadius = 6.0; // Severe local fog of war (Abhimanyu isolated condition)
        hasGlobalTarget = false; // Uncertain / noisy target position
        hasGlobalGates = false;
        hasGlobalTeammates = false;
        break;
    }

    // 1. Visible Agents filtering
    const visibleAgents: AgentPerception['visibleAgents'] = [];
    for (const other of allAgents) {
      if (other.id === agent.id) continue;
      const d = distance2D(agent.position, other.position);
      if (hasGlobalTeammates || d <= visionRadius) {
        visibleAgents.push({
          id: other.id,
          position: { ...other.position },
          status: other.status,
          role: other.role,
          team: other.team
        });
      }
    }

    // 2. Visible Gates filtering
    const visibleGates: AgentPerception['visibleGates'] = [];
    for (const gate of worldGates) {
      const gatePos = { x: gate.x, y: gate.y };
      const d = distance2D(agent.position, gatePos);
      const gateAngle = Math.atan2(gate.y, gate.x);

      if (hasGlobalGates || d <= visionRadius) {
        visibleGates.push({
          ringIndex: gate.ringIndex,
          angle: gateAngle,
          isOpen: gate.isOpen,
          distance: d
        });

        // Update agent's internal memory
        const existingMem = agent.knownGates.find(
          (k) => k.ringIndex === gate.ringIndex && Math.abs(angleDiff(k.angle, gateAngle)) < 0.2
        );
        if (existingMem) {
          existingMem.isOpen = gate.isOpen;
          existingMem.lastObservedStep = currentStep;
          existingMem.confidence = 1.0;
        } else {
          agent.knownGates.push({
            ringIndex: gate.ringIndex,
            angle: gateAngle,
            isOpen: gate.isOpen,
            lastObservedStep: currentStep,
            confidence: 1.0
          });
        }
      }
    }

    // 3. Known Target
    let knownTarget: Vector2D | null = null;
    if (hasGlobalTarget) {
      knownTarget = { ...targetPos };
    } else if (infoLevel === 'LIMITED') {
      const distToTarget = distance2D(agent.position, targetPos);
      if (distToTarget <= visionRadius * 1.5) {
        knownTarget = { ...targetPos };
      }
    }

    // 4. In Blocked Zone check (Behind Jayadratha or in trapped zone)
    const isInBlockedZone = formation.isJayadrathaSealed && agent.currentLayer > 4;

    return {
      visibleAgents,
      visibleObstacles: [],
      visibleGates,
      knownTarget,
      isInBlockedZone
    };
  }

  /**
   * Alias for computePerception
   */
  public static filterPerception(
    agent: AgentState,
    allAgents: AgentState[],
    formation: ChakravyuhaFormation,
    infoLevel: InformationLevel,
    currentStep: number = 0
  ): AgentPerception {
    return this.computePerception(agent, allAgents, formation, infoLevel, currentStep);
  }
}
