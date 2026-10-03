import React from 'react';
import { Target, Sparkles, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  hasResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, hasResult }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">MatchCraft</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Agent v2.5
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">ATS Score, Semantic Gap Analysis & Resume Optimizer</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-medium">ATS Algorithm Simulation Active</span>
            <span className="md:hidden font-medium">ATS Active</span>
          </div>

          {hasResult && (
            <button
              onClick={onReset}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 transition"
            >
              New Match
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
