import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Globe,
  FileText,
  Lock,
  Scale,
  Zap,
  GitPullRequest,
  Calculator,
  MessageSquare,
  DollarSign,
  ChevronRight,
} from 'lucide-react';
import { Currency } from '../types';
import { formatCurrency, convertCurrency } from '../utils/formatters';

interface FeaturesPageProps {
  selectedCurrency: Currency;
  onNavigate: (page: string) => void;
  onOpenAuthModal: (mode?: 'select' | 'organization' | 'collective' | 'individual' | 'login') => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({
  selectedCurrency,
  onNavigate,
  onOpenAuthModal,
}) => {
  // Interactive Feature Demo States
  const [escrowProgress, setEscrowProgress] = useState<number>(2); // 1, 2, 3, 4
  const [ledgerCategory, setLedgerCategory] = useState<'all' | 'grants' | 'bounties' | 'hardware'>('all');
  const [prSynced, setPrSynced] = useState<boolean>(true);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | 'org' | 'collective' | 'dev'>('all');

  return (
    <div className="space-y-16 py-6 text-slate-900 font-sans">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-slate-950 via-[#0B1E48] to-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-indigo-900/50 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-5xl space-y-6 relative z-10 text-left">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold px-3.5 py-1.5 rounded-full border border-indigo-400/30 backdrop-blur-xs">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>OPENIMPACT PLATFORM FEATURES</span>
          </div>
          <h1 className="text-sm sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black tracking-tight text-white leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
            Infrastructure Built for Transparent Capital & Verifiable Code
          </h1>
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Explore OpenImpact's complete feature suite—from automated milestone escrows and GitHub PR verification to public financial ledgers and non-profit tax shields.
          </p>

          {/* Quick Role Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
            <span className="text-slate-400 font-bold mr-1">Filter Features:</span>
            {(['all', 'org', 'collective', 'dev'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg border transition cursor-pointer font-bold ${
                  selectedRoleFilter === role
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                    : 'bg-white/10 text-slate-300 border-white/20 hover:bg-white/20'
                }`}
              >
                {role === 'all' && 'All Features'}
                {role === 'org' && 'Organizations'}
                {role === 'collective' && 'Collectives'}
                {role === 'dev' && 'Developers'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE 1: Interactive Milestone Smart Escrow Pipeline */}
      {(selectedRoleFilter === 'all' || selectedRoleFilter === 'org' || selectedRoleFilter === 'collective') && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">FEATURE 01</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Automated Milestone Escrow Pipeline</h2>
              <p className="text-xs sm:text-sm text-slate-600">Grant capital is deposited into escrow and released in milestone tranches upon peer verification.</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-mono px-4 py-2 rounded-xl font-bold shrink-0">
              0% Capital Loss Guarantee
            </div>
          </div>

          {/* Interactive Escrow Stepper Demo */}
          <div className="bg-slate-950 text-white rounded-2xl p-6 space-y-6 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Interactive Demo: Grant Milestone Flow</span>
              <span className="text-emerald-400 font-bold">Live Escrow State</span>
            </div>

            {/* Stepper Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { step: 1, title: '1. Grant Deposit', label: '₦42.5M Locked' },
                { step: 2, title: '2. PR Proof Logged', label: 'GitHub #142 Sync' },
                { step: 3, title: '3. Peer Auditor Review', label: 'Victoria Wills Sign-Off' },
                { step: 4, title: '4. Escrow Disbursed', label: 'Payout to Maintainer' },
              ].map((item) => (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setEscrowProgress(item.step)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer space-y-1 ${
                    escrowProgress === item.step
                      ? 'bg-indigo-600 border-indigo-400 text-white ring-2 ring-indigo-400/30'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold font-mono">{item.title}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">{item.label}</div>
                </button>
              ))}
            </div>

            {/* Current Step Status Canvas */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
              <div className="space-y-1">
                <div className="text-indigo-300 font-bold">
                  Current Stage: Step {escrowProgress} of 4
                </div>
                <div className="text-slate-300 text-xs font-sans">
                  {escrowProgress === 1 && 'Capital is deposited into non-profit bank escrow. Refund guarantees activate immediately.'}
                  {escrowProgress === 2 && 'Contributor submits GitHub PR #142 with commit hashes and automated test execution logs.'}
                  {escrowProgress === 3 && 'Verified Peer Auditor Victoria Wills approves the deliverable against specification.'}
                  {escrowProgress === 4 && 'Smart escrow instantly releases ₦10,625,000 milestone tranche directly to maintainer.'}
                </div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg font-bold text-[11px] shrink-0 self-start sm:self-auto">
                {escrowProgress < 4 ? 'Escrow Protected 🔒' : 'Tranche Released ✅'}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FEATURE 2: Non-Profit Fiscal Sponsorship & 501(c)(6) Shield */}
      {(selectedRoleFilter === 'all' || selectedRoleFilter === 'collective' || selectedRoleFilter === 'org') && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">FEATURE 02</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Non-Profit Fiscal Sponsorship & Tax Shield</h2>
              <p className="text-xs sm:text-sm text-slate-600">Operate under OpenImpact's 501(c)(6) non-profit umbrella without taking personal tax risk or forming a company.</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono px-4 py-2 rounded-xl font-bold shrink-0">
              100% Tax Deductible
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Building2 className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Legal Entity Custody</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accept corporate sponsorships, government grants, and community donations legally under OpenImpact's registered non-profit host status.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                <FileText className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Automated Tax Docs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatic W-8BEN, W-9, and 1099-NEC tax document dispatch. No manual accounting spreadsheets or IRS filing stress.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <DollarSign className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Flat 5% Host Fee</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear, transparent pricing: 5% host fee covers non-profit banking, legal protection, tax accounting, and platform escrow software.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* FEATURE 3: OpenProof Engine & GitHub Sync */}
      {(selectedRoleFilter === 'all' || selectedRoleFilter === 'dev' || selectedRoleFilter === 'collective') && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">FEATURE 03</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950">OpenProof Cryptographic Evidence Sync</h2>
              <p className="text-xs sm:text-sm text-slate-600">Connect GitHub repositories, CI test logs, and domain proofs directly to milestone release triggers.</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 text-purple-800 text-xs font-mono px-4 py-2 rounded-xl font-bold shrink-0">
              Cryptographically Verified
            </div>
          </div>

          <div className="bg-slate-950 text-white rounded-2xl p-6 space-y-4 border border-slate-800 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span>PR Evidence Inspector: OpenImpact Pay Bridge #142</span>
              <button
                type="button"
                onClick={() => setPrSynced(!prSynced)}
                className="text-emerald-400 hover:text-emerald-300 transition cursor-pointer underline text-[11px]"
              >
                {prSynced ? 'Re-verify Proof' : 'Sync PR Hashes'}
              </button>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-slate-200">
                <GitPullRequest className="h-4 w-4 text-emerald-400" />
                <span className="font-bold text-white">PR #142: Solar Hardware IoT Gateway Drivers</span>
                <span className="bg-emerald-950 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-800 font-bold">
                  {prSynced ? 'HASH VERIFIED' : 'SYNCING...'}
                </span>
              </div>
              <div className="text-slate-400 text-[11px]">
                Commit: <span className="text-indigo-300 font-bold">e7f9a2b04c81...</span> | Branch: <span className="text-slate-200">main</span> | Contributor: <span className="text-amber-300">@theresa_dev</span>
              </div>
              <div className="text-slate-400 text-[11px] pt-1">
                CI Tests: <span className="text-emerald-400 font-bold">38 Passed, 0 Failed</span> | Test Execution Duration: <span className="text-slate-300">4.2s</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FEATURE 4: Public Financial Ledger */}
      {(selectedRoleFilter === 'all' || selectedRoleFilter === 'org' || selectedRoleFilter === 'collective') && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">FEATURE 04</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950">Public Real-Time Financial Ledger</h2>
              <p className="text-xs sm:text-sm text-slate-600">Every donation, grant disbursement, vendor invoice, and maintainer stipend published transparently.</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono px-4 py-2 rounded-xl font-bold shrink-0">
              100% Audit Transparency
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-slate-500 font-bold">Filter Transactions:</span>
              {(['all', 'grants', 'bounties', 'hardware'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setLedgerCategory(cat)}
                  className={`px-3 py-1 rounded-lg border transition cursor-pointer font-bold uppercase text-[10px] ${
                    ledgerCategory === cat
                      ? 'bg-slate-950 text-white border-slate-950'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200 text-xs font-mono">
              <div className="p-3.5 flex items-center justify-between bg-white font-bold text-slate-700">
                <span>Description & Entity</span>
                <span>Type & Amount</span>
              </div>
              <div className="p-3.5 flex items-center justify-between hover:bg-white transition">
                <div>
                  <div className="font-bold text-slate-900">Grant Deposit from Lisk Foundation</div>
                  <div className="text-[10px] text-slate-500">Destination: West Africa Tech Collective</div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-700 font-extrabold">+₦12,500,000</span>
                  <div className="text-[10px] text-slate-400">Grant Escrow Deposit</div>
                </div>
              </div>
              <div className="p-3.5 flex items-center justify-between hover:bg-white transition">
                <div>
                  <div className="font-bold text-slate-900">Bounty Payout to @theresa_dev</div>
                  <div className="text-[10px] text-slate-500">PR #142 Milestone Release</div>
                </div>
                <div className="text-right">
                  <span className="text-rose-700 font-extrabold">-₦1,550,000</span>
                  <div className="text-[10px] text-slate-400">Developer Bounty Release</div>
                </div>
              </div>
              <div className="p-3.5 flex items-center justify-between hover:bg-white transition">
                <div>
                  <div className="font-bold text-slate-900">Hardware Vendor Receipt: LoRaWAN Gateway Parts</div>
                  <div className="text-[10px] text-slate-500">Audited Receipt Attached</div>
                </div>
                <div className="text-right">
                  <span className="text-rose-700 font-extrabold">-₦850,000</span>
                  <div className="text-[10px] text-slate-400">Direct Vendor Expense</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Banner */}
      <section className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white rounded-3xl p-8 text-center space-y-4 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Ready to Experience OpenImpact Features?</h2>
        <p className="text-xs sm:text-sm text-indigo-100 max-w-xl mx-auto">
          Start exploring active open-source projects, applying for grant pools, or hosting your collective with full non-profit backing today.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('projects')}
            className="bg-white hover:bg-slate-100 text-slate-950 font-black text-xs px-6 py-3 rounded-xl transition cursor-pointer"
          >
            Explore Projects Directory
          </button>
          <button
            type="button"
            onClick={() => onOpenAuthModal('select')}
            className="bg-slate-950 hover:bg-slate-900 text-white font-black text-xs px-6 py-3 rounded-xl border border-slate-800 transition cursor-pointer"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
};
