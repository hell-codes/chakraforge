import React, { useState } from 'react';
import { ScenarioConfig, ExperimentSummary, StrategyType } from '../../types/simulation';
import { WarParticles } from '../ui/WarParticles';
import { ExperimentRunner } from '../../simulation/experiments/ExperimentRunner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Play, ChevronDown, ChevronUp, ArrowRight, FlaskConical } from 'lucide-react';

interface ExperimentLabProps {
  currentConfig: ScenarioConfig;
  onLaunchInSimulator?: (config: ScenarioConfig) => void;
}

export const ExperimentLab: React.FC<ExperimentLabProps> = ({ currentConfig, onLaunchInSimulator }) => {
  const [selectedVariable, setSelectedVariable] = useState<'COMMUNICATION' | 'EXIT_KNOWLEDGE' | 'SUPPORT_BLOCKED' | 'STRATEGY_COMPARISON'>('COMMUNICATION');
  const [strategy, setStrategy] = useState<StrategyType>('COMMUNICATION_AWARE');
  const [runsPerCondition, setRunsPerCondition] = useState<number>(8);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Advanced parameters
  const [seed, setSeed] = useState<number>(currentConfig.seed || 1042);
  const [agentCount, setAgentCount] = useState<number>(currentConfig.agentCount || 5);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [summaries, setSummaries] = useState<ExperimentSummary[]>([]);
  const [hasRun, setHasRun] = useState<boolean>(false);
  const [history, setHistory] = useState<any[]>([]);

  const handleRunExperiment = async () => {
    setIsRunning(true);
    setProgress(0);

    const baseConfig: ScenarioConfig = {
      ...currentConfig,
      strategy,
      seed,
      agentCount
    };

    let results: ExperimentSummary[] = [];

    if (selectedVariable === 'COMMUNICATION') {
      results = await ExperimentRunner.runCommunicationExperiment(baseConfig, runsPerCondition, (pct) => {
        setProgress(pct);
      });
    } else if (selectedVariable === 'EXIT_KNOWLEDGE') {
      results = await ExperimentRunner.runExitKnowledgeExperiment(baseConfig, runsPerCondition, (pct) => {
        setProgress(pct);
      });
    } else if (selectedVariable === 'STRATEGY_COMPARISON') {
      results = await ExperimentRunner.runStrategyComparisonExperiment(baseConfig, runsPerCondition, (pct) => {
        setProgress(pct);
      });
    } else {
      results = await ExperimentRunner.runSupportBlockedExperiment(baseConfig, runsPerCondition, (pct) => {
        setProgress(pct);
      });
    }

    setSummaries(results);
    setIsRunning(false);
    setHasRun(true);

    const newHistory = {
      id: `EXP-${Date.now().toString().slice(-4)}`,
      variable: selectedVariable,
      trials: runsPerCondition,
      strategy: strategy,
      timestamp: new Date().toLocaleTimeString(),
      successRate: results.length > 0 ? Math.round((results.reduce((acc, s) => acc + s.results.filter(r => r.success).length, 0) / results.reduce((acc, s) => acc + s.completedTrials, 0)) * 100) : 0
    };
    setHistory(prev => [newHistory, ...prev]);
  };

  // Chart data formatting
  const chartData = summaries.map((s) => {
    const label = s.variableValues && s.variableValues.length > 0 ? String(s.variableValues[0]) : s.title;
    return {
      name: label,
      'Coordination Score': Math.round(s.meanCoordinationScore),
      'Mean Duration': Math.round(s.meanSteps),
      'Path Efficiency (%)': Math.round(s.meanEfficiency * 100),
      'Success Rate (%)': Math.round(s.successRate * 100)
    };
  });

  const chartTitle =
    selectedVariable === 'COMMUNICATION'
      ? `Coordination Score & Path Efficiency by Communication Reliability (n = ${runsPerCondition} per condition)`
      : selectedVariable === 'EXIT_KNOWLEDGE'
      ? `Success Rate & Path Efficiency by Exit Knowledge (n = ${runsPerCondition} per condition)`
      : `Coordination & Duration by Chokepoint Blockade (n = ${runsPerCondition} per condition)`;

  // Aggregates for 4 core metrics
  const totalCompletedRuns = summaries.reduce((acc, s) => acc + s.completedTrials, 0);
  const overallSuccessCount = summaries.reduce((acc, s) => acc + s.results.filter((r) => r.success).length, 0);
  const overallSuccessRate = totalCompletedRuns > 0 ? Math.round((overallSuccessCount / totalCompletedRuns) * 100) : 0;
  const overallMeanSteps = totalCompletedRuns > 0 ? Math.round(summaries.reduce((acc, s) => acc + s.meanSteps * s.completedTrials, 0) / totalCompletedRuns) : 0;
  const overallIsolationSteps = totalCompletedRuns > 0 ? Math.round(summaries.reduce((acc, s) => acc + s.meanIsolationSteps * s.completedTrials, 0) / totalCompletedRuns) : 0;
  const overallMeanEfficiency = totalCompletedRuns > 0 ? Math.round((summaries.reduce((acc, s) => acc + s.meanEfficiency * s.completedTrials, 0) / totalCompletedRuns) * 100) : 0;

  return (
    <div className="w-full bg-[#0a0705] text-[#f5f1eb] min-h-full py-8 lg:py-10 relative">
      <WarParticles />
      <div className="page-container flex flex-col gap-6 lg:gap-8 relative z-10">
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-[#2d2218] pb-8">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#c09f58] uppercase tracking-widest">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Empirical Sweeps • Hypothesis Testing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#f5f1eb]">
            Experiment Workspace
          </h1>
          <p className="text-base text-[#a89b8c] max-w-3xl leading-relaxed">
            What are you testing? Select an independent variable and decision policy to execute batch Monte Carlo trials and measure multi-agent coordination metrics.
          </p>
        </header>

        {/* CONTROLS WORKSPACE */}
        <section className="p-8 lg:p-12 rounded-2xl bg-[#120d09] border border-[#261b13] flex flex-col gap-8 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Variable */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono uppercase text-[#8e8376] block">
                Independent Variable
              </label>
              <select
                value={selectedVariable}
                onChange={(e) => setSelectedVariable(e.target.value as any)}
                className="w-full p-3 rounded-lg bg-[#18110b] border border-[#2d1e13] text-[#f5f1eb] text-xs font-mono focus:outline-none focus:border-[#c09f58]"
              >
                <option value="COMMUNICATION">Communication Reliability (0%–100%)</option>
                <option value="EXIT_KNOWLEDGE">Exit Knowledge (0%–100%)</option>
                <option value="SUPPORT_BLOCKED">Jayadratha Chokepoint (Blocked vs Open)</option>
                <option value="STRATEGY_COMPARISON">Strategy Comparison</option>
              </select>
            </div>

            {/* Strategy */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono uppercase text-[#8e8376] block">
                Decision Strategy
              </label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value as StrategyType)}
                className="w-full p-3 rounded-lg bg-[#18110b] border border-[#2d1e13] text-[#f5f1eb] text-xs font-mono focus:outline-none focus:border-[#c09f58]"
              >
                <option value="COMMUNICATION_AWARE">Communication-Aware Policy</option>
                <option value="INFORMATION_AWARE">Information-Aware Policy</option>
                <option value="COORDINATED">Coordinated Multi-Agent</option>
                <option value="ADAPTIVE">Adaptive Breakout Policy</option>
                <option value="GREEDY">Greedy Heuristic</option>
              </select>
            </div>

            {/* Trials */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono uppercase text-[#8e8376] block">
                Sample Size (n per condition)
              </label>
              <select
                value={runsPerCondition}
                onChange={(e) => setRunsPerCondition(Number(e.target.value))}
                className="w-full p-3 rounded-lg bg-[#18110b] border border-[#2d1e13] text-[#f5f1eb] text-xs font-mono focus:outline-none focus:border-[#c09f58]"
              >
                <option value={5}>n = 5 trials</option>
                <option value={8}>n = 8 trials (recommended)</option>
                <option value={15}>n = 15 trials</option>
                <option value={25}>n = 25 trials</option>
              </select>
            </div>
          </div>

          {/* Advanced Options (Collapsed by Default) */}
          <div className="pt-2 border-t border-[#1f150e]">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-[#8e8376] hover:text-[#c09f58] flex items-center space-x-1.5 font-mono"
            >
              <span>{showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options (Seed, Agent Count)'}</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#8e8376]">Base Seed (Deterministic PRNG)</label>
                  <input
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg bg-[#18110b] border border-[#2d1e13] text-[#f5f1eb] text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#8e8376]">Pandava Support Count</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={agentCount}
                    onChange={(e) => setAgentCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg bg-[#18110b] border border-[#2d1e13] text-[#f5f1eb] text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Run Button & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#1f150e]">
            <div className="text-xs text-[#8e8376]">
              {isRunning ? `Simulating batch trials: ${progress}% complete...` : 'Ready to execute simulated trials.'}
            </div>

            <button
              onClick={handleRunExperiment}
              disabled={isRunning}
              className="btn-primary-gold px-8 py-3 text-xs tracking-wider flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'RUNNING EXPERIMENT...' : 'RUN EXPERIMENT'}</span>
            </button>
          </div>

          {/* Progress Bar */}
          {isRunning && (
            <div className="w-full h-1 bg-[#18110b] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c09f58] transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </section>

        {/* RESULTS SECTION (Appears only after data exists) */}
        {hasRun && summaries.length > 0 && (
          <section className="flex flex-col gap-8 animate-in fade-in duration-500">
            {/* The 4 Core Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Metric 1: Success / Outcome */}
              <div className="p-6 rounded-lg bg-[#110c08] border border-[#221810] text-center flex flex-col gap-1">
                <span className="text-[11px] font-mono uppercase text-[#8e8376] block">Outcome / Success</span>
                <div className="text-2xl font-serif text-[#f5f1eb]">
                  {totalCompletedRuns === 0
                    ? '—'
                    : selectedVariable === 'COMMUNICATION' && currentConfig.mode === 'HISTORICAL'
                    ? 'Historical'
                    : `${overallSuccessRate}%`}
                </div>
                <span className="text-[11px] text-[#8e8376] block">
                  {overallSuccessCount} of {totalCompletedRuns} runs
                </span>
              </div>

              {/* Metric 2: Mean Duration */}
              <div className="p-6 rounded-lg bg-[#110c08] border border-[#221810] text-center flex flex-col gap-1">
                <span className="text-[11px] font-mono uppercase text-[#8e8376] block">Mean Duration</span>
                <div className="text-2xl font-serif text-[#c09f58]">
                  {overallMeanSteps} <span className="text-xs font-mono text-[#8e8376]">steps</span>
                </div>
                <span className="text-[11px] text-[#8e8376] block">
                  ~{(overallMeanSteps * 0.0625).toFixed(1)}s elapsed
                </span>
              </div>

              {/* Metric 3: Isolation Duration */}
              <div className="p-6 rounded-lg bg-[#110c08] border border-[#221810] text-center flex flex-col gap-1">
                <span className="text-[11px] font-mono uppercase text-[#8e8376] block">Isolation Duration</span>
                <div className="text-2xl font-serif text-[#f5f1eb]">
                  {overallIsolationSteps} <span className="text-xs font-mono text-[#8e8376]">steps</span>
                </div>
                <span className="text-[11px] text-[#8e8376] block">Comms severed</span>
              </div>

              {/* Metric 4: Path Efficiency */}
              <div className="p-6 rounded-lg bg-[#110c08] border border-[#221810] text-center flex flex-col gap-1">
                <span className="text-[11px] font-mono uppercase text-[#8e8376] block">Path Efficiency</span>
                <div className="text-2xl font-serif text-[#c09f58]">
                  {overallMeanEfficiency}%
                </div>
                <span className="text-[11px] text-[#8e8376] block">Euclidean vs actual</span>
              </div>
            </div>

            {/* Professional Recharts Chart */}
            <div className="p-8 rounded-xl bg-[#120d09] border border-[#261b13] flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-serif text-[#f5f1eb]">{chartTitle}</h3>
                <span className="text-xs font-mono text-[#8e8376] block">
                  Sample size: n = {runsPerCondition} trials per condition across deterministic seed sweeps
                </span>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#221810" />
                    <XAxis dataKey="name" stroke="#8e8376" fontSize={11} />
                    <YAxis stroke="#8e8376" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#140e0a', borderColor: '#2d1e13', borderRadius: '6px', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar dataKey="Coordination Score" fill="#c09f58" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="Path Efficiency (%)" fill="#4d7c5f" radius={[2, 2, 0, 0]} />
                    {selectedVariable !== 'COMMUNICATION' && (
                      <Bar dataKey="Success Rate (%)" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Clean Results Table */}
            <div className="p-8 lg:p-12 rounded-2xl bg-[#120d09] border border-[#261b13] flex flex-col gap-6 shadow-2xl">
              <h3 className="text-base font-serif text-[#f5f1eb]">Trial Metrics Breakdown</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#261b13] text-[#8e8376] font-mono">
                      <th className="py-3 px-3">Condition</th>
                      <th className="py-3 px-3 text-center">Completed</th>
                      <th className="py-3 px-3 text-center">Outcome</th>
                      <th className="py-3 px-3 text-center">Mean Duration</th>
                      <th className="py-3 px-3 text-center">Isolation Steps</th>
                      <th className="py-3 px-3 text-center">Efficiency</th>
                      <th className="py-3 px-3 text-right">3D Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaries.map((s, idx) => {
                      const conditionLabel = s.variableValues && s.variableValues.length > 0 ? String(s.variableValues[0]) : s.title;
                      const outcomeText = s.config.mode === 'HISTORICAL'
                        ? 'Historical End'
                        : s.successRate > 0.5
                        ? 'Success'
                        : 'Defeat';

                      return (
                        <tr key={`row-${idx}`} className="border-b border-[#1b140e] hover:bg-[#16100b] transition-colors">
                          <td className="py-3 px-3 font-medium text-[#f5f1eb]">{conditionLabel}</td>
                          <td className="py-3 px-3 text-center font-mono text-[#8e8376]">{s.completedTrials} trials</td>
                          <td className="py-3 px-3 text-center">
                            <span className="text-[11px] font-mono text-[#c09f58]">
                              {outcomeText}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-[#f5f1eb]">{Math.round(s.meanSteps)}</td>
                          <td className="py-3 px-3 text-center font-mono text-[#8e8376]">{Math.round(s.meanIsolationSteps)}</td>
                          <td className="py-3 px-3 text-center font-mono text-[#c09f58]">{(s.meanEfficiency * 100).toFixed(1)}%</td>
                          <td className="py-3 px-3 text-right">
                            {onLaunchInSimulator && (
                              <button
                                onClick={() => onLaunchInSimulator(s.config)}
                                className="px-3 py-1 rounded bg-[#18110b] hover:bg-[#c09f58] hover:text-[#0a0705] text-[#c09f58] text-[11px] font-mono transition-colors inline-flex items-center space-x-1"
                              >
                                <span>Verify in 3D</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* EXPERIMENT HISTORY SECTION */}
        {history.length > 0 && (
          <section className="p-8 lg:p-12 rounded-2xl bg-[#120d09] border border-[#261b13] space-y-6 shadow-2xl mt-12 animate-in fade-in duration-500">
            <div className="flex items-center space-x-2 border-b border-[#2d2218] pb-4">
              <FlaskConical className="w-4 h-4 text-[#8e8376]" />
              <h3 className="text-base font-serif text-[#f5f1eb]">Experiment History</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#261b13] text-[#8e8376] font-mono">
                    <th className="py-3 px-3">ID</th>
                    <th className="py-3 px-3">Time</th>
                    <th className="py-3 px-3">Variable</th>
                    <th className="py-3 px-3">Strategy</th>
                    <th className="py-3 px-3 text-center">n (per condition)</th>
                    <th className="py-3 px-3 text-center">Overall Success</th>
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} className="border-b border-[#1b140e] hover:bg-[#16100b] transition-colors">
                      <td className="py-3 px-3 font-mono text-[#c09f58]">{h.id}</td>
                      <td className="py-3 px-3 text-[#8e8376]">{h.timestamp}</td>
                      <td className="py-3 px-3 font-medium text-[#f5f1eb]">{h.variable}</td>
                      <td className="py-3 px-3 text-[#8e8376] font-mono">{h.strategy}</td>
                      <td className="py-3 px-3 text-center font-mono text-[#8e8376]">{h.trials}</td>
                      <td className="py-3 px-3 text-center text-[#c09f58] font-mono">{h.successRate}%</td>
                      <td className="py-3 px-3 text-right text-[#4d7c5f] font-mono text-[10px] uppercase tracking-wider">Completed</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
