import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Command,
  ShieldCheck,
  FolderGit2,
  Gift,
  Coins,
  FileCode2,
  Sparkles,
  Building2,
  History,
  X,
  ArrowRight,
  PlusCircle,
  ExternalLink,
  Lock,
  GitPullRequest,
  Award
} from 'lucide-react';
import { Project, GrantProgram, Opportunity } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onOpenProofModal: () => void;
  onOpenAiAdvisor: () => void;
  onOpenCreateProject: () => void;
  onOpenDocumentTenure?: () => void;
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenProofModal,
  onOpenAiAdvisor,
  onOpenCreateProject,
  onOpenDocumentTenure,
  projects,
  onSelectProject,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent if needed
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    {
      id: 'doc-tenure',
      title: 'Document Leadership Activities',
      subtitle: 'Record leadership periods, proposed events verified on GitHub, and impact activities',
      icon: <Award className="h-4 w-4 text-amber-400" />,
      action: () => {
        onClose();
        if (onOpenDocumentTenure) onOpenDocumentTenure();
      },
      category: 'Leadership & Impact',
    },
    {
      id: 'proof-cert',
      title: 'Generate Proof of Contribution Certificate',
      subtitle: 'Compile verified GitHub PRs & commits into an official attestation',
      icon: <ShieldCheck className="h-4 w-4 text-emerald-400" />,
      action: () => {
        onClose();
        onOpenProofModal();
      },
      category: 'Developer Tools',
    },
    {
      id: 'ai-reviewer',
      title: 'Open AI Reviewer & Matcher',
      subtitle: 'Instant code audit, milestone verification, and sponsor matching',
      icon: <Sparkles className="h-4 w-4 text-indigo-400" />,
      action: () => {
        onClose();
        onOpenAiAdvisor();
      },
      category: 'Developer Tools',
    },
    {
      id: 'create-project',
      title: 'Start / Onboard a Collective',
      subtitle: 'Apply for 501(c)(6) fiscal hosting and milestone escrow',
      icon: <PlusCircle className="h-4 w-4 text-teal-400" />,
      action: () => {
        onClose();
        onOpenCreateProject();
      },
      category: 'Collectives & Escrow',
    },
    {
      id: 'nav-projects',
      title: 'Browse Collectives & Projects',
      subtitle: 'Explore open source initiatives with verified milestone escrow',
      icon: <FolderGit2 className="h-4 w-4 text-sky-400" />,
      action: () => {
        onClose();
        onNavigate('projects');
      },
      category: 'Navigation',
    },
    {
      id: 'nav-grants',
      title: 'Explore Grant Programs',
      subtitle: 'Active institutional funding and quadratic grant rounds',
      icon: <Gift className="h-4 w-4 text-purple-400" />,
      action: () => {
        onClose();
        onNavigate('grants');
      },
      category: 'Navigation',
    },
    {
      id: 'nav-bounties',
      title: 'Milestone Bounties & Tasks',
      subtitle: 'Contribute code and earn escrow-backed bounty disbursements',
      icon: <Coins className="h-4 w-4 text-amber-400" />,
      action: () => {
        onClose();
        onNavigate('bounties');
      },
      category: 'Navigation',
    },
    {
      id: 'nav-ledger',
      title: 'Transparent Public Ledger',
      subtitle: 'Cryptographic proof of work records, audits, and real-time disbursements',
      icon: <History className="h-4 w-4 text-emerald-400" />,
      action: () => {
        onClose();
        onNavigate('ledger');
      },
      category: 'Fiscal Transparency',
    },
    {
      id: 'nav-fiscal',
      title: '501(c)(6) Fiscal Sponsorship Portal',
      subtitle: 'Tax compliance, institutional banking, and legal umbrella details',
      icon: <Building2 className="h-4 w-4 text-indigo-400" />,
      action: () => {
        onClose();
        onNavigate('fiscal-host');
      },
      category: 'Fiscal Transparency',
    },
  ];

  // Project search matches
  const projectMatches = projects
    .filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    )
    .slice(0, 4)
    .map((p) => ({
      id: `proj-${p.id}`,
      title: p.title,
      subtitle: `${p.category} • ${p.githubRepo || 'Open Source'}`,
      icon: <FolderGit2 className="h-4 w-4 text-indigo-400" />,
      action: () => {
        onClose();
        onSelectProject(p);
      },
      category: 'Active Collectives',
    }));

  const filteredActions = quickActions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  const allResults = [...filteredActions, ...projectMatches];

  const handleSelect = (index: number) => {
    if (allResults[index]) {
      allResults[index].action();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (allResults.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allResults.length) % (allResults.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(selectedIndex);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[80vh] text-slate-900 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50">
          <Search className="h-5 w-5 text-indigo-600 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, search collective, grant, or certificate tool..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <div className="flex items-center space-x-1.5 shrink-0 pl-2">
            <kbd className="text-[10px] font-mono bg-white text-slate-500 px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 divide-y divide-slate-100/50">
          {allResults.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Search className="h-8 w-8 mx-auto text-slate-300 mb-2 opacity-50" />
              <p className="text-sm font-semibold">No commands or collectives match "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for "proof", "escrow", "grants", or "bounties"</p>
            </div>
          ) : (
            allResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(idx)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition ${
                    isSelected
                      ? 'bg-indigo-50 border border-indigo-100 text-indigo-900'
                      : 'hover:bg-slate-50 text-slate-600 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-bold truncate ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>{item.title}</span>
                        <span className="text-[10px] font-mono text-slate-500 px-1.5 py-0.5 rounded bg-white border border-slate-200">
                          {item.category}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${isSelected ? 'text-indigo-700/70' : 'text-slate-500'}`}>{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      isSelected ? 'text-indigo-600 translate-x-0.5' : 'text-slate-300 opacity-0'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1">
              <kbd className="bg-white px-1.5 py-0.5 rounded text-[10px] border border-slate-200 text-slate-400">↑</kbd>
              <kbd className="bg-white px-1.5 py-0.5 rounded text-[10px] border border-slate-200 text-slate-400">↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-white px-1.5 py-0.5 rounded text-[10px] border border-slate-200 text-slate-400">↵</kbd> Select
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-indigo-600 font-bold">
            <Command className="h-3 w-3" />
            <span>OpenImpact Command Hub</span>
          </div>
        </div>
      </div>
    </div>
  );
};
