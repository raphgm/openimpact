import React from 'react';
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
  TrendingUp,
  Heart,
  Briefcase,
  Zap,
  Code,
} from 'lucide-react';
import { Currency } from '../types';
import { formatCurrency, convertCurrency } from '../utils/formatters';

interface AboutPageProps {
  selectedCurrency: Currency;
  onNavigate: (page: string) => void;
  onOpenAuthModal: (mode?: 'select' | 'organization' | 'collective' | 'individual' | 'login') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  selectedCurrency,
  onNavigate,
  onOpenAuthModal,
}) => {
  return (
    <div className="space-y-16 py-6 text-slate-900 font-sans">
      {/* Hero Header (Benchmark Split Layout) */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-12 text-left relative overflow-hidden min-h-[400px]">
        
        <div className="flex-1 space-y-6 relative z-10 max-w-2xl">
          <div className="flex items-center space-x-2 text-indigo-600 font-bold tracking-wide uppercase text-xs mb-3">
            <Building2 className="h-4 w-4" />
            <span>OpenImpact Fiscal Host</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Empowering Open <br className="hidden lg:block" />
            <span className="text-indigo-800">Technology</span>
          </h1>
          
          <p className="text-base text-slate-600 max-w-xl font-medium leading-relaxed">
            OpenImpact is a registered 501(c)(6) non-profit fiscal host and milestone escrow platform designed to connect corporate grant givers, open technology collectives, and independent developers under a transparent, risk-free umbrella.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => onOpenAuthModal('collective')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition flex items-center space-x-2 shadow-lg cursor-pointer"
            >
              <span>Apply for Fiscal Sponsorship</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm px-6 py-3.5 rounded-xl border border-slate-200 shadow-sm transition cursor-pointer"
            >
              Explore Active Collectives
            </button>
          </div>
        </div>

        {/* Abstract Graphics (Right Side) */}
        <div className="flex-1 relative w-full h-[400px] flex items-center justify-center hidden md:flex">
          {/* Abstract graphics */}
          <div className="absolute w-64 h-64 bg-indigo-200 rounded-[3rem] rotate-12 opacity-80 blur-xl right-10 top-10 mix-blend-multiply animate-pulse"></div>
          <div className="absolute w-72 h-72 bg-emerald-200 rounded-[4rem] -rotate-12 opacity-70 blur-2xl right-32 top-0 mix-blend-multiply"></div>
          
          <div className="absolute w-48 h-64 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2rem] shadow-2xl right-40 top-10 transform -rotate-12 transition-all duration-700 hover:scale-110 hover:rotate-3 cursor-pointer overflow-hidden border-4 border-white/20">
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:12px_12px]" />
          </div>
          
          <div className="absolute w-56 h-56 bg-gradient-to-bl from-emerald-400 to-teal-500 rounded-[2.5rem] shadow-2xl right-10 top-24 transform rotate-6 transition-all duration-700 hover:scale-110 hover:-rotate-6 cursor-pointer flex items-center justify-center border-4 border-white/20">
             <ShieldCheck className="w-20 h-20 text-white opacity-80" />
          </div>
          
          {/* Floating UI Element */}
          <div className="absolute right-32 top-1/2 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 w-64 transform -translate-y-1/2 z-20">
            <div className="flex items-center space-x-3 mb-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold"><CheckCircle2 className="h-5 w-5" /></div>
              <div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">501(c)(6) Shield</div>
                 <div className="h-2 bg-slate-200 rounded-full w-24 mt-1"></div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold"><Lock className="h-5 w-5"/></div>
              <div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Escrow Protected</div>
                 <div className="h-2 bg-slate-200 rounded-full w-32 mt-1"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Stats */}
      <section className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center lg:justify-between items-center gap-6 bg-white border border-slate-100 shadow-sm rounded-3xl p-6 md:p-8">
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600"><Lock className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900">{formatCurrency(convertCurrency(285000000, 'NGN', selectedCurrency), selectedCurrency)}</div>
               <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Escrow Protected</div>
             </div>
          </div>
          <div className="hidden lg:block w-px h-10 bg-slate-100"></div>
          
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600"><Building2 className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900">450+ Active</div>
               <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Hosted Collectives</div>
             </div>
          </div>
          <div className="hidden lg:block w-px h-10 bg-slate-100"></div>
          
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600"><Users className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900">4,100+ Devs</div>
               <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Verified Network</div>
             </div>
          </div>
          <div className="hidden lg:block w-px h-10 bg-slate-100"></div>
          
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600"><ShieldCheck className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900">0% Liability</div>
               <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tax Shielded</div>
             </div>
          </div>
        </div>
      </section>

      {/* The OpenImpact Problem & Solution */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div className="bg-white border border-rose-100 rounded-[2.5rem] p-10 space-y-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-100 transition-colors"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-6 border border-rose-100 shadow-sm">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-4">The Open Tech <br/><span className="text-rose-600">Infrastructure Deficit</span></h2>
            <p className="text-sm text-slate-600 leading-relaxed font-medium mb-8">
              Over 90% of open-source software projects, civic tech initiatives, and grassroots technology collectives globally (in the US and internationally) operate without a registered corporate or non-profit entity.
            </p>
            <ul className="space-y-4 text-xs font-mono text-slate-700">
              <li className="flex items-start space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-rose-600 font-bold text-lg leading-none mt-0.5">✕</span>
                <span className="leading-relaxed">Individual maintainers across US and international countries forced to receive grants into personal bank accounts, incurring heavy tax liabilities.</span>
              </li>
              <li className="flex items-start space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-rose-600 font-bold text-lg leading-none mt-0.5">✕</span>
                <span className="leading-relaxed">Corporate donors and global foundations unable to issue tax-deductible grants without strict international audit documentation.</span>
              </li>
              <li className="flex items-start space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-rose-600 font-bold text-lg leading-none mt-0.5">✕</span>
                <span className="leading-relaxed">Lack of milestone escrow results in all-or-nothing lump-sum payouts with zero progress verification.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white border border-emerald-100 rounded-[2.5rem] p-10 space-y-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-100 transition-colors"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-6 border border-emerald-100 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-4">The OpenImpact <br/><span className="text-emerald-600">Fiscal Solution</span></h2>
            <p className="text-sm text-slate-600 leading-relaxed font-medium mb-8">
              OpenImpact provides complete non-profit fiscal sponsorship and milestone escrow software, shielding creators from liability while guaranteeing donors verifiable proof for projects worldwide.
            </p>
            <ul className="space-y-4 text-xs font-mono text-slate-700">
              <li className="flex items-start space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed"><strong className="text-slate-900">501(c)(6) non-profit umbrella</strong> provides instant legal bank custody and tax-deductible contribution receipts.</span>
              </li>
              <li className="flex items-start space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed"><strong className="text-slate-900">Smart milestone escrows</strong> lock grant capital and disburse funds strictly upon peer-audited proof of work.</span>
              </li>
              <li className="flex items-start space-x-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed"><strong className="text-slate-900">Automated 1099-NEC & W-8BEN</strong> tax form generation for maintainers across 120+ countries.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="space-y-10 text-left max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 text-xs font-mono font-bold px-4 py-2 rounded-full border border-indigo-100">
             <span>FOUNDATIONAL PILLARS</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">How OpenImpact Operates</h2>
          <p className="text-base text-slate-600 font-medium">Built on three core principles of non-profit legal stewardship, cryptographic proof verification, and open access.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-4 hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-100 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold mb-6 border border-indigo-100 shadow-sm">
                <Scale className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">1. Non-Profit Legal Custody</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                OpenImpact acts as the legal fiscal sponsor for your collective. We hold funds in designated non-profit bank accounts, handle tax filings, and ensure strict compliance with international non-profit regulations.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-4 hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-100 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold mb-6 border border-indigo-100 shadow-sm">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">2. Milestone Smart Escrow</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Donors and grant pools deposit funds into automated milestone escrows. Funds are split into tranches and unlocked only when project teams submit verified evidence (code, hardware receipts, audit reports).
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-4 hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-100 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold mb-6 border border-indigo-100 shadow-sm">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">3. OpenProof Peer Review</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Independent technical peer auditors review submitted evidence against project specifications. Automated GitHub PR synchronization and CI test logs provide cryptographically verifiable proof of delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency & Non-Profit Governance */}
      <section className="bg-slate-900 text-white rounded-[2.5rem] p-8 sm:p-12 border border-slate-800 space-y-8 text-left max-w-6xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-800 pb-8">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">RADICAL TRANSPARENCY</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Flat 5% Host Fee & Zero Markup</h2>
            <p className="text-sm text-slate-300 font-medium">OpenImpact is non-profit run. Every cent of host fee directly powers legal compliance, banking fees, and platform infrastructure.</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-[1.5rem] p-6 text-center shrink-0 backdrop-blur-md shadow-inner min-w-[200px]">
            <div className="text-5xl font-black text-emerald-400 font-mono tracking-tighter">5.0%</div>
            <div className="text-xs text-slate-300 font-bold uppercase tracking-wider mt-2">Flat Fiscal Host Fee</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 text-sm font-medium relative z-10">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-4 border border-emerald-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="text-emerald-400 font-bold text-base">Included Legal Shield</div>
            <div className="text-slate-400 leading-relaxed">501(c)(6) tax exemption certificates, IRS annual 990 filings, and full legal representation.</div>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-4 border border-emerald-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <div className="text-emerald-400 font-bold text-base">Automated Tax Processing</div>
            <div className="text-slate-400 leading-relaxed">Automatic generation and dispatch of W-8BEN and 1099-NEC forms for maintainers worldwide.</div>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-4 border border-emerald-500/30">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="text-emerald-400 font-bold text-base">Public Financial Ledger</div>
            <div className="text-slate-400 leading-relaxed">Real-time public accounting line items for every grant deposit, stipend, and expense.</div>
          </div>
        </div>
      </section>

      {/* Competitor Landscape & Market Comparison */}
      <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 sm:p-12 shadow-sm space-y-10 text-left max-w-6xl mx-auto">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 text-xs font-mono font-bold px-4 py-2 rounded-full border border-slate-200">
             <span>ECOSYSTEM COMPARISON</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">How OpenImpact Compares in the Market</h2>
          <p className="text-base text-slate-600 font-medium leading-relaxed">
            While several platforms support public goods funding and open-source sustainability, OpenImpact uniquely combines non-profit fiscal sponsorship with cryptographically verifiable milestone escrow and AI assistance.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-900 font-black bg-slate-50/50">
                <th className="py-4 px-6 uppercase tracking-wider text-xs">Feature / Capability</th>
                <th className="py-4 px-6 bg-indigo-50 text-indigo-900 border-x border-indigo-200 uppercase tracking-wider text-xs">OpenImpact</th>
                <th className="py-4 px-6 text-slate-500 uppercase tracking-wider text-xs">Open Collective</th>
                <th className="py-4 px-6 text-slate-500 uppercase tracking-wider text-xs">Gitcoin Grants</th>
                <th className="py-4 px-6 text-slate-500 uppercase tracking-wider text-xs">GitHub Sponsors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700 bg-white">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900">501(c)(6) / Fiscal Sponsorship</td>
                <td className="py-4 px-6 bg-indigo-50/50 border-x border-indigo-200 text-indigo-900 font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600"/> Full Service</td>
                <td className="py-4 px-6 text-emerald-600 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Full Service</td>
                <td className="py-4 px-6 text-rose-500"><span className="font-bold text-lg leading-none mr-1">✕</span> No (Needs external host)</td>
                <td className="py-4 px-6 text-rose-500"><span className="font-bold text-lg leading-none mr-1">✕</span> No (Maintainer account req)</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900">Milestone Escrow Tranches</td>
                <td className="py-4 px-6 bg-indigo-50/50 border-x border-indigo-200 text-indigo-900 font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600"/> Auto Proof-of-Work</td>
                <td className="py-4 px-6 text-amber-600">~ Manual / Budget based</td>
                <td className="py-4 px-6 text-rose-500"><span className="font-bold text-lg leading-none mr-1">✕</span> Upfront matching pools</td>
                <td className="py-4 px-6 text-rose-500"><span className="font-bold text-lg leading-none mr-1">✕</span> Direct monthly tips</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900">Multi-Currency (Fiat + Crypto)</td>
                <td className="py-4 px-6 bg-indigo-50/50 border-x border-indigo-200 text-indigo-900 font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600"/> NGN, USD, KES, EUR, Crypto</td>
                <td className="py-4 px-6 text-emerald-600 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> USD & EUR & Crypto</td>
                <td className="py-4 px-6 text-emerald-600 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Crypto (ETH/DAI/USDC)</td>
                <td className="py-4 px-6 text-amber-600">~ USD via Credit Card</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900">AI Grant Writer & Assistant</td>
                <td className="py-4 px-6 bg-indigo-50/50 border-x border-indigo-200 text-indigo-900 font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600"/> Built-in Gemini AI</td>
                <td className="py-4 px-6 text-rose-500"><span className="font-bold text-lg leading-none mr-1">✕</span> None</td>
                <td className="py-4 px-6 text-rose-500"><span className="font-bold text-lg leading-none mr-1">✕</span> None</td>
                <td className="py-4 px-6 text-rose-500"><span className="font-bold text-lg leading-none mr-1">✕</span> None</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900">Spam & Scam Shield</td>
                <td className="py-4 px-6 bg-indigo-50/50 border-x border-indigo-200 text-indigo-900 font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600"/> Auto Bot/Scam Guard</td>
                <td className="py-4 px-6 text-amber-600">~ Manual moderation</td>
                <td className="py-4 px-6 text-amber-600">~ Sybil defense (Passport)</td>
                <td className="py-4 px-6 text-emerald-600 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> GitHub platform security</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Competitor Breakdown Summaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-500"/> Open Collective</h4>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              A pioneer in open source fiscal hosting. While similar in offering non-profit financial wrappers, Open Collective lacks automated GitHub milestone escrow verification and AI-powered grant writing tools found in OpenImpact.
            </p>
          </div>
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2"><Code className="w-4 h-4 text-slate-500"/> Gitcoin Grants</h4>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Renowned for quadratic funding rounds in Web3. However, Gitcoin operates primarily as a grant matching portal and requires external fiscal hosts for tax compliance, whereas OpenImpact provides end-to-end fiscal hosting and milestone escrow.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-[2.5rem] p-10 sm:p-14 text-center space-y-6 shadow-2xl max-w-6xl mx-auto relative overflow-hidden border border-indigo-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">Join the Open Impact Revolution</h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Whether you are an organization looking to deploy grant capital or an open collective ready to raise funds without corporate hassle, OpenImpact is built for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => onOpenAuthModal('organization')}
              className="bg-white hover:bg-slate-50 text-indigo-950 font-black text-sm px-8 py-4 rounded-xl transition cursor-pointer shadow-lg"
            >
              Register as Organization
            </button>
            <button
              type="button"
              onClick={() => onOpenAuthModal('collective')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm px-8 py-4 rounded-xl border border-indigo-500 transition cursor-pointer shadow-lg"
            >
              Create Impact Collective
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
