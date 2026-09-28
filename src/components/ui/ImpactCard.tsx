import React from 'react';
import { ModernCard } from './ModernCard';
import { TrendingUp } from 'lucide-react';

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

interface ImpactCardProps {
  title: string;
  metric: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: { value: number; direction: 'up' | 'down' };
  description?: string;
  backgroundColor?: string;
}

export const ImpactCard: React.FC<ImpactCardProps> = ({
  title,
  metric,
  value,
  icon,
  trend,
  description,
  backgroundColor = 'from-blue-50 to-emerald-50',
}) => {
  return (
    <ModernCard variant="impact" className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {title}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
            {metric}
          </p>
        </div>
        {icon && (
          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          {value}
        </div>
        {description && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      {trend && (
        <div className={cn(
          'flex items-center gap-1 text-sm font-semibold',
          trend.direction === 'up'
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-red-600 dark:text-red-400'
        )}>
          <TrendingUp className={cn("w-4 h-4", trend.direction === 'down' && 'rotate-180')} />
          <span>{Math.abs(trend.value)}% this month</span>
        </div>
      )}
    </ModernCard>
  );
};
