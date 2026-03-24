import { useState, useMemo } from 'react';
import { useRequests } from '@/context/RequestsContext';
import { STATUS_LABELS, URGENCY_LABELS, RequestStatus } from '@/lib/mockData';
import StatusBadge from '@/components/StatusBadge';
import { useRole } from '@/context/RoleContext';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, Filter, Search, Inbox, Flame, Pencil, ArrowUp, ArrowDown, ArrowUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type SortField = 'date' | 'amount' | 'urgency' | 'daysOpen';
type SortDir = 'asc' | 'desc';

const URGENCY_ORDER: Record<string, number> = { high: 3, medium: 2, low: 1 };

export default function RequestsList() {
  const { requests } = useRequests();
  const { role } = useRole();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [urgencyFilter, setUrgencyFilter] = useState<string[]>([]);
  const [statusColFilter, setStatusColFilter] = useState<RequestStatus[]>([]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filtered = useMemo(() => {
    return requests
      .filter(r => statusFilter === 'all' || r.status === statusFilter)
      .filter(r => statusColFilter.length === 0 || statusColFilter.includes(r.status))
      .filter(r => urgencyFilter.length === 0 || urgencyFilter.includes(r.urgency))
      .filter(r => {
        if (!search.trim()) return true;
        const q = search.trim().toLowerCase();
        return r.title.toLowerCase().includes(q) || r.submitter.toLowerCase().includes(q);
      })
      .slice()
      .sort((a, b) => {
        if (!sortField) return new Date(b.date).getTime() - new Date(a.date).getTime();
        const dir = sortDir === 'asc' ? 1 : -1;
        switch (sortField) {
          case 'date': return dir * (new Date(a.date).getTime() - new Date(b.date).getTime());
          case 'amount': return dir * (a.amount - b.amount);
          case 'urgency': return dir * (URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency]);
          case 'daysOpen': return dir * (a.daysOpen - b.daysOpen);
          default: return 0;
        }
      });
  }, [requests, statusFilter, statusColFilter, urgencyFilter, search, sortField, sortDir]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />;
    return sortDir === 'asc'
      ? <ArrowUp className="h-3.5 w-3.5 text-primary" />
      : <ArrowDown className="h-3.5 w-3.5 text-primary" />;
  };

  const SortableHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th
      className={cn(
        'text-right px-4 py-3 font-semibold cursor-pointer select-none hover:bg-muted/30 transition-colors',
        sortField === field && 'bg-muted/20 text-primary'
      )}
      onClick={() => toggleSort(field)}
      title={`לחץ למיון לפי ${label}`}
    >
      <div className="flex items-center gap-1.5">
        <span>{label}</span>
        <SortIcon field={field} />
      </div>
    </th>
  );

  const FilterDropdown = ({ label, options, selected, onToggle }: {
    label: string;
    options: { value: string; label: string }[];
    selected: string[];
    onToggle: (val: string) => void;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'p-0.5 rounded-sm hover:bg-muted/50 transition-colors',
            selected.length > 0 && 'text-primary'
          )}
          title={`סנן לפי ${label}`}
        >
          <Filter className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-44 p-2" dir="rtl">
        <p className="text-xs font-semibold text-muted-foreground mb-2">סנן לפי {label}</p>
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onToggle(opt.value)}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/50 transition-colors text-right"
          >
            <span className={cn(
              'h-4 w-4 rounded-sm border border-border flex items-center justify-center shrink-0',
              selected.includes(opt.value) && 'bg-primary border-primary'
            )}>
              {selected.includes(opt.value) && <Check className="h-3 w-3 text-primary-foreground" />}
            </span>
            <span>{opt.label}</span>
          </button>
        ))}
        {selected.length > 0 && (
          <button
            onClick={() => selected.forEach(v => onToggle(v))}
            className="w-full text-xs text-muted-foreground hover:text-foreground mt-1.5 py-1 text-center"
          >
            נקה סינון
          </button>
        )}
      </PopoverContent>
    </Popover>
  );

  const toggleUrgencyFilter = (val: string) => {
    setUrgencyFilter(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };
  const toggleStatusColFilter = (val: string) => {
    setStatusColFilter(prev =>
      prev.includes(val as RequestStatus)
        ? prev.filter(v => v !== val)
        : [...prev, val as RequestStatus]
    );
  };

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
              <SortableHeader field="date" label="תאריך" />
              <SortableHeader field="amount" label="סכום" />
              <th className={cn('text-right px-4 py-3 font-semibold', statusColFilter.length > 0 && 'text-primary')}>
                <div className="flex items-center gap-1.5">
                  <span>סטטוס</span>
                  <FilterDropdown
                    label="סטטוס"
                    options={Object.entries(STATUS_LABELS).map(([k, v]) => ({ value: k, label: v }))}
                    selected={statusColFilter}
                    onToggle={toggleStatusColFilter}
                  />
                </div>
              </th>
              <th
                className={cn(
                  'text-right px-4 py-3 font-semibold cursor-pointer select-none hover:bg-muted/30 transition-colors',
                  (sortField === 'urgency' || urgencyFilter.length > 0) && 'bg-muted/20 text-primary'
                )}
              >
                <div className="flex items-center gap-1.5">
                  <span className="cursor-pointer" onClick={() => toggleSort('urgency')}>דחיפות</span>
                  <span className="cursor-pointer" onClick={() => toggleSort('urgency')}><SortIcon field="urgency" /></span>
                  <FilterDropdown
                    label="דחיפות"
                    options={Object.entries(URGENCY_LABELS).map(([k, v]) => ({ value: k, label: v }))}
                    selected={urgencyFilter}
                    onToggle={toggleUrgencyFilter}
                  />
                </div>
              </th>
              <SortableHeader field="daysOpen" label="ימים פתוחים" />
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
                <td className={cn('px-4 py-3 tabular-nums text-muted-foreground', sortField === 'date' && 'bg-muted/10')}>
                  {new Date(req.date).toLocaleDateString('he-IL')}
                </td>
                <td className={cn('px-4 py-3 tabular-nums font-medium', sortField === 'amount' && 'bg-muted/10')}>
                  ₪{req.amount.toLocaleString('he-IL')}
                </td>
                <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                <td className={cn('px-4 py-3', sortField === 'urgency' && 'bg-muted/10')}>
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
                <td className={cn('px-4 py-3', sortField === 'daysOpen' && 'bg-muted/10')}>
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
