import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  GitPullRequest,
  Check,
  Users,
  DollarSign,
  ArrowRight,
  RefreshCw,
  FileCheck2,
  ExternalLink,
  Sparkles,
  Zap,
  Info,
  Layers,
  Award,
  Clock,
  X
} from 'lucide-react';
import { Currency, EscrowMilestoneVault, Project } from '../types';
import { formatCurrency } from '../utils/formatters';

interface MilestoneEscrowStudioProps {
  project?: Project;
  currency?: Currency;
  onClose?: () => void;
  onOpenProofModal?: () => void;
  onOpenPayoutModal?: () => void;
}

export const MilestoneEscrowStudio: React.FC<MilestoneEscrowStudioProps> = ({
  project,
  currency = 'USD',
  onClose,
  onOpenProofModal,
  onOpenPayoutModal,
}) => {
  const currentCurrency: Currency = (currency as Currency) || 'USD';
  const defaultVaults: EscrowMilestoneVault[] = [
    {
      id: 'vault_1',
      projectId: project?.id || 'p_1',
      milestoneTitle: 'Phase 1: Multi-Currency Fiat & Escrow Payout Router Architecture',
      targetPercentage: 35,
      targetAmount: (project?.fundingGoal || 45000) * 0.35,
      lockedAmount: 0,
      releasedAmount: (project?.fundingGoal || 45000) * 0.35,
      currency: currentCurrency,
      status: 'Released',
      linkedEvidenceTitles: [
        'feat(escrow): implement multi-currency fiat & crypto payout bridge router (#142)',
        'fix(security): sanitize WebAuthn signature payloads (#141)',
      ],
      requiredSignatures: 3,
      signatures: [
        { name: 'Dr. Maya Lin', role: 'Security Auditor (501c6)', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200', signedAt: '2 days ago', verified: true },
        { name: 'Kareem Adeyemi', role: 'Sponsor Delegate (Public Goods Council)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', signedAt: '2 days ago', verified: true },
        { name: 'Alexander Wright', role: 'Lead Fiscal Host Officer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', signedAt: '1 day ago', verified: true },
      ],
      deliverablesHash: '0x8f3a92b4c7e1d5a6b0c2e4f8a1d3b5c7e9f2a4b6',
      releasedAt: 'Yesterday at 14:32 UTC',
    },
    {
      id: 'vault_2',
      projectId: project?.id || 'p_1',
      milestoneTitle: 'Phase 2: Automated OpenProof CI Webhooks & Peer Review Multi-Sig Quorum',
      targetPercentage: 40,
      targetAmount: (project?.fundingGoal || 45000) * 0.40,
      lockedAmount: (project?.fundingGoal || 45000) * 0.40,
      releasedAmount: 0,
      currency: currentCurrency,
      status: 'In Peer Review',
      linkedEvidenceTitles: [
        'chore(ci): automated OpenProof webhook attestations for verified PR merges (#145)',
        'feat(multi-sig): threshold quorum engine for multi-signatory release (#148)',
      ],
      requiredSignatures: 3,
      signatures: [
        { name: 'Dr. Maya Lin', role: 'Security Auditor (501c6)', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200', signedAt: '3 hours ago', verified: true },
        { name: 'Kareem Adeyemi', role: 'Sponsor Delegate (Public Goods Council)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', signedAt: '1 hour ago', verified: true },
      ],
      deliverablesHash: '0x3c9e12a4b8f109c4d28e71fa091b34c8901ef23a',
    },
    {
      id: 'vault_3',
      projectId: project?.id || 'p_1',
      milestoneTitle: 'Phase 3: Production Mainnet Deployment & 501(c)(6) Accounting Audit Report',
      targetPercentage: 25,
      targetAmount: (project?.fundingGoal || 45000) * 0.25,
      lockedAmount: (project?.fundingGoal || 45000) * 0.25,
      releasedAmount: 0,
      currency: currentCurrency,
      status: 'Locked',
      linkedEvidenceTitles: [],
      requiredSignatures: 3,
      signatures: [],
    },
  ];

  const [vaults, setVaults] = useState<EscrowMilestoneVault[]>(defaultVaults);
  const [selectedVaultId, setSelectedVaultId] = useState<string>('vault_2');
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [releaseSuccess, setReleaseSuccess] = useState<string | null>(null);
  const [escrowPasskey, setEscrowPasskey] = useState<string>('');
  const [escrowError, setEscrowError] = useState<string | null>(null);

  const activeVault = vaults.find((v) => v.id === selectedVaultId) || vaults[0];



  const totalBudget = vaults.reduce((acc, v) => acc + v.targetAmount, 0);
  const totalReleased = vaults.reduce((acc, v) => acc + v.releasedAmount, 0);
  const totalLocked = vaults.reduce((acc, v) => acc + v.lockedAmount, 0);

  // Sign and trigger milestone release simulation with passkey privacy check
  const handleSignAsAuditor = () => {
    if (!activeVault) return;
    const validPasskeys = ['849-204', 'OPENIMPACT-MULTISIG-2026', 'SECURE-AUTH-99'];
    if (!escrowPasskey || !validPasskeys.includes(escrowPasskey.trim())) {
      setEscrowError('Access Denied: Invalid security passkey. Only invited and authorized multi-sig signers can authorize escrow transactions.');
      return;
    }
    setEscrowError(null);
    setIsSigning(true);

    setTimeout(() => {
      setIsSigning(false);
      const newSignature = {
        name: 'You (Invited Signer)',
        role: 'Authorized Attestor',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
        signedAt: 'Just now',
        verified: true,
      };

      const updatedSignatures = [...activeVault.signatures, newSignature];
      const hasReachedQuorum = updatedSignatures.length >= activeVault.requiredSignatures;

      setVaults((prev) =>
        prev.map((v) =>
          v.id === activeVault.id
            ? {
                ...v,
                signatures: updatedSignatures,
                status: hasReachedQuorum ? 'Released' : 'In Peer Review',
                lockedAmount: hasReachedQuorum ? 0 : v.lockedAmount,
                releasedAmount: hasReachedQuorum ? v.targetAmount : v.releasedAmount,
                releasedAt: hasReachedQuorum ? 'Just now via 3-of-3 Multi-Sig' : undefined,
              }
            : v
        )
      );

      if (hasReachedQuorum) {
        setReleaseSuccess(
          `🎉 Quorum Reached (3/3 signatures)! ${formatCurrency(activeVault.targetAmount, currentCurrency)} successfully released from Escrow Vault to contributor payouts!`
        );
      } else {
        setReleaseSuccess(
          `✍️ Signature recorded with verified passkey! (${updatedSignatures.length}/${activeVault.requiredSignatures} required signatures collected).`
        );
      }
    }, 700);
  };

  return (
    <div className="bg-[#FAF8F5] text-slate-900 rounded-3xl border border-[#E8E2D6] shadow-2xl p-5 sm:p-7 space-y-6 text-left relative font-sans overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#E8E2D6] pb-5">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                "Proof-Before-Payout" Milestone Escrow Studio
              </h2>
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                Zero Blind Spending
              </span>
              <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                Public Community Audit
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Funds sit in programmatic ring-fenced vaults. Payouts require verified GitHub code deliverables & multi-sig peer consensus.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-200/60 transition cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* SUCCESS NOTIFICATION */}
      {releaseSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900 font-bold animate-in fade-in shadow-xs">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{releaseSuccess}</span>
          </div>
          <button
            onClick={() => setReleaseSuccess(null)}
            className="text-emerald-700 hover:text-emerald-900 text-[11px] underline ml-2 cursor-pointer font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TOP METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white border border-[#E8E2D6] p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Total Committed Budget</span>
          <div className="text-xl font-black text-slate-900 font-mono">{formatCurrency(totalBudget, currentCurrency)}</div>
          <p className="text-[10px] text-slate-500 font-medium">100% ring-fenced in 501(c)(6) non-profit trust</p>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[11px] font-mono text-emerald-700 uppercase tracking-wider font-bold flex items-center gap-1">
            <Unlock className="h-3 w-3" /> Released Upon Verified Proofs
          </span>
          <div className="text-xl font-black text-emerald-700 font-mono">{formatCurrency(totalReleased, currentCurrency)}</div>
          <p className="text-[10px] text-emerald-600 font-medium">
            {((totalReleased / totalBudget) * 100).toFixed(0)}% delivered & audited by peers
          </p>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl space-y-1 shadow-xs">
          <span className="text-[11px] font-mono text-amber-800 uppercase tracking-wider font-bold flex items-center gap-1">
            <Lock className="h-3 w-3" /> Still Locked in Escrow
          </span>
          <div className="text-xl font-black text-amber-800 font-mono">{formatCurrency(totalLocked, currentCurrency)}</div>
          <p className="text-[10px] text-amber-700 font-medium">Protected from diversion until milestones merge</p>
        </div>
      </div>

      {/* ESCROW TRANCHES / VAULTS PIPELINE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
          <span>Milestone Escrow Tranches</span>
          <span className="text-slate-400 font-mono text-[11px]">Select a tranche to audit</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {vaults.map((vault, idx) => {
            const isSelected = vault.id === activeVault.id;
            const isReleased = vault.status === 'Released';
            const isReview = vault.status === 'In Peer Review';

            return (
              <div
                key={vault.id}
                onClick={() => setSelectedVaultId(vault.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer text-left space-y-3 relative ${
                  isSelected
                    ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                    : 'bg-white/90 border-[#E8E2D6] hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60">
                    Tranche #{idx + 1} ({vault.targetPercentage}%)
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isReleased
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isReview
                        ? 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {isReleased ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                    <span>{vault.status}</span>
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">{vault.milestoneTitle}</h4>
                  <div className="text-base font-black text-indigo-700 font-mono mt-1">
                    {formatCurrency(vault.targetAmount, currentCurrency)}
                  </div>
                </div>

                {/* Progress Mini Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Quorum Signatures</span>
                    <span className="font-bold text-slate-800">
                      {vault.signatures.length}/{vault.requiredSignatures}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div
                      className={`h-full transition-all ${
                        isReleased ? 'bg-emerald-600' : 'bg-indigo-600'
                      }`}
                      style={{
                        width: `${Math.min(100, (vault.signatures.length / vault.requiredSignatures) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE VAULT AUDIT & MULTI-SIG RELEASE PANEL */}
      <div className="bg-white border border-[#E8E2D6] rounded-2xl p-5 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#E8E2D6] pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-indigo-600 uppercase">Active Audit Target</span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs font-mono text-slate-500">Vault ID: {activeVault.id}</span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">{activeVault.milestoneTitle}</h3>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs font-mono text-slate-500">Tranche Payout Value</div>
            <div className="text-lg font-black text-emerald-600 font-mono">
              {formatCurrency(activeVault.targetAmount, currentCurrency)}
            </div>
          </div>
        </div>

        {/* VERIFIED GITHUB PROOFS ATTACHED */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <GitPullRequest className="h-4 w-4 text-indigo-600" />
              <span>Linked GitHub Proofs & Code Deliverables ({activeVault.linkedEvidenceTitles.length})</span>
            </span>

            {onOpenProofModal && (
              <button
                type="button"
                onClick={onOpenProofModal}
                className="text-[11px] font-mono text-indigo-600 hover:text-indigo-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>+ Import More PRs (Select All)</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            )}
          </div>

          {activeVault.linkedEvidenceTitles.length === 0 ? (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500 font-medium">
              No deliverables linked yet. Maintainers must submit merged GitHub PRs to initiate peer review.
            </div>
          ) : (
            <div className="space-y-2">
              {activeVault.linkedEvidenceTitles.map((title, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 transition rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-800 font-mono text-[11px] font-medium">{title}</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-bold shrink-0">
                    CI Attested
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MULTI-SIG PEER AUDIT SIGNATURES */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="h-4 w-4 text-emerald-600" />
            <span>Multi-Sig Peer Auditor Sign-Offs ({activeVault.signatures.length}/{activeVault.requiredSignatures})</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {activeVault.signatures.map((sig, i) => (
              <div
                key={i}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-2.5"
              >
                <img src={sig.avatar} alt={sig.name} className="w-7 h-7 rounded-full object-cover border border-slate-300" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                    <span>{sig.name}</span>
                    <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                  </div>
                  <div className="text-[10px] text-slate-500 truncate font-medium">{sig.role}</div>
                </div>
              </div>
            ))}

            {/* Empty Slots */}
            {Array.from({ length: Math.max(0, activeVault.requiredSignatures - activeVault.signatures.length) }).map(
              (_, i) => (
                <div
                  key={`empty_${i}`}
                  className="p-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-300 flex items-center space-x-2 text-slate-500 text-xs"
                >
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>Awaiting Signatory #{activeVault.signatures.length + i + 1}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Passkey & Privacy Authorization Gate */}
        {activeVault.status !== 'Released' && (
          <div className="bg-white p-4 rounded-2xl border border-amber-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-amber-600" />
                <span>Private Multi-Sig Signer Passkey</span>
              </span>

            </div>
            <input
              type="password"
              placeholder="Enter authorized security passkey to authorize escrow release..."
              value={escrowPasskey}
              onChange={(e) => setEscrowPasskey(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            {escrowError && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-[11px] text-red-700 font-semibold">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{escrowError}</span>
              </div>
            )}
          </div>
        )}

        {/* ACTION CONTROLS */}
        {releaseSuccess && (
          <div className="p-3 mb-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{releaseSuccess}</span>
          </div>
        )}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E8E2D6]">
          <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium">
            <Info className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>
              {activeVault.status === 'Released'
                ? `Released on ${activeVault.releasedAt || 'Mainnet'}. Funds disbursed to contributor payouts.`
                : `${activeVault.requiredSignatures - activeVault.signatures.length} more signature needed to trigger programmatic escrow unlock.`}
            </span>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {activeVault.status !== 'Released' && (
              <button
                type="button"
                onClick={handleSignAsAuditor}
                disabled={isSigning}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isSigning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    <span>Verifying Cryptographic Attestation...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 text-white" />
                    <span>Audit Proof & Sign Multi-Sig Release</span>
                  </>
                )}
              </button>
            )}

            {onOpenPayoutModal && activeVault.status === 'Released' && (
              <button
                type="button"
                onClick={onOpenPayoutModal}
                className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                title="501(c)(6) Multi-Sig Privileges Required for Settlement"
              >
                <Lock className="h-3.5 w-3.5 text-amber-300" />
                <span>Withdraw via Multi-Rail</span>
                <span className="text-[9px] bg-amber-400/20 text-amber-200 border border-amber-300/30 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                  Privileged
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
