import React from 'react';
import { Shield, Play, Sparkles, BookOpen, Layers, Radio, Eye, Cpu, Award, ArrowRight, Zap, Target, Scroll } from 'lucide-react';
import { ScenarioConfig } from '../../types/simulation';

interface IntroLandingProps {
  onEnterSimulator: () => void;
  onSelectPresetAndEnter: (presetConfig: Partial<ScenarioConfig>) => void;
  onNavigateToMethodology: () => void;
  onNavigateToMahabharata: () => void;
}

export const IntroLanding: React.FC<IntroLandingProps> = ({
  onEnterSimulator,
  onSelectPresetAndEnter,
  onNavigateToMethodology,
  onNavigateToMahabharata
}) => {
  return (
    <div className="w-full h-full overflow-y-auto bg-black/60 backdrop-blur-md text-[#f5f0e8] select-none p-6 md:p-10 flex flex-col gap-10 max-w-6xl mx-auto">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center gap-4 pt-4 pb-6 border-b border-[var(--border-gold)]/40">
        <div className="inline-flex items-center space-x-2 bg-[#d4af37]/15 border border-[#d4af37]/40 px-3.5 py-1 rounded-full text-xs font-mono text-[#d4af37] tracking-wider uppercase">
          <Shield className="w-3.5 h-3.5" />
          <span>Kurukshetra 13th Day Research Laboratory</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black font-serif tracking-wide text-[#f5f0e8] uppercase">
          CHAKRAFORGE
        </h1>

        <p className="text-sm md:text-lg text-[#d4af37] font-serif max-w-2xl leading-relaxed">
          Chakravyūha: A 3D Multi-Agent Strategic Coordination Simulator Under Incomplete Information
        </p>

        <p className="text-xs md:text-sm text-[#a89f91] max-w-3xl leading-relaxed font-sans">
          Bridging the 13th day of the Mahābhārata war with modern computational science. Investigate how asymmetric information, communication bottlenecks, and dynamic rotating labyrinths govern autonomous multi-agent survival and coordination.
        </p>

        {/* PRIMARY CALL-TO-ACTION BUTTON */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-3">
          <button
            onClick={onEnterSimulator}
            className="btn-gold py-3.5 px-8 rounded-xl font-serif font-bold text-sm tracking-wider uppercase flex items-center space-x-3 shadow-xl hover:scale-105 transition-transform"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>ENTER 3D CHAKRAVYŪHA SIMULATOR</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onNavigateToMahabharata}
            className="btn-dark py-3.5 px-6 rounded-xl font-serif text-xs tracking-wider flex items-center space-x-2 text-[#d4af37]"
          >
            <Scroll className="w-4 h-4" />
            <span>Mahābhārata Historical Source</span>
          </button>
        </div>
      </section>

      {/* QUICK LAUNCH HISTORICAL & RESEARCH SCENARIO PRESETS */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <h2 className="text-base font-bold font-serif text-[#f5f0e8] tracking-wider uppercase">
              Launch Scenario Presets
            </h2>
          </div>
          <span className="text-xs text-[#a89f91]">Click any preset to launch immediately in 3D</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Preset 1: Abhimanyu Dilemma */}
          <div
            onClick={() =>
              onSelectPresetAndEnter({
                strategy: 'GREEDY',
                informationLevel: 'LIMITED',
                communicationLevel: 'NONE',
                environmentDynamics: 'HIGHLY_DYNAMIC',
                formationComplexity: 'HIGH',
                ringCount: 7,
                agentCount: 1
              })
            }
            className="glass-panel p-4 rounded-xl border border-[#e74c3c]/40 hover:border-[#e74c3c] bg-[#22100d]/60 hover:bg-[#2e1511]/80 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#e74c3c] font-bold mb-2">
                <span>🏹 13th Day Archetype</span>
                <span className="text-[10px] bg-[#e74c3c]/20 px-1.5 py-0.5 rounded">HISTORICAL</span>
              </div>
              <h3 className="font-serif font-bold text-sm text-[#f5f0e8] group-hover:text-[#e74c3c] transition-colors">
                Abhimanyu Dilemma
              </h3>
              <p className="text-[11px] text-[#a89f91] mt-1.5 leading-snug">
                Single vanguard unit penetrating 7 rotating concentric rings under severe fog of war with 0 rear guard communication.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-[var(--border-gold)]/20 text-[10px] font-mono text-[#e74c3c] flex items-center justify-between">
              <span>Launch 1 Unit • 7 Rings</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Preset 2: Coordinated Swarm */}
          <div
            onClick={() =>
              onSelectPresetAndEnter({
                strategy: 'COORDINATED',
                informationLevel: 'PARTIAL',
                communicationLevel: 'NORMAL',
                environmentDynamics: 'DYNAMIC',
                formationComplexity: 'MEDIUM',
                ringCount: 6,
                agentCount: 6
              })
            }
            className="glass-panel p-4 rounded-xl border border-[#2ecc71]/40 hover:border-[#2ecc71] bg-[#0d2218]/60 hover:bg-[#122e21]/80 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#2ecc71] font-bold mb-2">
                <span>🛡️ Decentralized MAS</span>
                <span className="text-[10px] bg-[#2ecc71]/20 px-1.5 py-0.5 rounded">COORDINATED</span>
              </div>
              <h3 className="font-serif font-bold text-sm text-[#f5f0e8] group-hover:text-[#2ecc71] transition-colors">
                Pandava Swarm Intelligence
              </h3>
              <p className="text-[11px] text-[#a89f91] mt-1.5 leading-snug">
                6 coordinating units sharing gate discovery packets in real time with flocking anti-congestion separation.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-[var(--border-gold)]/20 text-[10px] font-mono text-[#2ecc71] flex items-center justify-between">
              <span>Launch 6 Units • Swarm</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Preset 3: Full Omniscience */}
          <div
            onClick={() =>
              onSelectPresetAndEnter({
                strategy: 'SHORTEST_PATH',
                informationLevel: 'FULL',
                communicationLevel: 'HIGH',
                environmentDynamics: 'SLOW',
                formationComplexity: 'MEDIUM',
                ringCount: 5,
                agentCount: 4
              })
            }
            className="glass-panel p-4 rounded-xl border border-[#3498db]/40 hover:border-[#3498db] bg-[#0d1a29]/60 hover:bg-[#122438]/80 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#3498db] font-bold mb-2">
                <span>👁️ Global Visibility</span>
                <span className="text-[10px] bg-[#3498db]/20 px-1.5 py-0.5 rounded">A* CORRIDORS</span>
              </div>
              <h3 className="font-serif font-bold text-sm text-[#f5f0e8] group-hover:text-[#3498db] transition-colors">
                Full Omniscience Benchmark
              </h3>
              <p className="text-[11px] text-[#a89f91] mt-1.5 leading-snug">
                Theoretical optimum. Omniscient agents targeting open gates using global navmesh shortest-path A* routing.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-[var(--border-gold)]/20 text-[10px] font-mono text-[#3498db] flex items-center justify-between">
              <span>Launch 4 Units • Omniscient</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Preset 4: Stochastic Brownian Baseline */}
          <div
            onClick={() =>
              onSelectPresetAndEnter({
                strategy: 'RANDOM',
                informationLevel: 'LIMITED',
                communicationLevel: 'NONE',
                environmentDynamics: 'DYNAMIC',
                formationComplexity: 'MEDIUM',
                ringCount: 4,
                agentCount: 4
              })
            }
            className="glass-panel p-4 rounded-xl border border-[#d4af37]/40 hover:border-[#d4af37] bg-[#221a10]/60 hover:bg-[#2d2215]/80 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#d4af37] font-bold mb-2">
                <span>🎲 Stochastic Drift</span>
                <span className="text-[10px] bg-[#d4af37]/20 px-1.5 py-0.5 rounded">BASELINE</span>
              </div>
              <h3 className="font-serif font-bold text-sm text-[#f5f0e8] group-hover:text-[#d4af37] transition-colors">
                Random Brownian Walk
              </h3>
              <p className="text-[11px] text-[#a89f91] mt-1.5 leading-snug">
                Pure random direction sampling to measure baseline chance of barrier penetration without intelligent heuristics.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-[var(--border-gold)]/20 text-[10px] font-mono text-[#d4af37] flex items-center justify-between">
              <span>Launch 4 Units • Baseline</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW THE SIMULATION WORKS (STEP-BY-STEP BREAKDOWN) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-[#d4af37]" />
          <h2 className="text-base font-bold font-serif text-[#f5f0e8] tracking-wider uppercase">
            How the Simulation Engine Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
          {/* Step 1 */}
          <div className="glass-panel p-4 rounded-xl flex flex-col gap-2 border border-[var(--border-gold)]/30">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] font-bold font-mono text-sm">
              01
            </div>
            <h3 className="font-serif font-bold text-sm text-[#f5f0e8] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#d4af37]" /> Dynamic Concentric Rings
            </h3>
            <p className="text-[#a89f91] text-[11px] leading-relaxed">
              2 to 8 concentric circular walls with alternating angular velocities. Dynamic gates cycle between OPEN and CLOSED states based on periodic sinusoidal transitions, creating moving bottlenecks.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-4 rounded-xl flex flex-col gap-2 border border-[var(--border-gold)]/30">
            <div className="w-8 h-8 rounded-lg bg-[#00f2ff]/20 flex items-center justify-center text-[#00f2ff] font-bold font-mono text-sm">
              02
            </div>
            <h3 className="font-serif font-bold text-sm text-[#f5f0e8] flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#00f2ff]" /> Incomplete Information & Fog
            </h3>
            <p className="text-[#a89f91] text-[11px] leading-relaxed">
              Each unit perceives the world through a bounded sensory horizon (Full = Global, Partial = 12m radius, Limited = 6m radius). Agents must remember past gate observations and react to stale information.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-4 rounded-xl flex flex-col gap-2 border border-[var(--border-gold)]/30">
            <div className="w-8 h-8 rounded-lg bg-[#2ecc71]/20 flex items-center justify-center text-[#2ecc71] font-bold font-mono text-sm">
              03
            </div>
            <h3 className="font-serif font-bold text-sm text-[#f5f0e8] flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-[#2ecc71]" /> Multi-Agent Communication
            </h3>
            <p className="text-[#a89f91] text-[11px] leading-relaxed">
              Teammates transmit packets (Gate Blocked, Gate Opened, Congestion Alert) across 3D bezier photon arcs with transmission ranges, latency queues, and step cooldown budgets.
            </p>
          </div>
        </div>

        {/* Explainable AI & Coordination Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans mt-1">
          <div className="glass-panel p-4 rounded-xl flex flex-col gap-2 border border-[var(--border-gold)]/30">
            <h3 className="font-serif font-bold text-sm text-[#f5f0e8] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#f1c40f]" /> Explainable AI Decision Engine
            </h3>
            <p className="text-[#a89f91] text-[11px] leading-relaxed">
              Click any warrior unit in 3D at any time to open the **Agent Inspector**. The simulation exposes the exact natural-language rationale (*"Why did this agent move?"*), sensory buffer, and factor weight breakdown.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-xl flex flex-col gap-2 border border-[var(--border-gold)]/30">
            <h3 className="font-serif font-bold text-sm text-[#f5f0e8] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#d4af37]" /> Formal Coordination Score (Cs)
            </h3>
            <p className="text-[#a89f91] text-[11px] leading-relaxed">
              Every trial generates actual reproducible metrics: Success Rate S, Movement Efficiency η, Collision Penalties P_coll, Group Cohesion Γ, and Comm Overhead according to our formal published formula.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-xl glass-panel border border-[var(--border-gold)]">
        <div>
          <h3 className="font-serif font-bold text-sm text-[#f5f0e8]">Ready to explore the 3D battlefield?</h3>
          <p className="text-xs text-[#a89f91] mt-0.5">Orbit, zoom, inspect autonomous units, and run Monte-Carlo benchmarks.</p>
        </div>
        <button
          onClick={onEnterSimulator}
          className="btn-gold py-2.5 px-6 rounded-lg font-serif font-bold text-xs tracking-wider uppercase flex items-center space-x-2"
        >
          <span>Launch 3D Simulation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
