import React, { useState, useEffect } from 'react';
import { TrendingUp, Info } from 'lucide-react';

interface SustainabilityForecastProps {
  projectId: string;
}

export const SustainabilityForecast: React.FC<SustainabilityForecastProps> = ({ projectId }) => {
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ai/forecast-sustainability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setForecast(data);
        setLoading(false);
      });
  }, [projectId]);

  if (loading) return <div className="text-xs text-slate-500 italic">Analyzing financial sustainability...</div>;

  return (
    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
      <div className="flex items-center gap-2 text-emerald-800">
        <TrendingUp className="h-4 w-4" />
        <h4 className="font-bold text-sm">Sustainability Forecast</h4>
      </div>
      <p className="text-xs text-emerald-900 leading-relaxed">
        {forecast?.assessment || 'Project is currently sustainable with a 6-month runway based on current burn rate and backer velocity.'}
      </p>
      <div className="text-[11px] text-emerald-700 font-medium">
        Estimated Runway: <span className="font-bold">{forecast?.runwayMonths || 6} months</span>
      </div>
    </div>
  );
};
