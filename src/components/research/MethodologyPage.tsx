import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, ArrowDown, Activity, Sparkles, BookOpen } from 'lucide-react';
import { WarParticles } from '../ui/WarParticles';

export const MethodologyPage: React.FC = () => {
  const [showMathDetails, setShowMathDetails] = useState<boolean>(false);

  return (
    <div className="w-full bg-[#0a0705] text-[#f5f1eb] min-h-full py-8 lg:py-10 relative">
      <WarParticles />
      <div className="page-container flex flex-col gap-6 lg:gap-8 relative z-10">
        {/* Monograph Header */}
        <header className="space-y-4 border-b border-[#2d2218]/50 pb-6 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#c09f58]/10 border border-[#c09f58]/30 text-xs font-mono text-[#c09f58] uppercase tracking-widest shadow-[0_0_15px_rgba(192,159,88,0.15)]">
            <FileText className="w-4 h-4" />
            <span>Research Methodology • Computational Pipeline</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f5f1eb] via-[#d4af37] to-[#c09f58] drop-shadow-md">
            System Architecture & Methodology
          </h1>
          <p className="text-lg text-[#a89b8c] max-w-3xl leading-relaxed">
            A visual overview of how the historical battle story is turned into a working 3D simulation, from the initial idea to the final test.
          </p>
        </header>

        {/* PAPER PIPELINE VISUAL SUMMARY (Single Clean Diagram) */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-serif text-[#f5f1eb] flex items-center gap-4">
            <span className="w-12 h-[1px] bg-[#d4af37]/50 block"></span>
            Methodological Pipeline
            <span className="flex-1 h-[1px] bg-gradient-to-r from-[#d4af37]/50 to-transparent block"></span>
          </h2>
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#16100b] to-[#0a0705] border border-[#2d2218] space-y-8 shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Stage 1: Foundation */}
              <div className="space-y-4 p-8 rounded-2xl bg-[#120d09]/80 backdrop-blur-sm border border-[#261b13] hover:border-[#d4af37]/30 hover:bg-[#1a130d] transition-all duration-300 group h-full flex flex-col">
                <div className="flex items-center space-x-3 text-sm font-mono text-[#c09f58]">
                  <span className="p-2 rounded-lg bg-[#d4af37]/10 group-hover:bg-[#d4af37]/20 transition-colors">01</span>
                  <span className="h-px bg-gradient-to-r from-[#d4af37]/50 to-transparent flex-1"></span>
                </div>
                <h3 className="text-xl font-serif font-medium text-[#f5f1eb] group-hover:text-[#d4af37] transition-colors">Research Question</h3>
                <p className="text-base text-[#8e8376] leading-relaxed flex-1">
                  How does limited information and broken communication affect a team trying to navigate a moving maze?
                </p>
              </div>

              {/* Stage 2: System Model */}
              <div className="space-y-4 p-8 rounded-2xl bg-[#120d09]/80 backdrop-blur-sm border border-[#261b13] hover:border-[#d4af37]/30 hover:bg-[#1a130d] transition-all duration-300 group h-full flex flex-col">
                <div className="flex items-center space-x-3 text-sm font-mono text-[#c09f58]">
                  <span className="p-2 rounded-lg bg-[#d4af37]/10 group-hover:bg-[#d4af37]/20 transition-colors">02</span>
                  <span className="h-px bg-gradient-to-r from-[#d4af37]/50 to-transparent flex-1"></span>
                </div>
                <h3 className="text-xl font-serif font-medium text-[#f5f1eb] group-hover:text-[#d4af37] transition-colors">System Model & Agents</h3>
                <p className="text-base text-[#8e8376] leading-relaxed flex-1">
                  A team system with a forward scout (Abhimanyu), backup support (Pandavas), and an enemy blocking the entrance (Jayadratha).
                </p>
              </div>

              {/* Stage 3: Information & Comm */}
              <div className="space-y-4 p-8 rounded-2xl bg-[#120d09]/80 backdrop-blur-sm border border-[#261b13] hover:border-[#d4af37]/30 hover:bg-[#1a130d] transition-all duration-300 group h-full flex flex-col">
                <div className="flex items-center space-x-3 text-sm font-mono text-[#c09f58]">
                  <span className="p-2 rounded-lg bg-[#d4af37]/10 group-hover:bg-[#d4af37]/20 transition-colors">03</span>
                  <span className="h-px bg-gradient-to-r from-[#d4af37]/50 to-transparent flex-1"></span>
                </div>
                <h3 className="text-xl font-serif font-medium text-[#f5f1eb] group-hover:text-[#d4af37] transition-colors">Information & Comm Bus</h3>
                <p className="text-base text-[#8e8376] leading-relaxed flex-1">
                  The scout knows how to enter, but not how to exit. Team communication can be delayed, limited by distance, or completely blocked at the entrance.
                </p>
              </div>

              {/* Stage 4: Strategy Engine */}
              <div className="space-y-4 p-8 rounded-2xl bg-[#120d09]/80 backdrop-blur-sm border border-[#261b13] hover:border-[#d4af37]/30 hover:bg-[#1a130d] transition-all duration-300 group h-full flex flex-col">
                <div className="flex items-center space-x-3 text-sm font-mono text-[#c09f58]">
                  <span className="p-2 rounded-lg bg-[#d4af37]/10 group-hover:bg-[#d4af37]/20 transition-colors">04</span>
                  <span className="h-px bg-gradient-to-r from-[#d4af37]/50 to-transparent flex-1"></span>
                </div>
                <h3 className="text-xl font-serif font-medium text-[#f5f1eb] group-hover:text-[#d4af37] transition-colors">Decision Strategies</h3>
                <p className="text-base text-[#8e8376] leading-relaxed flex-1">
                  Four decision styles: Random wandering, direct approach, smart pathfinding, and team communication.
                </p>
              </div>

              {/* Stage 5: Environment */}
              <div className="space-y-4 p-8 rounded-2xl bg-[#120d09]/80 backdrop-blur-sm border border-[#261b13] hover:border-[#d4af37]/30 hover:bg-[#1a130d] transition-all duration-300 group h-full flex flex-col">
                <div className="flex items-center space-x-3 text-sm font-mono text-[#c09f58]">
                  <span className="p-2 rounded-lg bg-[#d4af37]/10 group-hover:bg-[#d4af37]/20 transition-colors">05</span>
                  <span className="h-px bg-gradient-to-r from-[#d4af37]/50 to-transparent flex-1"></span>
                </div>
                <h3 className="text-xl font-serif font-medium text-[#f5f1eb] group-hover:text-[#d4af37] transition-colors">Dynamic Environment</h3>
                <p className="text-base text-[#8e8376] leading-relaxed flex-1">
                  Spinning rings of enemies moving at different speeds, with changing openings and forces that push you off a straight path.
                </p>
              </div>

              {/* Stage 6: Experiment & Metrics */}
              <div className="space-y-4 p-8 rounded-2xl bg-[#120d09]/80 backdrop-blur-sm border border-[#261b13] hover:border-[#d4af37]/30 hover:bg-[#1a130d] transition-all duration-300 group h-full flex flex-col">
                <div className="flex items-center space-x-3 text-sm font-mono text-[#c09f58]">
                  <span className="p-2 rounded-lg bg-[#d4af37]/10 group-hover:bg-[#d4af37]/20 transition-colors">06</span>
                  <span className="h-px bg-gradient-to-r from-[#d4af37]/50 to-transparent flex-1"></span>
                </div>
                <h3 className="text-xl font-serif font-medium text-[#f5f1eb] group-hover:text-[#d4af37] transition-colors">Simulation & Metrics</h3>
                <p className="text-base text-[#8e8376] leading-relaxed flex-1">
                  Running the simulation many times to measure how far they get, how long they are trapped, and if they survive.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PROGRESSIVE DISCLOSURE: FORMAL MATHEMATICS ACCORDION */}
        <section className="flex flex-col gap-4">
          <button
            onClick={() => setShowMathDetails(!showMathDetails)}
            className="w-full p-5 rounded-lg bg-[#120d09] border border-[#261b13] flex items-center justify-between hover:border-[#38281c] transition-all text-left"
          >
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#c09f58] uppercase tracking-wider block">
                Technical Formulation (Expandable)
              </span>
              <h3 className="text-base font-serif text-[#f5f1eb]">
                POMDP Framework: ⟨S, A, T, R, Ω, O, γ⟩
              </h3>
            </div>
            <div className="text-[#8e8376]">
              {showMathDetails ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </div>
          </button>

          {showMathDetails && (
            <div className="p-6 rounded-lg bg-[#140e0a] border border-[#332317] flex flex-col gap-6 text-sm">
              <p className="text-xs text-[#a89b8c] leading-relaxed">
                The agent&apos;s decision problem inside the dynamic formation is modeled as a discrete-time Partially Observable Markov Decision Process (POMDP):
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 bg-[#0d0906] rounded border border-[#241a12] space-y-1">
                  <span className="text-[#c09f58]">State Space (S)</span>
                  <p className="text-[#8e8376] font-sans text-xs">
                    Continuous positions x, y, velocities, orientation, active ring layer, gate open/closed states, and health.
                  </p>
                </div>

                <div className="p-3 bg-[#0d0906] rounded border border-[#241a12] space-y-1">
                  <span className="text-[#c09f58]">Action Space (A)</span>
                  <p className="text-[#8e8376] font-sans text-xs">
                    Continuous steering velocity Δθ and forward acceleration Δv within kinematic limits.
                  </p>
                </div>

                <div className="p-3 bg-[#0d0906] rounded border border-[#241a12] space-y-1">
                  <span className="text-[#c09f58]">Transition Function (T)</span>
                  <p className="text-[#8e8376] font-sans text-xs">
                    P(s&apos; | s, a) combines agent kinematics with rotating layer boundaries and gate transitions.
                  </p>
                </div>

                <div className="p-3 bg-[#0d0906] rounded border border-[#241a12] space-y-1">
                  <span className="text-[#c09f58]">Observation (Ω, O)</span>
                  <p className="text-[#8e8376] font-sans text-xs">
                    Local sensory horizon r_vis ≤ 15m. Beyond this range, agent relies on prior beliefs and received peer messages.
                  </p>
                </div>

                <div className="p-3 bg-[#0d0906] rounded border border-[#241a12] space-y-1">
                  <span className="text-[#c09f58]">Reward Function (R)</span>
                  <p className="text-[#8e8376] font-sans text-xs">
                    +100 at center objective; -1 per timestep; -50 on boundary collision; -100 on agent elimination.
                  </p>
                </div>

                <div className="p-3 bg-[#0d0906] rounded border border-[#241a12] space-y-1">
                  <span className="text-[#c09f58]">Discount Factor (γ)</span>
                  <p className="text-[#8e8376] font-sans text-xs">
                    γ = 0.98, balancing near-term survival maneuvers with long-term objective attainment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SOURCE TO MODEL MAPPING */}
        <section className="flex flex-col gap-8 pt-12 border-t border-[#221810]">
          <h2 className="text-2xl font-serif text-[#f5f1eb]">Source → Model Mapping</h2>
          <div className="overflow-x-auto rounded-xl border border-[#2d2218] bg-[#120d09] shadow-lg">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-[#2d2218] bg-[#1a130d] text-[#c09f58] font-mono">
                  <th className="p-5 w-1/3 text-sm">Documented Source (Mahābhārata)</th>
                  <th className="p-5 w-1/3 text-sm">Strategic Interpretation</th>
                  <th className="p-5 w-1/3 text-sm">Computational Representation</th>
                </tr>
              </thead>
              <tbody className="text-[#a89b8c]">
                <tr className="border-b border-[#221810] hover:bg-[#16100b] transition-colors">
                  <td className="p-4">Abhimanyu knows entry but not exit</td>
                  <td className="p-4 text-[#8e8376]">Incomplete information</td>
                  <td className="p-4 text-[#f5f1eb]">Exit knowledge parameter (0% - 100%)</td>
                </tr>
                <tr className="border-b border-[#221810] hover:bg-[#16100b] transition-colors">
                  <td className="p-4">Supporting forces attempt to follow</td>
                  <td className="p-4 text-[#8e8376]">Coordination dependence</td>
                  <td className="p-4 text-[#f5f1eb]">Support agents communicating via radius</td>
                </tr>
                <tr className="border-b border-[#221810] hover:bg-[#16100b] transition-colors">
                  <td className="p-4">Jayadratha blocks support</td>
                  <td className="p-4 text-[#8e8376]">Support disruption</td>
                  <td className="p-4 text-[#f5f1eb]">Dynamic blocking mechanism / Boolean state</td>
                </tr>
                <tr className="border-b border-[#221810] hover:bg-[#16100b] transition-colors">
                  <td className="p-4">Abhimanyu becomes isolated</td>
                  <td className="p-4 text-[#8e8376]">Loss of coordination</td>
                  <td className="p-4 text-[#f5f1eb]">ISOLATED state tracking (comms severed)</td>
                </tr>
                <tr className="hover:bg-[#16100b] transition-colors">
                  <td className="p-4">Surrounding warriors engage him</td>
                  <td className="p-4 text-[#8e8376]">Multi-agent interaction</td>
                  <td className="p-4 text-[#f5f1eb]">Proximity-based engagement & elimination</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* MODEL ASSUMPTIONS & LIMITATIONS */}
        <section className="flex flex-col gap-8 pt-12 border-t border-[#221810]">
          <h2 className="text-2xl font-serif text-[#f5f1eb]">Model Assumptions & Limitations</h2>
          <div className="p-8 rounded-xl bg-[#140e0a] border border-[#332317] space-y-6 text-base text-[#a89b8c] shadow-lg">
            <ul className="list-disc list-outside ml-6 space-y-4 marker:text-[#c09f58]">
              <li><strong className="text-[#f5f1eb]">Geometric Abstraction:</strong> Historical spatial geometry is not precisely known. Formation geometry is a computational spiral/concentric ring representation.</li>
              <li><strong className="text-[#f5f1eb]">Agent Policies:</strong> Agent behavior is a simplified pathfinding algorithm, and combat is abstracted as collision/proximity events, not a physical reconstruction.</li>
              <li><strong className="text-[#f5f1eb]">Communication Modeling:</strong> Communication reliability is modeled probabilistically (0-100%). The historical text does not provide numerical simulation parameters.</li>
              <li><strong className="text-[#f5f1eb]">Research Scope:</strong> Experimental results describe the behavioral properties of this computational model and do not strictly reflect historical reality. Results depend heavily on selected simulation variables.</li>
            </ul>
          </div>
        </section>

        {/* EXPERIMENTAL RIGOR & REPRODUCIBILITY */}
        <section className="flex flex-col gap-6 pt-12 border-t border-[#221810]">
          <h2 className="text-2xl font-serif text-[#f5f1eb]">Experimental Reproducibility</h2>
          <p className="text-base text-[#a89b8c] leading-relaxed max-w-3xl bg-[#120d09] p-6 rounded-xl border border-[#2d2218]">
            All simulation runs execute against a deterministic pseudorandom seed. The decoupled simulation clock operates at 16 ticks per second (dt = 0.0625s), ensuring identical trajectory replication across independent browser sessions.
          </p>
        </section>
      </div>
    </div>
  );
};
