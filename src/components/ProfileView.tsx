import React from 'react';
import { UserProfile, Currency, Project } from '../types';
import { formatCurrency, convertCurrency } from '../utils/formatters';
import { User, Award, ShieldCheck, Github, MapPin, CheckCircle2, Briefcase, FileCheck, DollarSign, ExternalLink } from 'lucide-react';
import { TenureRecord } from './DocumentTenureModal';

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
}

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
}) => {
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

  // Aggregate user evidence submissions across all global projects
  const userEvidence = projects
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
        author.includes(userHandle) ||
        author.includes(userName) ||
        author.includes('rafael')
      );
    });

  // Calculate dynamic evidence count reacting to new submissions
  const dynamicEvidenceCount = Math.max(
    currentUser.reputation.verifiedContributionsCount,
    userEvidence.length
  );

  // Projects associated with user or with active involvement
  const userProjects = projects.filter(
    (p) =>
      p.organization.name.toLowerCase().includes(userName) ||
      (p.evidence || []).some((ev) => ev.submittedBy.toLowerCase().includes(userHandle))
  );

  // Total funds raised / supported across projects
  const totalSupportedVolume = projects.reduce(
    (sum, p) => sum + convertCurrency(p.raised, p.currency, displayCurrency),
    0
  );

  // Recent activity list: use user's evidence or all verified evidence from projects
  const recentActivities =
    userEvidence.length > 0
      ? userEvidence
      : projects
          .flatMap((p) =>
            (p.evidence || []).map((ev) => ({
              ...ev,
              projectId: p.id,
              projectTitle: p.title,
              projectCategory: p.category,
              projectOrg: p.organization.name,
            }))
          );

  return (
    <div className="space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-slate-900 bg-white font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 z-10 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-xs font-bold shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>Verified OpenProof Passport</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
             <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-3xl object-cover shadow-lg border border-slate-100"
              />
              <div className="space-y-2">
                 <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none flex items-center justify-center lg:justify-start gap-2">
                   {currentUser.name}
                   <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                 </h1>
                 <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm font-medium text-slate-500">
                    <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{currentUser.handle}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {currentUser.location}</span>
                 </div>
              </div>
          </div>
          
          <p className="text-base text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed mt-6">
            {currentUser.bio}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
            {onOpenDocumentTenure && (
              <button
                type="button"
                onClick={onOpenDocumentTenure}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-md transition cursor-pointer flex items-center space-x-2"
              >
                <Award className="h-4 w-4 text-slate-950" />
                <span>Document Community Lead Tenure</span>
              </button>
            )}
            {onOpenGithubPRIntegration && (
              <button
                type="button"
                onClick={onOpenGithubPRIntegration}
                className="px-6 py-3 rounded-xl bg-[#111827] hover:bg-slate-800 text-white font-bold shadow-md transition cursor-pointer flex items-center space-x-2"
              >
                <Github className="h-4 w-4" />
                <span>Sync GitHub Profile</span>
              </button>
            )}
            {onOpenProofVerification && (
              <button
                type="button"
                onClick={onOpenProofVerification}
                className="px-6 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-bold shadow-sm transition cursor-pointer flex items-center space-x-2"
              >
                <FileCheck className="h-4 w-4 text-emerald-600" />
                <span>Generate Proof Certificate</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 relative w-full h-[350px] flex items-center justify-center hidden md:flex">
          {/* Abstract graphics */}
          <div className="absolute w-64 h-64 bg-emerald-200 rounded-[3rem] rotate-12 opacity-70 blur-xl right-10 top-10 mix-blend-multiply animate-pulse"></div>
          <div className="absolute w-72 h-72 bg-sky-200 rounded-[4rem] -rotate-12 opacity-60 blur-2xl right-32 top-0 mix-blend-multiply"></div>
          <div className="absolute w-48 h-64 bg-gradient-to-tr from-emerald-400 to-teal-400 rounded-[2rem] shadow-2xl right-40 top-10 transform -rotate-12 transition-all duration-700 hover:scale-110 hover:rotate-3 cursor-pointer"></div>
          <div className="absolute w-56 h-56 bg-gradient-to-bl from-teal-500 to-sky-500 rounded-[2.5rem] shadow-2xl right-10 top-24 transform rotate-6 transition-all duration-700 hover:scale-110 hover:-rotate-6 cursor-pointer"></div>
          
          {/* Floating Impact Score */}
          <div className="absolute right-32 top-1/2 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50 w-56 transform -translate-y-1/2 z-20 flex flex-col items-center text-center">
             <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
               <Award className="h-6 w-6" />
             </div>
             <div className="text-4xl font-black text-slate-900 font-mono tracking-tight">{currentUser.reputation.impactScore}</div>
             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Impact Score</div>
          </div>
        </div>
      </section>

      {/* Hero Stats / Reputation */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 bg-white border border-slate-100 shadow-sm rounded-3xl p-6 md:p-8">
          <div className="flex items-center space-x-4">
             <div className="p-3.5 bg-purple-50 rounded-2xl text-purple-600"><FileCheck className="h-6 w-6"/></div>
             <div>
               <div className="text-2xl font-black text-slate-900 font-mono">{dynamicEvidenceCount}</div>
               <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Verified Proofs</div>
             </div>
          </div>
          <div className="flex items-center space-x-4">
             <div className="p-3.5 bg-sky-50 rounded-2xl text-sky-600"><Briefcase className="h-6 w-6"/></div>
             <div>
               <div className="text-2xl font-black text-slate-900 font-mono">{currentUser.reputation.completedProjectsCount || userProjects.length || 1}</div>
               <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Completed Projects</div>
             </div>
          </div>
          <div className="flex items-center space-x-4">
             <div className="p-3.5 bg-indigo-50 rounded-2xl text-indigo-600"><CheckCircle2 className="h-6 w-6"/></div>
             <div>
               <div className="text-2xl font-black text-slate-900 font-mono">{currentUser.reputation.completedBountiesCount}</div>
               <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Bounties Solved</div>
             </div>
          </div>
          <div className="flex items-center space-x-4">
             <div className="p-3.5 bg-emerald-50 rounded-2xl text-emerald-600"><DollarSign className="h-6 w-6"/></div>
             <div>
               <div className="text-2xl font-black text-slate-900 font-mono">{formatCurrency(totalSupportedVolume, displayCurrency)}</div>
               <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Escrow Backed</div>
             </div>
          </div>
          <div className="flex items-center space-x-4">
             <div className="p-3.5 bg-amber-50 rounded-2xl text-amber-600"><Award className="h-6 w-6"/></div>
             <div>
               <div className="text-2xl font-black text-slate-900 font-mono">{currentUser.reputation.communityHours}h</div>
               <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Community Hours</div>
             </div>
          </div>
        </div>
      </section>

      {/* Verified Skills Matrix */}
      <section>
        <div className="p-8 md:p-10 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6 text-left">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-3 text-slate-900 mb-3">
              <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><ShieldCheck className="h-5 w-5" /></span>
              <h2 className="text-2xl font-black">Verified Skills Matrix</h2>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Unlike traditional unverified resume claims, every skill badge below is backed by verified pull requests, commits, and milestone releases.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            {currentUser.skills.map((skill) => (
              <div
                key={skill}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm shadow-sm hover:shadow-md transition-shadow cursor-default"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lower Grid Panels */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {/* Recent Activity */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Recent Verified Activity</div>
            <span className="text-xs font-mono font-bold text-slate-500">{recentActivities.length} Evidence Records</span>
          </div>
          
          <div className="space-y-3">
            {recentActivities.slice(0, 4).map((act, idx) => {
              const isPR = act.type === 'Pull Request' || act.type === 'Commit';
              return (
                <div key={act.id || idx} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-none">
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                      isPR ? 'bg-sky-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                      {isPR ? <Github className="h-5 w-5" /> : <FileCheck className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{act.title}</div>
                      <div className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        <span className="font-semibold text-slate-700">{act.type}</span> · {act.projectTitle} · {act.submittedAt}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 ml-3 text-right">
                    <div className="text-xs font-black text-emerald-600 font-mono bg-emerald-50 px-2.5 py-1 rounded-lg">
                      +12 pts
                    </div>
                    <div className="text-[10px] font-bold text-emerald-700 mt-1 capitalize">{act.status}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      {/* Leadership Tenures & Verified Impact Section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs text-left space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-extrabold border border-amber-200 mb-1">
              <Award className="h-3.5 w-3.5 text-amber-600" />
              <span>501(c)(6) LEADERSHIP REGISTRY</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Leadership Tenures & Verified Impact</h2>
            <p className="text-xs text-slate-500 font-medium">Logged community leadership periods, proposed events verified on GitHub, and verifiable certificates.</p>
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
            <div className="col-span-full py-12 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-3">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto border border-indigo-200">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Leadership Tenures Documented Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click <span className="font-semibold text-slate-700">"+ Document New Tenure"</span> above to fill in your community leadership role, project milestones, and GitHub contribution metrics.
              </p>
            </div>
          ) : (
            userTenures.map((tenure) => (
              <div key={tenure.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase font-mono ${
                      tenure.isCurrent
                        ? 'text-indigo-700 bg-indigo-50 border-indigo-100'
                        : 'text-emerald-700 bg-emerald-50 border-emerald-100'
                    }`}>
                      {tenure.isCurrent ? 'Active Tenure' : 'Verified Complete'}
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-1">{tenure.role}</h3>
                    <p className="text-xs font-bold text-slate-600">{tenure.collectiveTitle}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {tenure.startDate} – {tenure.isCurrent ? 'Present' : tenure.endDate}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {tenure.impactSummary}
                </p>

                <div className="grid grid-cols-3 gap-2 text-center font-mono pt-2 border-t border-slate-200 text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <div className="font-bold text-indigo-700">{tenure.githubEventsCount} PRs</div>
                    <div className="text-[9px] font-sans text-slate-500 font-bold uppercase">GitHub</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <div className="font-bold text-emerald-700">{tenure.milestonesCompleted} Deliv.</div>
                    <div className="text-[9px] font-sans text-slate-500 font-bold uppercase">Milestones</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <div className="font-bold text-purple-700">{tenure.peopleReached.toLocaleString()}</div>
                    <div className="text-[9px] font-sans text-slate-500 font-bold uppercase">Reach</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-mono text-slate-500">Hash: {tenure.verificationHash.slice(0, 12)}...</span>
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

        {/* Verification Status */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Verification Status</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-none">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900">GitHub Identity</div>
                  <div className="text-xs text-slate-400 font-medium mt-1">Repository activity connected & verified</div>
                </div>
              </div>
              <div className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">Verified</div>
            </div>
            
            <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-none">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900">OpenProof Passport</div>
                  <div className="text-xs text-slate-400 font-medium mt-1">Identity & cryptographic contribution record</div>
                </div>
              </div>
              <div className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">Active</div>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-none">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <FileCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900">Evidence Submissions</div>
                  <div className="text-xs text-slate-400 font-medium mt-1">Cryptographically audited proofs</div>
                </div>
              </div>
              <div className="text-sm font-black text-indigo-700 font-mono bg-indigo-50 px-3 py-1.5 rounded-lg">
                {dynamicEvidenceCount} Logged
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-none">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900">Impact Score</div>
                  <div className="text-xs text-slate-400 font-medium mt-1">Current verified reputation score</div>
                </div>
              </div>
              <div className="text-sm font-black text-indigo-600 font-mono bg-indigo-50 px-3 py-1.5 rounded-lg">
                {currentUser.reputation.impactScore}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
