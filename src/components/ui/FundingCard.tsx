import React from 'react';
import { ModernCard } from './ModernCard';
import { Heart, Users, Target } from 'lucide-react';

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

interface FundingCardProps {
  projectTitle: string;
  description: string;
  fundedAmount: number;
  targetAmount: number;
  currency: string;
  supportersCount: number;
  daysRemaining?: number;
  image?: string;
  onClick?: () => void;
}

export const FundingCard: React.FC<FundingCardProps> = ({
  projectTitle,
  description,
  fundedAmount,
  targetAmount,
  currency,
  supportersCount,
  daysRemaining,
  image,
  onClick,
}) => {
  const fundingPercentage = (fundedAmount / targetAmount) * 100;
  const isFullyFunded = fundingPercentage >= 100;

  return (
    <ModernCard
      variant="elevated"
      className="overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {/* Image */}
      {image && (
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-400 to-emerald-400">
          <img
            src={image}
            alt={projectTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isFullyFunded && (
            <div className="absolute inset-0 bg-emerald-600/20 flex items-center justify-center">
              <span className="bg-emerald-600 text-white px-4 py-2 rounded-full font-bold text-sm">
                Fully Funded
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {projectTitle}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
          {description}
        </p>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-emerald-600 transition-all duration-500"
              style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>{fundingPercentage.toFixed(0)}% funded</span>
            <span>{currency} {(fundedAmount || 0).toLocaleString()} / {currency} {(targetAmount || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
            <Users className="w-4 h-4" />
            <span>{supportersCount} supporters</span>
          </div>
          {daysRemaining && (
            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
              <Target className="w-4 h-4" />
              <span>{daysRemaining} days left</span>
            </div>
          )}
        </div>
      </div>
    </ModernCard>
  );
};
