import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, User, LayoutGrid, Settings, LogOut, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useRole, Role } from '../context/RoleContext';
import { ALERTS } from '../data/mock';

const ROLES: Role[] = ['Corporate', 'Port Officer', 'Plant Operations'];

export default function ShellBar() {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const [roleOpen, setRoleOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const unread = ALERTS.filter((a) => a.severity === 'critical' || a.severity === 'warning').length;

  const close = () => { setRoleOpen(false); setBellOpen(false); setUserOpen(false); };

  return (
    <>
      {(roleOpen || bellOpen || userOpen) && (
        <div className="fixed inset-0 z-40" onClick={close} />
      )}
      <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-app-primary flex items-center px-4 gap-3">
        <Link to="/" onClick={close} className="flex items-center gap-2 shrink-0 mr-2">
          <div className="w-6 h-6 bg-white/20 rounded-sm flex items-center justify-center">
            <LayoutGrid size={13} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight hidden sm:block">Coal Logistics Intelligence</span>
          <span className="text-white font-semibold text-sm sm:hidden">CLI</span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xs hidden md:flex items-center relative">
          <Search size={12} className="absolute left-2.5 text-white/50" />
          <input placeholder="Search vessels, rakes, batches…"
            className="w-full pl-8 pr-3 py-1.5 bg-white/10 border border-white/20 rounded text-white text-xs placeholder-white/50 outline-none focus:bg-white/15 focus:border-white/40 transition-colors" />
        </div>

        <div className="ml-auto flex items-center gap-0.5">
          {/* Bell */}
          <div className="relative">
            <button onClick={() => { setBellOpen((v) => !v); setRoleOpen(false); setUserOpen(false); }}
              className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors">
              <Bell size={16} />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unread}</span>
              )}
            </button>
            {bellOpen && (
              <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-app-border rounded-md shadow-panel z-50">
                <div className="px-3 py-2 border-b border-app-border">
                  <p className="text-xs font-semibold">System Alerts ({ALERTS.length})</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {ALERTS.map((a) => {
                    const Icon = a.severity === 'critical' ? AlertCircle : a.severity === 'warning' ? AlertTriangle : Info;
                    const cls  = a.severity === 'critical' ? 'text-status-critical' : a.severity === 'warning' ? 'text-status-warning' : 'text-status-info';
                    return (
                      <div key={a.id} className="flex items-start gap-2 px-3 py-2.5 border-b border-app-border/50 last:border-0 hover:bg-gray-50">
                        <Icon size={13} className={`mt-0.5 shrink-0 ${cls}`} />
                        <div>
                          <p className="text-xs text-app-text leading-snug">{a.message}</p>
                          <p className="text-xs text-app-muted mt-0.5">{a.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Role switcher */}
          <div className="relative">
            <button onClick={() => { setRoleOpen((v) => !v); setBellOpen(false); setUserOpen(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-white/90 hover:bg-white/10 rounded transition-colors">
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                role === 'Corporate' ? 'bg-purple-200 text-purple-800' :
                role === 'Port Officer' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'
              }`}>{role === 'Plant Operations' ? 'Plant Ops' : role}</span>
              <ChevronDown size={12} className="text-white/60" />
            </button>
            {roleOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-app-border rounded-md shadow-panel z-50 py-1">
                <p className="px-3 py-1.5 text-[10px] text-app-muted font-semibold uppercase tracking-wide border-b border-app-border mb-1">Switch Role</p>
                {ROLES.map((r) => (
                  <button key={r} onClick={() => { setRole(r); close(); navigate('/'); }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${r === role ? 'text-app-primary font-semibold' : 'text-app-text'}`}>
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User */}
          <div className="relative">
            <button onClick={() => { setUserOpen((v) => !v); setBellOpen(false); setRoleOpen(false); }}
              className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors ml-1">
              <User size={14} />
            </button>
            {userOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-app-border rounded-md shadow-panel z-50 py-1">
                <div className="px-3 py-2 border-b border-app-border">
                  <p className="text-xs font-semibold text-app-text">Admin User</p>
                  <p className="text-xs text-app-muted">{role}</p>
                </div>
                <button className="w-full text-left px-3 py-2 text-sm text-app-text hover:bg-gray-50 flex items-center gap-2"><Settings size={13} /> Settings</button>
                <button className="w-full text-left px-3 py-2 text-sm text-app-text hover:bg-gray-50 flex items-center gap-2"><LogOut size={13} /> Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
