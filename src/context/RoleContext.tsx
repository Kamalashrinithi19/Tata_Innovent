import React, { createContext, useContext, useState } from 'react';

export type Role = 'Corporate' | 'Port Officer' | 'Plant Operations';

interface RoleCtx { role: Role; setRole: (r: Role) => void; }
const Ctx = createContext<RoleCtx>({ role: 'Corporate', setRole: () => {} });

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('Corporate');
  return <Ctx.Provider value={{ role, setRole }}>{children}</Ctx.Provider>;
}

export function useRole() { return useContext(Ctx); }
