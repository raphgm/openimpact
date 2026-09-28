import React, { useState } from 'react';
import { Project, Currency } from '../types';
import { formatCurrency, convertCurrency, calculateProgress } from '../utils/formatters';
import { evaluateProjectBadges } from '../utils/badgeEngine';
import { Layers, MapPin, ArrowRight, Zap, Play, Pause, DollarSign, TrendingUp, Sparkles, CheckCircle2, Award, FileCheck, ShieldCheck, PlusCircle, Ticket, Building2, Coins } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  displayCurrency: Currency;
  searchQuery?: string;
  onSelectProject: (project: Project) => void;
  onFundProject: (project: Project) => void;
  onOpenCreateProject?: () => void;
  onOpenSponsorEventModal?: () => void;
  isLiveStreamActive?: boolean;
  setIsLiveStreamActive?: (active: boolean) => void;
  latestLiveContribution?: {
    id: string;
    projectId: string;
    projectTitle: string;
    amount: number;
    currency: Currency;
    supporterName: string;
    timestamp: number;
  } | null;
  onTriggerDeposit?: (targetProjectId?: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  displayCurrency,
  searchQuery = '',
  onSelectProject,
  onFundProject,
  onOpenCreateProject,
  onOpenSponsorEventModal,
  isLiveStreamActive = true,
  setIsLiveStreamActive,
  latestLiveContribution,
  onTriggerDeposit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const categories = ['All', 'NGO & Humanitarian', 'Education', 'Tech & Open Source', 'Health', 'Infrastructure', 'Environment', 'Community'];
  const statuses = ['All', 'Funding', 'In Progress', 'Completed'];

  // Dynamic aggregate metrics computed directly from global projects state
  const totalEscrowVolume = projects.reduce(
    (sum, p) => sum + convertCurrency(p.raised, p.currency, displayCurrency),
    0
  );
  const totalBackers = projects.reduce((sum, p) => sum + (p.supportersCount || 0), 0);
  const totalEvidenceCount = projects.reduce((sum, p) => sum + (p.evidence ? p.evidence.length : 0), 0);
  const totalMilestones = projects.reduce((sum, p) => sum + (p.milestones ? p.milestones.length : 0), 0);
  const completedMilestonesCount = projects.reduce(
    (sum, p) => sum + (p.milestones ? p.milestones.filter((m) => m.status === 'Completed').length : 0),
    0
  );
  const milestoneSuccessRate =
    totalMilestones > 0 ? Math.round((completedMilestonesCount / totalMilestones) * 100) : 100;

  // Filter projects by search query, category, and status
  const q = (searchQuery || '').toLowerCase();
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.organization.name.toLowerCase().includes(q);

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-16 pb-20 font-sans text-slate-900 bg-white">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 z-10 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-bold shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>Verifiable Milestone Escrow</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Projects &<br/>
            <span className="text-indigo-800">Escrow Vault</span>
          </h1>
          <p className="text-base text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
            Fund good ideas. Build real things. Prove the impact. Escrow progress bars update live as contributions land. Milestone funds are held securely under 501(c)(6) non-profit sponsorship until verified proof is submitted.
          </p>

          {/* Quick Action CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            {onOpenCreateProject && (
              <button
                type="button"
                onClick={onOpenCreateProject}
                className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm px-6 py-3.5 rounded-full transition shadow-md cursor-pointer flex items-center space-x-2"
              >
                <PlusCircle className="h-4 w-4 text-emerald-400" />
                <span>Create New Project</span>
              </button>
            )}

            {onOpenSponsorEventModal && (
              <button
                type="button"
                onClick={onOpenSponsorEventModal}
                className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-bold text-sm px-5 py-3.5 rounded-full transition cursor-pointer flex items-center space-x-2 shadow-xs"
              >
                <Ticket className="h-4 w-4 text-indigo-600" />
                <span>Host / Sponsor Event</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 relative w-full h-[400px] flex items-center justify-center hidden md:flex">
          {/* Abstract graphics */}
          <div className="absolute w-64 h-64 bg-indigo-200 rounded-[3rem] rotate-12 opacity-80 blur-xl right-10 top-10 mix-blend-multiply animate-pulse"></div>
          <div className="absolute w-72 h-72 bg-blue-200 rounded-[4rem] -rotate-12 opacity-70 blur-2xl right-32 top-0 mix-blend-multiply"></div>
          <div className="absolute w-48 h-64 bg-gradient-to-tr from-indigo-400 to-blue-400 rounded-[2rem] shadow-2xl right-40 top-10 transform -rotate-12 transition-all duration-700 hover:scale-110 hover:rotate-3 cursor-pointer"></div>
          <div className="absolute w-56 h-56 bg-gradient-to-bl from-blue-500 to-cyan-500 rounded-[2.5rem] shadow-2xl right-10 top-24 transform rotate-6 transition-all duration-700 hover:scale-110 hover:-rotate-6 cursor-pointer"></div>
          
          {/* Floating UI Element */}
          <div className="absolute right-32 top-1/2 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 w-64 transform -translate-y-1/2 z-20">
            <div className="flex items-center space-x-3 mb-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold"><DollarSign className="h-5 w-5" /></div>
              <div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Live Escrow Volume</div>
                 <div className="text-xs font-black text-slate-900 font-mono mt-0.5">{formatCurrency(totalEscrowVolume, displayCurrency)}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold"><FileCheck className="h-5 w-5"/></div>
              <div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Verified Evidence</div>
                 <div className="text-xs font-black text-indigo-700 font-mono mt-0.5">{totalEvidenceCount} Proofs Logged</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Stats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 bg-white border border-slate-100 shadow-sm rounded-3xl p-6">
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600"><Layers className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900 font-mono">{projects.length}</div>
               <div className="text-xs text-slate-500 font-bold">Total Repositories</div>
             </div>
          </div>
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600"><DollarSign className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900 font-mono">{formatCurrency(totalEscrowVolume, displayCurrency)}</div>
               <div className="text-xs text-slate-500 font-bold">Escrow Volume</div>
             </div>
          </div>
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600"><FileCheck className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-purple-700 font-mono">{totalEvidenceCount}</div>
               <div className="text-xs text-slate-500 font-bold">Verified Proofs</div>
             </div>
          </div>
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600"><CheckCircle2 className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900 font-mono">{milestoneSuccessRate}%</div>
               <div className="text-xs text-slate-500 font-bold">Milestones Met</div>
             </div>
          </div>
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600"><Award className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900 font-mono">{totalBackers.toLocaleString()}</div>
               <div className="text-xs text-slate-500 font-bold">Active Backers</div>
             </div>
          </div>
        </div>
      </section>

      {/* Live Stream Automation Control Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111827] text-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex items-center justify-center shrink-0">
              <span className={`w-4 h-4 rounded-full ${isLiveStreamActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              <span className={`w-3 h-3 rounded-full absolute ${isLiveStreamActive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-black tracking-wide text-emerald-400">
                  {isLiveStreamActive ? 'Real-Time Escrow Activity' : 'Escrow Activity Paused'}
                </span>
              </div>
              {latestLiveContribution && (
                <p className="text-sm text-slate-300 font-medium truncate mt-1 flex items-center space-x-1.5">
                  <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="truncate">
                    <strong>+{formatCurrency(latestLiveContribution.amount, latestLiveContribution.currency)}</strong> into{' '}
                    <span className="text-white font-bold">{latestLiveContribution.projectTitle}</span> by {latestLiveContribution.supporterName}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Escrow Deposit Trigger */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onFundProject(projects[0])}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center space-x-2 shadow-sm shadow-indigo-600/30"
            >
              <Coins className="h-4 w-4 text-amber-300" />
              <span>Deposit into Escrow</span>
            </button>
          </div>
        </div>
      </section>

      {/* Explorer / Toolbar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between mb-8">
           <div className="lg:w-1/3 space-y-2">
             <div className="text-xs font-bold text-indigo-600 tracking-wide uppercase">Open Directory</div>
             <h2 className="text-2xl font-black text-slate-900">Impact Repositories</h2>
             <p className="text-xs text-slate-500 font-medium">Filter verified repositories by category or stage.</p>
             
             {/* Direct Action Buttons in Toolbar Header */}
             <div className="pt-1 flex items-center gap-2">
               {onOpenCreateProject && (
                 <button
                   type="button"
                   onClick={onOpenCreateProject}
                   className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                 >
                   <PlusCircle className="h-3.5 w-3.5 text-emerald-400" />
                   <span>+ Create Repository</span>
                 </button>
               )}
               {onOpenSponsorEventModal && (
                 <button
                   type="button"
                   onClick={onOpenSponsorEventModal}
                   className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold rounded-lg transition cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                 >
                   <Ticket className="h-3.5 w-3.5 text-indigo-600" />
                   <span>Event Hub</span>
                 </button>
               )}
             </div>
           </div>
           
           <div className="lg:w-2/3 flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full justify-end">
             <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
               {categories.map((cat) => (
                 <button
                   key={cat}
                   onClick={() => setSelectedCategory(cat)}
                   className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center space-x-2 ${
                     selectedCategory === cat
                       ? 'bg-[#111827] text-white shadow-md'
                       : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                   }`}
                 >
                   <span>{cat}</span>
                 </button>
               ))}
             </div>

             <div className="flex items-center space-x-2 shrink-0">
               <span className="text-xs text-slate-500 font-bold">Status:</span>
               <select
                 value={selectedStatus}
                 onChange={(e) => setSelectedStatus(e.target.value)}
                 className="bg-slate-50 text-slate-900 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
               >
                 {statuses.map((s) => (
                   <option key={s} value={s}>
                     {s}
                   </option>
                 ))}
               </select>
             </div>
           </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 font-medium text-sm">No projects match your current filter parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const progress = calculateProgress(project.raised, project.fundingGoal);
              const completedMilestones = project.milestones.filter((m) => m.status === 'Completed').length;
              const isJustFunded = latestLiveContribution?.projectId === project.id;
  
              return (
                <div
                  key={project.id}
                  className={`bg-white border rounded-3xl p-6 transition-all duration-500 flex flex-col justify-between shadow-sm hover:shadow-md group relative text-left ${
                    isJustFunded
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50/10'
                      : 'border-slate-100'
                  }`}
                >


                <div>
                  {/* Category & Status Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      {project.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        project.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : project.status === 'In Progress'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3
                    onClick={() => onSelectProject(project)}
                    className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition cursor-pointer line-clamp-1"
                  >
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {project.tagline}
                  </p>

                  {/* Impact Badges Micro Row */}
                  {(() => {
                    const projectBadges = evaluateProjectBadges(project);
                    if (projectBadges.length === 0) return null;
                    return (
                      <div className="flex items-center space-x-1.5 mt-2.5 overflow-hidden">
                        <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 flex items-center space-x-1 shrink-0">
                          <Award className="h-3 w-3 text-amber-500" />
                          <span>{projectBadges.length} Badges</span>
                        </span>
                        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
                          {projectBadges.slice(0, 2).map((b) => (
                            <span
                              key={b.id}
                              className="text-[9px] font-mono font-medium text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 truncate max-w-[110px]"
                            >
                              {b.name}
                            </span>
                          ))}
                          {projectBadges.length > 2 && (
                            <span className="text-[9px] font-mono text-slate-400 font-bold">
                              +{projectBadges.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Organization & Location */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center space-x-2">
                      <img
                        src={project.organization.logo}
                        alt={project.organization.name}
                        className="w-5 h-5 rounded-full object-cover border border-slate-200"
                      />
                      <span className="font-semibold text-slate-800 truncate max-w-[130px]">
                        {project.organization.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-500">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="text-[11px]">{project.location}</span>
                    </div>
                  </div>

                  {/* Animated Progress Bar Component */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center space-x-1">
                        <span className="text-indigo-700 font-extrabold text-sm font-mono">
                          {formatCurrency(project.raised, project.currency)}
                        </span>
                        <span className="text-[11px] text-indigo-600 font-semibold">raised</span>
                      </div>
                      <span className="text-slate-500 font-mono text-[11px]">
                        Target: {formatCurrency(project.fundingGoal, project.currency)}
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="relative w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/80 p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out relative ${
                          isJustFunded
                            ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 animate-pulse'
                            : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      >
                        {/* Shimmer Overlay on progress fill */}
                        <div className="absolute inset-0 bg-white/20 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:16px_16px] animate-[spin_3s_linear_infinite]" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 pt-0.5">
                      <span className="font-mono font-bold text-slate-700">{progress}% Funded</span>
                      <span>
                        {project.fundingGoal - project.raised > 0
                          ? `${formatCurrency(project.fundingGoal - project.raised, project.currency)} needed`
                          : '🎉 Goal Fully Reached!'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Metrics */}
                  <div className="grid grid-cols-4 gap-1.5 text-center mt-4 p-2 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px]">
                    <div>
                      <div className="font-bold text-slate-800 font-mono">{project.supportersCount}</div>
                      <div className="text-[9px] text-slate-500 font-medium">Backers</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 font-mono">{project.contributorsCount}</div>
                      <div className="text-[9px] text-slate-500 font-medium">Builders</div>
                    </div>
                    <div>
                      <div className="font-bold text-indigo-700 font-mono">
                        {completedMilestones}/{project.milestones.length}
                      </div>
                      <div className="text-[9px] text-slate-500 font-medium">Milestones</div>
                    </div>
                    <div>
                      <div className="font-bold text-purple-700 font-mono flex items-center justify-center space-x-0.5">
                        <FileCheck className="h-3 w-3 inline text-purple-600" />
                        <span>{project.evidence ? project.evidence.length : 0}</span>
                      </div>
                      <div className="text-[9px] text-slate-500 font-medium">Evidence</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectProject(project)}
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>View Project</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onFundProject(project)}
                    className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer active:scale-95"
                  >
                    Fund
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </section>
    </div>
  );
};

