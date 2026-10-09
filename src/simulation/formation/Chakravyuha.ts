import { ChakravyuhaConfig, Gate, Vector2D, TacticalCohort, EnvironmentDynamics, FormationComplexity } from '../../types/simulation';
import { normalizeAngle, PRNG } from '../utils/math';
import { NavGraph } from '../navigation/NavGraph';

export interface RingWallSegment {
  ringIndex: number;
  radius: number;
  thickness: number;
  startAngle: number;
  endAngle: number;
}

export class ChakravyuhaFormation {
  public config: ChakravyuhaConfig;
  public rings: {
    index: number;
    radius: number;
    thickness: number;
    currentRotation: number;
    rotationSpeed: number;
    gates: Gate[];
    // Whether this ring's rotation is currently locked (approach phase)
    rotationLocked: boolean;
  }[] = [];
  public cohorts: TacticalCohort[] = [];
  public targetPos: Vector2D = { x: 0, y: 0 };
  public entryPos: Vector2D;
  public navGraph!: NavGraph;

  private prng: PRNG;
  public isJayadrathaSealed: boolean = false;
  // Step at which ring rotation was unlocked (outer rings start locked for Abhimanyu approach)
  private rotationUnlockStep: number = 60;

  constructor(config: ChakravyuhaConfig, seed: number = 1000) {
    this.config = config;
    this.prng = new PRNG(seed);
    this.entryPos = { x: 0, y: (config.ringCount * config.ringSpacing) + 5 };
    this.buildFormation();
  }

  public buildFormation(): void {
    this.rings = [];
    this.cohorts = [];
    this.isJayadrathaSealed = false;
    const { ringCount, ringSpacing, baseRadius, dynamics, complexity } = this.config;

    // Slower rotation speed for more dramatic, navigable formation
    const speedMultiplier = 
      dynamics === 'STATIC' ? 0 :
      dynamics === 'SLOW' ? 0.002 :
      dynamics === 'DYNAMIC' ? 0.004 : 0.008;

    for (let i = 1; i <= ringCount; i++) {
      const radius = baseRadius + i * ringSpacing;
      const thickness = this.config.ringWidth;
      
      // Synchronized rotation speed: all rings rotate at the EXACT SAME speed 
      // so the spiral labyrinth geometry does not tear itself apart.
      const rotationSpeed = speedMultiplier * 0.4;

      // Gates setup — more gates = more complexity but also more opportunities
      // Outermost ring ALWAYS has 4 cardinal gates (North breach, South exit, East flank, West flank)
      let numGates = 1;
      if (i === ringCount) {
        numGates = 4;
      } else if (complexity === 'LOW') {
        numGates = i <= 2 ? 1 : 2;
      } else if (complexity === 'MEDIUM') {
        numGates = i <= 3 ? 1 : 2;
      } else {
        numGates = i >= ringCount - 2 ? 2 : (i % 2 === 0) ? 2 : 1;
      }

      const gates: Gate[] = [];
      // WIDER gates for better passability
      const baseGateWidth = (complexity === 'HIGH' ? 0.55 : complexity === 'MEDIUM' ? 0.65 : 0.8);

      for (let g = 0; g < numGates; g++) {
        // Outermost ring: North gate (PI/2), South gate (-PI/2), East gate (0), West gate (PI)
        // Abhimanyu enters at North (PI/2) and in What-If breaks out through alternate flank gates (South/East/West)
        let primaryAngle: number;
        if (i === ringCount) {
          const cardinalAngles = [Math.PI / 2, -Math.PI / 2, 0, Math.PI];
          primaryAngle = cardinalAngles[g % cardinalAngles.length];
        } else if (g === 0) {
          // Inner rings spiral inward: each ring's gate is offset from outer by -0.55 radians
          primaryAngle = normalizeAngle(Math.PI / 2 - (ringCount - i) * 0.55);
        } else {
          // Additional gates spaced on opposite arcs
          const primary = normalizeAngle(Math.PI / 2 - (ringCount - i) * 0.55);
          primaryAngle = normalizeAngle(primary + Math.PI + (g - 1) * 0.45);
        }

        const angleOffset = primaryAngle;
        const period = this.prng.rangeInt(80, 160);
        const phaseOffset = this.prng.range(0, 2 * Math.PI);
        // Only odd inner rings pulse (not outer approach ring)
        const isDynamic = dynamics !== 'STATIC' && i < ringCount - 1 && (i % 2 === 1 || complexity === 'HIGH');

        // Mark the primary outer breach at North (g===0) and inner formation entrance
        const isBreachGate = (i === ringCount && g === 0) || (i === Math.ceil(ringCount / 2) && g === 0);

        gates.push({
          id: `gate-r${i}-g${g}`,
          ringIndex: i,
          angle: normalizeAngle(angleOffset),
          width: baseGateWidth,
          state: 'OPEN',
          transitionProgress: 1.0,
          period,
          phaseOffset,
          isDynamic,
          isBreachGate
        });
      }

      this.rings.push({
        index: i,
        radius,
        thickness,
        currentRotation: 0,
        rotationSpeed,
        gates,
        // Lock outer 2 rings initially so Abhimanyu can approach unimpeded
        rotationLocked: i >= ringCount - 1
      });

      // Spawn tactical cohorts (unit clusters) along the ring
      this.generateCohortsForRing(i, radius);
    }

    // Initialize or rebuild navigation graph with new geometry
    this.navGraph = new NavGraph(this);
  }

  /**
   * Called by the engine at step 60 to unlock outer ring rotation (Jayadratha's seal moment).
   * This simulates Dronacharya ordering the outer rings to close behind Abhimanyu.
   */
  public unlockOuterRings(currentStep: number): void {
    this.rotationUnlockStep = currentStep;
    for (const ring of this.rings) {
      ring.rotationLocked = false;
    }
  }

  private generateCohortsForRing(ringIndex: number, radius: number): void {
    const cohortCount = ringIndex <= 2 ? 4 : ringIndex <= 5 ? 6 : 8;
    const baseCount = ringIndex === 1 ? 500 : ringIndex === 4 ? 800 : 1200;

    const unitTypes: TacticalCohort['unitType'][] = [
      'INFANTRY',
      'CHARIOT_DIVISION',
      'CAVALRY',
      'ELEPHANTRY',
      'GATE_GUARD'
    ];

    for (let c = 0; c < cohortCount; c++) {
      const angle = (c / cohortCount) * 2 * Math.PI;
      const unitType =
        ringIndex === 1 ? 'ELEPHANTRY' :
        ringIndex === 4 ? 'GATE_GUARD' :
        ringIndex % 2 === 0 ? 'CHARIOT_DIVISION' : 'INFANTRY';

      this.cohorts.push({
        id: `cohort-r${ringIndex}-c${c}`,
        name: `Ring ${ringIndex} ${unitType.replace('_', ' ')} Battalion`,
        ringIndex,
        angle,
        warriorCount: Math.round(baseCount / cohortCount),
        unitType,
        color: ringIndex % 2 === 0 ? '#b8860b' : '#8b4513'
      });
    }
  }

  public setJayadrathaSeal(seal: boolean): void {
    this.isJayadrathaSealed = seal;
    for (const ring of this.rings) {
      for (const gate of ring.gates) {
        if (gate.isBreachGate) {
          gate.state = seal ? 'CLOSED' : 'OPEN';
          gate.transitionProgress = seal ? 0.0 : 1.0;
        }
      }
    }
    if (this.navGraph) {
      this.navGraph.updateDynamicGateStates(this);
    }
  }

  public update(step: number): { gateChanges: { gateId: string; state: 'OPEN' | 'CLOSED'; ringIndex: number }[] } {
    const gateChanges: { gateId: string; state: 'OPEN' | 'CLOSED'; ringIndex: number }[] = [];

    for (const ring of this.rings) {
      // Respect rotation lock for outer rings during Abhimanyu's approach
      if (this.config.enableRingRotation && !ring.rotationLocked) {
        ring.currentRotation = normalizeAngle(ring.currentRotation + ring.rotationSpeed);
      }

      if (this.config.enableDynamicGates) {
        for (const gate of ring.gates) {
          // If Jayadratha has sealed the breach gate, keep it locked
          if (this.isJayadrathaSealed && gate.isBreachGate) {
            gate.state = 'CLOSED';
            gate.transitionProgress = 0.0;
            continue;
          }

          if (!gate.isDynamic) continue;

          const cycle = Math.sin((step / gate.period) * 2 * Math.PI + gate.phaseOffset);
          const previousState = gate.state;

          if (cycle > 0.15) {
            gate.state = 'OPEN';
            gate.transitionProgress = Math.min(1.0, gate.transitionProgress + 0.06);
          } else if (cycle < -0.15) {
            gate.state = 'CLOSED';
            gate.transitionProgress = Math.max(0.0, gate.transitionProgress - 0.06);
          } else {
            gate.state = cycle >= 0 ? 'OPENING' : 'CLOSING';
          }

          if ((previousState === 'OPEN' || previousState === 'OPENING') && gate.state === 'CLOSED') {
            gateChanges.push({ gateId: gate.id, state: 'CLOSED', ringIndex: ring.index });
          } else if ((previousState === 'CLOSED' || previousState === 'CLOSING') && gate.state === 'OPEN') {
            gateChanges.push({ gateId: gate.id, state: 'OPEN', ringIndex: ring.index });
          }
        }
      }
    }

    if (this.navGraph) {
      this.navGraph.updateDynamicGateStates(this);
    }

    return { gateChanges };
  }

  public checkCollision(
    from: Vector2D,
    to: Vector2D
  ): { collided: boolean; resolvedPos: Vector2D; collidedRing: number | null } {
    const rFrom = Math.sqrt(from.x * from.x + from.y * from.y);
    const rTo = Math.sqrt(to.x * to.x + to.y * to.y);

    for (const ring of this.rings) {
      const halfThick = ring.thickness / 2 + 0.12;
      const innerBound = ring.radius - halfThick;
      const outerBound = ring.radius + halfThick;

      const crosses = (rFrom < innerBound && rTo >= innerBound) ||
                      (rFrom > outerBound && rTo <= outerBound) ||
                      (rTo >= innerBound && rTo <= outerBound);

      if (crosses) {
        // Account for ring's current rotation when checking gate alignment
        const testAngle = normalizeAngle(Math.atan2(to.y, to.x) - ring.currentRotation);
        let inGateAperture = false;

        for (const gate of ring.gates) {
          // Even partially-open gates (30%+) allow passage
          if (gate.transitionProgress < 0.25) continue;

          const effectiveWidth = gate.width * gate.transitionProgress;
          let diff = normalizeAngle(testAngle - gate.angle);
          if (diff > Math.PI) diff -= 2 * Math.PI;
          if (diff < -Math.PI) diff += 2 * Math.PI;

          if (Math.abs(diff) <= effectiveWidth / 2) {
            inGateAperture = true;
            break;
          }
        }

        if (!inGateAperture) {
          const normal = rTo > 0 ? { x: to.x / rTo, y: to.y / rTo } : { x: 0, y: 1 };
          const resolvedRadius = rFrom > ring.radius ? outerBound + 0.05 : innerBound - 0.05;
          const resolvedPos = { x: normal.x * resolvedRadius, y: normal.y * resolvedRadius };
          return { collided: true, resolvedPos, collidedRing: ring.index };
        }
      }
    }

    return { collided: false, resolvedPos: to, collidedRing: null };
  }

  public getRingCurrentGates(ringIndex: number): { angle: number; isOpen: boolean; width: number; id: string }[] {
    const ring = this.rings.find((r) => r.index === ringIndex);
    if (!ring) return [];

    return ring.gates.map((g) => {
      const globalAngle = normalizeAngle(g.angle + ring.currentRotation);
      return {
        id: g.id,
        angle: globalAngle,
        isOpen: g.state === 'OPEN' && g.transitionProgress >= 0.5,
        width: g.width * g.transitionProgress
      };
    });
  }

  public getWorldGates(): { id: string; ringIndex: number; x: number; y: number; isOpen: boolean; width: number; isBreachGate?: boolean }[] {
    const result: { id: string; ringIndex: number; x: number; y: number; isOpen: boolean; width: number; isBreachGate?: boolean }[] = [];
    for (const ring of this.rings) {
      for (const gate of ring.gates) {
        const globalAngle = normalizeAngle(gate.angle + ring.currentRotation);
        
        let normAngle = globalAngle;
        if (normAngle < 0) normAngle += Math.PI * 2;
        const spiralOffset = (normAngle / (Math.PI * 2)) * 3.2;
        const r = ring.radius - spiralOffset;
        
        result.push({
          id: gate.id,
          ringIndex: ring.index,
          x: Math.cos(globalAngle) * r,
          y: Math.sin(globalAngle) * r,
          isOpen: gate.state === 'OPEN' && gate.transitionProgress >= 0.4,
          width: gate.width * gate.transitionProgress,
          isBreachGate: gate.isBreachGate
        });
      }
    }
    return result;
  }
}
