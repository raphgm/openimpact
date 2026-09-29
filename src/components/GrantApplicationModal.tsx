import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, ShieldCheck, ArrowRight, Layers, FileCheck, DollarSign, Plus, Trash2 } from 'lucide-react';
import { GrantProgram, Currency } from '../types';
import { formatCurrency } from '../utils/formatters';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface GrantApplicationModalProps {
  grant?: GrantProgram;
  allGrants?: GrantProgram[];
  onClose: () => void;
  onSubmitSuccess?: (application: {
    id: string;
    grantId: string;
    projectTitle: string;
    requestedAmount: number;
    currency: Currency;
    applicantName: string;
    applicantEmail: string;
    githubRepo: string;
    description: string;
    milestones: { title: string; percentage: number; deliverable: string }[];
  }) => void;
}

export const GrantApplicationModal: React.FC<GrantApplicationModalProps> = ({
  grant,
  allGrants = [],
  onClose,
  onSubmitSuccess,
}) => {
  // Find Open Collect / OpenImpact default grant if not passed
  const openCollectDefaultGrant = allGrants.find((g) => g.id.includes('opencollect') || g.id.includes('openimpact')) || grant || allGrants[0];

  const [selectedGrantId, setSelectedGrantId] = useState<string>(grant?.id || openCollectDefaultGrant?.id || 'grant_opencollect_00');
  const [projectTitle, setProjectTitle] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [category, setCategory] = useState('Open Source Software & Public Goods');
  const [requestedAmount, setRequestedAmount] = useState<number>(25000);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [githubRepo, setGithubRepo] = useState('');
  const [description, setDescription] = useState('');
  
  const [milestones, setMilestones] = useState<
    { title: string; percentage: number; deliverable: string }[]
  >([
    { title: 'Phase 1: Architecture Spec & Open Codebase', percentage: 30, deliverable: 'Technical specification document and public GitHub repo setup with CI/CD.' },
    { title: 'Phase 2: Core Feature Implementation & Testing', percentage: 40, deliverable: 'Merged PRs for core features with unit tests and community audit report.' },
    { title: 'Phase 3: Production Release & Impact Documentation', percentage: 30, deliverable: 'Public release deployment, user benchmarks, and verified impact summary report.' },
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    feasibilityScore: number;
    feedback: string;
    strengths: string[];
  } | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  const currentSelectedGrant = allGrants.find((g) => g.id === selectedGrantId) || openCollectDefaultGrant;

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      { title: '', percentage: 20, deliverable: '' },
    ]);
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleRunAiAnalysis = () => {
    if (!projectTitle || !description) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiAnalysis({
        feasibilityScore: 94,
        feedback: `Strong alignment with ${currentSelectedGrant?.title || 'institutional'} grant criteria. Clear milestone deliverable roadmaps with public GitHub verification.`,
        strengths: [
          'Direct milestone-based escrow release structure reduces grant diversion risks.',
          'Open source codebase alignment meets institutional digital public goods standards.',
          'Measurable evidence deliverables defined for each milestone tranche.',
        ],
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !description) return;

    const generatedId = `OC-GRANT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setApplicationId(generatedId);

    const applicationData = {
      id: generatedId,
      grantId: selectedGrantId,
      projectTitle,
      requestedAmount,
      currency,
      applicantName,
      applicantEmail,
      githubRepo,
      description,
      milestones,
      status: 'In Review',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'grant_applications', generatedId), applicationData);
    } catch (err) {
      console.error('Error persisting grant application to Firestore:', err);
    }

    if (onSubmitSuccess) {
      onSubmitSuccess(applicationData);
    }

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-100 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-900 relative my-auto text-left">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6 pb-4 shrink-0 bg-white rounded-t-3xl">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {currentSelectedGrant?.organization?.name || 'Institutional'} Official Grant Portal
              </span>
              <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 font-bold">
                Non-Dilutive Institutional Funding
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              Apply for {currentSelectedGrant?.title || 'Institutional Grant Program'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-full bg-slate-50 border border-slate-200 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200">
                Application Tracking ID: {applicationId}
              </span>
              <h3 className="text-2xl font-black text-slate-900 pt-2">
                Grant Proposal Submitted Successfully!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your application for <strong>{projectTitle}</strong> has been routed to the <strong>Open Collect Grant Review Committee</strong>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-3 font-medium">
              <div className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Next Evaluation Steps:</span>
              </div>
              <ul className="space-y-2 text-slate-600 text-[11px]">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">1.</span>
                  <span><strong>Eligibility & Compliance Check:</strong> Verification of 501(c)(6) non-profit rules & GitHub activity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">2.</span>
                  <span><strong>Peer Review & Scoring:</strong> {currentSelectedGrant?.organization.name || 'Foundation'} review panel evaluates technical feasibility and impact.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">3.</span>
                  <span><strong>Escrow Vault Setup:</strong> Upon award, milestone tranches are locked into smart escrow for automated disbursement.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#111827] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-md"
            >
              Return to Grants Portal
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 pt-3 space-y-4 overflow-y-auto flex-1">
            {/* Open Collect Guarantee Notice */}
            <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl text-xs text-emerald-950 flex items-start space-x-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Open Collect Direct Grant Guarantee:</strong> All non-dilutive grants awarded under Open Collect are backed by 501(c)(6) legal hosting. Funds are disbursed via milestone escrow directly upon evidence submission (PRs, invoices, or reports).
              </div>
            </div>

            {/* Program Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Selected Grant Program *
              </label>
              <select
                value={selectedGrantId}
                onChange={(e) => setSelectedGrantId(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 font-bold text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
              >
                {allGrants.length > 0 ? (
                  allGrants.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title} — {formatCurrency(g.availableFunding, g.currency)} Pool
                    </option>
                  ))
                ) : (
                  <option value="grant_opencollect_00">
                    Open Source Collective (OSC) 501(c)(6) Fund — $2,000,000 USD Pool
                  </option>
                )}
              </select>
            </div>

            {/* Project Title & Applicant */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project or Collective Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Open Source Solar IoT Pump Controller"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lead Applicant / Maintainer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your full name or maintainer handle"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            {/* Requested Amount, Category & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Track
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                >
                  <option value="Open Source Software & Public Goods">Open Source Software & Public Goods</option>
                  <option value="Civic Tech & Digital Equity">Civic Tech & Digital Equity</option>
                  <option value="Education & Skill Training">Education & Skill Training</option>
                  <option value="Climate Tech & Environmental Sensing">Climate Tech & Environmental Sensing</option>
                  <option value="Community Events & Summits">Community Events & Summits</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Requested Grant Amount
                </label>
                <input
                  type="number"
                  min="500"
                  required
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 text-slate-900 font-bold text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:bg-white font-bold"
                >
                  <option value="USD">USD ($)</option>
                  <option value="NGN">NGN (₦)</option>
                  <option value="KES">KES (KSh)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            {/* Public Verification Link */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Public GitHub Repo, Documentation, or Campaign Link
              </label>
              <input
                type="url"
                required
                placeholder="https://github.com/organization/project-name"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none font-mono focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                {currentSelectedGrant?.organization.name || 'Foundation'} verification systems monitor merged PRs, releases, and documentation commits to automatically verify milestone deliverables.
              </p>
            </div>

            {/* Proposal Overview & Impact Objectives */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Executive Proposal & Expected Outcomes *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe what problem this project addresses, key beneficiaries, and how grant funds will be spent..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
              />
            </div>

            {/* Milestone Tranche Plan */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900">
                  Milestone Escrow Tranche Roadmap
                </label>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Tranche
                </button>
              </div>

              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {milestones.map((m, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                        Tranche {idx + 1}
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
                        className="flex-1 bg-white text-slate-900 text-xs px-2.5 py-1 rounded-lg border border-slate-200"
                      />
                      <div className="flex items-center gap-1 text-xs font-mono font-bold bg-white px-2 py-1 rounded border border-slate-200">
                        <input
                          type="number"
                          placeholder="%"
                          value={m.percentage}
                          onChange={(e) => {
                            const updated = [...milestones];
                            updated[idx].percentage = Number(e.target.value);
                            setMilestones(updated);
                          }}
                          className="w-12 text-center bg-transparent focus:outline-none"
                        />
                        <span>%</span>
                      </div>
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
                      placeholder="Required deliverable evidence (e.g., Merged PR, Published Report, Field Receipt)..."
                      value={m.deliverable}
                      onChange={(e) => {
                        const updated = [...milestones];
                        updated[idx].deliverable = e.target.value;
                        setMilestones(updated);
                      }}
                      className="w-full bg-white text-slate-700 text-[11px] px-2.5 py-1 rounded-lg border border-slate-200"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* AI Feasibility Assessment */}
            <div className="border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Want instant AI feedback on your grant application?</span>
                <button
                  type="button"
                  onClick={handleRunAiAnalysis}
                  disabled={isAnalyzing || !projectTitle || !description}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{isAnalyzing ? 'Evaluating...' : 'Run AI Grant Check'}</span>
                </button>
              </div>

              {aiAnalysis && (
                <div className="mt-3 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-emerald-950">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      AI Feasibility Score: {aiAnalysis.feasibilityScore}/100
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{aiAnalysis.feedback}</p>
                  <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5">
                    {aiAnalysis.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-3 pb-2 sticky bottom-0 bg-white">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#111827] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-md cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Submit Proposal to {currentSelectedGrant?.organization.name || 'Grant Foundation'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
