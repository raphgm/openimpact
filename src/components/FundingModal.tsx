import React, { useState } from 'react';
import { X, ShieldCheck, Heart, RefreshCw, Building2, CheckCircle2, CreditCard, Landmark, Smartphone, Wallet, Lock, ArrowRight } from 'lucide-react';
import { Project, Currency } from '../types';
import { formatCurrency, convertCurrency, getCurrencySymbol } from '../utils/formatters';

interface FundingModalProps {
  project: Project;
  displayCurrency: Currency;
  currentUser?: { name: string; email: string };
  onClose: () => void;
  onFundSuccess: (amount: number, currency: Currency, mode: 'one-time' | 'recurring') => void;
}

export const FundingModal: React.FC<FundingModalProps> = ({
  project,
  displayCurrency,
  currentUser,
  onClose,
  onFundSuccess,
}) => {
  const [fundingMode, setFundingMode] = useState<'one-time' | 'recurring'>('one-time');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'mobile' | 'crypto'>('card');
  const [amount, setAmount] = useState<number>(
    displayCurrency === 'NGN' ? 10000 : displayCurrency === 'KES' ? 1000 : 50
  );
  const [funderName, setFunderName] = useState(currentUser?.name || 'Community Donor');
  const [funderEmail, setFunderEmail] = useState(currentUser?.email || 'donor@openimpact.io');
  
  // Dynamic Matching Sponsor options
  const sponsorOptions = [
    `${project.organization?.name || 'OpenImpact'} Matching Pool`,
    'Microsoft Open Source Fund',
    'Ford Foundation Civic Grant Pool',
    'Lisk Foundation Grants Match',
    'Gitcoin Quadratic Matching Fund',
    'Google Open Source Fund',
  ];
  const [selectedSponsor, setSelectedSponsor] = useState(sponsorOptions[0]);
  const [matchingRatio, setMatchingRatio] = useState<number>(2);

  // Payment Method Specific Inputs
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [phoneNumber, setPhoneNumber] = useState('+234 803 123 4567');
  const [enableCorporateMatch, setEnableCorporateMatch] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [receiptTxHash, setReceiptTxHash] = useState('');

  // Quick preset amounts based on currency
  const presetAmounts =
    displayCurrency === 'NGN'
      ? [1000, 5000, 10000, 50000, 100000]
      : displayCurrency === 'KES'
      ? [500, 1000, 2500, 5000, 10000]
      : [10, 25, 50, 100, 250];

  const symbol = getCurrencySymbol(displayCurrency);

  // Calculate project currency equivalent
  const projectCurrencyAmount = convertCurrency(amount, displayCurrency, project.currency);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setIsProcessing(true);

    const generatedTx = `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    setReceiptTxHash(generatedTx);

    setTimeout(() => {
      setIsProcessing(false);
      setSubmitted(true);
      onFundSuccess(projectCurrencyAmount, project.currency, fundingMode);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-900 relative overflow-hidden my-8 mx-auto text-left font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 font-mono">
              Escrow-Protected Contribution
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">Fund {project.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg bg-slate-50 border border-slate-200 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-900">Payment Processed Successfully!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Your contribution of <strong className="text-slate-900">{formatCurrency(amount, displayCurrency)}</strong> has been locked into the milestone escrow vault.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>Beneficiary Project:</span>
                <span className="text-slate-900 font-bold">{project.title}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Payment Method:</span>
                <span className="text-slate-900 font-bold capitalize">{paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Escrow Tx Hash:</span>
                <span className="text-indigo-600 font-bold truncate max-w-[180px]">{receiptTxHash}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
            >
              Done & Return to Project
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Toggle Mode: One-time vs Monthly */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/90 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setFundingMode('one-time')}
                className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  fundingMode === 'one-time'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Heart className="h-3.5 w-3.5" />
                <span>One-Time Deposit</span>
              </button>
              <button
                type="button"
                onClick={() => setFundingMode('recurring')}
                className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  fundingMode === 'recurring'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Monthly Escrow</span>
              </button>
            </div>

            {/* Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Select Amount ({displayCurrency})</label>
              <div className="grid grid-cols-5 gap-2 font-mono">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      amount === preset
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {symbol}
                    {preset >= 1000 ? `${preset / 1000}k` : preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Custom Amount ({displayCurrency})</label>
              <div className="relative font-mono">
                <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">{symbol}</span>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 text-slate-900 font-bold text-base pl-8 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 focus:bg-white"
                />
              </div>
              {displayCurrency !== project.currency && (
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  ≈ {formatCurrency(projectCurrencyAmount, project.currency)} (Project native currency)
                </p>
              )}
            </div>

            {/* Payment Gateway Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600">Select Payment Method</label>
              <div className="grid grid-cols-4 gap-2 text-xs font-medium">
                {[
                  { id: 'card', label: 'Card', icon: CreditCard },
                  { id: 'bank', label: 'Bank / USSD', icon: Landmark },
                  { id: 'mobile', label: 'Mobile Money', icon: Smartphone },
                  { id: 'crypto', label: 'USDC Vault', icon: Wallet },
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isActive = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                        isActive
                          ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-[10px]">{pm.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Payment Details Fields */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3 text-xs">
                {paymentMethod === 'card' && (
                  <div className="space-y-2 font-mono">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white text-slate-900 text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white text-slate-900 text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500">CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-white text-slate-900 text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1 font-mono">
                      <div className="text-[10px] text-slate-500">OpenImpact Virtual Account Number:</div>
                      <div className="text-sm font-bold text-indigo-700">9920148301 (Providus / Access Bank)</div>
                      <div className="text-[10px] text-slate-500">Account Name: OpenImpact Escrow Vault #42</div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'mobile' && (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500">Mobile Money Phone Number (M-Pesa / MTN MoMo)</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-white text-slate-900 font-mono text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900"
                    />
                  </div>
                )}

                {paymentMethod === 'crypto' && (
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1 font-mono text-xs">
                    <div className="text-[10px] text-slate-500">Web3 USDC Escrow Address:</div>
                    <div className="text-xs font-bold text-indigo-700 truncate">0x9a83412b1897e049102234125f</div>
                    <div className="text-[10px] text-emerald-600 font-bold">Base Mainnet & Arbitrum Supported</div>
                  </div>
                )}
              </div>
            </div>

            {/* Funder Info */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={funderName}
                  onChange={(e) => setFunderName(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email (For Proof Receipt)</label>
                <input
                  type="email"
                  value={funderEmail}
                  onChange={(e) => setFunderEmail(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900 focus:bg-white"
                />
              </div>
            </div>

            {/* Corporate & Foundation Match Block */}
            <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="corpMatch"
                    checked={enableCorporateMatch}
                    onChange={(e) => setEnableCorporateMatch(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-600 bg-white border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="corpMatch" className="text-xs font-bold text-indigo-900 cursor-pointer flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-indigo-600" />
                    Enable 1:{matchingRatio} Matching Fund
                  </label>
                </div>

                {enableCorporateMatch && (
                  <select
                    value={matchingRatio}
                    onChange={(e) => setMatchingRatio(Number(e.target.value))}
                    className="text-[10px] font-mono font-bold bg-white text-indigo-700 border border-indigo-200 rounded-md px-2 py-0.5 focus:outline-none cursor-pointer"
                  >
                    <option value={1}>1:1 Match</option>
                    <option value={2}>1:2 Match</option>
                    <option value={3}>1:3 Match</option>
                  </select>
                )}
              </div>

              {enableCorporateMatch && (
                <div className="pl-6 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[10px] font-bold text-slate-500 font-mono">
                      Matching Sponsor:
                    </label>
                    <select
                      value={selectedSponsor}
                      onChange={(e) => setSelectedSponsor(e.target.value)}
                      className="text-xs font-semibold bg-white text-slate-900 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none max-w-[220px] truncate cursor-pointer"
                    >
                      {sponsorOptions.map((sponsor) => (
                        <option key={sponsor} value={sponsor}>
                          {sponsor}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-slate-600 text-[11px] font-mono bg-white/90 p-2 rounded-lg border border-indigo-100">
                    <strong className="text-indigo-950 font-bold">{selectedSponsor}</strong> matches your{' '}
                    <span className="font-bold text-indigo-700">{symbol}{amount}</span> with +
                    <span className="font-bold text-emerald-600">{symbol}{amount * matchingRatio}</span>!
                  </p>
                </div>
              )}
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <Lock className="h-4 w-4 animate-spin" />
                  <span>Securing Escrow Vault...</span>
                </>
              ) : (
                <>
                  <span>Confirm & Deposit {symbol}{amount}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

