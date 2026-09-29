import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile, Currency, Project } from '../types';
import { formatCurrency, convertCurrency } from '../utils/formatters';
import {
  User,
  Award,
  ShieldCheck,
  Github,
  MapPin,
  CheckCircle2,
  Briefcase,
  FileCheck,
  DollarSign,
  ExternalLink,
  Camera,
  FileText,
  Clock,
  Globe,
  AlertCircle,
  X,
  Users,
} from 'lucide-react';
import { TenureRecord } from './DocumentTenureModal';
import { ImpactDashboard } from './ImpactDashboard';
import {
  bindGitHubAccount,
  unbindGitHubAccount,
  getAllPublicUsers,
} from '../lib/firebase';

interface ProfileViewProps {
  currentUser: UserProfile | null;
  displayCurrency: Currency;
  projects?: Project[];
  userTenures?: TenureRecord[];
  onOpenProofVerification?: () => void;
  onOpenGithubPRIntegration?: () => void;
  onOpenDocumentTenure?: () => void;
  onSelectProject?: (project: Project) => void;
  onOpenAuthModal?: () => void;
  onUpdateCurrentUser?: (user: UserProfile) => void;
}

const calculateEvidencePoints = (ev: { type: string; status: string }) => {
  if (ev.status === 'Verified') {
    if (ev.type === 'Pull Request') {
      return { pts: 25, label: '+25 pts', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
    if (ev.type === 'Report / Document') {
      return { pts: 20, label: '+20 pts', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
    if (ev.type === 'Photo / Media') {
      return { pts: 15, label: '+15 pts', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
    if (ev.type === 'Commit') {
      return { pts: 15, label: '+15 pts', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
    return { pts: 15, label: '+15 pts', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }
  if (ev.status === 'Pending') {
    return { pts: 0, label: 'Pending Audit (0 pts)', color: 'bg-amber-50 text-amber-700 border-amber-200' };
  }
  return { pts: 0, label: 'Audit Rejected', color: 'bg-rose-50 text-rose-700 border-rose-200' };
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  displayCurrency,
  projects = [],
  userTenures = [],
  onOpenProofVerification,
  onOpenGithubPRIntegration,
  onOpenDocumentTenure,
  onSelectProject,
  onOpenAuthModal,
  onUpdateCurrentUser,
}) => {
  const [activityFilter, setActivityFilter] = useState<'my' | 'network'>('my');

  // GitHub binding modal & state
  const [showBindModal, setShowBindModal] = useState(false);
  const [githubInput, setGithubInput] = useState('');
  const [isBindingGithub, setIsBindingGithub] = useState(false);
  const [isUnlinkingGithub, setIsUnlinkingGithub] = useState(false);
  const [githubBindError, setGithubBindError] = useState<string | null>(null);
  const [githubBindSuccess, setGithubBindSuccess] = useState<string | null>(null);

  // Public Community Registry state (to see other verified users in Firestore)
  const [showCommunityRegistry, setShowCommunityRegistry] = useState(false);
  const [publicUsers, setPublicUsers] = useState<UserProfile[]>([]);
  const [isLoadingPublicUsers, setIsLoadingPublicUsers] = useState(false);

  useEffect(() => {
    if (showCommunityRegistry) {
      setIsLoadingPublicUsers(true);
      getAllPublicUsers()
        .then((users) => {
          setPublicUsers(users);
        })
        .finally(() => {
          setIsLoadingPublicUsers(false);
        });
    }
  }, [showCommunityRegistry]);

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6 bg-white border border-slate-200 rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold shadow-inner">
          <User className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Authentication Required</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
            Please log in or create your Open Impact account to view your verified OpenProof passport, contribution badges, and cryptographic impact score.
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="px-6 py-3 bg-[#0B1E48] hover:bg-slate-900 text-white font-black text-xs rounded-xl shadow-lg transition cursor-pointer inline-flex items-center space-x-2"
          >
            <span>Sign In / Create Account</span>
          </button>
        </div>
      </div>
    );
  }

  const userHandle = (currentUser.handle || '').replace('@', '').toLowerCase();
  const userName = (currentUser.name || '').toLowerCase();
  const userEmail = (currentUser.email || '').toLowerCase();
  const boundGithubUsername = (currentUser.githubUsername || '').toLowerCase();

  // Aggregate user's ACTUAL evidence submissions across all global projects
  const userEvidence = useMemo(() => {
    return projects
      .flatMap((p) =>
        (p.evidence || []).map((ev) => ({
          ...ev,
          projectId: p.id,
          projectTitle: p.title,
          projectCategory: p.category,
          projectOrg: p.organization.name,
        }))
      )
      .filter((ev) => {
        const author = (ev.submittedBy || '').toLowerCase();
        return (
          (boundGithubUsername && author.includes(boundGithubUsername)) ||
          (userHandle && author.includes(userHandle)) ||
          (userEmail && author.includes(userEmail)) ||
          (userName && (author.includes(userName) || author === userName))
        );
      });
  }, [projects, boundGithubUsername, userHandle, userEmail, userName]);

  // Global verified network evidence across all platform projects
  const networkEvidence = useMemo(() => {
    return projects.flatMap((p) =>
      (p.evidence || []).map((ev) => ({
        ...ev,
        projectId: p.id,
        projectTitle: p.title,
        projectCategory: p.category,
        projectOrg: p.organization.name,
      }))
    );
  }, [projects]);

  // Dynamic verified evidence count based on real verified records
  const dynamicEvidenceCount =
    currentUser.reputation.verifiedContributionsCount > 0
      ? currentUser.reputation.verifiedContributionsCount
      : userEvidence.filter((e) => e.status === 'Verified').length;

  // Projects associated with user (organization owner or confirmed contributor)
  const userProjects = useMemo(() => {
    return projects.filter(
      (p) =>
        (userName && p.organization.name.toLowerCase().includes(userName)) ||
        (p.evidence || []).some((ev) => {
          const author = (ev.submittedBy || '').toLowerCase();
          return (
            (boundGithubUsername && author.includes(boundGithubUsername)) ||
            (userHandle && author.includes(userHandle))
          );
        })
    );
  }, [projects, userName, boundGithubUsername, userHandle]);

  // Real escrow volume supported by user's associated projects (or 0 if none)
  const userSupportedVolume = useMemo(() => {
    return userProjects.reduce(
      (sum, p) => sum + convertCurrency(p.raised, p.currency, displayCurrency),
      0
    );
  }, [userProjects, displayCurrency]);

  const activeEvidenceList = activityFilter === 'my' ? userEvidence : networkEvidence;

  // Handler for binding real GitHub username
  const handleBindGithub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubInput.trim()) return;

    setIsBindingGithub(true);
    setGithubBindError(null);
    setGithubBindSuccess(null);

    const res = await bindGitHubAccount(currentUser.id, githubInput);
    setIsBindingGithub(false);

    if (res.success && res.profile) {
      setGithubBindSuccess(`Successfully verified and bound @${res.profile.githubUsername} on GitHub!`);
      setGithubInput('');
      if (onUpdateCurrentUser) {
        onUpdateCurrentUser(res.profile);
      }
      setTimeout(() => {
        setShowBindModal(false);
        setGithubBindSuccess(null);
      }, 1500);
    } else {
      setGithubBindError(res.error || 'Failed to bind GitHub account. Please ensure the username exists on GitHub.');
    }
  };

  // Handler for unlinking GitHub account
  const handleUnlinkGithub = async () => {
    if (!window.confirm('Are you sure you want to unlink your GitHub username from this OpenImpact profile?')) {
      return;
    }
    setIsUnlinkingGithub(true);
    setGithubBindError(null);
    setGithubBindSuccess(null);

    const res = await unbindGitHubAccount(currentUser.id);
    setIsUnlinkingGithub(false);

    if (res.success && res.profile) {
      setGithubBindSuccess('GitHub account successfully unlinked.');
      if (onUpdateCurrentUser) {
        onUpdateCurrentUser(res.profile);
      }
    } else {
      setGithubBindError(res.error || 'Failed to unlink GitHub account.');
    }
  };

  return (
    <div className="space-y-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-900 bg-white font-sans">
      {/* 1. Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center gap-10">
        <div className="flex-1 space-y-6 z-10 text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-xs font-bold shadow-xs">
              <ShieldCheck className="h-4 w-4" />
              <span>
                {currentUser.githubVerified ? 'Verified OpenProof Passport' : 'OpenProof Passport (Unverified)'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowCommunityRegistry(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition cursor-pointer"
              title="View other verified contributors on the platform"
            >
              <Users className="h-3.5 w-3.5" />
              <span>View Public Community Registry</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-3xl object-cover shadow-lg border border-slate-100"
            />
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none flex items-center justify-center lg:justify-start gap-2">
                {currentUser.name}
                {currentUser.githubVerified ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" title="Verified GitHub Developer Identity" />
                ) : (
                  <span className="text-xs font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md">
                    Unlinked
                  </span>
                )}
              </h1>
              
              {/* Profile Identifiers: Never assumes GitHub username unless explicitly verified! */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-sm font-medium text-slate-500">
                <span className="font-mono text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md font-bold text-xs flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  <span>{currentUser.name}</span>
                </span>

                {currentUser.githubVerified && currentUser.githubUsername ? (
                  <a
                    href={`https://github.com/${currentUser.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-2.5 py-0.5 rounded-md font-bold text-xs inline-flex items-center gap-1.5 transition shadow-2xs"
                    title="Verified GitHub Developer Profile"
                  >
                    <Github className="h-3.5 w-3.5 text-slate-900" />
                    <span>@{currentUser.githubUsername}</span>
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setGithubBindError(null);
                      setGithubBindSuccess(null);
                      setGithubInput('');
                      setShowBindModal(true);
                    }}
                    className="font-mono text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 rounded-md font-bold text-xs inline-flex items-center gap-1.5 transition cursor-pointer"
                    title="Click to enter and verify your actual GitHub username"
                  >
                    <Github className="h-3.5 w-3.5 text-slate-700" />
                    <span>+ Connect GitHub</span>
                  </button>
                )}

                <span className="flex items-center gap-1 text-xs">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" /> {currentUser.location}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentUser.email}
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
            {currentUser.bio}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            {!currentUser.githubVerified ? (
              <button
                type="button"
                onClick={() => {
                  setGithubBindError(null);
                  setGithubBindSuccess(null);
                  setGithubInput('');
                  setShowBindModal(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition cursor-pointer flex items-center space-x-2"
              >
                <Github className="h-4 w-4" />
                <span>Connect GitHub Account</span>
              </button>
            ) : (
              onOpenGithubPRIntegration && (
                <button
                  type="button"
                  onClick={onOpenGithubPRIntegration}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition cursor-pointer flex items-center space-x-2"
                >
                  <Github className="h-4 w-4" />
                  <span>Import Merged PRs</span>
                </button>
              )
            )}

            {onOpenDocumentTenure && (
              <button
                type="button"
                onClick={onOpenDocumentTenure}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-sm transition cursor-pointer flex items-center space-x-2"
              >
                <Award className="h-4 w-4 text-slate-950" />
                <span>Document Leadership Tenure</span>
              </button>
            )}

            {onOpenProofVerification && (
              <button
                type="button"
                onClick={onOpenProofVerification}
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-2xs transition cursor-pointer flex items-center space-x-2"
              >
                <FileCheck className="h-4 w-4 text-emerald-600" />
                <span>Upload Milestone Proof</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 relative w-full h-[300px] flex items-center justify-center hidden md:flex">
          <div className="absolute w-64 h-64 bg-emerald-200 rounded-[3rem] rotate-12 opacity-60 blur-xl right-10 top-10 mix-blend-multiply"></div>
          <div className="absolute w-72 h-72 bg-sky-200 rounded-[4rem] -rotate-12 opacity-50 blur-2xl right-32 top-0 mix-blend-multiply"></div>
          <div className="absolute w-48 h-64 bg-gradient-to-tr from-emerald-400 to-teal-400 rounded-[2rem] shadow-2xl right-40 top-10 transform -rotate-12 transition-all duration-700 hover:scale-105 hover:rotate-3 cursor-pointer"></div>
          <div className="absolute w-56 h-56 bg-gradient-to-bl from-teal-500 to-sky-500 rounded-[2.5rem] shadow-2xl right-10 top-20 transform rotate-6 transition-all duration-700 hover:scale-105 hover:-rotate-6 cursor-pointer"></div>

          {/* Floating Impact Score */}
          <div className="absolute right-32 top-1/2 bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-slate-100 w-56 transform -translate-y-1/2 z-20 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Award className="h-6 w-6" />
            </div>
            <div className="text-4xl font-black text-slate-900 font-mono tracking-tight">
              {currentUser.reputation.impactScore}
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
              Impact Score
            </div>
          </div>
        </div>
      </section>

      {/* 2. Hero Stats Strip */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 shrink-0">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">{dynamicEvidenceCount}</div>
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                Verified Proofs
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-sky-50 rounded-2xl text-sky-600 shrink-0">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {currentUser.reputation.completedProjectsCount || userProjects.length || 0}
              </div>
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                Completed Projects
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {currentUser.reputation.completedBountiesCount || 0}
              </div>
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                Bounties Solved
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shrink-0">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {formatCurrency(userSupportedVolume, displayCurrency)}
              </div>
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                Escrow Backed
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {currentUser.reputation.communityHours || 0}h
              </div>
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                Community Hours
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Impact Dashboard */}
      <ImpactDashboard
        currentUser={currentUser}
        projects={projects}
        userEvidence={userEvidence}
        userTenures={userTenures}
      />

      {/* 4. Verified Skills Matrix */}
      <section>
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 text-left">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 text-slate-900 mb-2">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-black">Verified Skills Matrix</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
              Every skill badge below reflects cryptographically confirmed milestones, merged pull requests, and peer-signed evidence.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 pt-1">
            {currentUser.skills.map((skill) => (
              <div
                key={skill}
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs shadow-2xs hover:bg-slate-100 transition cursor-default"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Lower Grid: Activity Stream & Verification Status */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        {/* Panel A: Verified Activity */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">
                Activity Ledger
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                {activityFilter === 'my' ? 'My Verified Deliverables' : 'Public Network Feed'}
              </h3>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActivityFilter('my')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activityFilter === 'my'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                My Proofs ({userEvidence.length})
              </button>
              <button
                type="button"
                onClick={() => setActivityFilter('network')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  activityFilter === 'network'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Globe className="h-3 w-3" />
                <span>Global Feed ({networkEvidence.length})</span>
              </button>
            </div>
          </div>

          {/* Activity List */}
          {activeEvidenceList.length === 0 ? (
            <div className="text-center py-10 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <FileCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">
                  {activityFilter === 'my' ? 'No Verified Activity Yet' : 'No Public Evidence Recorded'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  {activityFilter === 'my'
                    ? 'You have not submitted any milestone deliverables or linked GitHub pull requests to your profile yet. Submit proof of work to build your verified reputation.'
                    : 'No public milestone proofs found on the network ledger.'}
                </p>
              </div>
              {activityFilter === 'my' && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGithubBindError(null);
                      setGithubBindSuccess(null);
                      setGithubInput('');
                      setShowBindModal(true);
                    }}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>Connect GitHub</span>
                  </button>
                  {onOpenProofVerification && (
                    <button
                      type="button"
                      onClick={onOpenProofVerification}
                      className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Upload Proof</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {activeEvidenceList.slice(0, 6).map((act, idx) => {
                const isPR = act.type === 'Pull Request' || act.type === 'Commit';
                const isPhoto = act.type === 'Photo / Media';
                const ptsInfo = calculateEvidencePoints(act);

                return (
                  <div
                    key={act.id || idx}
                    className="p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/60 transition flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                          isPR
                            ? 'bg-sky-50 text-blue-600'
                            : isPhoto
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-purple-50 text-purple-600'
                        }`}
                      >
                        {isPR ? (
                          <Github className="h-5 w-5" />
                        ) : isPhoto ? (
                          <Camera className="h-5 w-5" />
                        ) : (
                          <FileText className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div
                          className="text-xs sm:text-sm font-bold text-slate-900 truncate"
                          title={act.title}
                        >
                          {act.title}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5 flex items-center gap-1.5">
                          <span className="font-semibold text-slate-700">{act.type}</span>
                          <span>·</span>
                          <span className="text-slate-600 truncate">{act.projectTitle}</span>
                          <span>·</span>
                          <span className="text-slate-400 font-mono shrink-0">{act.submittedAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center space-x-2 text-right">
                      <div>
                        <div
                          className={`text-xs font-black font-mono px-2.5 py-1 rounded-lg border ${ptsInfo.color}`}
                        >
                          {ptsInfo.label}
                        </div>
                        <div
                          className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${
                            act.status === 'Verified'
                              ? 'text-emerald-700'
                              : act.status === 'Pending'
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {act.status}
                        </div>
                      </div>

                      {act.url && (
                        <a
                          href={act.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 transition cursor-pointer"
                          title="Inspect source evidence deliverable"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Panel B: Security & Identity Status (OpenProof Verification Integrity) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">
                Security & Identity Status
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                OpenProof Verification Integrity
              </h3>
            </div>
            {currentUser.githubVerified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-mono">
                <CheckCircle2 className="h-3 w-3" />
                <span>BINDING ACTIVE</span>
              </span>
            )}
          </div>

          <div className="space-y-4">
            {/* ROW 1: GitHub Identity Binding */}
            {currentUser.githubVerified && currentUser.githubUsername ? (
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                      <Github className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>GitHub Identity Binding</span>
                        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                          VERIFIED
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 font-medium mt-0.5">
                        <a
                          href={`https://github.com/${currentUser.githubUsername}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 font-bold underline inline-flex items-center gap-1"
                        >
                          @{currentUser.githubUsername}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        {' '}linked to account
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Verified
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{currentUser.githubPublicRepos ?? 0} public repos · Linked {currentUser.githubBoundAt || 'Verified'}</span>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setGithubBindError(null);
                        setGithubBindSuccess(null);
                        setGithubInput(currentUser.githubUsername || '');
                        setShowBindModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold cursor-pointer underline transition font-sans"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleUnlinkGithub}
                      disabled={isUnlinkingGithub}
                      className="text-slate-400 hover:text-rose-600 text-xs font-semibold cursor-pointer underline transition font-sans"
                    >
                      {isUnlinkingGithub ? 'Disconnecting...' : 'Disconnect'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold shrink-0">
                      <Github className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">GitHub Identity Binding</div>
                      <div className="text-xs text-slate-500 font-medium">
                        No GitHub username bound. Enter your actual GitHub username to verify developer identity.
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200">
                    Unlinked
                  </span>
                </div>

                <div className="pt-2 border-t border-amber-200/50 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setGithubBindError(null);
                      setGithubBindSuccess(null);
                      setGithubInput('');
                      setShowBindModal(true);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>Enter GitHub Username</span>
                  </button>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Verified live via GitHub API & saved to Firestore
                  </span>
                </div>
              </div>
            )}

            {/* ROW 2: OpenProof Passport */}
            {currentUser.openProofActive && currentUser.githubVerified ? (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">OpenProof Passport</div>
                    <div className="text-xs text-slate-600 font-medium">
                      Cryptographic signature registry active · #{currentUser.openProofPassportId || `OP-${currentUser.id.slice(0, 8).toUpperCase()}`}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Active
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center font-bold shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">OpenProof Passport</div>
                    <div className="text-xs text-slate-500 font-medium">
                      Pending · Bind a verified GitHub username above to activate
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  Pending
                </div>
              </div>
            )}

            {/* ROW 3: Verified Evidence Submissions */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Verified Evidence Submissions</div>
                  <div className="text-xs text-slate-500 font-medium">
                    Deliverables reviewed and approved by peer auditors
                  </div>
                </div>
              </div>
              <div className="text-xs font-black text-indigo-700 font-mono bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                {dynamicEvidenceCount} Logged
              </div>
            </div>

            {/* ROW 4: Cryptographic Impact Score */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Cryptographic Impact Score</div>
                  <div className="text-xs text-slate-500 font-medium">
                    Deterministic reputation score based on real verified deliverables
                  </div>
                </div>
              </div>
              <div className="text-xs font-black text-slate-900 font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                {currentUser.reputation.impactScore} pts
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Leadership Tenures & Verified Impact Section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs text-left space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-extrabold border border-amber-200 mb-1">
              <Award className="h-3.5 w-3.5 text-amber-600" />
              <span>501(c)(6) LEADERSHIP REGISTRY</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Leadership Tenures & Verified Impact</h2>
            <p className="text-xs text-slate-500 font-medium">
              Official community leadership tenures, proposed events verified on GitHub, and verifiable certificates.
            </p>
          </div>
          {onOpenDocumentTenure && (
            <button
              type="button"
              onClick={onOpenDocumentTenure}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-2"
            >
              <Award className="h-4 w-4 text-amber-400" />
              <span>+ Document New Tenure</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userTenures.length === 0 ? (
            <div className="col-span-full py-10 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-3">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto border border-indigo-200">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Leadership Tenures Documented Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click <span className="font-semibold text-slate-700">&quot;+ Document New Tenure&quot;</span> above to document your open-source community leadership, milestone deliverables, and verified GitHub metrics.
              </p>
            </div>
          ) : (
            userTenures.map((tenure) => (
              <div key={tenure.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                      {tenure.collectiveTitle}
                    </span>
                    <h4 className="text-base font-black text-slate-900 mt-1">{tenure.role}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {tenure.startDate} – {tenure.endDate}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center font-mono text-xs">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <div className="font-bold text-indigo-700">{tenure.githubEventsCount || 0}</div>
                    <div className="text-[9px] font-sans text-slate-500 font-bold uppercase">PRs & Commits</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <div className="font-bold text-emerald-700">{tenure.milestonesCompleted || 0}</div>
                    <div className="text-[9px] font-sans text-slate-500 font-bold uppercase">Delivered</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <div className="font-bold text-purple-700">{(tenure.peopleReached || 0).toLocaleString()}</div>
                    <div className="text-[9px] font-sans text-slate-500 font-bold uppercase">Reach</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-mono text-slate-500">
                    Hash: {tenure.verificationHash?.slice(0, 12)}...
                  </span>
                  <button
                    type="button"
                    onClick={onOpenDocumentTenure}
                    className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Certificate</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 7. Dedicated Connect GitHub Username Modal */}
      {showBindModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative my-auto text-left space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">
                  <Github className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Connect GitHub Account
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Bind your real open-source developer identity
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowBindModal(false);
                  setGithubBindError(null);
                  setGithubBindSuccess(null);
                }}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm cursor-pointer transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleBindGithub} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Your GitHub Username
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 font-bold select-none">
                    github.com/
                  </span>
                  <input
                    type="text"
                    value={githubInput}
                    onChange={(e) => {
                      setGithubInput(e.target.value);
                      setGithubBindError(null);
                    }}
                    placeholder="username"
                    autoFocus
                    disabled={isBindingGithub}
                    className="w-full pl-24 pr-3 py-2.5 text-sm font-mono font-bold bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Enter your real username on GitHub. We will query the public GitHub API to confirm your account and public repository count.
                </p>
              </div>

              {githubBindError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{githubBindError}</span>
                </div>
              )}

              {githubBindSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{githubBindSuccess}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowBindModal(false);
                    setGithubBindError(null);
                    setGithubBindSuccess(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBindingGithub || !githubInput.trim()}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  {isBindingGithub ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying on GitHub...</span>
                    </>
                  ) : (
                    <>
                      <Github className="h-4 w-4" />
                      <span>Verify & Bind Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Community Registry Modal: Verified Contributors saved in Firestore */}
      {showCommunityRegistry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[calc(100dvh-2rem)] overflow-y-auto my-auto text-left space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Public Verified Contributor Registry
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Directory of all distinct user accounts registered in Firestore
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCommunityRegistry(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm cursor-pointer transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Explanatory callout banner */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>Each card represents a separate, independent user account registered on OpenImpact.</span>
              </div>
              <span className="font-mono text-slate-500 text-[11px]">
                Currently logged in: <strong className="text-slate-900">{currentUser.name}</strong>
              </span>
            </div>

            {isLoadingPublicUsers ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">Fetching registered profiles from Firestore...</p>
              </div>
            ) : publicUsers.length === 0 ? (
              <div className="py-10 text-center bg-slate-50 rounded-2xl p-6 border border-dashed border-slate-200 space-y-2">
                <Users className="h-8 w-8 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">No other users registered yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When you bind your GitHub account, your profile is recorded in Firestore and will be visible here to all members.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {publicUsers.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <div
                      key={u.id}
                      className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                        isCurrent
                          ? 'bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-200'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={u.name}
                          className="w-10 h-10 rounded-2xl object-cover border border-slate-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
                            <span>{u.name}</span>
                            {isCurrent ? (
                              <span className="text-[10px] font-mono bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">
                                Current Account (You)
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                                Independent Account
                              </span>
                            )}
                            {u.githubVerified && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            )}
                          </div>
                          <div className="text-xs text-slate-500 font-medium truncate mt-0.5 flex items-center gap-2 font-mono">
                            <span>{u.handle || (u.email ? `@${u.email.split('@')[0]}` : '@contributor')}</span>
                            <span>·</span>
                            <span>{u.location || 'Global'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="text-xs font-black text-slate-900 font-mono">
                          {u.reputation?.impactScore ?? 0} pts
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                          {u.githubVerified ? 'Verified' : 'Unverified'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Synchronized with live Firestore cluster</span>
              <button
                type="button"
                onClick={() => setShowCommunityRegistry(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer text-xs"
              >
                Close Registry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
