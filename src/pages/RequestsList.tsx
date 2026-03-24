import { useState } from 'react';
import { mockRequests, STATUS_LABELS, URGENCY_LABELS, RequestStatus } from '@/lib/mockData';
import StatusBadge from '@/components/StatusBadge';
import { AlertTriangle, Clock, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RequestsList() {
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');

  const filtered = (statusFilter === 'all'
    ? mockRequests
    : mockRequests.filter(r => r.status === statusFilter)
  ).slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">רשימת בקשות תשלום</h1>
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

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'סה"כ בקשות', value: mockRequests.length },
          { label: 'ממתינות לבדיקה', value: mockRequests.filter(r => r.status === 'in_review').length },
          { label: 'חריגות SLA (90+)', value: mockRequests.filter(r => r.daysOpen > 90).length, alert: true },
          { label: 'אושרו לתשלום', value: mockRequests.filter(r => r.status === 'approved').length },
        ].map((kpi, i) => (
          <div key={i} className={cn(
            'bg-card border border-border rounded-sm p-4',
            kpi.alert && mockRequests.some(r => r.daysOpen > 90) && 'border-destructive/50'
          )}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
            <p className={cn('text-2xl font-bold mt-1 tabular-nums', kpi.alert ? 'text-destructive' : 'text-foreground')}>
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <table className="w-full text-sm">
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
            </tr>
          </thead>
          <tbody>
            {filtered.map(req => (
              <tr
                key={req.id}
                className={cn(
                  'border-b border-border hover:bg-surface-alt transition-colors',
                  req.daysOpen > 90 && 'bg-destructive/5'
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
                  <span className={cn(
                    'text-xs font-medium',
                    req.urgency === 'high' ? 'text-destructive' : req.urgency === 'medium' ? 'text-warning' : 'text-muted-foreground'
                  )}>
                    {URGENCY_LABELS[req.urgency]}
                  </span>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
