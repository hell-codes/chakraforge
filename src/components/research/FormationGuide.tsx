import React, { useState } from 'react';
import { WarParticles } from '../ui/WarParticles';
import { Layers, Shield, ArrowRight, Play, Info, Users, Compass } from 'lucide-react';

interface FormationGuideProps {
  onEnterSimulatorWithRings: (rings: number) => void;
}

export type FormationSector = 'OUTER' | 'MIDDLE' | 'INNER' | 'CENTRAL';

interface SectorInfo {
  id: FormationSector;
  name: string;
  sanskrit: string;
  layers: string;
  unitComposition: string;
  role: string;
  computationalModeling: string;
  historicalQualification: string;
  ringCount: number;
}

const SECTORS: Record<FormationSector, SectorInfo> = {
  OUTER: {
    id: 'OUTER',
    name: 'Outer Formation',
    sanskrit: 'बहिर्व्यूह (Bahirvyūha)',
    layers: 'Perimeter Boundary & Skirmish Screen',
    unitComposition: 'Infantry phalanxes, perimeter chariots, archers, and entrance sentry posts',
    role: 'Creates a wide defensive wall with tricky entry points. Guards fight approaching enemies, while the outer gates spin to make entering harder.',
    computationalModeling: 'Shown as a moving outer wall with guarded gates. Once someone enters, the wall spins so the entrance moves away from them.',
    historicalQualification: 'The Droṇa Parva describes a massive, multi-layered circular defense. While the epic lacks explicit Euclidean coordinates, the computational rings accurately abstract the immense depth and radial attrition required to pierce the perimeter.',
    ringCount: 7
  },
  MIDDLE: {
    id: 'MIDDLE',
    name: 'Middle Formation',
    sanskrit: 'मध्यव्यूह (Madhyavyūha)',
    layers: 'Intermediate Mobile Corridors & Chokepoints',
    unitComposition: 'Heavy cavalry squadrons, mobile archers, and armored spearmen',
    role: 'Acts as a maze to slow down and trap enemies. Soldiers move sideways to block attackers and cut off their communication with the backup team.',
    computationalModeling: 'Moving middle walls that spin at different speeds. Gates opening and closing act as traps where backup support gets cut off.',
    historicalQualification: 'The text narrates Abhimanyu breaking through successive defensive echelons commanded by distinct Kaurava generals. The rotating rings computationally model the shifting, non-linear nature of these mobile corridors.',
    ringCount: 5
  },
  INNER: {
    id: 'INNER',
    name: 'Inner Formation',
    sanskrit: 'अन्तर्व्यूह (Antarvyūha)',
    layers: 'Penultimate Compression Zone',
    unitComposition: 'Elite war chariots, armored elephant divisions, and veteran guard units',
    role: 'The deadliest area. Enemies who make it this far are attacked from all sides and have almost no way out.',
    computationalModeling: 'Fast-spinning inner walls with very narrow openings, designed to completely confuse and isolate the attacker.',
    historicalQualification: 'According to the epic, Abhimanyu was ultimately entrapped in the deepest echelon, facing simultaneous attacks from six Maharathis. This is modeled as a high-density, low-egress compression zone.',
    ringCount: 3
  },
  CENTRAL: {
    id: 'CENTRAL',
    name: 'Central Area',
    sanskrit: 'व्यूह गर्भ (Vyūha Garbha)',
    layers: 'Command Pavilion & Tactical Core',
    unitComposition: 'Supreme command pavilion, council guards, and standard-bearers',
    role: 'The final goal. The entire formation is built to protect this center.',
    computationalModeling: 'The center target that the warrior tries to reach.',
    historicalQualification: 'The "Garbha" (womb/core) of the Vyūha houses the supreme commanders and high-value targets, representing the ultimate strategic objective of the formation.',
    ringCount: 1
  }
};

export const FormationGuide: React.FC<FormationGuideProps> = ({ onEnterSimulatorWithRings }) => {
  const [activeSector, setActiveSector] = useState<FormationSector>('OUTER');
  const sector = SECTORS[activeSector];

  return (
    <div className="w-full bg-[#0a0705] text-[#f5f1eb] min-h-full py-8 lg:py-10 relative">
      <WarParticles />
      <div className="page-container flex flex-col gap-6 lg:gap-8 relative z-10">
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-[#2d2218]/50 pb-6 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#c09f58]/10 border border-[#c09f58]/30 text-xs font-mono text-[#c09f58] uppercase tracking-widest shadow-[0_0_15px_rgba(192,159,88,0.15)]">
            <Layers className="w-4 h-4" />
            <span>Formation Anatomy & Representation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f5f1eb] via-[#d4af37] to-[#c09f58] drop-shadow-md">
            How the Formation Is Represented
          </h1>
          <p className="text-lg text-[#a89b8c] max-w-3xl leading-relaxed">
            The historical texts describe a circular battle formation. The exact spatial geometry is not preserved as a modern map, so CHAKRAFORGE uses a computational layered representation.
          </p>
        </header>

        {/* Academic Qualification Note */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#16100b] to-[#0c0806] border-l-4 border-l-[#d4af37] border border-[#2d2218] text-[#c5bcb1] text-sm leading-relaxed space-y-3 shadow-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-shadow duration-500">
          <div className="flex items-center space-x-2 text-[#d4af37] font-medium font-mono uppercase tracking-wider text-xs">
            <Info className="w-4 h-4" />
            <span>Methodological Clarification</span>
          </div>
          <p className="opacity-90">
            Ancient texts describe battle formations using terms like wings, flanks, and centers, rather than exact geometry. In CHAKRAFORGE, we use rings as a simple way to simulate how the maze moves, blocks paths, and stops communication.
          </p>
        </div>

        {/* Interactive 4-Sector Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Visual Schematic Diagram */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-8 rounded-xl bg-[#120d09] border border-[#261b13] flex flex-col items-center justify-center">
              <span className="text-xs font-mono text-[#8e8376] uppercase tracking-wider mb-4">
                Formation Sector Schematic
              </span>

              <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  {/* Outer Sector Rings */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke={activeSector === 'OUTER' ? '#d4af37' : '#3d2b1f'}
                    strokeWidth={activeSector === 'OUTER' ? 3 : 1.5}
                    strokeDasharray="6 3"
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => setActiveSector('OUTER')}
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="76"
                    fill="none"
                    stroke={activeSector === 'OUTER' ? '#d4af37' : '#3d2b1f'}
                    strokeWidth={activeSector === 'OUTER' ? 2.5 : 1}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => setActiveSector('OUTER')}
                  />

                  {/* Middle Sector Rings */}
                  <circle
                    cx="100"
                    cy="100"
                    r="60"
                    fill="none"
                    stroke={activeSector === 'MIDDLE' ? '#d4af37' : '#3d2b1f'}
                    strokeWidth={activeSector === 'MIDDLE' ? 3 : 1.5}
                    strokeDasharray="4 2"
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => setActiveSector('MIDDLE')}
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="46"
                    fill="none"
                    stroke={activeSector === 'MIDDLE' ? '#d4af37' : '#3d2b1f'}
                    strokeWidth={activeSector === 'MIDDLE' ? 2.5 : 1}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => setActiveSector('MIDDLE')}
                  />

                  {/* Inner Sector Ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r="32"
                    fill="none"
                    stroke={activeSector === 'INNER' ? '#d4af37' : '#3d2b1f'}
                    strokeWidth={activeSector === 'INNER' ? 3 : 1.5}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => setActiveSector('INNER')}
                  />

                  {/* Central Command Core */}
                  <circle
                    cx="100"
                    cy="100"
                    r="14"
                    fill={activeSector === 'CENTRAL' ? '#d4af37' : '#6b4625'}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => setActiveSector('CENTRAL')}
                  />
                </svg>

                <div className="absolute text-[11px] font-mono text-[#f5f1eb] pointer-events-none tracking-wider">
                  CORE
                </div>
              </div>

              <div className="mt-6 text-xs text-center text-[#8e8376]">
                Viewing: <strong className="text-[#c09f58]">{sector.name}</strong>
              </div>
            </div>

            {/* Quick Sector Selector */}
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(SECTORS) as FormationSector[]).map((key) => {
                const s = SECTORS[key];
                return (
                  <button
                    key={key}
                    onClick={() => setActiveSector(key)}
                    className={`p-3 rounded-lg text-left border transition-all ${
                      activeSector === key
                        ? 'bg-[#1b140e] border-[#c09f58] text-[#f5f1eb]'
                        : 'bg-[#110c08] border-[#221810] text-[#8e8376] hover:text-[#c5bcb1]'
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#c09f58]">{s.sanskrit}</div>
                    <div className="text-xs font-serif font-medium mt-0.5">{s.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editorial Sector Details */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="p-8 rounded-xl bg-[#120d09] border border-[#261b13] flex flex-col gap-6">
              <div className="border-b border-[#261b13] pb-4">
                <span className="text-xs font-mono text-[#c09f58] uppercase tracking-wider block mb-1">
                  {sector.sanskrit}
                </span>
                <h2 className="text-2xl font-serif text-[#f5f1eb]">{sector.name}</h2>
                <p className="text-xs text-[#8e8376] mt-1">{sector.layers}</p>
              </div>

              <div className="flex flex-col gap-5 text-sm">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#8e8376] mb-1.5">
                    Unit Composition
                  </h3>
                  <p className="text-[#d4cbbf] leading-relaxed text-xs sm:text-sm">
                    {sector.unitComposition}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#8e8376] mb-1.5">
                    Tactical Function
                  </h3>
                  <p className="text-[#d4cbbf] leading-relaxed text-xs sm:text-sm">
                    {sector.role}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#8e8376] mb-1.5">
                    Computational Representation
                  </h3>
                  <p className="text-[#d4cbbf] leading-relaxed text-xs sm:text-sm">
                    {sector.computationalModeling}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[#18110b] border border-[#2d1e13] flex flex-col gap-1">
                  <span className="text-[11px] font-mono text-[#c09f58] uppercase tracking-wider">
                    Historical Qualification
                  </span>
                  <p className="text-xs text-[#a89b8c] leading-relaxed">
                    {sector.historicalQualification}
                  </p>
                </div>
              </div>

              <div className="border-t border-[#261b13] pt-6 flex justify-end">
                <button
                  onClick={() => onEnterSimulatorWithRings(sector.ringCount)}
                  className="btn-primary-gold text-xs px-6 py-2.5 flex items-center space-x-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Test in 3D Simulator</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
