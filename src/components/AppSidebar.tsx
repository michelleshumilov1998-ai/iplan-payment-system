import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, FilePlus, CheckSquare, BarChart3 } from 'lucide-react';
import { useRole } from '@/context/RoleContext';
import { cn } from '@/lib/utils';

const navItems: Array<{ path: string; label: string; icon: typeof FileText; roles?: string[] }> = [
  { path: '/', label: 'רשימת בקשות', icon: FileText },
  { path: '/submit', label: 'הגשת בקשה', icon: FilePlus },
  { path: '/review', label: 'בדיקה ואישור', icon: CheckSquare, roles: ['employee'] },
  { path: '/dashboard', label: 'לוח בקרה SLA', icon: BarChart3 },
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useRole();

  const filteredItems = navItems.filter(item => !item.roles || item.roles.includes(role));

  return (
    <aside className="w-[260px] shrink-0 border-l border-border bg-card min-h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-6 w-6 text-accent" />
          <div>
            <h1 className="text-base font-bold text-foreground leading-tight">מערכת בקשות תשלום</h1>
            <p className="text-xs text-muted-foreground mt-0.5">ארגון ציבורי</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {filteredItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-surface-alt hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border text-xs text-muted-foreground">
        גרסה 1.0.0 | תמיכה טכנית
      </div>
    </aside>
  );
}
