import React, { useState, useEffect } from 'react';
import { generateCoverLetter } from '../services/geminiService';
import { Mail, Sparkles, Copy, Check, RefreshCw, Star, CheckCircle2 } from 'lucide-react';

interface CoverLetterGeneratorProps {
  resumeText: string;
  jobDescriptionText: string;
  keyStrengths?: string[];
  autoTrigger?: boolean;
}

export const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({
  resumeText,
  jobDescriptionText,
  keyStrengths = [],
  autoTrigger = false,
}) => {
  const [tone, setTone] = useState<'confident' | 'technical' | 'conversational' | 'executive'>('confident');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = async (selectedTone = tone) => {
    setIsGenerating(true);
    try {
      const result = await generateCoverLetter(resumeText, jobDescriptionText, selectedTone, keyStrengths);
      setCoverLetter(result);
    } catch (err) {
      console.error(err);
      setCoverLetter('Error generating cover letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (autoTrigger && !coverLetter && !isGenerating) {
      handleGenerate(tone);
    }
  }, [autoTrigger]);

  const copyLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-white">Targeted Cover Letter Generator</h3>
            <p className="text-xs text-slate-400">Directly pitches your verified strengths to solve this role's key objectives</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {coverLetter && (
            <button
              onClick={copyLetter}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-750 flex items-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Letter</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => handleGenerate(tone)}
            disabled={isGenerating}
            className="text-xs px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1.5 shadow transition disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Drafting Letter...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{coverLetter ? 'Regenerate' : 'Generate Cover Letter'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Highlighted Candidate Strengths Included */}
      {keyStrengths.length > 0 && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
          <div className="text-slate-400 font-semibold flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <Star className="w-3 h-3 text-amber-400" />
            <span>Targeted Matching Strengths Injected:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {keyStrengths.slice(0, 4).map((str, idx) => (
              <span key={idx} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                {str}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tone Selection Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-slate-400 mr-1 font-medium">Desired Tone:</span>
        {(['confident', 'technical', 'executive', 'conversational'] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTone(t);
              handleGenerate(t);
            }}
            className={`text-xs px-3 py-1 rounded-lg capitalize border transition ${
              tone === t
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 font-semibold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Output Display */}
      {coverLetter ? (
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 font-sans leading-relaxed whitespace-pre-line shadow-inner">
          {coverLetter}
        </div>
      ) : (
        <div className="bg-slate-950/60 p-8 rounded-xl border border-slate-800/80 text-center space-y-2">
          <p className="text-xs text-slate-400">
            Click <strong>"Generate Cover Letter"</strong> to automatically draft a high-impact, personalized pitch aligned with this employer's criteria.
          </p>
        </div>
      )}
    </div>
  );
};
