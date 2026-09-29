import React, { useState } from 'react';
import { Project, Currency, Milestone, ImpactBadge, UserProfile } from '../types';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { formatCurrency, calculateProgress } from '../utils/formatters';
import { evaluateProjectBadges, getBadgeLevelBadgeStyle } from '../utils/badgeEngine';
import { ImpactBadgeModal } from './ImpactBadgeModal';
import { sanitizeImageUrl } from '../utils/repoImages';
import { MilestoneEscrowStudio } from './MilestoneEscrowStudio';
import { TransparentLedgerExplorer } from './TransparentLedgerExplorer';
import { GlobalSettlementModal } from './GlobalSettlementModal';
import { ReadmeBadgeGeneratorModal } from './ReadmeBadgeGeneratorModal';
import { ShareImpactCardModal } from './ShareImpactCardModal';
import { ProofCertificateModal } from './ProofCertificateModal';
import { SustainabilityForecast } from './SustainabilityForecast';
import { TrustScore } from './TrustScore';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {
  ArrowLeft,
  ShieldCheck,
  Github,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  Share2,
  Download,
  PlusCircle,
  ExternalLink,
  Sparkles,
  Calendar,
  Flag,
  ChevronRight,
  GitPullRequest,
  TrendingUp,
  Award,
  Heart,
  FileCheck,
  Lock,
  Unlock,
  Code2,
  Zap,
} from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  displayCurrency: Currency;
  onBack: () => void;
  onFundProject: (project: Project) => void;
  onOpenEvidenceModal: () => void;
  onOpenDocumentViewer?: (url?: string, title?: string) => void;
  onOpenDocumentTenure?: () => void;
  onOpenProofVerification?: () => void;
  onOpenAuthModal?: () => void;
  currentUser?: UserProfile;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  displayCurrency,
  onBack,
  onFundProject,
  onOpenEvidenceModal,
  onOpenDocumentViewer,
  onOpenDocumentTenure,
  onOpenProofVerification,
  onOpenAuthModal,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'readme' | 'milestones' | 'escrow' | 'expenses' | 'evidence' | 'impact' | 'badges'>('overview');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(
    project.milestones[0]?.id || null
  );
  const [selectedBadge, setSelectedBadge] = useState<ImpactBadge | null>(null);
  const [showPayoutModal, setShowPayoutModal] = useState<boolean>(false);
  const [showBadgeModal, setShowBadgeModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showProofCertModal, setShowProofCertModal] = useState<boolean>(false);
  


  const projectBadges = evaluateProjectBadges(project);

  const progress = calculateProgress(project.raised, project.fundingGoal);
  const completedMilestones = project.milestones.filter((m) => m.status === 'Completed').length;
  const totalSpent = project.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingFunds = Math.max(0, project.raised - totalSpent);

  const verifiedMilestonesCount = project.milestones.filter(
    (m) => m.status === 'Completed' || m.escrowStatus === 'Released' || m.reviewerStatus === 'Approved'
  ).length;
  const impactMultiplierRatio = verifiedMilestonesCount > 0 ? Math.round(project.raised / verifiedMilestonesCount) : project.raised;
  const impactMultiplierFactor = verifiedMilestonesCount > 0 ? ((project.raised / Math.max(1, project.fundingGoal)) * verifiedMilestonesCount * 1.8).toFixed(1) : '1.0';

  const [isConfidentialMode, setIsConfidentialMode] = useState<boolean>(true);
  const [confidentialPasskeyInput, setConfidentialPasskeyInput] = useState<string>('');
  const [isConfidentialUnlocked, setIsConfidentialUnlocked] = useState<boolean>(false);
  const [confidentialError, setConfidentialError] = useState<string | null>(null);

  const formatConfidentialCurrency = (amount: number, curr?: Currency) => {
    if (isConfidentialMode && !isConfidentialUnlocked) {
      return '•••••• (Confidential)';
    }
    return formatCurrency(amount, curr || project.currency);
  };

  const [milestoneFilter, setMilestoneFilter] = useState<'All' | 'Completed' | 'In progress' | 'Upcoming'>('All');

  const filteredMilestones = project.milestones.filter((m) => {
    if (milestoneFilter === 'All') return true;
    if (milestoneFilter === 'Completed') return m.status === 'Completed';
    if (milestoneFilter === 'In progress') return m.status === 'In progress';
    if (milestoneFilter === 'Upcoming') return m.status === 'Pending' || m.status === 'Disputed' || (!m.status || m.status === 'Pending');
    return true;
  });

  const activeMilestone = project.milestones.find((m) => m.id === selectedMilestoneId) || project.milestones[0];

  // Calculate timeline progress metrics
  const totalMilestonesCount = project.milestones.length || 1;
  const timelineCompletionPercentage = Math.round((completedMilestones / totalMilestonesCount) * 100);

  const fundingTimeSeriesData = React.useMemo(() => {
    const totalRaised = project.raised || 0;
    const goal = project.fundingGoal || totalRaised;
    return [
      { date: 'Initial Grant', raised: Math.round(totalRaised * 0.1), target: Math.round(goal * 0.2) },
      { date: 'Phase 1 Audit', raised: Math.round(totalRaised * 0.35), target: Math.round(goal * 0.4) },
      { date: 'Mid-Term Review', raised: Math.round(totalRaised * 0.65), target: Math.round(goal * 0.7) },
      { date: 'Latest Milestone', raised: Math.round(totalRaised * 0.85), target: Math.round(goal * 0.9) },
      { date: 'Current (Today)', raised: totalRaised, target: goal },
    ];
  }, [project]);

  const calculateMilestoneEvidenceProgress = (milestone: Milestone): number => {
    if (milestone.status === 'Completed' || milestone.escrowStatus === 'Released' || milestone.reviewerStatus === 'Approved') {
      return 100;
    }
    let score = 0;
    if (milestone.evidenceUrl) {
      score += 40;
    }
    const matchingEvidence = (project.evidence || []).filter(ev =>
      ev.status === 'Verified' && (
        ev.title.toLowerCase().includes(milestone.title.toLowerCase()) ||
        milestone.title.toLowerCase().includes(ev.title.toLowerCase()) ||
        (milestone.deliverables && ev.description?.toLowerCase().includes(milestone.title.toLowerCase().slice(0, 10)))
      )
    );
    if (matchingEvidence.length > 0) {
      score += 60;
    } else if (milestone.reviewerStatus === 'Pending Review') {
      score += 50;
    } else if (milestone.status === 'In progress') {
      score += 30;
    }
    return Math.min(100, Math.max(0, score));
  };

  return (
    <div className="space-y-6 text-slate-900 pb-12">
      {/* Back button & top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs transition-colors cursor-pointer whitespace-nowrap shrink-0 h-7"
          title="Back to Projects"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-slate-400 stroke-[1.75]" />
          <span>Back to Projects</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenDocumentTenure && (
            <button
              onClick={onOpenDocumentTenure}
              className="flex items-center space-x-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-1.5 rounded-lg shadow-2xs transition cursor-pointer"
              title="Document Community Lead Leadership Tenure for this Collective"
            >
              <Award className="h-3.5 w-3.5 text-slate-950" />
              <span>Document Lead Tenure</span>
            </button>
          )}
          <button
            onClick={onOpenProofVerification || (() => setShowProofCertModal(true))}
            className="flex items-center space-x-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-200 shadow-2xs transition cursor-pointer"
            title="View official verified proof certificate"
          >
            <Award className="h-3.5 w-3.5 text-amber-600" />
            <span>Proof Certificate</span>
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center space-x-1.5 text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-300 shadow-2xs transition cursor-pointer"
            title="Generate shareable social media card using image generator"
          >
            <Share2 className="h-3.5 w-3.5 text-indigo-600" />
            <span>Share Impact</span>
          </button>
          {project.githubRepo && (
            <a
              href={project.githubRepo}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 transition"
            >
              <Github className="h-4 w-4" />
              <span>GitHub Repo</span>
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </a>
          )}
          <button
            onClick={onOpenEvidenceModal}
            className="flex items-center space-x-1.5 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-200 transition cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            <span>Submit Proof of Work</span>
          </button>
          <button
            onClick={() => onFundProject(project)}
            className="py-1.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition shadow-xs cursor-pointer"
          >
            Fund Project
          </button>
        </div>
      </div>

      {/* Confidential Treasury Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800 shadow-md">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isConfidentialUnlocked ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}>
            {isConfidentialUnlocked ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-100">Confidential Treasury Mode</h4>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                isConfidentialUnlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {isConfidentialUnlocked ? 'Unlocked (Multi-Sig Passkey Verified)' : 'Private & Masked'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isConfidentialUnlocked 
                ? 'Sensitive financial figures, escrow tranches, and treasury amounts are currently visible to authorized signers.'
                : 'Money matters are confidential by default. Enter authorized multi-sig passkey to reveal treasury data.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {!isConfidentialUnlocked ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="password"
                placeholder="Enter authorized passkey..."
                value={confidentialPasskeyInput}
                onChange={(e) => setConfidentialPasskeyInput(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <button
                type="button"
                onClick={() => {
                  if (confidentialPasskeyInput.trim() === '849-204' || confidentialPasskeyInput.trim() === 'OPENIMPACT-MULTISIG-2026') {
                    setIsConfidentialUnlocked(true);
                    setConfidentialError(null);
                  } else {
                    setConfidentialError('Invalid authorized passkey.');
                  }
                }}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition whitespace-nowrap cursor-pointer"
              >
                Unlock Financials
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsConfidentialUnlocked(false);
                setConfidentialPasskeyInput('');
              }}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Relock Treasury
            </button>
          )}
        </div>
      </div>
      {confidentialError && (
        <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-200 font-semibold text-left">
          {confidentialError}
        </div>
      )}

      {/* Project Hero Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs relative text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                {project.category}
              </span>
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                {project.location}
              </span>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                OpenProof Verified
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{project.title}</h1>
            <p className="text-sm text-slate-600 leading-relaxed">{project.tagline}</p>

            {/* Organization Tag */}
            <div className="flex items-center space-x-3 pt-2">
              <img
                src={project.organization.logo}
                alt={project.organization.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <span>{project.organization.name}</span>
                  {project.organization.verified && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />
                  )}
                </div>
                <div className="text-[11px] text-slate-500">{project.organization.description}</div>
              </div>
            </div>

            {/* Impact Badges Showcase Bar */}
            {projectBadges.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500 font-bold flex items-center space-x-1">
                    <Award className="h-3.5 w-3.5 text-amber-500" />
                    <span>Verified Impact Badges ({projectBadges.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (projectBadges.length > 0) {
                        setSelectedBadge(projectBadges[0]);
                      }
                    }}
                    className="text-indigo-600 hover:underline font-bold cursor-pointer"
                  >
                    View Credibility Audit →
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {projectBadges.map((badge) => {
                    const badgeStyle = getBadgeLevelBadgeStyle(badge.level);
                    return (
                      <button
                        key={badge.id}
                        type="button"
                        onClick={() => setSelectedBadge(badge)}
                        title={`Click to inspect ${badge.name} audit trail`}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center space-x-1.5 shadow-2xs hover:scale-105 active:scale-95 ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                      >
                        <Award className="h-3.5 w-3.5 text-amber-500" />
                        <span>{badge.name}</span>
                        <span className="text-[9px] font-mono opacity-80 uppercase bg-white/60 px-1 py-0.2 rounded">
                          {badge.level}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Sustainability Forecast */}
            <div className="pt-3">
              <SustainabilityForecast projectId={project.id} />
            </div>

            {/* Reputation & Trust Score */}
            <div className="pt-3">
              <TrustScore projectId={project.id} />
            </div>
          </div>

          {/* Funding Card Widget */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 min-w-[280px] space-y-4">
            <div className="space-y-1">
              <div className="text-xs text-slate-500 font-semibold">Impact Funding</div>
              <div className="text-2xl font-black text-indigo-600 font-mono">
                {formatConfidentialCurrency(project.raised, project.currency)}
              </div>
              <div className="text-xs text-slate-500">
                Allocated: {formatConfidentialCurrency(project.fundingGoal, project.currency)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden border border-slate-300">
              <div
                className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs border-t border-slate-200 pt-3">
              <div>
                <div className="font-bold text-slate-900 font-mono">{project.supportersCount}</div>
                <div className="text-[10px] text-slate-500">Supporters</div>
              </div>
              <div>
                <div className="font-bold text-slate-900 font-mono">{project.contributorsCount}</div>
                <div className="text-[10px] text-slate-500">Contributors</div>
              </div>
            </div>

            <button
              onClick={() => onFundProject(project)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer"
            >
              Support This Project
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
            >
              <Share2 className="h-3.5 w-3.5 text-indigo-600" />
              <span>Share Impact Card</span>
            </button>
          </div>
        </div>
      </div>


      {/* DYNAMIC VISUAL PROJECT TIMELINE PROGRESS BAR */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-5 text-left">
        {/* Timeline Header & Progress Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Calendar className="h-4 w-4" />
              </span>
              <h3 className="text-base font-extrabold text-slate-900">Project Timeline & Impact Milestones</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Track commitments, deliverables, evidence, verification, and outcomes throughout the project.
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
              <span className="text-slate-500">Timeline Progress: </span>
              <span className="font-bold text-indigo-600">{timelineCompletionPercentage}%</span>
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 font-bold flex items-center space-x-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>{completedMilestones}/{totalMilestonesCount} Cleared</span>
            </div>
          </div>
        </div>
        {/* Visual Horizontal Timeline Bar with Deadline Mapping */}
        <div className="relative pt-4 pb-2">
          {/* Base Background Track Line */}
          <div className="absolute top-9 left-6 right-6 h-2 bg-slate-100 rounded-full z-0 border border-slate-200/60 hidden sm:block" />
          {/* Dynamic Active Progress Fill Track Line */}
          <div
            className="absolute top-9 left-6 h-2 bg-gradient-to-r from-emerald-500 via-indigo-600 to-blue-500 rounded-full z-0 transition-all duration-700 shadow-xs hidden sm:block"
            style={{
              width: totalMilestonesCount > 1
                ? `calc(${Math.min(100, Math.max(0, (completedMilestones / (totalMilestonesCount - 1)) * 100))}% - 32px)`
                : '100%',
            }}
          />
          {/* Responsive Grid of Milestone Deadline Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {project.milestones.map((m, idx) => {
              const isCompleted = m.status === 'Completed';
              const isInProgress = m.status === 'In progress';
              const isSelected = selectedMilestoneId === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMilestoneId(m.id)}
                  className={`bg-white p-4 rounded-xl border transition-all cursor-pointer text-left space-y-3 relative group ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {/* Step Pin & Deadline Pill */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white shadow-xs transition-transform group-hover:scale-105 shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isInProgress
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : isInProgress ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <span className="font-mono">{idx + 1}</span>
                      )}
                    </div>
                    {/* Deadline Pill */}
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200/80 flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      <span>{m.deadline}</span>
                    </span>
                  </div>
                  {/* Title & Budget */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1">
                      {m.title}
                    </h4>
                    <div className="text-[11px] font-mono font-extrabold text-indigo-600">
                      {formatConfidentialCurrency(m.budget, project.currency)}
                    </div>
                  </div>

                  {/* Evidence-Based Progress Bar */}
                  {(() => {
                    const progressPct = calculateMilestoneEvidenceProgress(m);
                    return (
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-500 font-medium">Evidence Progress:</span>
                          <span className="font-bold text-indigo-700">{progressPct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200/60">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              progressPct === 100
                                ? 'bg-emerald-500'
                                : progressPct > 0
                                ? 'bg-indigo-600'
                                : 'bg-slate-300'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })()}

                  {/* Status Badges */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                    <span
                      className={`font-bold px-2 py-0.5 rounded ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isInProgress
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {m.status}
                    </span>
                    <span className="text-slate-500 font-mono font-medium">
                      Escrow: <strong className="text-slate-800">{m.escrowStatus}</strong>
                    </span>
                  </div>
                  
                  {/* Evidence Submission Action */}
                  {!isCompleted && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEvidenceModal();
                      }}
                      className="w-full mt-2 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] rounded-lg transition cursor-pointer border border-indigo-100"
                    >
                      Submit Evidence
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
        {/* Selected Milestone Detail Inspector Card */}
        {activeMilestone && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/90 space-y-3 transition">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2">
                <Flag className="h-4 w-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">
                  Inspecting Milestone: {activeMilestone.title}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-slate-500">Scheduled Deadline:</span>
                <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {activeMilestone.deadline}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2 space-y-1">
                <div className="font-bold text-slate-700">Deliverables & Evidence Requirements:</div>
                <p className="text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                  {activeMilestone.deliverables}
                </p>
              </div>

              <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200 font-mono">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Milestone Budget:</span>
                  <span className="font-bold text-indigo-600">
                    {formatConfidentialCurrency(activeMilestone.budget, project.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Escrow Trigger:</span>
                  <span className="font-bold text-emerald-700">{activeMilestone.escrowStatus}</span>
                </div>
                {activeMilestone.evidenceUrl ? (
                  <a
                    href={activeMilestone.evidenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 text-indigo-600 hover:underline text-[11px] font-bold flex items-center space-x-1 pt-1 border-t border-slate-100"
                  >
                    <GitPullRequest className="h-3.5 w-3.5 text-indigo-600" />
                    <span>View Submitted PR Proof</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenEvidenceModal}
                    className="w-full mt-2 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-lg transition flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <GitPullRequest className="h-3.5 w-3.5" />
                    <span>Submit Evidence</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Project Overview' },
          { id: 'readme', label: 'Impact README & Planned vs Actual' },
          { id: 'badges', label: `Impact Badges (${projectBadges.length})` },
          { id: 'escrow', label: 'Proof-Before-Payout Escrow' },
          { id: 'milestones', label: `Milestones (${project.milestones.length})` },
          { id: 'expenses', label: `Transparent Ledger (${project.expenses.length})` },
          { id: 'evidence', label: `OpenProof Evidence (${project.evidence.length})` },
          { id: 'impact', label: 'Impact Dashboard' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}

      {/* 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs text-left">
              <h3 className="text-lg font-bold text-slate-900">About the Project</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Impact Metrics Summary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs text-left">
              <h3 className="text-lg font-bold text-slate-900">Target Impact Metrics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {project.impactMetrics.map((m, idx) => (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                    <div className="text-xl font-extrabold text-indigo-600 font-mono">{m.value}</div>
                    <div className="text-[11px] font-semibold text-slate-800 mt-0.5">{m.label}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Target: {m.target}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Progress Over Time Line Chart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs text-left">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Financial Progress Over Time</h3>
                    <p className="text-xs text-slate-500 font-medium">Tracking capital raised and funding trajectory across project milestones.</p>
                  </div>
                </div>
                <div className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                  Total: {formatConfidentialCurrency(project.raised, project.currency)}
                </div>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fundingTimeSeriesData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(value) => formatConfidentialCurrency(value, project.currency)}
                    />
                    <Tooltip
                      formatter={(value: any) => [formatConfidentialCurrency(Number(value), project.currency), 'Amount']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                    <Line
                      type="monotone"
                      dataKey="raised"
                      name="Raised Funds"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#4f46e5' }}
                      activeDot={{ r: 6, fill: '#4338ca' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      name="Target Milestone"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3, fill: '#06b6d4' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Visual Milestone Calendar & Deadline Schedule */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs text-left">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Milestone Calendar & Deadline Schedule</h3>
                    <p className="text-xs text-slate-500 font-medium">Upcoming escrow deliverables, target deadlines, and verification timeline.</p>
                  </div>
                </div>
                <div className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center space-x-1.5">
                  <Clock className="h-3.5 w-3.5 text-indigo-600" />
                  <span>{project.milestones.length} Scheduled Milestones</span>
                </div>
              </div>

              {/* Filter Toggle Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  {(['All', 'Completed', 'In progress', 'Upcoming'] as const).map((filterOpt) => (
                    <button
                      key={filterOpt}
                      type="button"
                      onClick={() => setMilestoneFilter(filterOpt)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer whitespace-nowrap ${
                        milestoneFilter === filterOpt
                          ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {filterOpt}
                      {filterOpt === 'All' && ` (${project.milestones.length})`}
                      {filterOpt === 'Completed' && ` (${project.milestones.filter(m => m.status === 'Completed').length})`}
                      {filterOpt === 'In progress' && ` (${project.milestones.filter(m => m.status === 'In progress').length})`}
                      {filterOpt === 'Upcoming' && ` (${project.milestones.filter(m => m.status === 'Pending' || m.status === 'Disputed' || !m.status).length})`}
                    </button>
                  ))}
                </div>
                <div className="text-xs font-mono text-slate-500 font-medium">
                  Showing {filteredMilestones.length} of {project.milestones.length}
                </div>
              </div>

              {/* Calendar Timeline Grid */}
              {filteredMilestones.length === 0 ? (
                <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs font-medium">
                  No milestones match the selected filter ({milestoneFilter}).
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredMilestones.map((m) => {
                    const originalIdx = project.milestones.findIndex(item => item.id === m.id);
                    const idx = originalIdx >= 0 ? originalIdx : 0;
                    const isCompleted = m.status === 'Completed';
                    const isInProgress = m.status === 'In progress';
                    const progressPct = calculateMilestoneEvidenceProgress ? calculateMilestoneEvidenceProgress(m) : (isCompleted ? 100 : 0);
                    return (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedMilestoneId(m.id);
                        setActiveTab('milestones');
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 relative group hover:shadow-md ${
                        isInProgress
                          ? 'bg-indigo-50/40 border-indigo-300 ring-1 ring-indigo-200'
                          : isCompleted
                          ? 'bg-white border-emerald-200'
                          : 'bg-slate-50/70 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                            isCompleted ? 'bg-emerald-500 text-white' : isInProgress ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
                            Phase {idx + 1}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-white text-slate-800 px-2.5 py-1 rounded-md border border-slate-200 flex items-center space-x-1 shadow-2xs">
                          <Calendar className="h-3 w-3 text-indigo-600" />
                          <span>{m.deadline}</span>
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1">
                          {m.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-extrabold text-indigo-600">{formatCurrency(m.budget, project.currency)}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isCompleted ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            isInProgress ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                            'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {m.status}
                          </span>
                        </div>
                      </div>

                      {/* Mini Evidence Progress Bar */}
                      <div className="space-y-1 pt-1 border-t border-slate-100">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-500">Evidence & Delivery:</span>
                          <span className="font-bold text-slate-800">{progressPct}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              progressPct === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 text-left">
            {/* Escrow Status Summary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs">
                <ShieldCheck className="h-4 w-4" />
                <span>OpenImpact Escrow Overview</span>
              </div>

               <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Total Funds Raised:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {formatConfidentialCurrency(project.raised, project.currency)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Verified Expenses:</span>
                  <span className="font-mono font-bold text-rose-600">
                    {formatConfidentialCurrency(totalSpent, project.currency)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Escrow Balance Remaining:</span>
                  <span className="font-mono font-bold text-indigo-600">
                    {formatConfidentialCurrency(remainingFunds, project.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Impact Multiplier & Capital Efficiency Metric Card */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-500/30 text-white rounded-2xl p-5 space-y-3 shadow-md text-left relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-400">
                <Sparkles className="h-4 w-4" />
                <span>Verified Impact Multiplier</span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-black font-mono text-white">
                  {impactMultiplierFactor}x <span className="text-xs text-indigo-300 font-sans font-semibold">Efficiency</span>
                </div>
                <p className="text-xs text-indigo-200/80 leading-relaxed">
                  Ratio of funds raised ({formatConfidentialCurrency(project.raised, project.currency)}) across {verifiedMilestonesCount} verified milestones achieved.
                </p>
              </div>
              <div className="pt-2 border-t border-indigo-500/20 text-[11px] font-mono flex justify-between text-indigo-200">
                <span>Capital / Milestone:</span>
                <strong className="text-emerald-400">{formatConfidentialCurrency(impactMultiplierRatio, project.currency)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MILESTONES */}
      {activeTab === 'milestones' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Escrow Tranche Roadmap</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Grant funds are held securely in a non-profit escrow and are released incrementally only when independent peer-audits cryptographically verify proof-of-work.
                </p>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-sm font-bold text-slate-900 font-mono">
                  {completedMilestones} / {project.milestones.length} Completed
                </span>
                <div className="w-32 h-2 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${(completedMilestones / (project.milestones.length || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="relative pl-4 sm:pl-8">
              {/* Vertical line connecting nodes */}
              <div className="absolute top-0 bottom-0 left-[1.8rem] sm:left-[2.8rem] w-[2px] bg-slate-100"></div>

              {/* Filter Toggle Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                  {(['All', 'Completed', 'In progress', 'Upcoming'] as const).map((filterOpt) => (
                    <button
                      key={filterOpt}
                      type="button"
                      onClick={() => setMilestoneFilter(filterOpt)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer whitespace-nowrap ${
                        milestoneFilter === filterOpt
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {filterOpt}
                    </button>
                  ))}
                </div>
                <div className="text-xs font-mono text-slate-500 font-medium">
                  Showing {filteredMilestones.length} milestones
                </div>
              </div>

              {filteredMilestones.length === 0 ? (
                <div className="bg-slate-50 p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs font-medium">
                  No milestones found for filter: {milestoneFilter}.
                </div>
              ) : (
              <div className="space-y-12">
                {filteredMilestones.map((m) => {
                  const originalIdx = project.milestones.findIndex(item => item.id === m.id);
                  const idx = originalIdx >= 0 ? originalIdx : 0;
                  const isCompleted = m.status === 'Completed';
                  const isInProgress = m.status === 'In progress';
                  
                  return (
                    <div key={m.id} className="relative flex items-start group">
                      {/* Node Icon */}
                      <div className="absolute -left-4 sm:-left-[1.2rem] mt-1 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white border-4 border-white shadow-sm ring-1 ring-slate-200">
                        {isCompleted ? (
                          <div className="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        ) : isInProgress ? (
                          <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Zap className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {/* Content Card */}
                      <div className="pl-10 sm:pl-12 w-full">
                        <div className={`border rounded-2xl p-5 sm:p-6 transition-all ${
                          isCompleted ? 'bg-white border-emerald-200 shadow-sm' : 
                          isInProgress ? 'bg-indigo-50/30 border-indigo-200 shadow-md ring-1 ring-indigo-50' : 
                          'bg-slate-50/50 border-slate-200 opacity-80'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">Phase {idx + 1}</span>
                                {isInProgress && (
                                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full animate-pulse">
                                    ACTIVE TRANCHE
                                  </span>
                                )}
                              </div>
                              <h4 className={`text-lg font-black tracking-tight ${isCompleted || isInProgress ? 'text-slate-900' : 'text-slate-600'}`}>
                                {m.title}
                              </h4>
                            </div>
                            <div className="shrink-0 flex flex-col sm:items-end">
                              <div className="text-xl font-black font-mono text-slate-900">
                                {formatConfidentialCurrency(m.budget, project.currency)}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  m.escrowStatus === 'Released' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                  m.escrowStatus === 'Pending Verification' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                  'bg-slate-100 text-slate-500 border-slate-200'
                                }`}>
                                  {m.escrowStatus === 'Released' ? '✓ Verified' :
                                   m.escrowStatus === 'Pending Verification' ? 'Verification Pending' : 'Not Started'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-sm text-slate-600 mb-4 bg-white/60 p-3 rounded-xl border border-slate-100">
                            <strong className="text-slate-900 text-xs uppercase tracking-wider block mb-1">Required Deliverables:</strong>
                            {m.deliverables}
                          </div>

                          {/* Evidence-Based Progress Bar */}
                          {(() => {
                            const progressPct = calculateMilestoneEvidenceProgress(m);
                            return (
                              <div className="mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                                <div className="flex items-center justify-between text-xs font-mono">
                                  <span className="font-bold text-slate-700 flex items-center space-x-1.5">
                                    <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                                    <span>Verified Evidence Completion</span>
                                  </span>
                                  <span className="font-extrabold text-indigo-700">{progressPct}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300/60">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      progressPct === 100
                                        ? 'bg-emerald-500'
                                        : progressPct > 0
                                        ? 'bg-gradient-to-r from-indigo-600 to-blue-500'
                                        : 'bg-slate-300'
                                    }`}
                                    style={{ width: `${progressPct}%` }}
                                  />
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                                  <span>Reviewer: <strong className="text-slate-800">{m.reviewerStatus}</strong></span>
                                  <span>Escrow Status: <strong className="text-slate-800">{m.escrowStatus}</strong></span>
                                </div>
                              </div>
                            );
                          })()}

                          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100/80">
                            <div className="flex items-center gap-4 text-xs font-mono font-medium text-slate-500">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Target: {m.deadline}</span>
                              </div>
                              {m.evidenceUrl && (
                                <a
                                  href={m.evidenceUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 transition"
                                >
                                  <FileCheck className="w-3.5 h-3.5" />
                                  <span>View Audit Log</span>
                                </a>
                              )}
                            </div>
                            
                            {isInProgress && (
                              <button 
                                onClick={onOpenEvidenceModal}
                                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition"
                              >
                                Submit Proof of Work
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. IMPACT README & PLANNED VS ACTUAL */}
      {activeTab === 'readme' && (
        <div className="space-y-6 text-left">
          {/* README Spec Header */}
          <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 space-y-3 font-mono shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-xs">
                <FileText className="h-4 w-4 text-emerald-400" />
                <span className="font-bold text-slate-200">README.md — Impact Repository Specification</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                ✓ OpenProof Audited
              </span>
            </div>
            <div className="text-xs text-slate-300 font-sans leading-relaxed">
              <strong>OpenImpact Specification Compliance:</strong> Every active collective maintains a live Impact Repository containing its mission, objectives, planned vs actual outcomes table, cryptographically signed evidence records, and verified proof certificates.
            </div>
          </div>

          {/* Planned vs Actual Performance Matrix Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Planned vs. Actual Metrics Matrix</h3>
                <p className="text-xs text-slate-500 font-medium">Tracking variance between intended target objectives and verified field outcomes.</p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                100% Verified
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Metric Objective</th>
                    <th className="py-3 px-4">Planned Target</th>
                    <th className="py-3 px-4">Actual Achieved</th>
                    <th className="py-3 px-4">Variance Status</th>
                    <th className="py-3 px-4 text-right">Linked Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {project.impactMetrics.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{m.label}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{m.target}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{m.value}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200">
                          ✓ Target Met
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={onOpenEvidenceModal}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Inspect Proof</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verification Levels & Evidence Chain */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900">Evidence Verification Audit Levels</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Level 1</span>
                <div className="font-bold text-slate-900">Self-Reported</div>
                <p className="text-[11px] text-slate-500">Initial contributor claim submission</p>
              </div>
              <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-100 space-y-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase">Level 2</span>
                <div className="font-bold text-blue-900">Community Verified</div>
                <p className="text-[11px] text-blue-700">Peer review by active maintainers</p>
              </div>
              <div className="p-3.5 bg-indigo-50 rounded-xl border border-indigo-100 space-y-1">
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Level 3</span>
                <div className="font-bold text-indigo-900">Organization Verified</div>
                <p className="text-[11px] text-indigo-700">501(c)(6) Fiscal Host sign-off</p>
              </div>
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 space-y-1">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Level 4</span>
                <div className="font-bold text-emerald-900">Independently Verified</div>
                <p className="text-[11px] text-emerald-700">Audited with SHA-256 proof cert</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2.5 ESCROW STUDIO TAB */}
      {activeTab === 'escrow' && (
        <div className="space-y-6 text-left">
          <MilestoneEscrowStudio
            currency={displayCurrency}
            onOpenPayoutModal={() => setShowPayoutModal(true)}
          />
        </div>
      )}

      {/* 3. EXPENSES / TRANSPARENT LEDGER */}
      {activeTab === 'expenses' && (
        <div className="space-y-6 text-left">
          <TransparentLedgerExplorer
            collectiveName={project.name}
            currency={displayCurrency}
          />
        </div>
      )}

      {/* 4. EVIDENCE */}
      {activeTab === 'evidence' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs text-left">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">OpenProof Verified Evidence Gallery</h3>
              <p className="text-xs text-slate-500">
                Immutable pull requests, commits, photo receipts, and official verification logs.
              </p>
            </div>
            <button
              onClick={onOpenEvidenceModal}
              className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition cursor-pointer shadow-xs"
            >
              + Submit Evidence
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.evidence.map((ev) => (
              <div key={ev.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {ev.type}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {ev.status}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900">{ev.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{ev.description}</p>

                {ev.url && (
                  <img
                    src={sanitizeImageUrl(ev.url)}
                    alt={ev.title}
                    className="w-full h-40 object-cover rounded-lg border border-slate-200"
                  />
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                  <span>Submitted by {ev.submittedBy}</span>
                  {onOpenDocumentViewer ? (
                    <button
                      type="button"
                      onClick={() => onOpenDocumentViewer(ev.url, ev.title)}
                      className="text-indigo-600 hover:text-indigo-800 hover:underline font-mono flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <span>View Artifact</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  ) : (
                    <a
                      href={ev.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline font-mono flex items-center gap-1"
                    >
                      <span>View Artifact</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. IMPACT BADGES TAB */}
      {activeTab === 'badges' && (
        <div className="space-y-6 text-left">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white space-y-3 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-bold">
              <Award className="h-4 w-4" />
              <span>Verifiable Credibility & Impact Badges</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Earned Impact Attestations ({projectBadges.length})
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Impact Badges are awarded based on verified evidence submissions, peer audits, 501(c)(6) fiscal sponsorship verification, and milestone escrow completions. Each badge links directly to cryptographic proof artifacts.
            </p>
          </div>

          {/* Badges Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projectBadges.map((badge) => {
              const badgeStyle = getBadgeLevelBadgeStyle(badge.level);
              return (
                <div
                  key={badge.id}
                  className={`bg-white border rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 group relative ${badgeStyle.border}`}
                >
                  <div className="space-y-3">
                    {/* Level & Category Header */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold uppercase font-mono px-2.5 py-1 rounded-full border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
                        {badge.level} Badge
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {badge.category}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="flex items-start space-x-3">
                      <div className={`p-2.5 rounded-xl ${badgeStyle.bg} ${badgeStyle.border} border text-slate-900 shrink-0`}>
                        <Award className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition">
                          {badge.name}
                        </h4>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Audited by {badge.verifier}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {badge.description}
                    </p>
                  </div>

                  {/* Audit details footer */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>Awarded: {badge.awardedAt}</span>
                      <span className="text-emerald-700 font-bold">Verified ✅</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedBadge(badge)}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Inspect Audit Trail</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Educational Guide Banner */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold font-mono text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>How OpenProof Impact Badges Work</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-indigo-700">1. Submit Proof Artifacts</div>
                <p className="text-slate-600 text-[11px]">
                  Attach GitHub pull requests, commits, vendor receipts, or geo-tagged photographs to project milestones.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-indigo-700">2. Community Peer Verification</div>
                <p className="text-slate-600 text-[11px]">
                  Verified community reviewers and 501(c)(6) non-profit fiscal guardians inspect deliverables and sign off.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-indigo-700">3. Permanent Attestation</div>
                <p className="text-slate-600 text-[11px]">
                  Impact Badges are awarded and displayed publicly on project profiles and project discovery cards.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. IMPACT DASHBOARD */}
      {activeTab === 'impact' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs text-left">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Project Impact Dashboard</h3>
              <p className="text-xs text-slate-500">
                Measurable outcomes produced by funded milestones for {project.title}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-1">
              <div className="text-2xl font-black text-indigo-600 font-mono">
                {formatConfidentialCurrency(project.raised, project.currency)}
              </div>
              <div className="text-xs text-slate-600 font-bold">Total Funding Raised</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-1">
              <div className="text-2xl font-black text-slate-900 font-mono">{project.supportersCount}</div>
              <div className="text-xs text-slate-600 font-bold">Supporters & Donors</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-1">
              <div className="text-2xl font-black text-blue-600 font-mono">{project.contributorsCount}</div>
              <div className="text-xs text-slate-600 font-bold">Verified Contributors</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-1">
              <div className="text-2xl font-black text-amber-600 font-mono">{completedMilestones}</div>
              <div className="text-xs text-slate-600 font-bold">Completed Milestones</div>
            </div>
          </div>

          {/* Badges Summary Section in Impact Dashboard */}
          {projectBadges.length > 0 && (
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span>Awarded Credibility Badges ({projectBadges.length})</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveTab('badges')}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  View Full Badge Audit →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {projectBadges.map((badge) => {
                  const style = getBadgeLevelBadgeStyle(badge.level);
                  return (
                    <div
                      key={badge.id}
                      onClick={() => setSelectedBadge(badge)}
                      className={`p-3 rounded-xl border transition cursor-pointer space-y-1 ${style.bg} ${style.border} hover:scale-102`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                        <span className="uppercase text-slate-700">{badge.level} Badge</span>
                        <span className="text-emerald-700">Verified</span>
                      </div>
                      <div className="font-extrabold text-xs text-slate-900">{badge.name}</div>
                      <div className="text-[10px] text-slate-600 line-clamp-1">{badge.verifier}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Impact Badge Detail Inspector Modal */}
      <ImpactBadgeModal
        badge={selectedBadge}
        onClose={() => setSelectedBadge(null)}
        onViewEvidence={(evidenceId) => {
          setSelectedBadge(null);
          setActiveTab('evidence');
        }}
      />

      {/* Global Settlement Multi-Rail Modal */}
      <GlobalSettlementModal
        isOpen={showPayoutModal}
        onClose={() => setShowPayoutModal(false)}
        availableBalance={remainingFunds}
        currency={displayCurrency}
        currentUser={currentUser}
        onSuccessPayout={(amount, rail) => {
          console.log('Disbursed payout:', amount, rail);
        }}
      />

      {/* Share Impact Social Card Generator Modal */}
      <ShareImpactCardModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        project={project}
        currency={displayCurrency}
      />

      {/* Proof Certificate of Verified Impact Modal */}
      {showProofCertModal && (
        <ProofCertificateModal
          project={project}
          onClose={() => setShowProofCertModal(false)}
          onOpenDocumentViewer={onOpenDocumentViewer}
        />
      )}
    </div>
  );
};

