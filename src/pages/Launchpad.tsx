import React from 'react';
import { Link } from 'react-router-dom';
import { Ship, Brain, Train, Package, Wind, Tag, BarChart2, AlertTriangle, AlertCircle, Info, TrendingDown, TrendingUp } from 'lucide-react';
import { useRole } from '../context/RoleContext';
import { ALERTS, VESSELS, RAKES, DUST_ZONES } from '../data/mock';
import { MessageStrip, Card } from '../components/shared/ui';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const SPK = {
  vessels:   [7,7,8,8,7,7,8].map(v => ({ v })),
  rakes:     [18,19,17,20,19,18,20].map(v => ({ v })),
  variance:  [2.1,1.9,1.8,1.7,1.9,1.6,1.8].map(v => ({ v })),
  sprinkler: [2,3,4,3,4,4,4].map(v => ({ v })),
  alerts:    [5,4,6,5,5,6,7].map(v => ({ v })),
};

function Spark({ data, color }: { data: {v:number}[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={28}>
      <LineChart data={data} margin={{top:2,right:2,bottom:2,left:2}}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

const APP_TILES = [
  { id:'vessels',   icon:Ship,      title:'Vessel & Port Ops',       desc:'Port receipts, discharge, BoL reconciliation', href:'/vessels',   badge:'8 active',        roles:['Corporate','Port Officer'] as const,              featured:false },
  { id:'optimizer', icon:Brain,     title:'AI Port-Plant Optimizer', desc:'MILP allocation, AI vs manual cost comparison', href:'/optimizer', badge:'Last run 13:00', roles:['Corporate','Port Officer','Plant Operations'] as const, featured:true  },
  { id:'rail',      icon:Train,     title:'Rail & Rake Tracking',    desc:'Live rake status, ETA, dispatch-receipt match', href:'/rail',      badge:'2 delayed',       roles:['Corporate','Port Officer','Plant Operations'] as const, featured:false },
  { id:'stockyard', icon:Package,   title:'Stockyard & Inventory',   desc:'Grade stock, LiDAR variance, replenishment',   href:'/stockyard', badge:'5 plants',        roles:['Corporate','Plant Operations'] as const,              featured:false },
  { id:'dust',      icon:Wind,      title:'Dust & Sprinkler Control',desc:'PM2.5 zones, auto-sprinkler, activation log',  href:'/dust',      badge:'4 active zones',  roles:['Corporate','Plant Operations'] as const,              featured:false },
  { id:'batch',     icon:Tag,       title:'Batch Traceability',      desc:'Port-to-furnace batch ID lookup & doc flow',   href:'/batch',     badge:'5 batches',       roles:['Corporate','Port Officer','Plant Operations'] as const, featured:false },
  { id:'reports',   icon:BarChart2, title:'Reports & Analytics',     desc:'Cost savings, variance trends, water usage',   href:'/reports',   badge:'',                roles:['Corporate'] as const,                                 featured:false },
];

export default function Launchpad() {
  const { role } = useRole();
  const activeVessels  = VESSELS.filter((v) => v.status !== 'Departed').length;
  const rakesInTransit = RAKES.filter((r) => r.status === 'In Transit' || r.status === 'Delayed').length;
  const sprinklerActive= DUST_ZONES.filter((z) => z.sprinkler !== 'Idle').length;

  const kpis = [
    { label:'Active Vessels',       value:activeVessels,  unit:'',  data:SPK.vessels,   color:'#0B5FA5', trend:'vs 7 yesterday',          trendDown:false, href:'/vessels'   },
    { label:'Rakes in Transit',     value:rakesInTransit, unit:'',  data:SPK.rakes,     color:'#1E7B45', trend:'+2 since yesterday',       trendDown:false, href:'/rail'      },
    { label:'Avg Stock Variance',   value:1.8,            unit:'%', data:SPK.variance,  color:'#1E7B45', trend:'↓ vs 10.2% manual',        trendDown:true,  href:'/stockyard' },
    { label:'Sprinkler Zones Active',value:sprinklerActive,unit:'', data:SPK.sprinkler, color:'#B8720A', trend:'3 threshold, 1 manual',    trendDown:false, href:'/dust'      },
    { label:'Open Alerts',          value:ALERTS.length,  unit:'',  data:SPK.alerts,    color:'#C4291C', trend:'2 critical',               trendDown:false, href:'/vessels'   },
  ];

  const sorted = [...APP_TILES].sort((a, b) => {
    const ar = a.roles.includes(role as any) ? 0 : 1;
    const br = b.roles.includes(role as any) ? 0 : 1;
    if (ar !== br) return ar - br;
    return (a.featured ? 0 : 1) - (b.featured ? 0 : 1);
  });

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="mb-5">
        <h1 className="text-3xl font-semibold text-app-text">Command Center</h1>
        <p className="text-sm text-app-muted mt-0.5">{role} · {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'2-digit', month:'long', year:'numeric' })}</p>
      </div>

      {ALERTS.filter((a) => a.severity === 'critical').map((a) => (
        <MessageStrip key={a.id} severity="critical" message={a.message} className="mb-2" />
      ))}

      {/* KPI tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {kpis.map((k) => (
          <Link key={k.label} to={k.href} className="block bg-app-surface border border-app-border rounded-md p-3.5 hover:border-app-primary/40 hover:shadow-card transition-all">
            <p className="text-xs text-app-muted mb-1.5">{k.label}</p>
            <div className="flex items-end justify-between gap-1">
              <div>
                <span className="text-2xl font-semibold font-mono text-app-text">{k.value}</span>
                {k.unit && <span className="text-sm text-app-muted ml-0.5">{k.unit}</span>}
                <p className={`text-xs mt-0.5 flex items-center gap-0.5 ${k.trendDown ? 'text-status-success' : 'text-status-warning'}`}>
                  {k.trendDown ? <TrendingDown size={10}/> : <TrendingUp size={10}/>} {k.trend}
                </p>
              </div>
              <div className="w-16 shrink-0"><Spark data={k.data} color={k.color} /></div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* App tiles */}
        <div className="lg:col-span-2">
          <p className="text-xs font-semibold text-app-muted uppercase tracking-wider mb-3">Applications</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {sorted.map((tile) => {
              const Icon = tile.icon;
              const relevant = tile.roles.includes(role as any);
              return (
                <Link key={tile.id} to={tile.href}
                  className={`flex items-start gap-3 p-4 bg-app-surface border rounded-md hover:border-app-primary/40 hover:shadow-card transition-all
                    ${tile.featured ? 'border-app-primary/30 ring-1 ring-app-primary/10' : 'border-app-border'}
                    ${!relevant ? 'opacity-55' : ''}`}>
                  <div className={`shrink-0 w-9 h-9 rounded flex items-center justify-center ${tile.featured ? 'bg-app-primary text-white' : 'bg-app-bg text-app-primary'}`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-app-text">{tile.title}</p>
                      {tile.featured && <span className="text-[9px] bg-app-primary text-white px-1.5 py-0.5 rounded font-semibold uppercase">AI</span>}
                    </div>
                    <p className="text-xs text-app-muted mt-0.5 leading-snug">{tile.desc}</p>
                    {tile.badge && <p className="text-xs text-app-primary font-medium mt-1">{tile.badge}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Alerts panel */}
        <div>
          <p className="text-xs font-semibold text-app-muted uppercase tracking-wider mb-3">Recent Alerts</p>
          <Card className="overflow-hidden">
            {ALERTS.slice(0, 5).map((a, i) => {
              const Icon = a.severity === 'critical' ? AlertCircle : a.severity === 'warning' ? AlertTriangle : Info;
              const cls  = a.severity === 'critical' ? 'text-status-critical' : a.severity === 'warning' ? 'text-status-warning' : 'text-status-info';
              return (
                <div key={a.id} className={`flex items-start gap-2 px-3 py-2.5 ${i > 0 ? 'border-t border-app-border' : ''}`}>
                  <Icon size={13} className={`mt-0.5 shrink-0 ${cls}`} />
                  <div>
                    <p className="text-xs text-app-text leading-snug">{a.message}</p>
                    <p className="text-xs text-app-muted">{a.time}</p>
                  </div>
                </div>
              );
            })}
            <div className="px-3 py-2 border-t border-app-border">
              <Link to="/vessels" className="text-xs text-app-primary hover:underline">View all alerts →</Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
