import React from 'react';
import { Shield, Play, Sparkles, BookOpen, Compass, Cpu, Radio, Eye, Award, Layers, ArrowRight, Zap, Target, Scroll } from 'lucide-react';
import { ScenarioConfig } from '../../types/simulation';

interface CleanIntroLandingProps {
  onEnterSimulator: () => void;
  onSelectPresetAndEnter: (presetConfig: Partial<ScenarioConfig>) => void;
  onNavigateToAgents: () => void;
  onNavigateToMethodology: () => void;
  onNavigateToMahabharata: () => void;
}

export const CleanIntroLanding: React.FC<CleanIntroLandingProps> = ({
  onEnterSimulator,
  onSelectPresetAndEnter,
  onNavigateToAgents,
  onNavigateToMethodology,
  onNavigateToMahabharata
}) => {
  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-b from-[#080503] via-[#120a06] to-[#080503] text-[#f5f0e8] select-none p-6 md:p-12 flex flex-col justify-between max-w-6xl mx-auto overflow-y-auto">
      {/* Top Header Badge & Sanskrit Invocation */}
      <div className="flex flex-col items-center text-center gap-3 pt-2">
        <div className="inline-flex items-center space-x-2 bg-[#d4af37]/10 border border-[#d4af37]/30 px-4 py-1 rounded-full text-[11px] font-mono text-[#d4af37] tracking-widest uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>KURUKSHETRA WAR • 13TH DAY • COMPUTATIONAL MAS</span>
        </div>

        <h1 className="text-3xl md:text-6xl font-black font-serif tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-[#f5f0e8] to-[#d4af37] uppercase drop-shadow-md">
          CHAKRAFORGE
        </h1>

        <p className="text-sm md:text-lg text-[#d4af37] font-serif max-w-2xl leading-relaxed italic">
          “Chakravyūha: 3D Multi-Agent Coordination Under Incomplete Information”
        </p>

        <p className="text-xs md:text-sm text-[#a89f91] max-w-2xl leading-relaxed font-sans">
          A scientific multi-agent research simulator inspired by the Mahābhārata Drona Parva. Investigate how dynamic rotating barriers, communication constraints, and fog of war govern autonomous agent survival.
        </p>
      </div>

      {/* CENTERPIECE: BLINKING / PULSING DIVINE CTA BUTTON */}
      <div className="flex flex-col items-center justify-center my-6 gap-3">
        <button
          onClick={onEnterSimulator}
          className="group relative px-10 py-4 rounded-2xl font-serif font-black text-sm md:text-base tracking-widest uppercase text-[#0d0905] bg-gradient-to-r from-[#f1c40f] via-[#d4af37] to-[#e67e22] shadow-[0_0_35px_rgba(212,175,55,0.7)] hover:shadow-[0_0_55px_rgba(212,175,55,0.95)] hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-[#fff0a6] animate-pulse flex items-center space-x-3 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>ENTER 3D CHAKRAVYŪHA SIMULATOR</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
        </button>
        <span className="text-[11px] font-mono text-[#a89f91]">Launch full-screen 3D tactical laboratory</span>
      </div>

      {/* 3 CORE PILLARS (SHORT & CONCISE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
        <div className="glass-panel p-4 rounded-xl border border-[var(--border-gold)]/30 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#e74c3c]/20 flex items-center justify-center text-[#e74c3c] font-bold text-sm mb-2">
              🏹
            </div>
            <h3 className="font-serif font-bold text-sm text-[#f5f0e8]">1. The Historical Dilemma</h3>
            <p className="text-[11px] text-[#a89f91] mt-1 leading-snug">
              Abhimanyu breached the outer perimeter but was isolated when Jayadratha sealed the rear corridors, severing communication with Pandava reinforcements.
            </p>
          </div>
          <button
            onClick={onNavigateToMahabharata}
            className="text-[10px] font-mono text-[#d4af37] hover:underline mt-3 text-left flex items-center gap-1"
          >
            <span>Read Drona Parva Text</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-[var(--border-gold)]/30 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#00f2ff]/20 flex items-center justify-center text-[#00f2ff] font-bold text-sm mb-2">
              🌀
            </div>
            <h3 className="font-serif font-bold text-sm text-[#f5f0e8]">2. Dynamic 7 Concentric Rings</h3>
            <p className="text-[11px] text-[#a89f91] mt-1 leading-snug">
              Concentric rings rotate at alternating speeds ω_i with periodic gate cycles, creating moving bottlenecks and shifting topological escape corridors.
            </p>
          </div>
          <button
            onClick={() => onSelectPresetAndEnter({ ringCount: 7, strategy: 'COORDINATED' })}
            className="text-[10px] font-mono text-[#00f2ff] hover:underline mt-3 text-left flex items-center gap-1"
          >
            <span>Simulate 7 Rings</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-[var(--border-gold)]/30 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-[#2ecc71]/20 flex items-center justify-center text-[#2ecc71] font-bold text-sm mb-2">
              🧠
            </div>
            <h3 className="font-serif font-bold text-sm text-[#f5f0e8]">3. Explainable Multi-Agent AI</h3>
            <p className="text-[11px] text-[#a89f91] mt-1 leading-snug">
              Autonomous units navigate using 4 strategies (Random, Greedy, A* Corridors, Coordinated Swarm) with real-time Explainable AI decision trees.
            </p>
          </div>
          <button
            onClick={onNavigateToAgents}
            className="text-[10px] font-mono text-[#2ecc71] hover:underline mt-3 text-left flex items-center gap-1"
          >
            <span>Explore Agent Mechanics</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* QUICK LAUNCH PRESET BUTTONS */}
      <div className="border-t border-[var(--border-gold)]/30 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <span className="text-[#a89f91] text-[11px]">Quick Scenarios:</span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() =>
              onSelectPresetAndEnter({
                strategy: 'GREEDY',
                informationLevel: 'LIMITED',
                communicationLevel: 'NONE',
                environmentDynamics: 'HIGHLY_DYNAMIC',
                ringCount: 7,
                agentCount: 1
              })
            }
            className="px-3 py-1.5 rounded-lg bg-[#251410] text-[#e74c3c] border border-[#e74c3c]/40 hover:bg-[#351a14] transition-colors"
          >
            🏹 Abhimanyu (1 Unit • 7 Rings)
          </button>

          <button
            onClick={() =>
              onSelectPresetAndEnter({
                strategy: 'COORDINATED',
                informationLevel: 'PARTIAL',
                communicationLevel: 'NORMAL',
                environmentDynamics: 'DYNAMIC',
                ringCount: 6,
                agentCount: 6
              })
            }
            className="px-3 py-1.5 rounded-lg bg-[#102421] text-[#2ecc71] border border-[#2ecc71]/40 hover:bg-[#15342e] transition-colors"
          >
            🛡️ Coordinated Swarm (6 Units)
          </button>

          <button
            onClick={() =>
              onSelectPresetAndEnter({
                strategy: 'SHORTEST_PATH',
                informationLevel: 'FULL',
                communicationLevel: 'HIGH',
                ringCount: 5,
                agentCount: 4
              })
            }
            className="px-3 py-1.5 rounded-lg bg-[#101b2b] text-[#3498db] border border-[#3498db]/40 hover:bg-[#16273e] transition-colors"
          >
            👁️ Full Omniscience Benchmark
          </button>
        </div>
      </div>
    </div>
  );
};
