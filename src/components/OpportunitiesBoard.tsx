import React, { useState, useRef } from 'react';
import { Opportunity, Currency } from '../types';
import { formatCurrency } from '../utils/formatters';
import { filterSpamOpportunities } from '../utils/spamFilter';
import {
  Briefcase,
  Github,
  Clock,
  CheckCircle2,
  Send,
  ExternalLink,
  Code,
  DollarSign,
  UserCheck,
  CheckCircle,
  ArrowRight,
  Target,
  Award,
  ShieldCheck
} from 'lucide-react';

interface OpportunitiesBoardProps {
  opportunities: Opportunity[];
  displayCurrency: Currency;
  searchQuery?: string;
  onApply: (opportunity: Opportunity) => void;
  onAddOpportunities?: (newOpps: Opportunity[]) => void;
}

export const OpportunitiesBoard: React.FC<OpportunitiesBoardProps> = ({
  opportunities,
  displayCurrency,
  searchQuery = '',
  onApply,
  onAddOpportunities,
}) => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [appliedModalOpp, setAppliedModalOpp] = useState<Opportunity | null>(null);
  const [ashbyModalOpp, setAshbyModalOpp] = useState<Opportunity | null>(null);
  const [proposalText, setProposalText] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('https://github.com/rafael-dev');
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const lastSyncRef = useRef<number>(0);
  const [syncMessage, setSyncMessage] = useState('');

  // Upwork-style Talent Profile Upload state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [talentProfile, setTalentProfile] = useState<{
    name: string;
    title: string;
    category: string;
    hourlyRate: string;
    bio: string;
    skills: string[];
    isPublished: boolean;
  }>({
    name: 'obi michael',
    title: 'Senior Full-Stack & ZK Cryptography Engineer',
    category: 'Full-Stack Development',
    hourlyRate: '$85/hr',
    bio: 'Experienced open-source core maintainer specializing in TypeScript, React, Rust, and secure milestone escrow protocols.',
    skills: ['TypeScript', 'React', 'Security', 'DevOps'],
    isPublished: true,
  });
  const [tempSkillInput, setTempSkillInput] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Post New Bounty modal state
  const [showPostBountyModal, setShowPostBountyModal] = useState(false);
  const [newBountyTitle, setNewBountyTitle] = useState('');
  const [newBountyProject, setNewBountyProject] = useState('OpenImpact Core');
  const [newBountyReward, setNewBountyReward] = useState('1,500');
  const [newBountyType, setNewBountyType] = useState<'Bounty' | 'Contract' | 'Grant Opportunity'>('Bounty');
  const [newBountySkill, setNewBountySkill] = useState('TypeScript');
  const [newBountyDescription, setNewBountyDescription] = useState('');
  const [postBountySuccess, setPostBountySuccess] = useState(false);

  const handleSyncLiveBounties = async () => {
    const now = Date.now();
    if (now - lastSyncRef.current < 5000) {
      setSyncMessage('Please wait a few seconds before syncing again.');
      setTimeout(() => setSyncMessage(''), 3000);
      return;
    }
    lastSyncRef.current = now;
    setIsSyncing(true);
    setSyncMessage('');
    try {
      const res = await fetch('/api/opportunities/live');
      if (!res.ok) throw new Error('Failed to fetch online bounties');
      const liveOpps = await res.json();
      const cleanLiveOpps = filterSpamOpportunities(liveOpps);
      if (onAddOpportunities && Array.isArray(cleanLiveOpps) && cleanLiveOpps.length > 0) {
        onAddOpportunities(cleanLiveOpps);
        setSyncMessage(`Successfully synced ${cleanLiveOpps.length} live GitHub bounties!`);
      } else {
        setSyncMessage('No new online bounties found.');
      }
    } catch (err: any) {
      console.error(err);
      setSyncMessage('Error syncing online bounties: ' + (err.message || 'Network error'));
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(''), 4000);
    }
  };

  const types = ['All', 'Bounty', 'Contract', 'Grant Opportunity', 'Volunteer'];
  const allSkills = [
    'All',
    'Terraform',
    'Azure',
    'React',
    'TypeScript',
    'Python',
    'ESP32',
    'Figma',
    'Security',
    'DevOps',
  ];

  const q = (searchQuery || '').toLowerCase();
  const cleanOpportunities = filterSpamOpportunities<Opportunity>(opportunities);
  const filteredOpps = cleanOpportunities.filter((o) => {
    const matchesSearch =
      o.title.toLowerCase().includes(q) ||
      o.description.toLowerCase().includes(q) ||
      o.skills.some((s) => s.toLowerCase().includes(q));

    const matchesType = selectedType === 'All' || o.type === selectedType;
    const matchesSkill = selectedSkill === 'All' || o.skills.includes(selectedSkill);

    return matchesSearch && matchesType && matchesSkill;
  });

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSuccess(true);
    setTimeout(() => {
      if (appliedModalOpp) {
        onApply(appliedModalOpp);
      }
      setAppliedModalOpp(null);
      setAppliedSuccess(false);
      setProposalText('');
    }, 1200);
  };

  return (
    <div className="space-y-16 pb-20 font-sans text-slate-900 bg-white">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 z-10 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-50 border border-cyan-100 rounded-full text-cyan-700 text-xs font-bold shadow-sm">
            <span>Verifiable Work Marketplace</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Opportunities &<br/>
            <span className="text-cyan-800">Bounties</span>
          </h1>
          <p className="text-base text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
            Projects don't only need money—they need capable people. Solve issues, complete bounties, earn rewards, and convert every pull request into verified evidence of your reputation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button
              onClick={handleSyncLiveBounties}
              disabled={isSyncing}
              className="w-full sm:w-auto h-12 px-5 bg-[#111827] hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              <Github className="h-4 w-4" />
              <span>{isSyncing ? 'Syncing Live...' : 'Sync GitHub Bounties'}</span>
            </button>

            <button
              onClick={() => setShowProfileModal(true)}
              className="w-full sm:w-auto h-12 px-5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap"
            >
              <Award className="h-4 w-4" />
              <span>{talentProfile.isPublished ? 'Edit My Talent Profile' : 'Upload Talent Profile'}</span>
            </button>

            <button
              onClick={() => setShowPostBountyModal(true)}
              className="w-full sm:w-auto h-12 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap"
            >
              <Briefcase className="h-4 w-4" />
              <span>Post New Funded Job</span>
            </button>
          </div>

          {talentProfile.isPublished && (
            <div className="p-4 bg-cyan-50/80 border border-cyan-200 rounded-2xl flex items-center justify-between mt-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white font-black flex items-center justify-center text-sm">
                  {talentProfile.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-cyan-950 flex items-center gap-2">
                    <span>{talentProfile.name}</span>
                    <span className="text-[10px] bg-cyan-200/60 text-cyan-800 px-2 py-0.5 rounded-full font-mono">{talentProfile.hourlyRate}</span>
                    <span className="text-[10px] bg-cyan-700 text-white px-2 py-0.5 rounded-md font-medium">{talentProfile.category}</span>
                  </div>
                  <p className="text-xs text-cyan-900 font-medium">{talentProfile.title}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                ✓ Pitch Ready
              </span>
            </div>
          )}

          {syncMessage && (
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-2 rounded-lg border border-emerald-200 mt-4">
              <CheckCircle2 className="h-4 w-4" />
              <span>{syncMessage}</span>
            </div>
          )}
        </div>

        <div className="flex-1 relative w-full h-[400px] flex items-center justify-center hidden md:flex">
          {/* Abstract graphics */}
          <div className="absolute w-64 h-64 bg-cyan-200 rounded-[3rem] rotate-12 opacity-80 blur-xl right-10 top-10 mix-blend-multiply animate-pulse"></div>
          <div className="absolute w-72 h-72 bg-teal-200 rounded-[4rem] -rotate-12 opacity-70 blur-2xl right-32 top-0 mix-blend-multiply"></div>
          <div className="absolute w-48 h-64 bg-gradient-to-tr from-cyan-400 to-blue-400 rounded-[2rem] shadow-2xl right-40 top-10 transform -rotate-12 transition-all duration-700 hover:scale-110 hover:rotate-3 cursor-pointer"></div>
          <div className="absolute w-56 h-56 bg-gradient-to-bl from-blue-500 to-cyan-500 rounded-[2.5rem] shadow-2xl right-10 top-24 transform rotate-6 transition-all duration-700 hover:scale-110 hover:-rotate-6 cursor-pointer"></div>
          
          {/* Floating UI Element */}
          <div className="absolute right-32 top-1/2 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 w-64 transform -translate-y-1/2 z-20">
            <div className="flex items-center space-x-3 mb-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold"><CheckCircle2 className="h-5 w-5" /></div>
              <div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">PR Merged</div>
                 <div className="h-2.5 bg-slate-200 rounded-full w-24 mt-1"></div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold"><DollarSign className="h-5 w-5"/></div>
              <div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Bounty Paid</div>
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
             <div className="p-2.5 bg-cyan-50 rounded-xl text-cyan-600"><Briefcase className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900">{opportunities.filter((o) => o.status === 'Open').length}</div>
               <div className="text-xs text-slate-500 font-bold">Open Bounties</div>
             </div>
          </div>
          <div className="hidden lg:block w-px h-10 bg-slate-100"></div>
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600"><DollarSign className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900">{formatCurrency(14500, 'USD')}</div>
               <div className="text-xs text-slate-500 font-bold">Total Payouts</div>
             </div>
          </div>
          <div className="hidden lg:block w-px h-10 bg-slate-100"></div>
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600"><Code className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900">42</div>
               <div className="text-xs text-slate-500 font-bold">Merged PRs</div>
             </div>
          </div>
          <div className="hidden lg:block w-px h-10 bg-slate-100"></div>
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600"><UserCheck className="h-5 w-5"/></div>
             <div>
               <div className="text-xl font-black text-slate-900">120+</div>
               <div className="text-xs text-slate-500 font-bold">Contributors</div>
             </div>
          </div>
        </div>
      </section>

      {/* Explorer / Toolbar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 pt-16">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between mb-8">
           <div className="lg:w-1/3">
             <div className="text-xs font-bold text-indigo-600 mb-2 tracking-wide uppercase">Job Board</div>
             <h2 className="text-2xl font-black text-slate-900 mb-2">Available Tasks</h2>
             <p className="text-xs text-slate-500 font-medium">Filter by role, stack, or organization.</p>
           </div>
           
           <div className="lg:w-2/3 flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full">
             <div className="flex-1 flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
               {types.map((t) => (
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
                 </button>
               ))}
             </div>

             <div className="flex items-center space-x-2 shrink-0">
               <span className="text-xs text-slate-500 font-bold">Skill:</span>
               <select
                 value={selectedSkill}
                 onChange={(e) => setSelectedSkill(e.target.value)}
                 className="bg-slate-50 text-slate-900 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
               >
                 {allSkills.map((s) => (
                   <option key={s} value={s}>
                     {s}
                   </option>
                 ))}
               </select>
             </div>
           </div>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpps.map((opp) => (
            <div
              key={opp.id}
              className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition rounded-3xl p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 truncate">
                    {opp.type}
                  </span>
                  <span className="text-xs font-black text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0 shadow-sm">
                    {opp.rewardAmount > 0 ? formatCurrency(opp.rewardAmount, opp.currency) : 'Volunteer'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3
                    onClick={() => setAshbyModalOpp(opp)}
                    className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-2 cursor-pointer"
                  >
                    {opp.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium line-clamp-1">
                    Project: <span className="text-slate-800 font-semibold">{opp.projectName}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {opp.description}
                </p>

                {/* Skill Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {opp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-mono font-bold bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200/80"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions & Meta */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3 text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {opp.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                    {opp.applicantsCount}
                  </span>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {opp.githubIssue && (
                    <a
                      href={opp.githubIssue}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition"
                      title="View GitHub Issue"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {opp.rewardAmount > 0 && (
                    <button
                      onClick={() => {
                        setAppliedModalOpp(opp);
                      }}
                      className="py-2 px-4 bg-[#111827] hover:bg-slate-800 text-white font-bold rounded-xl transition shadow-sm cursor-pointer"
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Apply Modal */}
      {appliedModalOpp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-8 shadow-2xl text-slate-900 relative text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">{appliedModalOpp.type}</span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Apply Now</h3>
              </div>
              <button
                onClick={() => setAppliedModalOpp(null)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {appliedSuccess ? (
              <div className="py-10 text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto" />
                <h4 className="text-2xl font-black text-slate-900">Application Submitted!</h4>
                <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto font-medium">
                  The project team will review your proposal and verify your Github profile.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitProposal} className="mt-6 space-y-5">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{appliedModalOpp.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">Project: {appliedModalOpp.projectName}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Portfolio / GitHub Profile Link
                  </label>
                  <input
                    type="url"
                    required
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-sm px-4 py-3 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Proposal / Technical Approach
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Briefly explain how you plan to complete this task and deliver verifiable proof..."
                    value={proposalText}
                    onChange={(e) => setProposalText(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition resize-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#111827] hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer mt-2"
                >
                  Submit Contribution Proposal
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Talent Profile Upload / Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-8 shadow-2xl text-slate-900 relative text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-100">Talent Marketplace</span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Upload & Publish Your Profile</h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {profileSuccess ? (
              <div className="py-10 text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto" />
                <h4 className="text-2xl font-black text-slate-900">Profile Published!</h4>
                <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto font-medium">
                  Your professional contributor profile is now live in the OpenImpact talent network. Projects can now review your skills and invite you to pitch for bounties.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setProfileSuccess(true);
                  setTimeout(() => {
                    setProfileSuccess(false);
                    setShowProfileModal(false);
                  }, 1500);
                }}
                className="mt-6 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={talentProfile.name}
                      onChange={(e) => setTalentProfile({ ...talentProfile, name: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 text-sm px-4 py-2.5 rounded-xl border border-slate-200 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Hourly Rate / Target</label>
                    <input
                      type="text"
                      required
                      value={talentProfile.hourlyRate}
                      onChange={(e) => setTalentProfile({ ...talentProfile, hourlyRate: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 text-sm px-4 py-2.5 rounded-xl border border-slate-200 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Professional Title</label>
                  <input
                    type="text"
                    required
                    value={talentProfile.title}
                    onChange={(e) => setTalentProfile({ ...talentProfile, title: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 text-sm px-4 py-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Domain Category</label>
                  <select
                    value={talentProfile.category}
                    onChange={(e) => setTalentProfile({ ...talentProfile, category: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 text-sm px-4 py-2.5 rounded-xl border border-slate-200 font-medium"
                  >
                    <option value="Full-Stack Development">Full-Stack Development</option>
                    <option value="Smart Contracts & ZK">Smart Contracts & ZK</option>
                    <option value="DevOps & Infrastructure">DevOps & Infrastructure</option>
                    <option value="Security & Auditing">Security & Auditing</option>
                    <option value="Technical Writing & Governance">Technical Writing & Governance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Bio & Experience</label>
                  <textarea
                    rows={3}
                    required
                    value={talentProfile.bio}
                    onChange={(e) => setTalentProfile({ ...talentProfile, bio: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 text-sm px-4 py-2.5 rounded-xl border border-slate-200 font-medium resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Key Skills</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {talentProfile.skills.map((s, idx) => (
                      <span key={s} className="inline-flex items-center gap-1 text-xs font-mono bg-cyan-50 text-cyan-800 px-2.5 py-1 rounded-lg border border-cyan-200 font-bold">
                        {s}
                        <button
                          type="button"
                          onClick={() => setTalentProfile({ ...talentProfile, skills: talentProfile.skills.filter((_, i) => i !== idx) })}
                          className="text-cyan-600 hover:text-cyan-900 ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add skill (e.g. Solidity, Rust)..."
                      value={tempSkillInput}
                      onChange={(e) => setTempSkillInput(e.target.value)}
                      className="flex-1 bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (tempSkillInput.trim() && !talentProfile.skills.includes(tempSkillInput.trim())) {
                          setTalentProfile({ ...talentProfile, skills: [...talentProfile.skills, tempSkillInput.trim()] });
                          setTempSkillInput('');
                        }
                      }}
                      className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer mt-4"
                >
                  Save & Publish Talent Profile
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Post New Funded Job / Bounty Modal */}
      {showPostBountyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-8 shadow-2xl text-slate-900 relative text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">Escrow-Backed Posting</span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Post New Funded Job / Bounty</h3>
              </div>
              <button
                onClick={() => setShowPostBountyModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {postBountySuccess ? (
              <div className="py-10 text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto" />
                <h4 className="text-2xl font-black text-slate-900">Bounty Published & Funded!</h4>
                <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto font-medium">
                  Your job posting is now live on the OpenImpact work marketplace with milestone escrow secured.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const newOpp: Opportunity = {
                    id: 'opp_' + Date.now(),
                    title: newBountyTitle || 'New Open Source Bounty',
                    projectId: 'proj_1',
                    projectName: newBountyProject,
                    type: newBountyType,
                    rewardAmount: parseFloat(newBountyReward.replace(/[^0-9.]/g, '')) || 1000,
                    currency: 'USD',
                    duration: '2 weeks',
                    skills: [newBountySkill],
                    description: newBountyDescription || 'Contribute to core architecture with milestone escrow payout upon CI/CD verification.',
                    status: 'Open',
                    applicantsCount: 0,
                  };
                  if (onAddOpportunities) {
                    onAddOpportunities([newOpp]);
                  }
                  setPostBountySuccess(true);
                  setTimeout(() => {
                    setPostBountySuccess(false);
                    setShowPostBountyModal(false);
                    setNewBountyTitle('');
                    setNewBountyDescription('');
                  }, 1500);
                }}
                className="mt-6 space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Job / Bounty Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Implement ZK Proof Verification Module"
                    value={newBountyTitle}
                    onChange={(e) => setNewBountyTitle(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-sm px-4 py-2.5 rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Project Name</label>
                    <input
                      type="text"
                      required
                      value={newBountyProject}
                      onChange={(e) => setNewBountyProject(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 text-sm px-4 py-2.5 rounded-xl border border-slate-200 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Reward Amount ($)</label>
                    <input
                      type="text"
                      required
                      value={newBountyReward}
                      onChange={(e) => setNewBountyReward(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 text-sm px-4 py-2.5 rounded-xl border border-slate-200 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Opportunity Type</label>
                    <select
                      value={newBountyType}
                      onChange={(e) => setNewBountyType(e.target.value as any)}
                      className="w-full bg-slate-50 text-slate-900 text-sm px-4 py-2.5 rounded-xl border border-slate-200 font-medium"
                    >
                      <option value="Bounty">Bounty</option>
                      <option value="Contract">Contract</option>
                      <option value="Grant Opportunity">Grant Opportunity</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Primary Skill</label>
                    <input
                      type="text"
                      required
                      value={newBountySkill}
                      onChange={(e) => setNewBountySkill(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 text-sm px-4 py-2.5 rounded-xl border border-slate-200 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Task Description & Deliverables</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe what needs to be built and how deliverables will be verified..."
                    value={newBountyDescription}
                    onChange={(e) => setNewBountyDescription(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-sm px-4 py-2.5 rounded-xl border border-slate-200 font-medium resize-none"
                  />
                </div>

                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl text-xs font-medium border border-emerald-200 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Funds will be automatically locked in OpenImpact Milestone Escrow upon publishing.</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer mt-2"
                >
                  Publish & Lock Escrow Funds
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Ashby-Style Job Details Modal */}
      {ashbyModalOpp && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-8 shadow-2xl text-slate-900 relative text-left my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-lg shadow-md">
                  {ashbyModalOpp.projectName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">{ashbyModalOpp.projectName}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">🌍 Worldwide / Remote</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-1">{ashbyModalOpp.title}</h2>
                </div>
              </div>
              <button
                onClick={() => setAshbyModalOpp(null)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Compensation & Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-xs">
                <div>
                  <span className="text-slate-500 block font-medium">Compensation</span>
                  <span className="text-slate-900 font-black text-sm">{ashbyModalOpp.rewardAmount > 0 ? formatCurrency(ashbyModalOpp.rewardAmount, ashbyModalOpp.currency) : 'Volunteer'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Type</span>
                  <span className="text-slate-900 font-bold">{ashbyModalOpp.type}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Duration</span>
                  <span className="text-slate-900 font-bold">{ashbyModalOpp.duration}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-medium">Escrow Status</span>
                  <span className="text-emerald-700 font-bold">🔒 Locked & Funded</span>
                </div>
              </div>

              {/* About the Role */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About the Role</h4>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {ashbyModalOpp.description}
                </p>
              </div>

              {/* Key Responsibilities */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Deliverables & Responsibilities</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 font-medium">
                  <li>Implement core architecture and production-ready modules in {ashbyModalOpp.skills.join(', ')}.</li>
                  <li>Ensure 100% test coverage and compliance with OpenImpact CI/CD security standards.</li>
                  <li>Submit peer-audited pull requests for automated escrow milestone release.</li>
                  <li>Collaborate directly with core maintainers and community auditors.</li>
                </ul>
              </div>

              {/* Required Stack */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Required Skills & Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {ashbyModalOpp.skills.map((s) => (
                    <span key={s} className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Escrow Guarantee Notice */}
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center space-x-3 text-xs text-indigo-950 font-medium">
                <ShieldCheck className="h-6 w-6 text-indigo-600 shrink-0" />
                <div>
                  <span className="font-bold block">OpenImpact Escrow Guarantee</span>
                  <span>This job is backed by smart-contract escrow. Funds are automatically disbursed the moment your PR passes CI/CD tests and is merged by the maintainer.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const shareUrl = window.location.origin + window.location.pathname + '?job=' + ashbyModalOpp.id;
                    navigator.clipboard.writeText(shareUrl);
                    alert('Job share link copied to clipboard: ' + shareUrl);
                  }}
                  className="px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Copy Shareable Link</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAshbyModalOpp(null)}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const opp = ashbyModalOpp;
                      setAshbyModalOpp(null);
                      if (opp) setAppliedModalOpp(opp);
                    }}
                    className="px-6 py-3 bg-[#111827] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <span>Apply & Pitch for Position</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
