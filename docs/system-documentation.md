
# מסמך תיעוד מערכת ניהול אומדני עלויות רכש
**גרסת פיתוח נוכחית - ינואר 2025**

## תקציר מנהלים

מערכת ניהול אומדני עלויות רכש היא אפליקציית ווב מקיפה המסייעת לארגונים ליצור אומדני עלויות מדויקים לדרישות רכש באמצעות בינה מלאכותית. המערכת מנתחת מסמכי רכש, חולצת מפרטים ומספקת אומדני עלויות חכמים עם יכולות מחקר שוק.

## ארכיטקטורת המערכת

### ארכיטקטורת Frontend
- **Framework**: React 18 עם TypeScript
- **ספריית UI**: רכיבי Radix UI עם יישום מותאם של shadcn/ui
- **עיצוב**: Tailwind CSS עם ערכת נושא כהה מותאמת
- **ניהול מצב**: React Query (TanStack Query) למצב שרת
- **ניווט**: Wouter לניווט צד לקוח קל משקל
- **תרשימים**: Recharts לויזואליזציה של נתונים
- **תמיכה בשפה**: עברית (RTL) עם ספרות ערביות

### ארכיטקטורת Backend
- **Runtime**: Node.js עם Express.js
- **שפה**: TypeScript עם מודולי ESM
- **סגנון API**: ארכיטקטורת RESTful API
- **עיבוד קבצים**: Multer לטיפול בהעלאות מסמכים
- **פיתוח**: Vite לפיתוח מהיר ו-HMR

### אחסון נתונים
- **בסיס נתונים**: PostgreSQL (מוגדר דרך Drizzle)
- **ORM**: Drizzle ORM עם ולידציית Zod
- **חיבור**: Neon Database serverless connection
- **סכמה**: הגדרות סכמה משותפות בין לקוח ושרת
- **אסטרטגיית אחסון**: אחסון בזיכרון לפיתוח/MVP עם בסיס נתונים מוכן לייצור

## מודולים מרכזיים

### 1. מודול דשבורד (Dashboard)
**קובץ**: `client/src/pages/dashboard.tsx`

#### פונקציונליות:
- הצגת KPI כרטיסים עם סטטיסטיקות עלויות
- תרשים מגמות עלויות לאורך זמן
- תרשים דיוק אומדנים
- טבלת דרישות רכש אחרונות
- כפתורי פעולה מהירה

#### רכיבים משולבים:
- `CostTrendsChart` - תרשים מגמות עלויות
- `AccuracyChart` - תרשים דיוק אומדנים
- `Card` - כרטיסי KPI

#### נקודות קצה API:
- `GET /api/dashboard/stats` - סטטיסטיקות דשבורד
- `GET /api/procurement-requests` - רשימת דרישות אחרונות

### 2. מודול ניהול דרישות רכש
**קובץ**: `client/src/pages/procurement-request.tsx`

#### פונקציונליות:
- הצגת פרטי דרישת רכש
- העלאת מסמכים וניהולם
- תצוגת תוצאות ניתוח AI
- אינדיקטורי התקדמות לניתוח מסמכים
- כפתורי פעולה למחקר שוק ויצירת אומדן

#### רכיבים משולבים:
- `AIAnalysis` - פאנל תוצאות ניתוח AI
- `FileUpload` - ממשק העלאת קבצים
- `SpecsDisplay` - תצוגת מפרטים עם Progressive Disclosure
- `ProgressIndicator` - אינדיקטורי התקדמות

#### נקודות קצה API:
- `GET /api/procurement-requests/:id` - פרטי דרישת רכש
- `POST /api/documents/upload` - העלאת מסמכים
- `POST /api/ai-analysis/:id` - ניתוח AI
- `GET /api/procurement-requests/:id/extracted-data` - נתונים מחולצים

### 3. מודול ניתוח AI למסמכים
**קובץ**: `client/src/components/procurement/ai-analysis.tsx`

#### פונקציונליות:
- חילוץ מפרטים ממסמכים
- ניתוח דרישות טכניות
- הערכת סיכונים
- המלצות אופטימיזציה
- אינדיקטורי ביטחון

#### אלגוריתמי ניתוח:
```typescript
// דוגמה מניתוח מפרטים
extractedSpecs: {
  quantity: "50 יחידות",
  processor: "Intel Core i7-13700 (16 cores)",
  memory: "32GB DDR4",
  storage: "1TB NVMe SSD",
  graphics: "Intel UHD Graphics",
  networkCard: "Gigabit Ethernet",
  warranty: "3 שנות אחריות",
  operatingSystem: "Windows 11 Pro",
  formFactor: "Desktop Tower",
  powerSupply: "650W 80+ Gold"
}
```

### 4. מנוע אומדני עלויות
**קובץ**: `client/src/pages/cost-estimation.tsx`

#### שיטות אומדן זמינות:
1. **אומדן מבוסס מחיר שוק** - 95% התאמה
2. **אומדן אנלוגי** - השוואה לפרויקטים דומים
3. **אומדן פרמטרי** - מבוסס פרמטרים טכניים
4. **אומדן מודל עלויות פירוט** - פירוק לרכיבים
5. **אומדן ניסיון מומחה** - על בסיס ידע מומחים

#### רכיבי האומדן:
- **EstimationMethods** - בחירת שיטות אומדן
- תצוגת תוצאות עם רמות ביטחון
- טבלאות הצדקה מפורטות
- המלצות AI לחיסכון

#### נקודות קצה API:
- `GET /api/estimation-methods/:id` - שיטות אומדן זמינות
- `POST /api/cost-estimations` - יצירת אומדן חדש
- `GET /api/cost-estimations/request/:id` - אומדן קיים

### 5. מודול מחקר שוק
**קובץ**: `client/src/pages/market-research.tsx`

#### פונקציונליות:
- השוואת ספקים
- ניתוח מגמות מחירים
- אינדיקטורי עמדת שוק
- מטריצת הערכת סיכונים
- המלצות AI לספקים מועדפים

#### רכיבי מחקר שוק:
- `SupplierChart` - תרשים השוואת ספקים
- `PriceTrackingChart` - מעקב מגמות מחירים
- כרטיסי סקירת שוק

#### נקודות קצה API:
- `GET /api/market-research/:requestId` - מחקר שוק לדרישה

## סכמת בסיס הנתונים

### טבלאות מרכזיות

#### טבלת Users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### טבלת Procurement Requests
```sql
CREATE TABLE procurement_requests (
  id SERIAL PRIMARY KEY,
  request_number VARCHAR(100) UNIQUE NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  quantity INTEGER,
  description TEXT,
  estimated_cost DECIMAL(15,2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);
```

#### טבלת Cost Estimations
```sql
CREATE TABLE cost_estimations (
  id SERIAL PRIMARY KEY,
  procurement_request_id INTEGER REFERENCES procurement_requests(id),
  total_cost DECIMAL(15,2) NOT NULL,
  base_price DECIMAL(15,2),
  tax DECIMAL(15,2),
  confidence_level INTEGER,
  market_price DECIMAL(15,2),
  potential_savings DECIMAL(15,2),
  justifications JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### טבלת Documents
```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  procurement_request_id INTEGER REFERENCES procurement_requests(id),
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500),
  file_size BIGINT,
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### טבלת Suppliers
```sql
CREATE TABLE suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  rating DECIMAL(3,2),
  reliability_score INTEGER,
  contact_info JSONB,
  specialties TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## ממשקי API מפורטים

### קבוצת Dashboard APIs
- `GET /api/dashboard/stats` - סטטיסטיקות כלליות
  - תגובה: `{ totalEstimatedCosts, totalSavings, requestsCount, avgConfidence }`

### קבוצת Procurement APIs
- `GET /api/procurement-requests` - רשימת דרישות
- `GET /api/procurement-requests/:id` - פרטי דרישה
- `POST /api/procurement-requests` - יצירת דרישה חדשה
- `PUT /api/procurement-requests/:id` - עדכון דרישה

### קבוצת Document APIs
- `POST /api/documents/upload` - העלאת מסמך
- `GET /api/documents/request/:id` - מסמכי דרישה
- `DELETE /api/documents/:id` - מחיקת מסמך

### קבוצת AI Analysis APIs
- `POST /api/ai-analysis/:id` - ניתוח AI למסמכים
- `GET /api/procurement-requests/:id/extracted-data` - נתונים מחולצים

### קבוצת Cost Estimation APIs
- `GET /api/estimation-methods/:id` - שיטות אומדן זמינות
- `POST /api/cost-estimations` - יצירת אומדן
- `GET /api/cost-estimations/request/:id` - אומדן לדרישה
- `POST /api/cost-estimations/:id/approve` - אישור אומדן

### קבוצת Market Research APIs
- `GET /api/market-research/:requestId` - מחקר שוק

## רכיבי UI מתקדמים

### רכיבי Procurement
1. **EstimationMethods** - בחירת שיטות אומדן עם 5 אופציות
2. **SpecsDisplay** - תצוגת מפרטים עם Progressive Disclosure
3. **FileUpload** - העלאת קבצים עם אנימציות ופידבק
4. **AIAnalysis** - פאנל ניתוח AI מתקדם

### רכיבי Charts
1. **CostTrendsChart** - מגמות עלויות עם Recharts
2. **AccuracyChart** - דיוק אומדנים
3. **SupplierChart** - השוואת ספקים
4. **PriceTrackingChart** - מעקב מחירים

### רכיבי Layout
1. **Header** - כותרת עם ניווט
2. **Sidebar** - תפריט צד
3. **WorkflowProgress** - התקדמות תהליכים

## תמיכה בעברית ו-RTL

### הגדרות CSS מותאמות:
```css
body {
  direction: rtl;
  font-family: 'Assistant', 'Roboto', sans-serif;
}

/* RTL specific styles */
[dir="rtl"] .recharts-legend-wrapper {
  direction: rtl;
}

[dir="rtl"] .recharts-cartesian-axis-tick-value {
  direction: rtl;
  text-anchor: start;
}
```

### טרמינולוגיה מועדפת:
- "אומדן" במקום "הערכה"
- "דרישות רכש" במקום "בקשות רכש"
- כותרת המערכת: "מערכת ניהול אומדני עלויות רכש"

## ערכת נושא כהה

### פלטת צבעים:
```css
:root {
  --background: hsl(240, 35%, 12%);
  --foreground: hsl(0, 0%, 100%);
  --primary: hsl(207, 90%, 54%);
  --secondary: hsl(340, 82%, 77%);
  --success: hsl(122, 39%, 49%);
  --warning: hsl(38, 92%, 50%);
  --destructive: hsl(0, 84%, 60%);
}
```

### צבעי תרשימים:
- Chart-1: #60a5fa (כחול בהיר)
- Chart-2: #34d399 (ירוק)
- Chart-3: #fbbf24 (צהוב)
- Chart-4: #f87171 (אדום)

## קובצי קונפיגורציה

### vite.config.ts
```typescript
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    host: "0.0.0.0",
    port: 5173
  }
});
```

### tailwind.config.ts
```typescript
module.exports = {
  darkMode: ["class"],
  content: ["./client/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Assistant', 'Roboto', 'sans-serif'],
      }
    }
  }
};
```

## מבנה קבצים מפורט

```
├── client/                 # אפליקציית React Frontend
│   ├── src/
│   │   ├── components/     # רכיבי UI
│   │   │   ├── charts/     # רכיבי תרשימים
│   │   │   ├── layout/     # רכיבי פריסה
│   │   │   ├── procurement/# רכיבי רכש
│   │   │   └── ui/         # רכיבי UI בסיסיים
│   │   ├── hooks/          # React Hooks מותאמים
│   │   ├── lib/            # יוטיליטיז ו-constants
│   │   ├── pages/          # דפי האפליקציה
│   │   └── styles/         # קבצי CSS נוספים
├── server/                 # שרת Express Backend
│   ├── index.ts           # נקודת כניסה לשרת
│   ├── routes.ts          # הגדרת נתיבי API
│   ├── storage.ts         # ניהול אחסון נתונים
│   └── vite.ts            # הגדרות Vite לשרת
├── shared/                 # הגדרות משותפות
│   └── schema.ts          # סכמות Zod משותפות
└── uploads/               # תיקיית העלאות קבצים
```

## אבטחה ואימות

### הגנות בסיסיות:
- ולידציית קלט עם Zod
- הגבלת גודל קבצים (Multer)
- CORS מוגדר
- Headers אבטחה בסיסיים

### נקודות שיפור עתידיות:
- מערכת אימות מלאה
- הצפנת נתונים רגישים
- Audit logs
- Rate limiting

## ביצועים ואופטימיזציה

### אופטימיזציות קיימות:
- React Query לקאש נתונים
- Code splitting עם React.lazy
- Vite לבנייה מהירה
- RTL optimized CSS

### מובייל ורספונסיביות:
- Hook מותאם `use-mobile`
- Grid layout רספונסיבי
- Touch-friendly interface
- Progressive disclosure למסכים קטנים

## סטטוס פיתוח נוכחי

### תכונות מוטמעות ✓
- MVP מלא עם כל 4 המודולים הראשיים
- תמיכה מלאה בעברית RTL
- Progressive Disclosure
- אופטימיזציה מלאה למובייל
- 5 שיטות אומדן מקיפות
- ממשקי API פועלים
- כל הבאגים הקריטיים תוקנו

### תכונות בפיתוח 🔄
- שיפורי UX נוספים
- הרחבת יכולות AI
- דוחות מתקדמים
- אינטגרציות חיצוניות

### בעיות ידועות 🔍
- שגיאות 404 מזדמנות באישור אומדנים
- צורך בשיפור error handling
- אופטימיזציה נוספת לביצועים

## סביבת פיתוח

### הרצת המערכת:
```bash
npm run dev          # הרצת שרת פיתוח
npm run build        # בנייה לייצור
npm run start        # הרצת ייצור
```

### פורט שרת: 5000
### כתובת גישה: http://localhost:5000

## סיכום

המערכת נמצאת במצב פונקציונלי מלא עם כל המודולים הבסיסיים פועלים. הארכיטקטורה מאפשרת הרחבה עתידית וכוללת תמיכה מלאה בעברית, ממשק משתמש מתקדם ויכולות AI בסיסיות לאומדני עלויות רכש.
