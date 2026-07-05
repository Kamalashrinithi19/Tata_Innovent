import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ship } from 'lucide-react';
import { VESSELS, PORTS } from '../../data/mock';
import { DataTable, FilterBar, FilterSelect } from '../../components/shared/DataTable';
import { StatusBadge, PageHeader, MessageStrip } from '../../components/shared/ui';
import type { Vessel, VesselStatus, DemurrageRisk } from '../../data/mock';

const STATUS_SEV: Record<VesselStatus, 'info'|'warning'|'success'|'neutral'> = {
  'En Route': 'info', 'At Berth': 'warning', 'Discharging': 'success', 'Departed': 'neutral',
};
const DMG_SEV: Record<DemurrageRisk, 'success'|'warning'|'critical'> = {
  Low: 'success', Med: 'warning', High: 'critical',
};

export default function VesselList() {
  const navigate = useNavigate();
  const [portFilter,   setPortFilter]   = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = VESSELS.filter((v) =>
    (portFilter   === 'all' || v.portId  === portFilter) &&
    (statusFilter === 'all' || v.status  === statusFilter)
  );

  const highDmg = VESSELS.filter((v) => v.demurrage === 'High');

  const columns = [
    { key: 'name', header: 'Vessel Name',
      render: (v: Vessel) => <span className="flex items-center gap-2"><Ship size={13} className="text-app-muted shrink-0" /><span className="font-medium text-app-primary">{v.name}</span></span> },
    { key: 'portId',     header: 'Port',    render: (v: Vessel) => PORTS.find((p) => p.id === v.portId)?.name ?? v.portId },
    { key: 'status',     header: 'Status',  render: (v: Vessel) => <StatusBadge label={v.status} severity={STATUS_SEV[v.status]} /> },
    { key: 'eta',        header: 'ETA / Berthed', render: (v: Vessel) => <span className="font-mono text-xs">{v.berthedAt ?? v.eta}</span> },
    { key: 'grade',      header: 'Grade' },
    { key: 'tonnage_mt', header: 'Tonnage (MT)', render: (v: Vessel) => v.tonnage_mt.toLocaleString('en-IN'), align: 'right' as const },
    { key: 'demurrage',  header: 'Demurrage Risk', render: (v: Vessel) => <StatusBadge label={v.demurrage} severity={DMG_SEV[v.demurrage]} /> },
    { key: 'batchId',    header: 'Batch ID', render: (v: Vessel) => <span className="font-mono text-xs text-app-muted">{v.batchId}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Vessel & Port Operations"
        subtitle="Port receipts, discharge tracking, and batch allocation"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Vessel & Port Ops' }]}
      />
      <div className="p-5">
        {highDmg.length > 0 && (
          <MessageStrip severity="warning" className="mb-4"
            message={`High demurrage risk: ${highDmg.map((v) => v.name).join(', ')}`} />
        )}
        <FilterBar>
          <FilterSelect label="Port" value={portFilter} onChange={setPortFilter}
            options={[{ value: 'all', label: 'All Ports' }, ...PORTS.map((p) => ({ value: p.id, label: p.name }))]} />
          <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'En Route',    label: 'En Route' },
              { value: 'At Berth',    label: 'At Berth' },
              { value: 'Discharging', label: 'Discharging' },
              { value: 'Departed',    label: 'Departed' },
            ]} />
          <span className="ml-auto text-xs text-app-muted">{filtered.length} vessel(s)</span>
        </FilterBar>
        <div className="bg-app-surface border border-app-border rounded-md overflow-hidden">
          <DataTable data={filtered} columns={columns} rowKey={(v) => v.id}
            onRowClick={(v) => navigate(`/vessels/${v.id}`)}
            searchKeys={['name', 'grade', 'batchId']} />
        </div>
      </div>
    </div>
  );
}
