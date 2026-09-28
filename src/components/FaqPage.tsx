import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ShieldCheck,
  Building2,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Send,
} from 'lucide-react';
import { Currency } from '../types';

interface FaqPageProps {
  onNavigate: (page: string) => void;
  onOpenAuthModal: (mode?: 'select' | 'organization' | 'collective' | 'individual' | 'login') => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate, onOpenAuthModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'donors' | 'collectives' | 'devs' | 'legal'>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  // Question submission form state
  const [userQuestion, setUserQuestion] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const faqList = [
    {
      category: 'collectives',
      categoryLabel: 'Collectives & Projects',
      q: 'What is non-profit Fiscal Sponsorship on OpenImpact?',
      a: 'Fiscal sponsorship allows open collectives, software projects, and community groups without their own legal entity (e.g. 501(c)(3) or LTD) to accept tax-deductible donations, grants, and corporate sponsorships under OpenImpact\'s registered 501(c)(6) non-profit umbrella.',
    },
    {
      category: 'donors',
      categoryLabel: 'Donors & Organizations',
      q: 'How does the Milestone Escrow lock prevent fund misuse?',
      a: 'Instead of handing 100% of grant capital upfront, funds are deposited into a secure smart-escrow account. Capital is divided into milestones. Funds are released strictly after contributors submit verifiable proof deliverables (GitHub PRs, audit reports, receipts) which pass OpenProof peer review.',
    },
    {
      category: 'devs',
      categoryLabel: 'Developers & Auditors',
      q: 'What evidence can contributors submit for OpenProof audit?',
      a: 'Contributors can attach GitHub pull request URLs, test execution logs, smart contract deployment transactions, domain WHOIS records, or audited hardware receipts. Peer auditors review the proof against project requirements before unlocking escrow funds.',
    },
    {
      category: 'legal',
      categoryLabel: 'Legal & Tax Compliance',
      q: 'What fees are charged by OpenImpact Fiscal Host?',
      a: 'OpenImpact operates with 100% fee transparency: a flat 5% host fee covers banking compliance, tax reporting, 1099/W-8BEN processing, legal representation, and platform escrow infrastructure with 0% hidden charges.',
    },
    {
      category: 'donors',
      categoryLabel: 'Donors & Organizations',
      q: 'Are donations and grant contributions on OpenImpact tax-deductible?',
      a: 'Yes! As a registered 501(c)(6) non-profit fiscal host, contributions made to hosted collectives qualify for non-profit receipts and corporate tax deductions. Instant PDF tax receipts are issued upon deposit completion.',
    },
    {
      category: 'legal',
      categoryLabel: 'Legal & Tax Compliance',
      q: 'Does OpenImpact support collectives and maintainers located outside the USA?',
      a: 'Yes! OpenImpact provides complete non-profit fiscal sponsorship and milestone escrow software for maintainers across 120+ countries worldwide (both US and non-US territories). Automated W-8BEN tax form collection ensures international contributors receive compliant payouts with zero personal tax liability.',
    },
    {
      category: 'legal',
      categoryLabel: 'Legal & Tax Compliance',
      q: 'How does OpenImpact handle 1099-NEC and W-8BEN tax reporting?',
      a: 'OpenImpact automatically collects tax information when contributors receive payouts above annual reporting thresholds. W-8BEN forms are collected for non-US developers across 120+ countries, and 1099-NEC forms are generated for US citizens seamlessly.',
    },
    {
      category: 'collectives',
      categoryLabel: 'Collectives & Projects',
      q: 'Can our project disburse bounties and maintainer stipends in local currencies?',
      a: 'Yes! OpenImpact natively supports multi-currency display and automated currency conversions across NGN (₦), USD ($), KES (KSh), GHS (GH₵), and EUR (€) with local bank payouts.',
    },
    {
      category: 'devs',
      categoryLabel: 'Developers & Auditors',
      q: 'How do peer auditors get verified and paid for review work?',
      a: 'Engineers with high OpenImpact Reputation scores can apply to become Peer Auditors. When auditing milestone evidence submissions, auditors earn a transparent audit stipend directly from the milestone pool upon sign-off.',
    },
    {
      category: 'legal',
      categoryLabel: 'Legal & Tax Compliance',
      q: 'What happens if a project milestone fails peer verification?',
      a: 'If a submitted deliverable fails verification or misses the deadline, the project lead can resubmit updated proof. If unresolved, the escrow contract triggers an automated refund mechanism returning unreleased milestone capital to the grant giver.',
    },
  ];

  const filteredFaqs = faqList.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    setFormSubmitted(true);
    setUserQuestion('');
    setUserEmail('');
  };

  return (
    <div className="space-y-12 py-6 text-slate-900 font-sans">
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-slate-950 via-[#0B1E48] to-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-indigo-900/50 shadow-2xl">
        <div className="max-w-3xl space-y-4 relative z-10 text-left">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold px-3.5 py-1.5 rounded-full border border-indigo-400/30 backdrop-blur-xs">
            <HelpCircle className="h-4 w-4 text-indigo-400" />
            <span>OPENIMPACT KNOWLEDGE BASE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-slate-300 font-normal leading-relaxed">
            Everything you need to know about fiscal sponsorship, milestone smart escrow, 501(c)(6) non-profit compliance, and peer-audited payouts.
          </p>

          {/* Search Bar */}
          <div className="relative pt-2 max-w-xl">
            <Search className="absolute left-4 top-5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions (e.g. escrow, tax, fees, GitHub, refund)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-950 text-sm font-medium pl-11 pr-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Category Tabs & FAQ Accordions */}
      <section className="space-y-6 text-left">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4 text-xs font-mono">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'donors', label: 'Donors & Organizations' },
            { id: 'collectives', label: 'Collectives & Projects' },
            { id: 'devs', label: 'Developers & Auditors' },
            { id: 'legal', label: 'Legal & Tax Compliance' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-xl transition cursor-pointer font-bold ${
                activeCategory === cat.id
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2">
              <HelpCircle className="h-8 w-8 text-slate-400 mx-auto" />
              <div className="text-sm font-bold text-slate-800">No questions found matching your search.</div>
              <p className="text-xs text-slate-500">Try searching for different keywords or ask our team below.</p>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition shadow-xs hover:border-slate-300"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                        {faq.categoryLabel}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 tracking-tight pt-1">{faq.q}</h3>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-700" /> : <ChevronDown className="h-4 w-4 text-slate-700" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-sm text-slate-700 border-t border-slate-100 leading-relaxed font-normal bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Ask a Question Interactive Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
        <div className="md:col-span-6 space-y-3">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">HAVE A SPECIFIC QUESTION?</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Ask OpenImpact Support & AI Advisor</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Need custom fiscal sponsorship terms, non-profit grant agreements, or assistance with milestone escrow setup? Submit your query below.
          </p>
        </div>

        <div className="md:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-6">
          {formSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
              <div className="text-base font-bold text-white">Question Received!</div>
              <p className="text-xs text-slate-300">
                Our non-profit fiscal compliance team and AI Advisor will review your query and reply shortly.
              </p>
              <button
                type="button"
                onClick={() => setFormSubmitted(false)}
                className="text-xs font-mono text-emerald-400 hover:underline cursor-pointer pt-2 inline-block"
              >
                Submit another question
              </button>
            </div>
          ) : (
            <form onSubmit={handleQuestionSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Your Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@organization.org"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-slate-900 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Your Question or Inquiry</label>
                <textarea
                  required
                  rows={3}
                  placeholder="How do we set up milestone escrow for a ₦50M tech grant?"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  className="w-full bg-slate-900 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-md"
              >
                <span>Submit Inquiry</span>
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
