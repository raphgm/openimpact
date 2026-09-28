import React, { useState } from 'react';
import {
  X,
  Code2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Award,
  Users,
  Layers,
  FileCode
} from 'lucide-react';
import { Collective } from '../types';

interface ReadmeBadgeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  collective?: Collective;
}

export const ReadmeBadgeGeneratorModal: React.FC<ReadmeBadgeGeneratorModalProps> = ({
  isOpen,
  onClose,
  collective,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [badgeTheme, setBadgeTheme] = useState<'flat' | 'plastic' | 'for-the-badge'>('flat');

  if (!isOpen) return null;

  const slug = collective?.slug || 'fastapi';
  const name = collective?.name || 'FastAPI';
  const balance = collective?.balance || 42000;
  const backers = collective?.backersCount || 184;

  const escrowBadgeMd = `[![OpenImpact Escrow](https://img.shields.io/badge/Escrow_Protected-$${balance.toLocaleString()}_Zero_Diversion-10b981?style=${badgeTheme}&logo=github)](https://openimpact.io/collectives/${slug})`;
  const proofBadgeMd = `[![OpenProof Verified](https://img.shields.io/badge/OpenProof_Audited-100%25_Verified-6366f1?style=${badgeTheme}&logo=shield)](https://openimpact.io/collectives/${slug}/proofs)`;
  const backersBadgeMd = `[![OpenImpact Backers](https://img.shields.io/badge/Backers-${backers}_Sustaining-f59e0b?style=${badgeTheme}&logo=heart)](https://openimpact.io/collectives/${slug}/donate)`;

  const sponsorGridMd = `### ✨ Sustaining Sponsors & Backers

Support this project via **[OpenImpact 501(c)(6) Fiscal Escrow](https://openimpact.io/collectives/${slug})**.

<a href="https://openimpact.io/collectives/${slug}"><img src="https://openimpact.io/collectives/${slug}/sponsor-wall.svg?width=800" alt="OpenImpact Sponsors" /></a>`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/45 backdrop-blur-xs overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl bg-[#FDFBF7] border border-[#E5DFD5] rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-900 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#EAE3D2] bg-[#FAF6EE] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-2xs">
              <FileCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>Embeddable GitHub README Badges & Sponsor Wall</span>
              </h3>
              <p className="text-xs text-slate-600">
                Showcase your transparent fiscal escrow and verified proof of work badges on GitHub.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-[#FDFBF7] text-left">
          {/* BADGE THEME PICKER */}
          <div className="flex items-center justify-between bg-[#F4EFEA] p-3 rounded-xl border border-[#E7DFD4]">
            <span className="text-xs font-bold text-slate-800">Shield Badge Style</span>
            <div className="flex space-x-2">
              {(['flat', 'for-the-badge', 'plastic'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setBadgeTheme(style)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    badgeTheme === style
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* BADGE 1: ESCROW PROTECTED */}
          <div className="p-4 bg-white border border-[#E8E2D6] rounded-xl shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">1. "Proof-Before-Payout" Escrow Badge</span>
              </div>
              <button
                onClick={() => copyToClipboard(escrowBadgeMd, 'escrow')}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
              >
                {copiedType === 'escrow' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-600" />}
                <span>{copiedType === 'escrow' ? 'Copied!' : 'Copy Markdown'}</span>
              </button>
            </div>

            {/* Live Preview */}
            <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8E2D6] flex items-center justify-between">
              <div className="inline-flex items-center rounded overflow-hidden text-xs font-mono font-bold shadow-xs">
                <span className="bg-slate-800 text-white px-2.5 py-1 flex items-center gap-1">
                  <span>Escrow Protected</span>
                </span>
                <span className="bg-emerald-600 text-white px-2.5 py-1">
                  ${balance.toLocaleString()} Zero Diversion
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-medium">Live SVG Badge</span>
            </div>

            <pre className="p-2.5 bg-[#1E293B] rounded-lg text-[10px] font-mono text-emerald-400 overflow-x-auto border border-slate-700/50">
              {escrowBadgeMd}
            </pre>
          </div>

          {/* BADGE 2: OPENPROOF AUDITED */}
          <div className="p-4 bg-white border border-[#E8E2D6] rounded-xl shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">2. OpenProof Cryptographic Attestation Badge</span>
              </div>
              <button
                onClick={() => copyToClipboard(proofBadgeMd, 'proof')}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
              >
                {copiedType === 'proof' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-600" />}
                <span>{copiedType === 'proof' ? 'Copied!' : 'Copy Markdown'}</span>
              </button>
            </div>

            {/* Live Preview */}
            <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8E2D6] flex items-center justify-between">
              <div className="inline-flex items-center rounded overflow-hidden text-xs font-mono font-bold shadow-xs">
                <span className="bg-slate-800 text-white px-2.5 py-1">OpenProof Audited</span>
                <span className="bg-indigo-600 text-white px-2.5 py-1">100% Verified Work</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-medium">Live SVG Badge</span>
            </div>

            <pre className="p-2.5 bg-[#1E293B] rounded-lg text-[10px] font-mono text-indigo-300 overflow-x-auto border border-slate-700/50">
              {proofBadgeMd}
            </pre>
          </div>

          {/* SPONSOR WALL MARKDOWN SNIPPET */}
          <div className="p-4 bg-white border border-[#E8E2D6] rounded-xl shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-900">3. Dynamic README Sponsor Wall Grid</span>
              </div>
              <button
                onClick={() => copyToClipboard(sponsorGridMd, 'wall')}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
              >
                {copiedType === 'wall' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-600" />}
                <span>{copiedType === 'wall' ? 'Copied!' : 'Copy Markdown'}</span>
              </button>
            </div>

            <pre className="p-3 bg-[#1E293B] rounded-lg text-[10px] font-mono text-slate-200 overflow-x-auto leading-relaxed border border-slate-700/50">
              {sponsorGridMd}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
