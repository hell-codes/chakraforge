import React, { useState } from 'react';
import { Scroll, BookOpen, ChevronDown, ChevronRight, CheckCircle2, Compass, Cpu, FileText } from 'lucide-react';
import { WarParticles } from '../ui/WarParticles';

interface TextualEvidenceItem {
  id: string;
  section: string;
  title: string;
  sourceAttestation: string;
  sourceText: string;
  interpretation: string;
  computationalModel: string;
}

const EVIDENCE_ITEMS: TextualEvidenceItem[] = [
  {
    id: 'sec-33',
    section: 'Section XXXIII',
    title: 'Deployment of the Circular Array (Chakravyūha)',
    sourceAttestation: 'Droṇa Parva, Adhyāya 33 (Ganguli Translation)',
    sourceText:
      'Challenged by Duryodhana after failing to capture Yudhishthira, Guru Drona arrayed the Kaurava army into the formidable circular formation (Chakravyūha). The text notes that only Krishna, Arjuna, Pradyumna, and Abhimanyu know how to pierce this circular array.',
    interpretation:
      'The formation was a rotating, circular maze designed to block lines of sight, trap enemies in kill-zones, and separate commanders from their support troops.',
    computationalModel:
      'Built as moving circular layers with rotating openings and mobile groups of soldiers. The structure matches the historical description: warriors standing back-to-back in seven circles, eventually turning inward to face the trapped opponent.'
  },
  {
    id: 'sec-34',
    section: 'Section XXXIV',
    title: 'Command to Pierce the Formation',
    sourceAttestation: 'Droṇa Parva, Adhyāya 34 (Ganguli Translation)',
    sourceText:
      'With Arjuna drawn far south toward the Samsaptakas, King Yudhishthira charges the 16-year-old Abhimanyu with breaking through the vanguard, urging him to pierce the mouth of Drona\'s array so that the veteran Pandava forces can pour in through the breach.',
    interpretation:
      'The Pandava strategy relied on a fast, specialized leader: a single warrior breaks open the outer wall so that the heavier backup troops can follow through the gap.',
    computationalModel:
      'A team-based logic where the lead warrior moves toward the opening, while backup warriors plan paths to follow behind.'
  },
  {
    id: 'sec-35',
    section: 'Section XXXV',
    title: 'Asymmetric Information Declaration & Pandava Pledge',
    sourceAttestation: 'Droṇa Parva, Adhyāya 35 (Ganguli Translation)',
    sourceText:
      'Abhimanyu explicitly states his tactical constraint: "My father taught me only how to enter this array. But if any danger should overtake me, I know not how to come out of it." Yudhishthira and Bhima pledge: "We will follow close behind thee, protecting thy rear and flanks on every side."',
    interpretation:
      'The mission was accepted with a major risk: the plan only works if the backup troops keep the exit open behind him.',
    computationalModel:
      'The simulated warrior only knows how to move forward (he has zero exit knowledge). The team fails when the rear path is blocked.'
  },
  {
    id: 'sec-42',
    section: 'Sections XLII–XLIII',
    title: 'Jayadratha Interdiction & Support Severance',
    sourceAttestation: 'Droṇa Parva, Adhyāya 42–43 (Ganguli Translation)',
    sourceText:
      'King Jayadratha of Sindhu, holding a boon to check the Pandavas, stations his chariot at the outer breach and single-handedly repels Yudhishthira, Bhima, Satyaki, and Dhrishtadyumna. The breach closes behind Abhimanyu.',
    interpretation:
      'A single blockage point successfully cuts the team in half, stopping both physical backup and communication.',
    computationalModel:
      'When Jayadratha blocks the entrance, the path closes. Backup warriors are blocked, and communication fails.'
  },
  {
    id: 'sec-47',
    section: 'Sections XLVII–XLVIII',
    title: 'Isolation, Multi-Commander Encirclement & Final Stand',
    sourceAttestation: 'Droṇa Parva, Adhyāya 47–48 (Ganguli Translation)',
    sourceText:
      'Deep inside the formation, six veteran Kaurava commanders (Drona, Karna, Kripa, Ashwatthama, Brihadbala, and Duhshasana) surround the isolated youth. His bow is severed from behind, horses and charioteer are killed, and Abhimanyu fights with a chariot wheel until struck down.',
    interpretation:
      'A chaotic chase becomes a complete encirclement where escape is impossible without outside help or knowing the way out.',
    computationalModel:
      'End of simulation: enemy commanders surround the isolated warrior. If given exit knowledge, the warrior can find a way out before being trapped.'
  }
];

export const MahabharataContext: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('sec-35');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full bg-[#0a0705] text-[#f5f1eb] min-h-screen py-20 lg:py-32 relative">
      <WarParticles />
      <div className="page-container space-y-20 lg:space-y-32 relative z-10">
        {/* Header */}
        <header className="space-y-6 border-b border-[#2d2218]/50 pb-12 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#c09f58]/10 border border-[#c09f58]/30 text-xs font-mono text-[#c09f58] uppercase tracking-widest shadow-[0_0_15px_rgba(192,159,88,0.15)]">
            <Scroll className="w-4 h-4" />
            <span>Historical Evidence & Epistemic Grounding</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f5f1eb] via-[#d4af37] to-[#c09f58] drop-shadow-md">
            Sources & Textual Evidence
          </h1>
          <p className="text-lg text-[#a89b8c] max-w-3xl leading-relaxed">
            Understanding the source material: what the ancient epic says, what it means for battle strategy, and how we turn it into a 3D simulation.
          </p>
        </header>

        {/* 3-Level Epistemic Framework */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10" style={{ marginTop: '5rem' }}>
          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#16100b] to-[#0a0705] border border-[#2d2218] hover:border-[#10b981]/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-500 hover:-translate-y-2 group cursor-default">
            <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center mb-6 group-hover:bg-[#10b981]/20 transition-colors">
              <CheckCircle2 className="w-6 h-6 text-[#10b981]" />
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#10b981] uppercase tracking-wider mb-2">
              <span>01. Documented</span>
            </div>
            <h2 className="text-xl font-serif text-[#f5f1eb] mb-3">Direct Textual Evidence</h2>
            <p className="text-sm text-[#8e8376] leading-relaxed">
              Attested in the Mahābhārata (Droṇa Parva) and translations (e.g. K.M. Ganguli). Historical narrative details and explicit dialogue.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#16100b] to-[#0a0705] border border-[#2d2218] hover:border-[#c09f58]/50 hover:shadow-[0_0_30px_rgba(192,159,88,0.15)] transition-all duration-500 hover:-translate-y-2 group cursor-default">
            <div className="w-12 h-12 rounded-full bg-[#c09f58]/10 flex items-center justify-center mb-6 group-hover:bg-[#c09f58]/20 transition-colors">
              <Compass className="w-6 h-6 text-[#c09f58]" />
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#c09f58] uppercase tracking-wider mb-2">
              <span>02. Interpreted</span>
            </div>
            <h2 className="text-xl font-serif text-[#f5f1eb] mb-3">Strategic Insight</h2>
            <p className="text-sm text-[#8e8376] leading-relaxed">
              Tactical dynamics, information asymmetry, and coordination constraints derived from textual analysis of the encounter.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#16100b] to-[#0a0705] border border-[#2d2218] hover:border-[#38bdf8]/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.15)] transition-all duration-500 hover:-translate-y-2 group cursor-default">
            <div className="w-12 h-12 rounded-full bg-[#38bdf8]/10 flex items-center justify-center mb-6 group-hover:bg-[#38bdf8]/20 transition-colors">
              <Cpu className="w-6 h-6 text-[#38bdf8]" />
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#38bdf8] uppercase tracking-wider mb-2">
              <span>03. Modeled</span>
            </div>
            <h2 className="text-xl font-serif text-[#f5f1eb] mb-3">Computational Abstraction</h2>
            <p className="text-sm text-[#8e8376] leading-relaxed">
              POMDP formulations, graph edge removals, communication bus protocols, and kinematic multi-agent physics in CHAKRAFORGE.
            </p>
          </div>
        </div>

        {/* Textual Passages List with Expandable Details */}
        <section style={{ marginTop: '6rem' }}>
          <h2 className="text-3xl font-serif text-[#f5f1eb] flex items-center gap-4 mb-10">
            <span className="w-12 h-[1px] bg-[#d4af37]/50 block"></span>
            Key Passages: Droṇa Parva
            <span className="flex-1 h-[1px] bg-gradient-to-r from-[#d4af37]/50 to-transparent block"></span>
          </h2>

          <div className="flex flex-col gap-6">
            {EVIDENCE_ITEMS.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl bg-[#120d09]/80 backdrop-blur-sm border transition-all duration-500 overflow-hidden ${isExpanded ? 'border-[#d4af37]/40 shadow-[0_0_40px_rgba(212,175,55,0.1)]' : 'border-[#261b13] hover:border-[#d4af37]/20 hover:bg-[#16100b]'}`}
                >
                  {/* Passage Summary Row */}
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="w-full p-6 md:p-8 text-left flex items-center justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        <span className="px-3 py-1 rounded-md bg-[#2a1d13] border border-[#4a3523] text-xs font-mono text-[#d4af37] shadow-sm">{item.section}</span>
                        <span className="text-xs text-[#523d2e]">•</span>
                        <span className="text-xs text-[#8e8376] font-mono font-medium tracking-wide">{item.sourceAttestation}</span>
                      </div>
                      <h3 className={`text-lg md:text-xl font-sans font-semibold tracking-tight transition-colors duration-300 ${isExpanded ? 'text-[#ffdfc2]' : 'text-[#f5f1eb] group-hover:text-[#d4af37]'}`}>{item.title}</h3>
                    </div>

                    <div className={`p-3 rounded-full transition-all duration-500 ${isExpanded ? 'bg-[#d4af37]/20 text-[#d4af37] rotate-180' : 'bg-[#1a110a] text-[#8e8376] group-hover:bg-[#d4af37]/10 group-hover:text-[#d4af37]'}`}>
                      <ChevronDown className="w-6 h-6" />
                    </div>
                  </button>

                  {/* Expandable 3-Level Detail */}
                  {isExpanded && (
                    <div className="p-6 pt-0 space-y-6 border-t border-[#1f150e]">
                      {/* 1. Source */}
                      <div className="space-y-1.5 pt-4">
                        <span className="text-xs font-mono font-semibold text-[#10b981] uppercase tracking-wider block">
                          Source (What the text says)
                        </span>
                        <p className="text-sm font-sans text-[#d4cbbf] leading-relaxed italic border-l-2 border-[#10b981]/40 pl-4 py-1">
                          &ldquo;{item.sourceText}&rdquo;
                        </p>
                      </div>

                      {/* 2. Interpretation */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-mono font-semibold text-[#c09f58] uppercase tracking-wider block">
                          Interpretation (What the research extracts)
                        </span>
                        <p className="text-sm font-sans text-[#a89b8c] leading-relaxed pl-4 border-l-2 border-[#c09f58]/40 py-1">
                          {item.interpretation}
                        </p>
                      </div>

                      {/* 3. Computational Model */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-mono font-semibold text-[#38bdf8] uppercase tracking-wider block">
                          Model (What CHAKRAFORGE represents computationally)
                        </span>
                        <p className="text-sm font-sans text-[#a89b8c] leading-relaxed pl-4 border-l-2 border-[#38bdf8]/40 py-1">
                          {item.computationalModel}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Academic References */}
        <section style={{ marginTop: '6rem', paddingTop: '4rem', borderTop: '1px solid #221810' }}>
          <h2 className="text-3xl font-serif text-[#f5f1eb] mb-10">Academic Citations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="p-6 rounded-xl bg-[#110c08] border border-[#221810] space-y-3">
              <h3 className="font-sans font-semibold text-[#f5f1eb]">Multi-Agent Systems & Coordination</h3>
              <p className="text-[#8e8376] font-sans text-xs">
                Wooldridge, M. (2009). <em className="text-[#d4cbbf]">An Introduction to MultiAgent Systems</em>. John Wiley & Sons.
              </p>
              <p className="text-[#a89b8c] leading-relaxed font-sans">
                Foundational principles for decentralized team coordination, communication constraints, and collaborative failure modes.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#110c08] border border-[#221810] space-y-3">
              <h3 className="font-sans font-semibold text-[#f5f1eb]">Planning Under Partial Observability</h3>
              <p className="text-[#8e8376] font-sans text-xs">
                Kaelbling, L. P., Littman, M. L., & Cassandra, A. R. (1998). Planning in POMDPs. <em className="text-[#d4cbbf]">Artificial Intelligence</em>.
              </p>
              <p className="text-[#a89b8c] leading-relaxed font-sans">
                Formal grounding for agent decision-making with imperfect environmental visibility and horizon truncation.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
