import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { STOCKYARDS } from '../../data/mock';
import { StatusBadge, PageHeader, Card, MessageStrip } from '../../components/shared/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Stockyard() {
  const [selected, setSelected] = useState(STOCKYARDS[0].id);
  const yard = STOCKYARDS.find((s) => s.id === selected) ?? STOCKYARDS[0];
  const lowStock = yard.grades.filter((g) => (g.lidar_mt / g.target_mt) < 0.85);

  const chartData = yard.grades.map((g) => ({
    name: g.grade.replace(' ', '\n'),
    Manual: Math.round(g.manual_mt / 1000),
    LiDAR:  Math.round(g.lidar_mt  / 1000),
    Target: Math.round(g.target_mt / 1000),
  }));

  return (
    <div>
      <PageHeader title="Stockyard & Inventory" subtitle="Grade-wise stock, LiDAR vs manual variance, scan history"
        breadcrumbs={[{label:'Home',href:'/'},{label:'Stockyard & Inventory'}]} />
      {lowStock.length > 0 && (
        <div className="px-5 pt-3">
          <MessageStrip severity="warning"
            message={`Replenishment alert — ${yard.plant}: ${lowStock.map((g)=>g.grade).join(', ')} below 85% target`} />
        </div>
      )}
      <div className="flex flex-col lg:flex-row p-5 gap-4 min-h-0">
        {/* Left: plant list */}
        <div className="lg:w-52 shrink-0">
          <Card className="overflow-hidden">
            <div className="px-3 py-2 border-b border-app-border bg-app-bg">
              <p className="text-xs font-semibold text-app-muted uppercase tracking-wide">Steel Plants</p>
            </div>
            {STOCKYARDS.map((sy) => {
              const hasAlert = sy.grades.some((g) => (g.lidar_mt / g.target_mt) < 0.85);
              return (
                <button key={sy.id} onClick={() => setSelected(sy.id)}
                  className={`w-full text-left px-3 py-3 border-b border-app-border/60 last:border-0 transition-colors ${sy.id===selected?'bg-app-primary-light border-l-2 border-l-app-primary pl-2.5':'hover:bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-app-text">{sy.plant}</p>
                    {hasAlert && <AlertTriangle size={11} className="text-status-warning" />}
                  </div>
                  <p className="text-xs text-app-muted">{sy.utilization_pct}% utilized</p>
                </button>
              );
            })}
          </Card>
        </div>

        {/* Right: detail */}
        <div className="flex-1 min-w-0 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-app-text">{yard.plant} Stockyard</h2>
            <p className="text-xs text-app-muted">{yard.totalArea_sqm.toLocaleString('en-IN')} m² · {yard.utilization_pct}% utilized</p>
          </div>

          <Card className="overflow-hidden">
            <div className="px-4 py-3 border-b border-app-border">
              <h3 className="text-sm font-semibold">Grade-wise Stock (MT)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-app-bg border-b border-app-border">
                  {['Grade','Manual Tape','LiDAR Scan','Variance MT','Variance %','vs Target','Last Scan'].map((h)=>(
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {yard.grades.map((g) => {
                    const diff   = g.manual_mt - g.lidar_mt;
                    const diffPct= ((diff / g.manual_mt) * 100).toFixed(1);
                    const tgtPct = Math.round((g.lidar_mt / g.target_mt) * 100);
                    return (
                      <tr key={g.gradeId} className="border-b border-app-border/50 last:border-0 hover:bg-gray-50/50">
                        <td className="px-3 py-2.5 font-medium">{g.grade}</td>
                        <td className="px-3 py-2.5 font-mono">{g.manual_mt.toLocaleString('en-IN')}</td>
                        <td className="px-3 py-2.5 font-mono text-app-primary font-semibold">{g.lidar_mt.toLocaleString('en-IN')}</td>
                        <td className="px-3 py-2.5 font-mono text-status-warning">{diff > 0 ? '+' : ''}{diff.toLocaleString('en-IN')}</td>
                        <td className="px-3 py-2.5 font-mono text-status-warning">{diffPct}%</td>
                        <td className="px-3 py-2.5"><StatusBadge label={`${tgtPct}%`} severity={tgtPct < 85 ? 'warning' : 'success'} /></td>
                        <td className="px-3 py-2.5 font-mono text-xs text-app-muted">{g.lastScan}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Stock Comparison (MT × 1,000)</h3>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={chartData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5B6B79' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#5B6B79' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #E4E7EB', borderRadius: 4 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Manual" fill="#CBD5E1" radius={[2,2,0,0]} />
                <Bar dataKey="LiDAR"  fill="#0B5FA5" radius={[2,2,0,0]} />
                <Bar dataKey="Target" fill="#1E7B45" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="overflow-hidden">
            <div className="px-4 py-3 border-b border-app-border"><h3 className="text-sm font-semibold">Scan History</h3></div>
            <table className="w-full text-sm">
              <thead><tr className="bg-app-bg border-b border-app-border">
                {['Timestamp','Method','Total (MT)','Variance'].map((h)=>(
                  <th key={h} className={`px-3 py-2 text-xs font-semibold text-app-muted uppercase tracking-wide ${h==='Total (MT)'||h==='Variance'?'text-right':'text-left'}`}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {yard.scanHistory.map((s, i) => (
                  <tr key={i} className="border-b border-app-border/50 last:border-0">
                    <td className="px-3 py-2.5 font-mono text-xs">{s.time}</td>
                    <td className="px-3 py-2.5"><StatusBadge label={s.method} severity={s.method.includes('LiDAR')?'success':'warning'} /></td>
                    <td className="px-3 py-2.5 text-right font-mono">{s.total_mt.toLocaleString('en-IN')}</td>
                    <td className={`px-3 py-2.5 text-right font-mono font-semibold ${s.variance_pct>5?'text-status-warning':'text-status-success'}`}>{s.variance_pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
}
