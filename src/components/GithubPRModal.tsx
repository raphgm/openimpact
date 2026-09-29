import React, { useState } from 'react';
import {
  GitPullRequest,
  GitCommit,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  X,
  FileCode,
  ShieldCheck,
  User,
  Star,
  GitFork,
  Eye,
  Lock,
  Sparkles,
  ArrowRight,
  Code2,
  MessageSquare,
  AlertCircle,
  Terminal,
  Building2,
} from 'lucide-react';
import { UserProfile, ExportedGithubData } from '../types';

interface GithubPRModalProps {
  isOpen: boolean;
  onClose: () => void;
  prUrl?: string;
  currentUser?: UserProfile | null;
  onOpenProofVerification?: (data?: ExportedGithubData) => void;
}

export const GithubPRModal: React.FC<GithubPRModalProps> = ({
  isOpen,
  onClose,
  prUrl = 'github.com/openimpact/pay-bridge/pull/142',
  currentUser,
  onOpenProofVerification,
}) => {
  const [activeTab, setActiveTab] = useState<'conversation' | 'commits' | 'checks' | 'files'>('conversation');
  const [copied, setCopied] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<
    { id: string; user: string; avatar: string; role: string; text: string; time: string; isBot?: boolean }[]
  >([
    {
      id: 'c1',
      user: 'sarahchen-dev',
      avatar: '/unicef_icon.svg',
      role: 'Lead Maintainer',
      text: 'Submitted PR for Milestone #2 delivery: Implemented the non-profit fiat-to-crypto payout bridge for OpenImpact Escrow. Includes smart contract router, zero-fee gas optimization, and automated audit webhook triggers. Ready for peer review!',
      time: '2 hours ago',
    },
    {
      id: 'c2',
      user: 'openproof-bot',
      avatar: '/unicef_icon.svg',
      role: 'Bot / Automated Auditor',
      text: '🤖 **OpenProof Escrow Verification Status**: All 4 automated integration tests passed. Zero-knowledge proof verified against vault #0x9a83...412. Required signatures: 3/3 collected.',
      time: '1 hour ago',
      isBot: true,
    },
    {
      id: 'c3',
      user: 'tunde-bakare',
      avatar: '/unicef_icon.svg',
      role: 'Community Auditor',
      text: 'Reviewed the smart contract payout router and test suite. Gas optimizations look great, and all milestone deliverables match the specs. Approved! LGTM 🚀',
      time: '45 mins ago',
    },
  ]);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://${prUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments([
      ...comments,
      {
        id: `c_${Date.now()}`,
        user: 'you (OpenImpact Contributor)',
        avatar: '/unicef_icon.svg',
        role: 'Verified Reviewer',
        text: commentText,
        time: 'Just now',
      },
    ]);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl text-slate-100 my-auto text-left relative font-sans max-h-[calc(100dvh-2rem)] overflow-y-auto">
        
        {/* Top GitHub Dark Header Bar */}
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-800 p-1.5 rounded-lg border border-slate-700 text-slate-300">
              <Code2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                <span className="hover:text-white transition cursor-pointer font-bold">openimpact</span>
                <span>/</span>
                <span className="text-white font-bold hover:underline cursor-pointer">pay-bridge</span>
                <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full border border-slate-700 font-semibold">
                  Public
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenProofVerification && (
              <button
                type="button"
                onClick={() => {
                  const cleanUrl = prUrl.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
                  const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/i) ||
                                cleanUrl.match(/^([^/]+)\/([^/]+)\/pull\/(\d+)/i);
                  const repo = match ? `${match[1]}/${match[2]}` : 'openimpact/pay-bridge';
                  const prNum = match ? `PR #${match[3]}` : 'PR #142';

                  const exported: ExportedGithubData = {
                    repo,
                    contributorName: currentUser?.name || 'Sarah Chen',
                    contributorHandle: currentUser?.githubUsername
                      ? `@${currentUser.githubUsername}`
                      : `@${currentUser?.handle || 'sarahchen-dev'}`,
                    prTitle: 'feat(escrow): implement multi-currency fiat & crypto payout bridge router',
                    prNumber: prNum,
                    prUrl: `https://${cleanUrl}`,
                    additions: 124,
                    deletions: 12,
                    date: 'May 12, 2026',
                    status: 'Merged & Verified',
                  };
                  onClose();
                  onOpenProofVerification(exported);
                }}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold rounded-md flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
                title="Generate Proof of Contribution Certificate from this PR"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Proof Certificate</span>
              </button>
            )}
            <button
              onClick={handleCopyUrl}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-md border border-slate-700 flex items-center space-x-1 transition cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy URL'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PR Main Title Banner */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1 max-w-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
                <span>feat(escrow): implement milestone #2 payout bridge & automated proof verification</span>
                <span className="text-slate-500 font-mono font-normal text-lg">#142</span>
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="bg-purple-900/60 text-purple-300 border border-purple-700/60 font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
                  <GitPullRequest className="h-3.5 w-3.5 text-purple-400" />
                  <span>Merged</span>
                </span>
                <span className="text-slate-300 font-semibold">@sarahchen-dev</span>
                <span>wants to merge 3 commits into</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-indigo-300 font-bold border border-slate-700">
                  main
                </span>
                <span>from</span>
                <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700">
                  feature/milestone-2-escrow
                </span>
              </div>
            </div>

            {/* OpenProof Verified Badge */}
            <div className="bg-emerald-950/60 border border-emerald-500/40 p-3 rounded-xl flex items-center space-x-3 text-xs">
              <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-emerald-300 font-mono">OpenProof Escrow Status</div>
                <div className="text-[11px] text-emerald-200">Verified & $12,500 USDC Released</div>
              </div>
            </div>
          </div>

          {/* GitHub Navigation Tabs */}
          <div className="flex border-b border-slate-800 pt-3 space-x-1 text-xs font-medium text-slate-400">
            {[
              { id: 'conversation', label: 'Conversation', icon: MessageSquare, count: comments.length },
              { id: 'commits', label: 'Commits', icon: GitCommit, count: 3 },
              { id: 'checks', label: 'Checks', icon: CheckCircle2, count: '4/4' },
              { id: 'files', label: 'Files Changed', icon: FileCode, count: '+342 -48' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 rounded-t-lg transition flex items-center space-x-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-white border-t-2 border-indigo-500 font-bold'
                      : 'hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                  <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full text-[10px] font-mono border border-slate-700">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 max-h-[50vh] overflow-y-auto space-y-6">
          {/* TAB 1: CONVERSATION */}
          {activeTab === 'conversation' && (
            <div className="space-y-4">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className={`border rounded-xl p-4 text-xs space-y-2 text-left ${
                    c.isBot
                      ? 'bg-slate-950/80 border-emerald-500/40 ring-1 ring-emerald-500/20'
                      : 'bg-slate-800/60 border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                    <div className="flex items-center space-x-2">
                      <img src={c.avatar} alt={c.user} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-bold text-white">{c.user}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                        {c.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{c.time}</span>
                  </div>
                  <div className="text-slate-300 leading-relaxed space-y-2 whitespace-pre-line font-mono text-[11px]">
                    {c.text}
                  </div>
                </div>
              ))}

              {/* Add Reviewer Comment Form */}
              <form onSubmit={handleAddComment} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                  <Terminal className="h-4 w-4 text-indigo-400" />
                  <span>Add Reviewer Comment or Peer Signature</span>
                </div>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Leave a code review comment, approval note, or cryptographic signature verification..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                  rows={3}
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition shadow-sm cursor-pointer"
                  >
                    Comment & Sign
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: COMMITS */}
          {activeTab === 'commits' && (
            <div className="space-y-3 font-mono text-xs">
              {[
                {
                  hash: '7f3a81c',
                  msg: 'feat(escrow): add SmartContract payout bridge router with 0% fee logic',
                  author: 'sarahchen-dev',
                  date: '2 hours ago',
                },
                {
                  hash: '0d921b4',
                  msg: 'test(escrow): unit test suite for milestone proof verification webhooks',
                  author: 'sarahchen-dev',
                  date: '3 hours ago',
                },
                {
                  hash: '4e129a0',
                  msg: 'docs: update OpenAPI spec for OpenImpact escrow release callback',
                  author: 'sarahchen-dev',
                  date: '4 hours ago',
                },
              ].map((commit) => (
                <div key={commit.hash} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-bold text-white hover:text-indigo-400 transition cursor-pointer">
                      {commit.msg}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {commit.author} committed {commit.date}
                    </div>
                  </div>
                  <span className="bg-slate-800 text-indigo-300 px-2.5 py-1 rounded-md text-xs font-bold border border-slate-700">
                    {commit.hash}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: CHECKS */}
          {activeTab === 'checks' && (
            <div className="space-y-3 font-mono text-xs">
              {[
                { name: 'build-and-test / CI (node-20)', status: 'Passed', time: '1m 24s' },
                { name: 'security-audit / slither-contract-analyzer', status: 'Passed', time: '48s' },
                { name: 'openproof-escrow-validator / zk-proof-check', status: 'Passed', time: '12s' },
                { name: 'code-coverage / jest (98.4%)', status: 'Passed', time: '35s' },
              ].map((check, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold text-white">{check.name}</div>
                      <div className="text-[10px] text-slate-400">Successful in {check.time}</div>
                    </div>
                  </div>
                  <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-700/60 px-2 py-0.5 rounded text-[10px] font-bold">
                    {check.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: FILES CHANGED */}
          {activeTab === 'files' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 text-slate-300 font-bold flex justify-between">
                  <span>contracts/EscrowPayoutBridge.sol</span>
                  <span className="text-emerald-400">+124 -12</span>
                </div>
                <div className="p-3 bg-slate-950 text-slate-300 space-y-1 text-[11px] overflow-x-auto">
                  <div className="text-slate-500">// OpenImpact Smart Contract Escrow Router</div>
                  <div className="text-emerald-400">+ function releaseMilestonePayout(bytes32 milestoneId, bytes calldata proof) external nonReentrant &#123;</div>
                  <div className="text-emerald-400">+     require(openProofValidator.verify(milestoneId, proof), "INVALID_PROOF");</div>
                  <div className="text-emerald-400">+     uint256 amount = escrowVaults[milestoneId].lockedAmount;</div>
                  <div className="text-emerald-400">+     escrowVaults[milestoneId].isReleased = true;</div>
                  <div className="text-emerald-400">+     payable(escrowVaults[milestoneId].beneficiary).transfer(amount);</div>
                  <div className="text-emerald-400">+     emit MilestonePayoutDisbursed(milestoneId, amount, block.timestamp);</div>
                  <div className="text-emerald-400">+ &#125;</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <Lock className="h-3.5 w-3.5 text-emerald-400" />
            <span>OpenImpact Verified Non-Profit Infrastructure</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition cursor-pointer"
          >
            Close PR Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
