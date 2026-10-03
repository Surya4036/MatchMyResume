import React from 'react';
import { MatchAnalysisResult } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Award, Briefcase, UserCheck, Mail, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Send, Bot } from 'lucide-react';

interface ScoreOverviewProps {
  data: MatchAnalysisResult;
  onGenerateCoverLetter: () => void;
  onAutoApply: () => void;
}

export const ScoreOverview: React.FC<ScoreOverviewProps> = ({
  data,
  onGenerateCoverLetter,
  onAutoApply
}) => {
  const chartData = [
    { subject: 'Skills Match', score: data.breakdown.skillsMatch, fullMark: 100 },
    { subject: 'Experience Fit', score: data.breakdown.experienceAlignment, fullMark: 100 },
    { subject: 'Education & Certs', score: data.breakdown.educationCertifications, fullMark: 100 },
    { subject: 'Seniority Level', score: data.breakdown.seniorityLevelFit, fullMark: 100 },
    { subject: 'ATS Keywords', score: data.atsCompatibilityScore, fullMark: 100 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/50 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/50 bg-rose-500/10';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'High Match', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    if (score >= 60) return { label: 'Moderate Fit', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
    return { label: 'Significant Gap', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
  };

  const badge = getScoreBadge(data.overallScore);

  return (
    <div className="space-y-6">
      {/* Target Position & Candidate Match banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Target Position</div>
            <div className="text-base font-bold text-white truncate">{data.jobSummary.title || 'Target Role'}</div>
            <div className="text-xs text-slate-400 flex flex-wrap gap-2 mt-1">
              <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">Level: {data.jobSummary.level}</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">Vibe: {data.jobSummary.companyVibe}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Candidate Assessment</div>
            <div className="text-base font-bold text-white truncate">{data.candidateSummary.inferredTitle || 'Applicant Profile'}</div>
            <div className="text-xs text-slate-400 flex flex-wrap gap-2 mt-1">
              <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">Experience: {data.candidateSummary.totalYearsExp}</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">Core: {data.candidateSummary.topStrengths.slice(0, 2).join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Score Metrics & Radar Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        {/* Left: Overall Score Dial & Verdict */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 border-b lg:border-b-0 lg:border-r border-slate-800 lg:pr-6 pb-6 lg:pb-0">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Matchcraft Fit Index</span>
              <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${badge.bg}`}>
                {badge.label}
              </span>
            </div>

            <div className="flex items-center gap-5">
              <div className={`w-28 h-28 rounded-2xl border-2 flex flex-col items-center justify-center shadow-inner shrink-0 ${getScoreColor(data.overallScore)}`}>
                <span className="text-4xl font-extrabold tracking-tight">{data.overallScore}%</span>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-80 mt-0.5">Overall</span>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-slate-400">ATS Pass Likelihood</div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-slate-100">{data.atsCompatibilityScore}%</div>
                  <span className="text-xs text-slate-500">(Auto-Filter Rate)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${data.atsCompatibilityScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Executive Recruiter Verdict</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "{data.executiveVerdict}"
            </p>
          </div>
        </div>

        {/* Center: Recharts Radar Dimension */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center py-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider self-start mb-1">Competency Alignment</span>
          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar
                  name="Match Score"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Dimension Bars */}
        <div className="lg:col-span-3 flex flex-col justify-center space-y-3.5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Metric Breakdown</span>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Skills Alignment</span>
              <span className="font-semibold text-white">{data.breakdown.skillsMatch}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${data.breakdown.skillsMatch}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Experience History</span>
              <span className="font-semibold text-white">{data.breakdown.experienceAlignment}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${data.breakdown.experienceAlignment}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Seniority & Scope</span>
              <span className="font-semibold text-white">{data.breakdown.seniorityLevelFit}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${data.breakdown.seniorityLevelFit}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Education & Certs</span>
              <span className="font-semibold text-white">{data.breakdown.educationCertifications}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${data.breakdown.educationCertifications}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Action Banner: Two Next-Step CTAs */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/80 border border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Next Recommended Step for {data.jobSummary.title || 'this position'}</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Ready to Apply with {data.overallScore}% Alignment?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Generate an automated cover letter or launch the <strong>Auto-Apply Agent</strong> to auto-fill screening answers and dispatch your application packet directly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onGenerateCoverLetter}
            className="px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 flex items-center gap-2 transition cursor-pointer"
          >
            <Mail className="w-4 h-4 text-indigo-400" />
            <span>Cover Letter</span>
          </button>

          <button
            onClick={onAutoApply}
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition transform hover:scale-[1.02] cursor-pointer"
          >
            <Send className="w-4 h-4 text-slate-950" />
            <span>Auto-Apply Agent</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
