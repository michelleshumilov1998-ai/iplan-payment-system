import { useState } from 'react';
import { useRequests } from '@/context/RequestsContext';
import { STATUS_LABELS, URGENCY_LABELS, RequestStatus } from '@/lib/mockData';
import StatusBadge from '@/components/StatusBadge';
import { useRole } from '@/context/RoleContext';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, Filter, Search, Inbox, Flame, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RequestsList() {
  const { requests } = useRequests();
  const { role } = useRole();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = requests
    .filter(r => statusFilter === 'all' || r.status === statusFilter)
    .filter(r => {
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return r.title.toLowerCase().includes(q) || r.submitter.toLowerCase().includes(q);
    })
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">רשימת בקשות תשלום</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="חיפוש לפי שם או כותרת..."
              className="h-9 pr-9 pl-3 w-48 md:w-56 text-sm border border-border rounded-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as RequestStatus | 'all')}
              className="text-sm border border-border rounded-sm px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">כל הסטטוסים</option>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'סה"כ בקשות', value: requests.length },
          { label: 'ממתינות לבדיקה', value: requests.filter(r => r.status === 'in_review').length },
          { label: 'חריגות SLA (90+)', value: requests.filter(r => r.daysOpen > 90).length, alert: true },
          { label: 'אושרו לתשלום', value: requests.filter(r => r.status === 'approved').length },
        ].map((kpi, i) => (
          <div key={i} className={cn(
            'bg-card border border-border rounded-sm p-3 md:p-4',
            kpi.alert && requests.some(r => r.daysOpen > 90) && 'border-destructive/50'
          )}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
            <p className={cn('text-xl md:text-2xl font-bold mt-1 tabular-nums', kpi.alert ? 'text-destructive' : 'text-foreground')}>
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile card view */}
      <div className="block md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 text-muted-foreground py-16 bg-card border border-border rounded-sm">
            <Inbox className="h-10 w-10 opacity-40" />
            <p className="text-sm font-medium">לא נמצאו בקשות תואמות</p>
            <p className="text-xs">נסה לשנות את מילות החיפוש או את הסינון</p>
          </div>
        ) : filtered.map(req => (
          <div
            key={req.id}
            className={cn(
              'bg-card border border-border rounded-sm p-4 space-y-2',
              req.daysOpen > 90 && 'border-destructive/40 bg-destructive/5',
              req.status === 'pending_clarification' && role === 'consultant' && 'border-warning/50 bg-warning/5'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold tabular-nums">{req.id}</span>
              <StatusBadge status={req.status} />
            </div>
            <p className="text-sm font-medium text-foreground">{req.title}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{req.submitter}</span>
              <span className="tabular-nums">{new Date(req.date).toLocaleDateString('he-IL')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium tabular-nums">₪{req.amount.toLocaleString('he-IL')}</span>
              <div className="flex items-center gap-1.5">
                {req.urgency === 'high' && req.daysOpen > 60 && (
                  <Flame className="h-4 w-4 text-destructive" />
                )}
                {req.daysOpen > 90 && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-destructive/15 text-destructive text-xs font-bold border border-destructive/30">
                    <AlertTriangle className="h-3 w-3" />
                    SLA
                  </span>
                )}
              </div>
            </div>
            {role === 'consultant' && req.status === 'pending_clarification' && (
              <button
                onClick={() => navigate(`/submit?edit=${req.id}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 mt-1 bg-warning/15 text-warning border border-warning/30 rounded-sm text-xs font-semibold hover:bg-warning/25 transition-colors w-full justify-center"
              >
                <Pencil className="h-3.5 w-3.5" />
                ערוך ושלח מחדש
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card border border-border rounded-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="bg-surface-alt border-b border-border text-muted-foreground">
              <th className="text-right px-4 py-3 font-semibold">מספר בקשה</th>
              <th className="text-right px-4 py-3 font-semibold">כותרת</th>
              <th className="text-right px-4 py-3 font-semibold">מגיש</th>
              <th className="text-right px-4 py-3 font-semibold">תאריך</th>
              <th className="text-right px-4 py-3 font-semibold">סכום</th>
              <th className="text-right px-4 py-3 font-semibold">סטטוס</th>
              <th className="text-right px-4 py-3 font-semibold">דחיפות</th>
              <th className="text-right px-4 py-3 font-semibold">ימים פתוחים</th>
              {role === 'consultant' && <th className="text-right px-4 py-3 font-semibold">פעולות</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={role === 'consultant' ? 9 : 8} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Inbox className="h-10 w-10 opacity-40" />
                    <p className="text-sm font-medium">לא נמצאו בקשות תואמות</p>
                    <p className="text-xs">נסה לשנות את מילות החיפוש או את הסינון</p>
                  </div>
                </td>
              </tr>
            ) : filtered.map(req => (
              <tr
                key={req.id}
                className={cn(
                  'border-b border-border hover:bg-surface-alt transition-colors',
                  req.daysOpen > 90 && 'bg-destructive/5',
                  req.status === 'pending_clarification' && role === 'consultant' && 'bg-warning/5'
                )}
              >
                <td className="px-4 py-3 font-medium tabular-nums">{req.id}</td>
                <td className="px-4 py-3">{req.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{req.submitter}</td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">
                  {new Date(req.date).toLocaleDateString('he-IL')}
                </td>
                <td className="px-4 py-3 tabular-nums font-medium">
                  ₪{req.amount.toLocaleString('he-IL')}
                </td>
                <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      'text-xs font-medium',
                      req.urgency === 'high' ? 'text-destructive' : req.urgency === 'medium' ? 'text-warning' : 'text-muted-foreground'
                    )}>
                      {URGENCY_LABELS[req.urgency]}
                    </span>
                    {req.urgency === 'high' && req.daysOpen > 60 && (
                      <Flame className="h-4 w-4 text-destructive animate-pulse" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="tabular-nums">{req.daysOpen}</span>
                    {req.daysOpen > 90 && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-destructive/15 text-destructive text-xs font-bold border border-destructive/30">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        חריגת SLA
                      </span>
                    )}
                    {req.daysOpen > 60 && req.daysOpen <= 90 && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-warning/15 text-warning text-xs font-semibold border border-warning/30">
                        <Clock className="h-3.5 w-3.5" />
                        קרוב ל-SLA
                      </span>
                    )}
                  </div>
                </td>
                {role === 'consultant' && (
                  <td className="px-4 py-3">
                    {req.status === 'pending_clarification' && (
                      <button
                        onClick={() => navigate(`/submit?edit=${req.id}`)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-warning/15 text-warning border border-warning/30 rounded-sm text-xs font-semibold hover:bg-warning/25 transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        ערוך
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}