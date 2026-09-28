import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, AlertCircle, Briefcase, Layers } from 'lucide-react';
import { Project, Opportunity } from '../types';

interface AiAdvisorModalProps {
  projects: Project[];
  opportunities: Opportunity[];
  onClose: () => void;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  projects,
  opportunities,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'match' | 'project_review'>('match');
  const [userSkills, setUserSkills] = useState('Terraform, Azure, Kubernetes, React, TypeScript');
  const [matchResults, setMatchResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMatchOpportunities = async () => {
    setIsLoading(true);
    try {
      const skillsArray = userSkills.split(',').map((s) => s.trim());
      const res = await fetch('/api/ai/match-opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userSkills: skillsArray,
          opportunities,
        }),
      });
      const data = await res.json();
      setMatchResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl text-slate-900 relative space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">OpenImpact AI Assistant</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('match')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              activeTab === 'match' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Skill & Opportunity Matcher
          </button>
        </div>

        {activeTab === 'match' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enter Your Technical Skills (comma separated)
              </label>
              <input
                type="text"
                value={userSkills}
                onChange={(e) => setUserSkills(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>

            <button
              onClick={handleMatchOpportunities}
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-indigo-600/20 transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Matching Opportunities...' : 'Find Best Matching Bounties'}
            </button>

            {matchResults?.matches && (
              <div className="space-y-2 pt-2 border-t border-slate-100 max-h-60 overflow-y-auto">
                <h4 className="text-xs font-bold text-indigo-700">Recommended Matches:</h4>
                {matchResults.matches.map((m: any, idx: number) => {
                  const opp = opportunities.find((o) => o.id === m.opportunityId);
                  return (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{opp?.title || m.opportunityId}</span>
                        <span className="text-indigo-600 font-mono">{m.matchScore}% Match</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{m.reasoning}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
