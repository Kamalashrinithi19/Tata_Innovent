import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { WEEKLY_COST_DATA, VARIANCE_TREND, WATER_USAGE, PLANTS } from '../../data/mock';
import { PageHeader, Card, KpiCard } from '../../components/shared/ui';

export default function Reports() {
  const [plantFilter, setPlantFilter] = useState('all');

  const totalSavings = WEEKLY_COST_DATA.reduce((s, w) => s + w.savings, 0);
  const avgManual    = (VARIANCE_TREND.reduce((s, w) => s + w.manual, 0) / VARIANCE_TREND.length).toFixed(1);
  const avgLidar     = (VARIANCE_TREND.reduce((s, w) => s + w.lidar,  0) / VARIANCE_TREND.length).toFixed(1);
  const waterSaved   = WATER_USAGE.reduce((s, w) => s + (w.fixed - w.smart), 0);

  const TOOLTIP_STYLE = { fontSize: 12, border: '1px solid #E4E7EB', borderRadius: 4 };

  return (
    <div>
      <PageHeader title="Reports & Analytics" subtitle="8-week operational summary — cost, variance, and environmental KPIs"
        breadcrumbs={[{label:'Home',href:'/'},{label:'Reports & Analytics'}]}
        actions={
          <select value={plantFilter} onChange={(e)=>setPlantFilter(e.target.value)}
            className="text-sm border border-app-border rounded px-2 py-1.5 bg-white text-app-text outline-none focus:border-app-primary">
            <option value="all">All Plants & Ports</option>
            {PLANTS.map((p)=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        }
      />
      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard label="Total Cost Savings (8w)" value={`₹${totalSavings.toLocaleString('en-IN')}K`} trend="AI vs manual baseline" trendDown />
          <KpiCard label="Avg Variance (Manual)"    value={avgManual}   unit="%" trend="10× higher than LiDAR" />
          <KpiCard label="Avg Variance (LiDAR)"     value={avgLidar}    unit="%" trend="98% accuracy improvement" trendDown />
          <KpiCard label="Water Saved (8w)"          value={`${waterSaved.toLocaleString('en-IN')}L`} trend="vs fixed-schedule" trendDown />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-0.5">Landed Cost Trend (₹K/week)</h3>
            <p className="text-xs text-app-muted mb-4">AI-Optimized vs Manual Baseline</p>
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={WEEKLY_COST_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EB" />
                <XAxis dataKey="week" tick={{fontSize:11,fill:'#5B6B79'}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize:11,fill:'#5B6B79'}} tickLine={false} axisLine={false} domain={[3800,5500]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{fontSize:11}} />
                <Line type="monotone" dataKey="manual" stroke="#94A3B8" strokeWidth={2} dot={{r:3}} name="Manual" strokeDasharray="4 2" />
                <Line type="monotone" dataKey="ai"     stroke="#0B5FA5" strokeWidth={2} dot={{r:3}} name="AI-Optimized" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-0.5">Stock Variance Trend (%)</h3>
            <p className="text-xs text-app-muted mb-4">Manual Tape vs LiDAR Drone Scan</p>
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={VARIANCE_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EB" />
                <XAxis dataKey="week" tick={{fontSize:11,fill:'#5B6B79'}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize:11,fill:'#5B6B79'}} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{fontSize:11}} />
                <ReferenceLine y={2} stroke="#1E7B45" strokeDasharray="4 2" label={{value:'2% target',fill:'#1E7B45',fontSize:10,position:'insideTopRight'}} />
                <Line type="monotone" dataKey="manual" stroke="#B8720A" strokeWidth={2} dot={{r:3}} name="Manual Tape" />
                <Line type="monotone" dataKey="lidar"  stroke="#1E7B45" strokeWidth={2} dot={{r:3}} name="LiDAR Scan" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-0.5">Weekly Savings (₹K)</h3>
            <p className="text-xs text-app-muted mb-4">Freight + demurrage avoided by AI allocation</p>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={WEEKLY_COST_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EB" />
                <XAxis dataKey="week" tick={{fontSize:11,fill:'#5B6B79'}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize:11,fill:'#5B6B79'}} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="savings" fill="#1E7B45" radius={[3,3,0,0]} name="Savings (₹K)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-0.5">Sprinkler Water Usage (L/week)</h3>
            <p className="text-xs text-app-muted mb-4">Smart sensor-based vs fixed-schedule baseline</p>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={WATER_USAGE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EB" />
                <XAxis dataKey="week" tick={{fontSize:11,fill:'#5B6B79'}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize:11,fill:'#5B6B79'}} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{fontSize:11}} />
                <Bar dataKey="fixed" fill="#CBD5E1" radius={[3,3,0,0]} name="Fixed Schedule" />
                <Bar dataKey="smart" fill="#0B5FA5" radius={[3,3,0,0]} name="Smart (Sensor)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}
