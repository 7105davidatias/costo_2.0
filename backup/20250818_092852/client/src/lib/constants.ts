export const CATEGORIES = [
  "חומרה - מחשבים",
  "חומרה - שרתים", 
  "חומרה - רשת",
  "תוכנה - מערכות הפעלה",
  "תוכנה - יישומים",
  "ריהוט משרדי",
  "ציוד משרדי",
  "שירותים מקצועיים",
] as const;

export const DEPARTMENTS = [
  "IT",
  "משאבי אנוש",
  "כספים",
  "שיווק",
  "מכירות",
  "תפעול",
  "מחקר ופיתוח",
  "רכש",
] as const;

export const PRIORITIES = [
  { value: 'low', label: 'נמוכה', color: 'bg-success/20 text-success' },
  { value: 'medium', label: 'בינונית', color: 'bg-warning/20 text-warning' },
  { value: 'high', label: 'גבוהה', color: 'bg-destructive/20 text-destructive' },
] as const;

export const STATUSES = [
  { value: 'new', label: 'חדש', color: 'bg-primary/20 text-primary' },
  { value: 'processing', label: 'בעיבוד', color: 'bg-warning/20 text-warning' },
  { value: 'completed', label: 'הושלם', color: 'bg-success/20 text-success' },
  { value: 'cancelled', label: 'בוטל', color: 'bg-destructive/20 text-destructive' },
] as const;

export const FILE_TYPES = {
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  EXTENSIONS: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
} as const;

export const CURRENCY_FORMAT = {
  style: 'currency',
  currency: 'ILS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
} as const;

export const AI_ANALYSIS_STEPS = [
  {
    id: 'document-processing',
    title: 'עיבוד מסמכים',
    description: 'ניתוח וחילוץ טקסט מהמסמכים',
  },
  {
    id: 'spec-extraction',
    title: 'חילוץ מפרטים',
    description: 'זיהוי מפרטים טכניים ודרישות',
  },
  {
    id: 'market-analysis',
    title: 'ניתוח שוק',
    description: 'השוואת מחירים ואיתור ספקים',
  },
  {
    id: 'cost-calculation',
    title: 'חישוב עלויות',
    description: 'הערכת עלות מבוססת AI',
  },
] as const;

export const RISK_LEVELS = [
  { value: 'low', label: 'נמוך', color: 'bg-success/20 text-success' },
  { value: 'medium', label: 'בינוני', color: 'bg-warning/20 text-warning' },
  { value: 'high', label: 'גבוה', color: 'bg-destructive/20 text-destructive' },
] as const;

export const CHART_COLORS = {
  PRIMARY: 'hsl(var(--primary))',
  SECONDARY: 'hsl(var(--secondary))',
  SUCCESS: 'hsl(var(--success))',
  WARNING: 'hsl(var(--warning))',
  DESTRUCTIVE: 'hsl(var(--destructive))',
  MUTED: 'hsl(var(--muted))',
} as const;
