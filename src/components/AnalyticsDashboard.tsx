import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Activity, BarChart3, PieChart, Calendar, Filter, Download, Share2, Sparkles } from 'lucide-react';
import { ModernCard } from './ui/ModernCard';
import { ModernButton } from './ui/ModernButton';
import { Project } from '../types';

interface Metric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

interface ChartDataPoint {
  month: string;
  value: number;
  target: number;
}

interface AnalyticsDashboardProps {
  onNavigate?: (page: string) => void;
  projects?: Project[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onNavigate, projects = [] }) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationProgress(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const dynamicActivities = useMemo(() => {
    const list: { time: string; action: string; user: string }[] = [];
    projects.forEach((p) => {
      if (p.raised > 0) {
        list.push({
          time: 'Recently',
          action: `$${p.raised.toLocaleString()} funded to ${p.title}`,
          user: p.organization.name,
        });
      }
      (p.milestones || []).forEach((m) => {
        if (m.status === 'Completed') {
          list.push({
            time: m.deadline || 'Recently',
            action: `Milestone completed: ${m.title}`,
            user: p.title,
          });
        }
      });
      (p.evidence || []).forEach((e) => {
        list.push({
          time: e.submittedAt || 'Recently',
          action: `Proof verified: ${e.title}`,
          user: e.submittedBy || 'Auditor',
        });
      });
    });
    if (list.length === 0) {
      return [
        { time: 'Just now', action: 'Platform initialized with verified public goods', user: 'System' },
      ];
    }
    return list.slice(0, 6);
  }, [projects]);

  const metrics: Metric[] = [
    {
      label: 'Total Funded',
      value: '$4.8M',
      change: 24,
      trend: 'up',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-blue-600 to-blue-700',
    },
    {
      label: 'Active Projects',
      value: '248',
      change: 12,
      trend: 'up',
      icon: <Target className="w-6 h-6" />,
      color: 'from-emerald-600 to-emerald-700',
    },
    {
      label: 'Contributors',
      value: '8,234',
      change: 42,
      trend: 'up',
      icon: <Users className="w-6 h-6" />,
      color: 'from-purple-600 to-purple-700',
    },
    {
      label: 'Avg Fund Speed',
      value: '2.4d',
      change: 18,
      trend: 'down',
      icon: <Activity className="w-6 h-6" />,
      color: 'from-orange-600 to-orange-700',
    },
  ];

  const chartData: ChartDataPoint[] = [
    { month: 'Jan', value: 65, target: 60 },
    { month: 'Feb', value: 78, target: 70 },
    { month: 'Mar', value: 82, target: 75 },
    { month: 'Apr', value: 91, target: 80 },
    { month: 'May', value: 85, target: 85 },
    { month: 'Jun', value: 92, target: 90 },
  ];

  const maxValue = Math.max(...chartData.map(d => Math.max(d.value, d.target)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">Live Analytics</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                Impact Dashboard
              </h1>
            </div>

            <div className="flex gap-2">
              <ModernButton variant="outline" size="md" icon={<Download className="w-4 h-4" />}>
                Export
              </ModernButton>
              <ModernButton variant="outline" size="md" icon={<Share2 className="w-4 h-4" />}>
                Share
              </ModernButton>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map(period => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  timeframe === period
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, idx) => (
            <ModernCard
              key={idx}
              variant="elevated"
              className="p-6 space-y-4 animate-fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 bg-gradient-to-br ${metric.color} rounded-lg text-white shadow-lg`}>
                  {metric.icon}
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                  metric.trend === 'up'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {metric.change}%
                </div>
              </div>

              <div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">
                  {metric.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {metric.label}
                </div>
              </div>

              {/* Animated Mini Chart */}
              <div className="h-12 flex items-end gap-1 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                {[...Array(6)].map((_, i) => {
                  const height = Math.sin(i * 0.5 + animationProgress * 0.02) * 30 + 40;
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-t bg-gradient-to-t ${metric.color} opacity-60 transition-all`}
                      style={{ height: `${height}%` }}
                    />
                  );
                })}
              </div>
            </ModernCard>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Funding Progress Chart */}
        <ModernCard
          variant="glassmorphic"
          className="lg:col-span-2 p-8 space-y-6 animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Funding Progress</h3>
            <div className="flex gap-3 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700" />
                <span className="text-slate-600 dark:text-slate-400">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-slate-300 to-slate-400" />
                <span className="text-slate-600 dark:text-slate-400">Target</span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="h-64 flex items-end gap-4">
            {chartData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative w-full h-48 flex items-end gap-1">
                  {/* Target bar */}
                  <div
                    className="flex-1 bg-gradient-to-t from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-600 rounded-t opacity-40"
                    style={{ height: `${(data.target / maxValue) * 100}%` }}
                  />
                  {/* Actual bar with animation */}
                  <div
                    className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 dark:from-blue-600 dark:to-blue-500 rounded-t transition-all duration-300 hover:shadow-lg"
                    style={{ height: `${(data.value / maxValue) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {data.month}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              📈 Trending up: 12% increase in funding velocity this month
            </p>
          </div>
        </ModernCard>

        {/* Distribution Pie Chart */}
        <ModernCard
          variant="glassmorphic"
          className="p-8 space-y-6 animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Category Distribution</h3>
          </div>

          {/* Pie Chart Visualization */}
          <div className="flex justify-center items-center py-6">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Pie segments with rotation animation */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#grad1)"
                  strokeWidth="15"
                  strokeDasharray="70.7 282.8"
                  strokeDashoffset="0"
                  style={{ animation: 'rotate 20s linear infinite' }}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#grad2)"
                  strokeWidth="15"
                  strokeDasharray="56.5 282.8"
                  strokeDashoffset="-70.7"
                  style={{ animation: 'rotate 20s linear infinite' }}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#grad3)"
                  strokeWidth="15"
                  strokeDasharray="42.4 282.8"
                  strokeDashoffset="-127.2"
                  style={{ animation: 'rotate 20s linear infinite' }}
                />
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1e40af" />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                  <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6d28d9" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700" />
              <span className="text-slate-600 dark:text-slate-400">Tech: 25%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700" />
              <span className="text-slate-600 dark:text-slate-400">Social: 20%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-700" />
              <span className="text-slate-600 dark:text-slate-400">Health: 15%</span>
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Recent Activity */}
      <div className="max-w-7xl mx-auto">
        <ModernCard
          variant="glassmorphic"
          className="p-8 space-y-6 animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h3>
          </div>

          <div className="space-y-3">
            {dynamicActivities.map((activity, idx) => (
              <div key={idx} className="flex gap-4 pb-3 border-b border-slate-200/50 dark:border-slate-700/50 last:border-b-0">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {activity.action}
                  </p>
                  <div className="flex gap-3 mt-1 text-xs text-slate-500 dark:text-slate-500">
                    <span>{activity.time}</span>
                    <span>•</span>
                    <span>{activity.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ModernCard>
      </div>

      <style>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
