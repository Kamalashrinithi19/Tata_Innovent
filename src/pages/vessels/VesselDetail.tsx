import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Ship, Package, FileText, MapPin, ExternalLink } from 'lucide-react';
import { VESSELS, PORTS, GRADES } from '../../data/mock';
import { StatusBadge, PageHeader, Card, MessageStrip } from '../../components/shared/ui';
import type { VesselStatus, DemurrageRisk } from '../../data/mock';

const STATUS_SEV: Record<VesselStatus, any> = { 'En Route':'info','At Berth':'warning','Discharging':'success','Departed':'neutral' };
const DMG_SEV:    Record<DemurrageRisk, any> = { Low:'success', Med:'warning', High:'critical' };

type Tab = 'discharge' | 'batch' | 'ais';

export default function VesselDetail() {
  const { id } = useParams<{ id: string }>();
  const vessel  = VESSELS.find((v) => v.id === id);
  const [tab, setTab] = useState<Tab>('discharge');

  if (!vessel) return (
    <div className="p-5">
      <Link to="/vessels" className="text-app-primary text-sm flex items-center gap-1 mb-4">← Back to vessels</Link>
      <p className="text-app-muted">Vessel not found.</p>
    </div>
  );

  const port    = PORTS.find((p) => p.id === vessel.portId);
  const grade   = GRADES.find((g) => g.id === vessel.gradeId);
  const pct     = vessel.tonnage_mt > 0 ? Math.round((vessel.discharged_mt / vessel.tonnage_mt) * 100) : 0;
  const bolVar  = vessel.draft_survey_mt > 0 ? (((vessel.bol_mt - vessel.draft_survey_mt) / vessel.bol_mt) * 100).toFixed(2) : 'N/A';

  const TABS = [
    { key: 'discharge', label: 'Discharge Details', Icon: Package },
    { key: 'batch',     label: 'Batch Allocation',  Icon: FileText },
    { key: 'ais',       label: 'AIS Position',       Icon: MapPin },
  ] as const;

  return (
    <div>
      <PageHeader
        title={vessel.name}
        subtitle={`${vessel.flag} flagged · ${vessel.grade}`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Vessel & Port Ops', href: '/vessels' }, { label: vessel.name }]}
        actions={<StatusBadge label={vessel.status} severity={STATUS_SEV[vessel.status]} />}
      />

      {/* Metadata row */}
      <div className="bg-app-surface border-b border-app-border px-5 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {[
            { label: 'Port',        value: port?.name },
            { label: 'ETA / Berthed', value: vessel.berthedAt ?? vessel.eta, mono: true },
            { label: 'Grade',       value: vessel.grade },
            { label: 'Tonnage',     value: `${vessel.tonnage_mt.toLocaleString('en-IN')} MT`, mono: true },
            { label: 'Demurrage',   badge: <StatusBadge label={vessel.demurrage} severity={DMG_SEV[vessel.demurrage]} /> },
            { label: 'Batch ID',    value: vessel.batchId, mono: true, small: true, primary: true },
          ].map(({ label, value, mono, small, primary, badge }) => (
            <div key={label}>
              <p className="text-xs text-app-muted mb-0.5">{label}</p>
              {badge ?? <p className={`text-sm font-medium ${mono ? 'font-mono' : ''} ${small ? 'text-xs' : ''} ${primary ? 'text-app-primary' : 'text-app-text'}`}>{value}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-app-surface border-b border-app-border px-5 flex gap-0">
        {TABS.map(({ key, label, Icon }) => (
          <button key={key} onClick={() => setTab(key as Tab)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === key ? 'border-app-primary text-app-primary' : 'border-transparent text-app-muted hover:text-app-text'
            }`}>
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      <div className="p-5 space-y-4">
        {tab === 'discharge' && (
          <>
            {vessel.demurrage === 'High' && (
              <MessageStrip severity="critical" message="High demurrage risk — vessel at berth beyond free-time window." />
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-5">
                <h3 className="text-sm font-semibold mb-4">BoL vs. Draft Survey Reconciliation</h3>
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-app-border">
                    {['Field','BoL','Draft Survey','Variance'].map((h) => (
                      <th key={h} className={`py-2 text-xs font-semibold text-app-muted uppercase ${h !== 'Field' ? 'text-right' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    <tr className="border-b border-app-border/50">
                      <td className="py-2.5 text-app-muted">Quantity (MT)</td>
                      <td className="py-2.5 text-right font-mono">{vessel.bol_mt.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 text-right font-mono">{vessel.draft_survey_mt > 0 ? vessel.draft_survey_mt.toLocaleString('en-IN') : '—'}</td>
                      <td className={`py-2.5 text-right font-mono font-semibold text-xs ${vessel.draft_survey_mt > 0 && Math.abs(parseFloat(bolVar)) > 0.5 ? 'text-status-warning' : 'text-status-success'}`}>
                        {vessel.draft_survey_mt > 0 ? `${bolVar}%` : '—'}
                      </td>
                    </tr>
                    <tr className="border-b border-app-border/50">
                      <td className="py-2.5 text-app-muted">Grade</td>
                      <td className="py-2.5 text-right" colSpan={2}>{vessel.grade}</td>
                      <td className="py-2.5 text-right text-status-success text-xs">✓ Match</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-app-muted">Ash %</td>
                      <td className="py-2.5 text-right font-mono">{grade?.ash_pct}%</td>
                      <td className="py-2.5 text-right font-mono">{grade ? (grade.ash_pct + 0.2).toFixed(1) : '—'}%</td>
                      <td className="py-2.5 text-right font-mono text-xs text-status-success">+0.2%</td>
                    </tr>
                  </tbody>
                </table>
              </Card>
              <Card className="p-5">
                <h3 className="text-sm font-semibold mb-4">Discharge Progress</h3>
                <div className="flex justify-between text-xs text-app-muted mb-1.5">
                  <span>Discharged</span>
                  <span className="font-mono">{vessel.discharged_mt.toLocaleString('en-IN')} / {vessel.tonnage_mt.toLocaleString('en-IN')} MT</span>
                </div>
                <div className="h-3 bg-app-bg border border-app-border rounded-full overflow-hidden">
                  <div className="h-full bg-app-primary rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-app-muted mt-1.5">{pct}% complete</p>
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-app-border text-sm">
                  <div><p className="text-xs text-app-muted">Remaining</p><p className="font-mono font-semibold">{(vessel.tonnage_mt - vessel.discharged_mt).toLocaleString('en-IN')} MT</p></div>
                  <div><p className="text-xs text-app-muted">Est. Completion</p><p className="font-mono font-semibold">{vessel.status === 'Departed' ? 'Complete' : '~8h'}</p></div>
                </div>
              </Card>
            </div>
          </>
        )}

        {tab === 'batch' && (
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-4">Batch Assignment</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Batch ID', value: vessel.batchId, primary: true, mono: true },
                { label: 'Grade',    value: vessel.grade },
                { label: 'Quantity', value: `${vessel.tonnage_mt.toLocaleString('en-IN')} MT`, mono: true },
                { label: 'Port',     value: port?.name },
              ].map(({ label, value, primary, mono }) => (
                <div key={label} className="bg-app-bg border border-app-border rounded p-3">
                  <p className="text-xs text-app-muted mb-0.5">{label}</p>
                  <p className={`font-semibold text-sm ${mono ? 'font-mono' : ''} ${primary ? 'text-app-primary' : 'text-app-text'}`}>{value}</p>
                </div>
              ))}
            </div>
            <Link to={`/batch?id=${vessel.batchId}`} className="flex items-center gap-1 text-sm text-app-primary hover:underline">
              <ExternalLink size={13} /> View full batch traceability →
            </Link>
          </Card>
        )}

        {tab === 'ais' && (
          <Card className="p-5">
            <h3 className="text-sm font-semibold mb-4">AIS Position Timeline</h3>
            <div className="relative pl-5">
              {vessel.waypoints.map((wp, i) => (
                <div key={i} className="relative pb-5 last:pb-0">
                  {i < vessel.waypoints.length - 1 && <div className="absolute left-[-13px] top-3 bottom-0 w-px bg-app-border" />}
                  <div className={`absolute left-[-17px] top-1 w-3 h-3 rounded-full border-2 ${i === vessel.waypoints.length - 1 ? 'bg-app-primary border-app-primary' : 'bg-white border-app-border'}`} />
                  <p className="text-sm font-medium text-app-text">{wp.loc}</p>
                  <p className="text-xs font-mono text-app-muted">{wp.time}</p>
                  <p className="text-xs text-app-muted">{wp.lat.toFixed(2)}°N, {wp.lon.toFixed(2)}°E</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
