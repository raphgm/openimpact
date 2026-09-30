import React, { useState, useEffect } from "react";
import { Currency, Project, Opportunity, GrantProgram, UserProfile, Evidence, EvidenceType, ExportedGithubData } from "./types";
import { INITIAL_USER, INITIAL_PROJECTS, INITIAL_OPPORTUNITIES, INITIAL_GRANTS, INITIAL_COLLECTIVES, CURRENCY_RATES } from "./data/mockData";
import { convertCurrency, formatCurrency } from "./utils/formatters";
import { db, auth, onAuthStateChanged, getUserProfile, buildDefaultUserProfile, saveUserProfile, logoutUser } from "./lib/firebase";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";

// Components & Modals
import { ProjectList } from "./components/ProjectList";
import { ProjectDetail } from "./components/ProjectDetail";
import { ImpactLedger } from "./components/ImpactLedger";
import { OpportunitiesBoard } from "./components/OpportunitiesBoard";
import { GrantsPortal } from "./components/GrantsPortal";
import { TalentLeaderboard } from "./components/TalentLeaderboard";
import { VerificationPortal } from "./components/VerificationPortal";
import { ProfileView } from "./components/ProfileView";
import { FiscalHostPortal } from "./components/FiscalHostPortal";
import { ProofContributionModal } from "./components/ProofContributionModal";
import { DocumentViewerModal } from "./components/DocumentViewerModal";
import { AuthModal } from "./components/AuthModal";
import { AiAdvisorModal } from "./components/AiAdvisorModal";
import { CreateProjectModal } from "./components/CreateProjectModal";
import { FundingModal } from "./components/FundingModal";
import { EvidenceModal } from "./components/EvidenceModal";
import { SponsorEventModal } from "./components/SponsorEventModal";
import { GithubPRModal } from "./components/GithubPRModal";
import { GithubPRIntegration } from "./components/GithubPRIntegration";
import { CommandPalette } from "./components/CommandPalette";
import { DocumentTenureModal, TenureRecord } from "./components/DocumentTenureModal";
import { GrantApplicationModal } from "./components/GrantApplicationModal";
import { Footer } from "./components/Footer";
import { AiImpactAssistant } from "./components/AiImpactAssistant";
import { AboutPage } from "./components/AboutPage";
import { Award } from "lucide-react";

type CardType = {
  label: string;
  labelColor: string;
  title: string;
  description: string;
  button: string;
  accent: string;
  bg: string;
  features: string[];
  icon: string;
  targetTab?: string;
  action?: () => void;
};

function Arrow() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19c0-3.2 2.5-5 6-5s6 1.8 6 5" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8" />
      <path d="M18 14c2 .7 3 2.2 3 5" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 8.7c0 5-8.8 10-8.8 10s-8.8-5-8.8-10A4.7 4.7 0 0 1 12 6a4.7 4.7 0 0 1 8.8 2.7Z" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v5" />
      <path d="M12 17v5" />
      <path d="M2 12h5" />
      <path d="M17 12h5" />
      <path d="m4.9 4.9 3.5 3.5" />
      <path d="m15.6 15.6 3.5 3.5" />
      <path d="m19.1 4.9-3.5 3.5" />
      <path d="m8.4 15.6-3.5 3.5" />
    </svg>
  );
}

function OpenImpactLogo() {
  return (
    <div className="logo-wrap flex items-center space-x-3 cursor-pointer">
      <div className="logo-mark relative w-10 h-10">
        <span className="logo-shape logo-blue absolute w-[22px] h-[36px] rounded-[14px_14px_14px_3px] rotate-[-28deg] left-[15px] top-[1px] bg-gradient-to-br from-indigo-600 to-purple-600" />
        <span className="logo-shape logo-green absolute w-[22px] h-[36px] rounded-[14px_14px_14px_3px] rotate-[-28deg] left-[4px] top-[3px] bg-gradient-to-br from-emerald-500 to-teal-500 opacity-95" />
      </div>
      <div>
        <div className="logo-name text-[22px] leading-none font-extrabold tracking-tight text-slate-900">Open Impact</div>
        <div className="logo-sub mt-1 text-slate-500 text-[11px]">Measure · Verify · Prove Impact</div>
      </div>
    </div>
  );
}

function AbstractShape({
  type,
  accent,
}: {
  type: number;
  accent: string;
}) {
  if (type === 0) {
    return (
      <div className="shape-company absolute w-[310px] h-[280px] right-[2%] top-[28px] rotate-[-8deg]">
        <div className="company-block block-a absolute w-[115px] h-[115px] rounded-[28px] bg-gradient-to-br from-amber-300 to-orange-500 shadow-xl top-[10px] left-[55px] rotate-[-9deg]" />
        <div className="company-block block-b absolute w-[115px] h-[115px] rounded-[28px] bg-gradient-to-br from-orange-400 to-red-500 shadow-xl top-[20px] right-[5px] rotate-[5deg]" />
        <div className="company-block block-c absolute w-[115px] h-[115px] rounded-[28px] bg-gradient-to-br from-amber-400 to-orange-600 shadow-xl bottom-[15px] left-[15px] rotate-[7deg]" />
        <div className="company-block block-d absolute w-[115px] h-[115px] rounded-[28px] bg-gradient-to-br from-orange-500 to-amber-600 shadow-xl bottom-[0px] right-[35px] rotate-[-7deg]" />
      </div>
    );
  }

  if (type === 1) {
    return (
      <div className="shape-builder absolute w-[330px] h-[290px] right-0 top-[15px]">
        <div
          className="builder-ring absolute w-[170px] h-[205px] right-[75px] top-[28px] rounded-[55%_45%_50%_50%] rotate-[-26deg]"
          style={{
            background: `linear-gradient(145deg, ${accent}, #67a5ff)`,
          }}
        />
        <div className="builder-ball absolute w-[58px] h-[58px] rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 right-[185px] bottom-[25px] shadow-lg" />
        <div className="builder-half absolute w-[90px] h-[90px] right-0 bottom-[32px] rounded-[0_0_50px_50px] bg-gradient-to-br from-sky-300 to-blue-500 rotate-[-18deg]" />
        <div className="star absolute right-[20px] top-[50px] text-blue-600 text-[33px]">✦</div>
      </div>
    );
  }

  if (type === 2) {
    return (
      <div className="shape-scout absolute w-[330px] h-[280px] right-0 top-[20px]">
        <div className="scout-circle scout-back absolute w-[200px] h-[200px] right-[45px] top-[15px] rounded-full bg-purple-400/25 blur-[2px]" />
        <div className="scout-circle scout-main absolute w-[160px] h-[160px] right-[70px] top-[35px] rounded-full bg-gradient-to-tr from-purple-300 via-purple-600 to-indigo-700 shadow-xl transition-all duration-700 hover:scale-110 hover:rotate-6 cursor-pointer">
          <div className="scout-core absolute w-[54px] h-[54px] rounded-full bg-white/25 left-[55px] top-[53px]" />
        </div>
        <div className="scout-star absolute right-[55px] top-[85px] text-white text-[34px]">✦</div>
      </div>
    );
  }

  if (type === 3) {
    return (
      <div className="shape-grants absolute w-[320px] h-[280px] right-[10px] top-[20px]">
        <div className="absolute w-[165px] h-[165px] right-[55px] top-[25px] rounded-full bg-gradient-to-tr from-sky-300 via-sky-500 to-blue-600 shadow-xl opacity-80 transition-all duration-700 hover:scale-110 hover:-rotate-6 cursor-pointer" />
        <div className="absolute w-[95px] h-[95px] rounded-2xl bg-gradient-to-br from-cyan-200 to-sky-600 top-[75px] left-[110px] shadow-lg rotate-12 transition-all duration-700 hover:scale-110 hover:rotate-12 cursor-pointer" />
        <div className="absolute right-[40px] top-[60px] text-white text-[32px]">◈</div>
      </div>
    );
  }

  if (type === 4) {
    return (
      <div className="shape-partner absolute w-[320px] h-[290px] right-[10px] top-[25px]">
        <div className="partner-square one absolute w-[90px] h-[90px] rounded-[14px] bg-gradient-to-br from-emerald-400 to-teal-600 top-[0] left-[105px] shadow-lg transition-all duration-700 hover:scale-110 hover:rotate-6 cursor-pointer" />
        <div className="partner-square two absolute w-[90px] h-[90px] rounded-[14px] bg-gradient-to-br from-teal-400 to-emerald-700 top-[72px] left-[195px] shadow-lg transition-all duration-700 hover:scale-110 hover:-rotate-6 cursor-pointer" />
        <div className="partner-square three absolute w-[90px] h-[90px] rounded-[14px] bg-gradient-to-br from-emerald-500 to-teal-800 top-[72px] left-[105px] opacity-48 transition-all duration-700 hover:scale-105 cursor-pointer" />
        <div className="partner-square four absolute w-[90px] h-[90px] rounded-[14px] bg-gradient-to-br from-teal-500 to-emerald-900 top-[145px] left-[105px] opacity-35 transition-all duration-700 hover:scale-105 cursor-pointer" />
        <div className="leaf absolute right-[34px] top-[22px] text-[65px] text-emerald-400 rotate-[-30deg]">⌁</div>
      </div>
    );
  }

  // type === 5: NGOs & Community Causes (Warm rose/ruby organic shapes & heart symbol)
  return (
    <div className="shape-ngo absolute w-[320px] h-[280px] right-[10px] top-[20px]">
      <div className="absolute w-[160px] h-[160px] right-[60px] top-[25px] rounded-[42px] bg-gradient-to-tr from-rose-300 via-rose-500 to-red-600 shadow-xl rotate-12 transition-all duration-700 hover:scale-110 hover:rotate-6 cursor-pointer" />
      <div className="absolute w-[85px] h-[85px] rounded-full bg-white/30 left-[115px] top-[60px] backdrop-blur-xs" />
      <div className="absolute w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-amber-300 to-rose-400 bottom-[35px] right-[180px] shadow-md rotate-[-15deg] opacity-80 transition-all duration-700 hover:scale-110 hover:-rotate-12 cursor-pointer" />
      <div className="absolute right-[50px] top-[65px] text-white text-[34px]">♥</div>
    </div>
  );
}

export default function App() {
  // Navigation & State
  const [activeTab, setActiveTab] = useState<string>("home");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("USD");

  // Data State
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [grants, setGrants] = useState<GrantProgram[]>(INITIAL_GRANTS);

  // Firestore Real-time synchronization & database seeding for 100% real institutional grant programs
  useEffect(() => {
    const grantsColRef = collection(db, "grants");
    const unsubscribe = onSnapshot(grantsColRef, (snapshot) => {
      if (snapshot.empty) {
        // Seeding database with real initial funding schemas
        INITIAL_GRANTS.forEach(async (g) => {
          try {
            await setDoc(doc(db, "grants", g.id), g);
          } catch (e) {
            console.error("Failed to seed initial grant to Firestore:", e);
          }
        });
        setGrants(INITIAL_GRANTS);
      } else {
        const firestoreGrants: GrantProgram[] = [];
        snapshot.forEach((docSnap) => {
          firestoreGrants.push(docSnap.data() as GrantProgram);
        });

        // Map existing firestore grants by ID
        const firestoreMap = new Map(firestoreGrants.map(g => [g.id, g]));

        // Merge INITIAL_GRANTS with remote overrides, preserving verified real institutional data
        const mergedGrants: GrantProgram[] = INITIAL_GRANTS.map(initGrant => {
          const remote = firestoreMap.get(initGrant.id);
          return {
            ...initGrant,
            ...(remote || {}),
            websiteUrl: initGrant.websiteUrl,
            applicationUrl: initGrant.applicationUrl,
            grantSourceLabel: initGrant.grantSourceLabel,
            organization: {
              ...initGrant.organization,
              ...(remote?.organization || {}),
              name: initGrant.organization.name,
              logo: initGrant.organization.logo,
              verified: true,
            }
          };
        });

        // Also include any user-created custom grants from Firestore
        firestoreGrants.forEach(remoteGrant => {
          if (!mergedGrants.some(g => g.id === remoteGrant.id)) {
            mergedGrants.push(remoteGrant);
          }
        });

        setGrants(mergedGrants);
      }
    });

    return () => unsubscribe();
  }, []);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Sync real-time with Firebase Authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          let profile = await getUserProfile(fbUser.uid);
          if (!profile) {
            profile = buildDefaultUserProfile(fbUser, 'contributor');
            await saveUserProfile(fbUser.uid, profile);
          }
          setCurrentUser(profile);
          setIsLoggedIn(true);
        } catch (err) {
          console.error("Failed to load user profile on auth state change:", err);
          const fallbackProfile = buildDefaultUserProfile(fbUser, 'contributor');
          setCurrentUser(fallbackProfile);
          setIsLoggedIn(true);
        }
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Selected Detail Views
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showFiscalCreateModal, setShowFiscalCreateModal] = useState(false);

  // Modals State
  const [showProofModal, setShowProofModal] = useState<boolean>(false);
  const [proofModalProject, setProofModalProject] = useState<Project | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'select' | 'organization' | 'collective' | 'individual' | 'login'>('select');
  const [showAiAdvisorModal, setShowAiAdvisorModal] = useState<boolean>(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState<boolean>(false);
  const [showSponsorEventModal, setShowSponsorEventModal] = useState<boolean>(false);
  const [showGithubPRModal, setShowGithubPRModal] = useState<boolean>(false);
  const [grantApplicationModalGrant, setGrantApplicationModalGrant] = useState<GrantProgram | null>(null);
  const [fundingModalProject, setFundingModalProject] = useState<Project | null>(null);
  const [evidenceModalProject, setEvidenceModalProject] = useState<Project | null>(null);
  const [githubPRUrl, setGithubPRUrl] = useState<string | null>(null);
  const [lastExportedGithub, setLastExportedGithub] = useState<ExportedGithubData | null>(() => {
    try {
      const saved = localStorage.getItem('openimpact_exported_github');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const handleExportGithub = (data: ExportedGithubData) => {
    setLastExportedGithub(data);
    try {
      localStorage.setItem('openimpact_exported_github', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  const requireAuth = (action: () => void) => {
    if (!currentUser) {
      setAuthModalMode('select');
      setShowAuthModal(true);
      return;
    }
    action();
  };

  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);
  const handleOpenDocumentTenureInFiscal = () => {
    setActiveTab('fiscal');
    setSelectedProject(null);
    setShowDocumentTenureModal(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [showDocumentTenureModal, setShowDocumentTenureModal] = useState<boolean>(false);
  const [userTenures, setUserTenures] = useState<TenureRecord[]>([]);
  const handleDocumentTenureSubmit = (tenure: TenureRecord) => {
    setUserTenures((prev) => [tenure, ...prev]);
    setShowDocumentTenureModal(false);
  };

  // Global keyboard shortcut for Command Palette (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Live Escrow Stream State & Real-time Simulated Activity
  const [isLiveStreamActive, setIsLiveStreamActive] = useState<boolean>(true);
  const [lastPulsedStat, setLastPulsedStat] = useState<'contributors' | 'escrow' | 'evidence' | null>(null);
  const [latestLiveContribution, setLatestLiveContribution] = useState<{
    id: string;
    projectId: string;
    projectTitle: string;
    amount: number;
    currency: Currency;
    supporterName: string;
    timestamp: number;
  } | null>(null);



  const handleTriggerDeposit = (targetProjectId?: string) => {
    if (projects.length === 0) return;
    const targetProj = targetProjectId
      ? projects.find((p) => p.id === targetProjectId) || projects[0]
      : projects[0];

    const depositAmount = targetProj.currency === 'USD' ? 250 : 75000;

    setProjects((prev) =>
      prev.map((p) =>
        p.id === targetProj.id
          ? { ...p, raised: p.raised + depositAmount, supportersCount: p.supportersCount + 1 }
          : p
      )
    );

    if (selectedProject && selectedProject.id === targetProj.id) {
      setSelectedProject((prev) =>
        prev ? { ...prev, raised: prev.raised + depositAmount, supportersCount: prev.supportersCount + 1 } : null
      );
    }

    setLatestLiveContribution({
      id: `contrib_${Date.now()}`,
      projectId: targetProj.id,
      projectTitle: targetProj.title,
      amount: depositAmount,
      currency: targetProj.currency,
      supporterName: `${currentUser?.name || 'Anonymous Contributor'} (Direct Escrow)`,
      timestamp: Date.now(),
    });

    // Dynamically increase current user impact score
    setCurrentUser((prev) =>
      prev
        ? {
            ...prev,
            reputation: {
              ...prev.reputation,
              impactScore: (prev.reputation?.impactScore || 0) + 2,
            },
          }
        : null
    );
  };

  // Document Viewer Modal State
  const [docViewerData, setDocViewerData] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: 'https://openimpact.io/evidence/doc-lease-garki.pdf',
    title: 'Signed Lease & Inspector Approval Document',
  });

  const handleOpenDocumentViewer = (url?: string, title?: string) => {
    setDocViewerData({
      isOpen: true,
      url: url || 'https://openimpact.io/evidence/doc-lease-garki.pdf',
      title: title || 'Signed Lease & Inspector Approval Document',
    });
  };

  const handleFundProject = (project: Project) => {
    setFundingModalProject(project);
  };

  const handleCreateProjectSubmit = (newProjData: Omit<Project, 'id' | 'createdAt' | 'raised' | 'supportersCount' | 'contributorsCount'>) => {
    const created: Project = {
      ...newProjData,
      id: `proj_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      raised: 0,
      supportersCount: 1,
      contributorsCount: 1,
      milestones: newProjData.milestones || [],
      expenses: [],
      evidence: [],
      impactMetrics: newProjData.impactMetrics || [],
    };
    setProjects([created, ...projects]);
    setShowCreateProjectModal(false);
  };

  const handleSubmitEvidence = (evidenceData: { title: string; type: EvidenceType; url: string; description: string }) => {
    if (!evidenceModalProject) return;
    const newEv: Evidence = {
      id: `ev_${Date.now()}`,
      projectId: evidenceModalProject.id,
      title: evidenceData.title,
      type: evidenceData.type,
      url: evidenceData.url,
      submittedBy: currentUser?.handle || '@contributor',
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
      description: evidenceData.description,
    };
    setProjects(prev => prev.map(p => p.id === evidenceModalProject.id ? { ...p, evidence: [newEv, ...p.evidence] } : p));
    if (selectedProject && selectedProject.id === evidenceModalProject.id) {
      setSelectedProject(prev => prev ? { ...prev, evidence: [newEv, ...prev.evidence] } : null);
    }
    setEvidenceModalProject(null);
  };

  const handleSubmitBatchEvidence = (evidenceList: { title: string; type: EvidenceType; url: string; description: string }[]) => {
    if (!evidenceModalProject || evidenceList.length === 0) return;
    const newItems: Evidence[] = evidenceList.map((ev, idx) => ({
      id: `ev_${Date.now()}_${idx}`,
      projectId: evidenceModalProject.id,
      title: ev.title,
      type: ev.type,
      url: ev.url,
      submittedBy: currentUser?.handle || '@contributor',
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
      description: ev.description,
    }));

    setProjects(prev => prev.map(p => p.id === evidenceModalProject.id ? { ...p, evidence: [...newItems, ...p.evidence] } : p));
    if (selectedProject && selectedProject.id === evidenceModalProject.id) {
      setSelectedProject(prev => prev ? { ...prev, evidence: [...newItems, ...prev.evidence] } : null);
    }
  };

  const handleSubmitEvidenceForProject = (projectId: string, evidenceData: { title: string; type: EvidenceType; url: string; description: string }) => {
    const newEv: Evidence = {
      id: `ev_${Date.now()}`,
      projectId,
      title: evidenceData.title,
      type: evidenceData.type,
      url: evidenceData.url,
      submittedBy: currentUser?.handle || '@contributor',
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
      description: evidenceData.description,
    };
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, evidence: [newEv, ...p.evidence] } : p));
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(prev => prev ? { ...prev, evidence: [newEv, ...prev.evidence] } : null);
    }
  };

  const handleSubmitBatchEvidenceForProject = (projectId: string, evidenceList: { title: string; type: EvidenceType; url: string; description: string }[]) => {
    if (evidenceList.length === 0) return;
    const newItems: Evidence[] = evidenceList.map((ev, idx) => ({
      id: `ev_${Date.now()}_${idx}`,
      projectId,
      title: ev.title,
      type: ev.type,
      url: ev.url,
      submittedBy: currentUser?.handle || '@contributor',
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Verified',
      description: ev.description,
    }));

    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, evidence: [...newItems, ...p.evidence] } : p));
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(prev => prev ? { ...prev, evidence: [...newItems, ...prev.evidence] } : null);
    }
    setCurrentUser(prev => prev ? ({
      ...prev,
      reputation: {
        ...prev.reputation,
        verifiedContributionsCount: (prev.reputation?.verifiedContributionsCount || 0) + newItems.length,
        impactScore: (prev.reputation?.impactScore || 0) + (newItems.length * 5),
      }
    }) : null);
  };

  const cards: CardType[] = [
    {
      label: "Core Engine",
      labelColor: "#183b78",
      title: "Impact Repositories",
      description:
        "The central workspace for your initiative. Track objectives, events, milestones, and funding in one verifiable source of truth.",
      button: "Explore repositories",
      accent: "#183b78",
      bg: "#edf4ff",
      features: ["Milestone tracking", "GitHub integration", "Planned vs Actual"],
      icon: "</>",
      action: () => {
        setActiveTab("projects");
        window.scrollTo(0, 0);
      },
    },
    {
      label: "Accountability",
      labelColor: "#159a7c",
      title: "Evidence & Verification",
      description:
        "Don't just claim impact—prove it. Upload receipts, GitHub PRs, and event logs, then get them community-verified.",
      button: "Verify evidence",
      accent: "#129878",
      bg: "#eaf8e9",
      features: ["Document uploads", "Multi-level verification", "Immutable audit trails"],
      icon: "✦",
      action: () => {
        setActiveTab("verification");
        window.scrollTo(0, 0);
      },
    },
    {
      label: "Reputation",
      labelColor: "#7344e6",
      title: "Impact Profiles",
      description:
        "Build your public record of real-world contribution. Showcase verified milestones, evidence, and Proof of Impact Certificates.",
      button: "View profiles",
      accent: "#7042e5",
      bg: "#f2edff",
      features: ["Verified contributions", "Impact Score", "Leadership tenures"],
      icon: "♧",
      action: () => {
        setActiveTab("talent");
        window.scrollTo(0, 0);
      },
    },
    {
      label: "Transparency",
      labelColor: "#0284c7",
      title: "Impact Ledger",
      description:
        "Track the exact flow of funds. Connect capital directly to milestones, vendor expenses, and verified outcomes.",
      button: "Explore ledger",
      accent: "#0284c7",
      bg: "#e0f2fe",
      features: ["Fund allocation", "Expense tracking", "Financial evidence"],
      icon: "◈",
      action: () => {
        setActiveTab("grants");
        window.scrollTo(0, 0);
      },
    },
    {
      label: "For Organizations",
      labelColor: "#ff6b2c",
      title: "Foundations & NGOs",
      description:
        "Monitor funded projects, verify milestones, and generate comprehensive AI-audited impact reports for your stakeholders.",
      button: "Start funding",
      accent: "#ff641f",
      bg: "#fff0e3",
      features: ["Organization dashboard", "AI Impact Auditor", "Funder views"],
      icon: "▦",
      action: () => setShowCreateProjectModal(true),
    },
    {
      label: "Contributions",
      labelColor: "#e11d48",
      title: "Opportunities",
      description:
        "Find initiatives that need your skills. Claim bounties, submit evidence, and earn official proof-of-work credentials.",
      button: "Browse opportunities",
      accent: "#e11d48",
      bg: "#fff1f2",
      features: ["Open bounties", "Volunteer roles", "Skill matching"],
      icon: "♥",
      action: () => {
        setActiveTab("opportunities");
        window.scrollTo(0, 0);
      },
    },
  ];

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          font-family:
            Inter,
            ui-sans-serif,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          background: #fbfcff;
          color: #12244b;
        }

        button,
        input {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .page {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 95% 14%,
              rgba(93, 230, 211, 0.13),
              transparent 230px
            ),
            radial-gradient(
              circle at 2% 32%,
              rgba(145, 226, 183, 0.12),
              transparent 190px
            ),
            #fbfcff;
        }

        .navbar {
          padding: 0 4.5%;
          border-bottom: 1px solid rgba(24, 59, 120, 0.07);
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(18px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .navbar-top {
          height: 86px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }

        .navbar-bottom {
          padding: 8px 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-top: 1px solid rgba(24, 59, 120, 0.04);
        }

        .nav-links {
          display: flex;
          gap: 25px;
          align-items: center;
          height: 100%;
        }

        .nav-link {
          height: 100%;
          display: flex;
          align-items: center;
          position: relative;
          border: 0;
          background: transparent;
          color: #30446e;
          font-size: 13px;
          font-weight: 500;
          transition: 0.2s ease;
        }

        .nav-link:hover {
          color: #12244b;
        }

        .nav-link.active {
          color: #12244b;
          font-weight: 650;
        }

        .nav-link.active::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #12244b;
          border-radius: 10px;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: flex-end;
        }

        .search-box {
          width: 240px;
          height: 42px;
          border-radius: 24px;
          background: #f4f6fa;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 15px;
          color: #73809a;
        }

        .search-box input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #24365d;
          font-size: 12px;
        }

        .signin {
          border: 1px solid #dce2ed;
          background: white;
          height: 42px;
          padding: 0 18px;
          border-radius: 24px;
          color: #17294f;
          font-size: 13px;
          transition: 0.2s;
        }

        .signin:hover {
          border-color: #bbc6da;
          transform: translateY(-1px);
        }

        .get-started {
          border: 0;
          height: 42px;
          padding: 0 20px;
          border-radius: 24px;
          background: #12244b;
          color: white;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 650;
          box-shadow: 0 8px 20px rgba(18, 36, 75, 0.16);
          transition: 0.2s;
        }

        .get-started:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(18, 36, 75, 0.22);
        }

        /* HERO */

        .hero {
          width: min(1390px, 91%);
          margin: 0 auto;
          padding: 50px 10px 38px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 60px;
        }

        .hero-copy {
          max-width: 690px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 11px;
          border-radius: 30px;
          background: #edf9f5;
          color: #16876f;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.3px;
          margin-bottom: 17px;
        }

        .eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #16a483;
          box-shadow: 0 0 0 5px rgba(22, 164, 131, 0.1);
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(39px, 4.1vw, 61px);
          line-height: 1.02;
          letter-spacing: -2.7px;
          color: #11234b;
          font-weight: 790;
        }

        .hero h1 span {
          background: linear-gradient(100deg, #122b61, #257a91);
          -webkit-background-clip: text;
          color: transparent;
        }

        .hero-description {
          margin: 18px 0 0;
          font-size: 17px;
          line-height: 1.55;
          color: #596b8f;
          max-width: 650px;
        }

        .hero-stats {
          display: flex;
          align-items: center;
          gap: 30px;
          flex-shrink: 0;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 125px;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #10987d;
          background: #eaf9f4;
        }

        .stat-label {
          font-size: 11px;
          color: #677696;
          line-height: 1.35;
        }

        .stat-number {
          display: block;
          margin-top: 2px;
          font-size: 15px;
          font-weight: 750;
          color: #138c74;
        }

        .stat-divider {
          width: 1px;
          height: 42px;
          background: #dde3ed;
        }

        /* CARDS */

        .cards-container {
          width: min(1390px, 91%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          padding-bottom: 33px;
        }

        .impact-card {
          min-height: 325px;
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          padding: 26px 27px;
          background: var(--card-bg);
          border: 1px solid rgba(255,255,255,0.85);
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
          isolation: isolate;
        }

        .impact-card::before {
          content: "";
          position: absolute;
          width: 350px;
          height: 350px;
          right: -100px;
          top: -130px;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
          filter: blur(20px);
          z-index: -1;
        }

        .impact-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 45px rgba(32, 56, 104, 0.1);
        }

        .card-content {
          position: relative;
          z-index: 5;
          width: 54%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .status {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 20px;
          background: rgba(255,255,255,0.84);
          color: #263653;
          font-size: 11px;
          font-weight: 650;
          margin-bottom: 28px;
          box-shadow: 0 3px 12px rgba(0,0,0,0.025);
        }

        .status-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }

        .card-heading {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .card-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: rgba(255,255,255,0.48);
          color: var(--accent);
          font-size: 18px;
          font-weight: 750;
        }

        .card-title {
          font-size: 28px;
          line-height: 1;
          font-weight: 760;
          letter-spacing: -1.1px;
          color: #14264c;
        }

        .card-description {
          margin: 18px 0 18px;
          font-size: 15px;
          line-height: 1.55;
          color: #43567c;
          max-width: 480px;
        }

        .card-button {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          align-self: flex-start;
          padding: 11px 17px;
          border: 0;
          border-radius: 25px;
          background: var(--accent);
          color: white;
          font-size: 13px;
          font-weight: 720;
          box-shadow: 0 8px 18px color-mix(
            in srgb,
            var(--accent) 22%,
            transparent
          );
          transition: 0.2s;
        }

        .card-button:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
        }

        .features {
          margin-top: auto;
          display: flex;
          gap: 20px;
          padding-top: 22px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #415577;
          font-size: 10.5px;
          white-space: nowrap;
        }

        .feature svg {
          color: var(--accent);
        }

        @media (max-width: 1200px) {
          .navbar {
            padding: 0 3%;
          }
          .nav-links {
            gap: 15px;
          }
          .search-box {
            display: none;
          }
          .hero {
            flex-direction: column;
            align-items: flex-start;
          }
          .hero-stats {
            width: 100%;
          }
        }

        @media (max-width: 900px) {
          .navbar {
            height: auto;
            min-height: 75px;
            padding: 15px 5%;
            flex-wrap: wrap;
            gap: 15px;
          }
          .cards-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <main className="page">
        {/* NAVIGATION */}
        <header className="navbar">
          <div className="navbar-top">
            <div onClick={() => setActiveTab('home')} className="cursor-pointer shrink-0">
              <OpenImpactLogo />
            </div>

            <nav className="nav-links">
              {[
                { id: 'home', label: 'Home' },
                { id: 'fiscal', label: 'NGOs & Causes', dot: '#e11d48' },
                { id: 'projects', label: 'Projects' },
                { id: 'opportunities', label: 'Work' },
                { id: 'grants', label: 'Grants' },
                { id: 'verification', label: 'Proof' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedProject(null);
                    if (tab.id === 'fiscal') {
                      setShowFiscalCreateModal(true);
                    } else {
                      setShowFiscalCreateModal(false);
                    }
                    window.scrollTo(0, 0);
                  }}
                >
                  {tab.dot && (
                    <span 
                      className="w-1.5 h-1.5 rounded-full mr-2 shrink-0" 
                      style={{ backgroundColor: tab.dot }} 
                    />
                  )}
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="nav-actions">
              {isLoggedIn && currentUser ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setSelectedProject(null);
                    }}
                    className="signin"
                    title="View Profile"
                  >
                    {currentUser.name.split(' ')[0]}
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await logoutUser();
                      } catch (e) {
                        console.error("Logout error:", e);
                      }
                      setIsLoggedIn(false);
                      setCurrentUser(null);
                      if (activeTab === 'profile') {
                        setActiveTab('home');
                      }
                    }}
                    className="bg-slate-50 text-slate-500 hover:text-slate-900 font-bold text-xs px-3 py-2 rounded-xl transition cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setShowAuthModal(true);
                  }}
                  className="signin"
                >
                  Sign in
                </button>
              )}

              <button
                onClick={() => setShowCreateProjectModal(true)}
                className="get-started"
              >
                Start Project
                <Arrow />
              </button>
            </div>
          </div>

          <div className="navbar-bottom">
            <div className="flex items-center space-x-6 flex-1">
              {/* Quick Command Palette Button */}
              <button
                onClick={() => setShowCommandPalette(true)}
                className="flex items-center space-x-3 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 transition cursor-pointer flex-1 max-w-lg shadow-sm"
                title="Open Command Hub (Cmd+K or Ctrl+K)"
              >
                <SearchIcon />
                <span className="flex-1 text-left text-slate-400 font-medium">Search projects, audits, grants...</span>
                <kbd className="text-[10px] font-mono bg-white text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 font-bold shadow-2xs">
                  ⌘K
                </kbd>
              </button>


            </div>

            <div className="flex items-center space-x-4">
              {/* Currency selector */}
              <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Currency</span>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
                  className="bg-transparent text-slate-800 text-xs font-bold focus:outline-none cursor-pointer pr-1"
                >
                  {CURRENCY_RATES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN VIEW ROUTING */}
        {activeTab === 'home' && !selectedProject && (
          <>
            {/* HERO */}
            <section className="hero">
              <div className="hero-copy">
                <h1>
                  Create <span>Real Impact.</span>
                  <br />
                  Verified on Chain & Code.
                </h1>

                <p className="hero-description">
                  OpenImpact connects open-source developers, 501(c)(6) fiscal sponsors, and impact funders with milestone escrow, GitHub PR verification, and peer-reviewed contribution audits.
                </p>
              </div>

              <div className="hero-stats">
                  <div className={`stat p-2 rounded-2xl transition-all duration-500 ${lastPulsedStat === 'contributors' ? 'bg-emerald-100 ring-2 ring-emerald-500 scale-105' : ''}`}>
                    <div className="stat-icon">
                      <PeopleIcon />
                    </div>
                    <div className="stat-label">
                      Global
                      <br />
                      Contributors & Backers
                      <span className="stat-number transition-all duration-300">
                        {projects.reduce((acc, p) => acc + (p.contributorsCount || 0) + (p.supportersCount || 0), 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="stat-divider" />

                  <div className={`stat p-2 rounded-2xl transition-all duration-500 ${lastPulsedStat === 'escrow' ? 'bg-emerald-100 ring-2 ring-emerald-500 scale-105' : ''}`}>
                    <div className="stat-icon">
                      <SparkIcon />
                    </div>
                    <div className="stat-label">
                      Active
                      <br />
                      Escrow Vault
                      <span className="stat-number transition-all duration-300">
                        {formatCurrency(
                          projects.reduce(
                            (acc, p) => acc + convertCurrency(p.raised, p.currency, selectedCurrency),
                            0
                          ),
                          selectedCurrency
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="stat-divider" />

                  <div className={`stat p-2 rounded-2xl transition-all duration-500 ${lastPulsedStat === 'evidence' ? 'bg-emerald-100 ring-2 ring-emerald-500 scale-105' : ''}`}>
                    <div className="stat-icon">
                      <HeartIcon />
                    </div>
                    <div className="stat-label">
                      501(c)(6)
                      <br />
                      Verified Evidence
                      <span className="stat-number transition-all duration-300">
                        {projects.reduce((acc, p) => acc + (p.evidence ? p.evidence.length : 0), 0)} Proofs
                      </span>
                    </div>
                  </div>
                </div>
            </section>

            {/* CARDS */}
            <section className="cards-container">
              {cards.map((card, index) => (
                <article
                  key={card.title}
                  className="impact-card cursor-pointer"
                  onClick={card.action}
                  style={
                    {
                      "--card-bg": card.bg,
                      "--accent": card.accent,
                    } as React.CSSProperties
                  }
                >
                  <div className="card-content">
                    <div className="status">
                      <span
                        className="status-dot"
                        style={{ background: card.labelColor }}
                      />
                      {card.label}
                    </div>

                    <div className="card-heading">
                      <div className="card-icon">{card.icon}</div>
                      <h2 className="card-title">{card.title}</h2>
                    </div>

                    <p className="card-description">{card.description}</p>

                    <button className="card-button" onClick={card.action}>
                      {card.button}
                      <Arrow />
                    </button>

                    <div className="features">
                      {card.features.map((feature) => (
                        <div className="feature" key={feature}>
                          <CheckIcon />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <AbstractShape type={index} accent={card.accent} />
                </article>
              ))}
            </section>
          </>
        )}

        {activeTab === 'projects' && !selectedProject && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ProjectList
              projects={projects}
              searchQuery={searchQuery}
              onSelectProject={(proj) => setSelectedProject(proj)}
              onFundProject={handleFundProject}
              onOpenCreateProject={() => setShowCreateProjectModal(true)}
              onOpenSponsorEventModal={() => setShowSponsorEventModal(true)}
              displayCurrency={selectedCurrency}
              isLiveStreamActive={isLiveStreamActive}
              setIsLiveStreamActive={setIsLiveStreamActive}
              latestLiveContribution={latestLiveContribution}
              onTriggerDeposit={handleTriggerDeposit}
            />
          </div>
        )}

        {selectedProject && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ProjectDetail
              project={selectedProject}
              displayCurrency={selectedCurrency}
              currentUser={currentUser}
              onBack={() => setSelectedProject(null)}
              onFundProject={handleFundProject}
              onOpenEvidenceModal={() => setEvidenceModalProject(selectedProject)}
              onOpenDocumentViewer={handleOpenDocumentViewer}
              onOpenDocumentTenure={handleOpenDocumentTenureInFiscal}
              onOpenProofVerification={() => {
                setProofModalProject(selectedProject);
                if (selectedProject?.githubRepo) {
                  const cleanRepo = selectedProject.githubRepo.replace(/^https?:\/\/github\.com\//i, '').replace(/\.git$/i, '');
                  handleExportGithub({
                    repo: cleanRepo,
                    contributorName: currentUser?.name || selectedProject.organization.name,
                    contributorHandle: currentUser?.githubUsername
                      ? `@${currentUser.githubUsername}`
                      : `@${currentUser?.handle || 'contributor'}`,
                    prTitle: selectedProject.title,
                    prNumber: 'PR #1',
                  });
                }
                setShowProofModal(true);
              }}
              onOpenAuthModal={() => setShowAuthModal(true)}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <ImpactLedger project={selectedProject} />
            </div>
          </div>
        )}

        {activeTab === 'talent' && !selectedProject && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <TalentLeaderboard 
              displayCurrency={selectedCurrency} 
              onOpenAuthModal={(mode) => {
                setAuthModalMode(mode || 'select');
                setShowAuthModal(true);
              }}
            />
          </div>
        )}

        {activeTab === 'opportunities' && !selectedProject && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <OpportunitiesBoard
              opportunities={opportunities}
              displayCurrency={selectedCurrency}
              searchQuery={searchQuery}
              currentUser={currentUser}
              onApply={(opp) => {
                setOpportunities((prev) =>
                  prev.map((o) =>
                    o.id === opp.id
                      ? { ...o, applicantsCount: o.applicantsCount + 1, status: 'In Progress' }
                      : o
                  )
                );
                setCurrentUser((prev) => ({
                  ...prev,
                  reputation: {
                    ...prev.reputation,
                    completedBountiesCount: prev.reputation.completedBountiesCount + 1,
                    impactScore: prev.reputation.impactScore + 4,
                  },
                }));
              }}
              onAddOpportunities={(newOpps) => setOpportunities((prev) => [...newOpps, ...prev])}
            />
          </div>
        )}

        {activeTab === 'grants' && !selectedProject && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <GrantsPortal
              grants={grants}
              displayCurrency={selectedCurrency}
              onApplyForGrant={(grant) => setGrantApplicationModalGrant(grant)}
              onOpenSponsorEventModal={() => setShowSponsorEventModal(true)}
            />
          </div>
        )}

        {activeTab === 'verification' && !selectedProject && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <VerificationPortal
              projects={projects}
              currentUser={currentUser}
              onOpenProofVerification={(exported) => {
                if (exported) handleExportGithub(exported);
                setShowProofModal(true);
              }}
              onOpenDocumentViewer={handleOpenDocumentViewer}
              onOpenAuthModal={() => setAuthModalMode('select')}
              onViewLedger={() => setActiveTab('grants')}
            />
          </div>
        )}

        {activeTab === 'fiscal' && !selectedProject && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <FiscalHostPortal
              collectives={INITIAL_COLLECTIVES}
              projects={projects}
              selectedCurrency={selectedCurrency}
              currentUser={currentUser}
              formatAmount={(amt, curr) => formatCurrency(amt, curr || selectedCurrency)}
              onSelectProject={(id) => {
                const found = projects.find((p) => p.id === id);
                if (found) setSelectedProject(found);
              }}
              onOpenFundingModal={handleFundProject}
              onOpenSponsorEventModal={() => setShowSponsorEventModal(true)}
              onOpenDocumentTenure={handleOpenDocumentTenureInFiscal}
            />
          </div>
        )}

        {activeTab === 'profile' && !selectedProject && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ProfileView
              currentUser={currentUser}
              displayCurrency={selectedCurrency}
              projects={projects}
              userTenures={userTenures}
              onOpenProofVerification={() => {
                if (currentUser) {
                  handleExportGithub({
                    repo: currentUser.githubUsername ? `${currentUser.githubUsername}/openimpact-core` : 'openimpact/pay-bridge',
                    contributorName: currentUser.name,
                    contributorHandle: currentUser.githubUsername ? `@${currentUser.githubUsername}` : `@${currentUser.handle}`,
                  });
                }
                setShowProofModal(true);
              }}
              onOpenGithubPRIntegration={() => setShowGithubPRModal(true)}
              onOpenDocumentTenure={handleOpenDocumentTenureInFiscal}
              onSelectProject={(proj) => setSelectedProject(proj)}
              onOpenAuthModal={() => {
                setAuthModalMode('login');
                setShowAuthModal(true);
              }}
              onUpdateCurrentUser={(updated) => setCurrentUser(updated)}
            />
          </div>
        )}

        {activeTab === 'about' && !selectedProject && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AboutPage
              selectedCurrency={selectedCurrency}
              onNavigate={(tab) => {
                setActiveTab(tab);
                setSelectedProject(null);
                window.scrollTo(0, 0);
              }}
              onOpenAuthModal={(mode) => {
                setAuthModalMode(mode || 'select');
                setShowAuthModal(true);
              }}
            />
          </div>
        )}

        {/* FOOTER */}
        <Footer 
          onNavigate={(tab) => {
            if (tab === 'landing') setActiveTab('home');
            else if (['home', 'projects', 'opportunities', 'grants', 'verification', 'fiscal', 'profile', 'about'].includes(tab)) {
              setActiveTab(tab);
            }
            setSelectedProject(null);
            window.scrollTo(0, 0);
          }}
          onOpenAuthModal={(mode) => {
            setAuthModalMode(mode || 'select');
            setShowAuthModal(true);
          }}
        />
      </main>

      {/* MODALS */}
      <ProofContributionModal
        isOpen={showProofModal}
        onClose={() => {
          setShowProofModal(false);
          setProofModalProject(null);
        }}
        projects={projects}
        currentUser={currentUser}
        initialProject={proofModalProject}
        exportedGithub={lastExportedGithub}
        onOpenAuthModal={() => {
          setAuthModalMode('select');
          setShowAuthModal(true);
        }}
      />

      <DocumentViewerModal
        isOpen={docViewerData.isOpen}
        onClose={() => setDocViewerData((prev) => ({ ...prev, isOpen: false }))}
        documentUrl={docViewerData.url}
        documentTitle={docViewerData.title}
      />

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authModalMode}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setIsLoggedIn(true);
            setShowAuthModal(false);
          }}
        />
      )}

      {showCreateProjectModal && (
        <CreateProjectModal
          isOpen={showCreateProjectModal}
          onClose={() => setShowCreateProjectModal(false)}
          onSubmit={handleCreateProjectSubmit}
          selectedCurrency={selectedCurrency}
        />
      )}

      {fundingModalProject && (
        <FundingModal
          isOpen={!!fundingModalProject}
          onClose={() => setFundingModalProject(null)}
          project={fundingModalProject}
          selectedCurrency={selectedCurrency}
          onSuccess={(amount) => {
            setProjects(prev => prev.map(p => p.id === fundingModalProject.id ? { ...p, raised: p.raised + amount, supportersCount: p.supportersCount + 1 } : p));
            if (selectedProject && selectedProject.id === fundingModalProject.id) {
              setSelectedProject(prev => prev ? { ...prev, raised: prev.raised + amount, supportersCount: prev.supportersCount + 1 } : null);
            }
            setLatestLiveContribution({
              id: `contrib_${Date.now()}`,
              projectId: fundingModalProject.id,
              projectTitle: fundingModalProject.title,
              amount,
              currency: selectedCurrency,
              supporterName: `${currentUser?.name || 'Direct Supporter'} (Direct Escrow)`,
              timestamp: Date.now(),
            });
            setCurrentUser(prev => prev ? ({
              ...prev,
              reputation: {
                ...prev.reputation,
                impactScore: (prev.reputation?.impactScore || 0) + 3,
              }
            }) : null);
            setFundingModalProject(null);
          }}
        />
      )}

      {evidenceModalProject && (
        <EvidenceModal
          project={evidenceModalProject}
          currentUser={currentUser}
          onClose={() => setEvidenceModalProject(null)}
          onSubmitEvidence={handleSubmitEvidence}
          onSubmitBatchEvidence={handleSubmitBatchEvidence}
          onOpenDocumentViewer={handleOpenDocumentViewer}
          onOpenAuthModal={() => setAuthModalMode('select')}
        />
      )}

      {githubPRUrl && (
        <GithubPRModal
          isOpen={!!githubPRUrl}
          onClose={() => setGithubPRUrl(null)}
          prUrl={githubPRUrl}
          currentUser={currentUser}
          onOpenProofVerification={(exported) => {
            if (exported) handleExportGithub(exported);
            setShowProofModal(true);
          }}
        />
      )}

      {grantApplicationModalGrant && (
        <GrantApplicationModal
          grant={grantApplicationModalGrant}
          allGrants={grants}
          onClose={() => setGrantApplicationModalGrant(null)}
          onSubmitSuccess={(app) => {
            setGrantApplicationModalGrant(null);
            alert(`Application & Proposal successfully submitted! ID: ${app.id}`);
          }}
        />
      )}

      <SponsorEventModal
        isOpen={showSponsorEventModal}
        onClose={() => setShowSponsorEventModal(false)}
        selectedCurrency={selectedCurrency}
      />

      {showGithubPRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl my-auto">
            <GithubPRIntegration
              projects={projects}
              currentUser={currentUser}
              onExportGithub={handleExportGithub}
              onOpenProofVerification={(exported) => {
                if (exported) handleExportGithub(exported);
                setShowGithubPRModal(false);
                setShowProofModal(true);
              }}
              onAddEvidence={(projId, ev) => {
                handleSubmitEvidenceForProject(projId, ev);
                setShowGithubPRModal(false);
              }}
              onAddBatchEvidence={(projId, list) => {
                handleSubmitBatchEvidenceForProject(projId, list);
                setShowGithubPRModal(false);
              }}
              onClose={() => setShowGithubPRModal(false)}
            />
          </div>
        </div>
      )}

      {showDocumentTenureModal && (
        <DocumentTenureModal
          projects={projects}
          currentUser={currentUser}
          onClose={() => setShowDocumentTenureModal(false)}
          onSubmitTenure={handleDocumentTenureSubmit}
          onOpenProofOfWork={() => setShowProofModal(true)}
        />
      )}

      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setSelectedProject(null);
        }}
        onOpenProofModal={() => setShowProofModal(true)}
        onOpenAiAdvisor={() => setShowAiAdvisorModal(true)}
        onOpenCreateProject={() => setShowCreateProjectModal(true)}
        onOpenDocumentTenure={handleOpenDocumentTenureInFiscal}
        projects={projects}
        onSelectProject={(proj) => {
          setSelectedProject(proj);
          setActiveTab('projects');
        }}
      />
      <AiImpactAssistant projectData={selectedProject} />
    </>
  );
}
