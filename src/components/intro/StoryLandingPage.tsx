import React from 'react';
import { Play, BookOpen } from 'lucide-react';
import { ChakravyuhaBackground3D } from '../../three/scene/ChakravyuhaBackground3D';
import { WarParticles } from '../ui/WarParticles';

interface StoryLandingPageProps {
  onEnterSimulator: () => void;
  onExploreMethodology: () => void;
  onExploreSources: () => void;
  onExploreRealWorld?: () => void;
}

export const StoryLandingPage: React.FC<StoryLandingPageProps> = ({
  onEnterSimulator,
  onExploreMethodology
}) => {
  return (
    <div className="landing-page page-enter min-h-full overflow-hidden flex flex-col relative">
      {/* ═══ LIVING 3D CHAKRAVYŪHA BACKGROUND ═══ */}
      <div className="fixed inset-0 z-0">
        <ChakravyuhaBackground3D />
      </div>
      
      <WarParticles />
      
      {/* ═══ RADIAL GRADIENT OVERLAY FOR TEXT LEGIBILITY & ATMOSPHERE ═══ */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(12,8,5,0.3)_0%,_rgba(12,8,5,0.95)_100%)] pointer-events-none" />

      {/* ═══ HERO CONTENT LAYER ═══ */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-6">
        
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4 sm:gap-6 animate-in fade-in zoom-in-[0.98] duration-1000 ease-out">
          
          {/* Subtle Eyebrow */}
          <div className="inline-flex items-center gap-4 text-[10px] sm:text-xs font-mono uppercase tracking-[0.4em] text-[#d4af37]/70">
            <span className="w-12 h-[1px] bg-[#d4af37]/30" />
            <span>Computational Research Laboratory</span>
            <span className="w-12 h-[1px] bg-[#d4af37]/30" />
          </div>

          {/* Major Page Title */}
          <h1 className="text-5xl sm:text-7xl lg:text-[7rem] font-serif font-bold tracking-tighter text-white leading-[1.1] drop-shadow-2xl flex flex-wrap justify-center pb-2 sm:pb-4">
            <span className="inline-block">CHAKRA</span>
            <span className="inline-block text-[#d4af37]">FORGE</span>
          </h1>

          {/* Tagline and Description */}
          <div className="flex flex-col items-center gap-2 sm:gap-4 mt-0">
            <p className="text-lg sm:text-xl lg:text-2xl font-serif text-[#d4af37] italic font-normal tracking-wide drop-shadow-lg px-4">
              COORDINATING WHEN NO ONE HAS THE FULL PICTURE
            </p>
            <p className="text-xs sm:text-sm lg:text-base font-sans font-light text-[#a89b8c] max-w-xl text-center leading-relaxed">
              A multi-agent coordination simulator inspired by the Chakravyūha episode of the Mahābhārata.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 sm:mt-8">
            <button
              onClick={onEnterSimulator}
              className="group relative px-8 py-4 bg-[#d4af37] text-[#120d09] overflow-hidden rounded-full font-bold tracking-widest text-xs sm:text-sm transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative flex items-center justify-center gap-3">
                <Play className="w-5 h-5 fill-current" />
                INITIATE SIMULATION
              </span>
            </button>

            <button
              onClick={onExploreMethodology}
              className="group px-8 py-4 bg-[#0a0705]/40 backdrop-blur-md border border-[#d4af37]/30 text-[#f5eedc] rounded-full font-bold tracking-widest text-xs sm:text-sm transition-all duration-500 hover:border-[#d4af37]/80 hover:bg-[#d4af37]/10 hover:scale-[1.03] active:scale-[0.97]"
            >
              <span className="flex items-center justify-center gap-3">
                <BookOpen className="w-5 h-5 text-[#d4af37] opacity-80 group-hover:opacity-100 transition-opacity" />
                RESEARCH PROTOCOLS
              </span>
            </button>
          </div>
        </div>

      </div>
      
      {/* Research Identity Metadata */}
      <div className="relative z-10 w-full text-center px-4 pb-4 pt-4 animate-in fade-in duration-1000 delay-500">
        <p className="text-[10px] sm:text-xs font-mono text-[#8e8376] uppercase tracking-[0.3em] opacity-60">
          Drona Parva · Day 13 · Multi-Agent Coordination · Incomplete Information
        </p>
      </div>

    </div>
  );
};
