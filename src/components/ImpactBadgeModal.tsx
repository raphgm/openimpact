import React from 'react';
import { ImpactBadge } from '../types';
import { getBadgeLevelBadgeStyle } from '../utils/badgeEngine';
import {
  Award,
  ShieldCheck,
  GitPullRequest,
  FileCheck,
  Heart,
  Sparkles,
  X,
  ExternalLink,
  CheckCircle2,
  Calendar,
  UserCheck,
  Building2,
  Lock
} from 'lucide-react';

interface ImpactBadgeModalProps {
  badge: ImpactBadge | null;
  onClose: () => void;
  onViewEvidence?: (evidenceId: string) => void;
}

export const ImpactBadgeModal: React.FC<ImpactBadgeModalProps> = ({
  badge,
  onClose,
  onViewEvidence,
}) => {
  if (!badge) return null;

  const style = getBadgeLevelBadgeStyle(badge.level);

  const getIcon = () => {
    switch (badge.icon) {
      case 'GitPullRequest':
        return <GitPullRequest className="h-8 w-8" />;
      case 'FileCheck':
        return <FileCheck className="h-8 w-8" />;
      case 'Heart':
        return <Heart className="h-8 w-8" />;
      case 'ShieldCheck':
        return <ShieldCheck className="h-8 w-8" />;
      case 'Sparkles':
        return <Sparkles className="h-8 w-8" />;
      case 'Award':
      default:
        return <Award className="h-8 w-8" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-slate-900 relative space-y-5 text-left max-h-[calc(100dvh-2rem)] overflow-y-auto my-auto">
        
        {/* Background Decorative Banner */}
        <div className={`h-24 -mx-6 -mt-6 bg-gradient-to-r ${style.gradient} p-4 text-white relative flex items-center justify-between`}>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-wider">
              {badge.level} Credibility Badge
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition cursor-pointer text-sm font-bold"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Badge Icon Header */}
        <div className="flex items-start justify-between -mt-10 relative z-10">
          <div className={`w-16 h-16 rounded-2xl ${style.bg} ${style.border} border-2 flex items-center justify-center text-slate-900 shadow-lg ${style.glow}`}>
            {getIcon()}
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Badge Category</span>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 uppercase font-mono">
              {badge.category}
            </span>
          </div>
        </div>

        {/* Badge Name & Description */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-black text-slate-900">{badge.name}</h3>
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {badge.description}
          </p>
        </div>

        {/* Audit Details Ledger Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-3 text-xs">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5">
            Cryptographic Audit Details
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center space-x-1">
                <UserCheck className="h-3.5 w-3.5 text-indigo-600" />
                <span>Audited & Verified By:</span>
              </span>
              <span className="font-bold text-slate-900 font-mono">{badge.verifier}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                <span>Award Date:</span>
              </span>
              <span className="font-bold text-slate-800 font-mono">{badge.awardedAt}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 flex items-center space-x-1">
                <Lock className="h-3.5 w-3.5 text-emerald-600" />
                <span>Verification Criteria:</span>
              </span>
              <span className="font-bold text-emerald-700 font-mono">{badge.criteriaMet}</span>
            </div>

            {badge.evidenceTitle && (
              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <span className="text-slate-500">Linked Proof Artifact:</span>
                <span className="font-bold text-indigo-600 truncate max-w-[200px]">{badge.evidenceTitle}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex items-center gap-3">
          {badge.evidenceId && onViewEvidence ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewEvidence(badge.evidenceId!);
              }}
              className="flex-1 py-3 px-4 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Inspect Linked Evidence</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Close Badge Details
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
