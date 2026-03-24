export type RequestStatus = 'draft' | 'in_review' | 'pending_clarification' | 'approved';

export interface PaymentRequest {
  id: string;
  title: string;
  submitter: string;
  submitterRole: 'consultant' | 'employee';
  date: string;
  amount: number;
  status: RequestStatus;
  urgency: 'low' | 'medium' | 'high';
  project: string;
  unit: string;
  description: string;
  attachments: string[];
  notes: string;
  daysOpen: number;
}

export const STATUS_LABELS: Record<RequestStatus, string> = {
  draft: 'טיוטה',
  in_review: 'בבדיקה',
  pending_clarification: 'ממתין להבהרות',
  approved: 'אושר לתשלום',
};

export const URGENCY_LABELS: Record<string, string> = {
  low: 'נמוכה',
  medium: 'בינונית',
  high: 'גבוהה',
};

export const PROJECTS = [
  'פרויקט תשתיות דיגיטליות',
  'פרויקט שדרוג מערכות',
  'פרויקט ייעוץ אסטרטגי',
  'פרויקט הדרכה ופיתוח',
  'פרויקט אבטחת מידע',
];

export const UNITS = [
  'אגף תקציבים',
  'אגף כספים',
  'אגף מערכות מידע',
  'אגף משאבי אנוש',
  'אגף לוגיסטיקה',
];

export const mockRequests: PaymentRequest[] = [
  {
    id: 'REQ-2024-001',
    title: 'ייעוץ אסטרטגי Q4',
    submitter: 'דוד כהן',
    submitterRole: 'consultant',
    date: '2024-12-15',
    amount: 45000,
    status: 'in_review',
    urgency: 'high',
    project: 'פרויקט ייעוץ אסטרטגי',
    unit: 'אגף תקציבים',
    description: 'שירותי ייעוץ אסטרטגי לרבעון הרביעי כולל ניתוח שוק ותכנון תקציבי',
    attachments: ['חשבונית_Q4.pdf', 'דוח_ביצוע.xlsx'],
    notes: '',
    daysOpen: 95,
  },
  {
    id: 'REQ-2024-002',
    title: 'פיתוח מערכת CRM',
    submitter: 'שרה לוי',
    submitterRole: 'employee',
    date: '2025-01-08',
    amount: 120000,
    status: 'pending_clarification',
    urgency: 'medium',
    project: 'פרויקט שדרוג מערכות',
    unit: 'אגף מערכות מידע',
    description: 'פיתוח והטמעת מערכת CRM חדשה לארגון',
    attachments: ['הצעת_מחיר.pdf'],
    notes: 'נדרש פירוט נוסף לגבי שלבי הפרויקט',
    daysOpen: 72,
  },
  {
    id: 'REQ-2025-003',
    title: 'הדרכת עובדים - מודול בטיחות',
    submitter: 'יוסי אברהם',
    submitterRole: 'consultant',
    date: '2025-02-01',
    amount: 18500,
    status: 'approved',
    urgency: 'low',
    project: 'פרויקט הדרכה ופיתוח',
    unit: 'אגף משאבי אנוש',
    description: 'סדרת הדרכות בנושא בטיחות בעבודה - 12 מפגשים',
    attachments: ['תכנית_הדרכה.pdf', 'חשבונית.pdf'],
    notes: 'אושר על ידי מנהל אגף',
    daysOpen: 15,
  },
  {
    id: 'REQ-2025-004',
    title: 'סקר אבטחת מידע שנתי',
    submitter: 'רונית בר',
    submitterRole: 'consultant',
    date: '2024-11-20',
    amount: 67000,
    status: 'in_review',
    urgency: 'high',
    project: 'פרויקט אבטחת מידע',
    unit: 'אגף מערכות מידע',
    description: 'ביצוע סקר אבטחת מידע מקיף כולל מבדקי חדירה',
    attachments: ['דוח_סקר.pdf', 'ממצאים.xlsx', 'המלצות.pdf'],
    notes: '',
    daysOpen: 120,
  },
  {
    id: 'REQ-2025-005',
    title: 'שדרוג תשתיות רשת',
    submitter: 'אמיר גולן',
    submitterRole: 'employee',
    date: '2025-02-20',
    amount: 230000,
    status: 'draft',
    urgency: 'medium',
    project: 'פרויקט תשתיות דיגיטליות',
    unit: 'אגף מערכות מידע',
    description: 'שדרוג תשתיות הרשת הפנימית כולל החלפת ציוד פעיל',
    attachments: [],
    notes: '',
    daysOpen: 5,
  },
  {
    id: 'REQ-2025-006',
    title: 'ייעוץ משפטי - מכרזים',
    submitter: 'מיכל שגב',
    submitterRole: 'consultant',
    date: '2024-10-05',
    amount: 35000,
    status: 'pending_clarification',
    urgency: 'high',
    project: 'פרויקט ייעוץ אסטרטגי',
    unit: 'אגף לוגיסטיקה',
    description: 'ליווי משפטי לתהליכי מכרזים ורכש',
    attachments: ['חוות_דעת.pdf'],
    notes: 'ממתין לאישור הלשכה המשפטית',
    daysOpen: 165,
  },
  {
    id: 'REQ-2025-007',
    title: 'רכש ציוד משרדי',
    submitter: 'תמר נוה',
    submitterRole: 'employee',
    date: '2025-03-01',
    amount: 8200,
    status: 'approved',
    urgency: 'low',
    project: 'פרויקט תשתיות דיגיטליות',
    unit: 'אגף לוגיסטיקה',
    description: 'רכש ריהוט וציוד משרדי לקומה 3',
    attachments: ['הזמנה.pdf', 'חשבונית.pdf'],
    notes: 'בוצע תשלום',
    daysOpen: 3,
  },
  {
    id: 'REQ-2025-008',
    title: 'פיתוח אפליקציית דיווח',
    submitter: 'נועם רז',
    submitterRole: 'consultant',
    date: '2025-01-15',
    amount: 95000,
    status: 'in_review',
    urgency: 'medium',
    project: 'פרויקט שדרוג מערכות',
    unit: 'אגף מערכות מידע',
    description: 'פיתוח אפליקציה מובילית לדיווח שעות ומשימות',
    attachments: ['מפרט_טכני.pdf', 'לוח_זמנים.xlsx'],
    notes: '',
    daysOpen: 65,
  },
];

// SLA data for charts
export const slaDashboardData = {
  byStatus: [
    { name: 'טיוטה', value: mockRequests.filter(r => r.status === 'draft').length, color: 'hsl(215, 16%, 47%)' },
    { name: 'בבדיקה', value: mockRequests.filter(r => r.status === 'in_review').length, color: 'hsl(210, 100%, 36%)' },
    { name: 'ממתין להבהרות', value: mockRequests.filter(r => r.status === 'pending_clarification').length, color: 'hsl(38, 92%, 50%)' },
    { name: 'אושר לתשלום', value: mockRequests.filter(r => r.status === 'approved').length, color: 'hsl(160, 84%, 39%)' },
  ],
  processingTimes: [
    { name: 'ינואר', avgDays: 22, target: 30 },
    { name: 'פברואר', avgDays: 35, target: 30 },
    { name: 'מרץ', avgDays: 18, target: 30 },
    { name: 'אפריל', avgDays: 42, target: 30 },
    { name: 'מאי', avgDays: 28, target: 30 },
    { name: 'יוני', avgDays: 55, target: 30 },
    { name: 'יולי', avgDays: 31, target: 30 },
    { name: 'אוגוסט', avgDays: 25, target: 30 },
  ],
  slaBreaches: mockRequests.filter(r => r.daysOpen > 90).length,
  totalRequests: mockRequests.length,
  avgProcessingDays: Math.round(mockRequests.reduce((a, r) => a + r.daysOpen, 0) / mockRequests.length),
};
