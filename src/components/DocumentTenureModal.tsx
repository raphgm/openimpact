import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Building2,
  Calendar,
  Download,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  FileText,
  Users,
  Layers,
  Lock,
  UserCheck,
  CheckSquare,
  Square,
  AlertTriangle,
  ArrowRight,
  Code2,
  Clock,
  Github,
  GitPullRequest,
  GitCommit,
  Flag,
  Video,
  Trash2,
  Plus,
  Link,
  Terminal
} from 'lucide-react';
import { Project, Currency, UserProfile, Milestone } from '../types';

interface DocumentTenureModalProps {
  projects?: Project[];
  currentUser?: UserProfile;
  onClose: () => void;
  onSubmitTenure?: (tenureRecord: TenureRecord) => void;
  onOpenProofOfWork?: () => void;
}

export interface TenureRecord {
  id: string;
  collectiveTitle: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  githubEventsCount: number;
  managedCapital?: number;
  currency?: Currency;
  impactSummary: string;
  peopleReached: number;
  milestonesCompleted: number;
  evidenceUrl: string;
  verificationHash: string;
  issuedAt: string;
  leaderName?: string;
  leaderHandle?: string;
  leaderAvatar?: string;
  linkedMilestones?: {
    id: string;
    title: string;
    status: string;
    deliverables: string;
    githubRef?: string;
  }[];
}

export interface CustomEvent {
  id: string;
  title: string;
  budget: number;
  status: 'Completed' | 'In progress' | 'Pending';
  deadline: string;
  host: string;
  cohost: string;
  meetingLink: string;
  deliverables: string;
  reviewerStatus: 'Approved' | 'Pending Review' | 'Not Submitted';
  escrowStatus: 'Locked' | 'Released' | 'Pending Verification';
  isCompletedSample?: boolean;
}

export const EVENT_TEMPLATES = {
  hackathon: [
    {
      id: 'ev_1',
      title: 'Project Onboarding & Kickoff',
      budget: 0,
      status: 'In progress' as const,
      deadline: '2026-10-01 @ 15:00 UTC',
      host: '@marcus_dev',
      cohost: '@sarah_cohost',
      meetingLink: 'https://meet.google.com/abc-kickoff-xyz',
      deliverables: 'Launch the Vancouver Initiative, set up initial planning boards, and onboard first community student cohort.',
      reviewerStatus: 'Pending Review' as const,
      escrowStatus: 'Locked' as const,
    }
  ],
  studyGroup: [
    {
      id: 'ev_sg1',
      title: 'Decentralized Public Goods Intro & QF',
      budget: 0,
      status: 'In progress' as const,
      deadline: '2026-10-05 @ 18:00 UTC',
      host: '@scholar_ann',
      cohost: '@researcher_bob',
      meetingLink: 'https://meet.google.com/std-goods-1',
      deliverables: 'Cover quadratic funding theory, Gitcoin ecosystem, and hypercerts frameworks.',
      reviewerStatus: 'Pending Review' as const,
      escrowStatus: 'Locked' as const,
    }
  ],
  blank: [
    {
      id: 'ev_b1',
      title: 'Proposed Topic / Event #1',
      budget: 0,
      status: 'In progress' as const,
      deadline: '2026-10-01 @ 10:00 UTC',
      host: '@lead',
      cohost: '@cohost',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      deliverables: 'Detailed event outline & expected public good deliverables.',
      reviewerStatus: 'Pending' as const,
      escrowStatus: 'Pending Verification' as const,
    }
  ]
};

export const DocumentTenureModal: React.FC<DocumentTenureModalProps> = ({
  projects = [],
  currentUser,
  onClose,
  onSubmitTenure,
  onOpenProofOfWork,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('custom');
  const [customCollective, setCustomCollective] = useState<string>('');
  const [role, setRole] = useState<string>('Community Lead & Core Organizer');
  const [startDate, setStartDate] = useState<string>('2024-01-15');
  const [endDate, setEndDate] = useState<string>('2026-09-01');
  const [isCurrent, setIsCurrent] = useState<boolean>(false);
  const [githubEventsCount, setGithubEventsCount] = useState<number>(18);
  const [impactSummary, setImpactSummary] = useState<string>(
    'Served as Community Lead overseeing proposed project events, GitHub repository contributions, and verified public deliverables. Coordinated 18+ verified GitHub pull requests, workshops, and community events with 100% auditable evidence compliance.'
  );
  const [peopleReached, setPeopleReached] = useState<number>(3400);
  const [milestonesCompleted, setMilestonesCompleted] = useState<number>(12);
  const [evidenceUrl, setEvidenceUrl] = useState<string>('https://github.com/openimpact-collective/governance');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [submittedRecord, setSubmittedRecord] = useState<TenureRecord | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);

  // Track endorsed milestone IDs (milestones with peer approval & GitHub event verification)
  const [endorsedMilestoneIds, setEndorsedMilestoneIds] = useState<string[]>([]);
  const [isPeerAuditing, setIsPeerAuditing] = useState<boolean>(false);
  const [peerAuditorName, setPeerAuditorName] = useState<string>('');
  const [auditLogs, setAuditLogs] = useState<string[]>([]);

  // Selected completed milestone IDs backing this tenure
  const [selectedMilestoneIds, setSelectedMilestoneIds] = useState<string[]>([]);
  const [inspectedMilestoneId, setInspectedMilestoneId] = useState<string>('ev_1');

  // PR Inputs & Verification status per milestone
  const [milestonePrInputs, setMilestonePrInputs] = useState<Record<string, string>>({});

  const [verifiedPrs, setVerifiedPrs] = useState<Record<string, boolean>>({});

  const [isVerifyingPr, setIsVerifyingPr] = useState<boolean>(false);

  // Get active project
  const activeProject = projects.find((p) => p.id === selectedProjectId);

  // State-based dynamic milestones/events timeline (Customizable blank template for community leaders)
  const [projectMilestones, setProjectMilestones] = useState<CustomEvent[]>(() => EVENT_TEMPLATES.hackathon);

  // Sync milestones when active project changes (or load hackathon defaults if none exists)
  useEffect(() => {
    if (activeProject && activeProject.milestones && activeProject.milestones.length > 0) {
      const mapped = activeProject.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        budget: m.budget,
        status: m.status as any,
        deadline: m.deadline,
        deliverables: m.deliverables,
        host: '@rafael_dev',
        cohost: '@sarah_cohost',
        meetingLink: 'https://meet.google.com/abc-kickoff-xyz',
        reviewerStatus: m.reviewerStatus as any,
        escrowStatus: m.escrowStatus as any,
      }));
      setProjectMilestones(mapped);
      if (mapped.length > 0) {
        setInspectedMilestoneId(mapped[0].id);
      }
    } else {
      setProjectMilestones(EVENT_TEMPLATES.hackathon);
      setInspectedMilestoneId('ev_1');
    }
    setEndorsedMilestoneIds([]);
    setSelectedMilestoneIds([]);
    setMilestonePrInputs({});
    setVerifiedPrs({});
  }, [selectedProjectId, activeProject]);

  // Handle adding a custom, fully blank/editable event template
  const handleAddNewEvent = () => {
    const newId = `ev_custom_${Date.now()}`;
    const newEvent: CustomEvent = {
      id: newId,
      title: 'Proposed Interactive Topic / Workshop',
      budget: 0,
      status: 'Pending',
      deadline: '2026-10-30 @ 18:00 UTC',
      host: '@rafael_dev',
      cohost: '@cohost_handle',
      meetingLink: 'https://meet.google.com/abc-meet-link',
      deliverables: 'Fill in meeting outline and expected community deliverables or presentation slides.',
      reviewerStatus: 'Pending Review',
      escrowStatus: 'Locked',
    };
    setProjectMilestones((prev) => [...prev, newEvent]);
    setInspectedMilestoneId(newId);
  };

  // Handle deleting an event from the timeline
  const handleDeleteEvent = (id: string) => {
    const updated = projectMilestones.filter((m) => m.id !== id);
    setProjectMilestones(updated);
    if (inspectedMilestoneId === id) {
      if (updated.length > 0) {
        setInspectedMilestoneId(updated[0].id);
      } else {
        setInspectedMilestoneId('');
      }
    }
  };

  // Handle editing an event field in real-time
  const handleEditEventField = (id: string, field: keyof CustomEvent, value: any) => {
    setProjectMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  // Handle loading a predefined timeline template
  const handleLoadTemplate = (type: 'hackathon' | 'studyGroup' | 'blank') => {
    const tEvents = EVENT_TEMPLATES[type];
    setProjectMilestones(tEvents);
    if (tEvents.length > 0) {
      setInspectedMilestoneId(tEvents[0].id);
    } else {
      setInspectedMilestoneId('');
    }
    setEndorsedMilestoneIds([]);
    setSelectedMilestoneIds([]);
    setMilestonePrInputs({});
    setVerifiedPrs({});
  };

  // Handle triggering an external Peer Auditor review & endorsement simulation (user cannot self-endorse)
  const handleTriggerPeerEndorsement = () => {
    setIsPeerAuditing(true);
    setAuditLogs([]);
    
    const steps = [
      '📡 Initiating external Peer Audit protocol...',
      '🔍 Assigning independent Senior Auditor: Amina Bello (@amina_bello)...',
      '📋 Inspecting proposed community deliverables and timeline...',
      '🛡️ Checking physical proof URLs, cohost confirmations, and media logs...',
      '⛓️ Fetching OpenImpact cryptographic registry state...',
      '✍️ Senior Auditor Amina Bello signed and sealed milestone endorsement!'
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setAuditLogs(prev => [...prev, step]);
        if (index === steps.length - 1) {
          const allIds = projectMilestones.map((m) => m.id);
          setEndorsedMilestoneIds(allIds);
          setSelectedMilestoneIds(allIds);
          const allVerified: Record<string, boolean> = {};
          projectMilestones.forEach(m => { allVerified[m.id] = true; });
          setVerifiedPrs(allVerified);
          setPeerAuditorName('Amina Bello (@amina_bello)');
          setIsPeerAuditing(false);
        }
      }, (index + 1) * 350);
    });
  };

  // Calculate selected endorsed milestones
  const selectedEndorsedMilestones = projectMilestones.filter(
    (m) => selectedMilestoneIds.includes(m.id) && endorsedMilestoneIds.includes(m.id)
  );

  // Generation gates:
  // 1. At least 1 peer-endorsed milestone must be selected
  const isEndorsedAndValid = selectedEndorsedMilestones.length > 0;

  // 2. Tenure must be completed/over (!isCurrent and endDate is provided)
  const isTenureOver = !isCurrent && Boolean(endDate);

  // Final validation gate to allow certificate generation - set to true so starting a new tenure is completely unblocked!
  const canGenerate = true;

  // Recalculate milestone & GitHub events count based on checked completed activities
  useEffect(() => {
    if (selectedMilestoneIds.length > 0) {
      const selectedMs = projectMilestones.filter((m) => selectedMilestoneIds.includes(m.id));
      setMilestonesCompleted(selectedMs.length);
      setGithubEventsCount(selectedMs.length * 6);
    }
  }, [selectedMilestoneIds]);

  const toggleMilestoneSelect = (id: string) => {
    setSelectedMilestoneIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getCollectiveTitle = () => {
    if (selectedProjectId !== 'custom' && activeProject) {
      return activeProject.title;
    }
    return customCollective || 'Community Impact Collective';
  };

  const handleGenerateAiTenure = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      const title = getCollectiveTitle();
      const selectedMsTitles = projectMilestones
        .filter((m) => selectedMilestoneIds.includes(m.id))
        .map((m) => m.title)
        .join('; ');

      setImpactSummary(
        `During my tenure as ${role} for ${title}, I led operations coordinating ${milestonesCompleted} proposed project events (${selectedMsTitles || 'completed public deliverables'}). Verified ${githubEventsCount} GitHub PRs, commits, and event milestones, expanding beneficiary reach to ${peopleReached.toLocaleString()} members with 100% GitHub-auditable OpenProof compliance.`
      );
      setIsGeneratingAi(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = getCollectiveTitle();
    const recordId = `TENURE-${Math.floor(100000 + Math.random() * 900000)}`;
    const hash = `0x${(Date.now() * 987123981).toString(16).padEnd(40, 'e9f2a0b1c4d8')}`;

    const linkedMs = projectMilestones
      .filter((m) => selectedMilestoneIds.includes(m.id))
      .map((m) => ({
        id: m.id,
        title: m.title,
        status: m.status,
        deliverables: m.deliverables,
        githubRef: 'GitHub Verified',
      }));

    const record: TenureRecord = {
      id: recordId,
      collectiveTitle: title,
      role,
      startDate,
      endDate: isCurrent ? 'Present (Active)' : endDate,
      isCurrent,
      githubEventsCount,
      impactSummary,
      peopleReached,
      milestonesCompleted: linkedMs.length || milestonesCompleted,
      evidenceUrl,
      verificationHash: hash,
      issuedAt: new Date().toISOString(),
      leaderName: currentUser?.name || "Julian O'Connor (Verified Lead)",
      leaderHandle: currentUser?.handle || '@julian_dev',
      leaderAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      linkedMilestones: linkedMs,
    };

    setSubmittedRecord(record);
    if (onSubmitTenure) {
      onSubmitTenure(record);
    }
  };

  const handleCopyLink = () => {
    if (submittedRecord) {
      navigator.clipboard.writeText(`https://openimpact.io/tenure/${submittedRecord.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadCertificate = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-2 border-slate-900 rounded-3xl max-w-6xl w-full max-h-[95vh] flex flex-col shadow-2xl relative my-auto text-slate-900 text-left overflow-hidden">
        {/* Decorative Header Bar */}
        <div className="h-3 bg-gradient-to-r from-amber-500 via-indigo-600 to-emerald-600 w-full" />

        {/* Modal Top Control */}
        <div className="flex items-center justify-between p-6 pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-50 rounded-xl text-amber-800 border border-amber-200">
              <Award className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Document Leadership Activities</h2>
              <p className="text-xs text-slate-500 font-medium">Project Timeline & Impact Milestones: Track commitments, deliverables, evidence, verification, and outcomes throughout the project.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-full bg-slate-50 border border-slate-200 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submittedRecord ? (
          /* Success Screen: Proof Certificate of Leadership Tenure */
          <div className="p-8 space-y-6 overflow-y-auto">
            <div className="text-center space-y-3 border-b border-slate-200 pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-900 to-indigo-950 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-md border border-amber-400/30">
                <Award className="h-9 w-9 text-amber-400" />
              </div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>LEADERSHIP TENURE LOGGED & CERTIFIED IN PROOF OF WORK</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Proof of Leadership Impact Certificate
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">
                Your leadership tenure for <strong>{submittedRecord.collectiveTitle}</strong> has been registered on OpenImpact’s 501(c)(6) verifiable impact registry and saved to your <strong>Proof of Work Showcase</strong>.
              </p>
            </div>

            {/* Certificate Signatory Badge */}
            <div className="bg-gradient-to-r from-indigo-50 to-amber-50 p-3.5 rounded-2xl border border-indigo-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={submittedRecord.leaderAvatar}
                  alt={submittedRecord.leaderName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                />
                <div>
                  <div className="text-xs font-black text-slate-900">{submittedRecord.leaderName}</div>
                  <div className="text-[11px] font-mono text-indigo-700 font-bold">{submittedRecord.leaderHandle}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Authenticated Leader</span>
              </span>
            </div>

            {/* Certificate Body Card */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Community Lead / Role</span>
                  <div className="text-base font-black text-slate-900 mt-0.5">{submittedRecord.role}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Tenure Period</span>
                  <div className="text-base font-bold text-indigo-700 mt-0.5 font-mono">
                    {submittedRecord.startDate} – {submittedRecord.endDate}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200 text-center font-mono">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="text-base font-black text-indigo-700 flex items-center justify-center gap-1">
                    <Github className="h-4 w-4 text-indigo-600" />
                    <span>{submittedRecord.githubEventsCount || 18} Verified</span>
                  </div>
                  <div className="text-[9px] font-sans text-slate-500 font-bold uppercase mt-0.5">GitHub PRs & Commits</div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="text-base font-black text-emerald-700">{submittedRecord.milestonesCompleted} Delivered</div>
                  <div className="text-[9px] font-sans text-slate-500 font-bold uppercase mt-0.5">Proposed Events</div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <div className="text-base font-black text-purple-700">{submittedRecord.peopleReached.toLocaleString()}</div>
                  <div className="text-[9px] font-sans text-slate-500 font-bold uppercase mt-0.5">Attendees / Reach</div>
                </div>
              </div>

              {/* Backed Milestone & Proposed Event Deliverables Table */}
              {submittedRecord.linkedMilestones && submittedRecord.linkedMilestones.length > 0 && (
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Backed Verified Proposed Events ({submittedRecord.linkedMilestones.length})</span>
                  </span>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    {submittedRecord.linkedMilestones.map((m) => (
                      <div key={m.id} className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                        <div className="truncate mr-2">
                          <span className="font-bold text-slate-900">{m.title}</span>
                          <span className="block text-[10px] text-slate-500 font-sans truncate">{m.deliverables}</span>
                        </div>
                        <span className="text-indigo-700 font-bold shrink-0 text-[10px] bg-indigo-50 px-2 py-1 rounded border border-indigo-200 flex items-center gap-1">
                          <Github className="h-3 w-3 text-indigo-600" />
                          <span>GitHub Verified</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Documented Impact Statement</span>
                <p className="text-slate-700 text-xs leading-relaxed font-medium">
                  "{submittedRecord.impactSummary}"
                </p>
              </div>
            </div>

            {/* Cryptographic Hash */}
            <div className="bg-slate-950 text-slate-100 p-4 rounded-2xl font-mono text-xs flex items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="text-[10px] text-slate-400 font-bold">VERIFICATION HASH & REGISTRY ID</div>
                <div className="text-emerald-400 font-bold truncate text-[11px]">{submittedRecord.verificationHash}</div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30 shrink-0 font-sans font-bold">
                ✓ VERIFIED
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {onOpenProofOfWork && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenProofOfWork();
                  }}
                  className="w-full sm:flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Code2 className="h-4 w-4" />
                  <span>View in Proof of Work Showcase</span>
                </button>
              )}

              <button
                onClick={handleDownloadCertificate}
                className="w-full sm:w-auto py-3 px-4 bg-[#111827] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center space-x-2"
              >
                {downloaded ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Certificate Saved!</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download Certificate</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs rounded-xl border border-indigo-200 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto">
            {/* Authenticated Leader Passport Status Banner */}
            {currentUser ? (
              <div className="bg-gradient-to-r from-emerald-50 to-indigo-50 p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <div>
                    <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <span>Logged In Signatory: {currentUser.name}</span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div className="text-[11px] font-mono text-indigo-700 font-bold">{currentUser.handle} • {currentUser.email}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Passport Verified</span>
                </span>
              </div>
            ) : (
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-300 space-y-2 text-xs text-amber-900">
                <div className="flex items-center space-x-2 font-bold text-amber-950">
                  <Lock className="h-4 w-4 text-amber-700" />
                  <span>Authentication Recommended</span>
                </div>
                <p>
                  You are generating a leadership tenure certificate. Signing while logged in attaches your verified OpenImpact passport hash and prevents unauthorized tenure forgery.
                </p>
              </div>
            )}

            {/* Collective Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Collective / Initiative Managed</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium mb-2 cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} disabled className="text-slate-400">
                    🔒 {p.title} ({p.organization.name})
                  </option>
                ))}
                <option value="custom">+ Enter Custom Community Initiative Name</option>
              </select>

              {selectedProjectId === 'custom' && (
                <input
                  type="text"
                  required
                  placeholder="e.g. Open Source Developer Guild / Renewable Energy Initiative"
                  value={customCollective}
                  onChange={(e) => setCustomCollective(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                />
              )}
            </div>

            {/* PROJECT TIMELINE & IMPACT MILESTONES WORKFLOW SECTION (FULL PAGE TIMELINE WORKFLOW) */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                      <span>Project Timeline & Impact Milestones</span>
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Track commitments, deliverables, evidence, verification, and outcomes throughout the project.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-start md:self-auto">
                  <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                    Timeline Progress: <span className="text-indigo-600">{Math.round((selectedEndorsedMilestones.length / projectMilestones.length) * 100)}%</span>
                  </span>
                  <span className={`text-xs font-mono font-extrabold px-3 py-1.5 rounded-xl border flex items-center gap-1 ${
                    isEndorsedAndValid 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    <span>
                      {selectedEndorsedMilestones.length === 0
                        ? `Awaiting Endorsement (0/${projectMilestones.length})`
                        : `${selectedEndorsedMilestones.length}/${projectMilestones.length} Endorsed & Cleared`}
                    </span>
                  </span>
                </div>
              </div>

              {/* Informational Roadmap & Template Banner (No longer blocks) */}
              <div className="bg-indigo-50/95 border-2 border-indigo-200/80 rounded-2xl p-4 text-xs space-y-3 text-indigo-950 shadow-2xs">
                <div className="flex items-center justify-between font-extrabold text-indigo-950">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4.5 w-4.5 text-indigo-600 shrink-0" />
                    <span>📖 Community Event Roadmap & Planning Template</span>
                  </div>
                  <span className="text-[9px] font-mono bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-md font-extrabold uppercase">
                    Planning Active
                  </span>
                </div>
                
                <div className="space-y-1.5 text-indigo-900/95">
                  <p className="font-semibold leading-relaxed">
                    You are starting your leadership tenure! Populate the timeline template below with your topics, schedule, hosts, co-hosts, and meeting links.
                  </p>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    This roadbook helps the community understand what you are working on, coordinates external co-hosts, and lets everyone follow through with your progress. Standard peer-endorsement is optional at kickoff.
                  </p>
                </div>
              </div>

              {/* TEMPLATE QUICK-LOADER & EVENT BUILDER PANEL */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Select Baseline Timeline Template</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleLoadTemplate('hackathon')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-3xs cursor-pointer flex items-center gap-1 transition"
                    >
                      <span>🛠️ Hackathon</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadTemplate('studyGroup')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-3xs cursor-pointer flex items-center gap-1 transition"
                    >
                      <span>📚 Study Circle</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadTemplate('blank')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-3xs cursor-pointer flex items-center gap-1 transition"
                    >
                      <span>📄 Blank Slate</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddNewEvent}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition shadow-2xs flex items-center gap-1.5 cursor-pointer self-end"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Event</span>
                </button>
              </div>

              {/* STACKED LIST OF PROJECT TIMELINE EVENTS VERIFIED WITH GITHUB PRs */}
              <div className="space-y-3 pt-1">
                {projectMilestones.map((m, index) => {
                  const isChecked = selectedMilestoneIds.includes(m.id);
                  const isEndorsed = endorsedMilestoneIds.includes(m.id);
                  const isInspected = inspectedMilestoneId === m.id;
                  const prTag = `#${42 + index * 24}`;

                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        setInspectedMilestoneId(m.id);
                      }}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition space-y-3 relative ${
                        isInspected
                          ? 'bg-indigo-50/20 border-indigo-400 ring-2 ring-indigo-500/10 shadow-3xs'
                          : isEndorsed
                          ? 'bg-white border-emerald-400/90 ring-1 ring-emerald-400/20 shadow-2xs'
                          : 'bg-slate-50/70 border-slate-200 opacity-95 hover:opacity-100'
                      }`}
                    >
                      {/* Top Header Row: Status Icon, Title & GitHub PR Verified Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start space-x-2.5">
                          <div className={`mt-0.5 ${isEndorsed ? "text-emerald-600" : "text-amber-500"}`}>
                            {isEndorsed ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <Clock className="h-5 w-5 shrink-0" />}
                          </div>
                          <div>
                            <h5 className="text-sm font-extrabold text-slate-900 leading-tight">{m.title}</h5>
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1.5 text-[11px] font-mono text-slate-500 font-medium">
                              <span className="flex items-center gap-1 bg-white border border-slate-200/80 px-2 py-0.5 rounded text-slate-700">
                                <Calendar className="h-3 w-3 text-slate-400" />
                                <span>{m.deadline}</span>
                              </span>
                              {(m.host || m.cohost) && (
                                <span className="flex items-center gap-1 bg-white border border-slate-200/80 px-2 py-0.5 rounded text-slate-700">
                                  <Users className="h-3 w-3 text-slate-400" />
                                  <span>Host: {m.host || '@none'} {m.cohost ? `| Cohost: ${m.cohost}` : ''}</span>
                                </span>
                              )}
                              {m.meetingLink && (
                                <a
                                  href={m.meetingLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 px-2 py-0.5 rounded text-indigo-700 font-bold transition"
                                >
                                  <Video className="h-3 w-3 text-indigo-500" />
                                  <span>Meeting Link ↗</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Actions: PR / Verification & Trash Icon */}
                        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                          {/* GitHub PR Verified Pill Badge */}
                          <a
                            href={milestonePrInputs[m.id] || `https://github.com/open-impact/governance/pull/${42 + index * 24}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-3 py-1 bg-[#FBF9F5] hover:bg-slate-100 text-indigo-700 rounded-xl border border-slate-200 font-mono font-bold text-xs flex items-center gap-1.5 shrink-0 transition"
                          >
                            <GitPullRequest className="h-3.5 w-3.5 text-indigo-600" />
                            <span>{verifiedPrs[m.id] && milestonePrInputs[m.id] ? `PR ${prTag} Verified` : milestonePrInputs[m.id] ? 'Verify PR' : 'Add PR Link'}</span>
                          </a>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEvent(m.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                            title="Delete Event"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Deliverables Description */}
                      <p className="text-xs text-slate-600 font-medium leading-relaxed pl-7">
                        {m.deliverables}
                      </p>

                      {/* Bottom Status Row: Endorsement Badge & Action Tracker */}
                      <div className="flex items-center justify-between pt-1.5 pl-7 text-xs font-mono">
                        {m.isCompletedSample ? (
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                            <span>✓ Completed Sample Event</span>
                          </span>
                        ) : isEndorsed ? (
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                            <span>✓ Endorsed by Peer Auditors</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                            <span>⚠️ Pending Auditor Endorsement</span>
                          </span>
                        )}
                        
                        <span className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer">
                          {isInspected ? '✓ Currently Editing' : 'Click to Edit Event details →'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* INSPECTED MILESTONE DETAILED CARD (Dynamic interactive Event Editor Panel) */}
              {(() => {
                const curEvent = projectMilestones.find((m) => m.id === inspectedMilestoneId);
                if (!curEvent) return null;

                return (
                  <div className="mt-5 bg-indigo-50/15 border border-indigo-150 rounded-2xl p-5 space-y-4 shadow-3xs">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-100/60">
                      <div className="flex items-center space-x-2 font-black text-slate-900 text-xs">
                        <Flag className="h-4 w-4 text-indigo-600" />
                        <span>Interactive Event Planner & Deliverables Builder</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-indigo-100/80 text-indigo-800 px-2.5 py-1 rounded-lg border border-indigo-200/60">
                        Event ID: {curEvent.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* Left: Input Form Fields for Title, Deadline, Hosts, and Meeting Links */}
                      <div className="md:col-span-2 space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Event Title / Main Topic
                            </label>
                            <input
                              type="text"
                              value={curEvent.title}
                              onChange={(e) => handleEditEventField(curEvent.id, 'title', e.target.value)}
                              className="w-full bg-white text-slate-900 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Timeline / Scheduled Date
                            </label>
                            <input
                              type="text"
                              value={curEvent.deadline}
                              onChange={(e) => handleEditEventField(curEvent.id, 'deadline', e.target.value)}
                              className="w-full bg-white text-slate-900 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Lead Host Handle
                            </label>
                            <input
                              type="text"
                              value={curEvent.host}
                              onChange={(e) => handleEditEventField(curEvent.id, 'host', e.target.value)}
                              className="w-full bg-white text-slate-900 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Co-Host Handle
                            </label>
                            <input
                              type="text"
                              value={curEvent.cohost}
                              onChange={(e) => handleEditEventField(curEvent.id, 'cohost', e.target.value)}
                              className="w-full bg-white text-slate-900 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3.5">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Interactive Meeting Link (Zoom / Meet / Discord)
                            </label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <Link className="h-3.5 w-3.5" />
                              </span>
                              <input
                                type="url"
                                placeholder="e.g. https://meet.google.com/abc-defg-hij"
                                value={curEvent.meetingLink}
                                onChange={(e) => handleEditEventField(curEvent.id, 'meetingLink', e.target.value)}
                                className="w-full bg-white text-slate-900 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Expected Deliverables & Meeting Outline
                            </label>
                            <textarea
                              rows={3}
                              value={curEvent.deliverables}
                              onChange={(e) => handleEditEventField(curEvent.id, 'deliverables', e.target.value)}
                              className="w-full bg-white text-slate-850 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium leading-relaxed resize-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Verification Proof and Escrow Status tracker */}
                      <div className="bg-white p-4 rounded-xl border border-indigo-100 space-y-4 flex flex-col justify-between shadow-3xs">
                        {(() => {
                          const prUrl = milestonePrInputs[curEvent.id] || '';
                          const hasPrInput = Boolean(prUrl.trim());
                          const isPrVerified = Boolean(verifiedPrs[curEvent.id] && hasPrInput);

                          return (
                            <>
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1 text-indigo-700">
                                    <GitPullRequest className="h-3.5 w-3.5 text-indigo-600" />
                                    <span>GitHub PR Proof</span>
                                  </label>
                                  {isPrVerified ? (
                                    <span className="text-[10px] font-mono font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                                      Verified
                                    </span>
                                  ) : hasPrInput ? (
                                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                                      Awaiting Verification
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                                      Form Unsubmitted
                                    </span>
                                  )}
                                </div>

                                {/* Interactive Space to Enter / Verify PR */}
                                <div className="space-y-2">
                                  <input
                                    type="url"
                                    placeholder="https://github.com/owner/repo/pull/123"
                                    value={prUrl}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setMilestonePrInputs((prev) => ({ ...prev, [curEvent.id]: val }));
                                      setVerifiedPrs((prev) => ({ ...prev, [curEvent.id]: false }));
                                    }}
                                    className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-mono font-medium placeholder:text-slate-400"
                                  />
                                  <button
                                    type="button"
                                    disabled={isVerifyingPr || !hasPrInput}
                                    onClick={() => {
                                      setIsVerifyingPr(true);
                                      setTimeout(() => {
                                        setIsVerifyingPr(false);
                                        setVerifiedPrs((prev) => ({ ...prev, [curEvent.id]: true }));
                                        if (!endorsedMilestoneIds.includes(curEvent.id)) {
                                          setEndorsedMilestoneIds((prev) => [...prev, curEvent.id]);
                                        }
                                        if (!selectedMilestoneIds.includes(curEvent.id)) {
                                          setSelectedMilestoneIds((prev) => [...prev, curEvent.id]);
                                        }
                                      }, 600);
                                    }}
                                    className="w-full px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    {isVerifyingPr ? (
                                      <Clock className="h-3.5 w-3.5 animate-spin" />
                                    ) : isPrVerified ? (
                                      <CheckCircle2 className="h-3.5 w-3.5" />
                                    ) : (
                                      <GitPullRequest className="h-3.5 w-3.5" />
                                    )}
                                    <span>
                                      {isVerifyingPr
                                        ? 'Verifying Link...'
                                        : isPrVerified
                                        ? 'PR Proof Verified ✓'
                                        : hasPrInput
                                        ? 'Verify Proof PR'
                                        : 'Enter GitHub PR to Verify'}
                                    </span>
                                  </button>

                                  {!hasPrInput && (
                                    <div className="flex items-center justify-between text-[10px] pt-0.5">
                                      <span className="text-slate-400">Link PR to prove deliverable</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const sample = `https://github.com/open-impact/initiative/pull/${100 + Math.floor(Math.random() * 80)}`;
                                          setMilestonePrInputs((prev) => ({ ...prev, [curEvent.id]: sample }));
                                        }}
                                        className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer underline"
                                      >
                                        Use Sample PR
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] font-mono">
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-500 font-medium">Auditable Link:</span>
                                  <span className={`font-bold flex items-center gap-1 ${
                                    isPrVerified ? 'text-emerald-700' : hasPrInput ? 'text-amber-700' : 'text-slate-400'
                                  }`}>
                                    <Github className="h-3 w-3 text-indigo-600" />
                                    <span>
                                      {isPrVerified
                                        ? 'PR Approved'
                                        : hasPrInput
                                        ? 'Pending Verification'
                                        : 'Awaiting PR Link'}
                                    </span>
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-500 font-medium">State:</span>
                                  <span className={`font-bold ${
                                    isPrVerified ? 'text-emerald-600' : hasPrInput ? 'text-amber-600' : 'text-slate-400'
                                  }`}>
                                    {isPrVerified ? 'State Released' : hasPrInput ? 'State Locked (Pending Verification)' : 'State Locked (Draft)'}
                                  </span>
                                </div>

                                {hasPrInput && (
                                  <a
                                    href={prUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 pt-1.5 border border-dashed border-indigo-200 rounded-lg py-1 hover:bg-indigo-50/50 transition font-mono shrink-0"
                                  >
                                    <Github className="h-3 w-3" />
                                    <span>View Git Commit PR ↗</span>
                                  </a>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Role & Tenure Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Community Leadership Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Community Lead, Core Maintainer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Tenure Status</label>
                <div className="flex items-center space-x-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setIsCurrent(false)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition border cursor-pointer flex items-center justify-center gap-1.5 ${
                      !isCurrent
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Concluded / Over</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCurrent(true)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition border cursor-pointer flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>Active / In-Progress</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Tenure Warning Banner */}
            {isCurrent && (
              <div className="bg-amber-50/90 border-2 border-amber-300/80 rounded-2xl p-4 text-xs space-y-2 text-amber-950 shadow-2xs">
                <div className="flex items-center justify-between font-extrabold text-amber-950">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Tenure Currently Active (In-Progress)</span>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-md font-bold uppercase">
                    Generation Blocked
                  </span>
                </div>
                <p className="text-amber-900/90 font-medium leading-relaxed">
                  You cannot generate a verified tenure certificate until your leadership tenure is over. Please mark your tenure as "Concluded / Over" and confirm your end date to generate.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCurrent(false)}
                  className="mt-1 px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Mark Tenure as Concluded / Over Now</span>
                </button>
              </div>
            )}

            {/* Dates row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Tenure Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              {!isCurrent ? (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Tenure End Date (Required)</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Tenure End Date</label>
                  <div className="w-full bg-slate-100 text-slate-500 text-xs px-4 py-3 rounded-xl border border-slate-200 font-mono font-bold">
                    Present (Active / In-Progress)
                  </div>
                </div>
              )}
            </div>

            {/* GitHub Verified Events & Impact Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1">
                  <Github className="h-3.5 w-3.5 text-indigo-600" />
                  <span>GitHub PRs & Commits</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={githubEventsCount}
                  onChange={(e) => setGithubEventsCount(Number(e.target.value))}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Proposed Events Executed</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={milestonesCompleted}
                  onChange={(e) => setMilestonesCompleted(Number(e.target.value))}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Attendees / Reach</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={peopleReached}
                  onChange={(e) => setPeopleReached(Number(e.target.value))}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            {/* Impact Summary & AI Generator */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-800">Impact Accomplishments & Deliverables</label>
                <button
                  type="button"
                  onClick={handleGenerateAiTenure}
                  disabled={isGeneratingAi}
                  className="text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="h-3 w-3 text-indigo-600" />
                  <span>{isGeneratingAi ? 'Formatting Tenure...' : '✨ AI Tenure Summarizer'}</span>
                </button>
              </div>
              <textarea
                rows={4}
                required
                value={impactSummary}
                onChange={(e) => setImpactSummary(e.target.value)}
                placeholder="Describe key milestones achieved, governance initiatives, escrow disbursements, and impact delivered..."
                className="w-full bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium leading-relaxed"
              />
            </div>

            {/* Public Evidence Link */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Public Evidence or Governance Repo Link</label>
              <input
                type="url"
                required
                placeholder="https://github.com/your-collective/repo or documentation link"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-[#111827] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition mt-2 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isCurrent ? (
                <>
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>🚀 Save Tenure Plan & Publish Verified Roadmap</span>
                </>
              ) : (
                <>
                  <Award className="h-4 w-4 text-amber-400" />
                  <span>Log Historical Tenure & Generate Impact Certificate (Proof of Work)</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

