import React from 'react';
import { WarParticles } from '../ui/WarParticles';
import { Cpu, ArrowRight, Play, Compass, Shuffle, Target, Navigation, Users } from 'lucide-react';
import { StrategyType } from '../../types/simulation';

interface AgentMechanicsPageProps {
  onEnterSimulatorWithStrategy?: (strategy: StrategyType) => void;
}

interface StrategyItem {
  id: StrategyType;
  name: string;
  tagline: string;
  purpose: string;
  decisionPrinciple: string;
  researchRole: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STRATEGIES: StrategyItem[] = [
  {
    id: 'RANDOM',
    name: 'Random',
    tagline: 'Random wandering',
    purpose: 'Baseline for comparison.',
    decisionPrinciple: 'Moves in random directions without remembering past paths.',
    researchRole: 'Shows that escaping the maze by pure chance is nearly impossible.',
    icon: Shuffle
  },
  {
    id: 'GREEDY',
    name: 'Greedy',
    tagline: 'Direct approach',
    purpose: 'Moves toward the objective using local information.',
    decisionPrinciple: 'Always moves straight toward the center of the formation.',
    researchRole: 'Shows how moving straight ahead fails when traps and moving walls block the path.',
    icon: Target
  },
  {
    id: 'SHORTEST_PATH',
    name: 'Shortest Path',
    tagline: 'Smart pathfinding',
    purpose: 'Uses available navigation structure.',
    decisionPrinciple: 'Finds the shortest path through known open gates.',
    researchRole: 'Shows what happens when the maze moves faster than the agent can follow the path.',
    icon: Navigation
  },
  {
    id: 'COORDINATED',
    name: 'Coordinated',
    tagline: 'Team communication',
    purpose: 'Uses shared information and communication.',
    decisionPrinciple: 'Uses messages from teammates to share information and help each other.',
    researchRole: 'Shows how working together helps overcome a lack of information in a moving maze.',
    icon: Users
  }
];

export const AgentMechanicsPage: React.FC<AgentMechanicsPageProps> = ({ onEnterSimulatorWithStrategy }) => {
  return (
    <div className="w-full bg-[#0a0705] text-[#f5f1eb] min-h-screen py-20 lg:py-32 relative">
      <WarParticles />
      <div className="page-container space-y-16 lg:space-y-24 relative z-10">
        {/* Header */}
        <header className="space-y-6 border-b border-[#2d2218]/50 pb-12 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#c09f58]/10 border border-[#c09f58]/30 text-xs font-mono text-[#c09f58] uppercase tracking-widest shadow-[0_0_15px_rgba(192,159,88,0.15)]">
            <Cpu className="w-4 h-4" />
            <span>Agent AI • Decision Policies</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f5f1eb] via-[#d4af37] to-[#c09f58] drop-shadow-md">
            Agent Decision Strategies
          </h1>
          <p className="text-lg text-[#a89b8c] max-w-3xl leading-relaxed">
            Four comparative decision policies evaluating how agents navigate, adapt, or become isolated inside dynamic rotating formations.
          </p>
        </header>

        {/* Four Clean Strategy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {STRATEGIES.map((strat) => {
            const Icon = strat.icon;
            return (
              <div
                key={strat.id}
                className="p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-[#16100b] to-[#0a0705] border border-[#2d2218] flex flex-col justify-between space-y-8 shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:border-[#d4af37]/40 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] transition-all duration-500 hover:-translate-y-1 group"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-[#221810] pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-4 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] group-hover:bg-[#d4af37]/20 transition-colors shadow-inner">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-serif font-medium text-[#f5f1eb] group-hover:text-[#ffdfc2] transition-colors">{strat.name}</h2>
                        <span className="text-[11px] font-mono text-[#8e8376] tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">{strat.tagline}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 text-sm">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#c09f58] block mb-1 opacity-80">
                        Purpose & Mechanism
                      </span>
                      <p className="text-[#c5bcb1] leading-relaxed"><strong className="text-[#d4af37] font-normal">{strat.purpose}</strong> {strat.decisionPrinciple}</p>
                    </div>

                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#c09f58] block mb-1 opacity-80">
                        Research Role
                      </span>
                      <p className="text-[#a89b8c] leading-relaxed italic border-l-2 border-[#d4af37]/30 pl-4 py-1">{strat.researchRole}</p>
                    </div>
                  </div>
                </div>

                {onEnterSimulatorWithStrategy && (
                  <button
                    onClick={() => onEnterSimulatorWithStrategy(strat.id)}
                    className="w-full py-4 px-4 rounded-xl border border-[#d4af37]/30 text-[#d4af37] text-xs font-mono uppercase tracking-wider hover:bg-[#d4af37]/10 hover:border-[#d4af37]/50 transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] mt-4"
                  >
                    <span>Run {strat.name} Policy</span>
                    <Play className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Cognitive Execution Cycle Overview */}
        <section className="space-y-4 pt-6 border-t border-[#221810]">
          <h2 className="text-xl font-serif text-[#f5f1eb]">Decision Cycle</h2>
          <p className="text-sm text-[#a89b8c] leading-relaxed max-w-3xl">
            Each simulation tick, agents execute a four-phase cycle: 
            <strong> Perception</strong> (seeing the local area), 
            <strong> Knowledge Update</strong> (processing messages from teammates), 
            <strong> Decision</strong> (choosing where to move), and 
            <strong> Action</strong> (steering and avoiding collisions).
          </p>
        </section>
      </div>
    </div>
  );
};
