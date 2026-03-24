import { slaDashboardData, mockRequests } from '@/lib/mockData';
import StatusBadge from '@/components/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine, Legend } from 'recharts';
import { AlertTriangle, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SLADashboard() {
  const { byStatus, processingTimes, slaBreaches, totalRequests, avgProcessingDays } = slaDashboardData;

  const kpis = [
    { label: 'סה"כ בקשות', value: totalRequests, icon: TrendingUp },
    { label: 'ממוצע ימי טיפול', value: avgProcessingDays, icon: Clock },
    { label: 'חריגות SLA', value: slaBreaches, icon: AlertTriangle, alert: slaBreaches > 0 },
    { label: 'אושרו', value: mockRequests.filter(r => r.status === 'approved').length, icon: CheckCircle },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      <h1 className="text-2xl font-bold text-foreground">לוח בקרה — SLA ביצועים</h1>

      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className={cn(
              'bg-card border border-border rounded-sm p-4',
              kpi.alert && 'border-destructive/50'
            )}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={cn('h-4 w-4', kpi.alert ? 'text-destructive' : 'text-accent')} />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
              </div>
              <p className={cn('text-3xl font-bold tabular-nums', kpi.alert ? 'text-destructive' : 'text-foreground')}>
                {kpi.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-sm p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">זמני טיפול חודשיים (ממוצע ימים)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={processingTimes}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(215, 16%, 47%)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(215, 16%, 47%)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '2px',
                  fontSize: '12px',
                  direction: 'rtl',
                }}
              />
              <ReferenceLine y={30} stroke="hsl(0, 84%, 60%)" strokeDasharray="4 4" label={{ value: 'יעד SLA', position: 'right', fontSize: 11, fill: 'hsl(0, 84%, 60%)' }} />
              <Bar dataKey="avgDays" name="ימי טיפול" radius={[1, 1, 0, 0]}>
                {processingTimes.map((entry, i) => (
                  <Cell key={i} fill={entry.avgDays > 30 ? 'hsl(0, 84%, 60%)' : 'hsl(210, 100%, 36%)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-sm p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">התפלגות לפי סטטוס</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={byStatus}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                dataKey="value"
                nameKey="name"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {byStatus.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '2px',
                  fontSize: '12px',
                  direction: 'rtl',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', direction: 'rtl' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="px-4 py-3 bg-surface-alt border-b border-border flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <h2 className="text-sm font-semibold text-foreground">בקשות בחריגת SLA (מעל 90 יום)</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-right px-4 py-2.5 font-semibold text-xs">מספר בקשה</th>
              <th className="text-right px-4 py-2.5 font-semibold text-xs">כותרת</th>
              <th className="text-right px-4 py-2.5 font-semibold text-xs">סטטוס</th>
              <th className="text-right px-4 py-2.5 font-semibold text-xs">ימים פתוחים</th>
              <th className="text-right px-4 py-2.5 font-semibold text-xs">חומרה</th>
            </tr>
          </thead>
          <tbody>
            {mockRequests.filter(r => r.daysOpen > 90).map(req => (
              <tr key={req.id} className="border-b border-border bg-destructive/5">
                <td className="px-4 py-2.5 font-medium tabular-nums">{req.id}</td>
                <td className="px-4 py-2.5">{req.title}</td>
                <td className="px-4 py-2.5"><StatusBadge status={req.status} /></td>
                <td className="px-4 py-2.5 tabular-nums font-bold text-destructive">{req.daysOpen}</td>
                <td className="px-4 py-2.5">
                  <span className={cn(
                    'inline-flex items-center gap-1 text-xs font-semibold',
                    req.daysOpen > 120 ? 'text-destructive' : 'text-warning'
                  )}>
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {req.daysOpen > 120 ? 'קריטי' : 'אזהרה'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
