import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { RAKES, PORTS, PLANTS } from '../../data/mock';
import { DataTable, FilterBar, FilterSelect } from '../../components/shared/DataTable';
import { StatusBadge, PageHeader, MessageStrip } from '../../components/shared/ui';
import type { Rake, RakeStatus } from '../../data/mock';

const STATUS_SEV: Record<RakeStatus, any> = { Loading:'info','In Transit':'success',Delayed:'critical',Received:'neutral' };

export default function RailList() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const filtered = RAKES.filter((r) => statusFilter === 'all' || r.status === statusFilter);
  const delayed  = RAKES.filter((r) => r.status === 'Delayed');

  const columns = [
    { key:'rakeNo',       header:'Rake Number', render:(r:Rake)=><span className="font-mono font-medium text-app-primary text-xs">{r.rakeNo}</span> },
    { key:'originPortId', header:'Origin',       render:(r:Rake)=>PORTS.find((p)=>p.id===r.originPortId)?.name??r.originPortId },
    { key:'destPlantId',  header:'Destination',  render:(r:Rake)=>PLANTS.find((p)=>p.id===r.destPlantId)?.name??r.destPlantId },
    { key:'status',       header:'Status',       render:(r:Rake)=><StatusBadge label={r.status} severity={STATUS_SEV[r.status]} /> },
    { key:'scheduledEta', header:'Scheduled ETA',render:(r:Rake)=><span className="font-mono text-xs">{r.scheduledEta??'—'}</span> },
    { key:'predictedEta', header:'Predicted ETA',render:(r:Rake)=>(
      <span className={`font-mono text-xs flex items-center gap-1 ${r.predictedEta!==r.scheduledEta&&r.scheduledEta?'text-status-warning font-semibold':''}`}>
        {r.predictedEta??'—'}
        {r.predictedEta!==r.scheduledEta&&r.scheduledEta&&<AlertTriangle size={11} className="text-status-warning"/>}
      </span>)},
    { key:'grade',        header:'Grade' },
    { key:'load_mt',      header:'Load (MT)',    render:(r:Rake)=>r.load_mt.toLocaleString('en-IN'), align:'right' as const },
    { key:'progress',     header:'Progress',     render:(r:Rake)=>(
      <div className="flex items-center gap-2 min-w-[90px]">
        <div className="flex-1 h-1.5 bg-app-border rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${r.status==='Received'?'bg-status-success':r.status==='Delayed'?'bg-status-warning':'bg-app-primary'}`}
            style={{width:`${r.progress}%`}} />
        </div>
        <span className="text-xs font-mono text-app-muted w-8 text-right">{r.progress}%</span>
      </div>)},
  ];

  return (
    <div>
      <PageHeader title="Rail & Rake Tracking" subtitle="Live rake status, ETA, and dispatch–receipt matching"
        breadcrumbs={[{label:'Home',href:'/'},{label:'Rail & Rake Tracking'}]} />
      <div className="p-5">
        {delayed.length>0&&(
          <MessageStrip severity="warning" className="mb-4"
            message={`${delayed.length} rake(s) delayed: ${delayed.map((r)=>`${r.rakeNo} (${r.currentLocation})`).join(' · ')}`} />
        )}
        <FilterBar>
          <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter}
            options={[{value:'all',label:'All'},{value:'Loading',label:'Loading'},{value:'In Transit',label:'In Transit'},{value:'Delayed',label:'Delayed'},{value:'Received',label:'Received'}]} />
          <span className="ml-auto text-xs text-app-muted">{filtered.length} rake(s)</span>
        </FilterBar>
        <div className="bg-app-surface border border-app-border rounded-md overflow-hidden">
          <DataTable data={filtered} columns={columns} rowKey={(r)=>r.id}
            onRowClick={(r)=>navigate(`/rail/${r.id}`)} searchKeys={['rakeNo','grade','batchId','currentLocation']} />
        </div>
      </div>
    </div>
  );
}
