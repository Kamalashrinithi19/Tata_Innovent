import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ExternalLink } from 'lucide-react';
import { RAKES, PORTS, PLANTS } from '../../data/mock';
import { StatusBadge, PageHeader, Card, MessageStrip } from '../../components/shared/ui';
import type { RakeStatus } from '../../data/mock';

const STATUS_SEV: Record<RakeStatus, any> = { Loading:'info','In Transit':'success',Delayed:'critical',Received:'neutral' };

export default function RailDetail() {
  const { id } = useParams<{ id: string }>();
  const rake   = RAKES.find((r) => r.id === id);

  if (!rake) return (
    <div className="p-5">
      <Link to="/rail" className="text-app-primary text-sm mb-4 block">← Back</Link>
      <p className="text-app-muted">Rake not found.</p>
    </div>
  );

  const port  = PORTS.find((p) => p.id === rake.originPortId);
  const plant = PLANTS.find((p) => p.id === rake.destPlantId);
  const isDelayed = rake.predictedEta !== rake.scheduledEta && !!rake.scheduledEta;

  const stops = [
    { label: port?.name  ?? 'Origin', time: rake.departedAt ?? '—', done: !!rake.departedAt, active: false },
    { label: rake.currentLocation,    time: 'Current position',     done: false,              active: rake.progress > 0 && rake.progress < 100 },
    { label: plant?.name ?? 'Dest',   time: rake.receivedAt ?? rake.predictedEta ?? '—', done: rake.status === 'Received', active: false },
  ];

  return (
    <div>
      <PageHeader
        title={rake.rakeNo}
        subtitle={`${port?.name} → ${plant?.name} · ${rake.grade}`}
        breadcrumbs={[{label:'Home',href:'/'},{label:'Rail & Rake',href:'/rail'},{label:rake.rakeNo}]}
        actions={<StatusBadge label={rake.status} severity={STATUS_SEV[rake.status]} />}
      />
      <div className="bg-app-surface border-b border-app-border px-5 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-5">
          {[
            {label:'Origin',   value:port?.name},
            {label:'Destination',value:plant?.name},
            {label:'Grade',    value:rake.grade},
            {label:'Load (MT)',value:rake.load_mt.toLocaleString('en-IN'), mono:true},
            {label:'Wagons',   value:rake.wagons},
            {label:'Batch ID', value:rake.batchId, mono:true, small:true, primary:true},
          ].map(({label,value,mono,small,primary})=>(
            <div key={label}><p className="text-xs text-app-muted mb-0.5">{label}</p>
              <p className={`text-sm font-medium ${mono?'font-mono':''} ${small?'text-xs':''} ${primary?'text-app-primary':''}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {isDelayed && (
          <MessageStrip severity="warning"
            message={`ETA delayed: scheduled ${rake.scheduledEta} → predicted ${rake.predictedEta}. Current: ${rake.currentLocation}`} />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-4">Route Progress</h3>
            <div className="flex justify-between text-xs text-app-muted mb-1.5">
              <span>{port?.name}</span><span>{plant?.name}</span>
            </div>
            <div className="h-2 bg-app-border rounded-full overflow-hidden mb-1.5">
              <div className={`h-full rounded-full transition-all ${rake.status==='Delayed'?'bg-status-warning':rake.status==='Received'?'bg-status-success':'bg-app-primary'}`}
                style={{width:`${rake.progress}%`}} />
            </div>
            <p className="text-xs text-app-muted text-right font-mono mb-5">{rake.progress}% complete</p>
            <div className="relative pl-5 space-y-4">
              {stops.map((s, i) => (
                <div key={i} className="relative">
                  {i < stops.length-1 && <div className="absolute left-[-13px] top-3 bottom-[-16px] w-px bg-app-border" />}
                  <div className={`absolute left-[-17px] top-1 w-3 h-3 rounded-full border-2 flex items-center justify-center
                    ${s.done?'bg-status-success border-status-success':s.active?'bg-app-primary border-app-primary':'bg-white border-app-border'}`}>
                    {s.done&&<span className="text-white text-[8px] leading-none">✓</span>}
                    {s.active&&<MapPin size={7} className="text-white"/>}
                  </div>
                  <p className={`text-sm ${s.active?'font-semibold text-app-primary':'text-app-text'}`}>{s.label}</p>
                  <p className="text-xs font-mono text-app-muted">{s.time}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-4">Dispatch–Receipt Match</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-app-bg border border-app-border rounded p-3">
                <p className="text-xs text-app-muted mb-0.5">Dispatched</p>
                <p className="font-mono font-semibold text-sm">{rake.load_mt.toLocaleString('en-IN')} MT</p>
                <p className="text-xs text-app-muted mt-0.5">{rake.departedAt??'—'}</p>
              </div>
              <div className="bg-app-bg border border-app-border rounded p-3">
                <p className="text-xs text-app-muted mb-0.5">Received</p>
                <p className="font-mono font-semibold text-sm">{rake.receivedAt?`${rake.load_mt.toLocaleString('en-IN')} MT`:'—'}</p>
                <p className="text-xs text-app-muted mt-0.5">{rake.receivedAt??'Pending'}</p>
              </div>
            </div>
            <div className={`px-3 py-2 rounded border text-xs font-medium ${rake.status==='Received'?'bg-status-success-bg border-status-success/30 text-status-success':'bg-status-info-bg border-status-info/30 text-status-info'}`}>
              {rake.status==='Received'?'✓ Auto-matched — 0 MT variance':'Match pending — awaiting receipt'}
            </div>
            {rake.batchId&&(
              <Link to={`/batch?id=${rake.batchId}`} className="flex items-center gap-1 text-xs text-app-primary hover:underline mt-3">
                <ExternalLink size={12}/>View batch {rake.batchId}
              </Link>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
