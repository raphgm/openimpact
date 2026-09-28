import React, { useState } from 'react';
import { X, Plus, Trash2, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Project, Currency, Milestone } from '../types';
import { CURRENCY_RATES } from '../data/mockData';
import { isSpamUrl, isSpamContent } from '../utils/spamFilter';

interface CreateProjectModalProps {
  displayCurrency: Currency;
  onClose: () => void;
  onCreateProject: (newProject: Project) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  displayCurrency,
  onClose,
  onCreateProject,
}) => {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<Project['category']>('Tech & Open Source');
  const [location, setLocation] = useState('Geneva, Switzerland');
  const [fundingGoal, setFundingGoal] = useState<number>(1000000);
  const [currency, setCurrency] = useState<Currency>(displayCurrency);
  const [githubRepo, setGithubRepo] = useState('');
  const [treasuryAddress, setTreasuryAddress] = useState('0xOpenImpactTreasury... (EVM / Multi-sig)');
  const [description, setDescription] = useState('');

  const [milestones, setMilestones] = useState<
    { title: string; budget: number; deliverables: string; deadline: string }[]
  >([
    { title: 'Research & Technical Spec', budget: 200000, deliverables: 'PDF Spec & Architecture Diagram', deadline: '2026-09-30' },
    { title: 'Phase 1 MVP Implementation', budget: 500000, deliverables: 'Working GitHub codebase & demo', deadline: '2026-11-15' },
  ]);

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      { title: '', budget: 100000, deliverables: '', deadline: '2026-12-31' },
    ]);
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleRunAiAnalysis = async () => {
    if (!title || !description) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          fundingGoal,
          currency,
          milestones,
        }),
      });
      const data = await res.json();
      setAiAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    if (isSpamUrl(githubRepo) || isSpamContent(title) || isSpamContent(description)) {
      alert('This repository or project title matches known spam/scam campaigns and has been blocked.');
      return;
    }

    const formattedMilestones: Milestone[] = milestones.map((m, idx) => ({
      id: `m_new_${idx}_${Date.now()}`,
      title: m.title || `Milestone ${idx + 1}`,
      budget: Number(m.budget) || 0,
      status: 'Pending',
      deadline: m.deadline || '2026-12-31',
      deliverables: m.deliverables || 'Project deliverable evidence required.',
      reviewerStatus: 'Not Submitted',
      escrowStatus: 'Locked',
    }));

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      title,
      tagline,
      category,
      location,
      status: 'Funding',
      fundingGoal: Number(fundingGoal),
      currency,
      raised: 0,
      supportersCount: 0,
      contributorsCount: 1,
      createdAt: new Date().toISOString().split('T')[0],
      organization: {
        id: 'org_user',
        name: 'OpenImpact Community Lead',
        logo: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=120',
        verified: true,
        description: 'Verified OpenImpact Creator',
        location,
        totalFunded: 0,
        projectsCount: 1,
      },
      githubRepo: githubRepo || undefined,
      description,
      milestones: formattedMilestones,
      expenses: [],
      evidence: [],
      impactMetrics: [
        { label: 'Beneficiaries Reached', value: '0', target: '500' },
        { label: 'Contributors Recruited', value: '1', target: '10' },
      ],
    };

    onCreateProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl text-slate-900 relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6 pb-4 shrink-0 bg-white rounded-t-2xl">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                NGOs, Causes & Collectives
              </span>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                Seamless Escrow
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-1">Raise Funds & Create Awareness</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg bg-slate-50 border border-slate-200 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-3 space-y-4 overflow-y-auto flex-1">
          {/* Cause & NGO Notice */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-200/80 rounded-xl text-xs text-indigo-900 flex items-start space-x-2.5">
            <span className="text-base">🤝</span>
            <div>
              <strong className="font-bold">Open & Seamless Disbursement Guarantee:</strong> Donations are collected under 501(c)(6) non-profit sponsorship with tax-deductible donor receipts. Funds disburse smoothly upon submitting verified contractor invoices, relief purchase receipts, or milestone deliverables.
            </div>
          </div>
          {/* Title & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Build a Solar Borehole Pump"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Short Tagline *</label>
              <input
                type="text"
                required
                placeholder="One sentence describing the core impact"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Category, Location, Currency & Goal */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 text-slate-800 text-xs px-2.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:bg-white"
              >
                <option value="NGO & Humanitarian">NGO & Humanitarian</option>
                <option value="Education">Education</option>
                <option value="Tech & Open Source">Tech & Open Source</option>
                <option value="Health">Health</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Environment">Environment</option>
                <option value="Community">Community</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs px-2.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full bg-slate-50 text-slate-800 text-xs px-2.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:bg-white"
              >
                {CURRENCY_RATES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Goal Amount</label>
              <input
                type="number"
                min="1"
                required
                value={fundingGoal}
                onChange={(e) => setFundingGoal(Number(e.target.value))}
                className="w-full bg-slate-50 text-slate-900 font-bold text-xs px-2.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:bg-white"
              />
            </div>
          </div>

            {/* Public Documentation & Deliverable Verification Link */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-800">
                    Public Verification Repository or Campaign Link (GitHub / GitLab / Docs)
                  </label>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Where donors can audit project progression, open deliverables, field receipts, or milestone code.
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono shrink-0">
                  Open Verification
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="bg-white p-2 rounded-lg border border-slate-100 flex items-start gap-1.5">
                  <span className="font-bold text-indigo-600">💻 Code / Specs:</span>
                  <span>Automates escrow releases when merged Pull Requests match milestones.</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-100 flex items-start gap-1.5">
                  <span className="font-bold text-emerald-600">📑 Invoices & Photos:</span>
                  <span>Host transparency reports, vendor invoices, field photos, and receipts.</span>
                </div>
              </div>

            <input
              type="url"
              placeholder="https://github.com/organization/project-or-event-repo"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              className="w-full bg-white text-slate-900 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none font-mono focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Treasury / Settlement Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Treasury / Settlement Wallet Address (EVM / Multi-sig) *
            </label>
            <input
              type="text"
              required
              placeholder="0x... (Authorized vault or recipient wallet address for milestone payouts)"
              value={treasuryAddress}
              onChange={(e) => setTreasuryAddress(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Project Overview & Problem Statement</label>
            <textarea
              rows={3}
              required
              placeholder="Describe what problem this project addresses, who benefits, and how funding will be spent..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:bg-white"
            />
          </div>

          {/* Milestones Breakdown */}
          <div className="border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-900">Project Milestones & Escrow Budgets</label>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Add Milestone
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {milestones.map((m, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      M{idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Milestone title"
                      value={m.title}
                      onChange={(e) => {
                        const updated = [...milestones];
                        updated[idx].title = e.target.value;
                        setMilestones(updated);
                      }}
                      className="flex-1 bg-white text-slate-900 text-xs px-2.5 py-1 rounded border border-slate-200"
                    />
                    <input
                      type="number"
                      placeholder="Budget"
                      value={m.budget}
                      onChange={(e) => {
                        const updated = [...milestones];
                        updated[idx].budget = Number(e.target.value);
                        setMilestones(updated);
                      }}
                      className="w-24 bg-white text-slate-900 font-mono text-xs px-2 py-1 rounded border border-slate-200"
                    />
                    {milestones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Evidence deliverable required for milestone release..."
                    value={m.deliverables}
                    onChange={(e) => {
                      const updated = [...milestones];
                      updated[idx].deliverables = e.target.value;
                      setMilestones(updated);
                    }}
                    className="w-full bg-white text-slate-700 text-[11px] px-2.5 py-1 rounded border border-slate-200"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* AI Project Sanity Check */}
          <div className="border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Want AI feedback on budget feasibility and risks?</span>
              <button
                type="button"
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzing || !title || !description}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold hover:bg-indigo-100 transition cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>{isAnalyzing ? 'Analyzing...' : 'Run AI Feasibility Check'}</span>
              </button>
            </div>

            {aiAnalysis && (
              <div className="mt-3 p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-indigo-900">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                    AI Feasibility Score: {aiAnalysis.feasibilityScore}/100
                  </span>
                </div>
                <p className="text-slate-700">{aiAnalysis.budgetAssessment}</p>
                {aiAnalysis.milestoneRisks?.length > 0 && (
                  <div>
                    <span className="font-semibold text-amber-700 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600" /> Identified Milestone Risks:
                    </span>
                    <ul className="list-disc list-inside text-slate-600 text-[11px] ml-1">
                      {aiAnalysis.milestoneRisks.map((r: string, i: number) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <div className="pt-3 pb-2 sticky bottom-0 bg-white">
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-sm shadow-indigo-600/20 cursor-pointer"
            >
              Publish OpenImpact Project Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
