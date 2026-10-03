import React, { useState } from 'react';
import { SAMPLE_PRESETS } from '../constants';
import { PresetSample } from '../types';
import { scrapeJobDescriptionFromUrl } from '../services/geminiService';
import { FileText, Briefcase, Sparkles, Upload, ArrowRight, Wand2, Globe, Link2, ExternalLink, Check, AlertCircle, Loader2 } from 'lucide-react';

interface InputSectionProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  jobDescriptionText: string;
  setJobDescriptionText: (text: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  resumeText,
  setResumeText,
  jobDescriptionText,
  setJobDescriptionText,
  onAnalyze,
  isLoading
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [jobUrl, setJobUrl] = useState<string>('');
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [scrapedSource, setScrapedSource] = useState<{ title?: string; uri?: string } | null>(null);

  const handleApplyPreset = (preset: PresetSample) => {
    setSelectedPresetId(preset.id);
    setResumeText(preset.resume);
    setJobDescriptionText(preset.jobDescription);
    setJobUrl('');
    setScrapedSource(null);
    setScrapeError(null);
  };

  const handleScrapeUrl = async () => {
    if (!jobUrl.trim()) return;
    setScrapeError(null);

    // Validate URL with standard native web API
    try {
      new URL(jobUrl.trim());
    } catch {
      setScrapeError('Please enter a valid URL (e.g., https://jobs.lever.co/company/role or https://linkedin.com/jobs/view/...)');
      return;
    }

    setIsScraping(true);
    try {
      const { text, sources } = await scrapeJobDescriptionFromUrl(jobUrl.trim());
      if (!text || text.length < 50) {
        throw new Error('Unable to extract job requirements from this page. Please paste the job description text directly.');
      }
      setJobDescriptionText(text);
      setSelectedPresetId('');
      if (sources && sources.length > 0) {
        setScrapedSource(sources[0]);
      } else {
        setScrapedSource({ uri: jobUrl.trim(), title: 'Target Job URL' });
      }
    } catch (err: any) {
      console.error(err);
      setScrapeError(err?.message || 'Failed to extract job posting. You can copy-paste the text directly.');
    } finally {
      setIsScraping(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'resume' | 'jd') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (target === 'resume') {
        setResumeText(content);
      } else {
        setJobDescriptionText(content);
      }
    };
    reader.readAsText(file);
  };

  const resumeWordCount = resumeText.trim() ? resumeText.trim().split(/\s+/).length : 0;
  const jdWordCount = jobDescriptionText.trim() ? jobDescriptionText.trim().split(/\s+/).length : 0;
  const isReady = resumeText.trim().length > 40 && jobDescriptionText.trim().length > 40;

  return (
    <div className="space-y-6">
      {/* Sample presets bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 p-3 sm:p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
          <Wand2 className="w-4 h-4 text-indigo-400" />
          <span>Quick Demo Presets:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
                selectedPresetId === preset.id
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-750 hover:text-white'
              }`}
            >
              <span>{preset.title}</span>
            </button>
          ))}
          {(resumeText || jobDescriptionText) && (
            <button
              onClick={() => {
                setSelectedPresetId('');
                setResumeText('');
                setJobDescriptionText('');
                setJobUrl('');
                setScrapedSource(null);
                setScrapeError(null);
              }}
              className="text-xs px-2.5 py-1.5 text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Two columns: Resume & Job Description */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Input Panel */}
        <div className="flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl relative group focus-within:border-indigo-500/60 transition">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="font-semibold text-slate-100 text-sm sm:text-base">Candidate Resume</h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>{resumeWordCount} words</span>
              <label className="cursor-pointer flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload .txt/.md</span>
                <input
                  type="file"
                  accept=".txt,.md,.rtf"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'resume')}
                />
              </label>
            </div>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => {
              setResumeText(e.target.value);
              setSelectedPresetId('');
            }}
            placeholder="Paste raw resume text here (Summary, Work Experience, Skills, Education)..."
            rows={15}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono resize-y leading-relaxed"
          />

          <p className="text-[11px] text-slate-500 mt-2">
            Tip: Include dates, technologies, metrics, and project bullets for accurate ATS scoring.
          </p>
        </div>

        {/* Job Description Input Panel with URL Scraper */}
        <div className="flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl relative group focus-within:border-cyan-500/60 transition">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <h2 className="font-semibold text-slate-100 text-sm sm:text-base">Target Job Description</h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>{jdWordCount} words</span>
              <label className="cursor-pointer flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept=".txt,.md,.rtf"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'jd')}
                />
              </label>
            </div>
          </div>

          {/* Web Scraping Input Bar */}
          <div className="mb-3 space-y-1.5">
            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 focus-within:border-cyan-500/80 transition">
              <div className="pl-2 text-slate-500">
                <Globe className="w-4 h-4 text-cyan-400" />
              </div>
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => {
                  setJobUrl(e.target.value);
                  setScrapeError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleScrapeUrl();
                  }
                }}
                placeholder="Paste job link (LinkedIn, Lever, Greenhouse, Indeed, etc.)..."
                className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none px-2 py-1"
              />
              <button
                type="button"
                onClick={handleScrapeUrl}
                disabled={isScraping || !jobUrl.trim()}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  isScraping || !jobUrl.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20'
                }`}
              >
                {isScraping ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Scraping...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Extract Role</span>
                  </>
                )}
              </button>
            </div>

            {scrapeError && (
              <div className="flex items-center gap-1.5 text-[11px] text-rose-400 px-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{scrapeError}</span>
              </div>
            )}

            {scrapedSource && (
              <div className="flex items-center justify-between text-[11px] bg-cyan-950/30 border border-cyan-800/40 text-cyan-300 px-2.5 py-1 rounded-lg">
                <span className="flex items-center gap-1 truncate">
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">Extracted from: {scrapedSource.title || scrapedSource.uri}</span>
                </span>
                {scrapedSource.uri && (
                  <a
                    href={scrapedSource.uri}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-0.5 text-cyan-400 hover:underline shrink-0 ml-2"
                  >
                    <span>View</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          <textarea
            value={jobDescriptionText}
            onChange={(e) => {
              setJobDescriptionText(e.target.value);
              setSelectedPresetId('');
            }}
            placeholder="Paste target job description, responsibilities, requirements, and tech stack here (or use the web-scraping link extractor above)..."
            rows={12}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono resize-y leading-relaxed flex-1"
          />

          <p className="text-[11px] text-slate-500 mt-2">
            Tip: Automatic scraping extracts title, responsibilities, minimum qualifications, and tools directly into the box.
          </p>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={onAnalyze}
          disabled={!isReady || isLoading}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all duration-200 ${
            isReady && !isLoading
              ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white shadow-indigo-500/25 cursor-pointer scale-100 hover:scale-[1.01]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Analyzing Resume against ATS criteria...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Run Match Agent Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
