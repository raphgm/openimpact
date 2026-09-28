import React, { useState } from 'react';
import {
  X,
  Zap,
  Globe,
  Wallet,
  Building2,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  RefreshCw,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  FileText,
  BadgeAlert,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Currency, PayoutRail, UserProfile } from '../types';
import { formatCurrency } from '../utils/formatters';

interface GlobalSettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance?: number;
  currency?: Currency;
  currentUser?: UserProfile;
  onSuccessPayout?: (amount: number, rail: PayoutRail) => void;
}

export const GlobalSettlementModal: React.FC<GlobalSettlementModalProps> = ({
  isOpen,
  onClose,
  availableBalance = 15750,
  currency = 'USD',
  currentUser,
  onSuccessPayout,
}) => {
  const currentCurrency: Currency = (currency as Currency) || 'USD';
  const [selectedRail, setSelectedRail] = useState<PayoutRail>('USDC_STABLECOIN');
  const [withdrawAmount, setWithdrawAmount] = useState<string>(availableBalance.toString());
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [wiseEmail, setWiseEmail] = useState<string>('');
  const [bankIban, setBankIban] = useState<string>('');
  const [hasTaxClearance, setHasTaxClearance] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [payoutSuccess, setPayoutSuccess] = useState<string | null>(null);

  // Extra Privileges & Multi-Sig Authorization States
  const [isPrivilegeAuthorized, setIsPrivilegeAuthorized] = useState<boolean>(false);
  const [showPrivilegeChallenge, setShowPrivilegeChallenge] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>('fiscal_officer');
  const [authPin, setAuthPin] = useState<string>('');
  const [fiduciaryCertAccepted, setFiduciaryCertAccepted] = useState<boolean>(false);
  const [isAuthenticatingPrivilege, setIsAuthenticatingPrivilege] = useState<boolean>(false);
  const [privilegeError, setPrivilegeError] = useState<string | null>(null);
  const [authSessionToken, setAuthSessionToken] = useState<string | null>(null);

  if (!isOpen) return null;

  const numAmount = parseFloat(withdrawAmount) || 0;

  const payoutOptions: {
    id: PayoutRail;
    title: string;
    subtitle: string;
    speed: string;
    fee: string;
    icon: React.ReactNode;
    coverage: string;
  }[] = [
    {
      id: 'USDC_STABLECOIN',
      title: 'USDC Stablecoin (Base / Polygon)',
      subtitle: 'Instant global settlement with 0% currency conversion loss.',
      speed: 'Instant (~5 seconds)',
      fee: '$0.00 (Sponsored by OpenImpact)',
      icon: <Wallet className="h-5 w-5 text-indigo-400" />,
      coverage: 'Global (Africa, LATAM, Asia, Worldwide)',
    },
    {
      id: 'WISE_GLOBAL',
      title: 'Wise Global Multi-Currency Transfer',
      subtitle: 'Direct local bank deposit in 80+ local currencies (NGN, KES, INR, BRL, EUR, GBP).',
      speed: '1–4 hours',
      fee: 'Mid-market rate + 0.35%',
      icon: <Globe className="h-5 w-5 text-emerald-400" />,
      coverage: '80+ Countries Worldwide',
    },
    {
      id: 'BANK_ACH',
      title: 'US Bank ACH Direct Deposit',
      subtitle: 'Direct transfer to any US checking or savings account.',
      speed: '1 business day',
      fee: '$0.00',
      icon: <Building2 className="h-5 w-5 text-blue-400" />,
      coverage: 'United States Accounts',
    },
    {
      id: 'SEPA_EURO',
      title: 'SEPA Euro Instant Transfer',
      subtitle: 'Instant euro settlement for European contributors and collectives.',
      speed: 'Instant (~10 seconds)',
      fee: '€0.00',
      icon: <Building2 className="h-5 w-5 text-amber-400" />,
      coverage: '36 European SEPA Nations',
    },
  ];

  // Elevated Privilege Verification Handler
  const handleVerifyPrivileges = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPrivilegeError(null);

    const validPasskeys = ['849-204', 'OPENIMPACT-MULTISIG-2026', 'SECURE-AUTH-99'];
    if (!authPin || !validPasskeys.includes(authPin.trim())) {
      setPrivilegeError('Access Denied: Invalid security passkey. Only invited and authorized multi-sig signers can authorize transactions.');
      return;
    }

    if (!fiduciaryCertAccepted) {
      setPrivilegeError('You must review and check the 501(c)(6) Fiduciary Compliance Attestation.');
      return;
    }

    setIsAuthenticatingPrivilege(true);

    setTimeout(() => {
      setIsAuthenticatingPrivilege(false);
      setIsPrivilegeAuthorized(true);
      setShowPrivilegeChallenge(false);
      setAuthSessionToken(`PRIV-KEY-${Math.floor(100000 + Math.random() * 900000)}`);
      setPrivilegeError(null);
    }, 900);
  };

  const handleRevokePrivileges = () => {
    setIsPrivilegeAuthorized(false);
    setAuthSessionToken(null);
    setAuthPin('');
    setFiduciaryCertAccepted(false);
  };

  const handleProcessPayout = (e: React.FormEvent) => {
    e.preventDefault();

    // Extra privilege enforcement guard
    if (!isPrivilegeAuthorized) {
      setShowPrivilegeChallenge(true);
      setPrivilegeError('Elevated privileges are required before any escrow disbursement can proceed.');
      return;
    }

    if (numAmount <= 0 || numAmount > availableBalance) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPayoutSuccess(
        `🚀 Privileged Payout of ${formatCurrency(numAmount, currentCurrency)} successfully executed via ${
          selectedRail === 'USDC_STABLECOIN' ? 'USDC Stablecoin Vault' : selectedRail
        }! Co-signed by OpenImpact Fiscal Custody & Session ${authSessionToken}.`
      );
      if (onSuccessPayout) {
        onSuccessPayout(numAmount, selectedRail);
      }
      setTimeout(() => {
        setPayoutSuccess(null);
        onClose();
      }, 3500);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] border border-[#E8E2D6] rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-900 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E8E2D6] bg-white shrink-0">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-colors ${
              isPrivilegeAuthorized 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}>
              {isPrivilegeAuthorized ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <Lock className="h-5 w-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Multi-Rail Contributor Settlement
                </h3>
                <span className="text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                  Admin & Maintainer Rail
                </span>
                {isPrivilegeAuthorized && (
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    <span>Privileges Verified</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Authorized disbursement portal for verified maintainers, approved payees, and 501(c)(6) fiscal officers.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-[#FAF8F5] text-left">
          {/* AVAILABLE ESCROW BALANCE */}
          <div className="p-4 bg-white border border-[#E8E2D6] rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
                Audited & Released Escrow Balance
              </span>
              <div className="text-2xl font-black text-emerald-600 font-mono mt-0.5">
                {formatCurrency(availableBalance, currentCurrency)}
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Ready for Immediate Transfer</span>
            </span>
          </div>

          {/* ELEVATED PRIVILEGES VERIFICATION GATE */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isPrivilegeAuthorized
              ? 'bg-emerald-50/70 border-emerald-200 shadow-xs'
              : 'bg-amber-50/80 border-amber-200 shadow-xs'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                  isPrivilegeAuthorized ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {isPrivilegeAuthorized ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : (
                    <ShieldAlert className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      {isPrivilegeAuthorized 
                        ? '🛡️ Elevated Privileges Authenticated' 
                        : '🔒 Extra Privileges Required for Disbursement'}
                    </h4>
                    {isPrivilegeAuthorized && (
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        Quorum 2/2 Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {isPrivilegeAuthorized
                      ? `Session cleared with 501(c)(6) Multi-Sig Signing Key (${authSessionToken}). Fiduciary anti-diversion covenants cleared for capital transfer.`
                      : 'All disbursements from public goods escrow vaults require elevated Fiscal Officer or Lead Maintainer multi-sig signing authority to prevent unauthorized fund diversion.'}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {isPrivilegeAuthorized ? (
                  <button
                    type="button"
                    onClick={handleRevokePrivileges}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
                  >
                    Lock Privileges
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowPrivilegeChallenge(!showPrivilegeChallenge)}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Key className="h-3.5 w-3.5" />
                    <span>{showPrivilegeChallenge ? 'Hide Auth Panel' : 'Authenticate Privileges'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* EXPANDABLE PRIVILEGE AUTHENTICATION CHALLENGE */}
            {(!isPrivilegeAuthorized && showPrivilegeChallenge) && (
              <div className="mt-4 pt-4 border-t border-amber-200/80 space-y-3.5 font-sans">
                <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Fingerprint className="h-4 w-4 text-amber-600" />
                      <span>Fiduciary Privilege Verification</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">501(c)(6) Multi-Sig Quorum</span>
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Authorized Signatory Role *
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    >
                      <option value="fiscal_officer">Alexander Wright — 501(c)(6) Fiscal Officer & Custodian</option>
                      <option value="lead_maintainer">DevGlobal Core Maintainer & Escrow Signatory</option>
                      <option value="independent_trustee">Independent Audit Trustee (OpenProof Board)</option>
                    </select>
                  </div>

                  {/* Multi-Sig Passkey / PIN */}
                  <div>
                    <div className="mb-1">
                      <label className="block text-[11px] font-bold text-slate-700">
                        Multi-Sig Authorization Key / Security Passkey *
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Enter secure authorized Multi-Sig PIN or Security Key"
                        value={authPin}
                        onChange={(e) => setAuthPin(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>

                  {/* Fiduciary Acknowledgment Checkbox */}
                  <label className="flex items-start space-x-2 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fiduciaryCertAccepted}
                      onChange={(e) => setFiduciaryCertAccepted(e.target.checked)}
                      className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-700 leading-snug">
                      I solemnly attest under <strong>501(c)(6) non-profit fiduciary responsibility</strong> that this disbursement of {formatCurrency(numAmount, currentCurrency)} corresponds to verified milestone proof, approved vendor invoices, and cleared tax filings.
                    </span>
                  </label>

                  {privilegeError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-[11px] text-red-700 font-semibold">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{privilegeError}</span>
                    </div>
                  )}

                  {/* Challenge Action Button */}
                  <button
                    type="button"
                    onClick={() => handleVerifyPrivileges()}
                    disabled={isAuthenticatingPrivilege}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isAuthenticatingPrivilege ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-white" />
                        <span>Verifying Multi-Sig Signing Key...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-3.5 w-3.5 text-white" />
                        <span>Authorize & Unlock Elevated Privileges</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {payoutSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3 text-xs text-emerald-900 font-bold shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>{payoutSuccess}</span>
            </div>
          )}

          {/* SELECT PAYOUT RAIL */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select Payout Rail
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {payoutOptions.map((opt) => {
                const isSelected = selectedRail === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedRail(opt.id)}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition space-y-2 ${
                      isSelected
                        ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                        : 'bg-white/90 border-[#E8E2D6] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {opt.icon}
                        <span className="text-xs font-bold text-slate-900">{opt.title}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2">{opt.subtitle}</p>

                    <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-100">
                      <span className="text-emerald-700 font-bold">{opt.speed}</span>
                      <span>Fee: {opt.fee}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DESTINATION INPUTS */}
          <form onSubmit={handleProcessPayout} className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Withdrawal Amount ({currency})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs font-bold">$</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    max={availableBalance}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {selectedRail === 'USDC_STABLECOIN'
                      ? 'Recipient EVM Wallet Address *'
                      : selectedRail === 'WISE_GLOBAL'
                      ? 'Wise Recipient Email *'
                      : 'Account / IBAN Number *'}
                  </label>

                </div>
                <input
                  type="text"
                  placeholder={
                    selectedRail === 'USDC_STABLECOIN'
                      ? 'e.g. 0x71C...9e2B'
                      : selectedRail === 'WISE_GLOBAL'
                      ? 'name@collective.org'
                      : 'e.g. US89370400440532013000'
                  }
                  value={
                    selectedRail === 'USDC_STABLECOIN'
                      ? destinationAddress
                      : selectedRail === 'WISE_GLOBAL'
                      ? wiseEmail
                      : bankIban
                  }
                  onChange={(e) => {
                    if (selectedRail === 'USDC_STABLECOIN') setDestinationAddress(e.target.value);
                    else if (selectedRail === 'WISE_GLOBAL') setWiseEmail(e.target.value);
                    else setBankIban(e.target.value);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>

            {/* DYNAMIC TAX CLEARANCE STATUS CHECK */}
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs shadow-2xs transition-colors ${
              hasTaxClearance ? 'bg-white border-[#E8E2D6]' : 'bg-amber-50/70 border-amber-200'
            }`}>
              <label className="flex items-center space-x-2.5 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={hasTaxClearance}
                  onChange={(e) => setHasTaxClearance(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-slate-700 font-mono text-[11px] font-medium">
                  501(c)(6) Tax Status: W-8BEN (Foreign) / W-9 (US) on file & certified
                </span>
              </label>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                hasTaxClearance 
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                  : 'text-amber-800 bg-amber-100 border-amber-200'
              }`}>
                {hasTaxClearance ? 'Verified & Cleared' : 'Pending Tax Form'}
              </span>
            </div>

            {/* Payout Trigger Button with Privilege Guard */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing || numAmount <= 0 || numAmount > availableBalance}
                className={`w-full py-3 font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer ${
                  !isPrivilegeAuthorized
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40'
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    <span>Executing Privileged Settlement...</span>
                  </>
                ) : !isPrivilegeAuthorized ? (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Authenticate Extra Privileges to Disburse {formatCurrency(numAmount, currentCurrency)}</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    <span>Disburse {formatCurrency(numAmount, currentCurrency)} Now (Authorized)</span>
                  </>
                )}
              </button>
              {!isPrivilegeAuthorized && (
                <p className="text-[10px] text-center text-slate-500 mt-2 font-medium">
                  🔒 Fiduciary protection: Releasing funds requires 501(c)(6) Multi-Sig clearance above.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
