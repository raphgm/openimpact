import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Github,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  AlertTriangle,
  ExternalLink,
  PlusCircle,
  GitPullRequest,
  UserCheck,
  Send,
  Search,
  Award,
  Clock,
  Flag,
  Share2,
  Sparkles,
  Heart,
  GitCommit,
  CheckSquare,
  Square,
  MinusSquare,
  FolderGit2,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { Project, EvidenceType, Evidence, UserProfile } from '../types';

interface PeerReviewComment {
  id: string;
  evidenceId: string;
  author: string;
  avatar: string;
  role: string;
  vote: 'approve' | 'flag' | 'neutral';
  comment: string;
  timestamp: string;
}

interface PeerVoteState {
  approveCount: number;
  flagCount: number;
  userVote: 'approve' | 'flag' | null;
}

interface EvidenceModalProps {
  project: Project;
  currentUser?: UserProfile;
  onClose: () => void;
  onOpenDocumentViewer?: (url?: string, title?: string) => void;
  onOpenAuthModal?: () => void;
  onSubmitEvidence: (evidenceData: {
    title: string;
    type: EvidenceType;
    url: string;
    description: string;
  }) => void;
  onSubmitBatchEvidence?: (evidenceList: {
    title: string;
    type: EvidenceType;
    url: string;
    description: string;
  }[]) => void;
}

interface RepoContributionItem {
  id: string;
  title: string;
  type: EvidenceType;
  url: string;
  date: string;
  hashOrPr: string;
  status: string;
  description: string;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  project,
  currentUser,
  onClose,
  onOpenDocumentViewer,
  onOpenAuthModal,
  onSubmitEvidence,
  onSubmitBatchEvidence,
}) => {
  // Modal Navigation Tab: 'review' | 'submit' | 'repo_import'
  const [activeTab, setActiveTab] = useState<'review' | 'submit' | 'repo_import'>(
    project.evidence && project.evidence.length > 0 ? 'review' : 'submit'
  );

  // Selected Evidence Item for Audit
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(
    project.evidence && project.evidence.length > 0 ? project.evidence[0].id : ''
  );

  // Peer Auditor Invite/Validation gate state
  const [isReviewerAuthorized, setIsReviewerAuthorized] = useState<boolean>(() => {
    return typeof window !== 'undefined' && localStorage.getItem('is_peer_reviewer') === 'true';
  });
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [inviteError, setInviteError] = useState('');

  const handleVerifyInvite = (codeToVerify?: string) => {
    const finalCode = (codeToVerify || inviteCodeInput).trim().toUpperCase();
    const validCodes = ['AUDIT-PRO-2026', 'PEER-REVIEW-INVITE', 'VERIFIED-AUDITOR'];
    if (validCodes.includes(finalCode)) {
      localStorage.setItem('is_peer_reviewer', 'true');
      setIsReviewerAuthorized(true);
      setInviteError('');
    } else {
      setInviteError('Invalid Peer Auditor invitation code. Please try again.');
    }
  };

  // Search & Filter state in Review tab
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  // Peer Votes State mapped by evidence ID
  const [votesMap, setVotesMap] = useState<Record<string, PeerVoteState>>({
    ev_1: { approveCount: 6, flagCount: 0, userVote: null },
    ev_2: { approveCount: 8, flagCount: 1, userVote: null },
    ev_3: { approveCount: 4, flagCount: 0, userVote: null },
  });

  // Peer Comments Feed mapped by evidence ID
  const [commentsMap, setCommentsMap] = useState<Record<string, PeerReviewComment[]>>({
    ev_1: [
      {
        id: 'c_1',
        evidenceId: 'ev_1',
        author: 'Dr. Chidi Nnamdi',
        avatar: '/unicef_icon.svg',
        role: 'Verified Civic Auditor',
        vote: 'approve',
        comment: 'Verified the notarized land lease deed against local land registry records. Water rights and 2-year tenure are fully secured.',
        timestamp: '3 days ago',
      },
      {
        id: 'c_2',
        evidenceId: 'ev_1',
        author: 'Kavita Sundaram (@kavita_dev)',
        avatar: '/unicef_icon.svg',
        role: 'Community Reviewer',
        vote: 'approve',
        comment: 'Floor plan dimensions matched the equipment space requirements for 75 mini PCs. Good to proceed.',
        timestamp: '2 days ago',
      },
    ],
    ev_2: [
      {
        id: 'c_3',
        evidenceId: 'ev_2',
        author: "Julian O'Connor",
        avatar: '/unicef_icon.svg',
        role: 'Escrow Guardian',
        vote: 'approve',
        comment: 'Inspected physical photo artifacts and serial numbers on mini PCs. Inverter battery backup is operational.',
        timestamp: 'May 19, 2026',
      },
    ],
    ev_3: [
      {
        id: 'c_4',
        evidenceId: 'ev_3',
        author: 'Tunde Bakare (@tunde_audit)',
        avatar: '/unicef_icon.svg',
        role: 'Peer Reviewer',
        vote: 'approve',
        comment: 'Reviewed MikroTik firewall script in PR #45. Captive portal rate-limiting is configured appropriately for student Wi-Fi.',
        timestamp: 'July 30, 2026',
      },
    ],
  });

  // New Comment Form State
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentVote, setNewCommentVote] = useState<'approve' | 'flag' | 'neutral'>('approve');

  // Submit Evidence Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<EvidenceType>('Pull Request');
  const [newUrl, setNewUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // GitHub Repo Proof Batch Import State
  const [repoSearchInput, setRepoSearchInput] = useState(project.githubRepo || 'openimpact/pay-bridge');
  const [isFetchingRepo, setIsFetchingRepo] = useState(false);
  const [repoContributionList, setRepoContributionList] = useState<RepoContributionItem[]>([
    {
      id: 'rep_1',
      title: 'feat(escrow): implement multi-currency fiat & crypto payout bridge router',
      type: 'Pull Request',
      url: `https://github.com/${project.githubRepo || 'openimpact/pay-bridge'}/pull/142`,
      date: '2 hours ago',
      hashOrPr: 'PR #142',
      status: 'Merged & Verified',
      description: 'Zero-fee payout router linking 501(c)(6) non-profit sponsor bank accounts with smart contract escrow.',
    },
    {
      id: 'rep_2',
      title: 'fix(security): sanitize WebAuthn signature payloads & verify peer-audit multi-sig threshold',
      type: 'Pull Request',
      url: `https://github.com/${project.githubRepo || 'openimpact/pay-bridge'}/pull/141`,
      date: '1 day ago',
      hashOrPr: 'PR #141',
      status: 'Merged & Verified',
      description: 'Enforces minimum 3-signature threshold before unlocking milestone escrow vaults.',
    },
    {
      id: 'rep_3',
      title: 'chore(ci): automated OpenProof webhook attestations for verified PR merges',
      type: 'Commit',
      url: `https://github.com/${project.githubRepo || 'openimpact/pay-bridge'}/commit/8f3a92b`,
      date: '2 days ago',
      hashOrPr: '0x8f3a92b',
      status: 'Signed & Audited',
      description: 'Integrates automated GitHub Actions workflow for cryptographic Proof of Work indexing.',
    },
    {
      id: 'rep_4',
      title: 'docs(escrow): add milestone delivery guidelines & 501(c)(6) audit documentation',
      type: 'Pull Request',
      url: `https://github.com/${project.githubRepo || 'openimpact/pay-bridge'}/pull/138`,
      date: '3 days ago',
      hashOrPr: 'PR #138',
      status: 'Merged & Verified',
      description: 'Comprehensive documentation on milestone escrow verification and reporting.',
    },
    {
      id: 'rep_5',
      title: 'refactor(api): optimize PostgreSQL query performance for collective expense ledgers',
      type: 'Commit',
      url: `https://github.com/${project.githubRepo || 'openimpact/pay-bridge'}/commit/9b2e11d`,
      date: '4 days ago',
      hashOrPr: '0x9b2e11d',
      status: 'Signed & Audited',
      description: 'Speeds up ledger indexing for real-time community transparency.',
    },
  ]);
  // Selected IDs - default ALL selected!
  const [selectedRepoIds, setSelectedRepoIds] = useState<string[]>(['rep_1', 'rep_2', 'rep_3', 'rep_4', 'rep_5']);
  const [repoBatchSuccess, setRepoBatchSuccess] = useState<string | null>(null);

  const handleFetchRepoContributions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoSearchInput.trim()) return;
    setIsFetchingRepo(true);
    setRepoBatchSuccess(null);

    setTimeout(() => {
      setIsFetchingRepo(false);
      const cleanRepo = repoSearchInput.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
      const newItems: RepoContributionItem[] = [
        {
          id: `rep_${Date.now()}_1`,
          title: `feat(core): milestone deliverable update for ${cleanRepo}`,
          type: 'Pull Request',
          url: `https://github.com/${cleanRepo}/pull/101`,
          date: 'Just now',
          hashOrPr: 'PR #101',
          status: 'Merged & Verified',
          description: `Deliverable merged in ${cleanRepo} with automated CI verification.`,
        },
        {
          id: `rep_${Date.now()}_2`,
          title: `fix(auth): passkey authentication & multi-sig escrow verifier`,
          type: 'Pull Request',
          url: `https://github.com/${cleanRepo}/pull/102`,
          date: '1 day ago',
          hashOrPr: 'PR #102',
          status: 'Merged & Verified',
          description: `Cryptographic passkey verification module for ${cleanRepo}.`,
        },
        {
          id: `rep_${Date.now()}_3`,
          title: `ci(actions): cryptographic OpenProof commit sign-off hook`,
          type: 'Commit',
          url: `https://github.com/${cleanRepo}/commit/7c2a11b`,
          date: '2 days ago',
          hashOrPr: '0x7c2a11b',
          status: 'Signed & Audited',
          description: `Signed commit with verified SSH/GPG key signature.`,
        },
        {
          id: `rep_${Date.now()}_4`,
          title: `docs(specs): updated collective transparency ledgers and audit guidelines`,
          type: 'Pull Request',
          url: `https://github.com/${cleanRepo}/pull/98`,
          date: '3 days ago',
          hashOrPr: 'PR #98',
          status: 'Merged & Verified',
          description: `Official documentation and accounting ledger specs.`,
        },
      ];
      setRepoContributionList(newItems);
      // Auto-select ALL contributions at once!
      setSelectedRepoIds(newItems.map((i) => i.id));
    }, 600);
  };

  const areAllRepoSelected =
    repoContributionList.length > 0 && selectedRepoIds.length === repoContributionList.length;
  const isRepoIndeterminate =
    selectedRepoIds.length > 0 && selectedRepoIds.length < repoContributionList.length;

  const handleToggleSelectAllRepo = () => {
    if (areAllRepoSelected) {
      setSelectedRepoIds([]);
    } else {
      setSelectedRepoIds(repoContributionList.map((i) => i.id));
    }
  };

  const handleToggleSingleRepoId = (id: string) => {
    setSelectedRepoIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchImportFromRepo = () => {
    if (selectedRepoIds.length === 0) return;
    const selectedItems = repoContributionList.filter((item) => selectedRepoIds.includes(item.id));

    const evidenceList = selectedItems.map((item) => ({
      title: item.title,
      type: item.type,
      url: item.url,
      description: item.description,
    }));

    if (onSubmitBatchEvidence) {
      onSubmitBatchEvidence(evidenceList);
    } else {
      evidenceList.forEach((ev) => onSubmitEvidence(ev));
    }

    setRepoBatchSuccess(
      `🎉 Successfully imported all ${selectedItems.length} contributions from [${repoSearchInput}] as verified Proof of Work!`
    );
    setTimeout(() => {
      setRepoBatchSuccess(null);
      setActiveTab('review');
    }, 1600);
  };

  // Self Action Notice Alert Banner
  const [selfActionNotice, setSelfActionNotice] = useState<string | null>(null);

  // Helper to verify if an evidence artifact was submitted by the current user
  const checkIsSelf = (ev?: Evidence | null): boolean => {
    if (!ev) return false;
    const submitter = (ev.submittedBy || '').toLowerCase().trim();
    if (!submitter) return false;

    const cleanSubmitter = submitter.replace('@', '').trim();

    if (currentUser) {
      const userHandle = (currentUser.handle || '').toLowerCase().replace('@', '').trim();
      const userName = (currentUser.name || '').toLowerCase().trim();
      const userId = (currentUser.id || '').toLowerCase().trim();

      if (userHandle && cleanSubmitter.includes(userHandle)) return true;
      if (userName && cleanSubmitter.includes(userName)) return true;
      if (userId && cleanSubmitter.includes(userId)) return true;
    }

    // Default fallback matches for current active user identity
    if (cleanSubmitter.includes('abuja tech admin') || cleanSubmitter.includes('rafael')) return true;

    return false;
  };

  // Evidence Endorsement & Community Trust Signal State mapped by evidence ID
  const [endorsementsMap, setEndorsementsMap] = useState<Record<string, { count: number; endorsed: boolean }>>({
    ev_1: { count: 18, endorsed: false },
    ev_2: { count: 32, endorsed: false },
    ev_3: { count: 11, endorsed: false },
  });

  // Active Selected Evidence Item
  const activeEvidence = project.evidence.find((e) => e.id === selectedEvidenceId) || project.evidence[0];
  const isSelfSubmitted = checkIsSelf(activeEvidence);

  const toggleEndorsement = (evId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (!currentUser) {
      setSelfActionNotice("⚠️ Sign-in Required: Community members must be signed in before they can endorse proof artifacts.");
      setTimeout(() => setSelfActionNotice(null), 5000);
      onOpenAuthModal?.();
      return;
    }

    const targetEv = project.evidence.find((item) => item.id === evId) || activeEvidence;

    if (checkIsSelf(targetEv)) {
      setSelfActionNotice("⚠️ Self-Endorsement Blocked: Submitters cannot endorse their own proof artifacts to maintain OpenProof trust score integrity.");
      setTimeout(() => setSelfActionNotice(null), 5000);
      return;
    }

    setEndorsementsMap((prev) => {
      const current = prev[evId] || { count: 5, endorsed: false };
      const newEndorsed = !current.endorsed;
      const newCount = newEndorsed ? current.count + 1 : Math.max(0, current.count - 1);
      return {
        ...prev,
        [evId]: { count: newCount, endorsed: newEndorsed },
      };
    });
  };

  // Get or initialize endorsements for current item
  const activeEndorsement = (activeEvidence && endorsementsMap[activeEvidence.id]) || {
    count: 7,
    endorsed: false,
  };

  // Get or initialize votes for current item
  const currentVotes = (activeEvidence && votesMap[activeEvidence.id]) || {
    approveCount: 2,
    flagCount: 0,
    userVote: null,
  };

  // Get comments for current item
  const currentComments = (activeEvidence && commentsMap[activeEvidence.id]) || [];

  // Handle Vote Action
  const handleVote = (voteType: 'approve' | 'flag') => {
    if (!activeEvidence) return;

    if (!currentUser) {
      setSelfActionNotice("⚠️ Sign-in Required: Community members must be signed in before they can audit or vote on proof artifacts.");
      setTimeout(() => setSelfActionNotice(null), 5000);
      onOpenAuthModal?.();
      return;
    }

    if (isSelfSubmitted) {
      setSelfActionNotice("⚠️ Submitter Vote Blocked: Submitter verification votes are excluded from quorum calculations to prevent conflict of interest.");
      setTimeout(() => setSelfActionNotice(null), 5000);
      return;
    }

    const evId = activeEvidence.id;
    const existing = votesMap[evId] || { approveCount: 3, flagCount: 0, userVote: null };

    let newApprove = existing.approveCount;
    let newFlag = existing.flagCount;
    let newUserVote: 'approve' | 'flag' | null = voteType;

    if (existing.userVote === voteType) {
      // Toggle off vote
      newUserVote = null;
      if (voteType === 'approve') newApprove--;
      if (voteType === 'flag') newFlag--;
    } else {
      // Swapping or adding vote
      if (existing.userVote === 'approve') newApprove--;
      if (existing.userVote === 'flag') newFlag--;

      if (voteType === 'approve') newApprove++;
      if (voteType === 'flag') newFlag++;
    }

    setVotesMap({
      ...votesMap,
      [evId]: {
        approveCount: Math.max(0, newApprove),
        flagCount: Math.max(0, newFlag),
        userVote: newUserVote,
      },
    });
  };

  // Handle Add Peer Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeEvidence) return;

    const newEntry: PeerReviewComment = {
      id: `c_${Date.now()}`,
      evidenceId: activeEvidence.id,
      author: isSelfSubmitted ? 'You (Artifact Submitter)' : 'You (Verified Contributor)',
      avatar: currentUser?.avatar || '/unicef_icon.svg',
      role: isSelfSubmitted ? 'Artifact Author' : 'Peer Reviewer',
      vote: isSelfSubmitted ? 'neutral' : newCommentVote,
      comment: newCommentText,
      timestamp: 'Just now',
    };

    const updatedComments = [newEntry, ...(commentsMap[activeEvidence.id] || [])];
    setCommentsMap({
      ...commentsMap,
      [activeEvidence.id]: updatedComments,
    });

    // Automatically register vote ONLY if user is not the submitter
    if (!isSelfSubmitted && (newCommentVote === 'approve' || newCommentVote === 'flag')) {
      handleVote(newCommentVote);
    }

    setNewCommentText('');
  };

  // Handle Evidence Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    setSubmittedSuccess(true);
    setTimeout(() => {
      onSubmitEvidence({
        title: newTitle,
        type: newType,
        url: newUrl,
        description: newDescription,
      });
      setSubmittedSuccess(false);
      setActiveTab('review');
    }, 1200);
  };

  // Filtered Evidence list for selector
  const filteredEvidenceList = project.evidence.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.description && ev.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'All' || ev.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200/90 rounded-2xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl text-slate-900 relative max-h-[calc(100dvh-2rem)] overflow-y-auto my-auto text-left font-sans space-y-5">
        
        {/* Modal Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                OpenProof Transparency & Peer Review Hub
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Community contributors review, audit, and vote on submitted milestone proofs for <strong className="text-slate-800">{project.title}</strong>.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg bg-slate-50 border border-slate-200 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex border-b border-slate-200 justify-between items-center text-xs font-bold">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('review')}
              className={`py-2.5 px-4 rounded-t-xl transition flex items-center space-x-2 cursor-pointer border-b-2 ${
                activeTab === 'review'
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-extrabold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <UserCheck className="h-4 w-4 text-indigo-600" />
              <span>Peer Review & Audit Hub</span>
              <span className="bg-slate-100 text-slate-700 font-mono text-[10px] px-2 py-0.5 rounded-full border border-slate-200">
                {project.evidence.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('submit')}
              className={`py-2.5 px-4 rounded-t-xl transition flex items-center space-x-2 cursor-pointer border-b-2 ${
                activeTab === 'submit'
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-extrabold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="h-4 w-4 text-indigo-600" />
              <span>Submit Single Proof</span>
            </button>

            <button
              onClick={() => setActiveTab('repo_import')}
              className={`py-2.5 px-4 rounded-t-xl transition flex items-center space-x-2 cursor-pointer border-b-2 ${
                activeTab === 'repo_import'
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-extrabold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Github className="h-4 w-4 text-slate-900" />
              <span>Import from GitHub Repo</span>
              <span className="bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-200">
                Select All
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-1 text-[11px] text-slate-500 font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <Award className="h-3.5 w-3.5 text-amber-500" />
            <span>Min 3 Peer Signatures Required for Escrow Release</span>
          </div>
        </div>

        {/* TAB 1: PEER REVIEW & AUDIT HUB */}
        {activeTab === 'review' && (
          !isReviewerAuthorized ? (
            <div className="py-10 px-4 text-center max-w-lg mx-auto space-y-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-xs">
              <div className="inline-flex p-3 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-2xl mx-auto">
                <Lock className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-extrabold text-slate-900">
                  🔒 Peer Auditor Access Restricted
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                  To protect the integrity of milestone disbursements, reviewing submitted proofs, voting on deliverables, and releasing escrow payouts is restricted to certified peer auditors who have received an invitation code.
                </p>
              </div>

              {/* Invite Code Form */}
              <div className="max-w-xs mx-auto space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Invite Code (e.g. AUDIT-PRO-2026)"
                    value={inviteCodeInput}
                    onChange={(e) => {
                      setInviteCodeInput(e.target.value);
                      if (inviteError) setInviteError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleVerifyInvite();
                      }
                    }}
                    className="flex-1 bg-white text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-600 font-mono text-center placeholder:text-slate-400 placeholder:font-sans"
                  />
                  <button
                    onClick={() => handleVerifyInvite()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition shadow-xs cursor-pointer animate-none"
                  >
                    Verify
                  </button>
                </div>
                
                {inviteError && (
                  <p className="text-[11px] text-rose-600 font-bold animate-fadeIn text-center">
                    {inviteError}
                  </p>
                )}
              </div>

            </div>
          ) : (
            <div className="space-y-5">
            {project.evidence.length === 0 ? (
              <div className="text-center py-12 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <FileText className="h-10 w-10 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">No Evidence Uploaded Yet</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Be the first contributor to submit milestone deliverables or pull request evidence for community review.
                </p>
                <button
                  onClick={() => setActiveTab('submit')}
                  className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer"
                >
                  Submit Proof Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left Side: Evidence Selector List */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search evidence title or submitter..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex space-x-1 text-[10px] font-bold overflow-x-auto no-scrollbar pb-1">
                    {['All', 'Pull Request', 'Photo / Media', 'Invoice / Receipt', 'Report / Document'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilterType(cat)}
                        className={`px-2.5 py-1 rounded-md transition whitespace-nowrap cursor-pointer ${
                          filterType === cat
                            ? 'bg-slate-900 text-white font-mono'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* List of Evidence Items */}
                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                    {filteredEvidenceList.map((ev) => {
                      const isSelected = activeEvidence?.id === ev.id;
                      const evVotes = votesMap[ev.id] || { approveCount: 3, flagCount: 0 };
                      const evEndorsement = endorsementsMap[ev.id] || { count: 6, endorsed: false };

                      return (
                        <div
                          key={ev.id}
                          onClick={() => setSelectedEvidenceId(ev.id)}
                          className={`p-3 rounded-xl border transition cursor-pointer text-left space-y-2 ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500/20 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {ev.type}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                ev.status === 'Verified'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : ev.status === 'Flagged'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              }`}
                            >
                              {ev.status}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{ev.title}</h4>

                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
                            <span>By: {ev.submittedBy}</span>
                            <div className="flex items-center space-x-2 font-bold">
                              <button
                                type="button"
                                disabled={checkIsSelf(ev)}
                                onClick={(e) => toggleEndorsement(ev.id, e)}
                                title={checkIsSelf(ev) ? "Submitters cannot endorse their own proof artifact" : "Endorse this evidence"}
                                className={`flex items-center space-x-1 px-1.5 py-0.5 rounded transition ${
                                  checkIsSelf(ev)
                                    ? 'text-slate-300 opacity-60 cursor-not-allowed'
                                    : evEndorsement.endorsed
                                    ? 'bg-rose-50 text-rose-600 border border-rose-200 font-extrabold cursor-pointer'
                                    : 'text-slate-500 hover:text-rose-600 hover:bg-slate-100 cursor-pointer'
                                }`}
                              >
                                <Heart className={`h-3 w-3 ${evEndorsement.endorsed && !checkIsSelf(ev) ? 'fill-rose-600 text-rose-600' : ''}`} />
                                <span>{evEndorsement.count}</span>
                              </button>
                              <span className="text-emerald-600 flex items-center space-x-0.5">
                                <ThumbsUp className="h-3 w-3" />
                                <span>{evVotes.approveCount}</span>
                              </span>
                              {evVotes.flagCount > 0 && (
                                <span className="text-amber-600 flex items-center space-x-0.5">
                                  <Flag className="h-3 w-3" />
                                  <span>{evVotes.flagCount}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side: Detailed Audit & Voting Inspector */}
                {activeEvidence ? (
                  <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 text-left">
                    {/* Self Action Alert Notice Banner */}
                    {selfActionNotice && (
                      <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold rounded-xl flex items-center space-x-2 animate-fadeIn shadow-xs font-mono">
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                        <span>{selfActionNotice}</span>
                      </div>
                    )}

                    {/* Header Detail */}
                    <div className="space-y-2 border-b border-slate-200 pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold font-mono text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                            {activeEvidence.type}
                          </span>
                          {isSelfSubmitted && (
                            <span className="inline-flex items-center space-x-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                              <Lock className="h-3 w-3 text-amber-700" />
                              <span>Your Submission (Self-Audit Restricted)</span>
                            </span>
                          )}
                        </div>
                        {onOpenDocumentViewer ? (
                          <button
                            type="button"
                            onClick={() => onOpenDocumentViewer(activeEvidence.url, activeEvidence.title)}
                            className="text-indigo-600 hover:text-indigo-800 hover:underline font-bold text-xs flex items-center space-x-1 cursor-pointer"
                          >
                            <span>Open Proof Artifact</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <a
                            href={activeEvidence.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:underline font-bold text-xs flex items-center space-x-1"
                          >
                            <span>Open Proof Artifact</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                        {activeEvidence.title}
                      </h3>

                      <div className="flex items-center space-x-3 text-xs text-slate-500 font-mono">
                        <span>Submitted by <strong className="text-slate-800">{activeEvidence.submittedBy}</strong></span>
                        <span>•</span>
                        <span>{activeEvidence.submittedAt}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {activeEvidence.description && (
                      <div className="bg-white p-3 rounded-lg border border-slate-200/90 text-xs text-slate-700 leading-relaxed">
                        <span className="font-bold text-slate-900 block mb-1 font-mono">Deliverables Overview:</span>
                        {activeEvidence.description}
                      </div>
                    )}

                    {/* Community Endorsement & Trust Signal Banner */}
                    <div className="bg-gradient-to-r from-rose-50/80 via-white to-indigo-50/50 p-3.5 rounded-xl border border-rose-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-0.5 max-w-sm">
                        <div className="flex items-center space-x-1.5 text-xs font-extrabold text-slate-900">
                          <Heart className={`h-4 w-4 ${!isSelfSubmitted && activeEndorsement.endorsed ? 'text-rose-600 fill-rose-600' : 'text-rose-500'}`} />
                          <span>Community Trust Endorsements</span>
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                            {activeEndorsement.count} Endorsed
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-mono">
                          {isSelfSubmitted
                            ? 'Self-endorsements are prohibited to preserve OpenProof trust score objectivity.'
                            : activeEndorsement.endorsed
                            ? 'You endorsed this proof artifact! Your trust signal is registered on OpenProof.'
                            : 'Signal trust in this proof artifact to increase contributor credibility.'}
                        </p>
                      </div>

                      {isSelfSubmitted ? (
                        <button
                          type="button"
                          disabled
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed flex items-center space-x-1.5 opacity-70"
                          title="You cannot endorse evidence you submitted"
                        >
                          <Lock className="h-3.5 w-3.5 text-slate-400" />
                          <span>Self-Endorsement Restricted</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleEndorsement(activeEvidence.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-2xs ${
                            activeEndorsement.endorsed
                              ? 'bg-rose-600 text-white border border-rose-700 hover:bg-rose-700 ring-2 ring-rose-500/20'
                              : 'bg-white hover:bg-rose-50 text-slate-800 border border-slate-300 hover:border-rose-300'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${activeEndorsement.endorsed ? 'fill-white text-white' : 'text-rose-500'}`} />
                          <span>{activeEndorsement.endorsed ? 'Endorsed' : 'Endorse Proof'}</span>
                        </button>
                      )}
                    </div>

                    {/* Interactive Peer Voting & Verification Score Panel */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                            <UserCheck className="h-4 w-4 text-indigo-600" />
                            <span>Contributor Peer Verification Audit</span>
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            {isSelfSubmitted
                              ? 'Submitter votes are excluded from peer quorum calculations.'
                              : 'Cast your vote to validate this proof before escrow payout.'}
                          </p>
                        </div>

                        {/* Status Quorum Indicator */}
                        <div className="text-right font-mono">
                          <div className="text-xs font-extrabold text-emerald-600">
                            {currentVotes.approveCount} Approvals
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {currentVotes.approveCount >= 3 ? 'Quorum Met ✅' : `${3 - currentVotes.approveCount} more needed`}
                          </div>
                        </div>
                      </div>

                      {/* Conflict of Interest Warning for Submitter */}
                      {isSelfSubmitted && (
                        <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-[11px] text-amber-900 font-mono flex items-center space-x-2">
                          <Lock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          <span>Submitter Conflict-of-Interest Rule: You submitted this evidence. Verification voting is reserved for independent peer auditors.</span>
                        </div>
                      )}

                      {/* Vote Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          disabled={isSelfSubmitted}
                          onClick={() => handleVote('approve')}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 ${
                            isSelfSubmitted
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                              : currentVotes.userVote === 'approve'
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs cursor-pointer'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 cursor-pointer'
                          }`}
                          title={isSelfSubmitted ? 'Submitter cannot vote on own evidence' : 'Approve evidence'}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>Approve Evidence ({currentVotes.approveCount})</span>
                        </button>

                        <button
                          type="button"
                          disabled={isSelfSubmitted}
                          onClick={() => handleVote('flag')}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 ${
                            isSelfSubmitted
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                              : currentVotes.userVote === 'flag'
                              ? 'bg-amber-600 text-white border-amber-700 shadow-xs cursor-pointer'
                              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 cursor-pointer'
                          }`}
                          title={isSelfSubmitted ? 'Submitter cannot vote on own evidence' : 'Request revision'}
                        >
                          <AlertTriangle className="h-4 w-4" />
                          <span>Request Revision ({currentVotes.flagCount})</span>
                        </button>
                      </div>
                    </div>

                    {/* Peer Comments & Audit Ledger */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5 border-b border-slate-200 pb-2">
                        <MessageSquare className="h-4 w-4 text-indigo-600" />
                        <span>Peer Audit Log ({currentComments.length})</span>
                      </h4>

                      {/* Add Comment Form */}
                      <form onSubmit={handleAddComment} className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center space-x-2 text-[11px] font-bold">
                          <span className="text-slate-600">Your Vote Recommendation:</span>
                          {isSelfSubmitted ? (
                            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                              Submitter Clarification Note (No Vote)
                            </span>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => setNewCommentVote('approve')}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                                  newCommentVote === 'approve'
                                    ? 'bg-emerald-600 text-white font-bold'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => setNewCommentVote('flag')}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                                  newCommentVote === 'flag'
                                    ? 'bg-amber-600 text-white font-bold'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                Flag / Revision
                              </button>
                            </>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder={isSelfSubmitted ? "Add an author response or clarification note for auditors..." : "Add a peer audit note or cryptographic verification sign-off..."}
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            className="flex-1 bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 font-mono"
                          />
                          <button
                            type="submit"
                            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center space-x-1 shrink-0"
                          >
                            <Send className="h-3.5 w-3.5" />
                            <span>{isSelfSubmitted ? 'Post Note' : 'Post'}</span>
                          </button>
                        </div>
                      </form>

                      {/* Comment Feed */}
                      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                        {currentComments.map((c) => (
                          <div key={c.id} className="bg-white p-3 rounded-xl border border-slate-200/90 text-xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <img src={c.avatar} alt={c.author} className="w-5 h-5 rounded-full object-cover" />
                                <span className="font-bold text-slate-900">{c.author}</span>
                                <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                                  {c.role}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">{c.timestamp}</span>
                            </div>

                            <p className="text-slate-700 text-[11px] leading-relaxed font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
                              {c.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="lg:col-span-7 p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                    <Search className="h-8 w-8 text-slate-400 mb-2" />
                    <span>Select an evidence item from the list to review details and vote.</span>
                  </div>
                )}
              </div>
            )}
          </div>
          )
        )}

        {/* TAB 2: SUBMIT NEW EVIDENCE FORM */}
        {activeTab === 'submit' && (
          <div className="space-y-4">
            {submittedSuccess ? (
              <div className="py-12 text-center space-y-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Evidence Logged to OpenProof!</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  Your proof artifact has been recorded and submitted for peer review audit. Upon verification, corresponding <strong>Impact Badges</strong> will be awarded to project profile!
                </p>
                <div className="inline-flex items-center space-x-1 text-xs font-mono font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  <span>Impact Badge Evaluation In Progress...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                <p className="text-xs text-slate-500">
                  Attach immutable evidence (GitHub PR, commit hash, invoice receipt, or geo-tagged photograph) to verify milestone completion for <strong className="text-slate-800">{project.title}</strong>.
                </p>

                {/* Evidence Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Evidence Title / Milestone Summary</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., PR #45: Solar Inverter Installation & Wiring Photos"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 focus:bg-white"
                  />
                </div>

                {/* Evidence Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Evidence Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { name: 'Pull Request', icon: GitPullRequest },
                      { name: 'Commit', icon: Github },
                      { name: 'Photo / Media', icon: ImageIcon },
                      { name: 'Invoice / Receipt', icon: FileText },
                      { name: 'Report / Document', icon: ShieldCheck },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setNewType(item.name as EvidenceType)}
                          className={`flex items-center space-x-2 p-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                            newType === item.name
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span>{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* URL / Link */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Proof URL / Artifact Link</label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/organization/repo/pull/142 or https://openimpact.io/proof/..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 font-mono focus:bg-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Technical Notes & Deliverables Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe what was built or purchased, who tested it, and how to verify..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 focus:bg-white"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Submit Evidence for OpenProof Peer Verification</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: BATCH REPO IMPORT WITH SELECT ALL */}
        {activeTab === 'repo_import' && (
          <div className="space-y-4 text-left">
            {/* Success Message Banner */}
            {repoBatchSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-xl flex items-center space-x-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>{repoBatchSuccess}</span>
              </div>
            )}

            {/* Repository Input Header */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FolderGit2 className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-extrabold text-slate-900">
                    GitHub Repository Contributor Sync
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                  Select All Supported
                </span>
              </div>

              <form onSubmit={handleFetchRepoContributions} className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Github className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={repoSearchInput}
                    onChange={(e) => setRepoSearchInput(e.target.value)}
                    placeholder="e.g. openimpact/pay-bridge or facebook/react"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isFetchingRepo}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {isFetchingRepo ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                  <span>{isFetchingRepo ? 'Fetching...' : 'Fetch Repo Deliverables'}</span>
                </button>
              </form>
            </div>

            {/* Select All Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleToggleSelectAllRepo}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  {areAllRepoSelected ? (
                    <CheckSquare className="h-4 w-4 text-emerald-400" />
                  ) : isRepoIndeterminate ? (
                    <MinusSquare className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Square className="h-4 w-4 text-slate-400" />
                  )}
                  <span>
                    {areAllRepoSelected
                      ? `Deselect All (${repoContributionList.length})`
                      : `Select All Contributions (${repoContributionList.length})`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRepoIds(repoContributionList.filter((i) => i.type === 'Pull Request').map((i) => i.id))}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-md transition cursor-pointer"
                >
                  PRs Only
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRepoIds(repoContributionList.filter((i) => i.type === 'Commit').map((i) => i.id))}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-md transition cursor-pointer"
                >
                  Commits Only
                </button>
              </div>

              <div className="text-xs font-mono text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 font-bold">
                {selectedRepoIds.length} of {repoContributionList.length} Selected
              </div>
            </div>

            {/* Contributions List */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {repoContributionList.map((item) => {
                const isSelected = selectedRepoIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleSingleRepoId(item.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 text-left ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="pt-0.5 shrink-0">
                        {isSelected ? (
                          <CheckSquare className="h-4.5 w-4.5 text-indigo-600" />
                        ) : (
                          <Square className="h-4.5 w-4.5 text-slate-400" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          {item.type === 'Pull Request' ? (
                            <GitPullRequest className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          ) : (
                            <GitCommit className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          )}
                          <span className="text-xs font-bold text-slate-900">{item.title}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-500">
                          <span className="font-bold text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                            {item.hashOrPr}
                          </span>
                          <span>•</span>
                          <span>{item.date}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">{item.status}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-slate-400 hover:text-slate-900 rounded border border-slate-200 hover:bg-slate-100 transition shrink-0"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Batch Import Trigger Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleBatchImportFromRepo}
                disabled={selectedRepoIds.length === 0}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>
                  {selectedRepoIds.length === 0
                    ? 'Select Contributions Above to Import'
                    : `Import All Selected (${selectedRepoIds.length}) as Verified Proof of Work`}
                </span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

