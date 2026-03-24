import { useState } from 'react';
import { PROJECTS, UNITS } from '@/lib/mockData';
import { Upload, Send, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SubmissionForm() {
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: '',
    description: '',
    amount: '',
    project: '',
    unit: '',
    urgency: 'medium',
  });
  const [files, setFiles] = useState<string[]>([]);

  const handleFileUpload = () => {
    const fakeFiles = ['חשבונית_' + Date.now() + '.pdf'];
    setFiles(prev => [...prev, ...fakeFiles]);
    toast({ title: 'קובץ הועלה בהצלחה', description: fakeFiles[0] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'הבקשה הוגשה בהצלחה', description: 'מספר בקשה: REQ-2025-009' });
    setForm({ title: '', description: '', amount: '', project: '', unit: '', urgency: 'medium' });
    setFiles([]);
  };

  return (
    <div className="p-6 max-w-2xl animate-fade-in-up">
      <h1 className="text-2xl font-bold text-foreground mb-6">הגשת בקשת תשלום חדשה</h1>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-sm p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">כותרת הבקשה</label>
          <input
            required
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full h-10 px-3 border border-border rounded-sm bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="תיאור קצר של הבקשה"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">פרטי ביצוע</label>
          <textarea
            required
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-sm bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="פירוט העבודה שבוצעה, תוצרים, אבני דרך..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">סכום (₪)</label>
            <input
              required
              type="number"
              min="0.01"
              step="any"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              className="w-full h-10 px-3 border border-border rounded-sm bg-background text-foreground text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="0"
            />
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">פרויקט</label>
            <select
              required
              value={form.project}
              onChange={e => setForm(f => ({ ...f, project: e.target.value }))}
              className="w-full h-10 px-3 border border-border rounded-sm bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">בחר פרויקט</option>
              {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">יחידה ארגונית</label>
            <select
              required
              value={form.unit}
              onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
              className="w-full h-10 px-3 border border-border rounded-sm bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">בחר יחידה</option>
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
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
          הגש בקשה
        </button>
      </form>
    </div>
  );
}
