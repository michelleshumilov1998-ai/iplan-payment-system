import { useRole } from '@/context/RoleContext';
import { ArrowLeftRight, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AppHeader() {
  const { role, toggleRole, roleLabel } = useRole();

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-2 mr-10 md:mr-0">
        <button
          onClick={toggleRole}
          className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-sm border-2 border-accent bg-accent/10 text-sm font-bold text-accent hover:bg-accent/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <ArrowLeftRight className="h-4 w-4" />
          <span className="hidden sm:inline">החלף תפקיד</span>
        </button>
        <div className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-sm text-sm font-bold',
          role === 'employee' ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-warning/15 text-warning border border-warning/30'
        )}>
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{roleLabel}</span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground tabular-nums hidden sm:block">
        {new Date().toLocaleDateString('he-IL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </header>
  );
}