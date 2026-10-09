import React, { useState } from 'react';
import { AgentState } from '../../types/simulation';
import {
  Brain,
  Shield,
  AlertTriangle,
  TrendingUp,
  Heart,
  Zap,
  Target,
  ChevronDown,
  ChevronUp,
  Eye,
  Activity,
  Compass
} from 'lucide-react';

interface AgentInspectorProps {
  agent: AgentState | null;
  onClose: () => void;
  simulationMode?: 'HISTORICAL' | 'COUNTERFACTUAL';
}

const TIER_NAMES: Record<number, string> = {
  0: 'External Battlefield',
  1: 'Central Command Area (Command Pavilion)',
  2: 'Inner Formation (Chariot & Guard Division)',
  3: 'Inner Formation (Compression Zone)',
  4: 'Middle Formation (Defensive Chokepoint)',
  5: 'Middle Formation (Mobile Cavalry & Phalanx)',
  6: 'Outer Formation (Infantry & Archer Barrier)',
  7: 'Outer Formation (Perimeter Boundary & Vanguard)'
};

export const AgentInspector: React.FC<AgentInspectorProps> = ({
  agent,
  onClose,
  simulationMode = 'HISTORICAL'
}) => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  if (!agent) return null;

  const isAbhimanyu = agent.heroType === 'ABHIMANYU' || agent.index === 0;
  const health = agent.health !== undefined ? agent.health : (agent.status === 'ELIMINATED' ? 0 : 100);
  const stamina = agent.stamina !== undefined ? agent.stamina : 100;

  // Spatial metrics
  const distToCenter = Math.hypot(agent.position.x, agent.position.y);
  const outerRadius = 3.5 + 7 * 3.2; // approx 25.9m
  const distToExit = Math.max(0, outerRadius - distToCenter);

  // Local threat density based on layer depth
  const threatDensity = agent.currentLayer === 0
    ? 15
    : Math.min(100, Math.round(35 + (8 - agent.currentLayer) * 9.5));

  return (
    <div className="absolute right-3 top-16 w-88 sm:w-96 max-h-[calc(100vh-120px)] overflow-y-auto surface-panel p-4 text-xs select-none flex flex-col gap-3.5 border border-[var(--border-gold)] z-30 shadow-2xl rounded-xl">
      {/* 1. Header with Hero Banner */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
        <div className="flex items-center space-x-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold font-mono text-sm shadow-sm ${
              isAbhimanyu
                ? 'bg-[#d4af37] text-[#0d0905] ring-2 ring-[#f5e6b8]'
                : agent.team === 'PANDAVA'
                ? 'bg-[#251910] text-[#d4af37] border border-[#d4af37]/40'
                : 'bg-[#2b1010] text-[#ef4444] border border-[#ef4444]/40'
            }`}
          >
            {isAbhimanyu ? '👑' : agent.index + 1}
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#f5f1eb] font-serif leading-tight">
              {agent.name}
            </h3>
            <span className="text-[10px] font-mono text-[#8e8376]">
              {agent.role.replace(/_/g, ' ')} • {agent.team}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="text-[#8e8376] hover:text-[#f5f1eb] text-sm p-1 rounded-lg hover:bg-[#251810] border border-transparent hover:border-[#d4af37]/40 transition-all cursor-pointer flex items-center justify-center w-7 h-7"
          title="Close Inspector"
          aria-label="Close Inspector"
        >
          <span className="font-mono text-base leading-none font-bold">✕</span>
        </button>
      </div>

      {/* 2. Vitals: Health & Stamina Gauges */}
      <div className="grid grid-cols-2 gap-2 bg-[#120d09] p-2.5 rounded-lg border border-[var(--border-subtle)] font-mono text-[11px]">
        {/* Health */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#8e8376] flex items-center gap-1 font-sans">
              <Heart className="w-3 h-3 text-[#ef4444] fill-current" /> Health
            </span>
            <span
              className={`font-bold ${
                health > 50 ? 'text-[#10b981]' : health > 20 ? 'text-[#f59e0b]' : 'text-[#ef4444]'
              }`}
            >
              {health}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#251610] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                health > 50 ? 'bg-[#10b981]' : health > 20 ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'
              }`}
              style={{ width: `${health}%` }}
            />
          </div>
        </div>

        {/* Stamina */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#8e8376] flex items-center gap-1 font-sans">
              <Zap className="w-3 h-3 text-[#d4af37] fill-current" /> Stamina
            </span>
            <span className="text-[#d4af37] font-bold">{stamina}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#251610] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#d4af37] transition-all duration-300"
              style={{ width: `${stamina}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Spatial & Threat Coordinates */}
      <div className="bg-[#140e0a] p-3 rounded-lg border border-[var(--border-gold)]/25 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#8e8376] uppercase font-semibold">Formation Tier</span>
          <span className="text-[11px] font-bold text-[#d4af37] font-mono">
            {TIER_NAMES[agent.currentLayer] || `Tier ${agent.currentLayer}`}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[var(--border-subtle)] font-mono text-[10px]">
          <div>
            <span className="text-[#8e8376] block text-[9px]">DIST TO CENTER</span>
            <span className="text-[#f5f1eb] font-bold">{distToCenter.toFixed(1)}m</span>
          </div>
          <div>
            <span className="text-[#8e8376] block text-[9px]">DIST TO EXIT</span>
            <span className="text-[#22d3ee] font-bold">{distToExit.toFixed(1)}m</span>
          </div>
          <div>
            <span className="text-[#8e8376] block text-[9px]">THREAT DENSITY</span>
            <span
              className={`font-bold ${
                threatDensity > 75
                  ? 'text-[#ef4444]'
                  : threatDensity > 45
                  ? 'text-[#f59e0b]'
                  : 'text-[#10b981]'
              }`}
            >
              {threatDensity}%
            </span>
          </div>
        </div>
      </div>

      {/* 4. CURRENT ACTION + "WHY THIS MOVE?" TACTICAL EXPLANATION */}
      <div className="bg-[#18110c] p-3 rounded-lg border border-[var(--border-gold)]/40 space-y-2">
        <div>
          <div className="text-[9px] uppercase font-mono text-[#8e8376] mb-0.5">Current Action</div>
          <div className="text-xs font-bold text-[#f5f1eb] flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
            <span>{agent.currentAction}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[var(--border-gold)]/20 space-y-1.5">
          <div className="flex items-center space-x-1.5 text-[11px] font-serif font-bold text-[#d4af37]">
            <Brain className="w-3.5 h-3.5" />
            <span>Why this move?</span>
          </div>

          <div className="text-[11px] text-[#f5f1eb] font-medium leading-snug italic bg-[#100b08] p-2 rounded border border-[var(--border-subtle)]">
            "{agent.decisionReason}"
          </div>

          <p className="text-[10px] text-[#8e8376] leading-relaxed">
            {agent.decisionExplanation}
          </p>

          {/* Decision Factors Weight Breakdown */}
          {agent.decisionFactors && agent.decisionFactors.length > 0 && (
            <div className="flex flex-col gap-1 pt-1 font-mono">
              <div className="text-[9px] text-[#8e8376] uppercase">Tactical Priorities:</div>
              {agent.decisionFactors.map((f, i) => (
                <div key={i} className="text-[10px] flex items-center justify-between text-[#c5bcb1]">
                  <span>{f.factor}</span>
                  <span className="text-[#22d3ee] font-semibold">{Math.round(f.weight * 100)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. Support & Communication Status */}
      <div className="bg-[#140e0a] p-2.5 rounded-lg border border-[var(--border-subtle)] space-y-1.5">
        <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
          <div>
            <span className="text-[#8e8376] block text-[9px]">SUPPORT STATUS</span>
            <span
              className={`font-bold ${
                agent.supportStatus === 'SUPPORTED'
                  ? 'text-[#10b981]'
                  : agent.supportStatus === 'SUPPORT_BLOCKED'
                  ? 'text-[#f59e0b]'
                  : 'text-[#ef4444]'
              }`}
            >
              {agent.supportStatus}
            </span>
          </div>
          <div>
            <span className="text-[#8e8376] block text-[9px]">EXIT KNOWLEDGE</span>
            <span
              className={`font-bold ${
                agent.exitKnowledgePercent === 0 ? 'text-[#ef4444]' : 'text-[#22d3ee]'
              }`}
            >
              {agent.exitKnowledgePercent}% {simulationMode === 'HISTORICAL' && '(Historical: 0)'}
            </span>
          </div>
        </div>

        {agent.isCommSevered && (
          <div className="flex items-center space-x-1.5 text-[10px] text-[#ef4444] bg-[#ef4444]/10 p-1.5 rounded border border-[#ef4444]/35 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>COMMUNICATION SEVERED BY JAYADRATHA</span>
          </div>
        )}
      </div>

      {/* 6. COUNTERFACTUAL EXIT CANDIDATES (If in Counterfactual Mode) */}
      {simulationMode === 'COUNTERFACTUAL' &&
        agent.counterfactualPaths &&
        agent.counterfactualPaths.length > 0 && (
          <div className="bg-[#0b1a20] p-3 rounded-lg border border-[#22d3ee]/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#22d3ee] flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Counterfactual Exit Candidates
              </span>
              <span className="text-[10px] text-[#8e8376] font-mono">
                {agent.counterfactualPaths.length} options
              </span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {agent.counterfactualPaths.map((p, idx) => {
                const norm = ((p.gateAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
                const sectorLabel =
                  Math.abs(norm - Math.PI / 2) < 0.45
                    ? 'North Breach (Choke Point)'
                    : Math.abs(norm - (3 * Math.PI) / 2) < 0.45
                    ? 'South Flank Gate (Breakout)'
                    : norm < 0.45 || norm > 2 * Math.PI - 0.45
                    ? 'East Flank Gate (Open)'
                    : Math.abs(norm - Math.PI) < 0.45
                    ? 'West Flank Gate (Open)'
                    : `Tier ${p.gateRingIndex} Gate`;

                return (
                  <div
                    key={p.id || idx}
                    className="bg-[#061217] p-2 rounded border border-[#22d3ee]/20 text-[10px] font-mono flex flex-col gap-1 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#f5f1eb] font-bold flex items-center gap-1">
                        <span>🚪</span> {sectorLabel}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${
                          p.riskLevel === 'LOW'
                            ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
                            : p.riskLevel === 'MEDIUM'
                            ? 'bg-[#22d3ee]/20 text-[#22d3ee] border border-[#22d3ee]/40'
                            : 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40'
                        }`}
                      >
                        Risk: {p.riskLevel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#8e8376] pt-0.5 border-t border-[#22d3ee]/10">
                      <span>
                        P(Success): <strong className="text-[#22d3ee]">{p.successProbability}%</strong>
                      </span>
                      <span>Dist: {p.distance.toFixed(1)}m</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-[9px] text-[#8e8376] italic border-t border-[#22d3ee]/20 pt-1 leading-snug">
              * Computational counterfactual evaluation, not a historical event reconstruction.
            </div>
          </div>
        )}

      {/* 7. DIAGNOSTICS TOGGLE (Hidden by default) */}
      <div className="border-t border-[var(--border-subtle)] pt-2">
        <button
          onClick={() => setShowDiagnostics(!showDiagnostics)}
          className="w-full flex items-center justify-between text-[#8e8376] hover:text-[#f5f1eb] py-1 text-[11px] font-mono transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#22d3ee]" />
            Raw Diagnostics
          </span>
          {showDiagnostics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showDiagnostics && (
          <div className="mt-2 space-y-2 font-mono text-[10px] animate-in fade-in duration-150">
            <div className="grid grid-cols-2 gap-2 bg-[#100b08] p-2 rounded border border-[var(--border-subtle)]">
              <div>
                <span className="text-[#8e8376] block">POSITION (X, Y)</span>
                <span className="text-[#f5f1eb] font-bold">
                  ({agent.position.x.toFixed(1)}, {agent.position.y.toFixed(1)})
                </span>
              </div>
              <div>
                <span className="text-[#8e8376] block">VELOCITY (m/s)</span>
                <span className="text-[#f5f1eb] font-bold">
                  {agent.speed.toFixed(2)}m/s • {((agent.heading * 180) / Math.PI).toFixed(0)}°
                </span>
              </div>
              <div>
                <span className="text-[#8e8376] block">STEPS TAKEN</span>
                <span className="text-[#f5f1eb] font-bold">{agent.stepsTaken}</span>
              </div>
              <div>
                <span className="text-[#8e8376] block">COLLISIONS</span>
                <span className="text-[#ef4444] font-bold">{agent.collisionCount}</span>
              </div>
              <div>
                <span className="text-[#8e8376] block">MESSAGES SENT</span>
                <span className="text-[#22d3ee] font-bold">{agent.messagesSent}</span>
              </div>
              <div>
                <span className="text-[#8e8376] block">VISIBLE ALLIES</span>
                <span className="text-[#10b981] font-bold">
                  {agent.perception?.visibleAgents?.length || 0}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
