import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PROJECTS, UNITS } from '@/lib/mockData';
import { useRequests } from '@/context/RequestsContext';
import { Upload, Send, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FieldErrors {
  title?: string;
  description?: string;
  amount?: string;
  project?: string;
  unit?: string;
}

export default function SubmissionForm() {
  const { toast } = useToast();
  const { getRequest } = useRequests();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('edit');

  const [form, setForm] = useState({
    title: '',
    description: '',
    amount: '',
    project: '',
    unit: '',
    urgency: 'medium',
  });
  const [files, setFiles] = useState<string[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (editId) {
      const req = getRequest(editId);
      if (req) {
        setForm({
          title: req.title,
          description: req.description,
          amount: String(req.amount),
          project: req.project,
          unit: req.unit,
          urgency: req.urgency,
        });
        setFiles(req.attachments);
      }
    }
  }, [editId, getRequest]);

  const validate = (): boolean => {
    const e: FieldErrors = {};
    if (!form.title.trim()) e.title = 'שדה זה הוא חובה';
    if (!form.description.trim()) e.description = 'שדה זה הוא חובה';
    if (!form.amount.trim()) {
      e.amount = 'שדה זה הוא חובה';
    } else if (parseFloat(form.amount) <= 0) {
      e.amount = 'הסכום חייב להיות גדול מ-0';
    }
    if (!form.project) e.project = 'שדה זה הוא חובה';
    if (!form.unit) e.unit = 'שדה זה הוא חובה';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const clearError = (field: keyof FieldErrors) => {
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleFileUpload = () => {
    const fakeFiles = ['חשבונית_' + Date.now() + '.pdf'];
    setFiles(prev => [...prev, ...fakeFiles]);
    toast({ title: 'קובץ הועלה בהצלחה', description: fakeFiles[0] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const msg = editId ? 'הבקשה עודכנה ונשלחה מחדש' : 'הבקשה הוגשה בהצלחה';
    toast({ title: msg, description: editId ? `בקשה ${editId}` : 'מספר בקשה: REQ-2025-009' });
    setForm({ title: '', description: '', amount: '', project: '', unit: '', urgency: 'medium' });
    setFiles([]);
    setErrors({});
    if (editId) navigate('/');
  };

  const inputClass = (field: keyof FieldErrors, base: string) =>
    `${base} ${errors[field] ? 'border-destructive ring-1 ring-destructive/30' : ''}`;

  return (
    <div className="p-4 md:p-6 max-w-2xl animate-fade-in-up">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        {editId ? `עריכת בקשה ${editId}` : 'הגשת בקשת תשלום חדשה'}
      </h1>

      {editId && (
        <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-warning/10 text-warning text-sm font-medium rounded-sm border border-warning/20">
          בקשה זו הוחזרה להבהרות — ערוך ושלח מחדש
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="bg-card border border-border rounded-sm p-4 md:p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">כותרת הבקשה</label>
          <input
            value={form.title}
            onChange={e => { setForm(f => ({ ...f, title: e.target.value })); clearError('title'); }}
            className={inputClass('title', 'w-full h-10 px-3 border border-border rounded-sm bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent')}
            placeholder="תיאור קצר של הבקשה"
          />
          {errors.title && <p className="text-xs font-medium text-destructive">{errors.title}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">פרטי ביצוע</label>
          <textarea
            value={form.description}
            onChange={e => { setForm(f => ({ ...f, description: e.target.value })); clearError('description'); }}
            rows={4}
            className={inputClass('description', 'w-full px-3 py-2 border border-border rounded-sm bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent')}
            placeholder="פירוט העבודה שבוצעה, תוצרים, אבני דרך..."
          />
          {errors.description && <p className="text-xs font-medium text-destructive">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">סכום (₪)</label>
            <input
              type="number"
              step="any"
              value={form.amount}
              onChange={e => { setForm(f => ({ ...f, amount: e.target.value })); clearError('amount'); }}
              className={inputClass('amount', 'w-full h-10 px-3 border border-border rounded-sm bg-background text-foreground text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-accent')}
              placeholder="0"
            />
            {errors.amount && <p className="text-xs font-medium text-destructive">{errors.amount}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">דחיפות</label>
            <select
              value={form.urgency}
              onChange={e => setForm(f => ({ ...f, urgency: e.target.value }))}
              className="w-full h-10 px-3 border border-border rounded-sm bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="low">נמוכה</option>
              <option value="medium">בינונית</option>
              <option value="high">גבוהה</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">פרויקט</label>
            <select
              value={form.project}
              onChange={e => { setForm(f => ({ ...f, project: e.target.value })); clearError('project'); }}
              className={inputClass('project', 'w-full h-10 px-3 border border-border rounded-sm bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent')}
            >
              <option value="">בחר פרויקט</option>
              {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.project && <p className="text-xs font-medium text-destructive">{errors.project}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">יחידה ארגונית</label>
            <select
              value={form.unit}
              onChange={e => { setForm(f => ({ ...f, unit: e.target.value })); clearError('unit'); }}
              className={inputClass('unit', 'w-full h-10 px-3 border border-border rounded-sm bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent')}
            >
              <option value="">בחר יחידה</option>
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            {errors.unit && <p className="text-xs font-medium text-destructive">{errors.unit}</p>}
          </div>
        </div>

        {/* File upload */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">קבצים מצורפים</label>
          <button
            type="button"
            onClick={handleFileUpload}
            className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-border rounded-sm text-sm text-muted-foreground hover:bg-surface-alt hover:text-foreground transition-colors w-full justify-center"
          >
            <Upload className="h-4 w-4" />
            לחץ להעלאת קובץ (סימולציה)
          </button>
          {files.length > 0 && (
            <div className="space-y-1">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  {f}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full h-10 bg-primary text-primary-foreground rounded-sm text-sm font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <Send className="h-4 w-4" />
          {editId ? 'שלח מחדש' : 'הגש בקשה'}
        </button>
      </form>
    </div>
  );
}