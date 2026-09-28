import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Shield, Users, TrendingUp, Heart } from 'lucide-react';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernHeader } from '@/components/ui/ModernHeader';
import { Footer } from '@/components/Footer';
import { Currency, Project } from '@/types';

interface LandingPageModernProps {
  onExploreApp: () => void;
  onOpenAuthModal: (mode?: 'select' | 'organization' | 'collective' | 'individual' | 'login') => void;
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  onNavigateTab?: (tab: string) => void;
}

export const LandingPageModern: React.FC<LandingPageModernProps> = ({
  onExploreApp,
  onOpenAuthModal,
  selectedCurrency,
  setSelectedCurrency,
  onNavigateTab,
}) => {
  const navLinks = [
    { label: 'Projects', onClick: () => onNavigateTab ? onNavigateTab('projects') : onExploreApp() },
    { label: 'Verification', onClick: () => onNavigateTab ? onNavigateTab('verification') : {} },
    { label: 'Leaderboard', onClick: () => onNavigateTab ? onNavigateTab('talent') : {} },
    { label: 'Fiscal Host', onClick: () => onNavigateTab ? onNavigateTab('fiscal') : {} },
  ];

  const cards = [
    {
      label: 'Core Engine',
      labelColor: '#183b78',
      title: 'Impact Repositories',
      description: 'The central workspace for your initiative. Track objectives, events, milestones, and funding in one verifiable source of truth.',
      button: 'Explore repositories',
      bgClass: 'bg-gradient-to-br from-blue-50/80 via-white to-blue-100/50 border-blue-100/80',
      badgeClass: 'bg-blue-100 text-blue-800',
      buttonClass: 'bg-slate-900 hover:bg-slate-800 text-white',
      features: ['Milestone tracking', 'GitHub integration', 'Planned vs Actual'],
      visualType: 'orange-squares',
      action: () => onNavigateTab ? onNavigateTab('projects') : onExploreApp(),
    },
    {
      label: 'Accountability',
      labelColor: '#159a7c',
      title: 'Evidence & Verification',
      description: "Don't just claim impact—prove it. Upload receipts, GitHub PRs, and event logs, then get them community-verified.",
      button: 'Verify evidence',
      bgClass: 'bg-gradient-to-br from-emerald-50/80 via-white to-emerald-100/50 border-emerald-100/80',
      badgeClass: 'bg-emerald-100 text-emerald-800',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      features: ['Document uploads', 'Multi-level verification', 'Immutable audit trails'],
      visualType: 'teal-blobs',
      action: () => onNavigateTab ? onNavigateTab('verification') : {},
    },
    {
      label: 'Reputation',
      labelColor: '#7344e6',
      title: 'Impact Profiles',
      description: 'Build your public record of real-world contribution. Showcase verified milestones, evidence, and Proof of Impact Certificates.',
      button: 'View profiles',
      bgClass: 'bg-gradient-to-br from-purple-50/80 via-white to-purple-100/50 border-purple-100/80',
      badgeClass: 'bg-purple-100 text-purple-800',
      buttonClass: 'bg-purple-600 hover:bg-purple-700 text-white',
      features: ['Verified contributions', 'Impact Score', 'Leadership tenures'],
      visualType: 'purple-ring',
      action: () => onNavigateTab ? onNavigateTab('talent') : {},
    },
    {
      label: 'Transparency',
      labelColor: '#0284c7',
      title: 'Impact Ledger',
      description: 'Track the exact flow of funds. Connect capital directly to milestones, vendor expenses, and verified outcomes.',
      button: 'Explore ledger',
      bgClass: 'bg-gradient-to-br from-sky-50/80 via-white to-sky-100/50 border-sky-100/80',
      badgeClass: 'bg-sky-100 text-sky-800',
      buttonClass: 'bg-sky-600 hover:bg-sky-700 text-white',
      features: ['Fund allocation', 'Expense tracking', 'Financial evidence'],
      visualType: 'blue-circle',
      action: () => onNavigateTab ? onNavigateTab('grants') : {},
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Modern Header */}
      <ModernHeader
        logo={
          <div className="flex items-center gap-3 cursor-pointer" onClick={onExploreApp}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20">
              OI
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-900">OpenImpact</span>
              <span className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest">Protocol</span>
            </div>
          </div>
        }
        navLinks={navLinks}
        actions={
          <div className="flex items-center gap-3">
            <ModernButton variant="ghost" size="sm" onClick={() => onOpenAuthModal('login')}>
              Log in
            </ModernButton>
            <ModernButton variant="primary" size="sm" onClick={() => onOpenAuthModal('select')}>
              Get Started
            </ModernButton>
          </div>
        }
      />

      {/* Main Hero & 4 Cards Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verifiable Non-Profit & Grant Infrastructure</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Transparent infrastructure for <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">nonprofit funding</span>.
          </h1>
          <p className="text-slate-600 text-lg font-medium">
            Track funding from commitment to impact—with an auditable record of where resources go.
          </p>
        </div>

        {/* 2x2 Grid matching the requested design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl p-8 sm:p-10 border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${card.bgClass}`}
            >
              {/* Top Meta & Title */}
              <div className="relative z-10 space-y-4 max-w-md">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${card.badgeClass}`}>
                  {card.label}
                </span>

                <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  {card.title}
                </h3>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                  {card.description}
                </p>

                <div className="pt-2">
                  <button
                    onClick={card.action}
                    className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer ${card.buttonClass}`}
                  >
                    {card.button}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Decorative Visual Graphics per Card */}
              <div className="absolute right-4 bottom-4 pointer-events-none opacity-90 sm:opacity-100">
                {card.visualType === 'orange-squares' && (
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                    <div className="absolute w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 shadow-lg top-0 right-16 rotate-12" />
                    <div className="absolute w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg top-16 right-0 -rotate-6" />
                    <div className="absolute w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg bottom-0 right-20 rotate-45" />
                  </div>
                )}

                {card.visualType === 'teal-blobs' && (
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                    <div className="absolute w-36 h-36 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl top-0 right-0" />
                    <div className="absolute w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-400 to-cyan-500 shadow-lg bottom-0 right-28 rotate-12" />
                    <div className="absolute text-blue-600 text-3xl top-4 right-4 animate-pulse">✦</div>
                  </div>
                )}

                {card.visualType === 'purple-ring' && (
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                    <div className="absolute w-40 h-40 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-600 to-pink-500 shadow-2xl flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md" />
                    </div>
                    <div className="absolute text-white text-xl top-6 right-8">✦</div>
                  </div>
                )}

                {card.visualType === 'blue-circle' && (
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                    <div className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl flex items-center justify-center">
                      <div className="w-24 h-24 rounded-2xl bg-white/25 backdrop-blur-md -rotate-12 shadow-lg" />
                    </div>
                  </div>
                )}
              </div>

              {/* Feature Pills Footer */}
              <div className="relative z-10 pt-8 mt-6 border-t border-slate-200/60 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600">
                {card.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => onNavigateTab ? onNavigateTab(tab) : onExploreApp()} onOpenAuthModal={onOpenAuthModal} />
    </div>
  );
};
