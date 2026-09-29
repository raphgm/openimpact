import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  ShieldCheck,
  Download,
  Printer,
  Copy,
  CheckCircle2,
  Lock,
  Eye,
  ArrowLeft,
  Share2,
  Wand2,
  Terminal,
  Cpu,
  RefreshCw,
  Github,
  Award,
  Sparkles,
  HelpCircle,
  FileCheck2,
  LockKeyhole
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl?: string;
  documentTitle?: string;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  documentUrl = 'https://openimpact.io/evidence/doc-verified.pdf',
  documentTitle = 'Verified Project Milestone Evidence',
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'document' | 'metadata' | 'audit'>('document');

  // Interactive Customizer States
  const [docTitle, setDocTitle] = useState(documentTitle);
  const [docRef, setDocRef] = useState('');
  const [docIntro, setDocIntro] = useState('');
  const [subject, setSubject] = useState(documentTitle);
  const [sourceRef, setSourceRef] = useState(documentUrl);
  const [signOff, setSignOff] = useState('');

  // Signatory Customizer
  const [signatoryLeftName, setSignatoryLeftName] = useState('OpenImpact Auditing Board');
  const [signatoryLeftTitle, setSignatoryLeftTitle] = useState('Verified Institutional Escrow');
  const [signatoryRightName, setSignatoryRightName] = useState('OpenProof Protocol #42');
  const [signatoryRightTitle, setSignatoryRightTitle] = useState('501(c)(6) Protocol Auditor');

  // Stamp Text Customizer
  const [stamp1, setStamp1] = useState('VERIFIED PROOF');
  const [stamp2, setStamp2] = useState('OPENIMPACT REGISTRY');
  const [stamp3, setStamp3] = useState('2026 AUDITED');

  // Advanced Checklist Toggles
  const [checkpoints, setCheckpoints] = useState([
    { id: 'linter', label: 'Eslint & Prettier Static Analysis', passed: true },
    { id: 'cicd', label: 'GitHub Actions Automated Test Pipeline', passed: true },
    { id: 'sec', label: 'OWASP Dependency Vulnerability Scan', passed: true },
    { id: 'coverage', label: 'Core System Unit Test Coverage >90%', passed: true },
    { id: 'multisig', label: 'Multi-Signature Governance Threshold', passed: true },
  ]);

  // Certificate Minting & Sealing Simulation
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [isSealed, setIsSealed] = useState(true);
  const [sha256Hash, setSha256Hash] = useState('0x8f3a92b4c7e1d5a6b0c2e4f8a1d3b5c7e9f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0');

  // Auto-fill beautiful templates based on document context
  useEffect(() => {
    if (isOpen) {
      setDocTitle(documentTitle);
      setSubject(documentTitle);
      setSourceRef(documentUrl);

      const titleLower = documentTitle.toLowerCase();
      const urlLower = documentUrl.toLowerCase();

      const isLease = titleLower.includes('lease') || urlLower.includes('lease');
      const isHardware = titleLower.includes('hardware') || titleLower.includes('pc') || titleLower.includes('computer');
      const isSolar = titleLower.includes('solar') || titleLower.includes('energy');
      const isGithub = titleLower.includes('github') || titleLower.includes('pull') || titleLower.includes('issue') || titleLower.includes('pr');

      if (isLease) {
        setDocRef('OI/LEASE/2026/FCT-9842');
        setDocIntro('THIS DEED OF COMMERCIAL LEASE is executed and authenticated on-chain for the verification of decentralized community workspace hosting and physical hub sponsorships.');
        setSignOff('Confirmed 100% compliant with OpenImpact workspace security, accessibility, and community standards.');
        setStamp1('LEASE VERIFIED');
        setStamp2('BC LAND REGISTRY');
        setStamp3('2026 REGISTERED');
        setSignatoryLeftName('Chief Inspector Arthur Vance');
        setSignatoryLeftTitle('Vancouver District Land Officer');
        setSignatoryRightName('OpenImpact Vancouver Tech Center');
        setSignatoryRightTitle('Lessee Representative');
        setCheckpoints([
          { id: 'linter', label: 'BC Land Deed Authenticity Check', passed: true },
          { id: 'cicd', label: 'Verified Landlord Security Clearance', passed: true },
          { id: 'sec', label: 'Direct Escrow Payment Smart Contract Locked', passed: true },
          { id: 'coverage', label: 'Co-Working Spatial Utilization Vetted', passed: true },
          { id: 'multisig', label: 'Multi-Sig Landlord Consent Authorization', passed: true },
        ]);
      } else if (isHardware || isSolar) {
        setDocRef('OI/PROC/2026/HW-4019');
        setDocIntro('OFFICIAL PROCUREMENT INVOICE & ESCROW DISBURSEMENT RECORD verified by physical inspectors and peer hardware auditors.');
        setSignOff('All procurement assets verified on-site, serial-numbered, asset-tagged, and confirmed fully operational.');
        setStamp1('ASSETS INSPECTED');
        setStamp2('PROCUREMENT ESCROW');
        setStamp3('100% DELIVERED');
        setSignatoryLeftName('Certified Supplier Partners');
        setSignatoryLeftTitle('Logistics & Inventory Director');
        setSignatoryRightName('OpenProof Protocol Auditor');
        setSignatoryRightTitle('Chief Procurement Inspector');
        setCheckpoints([
          { id: 'linter', label: 'Physical Hardware Serial-Number Verification', passed: true },
          { id: 'cicd', label: 'Proof-of-Delivery Inspection Certificate', passed: true },
          { id: 'sec', label: 'Capital Expenditure Budget Cap Validation', passed: true },
          { id: 'coverage', label: 'Solar Output Capacity Testing Run', passed: true },
          { id: 'multisig', label: 'Peer Hardware Council Multi-Sig Clearance', passed: true },
        ]);
      } else if (isGithub) {
        setDocRef('OI/COMMIT/2026/GH-9421');
        setDocIntro('VERIFIABLE GITHUB PULL REQUEST & COMMIT AUDIT RECORD generated from cryptographic repository integration hooks.');
        setSignOff('Codebase changes merged and certified secure following automatic regression suite execution.');
        setStamp1('COMMIT VERIFIED');
        setStamp2('GITHUB CI RUNNER');
        setStamp3('BUILD PASSED');
        setSignatoryLeftName('GitHub Actions Bot');
        setSignatoryLeftTitle('CI/CD Pipeline Manager');
        setSignatoryRightName('OpenProof Consensus Board');
        setSignatoryRightTitle('Protocol Core Maintainer');
        setCheckpoints([
          { id: 'linter', label: 'Eslint & Prettier Static Analysis', passed: true },
          { id: 'cicd', label: 'GitHub Actions Automated Test Pipeline', passed: true },
          { id: 'sec', label: 'OWASP Dependency Vulnerability Scan', passed: true },
          { id: 'coverage', label: 'Core System Unit Test Coverage >90%', passed: true },
          { id: 'multisig', label: 'Multi-Signature Governance Threshold', passed: true },
        ]);
      } else {
        setDocRef(`OI/REF/2026/${Math.floor(Math.random() * 8999) + 1000}`);
        setDocIntro('VERIFIED MILESTONE DELIVERABLE REPORT submitted for community review, multi-party signature consensus, and decentralized escrow release.');
        setSignOff('Confirmed compliant with OpenImpact public goods grant standards.');
        setStamp1('VERIFIED PROOF');
        setStamp2('OPENIMPACT REGISTRY');
        setStamp3('2026 AUDITED');
        setSignatoryLeftName('OpenImpact Auditing Board');
        setSignatoryLeftTitle('Verified Institutional Escrow');
        setSignatoryRightName('OpenProof Protocol #42');
        setSignatoryRightTitle('501(c)(6) Protocol Auditor');
        setCheckpoints([
          { id: 'linter', label: 'Project Milestone Criteria Verification', passed: true },
          { id: 'cicd', label: 'Decentralized Funding Escrow Check', passed: true },
          { id: 'sec', label: 'Sybil Resistance Leader Check', passed: true },
          { id: 'coverage', label: 'Verified Proof of Completion Audit', passed: true },
          { id: 'multisig', label: 'Audit Board Advisory Consensus', passed: true },
        ]);
      }

      setIsSealed(false);
      setGenerationLogs([]);
    }
  }, [isOpen, documentTitle, documentUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sourceRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRegenRef = () => {
    const prefixes = ['OI/REF', 'OI/CERT', 'OI/PROOF', 'OI/AUDIT'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    setDocRef(`${randomPrefix}/2026/${Math.floor(Math.random() * 8999) + 1000}`);
  };

  const toggleCheckpoint = (id: string) => {
    setCheckpoints(prev =>
      prev.map(cp => (cp.id === id ? { ...cp, passed: !cp.passed } : cp))
    );
  };

  const handleGenerateSeal = () => {
    setIsGenerating(true);
    setGenerationLogs([]);

    const logs = [
      '📡 Connecting to OpenProof Consensus Engine...',
      '🔍 Fetching latest block height (Block #4,921,048)...',
      '📝 Compiling certificate JSON-LD metadata schema...',
      '🛡️ Checking active linter and test suite dependencies...',
      '🔒 Generating dynamic SHA-256 state proof hash...',
      '✍️ Signing record payload with OpenProof private certificate key...',
      '🔗 Anchoring proof on OpenImpact public goods registry...',
      '✨ Applying official stamp & generating final secure certificate!'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setGenerationLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setIsGenerating(false);
          setIsSealed(true);
          // Set a new random SHA-256 proof hash
          const chars = '0123456789abcdef';
          let newHash = '0x';
          for (let i = 0; i < 64; i++) {
            newHash += chars[Math.floor(Math.random() * 16)];
          }
          setSha256Hash(newHash);
        }
      }, (index + 1) * 350);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-white truncate max-w-md">
                  {docTitle}
                </h2>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  OpenProof Certificate Builder
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono truncate max-w-lg">
                {sourceRef || 'Custom Interactive Cert'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* View Mode Bar */}
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('document')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === 'document'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Document Customizer & Live Generator
            </button>
            <button
              onClick={() => setActiveTab('metadata')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === 'metadata'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Metadata & Hash
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Audit Signatures
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-[11px] font-mono text-slate-400">
            <span>SHA-256: {sha256Hash.substring(0, 10)}...</span>
          </div>
        </div>

        {/* Scrollable Document Area with Interactive Split Screen */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-slate-950">
          {activeTab === 'document' ? (
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
              
              {/* Left Panel: The Certificate Generator Configurator */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <span className="font-bold text-white uppercase text-[11px] tracking-wider">Live Customizer</span>
                  </div>
                  <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                    Interactive Mode
                  </span>
                </div>

                {/* Form Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Document Subject / Title</label>
                    <input
                      type="text"
                      value={docTitle}
                      onChange={(e) => {
                        setDocTitle(e.target.value);
                        setSubject(e.target.value);
                      }}
                      className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500 font-medium"
                      placeholder="e.g. PR #95 Automated Audit Verification"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-400 font-bold">Document Reference ID</label>
                      <button
                        type="button"
                        onClick={handleRegenRef}
                        className="text-indigo-400 hover:text-indigo-300 font-bold font-mono text-[9px] flex items-center gap-1"
                      >
                        <RefreshCw className="h-2.5 w-2.5" /> Regen
                      </button>
                    </div>
                    <input
                      type="text"
                      value={docRef}
                      onChange={(e) => setDocRef(e.target.value)}
                      className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500 font-mono"
                      placeholder="e.g. OI/REF/2026/4825"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Introduction Paragraph</label>
                    <textarea
                      value={docIntro}
                      onChange={(e) => setDocIntro(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-950 text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500 font-medium"
                      placeholder="e.g. Verified milestone deliverable report..."
                    />
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2.5">
                    <span className="font-bold text-indigo-400 uppercase text-[10px] tracking-wide block">
                      Certificate Body Properties
                    </span>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Source Reference Link</label>
                      <input
                        type="text"
                        value={sourceRef}
                        onChange={(e) => setSourceRef(e.target.value)}
                        className="w-full bg-slate-900 text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-bold mb-1">Auditor Sign-off Comments</label>
                      <input
                        type="text"
                        value={signOff}
                        onChange={(e) => setSignOff(e.target.value)}
                        className="w-full bg-slate-900 text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500 font-medium"
                        placeholder="e.g. Confirmed compliant..."
                      />
                    </div>
                  </div>

                  {/* Automated Audit Checklist Customizer */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                    <span className="font-bold text-emerald-400 uppercase text-[10px] tracking-wide block">
                      Live Verification Metrics Checklist
                    </span>
                    <div className="space-y-1.5">
                      {checkpoints.map(cp => (
                        <label key={cp.id} className="flex items-center justify-between p-1.5 hover:bg-slate-900 rounded cursor-pointer select-none">
                          <span className="text-[11px] text-slate-300 font-medium">{cp.label}</span>
                          <input
                            type="checkbox"
                            checked={cp.passed}
                            onChange={() => toggleCheckpoint(cp.id)}
                            className="h-3.5 w-3.5 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-950 border-slate-800"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Signatories customizer */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2.5">
                    <span className="font-bold text-indigo-400 uppercase text-[10px] tracking-wide block">
                      Signatory Titles
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] text-slate-400 font-bold mb-1">Left Signatory</label>
                        <input
                          type="text"
                          value={signatoryLeftName}
                          onChange={(e) => setSignatoryLeftName(e.target.value)}
                          className="w-full bg-slate-900 text-white border border-slate-800 rounded-lg p-1.5 focus:outline-none text-[10px] font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-400 font-bold mb-1">Right Signatory</label>
                        <input
                          type="text"
                          value={signatoryRightName}
                          onChange={(e) => setSignatoryRightName(e.target.value)}
                          className="w-full bg-slate-900 text-white border border-slate-800 rounded-lg p-1.5 focus:outline-none text-[10px] font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Certification Stamp Customizer */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                    <span className="font-bold text-amber-500 uppercase text-[10px] tracking-wide block">
                      Auditor Seal Stamp
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      <input
                        type="text"
                        value={stamp1}
                        onChange={(e) => setStamp1(e.target.value.toUpperCase())}
                        className="bg-slate-900 text-white border border-slate-800 rounded p-1 text-[9px] font-bold text-center uppercase"
                        placeholder="STAMP 1"
                      />
                      <input
                        type="text"
                        value={stamp2}
                        onChange={(e) => setStamp2(e.target.value.toUpperCase())}
                        className="bg-slate-900 text-white border border-slate-800 rounded p-1 text-[9px] font-bold text-center uppercase"
                        placeholder="STAMP 2"
                      />
                      <input
                        type="text"
                        value={stamp3}
                        onChange={(e) => setStamp3(e.target.value.toUpperCase())}
                        className="bg-slate-900 text-white border border-slate-800 rounded p-1 text-[9px] font-bold text-center uppercase"
                        placeholder="STAMP 3"
                      />
                    </div>
                  </div>
                </div>

                {/* Secure Generator Action Block */}
                <div className="pt-2 border-t border-slate-800">
                  {isSealed ? (
                    <div className="bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-lg text-center space-y-1">
                      <div className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                        <span>Protocol Seal Secured!</span>
                      </div>
                      <p className="text-[9px] text-slate-400">
                        The cryptographic proof has been successfully generated and anchored.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsSealed(false)}
                        className="text-[9px] text-indigo-400 hover:text-indigo-300 font-bold underline mt-1"
                      >
                        Reset & Edit Content
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isGenerating}
                      onClick={handleGenerateSeal}
                      className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold uppercase tracking-wide text-[10px] rounded-lg shadow-lg flex items-center justify-center space-x-2 transition disabled:opacity-50 cursor-pointer"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 text-white animate-spin" />
                          <span>Sealing Record...</span>
                        </>
                      ) : (
                        <>
                          <Cpu className="h-3.5 w-3.5 text-indigo-200" />
                          <span>Generate Certified Seal</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Console Log Drawer during generation */}
                {(isGenerating || generationLogs.length > 0) && (
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[9px] text-slate-400 space-y-1 max-h-[140px] overflow-y-auto">
                    <div className="flex items-center gap-1 text-slate-300 font-bold border-b border-slate-900 pb-1 uppercase text-[8px] tracking-wider">
                      <Terminal className="h-3 w-3 text-indigo-400" />
                      <span>Audit Generation Log</span>
                    </div>
                    {generationLogs.map((log, idx) => (
                      <div key={idx} className="truncate">
                        <span className="text-indigo-500 font-bold">~ </span>
                        {log}
                      </div>
                    ))}
                    {isGenerating && (
                      <div className="text-indigo-400 font-bold animate-pulse">
                        &gt; Mining verifiable ledger slot...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Panel: The Stamped Certificate Document Canvas (Interactive Live Preview) */}
              <div className="relative">
                {/* Visual Scanner Glow during Generation */}
                {isGenerating && (
                  <div className="absolute inset-0 bg-indigo-600/10 rounded-xl border-2 border-indigo-500 animate-pulse flex items-center justify-center z-20 backdrop-blur-[1px] pointer-events-none">
                    <div className="bg-slate-900/90 p-4 rounded-xl text-center shadow-2xl border border-indigo-500/40 space-y-2 font-mono text-[10px]">
                      <Sparkles className="h-6 w-6 text-indigo-400 animate-spin mx-auto" />
                      <div className="font-extrabold text-white uppercase tracking-wider">Compiling Cryptographic Seal...</div>
                      <div className="text-indigo-300">Applying layout ratios and signing hash</div>
                    </div>
                  </div>
                )}

                {/* Actual Certificate Document */}
                <div id="verified-certificate" className="bg-white text-slate-900 p-6 sm:p-10 rounded-xl border-2 border-slate-200 shadow-xl relative overflow-hidden font-sans transition">
                  
                  {/* Official Stamp Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <div className="border-4 border-emerald-600/15 rounded-full p-8 transform -rotate-12 text-emerald-700/30 text-center font-mono text-xs uppercase font-extrabold tracking-widest scale-150">
                      <div>{stamp1 || 'VERIFIED PROOF'}</div>
                      <div>{stamp2 || 'OPENIMPACT REGISTRY'}</div>
                      <div>{stamp3 || '2026 AUDITED'}</div>
                    </div>
                  </div>

                  {/* Certified Immutable Seal Top Banner */}
                  {isSealed && (
                    <div className="absolute top-0 right-0 left-0 bg-emerald-600 text-white font-mono text-[9px] font-extrabold py-1.5 text-center uppercase tracking-widest z-30 flex items-center justify-center gap-1 shadow-sm">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>✨ Officially Locked, Sealed & Anchored to OpenImpact Ledger (SHA-256 Verified)</span>
                    </div>
                  )}

                  {/* Document Header */}
                  <div className={`border-b-2 border-slate-900 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10 ${isSealed ? 'pt-6' : ''}`}>
                    <div>
                      <div className="text-xs font-extrabold text-indigo-700 tracking-wider uppercase">
                        OpenImpact Public Goods Verification Registry
                      </div>
                      <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight uppercase mt-1">
                        {docTitle || 'Verifiable Milestone Deliverable'}
                      </h1>
                      <p className="text-xs text-slate-600 font-mono mt-0.5">
                        Document Ref: <span className="font-bold text-slate-900">{docRef || 'OI/REF/2026/4825'}</span> • Verified Proof Record
                      </p>
                    </div>
                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="logo-mark relative w-10 h-10 transform scale-75 origin-right">
                        <span className="logo-shape logo-blue absolute w-[22px] h-[36px] rounded-[14px_14px_14px_3px] rotate-[-28deg] left-[15px] top-[1px] bg-gradient-to-br from-indigo-600 to-purple-600" />
                        <span className="logo-shape logo-green absolute w-[22px] h-[36px] rounded-[14px_14px_14px_3px] rotate-[-28deg] left-[4px] top-[3px] bg-gradient-to-br from-emerald-500 to-teal-500 opacity-95" />
                      </div>
                      <div className="text-left">
                        <div className="text-xl font-black tracking-tight text-slate-900 leading-none">Open Impact</div>
                        <div className="mt-1 text-slate-500 text-[10px] font-bold uppercase tracking-wider">Protocol Record</div>
                      </div>
                    </div>
                  </div>

                  {/* Document Body Content */}
                  <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed font-serif text-left">
                    <div className="border-y border-slate-200/60 py-3 font-sans text-[10px] uppercase tracking-wider text-slate-500 font-bold grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-slate-400">Date of Record:</span>
                        <span className="text-slate-800 font-black">September 27, 2026</span>
                      </div>
                      <div>
                        <span className="block text-slate-400">Auditing Body:</span>
                        <span className="text-slate-800 font-black">OpenProof Protocol Auditing Board</span>
                      </div>
                    </div>

                    <p className="font-bold text-slate-900 mt-2 text-sm font-sans uppercase tracking-tight">
                      SUBJECT: OFFICIAL COMPLIANCE CERTIFICATION & ESCROW RELEASE REPORT
                    </p>

                    <p className="text-slate-700">
                      This formal certification letter serves as an official cryptographic and physical audit record for the milestone deliverable submitted under document reference <span className="font-mono font-bold text-slate-950 bg-slate-100 px-1 py-0.5 rounded">{docRef}</span>. The OpenProof Protocol Auditing Board, operating under the non-profit 501(c)(6) fiscal oversight guidelines of OpenImpact Global, has completed its multi-stage consensus review.
                    </p>

                    <p className="text-slate-700">
                      The scope of this audit encompassed:
                      <br />
                      <span className="font-semibold text-slate-900">
                        {docIntro || 'Verification of complete milestone criteria execution, automated check of decentralized funding escrow accounts, and validation of peer-reviewed contribution outputs.'}
                      </span>
                    </p>

                    <p className="text-slate-700">
                      Based on our technical inspection, peer-consensus validations, and cryptographic ledger verifications, we confirm that all deliverables are complete and aligned with the project's public goods grant requirements. No discrepancies, waste, or fund diversions were found. Consequently, we recommend the immediate release of milestone-gated escrow capital to the authorized project maintainer node.
                    </p>

                    {/* Standard Key Properties Card */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-sans space-y-2 text-xs relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <strong className="text-slate-500 uppercase text-[9px] block">Document Subject:</strong>
                          <span className="font-bold text-slate-900 text-xs mt-0.5 block">{subject || 'PR #95 Automated Audit Verification'}</span>
                        </div>
                        <div>
                          <strong className="text-slate-500 uppercase text-[9px] block">Source Reference:</strong>
                          <a href={sourceRef} target="_blank" rel="noopener noreferrer" className="font-mono text-indigo-600 text-xs mt-0.5 block truncate hover:underline">
                            {sourceRef || 'https://github.com/open-impact/...'}
                          </a>
                        </div>
                        <div>
                          <strong className="text-slate-500 uppercase text-[9px] block">Auditor Sign-off:</strong>
                          <span className="font-medium text-slate-800 text-xs mt-0.5 block italic">"{signOff || 'Confirmed compliant...'}"</span>
                        </div>
                      </div>
                    </div>

                    {/* Checkpoints Status List */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-sans space-y-2 mt-4 relative z-10">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide border-b pb-1 flex items-center justify-between">
                        <span>Automated Validation Metrics & Consensus Criteria</span>
                        <span className="text-[9px] font-mono font-bold text-indigo-700">Consensus Achieved</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                        {checkpoints.map(cp => (
                          <div key={cp.id} className="flex items-center space-x-2 text-slate-700">
                            <span className={`text-sm ${cp.passed ? 'text-emerald-600' : 'text-rose-500'} font-bold`}>
                              {cp.passed ? '✓' : '✗'}
                            </span>
                            <span className={cp.passed ? 'font-medium text-slate-800' : 'line-through text-slate-400'}>
                              {cp.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Signatures & Stamps Block */}
                    <div className="pt-6 mt-6 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans text-xs relative z-10">
                      <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="font-bold text-slate-500 uppercase text-[10px] mb-2 tracking-wider">Authorized Signatory:</div>
                        <div className="font-serif italic text-base text-indigo-950 font-bold mb-1">
                          {signatoryLeftName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{signatoryLeftTitle}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Timestamp: 2026 Audited</div>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="font-bold text-slate-500 uppercase text-[10px] mb-2 tracking-wider">Verified by Inspector:</div>
                        <div className="font-serif italic text-base text-emerald-950 font-bold mb-1">
                          {signatoryRightName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{signatoryRightTitle}</div>
                        <div className={`text-[10px] font-mono font-bold flex items-center gap-1 mt-0.5 ${
                          isSealed ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          <CheckCircle2 className="h-3 w-3" /> Status: {isSealed ? 'Verified & Approved' : 'Draft (Awaiting Seal)'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'metadata' ? (
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
              <div className="text-slate-300 font-bold uppercase text-xs">Cryptographic OpenProof Record</div>
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div>
                  <span className="text-slate-500">Document URL: </span>
                  <span className="text-indigo-400 font-bold">{sourceRef}</span>
                </div>
                <div>
                  <span className="text-slate-500">Document Title: </span>
                  <span className="text-white">{docTitle}</span>
                </div>
                <div>
                  <span className="text-slate-500">SHA-256 Hash: </span>
                  <span className="text-emerald-400 font-bold break-all">
                    {sha256Hash}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Auditor Timestamp: </span>
                  <span className="text-slate-300">2026-04-02T14:22:18.000Z</span>
                </div>
                <div>
                  <span className="text-slate-500">Fiscal Sponsor: </span>
                  <span className="text-slate-300">OpenImpact Foundation (501c6)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="text-slate-300 font-bold uppercase text-xs font-mono">Peer Review & Signature Consensus</div>
              <div className="space-y-2">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{signatoryRightName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{signatoryRightTitle}</div>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    Approved
                  </span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Project Collective Admin</div>
                    <div className="text-[10px] text-slate-400 font-mono">Submitter & Beneficiary Signatory</div>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    Verified Submitter
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400">
            OpenProof Document Verification Engine • Active Record
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg border border-slate-700 flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center space-x-1.5 shadow-md animate-pulse"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Document / Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
