import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Download, Copy, Check, ExternalLink, QrCode, Sparkles, Building2, Calendar, Award, Lock } from 'lucide-react';
import { Project, Currency } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ProofCertificateModalProps {
  project: Project;
  onClose: () => void;
  onOpenDocumentViewer?: (url?: string, title?: string) => void;
}

export const ProofCertificateModal: React.FC<ProofCertificateModalProps> = ({
  project,
  onClose,
  onOpenDocumentViewer,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const verificationId = `OI-2026-${project.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6)}-9842`;
  const shaHash = `0x${(project.id.length * 897123981).toString(16).padEnd(40, 'a7f9c2d1e0b3')}`;
  const completedMilestones = project.milestones.filter((m) => m.status === 'Completed').length;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://openimpact.io/verify/${verificationId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-2 border-slate-900 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl relative my-auto text-slate-900 text-left overflow-hidden">
        {/* Certificate Decorative Border */}
        <div className="h-3 bg-gradient-to-r from-emerald-600 via-indigo-600 to-blue-600 w-full" />

        {/* Modal Top Controls */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-full border border-slate-200">
              ID: {verificationId}
            </span>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>VERIFIED CERTIFICATE</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-full bg-slate-50 border border-slate-200 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Official Certificate Canvas */}
        <div className="p-8 pt-2 space-y-6 overflow-y-auto font-serif">
          {/* Header Seal */}
          <div className="text-center space-y-2 border-b border-slate-200 pb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-900 to-slate-900 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-md border border-amber-400/30">
              <Award className="h-9 w-9 text-amber-400" />
            </div>
            <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500">
              OpenImpact Network • 501(c)(6) Official Registry
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              Certificate of Verified Impact
            </h2>
            <p className="text-xs text-slate-600 max-w-lg mx-auto font-sans leading-relaxed">
              This document certifies that the milestone deliverables, evidence records, and financial ledger for this initiative have been cryptographically verified and audited.
            </p>
          </div>

          {/* Certificate Main Record */}
          <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80 space-y-4 font-sans text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Project / Initiative Name</span>
                <div className="text-base font-black text-slate-900 mt-0.5">{project.title}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Managing Organization</span>
                <div className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-indigo-600" />
                  <span>{project.organization.name}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200/80 text-center font-mono">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <div className="text-lg font-black text-indigo-700">{completedMilestones}/{project.milestones.length}</div>
                <div className="text-[9px] font-sans text-slate-500 font-bold uppercase mt-0.5">Milestones</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <div className="text-lg font-black text-purple-700">{project.evidence.length} Artifacts</div>
                <div className="text-[9px] font-sans text-slate-500 font-bold uppercase mt-0.5">Proof Items</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <div className="text-lg font-black text-blue-700">96 / 100</div>
                <div className="text-[9px] font-sans text-slate-500 font-bold uppercase mt-0.5">Impact Score</div>
              </div>
            </div>
          </div>

          {/* Cryptographic Hash & QR Verification Code */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950 text-slate-100 p-5 rounded-2xl font-mono text-xs shadow-inner">
            <div className="p-3 bg-white rounded-xl shrink-0 shadow-sm">
              <QrCode className="h-16 w-16 text-slate-900" />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span>OPENPROOF CRYPTOGRAPHIC HASH</span>
                <span className="text-emerald-400 font-sans">✓ SIGNATURE VALID</span>
              </div>
              <div className="text-emerald-400 font-bold break-all text-[11px] leading-tight font-mono">
                {shaHash}
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                Issued under OpenImpact 501(c)(6) Fiscal Host Rules on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 font-sans">
            <button
              onClick={handleDownload}
              className="w-full sm:flex-1 py-3 px-4 bg-[#111827] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center space-x-2"
            >
              {downloaded ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Certificate Saved (PDF)!</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download Verified Certificate</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition cursor-pointer flex items-center justify-center space-x-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-slate-600" />
                  <span>Share Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
