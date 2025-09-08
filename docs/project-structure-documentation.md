
# מסמך תיעוד מבנה הפרויקט - מערכת ניהול אומדני עלויות רכש

## מבנה תיקיות ראשי

### 📁 `/client` - יישום לקוח (React + TypeScript + Vite)

#### מבנה עיקרי:
```
client/
├── src/
│   ├── components/     # רכיבי UI מותאמים
│   ├── pages/         # עמודי האפליקציה  
│   ├── hooks/         # React Hooks מותאמים
│   ├── lib/           # כלים עזר ותצורות
│   ├── data/          # נתונים סטטיים
│   └── styles/        # קבצי עיצוב מותאמים
└── index.html         # דף ראשי
```

#### 🎨 `/components` - רכיבי ממשק משתמש
```
components/
├── charts/            # תרשימים ואנליטיקה
│   ├── cost-trends-chart.tsx        # תרשים מגמות עלויות
│   ├── accuracy-chart.tsx           # תרשים דיוק אומדנים
│   ├── supplier-chart.tsx           # השוואת ספקים
│   ├── price-tracking-chart.tsx     # מעקב מחירים
│   ├── availability-heatmap.tsx     # מפת זמינות ספקים
│   ├── competitive-scatter-chart.tsx # תרשים פיזור תחרותי
│   ├── price-timeline-chart.tsx     # ציר זמן מחירים
│   └── savings-trend-chart.tsx      # מגמות חיסכון
├── layout/            # רכיבי פריסה
│   ├── header.tsx                   # כותרת עליונה
│   └── sidebar.tsx                  # תפריט צד
├── procurement/       # רכיבי רכש מתקדמים
│   ├── ai-analysis.tsx              # ניתוח AI למסמכים
│   ├── estimation-methods.tsx       # שיטות אומדן (5 שיטות)
│   ├── request-form.tsx             # טופס בקשת רכש
│   └── specs-display.tsx            # תצוגת מפרטים
├── market/            # מחקר שוק
│   └── ai-recommendations.tsx       # המלצות AI
├── reports/           # דיווחים
│   └── report-generator.tsx         # מחולל דוחות
├── templates/         # תבניות
│   └── template-gallery.tsx         # גלריית תבניות
└── ui/               # רכיבי UI בסיסיים (40+ רכיבים)
    ├── button.tsx, card.tsx, dialog.tsx...
    ├── file-upload.tsx              # העלאת קבצים מתקדמת
    ├── progress-states.tsx          # מצבי התקדמות
    ├── workflow-progress.tsx        # התקדמות תהליכי עבודה
    ├── contextual-help.tsx          # עזרה הקשרית
    ├── smart-tooltip.tsx            # טיפים חכמים
    └── enhanced-skeleton.tsx        # שלדי טעינה משופרים
```

#### 📄 `/pages` - עמודי האפליקציה
```
pages/
├── dashboard.tsx                    # לוח בקרה ראשי
├── procurement-request.tsx          # פרטי דרישת רכש
├── procurement-requests-list.tsx    # רשימת דרישות
├── cost-estimation.tsx              # אומדני עלויות
├── market-research.tsx              # מחקר שוק
├── reports.tsx                      # דוחות ואנליטיקה
├── templates.tsx                    # תבניות מסמכים
├── estimation-methods.tsx           # ניהול שיטות אומדן
├── sql-runner.tsx                   # הרצת שאילתות SQL
└── not-found.tsx                    # עמוד 404
```

#### 🔧 `/hooks` - תכונות React מותאמות
```
hooks/
├── use-mobile.tsx                   # זיהוי מכשירים ניידים
└── use-toast.ts                     # הודעות טוסט
```

#### 📚 `/lib` - כלי עזר ותצורות
```
lib/
├── utils.ts                         # פונקציות עזר כלליות
├── constants.ts                     # קבועים
└── queryClient.ts                   # React Query
```

#### 📊 `/data` - נתונים סטטיים
```
data/
└── document-templates.ts            # תבניות מסמכים
```

### 🖥️ `/server` - שרת Node.js + Express + TypeScript

```
server/
├── index.ts                         # שרת ראשי + Express
├── routes.ts                        # נתיבי API (15+ endpoints)
├── storage.ts                       # ניהול אחסון נתונים
├── data-seed.ts                     # נתוני התחלה
└── vite.ts                          # תצורת Vite לייצור
```

#### נתיבי API עיקריים:
- **Procurement**: CRUD דרישות רכש
- **Documents**: העלאה וניהול מסמכים
- **AI Analysis**: ניתוח מסמכים באמצעות AI
- **Cost Estimation**: יצירת אומדנים (5 שיטות)
- **Market Research**: מחקר שוק מתקדם

### 🤝 `/shared` - הגדרות משותפות

```
shared/
├── schema.ts                        # סכמות Zod לולידציה
└── pricing-engine.ts                # מנוע תמחור מתקדם
```

### 📖 `/docs` - תיעוד מערכת

```
docs/
├── system-documentation.md          # תיעוד מערכת כללי
├── procurement-request-ux-analysis.md # ניתוח UX
└── project-structure-documentation.md # המסמך הנוכחי
```

### 💾 `/backup` - גיבויים אוטומטיים

```
backup/
└── 20250818_092852/                # גיבוי מתאריך 18/8/2025
    ├── client/
    ├── server/
    └── shared/
```

### 📎 `/attached_assets` - נכסים מצורפים

מכיל קבצי תמונה, תיעוד וטקסטים שהועלו למערכת (100+ קבצים).

### 📁 `/uploads` - העלאות משתמשים

תיקייה ריקה המיועדת לקבצים שמעלים המשתמשים.

## עדכונים אחרונים (24 שעות האחרונות)

### ✅ שיפורים בקומפוננטים:

1. **EstimationMethods** - שדרוג ל-5 שיטות אומדן:
   - אומדן אלגו (92% התאמה)
   - אומדן פרמטרי (88% התאמה) 
   - אומדן מלטה למעלה (75% התאמה)
   - אומדן מבוסס מחיר שוק (95% התאמה) ⭐ חדש
   - שיטות מומחה (85% התאמה)

2. **SpecsDisplay** - הוספת Progressive Disclosure לחוויית משתמש משופרת

3. **FileUpload** - שיפור חזותי עם אנימציות ופידבק

### 🐛 תיקוני באגים:
- תיקון שגיאת יצירת אומדן במסך פרטי דרישת רכש
- שיפור טיפול בשגיאות ב-API endpoints
- אופטימיזציה למכשירים ניידים

### 🎨 שיפורי עיצוב:
- תמיכה מלאה ב-RTL (עברית)
- ערכת נושא כהה מותאמת
- צבעי תרשימים מותאמים: #60a5fa, #34d399, #fbbf24, #f87171

## קבצי תצורה עיקריים

```
├── package.json                     # תלויות Node.js
├── tsconfig.json                    # תצורת TypeScript
├── vite.config.ts                   # תצורת Vite
├── tailwind.config.ts               # תצורת Tailwind CSS
├── drizzle.config.ts                # תצורת Drizzle ORM
├── components.json                  # תצורת shadcn/ui
├── .replit                          # תצורת Replit
└── .gitignore                       # קבצים להתעלמות
```

## טכנולוגיות מרכזיות

### Frontend:
- **React 18** + **TypeScript**
- **Vite** - כלי בנייה מהיר
- **Tailwind CSS** - עיצוב utility-first
- **shadcn/ui** - ספריית רכיבים
- **Recharts** - תרשימים ואנליטיקה
- **React Hook Form** + **Zod** - טפסים ווולידציה
- **TanStack Query** - ניהול מצב שרת

### Backend:
- **Node.js** + **Express.js**
- **TypeScript** מלא
- **Drizzle ORM** - מסד נתונים טייפ-סייף
- **Multer** - העלאת קבצים
- **Neon Database** - PostgreSQL ללא שרת

### פיתוח:
- **ESLint** + **Prettier** - איכות קוד
- **Hot Module Replacement** - פיתוח מהיר
- **Path Aliases** - ייבוא נקי

## סטטיסטיקות פרויקט

- **רכיבי React**: 40+ רכיבים
- **עמודים**: 10 עמודים פונקציונליים
- **API Endpoints**: 15+ נתיבים
- **קבצי TypeScript**: 80+ קבצים
- **תמיכה בשפות**: עברית (RTL) + אנגלית
- **תאימות**: דסקטופ + מובייל מלא

## ארכיטקטורה ושיטות עבודה

### מבנה Monorepo:
- קוד משותף בין client ו-server
- סכמות Zod משותפות לוולידציה
- TypeScript מלא עם type safety

### דפוסי עיצוב:
- **Component-based Architecture**
- **Custom Hooks** לפונקציונליות
- **Progressive Enhancement**
- **Mobile-First Design**
- **Dark Theme נדיב**

### זרימת נתונים:
1. טפסים → Validation (Zod) → API
2. AI Analysis → Storage → Display
3. Market Research → Calculations → Charts
4. Cost Estimation → Multiple Methods → Results

---

*מסמך זה מתעדכן באופן קבוע עם השינויים במערכת*
*עדכון אחרון: ינואר 2025*
