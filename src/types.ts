export type Currency = 'NGN' | 'USD' | 'KES' | 'GHS' | 'ZAR' | 'EUR';

export interface CurrencyRate {
  code: Currency;
  symbol: string;
  rateToUsd: number; // 1 USD in this currency
}

export type UserRole = 'contributor' | 'organization' | 'funder' | 'grant_admin';

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatar: string;
  role: UserRole;
  location: string;
  bio: string;
  skills: string[];
  githubUsername?: string;
  githubVerified?: boolean;
  githubBoundAt?: string;
  githubPublicRepos?: number;
  openProofPassportId?: string;
  openProofActive?: boolean;
  reputation: {
    verifiedContributionsCount: number;
    completedProjectsCount: number;
    completedBountiesCount: number;
    peopleTrained: number;
    communityHours: number;
    impactScore: number;
  };
}

export interface Organization {
  id: string;
  name: string;
  logo: string;
  verified: boolean;
  description: string;
  location: string;
  totalFunded: number;
  projectsCount: number;
}

export type MilestoneStatus = 'Completed' | 'In progress' | 'Pending' | 'Disputed';
export type EscrowStatus = 'Locked' | 'Released' | 'Pending Verification';

export interface Milestone {
  id: string;
  title: string;
  budget: number;
  status: MilestoneStatus;
  deadline: string;
  deliverables: string;
  evidenceUrl?: string;
  reviewerStatus: 'Approved' | 'Pending Review' | 'Not Submitted';
  escrowStatus: EscrowStatus;
}

export interface Expense {
  id: string;
  item: string;
  amount: number;
  evidence: string;
  status: 'Verified' | 'Pending' | 'Flagged';
  date: string;
  isPublic: boolean;
  category: string;
}

export type BadgeLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
export type BadgeCategory = 'code' | 'financial' | 'milestone' | 'community' | 'compliance';

export interface ImpactBadge {
  id: string;
  name: string;
  category: BadgeCategory;
  level: BadgeLevel;
  description: string;
  icon: string; // Icon identifier (e.g., 'GitPullRequest', 'FileCheck', 'Award', 'ShieldCheck', 'Heart')
  awardedAt: string;
  evidenceId?: string;
  evidenceTitle?: string;
  verifier: string;
  criteriaMet: string;
}

export type EvidenceType = 'Pull Request' | 'Commit' | 'Photo / Media' | 'Invoice / Receipt' | 'Report / Document';

export interface Evidence {
  id: string;
  projectId: string;
  title: string;
  type: EvidenceType;
  url: string;
  submittedBy: string;
  submittedAt: string;
  verifiedAt?: string;
  verifier?: string;
  status: 'Verified' | 'Pending' | 'Flagged';
  description?: string;
}

export interface ExportedGithubData {
  repo: string;
  contributorName?: string;
  contributorHandle?: string;
  authorHandle?: string;
  prTitle?: string;
  prUrl?: string;
  prNumber?: string;
  additions?: number;
  deletions?: number;
  date?: string;
  status?: 'Merged & Verified' | 'Signed & Audited';
  contributions?: {
    id: string;
    type: 'pr' | 'commit';
    title: string;
    hashOrPr: string;
    additions: number;
    deletions: number;
    date: string;
    status: 'Merged & Verified' | 'Signed & Audited';
  }[];
}

export type ProjectStatus = 'Funding' | 'In Progress' | 'Completed' | 'Verified';

export interface ProjectImpactMetric {
  label: string;
  value: string;
  target: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'Education' | 'Tech & Open Source' | 'Health' | 'Infrastructure' | 'Environment' | 'Community' | 'NGO & Humanitarian';
  location: string;
  status: ProjectStatus;
  fundingGoal: number;
  currency: Currency;
  raised: number;
  supportersCount: number;
  contributorsCount: number;
  organization: Organization;
  githubRepo?: string;
  description: string;
  milestones: Milestone[];
  expenses: Expense[];
  evidence: Evidence[];
  impactMetrics: ProjectImpactMetric[];
  badges?: ImpactBadge[];
  createdAt: string;
}

export type OpportunityType = 'Bounty' | 'Contract' | 'Grant Opportunity' | 'Volunteer';

export interface Opportunity {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  type: OpportunityType;
  rewardAmount: number;
  currency: Currency;
  duration: string;
  skills: string[];
  description: string;
  status: 'Open' | 'In Progress' | 'Under Review' | 'Completed';
  githubIssue?: string;
  applicantsCount: number;
  assignedTo?: string;
  assignedToAvatar?: string;
}

export interface GrantProgram {
  id: string;
  title: string;
  organization: Organization;
  availableFunding: number;
  currency: Currency;
  category: string;
  deadline: string;
  description: string;
  status: 'Accepting Applications' | 'In Evaluation' | 'Awarded';
  pipelineCount: {
    applications: number;
    eligible: number;
    reviewed: number;
    selected: number;
  };
  websiteUrl?: string;
  applicationUrl?: string;
  grantSourceLabel?: string;
  eligibilityCriteria?: string[];
  milestoneTranches?: { name: string; percentage: number; requirement: string }[];
  scoringMatrix?: { criteria: string; weight: number }[];
}

export interface FiscalHostInfo {
  name: string;
  type: string; // e.g. '501(c)(6) Nonprofit Fiscal Host'
  hostFeePercent: number;
  paymentProcessingPercent: number;
  taxComplianceSupported: string[]; // e.g. ['W-8BEN', 'W-9', '1099-NEC', 'VAT Invoice']
  supportedPayouts: string[]; // e.g. ['Wise', 'PayPal', 'Bank Transfer', 'Crypto']
}

export interface EscrowMilestoneVault {
  id: string;
  projectId: string;
  milestoneTitle: string;
  targetPercentage: number;
  targetAmount: number;
  lockedAmount: number;
  releasedAmount: number;
  currency: Currency;
  status: 'Locked' | 'In Peer Review' | 'Released' | 'Disputed';
  linkedEvidenceTitles: string[];
  requiredSignatures: number;
  signatures: {
    name: string;
    role: string;
    avatar: string;
    signedAt: string;
    verified: boolean;
  }[];
  deliverablesHash?: string;
  releasedAt?: string;
}

export type PayoutRail = 'USDC_STABLECOIN' | 'WISE_GLOBAL' | 'BANK_ACH' | 'SEPA_EURO';

export interface LedgerTransaction {
  id: string;
  projectId?: string;
  collectiveId?: string;
  title: string;
  type: 'contribution' | 'milestone_payout' | 'expense_reimbursement' | 'hackathon_prize' | 'fiscal_host_fee';
  amount: number;
  currency: Currency;
  date: string;
  fromName: string;
  toName: string;
  category: string;
  status: 'Completed' | 'In Escrow' | 'Pending Audit';
  receiptUrl?: string;
  githubPRUrl?: string;
  proofHash?: string;
  payoutRail?: PayoutRail;
  taxDocType?: 'W-8BEN' | 'W-9' | '1099-NEC' | '501(c)(6) Tax-Deductible Receipt';
}

export interface TaxComplianceDoc {
  id: string;
  recipientName: string;
  recipientEmail: string;
  country: string;
  formType: 'W-8BEN' | 'W-9' | '1099-NEC';
  status: 'Verified' | 'Pending Clearance';
  taxIdMasked: string;
  signedDate: string;
}

export interface CollectiveSponsorTier {
  id: string;
  name: string; // e.g. 'Backer', 'Sponsor', 'Sustaining Enterprise Partner'
  amount: number;
  currency: Currency;
  interval: 'monthly' | 'one-time' | 'yearly';
  perks: string[];
  sponsorsCount: number;
}

export interface Collective {
  id: string;
  name: string;
  slug: string;
  category: 'Open Source Software' | 'Open Hardware' | 'Climate Tech' | 'Civic Tech' | 'Education';
  logo: string;
  tagline: string;
  description: string;
  githubRepo?: string;
  website?: string;
  hostName: string; // e.g. 'OpenImpact Fiscal Host'
  balance: number;
  currency: Currency;
  totalRaised: number;
  totalSpent: number;
  backersCount: number;
  sponsorsCount: number;
  maintainers: { name: string; avatar: string; role: string }[];
  sponsorTiers: CollectiveSponsorTier[];
  escrowVaults?: EscrowMilestoneVault[];
  ledger?: LedgerTransaction[];
  isSample?: boolean;
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  source: string; // e.g. 'GitHub Pull Request', 'Academic Registry', 'Environmental IoT Sensor', 'Land Tenure Register', 'Financial Receipt'
  sourceId: string; // e.g. 'PR #204'
  projectTitle: string;
  submittedBy: string;
  createdAt: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Approved' | 'Rejected';
  documentUrl?: string;
  auditStepsCompleted?: string[]; // e.g. ['Source Identity', 'Metrics Verified', 'Compliance Check']
  auditorComments?: string;
  auditedBy?: string;
  auditedAt?: string;
  reputationAllocated?: number;
  metadata?: Record<string, any>;
}

