import React, { useState } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Compass, Eye, Radio, Activity, Target, HelpCircle, Shield, Sliders, Globe } from 'lucide-react';
import { CameraMode } from '../../three/camera/CameraController';
import { SimulationMode } from '../../types/simulation';

interface PlaybackControlsProps {
  isRunning: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onReset: () => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
  cameraMode: CameraMode;
  onChangeCameraMode: (mode: CameraMode) => void;

  // Mode Switcher
  mode: SimulationMode;
  onChangeMode: (mode: SimulationMode) => void;

  // Abhimanyu Focus Action
  onFocusAbhimanyu: () => void;

  // Telemetry
  currentStep: number;
  coordinationScore: number;
  seed: number;
  phase?: string;

  // Visual Toggles
  showPaths: boolean;
  setShowPaths: (val: boolean) => void;
  showVision: boolean;
  setShowVision: (val: boolean) => void;
  showComm: boolean;
  setShowComm: (val: boolean) => void;
  showHeatmap: boolean;
  setShowHeatmap: (val: boolean) => void;
  showDynamics: boolean;
  setShowDynamics: (val: boolean) => void;
  showNavDebug?: boolean;
  setShowNavDebug?: (val: boolean) => void;

  // Drawer Toggles
  showScenarioDrawer: boolean;
  setShowScenarioDrawer: (val: boolean) => void;
  showMetricsDrawer: boolean;
  setShowMetricsDrawer: (val: boolean) => void;

  // Real-World Tech Modal
  onOpenRealWorld?: () => void;

  // Narrative Phase Banner
  phaseBanner?: { text: string; cls: string; icon: string };

  // Inspector Toggle
  isInspectorOpen?: boolean;
  onToggleInspector?: () => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isRunning,
  onTogglePlay,
  onStep,
  onReset,
  speed,
  onChangeSpeed,
  cameraMode,
  onChangeCameraMode,
  mode,
  onChangeMode,
  onFocusAbhimanyu,
  currentStep,
  coordinationScore,
  seed,
  phase = 'READY',
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
  showNavDebug = false,
  setShowNavDebug,
  showScenarioDrawer,
  setShowScenarioDrawer,
  showMetricsDrawer,
  setShowMetricsDrawer,
  onOpenRealWorld,
  phaseBanner,
  isInspectorOpen = false,
  onToggleInspector
}) => {
  const [showLegendModal, setShowLegendModal] = useState(false);

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 max-w-[98vw] pointer-events-auto select-none">
      {/* Top Floating Workstation: 2 Clean Rows */}
      <div className="surface-panel px-4 py-2 flex flex-col gap-2 shadow-2xl border border-[var(--border-gold)] rounded-xl backdrop-blur-md">
        {/* ROW 1: PRIMARY SIMULATION COMMAND & SCENARIO */}
        <div className="flex items-center justify-between gap-3 w-full whitespace-nowrap">
          <div className="flex items-center gap-2">
            {/* Left Scenario Drawer Toggle */}
            <button
              onClick={() => setShowScenarioDrawer(!showScenarioDrawer)}
              className={`px-2.5 py-1 rounded-md flex items-center space-x-1.5 text-xs font-semibold transition-all ${
                showScenarioDrawer
                  ? 'bg-[#d4af37] text-[#0d0905] shadow-sm font-bold'
                  : 'bg-[#1f150f] text-[#c5bcb1] hover:text-[#f5f1eb] border border-[var(--border-subtle)]'
              }`}
              title="Toggle Scenario Setup Drawer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Scenario</span>
            </button>

            <div className="h-4 w-px bg-[var(--border-subtle)]" />

            {/* Simulation Mode Selector */}
            <div className="flex items-center bg-[#140e0a] p-0.5 rounded-md border border-[var(--border-subtle)]">
              <button
                onClick={() => onChangeMode('HISTORICAL')}
                className={`px-3 py-1 rounded text-xs font-serif tracking-wide transition-all ${
                  mode === 'HISTORICAL'
                    ? 'bg-[#d4af37] text-[#0d0905] font-bold shadow-sm'
                    : 'text-[#8e8376] hover:text-[#f5f1eb]'
                }`}
                title="Faithful to Drona Parva Adhyaya 34 narrative"
              >
                📜 Historical
              </button>
              <button
                onClick={() => onChangeMode('COUNTERFACTUAL')}
                className={`px-3 py-1 rounded text-xs font-sans tracking-wide transition-all ${
                  mode === 'COUNTERFACTUAL'
                    ? 'bg-[#22d3ee] text-[#041d24] font-bold shadow-sm'
                    : 'text-[#8e8376] hover:text-[#f5f1eb]'
                }`}
                title="Computational What-If Exploration"
              >
                🧪 What-If
              </button>
            </div>
          </div>

          {/* Center: Playback Transport */}
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePlay}
              className={`px-4 py-1 rounded-md flex items-center space-x-1.5 font-bold text-xs transition-all font-serif tracking-wider ${
                isRunning
                  ? 'bg-[#ef4444] text-white shadow-md shadow-[#ef4444]/30'
                  : 'bg-[#10b981] text-[#0c0805] shadow-md shadow-[#10b981]/30 hover:brightness-110'
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isRunning ? 'PAUSE' : 'RUN'}</span>
            </button>

            <button
              onClick={onStep}
              disabled={isRunning}
              title="Advance single simulation step"
              className="p-1.5 rounded bg-[#1f150f] hover:bg-[#2b1d14] disabled:opacity-40 text-[#f5f1eb] border border-[var(--border-subtle)] text-xs flex items-center"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onReset}
              title="Reset scenario state"
              className="p-1.5 rounded bg-[#1f150f] hover:bg-[#2b1d14] text-[#8e8376] hover:text-[#d4af37] border border-[var(--border-subtle)] text-xs flex items-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Speed Multipliers */}
            <div className="flex items-center space-x-0.5 bg-[#140e0a] p-0.5 rounded border border-[var(--border-subtle)] font-mono text-[10px]">
              {[0.5, 1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => onChangeSpeed(s)}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    speed === s ? 'bg-[#d4af37] text-[#0d0905] font-bold' : 'text-[#8e8376] hover:text-[#f5f1eb]'
                  }`}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>

          {/* Right: Abhimanyu Focus, Inspector & Metrics */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onFocusAbhimanyu}
              className="px-2.5 py-1 rounded bg-[#251810] text-[#d4af37] hover:bg-[#382315] border border-[#d4af37]/40 text-xs font-semibold flex items-center space-x-1 transition-all"
              title="Track Abhimanyu's Chariot"
            >
              <Target className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="font-serif">Track Hero</span>
            </button>

            {onToggleInspector && (
              <button
                onClick={onToggleInspector}
                className={`px-2.5 py-1 rounded-md flex items-center space-x-1.5 text-xs font-semibold transition-all ${
                  isInspectorOpen
                    ? 'bg-[#d4af37] text-[#0d0905] shadow-sm font-bold'
                    : 'bg-[#1f150f] text-[#c5bcb1] hover:text-[#f5f1eb] border border-[var(--border-subtle)]'
                }`}
                title="Toggle Tactical Agent Dossier Inspector"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Inspector</span>
              </button>
            )}

            <button
              onClick={() => setShowMetricsDrawer(!showMetricsDrawer)}
              className={`px-2.5 py-1 rounded-md flex items-center space-x-1.5 text-xs font-semibold transition-all ${
                showMetricsDrawer
                  ? 'bg-[#22d3ee] text-[#041d24] shadow-sm font-bold'
                  : 'bg-[#1f150f] text-[#c5bcb1] hover:text-[#f5f1eb] border border-[var(--border-subtle)]'
              }`}
              title="Toggle Live Metrics Drawer"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Metrics</span>
            </button>
          </div>
        </div>

        {/* ROW 2: TACTICAL OVERLAYS, CAMERA & REAL-TIME TELEMETRY */}
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-[var(--border-subtle)] text-[11px] w-full whitespace-nowrap">
          {/* Left: Camera Selector */}
          <div className="flex items-center gap-2">
            <select
              value={cameraMode}
              onChange={(e) => onChangeCameraMode(e.target.value as CameraMode)}
              className="bg-[#140e0a] text-[#d4af37] px-2.5 py-1 rounded border border-[var(--border-subtle)] text-xs font-sans outline-none cursor-pointer"
            >
              <option value="CINEMATIC">Cam: 🎬 Cinematic Director</option>
              <option value="FOLLOW_ABHIMANYU">Cam: Follow Abhimanyu</option>
              <option value="FORMATION_VIEW">Cam: Formation Overview</option>
              <option value="TOP_DOWN">Cam: Tactical Top-Down</option>
              <option value="ISOMETRIC">Cam: Isometric 3D</option>
              <option value="ORBIT">Cam: Free Interactive Orbit</option>
            </select>
          </div>

          {/* Center: Overlays */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setShowPaths(!showPaths)}
              className={`px-2 py-0.5 rounded transition-colors ${showPaths ? 'bg-[#231911] text-[#22d3ee] border border-[#22d3ee]/40' : 'text-[#8e8376] hover:text-[#c5bcb1]'}`}
              title="Toggle Trajectory Trails & Exit Vectors"
            >
              Paths
            </button>
            <button
              onClick={() => setShowVision(!showVision)}
              className={`px-2 py-0.5 rounded transition-colors ${showVision ? 'bg-[#231911] text-[#22d3ee] border border-[#22d3ee]/40' : 'text-[#8e8376] hover:text-[#c5bcb1]'}`}
              title="Toggle Agent Vision Horizons"
            >
              Vision
            </button>
            <button
              onClick={() => setShowComm(!showComm)}
              className={`px-2 py-0.5 rounded transition-colors ${showComm ? 'bg-[#231911] text-[#10b981] border border-[#10b981]/40' : 'text-[#8e8376] hover:text-[#c5bcb1]'}`}
              title="Toggle Inter-Agent Communication Beams"
            >
              Comms
            </button>
            <button
              onClick={() => setShowDynamics(!showDynamics)}
              className={`px-2 py-0.5 rounded transition-colors ${showDynamics ? 'bg-[#231911] text-[#f59e0b] border border-[#f59e0b]/40' : 'text-[#8e8376] hover:text-[#c5bcb1]'}`}
              title="Toggle Dynamic Ring Rotation Indicators"
            >
              Tiers
            </button>
            {setShowNavDebug && (
              <button
                onClick={() => setShowNavDebug(!showNavDebug)}
                className={`px-2 py-0.5 rounded transition-colors ${showNavDebug ? 'bg-[#0f242a] text-[#38bdf8] border border-[#38bdf8]/50 shadow-sm' : 'text-[#8e8376] hover:text-[#38bdf8]'}`}
                title="Toggle Mathematical Navigation Graph, Corridors & A* Waypoints"
              >
                Nav Graph
              </button>
            )}
          </div>

          {/* Right: Legend, Real-World Tech & Telemetry */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLegendModal(!showLegendModal)}
              className={`p-1 rounded transition-all ${
                showLegendModal ? 'bg-[#d4af37] text-[#0d0905]' : 'bg-[#1f150f] text-[#8e8376] hover:text-[#f5f1eb]'
              }`}
              title="Battlefield Legend"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>

            {onOpenRealWorld && (
              <button
                onClick={onOpenRealWorld}
                className="px-2 py-0.5 rounded bg-[#10242e] text-[#38bdf8] hover:bg-[#173342] border border-[#38bdf8]/40 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
                title="Explore Real-World Military, Cyber, Swarms & Evacuation Applications"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="font-sans">Real-World Tech</span>
              </button>
            )}

            <div className="flex items-center space-x-2 text-xs font-mono bg-[#140e0a] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
              <span className="text-[#8e8376]">STEP <strong className="text-[#f5f1eb]">{currentStep}</strong></span>
              <span className="text-[#8e8376]">•</span>
              <span className="text-[#8e8376]">SCORE <strong className="text-[#22d3ee]">{coordinationScore}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* NARRATIVE PHASE BANNER: Seamlessly sits directly below the workstation bar without overlap */}
      {phaseBanner && (
        <div className={`phase-banner ${phaseBanner.cls}`}>
          <span className="phase-banner-dot" />
          <span>{phaseBanner.icon}</span>
          <span>{phaseBanner.text}</span>
        </div>
      )}
      
      {/* Battlefield Legend Modal Popup */}
      {showLegendModal && (
        <div className="absolute top-16 right-4 z-40 w-72 surface-panel p-3.5 text-xs rounded-xl shadow-2xl border border-[var(--border-gold)] space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-1.5">
            <span className="font-serif font-bold text-sm text-[#d4af37] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Battlefield Key & Units
            </span>
            <button
              onClick={() => setShowLegendModal(false)}
              className="text-[#8e8376] hover:text-[#f5f1eb] text-sm"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#d4af37] border border-[#f5e6b8]" />
              <span className="text-[#f5f1eb] font-semibold">Abhimanyu:</span>
              <span className="text-[#8e8376]">Vanguard Hero Chariot (Sun Banner)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#a37a3e]" />
              <span className="text-[#f5f1eb] font-semibold">Pandava Heroes:</span>
              <span className="text-[#8e8376]">Bhīma, Yudhiṣṭhira, Sātyaki</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#b83227]" />
              <span className="text-[#f5f1eb] font-semibold">Droṇa & Commanders:</span>
              <span className="text-[#8e8376]">Central Defense Hub & Kings</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#8e44ad]" />
              <span className="text-[#f5f1eb] font-semibold">Jayadratha:</span>
              <span className="text-[#8e8376]">Breach Seal Barrier (Tier 4 Gate)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-1 bg-[#d4af37]" />
              <span className="text-[#f5f1eb] font-semibold">Breach Trail:</span>
              <span className="text-[#8e8376]">Gold historical penetration history</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-1 border-t-2 border-dashed border-[#22d3ee]" />
              <span className="text-[#f5f1eb] font-semibold">Counterfactual Paths:</span>
              <span className="text-[#8e8376]">Predicted exit candidate vectors</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
