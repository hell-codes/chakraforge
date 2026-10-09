import React, { useState, useMemo } from 'react';
import { ScenarioConfig, AgentState, StrategyType } from './types/simulation';
import { SimulationEngine } from './simulation/core/Engine';
import { Header, ActiveTab } from './components/layout/Header';
import { StoryLandingPage } from './components/intro/StoryLandingPage';
import { SimulationWorkspace } from './components/simulator/SimulationWorkspace';
import { ExperimentLab } from './components/experiments/ExperimentLab';
import { FormationGuide } from './components/research/FormationGuide';
import { AgentMechanicsPage } from './components/research/AgentMechanicsPage';
import { MethodologyPage } from './components/research/MethodologyPage';
import { RealWorldApplications } from './components/research/RealWorldApplications';
import { MahabharataContext } from './components/research/MahabharataContext';
import { AboutPage } from './components/about/AboutPage';
import { CameraMode } from './three/camera/CameraController';
import './styles/main.css';

const DEFAULT_CONFIG: ScenarioConfig = {
  seed: 1042,
  mode: 'HISTORICAL',
  agentCount: 5,
  strategy: 'INFORMATION_AWARE',
  informationLevel: 'PARTIAL',
  communicationLevel: 'NORMAL',
  environmentDynamics: 'DYNAMIC',
  formationComplexity: 'HIGH',
  ringCount: 7,
  maxSteps: 350,
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


export const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('OVERVIEW');
  const [config, setConfig] = useState<ScenarioConfig>(DEFAULT_CONFIG);
  const [engineKey, setEngineKey] = useState<number>(0);

  // 3D Scene Controls & Overlays
  const [cameraMode, setCameraMode] = useState<CameraMode>('ORBIT');
  const [selectedAgent, setSelectedAgent] = useState<AgentState | null>(null);
  const [showPaths, setShowPaths] = useState(true);
  const [showVision, setShowVision] = useState(true);
  const [showComm, setShowComm] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showDynamics, setShowDynamics] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Master Simulation Engine instance
  const engine = useMemo(() => {
    return new SimulationEngine(config);
  }, [config, engineKey]);

  const handleDeployScenario = () => {
    setEngineKey((prev) => prev + 1);
  };

  const handleEnterWithRings = (rings: number) => {
    setConfig({
      ...config,
      ringCount: Math.min(8, Math.max(2, rings))
    });
    setIsRunning(false);
    setEngineKey((prev) => prev + 1);
    setActiveTab('SIMULATOR');
  };

  const handleEnterWithStrategy = (strategy: StrategyType) => {
    setConfig({
      ...config,
      strategy
    });
    setIsRunning(false);
    setEngineKey((prev) => prev + 1);
    setActiveTab('SIMULATOR');
  };

  const handleLaunchInSimulator = (simConfig: ScenarioConfig) => {
    setConfig({ ...simConfig });
    setIsRunning(true);
    setEngineKey((prev) => prev + 1);
    setActiveTab('SIMULATOR');
  };

  return (
    <div className="w-screen h-screen relative bg-[#0c0907] text-[#f5f1eb] overflow-hidden select-none flex flex-col">
      {/* 1. TOP GLOBAL HEADER (Streamlined without simulation telemetry) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mode={config.mode}
        onToggleMode={() => {
          const nextMode = config.mode === 'HISTORICAL' ? 'COUNTERFACTUAL' : 'HISTORICAL';
          setIsRunning(false);
          setConfig({
            ...config,
            mode: nextMode,
            supportBlocked: nextMode === 'HISTORICAL',
            exitKnowledgePercent: nextMode === 'HISTORICAL' ? 0 : 75
          });
          setEngineKey((prev) => prev + 1);
        }}
      />

      {/* 2. DEDICATED MAIN CONTENT ROUTING REGION */}
      <main className={`flex-1 w-full h-[calc(100vh-61px)] relative ${activeTab === 'SIMULATOR' ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'}`}>
        {/* VIEW 1: STORYTELLING HOME / OVERVIEW (No Live 3D Simulation Overlap) */}
        {activeTab === 'OVERVIEW' && (
          <StoryLandingPage
            onEnterSimulator={() => setActiveTab('SIMULATOR')}
            onExploreMethodology={() => setActiveTab('METHODOLOGY')}
            onExploreSources={() => setActiveTab('MAHABHARATA')}
            onExploreRealWorld={() => setActiveTab('REAL_WORLD')}
          />
        )}

        {/* VIEW 2: DEDICATED 3D SIMULATOR WORKSPACE (Canvas occupies 100% of workspace) */}
        {activeTab === 'SIMULATOR' && (
          <SimulationWorkspace
            key={engineKey}
            engine={engine}
            config={config}
            onChangeConfig={setConfig}
            onDeployScenario={handleDeployScenario}
            cameraMode={cameraMode}
            setCameraMode={setCameraMode}
            selectedAgent={selectedAgent}
            setSelectedAgent={setSelectedAgent}
            showPaths={showPaths}
            setShowPaths={setShowPaths}
            showVision={showVision}
            setShowVision={setShowVision}
            showComm={showComm}
            setShowComm={setShowComm}
            showHeatmap={showHeatmap}
            setShowHeatmap={setShowHeatmap}
            showDynamics={showDynamics}
            setShowDynamics={setShowDynamics}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            speed={speed}
            setSpeed={setSpeed}
          />
        )}

        {/* VIEW 3: GUIDED 7-STEP EXPERIMENTS STUDIO */}
        {activeTab === 'EXPERIMENTS' && (
          <ExperimentLab currentConfig={config} onLaunchInSimulator={handleLaunchInSimulator} />
        )}

        {/* VIEW 4: FORMATION & 7 TIERS ARCHITECTURE */}
        {activeTab === 'FORMATION_GUIDE' && (
          <FormationGuide onEnterSimulatorWithRings={handleEnterWithRings} />
        )}

        {/* VIEW 5: AGENT AI & COGNITIVE ARCHITECTURE */}
        {activeTab === 'AGENT_MECHANICS' && (
          <AgentMechanicsPage onEnterSimulatorWithStrategy={handleEnterWithStrategy} />
        )}

        {/* VIEW 6: RESEARCH METHODOLOGY MONOGRAPH */}
        {activeTab === 'METHODOLOGY' && (
          <MethodologyPage />
        )}

        {/* VIEW 7: REAL-WORLD DEFENSE & CYBER RELEVANCE */}
        {activeTab === 'REAL_WORLD' && (
          <RealWorldApplications
            onLaunchSimulatorWithPreset={() => {
              setActiveTab('SIMULATOR');
            }}
          />
        )}

        {/* VIEW 8: MAHĀBHĀRATA DRONA PARVA HISTORICAL ARCHIVE */}
        {activeTab === 'MAHABHARATA' && (
          <MahabharataContext />
        )}

        {/* VIEW 9: ABOUT & RESPONSIBLE AI DECLARATION */}
        {activeTab === 'ABOUT' && (
          <AboutPage />
        )}
      </main>
    </div>
  );
};

export default App;
