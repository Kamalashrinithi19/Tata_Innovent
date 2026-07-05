import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react';

export interface ColDef<T> {
  key: string; header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean; width?: string; align?: 'left' | 'right' | 'center';
}

export function DataTable<T extends object>({
  data, columns, onRowClick, searchKeys = [], rowKey, emptyMessage = 'No records.',
}: {
  data: T[]; columns: ColDef<T>[]; onRowClick?: (row: T) => void;
  searchKeys?: (keyof T)[]; rowKey: (row: T) => string; emptyMessage?: string;
}) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [search,  setSearch]  = useState('');

  const filtered = useMemo(() => {
    if (!search || !searchKeys.length) return data;
    const q = search.toLowerCase();
    return data.filter((row) => searchKeys.some((k) => String((row as any)[k] ?? '').toLowerCase().includes(q)));
  }, [data, search, searchKeys]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const cmp = String((a as any)[sortKey] ?? '').localeCompare(String((b as any)[sortKey] ?? ''), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  return (
    <div className="flex flex-col">
      {searchKeys.length > 0 && (
        <div className="px-3 py-2 border-b border-app-border flex items-center gap-2">
          <Search size={13} className="text-app-muted shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…"
            className="flex-1 text-sm outline-none bg-transparent placeholder-app-muted" />
          {search && <button onClick={() => setSearch('')} className="text-xs text-app-muted hover:text-app-text">Clear</button>}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-app-bg border-b border-app-border">
              {columns.map((col) => (
                <th key={col.key} style={{ width: col.width }}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`px-3 py-2.5 text-xs font-semibold text-app-muted uppercase tracking-wide whitespace-nowrap border-b border-app-border
                    ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                    ${col.sortable !== false ? 'cursor-pointer select-none hover:text-app-text' : ''}`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable !== false && (
                      sortKey === col.key
                        ? (sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />)
                        : <ChevronsUpDown size={11} className="opacity-30" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-app-muted">{emptyMessage}</td></tr>
            ) : sorted.map((row) => (
              <tr key={rowKey(row)} onClick={() => onRowClick?.(row)}
                className={`border-b border-app-border last:border-0 transition-colors ${onRowClick ? 'cursor-pointer hover:bg-app-primary-light/30' : 'hover:bg-gray-50/60'}`}>
                {columns.map((col) => (
                  <td key={col.key} className={`px-3 py-2.5 text-app-text whitespace-nowrap
                    ${col.align === 'right' ? 'text-right font-mono' : col.align === 'center' ? 'text-center' : ''}`}>
                    {col.render ? col.render(row) : String((row as any)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-3 py-2 border-t border-app-border text-xs text-app-muted">
        {sorted.length} of {data.length} record{data.length !== 1 ? 's' : ''}{search ? ' (filtered)' : ''}
      </div>
    </div>
  );
}

export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-app-surface border border-app-border rounded-md px-4 py-2.5 flex flex-wrap items-center gap-3 mb-4">
      {children}
    </div>
  );
}

export function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-1.5 text-xs text-app-muted">
      {label}:
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="border border-app-border rounded px-2 py-1.5 bg-white text-sm text-app-text outline-none focus:border-app-primary">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
