import React, { useState } from 'react';
import { 
  Globe, 
  ChevronDown, 
  Check, 
  X, 
  Mail, 
  Building2, 
  Users, 
  HelpCircle, 
  FileText, 
  ShieldCheck, 
  Send,
  ExternalLink,
  BookOpen,
  Scale,
  Sparkles,
  ArrowRight,
  Code2
} from 'lucide-react';

interface FooterProps {
  onNavigate?: (tab: string) => void;
  onOpenAuthModal?: (mode?: 'select' | 'organization' | 'collective' | 'individual' | 'login') => void;
}

type FooterModalType = 'about' | 'contact' | 'for-orgs' | 'for-collectives' | 'for-individuals' | 'help' | 'docs' | 'privacy' | 'terms' | null;

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAuthModal }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English (100%)');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<FooterModalType>(null);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const languages = [
    { name: 'English (100%)', code: 'en' },
    { name: 'Spanish / Español (98%)', code: 'es' },
    { name: 'French / Français (95%)', code: 'fr' },
    { name: 'German / Deutsch (92%)', code: 'de' },
    { name: 'Portuguese / Português (90%)', code: 'pt' },
    { name: 'Swahili / Kiswahili (88%)', code: 'sw' },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setActiveModal(null);
    }, 2500);
  };

  return (
    <>
      <footer className="bg-[#FBF9F5] text-slate-700 py-16 lg:py-20 border-t border-[#EAE5DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {/* Top Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
            {/* Brand Info & Language Selector */}
            <div className="md:col-span-4 space-y-6">
              <div 
                className="flex items-center space-x-3 cursor-pointer group" 
                onClick={() => {
                  onNavigate?.('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="logo-mark relative w-10 h-10">
                  <span className="logo-shape logo-blue absolute w-[22px] h-[36px] rounded-[14px_14px_14px_3px] rotate-[-28deg] left-[15px] top-[1px] bg-gradient-to-br from-indigo-600 to-purple-600" />
                  <span className="logo-shape logo-green absolute w-[22px] h-[36px] rounded-[14px_14px_14px_3px] rotate-[-28deg] left-[4px] top-[3px] bg-gradient-to-br from-emerald-500 to-teal-500 opacity-95" />
                </div>
                <div>
                  <div className="font-black text-2xl tracking-tight text-slate-900 leading-none">Open Impact</div>
                  <div className="mt-1 text-slate-500 text-[11px] font-medium">Measure · Verify · Prove Impact</div>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
                The global 501(c)(6) non-profit fiscal infrastructure empowering open source collectives, corporate sponsors, and developers through audited GitHub proof-of-work escrow and multi-rail settlements.
              </p>

              {/* Change Language Control */}
              <div className="pt-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block mb-2 flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-indigo-700" />
                  <span>Change language</span>
                </label>

                <div className="relative inline-block text-left w-full max-w-xs">
                  <button
                    type="button"
                    onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                    className="w-full flex items-center justify-between bg-white hover:bg-[#F3EFEA] text-slate-900 border border-[#DDD6CA] px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer shadow-xs"
                  >
                    <span className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span>{selectedLanguage}</span>
                    </span>
                    <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isLangDropdownOpen && (
                    <div className="absolute left-0 bottom-full mb-2 w-full bg-white border border-[#EAE5DC] rounded-xl shadow-2xl py-2 z-50 divide-y divide-[#F2EEE7]">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            setSelectedLanguage(lang.name);
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center justify-between hover:bg-[#FAF7F2] transition cursor-pointer ${
                            selectedLanguage === lang.name ? 'text-indigo-700 font-bold bg-indigo-50/70' : 'text-slate-800'
                          }`}
                        >
                          <span>{lang.name}</span>
                          {selectedLanguage === lang.name && <Check className="h-4 w-4 text-indigo-700 font-bold" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nav Columns */}
            <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-10">
              {/* Platform */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-[#EAE5DC] pb-2.5">
                  Platform
                </h4>
                <ul className="space-y-3 text-sm font-medium">
                  <li>
                    <button
                      onClick={() => {
                        onNavigate?.('landing');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-slate-600 hover:text-indigo-700 transition cursor-pointer font-medium hover:underline text-left block"
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate?.('projects');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-slate-600 hover:text-indigo-700 transition cursor-pointer font-medium hover:underline text-left block"
                    >
                      Explore
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onNavigate?.('about');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-slate-600 hover:text-indigo-700 transition cursor-pointer font-medium hover:underline text-left block"
                    >
                      About Us
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveModal('contact')}
                      className="text-slate-600 hover:text-indigo-700 transition cursor-pointer font-medium hover:underline text-left block"
                    >
                      Contact
                    </button>
                  </li>
                </ul>
              </div>

              {/* Solutions */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-[#EAE5DC] pb-2.5">
                  Solutions
                </h4>
                <ul className="space-y-3 text-sm font-medium">
                  <li>
                    <button
                      onClick={() => setActiveModal('for-orgs')}
                      className="text-slate-600 hover:text-indigo-700 transition cursor-pointer font-medium hover:underline text-left block"
                    >
                      For Organizations
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveModal('for-collectives')}
                      className="text-slate-600 hover:text-indigo-700 transition cursor-pointer font-medium hover:underline text-left block"
                    >
                      For Collectives
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveModal('for-individuals')}
                      className="text-slate-600 hover:text-indigo-700 transition cursor-pointer font-medium hover:underline text-left block"
                    >
                      For Individuals
                    </button>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-[#EAE5DC] pb-2.5">
                  Resources
                </h4>
                <ul className="space-y-3 text-sm font-medium">
                  <li>
                    <button
                      onClick={() => setActiveModal('help')}
                      className="text-slate-600 hover:text-indigo-700 transition cursor-pointer font-medium hover:underline text-left block"
                    >
                      Help & Support
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveModal('docs')}
                      className="text-slate-600 hover:text-indigo-700 transition cursor-pointer font-medium hover:underline text-left block"
                    >
                      Documentation
                    </button>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-[#EAE5DC] pb-2.5">
                  Legal
                </h4>
                <ul className="space-y-3 text-sm font-medium">
                  <li>
                    <button
                      onClick={() => setActiveModal('privacy')}
                      className="text-slate-600 hover:text-indigo-700 transition cursor-pointer font-medium hover:underline text-left block"
                    >
                      Privacy policy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveModal('terms')}
                      className="text-slate-600 hover:text-indigo-700 transition cursor-pointer font-medium hover:underline text-left block"
                    >
                      Terms of Service
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Badges */}
          <div className="pt-8 border-t border-[#EAE5DC] space-y-4">
            <div className="bg-white/80 border border-[#DDD6CA] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-slate-700">
                <Mail className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>If you have any questions, let us know at{' '}
                  <a href="mailto:hello@openimpactglobal.org" className="text-indigo-700 font-bold hover:underline">hello@openimpactglobal.org</a>
                </span>
              </div>
              <a 
                href="mailto:hello@openimpactglobal.org" 
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition inline-flex items-center gap-1.5 shrink-0"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Contact Support</span>
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600 gap-4 pt-2">
              <p className="font-medium text-slate-700">© 2026 OpenImpact Non-Profit Fiscal Infrastructure. All rights reserved.</p>
              <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-900 bg-white px-3.5 py-1.5 rounded-full border border-[#DDD6CA] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Verifiable Code & Transparent Capital</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          INTERACTIVE FOOTER MODALS (Bright / Milky Background Aesthetic)
         ========================================================================= */}

      {/* 1. ABOUT MODAL */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF7F2] border border-[#EAE5DC] text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 p-2 rounded-full hover:bg-[#EAE5DC]/60 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-950">About Open Impact</h3>
                <p className="text-xs text-indigo-700 font-mono font-bold">501(c)(6) Non-Profit Fiscal Infrastructure</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                Open Impact is built on a simple premise: <strong>Open source creators should spend their time writing code and building community, not dealing with corporate entity incorporation, tax liability, or disbursement bureaucracy.</strong>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-white border border-[#DDD6CA] p-3.5 rounded-2xl space-y-1 shadow-2xs">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" /> Fiscal Sponsorship
                  </div>
                  <p className="text-xs text-slate-600">Full legal entity umbrella, bank accounts, and tax-exempt holding without legal overhead.</p>
                </div>
                <div className="bg-white border border-[#DDD6CA] p-3.5 rounded-2xl space-y-1 shadow-2xs">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Code2 className="h-4 w-4 text-indigo-700" /> Proof-of-Work Escrow
                  </div>
                  <p className="text-xs text-slate-600">Milestone funds release programmatically upon verified GitHub pull request merges.</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 pt-1">
                We bridge corporate philanthropic & engineering budgets directly to maintainers in 160+ countries via domestic ACH, SEPA Instant, and USDC Stablecoin rails.
              </p>
            </div>

            <div className="pt-4 border-t border-[#EAE5DC] flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Close & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONTACT MODAL */}
      {activeModal === 'contact' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF7F2] border border-[#EAE5DC] text-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 p-2 rounded-full hover:bg-[#EAE5DC]/60 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-950">Contact Fiscal Support</h3>
                <p className="text-xs text-slate-600">Reach our team for sponsorship, onboarding, or custom rails</p>
              </div>
            </div>

            {contactSent ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Message Dispatched!</h4>
                <p className="text-xs text-emerald-800">Our fiscal host compliance officer will review and reply within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ada Lovelace"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6CA] rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="ada@foundation.org"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6CA] rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Message / Inquiry</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Inquiring about fiscal sponsorship for our distributed collective..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DDD6CA] rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3. FOR ORGANIZATIONS MODAL */}
      {activeModal === 'for-orgs' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF7F2] border border-[#EAE5DC] text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 p-2 rounded-full hover:bg-[#EAE5DC]/60 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-950">Solutions for Organizations & Enterprises</h3>
                <p className="text-xs text-indigo-700 font-mono font-bold">Corporate Philanthropy & Supply-Chain Security</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                Sponsor mission-critical dependencies with full enterprise-grade fiscal compliance, audited receipts, and proof-of-work guarantees.
              </p>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 bg-white p-3.5 rounded-2xl border border-[#DDD6CA] shadow-2xs">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 text-xs block">Tax-Deductible Invoicing & 501(c)(6) Receipts</strong>
                    <span className="text-xs text-slate-600">Receive single-vendor consolidated invoices for 100+ dependency maintainers worldwide.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 bg-white p-3.5 rounded-2xl border border-[#DDD6CA] shadow-2xs">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 text-xs block">Milestone Escrow Safeguards</strong>
                    <span className="text-xs text-slate-600">Corporate grant tranches stay locked in escrow until maintainers merge verified security patches and PRs.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 bg-white p-3.5 rounded-2xl border border-[#DDD6CA] shadow-2xs">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 text-xs block">W-9 / W-8BEN Tax Compliance Offloading</strong>
                    <span className="text-xs text-slate-600">Open Impact handles all KYC, OFAC checks, and 1099-NEC filings on your behalf.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE5DC] flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-600 font-mono">Zero procurement friction for engineering teams</span>
              <button
                onClick={() => {
                  setActiveModal(null);
                  onOpenAuthModal?.('organization');
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Onboard as Organization Sponsor</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. FOR COLLECTIVES MODAL */}
      {activeModal === 'for-collectives' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF7F2] border border-[#EAE5DC] text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 p-2 rounded-full hover:bg-[#EAE5DC]/60 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-950">Solutions for Open Source Collectives</h3>
                <p className="text-xs text-indigo-700 font-mono font-bold">Full-Stack Fiscal Hosting for Maintainers</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                Raise funds, accept corporate recurring sponsorships, and disburse bounties to global contributors without forming a legal entity or paying accountant fees.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-[#DDD6CA] p-3.5 rounded-2xl space-y-1 shadow-2xs">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" /> Instant Bank & Crypto Vault
                  </div>
                  <p className="text-xs text-slate-600">Dedicated FDIC-insured bank account and multi-chain stablecoin vault under our 501(c)(6) umbrella.</p>
                </div>
                <div className="bg-white border border-[#DDD6CA] p-3.5 rounded-2xl space-y-1 shadow-2xs">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Code2 className="h-4 w-4 text-indigo-700" /> Automatic Proof Submission
                  </div>
                  <p className="text-xs text-slate-600">Hook our GitHub bot to your repo to automatically verify merged PRs and unlock milestone escrows.</p>
                </div>
                <div className="bg-white border border-[#DDD6CA] p-3.5 rounded-2xl space-y-1 shadow-2xs">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-teal-600" /> Global Contributor Payouts
                  </div>
                  <p className="text-xs text-slate-600">Pay maintainers in 160+ countries with near-zero transfer fees and built-in tax compliance.</p>
                </div>
                <div className="bg-white border border-[#DDD6CA] p-3.5 rounded-2xl space-y-1 shadow-2xs">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-600" /> Live README Badges
                  </div>
                  <p className="text-xs text-slate-600">Show transparent budget health and proof of work directly on your GitHub repository header.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE5DC] flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-600 font-mono">Approved in &lt; 24h with verified GitHub repo</span>
              <button
                onClick={() => {
                  setActiveModal(null);
                  onOpenAuthModal?.('collective');
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Launch Your Collective</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4.5. FOR INDIVIDUALS MODAL */}
      {activeModal === 'for-individuals' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF7F2] border border-[#EAE5DC] text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 p-2 rounded-full hover:bg-[#EAE5DC]/60 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-950">Solutions for Independent Developers</h3>
                <p className="text-xs text-indigo-700 font-mono font-bold">Build, Ship, and Get Engaged</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                As an individual creator or solo maintainer, you can launch independent projects, attract sponsorships, and get directly engaged by corporate grant programs without the overhead of incorporating.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-[#DDD6CA] p-3.5 rounded-2xl space-y-1 shadow-2xs">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" /> Personal Tax Shield
                  </div>
                  <p className="text-xs text-slate-600">Receive stipends and grants securely without treating them as direct taxable personal income right away.</p>
                </div>
                <div className="bg-white border border-[#DDD6CA] p-3.5 rounded-2xl space-y-1 shadow-2xs">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Code2 className="h-4 w-4 text-indigo-700" /> Build Solo Projects
                  </div>
                  <p className="text-xs text-slate-600">Start a micro-collective for your own open source work and connect your personal GitHub to receive verifiable funding.</p>
                </div>
                <div className="bg-white border border-[#DDD6CA] p-3.5 rounded-2xl space-y-1 shadow-2xs">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-teal-600" /> Get Discovered
                  </div>
                  <p className="text-xs text-slate-600">Your verified proof-of-work acts as an on-chain and public resume, leading to direct engagements from corporate sponsors.</p>
                </div>
                <div className="bg-white border border-[#DDD6CA] p-3.5 rounded-2xl space-y-1 shadow-2xs">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-amber-600" /> Painless Onboarding
                  </div>
                  <p className="text-xs text-slate-600">No organizational EIN required. Just bring your GitHub profile and begin accepting grants in minutes.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE5DC] flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-600 font-mono">Join the global network of solo maintainers</span>
              <button
                onClick={() => {
                  setActiveModal(null);
                  onOpenAuthModal?.('individual');
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Create Developer Profile</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. HELP & SUPPORT MODAL */}
      {activeModal === 'help' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF7F2] border border-[#EAE5DC] text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 p-2 rounded-full hover:bg-[#EAE5DC]/60 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-950">Help & Support Knowledgebase</h3>
                <p className="text-xs text-indigo-700 font-mono font-bold">Frequently Asked Questions & Guides</p>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 max-h-96 overflow-y-auto pr-1">
              <div className="bg-white border border-[#DDD6CA] p-3.5 rounded-2xl space-y-1 shadow-2xs">
                <h4 className="font-bold text-slate-900 text-xs">How does Fiscal Hosting work on Open Impact?</h4>
                <p className="text-xs text-slate-600">We act as the legal 501(c)(6) umbrella entity for your software project. You hold a ring-fenced bank balance and multi-chain stablecoin vault under our tax structure.</p>
              </div>
              <div className="bg-white border border-[#DDD6CA] p-3.5 rounded-2xl space-y-1 shadow-2xs">
                <h4 className="font-bold text-slate-900 text-xs">How does GitHub Proof-of-Work Escrow release funds?</h4>
                <p className="text-xs text-slate-600">When you complete a milestone, you select your merged PRs and commit hashes. Our smart escrow checks quorum signatures from peer auditors and automatically releases the committed funds.</p>
              </div>
              <div className="bg-white border border-[#DDD6CA] p-3.5 rounded-2xl space-y-1 shadow-2xs">
                <h4 className="font-bold text-slate-900 text-xs">What payout rails are supported?</h4>
                <p className="text-xs text-slate-600">We support USDC Stablecoin (Base, Polygon, Arbitrum), Wise Global Contributor Bank Wires (160+ currencies), and domestic ACH / SEPA Instant.</p>
              </div>
              <div className="bg-white border border-[#DDD6CA] p-3.5 rounded-2xl space-y-1 shadow-2xs">
                <h4 className="font-bold text-slate-900 text-xs">How are taxes handled for international contributors?</h4>
                <p className="text-xs text-slate-600">Our platform embeds automated W-8BEN and W-9 clearance workflows, issuing compliant 1099-NEC forms when necessary and preventing double taxation.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE5DC] flex justify-between items-center">
              <button
                onClick={() => setActiveModal('contact')}
                className="text-xs text-indigo-700 hover:text-indigo-800 font-semibold cursor-pointer underline"
              >
                Still have questions? Contact Support
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. DOCUMENTATION MODAL */}
      {activeModal === 'docs' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF7F2] border border-[#EAE5DC] text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 p-2 rounded-full hover:bg-[#EAE5DC]/60 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-950">Documentation & API Specifications</h3>
                <p className="text-xs text-indigo-700 font-mono font-bold">OpenProof Protocol & Settlement Webhooks</p>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="bg-white p-3.5 rounded-2xl border border-[#DDD6CA] shadow-2xs font-mono space-y-2">
                <div className="text-[11px] text-indigo-700 uppercase tracking-wider font-bold">1. GitHub Webhook Proof Verification</div>
                <div className="text-xs text-slate-900 bg-[#F3EFEA] p-2.5 rounded-xl overflow-x-auto border border-[#EAE5DC]">
                  <code>POST https://api.openimpact.org/v1/attestations/github-pr</code>
                </div>
                <p className="text-[11px] text-slate-600">Automatically creates cryptographic OpenProof attestations whenever a pull request is merged into main branch.</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#DDD6CA] shadow-2xs font-mono space-y-2">
                <div className="text-[11px] text-indigo-700 uppercase tracking-wider font-bold">2. Milestone Escrow Smart Vault</div>
                <div className="text-xs text-slate-900 bg-[#F3EFEA] p-2.5 rounded-xl overflow-x-auto border border-[#EAE5DC]">
                  <code>POST https://api.openimpact.org/v1/escrow/vaults/:vaultId/quorum-sign</code>
                </div>
                <p className="text-[11px] text-slate-600">Submits multi-sig auditor signatures to release locked capital tranches to contributor payout pools.</p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-[#DDD6CA] shadow-2xs font-mono space-y-2">
                <div className="text-[11px] text-indigo-700 uppercase tracking-wider font-bold">3. Transparent Ledger CSV Streaming</div>
                <div className="text-xs text-slate-900 bg-[#F3EFEA] p-2.5 rounded-xl overflow-x-auto border border-[#EAE5DC]">
                  <code>GET https://api.openimpact.org/v1/collectives/:slug/ledger.csv</code>
                </div>
                <p className="text-[11px] text-slate-600">Stream fully audited real-time disbursements and income events for 990 tax reporting.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE5DC] flex justify-between items-center">
              <button
                onClick={() => {
                  setActiveModal(null);
                  onNavigate?.('verification');
                }}
                className="text-xs text-indigo-700 hover:text-indigo-800 font-semibold cursor-pointer underline flex items-center gap-1"
              >
                <span>Launch OpenProof Inspector</span>
                <ExternalLink className="h-3 w-3" />
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Close Docs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. PRIVACY POLICY MODAL */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF7F2] border border-[#EAE5DC] text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 p-2 rounded-full hover:bg-[#EAE5DC]/60 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-950">Privacy Policy</h3>
                <p className="text-xs text-slate-600 font-mono">Last updated: January 2026</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed max-h-96 overflow-y-auto pr-2">
              <p>
                OpenImpact Non-Profit Fiscal Infrastructure (&quot;Open Impact&quot;) respects the privacy of developers, donors, and organizational sponsors.
              </p>
              <div className="bg-white p-3.5 rounded-2xl border border-[#DDD6CA] shadow-2xs space-y-1">
                <h4 className="font-bold text-slate-900 text-xs mb-1">1. Information We Collect</h4>
                <p className="text-xs text-slate-600">We collect public GitHub usernames, commit metadata, and pull request URLs used strictly for milestone proof-of-work attestations. For payouts, banking/crypto payout rail identifiers and tax forms (W-8BEN, W-9) are securely encrypted at rest.</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#DDD6CA] shadow-2xs space-y-1">
                <h4 className="font-bold text-slate-900 text-xs mb-1">2. Public Ledger Transparency</h4>
                <p className="text-xs text-slate-600">In accordance with non-profit 501(c)(6) standards, grant amounts, project milestones, and public GitHub pull request attestations are visible on our public ledger to ensure transparent accounting.</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#DDD6CA] shadow-2xs space-y-1">
                <h4 className="font-bold text-slate-900 text-xs mb-1">3. Data Security & Storage</h4>
                <p className="text-xs text-slate-600">We do not sell personal data to third parties. All financial settlement credentials are processed via PCI-DSS and SOC2-compliant banking partners.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE5DC] flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. TERMS OF SERVICE MODAL */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF7F2] border border-[#EAE5DC] text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-slate-500 hover:text-slate-900 p-2 rounded-full hover:bg-[#EAE5DC]/60 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-950">Terms of Service</h3>
                <p className="text-xs text-slate-600 font-mono">501(c)(6) Fiscal Sponsorship Agreement</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed max-h-96 overflow-y-auto pr-2">
              <p>
                By creating or sponsoring a collective on Open Impact, you agree to these Fiscal Infrastructure Terms.
              </p>
              <div className="bg-white p-3.5 rounded-2xl border border-[#DDD6CA] shadow-2xs space-y-1">
                <h4 className="font-bold text-slate-900 text-xs mb-1">1. Fiscal Host Relationship</h4>
                <p className="text-xs text-slate-600">Open Impact acts as the fiscal sponsor, holding funds in fiduciary trust for open source collectives. Collectives retain all intellectual property and licensing rights to their codebases.</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#DDD6CA] shadow-2xs space-y-1">
                <h4 className="font-bold text-slate-900 text-xs mb-1">2. Milestone Proofs & Disbursements</h4>
                <p className="text-xs text-slate-600">Disbursements are governed by verifiable milestone deliverables. Fraudulent proofs, plagiarized code, or non-compliant PRs will result in escrow forfeiture and collective suspension.</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#DDD6CA] shadow-2xs space-y-1">
                <h4 className="font-bold text-slate-900 text-xs mb-1">3. Tax and Legal Compliance</h4>
                <p className="text-xs text-slate-600">All payouts are subject to international sanctions screening (OFAC) and appropriate tax filings according to US IRS regulations.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE5DC] flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Accept Terms
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
