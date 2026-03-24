import { useRole } from '@/context/RoleContext';
import { ArrowLeftRight, User } from 'lucide-react';

export default function AppHeader() {
  const { role, toggleRole, roleLabel } = useRole();

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleRole}
          className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-border bg-background text-sm font-medium text-foreground hover:bg-surface-alt transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          <span>החלף תפקיד</span>
        </button>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-primary/10 text-primary text-xs font-semibold">
          <User className="h-3 w-3" />
          {roleLabel}
        </div>
      </div>
      <div className="text-xs text-muted-foreground tabular-nums">
        {new Date().toLocaleDateString('he-IL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </header>
  );
}
