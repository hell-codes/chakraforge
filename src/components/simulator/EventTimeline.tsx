import React, { useState } from 'react';
import { SimulationEvent, EventCategory } from '../../types/simulation';
import { ListFilter, Radio, Shield, AlertTriangle, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface EventTimelineProps {
  events: SimulationEvent[];
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  events,
  isExpanded,
  onToggleExpanded
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter((e) => {
    if (selectedCategory !== 'ALL' && e.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
    }
    return true;
  });

  if (!isExpanded) return null;

  return (
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[92vw] max-w-4xl h-48 surface-panel p-3 text-xs select-none flex flex-col gap-2 z-25 border border-[var(--border-gold)] shadow-2xl rounded-xl backdrop-blur-md animate-in slide-in-from-bottom duration-200">
      {/* Timeline Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-gold)]/30 pb-1.5">
        <div className="flex items-center space-x-2">
          <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
          <h3 className="font-serif font-bold text-xs text-[#f5f1eb] tracking-wider">EVENT TIMELINE</h3>
          <span className="text-[10px] font-mono text-[#8e8376]">({filteredEvents.length} shown)</span>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center space-x-1 text-[10px] font-mono overflow-x-auto">
          {(['ALL', 'COMMUNICATION', 'GATE_CHANGE', 'COLLISION', 'SUCCESS', 'FORMATION'] as (EventCategory | 'ALL')[]).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#d4af37] text-[#0d0905] font-bold shadow-sm'
                    : 'bg-[#140f0b] text-[#c5bcb1] hover:text-[#f5f1eb] border border-[var(--border-subtle)]'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        <button
          onClick={onToggleExpanded}
          className="text-[#8e8376] hover:text-[#f5f1eb] p-1 rounded hover:bg-[#251910]"
          title="Minimize Timeline"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Events Stream */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-1 font-mono text-[11px] pr-1">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((evt) => {
            const severityColor =
              evt.severity === 'success'
                ? 'text-[#10b981] border-[#10b981]/30 bg-[#10b981]/10'
                : evt.severity === 'error'
                ? 'text-[#ef4444] border-[#ef4444]/30 bg-[#ef4444]/10'
                : evt.severity === 'warning'
                ? 'text-[#f59e0b] border-[#f59e0b]/30 bg-[#f59e0b]/10'
                : 'text-[#c5bcb1] border-[var(--border-subtle)] bg-[#140f0b]/60';

            return (
              <div
                key={evt.id}
                className={`p-1.5 rounded-md border flex items-center justify-between gap-3 ${severityColor}`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-[#d4af37] font-bold text-[10px]">STEP {evt.step}</span>
                  <span className="text-[10px] uppercase font-semibold text-[#f5f1eb]">{evt.title}</span>
                  <span className="text-[#8e8376] hidden sm:inline text-[10px]">— {evt.description}</span>
                </div>
                {evt.agentId && (
                  <span className="text-[9px] bg-[#22160d] px-1.5 py-0.5 rounded text-[#d4af37] border border-[var(--border-gold)]/30">
                    {evt.agentId}
                  </span>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-[#70675c] text-center py-4 italic">No matching simulation events logged.</div>
        )}
      </div>
    </div>
  );
};
