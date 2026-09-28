import React, { useState } from 'react';
import { CheckCircle2, Github, FileCheck, Award, TrendingUp, Users, Target, Sparkles, Shield, Code, GitPullRequest, Calendar, ExternalLink } from 'lucide-react';
import { ModernButton } from './ui/ModernButton';
import { ModernCard } from './ui/ModernCard';

interface ProofExample {
  id: string;
  type: 'github' | 'milestone' | 'contribution';
  title: string;
  description: string;
  verificationLink: string;
  completedDate: string;
  impact: string;
  icon: React.ReactNode;
  verified: boolean;
}

interface ProofOfWorkShowcaseProps {
  onNavigate?: (page: string) => void;
  onOpenAuthModal?: () => void;
}

export const ProofOfWorkShowcase: React.FC<ProofOfWorkShowcaseProps> = ({
  onNavigate,
  onOpenAuthModal,
}) => {
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'github' | 'milestone' | 'contribution'>('all');

  const proofExamples: ProofExample[] = [
    {
      id: 'proof_001',
      type: 'github',
      title: 'Fixed Critical Security Vulnerability',
      description: 'Implemented encryption layer for user data transmission. Audited by 3+ community reviewers.',
      verificationLink: 'https://github.com/openimpact/core/pull/1234',
      completedDate: '2026-08-15',
      impact: 'Secured 50K+ users',
      icon: <Shield className="w-6 h-6" />,
      verified: true,
    },
    {
      id: 'proof_002',
      type: 'milestone',
      title: 'Q2 2026 Funding Milestone',
      description: 'Successfully completed all project milestones for Q2. Delivered dashboard redesign and API optimization.',
      verificationLink: '/verify/milestone-q2-2026',
      completedDate: '2026-06-30',
      impact: '₦500K disbursed',
      icon: <Target className="w-6 h-6" />,
      verified: true,
    },
    {
      id: 'proof_003',
      type: 'contribution',
      title: '200+ Code Contributions',
      description: 'Contributed 237 commits across 12 repositories, averaging 8 commits per week.',
      verificationLink: 'https://github.com/raphgm',
      completedDate: '2026-08-13',
      impact: '237 verified commits',
      icon: <Code className="w-6 h-6" />,
      verified: true,
    },
    {
      id: 'proof_004',
      type: 'github',
      title: 'Implemented Feature: Real-Time Analytics',
      description: 'Built real-time dashboard with WebSocket integration. Performance improved by 60%.',
      verificationLink: 'https://github.com/openimpact/analytics/pull/567',
      completedDate: '2026-08-10',
      impact: '60% faster load times',
      icon: <TrendingUp className="w-6 h-6" />,
      verified: true,
    },
    {
      id: 'proof_005',
      type: 'milestone',
      title: 'Community Training Program',
      description: 'Trained 120+ developers on OpenImpact protocol. Certified 45 maintainers.',
      verificationLink: '/certificates/training-2026',
      completedDate: '2026-07-22',
      impact: '120 developers trained',
      icon: <Users className="w-6 h-6" />,
      verified: true,
    },
    {
      id: 'proof_006',
      type: 'contribution',
      title: 'Mentored Junior Contributors',
      description: 'Mentored 8 junior developers through their first open-source contributions.',
      verificationLink: '/profiles/mentees',
      completedDate: '2026-08-01',
      impact: '8 new contributors onboarded',
      icon: <Award className="w-6 h-6" />,
      verified: true,
    },
  ];

  const filteredProofs = filterType === 'all'
    ? proofExamples
    : proofExamples.filter(p => p.type === filterType);

  const stats = [
    { label: 'Verified Proofs', value: proofExamples.length, icon: <CheckCircle2 className="w-6 h-6" /> },
    { label: 'Trust Score', value: '98%', icon: <Shield className="w-6 h-6" /> },
    { label: 'Community Vouches', value: '42', icon: <Users className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      {/* Fixed background blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold text-sm">Cryptographically Verified Work</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-tight">
              Proof of <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Work</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Every contribution, pull request, and milestone completion is verified on-chain. Build your reputation through transparent proof of work.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <ModernButton variant="primary" size="lg" onClick={() => setFilterType('all')}>
                View All Proofs
              </ModernButton>
              <ModernButton variant="outline" size="lg" onClick={onOpenAuthModal}>
                Generate Your Proof
              </ModernButton>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <ModernCard key={idx} variant="impact" className="p-6 text-center space-y-3 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="flex justify-center text-blue-600">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-2">
                    {stat.label}
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center gap-3 flex-wrap">
            {['all', 'github', 'milestone', 'contribution'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                  filterType === type
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Proof Cards Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProofs.map((proof, idx) => (
              <ModernCard
                key={proof.id}
                variant="glassmorphic"
                className="p-6 space-y-4 cursor-pointer hover:scale-105 transition animate-fade-in card-hover"
                onClick={() => setSelectedProof(selectedProof === proof.id ? null : proof.id)}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        {proof.icon}
                      </div>
                      {proof.verified && (
                        <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {proof.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                  {proof.description}
                </p>

                {/* Metadata */}
                <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(proof.completedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>{proof.impact}</span>
                  </div>
                </div>

                {/* View Button */}
                <button className="w-full py-2 px-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold text-sm rounded-lg transition flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Proof
                </button>

                {/* Expanded Details */}
                {selectedProof === proof.id && (
                  <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50 space-y-3 animate-fade-in">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {proof.description}
                    </p>
                    <div className="flex gap-2">
                      <a
                        href={proof.verificationLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-lg transition"
                      >
                        Verify on-chain →
                      </a>
                    </div>
                  </div>
                )}
              </ModernCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <ModernCard variant="gradient" className="max-w-3xl mx-auto p-12 text-center space-y-6">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white">
            Ready to Build Your Proof?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Start contributing to OpenImpact projects and build your cryptographically verified portfolio.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ModernButton variant="primary" size="lg" onClick={onOpenAuthModal}>
              Get Started
            </ModernButton>
            <ModernButton variant="outline" size="lg" onClick={() => onNavigate?.('projects')}>
              Explore Projects
            </ModernButton>
          </div>
        </ModernCard>
      </section>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};
