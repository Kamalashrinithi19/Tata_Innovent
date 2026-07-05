import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Check, Clock } from 'lucide-react';
import { BATCHES } from '../../data/mock';
import { StatusBadge, PageHeader, Card, Btn, MessageStrip } from '../../components/shared/ui';
import type { Batch } from '../../data/mock';

const STATUS_SEV: Record<Batch['status'], any> = { Active:'info','In Transit':'warning',Received:'success',Charged:'neutral' };

const NODE_CFG = {
  complete: { ring: 'bg-status-success border-status-success', icon: Check,  iconCls: 'text-white' },
  active:   { ring: 'bg-app-primary border-app-primary',       icon: Clock,  iconCls: 'text-white' },
  pending:  { ring: 'bg-white border-app-border',              icon: Clock,  iconCls: 'text-app-muted' },
};

function BatchFlow({ batch }: { batch: Batch }) {
  const count = batch.nodes.length;
  return (
    <Card className="p-5 overflow-x-auto">
      <h3 className="text-sm font-semibold mb-6">Document Flow — Port to Furnace</h3>
      <div className="relative min-w-max">
        {/* Horizontal connector */}
        <div className="absolute top-4 left-[20px] right-[20px] h-0.5 bg-app-border" />
        <div className="flex gap-0" style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
          {batch.nodes.map((node, i) => {
            const cfg = NODE_CFG[node.status];
            const NodeIcon = cfg.icon;
            const inner = (
              <div key={i} className="flex flex-col items-center text-center w-36 px-2">
                <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center z-10 relative mb-3 ${cfg.ring} ${node.status !== 'pending' && node.moduleLink && node.linkedId ? 'hover:scale-110 transition-transform cursor-pointer' : ''}`}>
                  <NodeIcon size={14} className={cfg.iconCls} />
                </div>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${node.status==='complete'?'text-status-success':node.status==='active'?'text-app-primary':'text-app-muted'}`}>{node.stage}</p>
                <p className="text-xs text-app-muted leading-snug">{node.description}</p>
                {node.timestamp && <p className="text-xs font-mono text-app-muted mt-1">{node.timestamp.split(' ')[0]}</p>}
                {node.quantity_mt && <p className="text-xs font-mono text-app-primary mt-0.5">{node.quantity_mt.toLocaleString('en-IN')} MT</p>}
              </div>
            );
            return node.moduleLink && node.linkedId ? (
              <Link key={i} to={node.moduleLink}>{inner.props.children ? <div className="flex flex-col items-center text-center w-36 px-2">{inner.props.children}</div> : inner}</Link>
            ) : (
              <div key={i} className="flex flex-col items-center text-center w-36 px-2">
                <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center z-10 relative mb-3 ${cfg.ring}`}>
                  <NodeIcon size={14} className={cfg.iconCls} />
                </div>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${node.status==='complete'?'text-status-success':node.status==='active'?'text-app-primary':'text-app-muted'}`}>{node.stage}</p>
                <p className="text-xs text-app-muted leading-snug">{node.description}</p>
                {node.timestamp && <p className="text-xs font-mono text-app-muted mt-1">{node.timestamp.split(' ')[0]}</p>}
                {node.quantity_mt && <p className="text-xs font-mono text-app-primary mt-0.5">{node.quantity_mt.toLocaleString('en-IN')} MT</p>}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export default function BatchTraceability() {
  const [searchParams] = useSearchParams();
  const [query,    setQuery]    = useState(searchParams.get('id') ?? '');
  const [result,   setResult]   = useState<Batch | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) { const b = BATCHES.find((b) => b.id === id); setResult(b ?? null); setNotFound(!b); }
  }, [searchParams]);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const b = BATCHES.find((b) => b.id.toLowerCase() === query.toLowerCase().trim());
    setResult(b ?? null); setNotFound(!b);
  };

  return (
    <div>
      <PageHeader title="Batch Traceability" subtitle="Port-to-furnace batch ID lookup and document flow"
        breadcrumbs={[{label:'Home',href:'/'},{label:'Batch Traceability'}]} />
      <div className="p-5 space-y-4">
        <Card className="p-4">
          <p className="text-sm font-semibold mb-3">Search Batch ID</p>
          <form onSubmit={search} className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. CLI-2024-P1-V001"
                className="w-full pl-9 pr-3 py-2 border border-app-border rounded text-sm outline-none focus:border-app-primary bg-white" />
            </div>
            <Btn type="submit">Search</Btn>
            {result && <Btn variant="secondary" onClick={() => { setResult(null); setQuery(''); setNotFound(false); }}>Clear</Btn>}
          </form>
          <p className="text-xs text-app-muted mt-2">Try: CLI-2024-P1-V001 · CLI-2024-P2-V006 · CLI-2024-P4-V004 · CLI-2024-P3-V007</p>
        </Card>

        {notFound && <MessageStrip severity="warning" message={`Batch "${query}" not found.`} />}

        {result && (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs text-app-muted mb-0.5">Batch ID</p>
                  <p className="text-lg font-mono font-semibold text-app-primary">{result.id}</p>
                </div>
                <StatusBadge label={result.status} severity={STATUS_SEV[result.status]} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-app-border">
                {[
                  {label:'Grade',       value:result.grade},
                  {label:'Origin',      value:result.origin_port},
                  {label:'Destination', value:result.dest_plant??'—'},
                  {label:'Total (MT)',  value:result.total_mt.toLocaleString('en-IN'), mono:true},
                ].map(({label,value,mono})=>(
                  <div key={label}><p className="text-xs text-app-muted">{label}</p>
                    <p className={`text-sm font-medium ${mono?'font-mono':''}`}>{value}</p></div>
                ))}
              </div>
            </Card>
            <BatchFlow batch={result} />
          </div>
        )}

        {!result && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-app-muted uppercase tracking-wide">All Batches</p>
            <Card className="overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-app-bg border-b border-app-border">
                  {['Batch ID','Grade','Origin','Destination','Total (MT)','Status','Created'].map((h)=>(
                    <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-app-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {BATCHES.map((b) => (
                    <tr key={b.id} onClick={() => { setQuery(b.id); setResult(b); setNotFound(false); }}
                      className="border-b border-app-border/50 last:border-0 cursor-pointer hover:bg-app-primary-light/30 transition-colors">
                      <td className="px-3 py-2.5 font-mono text-xs text-app-primary font-semibold">{b.id}</td>
                      <td className="px-3 py-2.5">{b.grade}</td>
                      <td className="px-3 py-2.5">{b.origin_port}</td>
                      <td className="px-3 py-2.5">{b.dest_plant??'—'}</td>
                      <td className="px-3 py-2.5 font-mono text-right">{b.total_mt.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2.5"><StatusBadge label={b.status} severity={STATUS_SEV[b.status]} /></td>
                      <td className="px-3 py-2.5 font-mono text-xs text-app-muted">{b.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
