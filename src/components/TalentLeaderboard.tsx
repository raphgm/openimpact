import React, { useState } from 'react';
import { Award, Search, Filter, ShieldCheck, CheckCircle2, ChevronRight, Github, ExternalLink, Code2, Cpu, FileText } from 'lucide-react';
import { Currency } from '../types';
import { formatCurrency, convertCurrency } from '../utils/formatters';

interface TalentLeaderboardProps {
  displayCurrency: Currency;
  onOpenAuthModal?: (mode: 'collective' | 'organization' | 'individual') => void;
}

const TALENT_DATA = [
  {
    id: 'dev-1',
    name: 'Dr. Maya Lin',
    handle: '@maya_zk',
    avatar: '/unicef_icon.svg',
    role: 'Core Protocol Engineer',
    skills: ['Rust', 'Solidity', 'ZK-Proofs'],
    verifiedCommits: 1450,
    grantsEarned: 85000,
    bountiesCompleted: 24,
    impactScore: 98,
    isAvailable: true,
  },
  {
    id: 'dev-2',
    name: 'Kareem Adeyemi',
    handle: '@kareem_dev',
    avatar: '/unicef_icon.svg',
    role: 'Frontend Architect',
    skills: ['React', 'TypeScript', 'Tailwind'],
    verifiedCommits: 890,
    grantsEarned: 42000,
    bountiesCompleted: 15,
    impactScore: 92,
    isAvailable: false,
  },
  {
    id: 'dev-3',
    name: 'Kavita Sundaram',
    handle: '@kavita_sec',
    avatar: '/unicef_icon.svg',
    role: 'Security Auditor',
    skills: ['Smart Contracts', 'Auditing', 'Python'],
    verifiedCommits: 520,
    grantsEarned: 115000,
    bountiesCompleted: 8,
    impactScore: 96,
    isAvailable: true,
  },
  {
    id: 'dev-4',
    name: 'Chidi Nnamdi',
    handle: '@chidi_hw',
    avatar: '/unicef_icon.svg',
    role: 'Hardware & IoT Engineer',
    skills: ['PCB Design', 'C++', 'IoT'],
    verifiedCommits: 310,
    grantsEarned: 65000,
    bountiesCompleted: 12,
    impactScore: 89,
    isAvailable: true,
  },
  {
    id: 'dev-5',
    name: 'Michael Chang',
    handle: '@mchang_data',
    avatar: '/unicef_icon.svg',
    role: 'Data Scientist',
    skills: ['Python', 'Machine Learning', 'SQL'],
    verifiedCommits: 680,
    grantsEarned: 28000,
    bountiesCompleted: 9,
    impactScore: 85,
    isAvailable: false,
  },
];

export const TalentLeaderboard: React.FC<TalentLeaderboardProps> = ({ displayCurrency, onOpenAuthModal }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  
  const filteredData = TALENT_DATA.filter(dev => {
    const matchesSearch = dev.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dev.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dev.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = filterRole === 'All' || dev.role.includes(filterRole) || (filterRole === 'Available' && dev.isAvailable);
    return matchesSearch && matchesRole;
  }).sort((a, b) => b.impactScore - a.impactScore);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 sm:p-14 relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-left">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/10 text-indigo-300 text-xs font-mono font-bold px-3 py-1.5 rounded-full border border-indigo-400/20">
              <Award className="h-4 w-4" />
              <span>VERIFIED TALENT NETWORK</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              OpenImpact Contributor Leaderboard
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              Discover and fund top-tier independent developers based on cryptographically verified proof-of-work. Institutional grants and corporate bounties flow to those with proven track records.
            </p>
          </div>
          
          <div className="shrink-0 flex flex-col gap-3">
             <button 
                onClick={() => onOpenAuthModal?.('individual')}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg transition"
             >
                Create Developer Profile
             </button>
             <button 
                onClick={() => onOpenAuthModal?.('organization')}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm rounded-xl shadow-lg transition"
             >
                Hire / Sponsor Talent
             </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, handle, or skill (e.g. Rust)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
          {['All', 'Available', 'Engineer', 'Frontend', 'Auditor'].map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                filterRole === role 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {role === 'Available' ? '🟢 Available to Hire' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden text-left">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Developer</th>
                <th className="px-6 py-4">Core Skills</th>
                <th className="px-6 py-4 text-right">Verified Commits</th>
                <th className="px-6 py-4 text-right">Escrow Earned</th>
                <th className="px-6 py-4 text-right">Impact Score</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((dev, idx) => (
                <tr key={dev.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-black font-mono">
                      #{idx + 1}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={dev.avatar} alt={dev.name} className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" />
                        {dev.isAvailable && (
                          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" title="Available for hire/grants"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {dev.name}
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" title="Identity Verified" />
                        </div>
                        <div className="text-xs text-slate-500 font-mono">{dev.handle} • {dev.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1.5">
                      {dev.skills.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border border-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-mono font-bold text-slate-900">
                    {dev.verifiedCommits.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="font-mono font-bold text-emerald-600">
                      {formatCurrency(convertCurrency(dev.grantsEarned, 'USD', displayCurrency), displayCurrency)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{dev.bountiesCompleted} Bounties</div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-mono font-black border border-indigo-100">
                      <Award className="w-3.5 h-3.5" />
                      {dev.impactScore}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No developers found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
