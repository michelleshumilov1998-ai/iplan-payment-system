import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, FilePlus, CheckSquare, BarChart3, Menu, X } from 'lucide-react';
import { useRole } from '@/context/RoleContext';
import { cn } from '@/lib/utils';

const navItems: Array<{ path: string; label: string; icon: typeof FileText; roles?: string[] }> = [
  { path: '/', label: 'רשימת בקשות', icon: FileText },
  { path: '/submit', label: 'הגשת בקשה', icon: FilePlus, roles: ['consultant'] },
  { path: '/review', label: 'בדיקה ואישור', icon: CheckSquare, roles: ['employee'] },
  { path: '/dashboard', label: 'לוח בקרה SLA', icon: BarChart3, roles: ['employee'] },
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useRole();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredItems = navItems.filter(item => !item.roles || item.roles.includes(role));

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-sm bg-primary text-primary-foreground font-black text-sm shrink-0">מת</div>
          <div>
            <h1 className="text-sm font-bold text-foreground leading-tight">מינהל התכנון</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">מערכת ניהול דרישות תשלום</p>
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
              onClick={() => handleNav(item.path)}
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
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 right-3 z-50 p-2 bg-card border border-border rounded-sm text-foreground hover:bg-surface-alt transition-colors"
        aria-label="פתח תפריט"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-[280px] bg-card border-l border-border min-h-screen flex flex-col z-10">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 left-4 p-1.5 rounded-sm hover:bg-surface-alt transition-colors"
              aria-label="סגור תפריט"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[260px] shrink-0 border-l border-border bg-card min-h-screen flex-col">
        {sidebarContent}
      </aside>
    </>
  );
}