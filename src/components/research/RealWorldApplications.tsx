import React, { useState } from 'react';
import {
  Bot,
  Compass,
  Radio,
  Network,
  ArrowRight,
  ShieldAlert,
  Layers,
  Info
} from 'lucide-react';
import { WarParticles } from '../ui/WarParticles';

export type ConceptualDomain = 'ROBOTICS' | 'SEARCH_NAVIGATION' | 'DISTRIBUTED_COMM' | 'TEAM_RESILIENCE';

interface DomainContent {
  title: string;
  tagline: string;
  analogy: string;
  strategicPattern: string;
  computationalProblem: string;
  relevance: string;
  exampleScenario: string;
}

const DOMAIN_DATA: Record<ConceptualDomain, DomainContent> = {
  ROBOTICS: {
    title: 'Robotics & Area Security',
    tagline: 'Teams of robots working together to guard an area',
    analogy: 'Layered perimeter defense and concentric moving agent cohorts',
    strategicPattern: 'Robot teams acting independently to guard a changing border and push out intruders.',
    computationalProblem: 'How do robots with limited vision prevent break-ins without relying on a single leader, especially when communication is slow?',
    relevance: 'In robot systems like drone patrols and security convoys, individual robots must adjust their positions without overloading the communication network.',
    exampleScenario: 'Security rovers patrolling a factory group together to surround an intruder while keeping the rest of the area safe.'
  },
  SEARCH_NAVIGATION: {
    title: 'Search & Rescue in Unknown Areas',
    tagline: 'Finding a path when the way out is unknown',
    analogy: 'Entering a maze knowing how to get in, but not how to get out',
    strategicPattern: 'An explorer enters a changing maze. As the maze shifts, the paths they used to get in close behind them.',
    computationalProblem: 'Making decisions with incomplete information in a changing environment, where just moving forward is often a trap.',
    relevance: 'Robotic search-and-rescue teams entering collapsed buildings or caves face similar traps where entrances close and maps become useless.',
    exampleScenario: 'Subterranean exploration drones must balance exploring deeper with making sure they have a safe path out.'
  },
  DISTRIBUTED_COMM: {
    title: 'Teamwork with Bad Communication',
    tagline: 'Working together when communication lines are broken or slow',
    analogy: 'Severed rear-guard reinforcement lines and isolated lead elements',
    strategicPattern: 'A lead explorer relies on backup support. An obstacle breaks their communication line, leaving the leader isolated.',
    computationalProblem: 'When messages take too long to send, team members make different decisions and stop working together.',
    relevance: 'Autonomous satellite swarms and underwater robots must detect when they lose contact and switch from teamwork to survival mode.',
    exampleScenario: 'Underwater robots tracking oceanic plumes lose communication with the mothership and decide to hold their position instead of pushing further.'
  },
  TEAM_RESILIENCE: {
    title: 'Team Resilience & Bottlenecks',
    tagline: 'Studying how complex teams completely break down',
    analogy: 'Single-point structural vulnerability where a single actor halts entire reinforcement column',
    strategicPattern: 'A wide path is controlled by a narrow bottleneck. Blocking this bottleneck causes the entire team\'s plan to fail.',
    computationalProblem: 'Analyzing weak points. When one important path is blocked, the whole system fails.',
    relevance: 'Logistics pipelines, hospital evacuation routes, and cloud computing networks are very fragile when important bridge connections are blocked.',
    exampleScenario: 'Emergency evacuation plans where a blocked bridge strands groups of people in high-risk zones.'
  }
};

export const RealWorldApplications: React.FC<{
  onLaunchSimulatorWithPreset?: (preset: 'A2AD' | 'ZEROTRUST' | 'SWARM') => void;
}> = () => {
  const [activeDomain, setActiveDomain] = useState<ConceptualDomain>('ROBOTICS');
  const domain = DOMAIN_DATA[activeDomain];

  return (
    <div className="w-full bg-[#0a0705] text-[#f5f1eb] min-h-full py-8 lg:py-10 relative">
      <WarParticles />
      <div className="page-container flex flex-col gap-6 lg:gap-8 relative z-10">
        {/* Academic Page Header */}
        <header className="space-y-4 border-b border-[#2d2218]/50 pb-6 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#c09f58]/10 border border-[#c09f58]/30 text-xs font-mono text-[#c09f58] uppercase tracking-widest shadow-[0_0_15px_rgba(192,159,88,0.15)]">
            <Network className="w-4 h-4" />
            <span>Multi-Agent Systems • Conceptual Analogues</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f5f1eb] via-[#d4af37] to-[#c09f58] drop-shadow-md">
            Contemporary Relevance
          </h1>
          <p className="text-lg text-[#a89b8c] max-w-3xl leading-relaxed">
            CHAKRAFORGE explores a core problem for teams: how they work together, adapt, or fail when they don't have all the information, lose communication, or face a changing environment.
          </p>
        </header>

        {/* Essential Academic Integrity Disclaimer */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#16100b] to-[#0c0806] border-l-4 border-l-[#d4af37] border border-[#2d2218] text-[#c5bcb1] text-base leading-relaxed shadow-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-shadow duration-500">
          <div className="flex items-center space-x-3 text-[#d4af37] font-medium font-mono uppercase tracking-wider text-sm mb-2">
            <Info className="w-5 h-5" />
            <span>Research Interpretation & Disclaimer</span>
          </div>
          <p className="opacity-90">
            The story of the Chakravyūha provides a great example of a team struggling with missing information. We don't claim the ancient text invented modern robotics or military strategies. Instead, we use this famous story to build a simulation showing timeless problems: moving as a group, dealing with missing information, and relying on vulnerable backup.
          </p>
        </div>

        {/* Domain Selection Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveDomain('ROBOTICS')}
            className={`p-4 min-h-[100px] flex flex-col items-center justify-center rounded-lg text-center transition-all border ${
              activeDomain === 'ROBOTICS'
                ? 'bg-[#1b140e] border-[#c09f58] text-[#f5f1eb] shadow-lg'
                : 'bg-[#110c08] border-[#241a12] text-[#8e8376] hover:text-[#c5bcb1] hover:border-[#38281c]'
            }`}
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Bot className="w-5 h-5 text-[#c09f58]" />
              <span className="text-sm font-mono font-medium">01. Robotics</span>
            </div>
            <div className="text-base font-serif font-medium leading-snug">Perimeter Control</div>
          </button>

          <button
            onClick={() => setActiveDomain('SEARCH_NAVIGATION')}
            className={`p-4 min-h-[100px] flex flex-col items-center justify-center rounded-lg text-center transition-all border ${
              activeDomain === 'SEARCH_NAVIGATION'
                ? 'bg-[#1b140e] border-[#c09f58] text-[#f5f1eb] shadow-lg'
                : 'bg-[#110c08] border-[#241a12] text-[#8e8376] hover:text-[#c5bcb1] hover:border-[#38281c]'
            }`}
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Compass className="w-5 h-5 text-[#c09f58]" />
              <span className="text-sm font-mono font-medium">02. Navigation</span>
            </div>
            <div className="text-base font-serif font-medium leading-snug">Autonomous Search</div>
          </button>

          <button
            onClick={() => setActiveDomain('DISTRIBUTED_COMM')}
            className={`p-4 min-h-[100px] flex flex-col items-center justify-center rounded-lg text-center transition-all border ${
              activeDomain === 'DISTRIBUTED_COMM'
                ? 'bg-[#1b140e] border-[#c09f58] text-[#f5f1eb] shadow-lg'
                : 'bg-[#110c08] border-[#241a12] text-[#8e8376] hover:text-[#c5bcb1] hover:border-[#38281c]'
            }`}
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Radio className="w-5 h-5 text-[#c09f58]" />
              <span className="text-sm font-mono font-medium">03. Comm</span>
            </div>
            <div className="text-base font-serif font-medium leading-snug">Latency & Cutoffs</div>
          </button>

          <button
            onClick={() => setActiveDomain('TEAM_RESILIENCE')}
            className={`p-4 min-h-[100px] flex flex-col items-center justify-center rounded-lg text-center transition-all border ${
              activeDomain === 'TEAM_RESILIENCE'
                ? 'bg-[#1b140e] border-[#c09f58] text-[#f5f1eb] shadow-lg'
                : 'bg-[#110c08] border-[#241a12] text-[#8e8376] hover:text-[#c5bcb1] hover:border-[#38281c]'
            }`}
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Network className="w-5 h-5 text-[#c09f58]" />
              <span className="text-sm font-mono font-medium">04. Team</span>
            </div>
            <div className="text-base font-serif font-medium leading-snug">Chokepoint Bottlenecks</div>
          </button>
        </div>

        {/* Selected Domain Editorial Content */}
        <section className="space-y-8 bg-[#120d09] p-8 md:p-12 rounded-2xl border border-[#261b13] shadow-lg mt-8">
          <div className="space-y-4 border-b border-[#2d2016] pb-8">
            <span className="text-sm font-mono text-[#c09f58] uppercase tracking-wider block">Conceptual Analogy</span>
            <h2 className="text-3xl font-serif text-[#f5f1eb]">{domain.title}</h2>
            <p className="text-base text-[#a89b8c] max-w-3xl">{domain.tagline}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider text-[#8e8376] mb-3">Strategic Pattern</h3>
                <p className="text-base text-[#d4cbbf] leading-relaxed">
                  {domain.strategicPattern}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider text-[#8e8376] mb-3 mt-4">Computational Problem</h3>
                <p className="text-base text-[#d4cbbf] leading-relaxed">
                  {domain.computationalProblem}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-wider text-[#8e8376] mb-3">Modern Relevance</h3>
                <p className="text-base text-[#d4cbbf] leading-relaxed">
                  {domain.relevance}
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#18110b] border border-[#332317] space-y-3 mt-4">
                <span className="text-xs font-mono text-[#c09f58] uppercase tracking-wider block">Example System</span>
                <p className="text-sm text-[#a89b8c] leading-relaxed">
                  {domain.exampleScenario}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Universal Core Themes */}
        <section className="space-y-6 pt-4">
          <h2 className="text-xl font-serif text-[#f5f1eb]">Underlying Coordination Themes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-[#110c08] border border-[#221810] space-y-3">
              <Layers className="w-5 h-5 text-[#c09f58]" />
              <h3 className="text-base font-serif text-[#f5f1eb]">Information Asymmetry</h3>
              <p className="text-xs text-[#8e8376] leading-relaxed">
                Agents operating with localized sensor cones cannot observe non-local state transitions, leading to myopic local optimization that degrades global team survivability.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-[#110c08] border border-[#221810] space-y-3">
              <Radio className="w-5 h-5 text-[#c09f58]" />
              <h3 className="text-base font-serif text-[#f5f1eb]">Support Dependency</h3>
              <p className="text-xs text-[#8e8376] leading-relaxed">
                Forward operations predicated on rearward reinforcement collapse when the communication corridor is degraded, forcing a critical phase transition from cooperative mission to isolated survival.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-[#110c08] border border-[#221810] space-y-3">
              <ShieldAlert className="w-5 h-5 text-[#c09f58]" />
              <h3 className="text-base font-serif text-[#f5f1eb]">Topological Traps</h3>
              <p className="text-xs text-[#8e8376] leading-relaxed">
                Dynamic environments where paths are non-reciprocal: actions that permit ingress alter the graph structure such that egress requires different knowledge or cooperation states.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
