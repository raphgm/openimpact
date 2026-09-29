import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Building2,
  Users,
  ArrowRight,
  Layers,
  Award,
  BarChart3,
  CheckCircle2,
  Heart,
  Globe,
  PlusCircle,
  FileText,
  Lock,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Calculator,
  Check,
  HelpCircle,
  ArrowUpRight,
  TrendingUp,
  Scale,
  Zap,
  GitPullRequest,
  MessageSquare,
  DollarSign,
  RefreshCw,
  AlertCircle,
  Clock,
  Ticket,
} from 'lucide-react';
import { Currency, Project } from '../types';
import { INITIAL_PROJECTS, INITIAL_COLLECTIVES } from '../data/mockData';
import { formatCurrency, convertCurrency } from '../utils/formatters';
import { Footer } from './Footer';
import { ModernButton } from './ui/ModernButton';
import { ModernCard } from './ui/ModernCard';
import { ImpactCard } from './ui/ImpactCard';

interface LandingPageProps {
  onExploreApp: () => void;
  onNavigate?: (page: string) => void;
  onOpenAuthModal: (mode?: 'select' | 'organization' | 'collective' | 'individual' | 'login') => void;
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  onOpenGithubPR?: (url?: string) => void;
  onOpenSponsorEventModal?: () => void;
  onOpenProofVerification?: () => void;
}

const AVATAR_OPTIONS = [
  {
    label: 'African Tech Pioneers',
    left: {
      name: 'Amara Okafor',
      role: 'Lead Maintainer',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      badgeBg: 'bg-emerald-500',
    },
    right: {
      name: 'Nneka Okonjo',
      role: 'Lead Auditor',
      img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
      badgeBg: 'bg-purple-600',
    },
  },
  {
    label: 'Global Open Source',
    left: {
      name: "Julian O'Connor",
      role: 'Core Architect',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      badgeBg: 'bg-blue-500',
    },
    right: {
      name: 'Sofia Chen',
      role: 'Grant Auditor',
      img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      badgeBg: 'bg-indigo-600',
    },
  },
  {
    label: 'Civic Engineers',
    left: {
      name: 'Kareem Adeyemi',
      role: 'DevOps Engineer',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      badgeBg: 'bg-teal-500',
    },
    right: {
      name: 'Dr. Maya Lin',
      role: 'Fiscal Compliance',
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      badgeBg: 'bg-rose-600',
    },
  },
  {
    label: 'HealthTech Innovators',
    left: {
      name: 'David Osei',
      role: 'API Engineer',
      img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
      badgeBg: 'bg-indigo-500',
    },
    right: {
      name: 'Maya Lin',
      role: 'Peer Reviewer',
      img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      badgeBg: 'bg-emerald-600',
    },
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onExploreApp,
  onNavigate,
  onOpenAuthModal,
  selectedCurrency,
  setSelectedCurrency,
  onOpenGithubPR,
  onOpenSponsorEventModal,
  onOpenProofVerification,
}) => {
  // Avatar pair state
  const [avatarPairIdx, setAvatarPairIdx] = useState(0);
  const currentPair = AVATAR_OPTIONS[avatarPairIdx];
  // Active Role Matrix tab
  const [activeRoleTab, setActiveRoleTab] = useState<'organization' | 'collective' | 'individual'>('collective');

  // Interactive Account Architecture Micro-UI States
  const [orgAutoEscrow, setOrgAutoEscrow] = useState(true);
  const [orgFilterStatus, setOrgFilterStatus] = useState<'Active' | 'Audited' | 'Pending'>('Active');
  const [collectiveLedgerFilter, setCollectiveLedgerFilter] = useState<'Expenses' | 'Grants' | 'Bounties'>('Grants');
  const [collectiveBountyCreated, setCollectiveBountyCreated] = useState(false);
  const [individualPrSynced, setIndividualPrSynced] = useState(true);
  const [individualRepScore, setIndividualRepScore] = useState(96);

  // Hero Showcase Interactive State
  const [activeDemoCollective, setActiveDemoCollective] = useState<'west-africa' | 'open-health' | 'civic-tech'>('west-africa');
  const [activeStep, setActiveStep] = useState<number>(4);

  // Automated Hero Milestone Escrow Pipeline Stepper
  useEffect(() => {
    const stepTimer = setInterval(() => {
      setActiveStep((prevStep) => (prevStep % 4) + 1);
    }, 3800);
    return () => clearInterval(stepTimer);
  }, []);

  // FAQ Expand state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is an Impact Repository?',
      a: 'An Impact Repository is a public, verifiable space for your events, campaigns, community projects, or fundraising initiatives. It acts like a "GitHub repo" for real-world social impact, tracking objectives, milestones, evidence, and financial transparency in one place.',
    },
    {
      q: 'How does Open Impact create accountability?',
      a: 'By tracking funds and milestones publicly. Funds flow into an initiative, and they are mapped directly to transparent deliverables. Evidence (documents, receipts, event photos, or reviews) must be verified by designated community reviewers before milestones are marked complete.',
    },
    {
      q: 'What evidence can contributors submit?',
      a: 'Contributors can attach any form of proof: event attendance sheets, photos/videos, financial receipts, audit reports, or signed documents. Reviewers authenticate the proof against the milestone requirements to build the permanent Impact Record.',
    },
    {
      q: 'What is a Proof of Impact Certificate?',
      a: 'At the end of a leadership tenure or an initiative, Open Impact generates a verifiable Proof of Impact Certificate. This certificate cryptographically proves the exact milestones achieved, the funds successfully managed, and the beneficiaries impacted under your leadership.',
    },
    {
      q: 'Who is Open Impact built for?',
      a: 'Open Impact is for NGOs, student organizations, community leaders, foundations, clubs, and volunteers who want to make their real-world impact impossible to hide and build permanent, verifiable records of their achievements.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      {/* Soft Background Mesh Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-60 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-200/30 via-transparent to-cyan-200/30 -z-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-teal-100/40 via-blue-100/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-rose-100/40 via-orange-100/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Benchmark Style Floating Pill Navigation Bar */}
      <div className="sticky top-4 z-50 max-w-6xl mx-auto px-4 w-full">
        <header className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-full px-6 py-3 shadow-md shadow-slate-200/50 flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={onExploreApp}>
            <div className="relative w-8 h-8 flex items-center justify-center scale-90">
              <div className="absolute w-5 h-7 bg-[#8B5CF6] rounded-full transform -rotate-[30deg] translate-x-1 shadow-sm"></div>
              <div className="absolute w-5 h-7 bg-[#10B981] rounded-full transform -rotate-[30deg] -translate-x-1 opacity-90 shadow-sm"></div>
            </div>
            <span className="font-bold text-base tracking-tight text-slate-950">Open Impact</span>
            <div className="hidden sm:block h-4 w-px bg-slate-200 mx-2" />
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-7 text-xs font-semibold text-slate-600">
            <button
              onClick={() => onNavigate ? onNavigate('products') : onExploreApp()}
              className="hover:text-slate-950 transition cursor-pointer"
            >
              Products
            </button>
            <button
              onClick={() => onNavigate ? onNavigate('documents') : onExploreApp()}
              className="hover:text-slate-950 transition cursor-pointer"
            >
              Documents
            </button>
            <button
              onClick={() => onNavigate ? onNavigate('contact') : onExploreApp()}
              className="hover:text-slate-950 transition cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Currency Dropdown */}
            <div className="hidden lg:flex items-center space-x-1 bg-slate-100/80 rounded-full px-3 py-1 text-xs font-semibold border border-slate-200/60">
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
                className="bg-transparent text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="NGN">NGN (₦)</option>
                <option value="USD">USD ($)</option>
                <option value="KES">KES (KSh)</option>
                <option value="GHS">GHS (GH₵)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <button
              onClick={() => onOpenAuthModal('login')}
              className="text-slate-700 hover:text-slate-950 font-semibold text-xs px-3 py-1.5 transition cursor-pointer"
            >
              Log in
            </button>

            <button
              onClick={() => onOpenAuthModal('select')}
              className="bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-2xl transition cursor-pointer shadow-xs flex items-center space-x-1.5"
            >
              <span>Sign up</span>
            </button>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="pt-12 lg:pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & Action */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-200 rounded-full px-3.5 py-1 text-xs font-mono font-bold text-slate-700">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Impact Tracking, Accountability & Proof</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.08]">
              Make impact impossible to hide.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-lg">
              Plan initiatives. Track milestones. Account for resources. Verify outcomes. Build a permanent record of what you actually accomplished. Every action becomes evidence. Every milestone becomes proof.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreApp}
                className="bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-3.5 rounded-full transition shadow-md cursor-pointer flex items-center space-x-2"
              >
                <span>Explore Repositories</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {onOpenProofVerification && (
                <button
                  type="button"
                  onClick={onOpenProofVerification}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-sm px-5 py-3.5 rounded-full transition cursor-pointer flex items-center space-x-2 shadow-2xs"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Proof Certificate Generator</span>
                </button>
              )}

              <button
                onClick={() => onOpenAuthModal('select')}
                className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-semibold text-sm px-6 py-3.5 rounded-full transition cursor-pointer"
              >
                Create Impact Repository
              </button>
            </div>
          </div>

          {/* Right Column: macOS App Showcase Box with Pipeline Flow */}
          <div className="lg:col-span-7 relative">
            
            {/* Main Application Window */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xl shadow-slate-300/60 overflow-hidden relative">
              
              {/* Window Header / macOS Controls */}
              <div className="bg-slate-100/80 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>

                <div 
                  onClick={onExploreApp}
                  className="bg-white hover:bg-slate-50 border border-slate-200 rounded-md px-3 py-1 text-xs text-slate-600 font-mono flex items-center space-x-2 w-72 shadow-2xs truncate cursor-pointer transition"
                  title="Click to launch full app"
                >
                  <Lock className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    {activeDemoCollective === 'west-africa' && 'https://openimpact.org/app/collective/west-africa'}
                    {activeDemoCollective === 'open-health' && 'https://openimpact.org/app/collective/open-health'}
                    {activeDemoCollective === 'civic-tech' && 'https://openimpact.org/app/collective/civic-tech'}
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">Live Engine</span>
                </div>
              </div>

              {/* Window Body: Dashboard Layout */}
              <div className="grid grid-cols-12 bg-slate-50/50 min-h-[380px] text-left">
                
                {/* Left Mini Sidebar */}
                <div className="col-span-3 border-r border-slate-200/80 bg-slate-50 p-3 space-y-4 hidden sm:block">
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-extrabold uppercase text-slate-400 px-2 tracking-wider">
                      Collectives
                    </div>

                    {/* Collective 1: West Africa Tech */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDemoCollective('west-africa');
                        setActiveStep(4);
                      }}
                      className={`w-full p-2 rounded-xl text-left flex items-center space-x-2 transition cursor-pointer ${
                        activeDemoCollective === 'west-africa'
                          ? 'bg-white border border-slate-300 shadow-xs ring-2 ring-indigo-500/20 text-slate-900 font-bold'
                          : 'hover:bg-slate-100 text-slate-600 font-medium border border-transparent'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        WA
                      </div>
                      <span className="text-xs truncate">West Africa Tech</span>
                    </button>

                    {/* Collective 2: OpenHealth API */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDemoCollective('open-health');
                        setActiveStep(3);
                      }}
                      className={`w-full p-2 rounded-xl text-left flex items-center space-x-2 transition cursor-pointer ${
                        activeDemoCollective === 'open-health'
                          ? 'bg-white border border-slate-300 shadow-xs ring-2 ring-emerald-500/20 text-slate-900 font-bold'
                          : 'hover:bg-slate-100 text-slate-600 font-medium border border-transparent'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                        OH
                      </div>
                      <span className="text-xs truncate">OpenHealth API</span>
                    </button>

                    {/* Collective 3: Civic Tech Alliance */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDemoCollective('civic-tech');
                        setActiveStep(2);
                      }}
                      className={`w-full p-2 rounded-xl text-left flex items-center space-x-2 transition cursor-pointer ${
                        activeDemoCollective === 'civic-tech'
                          ? 'bg-white border border-slate-300 shadow-xs ring-2 ring-blue-500/20 text-slate-900 font-bold'
                          : 'hover:bg-slate-100 text-slate-600 font-medium border border-transparent'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                        CT
                      </div>
                      <span className="text-xs truncate">Civic Tech Alliance</span>
                    </button>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 space-y-1">
                    <div className="text-[10px] font-extrabold uppercase text-slate-400 px-2 tracking-wider">
                      Escrow Vault
                    </div>
                    <div 
                      onClick={onExploreApp}
                      className="bg-indigo-50/60 hover:bg-indigo-50 p-2.5 rounded-xl border border-indigo-100 transition cursor-pointer"
                      title="Click to view full escrow vault"
                    >
                      <div className="text-[10px] text-indigo-700 font-medium">Locked Capital</div>
                      <div className="text-sm font-black text-indigo-950 font-mono">
                        {activeDemoCollective === 'west-africa' && '$32,500 USD'}
                        {activeDemoCollective === 'open-health' && '$42,000 USD'}
                        {activeDemoCollective === 'civic-tech' && '$17,000 USD'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Workspace Area */}
                <div className="col-span-12 sm:col-span-9 p-4 sm:p-5 space-y-4 bg-white">
                  
                  {/* Header Metrics */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-extrabold text-slate-900 text-sm">
                          {activeDemoCollective === 'west-africa' && 'West Africa Tech Collective'}
                          {activeDemoCollective === 'open-health' && 'OpenHealth API Collective'}
                          {activeDemoCollective === 'civic-tech' && 'Civic Tech Alliance'}
                        </h3>
                        <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full border border-slate-200">
                          501(c)(6) Non-Profit
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Active Grant:{' '}
                        <span className="text-slate-800 font-bold">
                          {activeDemoCollective === 'west-africa' && '$45,000 USD'}
                          {activeDemoCollective === 'open-health' && '$60,000 USD'}
                          {activeDemoCollective === 'civic-tech' && '$25,000 USD'}
                        </span>{' '}
                        •{' '}
                        {activeDemoCollective === 'west-africa' && 'Milestone #2'}
                        {activeDemoCollective === 'open-health' && 'Milestone #3'}
                        {activeDemoCollective === 'civic-tech' && 'Milestone #1'}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={onExploreApp}
                        className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center space-x-1 cursor-pointer transition"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Escrow Protected</span>
                      </button>
                    </div>
                  </div>

                  {/* Grant Disbursement Pipeline Flow */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-left">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] text-slate-500">
                        Milestone Escrow Pipeline (Click steps to inspect)
                      </span>
                      <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 text-xs">
                        {activeDemoCollective === 'west-africa' && '$12,500 USDC'}
                        {activeDemoCollective === 'open-health' && '$18,000 USDC'}
                        {activeDemoCollective === 'civic-tech' && '$8,000 USDC'}
                      </span>
                    </div>

                    {/* Step-by-Step Horizontal Pipeline Grid */}
                    <div className="grid grid-cols-4 gap-2 pt-1 relative">
                      {/* Connected Line Background */}
                      <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

                      {/* Pipeline Step 1 */}
                      <button
                        type="button"
                        onClick={() => setActiveStep(1)}
                        className={`relative z-10 text-center space-y-1.5 cursor-pointer group transition ${
                          activeStep === 1 ? 'scale-105' : 'opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center mx-auto ring-4 ring-slate-50 shadow-xs transition ${
                          activeStep === 1 ? 'bg-indigo-600 text-white ring-indigo-200 scale-110' : 'bg-emerald-500 text-white'
                        }`}>
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className={`text-[11px] leading-tight transition ${activeStep === 1 ? 'font-black text-indigo-700' : 'font-bold text-slate-900'}`}>
                          1. Escrow Locked
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">Vault Funded</div>
                      </button>

                      {/* Pipeline Step 2 */}
                      <button
                        type="button"
                        onClick={() => setActiveStep(2)}
                        className={`relative z-10 text-center space-y-1.5 cursor-pointer group transition ${
                          activeStep === 2 ? 'scale-105' : 'opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center mx-auto ring-4 ring-slate-50 shadow-xs transition ${
                          activeStep === 2 ? 'bg-indigo-600 text-white ring-indigo-200 scale-110' : 'bg-emerald-500 text-white'
                        }`}>
                          <GitPullRequest className="h-4 w-4" />
                        </div>
                        <div className={`text-[11px] leading-tight transition ${activeStep === 2 ? 'font-black text-indigo-700' : 'font-bold text-slate-900'}`}>
                          2. PR Submitted
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">Proof Attached</div>
                      </button>

                      {/* Pipeline Step 3 */}
                      <button
                        type="button"
                        onClick={() => setActiveStep(3)}
                        className={`relative z-10 text-center space-y-1.5 cursor-pointer group transition ${
                          activeStep === 3 ? 'scale-105' : 'opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center mx-auto ring-4 ring-slate-50 shadow-xs transition ${
                          activeStep === 3 ? 'bg-indigo-600 text-white ring-indigo-200 scale-110' : 'bg-indigo-500 text-white'
                        }`}>
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div className={`text-[11px] leading-tight transition ${activeStep === 3 ? 'font-black text-indigo-700' : 'font-bold text-slate-900'}`}>
                          3. Peer Audit
                        </div>
                        <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block">
                          Signatures
                        </div>
                      </button>

                      {/* Pipeline Step 4 */}
                      <button
                        type="button"
                        onClick={() => setActiveStep(4)}
                        className={`relative z-10 text-center space-y-1.5 cursor-pointer group transition ${
                          activeStep === 4 ? 'scale-105' : 'opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center mx-auto ring-4 ring-slate-50 shadow-xs transition ${
                          activeStep === 4 ? 'bg-emerald-600 text-white ring-emerald-200 scale-110 animate-pulse' : 'bg-slate-300 text-slate-700'
                        }`}>
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className={`text-[11px] leading-tight transition ${activeStep === 4 ? 'font-black text-emerald-700' : 'font-bold text-slate-900'}`}>
                          4. Released
                        </div>
                        <div className="text-[10px] text-emerald-700 font-bold font-mono">Disbursed</div>
                      </button>
                    </div>

                    {/* Active Step Description Panel */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-1 transition text-xs">
                      {activeStep === 1 && (
                        <div>
                          <span className="font-bold text-slate-900">Step 1: Smart Escrow Vault Locked.</span>{' '}
                          <span className="text-slate-600">
                            Grant capital is deposited under 501(c)(6) non-profit sponsorship into milestone-locked smart accounts.
                          </span>
                        </div>
                      )}
                      {activeStep === 2 && (
                        <div>
                          <span className="font-bold text-slate-900">Step 2: Deliverable Proof Submitted.</span>{' '}
                          <span className="text-slate-600">
                            Maintainers link GitHub Pull Requests, automated test outputs, and deployment logs to trigger peer review.
                          </span>
                        </div>
                      )}
                      {activeStep === 3 && (
                        <div>
                          <span className="font-bold text-slate-900">Step 3: Peer Signature Verification.</span>{' '}
                          <span className="text-slate-600">
                            3 of 3 designated community auditors review and cryptographically sign off on milestone completion.
                          </span>
                        </div>
                      )}
                      {activeStep === 4 && (
                        <div>
                          <span className="font-bold text-emerald-700">Step 4: Automatic Non-Profit Payout Released.</span>{' '}
                          <span className="text-slate-600">
                            Escrow automatically unlocks and transfers directly to maintainer fiat bank or crypto wallet with 0% platform fee.
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Active Proof & Payout Details Bar */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200/90 flex flex-wrap items-center justify-between text-xs gap-2">
                      <div 
                        onClick={() => {
                          const url = activeDemoCollective === 'west-africa'
                            ? 'github.com/openimpact/pay-bridge/pull/142'
                            : activeDemoCollective === 'open-health'
                            ? 'github.com/openimpact/fhir-sync/pull/88'
                            : 'github.com/openimpact/budget-vis/pull/19';
                          if (onOpenGithubPR) onOpenGithubPR(url);
                          else onExploreApp();
                        }}
                        className="flex items-center space-x-2 truncate cursor-pointer hover:text-indigo-600 transition group"
                        title="Click to view Pull Request in GitHub Inspector"
                      >
                        <GitPullRequest className="h-4 w-4 text-indigo-600 shrink-0 group-hover:scale-110 transition" />
                        <span className="font-mono text-[11px] text-slate-700 font-semibold truncate underline decoration-indigo-300">
                          {activeDemoCollective === 'west-africa' && 'github.com/openimpact/pay-bridge/pull/142'}
                          {activeDemoCollective === 'open-health' && 'github.com/openimpact/fhir-sync/pull/88'}
                          {activeDemoCollective === 'civic-tech' && 'github.com/openimpact/budget-vis/pull/19'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Audit Log Verified</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Banner */}
                  <div 
                    onClick={onExploreApp}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-100 p-3 rounded-xl flex items-center justify-between text-xs cursor-pointer transition shadow-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="font-medium">Click to explore live grants for this collective</span>
                    </div>
                    <span className="font-bold text-indigo-300 font-mono text-[11px] bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                      Disbursed 0% Fees →
                    </span>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Bottom Social Proof Bar */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-slate-200/60 text-center space-y-4">
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Powering <span className="font-extrabold text-slate-950">$4,250,000+</span> in grant disbursements & 501(c)(6) milestone escrow across <span className="font-bold text-slate-900">140+ collectives</span>.
          </p>

          <div>
            <button
              onClick={onExploreApp}
              className="bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm px-6 py-2.5 rounded-full transition shadow-xs inline-flex items-center space-x-2 cursor-pointer"
            >
              <span>Explore Collectives</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Account Role Matrix & Architecture Section */}
      <section className="py-20 bg-white border-y border-slate-200 text-left font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50/90 px-3.5 py-1.5 rounded-full border border-indigo-200/80 shadow-2xs uppercase tracking-wider font-mono">
              Account Architecture & Dynamic Reach
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Tailored Infrastructure for Every Role
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Select your participant profile below to see dynamic reach statistics, specialized micro-UI workflows, and automated fiscal controls built for your exact operational model.
            </p>

            {/* Interactive Role Selector Pills */}
            <div className="pt-3 flex justify-center">
              <div className="inline-flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/90 max-w-md w-full text-xs font-bold shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveRoleTab('organization')}
                  className={`flex-1 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                    activeRoleTab === 'organization'
                      ? 'bg-[#0B1E48] text-white shadow-sm font-black ring-2 ring-indigo-400/40'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Funders</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRoleTab('collective')}
                  className={`flex-1 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                    activeRoleTab === 'collective'
                      ? 'bg-[#0B1E48] text-white shadow-sm font-black ring-2 ring-indigo-400/40'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>Organizations</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRoleTab('individual')}
                  className={`flex-1 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                    activeRoleTab === 'individual'
                      ? 'bg-[#0B1E48] text-white shadow-sm font-black ring-2 ring-indigo-400/40'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>Contributors</span>
                </button>
              </div>
            </div>
          </div>



          {/* DYNAMIC 4 BENCHMARK MICRO-UI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Non-Profit Legal Custody */}
            <div className="rounded-[28px] border border-slate-200/90 bg-white p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md">
              <div className="rounded-[20px] bg-[#e6f4ea] border border-emerald-100/80 p-5 min-h-[228px] flex flex-col justify-center items-center relative shadow-2xs overflow-hidden">
                {/* Floating White Balance Card Graphic */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-md w-full max-w-[240px] space-y-3 text-left transform hover:scale-102 transition duration-200">
                  <div className="flex items-center space-x-1.5 pb-1 border-b border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-rose-400" />
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Balance</div>
                    <div className="text-xl font-black text-slate-900 font-mono tracking-tight flex items-baseline justify-between">
                      <span>$45,000</span>
                      <span className="text-xs text-slate-500 font-semibold">USD</span>
                    </div>
                  </div>
                  <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                    <span>Balances</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-left pt-1">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Non-Profit Legal Custody</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Non-profit legal custody platform for grant management and escrow without personal tax liability.
                </p>
              </div>
            </div>

            {/* Card 2: Public Financial Ledger */}
            <div className="rounded-[28px] border border-slate-200/90 bg-white p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md">
              <div className="rounded-[20px] bg-[#f0ebff] border border-purple-100/80 p-4 min-h-[228px] flex flex-col justify-center items-center relative shadow-2xs overflow-hidden">
                {/* Floating White Ledger Table Graphic */}
                <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-md w-full max-w-[250px] space-y-2 text-left transform hover:scale-102 transition duration-200">
                  <div className="font-extrabold text-xs text-slate-900 border-b border-slate-100 pb-1.5 flex items-center justify-between">
                    <span>Ledger</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-mono font-bold px-1.5 py-0.5 rounded">Live</span>
                  </div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 grid grid-cols-12 gap-1 pb-1">
                    <span className="col-span-4">Date</span>
                    <span className="col-span-3 text-center">Status</span>
                    <span className="col-span-5 text-right">Amount</span>
                  </div>
                  <div className="text-[10px] font-mono grid grid-cols-12 gap-1 items-center border-t border-slate-100 pt-1.5">
                    <span className="col-span-4 font-semibold text-slate-600">05.04.2021</span>
                    <span className="col-span-3 text-center bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1 rounded">110HI</span>
                    <span className="col-span-5 text-right font-bold text-slate-900">-$45,000.00</span>
                  </div>
                  <div className="text-[10px] font-mono grid grid-cols-12 gap-1 items-center border-t border-slate-100 pt-1.5">
                    <span className="col-span-4 font-semibold text-slate-600">05.05.2021</span>
                    <span className="col-span-3 text-center bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1 rounded">NIDTN</span>
                    <span className="col-span-5 text-right font-bold text-slate-900">-$35,000.00</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-left pt-1">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Public Financial Ledger</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  A public financial ledger providing real-time grant management and transparent public auditing.
                </p>
              </div>
            </div>

            {/* Card 3: Automated Bounty Escrow */}
            <div className="rounded-[28px] border border-slate-200/90 bg-white p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md">
              <div className="rounded-[20px] bg-[#e8e0f5] border border-purple-100/80 p-4 min-h-[228px] flex flex-col justify-center items-center relative shadow-2xs overflow-hidden">
                {/* Floating Dark Code Window Graphic */}
                <div className="bg-[#0b1329] rounded-2xl p-3.5 border border-slate-800 shadow-lg w-full max-w-[240px] space-y-2 text-left font-mono transform hover:scale-102 transition duration-200">
                  <div className="flex items-center space-x-1.5 pb-1 border-b border-slate-800">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[11px] leading-relaxed text-slate-300">
                    <span className="text-purple-400 font-bold">open</span> <span className="text-amber-300 font-bold">Collective</span> = &#123;<br />
                    &nbsp;&nbsp;<span className="text-indigo-300">user</span> &#123;<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-emerald-400">code</span>: <span className="text-emerald-200">"verify"</span>,<br />
                    &nbsp;&nbsp;&#125;<br />
                    &#125;
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-left pt-1">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Automated Bounty Escrow</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Automated bounty escrow to release code, milestone payouts, and escrow deliverables.
                </p>
              </div>
            </div>

            {/* Card 4: Peer Auditor Verification */}
            <div className="rounded-[28px] border border-slate-200/90 bg-white p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md">
              <div className="rounded-[20px] bg-[#e6f4ea] border border-emerald-100/80 p-4 min-h-[228px] flex flex-col justify-center items-center relative shadow-2xs overflow-hidden">
                {/* Floating User Profile Card Graphic */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-md w-full max-w-[240px] space-y-3 text-left transform hover:scale-102 transition duration-200">
                  <div className="flex items-center space-x-3">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="User" className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                        <span>Verified User</span>
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">Verified User</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button type="button" className="flex-1 py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition">
                      Log in
                    </button>
                    <button type="button" className="flex-1 py-1.5 px-2 bg-[#0b1329] text-white rounded-lg text-[10px] font-bold hover:bg-slate-800 transition flex items-center justify-center space-x-1">
                      <span>Verified</span>
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-left pt-1">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Peer Auditor Verification</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Verified user profiles with peer auditor verification and cryptographic milestone sign-off.
                </p>
              </div>
            </div>

          </div>

          {/* Section Divider Subheading */}
          <div className="pt-8 text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Why Choose OpenImpact Fiscal Technology
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Comparing legacy manual grant management against automated, milestone-verified fiscal technology built for {activeRoleTab === 'organization' ? 'Organizations' : activeRoleTab === 'collective' ? 'Collectives' : 'Individuals'}.
            </p>
          </div>

          {/* Bottom 2 Large Benchmark Hero Feature Showcase Cards (Side-by-Side Bento Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Hero Card: Legacy Manual Bottleneck */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between">
              {/* Graphic Illustration Container (Pastel Top Box) */}
              <div className="bg-[#fee2e2]/40 border-b border-rose-100/80 p-5 sm:p-7 flex flex-col items-center justify-center relative min-h-[240px]">
                {/* Center White Mock Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-rose-200/60 shadow-md w-full max-w-sm sm:max-w-md space-y-3 relative mb-2">
                  <div className="text-center font-extrabold text-xs text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                      <span className="font-bold">Legacy Manual Process</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      High Friction
                    </span>
                  </div>

                  {/* Form Field 1 */}
                  <div className="space-y-1 text-left">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>PDF Invoices & Receipts</span>
                      <span className="text-slate-400 font-mono font-normal">Manual Review</span>
                    </div>
                    <div className="h-8 bg-slate-50 rounded-xl w-full border border-slate-200/80 flex items-center px-3 text-xs font-mono text-slate-600 justify-between shadow-2xs">
                      <span className="truncate">invoice_receipt_draft_v2.pdf</span>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-100/90 px-2 py-0.5 rounded-md shrink-0 border border-rose-200/80">Missing</span>
                    </div>
                  </div>

                  {/* Form Field 2 */}
                  <div className="space-y-1 text-left">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Email Threads & Verification</span>
                      <span className="text-slate-400 font-mono font-normal">Email Chains</span>
                    </div>
                    <div className="h-8 bg-slate-50 rounded-xl w-full border border-slate-200/80 flex items-center px-3 text-xs font-mono text-slate-600 justify-between shadow-2xs">
                      <span className="truncate">Fwd: Re: Manual wire status...</span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-md shrink-0 border border-amber-200/80">Pending</span>
                    </div>
                  </div>

                  {/* Form Field 3 */}
                  <div className="space-y-1 text-left">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Bank Wire Dispatch</span>
                      <span className="text-slate-400 font-mono font-normal">SWIFT / IBAN</span>
                    </div>
                    <div className="h-8 bg-slate-50 rounded-xl w-full border border-slate-200/80 flex items-center px-3 text-xs font-mono text-slate-600 justify-between shadow-2xs">
                      <span className="truncate">SWIFT / IBAN Manual Release</span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-200/90 px-2 py-0.5 rounded-md shrink-0 border border-slate-300/80">8+ Wks</span>
                    </div>
                  </div>

                  {/* Form Field 4 */}
                  <div className="space-y-1 text-left">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Fiscal Audit & 1099 Filings</span>
                      <span className="text-slate-400 font-mono font-normal">IRS Compliance</span>
                    </div>
                    <div className="h-8 bg-slate-50 rounded-xl w-full border border-slate-200/80 flex items-center px-3 text-xs font-mono text-slate-600 justify-between shadow-2xs">
                      <span className="truncate">Manual W-9 & Tax Exemption</span>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md shrink-0 border border-rose-200/80">Unverified</span>
                    </div>
                  </div>
                </div>

                {/* Overlapping Floating Button */}
                <div className="absolute -bottom-3.5 bg-rose-100/95 text-rose-950 border border-rose-300/90 font-bold text-[11px] px-4 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
                  <span>High Administrative Friction</span>
                </div>
              </div>

              {/* Lower Text Section */}
              <div className="p-6 sm:p-8 space-y-3 pt-8 text-left">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug sm:whitespace-nowrap">
                  {activeRoleTab === 'organization' && 'Unincorporated Collectives Face Heavy Tax Risk'}
                  {activeRoleTab === 'collective' && 'Unincorporated Collectives Face Heavy Tax Risk'}
                  {activeRoleTab === 'individual' && 'Unpaid Open Source Work Leads to Career Burnout'}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {activeRoleTab === 'organization' && (
                    <>
                      Spending months reviewing receipts, chasing maintainers across email threads, and dispatching manual bank wires <b>kills momentum</b>. Legacy grant reviews lose <b>35%+ of capital in administrative overhead</b> before impact occurs.
                    </>
                  )}
                  {activeRoleTab === 'collective' && (
                    <>
                      Using personal bank accounts leads to <b>massive tax penalties</b>, mixed personal finances, and lost sponsor trust. Operating without 501(c)(6) non-profit status <b>exposes lead maintainers to heavy personal liability</b>.
                    </>
                  )}
                  {activeRoleTab === 'individual' && (
                    <>
                      Uncompensated commits, lack of verifiable career proof, and relying on random donation buttons leave maintainers exhausted. Unpaid work <b>drains developer energy</b> without permanent proof-of-work recognition.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Right Hero Card: Automated OpenImpact Fiscal & Milestone Engine */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between">
              {/* Graphic Illustration Container (Pastel Top Box) */}
              <div className="bg-[#e6fafc]/60 border-b border-cyan-100 p-5 sm:p-7 flex flex-col items-center justify-center relative min-h-[240px]">
                {/* Floating Avatars & Connection Bar */}
                <div className="w-full max-w-sm sm:max-w-md space-y-2.5 relative mb-2">
                  <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pb-0.5">
                    <span>Verified Participants</span>
                    <span className="text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full text-[9px] font-bold border border-emerald-200">Live Network</span>
                  </div>

                  {/* Notification Card 1 */}
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200/80 shadow-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={currentPair.left.img}
                          className="w-9 h-9 rounded-full border-2 border-indigo-600 object-cover"
                          alt={currentPair.left.name}
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 w-2.5 h-2.5 rounded-full ring-2 ring-white"></span>
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <span>{currentPair.left.name}</span>
                          <span className="text-indigo-600 text-[10px]">✓</span>
                        </div>
                        <div className="text-[11px] font-bold text-emerald-700">
                          ⚡ Milestone Escrow Locked · $25,000
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">03:01 AM</span>
                  </div>

                  {/* Notification Card 2 */}
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200/80 shadow-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={currentPair.right.img}
                          className="w-9 h-9 rounded-full border-2 border-purple-600 object-cover"
                          alt={currentPair.right.name}
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 bg-indigo-500 w-2.5 h-2.5 rounded-full ring-2 ring-white"></span>
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <span>{currentPair.right.name}</span>
                          <span className="text-indigo-600 text-[10px]">✓</span>
                        </div>
                        <div className="text-[11px] font-bold text-indigo-700">
                          ✅ Peer Review Approved · 100% Tax Receipt
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">03:01 AM</span>
                  </div>
                </div>

                {/* Overlapping Floating CTA Button */}
                <button
                  type="button"
                  onClick={() => onOpenAuthModal(activeRoleTab)}
                  className="absolute -bottom-3.5 bg-[#d7fc34] hover:bg-lime-300 text-slate-950 font-bold text-[11px] px-4 py-1.5 rounded-lg shadow-xs border border-lime-400 flex items-center gap-1.5 cursor-pointer transition z-10"
                >
                  <PlusCircle className="h-3.5 w-3.5 text-slate-900" />
                  <span>Launch {activeRoleTab === 'organization' ? 'Grant Program' : activeRoleTab === 'collective' ? 'Collective' : 'Profile'}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-900" />
                </button>
              </div>

              {/* Lower Text Section */}
              <div className="p-6 sm:p-8 space-y-3 pt-8 text-left">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug sm:whitespace-nowrap">
                  {activeRoleTab === 'organization' && 'Instant 501(c)(6) Sponsorship & Smart Treasury'}
                  {activeRoleTab === 'collective' && 'Instant 501(c)(6) Sponsorship & Smart Treasury'}
                  {activeRoleTab === 'individual' && 'Earn Guaranteed Escrow Payouts & Proven Reputation'}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {activeRoleTab === 'organization' && (
                    <>
                      Deploy capital with precision. OpenImpact <b>auto-discovers milestone proofs</b>, locks capital in smart escrow, and releases payouts upon peer verification—cutting administrative overhead so your <b>capital flows seamlessly.</b>
                    </>
                  )}
                  {activeRoleTab === 'collective' && (
                    <>
                      Focus on building software. OpenImpact provides an <b>instant 501(c)(6) non-profit umbrella</b>, handles 1099 vendor disbursements, and manages non-profit bank custody—so your treasury <b>remains 100% compliant.</b>
                    </>
                  )}
                  {activeRoleTab === 'individual' && (
                    <>
                      Get paid fairly for your open source work. Link GitHub pull requests to locked escrow bounties and <b>receive instant payout disbursements</b> while building a <b>verifiable career portfolio.</b>
                    </>
                  )}
                </p>
              </div>
            </div>

          </div>

          {/* Interactive Role Details CTA Box for Active Tab */}
          <div className="bg-[#4b40f5] text-white rounded-[2rem] p-8 sm:p-12 md:p-14 w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center shadow-2xl relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="md:col-span-8 space-y-5 text-left relative z-10">
              {activeRoleTab === 'organization' && (
                <>
                  <div className="inline-flex items-center space-x-2 bg-white/5 text-indigo-100 text-xs font-mono px-4 py-2 rounded-full border border-white/10 backdrop-blur-md font-bold">
                    <Building2 className="h-3.5 w-3.5 text-indigo-300" />
                    <span>For Foundations, Donors & Sponsors</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-snug">
                    Fund Verified Impact
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    Deploy resources into transparent initiatives. Ensure every dollar maps to verifiable community milestones, backed by public evidence and auditable trails.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-200 font-mono font-medium pt-1">
                    <li className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <span>Track resource allocation to actual deliverables</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <span>Receive verifiable impact reports and ESG data</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onOpenAuthModal('organization')}
                      className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs rounded-xl transition-all duration-200 shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 cursor-pointer inline-flex items-center space-x-2"
                    >
                      <span>Start Funding Impact</span>
                      <ArrowRight className="h-4 w-4 text-indigo-600" />
                    </button>
                  </div>
                </>
              )}

              {activeRoleTab === 'collective' && (
                <>
                  <div className="inline-flex items-center space-x-2 bg-white/5 text-indigo-100 text-xs font-mono px-4 py-2 rounded-full border border-white/10 backdrop-blur-md font-bold">
                    <Users className="h-3.5 w-3.5 text-indigo-300" />
                    <span>For Community Leaders, NGOs & Event Organizers</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-snug">
                    Build a Verifiable Impact Record
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    Create an Impact Repository for your initiative. Track attendance, milestones, and deliverables publicly so your community and sponsors can see exactly what was achieved.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-200 font-mono font-medium pt-1">
                    <li className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <span>Generate Proof of Impact Certificates at the end of your tenure</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <span>Maintain a fully auditable trail of resources and results</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onOpenAuthModal('collective')}
                      className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs rounded-xl transition-all duration-200 shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 cursor-pointer inline-flex items-center space-x-2"
                    >
                      <span>Create an Impact Repository</span>
                      <ArrowRight className="h-4 w-4 text-indigo-600" />
                    </button>
                  </div>
                </>
              )}

              {activeRoleTab === 'individual' && (
                <>
                  <div className="inline-flex items-center space-x-2 bg-white/5 text-indigo-100 text-xs font-mono px-4 py-2 rounded-full border border-white/10 backdrop-blur-md font-bold">
                    <Award className="h-3.5 w-3.5 text-indigo-300" />
                    <span>For Volunteers, Reviewers & Contributors</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-snug">
                    Turn Actions into Verified Proof
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    Contribute to community initiatives, upload evidence of your work, and have it peer-verified. Build an undeniable portfolio of real-world impact.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-200 font-mono font-medium pt-1">
                    <li className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <span>Earn verified credentials for every completed task</span>
                    </li>
                    <li className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <span>Act as a community reviewer and build trust scores</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onOpenAuthModal('individual')}
                      className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs rounded-xl transition-all duration-200 shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 cursor-pointer inline-flex items-center space-x-2"
                    >
                      <span>Join as Contributor</span>
                      <ArrowRight className="h-4 w-4 text-indigo-600" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Side Capability Checklist */}
            <div className="md:col-span-4 bg-white/[0.04] border border-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-5 text-left relative z-10 shadow-xl">
              <div className="text-[11px] font-black uppercase tracking-widest text-indigo-200 font-mono flex items-center space-x-1.5 border-b border-white/10 pb-3">
                <Zap className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                <span>PLATFORM ARCHITECTURE</span>
              </div>
              <div className="space-y-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between gap-2 shadow-inner">
                  <span className="font-semibold text-slate-100">Impact Verification</span>
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Multi-level</span>
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between gap-2 shadow-inner">
                  <span className="font-semibold text-slate-100">OpenProof Engine</span>
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Evidence-based</span>
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between gap-2 shadow-inner">
                  <span className="font-semibold text-slate-100">AI Impact Auditor</span>
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>Planned</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Collectives & Impact Spotlight */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Active Collectives</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Featured Impact Collectives & Projects
              </h2>
            </div>
            <button
              onClick={onExploreApp}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>View All Projects in App</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INITIAL_PROJECTS.slice(0, 3).map((project) => (
              <div
                key={project.id}
                onClick={onExploreApp}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="h-36 bg-gradient-to-tr from-indigo-900 via-indigo-800 to-slate-900 p-5 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between items-center z-10">
                      <span className="bg-indigo-500/30 text-indigo-100 backdrop-blur-xs text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                        {project.category}
                      </span>
                      <span className="text-[11px] text-slate-300 font-semibold">{project.location}</span>
                    </div>
                    <div className="flex items-center space-x-2.5 z-10">
                      <img
                        src={project.organization.logo}
                        alt={project.organization.name}
                        className="w-8 h-8 rounded-lg bg-white p-0.5 object-cover"
                      />
                      <span className="text-xs font-bold text-white line-clamp-1">{project.organization.name}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2 text-left">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">{project.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{project.tagline || project.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 pt-3">
                    <span>
                      Raised: {formatCurrency(convertCurrency(project.raised, project.currency, selectedCurrency), selectedCurrency)}
                    </span>
                    <span className="text-indigo-600">
                      Target: {formatCurrency(convertCurrency(project.fundingGoal, project.currency, selectedCurrency), selectedCurrency)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Questions & Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-slate-900 hover:text-indigo-600 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {expandedFaq === idx ? (
                    <ChevronUp className="h-5 w-5 text-indigo-600 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 shrink-0 ml-2" />
                  )}
                </button>
                {expandedFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onNavigate={onNavigate} onOpenAuthModal={onOpenAuthModal} />
    </div>
  );
};
