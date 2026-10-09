import React from 'react';
import {
  ScenarioConfig,
  StrategyType,
  InformationLevel,
  CommunicationLevel,
  EnvironmentDynamics,
  FormationComplexity
} from '../../types/simulation';
import { Sliders, Zap, Sparkles, RefreshCw, Layers, Radio, Eye, Cpu, Compass, ShieldAlert } from 'lucide-react';

interface ControlPanelProps {
  config: ScenarioConfig;
  onChangeConfig: (newConfig: ScenarioConfig) => void;
  onApplyAndRestart: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onChangeConfig,
  onApplyAndRestart,
  isCollapsed,
  onToggleCollapse
}) => {
  const updateField = <K extends keyof ScenarioConfig>(key: K, value: ScenarioConfig[K]) => {
    onChangeConfig({
      ...config,
      [key]: value
    });
  };

  const applyPreset = (name: string) => {
    let preset: Partial<ScenarioConfig> = {};
    if (name === 'HISTORICAL_ABHIMANYU') {
      preset = {
        mode: 'HISTORICAL',
        strategy: 'INFORMATION_AWARE',
        informationLevel: 'PARTIAL',
        communicationLevel: 'NONE',
        environmentDynamics: 'DYNAMIC',
        formationComplexity: 'HIGH',
        ringCount: 7,
        agentCount: 5,
        supportBlocked: true,
        exitKnowledgePercent: 0,
        commReliabilityPercent: 20
      };
    } else if (name === 'COUNTERFACTUAL_EXIT') {
      preset = {
        mode: 'COUNTERFACTUAL',
        strategy: 'ADAPTIVE',
        informationLevel: 'PARTIAL',
        communicationLevel: 'NORMAL',
        environmentDynamics: 'DYNAMIC',
        formationComplexity: 'HIGH',
        ringCount: 7,
        agentCount: 5,
        supportBlocked: true,
        exitKnowledgePercent: 50,
        commReliabilityPercent: 60
      };
    } else if (name === 'COUNTERFACTUAL_UNBLOCKED') {
      preset = {
        mode: 'COUNTERFACTUAL',
        strategy: 'COORDINATED',
        informationLevel: 'PARTIAL',
        communicationLevel: 'HIGH',
        environmentDynamics: 'DYNAMIC',
        formationComplexity: 'HIGH',
        ringCount: 7,
        agentCount: 5,
        supportBlocked: false,
        exitKnowledgePercent: 25,
        commReliabilityPercent: 90
      };
    } else if (name === 'STOCHASTIC_BASELINE') {
      preset = {
        mode: 'COUNTERFACTUAL',
        strategy: 'RANDOM',
        informationLevel: 'LIMITED',
        communicationLevel: 'NONE',
        environmentDynamics: 'DYNAMIC',
        formationComplexity: 'MEDIUM',
        ringCount: 6,
        agentCount: 5,
        supportBlocked: true,
        exitKnowledgePercent: 0,
        commReliabilityPercent: 0
      };
    }

    onChangeConfig({
      ...config,
      ...preset
    });
  };

  if (isCollapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        className="absolute left-3 top-16 z-20 glass-panel p-2.5 text-[#d4af37] hover:text-[#f5f0e8] hover:bg-[#20150d] transition-all"
        title="Open Scenario Control Panel"
      >
        <Sliders className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="w-80 max-h-[calc(100vh-130px)] overflow-y-auto glass-panel p-4 text-xs select-none flex flex-col gap-4 border-r border-[var(--border-gold)] z-20 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-gold)]/40 pb-2">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-[#d4af37]" />
          <h2 className="font-serif font-bold text-sm text-[#f5f0e8] tracking-wide">SCENARIO CONTROLS</h2>
        </div>
        <button
          onClick={onToggleCollapse}
          className="text-[#a89f91] hover:text-[#f5f0e8] text-base px-1.5 py-0.5 rounded hover:bg-[#251910]"
          title="Collapse Panel"
        >
          ✕
        </button>
      </div>

      {/* Mode Selection */}
      <div className="bg-[#140e0a] p-2 rounded-lg border border-[var(--border-gold)]/30 space-y-1.5">
        <label className="text-[10px] font-semibold text-[#c5bcb1] uppercase tracking-wider block">
          Simulation Mode
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => {
              updateField('mode', 'HISTORICAL');
              updateField('supportBlocked', true);
              updateField('exitKnowledgePercent', 0);
            }}
            className={`py-1.5 px-2 rounded text-[11px] font-serif font-bold transition-all text-center border ${
              config.mode === 'HISTORICAL'
                ? 'bg-[#d4af37] text-[#0d0905] border-[#ffe599]'
                : 'bg-[#1a110b] text-[#8e8376] border-[var(--border-subtle)] hover:text-[#f5f1eb]'
            }`}
          >
            📜 Historical
          </button>
          <button
            onClick={() => updateField('mode', 'COUNTERFACTUAL')}
            className={`py-1.5 px-2 rounded text-[11px] font-sans font-bold transition-all text-center border ${
              config.mode === 'COUNTERFACTUAL'
                ? 'bg-[#22d3ee] text-[#041d24] border-[#22d3ee]'
                : 'bg-[#1a110b] text-[#8e8376] border-[var(--border-subtle)] hover:text-[#f5f1eb]'
            }`}
          >
            🧪 Counterfactual
          </button>
        </div>
      </div>

      {/* COUNTERFACTUAL PARAMETERS (Visible in Counterfactual Mode) */}
      {config.mode === 'COUNTERFACTUAL' && (
        <div className="bg-[#0c181c] p-3 rounded-lg border border-[#22d3ee]/40 space-y-3">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[#22d3ee]">
            <Compass className="w-3.5 h-3.5" />
            <span>COUNTERFACTUAL EXPERIMENTS</span>
          </div>

          {/* Exit Knowledge % */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-[#8e8376]">Exit Topology Knowledge:</span>
              <span className="text-[#22d3ee] font-bold font-mono">{config.exitKnowledgePercent || 0}%</span>
            </div>
            <div className="grid grid-cols-4 gap-1 font-mono text-[10px]">
              {[0, 25, 50, 100].map((val) => (
                <button
                  key={val}
                  onClick={() => updateField('exitKnowledgePercent', val)}
                  className={`py-1 rounded border transition-all ${
                    (config.exitKnowledgePercent || 0) === val
                      ? 'bg-[#22d3ee] text-[#041d24] font-bold border-[#22d3ee]'
                      : 'bg-[#140e0a] text-[#8e8376] border-[var(--border-subtle)] hover:text-[#f5f1eb]'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>

          {/* Support Blocked Toggle */}
          <div className="flex items-center justify-between pt-1 border-t border-[#22d3ee]/20">
            <div>
              <span className="text-[11px] text-[#f5f1eb] font-semibold block">Jayadratha Breach Seal</span>
              <span className="text-[9px] text-[#8e8376]">
                {config.supportBlocked ? 'Pandava support force halted' : 'Support unblocked / sustained'}
              </span>
            </div>
            <button
              onClick={() => updateField('supportBlocked', !config.supportBlocked)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                config.supportBlocked
                  ? 'bg-[#ef4444] text-white'
                  : 'bg-[#10b981] text-[#052914]'
              }`}
            >
              {config.supportBlocked ? 'BLOCKED' : 'UNBLOCKED'}
            </button>
          </div>

          {/* Communication Reliability Slider */}
          <div className="pt-1 border-t border-[#22d3ee]/20">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-[#8e8376]">Comm Reliability:</span>
              <span className="text-[#10b981] font-bold font-mono">{config.commReliabilityPercent || 50}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={config.commReliabilityPercent || 50}
              onChange={(e) => updateField('commReliabilityPercent', parseInt(e.target.value))}
            />
          </div>
        </div>
      )}

      {/* Historical & Research Presets */}
      <div>
        <label className="text-[10px] font-semibold text-[#a89f91] uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#d4af37]" /> Research Presets
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => applyPreset('HISTORICAL_ABHIMANYU')}
            className="p-1.5 text-[11px] rounded bg-[#251410] text-[#f39c12] border border-[#f39c12]/40 hover:bg-[#351a14] transition-colors text-left font-serif"
          >
            📜 13th Day Historical
          </button>
          <button
            onClick={() => applyPreset('COUNTERFACTUAL_EXIT')}
            className="p-1.5 text-[11px] rounded bg-[#0b1d24] text-[#00f2ff] border border-[#00f2ff]/40 hover:bg-[#132c35] transition-colors text-left"
          >
            🧪 50% Exit Knowledge
          </button>
          <button
            onClick={() => applyPreset('COUNTERFACTUAL_UNBLOCKED')}
            className="p-1.5 text-[11px] rounded bg-[#102421] text-[#2ecc71] border border-[#2ecc71]/40 hover:bg-[#15342e] transition-colors text-left"
          >
            🛡️ Support Maintained
          </button>
          <button
            onClick={() => applyPreset('STOCHASTIC_BASELINE')}
            className="p-1.5 text-[11px] rounded bg-[#1f1a14] text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#2c241c] transition-colors text-left"
          >
            🎲 Random Walk Baseline
          </button>
        </div>
      </div>

      {/* Strategy Selection */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-semibold text-[#c5bcb1] uppercase tracking-wider flex items-center gap-1">
          <Cpu className="w-3 h-3 text-[#d4af37]" /> Coordination Strategy
        </label>
        <div className="grid grid-cols-2 gap-1 font-mono">
          {(['RANDOM', 'GREEDY', 'SHORTEST_PATH', 'COORDINATED', 'ADAPTIVE'] as StrategyType[]).map((strat) => (
            <button
              key={strat}
              onClick={() => updateField('strategy', strat)}
              className={`py-1.5 px-1 rounded text-[10px] transition-all text-center border ${
                config.strategy === strat
                  ? 'bg-[#d4af37] text-[#0d0905] font-bold border-[#ffe599] shadow-sm'
                  : 'bg-[#1a110b] text-[#c5bcb1] border-[var(--border-subtle)] hover:bg-[#251910] hover:text-[#f5f1eb]'
              }`}
            >
              {strat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Information Level Selection */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-semibold text-[#c5bcb1] uppercase tracking-wider flex items-center gap-1">
          <Eye className="w-3 h-3 text-[#22d3ee]" /> Information Horizon
        </label>
        <div className="grid grid-cols-3 gap-1 font-mono">
          {(['FULL', 'PARTIAL', 'LIMITED'] as InformationLevel[]).map((info) => (
            <button
              key={info}
              onClick={() => updateField('informationLevel', info)}
              className={`py-1.5 px-1 rounded text-[11px] transition-all text-center border ${
                config.informationLevel === info
                  ? 'bg-[#22d3ee] text-[#041d24] font-bold border-[#22d3ee] shadow-sm'
                  : 'bg-[#1a110b] text-[#c5bcb1] border-[var(--border-subtle)] hover:bg-[#251910] hover:text-[#f5f1eb]'
              }`}
            >
              {info}
            </button>
          ))}
        </div>
      </div>

      {/* Ring Count Slider */}
      <div className="bg-[#140f0b] p-2.5 rounded-lg border border-[var(--border-gold)]/30 space-y-2">
        <div className="flex justify-between text-[11px]">
          <span className="text-[#c5bcb1]">Concentric Rings:</span>
          <span className="text-[#d4af37] font-bold font-mono">{config.ringCount} Rings (Parva=7)</span>
        </div>
        <input
          type="range"
          min="3"
          max="8"
          step="1"
          value={config.ringCount}
          onChange={(e) => updateField('ringCount', parseInt(e.target.value))}
        />
      </div>

      {/* Random Seed Generator */}
      <div className="flex items-center justify-between bg-[#140f0b] p-2 rounded-lg border border-[var(--border-gold)]/30">
        <span className="text-[11px] text-[#c5bcb1]">Seed:</span>
        <div className="flex items-center space-x-1.5">
          <input
            type="number"
            value={config.seed}
            onChange={(e) => updateField('seed', parseInt(e.target.value) || 1000)}
            className="w-16 bg-[#0e0906] text-[#d4af37] font-mono px-1.5 py-0.5 rounded border border-[var(--border-gold)]/40 text-xs"
          />
          <button
            onClick={() => updateField('seed', Math.floor(Math.random() * 90000) + 1000)}
            className="p-1 rounded bg-[#251910] hover:bg-[#382618] text-[#d4af37]"
            title="Generate Random Seed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Apply and Restart Scenario Button */}
      <button
        onClick={onApplyAndRestart}
        className="btn-primary-gold py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 mt-1"
      >
        <Zap className="w-4 h-4" />
        <span>Deploy Scenario</span>
      </button>
    </div>
  );
};
