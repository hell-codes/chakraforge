import React from 'react';
import { MetricsSnapshot } from '../../types/simulation';
import { Activity, Award, Radio, AlertTriangle, CheckCircle, Navigation, Users } from 'lucide-react';

interface LiveMetricsPanelProps {
  metrics: MetricsSnapshot | null;
  agentCount: number;
}

export const LiveMetricsPanel: React.FC<LiveMetricsPanelProps> = ({ metrics, agentCount }) => {
  if (!metrics) return null;

  const scoreColor =
    metrics.coordinationScore >= 75
      ? 'text-[#10b981]'
      : metrics.coordinationScore >= 45
      ? 'text-[#f59e0b]'
      : 'text-[#ef4444]';

  return (
    <div className="w-72 max-h-[calc(100vh-130px)] overflow-y-auto glass-panel p-3.5 text-xs select-none flex flex-col gap-3.5 border-l border-[var(--border-gold)] z-20 shadow-2xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-gold)]/30 pb-2">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[#22d3ee]" />
          <h2 className="font-serif font-bold text-sm text-[#f5f1eb] tracking-wide">LIVE METRICS HUD</h2>
        </div>
        <span className="text-[10px] font-mono text-[#8e8376]">TICK #{metrics.step}</span>
      </div>

      {/* Main Coordination Score Gauge */}
      <div className="bg-[#140f0b] p-3 rounded-lg border border-[var(--border-gold)]/35 flex items-center justify-between shadow-inner">
        <div>
          <div className="text-[10px] uppercase font-semibold text-[#c5bcb1] flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#d4af37]" /> Coordination Score
          </div>
          <div className="text-[10px] text-[#8e8376] mt-0.5">Formal POMDP index</div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-black font-mono ${scoreColor}`}>
            {metrics.coordinationScore}
            <span className="text-xs text-[#8e8376] font-normal">/100</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 gap-2 font-mono">
        <div className="bg-[#17110c] p-2 rounded-lg border border-[var(--border-subtle)]">
          <div className="text-[10px] text-[#c5bcb1] flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-[#d4af37]" /> {metrics.mode === 'HISTORICAL' ? 'Scenario State' : 'Escape Likelihood'}
          </div>
          <div className="text-xs font-bold text-[#f5f1eb] mt-1 tracking-tight truncate">
            {metrics.mode === 'HISTORICAL'
              ? (metrics.phase === 'DEFEATED' ? 'HISTORICAL END' : (metrics.phase || 'APPROACHING'))
              : (metrics.phase === 'ESCAPE_SUCCESS' ? 'ESCAPED (100%)' : metrics.exitKnowledgePercent > 0 ? `${(metrics.successRate * 100).toFixed(1)}%` : '0.0%')}
          </div>
          <div className="text-[9px] text-[#8e8376] mt-0.5">
            {metrics.mode === 'HISTORICAL'
              ? (metrics.abhimanyuLayer > 0 ? `Penetrating Tier ${metrics.abhimanyuLayer}` : 'Outside Perimeter')
              : `Exit Knowledge: ${metrics.exitKnowledgePercent}%`}
          </div>
        </div>

        <div className="bg-[#17110c] p-2 rounded-lg border border-[var(--border-subtle)]">
          <div className="text-[10px] text-[#c5bcb1] flex items-center gap-1">
            <Navigation className="w-3 h-3 text-[#22d3ee]" /> Path Efficiency (η)
          </div>
          <div className="text-sm font-bold text-[#22d3ee] mt-0.5">
            {(metrics.movementEfficiency * 100).toFixed(1)}%
          </div>
          <div className="text-[9px] text-[#8e8376] mt-0.5">Corridor trajectory</div>
        </div>

        <div className="bg-[#17110c] p-2 rounded-lg border border-[var(--border-subtle)]">
          <div className="text-[10px] text-[#c5bcb1] flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-[#ef4444]" /> Wall Collisions
          </div>
          <div className="text-sm font-bold text-[#ef4444] mt-0.5">
            {metrics.totalCollisions}
          </div>
          <div className="text-[9px] text-[#8e8376] mt-0.5">Deflected impacts</div>
        </div>

        <div className="bg-[#17110c] p-2 rounded-lg border border-[var(--border-subtle)]">
          <div className="text-[10px] text-[#c5bcb1] flex items-center gap-1">
            <Radio className="w-3 h-3 text-[#d4af37]" /> Comm Packets
          </div>
          <div className="text-sm font-bold text-[#d4af37] mt-0.5">
            {metrics.successfulComms} / {metrics.commOverhead}
          </div>
          <div className="text-[9px] text-[#8e8376] mt-0.5">
            {metrics.supportBlocked ? 'Jayadratha Severed' : 'Channel Open'}
          </div>
        </div>
      </div>

      {/* Swarm Status Distribution */}
      <div className="bg-[#140f0b] p-2.5 rounded-lg border border-[var(--border-gold)]/25">
        <div className="text-[10px] font-semibold text-[#c5bcb1] uppercase tracking-wider mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 text-[#d4af37]" /> Agent Status Distribution
          </span>
          <span className="font-mono text-[#f5f1eb]">{agentCount} Total</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[11px]">
          <div className="bg-[#10b981]/10 text-[#10b981] py-1.5 rounded border border-[#10b981]/30">
            <div className="text-xs font-bold">{metrics.activeCount}</div>
            <div className="text-[9px] text-[#8e8376]">ACTIVE</div>
          </div>

          <div className="bg-[#f59e0b]/10 text-[#f59e0b] py-1.5 rounded border border-[#f59e0b]/30">
            <div className="text-xs font-bold">{metrics.supportBlocked ? Math.max(0, agentCount - metrics.activeCount - metrics.eliminatedCount) : 0}</div>
            <div className="text-[9px] text-[#8e8376]">BLOCKED</div>
          </div>

          <div className="bg-[#ef4444]/10 text-[#ef4444] py-1.5 rounded border border-[#ef4444]/30">
            <div className="text-xs font-bold">{metrics.eliminatedCount}</div>
            <div className="text-[9px] text-[#8e8376]">{metrics.mode === 'HISTORICAL' ? 'CONTAINED' : 'ELIMINATED'}</div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="flex flex-col gap-1.5 text-[11px]">
        <div className="flex justify-between py-1 border-b border-[var(--border-gold)]/20">
          <span className="text-[#a89f91]">Group Cohesion (Γ):</span>
          <span className="text-[#f5f0e8] font-mono">{(metrics.groupCohesion * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between py-1 border-b border-[var(--border-gold)]/20">
          <span className="text-[#a89f91]">Distance to Central Zone:</span>
          <span className="text-[#f5f0e8] font-mono">{metrics.avgDistanceToTarget.toFixed(2)}m</span>
        </div>
        <div className="flex justify-between py-1 border-b border-[var(--border-gold)]/20">
          <span className="text-[#a89f91]">Information Utilization:</span>
          <span className="text-[#f5f0e8] font-mono">{(metrics.infoUtilization * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-[#a89f91]">Route Deviation:</span>
          <span className="text-[#f5f0e8] font-mono">{(metrics.routeDeviation * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};
