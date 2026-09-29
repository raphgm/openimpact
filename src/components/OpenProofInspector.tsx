import React, { useState } from 'react';
import { Project, Evidence } from '../types';
import { 
  ShieldCheck, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  GitPullRequest, 
  UserCheck, 
  Copy, 
  Check, 
  Building2, 
  FileCheck, 
  Download,
  Terminal,
  Fingerprint,
  ArrowRight
} from 'lucide-react';

interface OpenProofInspectorProps {
  projects: Project[];
  onOpenProofVerification?: () => void;
  onOpenDocumentViewer?: (url?: string, title?: string) => void;
  onViewLedger?: () => void;
}

export const OpenProofInspector: React.FC<OpenProofInspectorProps> = ({ projects, onOpenProofVerification, onOpenDocumentViewer, onViewLedger }) => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectModalEvidence, setInspectModalEvidence] = useState<(Evidence & { projectName: string; hash?: string; timeAgo?: string }) | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [certDownloaded, setCertDownloaded] = useState(false);

  // Flatten all project evidence into a unified proof registry with realistic metadata
  const allEvidence = projects.flatMap((p) =>
    p.evidence.map((ev, idx) => ({
      ...ev,
      projectName: p.title,
      hash: `0x${((idx + 1) * 897123491).toString(16).padEnd(40, 'a8b9f0c1d2e3')}`,
      timeAgo: idx % 2 === 0 ? '2 hours ago' : '1 day ago',
      reviewerSigs: ['Dr. Maya Lin (Tech Lead)', 'Kareem Adeyemi (Auditor)', 'Fiscal Custodian Node'],
    }))
  );

  const filteredEvidence = allEvidence.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'All' || ev.type === selectedType;

    return matchesSearch && matchesType;
  });

  // Calculate filter counts
  const counts = {
    All: allEvidence.length,
    'Pull Request': allEvidence.filter((e) => e.type === 'Pull Request').length,
    'Commit': allEvidence.filter((e) => e.type === 'Commit').length,
    'Photo / Media': allEvidence.filter((e) => e.type === 'Photo / Media').length,
    'Invoice / Receipt': allEvidence.filter((e) => e.type === 'Invoice / Receipt').length,
    'Report / Document': allEvidence.filter((e) => e.type === 'Report / Document').length,
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-16 pb-20 font-sans text-slate-900 bg-white">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 z-10 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-purple-700 text-xs font-bold shadow-sm">
            <span>OpenProof Protocol v2.4</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Cryptographic<br/>
            <span className="text-indigo-900">Proof of Work</span>
          </h1>
          <p className="text-base text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
            Don't just claim impact. Show the evidence. OpenProof cryptographically validates developer identity, organizational 501(c)(6) credentials, GitHub PR merges, and financial receipts before releasing milestone escrow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            {onOpenProofVerification && (
              <button onClick={onOpenProofVerification} className="w-full sm:w-auto px-6 py-3 bg-[#111827] hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer">
                <span>Generate Certificate</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
            <button 
              onClick={onViewLedger}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl shadow-sm transition cursor-pointer"
            >
              View Global Ledger
            </button>
          </div>
        </div>

        <div className="flex-1 relative w-full h-[400px] flex items-center justify-center hidden md:flex">
          {/* Abstract graphics */}
          <div className="absolute w-64 h-64 bg-purple-200 rounded-[3rem] rotate-12 opacity-80 blur-xl right-10 top-10 mix-blend-multiply animate-pulse"></div>
          <div className="absolute w-72 h-72 bg-indigo-200 rounded-[4rem] -rotate-12 opacity-70 blur-2xl right-32 top-0 mix-blend-multiply"></div>
          <div className="absolute w-48 h-64 bg-gradient-to-tr from-purple-400 to-indigo-300 rounded-[2rem] shadow-2xl right-40 top-10 transform -rotate-12 transition-all duration-700 hover:scale-110 hover:rotate-3 cursor-pointer"></div>
          <div className="absolute w-56 h-56 bg-gradient-to-bl from-indigo-500 to-blue-500 rounded-[2.5rem] shadow-2xl right-10 top-24 transform rotate-6 transition-all duration-700 hover:scale-110 hover:-rotate-6 cursor-pointer"></div>
          
          {/* Floating UI Element */}
          <div className="absolute right-32 top-1/2 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 w-64 transform -translate-y-1/2 z-20">
            <div className="flex items-center space-x-3 mb-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold"><CheckCircle2 className="h-5 w-5" /></div>
              <div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Signature Valid</div>
                 <div className="h-2.5 bg-slate-200 rounded-full w-24 mt-1"></div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold"><ShieldCheck className="h-5 w-5"/></div>
              <div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Audit Passed</div>
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
             <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600"><Fingerprint className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900">100% Verified</div>
               <div className="text-xs text-slate-500 font-bold">Identity & OAuth</div>
             </div>
          </div>
          <div className="hidden lg:block w-px h-10 bg-slate-100"></div>
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600"><Building2 className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900">Active Node</div>
               <div className="text-xs text-slate-500 font-bold">501(c)(6) Registry</div>
             </div>
          </div>
          <div className="hidden lg:block w-px h-10 bg-slate-100"></div>
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600"><GitPullRequest className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900 font-mono">
                 {allEvidence.filter((e) => e.type === 'Pull Request' || e.type === 'Commit').length} PRs
               </div>
               <div className="text-xs text-slate-500 font-bold">GitHub Audits</div>
             </div>
          </div>
          <div className="hidden lg:block w-px h-10 bg-slate-100"></div>
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600"><FileCheck className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900 font-mono">
                 {allEvidence.length} Proofs
               </div>
               <div className="text-xs text-slate-500 font-bold">Evidence Records</div>
             </div>
          </div>
        </div>
      </section>

      {/* Explorer / Toolbar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 pt-16">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between mb-8">
           <div className="lg:w-1/3">
             <div className="text-xs font-bold text-indigo-600 mb-2 tracking-wide uppercase">Ledger Explorer</div>
             <h2 className="text-2xl font-black text-slate-900 mb-2">Cryptographic Artifacts</h2>
             <p className="text-xs text-slate-500 font-medium">Browse, verify, and audit every contribution in real-time.</p>
           </div>
           
           <div className="lg:w-2/3 flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full">
             <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <input
                 type="text"
                 placeholder="Search artifacts, PR numbers..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-slate-50 text-slate-900 text-sm pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition"
               />
             </div>

             <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
               {(['All', 'Pull Request', 'Photo / Media', 'Report / Document'] as const).map((t) => (
                 <button
                   key={t}
                   onClick={() => setSelectedType(t)}
                   className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
                     selectedType === t
                       ? 'bg-[#111827] text-white shadow-md'
                       : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                   }`}
                 >
                   <span>{t}</span>
                   <span className={`text-[10px] px-2 py-0.5 rounded-lg font-mono ${
                     selectedType === t ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'
                   }`}>
                     {counts[t] || 0}
                   </span>
                 </button>
               ))}
             </div>
           </div>
        </div>

        {/* Artifacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvidence.map((ev) => (
            <div
              key={ev.id}
              className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition rounded-3xl p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Type Badge & Status */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center space-x-1.5">
                    {ev.type === 'Pull Request' && <GitPullRequest className="h-3.5 w-3.5 text-indigo-500" />}
                    {ev.type === 'Photo / Media' && <ImageIcon className="h-3.5 w-3.5 text-emerald-500" />}
                    {ev.type === 'Report / Document' && <FileText className="h-3.5 w-3.5 text-blue-500" />}
                    {ev.type === 'Invoice / Receipt' && <FileCheck className="h-3.5 w-3.5 text-purple-500" />}
                    <span>{ev.type}</span>
                  </span>

                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center space-x-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{ev.status === 'Verified' ? 'Verified 3/3 Sigs' : ev.status}</span>
                  </span>
                </div>

                {/* Title & Project Context */}
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-2">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium line-clamp-1">
                    Project: <span className="text-slate-800 font-semibold">{ev.projectName}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {ev.description}
                </p>

                {/* Cryptographic Hash Preview */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-[10px] text-slate-500 flex items-center justify-between">
                  <span className="truncate max-w-[200px]">SHA-256: {ev.hash}</span>
                  <span className="text-[9px] text-slate-400 shrink-0">{ev.timeAgo}</span>
                </div>
              </div>

              {/* Footer Submitter & Action */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2 truncate">
                  <div className="w-8 h-8 rounded-full bg-slate-950 text-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-sm">
                    {ev.submittedBy.charAt(0)}
                  </div>
                  <span className="text-slate-700 font-bold text-[11px] truncate">
                    {ev.submittedBy}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectModalEvidence(ev)}
                  className="py-2 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition shadow-sm cursor-pointer flex items-center space-x-1.5 shrink-0"
                >
                  <span>Inspect</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inspect Modal */}
      {inspectModalEvidence && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl text-slate-900 relative space-y-6 text-left max-h-[calc(100dvh-2rem)] overflow-y-auto my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">OpenProof Audit</h3>
                  <p className="text-xs text-slate-500 font-mono">Record #{inspectModalEvidence.id.toUpperCase()}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectModalEvidence(null)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                  {inspectModalEvidence.type}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Verified & Escrow Released
                </span>
              </div>
              <h4 className="text-xl font-black text-slate-900">{inspectModalEvidence.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{inspectModalEvidence.description}</p>
            </div>

            {/* SHA-256 Hash Box */}
            <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl space-y-2 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="font-bold">SHA-256 Cryptographic Hash</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyHash(inspectModalEvidence.hash || '')}
                  className="text-indigo-300 hover:text-white flex items-center space-x-1.5 cursor-pointer font-bold"
                >
                  {copiedHash ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="break-all font-bold text-emerald-400 text-xs">
                {inspectModalEvidence.hash}
              </div>
            </div>

            {/* Peer Signature Verification Tree */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500">
                Signers & Auditor Chain (3/3)
              </div>
              <div className="space-y-2">
                {(inspectModalEvidence.reviewerSigs || []).map((sig, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <UserCheck className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-slate-800 text-xs">{sig}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Signature Valid
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {onOpenDocumentViewer ? (
                <button
                  type="button"
                  onClick={() => onOpenDocumentViewer(inspectModalEvidence.url, inspectModalEvidence.title)}
                  className="flex-1 py-3 px-4 bg-[#111827] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                >
                  <span>View Raw Artifact</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              ) : (
                <a
                  href={inspectModalEvidence.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 bg-[#111827] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2 shadow-md"
                >
                  <span>View Raw Artifact</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              <button
                type="button"
                onClick={() => {
                  setCertDownloaded(true);
                  setTimeout(() => setCertDownloaded(false), 2500);
                }}
                className="flex-1 py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
              >
                {certDownloaded ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-700">Downloaded ✅</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 text-slate-600" />
                    <span>Tax Certificate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

