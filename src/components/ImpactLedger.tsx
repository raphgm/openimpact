import React from 'react';
import { Project, Milestone } from '../types';
import { CheckCircle2, Clock, Target, FileText, Award, ShieldCheck, Flag } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface ImpactLedgerProps {
  project: Project;
}

export const ImpactLedger: React.FC<ImpactLedgerProps> = ({ project }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'In progress': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Pending': return 'text-slate-600 bg-slate-50 border-slate-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case 'In progress': return <Clock className="h-4 w-4 text-amber-600" />;
      case 'Pending': return <Target className="h-4 w-4 text-slate-500" />;
      default: return <Target className="h-4 w-4 text-slate-500" />;
    }
  };

  const getVerificationStatusLabel = (status: string) => {
    switch (status) {
      case 'Completed': return 'Verified';
      case 'In progress': return 'Verification Pending';
      case 'Pending': return 'Not Started';
      default: return 'Not Started';
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-8 shadow-sm text-left">
      <div className="space-y-2 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Project Timeline & Impact Milestones</h2>
        <p className="text-sm text-slate-500 font-medium">Track commitments, deliverables, evidence, verification, and outcomes throughout the project.</p>
      </div>

      <div className="space-y-6">
        {project.milestones.map((m, idx) => (
          <div key={m.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl border ${getStatusColor(m.status)}`}>
                  {getStatusIcon(m.status)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{m.title}</h3>
                  <div className="text-xs text-slate-500 font-medium mt-1">Due: {m.deadline}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-lg text-[11px] font-bold border ${getStatusColor(m.status)}`}>
                  {getVerificationStatusLabel(m.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <div className="text-slate-500 font-bold mb-1">Budget Allocation</div>
                <div className="font-mono font-bold text-slate-900">{formatCurrency(m.budget, project.currency)}</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 col-span-2">
                <div className="text-slate-500 font-bold mb-1">Commitment</div>
                <div className="text-slate-700 font-medium leading-relaxed">{m.deliverables}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <FileText className="h-4 w-4" /> <span>{m.status === 'Completed' ? '4' : '0'} Evidence items verified</span>
              </div>
              {m.status !== 'Completed' && (
                <button className="text-xs font-bold text-indigo-700 bg-white px-4 py-2 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition cursor-pointer flex items-center gap-1.5">
                  <Flag className="h-3.5 w-3.5" /> Submit Evidence
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
