import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X, Layers, Cpu, BookOpen, Globe } from 'lucide-react';

export type ActiveTab =
  | 'OVERVIEW'
  | 'SIMULATOR'
  | 'EXPERIMENTS'
  | 'FORMATION_GUIDE'
  | 'AGENT_MECHANICS'
  | 'METHODOLOGY'
  | 'REAL_WORLD'
  | 'MAHABHARATA'
  | 'ABOUT';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  mode?: 'HISTORICAL' | 'COUNTERFACTUAL';
  onToggleMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [researchOpen, setResearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setResearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isResearchActive =
    activeTab === 'FORMATION_GUIDE' ||
    activeTab === 'AGENT_MECHANICS' ||
    activeTab === 'METHODOLOGY' ||
    activeTab === 'REAL_WORLD';

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setResearchOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#0c0907]/90 backdrop-blur-md border-b border-[#221811] px-6 sm:px-10 py-3.5 flex items-center justify-between z-40 select-none sticky top-0 transition-colors">
      {/* Brand Identity (Left) */}
      <div
        onClick={() => handleNavClick('OVERVIEW')}
        className="flex items-center gap-3 cursor-pointer group shrink-0"
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold tracking-widest text-[#f5f1eb] text-base group-hover:text-[#d4af37] transition-colors">
              CHAKRAFORGE
            </span>
          </div>
          <span className="text-[11px] text-[#8e8376] font-sans tracking-wide">
            Strategic Coordination Laboratory
          </span>
        </div>
      </div>

      {/* Primary Navigation (Center/Right) */}
      {/* Primary Navigation (Center/Right) */}
      <nav className="hidden md:flex items-center p-1.5 gap-4 bg-[#0a0705]/70 backdrop-blur-2xl border border-[#2d2218]/50 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.6)] px-4">
        {/* Story */}
        <button
          onClick={() => handleNavClick('OVERVIEW')}
          className={`px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
            activeTab === 'OVERVIEW'
              ? 'bg-[#251912] text-[#f5f1eb] shadow-[inset_0_1px_0_0_rgba(212,175,55,0.1)]'
              : 'text-[#8e8376] hover:text-[#f5f1eb] hover:bg-[#16100b]'
          }`}
        >
          The Epic
        </button>

        {/* Simulation */}
        <button
          onClick={() => handleNavClick('SIMULATOR')}
          className={`px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'SIMULATOR'
              ? 'bg-[#251912] text-[#d4af37] shadow-[inset_0_1px_0_0_rgba(212,175,55,0.15)] border border-[#d4af37]/20'
              : 'text-[#8e8376] hover:text-[#d4af37] hover:bg-[#16100b] border border-transparent'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'SIMULATOR' ? 'bg-[#d4af37] animate-pulse shadow-[0_0_8px_#d4af37]' : 'bg-[#8e8376]'}`}></span>
          Simulation
        </button>

        {/* Experiments */}
        <button
          onClick={() => handleNavClick('EXPERIMENTS')}
          className={`px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
            activeTab === 'EXPERIMENTS'
              ? 'bg-[#251912] text-[#f5f1eb] shadow-[inset_0_1px_0_0_rgba(212,175,55,0.1)]'
              : 'text-[#8e8376] hover:text-[#f5f1eb] hover:bg-[#16100b]'
          }`}
        >
          Experiments
        </button>

        {/* Research Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setResearchOpen(!researchOpen)}
            className={`px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
              isResearchActive || researchOpen
                ? 'bg-[#251912] text-[#f5f1eb] shadow-[inset_0_1px_0_0_rgba(212,175,55,0.1)]'
                : 'text-[#8e8376] hover:text-[#f5f1eb] hover:bg-[#16100b]'
            }`}
          >
            <span>Research</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${researchOpen ? 'rotate-180 text-[#d4af37]' : 'text-inherit'}`} />
          </button>

          {researchOpen && (
            <div className="absolute top-[calc(100%+16px)] left-1/2 -translate-x-1/2 w-64 bg-[#0a0705]/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] py-2 z-50 border border-[#2d2218]/80">
              <button
                onClick={() => handleNavClick('FORMATION_GUIDE')}
                className={`w-full text-left px-5 py-3 flex items-center space-x-3 text-xs hover:bg-[#1a130d] transition-colors ${
                  activeTab === 'FORMATION_GUIDE' ? 'text-[#d4af37] font-semibold bg-[#1a130d]' : 'text-[#c5bcb1]'
                }`}
              >
                <Layers className="w-4 h-4 text-[#d4af37] shrink-0" />
                <div>
                  <div className="font-medium text-[#f5f1eb]">Formation Representation</div>
                  <div className="text-[10px] text-[#8e8376] mt-0.5">Computational concentric abstraction</div>
                </div>
              </button>

              <button
                onClick={() => handleNavClick('AGENT_MECHANICS')}
                className={`w-full text-left px-5 py-3 flex items-center space-x-3 text-xs hover:bg-[#1a130d] transition-colors ${
                  activeTab === 'AGENT_MECHANICS' ? 'text-[#d4af37] font-semibold bg-[#1a130d]' : 'text-[#c5bcb1]'
                }`}
              >
                <Cpu className="w-4 h-4 text-[#d4af37] shrink-0" />
                <div>
                  <div className="font-medium text-[#f5f1eb]">Agent Strategies</div>
                  <div className="text-[10px] text-[#8e8376] mt-0.5">Decision models & coordination</div>
                </div>
              </button>

              <button
                onClick={() => handleNavClick('METHODOLOGY')}
                className={`w-full text-left px-5 py-3 flex items-center space-x-3 text-xs hover:bg-[#1a130d] transition-colors ${
                  activeTab === 'METHODOLOGY' ? 'text-[#d4af37] font-semibold bg-[#1a130d]' : 'text-[#c5bcb1]'
                }`}
              >
                <BookOpen className="w-4 h-4 text-[#d4af37] shrink-0" />
                <div>
                  <div className="font-medium text-[#f5f1eb]">Methodology Monograph</div>
                  <div className="text-[10px] text-[#8e8376] mt-0.5">POMDP model & research gap</div>
                </div>
              </button>

              <button
                onClick={() => handleNavClick('REAL_WORLD')}
                className={`w-full text-left px-5 py-3 flex items-center space-x-3 text-xs hover:bg-[#1a130d] transition-colors ${
                  activeTab === 'REAL_WORLD' ? 'text-[#d4af37] font-semibold bg-[#1a130d]' : 'text-[#c5bcb1]'
                }`}
              >
                <Globe className="w-4 h-4 text-[#d4af37] shrink-0" />
                <div>
                  <div className="font-medium text-[#f5f1eb]">Contemporary Relevance</div>
                  <div className="text-[10px] text-[#8e8376] mt-0.5">Robotics, distributed teams, autonomy</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Sources */}
        <button
          onClick={() => handleNavClick('MAHABHARATA')}
          className={`px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
            activeTab === 'MAHABHARATA'
              ? 'bg-[#251912] text-[#f5f1eb] shadow-[inset_0_1px_0_0_rgba(212,175,55,0.1)]'
              : 'text-[#8e8376] hover:text-[#f5f1eb] hover:bg-[#16100b]'
          }`}
        >
          Sources
        </button>

        {/* About */}
        <button
          onClick={() => handleNavClick('ABOUT')}
          className={`px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
            activeTab === 'ABOUT'
              ? 'bg-[#251912] text-[#f5f1eb] shadow-[inset_0_1px_0_0_rgba(212,175,55,0.1)]'
              : 'text-[#8e8376] hover:text-[#f5f1eb] hover:bg-[#16100b]'
          }`}
        >
          About
        </button>
      </nav>

      {/* Right Area: Droṇa Parva • Research Prototype */}
      <div className="hidden md:flex items-center text-right">
        <span className="text-xs text-[#8e8376] font-mono tracking-wider">
          Droṇa Parva • Research Prototype
        </span>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 text-[#8e8376] hover:text-[#f5eedc]"
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#100c08] border-b border-[#2b1f16] p-5 flex flex-col space-y-2 z-50 shadow-2xl">
          <button
            onClick={() => handleNavClick('OVERVIEW')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              activeTab === 'OVERVIEW' ? 'text-[#d4af37] font-semibold bg-[#1a120c]' : 'text-[#c5bcb1]'
            }`}
          >
            The Epic
          </button>
          <button
            onClick={() => handleNavClick('SIMULATOR')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              activeTab === 'SIMULATOR' ? 'text-[#d4af37] font-semibold bg-[#1a120c]' : 'text-[#c5bcb1]'
            }`}
          >
            Simulation
          </button>
          <button
            onClick={() => handleNavClick('EXPERIMENTS')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              activeTab === 'EXPERIMENTS' ? 'text-[#d4af37] font-semibold bg-[#1a120c]' : 'text-[#c5bcb1]'
            }`}
          >
            Experiments
          </button>
          <button
            onClick={() => handleNavClick('FORMATION_GUIDE')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              activeTab === 'FORMATION_GUIDE' ? 'text-[#d4af37] font-semibold bg-[#1a120c]' : 'text-[#c5bcb1]'
            }`}
          >
            Formation Representation
          </button>
          <button
            onClick={() => handleNavClick('AGENT_MECHANICS')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              activeTab === 'AGENT_MECHANICS' ? 'text-[#d4af37] font-semibold bg-[#1a120c]' : 'text-[#c5bcb1]'
            }`}
          >
            Agent Strategies
          </button>
          <button
            onClick={() => handleNavClick('METHODOLOGY')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              activeTab === 'METHODOLOGY' ? 'text-[#d4af37] font-semibold bg-[#1a120c]' : 'text-[#c5bcb1]'
            }`}
          >
            Methodology Monograph
          </button>
          <button
            onClick={() => handleNavClick('REAL_WORLD')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              activeTab === 'REAL_WORLD' ? 'text-[#d4af37] font-semibold bg-[#1a120c]' : 'text-[#c5bcb1]'
            }`}
          >
            Contemporary Relevance
          </button>
          <button
            onClick={() => handleNavClick('MAHABHARATA')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              activeTab === 'MAHABHARATA' ? 'text-[#d4af37] font-semibold bg-[#1a120c]' : 'text-[#c5bcb1]'
            }`}
          >
            Sources
          </button>
          <button
            onClick={() => handleNavClick('ABOUT')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              activeTab === 'ABOUT' ? 'text-[#d4af37] font-semibold bg-[#1a120c]' : 'text-[#c5bcb1]'
            }`}
          >
            About
          </button>
        </div>
      )}
    </header>
  );
};
