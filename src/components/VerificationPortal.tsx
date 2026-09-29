import React, { useState, useEffect } from 'react';
import { Project, Evidence, UserProfile } from '../types';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { 
  ShieldCheck, 
  GitPullRequest, 
  Database, 
  Activity, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  AlertTriangle,
  ExternalLink, 
  ChevronRight, 
  Check, 
  Scale, 
  MessageSquare, 
  Plus, 
  Search, 
  UserCheck, 
  Award, 
  Terminal, 
  Fingerprint, 
  ArrowRight, 
  Building2, 
  FileCheck, 
  Download, 
  Copy,
  Sliders,
  History,
  TrendingUp,
  Lock,
  Unlock
} from 'lucide-react';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Verification Request Type matching types.ts
export interface VerificationRequest {
  id: string;
  source: string;
  sourceId: string;
  projectTitle: string;
  submittedBy: string;
  createdAt: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Approved' | 'Rejected';
  documentUrl?: string;
  auditStepsCompleted?: string[];
  auditorComments?: string;
  auditedBy?: string;
  auditedAt?: string;
  reputationAllocated?: number;
  metadata?: Record<string, any>;
}

interface VerificationPortalProps {
  projects: Project[];
  currentUser: UserProfile | null;
  onOpenProofVerification?: () => void;
  onOpenDocumentViewer?: (url?: string, title?: string) => void;
  onViewLedger?: () => void;
}

const INITIAL_REQUESTS: VerificationRequest[] = [
  {
    id: 'vr_gh_1',
    source: 'GitHub Pull Request',
    sourceId: 'PR #412',
    projectTitle: 'Build a Community Technology Center Tokyo',
    submittedBy: '@octocat_dev',
    createdAt: '2026-09-26',
    description: 'Milestone 2 Deliverable: Implemented peer-to-peer routing algorithm and loaded open-source IoT telemetry stack.',
    status: 'Pending',
    documentUrl: 'https://github.com/open-impact/community-tech/pull/412',
    metadata: { linesAdded: 1420, linesDeleted: 240, passedCi: true, authorReputation: 85 }
  },
  {
    id: 'vr_edu_1',
    source: 'Academic Registry',
    sourceId: 'CERT #7729',
    projectTitle: 'Global Digital Literacy Bootcamp Berlin',
    submittedBy: '@dr_schmidt',
    createdAt: '2026-09-25',
    description: 'Proof of Graduation: Official digital certificates and learning metrics for 45 female engineering graduates in Berlin.',
    status: 'Pending',
    documentUrl: 'https://openimpact.io/certs/berlin-literacy-2026.pdf',
    metadata: { verifiedGraduates: 45, bootcampDuration: '12 weeks', institution: 'Technical University of Berlin' }
  },
  {
    id: 'vr_env_1',
    source: 'Environmental IoT Sensor',
    sourceId: 'NODE-CO2-99',
    projectTitle: 'Amazon Rainforest Protection & Carbon Offset',
    submittedBy: '@sensor_daemon_bot',
    createdAt: '2026-09-27',
    description: 'CO2 Absorption Telemetry: Real-time sensor logs demonstrating 120 kg CO2 capture metrics over the 30-day incubation cycle in Amazonas, Brazil.',
    status: 'Pending',
    documentUrl: 'https://api.openimpact.io/sensors/co2-99-telemetry',
    metadata: { co2AbsorbedKg: 120, sensorConfidence: '99.8%', activeHours: 720 }
  },
  {
    id: 'vr_land_1',
    source: 'Land Tenure Register',
    sourceId: 'REG-LAND-904',
    projectTitle: 'Andean High-Yield Agritech Cooperative',
    submittedBy: '@andean_coop',
    createdAt: '2026-09-24',
    description: 'Land Occupancy Authorization: Government-certified certificate of occupancy and lease confirmation for the 5-hectare training site in Cusco, Peru.',
    status: 'Approved',
    documentUrl: 'https://openimpact.io/evidence/doc-lease-cusco.pdf',
    auditStepsCompleted: ['Source Identity Check', 'Data Integrity Match', 'Compliance Assessment'],
    auditorComments: 'Certified and validated against the Cusco Land Registry database. The lease deed is signed, notarized, and fully tax-compliant.',
    auditedBy: '@sarah_chen',
    auditedAt: '2026-09-25',
    reputationAllocated: 10,
    metadata: { parcelSizeHectares: 5.0, zoningPermission: 'Agricultural-Educational', validityYears: 15 }
  },
  {
    id: 'vr_fin_1',
    source: 'Financial Invoice / Receipt',
    sourceId: 'REC-INV-502',
    projectTitle: 'Off-Grid Solar Network Central America',
    submittedBy: '@solar_host_latam',
    createdAt: '2026-09-23',
    description: 'Milestone 1 Procurement: Audited commercial invoice and proof-of-payment for 12 Lithium-ion solar battery storage packs in San Jose, Costa Rica.',
    status: 'Approved',
    documentUrl: 'https://openimpact.io/receipts/procure-solar-12.pdf',
    auditStepsCompleted: ['Source Identity Check', 'Data Integrity Match', 'Compliance Assessment'],
    auditorComments: 'Procurement receipts match the declared bank disbursement from the Milestone Escrow Vault. All serial numbers verified on-site by regional inspectors.',
    auditedBy: '@devon_vance',
    auditedAt: '2026-09-24',
    reputationAllocated: 8,
    metadata: { invoiceTotalUSD: 4800, supplier: 'SolarTech Logistics San Jose', itemsProcured: 12 }
  }
];

export const VerificationPortal: React.FC<VerificationPortalProps> = ({ 
  projects, 
  currentUser,
  onOpenProofVerification, 
  onOpenDocumentViewer, 
  onViewLedger 
}) => {
  // Dual-mode View: 'audits' (Verification Portal Workflow) or 'registry' (Vetted Evidence Registry)
  const [activePortalTab, setActivePortalTab] = useState<'audits' | 'registry'>('audits');
  
  // Real-time Requests from Firestore
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true);

  // Search & Filter state for requests
  const [requestsSearch, setRequestsSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [evidenceTypeFilter, setEvidenceTypeFilter] = useState<string>('All');
  const [projectStatusFilter, setProjectStatusFilter] = useState<string>('All');

  // Multi-step Audit workflow modal state
  const [activeAuditRequest, setActiveAuditRequest] = useState<VerificationRequest | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [step1Passed, setStep1Passed] = useState<boolean>(false);
  const [step2Passed, setStep2Passed] = useState<boolean>(false);
  const [step3Passed, setStep3Passed] = useState<boolean>(false);
  const [auditorComments, setAuditorComments] = useState<string>('');
  const [reputationAllocated, setReputationAllocated] = useState<number>(5);
  const [auditSubmitting, setAuditSubmitting] = useState<boolean>(false);
  const [auditSuccess, setAuditSuccess] = useState<boolean>(false);
  // Auditor Authorization & Gating State
  const [auditorCredentialUnlocked, setAuditorCredentialUnlocked] = useState<boolean>(() => {
    return typeof window !== 'undefined' && localStorage.getItem('is_peer_reviewer') === 'true';
  });
  const [auditorKeyInput, setAuditorKeyInput] = useState<string>('');
  const [auditorKeyError, setAuditorKeyError] = useState<string>('');

  // Check if current user is inherently authorized by role or proven community impact
  const isPrivilegedRole = currentUser?.role === 'grant_admin' || currentUser?.role === 'organization';
  const hasHighReputation = (currentUser?.reputation?.impactScore ?? 0) >= 50;
  const isAuditorAuthorized = Boolean(isPrivilegedRole || hasHighReputation || auditorCredentialUnlocked);

  // Conflict of Interest Protection: Submitter cannot audit or approve their own submission
  const isSelfAudit = Boolean(
    activeAuditRequest &&
    currentUser &&
    activeAuditRequest.submittedBy &&
    currentUser.handle &&
    activeAuditRequest.submittedBy.toLowerCase().replace('@', '').trim() === currentUser.handle.toLowerCase().replace('@', '').trim()
  );

  const handleUnlockAuditor = (codeOverride?: string) => {
    const code = (codeOverride || auditorKeyInput).trim().toUpperCase();
    const validCodes = ['AUDIT-PRO-2026', 'VERIFIED-AUDITOR', 'GOV-501C6-SIGNER', 'PEER-REVIEW-INVITE'];
    if (validCodes.includes(code)) {
      if (typeof window !== 'undefined') localStorage.setItem('is_peer_reviewer', 'true');
      setAuditorCredentialUnlocked(true);
      setAuditorKeyError('');
    } else {
      setAuditorKeyError('Invalid auditor key. Please use an authorized passkey or invite token.');
    }
  };

  // Register New Source Modal state
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [newRequestProj, setNewRequestProj] = useState<string>('');
  const [newRequestSource, setNewRequestSource] = useState<string>('GitHub Pull Request');
  const [newRequestSourceId, setNewRequestSourceId] = useState<string>('');
  const [newRequestDesc, setNewRequestDesc] = useState<string>('');
  const [newRequestUrl, setNewRequestUrl] = useState<string>('');
  const [newRequestMetaKey, setNewRequestMetaKey] = useState<string>('');
  const [newRequestMetaVal, setNewRequestMetaVal] = useState<string>('');
  const [registerSubmitting, setRegisterSubmitting] = useState<boolean>(false);

  // Vetted Registry States (the original OpenProofInspector capabilities)
  const [registrySearch, setRegistrySearch] = useState<string>('');
  const [registryType, setRegistryType] = useState<string>('All');
  const [inspectEvidence, setInspectEvidence] = useState<(Evidence & { projectName: string; hash?: string; timeAgo?: string; reviewerSigs?: string[] }) | null>(null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [certDownloaded, setCertDownloaded] = useState<boolean>(false);

  // 1. Sync Verification Requests from Firestore Real-time
  useEffect(() => {
    const requestsColRef = collection(db, 'verification_requests');
    const unsubscribe = onSnapshot(requestsColRef, (snapshot) => {
      if (snapshot.empty) {
        // Seed database if empty with original pending and approved verifications
        INITIAL_REQUESTS.forEach(async (req) => {
          try {
            await setDoc(doc(db, 'verification_requests', req.id), req);
          } catch (e) {
            console.error('Failed to seed verification request:', e);
          }
        });
      } else {
        const loadedRequests: VerificationRequest[] = [];
        snapshot.forEach((docSnap) => {
          loadedRequests.push(docSnap.data() as VerificationRequest);
        });
        // Sort: newest first
        loadedRequests.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setRequests(loadedRequests);
      }
      setLoadingRequests(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'verification_requests');
    });

    return () => unsubscribe();
  }, []);

  // 2. Original OpenProofInspector Evidence Setup
  const allVettedEvidence = projects.flatMap((p) =>
    (p.evidence || []).map((ev, idx) => ({
      ...ev,
      projectName: p.title,
      hash: `0x${((idx + 1) * 897123491).toString(16).padEnd(40, 'a8b9f0c1d2e3')}`,
      timeAgo: idx % 2 === 0 ? '2 hours ago' : '1 day ago',
      reviewerSigs: ['Dr. Maya Lin (Tech Lead)', 'Kareem Adeyemi (Auditor)', 'Fiscal Custodian Node'],
    }))
  );

  const filteredVettedEvidence = allVettedEvidence.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(registrySearch.toLowerCase()) ||
      ev.projectName.toLowerCase().includes(registrySearch.toLowerCase()) ||
      ev.submittedBy.toLowerCase().includes(registrySearch.toLowerCase());
    const matchesType = registryType === 'All' || ev.type === registryType;
    return matchesSearch && matchesType;
  });

  // Calculate filter counts for the pending backlog
  const pendingRequestsCount = requests.filter((r) => r.status === 'Pending').length;
  const approvedRequestsCount = requests.filter((r) => r.status === 'Approved').length;

  // Filter verification requests based on searches
  const filteredRequests = requests.filter((req) => {
    const matchesSearch = 
      req.projectTitle.toLowerCase().includes(requestsSearch.toLowerCase()) ||
      req.description.toLowerCase().includes(requestsSearch.toLowerCase()) ||
      req.submittedBy.toLowerCase().includes(requestsSearch.toLowerCase()) ||
      req.sourceId.toLowerCase().includes(requestsSearch.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchesSource = sourceFilter === 'All' || req.source === sourceFilter;

    const matchesEvidenceType = evidenceTypeFilter === 'All' || (() => {
      if (evidenceTypeFilter === 'Pull Request') return req.source === 'GitHub Pull Request';
      if (evidenceTypeFilter === 'Invoice') return req.source === 'Financial Invoice / Receipt';
      if (evidenceTypeFilter === 'Lease') return req.source === 'Land Tenure Register';
      if (evidenceTypeFilter === 'Certificate') return req.source === 'Academic Registry';
      if (evidenceTypeFilter === 'Sensor Data') return req.source === 'Environmental IoT Sensor';
      return false;
    })();

    const matchesProjectStatus = projectStatusFilter === 'All' || (() => {
      const matchedProj = projects.find(p => p.title.toLowerCase() === req.projectTitle.toLowerCase());
      const projStatus = matchedProj ? matchedProj.status : 'In Progress'; // Default fallback
      return projStatus === projectStatusFilter;
    })();

    return matchesSearch && matchesStatus && matchesSource && matchesEvidenceType && matchesProjectStatus;
  });

  // Handle Multi-step Audit Submit Action
  const handleCommitAudit = async (resolution: 'Approved' | 'Rejected') => {
    if (!activeAuditRequest) return;

    if (isSelfAudit) {
      alert('Conflict of Interest: You submitted this deliverable and cannot audit or approve your own work.');
      return;
    }

    if (!isAuditorAuthorized) {
      alert('Privileged Action Gated: You need authorized auditor credentials to reject or approve milestone deliverables.');
      return;
    }

    if (auditorComments.trim().length < 10) {
      alert('Auditor comments must be at least 10 characters long to provide a valid audit trail.');
      return;
    }

    setAuditSubmitting(true);
    const updatedSteps = [];
    if (step1Passed) updatedSteps.push('Source Identity Checked');
    if (step2Passed) updatedSteps.push('Data Integrity Verified');
    if (step3Passed) updatedSteps.push('Compliance Audited');

    const updatedRequest: Partial<VerificationRequest> = {
      status: resolution,
      auditStepsCompleted: updatedSteps,
      auditorComments: auditorComments.trim(),
      auditedBy: currentUser?.handle || '@anonymous_auditor',
      auditedAt: new Date().toISOString().split('T')[0],
      reputationAllocated: resolution === 'Approved' ? reputationAllocated : -reputationAllocated,
    };

    try {
      await setDoc(doc(db, 'verification_requests', activeAuditRequest.id), {
        ...activeAuditRequest,
        ...updatedRequest
      }, { merge: true });
      
      setAuditSuccess(true);
      setTimeout(() => {
        // Reset and close modal
        setActiveAuditRequest(null);
        setAuditSuccess(false);
        setCurrentStep(1);
        setStep1Passed(false);
        setStep2Passed(false);
        setStep3Passed(false);
        setAuditorComments('');
        setReputationAllocated(5);
      }, 3000);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `verification_requests/${activeAuditRequest.id}`);
    } finally {
      setAuditSubmitting(false);
    }
  };

  // Handle New Audit Request Registration Submit
  const handleRegisterSourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestProj || !newRequestSourceId || !newRequestDesc) {
      alert('Please fill out all required fields.');
      return;
    }

    setRegisterSubmitting(true);
    const customMeta: Record<string, any> = {};
    if (newRequestMetaKey && newRequestMetaVal) {
      customMeta[newRequestMetaKey] = newRequestMetaVal;
    }

    const newReq: VerificationRequest = {
      id: `vr_${Date.now()}`,
      source: newRequestSource,
      sourceId: newRequestSourceId,
      projectTitle: newRequestProj,
      submittedBy: currentUser?.handle || '@external_contributor',
      createdAt: new Date().toISOString().split('T')[0],
      description: newRequestDesc,
      status: 'Pending',
      documentUrl: newRequestUrl || undefined,
      metadata: Object.keys(customMeta).length > 0 ? customMeta : undefined
    };

    try {
      await setDoc(doc(db, 'verification_requests', newReq.id), newReq);
      setShowRegisterModal(false);
      // Reset form fields
      setNewRequestProj('');
      setNewRequestSource('GitHub Pull Request');
      setNewRequestSourceId('');
      setNewRequestDesc('');
      setNewRequestUrl('');
      setNewRequestMetaKey('');
      setNewRequestMetaVal('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `verification_requests/${newReq.id}`);
    } finally {
      setRegisterSubmitting(false);
    }
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-12 pb-20 font-sans text-slate-900 bg-white">
      {/* 1. Header Hero with Stats */}
      <section className="relative pt-8 pb-4 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-bold shadow-xs">
              <ShieldCheck className="h-4 w-4 text-indigo-600 mr-1" />
              <span>OpenProof Consensus Workspace v2.5</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Evidence & <span className="text-indigo-900">Verification</span>
            </h1>
            <p className="text-base text-slate-600 max-w-2xl font-medium leading-relaxed">
              Varnish the barrier between claims and reality. Browse raw cryptographic inputs, audit land tenancy leases, or evaluate software pull requests through the peer-consensus validator network.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 shrink-0">
            <button 
              onClick={() => {
                // Pre-fill active project list if we have any
                if (projects.length > 0) {
                  setNewRequestProj(projects[0].title);
                }
                setShowRegisterModal(true);
              }}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Register External Source</span>
            </button>
            <button 
              onClick={onViewLedger}
              className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              Global Funding Ledger
            </button>
          </div>
        </div>

        {/* Dynamic Core Counter Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 bg-slate-50 p-6 rounded-3xl border border-slate-200/60 shadow-xs">
          <div className="text-center md:text-left space-y-1 p-3">
            <div className="text-slate-500 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center md:justify-start">
              <Activity className="h-4 w-4 text-indigo-500 mr-1.5" />
              <span>Consensus Queue</span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">{pendingRequestsCount} Pending</div>
            <p className="text-[10px] text-slate-400 font-medium">Awaiting peer audits</p>
          </div>
          <div className="text-center md:text-left space-y-1 p-3 border-l border-slate-200">
            <div className="text-slate-500 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center md:justify-start">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-1.5" />
              <span>Vetted Audits</span>
            </div>
            <div className="text-2xl font-black text-emerald-600 font-mono">{approvedRequestsCount} Approved</div>
            <p className="text-[10px] text-slate-400 font-medium">Fully validated records</p>
          </div>
          <div className="text-center md:text-left space-y-1 p-3 border-l border-slate-200">
            <div className="text-slate-500 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center md:justify-start">
              <Award className="h-4 w-4 text-purple-500 mr-1.5" />
              <span>Reputation Paid</span>
            </div>
            <div className="text-2xl font-black text-purple-700 font-mono">+140 points</div>
            <p className="text-[10px] text-slate-400 font-medium">Escrow tranches cleared</p>
          </div>
          <div className="text-center md:text-left space-y-1 p-3 border-l border-slate-200">
            <div className="text-slate-500 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center md:justify-start">
              <FileCheck className="h-4 w-4 text-sky-500 mr-1.5" />
              <span>Immutable Ledger</span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">{allVettedEvidence.length} Proofs</div>
            <p className="text-[10px] text-slate-400 font-medium">SHA-256 artifacts online</p>
          </div>
        </div>
      </section>

      {/* 2. Toggle Navigation Tabs for workspace */}
      <section className="max-w-7xl mx-auto">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActivePortalTab('audits')}
            className={`py-4 px-6 font-bold text-sm tracking-tight border-b-2 transition flex items-center space-x-2 cursor-pointer ${
              activePortalTab === 'audits'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="h-4 w-4" />
            <span>Auditor Workbench ({filteredRequests.length})</span>
            {pendingRequestsCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1.5 animate-pulse font-mono font-bold">
                {pendingRequestsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActivePortalTab('registry')}
            className={`py-4 px-6 font-bold text-sm tracking-tight border-b-2 transition flex items-center space-x-2 cursor-pointer ${
              activePortalTab === 'registry'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Fingerprint className="h-4 w-4" />
            <span>Verified Proofs Registry ({filteredVettedEvidence.length})</span>
          </button>
        </div>
      </section>

      {/* 3. Render Tab Content */}
      <section className="max-w-7xl mx-auto">
        {activePortalTab === 'audits' ? (
          /* WORKBENCH VIEW */
          <div className="space-y-6">
            {/* Workbench Filter Toolbar */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search project audits, contributors, source IDs..."
                  value={requestsSearch}
                  onChange={(e) => setRequestsSearch(e.target.value)}
                  className="w-full bg-white text-slate-900 text-sm pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Status selector */}
                <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-slate-700 text-xs font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="All">All statuses</option>
                    <option value="Pending">Pending Audit</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected / Flagged</option>
                  </select>
                </div>

                {/* Evidence Type Selector */}
                <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Evidence Type</span>
                  <select
                    value={evidenceTypeFilter}
                    onChange={(e) => setEvidenceTypeFilter(e.target.value)}
                    className="bg-transparent text-slate-700 text-xs font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="All">All types</option>
                    <option value="Pull Request">Pull Request</option>
                    <option value="Invoice">Invoice</option>
                    <option value="Lease">Lease</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Sensor Data">Sensor Data</option>
                  </select>
                </div>

                {/* Project Status Selector */}
                <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project Status</span>
                  <select
                    value={projectStatusFilter}
                    onChange={(e) => setProjectStatusFilter(e.target.value)}
                    className="bg-transparent text-slate-700 text-xs font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="All">All project statuses</option>
                    <option value="Funding">Funding</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Verified">Verified</option>
                  </select>
                </div>

                {/* Source selector */}
                <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source</span>
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="bg-transparent text-slate-700 text-xs font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Sources</option>
                    <option value="GitHub Pull Request">GitHub PRs</option>
                    <option value="Academic Registry">Academic Certs</option>
                    <option value="Environmental IoT Sensor">Environmental IoT</option>
                    <option value="Land Tenure Register">Land Leases</option>
                    <option value="Financial Invoice / Receipt">Financial Receipts</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Verification Requests Grid */}
            {loadingRequests ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-slate-500 font-medium">Syncing consensus workspace with Firestore...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl">
                <AlertCircle className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No requests found</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">No verification requests match your filter. Register an external source above to add one.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white border border-slate-100 shadow-xs hover:shadow-md transition duration-350 rounded-3xl p-6 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Source type & status */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5">
                          {req.source === 'GitHub Pull Request' && <GitPullRequest className="h-3.5 w-3.5 text-indigo-500" />}
                          {req.source === 'Environmental IoT Sensor' && <Activity className="h-3.5 w-3.5 text-emerald-500" />}
                          {req.source === 'Land Tenure Register' && <Building2 className="h-3.5 w-3.5 text-sky-500" />}
                          {req.source === 'Financial Invoice / Receipt' && <FileCheck className="h-3.5 w-3.5 text-purple-500" />}
                          {req.source === 'Academic Registry' && <Award className="h-3.5 w-3.5 text-blue-500" />}
                          <span>{req.source}</span>
                        </span>

                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border flex items-center space-x-1 ${
                          req.status === 'Pending'
                            ? 'text-amber-700 bg-amber-50 border-amber-200'
                            : req.status === 'Approved'
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : 'text-rose-700 bg-rose-50 border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            req.status === 'Pending' ? 'bg-amber-500' : req.status === 'Approved' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`} />
                          <span>{req.status === 'Pending' ? 'Pending Audit' : req.status}</span>
                        </span>
                      </div>

                      {/* Request Info */}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                          <span>{req.sourceId}</span>
                        </div>
                        <h3 className="text-base font-bold text-slate-950 line-clamp-1">
                          {req.projectTitle}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold line-clamp-2">
                          {req.description}
                        </p>
                      </div>

                      {/* Display Custom Metadata inside request item */}
                      {req.metadata && (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500">
                          {Object.entries(req.metadata).map(([k, v]) => (
                            <div key={k} className="truncate">
                              <span className="text-slate-400 font-bold">{k}:</span>{' '}
                              <span className="text-slate-700 font-black">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Auditor result preview if audited */}
                      {req.status !== 'Pending' && req.auditorComments && (
                        <div className="p-3 bg-slate-50 border-l-4 border-indigo-500 rounded-r-xl space-y-1 text-xs">
                          <p className="font-bold text-slate-800 flex items-center">
                            <UserCheck className="h-3.5 w-3.5 text-indigo-500 mr-1.5" />
                            <span>Audited by {req.auditedBy}</span>
                          </p>
                          <p className="text-slate-500 italic line-clamp-2 font-medium">"{req.auditorComments}"</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2 truncate">
                        <div className="w-7 h-7 rounded-full bg-slate-950 text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-xs">
                          {req.submittedBy.replace('@', '').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-700 font-bold text-[10px] truncate">
                          by {req.submittedBy}
                        </span>
                      </div>

                      {req.status === 'Pending' ? (
                        <button
                          onClick={() => {
                            setActiveAuditRequest(req);
                            setCurrentStep(1);
                            setStep1Passed(false);
                            setStep2Passed(false);
                            setStep3Passed(false);
                            setAuditorComments('');
                            setReputationAllocated(5);
                          }}
                          className="px-4 py-2 bg-[#111827] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-1"
                        >
                          <span>Launch Audit</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (onOpenDocumentViewer && req.documentUrl) {
                              onOpenDocumentViewer(req.documentUrl, `Raw External Source: ${req.sourceId}`);
                            } else if (req.documentUrl) {
                              window.open(req.documentUrl, '_blank');
                            } else {
                              alert('No raw document URL associated with this proof.');
                            }
                          }}
                          className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer flex items-center space-x-1"
                        >
                          <span>View Artifact</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* VETTED REGISTRY VIEW (Original OpenProofInspector content) */
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search certified public proofs, PR numbers, SHA-256 signatures..."
                  value={registrySearch}
                  onChange={(e) => setRegistrySearch(e.target.value)}
                  className="w-full bg-white text-slate-900 text-sm pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                />
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar max-w-full">
                {(['All', 'Pull Request', 'Photo / Media', 'Report / Document'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setRegistryType(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
                      registryType === t
                        ? 'bg-[#111827] text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{t}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-lg font-mono ${
                      registryType === t ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {t === 'All' ? allVettedEvidence.length : allVettedEvidence.filter((e) => e.type === t).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Evidence Registry list */}
            {filteredVettedEvidence.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
                <Fingerprint className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No cryptographic artifacts found</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">No vetted records match your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVettedEvidence.map((ev) => (
                  <div
                    key={ev.id}
                    className="bg-white border border-slate-100 shadow-xs hover:shadow-md transition rounded-3xl p-6 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center space-x-1.5">
                          {ev.type === 'Pull Request' && <GitPullRequest className="h-3.5 w-3.5 text-indigo-500" />}
                          {ev.type === 'Photo / Media' && <FileText className="h-3.5 w-3.5 text-emerald-500" />}
                          {ev.type === 'Report / Document' && <FileText className="h-3.5 w-3.5 text-blue-500" />}
                          {ev.type === 'Invoice / Receipt' && <FileCheck className="h-3.5 w-3.5 text-purple-500" />}
                          <span>{ev.type}</span>
                        </span>

                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center space-x-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{ev.status === 'Verified' ? 'Verified 3/3 Sigs' : ev.status}</span>
                        </span>
                      </div>

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

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-[9px] text-slate-500 flex items-center justify-between">
                        <span className="truncate max-w-[190px]">SHA-256: {ev.hash}</span>
                        <span className="text-slate-400 shrink-0 ml-1">{ev.timeAgo}</span>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2 truncate">
                        <div className="w-8 h-8 rounded-full bg-slate-950 text-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-xs">
                          {ev.submittedBy.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-700 font-bold text-[11px] truncate">
                          {ev.submittedBy}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setInspectEvidence(ev)}
                        className="py-2 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition shadow-2xs cursor-pointer flex items-center space-x-1.5"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 4. Multi-Step Audit Workstation Modal */}
      {activeAuditRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-left my-8 space-y-6 relative transition-all">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">Peer Audit Workstation</h3>
                  <p className="text-xs text-slate-500 font-mono">Consensus Session ID: #{activeAuditRequest.id.toUpperCase()}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveAuditRequest(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Audit Status Panel */}
            {auditSuccess ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-black scale-110 animate-bounce">
                  ✓
                </div>
                <h4 className="text-xl font-black text-slate-900">Audit Committed Successfully!</h4>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Consensus cryptographically saved to Firestore. Reputed balances updated, and milestone release authorization signed.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* 4 Steps Segmented Progress Indicator */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { nr: 1, label: 'Identity' },
                    { nr: 2, label: 'Data Match' },
                    { nr: 3, label: 'Compliance' },
                    { nr: 4, label: 'Commit' }
                  ].map((s) => (
                    <div key={s.nr} className="space-y-1.5">
                      <div className={`h-2 rounded-full transition duration-300 ${
                        currentStep >= s.nr ? 'bg-indigo-600' : 'bg-slate-200'
                      }`} />
                      <div className="flex items-center space-x-1.5 justify-center md:justify-start">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md font-mono ${
                          currentStep === s.nr ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {s.nr}
                        </span>
                        <span className="hidden md:inline text-[10px] font-black text-slate-500 uppercase tracking-tight">{s.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Left details pane / Right interactive step checks */}
                <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black bg-indigo-100 border border-indigo-200 text-indigo-700 px-2.5 py-1 rounded-lg">
                      {activeAuditRequest.source}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{activeAuditRequest.sourceId}</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{activeAuditRequest.projectTitle}</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">"{activeAuditRequest.description}"</p>
                </div>

                {/* RENDER ACTIVE STEP */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-950 uppercase tracking-tight">Step 1: Cryptographic Origin & Identity Check</h4>
                      <p className="text-xs text-slate-500">Verify that the submitting handle and registry origin matches a real authorized developer node or 501(c)(6) project affiliate.</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3 font-mono text-[11px] text-slate-600">
                      <div><span className="text-slate-400 font-bold">Origin Host:</span> openimpact.auth-node.v2</div>
                      <div><span className="text-slate-400 font-bold">Digital Signature:</span> SHA256-R980X-{(activeAuditRequest.id)}</div>
                      <div><span className="text-slate-400 font-bold">Submitting ID:</span> {activeAuditRequest.submittedBy}</div>
                    </div>

                    <label className="flex items-start space-x-3 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-2xl p-4 transition cursor-pointer">
                      <input
                        type="checkbox"
                        checked={step1Passed}
                        onChange={(e) => setStep1Passed(e.target.checked)}
                        className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5 cursor-pointer"
                      />
                      <div>
                        <span className="block text-xs font-black text-slate-900">Pass Step 1: Origin Identity Match Valid</span>
                        <span className="block text-[10px] text-indigo-700 font-medium mt-0.5">I certify that the cryptographic signature matches the authorized public key of {activeAuditRequest.submittedBy}.</span>
                      </div>
                    </label>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-950 uppercase tracking-tight">Step 2: Deliverable Metrics & Cross-matching</h4>
                      <p className="text-xs text-slate-500">Cross-examine the metrics of the submitted source with the physical goals of the project milestones to prevent shadow accounting.</p>
                    </div>

                    {activeAuditRequest.metadata ? (
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 font-mono text-xs">
                        <div className="text-slate-400 font-bold border-b border-slate-200 pb-1.5 uppercase text-[10px]">Reported Metrics Node Payload:</div>
                        {Object.entries(activeAuditRequest.metadata).map(([k, v]) => (
                          <div key={k} className="flex justify-between">
                            <span className="text-slate-500 capitalize">{k}:</span>
                            <span className="text-slate-800 font-black">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs">
                        No metadata parameters registered on this external hook. Cross-examine the raw document below instead.
                      </div>
                    )}

                    {activeAuditRequest.documentUrl && (
                      <a
                        href={activeAuditRequest.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-xs text-indigo-600 font-bold hover:underline"
                      >
                        <span>Inspect Raw Submitted Artifact Link</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}

                    <label className="flex items-start space-x-3 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-2xl p-4 transition cursor-pointer">
                      <input
                        type="checkbox"
                        checked={step2Passed}
                        onChange={(e) => setStep2Passed(e.target.checked)}
                        className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5 cursor-pointer"
                      />
                      <div>
                        <span className="block text-xs font-black text-slate-900">Pass Step 2: Metrics and Data Verified</span>
                        <span className="block text-[10px] text-indigo-700 font-medium mt-0.5">I certify that the reported values align perfectly with our project milestone deliverables.</span>
                      </div>
                    </label>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-950 uppercase tracking-tight">Step 3: Regulatory & Compliance Verification</h4>
                      <p className="text-xs text-slate-500">Ensure the contribution matches open-source licensing compliance, land utilization guidelines, or relevant 501(c)(3)/501(c)(6) standards.</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3 text-xs text-slate-700">
                      <div className="flex items-center space-x-2 text-indigo-700 font-bold">
                        <Scale className="h-4 w-4" />
                        <span>Public Goods Rule Check</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-1.5 font-medium text-slate-500">
                        <li>GitHub Code contributions must be registered under open-source MIT or Apache-2.0 licenses.</li>
                        <li>Receipts and expense invoices must contain verified VAT/Tax-ID numbers matching regional rules.</li>
                        <li>Local land certificates must possess notarized government lease stamps.</li>
                      </ul>
                    </div>

                    <label className="flex items-start space-x-3 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-2xl p-4 transition cursor-pointer">
                      <input
                        type="checkbox"
                        checked={step3Passed}
                        onChange={(e) => setStep3Passed(e.target.checked)}
                        className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5 cursor-pointer"
                      />
                      <div>
                        <span className="block text-xs font-black text-slate-900">Pass Step 3: Regulatory Compliance Clear</span>
                        <span className="block text-[10px] text-indigo-700 font-medium mt-0.5">I verify that this artifact fully complies with the structural public goods mandate of OpenImpact.</span>
                      </div>
                    </label>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-950 uppercase tracking-tight">Step 4: Committing Peer Consensus Audit</h4>
                      <p className="text-xs text-slate-500">Provide final comments and authorize milestone release. Your audit will be pinned to your reputation score.</p>
                    </div>

                    {/* Conflict of Interest Warning */}
                    {isSelfAudit && (
                      <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start space-x-3 text-amber-900">
                        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1">
                          <p className="font-black uppercase tracking-wider text-amber-950">Self-Audit Restriction (Conflict of Interest)</p>
                          <p className="text-amber-800 leading-relaxed font-medium">
                            You submitted this milestone deliverable as <strong>{activeAuditRequest.submittedBy}</strong>. Under OpenImpact 501(c)(6) governance standards, submitters cannot approve or reject their own deliverables. An independent third-party auditor must audit this request.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Auditor Authority & Signatory Gate */}
                    <div className={`p-4 rounded-2xl border transition ${
                      isAuditorAuthorized 
                        ? 'bg-emerald-50/70 border-emerald-200' 
                        : 'bg-slate-50 border-slate-300'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {isAuditorAuthorized ? (
                            <ShieldCheck className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Lock className="h-4 w-4 text-slate-500" />
                          )}
                          <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                            {isAuditorAuthorized ? 'Auditor Authorization Active' : 'Auditor Credentials Required'}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isAuditorAuthorized 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {isAuditorAuthorized ? 'Authorized Signatory' : 'Gated Action'}
                        </span>
                      </div>

                      {isAuditorAuthorized ? (
                        <div className="text-xs text-slate-600 space-y-1">
                          <p className="font-medium">
                            {currentUser ? (
                              <>
                                Signed in as <strong className="text-slate-900">{currentUser.name}</strong> ({currentUser.handle}). You hold verified audit authority ({currentUser.role === 'grant_admin' ? 'Grant Administrator' : currentUser.role === 'organization' ? 'Fiscal Host Trustee' : hasHighReputation ? `Senior Community Auditor (Impact Score: ${currentUser.reputation?.impactScore || 0})` : 'Verified Peer Auditor'}).
                              </>
                            ) : (
                              <>
                                You are signed in with an authorized peer auditor passkey. You hold verified audit authority as a Verified Peer Auditor.
                              </>
                            )}
                          </p>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                            <span>Auditor Signing Key: SHA256:{currentUser?.id ? currentUser.id.substring(0, 8) : 'PEER-KEY'}...8f2b</span>
                            <span className="text-emerald-700 font-bold">Consensus Quorum 1/1</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            Rejecting or approving deliverables directly affects milestone escrow releases and permanent public ledgers. Only verified peer auditors, grant administrators, or contributors with an Impact Score ≥ 50 can take action.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={auditorKeyInput}
                              onChange={(e) => {
                                setAuditorKeyInput(e.target.value);
                                setAuditorKeyError('');
                              }}
                              placeholder="Enter Auditor Passkey or Invite Token"
                              className="flex-1 bg-white text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => handleUnlockAuditor()}
                              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
                            >
                              Verify Passkey
                            </button>

                          </div>
                          {auditorKeyError && (
                            <p className="text-[11px] text-rose-600 font-bold">{auditorKeyError}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Auditor comments */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700 uppercase">Auditor Public Remarks</label>
                      <textarea
                        required
                        value={auditorComments}
                        onChange={(e) => setAuditorComments(e.target.value)}
                        placeholder="Provide deep audit review remarks (e.g., invoice ledger verified, repo compiles clean, etc.)"
                        rows={3}
                        className="w-full bg-slate-50 text-slate-900 text-sm p-3 rounded-2xl border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-medium transition"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                        <span>Characters: {auditorComments.length} (min 10)</span>
                        {auditorComments.length < 10 && <span className="text-red-500 font-black">Needs comments</span>}
                      </div>
                    </div>

                    {/* Reputation slider */}
                    <div className="space-y-1.5 bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100/60">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-black text-indigo-900 uppercase">Backing reputation stake</label>
                        <span className="font-black text-indigo-700 bg-white border border-indigo-100 px-2 py-0.5 rounded-md font-mono">
                          {reputationAllocated} Points
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={reputationAllocated}
                        onChange={(e) => setReputationAllocated(parseInt(e.target.value))}
                        className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
                      />
                      <div className="flex justify-between text-[9px] text-indigo-500 font-bold uppercase tracking-wider mt-1">
                        <span>Low confidence (1)</span>
                        <span>High endorsement (10)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation and Action buttons */}
                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep > 1) setCurrentStep((prev) => prev - 1);
                    }}
                    disabled={currentStep === 1}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl transition disabled:opacity-40 cursor-pointer"
                  >
                    Previous
                  </button>

                  <div className="flex space-x-2">
                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (currentStep === 1 && !step1Passed) {
                            alert('Please certify that Step 1 origin details are valid before proceeding.');
                            return;
                          }
                          if (currentStep === 2 && !step2Passed) {
                            alert('Please certify that Step 2 deliverable cross-matching is valid.');
                            return;
                          }
                          if (currentStep === 3 && !step3Passed) {
                            alert('Please certify that Step 3 compliance auditing is valid.');
                            return;
                          }
                          setCurrentStep((prev) => prev + 1);
                        }}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                      >
                        Next Step
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCommitAudit('Rejected')}
                          disabled={auditSubmitting || !isAuditorAuthorized || isSelfAudit || auditorComments.trim().length < 10}
                          title={
                            isSelfAudit
                              ? 'Self-auditing is restricted. Another auditor must review.'
                              : !isAuditorAuthorized
                              ? 'Auditor credentials required to reject.'
                              : auditorComments.trim().length < 10
                              ? 'Min 10 characters remarks required'
                              : 'Reject & Flag milestone deliverable'
                          }
                          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-1.5"
                        >
                          {!isAuditorAuthorized || isSelfAudit ? <Lock className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                          <span>{isSelfAudit ? 'Self-Audit Restricted' : !isAuditorAuthorized ? 'Gated: Reject & Flag' : 'Reject & Flag'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCommitAudit('Approved')}
                          disabled={auditSubmitting || !isAuditorAuthorized || isSelfAudit || auditorComments.trim().length < 10}
                          title={
                            isSelfAudit
                              ? 'Self-auditing is restricted. Another auditor must review.'
                              : !isAuditorAuthorized
                              ? 'Auditor credentials required to approve.'
                              : auditorComments.trim().length < 10
                              ? 'Min 10 characters remarks required'
                              : 'Approve & Authorize milestone deliverable'
                          }
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-1.5"
                        >
                          {!isAuditorAuthorized || isSelfAudit ? <Lock className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          <span>{isSelfAudit ? 'Self-Audit Restricted' : !isAuditorAuthorized ? 'Gated: Approve & Authorize' : 'Approve & Authorize'}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Original OpenProofInspector Detailed Inspect Modal */}
      {inspectEvidence && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl text-slate-900 relative space-y-6 text-left max-h-[calc(100dvh-2rem)] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">OpenProof Registry Auditor</h3>
                  <p className="text-xs text-slate-500 font-mono">Record #{inspectEvidence.id.toUpperCase()}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectEvidence(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                  {inspectEvidence.type}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Vetted Registry & Released
                </span>
              </div>
              <h4 className="text-xl font-black text-slate-900">{inspectEvidence.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{inspectEvidence.description}</p>
            </div>

            <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl space-y-2 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="font-bold">SHA-256 Cryptographic Hash</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyHash(inspectEvidence.hash || '')}
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
                {inspectEvidence.hash}
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500">
                Signers & Consensus Audit Chain (3/3)
              </div>
              <div className="space-y-2">
                {(inspectEvidence.reviewerSigs || []).map((sig, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
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

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onOpenDocumentViewer) {
                    onOpenDocumentViewer(inspectEvidence.url, inspectEvidence.title);
                  } else {
                    window.open(inspectEvidence.url, '_blank');
                  }
                }}
                className="flex-1 py-3 px-4 bg-[#111827] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                <span>View Raw Artifact</span>
                <ExternalLink className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setCertDownloaded(true);
                  setTimeout(() => setCertDownloaded(false), 2500);
                }}
                className="flex-1 py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
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

      {/* 6. Register New External Source Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-left my-8 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">Register External Source</h3>
                  <p className="text-xs text-slate-500">Initiate a consensus audit cycle for external proofs</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSourceSubmit} className="space-y-4">
              {/* Project Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700 uppercase">Target Project Title</label>
                <select
                  required
                  value={newRequestProj}
                  onChange={(e) => setNewRequestProj(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-sm p-3 rounded-2xl border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold"
                >
                  <option value="" disabled>Select target project...</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title}
                    </option>
                  ))}
                  <option value="Global OpenImpact Commons">Global OpenImpact Commons</option>
                </select>
              </div>

              {/* Source & SourceID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700 uppercase">Source Type</label>
                  <select
                    value={newRequestSource}
                    onChange={(e) => setNewRequestSource(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-sm p-3 rounded-2xl border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  >
                    <option value="GitHub Pull Request">GitHub Pull Request</option>
                    <option value="Academic Registry">Academic Registry</option>
                    <option value="Environmental IoT Sensor">Environmental IoT Sensor</option>
                    <option value="Land Tenure Register">Land Tenure Register</option>
                    <option value="Financial Invoice / Receipt">Financial Invoice / Receipt</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700 uppercase">External ID / Reference</label>
                  <input
                    type="text"
                    required
                    value={newRequestSourceId}
                    onChange={(e) => setNewRequestSourceId(e.target.value)}
                    placeholder="e.g. PR #412 or SENSOR-88"
                    className="w-full bg-slate-50 text-slate-900 text-sm p-3 rounded-2xl border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700 uppercase">Evidence Description</label>
                <textarea
                  required
                  value={newRequestDesc}
                  onChange={(e) => setNewRequestDesc(e.target.value)}
                  placeholder="Explain what was accomplished or what this data document contains..."
                  rows={3}
                  className="w-full bg-slate-50 text-slate-900 text-sm p-3 rounded-2xl border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-medium"
                />
              </div>

              {/* Raw Doc URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700 uppercase">Artifact Document URL</label>
                <input
                  type="url"
                  value={newRequestUrl}
                  onChange={(e) => setNewRequestUrl(e.target.value)}
                  placeholder="e.g. https://github.com/pulls/... or pdf link"
                  className="w-full bg-slate-50 text-slate-900 text-sm p-3 rounded-2xl border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-bold"
                />
              </div>

              {/* Dynamic Metadata Field */}
              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <label className="block text-xs font-black text-slate-700 uppercase">Add Key Metric Metadata (Optional)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newRequestMetaKey}
                    onChange={(e) => setNewRequestMetaKey(e.target.value)}
                    placeholder="Metric Key (e.g., linesOfCode)"
                    className="w-full bg-slate-50 text-slate-900 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white font-mono"
                  />
                  <input
                    type="text"
                    value={newRequestMetaVal}
                    onChange={(e) => setNewRequestMetaVal(e.target.value)}
                    placeholder="Metric Value (e.g., 1200)"
                    className="w-full bg-slate-50 text-slate-900 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={registerSubmitting}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-md transition cursor-pointer"
                >
                  {registerSubmitting ? 'Registering...' : 'Register and Launch Audit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
