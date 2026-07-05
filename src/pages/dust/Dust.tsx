import React, { useState } from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { DUST_ZONES, PLANTS } from '../../data/mock';
import { StatusBadge, PageHeader, MessageStrip, Card } from '../../components/shared/ui';
import type { DustZone, SprinklerStatus } from '../../data/mock';

const SPK_SEV: Record<SprinklerStatus, any> = { Idle:'neutral', Active:'success', 'Manual Override':'warning' };

export default function Dust() {
  const [zones, setZones]         = useState<DustZone[]>(DUST_ZONES);
  const [plantFilter, setPlant]   = useState('all');

  const filtered  = zones.filter((z) => plantFilter === 'all' || z.plantId === plantFilter);
  const breaching = zones.filter((z) => z.pm25 > z.pm25Threshold);

  const toggle = (id: string) => {
    setZones((zs) => zs.map((z) => {
      if (z.id !== id) return z;
      const next: SprinklerStatus = z.sprinkler === 'Idle' ? 'Manual Override' : 'Idle';
      return { ...z, sprinkler: next, manualOverride: next !== 'Idle',
        lastActivated: next !== 'Idle' ? new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) : z.lastActivated,
        lastActivationReason: next !== 'Idle' ? 'Manual override' : z.lastActivationReason };
    }));
  };

  return (
    <div>
      <PageHeader title="Dust & Sprinkler Control" subtitle="PM2.5 sensor mesh, threshold-based auto-activation, and manual override"
        breadcrumbs={[{label:'Home',href:'/'},{label:'Dust & Sprinkler Control'}]} />
      <div className="p-5 space-y-4">
        {breaching.map((z) => (
          <MessageStrip key={z.id} severity="critical"
            message={`PM2.5 breach — ${z.plant} ${z.zone}: ${z.pm25} µg/m³ (threshold ${z.pm25Threshold}) — sprinkler ${z.sprinkler === 'Idle' ? 'NOT active' : 'activated'}`} />
        ))}

        {/* Plant filter */}
        <div className="flex flex-wrap gap-2">
          {[{id:'all',name:'All Plants'},...PLANTS].map((p) => (
            <button key={p.id} onClick={() => setPlant(p.id)}
              className={`px-3 py-1.5 text-xs rounded border font-medium transition-colors ${plantFilter===p.id?'bg-app-primary text-white border-app-primary':'bg-white text-app-muted border-app-border hover:border-app-primary/40'}`}>
              {p.name}
            </button>
          ))}
        </div>

        {/* Zone cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((z) => {
            const over = z.pm25 > z.pm25Threshold;
            const near = z.pm25 > z.pm25Threshold * 0.85;
            return (
              <Card key={z.id} className={`p-4 ${over ? 'border-status-critical/40' : near ? 'border-status-warning/40' : ''}`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="text-xs text-app-muted">{z.plant}</p>
                    <p className="text-sm font-semibold text-app-text">{z.zone}</p>
                  </div>
                  <StatusBadge label={z.sprinkler} severity={SPK_SEV[z.sprinkler]} />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-app-muted mb-0.5">PM2.5</p>
                    <p className={`text-xl font-mono font-semibold ${over?'text-status-critical':near?'text-status-warning':'text-app-text'}`}>
                      {z.pm25}<span className="text-xs font-normal ml-0.5 text-app-muted">µg/m³</span>
                    </p>
                    <p className="text-xs text-app-muted">Limit: {z.pm25Threshold}</p>
                  </div>
                  <div>
                    <p className="text-xs text-app-muted mb-0.5">PM10</p>
                    <p className="text-xl font-mono font-semibold text-app-text">{z.pm10}<span className="text-xs font-normal ml-0.5 text-app-muted">µg/m³</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-app-muted mb-0.5">Wind</p>
                    <p className="text-sm font-mono">{z.windSpeed} m/s {z.windDir}</p>
                  </div>
                  <div>
                    {z.lastActivated && <>
                      <p className="text-xs text-app-muted mb-0.5">Last activated</p>
                      <p className="text-xs font-mono">{z.lastActivated}</p>
                    </>}
                  </div>
                </div>

                {/* PM bar */}
                <div className="mb-3 h-1.5 bg-app-border rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${over?'bg-status-critical':near?'bg-status-warning':'bg-status-success'}`}
                    style={{ width: `${Math.min((z.pm25 / (z.pm25Threshold * 1.5)) * 100, 100)}%` }} />
                </div>

                {z.lastActivationReason && (
                  <p className="text-xs text-app-muted mb-2">{z.lastActivationReason}</p>
                )}

                <button onClick={() => toggle(z.id)}
                  className={`w-full flex items-center justify-center gap-2 py-1.5 rounded border text-xs font-medium transition-colors ${
                    z.sprinkler !== 'Idle'
                      ? 'bg-status-success-bg border-status-success/30 text-status-success'
                      : 'bg-white border-app-border text-app-muted hover:border-app-primary/40 hover:text-app-primary'
                  }`}>
                  {z.sprinkler !== 'Idle' ? <ToggleRight size={14}/> : <ToggleLeft size={14}/>}
                  {z.sprinkler !== 'Idle' ? 'Active — Click to Deactivate' : 'Manual Activate'}
                </button>
              </Card>
            );
          })}
        </div>

        {/* Activation log */}
        <Card className="overflow-hidden">
          <div className="px-4 py-3 border-b border-app-border"><h3 className="text-sm font-semibold">Activation Log</h3></div>
          <table className="w-full text-sm">
            <thead><tr className="bg-app-bg border-b border-app-border">
              {['Timestamp','Plant','Zone','Trigger Reason','Status'].map((h)=>(
                <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {zones.filter((z) => z.lastActivated).map((z) => (
                <tr key={z.id} className="border-b border-app-border/50 last:border-0">
                  <td className="px-3 py-2.5 font-mono text-xs">{z.lastActivated}</td>
                  <td className="px-3 py-2.5">{z.plant}</td>
                  <td className="px-3 py-2.5 text-xs">{z.zone}</td>
                  <td className="px-3 py-2.5 text-xs text-app-muted">{z.lastActivationReason}</td>
                  <td className="px-3 py-2.5"><StatusBadge label={z.sprinkler} severity={SPK_SEV[z.sprinkler]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
