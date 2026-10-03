import React, { useState } from 'react';
import { InterviewQuestion } from '../types';
import { MessageSquareQuestion, ChevronDown, ChevronUp, Lightbulb, Compass } from 'lucide-react';

interface InterviewPrepProps {
  questions: InterviewQuestion[];
}

export const InterviewPrep: React.FC<InterviewPrepProps> = ({ questions }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm sm:text-base text-white">Targeted Interview Questions & Defense Guide</h3>
          <p className="text-xs text-slate-400">
            Hiring managers will specifically probe the gaps between your resume and their job description.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((q, idx) => {
          const isOpen = openIndex === idx;

          const categoryBadge = {
            'technical': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
            'behavioral': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
            'gap-investigation': 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }[q.category];

          return (
            <div
              key={idx}
              className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden transition shadow-md"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full text-left p-4 flex items-start justify-between gap-4 hover:bg-slate-850 transition"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${categoryBadge}`}>
                      {q.category.replace('-', ' ')}
                    </span>
                    <span className="text-xs text-slate-500">Question #{idx + 1}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
                    {q.question}
                  </h4>
                </div>
                <div className="text-slate-400 mt-1">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 space-y-3 border-t border-slate-800/80 bg-slate-950/60">
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
                      <Compass className="w-3.5 h-3.5" />
                      <span>Why the Interviewer Asks This</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {q.reasoning}
                    </p>
                  </div>

                  <div className="bg-indigo-950/20 p-3.5 rounded-lg border border-indigo-500/20">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 mb-1">
                      <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Recommended Answer Strategy</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {q.recommendedAnswerStrategy}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
