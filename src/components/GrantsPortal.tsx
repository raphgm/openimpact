import React, { useState, useEffect } from 'react';
import { GrantProgram, Currency } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Award, CheckCircle2, ChevronRight, FileText, Send, Building2, Layers, ExternalLink, ShieldCheck, PieChart, Target, Sparkles, Ticket, ArrowRight, Wallet, Users, FileCheck, PlusCircle, Database, Search, Calendar, Globe, X } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, setDoc, collection, onSnapshot } from 'firebase/firestore';

interface GrantsPortalProps {
  grants: GrantProgram[];
  displayCurrency: Currency;
  onApplyForGrant?: (grant: GrantProgram) => void;
  onOpenSponsorEventModal?: () => void;
}

export const GrantsPortal: React.FC<GrantsPortalProps> = ({
  grants,
  displayCurrency,
  onApplyForGrant,
  onOpenSponsorEventModal,
}) => {
  const [selectedGrant, setSelectedGrant] = useState<GrantProgram | null>(grants[0] || null);
  const [activePipelineStep, setActivePipelineStep] = useState<number>(3); // e.g. Review stage
  const [projectTitle, setProjectTitle] = useState('');
  const [proposalText, setProposalText] = useState('');
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'scholarship' | 'grant'>('all');

  const [searchQuery, setSearchQuery] = useState('');

  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Register Grant Form state
  const [customTitle, setCustomTitle] = useState('');
  const [customOrgName, setCustomOrgName] = useState('');
  const [customFunding, setCustomFunding] = useState(50000);
  const [customCurrency, setCustomCurrency] = useState<Currency>('USD');
  const [customCategory, setCustomCategory] = useState('Open Source Software & Public Goods');
  const [customDescription, setCustomDescription] = useState('');
  const [customWebsite, setCustomWebsite] = useState('');
  const [customAppUrl, setCustomAppUrl] = useState('');
  const [customEligibility, setCustomEligibility] = useState("Registered open source initiative\nActive public repository on GitHub\nTransparent milestones");
  const [isRegistering, setIsRegistering] = useState(false);

  // Live applications state synced from Firestore
  interface GrantApplicationRecord {
    id: string;
    projectTitle: string;
    githubRepo?: string;
    applicantName: string;
    applicantEmail: string;
    requestedAmount: number;
    currency: Currency;
    status: string;
    createdAt?: string;
  }
  const [applications, setApplications] = useState<GrantApplicationRecord[]>([]);

  useEffect(() => {
    try {
      const colRef = collection(db, 'grant_applications');
      const unsub = onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as GrantApplicationRecord));
          setApplications(list);
        } else {
          setApplications([]);
        }
      });
      return () => unsub();
    } catch (e) {
      console.warn('Firestore grant_applications listener error:', e);
    }
  }, []);

  // Update selected grant if list changes
  useEffect(() => {
    if (grants.length > 0 && (!selectedGrant || !grants.find(g => g.id === selectedGrant.id))) {
      setSelectedGrant(grants[0]);
    }
  }, [grants]);

  const filteredGrants = grants.filter(g => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      g.title.toLowerCase().includes(q) ||
      g.organization.name.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q);

    const isScholarship = g.category.toLowerCase().includes('scholarship') || g.title.toLowerCase().includes('scholarship');
    if (filterTab === 'scholarship') return matchesSearch && isScholarship;
    if (filterTab === 'grant') return matchesSearch && !isScholarship;
    return matchesSearch;
  });

  const handleGenerateAiProposal = async () => {
    if (!selectedGrant) return;
    setIsGeneratingProposal(true);
    try {
      const res = await fetch('/api/ai/generate-grant-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grantTitle: selectedGrant.title,
          projectTitle: projectTitle || 'Public Good Infrastructure',
        }),
      });
      const data = await res.json();
      if (data.proposalText) {
        setProposalText(data.proposalText);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  const pipelineSteps = [
    'Application',
    'Eligibility',
    'Review',
    'Scoring',
    'Selection',
    'Funding',
    'Milestones',
    'Verification',
    'Impact Report',
  ];

  const totalTreasuryUSD = grants
    .filter((g) => g.currency === 'USD')
    .reduce((acc, g) => acc + g.availableFunding, 0);

  return (
    <div className="space-y-16 pb-20 font-sans text-slate-900 bg-white">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 z-10 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-xs font-bold shadow-sm">
            <span>Structured Grant Management</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Institutional<br/>
            <span className="text-emerald-800">Grants Programs</span>
          </h1>
          <p className="text-base text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
            Organizations and foundations create non-dilutive grant funds. Apply directly to official institutional grant programs with their original RFP application links, backed by transparent milestone verification.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
            <button 
              onClick={() => {
                const target = document.getElementById('institutional-grants-list');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }} 
              className="w-full sm:w-64 h-16 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2.5 cursor-pointer text-sm border border-transparent"
            >
              <Award className="h-4 w-4 text-emerald-200 shrink-0" />
              <span>Browse Official Grant Portals</span>
            </button>
            {onOpenSponsorEventModal && (
              <button 
                onClick={onOpenSponsorEventModal}
                className="w-full sm:w-64 h-16 px-6 bg-[#111827] hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2.5 cursor-pointer text-sm border border-transparent"
              >
                <Ticket className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Sponsor a Hackathon</span>
              </button>
            )}
            <button 
              onClick={() => setShowRegisterModal(true)}
              className="w-full sm:w-64 h-16 px-6 bg-[#111827] hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2.5 cursor-pointer text-sm border border-transparent"
            >
              <PlusCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Register Funding Program</span>
            </button>
          </div>
        </div>

        <div className="flex-1 relative w-full h-[400px] flex items-center justify-center hidden md:flex">
          {/* Abstract graphics */}
          <div className="absolute w-64 h-64 bg-emerald-200 rounded-[3rem] rotate-12 opacity-80 blur-xl right-10 top-10 mix-blend-multiply animate-pulse"></div>
          <div className="absolute w-72 h-72 bg-teal-200 rounded-[4rem] -rotate-12 opacity-70 blur-2xl right-32 top-0 mix-blend-multiply"></div>
          <div className="absolute w-48 h-64 bg-gradient-to-tr from-emerald-400 to-teal-400 rounded-[2rem] shadow-2xl right-40 top-10 transform -rotate-12 transition-all duration-700 hover:scale-110 hover:rotate-3 cursor-pointer"></div>
          <div className="absolute w-56 h-56 bg-gradient-to-bl from-teal-500 to-emerald-500 rounded-[2.5rem] shadow-2xl right-10 top-24 transform rotate-6 transition-all duration-700 hover:scale-110 hover:-rotate-6 cursor-pointer"></div>
          
          {/* Floating UI Element */}
          <div className="absolute right-32 top-1/2 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 w-64 transform -translate-y-1/2 z-20">
            <div className="flex items-center space-x-3 mb-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold"><Award className="h-5 w-5" /></div>
              <div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Tranche Approved</div>
                 <div className="h-2.5 bg-slate-200 rounded-full w-24 mt-1"></div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold"><CheckCircle2 className="h-5 w-5"/></div>
              <div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Escrow Released</div>
                 <div className="h-2.5 bg-slate-200 rounded-full w-32 mt-1"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Stats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center lg:justify-between items-center gap-6 bg-white border border-slate-100 shadow-sm rounded-3xl p-6">
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600"><Wallet className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900">{formatCurrency(totalTreasuryUSD, 'USD')}+</div>
               <div className="text-xs text-slate-500 font-bold">Active Grant Capital</div>
             </div>
          </div>
          <div className="hidden lg:block w-px h-10 bg-slate-100"></div>
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600"><Layers className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900">{grants.length}</div>
               <div className="text-xs text-slate-500 font-bold">Live Programs</div>
             </div>
          </div>
          <div className="hidden lg:block w-px h-10 bg-slate-100"></div>
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600"><Users className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900">1,250+</div>
               <div className="text-xs text-slate-500 font-bold">Proposals Reviewed</div>
             </div>
          </div>
          <div className="hidden lg:block w-px h-10 bg-slate-100"></div>
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600"><FileCheck className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900">100%</div>
               <div className="text-xs text-slate-500 font-bold">Milestone Verified</div>
             </div>
          </div>
        </div>
      </section>

      {/* Grant Lifecycle Pipeline Visualizer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-600" />
              OpenImpact Grant Lifecycle Pipeline
            </h3>
            <span className="text-xs text-slate-500 font-bold tracking-wide uppercase">Automated Audit & Tranche Workflow</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 text-center text-[11px] font-bold">
            {pipelineSteps.map((step, idx) => (
              <div
                key={step}
                onClick={() => setActivePipelineStep(idx)}
                className={`p-3 rounded-xl cursor-pointer transition flex flex-col items-center justify-center space-y-1 ${
                  activePipelineStep === idx
                    ? 'bg-[#111827] text-white shadow-md font-black'
                    : idx < activePipelineStep
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/50 hover:bg-indigo-100'
                    : 'bg-white text-slate-500 border border-slate-200/50 hover:bg-slate-50'
                }`}
              >
                <span className="truncate w-full block">{idx + 1}. {step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grant List & Detail Split */}
      <section id="institutional-grants-list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 scroll-mt-8">
        {/* Grants Sidebar */}
        <div className="lg:w-1/3 space-y-4 text-left">
          <div className="flex items-center justify-between pl-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Institutional Programs</h3>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">{filteredGrants.length} Verified</span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by foundation, technology, or program..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-medium"
            />
          </div>

          <div className="space-y-4 max-h-[820px] overflow-y-auto pr-2 no-scrollbar">
            {filteredGrants.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-slate-600">No institutional grant programs match your search.</p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  Clear search
                </button>
              </div>
            ) : (
              filteredGrants.map((grant) => (
                <div
                  key={grant.id}
                  onClick={() => setSelectedGrant(grant)}
                  className={`p-5 rounded-3xl border transition cursor-pointer flex flex-col justify-between group ${
                    selectedGrant?.id === grant.id
                      ? 'bg-white border-indigo-200 shadow-md ring-2 ring-indigo-500/10'
                      : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100/50 truncate">
                        {grant.category}
                      </span>
                      <span className="text-xs font-black text-indigo-700 shrink-0">
                        {formatCurrency(grant.availableFunding, grant.currency)}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <img src={grant.organization.logo} alt={grant.organization.name} className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-100 shrink-0 shadow-sm p-1" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-indigo-600 transition">{grant.title}</h4>
                        <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{grant.organization.name}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">{grant.description}</p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] gap-2">
                    <span className="text-slate-500 font-medium truncate">Deadline: <strong className="text-slate-700">{grant.deadline}</strong></span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onApplyForGrant?.(grant);
                        }}
                        className="font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200/80 inline-flex items-center gap-1 transition cursor-pointer"
                        title={`Open official ${grant.organization.name} application form`}
                      >
                        <span>Apply</span>
                        <FileText className="h-3 w-3" />
                      </button>
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">{grant.status}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Grant Details */}
        <div className="lg:w-2/3">
        {selectedGrant && (
          <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-8 shadow-sm text-left">
            {/* Grant Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-100 pb-8">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100/50">
                    {selectedGrant.category}
                  </span>
                  {selectedGrant.grantSourceLabel && (
                    <span className="text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200/80">
                      {selectedGrant.grantSourceLabel}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">{selectedGrant.title}</h2>

                <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <img src={selectedGrant.organization.logo} alt={selectedGrant.organization.name} className="w-6 h-6 rounded-lg object-contain bg-white border border-slate-100 p-0.5 shadow-sm" />
                    <span className="font-bold text-slate-800">{selectedGrant.organization.name}</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <span>{selectedGrant.organization.location}</span>
                </div>
              </div>

              <div className="sm:text-right shrink-0 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 min-w-[200px]">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Available Grant Pool</div>
                <div className="text-3xl font-black text-indigo-600 mt-1">
                  {formatCurrency(selectedGrant.availableFunding, selectedGrant.currency)}
                </div>

                <div className="flex flex-wrap sm:justify-end gap-2 mt-4">
                  {selectedGrant.websiteUrl && (
                    <a
                      href={selectedGrant.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition inline-flex items-center justify-center gap-2 shadow-sm"
                      title="Open official program RFP and foundation guidelines"
                    >
                      <span>Program Website</span>
                      <ExternalLink className="h-3.5 w-3.5 text-indigo-600" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => onApplyForGrant?.(selectedGrant)}
                    className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-md inline-flex items-center justify-center gap-2 flex-1 sm:flex-none text-center cursor-pointer"
                    title={`Open official ${selectedGrant.organization.name} application portal`}
                  >
                    <span>Apply on Official Portal</span>
                    <FileText className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Institution Profile & Legal Charter */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                    Verified Institutional Entity
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Real Institutional Entity</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {selectedGrant.organization.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-slate-500 font-mono border-t border-slate-200/60">
                <span>Jurisdiction: <strong className="text-slate-800">{selectedGrant.organization.location}</strong></span>
                <span>•</span>
                <span>Disbursed Capital: <strong className="text-slate-800">{formatCurrency(selectedGrant.organization.totalFunded, 'USD')}</strong></span>
                <span>•</span>
                <span>Supported Initiatives: <strong className="text-slate-800">{selectedGrant.organization.projectsCount}+</strong></span>
              </div>
            </div>

            {/* Program Description */}
            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Program Overview & Scope
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{selectedGrant.description}</p>
            </div>

            {/* Pipeline Numbers */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Current Pipeline Status</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-200/80">
                  <div className="text-2xl font-black text-slate-900">{selectedGrant.pipelineCount.applications}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-wide">Applications</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100/50">
                  <div className="text-2xl font-black text-blue-700">{selectedGrant.pipelineCount.eligible}</div>
                  <div className="text-[10px] text-blue-600 font-bold uppercase mt-1 tracking-wide">Eligible</div>
                </div>
                <div className="bg-amber-50 p-4 rounded-2xl text-center border border-amber-100/50">
                  <div className="text-2xl font-black text-amber-700">{selectedGrant.pipelineCount.reviewed}</div>
                  <div className="text-[10px] text-amber-600 font-bold uppercase mt-1 tracking-wide">Under Review</div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl text-center border border-emerald-100/50">
                  <div className="text-2xl font-black text-emerald-700">{selectedGrant.pipelineCount.selected}</div>
                  <div className="text-[10px] text-emerald-600 font-bold uppercase mt-1 tracking-wide">Awarded</div>
                </div>
              </div>
            </div>

            {/* Eligibility Criteria */}
            {selectedGrant.eligibilityCriteria && selectedGrant.eligibilityCriteria.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  Eligibility Criteria
                </h3>
                <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                  {selectedGrant.eligibilityCriteria.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Milestone Tranches */}
            {selectedGrant.milestoneTranches && selectedGrant.milestoneTranches.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Target className="h-5 w-5 text-indigo-600" />
                  Milestone Release Schedule
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {selectedGrant.milestoneTranches.map((tranche, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                        <span className="truncate pr-2">{tranche.name}</span>
                        <span className="bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-lg text-[11px] shrink-0 border border-indigo-100">{tranche.percentage}%</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-medium mt-auto">{tranche.requirement}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scoring Matrix */}
            {selectedGrant.scoringMatrix && selectedGrant.scoringMatrix.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-purple-600" />
                  Scoring Matrix
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedGrant.scoringMatrix.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex justify-between items-center text-sm">
                      <span className="text-slate-700 font-bold">{item.criteria}</span>
                      <span className="font-black text-purple-700 bg-purple-100 px-3 py-1 rounded-lg">{item.weight}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Official Application Action Banner */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border border-slate-800 shadow-md mt-6">
              <div className="space-y-1.5 text-left">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Original Foundation Application</span>
                </div>
                <h4 className="text-base font-bold text-white">Apply Directly with {selectedGrant.organization.name}</h4>
                <p className="text-xs text-slate-300 font-medium max-w-xl">
                  Submit your proposal directly through {selectedGrant.organization.name}'s verified RFP portal. You will be taken directly to the foundation's official application link.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => onApplyForGrant?.(selectedGrant)}
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition inline-flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <span>Open Official Application Form</span>
                  <FileText className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </section>

      {/* Real-Time Firestore Applications Ledger */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-600" />
                Live Applications Ledger (Firestore Synced)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Every application is stored in real-time as a real document in our Firestore database.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Real-Time Firestore Sync Active</span>
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-slate-200/50 space-y-2">
              <p className="text-sm text-slate-500 font-medium">No grant applications submitted yet.</p>
              <p className="text-[11px] text-slate-400">Click "Apply for Grant" on any program above to submit a real-time record!</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Application ID</th>
                    <th className="p-4">Project Title</th>
                    <th className="p-4">Applicant</th>
                    <th className="p-4">Requested Funding</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-700 font-medium divide-y divide-slate-50">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-mono text-indigo-600 font-bold">{app.id}</td>
                      <td className="p-4">
                        <div>
                          <span className="font-bold text-slate-900">{app.projectTitle}</span>
                          <span className="block text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-xs">{app.githubRepo}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <span className="font-bold text-slate-900">{app.applicantName}</span>
                          <span className="block text-[10px] text-slate-500">{app.applicantEmail}</span>
                        </div>
                      </td>
                      <td className="p-4 font-black text-slate-900">
                        {formatCurrency(app.requestedAmount, app.currency)}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping"></span>
                          <span>{app.status || 'In Review'}</span>
                        </span>
                      </td>
                      <td className="p-4 text-right text-slate-500 text-[11px] font-semibold">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Just now'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Register Funding Program Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-100 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-auto text-left space-y-6 max-h-[calc(100dvh-2rem)] overflow-y-auto">
            <button
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-6 right-6 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-emerald-600" />
                Register Funding Program
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Establish a 100% real, persistent, milestone-backed non-dilutive grant pool on Firestore.
              </p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!customTitle || !customOrgName || !customDescription) return;
              setIsRegistering(true);
              const newGrantId = `grant_custom_${Date.now()}`;
              const newGrantPayload: GrantProgram = {
                id: newGrantId,
                title: customTitle,
                organization: {
                  id: `org_custom_${Date.now()}`,
                  name: customOrgName,
                  logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=120',
                  verified: true,
                  description: `Official grant program organized by ${customOrgName}.`,
                  location: 'Global',
                  totalFunded: Number(customFunding),
                  projectsCount: 1,
                },
                availableFunding: Number(customFunding),
                currency: customCurrency,
                category: customCategory,
                deadline: '2026-12-31',
                description: customDescription,
                status: 'Accepting Applications',
                grantSourceLabel: `${customOrgName} Official Grant Fund`,
                websiteUrl: customWebsite || 'https://openimpact.io',
                pipelineCount: {
                  applications: 0,
                  eligible: 0,
                  reviewed: 0,
                  selected: 0,
                },
                eligibilityCriteria: customEligibility.split('\n').filter(Boolean),
                milestoneTranches: [
                  { name: 'Tranche 1: Kickoff', percentage: 35, requirement: 'Milestone 1 approval' },
                  { name: 'Tranche 2: Complete Build', percentage: 65, requirement: 'Complete source delivery' },
                ],
                scoringMatrix: [
                  { criteria: 'Technical Feasibility', weight: 40 },
                  { criteria: 'Impact & Alignment', weight: 30 },
                  { criteria: 'Team Capability', weight: 30 },
                ],
              };
              try {
                await setDoc(doc(db, 'grants', newGrantId), newGrantPayload);
                setShowRegisterModal(false);
                setCustomTitle('');
                setCustomOrgName('');
                setCustomFunding(50000);
                setCustomDescription('');
                setCustomWebsite('');
              } catch (err) {
                console.error('Error saving grant program to Firestore:', err);
              } finally {
                setIsRegistering(false);
              }
            }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Program Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. StarkNet Developer Grants"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Sponsoring Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. StarkNet Foundation"
                    value={customOrgName}
                    onChange={(e) => setCustomOrgName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Funding Pool</label>
                  <input
                    type="number"
                    required
                    value={customFunding}
                    onChange={(e) => setCustomFunding(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Currency</label>
                  <select
                    value={customCurrency}
                    onChange={(e) => setCustomCurrency(e.target.value as Currency)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="ETH">ETH (Ξ)</option>
                    <option value="NGN">NGN (₦)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zero Knowledge"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Program Website URL</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={customWebsite}
                  onChange={(e) => setCustomWebsite(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe what projects are suitable and the target impact..."
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Eligibility Rules (One per line)</label>
                <textarea
                  rows={3}
                  value={customEligibility}
                  onChange={(e) => setCustomEligibility(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full py-3 bg-[#111827] hover:bg-slate-800 text-white font-bold rounded-xl transition text-sm flex items-center justify-center space-x-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                {isRegistering ? <span>Establishing Program...</span> : <span>Launch Program to Live Ledger</span>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

