import { useState } from 'react';
import { useRequests } from '@/context/RequestsContext';
import { PaymentRequest, STATUS_LABELS } from '@/lib/mockData';
import StatusBadge from '@/components/StatusBadge';
import { Check, X, MessageSquare, AlertTriangle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function ReviewApproval() {
  const { toast } = useToast();
  const { requests, updateStatus } = useRequests();
  const pendingRequests = requests.filter(r => r.status === 'in_review' || r.status === 'pending_clarification');
  const [selected, setSelected] = useState<PaymentRequest | null>(pendingRequests[0] || null);
  const [actionTaken, setActionTaken] = useState<Record<string, string>>({});
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [showRejectInput, setShowRejectInput] = useState<string | null>(null);
  const [rejectDraft, setRejectDraft] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; action: string; id: string }>({ open: false, action: '', id: '' });

  const executeAction = (id: string, action: string) => {
    const labels: Record<string, string> = {
      approve: 'הבקשה אושרה לתשלום',
      reject: 'הבקשה נדחתה',
      clarify: 'נשלחה בקשה להבהרות',
    };
    if (action === 'approve') updateStatus(id, 'approved');
    if (action === 'clarify') updateStatus(id, 'pending_clarification');
    setActionTaken(prev => ({ ...prev, [id]: action }));
    toast({ title: labels[action], description: `בקשה ${id}` });
  };

  const handleApproveClick = (id: string) => {
    setConfirmDialog({ open: true, action: 'approve', id });
  };

  const handleConfirmAction = () => {
    const { id, action } = confirmDialog;
    setConfirmDialog({ open: false, action: '', id: '' });
    executeAction(id, action);
  };

  const handleRejectClick = (id: string) => {
    setShowRejectInput(id);
    setRejectDraft('');
  };

  const handleRejectConfirm = (id: string) => {
    if (!rejectDraft.trim()) {
      toast({ title: 'שגיאה', description: 'יש להזין סיבת דחייה', variant: 'destructive' });
      return;
    }
    setRejectionReasons(prev => ({ ...prev, [id]: rejectDraft.trim() }));
    setShowRejectInput(null);
    setRejectDraft('');
    setConfirmDialog({ open: true, action: 'reject', id });
  };

  const confirmMessages: Record<string, { title: string; desc: string }> = {
    approve: { title: 'אישור תשלום', desc: 'האם את/ה בטוח/ה שברצונך לאשר את התשלום?' },
    reject: { title: 'דחיית בקשה', desc: 'האם את/ה בטוח/ה שברצונך לדחות את הבקשה?' },
  };

  return (
    <div className="p-4 md:p-6 animate-fade-in-up">
      <h1 className="text-2xl font-bold text-foreground mb-6">בדיקה ואישור בקשות</h1>

      <AlertDialog open={confirmDialog.open} onOpenChange={open => !open && setConfirmDialog({ open: false, action: '', id: '' })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmMessages[confirmDialog.action]?.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmMessages[confirmDialog.action]?.desc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              {confirmDialog.action === 'approve' ? 'אשר' : 'דחה'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4">
        {/* List */}
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <div className="px-4 py-3 bg-surface-alt border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            בקשות ממתינות ({pendingRequests.length})
          </div>
          <div className="divide-y divide-border max-h-[60vh] md:max-h-none overflow-y-auto">
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
                {rejectionReasons[req.id] && (
                  <p className="text-xs text-destructive mt-1 truncate">נדחה: {rejectionReasons[req.id]}</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Detail */}
        {selected ? (
          <div className="bg-card border border-border rounded-sm p-4 md:p-6 space-y-5">
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

            {rejectionReasons[selected.id] && (
              <div className="flex items-start gap-2 px-3 py-2 bg-destructive/10 text-destructive text-sm rounded-sm border border-destructive/20">
                <X className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">סיבת דחייה:</p>
                  <p>{rejectionReasons[selected.id]}</p>
                </div>
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
              <div className="space-y-3 pt-2">
                {showRejectInput === selected.id && (
                  <div className="space-y-2 p-3 bg-destructive/5 border border-destructive/20 rounded-sm">
                    <label className="text-xs font-semibold text-destructive">סיבת דחייה</label>
                    <textarea
                      value={rejectDraft}
                      onChange={e => setRejectDraft(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-sm bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-destructive/50"
                      placeholder="נא לפרט את סיבת הדחייה..."
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRejectConfirm(selected.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive text-destructive-foreground rounded-sm text-xs font-semibold hover:bg-destructive/90 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                        אשר דחייה
                      </button>
                      <button
                        onClick={() => setShowRejectInput(null)}
                        className="px-3 py-1.5 border border-border rounded-sm text-xs font-medium hover:bg-surface-alt transition-colors"
                      >
                        ביטול
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleApproveClick(selected.id)}
                    className="flex-1 flex items-center justify-center gap-2 h-10 bg-success text-success-foreground rounded-sm text-sm font-semibold hover:bg-success/90 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    אשר לתשלום
                  </button>
                  <button
                    onClick={() => handleRejectClick(selected.id)}
                    className="flex-1 flex items-center justify-center gap-2 h-10 bg-destructive text-destructive-foreground rounded-sm text-sm font-semibold hover:bg-destructive/90 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    דחה
                  </button>
                  <button
                    onClick={() => executeAction(selected.id, 'clarify')}
                    className="flex-1 flex items-center justify-center gap-2 h-10 border border-border bg-background text-foreground rounded-sm text-sm font-semibold hover:bg-surface-alt transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    בקש הבהרות
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-sm flex items-center justify-center text-muted-foreground text-sm py-16">
            בחר בקשה מהרשימה
          </div>
        )}
      </div>
    </div>
  );
}