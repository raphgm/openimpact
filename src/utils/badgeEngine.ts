import { Project, ImpactBadge, BadgeLevel, BadgeCategory } from '../types';

export function evaluateProjectBadges(project: Project): ImpactBadge[] {
  const existingBadges = project.badges || [];
  const badgesMap = new Map<string, ImpactBadge>();

  // Add manually set badges first
  existingBadges.forEach((b) => badgesMap.set(b.id, b));

  const evidence = project.evidence || [];
  const milestones = project.milestones || [];
  const expenses = project.expenses || [];

  const verifiedEvidence = evidence.filter((e) => e.status === 'Verified');
  const codeEvidence = verifiedEvidence.filter((e) => e.type === 'Pull Request' || e.type === 'Commit');
  const financialEvidence = verifiedEvidence.filter((e) => e.type === 'Invoice / Receipt');
  const mediaOrDocEvidence = verifiedEvidence.filter((e) => e.type === 'Photo / Media' || e.type === 'Report / Document');
  const completedMilestones = milestones.filter((m) => m.status === 'Completed' || m.escrowStatus === 'Released');

  // Rule 1: Verified Code Deliverable (Gold)
  if (codeEvidence.length > 0 && !badgesMap.has('badge_code_verified')) {
    const firstCode = codeEvidence[0];
    badgesMap.set('badge_code_verified', {
      id: 'badge_code_verified',
      name: 'Verified Code Deliverable',
      category: 'code',
      level: 'Gold',
      description: 'Cryptographically verified GitHub PR or commit merged into project repository and peer audited.',
      icon: 'GitPullRequest',
      awardedAt: firstCode.verifiedAt || firstCode.submittedAt || '2026-05-20',
      evidenceId: firstCode.id,
      evidenceTitle: firstCode.title,
      verifier: firstCode.verifier || 'OpenProof GitHub Integration & Peer Auditors',
      criteriaMet: `${codeEvidence.length} verified code pull request(s) submitted`,
    });
  }

  // Rule 2: 100% Financial Transparency (Gold)
  if ((financialEvidence.length > 0 || expenses.some((exp) => exp.status === 'Verified')) && !badgesMap.has('badge_financial_verified')) {
    const firstFin = financialEvidence[0];
    badgesMap.set('badge_financial_verified', {
      id: 'badge_financial_verified',
      name: '100% Financial Transparency',
      category: 'financial',
      level: 'Gold',
      description: 'Public ledger receipts, invoices, and expense records audited by 501(c)(6) fiscal sponsor.',
      icon: 'FileCheck',
      awardedAt: firstFin?.verifiedAt || '2026-04-10',
      evidenceId: firstFin?.id,
      evidenceTitle: firstFin?.title || 'Expense Receipts Ledger',
      verifier: 'OpenImpact Fiscal Host Audit Node',
      criteriaMet: 'Public financial ledger with verified vendor receipts',
    });
  }

  // Rule 3: Milestone Escrow Cleared (Platinum)
  if (completedMilestones.length > 0 && !badgesMap.has('badge_milestone_cleared')) {
    const firstM = completedMilestones[0];
    badgesMap.set('badge_milestone_cleared', {
      id: 'badge_milestone_cleared',
      name: 'Milestone Escrow Cleared',
      category: 'milestone',
      level: 'Platinum',
      description: 'Project milestone deliverables verified prior to escrow release by milestone guardians.',
      icon: 'Award',
      awardedAt: '2026-05-15',
      verifier: 'Milestone Escrow Committee',
      criteriaMet: `${completedMilestones.length} milestone(s) completed and escrow released`,
    });
  }

  // Rule 4: Community Impact Proof (Silver)
  if (mediaOrDocEvidence.length > 0 && !badgesMap.has('badge_community_verified')) {
    const firstMedia = mediaOrDocEvidence[0];
    badgesMap.set('badge_community_verified', {
      id: 'badge_community_verified',
      name: 'Community Impact Proof',
      category: 'community',
      level: 'Silver',
      description: 'On-ground visual media, geo-tagged photo proof, or field reports verified with community endorsements.',
      icon: 'Heart',
      awardedAt: firstMedia.submittedAt || '2026-04-02',
      evidenceId: firstMedia.id,
      evidenceTitle: firstMedia.title,
      verifier: 'Civic Community Reviewers',
      criteriaMet: 'Field photos and community proof submitted and endorsed',
    });
  }

  // Rule 5: Verified 501(c)(6) Umbrella (Platinum)
  if (project.organization.verified && !badgesMap.has('badge_501c6_verified')) {
    badgesMap.set('badge_501c6_verified', {
      id: 'badge_501c6_verified',
      name: '501(c)(6) Tax-Deductible Entity',
      category: 'compliance',
      level: 'Platinum',
      description: 'Registered 501(c)(6) non-profit fiscal sponsorship umbrella entity with active tax-exempt standing.',
      icon: 'ShieldCheck',
      awardedAt: '2026-01-01',
      verifier: 'IRS Tax Compliance & OpenImpact Fiscal Host',
      criteriaMet: 'Official 501(c)(6) non-profit entity verification',
    });
  }

  // Rule 6: OpenProof Audit Certified (Platinum)
  if (verifiedEvidence.length >= 2 && !badgesMap.has('badge_audit_certified')) {
    badgesMap.set('badge_audit_certified', {
      id: 'badge_audit_certified',
      name: 'OpenProof Audit Certified',
      category: 'compliance',
      level: 'Platinum',
      description: 'Highest credibility tier: 100% verified cryptographic proof chain across deliverables and finances.',
      icon: 'Sparkles',
      awardedAt: '2026-06-01',
      verifier: 'OpenProof Protocol v2.4 Consensus',
      criteriaMet: `${verifiedEvidence.length} proof artifacts 100% verified with zero disputes`,
    });
  }

  return Array.from(badgesMap.values());
}

export function getBadgeLevelBadgeStyle(level: BadgeLevel): {
  bg: string;
  text: string;
  border: string;
  glow: string;
  gradient: string;
} {
  switch (level) {
    case 'Platinum':
      return {
        bg: 'bg-cyan-50',
        text: 'text-cyan-900',
        border: 'border-cyan-300',
        glow: 'shadow-cyan-500/20',
        gradient: 'from-cyan-600 via-indigo-600 to-blue-700',
      };
    case 'Gold':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-900',
        border: 'border-amber-300',
        glow: 'shadow-amber-500/20',
        gradient: 'from-amber-500 via-yellow-500 to-amber-600',
      };
    case 'Silver':
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-800',
        border: 'border-slate-300',
        glow: 'shadow-slate-400/20',
        gradient: 'from-slate-600 to-slate-800',
      };
    case 'Bronze':
    default:
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-900',
        border: 'border-orange-300',
        glow: 'shadow-orange-500/20',
        gradient: 'from-orange-600 to-amber-700',
      };
  }
}
