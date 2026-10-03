import React, { useState } from 'react';
import { BulletRewrite, InteractiveBulletItem } from '../types';
import { optimizeCustomBullet } from '../services/geminiService';
import {
  Wand2,
  Copy,
  Check,
  Sparkles,
  User,
  Tag,
  ArrowRight,
  PlusCircle,
  Edit3,
  CheckCheck,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Layers
} from 'lucide-react';

interface ResumeOptimizerProps {
  headline: string;
  summary: string;
  initialBulletRewrites: BulletRewrite[];
  jobDescriptionText: string;
  missingKeywords?: string[];
}

export const ResumeOptimizer: React.FC<ResumeOptimizerProps> = ({
  headline,
  summary,
  initialBulletRewrites,
  jobDescriptionText,
  missingKeywords = []
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bullets, setBullets] = useState<InteractiveBulletItem[]>(() =>
    initialBulletRewrites.map((b, i) => ({
      ...b,
      id: `bullet-${i}`,
      userEdited: b.improved,
      isCustom: false
    }))
  );

  // Custom bullet optimizer state
  const [customInput, setCustomInput] = useState<string>('');
  const [isOptimizingCustom, setIsOptimizingCustom] = useState<boolean>(false);
  const [customError, setCustomError] = useState<string | null>(null);

  // Search & filter
  const [keywordFilter, setKeywordFilter] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAllOptimizedBullets = () => {
    const textToCopy = bullets
      .map((b) => `• ${b.userEdited || b.improved}`)
      .join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setCopiedId('__ALL_BULLETS__');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOptimizeCustomBullet = async () => {
    if (!customInput.trim()) return;
    setCustomError(null);
    setIsOptimizingCustom(true);

    try {
      const result = await optimizeCustomBullet(
        customInput.trim(),
        jobDescriptionText,
        missingKeywords
      );

      const newItem: InteractiveBulletItem = {
        ...result,
        id: `custom-${Date.now()}`,
        userEdited: result.improved,
        isCustom: true
      };

      setBullets((prev) => [newItem, ...prev]);
      setCustomInput('');
    } catch (err: any) {
      console.error(err);
      setCustomError(err?.message || 'Failed to optimize custom bullet point.');
    } finally {
      setIsOptimizingCustom(false);
    }
  };

  const handleUpdateBulletText = (id: string, text: string) => {
    setBullets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, userEdited: text } : b))
    );
  };

  const filteredBullets = bullets.filter((b) => {
    if (!keywordFilter.trim()) return true;
    const filter = keywordFilter.toLowerCase();
    const matchesTargeted = b.targetedKeywords.some((kw) =>
      kw.toLowerCase().includes(filter)
    );
    const matchesText =
      (b.userEdited || b.improved).toLowerCase().includes(filter) ||
      b.original.toLowerCase().includes(filter);
    return matchesTargeted || matchesText;
  });

  return (
    <div className="space-y-6">
      {/* Targeted Headline & Summary Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-white">Targeted Header & Professional Summary</h3>
              <p className="text-xs text-slate-400">ATS-optimized position headline and elevator pitch tailored for this employer</p>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(`${headline}\n\n${summary}`, 'summary-block')}
            className="text-xs px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            {copiedId === 'summary-block' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied Summary</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Summary Block</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 md:col-span-1">
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider">Recommended Resume Headline</div>
            <div className="text-sm font-semibold text-indigo-300 leading-snug">{headline}</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 md:col-span-2">
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider">Executive ATS Bio</div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{summary}</p>
          </div>
        </div>
      </div>

      {/* Interactive Bullet Optimizer Panel Header & Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Wand2 className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Interactive Bullet Optimizer</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {bullets.length} Bullets Ready
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Side-by-side comparison of original vs. STAR-rewritten accomplishments with injected ATS keywords.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={copyAllOptimizedBullets}
              className="text-xs px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 flex items-center gap-1.5 transition font-medium shadow-sm"
            >
              {copiedId === '__ALL_BULLETS__' ? (
                <>
                  <CheckCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Copied All Bullets!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-indigo-400" />
                  <span>Copy All Improved Bullets</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live On-The-Fly Bullet Transformer Box */}
        <div className="bg-slate-950 p-4 sm:p-5 rounded-xl border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Optimize Any Custom Bullet Point On The Fly</span>
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:inline">Transforms into STAR formula with metrics</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isOptimizingCustom) {
                  e.preventDefault();
                  handleOptimizeCustomBullet();
                }
              }}
              placeholder="Paste a raw bullet (e.g., 'Worked on backend APIs with node and improved speed')..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
            <button
              onClick={handleOptimizeCustomBullet}
              disabled={isOptimizingCustom || !customInput.trim()}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition shrink-0 cursor-pointer"
            >
              {isOptimizingCustom ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Rewriting...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Transform Bullet</span>
                </>
              )}
            </button>
          </div>

          {customError && (
            <p className="text-xs text-rose-400">{customError}</p>
          )}
        </div>

        {/* Keyword Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-400 w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="text"
              value={keywordFilter}
              onChange={(e) => setKeywordFilter(e.target.value)}
              placeholder="Filter by keyword or phrase..."
              className="bg-transparent focus:outline-none text-slate-200 placeholder-slate-500 text-xs w-full"
            />
            {keywordFilter && (
              <button
                onClick={() => setKeywordFilter('')}
                className="text-slate-500 hover:text-slate-300 text-[11px]"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Showing <strong>{filteredBullets.length}</strong> matching accomplishment statements</span>
          </div>
        </div>

        {/* Side-by-side Bullet Comparison Cards */}
        <div className="space-y-5">
          {filteredBullets.map((item, idx) => {
            const isEditing = editingId === item.id;
            const currentImprovedText = item.userEdited || item.improved;

            return (
              <div
                key={item.id}
                className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition"
              >
                {/* Header tag */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-mono flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-300">
                      {item.isCustom ? 'Custom Submitted Bullet' : 'Resume Accomplishment'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingId(isEditing ? null : item.id)}
                      className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-xs"
                      title="Edit rewritten bullet text"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isEditing ? 'Done Editing' : 'Fine Tune'}</span>
                    </button>
                  </div>
                </div>

                {/* Side-by-side Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                  {/* Left: Original Bullet Point */}
                  <div className="lg:col-span-5 bg-slate-900/90 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-rose-400/80 tracking-wider mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        <span>Original Resume Version</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed line-through decoration-rose-500/50 opacity-90">
                        {item.original}
                      </p>
                    </div>
                    <div className="mt-3 text-[11px] text-slate-500 italic">
                      Lacks specific metrics and direct alignment to role keywords.
                    </div>
                  </div>

                  {/* Arrow Indicator in middle on desktop */}
                  <div className="hidden lg:flex lg:col-span-1 items-center justify-center text-indigo-400">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-indigo-400" />
                    </div>
                  </div>

                  {/* Right: Improved STAR Bullet with Copy Button */}
                  <div className="lg:col-span-6 bg-gradient-to-br from-indigo-950/40 to-slate-900 rounded-xl p-4 border border-indigo-500/30 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>STAR & ATS Tailored Accomplishment</span>
                        </div>
                        {/* Copy Button for each bullet */}
                        <button
                          onClick={() => copyToClipboard(currentImprovedText, item.id)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition ${
                            copiedId === item.id
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                              : 'bg-indigo-600/30 hover:bg-indigo-600/50 border-indigo-500/40 text-indigo-200'
                          }`}
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Bullet</span>
                            </>
                          )}
                        </button>
                      </div>

                      {isEditing ? (
                        <textarea
                          value={item.userEdited || item.improved}
                          onChange={(e) => handleUpdateBulletText(item.id, e.target.value)}
                          rows={3}
                          className="w-full bg-slate-950 border border-indigo-500/50 rounded-lg p-2.5 text-xs sm:text-sm text-slate-100 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-400 leading-relaxed"
                        />
                      ) : (
                        <div className="text-xs sm:text-sm text-slate-100 font-sans leading-relaxed">
                          • {currentImprovedText}
                        </div>
                      )}
                    </div>

                    {/* Targeted Keywords Injected */}
                    <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">ATS Keywords:</span>
                      {item.targetedKeywords.map((kw, kIdx) => (
                        <span
                          key={kIdx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/10 text-cyan-300 border border-indigo-500/20 font-mono flex items-center gap-1"
                        >
                          <Tag className="w-2.5 h-2.5 text-cyan-400" />
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recruiter Strategy Insight */}
                <div className="text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-slate-400 leading-relaxed flex items-start gap-2">
                  <span className="text-amber-400 font-semibold shrink-0">Recruiter Rationale:</span>
                  <span>{item.rationale}</span>
                </div>
              </div>
            );
          })}

          {filteredBullets.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              No bullets match the filter "{keywordFilter}". Clear filter to view all recommendations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
