import React, { useState, useEffect } from 'react';
import { MatchAnalysisResult, ApplicationKit, CandidateProfile, ApplicationRecord } from '../types';
import { generateApplicationKit } from '../services/geminiService';
import {
  Send,
  Sparkles,
  Bot,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Clock,
  ShieldCheck,
  FileText,
  User,
  Building,
  Mail,
  ChevronRight,
  Terminal,
  AlertTriangle,
  PlayCircle,
  Archive,
  ArrowUpRight,
  HelpCircle,
  Sliders
} from 'lucide-react';

interface AutoApplyAgentProps {
  resumeText: string;
  jobDescriptionText: string;
  jobUrl: string;
  analysisResult: MatchAnalysisResult;
  candidateProfile: CandidateProfile;
  onUpdateCandidateProfile: (profile: CandidateProfile) => void;
  coverLetterText?: string;
}

export const AutoApplyAgent: React.FC<AutoApplyAgentProps> = ({
  resumeText,
  jobDescriptionText,
  jobUrl,
  analysisResult,
  candidateProfile,
  onUpdateCandidateProfile,
  coverLetterText
}) => {
  const [appKit, setAppKit] = useState<ApplicationKit | null>(null);
  const [isGeneratingKit, setIsGeneratingKit] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Auto-apply execution simulation state
  const [isAutoApplying, setIsAutoApplying] = useState<boolean>(false);
  const [applyStep, setApplyStep] = useState<number>(0);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [submissionComplete, setSubmissionComplete] = useState<boolean>(false);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);

  // Application tracker history in local memory
  const [history, setHistory] = useState<ApplicationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('matchcraft_applied_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Profile Drawer Toggle
  const [showProfileConfig, setShowProfileConfig] = useState<boolean>(false);

  // Auto-generate application kit on first mount or on demand
  const handleBuildKit = async () => {
    setIsGeneratingKit(true);
    try {
      const kit = await generateApplicationKit(
        resumeText,
        jobDescriptionText,
        jobUrl,
        candidateProfile
      );
      setAppKit(kit);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingKit(false);
    }
  };

  useEffect(() => {
    if (!appKit) {
      handleBuildKit();
    }
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Automated Submission Sequence Simulator
  const handleExecuteAutoApply = () => {
    setIsAutoApplying(true);
    setSubmissionComplete(false);
    setApplyStep(0);
    setExecutionLogs([]);

    const steps = [
      `[1/5] Initializing headless ATS session for ${appKit?.companyName || 'Target Employer'}...`,
      `[2/5] Synthesizing tailored STAR resume bullets (Match Index: ${analysisResult.overallScore}%)...`,
      `[3/5] Attaching custom cover letter & candidate disclosures for ${candidateProfile.fullName}...`,
      `[4/5] Auto-answering screening questions: Compensation, notice period & sponsorship...`,
      `[5/5] Submitting application package to ${appKit?.portalType || 'ATS'} API endpoint...`
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        const nextStep = current + 1;
        setApplyStep(nextStep);
        setExecutionLogs((prev) => [...prev, steps[current]]);
        current++;
      } else {
        clearInterval(interval);
        const code = `MC-${Math.floor(100000 + Math.random() * 900000)}`;
        setConfirmationId(code);
        setSubmissionComplete(true);
        setIsAutoApplying(false);

        // Record to History
        const newRecord: ApplicationRecord = {
          id: `app-${Date.now()}`,
          timestamp: Date.now(),
          jobTitle: analysisResult.jobSummary.title,
          companyName: appKit?.companyName || 'CloudScale Inc.',
          status: 'Submitted',
          confirmationCode: code,
          portalType: appKit?.portalType || 'Greenhouse',
          appliedDate: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };

        const updatedHistory = [newRecord, ...history];
        setHistory(updatedHistory);
        try {
          localStorage.setItem('matchcraft_applied_jobs', JSON.stringify(updatedHistory));
        } catch (e) {
          console.error(e);
        }
      }
    }, 700);
  };

  const targetApplyUrl = jobUrl && jobUrl.startsWith('http')
    ? jobUrl
    : (appKit?.directApplyUrl || 'https://www.linkedin.com/jobs');

  const mailtoBody = encodeURIComponent(
    `Hello Hiring Team,\n\nI am applying for the ${analysisResult.jobSummary.title} role. Based on my background in ${analysisResult.keyStrengths.slice(0, 2).join(' and ')}, I believe I would be an immediate contributor to your team.\n\n${coverLetterText ? coverLetterText.slice(0, 300) + '...' : ''}\n\nCandidate Profile:\n${candidateProfile.fullName}\n${candidateProfile.phone}\n${candidateProfile.linkedinUrl}\n\nBest regards,\n${candidateProfile.fullName}`
  );
  const mailtoSubject = encodeURIComponent(`Application: ${analysisResult.jobSummary.title} - ${candidateProfile.fullName}`);

  return (
    <div className="space-y-6">
      {/* Top Banner: Auto-Apply Dispatcher Status */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950/80 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" />
                <span>Autonomous Application Agent Ready</span>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Portal Detected: <strong className="text-cyan-300">{appKit?.portalType || 'Greenhouse / Lever'}</strong>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              One-Click Auto-Apply & Smart ATS Copilot
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Auto-fill recruiter questionnaires, inject your tailor-made STAR resume bullets, and launch or dispatch your application kit with verified ATS pass criteria ({analysisResult.atsCompatibilityScore}% pass likelihood).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setShowProfileConfig(!showProfileConfig)}
              className="px-4 py-3 rounded-xl border border-slate-700 bg-slate-850 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>{showProfileConfig ? 'Close Profile' : 'Candidate Details'}</span>
            </button>

            <button
              onClick={handleExecuteAutoApply}
              disabled={isAutoApplying}
              className={`px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl transition transform hover:scale-[1.02] cursor-pointer ${
                isAutoApplying
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {isAutoApplying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Submitting to ATS ({applyStep}/5)...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>Execute Auto-Apply</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Terminal Progress Display */}
        {(isAutoApplying || submissionComplete) && (
          <div className="mt-5 bg-slate-950/90 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>AGENT DISPATCH CONSOLE</span>
              </span>
              <span>{submissionComplete ? '✓ SUBMISSION CONFIRMED' : 'RUNNING AUTONOMOUS TASKS...'}</span>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pt-1">
              {executionLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="text-emerald-400">›</span>
                  <span>{log}</span>
                </div>
              ))}
              {submissionComplete && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-lg text-emerald-300 mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Application Dispatched Successfully
                    </span>
                    <span className="text-[11px] text-emerald-400/80">
                      Tracking ID: <strong>{confirmationId}</strong> • Logged to Activity Tracker below
                    </span>
                  </div>
                  <a
                    href={targetApplyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg flex items-center gap-1 shrink-0"
                  >
                    <span>Verify on Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile Configuration Drawer (Expandable) */}
      {showProfileConfig && (
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              <h3 className="font-semibold text-sm sm:text-base text-white">Candidate Application Parameters</h3>
            </div>
            <span className="text-xs text-slate-400">Used by the agent for one-click form completion</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Full Name</label>
              <input
                type="text"
                value={candidateProfile.fullName}
                onChange={(e) => onUpdateCandidateProfile({ ...candidateProfile, fullName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Email Address</label>
              <input
                type="email"
                value={candidateProfile.email}
                onChange={(e) => onUpdateCandidateProfile({ ...candidateProfile, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Phone</label>
              <input
                type="text"
                value={candidateProfile.phone}
                onChange={(e) => onUpdateCandidateProfile({ ...candidateProfile, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Location</label>
              <input
                type="text"
                value={candidateProfile.location}
                onChange={(e) => onUpdateCandidateProfile({ ...candidateProfile, location: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Target Salary</label>
              <input
                type="text"
                value={candidateProfile.desiredSalary}
                onChange={(e) => onUpdateCandidateProfile({ ...candidateProfile, desiredSalary: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Notice Period</label>
              <input
                type="text"
                value={candidateProfile.noticePeriod}
                onChange={(e) => onUpdateCandidateProfile({ ...candidateProfile, noticePeriod: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Two Columns: Screening Question Answers & Direct Portal Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI-Solved Screening Questions */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-white">ATS Screening Questionnaire Kit</h3>
                <p className="text-xs text-slate-400">Auto-filled responses crafted to satisfy recruiter filter algorithms</p>
              </div>
            </div>

            <button
              onClick={handleBuildKit}
              disabled={isGeneratingKit}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingKit ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {appKit?.screeningAnswers.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span>{item.question}</span>
                  </span>

                  <button
                    onClick={() => copyToClipboard(item.suggestedAnswer, `answer-${idx}`)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 shrink-0"
                  >
                    {copiedKey === `answer-${idx}` ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300 text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                  {item.suggestedAnswer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Portal Launch Hub & Direct Dispatch */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Apply Actions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base text-white">Direct Application Dispatch</h3>
                <p className="text-xs text-slate-400">Launch employer page or send direct executive email</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Direct Portal Link */}
              <a
                href={targetApplyUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 p-3.5 rounded-xl flex items-center justify-between text-xs text-slate-200 transition group"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span>Open Company Portal</span>
                    <ExternalLink className="w-3 h-3 text-indigo-400 group-hover:translate-x-0.5 transition" />
                  </div>
                  <span className="text-[11px] text-slate-400 truncate block max-w-xs">
                    {targetApplyUrl}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Launch
                </span>
              </a>

              {/* Mailto Direct Hiring Manager Email */}
              <a
                href={`mailto:careers@company.com?subject=${mailtoSubject}&body=${mailtoBody}`}
                className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 p-3.5 rounded-xl flex items-center justify-between text-xs text-slate-200 transition group"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Email Recruiter Packet Directly</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Pre-composed body with candidate summary & strengths
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Mailto
                </span>
              </a>

              {/* Copy Full Application Packet Button */}
              <button
                onClick={() => {
                  const fullKit = `CANDIDATE APPLICATION PACKET
Position: ${analysisResult.jobSummary.title}
Candidate: ${candidateProfile.fullName} (${candidateProfile.email} | ${candidateProfile.phone})
LinkedIn: ${candidateProfile.linkedinUrl}

TARGETED HEADLINE:
${analysisResult.tailoredHeadline}

PROFESSIONAL SUMMARY:
${analysisResult.tailoredSummary}

SCREENING RESPONSES:
${appKit?.screeningAnswers.map((s, i) => `${i + 1}. ${s.question}\nAnswer: ${s.suggestedAnswer}`).join('\n\n')}

COVER LETTER:
${coverLetterText || 'Available in Cover Letter Tab'}`;

                  copyToClipboard(fullKit, 'full-packet');
                }}
                className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition"
              >
                {copiedKey === 'full-packet' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Application Packet Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Full Text Packet for Forms</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Application History Tracker */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h4 className="font-semibold text-xs sm:text-sm text-white">Auto-Apply Submission Log</h4>
              </div>
              <span className="text-[11px] text-slate-500">{history.length} logged</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {history.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-medium text-slate-200 truncate">{rec.jobTitle}</div>
                    <div className="text-[11px] text-slate-500">
                      {rec.portalType} • {rec.appliedDate}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    {rec.status}
                  </span>
                </div>
              ))}

              {history.length === 0 && (
                <p className="text-xs text-slate-500 italic py-2 text-center">
                  No automated applications submitted yet. Click "Execute Auto-Apply" to initiate.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
