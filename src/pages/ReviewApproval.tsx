import { useState } from 'react';
import { mockRequests, PaymentRequest, STATUS_LABELS } from '@/lib/mockData';
import StatusBadge from '@/components/StatusBadge';
import { Check, X, MessageSquare, AlertTriangle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ReviewApproval() {
  const { toast } = useToast();
  const pendingRequests = mockRequests.filter(r => r.status === 'in_review' || r.status === 'pending_clarification');
  const [selected, setSelected] = useState<PaymentRequest | null>(pendingRequests[0] || null);
  const [actionTaken, setActionTaken] = useState<Record<string, string>>({});

  const handleAction = (id: string, action: string) => {
    const labels: Record<string, string> = {
      approve: 'הבקשה אושרה לתשלום',
      reject: 'הבקשה נדחתה',
      clarify: 'נשלחה בקשה להבהרות',
    };
    setActionTaken(prev => ({ ...prev, [id]: action }));
    toast({ title: labels[action], description: `בקשה ${id}` });
  };

  return (
    <div className="p-6 animate-fade-in-up">
      <h1 className="text-2xl font-bold text-foreground mb-6">בדיקה ואישור בקשות</h1>

      <div className="grid grid-cols-[300px_1fr] gap-4">
        {/* List */}
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <div className="px-4 py-3 bg-surface-alt border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            בקשות ממתינות ({pendingRequests.length})
          </div>
          <div className="divide-y divide-border">
            {pendingRequests.map(req => (
              <button
                key={req.id}
                onClick={() => setSelected(req)}
                className={cn(
                  'w-full text-right px-4 py-3 hover:bg-surface-alt transition-colors',
                  selected?.id === req.id && 'bg-surface-alt',
                  actionTaken[req.id] && 'opacity-50'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{req.id}</span>
                  {req.daysOpen > 90 && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{req.title}</p>
                <div className="mt-1"><StatusBadge status={req.status} /></div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail */}
        {selected ? (
          <div className="bg-card border border-border rounded-sm p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">{selected.title}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{selected.id} · {selected.submitter}</p>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            {selected.daysOpen > 90 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 text-destructive text-sm font-medium rounded-sm border border-destructive/20">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                חריגת SLA — הבקשה פתוחה {selected.daysOpen} ימים (מעל 90 יום)
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['תאריך הגשה', new Date(selected.date).toLocaleDateString('he-IL')],
                ['סכום', `₪${selected.amount.toLocaleString('he-IL')}`],
                ['פרויקט', selected.project],
                ['יחידה', selected.unit],
                ['דחיפות', selected.urgency === 'high' ? 'גבוהה' : selected.urgency === 'medium' ? 'בינונית' : 'נמוכה'],
                ['ימים פתוחים', String(selected.daysOpen)],
              ].map(([label, val], i) => (
                <div key={i} className="space-y-0.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
                  <p className="text-foreground font-medium tabular-nums">{val}</p>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">תיאור</p>
              <p className="text-sm text-foreground leading-relaxed">{selected.description}</p>
            </div>

            {selected.attachments.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">קבצים מצורפים</p>
                <div className="space-y-1">
                  {selected.attachments.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-accent font-medium">
                      <FileText className="h-3.5 w-3.5" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selected.notes && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">הערות</p>
                <p className="text-sm text-muted-foreground">{selected.notes}</p>
              </div>
            )}

            {/* Actions */}
            {actionTaken[selected.id] ? (
              <div className="text-sm font-medium text-success text-center py-3">
                פעולה בוצעה בהצלחה
              </div>
            ) : (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleAction(selected.id, 'approve')}
                  className="flex-1 flex items-center justify-center gap-2 h-10 bg-success text-success-foreground rounded-sm text-sm font-semibold hover:bg-success/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  <Check className="h-4 w-4" />
                  אשר לתשלום
                </button>
                <button
                  onClick={() => handleAction(selected.id, 'reject')}
                  className="flex-1 flex items-center justify-center gap-2 h-10 bg-destructive text-destructive-foreground rounded-sm text-sm font-semibold hover:bg-destructive/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  <X className="h-4 w-4" />
                  דחה
                </button>
                <button
                  onClick={() => handleAction(selected.id, 'clarify')}
                  className="flex-1 flex items-center justify-center gap-2 h-10 border border-border bg-background text-foreground rounded-sm text-sm font-semibold hover:bg-surface-alt transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  בקש הבהרות
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-sm flex items-center justify-center text-muted-foreground text-sm">
            בחר בקשה מהרשימה
          </div>
        )}
      </div>
    </div>
  );
}
