import React, { useState } from 'react';
import { MatchAnalysisResult, SkillMatch } from '../types';
import { AlertCircle, CheckCircle, HelpCircle, Key, Filter, Check, Copy } from 'lucide-react';

interface GapAnalysisProps {
  data: MatchAnalysisResult;
}

export const GapAnalysis: React.FC<GapAnalysisProps> = ({ data }) => {
  const [filterType, setFilterType] = useState<'all' | 'missing' | 'matched' | 'critical'>('all');
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const filteredSkills = data.skillsBreakdown.filter((skill) => {
    if (filterType === 'missing') return skill.status === 'missing';
    if (filterType === 'matched') return skill.status === 'matched';
    if (filterType === 'critical') return skill.importance === 'critical';
    return true;
  });

  const copyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    setCopiedKeyword(keyword);
    setTimeout(() => setCopiedKeyword(null), 1500);
  };

  const copyAllMissing = () => {
    navigator.clipboard.writeText(data.missingKeywords.join(', '));
    setCopiedKeyword('__ALL__');
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top 2 columns: Key Strengths vs Critical Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 border border-emerald-950/70 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
          <div className="flex items-center gap-2 mb-3 text-emerald-400 font-semibold text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Top Matched Strengths</span>
          </div>
          <ul className="space-y-2.5">
            {data.keyStrengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900/80 border border-rose-950/70 p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-amber-500" />
          <div className="flex items-center gap-2 mb-3 text-rose-400 font-semibold text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Critical Missing Requirements</span>
          </div>
          <ul className="space-y-2.5">
            {data.criticalGaps.map((gap, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-2" />
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ATS Missing Keywords Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Missing ATS Keywords</h3>
              <p className="text-xs text-slate-400">ATS scanning engines specifically look for these exact terms</p>
            </div>
          </div>
          <button
            onClick={copyAllMissing}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/90 hover:bg-slate-750 text-slate-200 flex items-center gap-1.5 transition"
          >
            {copiedKeyword === '__ALL__' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied All Keywords</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy All Keywords</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {data.missingKeywords.map((kw, idx) => (
            <button
              key={idx}
              onClick={() => copyKeyword(kw)}
              title="Click to copy keyword"
              className="group flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/40 transition cursor-pointer"
            >
              <span>{kw}</span>
              {copiedKeyword === kw ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-rose-400/60 group-hover:text-rose-300" />
              )}
            </button>
          ))}
          {data.missingKeywords.length === 0 && (
            <span className="text-xs text-emerald-400">No major keyword omissions detected! Excellent vocabulary alignment.</span>
          )}
        </div>
      </div>

      {/* Semantic Skills Breakdown Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-white">Full Skill & Competency Matrix</h3>
            <p className="text-xs text-slate-400">Detailed alignment across tools, technical stacks, and soft competencies</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-500 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" />
            </span>
            {(['all', 'critical', 'matched', 'missing'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterType(mode)}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition ${
                  filterType === mode
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Skill / Requirement</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Job Priority</th>
                <th className="py-3 px-4">Match Status</th>
                <th className="py-3 px-4">Resume Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSkills.map((skill, idx) => {
                const statusConfig = {
                  matched: { text: 'Matched', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
                  partial: { text: 'Partial', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
                  missing: { text: 'Missing', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
                }[skill.status];

                const priorityConfig = {
                  critical: 'text-rose-400 font-bold',
                  preferred: 'text-cyan-400',
                  bonus: 'text-slate-400'
                }[skill.importance];

                return (
                  <tr key={idx} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-semibold text-slate-200">{skill.name}</td>
                    <td className="py-3 px-4 capitalize text-slate-400">{skill.category}</td>
                    <td className={`py-3 px-4 capitalize ${priorityConfig}`}>{skill.importance}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${statusConfig.bg}`}>
                        {statusConfig.text}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 italic max-w-xs truncate">
                      {skill.evidenceInResume || 'No direct mention found'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
