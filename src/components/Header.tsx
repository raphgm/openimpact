import React from 'react';
import {
  Globe,
  PlusCircle,
  Search,
  ShieldCheck,
  Briefcase,
  Layers,
  Award,
  BarChart3,
  User,
  Sparkles,
  Building2,
  Info,
  HelpCircle,
  Zap,
  Home,
  Ticket,
} from 'lucide-react';
import { Currency, UserProfile } from '../types';
import { CURRENCY_RATES } from '../data/mockData';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentUser: UserProfile;
  isLoggedIn: boolean;
  onLogout: () => void;
  onOpenCreateProject: () => void;
  onOpenAiAdvisor: () => void;
  onOpenAuthModal: (mode?: 'select' | 'organization' | 'collective' | 'individual' | 'login') => void;
  onGoToLanding: () => void;
  onOpenSponsorEventModal?: () => void;
  onOpenProofVerification?: () => void;
  onOpenDocumentTenure?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCurrency,
  setSelectedCurrency,
  searchQuery,
  setSearchQuery,
  currentUser,
  isLoggedIn,
  onLogout,
  onOpenCreateProject,
  onOpenAiAdvisor,
  onOpenAuthModal,
  onGoToLanding,
  onOpenSponsorEventModal,
  onOpenProofVerification,
  onOpenDocumentTenure,
  onOpenCommandPalette,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white text-slate-900 border-b border-slate-200 shadow-sm">
      {/* Top Main Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand logo & Tagline */}
        <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => setActiveTab('home')}>
          <div className="logo-mark relative w-10 h-10">
            <span className="logo-shape logo-blue absolute w-[22px] h-[36px] rounded-[14px_14px_14px_3px] rotate-[-28deg] left-[15px] top-[1px] bg-gradient-to-br from-indigo-600 to-purple-600" />
            <span className="logo-shape logo-green absolute w-[22px] h-[36px] rounded-[14px_14px_14px_3px] rotate-[-28deg] left-[4px] top-[3px] bg-gradient-to-br from-emerald-500 to-teal-500 opacity-95" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-slate-900 block leading-tight">Open Impact</span>
            <p className="text-xs text-indigo-600 font-semibold tracking-wide">Measure · Verify · Prove Impact</p>
          </div>
        </div>

        {/* Right Controls: Proof Certificate, AI Advisor, Auth, Create Project */}
        <div className="flex items-center space-x-2.5">
          {/* Proof Certificate Quick Button */}
          {onOpenProofVerification && (
            <button
              onClick={onOpenProofVerification}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer shadow-2xs"
              title="Official Proof of Contribution Certificate Generator"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Proof Certificate</span>
            </button>
          )}

          {/* AI Advisor Button */}
          <button
            onClick={onOpenAiAdvisor}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold hover:bg-indigo-100 transition cursor-pointer"
            title="OpenImpact AI Reviewer & Matcher"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>AI Reviewer</span>
          </button>

          {/* Auth Action Buttons */}
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => onOpenAuthModal('select')}
                className="hidden sm:inline-flex bg-[#0B1E48] hover:bg-slate-900 text-white font-bold text-xs px-3.5 py-1.5 rounded-full transition shadow-xs cursor-pointer"
              >
                Sign Up
              </button>
              <button
                onClick={() => onOpenAuthModal('login')}
                className="hidden sm:inline-flex bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs px-3.5 py-1.5 rounded-full transition cursor-pointer"
              >
                Log In
              </button>
            </>
          ) : (
            <button
              onClick={onLogout}
              className="hidden sm:inline-flex bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-200 transition cursor-pointer"
            >
              Log Out
            </button>
          )}

          {/* Create Project CTA (Requires auth) */}
          <button
            onClick={() => {
              if (!isLoggedIn) {
                onOpenAuthModal('select');
              } else {
                onOpenCreateProject();
              }
            }}
            className="bg-gradient-to-r from-[#8B5CF6] to-[#10B981] hover:opacity-95 text-white font-black text-xs px-4 py-2 rounded-xl transition shadow-md flex items-center space-x-1.5 cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Start Project</span>
          </button>
        </div>
      </div>

      {/* Sub-Bar: Search Bar & Currency Switcher Below Header */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Search Bar with Command K shortcut */}
        <div className="flex-1 max-w-2xl">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search projects, bounties, grants, or skills (Press ⌘K)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={() => {
                if (onOpenCommandPalette && !searchQuery) {
                  onOpenCommandPalette();
                }
              }}
              className="w-full bg-white text-slate-900 text-xs sm:text-sm pl-10 pr-14 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition shadow-2xs"
            />
            {onOpenCommandPalette && (
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="absolute right-2.5 top-2 px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-mono font-bold flex items-center gap-0.5 cursor-pointer transition border border-slate-200"
                title="Press Cmd+K or Ctrl+K to search"
              >
                <span>⌘K</span>
              </button>
            )}
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center space-x-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
          <Globe className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Currency:</span>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
            className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer py-0.5 pr-1"
          >
            {CURRENCY_RATES.map((c) => (
              <option key={c.code} value={c.code} className="bg-white text-slate-900">
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 flex space-x-1 overflow-x-auto no-scrollbar">
        {/* OPENIMPACT / Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex items-center space-x-1.5 py-3 px-3.5 text-xs transition whitespace-nowrap cursor-pointer rounded-t-lg ${
            activeTab === 'home'
              ? 'border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50/80 font-bold'
              : 'border-b-2 border-transparent text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-50'
          }`}
        >
          <Home className="h-4 w-4 text-indigo-600" />
          <span>OPENIMPACT</span>
        </button>

        {/* Impact Repositories (formerly Projects) */}
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center space-x-1.5 py-3 px-3.5 text-xs transition whitespace-nowrap cursor-pointer rounded-t-lg ${
            activeTab === 'projects'
              ? 'border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50/80 font-bold'
              : 'border-b-2 border-transparent text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-50'
          }`}
        >
          <Layers className="h-4 w-4 text-indigo-600" />
          <span>Impact Repositories</span>
        </button>

        {/* Evidence & Verification (formerly OpenProof) */}
        <button
          onClick={() => setActiveTab('verification')}
          className={`flex items-center space-x-1.5 py-3 px-3.5 text-xs transition whitespace-nowrap cursor-pointer rounded-t-lg ${
            activeTab === 'verification'
              ? 'border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50/80 font-bold'
              : 'border-b-2 border-transparent text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-indigo-600" />
          <span>Evidence & Verification</span>
        </button>

        {/* Impact Ledger (formerly Grants/Fiscal) */}
        <button
          onClick={() => setActiveTab('grants')}
          className={`flex items-center space-x-1.5 py-3 px-3.5 text-xs transition whitespace-nowrap cursor-pointer rounded-t-lg ${
            activeTab === 'grants'
              ? 'border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50/80 font-bold'
              : 'border-b-2 border-transparent text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-50'
          }`}
        >
          <Building2 className="h-4 w-4 text-indigo-600" />
          <span>Impact Ledger</span>
        </button>

        {/* Impact Profiles (formerly Talent/Leaderboard) */}
        <button
          onClick={() => setActiveTab('talent')}
          className={`flex items-center space-x-1.5 py-3 px-3.5 text-xs transition whitespace-nowrap cursor-pointer rounded-t-lg ${
            activeTab === 'talent'
              ? 'border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50/80 font-bold'
              : 'border-b-2 border-transparent text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-50'
          }`}
        >
          <User className="h-4 w-4 text-indigo-600" />
          <span>Impact Profiles</span>
        </button>

        {/* Opportunities / Bounties */}
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`flex items-center space-x-1.5 py-3 px-3.5 text-xs transition whitespace-nowrap cursor-pointer rounded-t-lg ${
            activeTab === 'opportunities'
              ? 'border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50/80 font-bold'
              : 'border-b-2 border-transparent text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-50'
          }`}
        >
          <Briefcase className="h-4 w-4 text-indigo-600" />
          <span>Opportunities</span>
        </button>

        {/* About / Manifesto */}
        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center space-x-1.5 py-3 px-3.5 text-xs transition whitespace-nowrap cursor-pointer rounded-t-lg ${
            activeTab === 'about'
              ? 'border-b-2 border-indigo-600 text-indigo-700 bg-indigo-50/80 font-bold'
              : 'border-b-2 border-transparent text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-50'
          }`}
        >
          <Info className="h-4 w-4 text-indigo-600" />
          <span>About</span>
        </button>

      </nav>
    </header>
  );
};

