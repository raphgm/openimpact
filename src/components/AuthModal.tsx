import React, { useState } from 'react';
import { X, ArrowRight, Building2, Users, User, Lock, Mail, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { signInWithGoogle } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'select' | 'organization' | 'collective' | 'individual' | 'login';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'select',
}) => {
  const [mode, setMode] = useState<'select' | 'organization' | 'collective' | 'individual' | 'login'>(
    initialMode
  );

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [orgDetails, setOrgDetails] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDemoLogin = (role: 'funder' | 'contributor' | 'maintainer') => {
    let demoUser: UserProfile;

    if (role === 'funder') {
      demoUser = {
        id: 'user_funder',
        name: 'Eleanor Hayes (Global Grant Director)',
        handle: '@ehayes_fund',
        email: 'eleanor@microsoft.com',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
        role: 'funder',
        bio: 'Senior Program Director at Philanthropic Technology Initiatives.',
        location: 'Seattle, WA & Geneva, CH',
        reputation: {
          impactScore: 98,
          verifiedContributionsCount: 32,
          completedProjectsCount: 14,
          completedBountiesCount: 22,
          peopleTrained: 120,
          communityHours: 450,
        },
        skills: ['Grant Management', 'ESG Compliance', 'Fiscal Oversight'],
      };
    } else if (role === 'maintainer') {
      demoUser = {
        id: 'user_maintainer',
        name: 'Alexander Wright (Fiscal Custodian)',
        handle: '@alex_wright',
        email: 'alex@watech.org',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        role: 'organization',
        bio: 'Lead Architect & Fiscal Host Trustee at Global FinOps Collective.',
        location: 'London, UK',
        reputation: {
          impactScore: 92,
          verifiedContributionsCount: 28,
          completedProjectsCount: 19,
          completedBountiesCount: 34,
          peopleTrained: 85,
          communityHours: 320,
        },
        skills: ['TypeScript', 'Kubernetes', 'Rust', 'Tax Automation'],
      };
    } else {
      demoUser = {
        id: 'user_contributor',
        name: 'Nadia Sorensen (Core Protocol Contributor)',
        handle: '@nadia_dev',
        email: 'nadia@openimpact.network',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        role: 'contributor',
        bio: 'Systems engineer specializing in decentralized networks, verifiable audits, and civic tech.',
        location: 'Copenhagen, Denmark',
        reputation: {
          impactScore: 88,
          verifiedContributionsCount: 18,
          completedProjectsCount: 8,
          completedBountiesCount: 12,
          peopleTrained: 40,
          communityHours: 210,
        },
        skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Rust'],
      };
    }

    setIsSuccess(true);
    setTimeout(() => {
      onLoginSuccess(demoUser);
      setIsSuccess(false);
      onClose();
    }, 600);
  };

  const handleGoogleLogin = async () => {
    const res = await signInWithGoogle();
    if (res.success && res.user) {
      setIsSuccess(true);
      setTimeout(() => {
        onLoginSuccess(res.user!);
        setIsSuccess(false);
        onClose();
      }, 600);
    } else {
      handleDemoLogin('contributor');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userName = name || (email.split('@')[0] || 'Member');
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: userName,
      handle: `@${userName.toLowerCase().replace(/\s+/g, '')}`,
      email: email || 'user@openimpact.network',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      role: mode === 'organization' ? 'funder' : mode === 'collective' ? 'organization' : 'contributor',
      bio: mode === 'organization' ? `Member of ${orgDetails}` : 'OpenImpact Verified Member',
      location: 'Geneva, Switzerland',
      reputation: {
        impactScore: 50,
        verifiedContributionsCount: 0,
        completedProjectsCount: 0,
        completedBountiesCount: 0,
        peopleTrained: 0,
        communityHours: 0,
      },
      skills: ['Open Source', 'Impact Tech'],
    };

    setIsSuccess(true);
    setTimeout(() => {
      onLoginSuccess(newUser);
      setIsSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl text-slate-900 relative overflow-hidden transition-all">
        
        {/* Top Header Pill Bar (Sign Up / Log In toggles matching screenshot style) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setMode('select')}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition cursor-pointer ${
                mode !== 'login'
                  ? 'bg-[#0B1E48] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#0B1E48] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Log In
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto border border-indigo-200 animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Welcome to OpenImpact!</h4>
            <p className="text-xs text-slate-600">Authentication successful. Entering platform...</p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {/* SELECTION SCREEN (Matches screenshot image precisely) */}
            {mode === 'select' && (
              <div className="space-y-3">
                {/* Option 1: Organization */}
                <div
                  onClick={() => setMode('organization')}
                  className="group bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl p-5 transition cursor-pointer shadow-xs hover:shadow-md text-left flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-indigo-800 font-bold text-base sm:text-lg tracking-tight">
                      Join as an organization
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                      If you have a legal entity
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition shrink-0 ml-3" />
                </div>

                {/* Option 2: Collective */}
                <div
                  onClick={() => setMode('collective')}
                  className="group bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl p-5 transition cursor-pointer shadow-xs hover:shadow-md text-left flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-indigo-800 font-bold text-base sm:text-lg tracking-tight">
                      Join as a collective
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                      If you do NOT have a legal entity
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition shrink-0 ml-3" />
                </div>

                {/* Option 3: Individual Link */}
                <div className="pt-1 text-center">
                  <span className="text-xs text-slate-500">
                    Or{' '}
                    <button
                      type="button"
                      onClick={() => setMode('individual')}
                      className="text-indigo-700 font-semibold underline hover:text-indigo-900 cursor-pointer"
                    >
                      Join as an individual
                    </button>
                  </span>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-slate-400 text-[11px] font-mono">OR</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-300 transition flex items-center justify-center space-x-2.5 shadow-xs cursor-pointer"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>
            )}

            {/* ORGANIZATION FORM */}
            {mode === 'organization' && (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center space-x-2 text-indigo-800 font-bold text-sm">
                  <Building2 className="h-4 w-4" />
                  <span>Register Organization / Funder</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Philanthropies or Microsoft Fund"
                    value={orgDetails}
                    onChange={(e) => setOrgDetails(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="official@organization.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0B1E48] hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer"
                >
                  Create Organization Account
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setMode('select')}
                    className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    ← Back to account type options
                  </button>
                </div>
              </form>
            )}

            {/* COLLECTIVE FORM */}
            {mode === 'collective' && (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center space-x-2 text-indigo-800 font-bold text-sm">
                  <Users className="h-4 w-4" />
                  <span>Create Fiscal Collective</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Collective Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. West Africa Open Tax Engine"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Maintainer Email</label>
                  <input
                    type="email"
                    required
                    placeholder="maintainer@project.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-slate-600">
                  <span className="font-bold text-indigo-900">OpenImpact Fiscal Host:</span> Includes non-profit legal entity backing, milestone escrow, and automated tax reporting with zero custom legal setup needed.
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0B1E48] hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer"
                >
                  Submit Collective Registration
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setMode('select')}
                    className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    ← Back to account type options
                  </button>
                </div>
              </form>
            )}

            {/* INDIVIDUAL FORM */}
            {mode === 'individual' && (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center space-x-2 text-indigo-800 font-bold text-sm">
                  <User className="h-4 w-4" />
                  <span>Join as Contributor / Individual</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amina Bello"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>


                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0B1E48] hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer"
                >
                  Create Contributor Account
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setMode('select')}
                    className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    ← Back to account type options
                  </button>
                </div>
              </form>
            )}

            {/* LOG IN SCREEN & QUICK DEMO PROFILES */}
            {mode === 'login' && (
              <div className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#0B1E48] hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer"
                  >
                    Sign In
                  </button>
                </form>

                {/* Google Sign In Button for Login */}
                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-300 transition flex items-center justify-center space-x-2.5 shadow-xs cursor-pointer"
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
