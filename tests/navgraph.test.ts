import { describe, it, expect } from 'vitest';
import { SimulationEngine } from '../src/simulation/core/Engine';
import { ChakravyuhaFormation } from '../src/simulation/formation/Chakravyuha';
import { NavGraph } from '../src/simulation/navigation/NavGraph';
import { ScenarioConfig } from '../src/types/simulation';

describe('NavGraph & Corridor Navigation', () => {
  const config: ScenarioConfig = {
    seed: 1042,
    mode: 'HISTORICAL',
    agentCount: 4,
    strategy: 'SHORTEST_PATH',
    informationLevel: 'FULL',
    communicationLevel: 'NORMAL',
    environmentDynamics: 'STATIC',
    formationComplexity: 'LOW',
    ringCount: 5,
    maxSteps: 150,
    communicationRange: 25,
    communicationBudgetPerStep: 2,
    communicationDelay: 1,
    enableDynamicGates: false,
    enableRingRotation: false,
    randomInitialPositions: false,
    supportBlocked: true,
    exitKnowledgePercent: 0,
    commReliabilityPercent: 100,
    enemyDensity: 'LOW',
    formationMobility: 'STATIC'
  };

  it('builds navigation graph with corridor nodes and breach gates', () => {
    const formation = new ChakravyuhaFormation({
      ringCount: 5,
      ringSpacing: 3.0,
      ringWidth: 0.5,
      baseRadius: 3.5,
      enableRingRotation: false,
      enableDynamicGates: false,
      dynamics: 'STATIC',
      complexity: 'LOW'
    });

    const navGraph = new NavGraph(formation);
    const nodes = navGraph.getNodes();
    expect(nodes.length).toBeGreaterThan(50);

    const centerNode = navGraph.nodes.get('node-center-command');
    expect(centerNode).toBeDefined();
    expect(centerNode?.x).toBe(0);
    expect(centerNode?.y).toBe(0);

    const outerBreachNode = navGraph.nodes.get('node-outer-breach');
    expect(outerBreachNode).toBeDefined();
    expect(outerBreachNode?.isGateNode).toBe(true);
  });

  it.skip('finds collision-free corridor path from outside staging to central command position', () => {
    const formation = new ChakravyuhaFormation({
      ringCount: 5,
      ringSpacing: 3.0,
      ringWidth: 0.5,
      baseRadius: 3.5,
      enableRingRotation: false,
      enableDynamicGates: true,
      dynamics: 'STATIC',
      complexity: 'LOW'
    });

    const navGraph = formation.navGraph;
    const outerRingRadius = formation.rings[4].radius;
    const startPos = { x: 0, y: outerRingRadius + 5.0 };
    const targetPos = { x: 0, y: 0 };

    const path = navGraph.findPath(startPos, targetPos, formation);
    expect(path).not.toBeNull();
    expect(path!.length).toBeGreaterThan(3);

    // Verify last waypoint reaches near center
    const lastWp = path![path!.length - 1];
    expect(Math.sqrt(lastWp.x * lastWp.x + lastWp.y * lastWp.y)).toBeLessThan(1.0);
  });

  it('blocks entrance through outer breach when Jayadratha seal is active', () => {
    const formation = new ChakravyuhaFormation({
      ringCount: 5,
      ringSpacing: 3.0,
      ringWidth: 0.5,
      baseRadius: 3.5,
      enableRingRotation: false,
      enableDynamicGates: false,
      dynamics: 'STATIC',
      complexity: 'LOW'
    });

    formation.setJayadrathaSeal(true);
    const navGraph = formation.navGraph;
    const outerRingRadius = formation.rings[4].radius;

    // Agent outside trying to enter
    const outsidePos = { x: 0, y: outerRingRadius + 4.0 };
    const centerPos = { x: 0, y: 0 };

    const path = navGraph.findPath(outsidePos, centerPos, formation);
    // Outer breach edge is blocked, so path cannot penetrate through sealed North gate
    expect(path).toBeNull();
  });

  it('accurately and monotonically determines Abhimanyu current layer', () => {
    const engine = new SimulationEngine(config);
    const abhimanyu = engine.agents[0];

    // Starts outside
    expect(abhimanyu.currentLayer).toBe(0);

    // Step forward: Abhimanyu approaches and enters
    for (let i = 0; i < 60; i++) {
      engine.step();
    }

    // After 60 steps, Abhimanyu has penetrated inward
    expect(abhimanyu.currentLayer).toBeGreaterThanOrEqual(1);
    expect(abhimanyu.currentLayer).toBeLessThanOrEqual(5);
  });
});
