import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimulationEngine } from '../../simulation/core/Engine';
import { ScenarioConfig, AgentState, MetricsSnapshot, SimulationMode } from '../../types/simulation';
import { ControlPanel } from './ControlPanel';
import { LiveMetricsPanel } from './LiveMetricsPanel';
import { AgentInspector } from './AgentInspector';
import { CanvasContainer } from '../../three/CanvasContainer';
import { CameraMode } from '../../three/camera/CameraController';
import { RealWorldModal } from '../research/RealWorldModal';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Compass,
  Sliders,
  Camera,
  Activity,
  Shield,
  Layers,
  Info,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Radio,
  Footprints,
  Terminal,
  BookOpen,
  X,
  Crosshair,
  Users,
  Sparkles
} from 'lucide-react';

interface SimulationWorkspaceProps {
  engine: SimulationEngine;
  config: ScenarioConfig;
  onChangeConfig: (newConfig: ScenarioConfig) => void;
  onDeployScenario: () => void;
  cameraMode: CameraMode;
  setCameraMode: (mode: CameraMode) => void;
  selectedAgent: AgentState | null;
  setSelectedAgent: (agent: AgentState | null) => void;
  showPaths: boolean;
  setShowPaths: (v: boolean) => void;
  showVision: boolean;
  setShowVision: (v: boolean) => void;
  showComm: boolean;
  setShowComm: (v: boolean) => void;
  showHeatmap: boolean;
  setShowHeatmap: (v: boolean) => void;
  showDynamics: boolean;
  setShowDynamics: (v: boolean) => void;
  isRunning: boolean;
  setIsRunning: (v: boolean) => void;
  speed: number;
  setSpeed: (v: number) => void;
}

export const SimulationWorkspace: React.FC<SimulationWorkspaceProps> = ({
  engine,
  config,
  onChangeConfig,
  onDeployScenario,
  cameraMode,
  setCameraMode,
  selectedAgent,
  setSelectedAgent,
  showPaths,
  setShowPaths,
  showVision,
  setShowVision,
  showComm,
  setShowComm,
  showHeatmap,
  setShowHeatmap,
  showDynamics,
  setShowDynamics,
  isRunning,
  setIsRunning,
  speed,
  setSpeed
}) => {
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [showScenarioDrawer, setShowScenarioDrawer] = useState(false);
  const [showMetricsDrawer, setShowMetricsDrawer] = useState(false);
  const [showNavDebug, setShowNavDebug] = useState(false);
  const [showRealWorldModal, setShowRealWorldModal] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [showDevDebug, setShowDevDebug] = useState(false);
  const [fps, setFps] = useState(60);
  const [metrics, setMetrics] = useState<MetricsSnapshot | null>(null);

  const requestRef = useRef<number | null>(null);
  const lastStepTimeRef = useRef<number>(0);
  const lastUiUpdateTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastFpsCalcTimeRef = useRef<number>(performance.now());

  // Stable references to prevent callback recreation
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const selectedAgentIdRef = useRef<string | null>(selectedAgent?.id || null);
  selectedAgentIdRef.current = selectedAgent?.id || null;

  // High-performance decoupled simulation loop:
  // Step rate: 16 * speed ticks/sec
  // UI update rate: throttled to ~10 Hz (every 100ms) to prevent React DOM re-rendering bottleneck
  const tick = useCallback(
    (time: number) => {
      frameCountRef.current++;
      if (time - lastFpsCalcTimeRef.current >= 500) {
        const calculatedFps = Math.round((frameCountRef.current * 1000) / (time - lastFpsCalcTimeRef.current));
        setFps(Math.min(120, Math.max(15, calculatedFps)));
        frameCountRef.current = 0;
        lastFpsCalcTimeRef.current = time;
      }

      if (isRunningRef.current && !engine.isFinished) {
        const stepInterval = 1000 / (16 * speedRef.current);
        if (time - lastStepTimeRef.current >= stepInterval) {
          const snapshot = engine.step();
          lastStepTimeRef.current = time;

          // Throttle React state updates to 10 Hz
          if (time - lastUiUpdateTimeRef.current >= 100 || engine.isFinished) {
            setMetrics(snapshot);
            lastUiUpdateTimeRef.current = time;

            if (selectedAgentIdRef.current) {
              const freshAgent =
                engine.agents.find((a) => a.id === selectedAgentIdRef.current) ||
                engine.kauravaCommanders.find((c) => c.id === selectedAgentIdRef.current);
              if (freshAgent) {
                setSelectedAgent({ ...freshAgent });
              }
            }
          }
        }
      }
      requestRef.current = requestAnimationFrame(tick);
    },
    [engine, setSelectedAgent]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(tick);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [tick]);

  const handleStep = () => {
    if (engine.isFinished) return;
    const snapshot = engine.step();
    setMetrics(snapshot);

    if (selectedAgent) {
      const freshAgent =
        engine.agents.find((a) => a.id === selectedAgent.id) ||
        engine.kauravaCommanders.find((c) => c.id === selectedAgent.id);
      if (freshAgent) setSelectedAgent({ ...freshAgent });
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    engine.initializeAgents();
    setMetrics(null);
    setSelectedAgent(null);
    setIsInspectorOpen(false);
  };

  const handleTogglePlay = () => {
    if (engine.isFinished) {
      handleReset();
    }
    setIsRunning(!isRunning);
  };

  const handleModeChange = (newMode: SimulationMode) => {
    setIsRunning(false);
    const updated: ScenarioConfig = {
      ...config,
      mode: newMode,
      supportBlocked: newMode === 'HISTORICAL',
      exitKnowledgePercent: newMode === 'HISTORICAL' ? 0 : 75
    };
    onChangeConfig(updated);
  };

  const abhimanyu = engine.agents.find((a) => a.heroType === 'ABHIMANYU' || a.index === 0) || engine.agents[0];
  const jayadratha = engine.kauravaCommanders.find((c) => c.heroType === 'JAYADRATHA');
  const drona = engine.kauravaCommanders.find((c) => c.heroType === 'DRONA');

  // Format MM:SS
  const formatTime = (steps: number) => {
    const totalSecs = Math.floor(steps * 0.1);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Story Milestones along scrubber
  const milestones = [
    { label: 'Deployed', stepThreshold: 0, phase: 'READY' },
    { label: 'Approach', stepThreshold: 10, phase: 'APPROACHING' },
    { label: 'Breach', stepThreshold: 30, phase: 'ENTERING' },
    { label: 'Support Blocked', stepThreshold: 60, phase: 'SUPPORT_BLOCKED' },
    { label: 'Isolated', stepThreshold: 90, phase: 'ISOLATED' },
    {
      label: config.mode === 'HISTORICAL' ? 'Final Stand' : 'Breakout',
      stepThreshold: 150,
      phase: config.mode === 'HISTORICAL' ? 'HISTORICAL_END' : 'ESCAPE_SUCCESS'
    }
  ];

  const currentStep = engine.currentStep;

  const activeEngagements =
    (engine.phase === 'ENTERING' ? 14 : 0) +
    (engine.phase === 'PENETRATING' ? 28 : 0) +
    (engine.phase === 'SUPPORT_BLOCKED' ? 22 : 0) +
    (engine.phase === 'ISOLATED' ? 36 : 0) +
    (engine.phase === 'SURROUNDED' ? 48 : 0) +
    (engine.phase === 'HISTORICAL_END' ? 54 : 0);

  const getLayerName = (layerIndex: number) => {
    switch (layerIndex) {
      case 0: return 'OUTER GATE (JAYADRATHA)';
      case 1: return 'PRATHAMA CHAKRA (DUSHASANA)';
      case 2: return 'DVITIYA CHAKRA (KRIPACHARYA)';
      case 3: return 'TRITIYA CHAKRA (ASHWATTHAMA)';
      case 4: return 'CHATURTHA CHAKRA (KARNA)';
      case 5: return 'PANCHAMA CHAKRA (SHALYA)';
      case 6: return 'SHASHTHA CHAKRA (BHURISHRAVA)';
      case 7: return 'SAPTAMA CHAKRA (DRONA & DURYODHANA)';
      default: return `CHAKRA ${layerIndex}`;
    }
  };

  // State to track layer changes for animation
  const [prevLayer, setPrevLayer] = useState(abhimanyu?.currentLayer ?? 0);
  const [showLayerAnim, setShowLayerAnim] = useState(false);

  useEffect(() => {
    if (abhimanyu && abhimanyu.currentLayer !== prevLayer) {
      setPrevLayer(abhimanyu.currentLayer);
      setShowLayerAnim(true);
      const timer = setTimeout(() => setShowLayerAnim(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [abhimanyu?.currentLayer, prevLayer]);

  const heroHealth = abhimanyu?.health ?? 100;
  const isHeroTakingDamage = heroHealth < 100;

  return (
    <div className="w-full h-full relative select-none overflow-hidden bg-[#0c0907]">
      {/* 1. 3D WEBGL KURUKSHETRA BATTLEFIELD CANVAS (OCCUPIES 100% OF WORKSPACE) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <CanvasContainer
          engine={engine}
          cameraMode={cameraMode}
          selectedAgent={selectedAgent}
          onSelectAgent={(agent) => {
            setSelectedAgent(agent);
          }}
          showPaths={showPaths}
          showVision={showVision}
          showComm={showComm}
          showHeatmap={showHeatmap}
          showDynamics={showDynamics}
          showNavDebug={showNavDebug}
        />
        {/* Kinetic Damage Tint Overlay */}
        <div className={`absolute inset-0 pointer-events-none transition-colors duration-200 ${isHeroTakingDamage ? 'bg-red-900/10' : 'bg-transparent'}`} />
      </div>

      {/* CHAKRA LAYER NAME OVERLAY (Premium Boxed Layout) */}
      <div className="absolute bottom-32 left-6 md:left-10 z-10 pointer-events-none flex flex-col items-start justify-center">
        <div className={`p-4 bg-[#0a0705]/80 border border-[#d4af37]/30 backdrop-blur-md rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-500 transform ${showLayerAnim ? 'scale-105 border-[#d4af37]/70' : 'scale-100'}`}>
          <div className="text-[10px] font-mono tracking-[0.3em] text-[#d4af37] text-left mb-2 opacity-80">
            CURRENT ZONE
          </div>
          <h2 className={`text-lg sm:text-xl font-serif font-bold tracking-widest ${showLayerAnim ? 'text-[#ffdfc2] drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]' : 'text-[#f5eedc]'}`}>
            {getLayerName(abhimanyu?.currentLayer ?? 0)}
          </h2>
        </div>
      </div>

      {/* HEALTH BAR UI (Premium HUD Bottom Right) */}
      {abhimanyu && (
        <div className="absolute bottom-32 right-6 md:right-10 z-20 pointer-events-none w-64 sm:w-80 flex flex-col items-end">
          <div className="flex justify-between w-full text-[10px] font-mono tracking-widest text-[#d4af37] mb-2 drop-shadow-lg opacity-80">
            <span>ABHIMANYU VITALITY</span>
            <span className={heroHealth < 40 ? 'text-red-500 font-bold animate-pulse' : ''}>{Math.ceil(heroHealth)}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#120d09]/80 rounded-full border border-[#d4af37]/30 overflow-hidden backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <div 
              className={`h-full transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.5)] ${heroHealth < 30 ? 'bg-red-600 animate-pulse' : heroHealth < 60 ? 'bg-orange-500' : 'bg-[#d4af37]'}`}
              style={{ width: `${heroHealth}%` }}
            />
          </div>
        </div>
      )}

      {/* 2. TOP TACTICAL HUD HEADER (RESPONSIVE FLEXBOX CONTAINER - ZERO OVERLAPPING) */}
      <div className="absolute top-4 inset-x-4 sm:inset-x-6 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-3">
        {/* Left: Classical Formation Title */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-[#120e0a]/92 border border-[#d4af37]/35 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-serif font-extrabold tracking-widest text-[#f5eedc]">
                CHAKRAVYŪHA
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                DAY 13
              </span>
            </div>
            <p className="text-[11px] text-[#b5a491] font-sans mt-0.5 hidden sm:block">
              Multi-agent coordination under incomplete information
            </p>
          </div>
        </div>

        {/* Center: Controls Bar (Mode, Camera, Toggles, Legend & Params Drawer) */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-[#120e0a]/92 border border-[#d4af37]/40 backdrop-blur-md shadow-2xl text-xs">
          {/* Scenario Mode Switcher */}
          <div className="flex rounded-full bg-[#1b140f] p-0.5 border border-[#d4af37]/25">
            <button
              onClick={() => handleModeChange('HISTORICAL')}
              className={`px-3 py-1 rounded-full text-xs font-serif font-semibold transition-all cursor-pointer ${
                config.mode === 'HISTORICAL'
                  ? 'bg-[#d4af37] text-[#0c0805] shadow-sm'
                  : 'text-[#c5bcb1] hover:text-[#f5eedc]'
              }`}
            >
              Historical
            </button>
            <button
              onClick={() => handleModeChange('COUNTERFACTUAL')}
              className={`px-3 py-1 rounded-full text-xs font-serif font-semibold transition-all cursor-pointer ${
                config.mode === 'COUNTERFACTUAL'
                  ? 'bg-[#22d3ee] text-[#0c0805] shadow-sm'
                  : 'text-[#c5bcb1] hover:text-[#f5eedc]'
              }`}
            >
              Counterfactual
            </button>
          </div>

          {/* Camera Presets Selector */}
          <div className="flex items-center gap-1 pl-2 border-l border-[#d4af37]/20">
            <Camera className="w-3.5 h-3.5 text-[#d4af37]" />
            <select
              value={cameraMode}
              onChange={(e) => setCameraMode(e.target.value as CameraMode)}
              className="bg-transparent text-[#f5eedc] text-xs font-sans focus:outline-none cursor-pointer pr-1"
            >
              <option value="COMMAND" className="bg-[#1a120c]">Command View</option>
              <option value="TACTICAL" className="bg-[#1a120c]">Tactical View</option>
              <option value="CLOSE" className="bg-[#1a120c]">Close View</option>
              <option value="OVERVIEW" className="bg-[#1a120c]">Overview</option>
              <option value="FOLLOW_AGENT" className="bg-[#1a120c]">Follow Agent</option>
              <option value="CINEMATIC" className="bg-[#1a120c]">Cinematic Sweep</option>
              <option value="FREE" className="bg-[#1a120c]">Free Mode</option>
            </select>
          </div>

          {/* Quick Layer / Effect Toggles */}
          <div className="hidden md:flex items-center gap-1 pl-2 border-l border-[#d4af37]/20">
            <button
              onClick={() => setShowDynamics(!showDynamics)}
              title="Toggle Formation Units"
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                showDynamics ? 'bg-[#d4af37]/25 text-[#d4af37]' : 'text-[#8e8376] hover:text-[#f5eedc]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowPaths(!showPaths)}
              title="Toggle Trajectory Paths"
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                showPaths ? 'bg-[#d4af37]/25 text-[#d4af37]' : 'text-[#8e8376] hover:text-[#f5eedc]'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowComm(!showComm)}
              title="Toggle Communication Beams"
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                showComm ? 'bg-[#d4af37]/25 text-[#d4af37]' : 'text-[#8e8376] hover:text-[#f5eedc]'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowVision(!showVision)}
              title="Toggle Vision Cones"
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                showVision ? 'bg-[#d4af37]/25 text-[#d4af37]' : 'text-[#8e8376] hover:text-[#f5eedc]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Legend Toggle Button */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className={`px-2 py-1 rounded-full text-xs font-serif font-semibold transition-all cursor-pointer border ${
              showLegend
                ? 'bg-[#d4af37] text-[#0c0805] border-[#d4af37]'
                : 'border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/15'
            }`}
            title="Toggle Visual Battlefield Legend"
          >
            Legend
          </button>

          {/* Dev Debug Toggle */}
          <button
            onClick={() => setShowDevDebug(!showDevDebug)}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              showDevDebug ? 'bg-[#d4af37] text-[#0c0805]' : 'text-[#8e8376] hover:text-[#d4af37]'
            }`}
            title="Toggle Performance & Sim Debugger"
          >
            <Terminal className="w-3.5 h-3.5" />
          </button>

          {/* Advanced Drawer Button */}
          <button
            onClick={() => setShowScenarioDrawer(!showScenarioDrawer)}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              showScenarioDrawer ? 'bg-[#d4af37] text-[#0c0805]' : 'text-[#c5bcb1] hover:text-[#d4af37] hover:bg-[#20150d]'
            }`}
            title="Toggle Simulation Parameters Drawer"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: North Vanguard Orientation */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-serif text-xs font-semibold px-3 py-2 rounded-2xl bg-[#140e0a]/85 backdrop-blur-md border border-[#d4af37]/35 text-[#d4af37] shadow-xl">
            <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-[10px] font-mono tracking-wider">NORTH VANGUARD</span>
          </div>
        </div>
      </div>



      {/* 4. FACULTY PRESENTATION DEMO BANNER (IF PRESENTATION TOGGLED) */}
      {isPresentationMode && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-20 pointer-events-auto max-w-2xl w-[90%] rounded-2xl bg-[#140e0a]/95 border border-[#d4af37]/60 backdrop-blur-lg p-5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#d4af37]/25">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
                DROṆA PARVA • DAY 13
              </span>
              <span className="text-xs font-serif font-bold text-[#f5eedc]">
                {config.mode === 'HISTORICAL' ? 'HISTORICAL RECONSTRUCTION' : 'COUNTERFACTUAL FLANK STUDY'}
              </span>
            </div>
            <span className="text-xs font-mono text-[#d4af37]">
              Step {currentStep} / {config.maxSteps || 350}
            </span>
          </div>

          <h3 className="text-base font-serif font-bold text-[#f5eedc]">
            {engine.phase === 'APPROACHING' && 'Phase 1: Abhimanyu Approaches the Northern Breach'}
            {engine.phase === 'ENTERING' && 'Phase 2: Penetration of the Outer Vanguard Aperture'}
            {engine.phase === 'PENETRATING' && 'Phase 3: Navigating Intermediate Concentric Tiers'}
            {engine.phase === 'SUPPORT_BLOCKED' && 'Phase 4: Jayadratha Seals Entrance — Pandava Support Blocked'}
            {engine.phase === 'ISOLATED' && 'Phase 5: Complete Isolation & Network Partition'}
            {engine.phase === 'SURROUNDED' && 'Phase 6: Multi-Agent Convergence of Six Maharathas'}
            {engine.phase === 'HISTORICAL_END' && 'Terminal State: Heroic Last Stand with Chariot Wheel'}
            {engine.phase === 'ESCAPE_SUCCESS' && 'Terminal State: Successful Flank Gate Egress'}
            {(!['APPROACHING','ENTERING','PENETRATING','SUPPORT_BLOCKED','ISOLATED','SURROUNDED','HISTORICAL_END','ESCAPE_SUCCESS'].includes(engine.phase)) && 'Chakravyūha Computational Simulation'}
          </h3>
        </div>
      )}

      {/* 5. VISUAL LEGEND DRAWER (SECTION 39) */}
      {showLegend && (
        <div className="absolute top-28 left-6 z-20 pointer-events-auto select-none w-64 rounded-2xl bg-[#140e0a]/95 border border-[#d4af37]/45 backdrop-blur-md p-4 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#d4af37]/25">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-xs font-serif font-bold text-[#f5eedc]">Battlefield Legend</span>
            </div>
            <button
              onClick={() => setShowLegend(false)}
              className="text-[#8e8376] hover:text-[#f5eedc] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#f5eedc]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f39c12]" />
                <span className="font-serif">Abhimanyu</span>
              </span>
              <span className="text-[10px] font-mono text-[#8e8376]">Gold Chariot</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#f5eedc]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e67e22]" />
                <span>Support Force</span>
              </span>
              <span className="text-[10px] font-mono text-[#8e8376]">Bhīma, Yudhiṣṭhira</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#f5eedc]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8e44ad]" />
                <span>Jayadratha</span>
              </span>
              <span className="text-[10px] font-mono text-[#8e8376]">Breach Interdiction</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#f5eedc]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c0392b]" />
                <span>Commanders</span>
              </span>
              <span className="text-[10px] font-mono text-[#8e8376]">Droṇa, Karṇa, Kṛpa</span>
            </div>

            <div className="pt-2 border-t border-[#52341e]/50 space-y-1.5">
              <div className="flex items-center justify-between text-[#c5bcb1]">
                <span>⚔️ Infantry (Padāti)</span>
                <span className="font-mono text-[10px] text-[#8e8376]">Swordsmen phalanx</span>
              </div>
              <div className="flex items-center justify-between text-[#c5bcb1]">
                <span>🏹 Archers (Dhanurdhara)</span>
                <span className="font-mono text-[10px] text-[#8e8376]">Ranged longbow</span>
              </div>
              <div className="flex items-center justify-between text-[#c5bcb1]">
                <span>🐘 Elephants (Gaja)</span>
                <span className="font-mono text-[10px] text-[#8e8376]">Howdah assault</span>
              </div>
              <div className="flex items-center justify-between text-[#c5bcb1]">
                <span>🛡️ Chariots (Ratha)</span>
                <span className="font-mono text-[10px] text-[#8e8376]">Two-wheeled cars</span>
              </div>
              <div className="flex items-center justify-between text-[#c5bcb1]">
                <span>🐎 Cavalry (Ashva)</span>
                <span className="font-mono text-[10px] text-[#8e8376]">Mounted lancers</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. DEVELOPER DEBUG PANEL (SECTION 42) */}
      {showDevDebug && (
        <div className="absolute top-28 right-6 z-20 pointer-events-auto select-none w-56 rounded-2xl bg-[#120d09]/95 border border-[#22d3ee]/40 backdrop-blur-md p-3.5 shadow-2xl font-mono text-[11px] text-[#f5eedc] animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#22d3ee]/20 text-[#22d3ee]">
            <span className="text-[10px] uppercase font-bold tracking-wider">Dev Diagnostics</span>
            <button onClick={() => setShowDevDebug(false)} className="text-[#8e8376] hover:text-[#f5eedc]">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#8e8376]">FPS:</span>
              <span className={fps >= 50 ? 'text-[#10b981] font-bold' : 'text-[#f59e0b] font-bold'}>{fps} FPS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8e8376]">Sim Tick:</span>
              <span className="text-[#f5eedc]">{currentStep}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8e8376]">Sim Time:</span>
              <span className="text-[#d4af37]">{formatTime(currentStep)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8e8376]">Agent Count:</span>
              <span className="text-[#f5eedc]">{engine.agents.length + engine.kauravaCommanders.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8e8376]">Active Clashes:</span>
              <span className="text-[#ef4444] font-bold">{activeEngagements}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8e8376]">Mode:</span>
              <span className="text-[#22d3ee]">{config.mode}</span>
            </div>
          </div>
        </div>
      )}

      {/* 7. BOTTOM-LEFT: FORMATION LAYERS CARD (Removed per request) */}

      {/* 8. BOTTOM-CENTER: MILESTONES SCRUBBER & PLAYBACK CONTROLS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto select-none flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#140e0a]/92 border border-[#d4af37]/45 backdrop-blur-md shadow-2xl">
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          className="w-9 h-9 rounded-full bg-[#d4af37] hover:bg-[#e6c35c] text-[#0c0805] flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
        >
          {isRunning ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current translate-x-0.5" />
          )}
        </button>

        {/* Speed Selector */}
        <select
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="bg-[#1f1610] text-[#d4af37] text-xs font-mono font-medium px-2 py-1 rounded-lg border border-[#d4af37]/30 cursor-pointer focus:outline-none"
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1.0x</option>
          <option value={2}>2.0x</option>
          <option value={4}>4.0x</option>
        </select>

        {/* Time Stamp */}
        <div className="text-xs font-mono text-[#8e8376] min-w-[70px] text-center">
          {formatTime(currentStep)} / {formatTime(config.maxSteps || 350)}
        </div>

        {/* Timeline Scrubber Milestones */}
        <div className="hidden lg:flex items-center gap-4 px-2">
          {milestones.map((m, idx) => {
            const isPassed = currentStep >= m.stepThreshold;
            const isCurrent =
              engine.phase === m.phase ||
              (idx < milestones.length - 1 &&
                currentStep >= m.stepThreshold &&
                currentStep < milestones[idx + 1].stepThreshold);

            return (
              <div key={`ms-${idx}`} className="flex flex-col items-center">
                <div
                  className={`w-2.5 h-2.5 rounded-full border transition-all ${
                    isCurrent
                      ? 'bg-[#d4af37] border-white ring-2 ring-[#d4af37]/40 scale-125'
                      : isPassed
                      ? 'bg-[#d4af37] border-[#8a5d2b]'
                      : 'bg-[#2b1f16] border-[#523d2b]'
                  }`}
                />
                <span
                  className={`text-[9px] mt-1 whitespace-nowrap transition-colors ${
                    isCurrent
                      ? 'text-[#f5eedc] font-semibold'
                      : isPassed
                      ? 'text-[#a89885]'
                      : 'text-[#615144]'
                  }`}
                >
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Forward */}
        <button
          onClick={handleStep}
          title="Step Forward"
          className="p-1.5 rounded-lg text-[#c5bcb1] hover:text-[#d4af37] hover:bg-[#20150d] transition-colors cursor-pointer"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        {/* Reset */}
        <button
          onClick={handleReset}
          title="Reset Simulation"
          className="p-1.5 rounded-lg text-[#8e8376] hover:text-[#f5eedc] hover:bg-[#20150d] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 9. BOTTOM-RIGHT: RIGHT INFORMATION PANEL (SECTION 19) */}
      {!isPresentationMode && selectedAgent && (
        <div className="absolute bottom-6 right-6 z-20 pointer-events-auto select-none w-64 rounded-2xl bg-[#140e0a]/92 border border-[#d4af37]/40 backdrop-blur-md p-3.5 shadow-2xl animate-in slide-in-from-right-4">
          {selectedAgent.heroType === 'JAYADRATHA' ? (
            /* B. JAYADRATHA SELECTED STATE */
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-[#8e44ad]/30 pb-2">
                <div>
                  <div className="text-[9px] uppercase font-mono tracking-wider text-[#8e44ad]">
                    Breach Gatekeeper
                  </div>
                  <div className="text-xs font-serif font-bold text-[#f5eedc]">
                    JAYADRATHA
                  </div>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#8e44ad]/20 text-[#8e44ad] border border-[#8e44ad]/40 font-semibold">
                  KAURAVA
                </span>
              </div>

              <div className="flex flex-col gap-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#8e8376]">Role</span>
                  <span className="text-[#f5eedc] text-right font-medium">Support-blocking Interdiction</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8e8376]">Affected Agents</span>
                  <span className="text-[#ef4444] font-medium text-right">Bhīma, Yudhiṣṭhira, Sātyaki</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8e8376]">Historical Source</span>
                  <span className="text-[#d4af37] font-mono text-[10px] text-right">Droṇa Parva Sec. XLII</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8e8376]">Gate Status</span>
                  <span className="text-[#8e44ad] font-mono font-medium">
                    {engine.formation.isJayadrathaSealed ? 'Entrance Sealed' : 'Aperture Open'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#d4af37]/20 flex justify-between items-center text-[10px]">
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-[#8e8376] hover:text-[#f5eedc] cursor-pointer"
                >
                  Overview
                </button>
                <button
                  onClick={() => setIsInspectorOpen(true)}
                  className="text-[#d4af37] hover:underline cursor-pointer font-medium"
                >
                  Full Dossier
                </button>
              </div>
            </div>
          ) : selectedAgent.heroType === 'DRONA' ? (
            /* C. DRONA SELECTED STATE */
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-[#c0392b]/30 pb-2">
                <div>
                  <div className="text-[9px] uppercase font-mono tracking-wider text-[#c0392b]">
                    Supreme Commander
                  </div>
                  <div className="text-xs font-serif font-bold text-[#f5eedc]">
                    GURU DROṆA
                  </div>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#c0392b]/20 text-[#c0392b] border border-[#c0392b]/40 font-semibold">
                  KAURAVA
                </span>
              </div>

              <div className="flex flex-col gap-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#8e8376]">Role</span>
                  <span className="text-[#f5eedc] text-right font-medium">Chakravyūha Architect</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8e8376]">Command Sector</span>
                  <span className="text-[#d4af37] font-medium text-right">Central Command Position</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8e8376]">Historical Source</span>
                  <span className="text-[#d4af37] font-mono text-[10px] text-right">Droṇa Parva Sec. XXXIII</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8e8376]">Strategic Aim</span>
                  <span className="text-[#c5bcb1] text-right">Yudhiṣṭhira Capture</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#d4af37]/20 flex justify-between items-center text-[10px]">
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-[#8e8376] hover:text-[#f5eedc] cursor-pointer"
                >
                  Overview
                </button>
                <button
                  onClick={() => setIsInspectorOpen(true)}
                  className="text-[#d4af37] hover:underline cursor-pointer font-medium"
                >
                  Full Dossier
                </button>
              </div>
            </div>
          ) : (
            /* D. ABHIMANYU / PANDAVA HERO SELECTED STATE */
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-2">
                <div>
                  <div className="text-[9px] uppercase font-mono tracking-wider text-[#8e8376]">
                    Selected Warrior
                  </div>
                  <div className="text-xs font-serif font-bold text-[#f5eedc]">
                    {selectedAgent.name}
                  </div>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#f39c12]/20 text-[#f39c12] border border-[#f39c12]/30 font-semibold">
                  {selectedAgent.team}
                </span>
              </div>

              <div className="flex flex-col gap-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#8e8376]">Role</span>
                  <span className="text-[#f5eedc] text-right font-medium">Pandava Vanguard Warrior</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8e8376]">Current Layer</span>
                  <span className="text-[#f5eedc] font-mono">
                    {selectedAgent.currentLayer === 0 ? 'Outside Vanguard' : `Tier ${selectedAgent.currentLayer} of 7`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8e8376]">Current Objective</span>
                  <span className="text-[#22d3ee] font-medium text-right">
                    {selectedAgent.targetLocation ? 'Inner Core Breach' : 'Penetrate Formation'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8e8376]">Known Info</span>
                  <span className="text-[#d4af37] font-mono text-[10px] text-right">
                    {config.mode === 'HISTORICAL' ? 'Entry Only (0% Exit)' : `${config.exitKnowledgePercent}% Exit Map`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8e8376]">Support Status</span>
                  <span
                    className={`font-mono text-right ${
                      selectedAgent.supportStatus === 'ISOLATED'
                        ? 'text-[#ef4444]'
                        : selectedAgent.supportStatus === 'SUPPORT_BLOCKED'
                        ? 'text-[#f59e0b]'
                        : 'text-[#10b981]'
                    }`}
                  >
                    {selectedAgent.supportStatus === 'ISOLATED'
                      ? 'Severed (Jayadratha)'
                      : selectedAgent.supportStatus === 'SUPPORT_BLOCKED'
                      ? 'Blocked at North Gate'
                      : 'Active / Following'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#8e8376]">Communication</span>
                  <span
                    className={`font-mono ${
                      selectedAgent.supportStatus === 'ISOLATED' ? 'text-[#ef4444]' : 'text-[#10b981]'
                    }`}
                  >
                    {selectedAgent.supportStatus === 'ISOLATED' ? 'Severed (0%)' : 'Online (100%)'}
                  </span>
                </div>
              </div>

              {/* Quick Inspector & Nav Debug Toggles */}
              <div className="mt-2.5 pt-2 border-t border-[#d4af37]/20 flex justify-between items-center text-[10px]">
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-[#8e8376] hover:text-[#f5eedc] cursor-pointer"
                >
                  Overview
                </button>
                <button
                  onClick={() => setIsInspectorOpen(!isInspectorOpen)}
                  className="text-[#d4af37] hover:underline cursor-pointer font-medium"
                >
                  Inspect Dossier
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 10. OPTIONAL DRAWERS (EXPANDABLE ONLY ON DEMAND) */}
      {showScenarioDrawer && (
        <div className="absolute left-6 top-20 pointer-events-auto z-30 animate-in fade-in slide-in-from-left duration-200">
          <ControlPanel
            config={config}
            onChangeConfig={onChangeConfig}
            onApplyAndRestart={() => {
              setIsRunning(false);
              onDeployScenario();
            }}
            isCollapsed={false}
            onToggleCollapse={() => setShowScenarioDrawer(false)}
          />
        </div>
      )}

      {showMetricsDrawer && (
        <div className="absolute right-6 top-20 pointer-events-auto z-30 animate-in fade-in slide-in-from-right duration-200">
          <LiveMetricsPanel metrics={metrics} agentCount={engine.agents.length} />
        </div>
      )}

      {/* Full Agent Inspector Dossier Modal/Drawer */}
      {isInspectorOpen && (selectedAgent || abhimanyu) && (
        <div className="pointer-events-auto z-40">
          <AgentInspector
            agent={selectedAgent || abhimanyu}
            onClose={() => setIsInspectorOpen(false)}
            simulationMode={config.mode}
          />
        </div>
      )}

      {/* Real-World Tech Modal */}
      <RealWorldModal
        isOpen={showRealWorldModal}
        onClose={() => setShowRealWorldModal(false)}
      />
    </div>
  );
};
