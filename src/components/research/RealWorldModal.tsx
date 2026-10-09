import React from 'react';
import { X, Shield, ExternalLink } from 'lucide-react';
import { RealWorldApplications } from './RealWorldApplications';

interface RealWorldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RealWorldModal: React.FC<RealWorldModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-5xl h-[90vh] bg-[#0c0907] border border-[var(--border-gold)] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#140e0a] border-b border-[var(--border-subtle)]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-[#f5f1eb]">
                Real-World Defense & Cyber Relevance
              </h2>
              <p className="text-[11px] text-[#8e8376]">
                Operational mapping: Ancient Chakravyūha to 21st-Century Cyber-Physical Systems
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8e8376] hover:text-[#f5f1eb] hover:bg-[#231911] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto">
          <RealWorldApplications />
        </div>
      </div>
    </div>
  );
};
