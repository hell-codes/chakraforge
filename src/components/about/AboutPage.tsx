import React from 'react';
import { Shield, Cpu, Sparkles, BookOpen, AlertTriangle, Users, Code } from 'lucide-react';
import { WarParticles } from '../ui/WarParticles';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full bg-[#0a0705] text-[#f5f1eb] min-h-screen py-20 lg:py-32 relative">
      <WarParticles />
      <div className="page-container space-y-16 lg:space-y-24 relative z-10">
        {/* Header */}
        <header className="space-y-6 border-b border-[#2d2218]/50 pb-12 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#c09f58]/10 border border-[#c09f58]/30 text-xs font-mono text-[#c09f58] uppercase tracking-widest shadow-[0_0_15px_rgba(192,159,88,0.15)]">
            <Shield className="w-4 h-4" />
            <span>Laboratory Overview • Academic Specification</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f5f1eb] via-[#d4af37] to-[#c09f58] drop-shadow-md">
            About CHAKRAFORGE
          </h1>
          <p className="text-lg text-[#a89b8c] max-w-3xl leading-relaxed">
            An interactive simulation exploring how teams coordinate, handle communication loss, and navigate moving obstacles, inspired by the 13th day of the Kurukṣetra war.
          </p>
        </header>

        {/* What it is & Why it exists */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
          <div className="p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-[#16100b] to-[#0a0705] border border-[#2d2218] space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:border-[#d4af37]/40 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] transition-all duration-500 hover:-translate-y-1 group cursor-default">
            <div className="w-14 h-14 rounded-full bg-[#d4af37]/10 flex items-center justify-center mb-4 group-hover:bg-[#d4af37]/20 transition-colors">
              <Sparkles className="w-7 h-7 text-[#d4af37]" />
            </div>
            <span className="text-sm font-mono text-[#d4af37] uppercase tracking-widest block opacity-80 group-hover:opacity-100 transition-opacity">
              What It Is
            </span>
            <h2 className="text-2xl font-serif font-medium text-[#f5f1eb] group-hover:text-[#ffdfc2] transition-colors">Interactive Historical Reconstruction</h2>
            <p className="text-base text-[#a89b8c] leading-relaxed">
              CHAKRAFORGE is an interactive 3D simulation that recreates the strategic movements of the Chakravyūha battle formation from the Mahābhārata. It combines visual storytelling with real team-based logic.
            </p>
          </div>

          <div className="p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-[#16100b] to-[#0a0705] border border-[#2d2218] space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.5)] hover:border-[#d4af37]/40 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] transition-all duration-500 hover:-translate-y-1 group cursor-default">
            <div className="w-14 h-14 rounded-full bg-[#d4af37]/10 flex items-center justify-center mb-4 group-hover:bg-[#d4af37]/20 transition-colors">
              <AlertTriangle className="w-7 h-7 text-[#d4af37]" />
            </div>
            <span className="text-sm font-mono text-[#d4af37] uppercase tracking-widest block opacity-80 group-hover:opacity-100 transition-opacity">
              Why It Exists
            </span>
            <h2 className="text-2xl font-serif font-medium text-[#f5f1eb] group-hover:text-[#ffdfc2] transition-colors">Understanding Team Breakdowns</h2>
            <p className="text-base text-[#a89b8c] leading-relaxed">
              The historical story presents a classic team problem: a forward scout relying on backup support, which is suddenly cut off by a bottleneck. CHAKRAFORGE turns this epic story into a visual simulation to see what happens when communication breaks down.
            </p>
          </div>
        </section>

        {/* Central Research Question */}
        <section 
          className="relative p-10 lg:p-16 rounded-3xl bg-gradient-to-b from-[#1a120c] to-[#0f0a07] border border-[#d4af37]/20 text-center space-y-8 shadow-xl overflow-hidden group hover:border-[#d4af37]/40 transition-colors duration-500"
          style={{ marginTop: '5rem' }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent"></div>
          <span className="inline-block px-5 py-2 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-sm font-mono text-[#d4af37] uppercase tracking-widest shadow-sm">
            Core Research Question
          </span>
          <blockquote className="text-2xl sm:text-3xl font-serif text-[#f5eedc] max-w-4xl mx-auto leading-relaxed drop-shadow-sm" style={{ textTransform: 'none' }}>
            &ldquo;How does limited information and broken communication affect the survival of a team navigating a moving, changing maze?&rdquo;
          </blockquote>
        </section>

        {/* The Research Gap */}
        <section style={{ marginTop: '6rem' }}>
          <h2 className="text-3xl font-serif text-[#f5f1eb] flex items-center gap-4 mb-10">
            <span className="w-16 h-[1px] bg-[#d4af37]/50 block"></span>
            The Research Gap
            <span className="flex-1 h-[1px] bg-gradient-to-r from-[#d4af37]/50 to-transparent block"></span>
          </h2>
          <div className="p-10 rounded-3xl bg-[#120d09]/80 backdrop-blur-sm border border-[#261b13] space-y-8 shadow-lg">
            <div className="space-y-6">
              <p className="text-xl text-[#a89b8c] leading-relaxed max-w-5xl" style={{ textTransform: 'none' }}>
                Existing research commonly studies multi-agent coordination, partial observability, and communication constraints.
              </p>
              <p className="text-xl text-[#a89b8c] leading-relaxed max-w-5xl" style={{ textTransform: 'none' }}>
                Existing Mahābhārata applications often focus on storytelling, games, or cultural visualization.
              </p>
            </div>
            <div className="p-8 rounded-xl bg-[#c09f58]/10 border border-[#c09f58]/30 shadow-inner mt-8">
              <p className="text-2xl font-serif text-[#f5f1eb] leading-relaxed" style={{ textTransform: 'none' }}>
                CHAKRAFORGE fills this gap as a computational web-based research prototype that uses a Mahābhārata-derived strategic scenario to experimentally study multi-agent coordination under incomplete information and configurable communication constraints.
              </p>
            </div>
          </div>
        </section>

        {/* Technology & Architecture */}
        <section style={{ marginTop: '6rem' }}>
          <h2 className="text-3xl font-serif text-[#f5f1eb] flex items-center gap-4 mb-10">
            <span className="w-12 h-[1px] bg-[#d4af37]/50 block"></span>
            Architecture & Technology
            <span className="flex-1 h-[1px] bg-gradient-to-r from-[#d4af37]/50 to-transparent block"></span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-6 min-h-[120px] flex flex-col justify-center items-center text-center rounded-2xl bg-[#120d09]/80 backdrop-blur-sm border border-[#261b13] hover:border-[#d4af37]/30 hover:bg-[#16100b] transition-all duration-300 group shadow-md">
              <span className="text-[#f5f1eb] font-bold block mb-2 text-lg group-hover:text-[#d4af37] transition-colors">React 19 & TypeScript</span>
              <span className="text-[#8e8376] text-sm">UI Architecture & Simulation State</span>
            </div>
            <div className="p-6 min-h-[120px] flex flex-col justify-center items-center text-center rounded-2xl bg-[#120d09]/80 backdrop-blur-sm border border-[#261b13] hover:border-[#d4af37]/30 hover:bg-[#16100b] transition-all duration-300 group shadow-md">
              <span className="text-[#f5f1eb] font-bold block mb-2 text-lg group-hover:text-[#d4af37] transition-colors">Three.js & R3F</span>
              <span className="text-[#8e8376] text-sm">60 FPS 3D Tactical Battlefield</span>
            </div>
            <div className="p-6 min-h-[120px] flex flex-col justify-center items-center text-center rounded-2xl bg-[#120d09]/80 backdrop-blur-sm border border-[#261b13] hover:border-[#d4af37]/30 hover:bg-[#16100b] transition-all duration-300 group shadow-md">
              <span className="text-[#f5f1eb] font-bold block mb-2 text-lg group-hover:text-[#d4af37] transition-colors">InstancedMesh Batching</span>
              <span className="text-[#8e8376] text-sm">GPU Batching for Ancient Armies</span>
            </div>
            <div className="p-6 min-h-[120px] flex flex-col justify-center items-center text-center rounded-2xl bg-[#120d09]/80 backdrop-blur-sm border border-[#261b13] hover:border-[#d4af37]/30 hover:bg-[#16100b] transition-all duration-300 group shadow-md">
              <span className="text-[#f5f1eb] font-bold block mb-2 text-lg group-hover:text-[#d4af37] transition-colors">Fixed Timestep Clock</span>
              <span className="text-[#8e8376] text-sm">16 ticks/sec Deterministic Loop</span>
            </div>
            <div className="p-6 min-h-[120px] flex flex-col justify-center items-center text-center rounded-2xl bg-[#120d09]/80 backdrop-blur-sm border border-[#261b13] hover:border-[#d4af37]/30 hover:bg-[#16100b] transition-all duration-300 group shadow-md">
              <span className="text-[#f5f1eb] font-bold block mb-2 text-lg group-hover:text-[#d4af37] transition-colors">POMDP Belief Engine</span>
              <span className="text-[#8e8376] text-sm">Partial Observability & Epistemics</span>
            </div>
            <div className="p-6 min-h-[120px] flex flex-col justify-center items-center text-center rounded-2xl bg-[#120d09]/80 backdrop-blur-sm border border-[#261b13] hover:border-[#d4af37]/30 hover:bg-[#16100b] transition-all duration-300 group shadow-md">
              <span className="text-[#f5f1eb] font-bold block mb-2 text-lg group-hover:text-[#d4af37] transition-colors">Monte Carlo Sweeps</span>
              <span className="text-[#8e8376] text-sm">Batch Multi-Trial Experimentation</span>
            </div>
          </div>
        </section>

        {/* Team, AI Assistance, Limitations & References */}
        <section 
          className="grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-[#221810]" 
          style={{ marginTop: '4rem', paddingTop: '4rem' }}
        >
          {/* Team & AI Declaration */}
          <div>
            <div>
              <span className="text-sm font-mono text-[#c09f58] uppercase tracking-wider block mb-4">
                Team & Context
              </span>
              <h3 className="text-2xl font-sans font-semibold text-[#f5f1eb] mb-4" style={{ textTransform: 'none' }}>CHAKRAFORGE Research Project</h3>
              <p className="text-lg font-sans text-[#8e8376] leading-relaxed" style={{ textTransform: 'none' }}>
                Developed as an interactive academic simulation for studying multi-agent coordination and epistemic logic.
              </p>
            </div>

            {/* Gap */}
            <div className="h-8 w-full block"></div>

            <div className="p-8 rounded-2xl bg-[#120d09] border border-[#261b13] shadow-lg">
              <div className="flex items-center space-x-3 text-sm font-mono text-[#c09f58] uppercase tracking-wider mb-6">
                <Sparkles className="w-5 h-5" />
                <span>AI Assistance Declaration</span>
              </div>
              <p className="text-base font-sans text-[#a89b8c] leading-relaxed" style={{ textTransform: 'none' }}>
                In compliance with academic honesty standards: LLM assistance was utilized for scaffolding code components and design iteration. All simulation architectures, mathematical formulations, textual citations, and epistemic criteria were designed, audited, and verified by human researchers.
              </p>
            </div>
          </div>

          {/* Limitations & References */}
          <div>
            <div>
              <div className="flex items-center space-x-3 text-sm font-mono text-[#e5a93b] uppercase tracking-wider mb-4">
                <AlertTriangle className="w-5 h-5" />
                <span>Research Limitations</span>
              </div>
              <p className="text-base font-sans text-[#8e8376] leading-relaxed" style={{ textTransform: 'none' }}>
                The continuous 2D/3D physics simulation abstracts complex human warfare into simplified kinematic agent dynamics. Textual Sanskrit sources describe tactical intentions and formations rather than Euclidean blueprints; geometry and rotation parameters serve as conceptual computational models.
              </p>
            </div>

            {/* Gap */}
            <div className="h-8 w-full block"></div>

            <div>
              <div className="flex items-center space-x-3 text-sm font-mono text-[#c09f58] uppercase tracking-wider mb-6">
                <BookOpen className="w-5 h-5" />
                <span>Primary References</span>
              </div>
              <ul className="text-base font-sans text-[#8e8376] space-y-4 leading-relaxed" style={{ textTransform: 'none' }}>
                <li>• <em className="text-[#d4cbbf]">The Mahābhārata of Krishna-Dwaipayana Vyasa</em>. Trans. Kisari Mohan Ganguli (Droṇa Parva).</li>
                <li>• Wooldridge, M. (2009). <em className="text-[#d4cbbf]">An Introduction to MultiAgent Systems</em>. John Wiley & Sons.</li>
                <li>• Kaelbling, L. P., et al. (1998). Planning in POMDPs. <em className="text-[#d4cbbf]">Artificial Intelligence</em>, 101(1-2).</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
