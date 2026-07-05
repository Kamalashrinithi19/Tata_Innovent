import React, { useState } from 'react';
import { Brain, Play, ArrowRight, TrendingDown, Info } from 'lucide-react';
import { PageHeader, Card, Btn, MessageStrip, Spinner } from '../../components/shared/ui';

interface Alloc { vessel: string; grade: string; port: string; plant: string; rakes: number; freight: number; demurrage: number; total: number; explanation: string; }

function makeAllocs(congestion: number, rakeShortage: number, ai: boolean): Alloc[] {
  return [
    { vessel:'MV Coral Star',   grade:'Premium HCC', port:'Paradip', plant:'Jamshedpur',
      rakes:8, freight:1820, demurrage:ai?0:180, total:ai?1820:2000,
      explanation:`Paradip chosen over Vizag — ₹4.2L lower freight despite 1-day longer transit.` },
    { vessel:'MV Iron Pegasus', grade:'Std HCC',     port:'Vizag',   plant:ai?'Durgapur':'Bhilai',
      rakes:7, freight:ai?1640+congestion*40:2100+congestion*60, demurrage:ai?congestion*20:congestion*80,
      total:ai?1640+congestion*60:2100+congestion*140,
      explanation:`Durgapur allocated over Bhilai — shorter rake haul saves ₹${Math.round(congestion*80+120)}K in rail freight.` },
    { vessel:'MV Atlas Pioneer',grade:'PCI Coal',    port:'Ennore',  plant:ai?'Rourkela':'Jamshedpur',
      rakes:9, freight:ai?1710:2240+rakeShortage*30, demurrage:ai?0:rakeShortage*50,
      total:ai?1710:2240+rakeShortage*80,
      explanation:`Rourkela prioritized — PCI Coal stockpile at 82% of target, prevents furnace supply risk.` },
    { vessel:'MV Orient Majesty',grade:'SSCC',       port:'Haldia',  plant:'Durgapur',
      rakes:6, freight:ai?1580:1980+rakeShortage*20, demurrage:ai?0:rakeShortage*40,
      total:ai?1580:1980+rakeShortage*60,
      explanation:`Haldia→Durgapur is shortest haul for SSCC. LiDAR shows Durgapur yard has capacity.` },
  ];
}

export default function Optimizer() {
  const [congestion,   setCongestion]   = useState(2);
  const [rakeShortage, setRakeShortage] = useState(15);
  const [aiMode,       setAiMode]       = useState(true);
  const [running,      setRunning]      = useState(false);
  const [ran,          setRan]          = useState(false);
  const [allocs,       setAllocs]       = useState<Alloc[]>(() => makeAllocs(2, 15, true));

  const run = () => {
    setRunning(true); setRan(false);
    setTimeout(() => { setAllocs(makeAllocs(congestion, rakeShortage, aiMode)); setRunning(false); setRan(true); }, 1400);
  };

  const aiAllocs     = makeAllocs(congestion, rakeShortage, true);
  const manualAllocs = makeAllocs(congestion, rakeShortage, false);
  const aiTotal      = aiAllocs.reduce((s, a) => s + a.total, 0);
  const manualTotal  = manualAllocs.reduce((s, a) => s + a.total, 0);
  const savings      = manualTotal - aiTotal;

  return (
    <div>
      <PageHeader
        title="AI Port-Plant Optimizer"
        subtitle="MILP-based vessel-port-plant allocation for lowest landed cost"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'AI Optimizer' }]}
      />
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Left — inputs */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Brain size={14} className="text-app-primary" />
                <h3 className="text-sm font-semibold">Scenario Inputs</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-app-muted block mb-1">
                    Port Congestion: <span className="font-mono font-semibold text-app-text">{congestion} days</span>
                  </label>
                  <input type="range" min={0} max={7} value={congestion} onChange={(e) => setCongestion(+e.target.value)}
                    className="w-full accent-app-primary" />
                  <div className="flex justify-between text-xs text-app-muted mt-0.5"><span>0</span><span>7d</span></div>
                </div>
                <div>
                  <label className="text-xs text-app-muted block mb-1">
                    Rake Shortage: <span className="font-mono font-semibold text-app-text">{rakeShortage}%</span>
                  </label>
                  <input type="range" min={0} max={50} value={rakeShortage} onChange={(e) => setRakeShortage(+e.target.value)}
                    className="w-full accent-app-primary" />
                  <div className="flex justify-between text-xs text-app-muted mt-0.5"><span>0%</span><span>50%</span></div>
                </div>
                <div>
                  <label className="text-xs text-app-muted block mb-1">Mode</label>
                  <div className="flex gap-2">
                    {[{ v: true, l: 'AI-Optimized' }, { v: false, l: 'Manual' }].map(({ v, l }) => (
                      <button key={l} onClick={() => setAiMode(v)}
                        className={`flex-1 py-1.5 text-xs rounded border font-medium transition-colors ${aiMode === v ? 'bg-app-primary text-white border-app-primary' : 'bg-white text-app-muted border-app-border'}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <Btn onClick={run} disabled={running} className="w-full justify-center">
                  {running ? <><Spinner size={14} />Computing…</> : <><Play size={14} />Run Optimizer</>}
                </Btn>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-xs font-semibold text-app-muted uppercase tracking-wide mb-3">Cost Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-app-muted">Manual baseline</span><span className="font-mono">₹{manualTotal.toLocaleString('en-IN')}K</span></div>
                <div className="flex justify-between"><span className="text-app-muted">AI-Optimized</span><span className="font-mono text-status-success">₹{aiTotal.toLocaleString('en-IN')}K</span></div>
                <div className="flex justify-between font-semibold border-t border-app-border pt-2">
                  <span className="text-status-success flex items-center gap-1"><TrendingDown size={12} />Savings</span>
                  <span className="font-mono text-status-success">₹{savings.toLocaleString('en-IN')}K</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right — results */}
          <div className="lg:col-span-3 space-y-4">
            {ran && (
              <MessageStrip severity="success" message={`Optimizer complete — ${aiMode ? 'AI-Optimized' : 'Manual'} plan generated.${aiMode ? ` Estimated savings vs manual: ₹${savings.toLocaleString('en-IN')}K.` : ''}`} />
            )}

            <Card className="overflow-hidden">
              <div className="px-4 py-3 border-b border-app-border flex items-center justify-between">
                <h3 className="text-sm font-semibold">Allocation Plan</h3>
                <span className={`text-xs px-2 py-0.5 rounded font-semibold ${aiMode ? 'bg-status-success-bg text-status-success' : 'bg-gray-100 text-app-muted'}`}>
                  {aiMode ? 'AI-Optimized' : 'Manual Process'}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-app-bg border-b border-app-border">
                      {['Vessel','Grade','Port','Plant','Rakes','Freight (₹K)','Demurrage (₹K)','Total (₹K)'].map((h) => (
                        <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allocs.map((a, i) => (
                      <tr key={i} className="border-b border-app-border/60 last:border-0 hover:bg-gray-50/50">
                        <td className="px-3 py-2.5 font-medium">{a.vessel}</td>
                        <td className="px-3 py-2.5 text-app-muted">{a.grade}</td>
                        <td className="px-3 py-2.5">{a.port}</td>
                        <td className="px-3 py-2.5">{a.plant}</td>
                        <td className="px-3 py-2.5 font-mono text-right">{a.rakes}</td>
                        <td className="px-3 py-2.5 font-mono text-right">{a.freight.toLocaleString('en-IN')}</td>
                        <td className={`px-3 py-2.5 font-mono text-right ${a.demurrage > 0 ? 'text-status-warning' : 'text-status-success'}`}>{a.demurrage.toLocaleString('en-IN')}</td>
                        <td className="px-3 py-2.5 font-mono text-right font-semibold">{a.total.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                    <tr className="bg-app-bg font-semibold">
                      <td colSpan={4} className="px-3 py-2.5 text-xs uppercase tracking-wide text-app-muted">Total</td>
                      <td className="px-3 py-2.5 font-mono text-right">{allocs.reduce((s,a)=>s+a.rakes,0)}</td>
                      <td className="px-3 py-2.5 font-mono text-right">{allocs.reduce((s,a)=>s+a.freight,0).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2.5 font-mono text-right">{allocs.reduce((s,a)=>s+a.demurrage,0).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2.5 font-mono text-right">{allocs.reduce((s,a)=>s+a.total,0).toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {aiMode && (
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Info size={14} className="text-app-primary" />
                  <h3 className="text-sm font-semibold">Decision Rationale</h3>
                </div>
                <div className="space-y-2.5">
                  {allocs.map((a, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <ArrowRight size={13} className="text-app-primary mt-0.5 shrink-0" />
                      <p className="text-app-text leading-snug">{a.explanation}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
