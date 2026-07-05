import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, X } from 'lucide-react';

type Sev = 'critical' | 'warning' | 'info' | 'success';

const SEV_CFG: Record<Sev, { bg: string; border: string; iconCls: string; Icon: React.ElementType }> = {
  critical: { bg: 'bg-status-critical-bg', border: 'border-status-critical/30', iconCls: 'text-status-critical', Icon: AlertCircle },
  warning:  { bg: 'bg-status-warning-bg',  border: 'border-status-warning/30',  iconCls: 'text-status-warning',  Icon: AlertTriangle },
  info:     { bg: 'bg-status-info-bg',     border: 'border-status-info/30',     iconCls: 'text-status-info',     Icon: Info },
  success:  { bg: 'bg-status-success-bg',  border: 'border-status-success/30',  iconCls: 'text-status-success',  Icon: CheckCircle },
};

export function MessageStrip({ severity, message, onDismiss, className = '' }: {
  severity: Sev; message: string; onDismiss?: () => void; className?: string;
}) {
  const c = SEV_CFG[severity];
  return (
    <div className={`flex items-start gap-2 px-3 py-2.5 border rounded text-sm ${c.bg} ${c.border} ${className}`}>
      <c.Icon size={14} className={`mt-0.5 shrink-0 ${c.iconCls}`} />
      <span className="flex-1 text-app-text leading-snug">{message}</span>
      {onDismiss && <button onClick={onDismiss} className="shrink-0 text-app-muted hover:text-app-text"><X size={13} /></button>}
    </div>
  );
}

type BadgeSev = 'critical' | 'warning' | 'info' | 'success' | 'neutral';
const BADGE_CFG: Record<BadgeSev, { bg: string; text: string; dot: string }> = {
  critical: { bg: 'bg-status-critical-bg', text: 'text-status-critical', dot: 'bg-status-critical' },
  warning:  { bg: 'bg-status-warning-bg',  text: 'text-status-warning',  dot: 'bg-status-warning'  },
  info:     { bg: 'bg-status-info-bg',     text: 'text-status-info',     dot: 'bg-status-info'     },
  success:  { bg: 'bg-status-success-bg',  text: 'text-status-success',  dot: 'bg-status-success'  },
  neutral:  { bg: 'bg-gray-100',           text: 'text-app-muted',       dot: 'bg-gray-400'        },
};

export function StatusBadge({ label, severity }: { label: string; severity: BadgeSev }) {
  const c = BADGE_CFG[severity];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
      {label}
    </span>
  );
}

export function PageHeader({ title, subtitle, breadcrumbs, actions }: {
  title: string; subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}) {
  return (
    <div className="bg-app-surface border-b border-app-border px-5 py-3.5">
      {breadcrumbs && (
        <nav className="flex items-center gap-1 text-xs text-app-muted mb-1">
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="mx-0.5 opacity-50">/</span>}
              {b.href ? <a href={b.href} className="hover:text-app-primary transition-colors">{b.label}</a>
                      : <span className="text-app-text">{b.label}</span>}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-app-text">{title}</h1>
          {subtitle && <p className="text-sm text-app-muted mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-app-surface border border-app-border rounded-md ${className}`}>{children}</div>;
}

export function Btn({ children, variant = 'primary', size = 'md', onClick, disabled, type = 'button', className = '' }: {
  children: React.ReactNode; variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md'; onClick?: () => void; disabled?: boolean; type?: 'button' | 'submit'; className?: string;
}) {
  const base = 'inline-flex items-center gap-1.5 font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  const sizes = { sm: 'px-2.5 py-1.5 text-xs', md: 'px-3.5 py-2 text-sm' };
  const variants = {
    primary:   'bg-app-primary text-white hover:bg-app-primary-hover',
    secondary: 'bg-white border border-app-border text-app-text hover:bg-gray-50',
    ghost:     'text-app-primary hover:bg-app-primary-light',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function Spinner({ size = 18 }: { size?: number }) {
  return (
    <svg className="animate-spin text-app-primary" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
    </svg>
  );
}

export function KpiCard({ label, value, unit, trend, trendDown }: {
  label: string; value: string | number; unit?: string; trend?: string; trendDown?: boolean;
}) {
  return (
    <Card className="p-4">
      <p className="text-xs text-app-muted mb-1.5">{label}</p>
      <p className="text-2xl font-semibold font-mono text-app-text">
        {value}<span className="text-base font-normal ml-0.5 text-app-muted">{unit}</span>
      </p>
      {trend && (
        <p className={`text-xs mt-1 flex items-center gap-1 ${trendDown ? 'text-status-success' : 'text-status-warning'}`}>
          {trendDown ? '▼' : '▲'} {trend}
        </p>
      )}
    </Card>
  );
}
