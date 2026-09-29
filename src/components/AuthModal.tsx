import React, { useState } from 'react';
import { X, ArrowRight, Building2, Users, User, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import {
  signInWithGoogle,
  signUpWithEmail,
  signInWithEmail,
} from '../lib/firebase';

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
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleModeSwitch = (newMode: 'select' | 'organization' | 'collective' | 'individual' | 'login') => {
    setMode(newMode);
    setAuthError(null);
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setIsLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res.success && res.user) {
        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess(res.user!);
          setIsSuccess(false);
          setIsLoading(false);
          onClose();
        }, 500);
      } else {
        setAuthError(res.error || 'Google authentication was not completed.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Google sign-in encountered an error.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await signInWithEmail(email.trim(), password);
        if (res.success && res.user) {
          setIsSuccess(true);
          setTimeout(() => {
            onLoginSuccess(res.user!);
            setIsSuccess(false);
            setIsLoading(false);
            onClose();
          }, 500);
        } else {
          setAuthError(res.error || 'Invalid email or password.');
          setIsLoading(false);
        }
      } else {
        // Sign Up Mode
        let role: UserRole = 'contributor';
        let customName = name.trim();
        let details = orgDetails.trim();

        if (mode === 'organization') {
          role = 'funder';
          if (!customName && details) customName = details;
        } else if (mode === 'collective') {
          role = 'organization';
          details = name.trim();
        }

        const res = await signUpWithEmail(
          email.trim(),
          password,
          customName || 'OpenImpact Member',
          role,
          details
        );

        if (res.success && res.user) {
          setIsSuccess(true);
          setTimeout(() => {
            onLoginSuccess(res.user!);
            setIsSuccess(false);
            setIsLoading(false);
            onClose();
          }, 500);
        } else {
          setAuthError(res.error || 'Failed to create account. Please check your credentials.');
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl text-slate-900 relative max-h-[calc(100dvh-2rem)] overflow-y-auto my-auto transition-all">
        
        {/* Top Header Pill Bar (Sign Up / Log In toggles) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleModeSwitch('select')}
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
              disabled={isLoading}
              onClick={() => handleModeSwitch('login')}
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
            disabled={isLoading}
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
            <p className="text-xs text-slate-600">Authenticated successfully via Firebase. Entering platform...</p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {/* Error Message Banner */}
            {authError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-2">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{authError}</div>
                </div>
                {authError.toLowerCase().includes('google') && (
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full mt-1.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] transition cursor-pointer"
                  >
                    Continue with Google
                  </button>
                )}
              </div>
            )}

            {/* SELECTION SCREEN */}
            {mode === 'select' && (
              <div className="space-y-3">
                {/* Option 1: Organization */}
                <div
                  onClick={() => handleModeSwitch('organization')}
                  className="group bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl p-5 transition cursor-pointer shadow-xs hover:shadow-md text-left flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-indigo-800 font-bold text-base sm:text-lg tracking-tight">
                      Join as an organization
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                      If you have a legal entity / philanthropic foundation
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition shrink-0 ml-3" />
                </div>

                {/* Option 2: Collective */}
                <div
                  onClick={() => handleModeSwitch('collective')}
                  className="group bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl p-5 transition cursor-pointer shadow-xs hover:shadow-md text-left flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-indigo-800 font-bold text-base sm:text-lg tracking-tight">
                      Join as a collective
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                      If you do NOT have a legal entity (open source project)
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
                      onClick={() => handleModeSwitch('individual')}
                      className="text-indigo-700 font-semibold underline hover:text-indigo-900 cursor-pointer"
                    >
                      Join as an individual contributor
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
                  disabled={isLoading}
                  onClick={handleGoogleLogin}
                  className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-300 transition flex items-center justify-center space-x-2.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
                  ) : (
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span>{isLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
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
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    placeholder="e.g. Eleanor Hayes"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    required
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-[#0B1E48] hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  <span>{isLoading ? 'Creating Account...' : 'Create Organization Account'}</span>
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleModeSwitch('select')}
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
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Collective / Project Name</label>
                  <input
                    type="text"
                    required
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                    placeholder="At least 6 characters"
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
                  disabled={isLoading}
                  className="w-full py-2.5 bg-[#0B1E48] hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  <span>{isLoading ? 'Submitting Registration...' : 'Submit Collective Registration'}</span>
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleModeSwitch('select')}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-[#0B1E48] hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  <span>{isLoading ? 'Creating Contributor Account...' : 'Create Contributor Account'}</span>
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleModeSwitch('select')}
                    className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    ← Back to account type options
                  </button>
                </div>
              </form>
            )}

            {/* LOG IN SCREEN */}
            {mode === 'login' && (
              <div className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      disabled={isLoading}
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
                      disabled={isLoading}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-[#0B1E48] hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    <span>{isLoading ? 'Signing In...' : 'Sign In with Email'}</span>
                  </button>
                </form>

                {/* Google Sign In Button for Login */}
                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleGoogleLogin}
                    className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-300 transition flex items-center justify-center space-x-2.5 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
                    ) : (
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    )}
                    <span>{isLoading ? 'Connecting to Google...' : 'Sign In with Google'}</span>
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
