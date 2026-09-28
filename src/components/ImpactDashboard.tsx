import React, { useState } from 'react';
import { Project, Currency } from '../types';
import { GLOBAL_IMPACT_METRICS } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';
import { BarChart3, Sparkles, Download, Share2, CheckCircle2, TrendingUp, Users, DollarSign, Award } from 'lucide-react';

interface ImpactDashboardProps {
  projects: Project[];
  displayCurrency: Currency;
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ projects, displayCurrency }) => {
  const [selectedProjectForReport, setSelectedProjectForReport] = useState<Project>(projects[0]);
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerateAiReport = async () => {
    if (!selectedProjectForReport) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-impact-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectData: selectedProjectForReport }),
      });
      const data = await res.json();
      setGeneratedReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 text-slate-900 dark:text-white">
      {/* Modern Hero Banner */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 rounded-2xl p-8 sm:p-12 shadow-2xl text-white flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden animate-fade-in">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-4 max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white text-xs font-bold">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Real-Time Impact Metrics</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">Impact <span className="bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent">Transparency</span></h1>
          <p className="text-base text-white/90 leading-relaxed font-medium">
            Every contribution generates verified impact metrics. Track people reached, jobs created, and community outcomes in real-time.
          </p>
        </div>

        <div className="bg-white/15 backdrop-blur-md p-6 rounded-xl border border-white/30 text-center min-w-[220px] relative z-10 shadow-lg">
          <div className="text-4xl font-black text-amber-200">87%</div>
          <div className="text-sm text-white/90 font-bold mt-2">Success Rate</div>
        </div>
      </div>

      {/* Global Impact Dashboard Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-8 sm:p-10 shadow-xl space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50 pb-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-wider">Global Impact Metrics</h2>
          <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full border border-blue-200/50 dark:border-blue-700/50">
            ✓ Verified Data
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 text-center border border-blue-200/50 dark:border-blue-700/50">
            <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">$4.8M</div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-3">Total Funded</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl p-6 text-center border border-emerald-200/50 dark:border-emerald-700/50">
            <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">1,240</div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-3">Projects Done</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 text-center border border-purple-200/50 dark:border-purple-700/50">
            <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">18,420</div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-3">Contributors</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-6 text-center border border-orange-200/50 dark:border-orange-700/50">
            <div className="text-4xl font-black bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">984K</div>
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-3">People Reached</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center pt-4 border-t border-slate-100">
          <div className="space-y-1">
            <div className="text-xl font-bold text-slate-800">4,210</div>
            <div className="text-[11px] text-slate-500">Bounties Solved</div>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-bold text-slate-800">840</div>
            <div className="text-[11px] text-slate-500">Jobs Created</div>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-bold text-slate-800">12,650</div>
            <div className="text-[11px] text-slate-500">Verified Evidence</div>
          </div>

          <div className="space-y-1">
            <div className="text-xl font-bold text-indigo-600">120,000+</div>
            <div className="text-[11px] text-slate-500">Community Hours</div>
          </div>
        </div>
      </div>

      {/* AI Impact Report Generator Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              AI Executive Report Engine
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Generate Project Impact Report</h3>
            <p className="text-xs text-slate-500">
              Select a project to generate a audit-ready public impact report backed by verified evidence.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedProjectForReport.id}
              onChange={(e) => {
                const found = projects.find((p) => p.id === e.target.value);
                if (found) setSelectedProjectForReport(found);
              }}
              className="bg-slate-50 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:bg-white"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>

            <button
              onClick={handleGenerateAiReport}
              disabled={isGenerating}
              className="flex items-center space-x-1.5 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition shadow-sm shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4 text-indigo-200" />
              <span>{isGenerating ? 'Drafting Report...' : 'Generate Impact Statement'}</span>
            </button>
          </div>
        </div>

        {/* Report Output Box */}
        {generatedReport ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 font-sans relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  OI
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Official Impact Statement: {selectedProjectForReport.title}</h4>
                  <div className="text-[10px] text-slate-500">Generated by OpenImpact Gemini Engine</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                  className="flex items-center space-x-1 text-xs text-slate-700 hover:bg-slate-200 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs cursor-pointer font-bold transition"
                >
                  {isCopied ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Share Report</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <h5 className="font-bold text-indigo-700 text-sm mb-1">Executive Summary</h5>
                <p className="text-slate-700">{generatedReport.executiveSummary}</p>
              </div>

              {generatedReport.keyAchievements?.length > 0 && (
                <div>
                  <h5 className="font-bold text-slate-900 text-xs mb-1">Verified Key Achievements</h5>
                  <ul className="list-disc list-inside text-slate-700 space-y-1">
                    {generatedReport.keyAchievements.map((ach: string, i: number) => (
                      <li key={i}>{ach}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-blue-700">Return on Impact (ROI):</span>
                <p className="text-slate-700">{generatedReport.roiStatement}</p>
              </div>

              {generatedReport.communityFeedbackQuote && (
                <div className="p-3 bg-white italic text-slate-700 border-l-3 border-indigo-600 rounded-r-xl">
                  "{generatedReport.communityFeedbackQuote}"
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-slate-200">
            Click "Generate Impact Statement" to run Gemini AI analysis on milestone evidence and financial receipts for {selectedProjectForReport.title}.
          </div>
        )}
      </div>
    </div>
  );
};
