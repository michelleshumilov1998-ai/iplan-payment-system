import { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'consultant' | 'employee';

interface RoleContextType {
  role: Role;
  toggleRole: () => void;
  roleLabel: string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('employee');

  const toggleRole = () => setRole(r => r === 'employee' ? 'consultant' : 'employee');
  const roleLabel = role === 'employee' ? 'עובד ארגון' : 'יועץ חיצוני';

  return (
    <RoleContext.Provider value={{ role, toggleRole, roleLabel }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
