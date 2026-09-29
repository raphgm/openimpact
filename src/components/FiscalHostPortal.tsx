import React, { useState, useMemo } from 'react';
import {
  Building2,
  ShieldCheck,
  DollarSign,
  FileText,
  Users,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  PlusCircle,
  Receipt,
  Search,
  ChevronDown,
  ChevronUp,
  Globe,
  Award,
  Zap,
  Ticket,
  Calendar,
  MapPin,
  X,
  Code2,
  Coins,
  FileCheck,
  Lock
} from 'lucide-react';
import { Collective, Currency, Project, UserProfile } from '../types';
import { FISCAL_HOST_BENCHMARK_INFO, INITIAL_COLLECTIVES } from '../data/mockData';
import { formatCurrency, convertCurrency } from '../utils/formatters';
import { MilestoneEscrowStudio } from './MilestoneEscrowStudio';
import { GlobalSettlementModal } from './GlobalSettlementModal';
import { TransparentLedgerExplorer } from './TransparentLedgerExplorer';
import { ReadmeBadgeGeneratorModal } from './ReadmeBadgeGeneratorModal';

interface FiscalHostPortalProps {
  collectives?: Collective[];
  projects?: Project[];
  selectedCurrency?: Currency;
  formatAmount?: (amount: number, currency?: Currency) => string;
  onSelectProject?: (projectId: string) => void;
  onOpenFundingModal?: (project: Project) => void;
  onOpenSponsorEventModal?: () => void;
  onOpenDocumentTenure?: () => void;
  currentUser?: UserProfile;
}

export const FiscalHostPortal: React.FC<FiscalHostPortalProps> = ({
  collectives: initialCollectives = INITIAL_COLLECTIVES,
  projects = [],
  selectedCurrency = 'USD',
  formatAmount = (amt, curr) => formatCurrency(amt, curr || 'USD'),
  onSelectProject = () => {},
  onOpenFundingModal,
  onOpenSponsorEventModal,
  onOpenDocumentTenure,
  currentUser,
}) => {
  const [collectivesList, setCollectivesList] = useState<Collective[]>(initialCollectives);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Key Differentiator Interactive Modals
  const [showEscrowStudio, setShowEscrowStudio] = useState<boolean>(false);
  const [showGlobalSettlement, setShowGlobalSettlement] = useState<boolean>(false);
  const [showTransparentLedger, setShowTransparentLedger] = useState<boolean>(false);
  const [showReadmeBadges, setShowReadmeBadges] = useState<boolean>(false);
  const [selectedCollectiveForLedger, setSelectedCollectiveForLedger] = useState<Collective | null>(null);
  const [selectedCollectiveForBadges, setSelectedCollectiveForBadges] = useState<Collective | null>(null);

  // Donation Modal State
  const [selectedCollectiveForDonation, setSelectedCollectiveForDonation] = useState<Collective | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('custom');
  const [donationAmount, setDonationAmount] = useState<string>('50');
  const [donationInterval, setDonationInterval] = useState<'one-time' | 'monthly'>('monthly');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donationSuccess, setDonationSuccess] = useState<boolean>(false);

  // Create Collective Modal State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newCollectiveData, setNewCollectiveData] = useState({
    name: '',
    category: 'Open Source Software' as Collective['category'],
    tagline: '',
    description: '',
    githubRepo: '',
    website: '',
    currency: 'USD' as Currency,
    leadMaintainer: '',
    targetBudget: 10000,
  });
  const [createSuccess, setCreateSuccess] = useState<boolean>(false);

  // Submit Expense Modal State
  const [showExpenseModal, setShowExpenseModal] = useState<boolean>(false);
  const [expenseData, setExpenseData] = useState({
    payeeName: '',
    payeeEmail: '',
    amount: '',
    currency: 'USD' as Currency,
    description: '',
    receiptUrl: '',
    proofType: 'GitHub PR Deliverable',
  });
  const [expenseSuccess, setExpenseSuccess] = useState<boolean>(false);

  // Filtered Collectives
  const filteredCollectives = useMemo(() => {
    return collectivesList.filter((col) => {
      const matchesCategory = categoryFilter === 'All' || col.category === categoryFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        col.name.toLowerCase().includes(q) ||
        col.tagline.toLowerCase().includes(q) ||
        col.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [collectivesList, categoryFilter, searchQuery]);

  // Aggregate stats
  const totalRaisedUSD = useMemo(() => {
    return collectivesList.reduce(
      (acc, c) => acc + (c.currency === 'USD' ? c.totalRaised : c.totalRaised / 1500),
      0
    );
  }, [collectivesList]);

  const totalEscrowBalanceUSD = useMemo(() => {
    return collectivesList.reduce(
      (acc, c) => acc + (c.currency === 'USD' ? c.balance : c.balance / 1500),
      0
    );
  }, [collectivesList]);

  const totalBackers = useMemo(() => {
    return collectivesList.reduce((acc, c) => acc + c.backersCount, 0);
  }, [collectivesList]);

  // Handle donation submit
  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollectiveForDonation) return;

    const amt = parseFloat(donationAmount) || 25;

    setCollectivesList((prev) =>
      prev.map((col) =>
        col.id === selectedCollectiveForDonation.id
          ? {
              ...col,
              balance: col.balance + amt,
              totalRaised: col.totalRaised + amt,
              backersCount: col.backersCount + 1,
            }
          : col
      )
    );

    setDonationSuccess(true);
    setTimeout(() => {
      setDonationSuccess(false);
      setSelectedCollectiveForDonation(null);
      setDonorName('');
      setDonorEmail('');
      setDonationAmount('50');
    }, 2000);
  };

  // Handle create collective submit
  const handleCreateCollective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectiveData.name.trim()) return;

    const newCol: Collective = {
      id: `coll_${Date.now()}`,
      name: newCollectiveData.name,
      slug: newCollectiveData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category: newCollectiveData.category,
      logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80',
      tagline: newCollectiveData.tagline || 'Open-source community project.',
      description: newCollectiveData.description || 'Transparent collective managed under 501(c)(6) fiscal hosting.',
      githubRepo: newCollectiveData.githubRepo || undefined,
      website: newCollectiveData.website || undefined,
      hostName: FISCAL_HOST_BENCHMARK_INFO.name,
      balance: 0,
      currency: newCollectiveData.currency,
      totalRaised: 0,
      totalSpent: 0,
      backersCount: 0,
      sponsorsCount: 0,
      maintainers: [
        {
          name: newCollectiveData.leadMaintainer || 'Maintainer',
          avatar: '/skillschlogo.svg',
          role: 'Lead Maintainer',
        },
      ],
      sponsorTiers: [
        {
          id: `tier_1_${Date.now()}`,
          name: 'Individual Backer',
          amount: newCollectiveData.currency === 'USD' ? 10 : 5000,
          currency: newCollectiveData.currency,
          interval: 'monthly',
          perks: ['Public Backer Badge', 'Community Updates'],
          sponsorsCount: 0,
        },
        {
          id: `tier_2_${Date.now()}`,
          name: 'Sustaining Sponsor',
          amount: newCollectiveData.currency === 'USD' ? 100 : 50000,
          currency: newCollectiveData.currency,
          interval: 'monthly',
          perks: ['Logo on Documentation', 'Quarterly Briefing'],
          sponsorsCount: 0,
        },
      ],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCollectivesList((prev) => [newCol, ...prev]);
    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setShowCreateModal(false);
      setNewCollectiveData({
        name: '',
        category: 'Open Source Software',
        tagline: '',
        description: '',
        githubRepo: '',
        website: '',
        currency: 'USD',
        leadMaintainer: '',
        targetBudget: 10000,
      });
    }, 1800);
  };

  // Handle expense submit
  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setExpenseSuccess(true);
    setTimeout(() => {
      setExpenseSuccess(false);
      setShowExpenseModal(false);
      setExpenseData({
        payeeName: '',
        payeeEmail: '',
        amount: '',
        currency: 'USD',
        description: '',
        receiptUrl: '',
        proofType: 'GitHub PR Deliverable',
      });
    }, 1800);
  };

  const faqs = [
    {
      q: 'What is a Non-Profit Fiscal Host?',
      a: 'A fiscal host provides a registered 501(c)(6) non-profit legal and financial home for open-source software, developer conferences, civic technology, and grassroots communities. You can accept tax-deductible grants, sponsorships, and ticket sales without incorporating a company or setting up a corporate bank account.',
    },
    {
      q: 'How does OpenImpact prevent waste and fund diversion?',
      a: 'All funds raised are held in ring-fenced escrow accounts under the fiscal host. Disbursements only happen when maintainers or event organizers submit itemized vendor invoices, verified receipts, or completed GitHub pull requests that pass community peer audit. Every single transaction is published transparently on the collective’s ledger.',
    },
    {
      q: 'How do event organizers and summits use fiscal hosting?',
      a: 'Conference organizers (e.g. OSCA, PyCon, DevFests, Hackathons) use OpenImpact to collect ticket revenue and corporate sponsorships from partners like Google and AWS. Sponsorship funds sit in escrow and are disbursed directly to pay venue deposits, catering invoices, AV equipment, and speaker travel grants upon receipt verification.',
    },
    {
      q: 'How do donors and sponsors get tax receipts?',
      a: 'Because OpenImpact operates under a verified 501(c)(6) non-profit structure, all individual donors and corporate sponsors automatically receive formal tax receipts and grant clearance certificates for their accounting and deduction filings.',
    },
    {
      q: 'What are the fees for fiscal hosting?',
      a: 'We charge a flat, transparent 5% fiscal hosting fee on incoming funds to cover banking custody, legal compliance, annual audits, and tax filings (1099-NEC / W-8BEN / W-9 handling). There are zero hidden monthly charges.',
    },
    {
      q: 'How do maintainers and vendors receive payouts?',
      a: 'Maintainers submit expense claims with supporting documentation (invoices, receipts, or merged PRs). Once verified, payouts are processed directly via Wise (global bank transfer), ACH, or PayPal in over 120 countries.',
    },
  ];

  const categories = ['All', 'Open Source Software', 'Education', 'Civic Tech'];

  return (
    <div className="space-y-16 pb-20 font-sans text-slate-900 bg-white">
      {/* 1. HERO SECTION (Identical visual language to ProjectList.tsx) */}
      <section className="relative pt-12 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 z-10 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-bold shadow-xs">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            <span>501(c)(6) Non-Profit Fiscal Sponsorship</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Fiscal Hosting &<br />
            <span className="text-indigo-800">Collectives Vault</span>
          </h1>

          <p className="text-base text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
            Enable your open-source community, developer summit, or civic project to accept grants, sell tickets, and receive corporate sponsorships without legal bureaucracy. Milestone escrow guarantees zero blind spending.
          </p>

          {/* Quick Action CTA Buttons */}
          <div className="pt-2 flex items-center justify-center lg:justify-start gap-2.5 flex-nowrap overflow-x-auto no-scrollbar pb-1">
            {onOpenDocumentTenure && (
              <button
                type="button"
                onClick={onOpenDocumentTenure}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm px-4 sm:px-5 py-3 rounded-full transition shadow-md cursor-pointer flex items-center space-x-2 shrink-0 whitespace-nowrap"
              >
                <Award className="h-4 w-4 text-slate-950 shrink-0" />
                <span>Document Community Lead Tenure</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-3 rounded-full transition shadow-md cursor-pointer flex items-center space-x-2 shrink-0 whitespace-nowrap"
            >
              <PlusCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Request Funds / New Collective</span>
            </button>

            {onOpenSponsorEventModal && (
              <button
                type="button"
                onClick={onOpenSponsorEventModal}
                className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-bold text-xs sm:text-sm px-4 sm:px-5 py-3 rounded-full transition cursor-pointer flex items-center space-x-2 shadow-xs shrink-0 whitespace-nowrap"
              >
                <Ticket className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>Host / Sponsor Event</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowExpenseModal(true)}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs sm:text-sm px-4 sm:px-5 py-3 rounded-full transition cursor-pointer flex items-center space-x-2 shadow-xs shrink-0 whitespace-nowrap"
            >
              <Receipt className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Submit Expense Claim</span>
            </button>
          </div>
        </div>

        {/* Hero Graphic Element (matching ProjectList.tsx) */}
        <div className="flex-1 relative w-full h-[400px] flex items-center justify-center hidden md:flex">
          <div className="absolute w-64 h-64 bg-indigo-200 rounded-[3rem] rotate-12 opacity-80 blur-xl right-10 top-10 mix-blend-multiply animate-pulse" />
          <div className="absolute w-72 h-72 bg-blue-200 rounded-[4rem] -rotate-12 opacity-70 blur-2xl right-32 top-0 mix-blend-multiply" />
          <div className="absolute w-48 h-64 bg-gradient-to-tr from-indigo-400 to-blue-400 rounded-[2rem] shadow-2xl right-40 top-10 transform -rotate-12 transition-all duration-700 hover:scale-110 hover:rotate-3 cursor-pointer" />
          <div className="absolute w-56 h-56 bg-gradient-to-bl from-blue-500 to-cyan-500 rounded-[2.5rem] shadow-2xl right-10 top-24 transform rotate-6 transition-all duration-700 hover:scale-110 hover:-rotate-6 cursor-pointer" />
        </div>
      </section>

      {/* 2. HERO STATS (Matching ProjectList.tsx) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-slate-100 shadow-sm rounded-3xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 font-mono">{collectivesList.length}</div>
              <div className="text-xs text-slate-500 font-bold">Hosted Collectives</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 font-mono">${(totalRaisedUSD / 1000).toFixed(1)}k+</div>
              <div className="text-xs text-slate-500 font-bold">Vetted Capital</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-black text-purple-700 font-mono">{totalBackers.toLocaleString()}+</div>
              <div className="text-xs text-slate-500 font-bold">Active Sponsors</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 font-mono">100%</div>
              <div className="text-xs text-slate-500 font-bold">Escrow Protected</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SETTLEMENT & ESCROW CONTROL BAR (Public Transparency + Admin/Maintainer Guarded Rails) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111827] text-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-800/80 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-5 overflow-hidden">
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className="relative flex items-center justify-center shrink-0">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="w-2.5 h-2.5 rounded-full absolute bg-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm font-black tracking-wide text-emerald-400">
                  501(c)(6) Trust & Settlement Engines Active
                </span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold shrink-0">
                  Public Transparency
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium truncate mt-0.5 max-w-xl">
                Real-time open balances & milestone proofs are public. Withdrawals require verified maintainer/admin multi-sig.
              </p>
            </div>
          </div>

          {/* Quick Engine Launchers - Public Audits + Admin-Guarded Payouts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full xl:w-auto xl:flex xl:items-center shrink-0">
            {/* Public Community Audit */}
            <button
              type="button"
              onClick={() => setShowEscrowStudio(true)}
              className="px-3.5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-emerald-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700/80 transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-xs whitespace-nowrap"
              title="Inspect milestone escrow vaults and linked GitHub deliverable proofs (Open to all)"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Escrow Studio</span>
              <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded uppercase ml-1">
                Public
              </span>
            </button>

            {/* Public Ledger */}
            <button
              type="button"
              onClick={() => {
                setSelectedCollectiveForLedger(collectivesList[0]);
                setShowTransparentLedger(true);
              }}
              className="px-3.5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700/80 transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-xs whitespace-nowrap"
              title="View all incoming donations and verified expense receipts (100% Public)"
            >
              <FileText className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span>Public Ledger</span>
              <span className="text-[9px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded uppercase ml-1">
                Public
              </span>
            </button>

            {/* Maintainer / Admin Protected Withdrawal Rail */}
            <button
              type="button"
              onClick={() => setShowGlobalSettlement(true)}
              className="px-3.5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700/80 transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-xs whitespace-nowrap"
              title="Disburse approved funds into IBAN, Wise, or USDC (Maintainers & Fiscal Host Admins)"
            >
              <Lock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>Multi-Rail Payouts</span>
              <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold uppercase ml-1">
                Admin
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. EXPLORER / TOOLBAR (Matching ProjectList.tsx) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between mb-8">
          <div className="lg:w-1/3 space-y-2 text-left">
            <div className="text-xs font-bold text-indigo-600 tracking-wide uppercase">Open Directory</div>
            <h2 className="text-2xl font-black text-slate-900">Explore Hosted Collectives</h2>
            <p className="text-xs text-slate-500 font-medium">
              Support verified open-source software, conferences, and community initiatives.
            </p>

            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center space-x-1.5 shadow-2xs"
              >
                <PlusCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>+ New Collective</span>
              </button>
              {onOpenSponsorEventModal && (
                <button
                  type="button"
                  onClick={onOpenSponsorEventModal}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold rounded-lg transition cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                >
                  <Ticket className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Event Hub</span>
                </button>
              )}
            </div>
          </div>

          <div className="lg:w-2/3 flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full justify-end">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xs">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search collectives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Category Buttons */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
                    categoryFilter === cat
                      ? 'bg-[#111827] text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. COLLECTIVES GRID (Matching ProjectList.tsx card archetype) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredCollectives.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 font-medium text-sm">No collectives match your filter parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollectives.map((collective) => {
              const progressPercent = Math.min(
                100,
                Math.round((collective.totalSpent / (collective.totalRaised || 1)) * 100)
              );

              return (
                <div
                  key={collective.id}
                  className="bg-white border border-slate-100 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md group text-left"
                >
                  <div>
                    {/* Category & Status Header */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-100">
                          {collective.category}
                        </span>
                        {collective.isSample && (
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full text-[10px] font-extrabold uppercase tracking-wider border border-amber-200">
                            Sample
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <ShieldCheck className="h-3 w-3 text-emerald-600" />
                        <span>501(c)(6) Vetted</span>
                      </span>
                    </div>

                    {/* Logo & Name */}
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={collective.logo}
                        alt={collective.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-xs shrink-0"
                      />
                      <div>
                        <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                          {collective.name}
                        </h3>
                        <div className="text-[11px] text-slate-400 font-medium">
                          Lead: <strong className="text-slate-700">{collective.maintainers[0]?.name || 'Maintainer'}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Tagline */}
                    <p className="text-xs text-slate-600 font-medium leading-relaxed mb-5 line-clamp-2">
                      {collective.tagline}
                    </p>

                    {/* Financial Progress & Metrics */}
                    <div className="space-y-3 pt-3 border-t border-slate-100 mb-5">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-bold text-slate-900 font-mono">
                          {collective.currency === 'USD'
                            ? `$${collective.totalRaised.toLocaleString()}`
                            : `₦${collective.totalRaised.toLocaleString()}`}
                          <span className="text-[10px] text-slate-400 font-sans font-medium ml-1">raised</span>
                        </span>
                        <span className="font-bold text-emerald-700 font-mono text-[11px]">
                          {collective.currency === 'USD'
                            ? `$${collective.balance.toLocaleString()}`
                            : `₦${collective.balance.toLocaleString()}`}
                          <span className="text-[10px] text-slate-400 font-sans font-medium ml-1">in escrow</span>
                        </span>
                      </div>

                      {/* Clean Progress Bar */}
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(12, progressPercent)}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                        <span>{collective.backersCount} Backers</span>
                        <span>{collective.sponsorsCount} Sponsors</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="space-y-2.5 pt-2">
                    {/* Quick Tools Row */}
                    <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={() => setShowEscrowStudio(true)}
                        className="py-1.5 px-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-xl border border-slate-200 hover:border-emerald-200 transition font-bold flex items-center justify-center gap-1 cursor-pointer"
                        title="Audit Escrow Vault"
                      >
                        <ShieldCheck className="h-3 w-3 text-emerald-600" />
                        <span>Escrow</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCollectiveForLedger(collective);
                          setShowTransparentLedger(true);
                        }}
                        className="py-1.5 px-2 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 rounded-xl border border-slate-200 hover:border-indigo-200 transition font-bold flex items-center justify-center gap-1 cursor-pointer"
                        title="Open Financial Ledger"
                      >
                        <FileText className="h-3 w-3 text-indigo-600" />
                        <span>Ledger</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCollectiveForBadges(collective);
                          setShowReadmeBadges(true);
                        }}
                        className="py-1.5 px-2 bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 rounded-xl border border-slate-200 hover:border-amber-200 transition font-bold flex items-center justify-center gap-1 cursor-pointer"
                        title="Get README Badges"
                      >
                        <Code2 className="h-3 w-3 text-amber-600" />
                        <span>Badges</span>
                      </button>
                    </div>

                    {/* Primary Support Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCollectiveForDonation(collective);
                        setDonationAmount(collective.currency === 'USD' ? '50' : '25000');
                        setSelectedTier('custom');
                      }}
                      className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-full shadow-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Donate / Sponsor Collective</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 6. WHY OPENIMPACT FISCAL HOSTING? (4 Clean Pillars matching app's card design) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Trust & Governance Infrastructure
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How OpenImpact Fiscal Hosting Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Everything your community or developer conference needs to accept capital, reimburse maintainers, and guarantee non-profit tax exemptions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition space-y-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-black text-slate-900">501(c)(6) Legal Umbrella</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Launch your collective or summit under our registered non-profit umbrella with zero legal setup hassle, corporate filings, or separate bank accounts.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition space-y-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-black text-slate-900">Anti-Diversion Escrow</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Capital is held in ring-fenced escrow. Payouts require peer-audited PRs, venue contracts, or verified itemized receipts before release.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition space-y-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-base font-black text-slate-900">100% Transparent Ledger</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Every dollar received and spent is published publicly on an unalterable ledger with verifiable links to invoices, receipts, and contributors.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition space-y-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-base font-black text-slate-900">Global Multi-Rail Payouts</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Pay contributors and vendors worldwide via Wise, ACH, or USDC with automated 1099-NEC, W-8BEN, and W-9 tax compliance handling.
            </p>
          </div>
        </div>
      </section>

      {/* 7. EVENTS & SUMMITS SPOTLIGHT (Clean & unified) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-indigo-300">
              <Ticket className="h-3.5 w-3.5 text-amber-400" />
              <span>Conferences, Hackathons & Summits</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Host Your Developer Conference Under 501(c)(6)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Host events like OSCA, PyCon, or local DevFests. Lock hackathon prize bounties into milestone escrow, collect corporate sponsorships with tax receipts, and pay venue deposits upon invoice verification.
            </p>
            <div className="pt-2 flex flex-row items-center flex-nowrap gap-3 overflow-x-auto pb-1">
              {onOpenSponsorEventModal && (
                <button
                  type="button"
                  onClick={onOpenSponsorEventModal}
                  className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs rounded-full transition shadow-sm cursor-pointer flex items-center space-x-2 whitespace-nowrap shrink-0"
                >
                  <Ticket className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>Browse & Sponsor Events</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-full transition cursor-pointer whitespace-nowrap shrink-0"
              >
                Host Your Event Under 501(c)(6)
              </button>
            </div>
          </div>

          {/* Featured Event Card */}
          <div className="w-full lg:w-80 bg-slate-800/80 border border-slate-700 p-5 rounded-2xl space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Featured Summit
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                Escrow Active
              </span>
            </div>
            <div className="space-y-1">
              <div className="font-black text-white text-sm">Global Open Source Festival 2026</div>
              <div className="text-slate-400 text-[11px] flex items-center gap-2">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Geneva & Virtual</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> 2,500+ Attendees</span>
              </div>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl space-y-1 font-mono text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>Hackathon Prize Pool:</span>
                <span className="font-bold text-amber-300">$10,000 USDC</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Venue Deposit:</span>
                <span className="font-bold text-emerald-300">Verified & Released</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION (Clean and simple) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Questions & Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden transition shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-slate-900 text-sm flex items-center justify-between hover:text-indigo-600 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-indigo-600 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== MODALS ===================== */}

      {/* MODAL 1: DONATE / SPONSOR COLLECTIVE */}
      {selectedCollectiveForDonation && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-left max-h-[calc(100dvh-2rem)] overflow-y-auto my-auto">
            <button
              type="button"
              onClick={() => setSelectedCollectiveForDonation(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {donationSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Thank You For Your Support!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your funds have been deposited directly into the vetted 501(c)(6) escrow vault for{' '}
                  <strong>{selectedCollectiveForDonation.name}</strong>. A tax receipt has been generated.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDonationSubmit} className="space-y-5">
                <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
                  <img
                    src={selectedCollectiveForDonation.logo}
                    alt={selectedCollectiveForDonation.name}
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-100"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Sponsor {selectedCollectiveForDonation.name}
                    </h3>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      501(c)(6) Tax-Deductible Escrow
                    </p>
                  </div>
                </div>

                {/* Interval Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-full">
                  <button
                    type="button"
                    onClick={() => setDonationInterval('monthly')}
                    className={`flex-1 py-2 text-xs font-bold rounded-full transition cursor-pointer ${
                      donationInterval === 'monthly'
                        ? 'bg-slate-950 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Monthly Sustaining
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationInterval('one-time')}
                    className={`flex-1 py-2 text-xs font-bold rounded-full transition cursor-pointer ${
                      donationInterval === 'one-time'
                        ? 'bg-slate-950 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    One-Time Gift
                  </button>
                </div>

                {/* Sponsor Tiers if available */}
                {selectedCollectiveForDonation.sponsorTiers &&
                  selectedCollectiveForDonation.sponsorTiers.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">
                        Select a Sponsorship Tier
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedCollectiveForDonation.sponsorTiers.map((tier) => (
                          <div
                            key={tier.id}
                            onClick={() => {
                              setSelectedTier(tier.id);
                              setDonationAmount(tier.amount.toString());
                            }}
                            className={`p-3 rounded-2xl border text-xs cursor-pointer transition ${
                              selectedTier === tier.id
                                ? 'border-slate-900 bg-slate-50 font-bold ring-2 ring-indigo-400/40'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="font-bold text-slate-900">{tier.name}</div>
                            <div className="text-indigo-700 font-black font-mono">
                              {tier.currency === 'USD' ? `$${tier.amount}` : `₦${tier.amount.toLocaleString()}`}
                              <span className="text-[10px] text-slate-400 font-normal">/mo</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Custom Amount */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Amount ({selectedCollectiveForDonation.currency})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                      {selectedCollectiveForDonation.currency === 'USD' ? '$' : '₦'}
                    </span>
                    <input
                      type="number"
                      required
                      min="1"
                      value={donationAmount}
                      onChange={(e) => {
                        setSelectedTier('custom');
                        setDonationAmount(e.target.value);
                      }}
                      className="w-full pl-8 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Donor Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Your Name / Org
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Corp"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Tax Receipt Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tax@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-[11px] text-emerald-900">
                  <ShieldCheck className="h-4 w-4 inline mr-1 text-emerald-600" />
                  <strong>100% Escrow Guarantee:</strong> Funds cannot be withdrawn without milestone verification and peer sign-off.
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-full shadow-md transition cursor-pointer"
                >
                  Complete {donationInterval === 'monthly' ? 'Monthly' : 'One-Time'} Donation of{' '}
                  {selectedCollectiveForDonation.currency === 'USD' ? `$${donationAmount}` : `₦${donationAmount}`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: REQUEST FUNDS / CREATE COLLECTIVE */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[calc(100dvh-2rem)] overflow-y-auto text-left my-auto">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {createSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Collective Launched!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your collective is now registered under OpenImpact 501(c)(6) fiscal hosting. You can now accept donations and publish milestone budget requests.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateCollective} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    Community Application
                  </span>
                  <h3 className="text-xl font-black text-slate-900">
                    Request Funds for Your Community or Summit
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Host your open source collective or conference with transparent accounting and tax exemptions.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Collective or Event Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. West Africa Open Hardware Collective"
                    value={newCollectiveData.name}
                    onChange={(e) =>
                      setNewCollectiveData({ ...newCollectiveData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Category *
                    </label>
                    <select
                      value={newCollectiveData.category}
                      onChange={(e) =>
                        setNewCollectiveData({
                          ...newCollectiveData,
                          category: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="Open Source Software">Open Source Software</option>
                      <option value="Education">Education</option>
                      <option value="Civic Tech">Civic Tech</option>
                      <option value="Climate Tech">Climate Tech</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Currency *
                    </label>
                    <select
                      value={newCollectiveData.currency}
                      onChange={(e) =>
                        setNewCollectiveData({
                          ...newCollectiveData,
                          currency: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="NGN">NGN (₦)</option>
                      <option value="KES">KES (KSh)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Tagline (One-sentence summary)
                  </label>
                  <input
                    type="text"
                    placeholder="Building solar-powered IoT sensor firmware for rural water pumps."
                    value={newCollectiveData.tagline}
                    onChange={(e) =>
                      setNewCollectiveData({ ...newCollectiveData, tagline: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Lead Organizer / Maintainer
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={newCollectiveData.leadMaintainer}
                      onChange={(e) =>
                        setNewCollectiveData({
                          ...newCollectiveData,
                          leadMaintainer: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Repository / Docs (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={newCollectiveData.githubRepo}
                      onChange={(e) =>
                        setNewCollectiveData({
                          ...newCollectiveData,
                          githubRepo: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-full shadow-md transition cursor-pointer mt-2"
                >
                  Publish Collective & Enable Donations
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: SUBMIT EXPENSE CLAIM */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[calc(100dvh-2rem)] overflow-y-auto text-left my-auto">
            <button
              type="button"
              onClick={() => setShowExpenseModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {expenseSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Expense Claim Submitted!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your expense has entered the fiscal host review queue. Once milestone proof and receipts are verified, payout is released directly to your account.
                </p>
              </div>
            ) : (
              <form onSubmit={handleExpenseSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    Maintainer Payout & Reimbursement
                  </span>
                  <h3 className="text-xl font-black text-slate-900">
                    Submit Expense Claim
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    All disbursements require verified receipts or peer-audited GitHub PR milestones.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Payee Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Julian O'Connor"
                      value={expenseData.payeeName}
                      onChange={(e) =>
                        setExpenseData({ ...expenseData, payeeName: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Payout Email / Wise ID *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="payout@example.com"
                      value={expenseData.payeeEmail}
                      onChange={(e) =>
                        setExpenseData({ ...expenseData, payeeEmail: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Amount Requested *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="1200"
                      value={expenseData.amount}
                      onChange={(e) =>
                        setExpenseData({ ...expenseData, amount: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Verification Proof Type *
                    </label>
                    <select
                      value={expenseData.proofType}
                      onChange={(e) =>
                        setExpenseData({ ...expenseData, proofType: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="GitHub PR Deliverable">GitHub PR Deliverable</option>
                      <option value="Hardware / Server Invoice">Hardware / Server Invoice</option>
                      <option value="Contractor Timesheet">Contractor Timesheet</option>
                      <option value="Community Event Receipt">Community Event Receipt</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Deliverable / Invoice Proof URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/.../pull/12 or receipt PDF URL"
                    value={expenseData.receiptUrl}
                    onChange={(e) =>
                      setExpenseData({ ...expenseData, receiptUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Description of Work
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Summary of milestone deliverable completed..."
                    value={expenseData.description}
                    onChange={(e) =>
                      setExpenseData({ ...expenseData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-[11px] text-indigo-900">
                  <ShieldCheck className="h-4 w-4 inline mr-1 text-indigo-600" />
                  <strong>Multi-Sig Verification:</strong> Expenses are vetted and signed off by community auditors prior to disbursement.
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-full shadow-md transition cursor-pointer"
                >
                  Submit Expense for Fiscal Audit
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MILESTONE ESCROW STUDIO MODAL OVERLAY */}
      {showEscrowStudio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto font-sans">
          <div className="relative w-full max-w-4xl my-auto">
            <MilestoneEscrowStudio
              currency={selectedCurrency}
              onClose={() => setShowEscrowStudio(false)}
              onOpenPayoutModal={() => {
                setShowEscrowStudio(false);
                setShowGlobalSettlement(true);
              }}
            />
          </div>
        </div>
      )}

      {/* TRANSPARENT FINANCIAL LEDGER MODAL OVERLAY */}
      {showTransparentLedger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto font-sans">
          <div className="relative w-full max-w-4xl my-auto space-y-3">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowTransparentLedger(false);
                  setSelectedCollectiveForLedger(null);
                }}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
              >
                <X className="h-4 w-4" />
                <span>Close Ledger</span>
              </button>
            </div>
            <TransparentLedgerExplorer
              collectiveName={selectedCollectiveForLedger?.name || 'FastAPI Open Collective'}
              currency={selectedCurrency}
            />
          </div>
        </div>
      )}

      {/* GLOBAL SETTLEMENT PAYOUT MODAL */}
      <GlobalSettlementModal
        isOpen={showGlobalSettlement}
        onClose={() => setShowGlobalSettlement(false)}
        availableBalance={15750}
        currency={selectedCurrency}
        currentUser={currentUser}
        onSuccessPayout={(amt, rail) => {
          console.log('Payout executed:', amt, rail);
        }}
      />

      {/* GITHUB README BADGE GENERATOR MODAL */}
      <ReadmeBadgeGeneratorModal
        isOpen={showReadmeBadges}
        onClose={() => {
          setShowReadmeBadges(false);
          setSelectedCollectiveForBadges(null);
        }}
        collective={selectedCollectiveForBadges || collectivesList[0]}
      />
    </div>
  );
};
