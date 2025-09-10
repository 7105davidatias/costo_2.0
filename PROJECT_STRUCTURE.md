
# תיעוד מבנה הפרויקט - מערכת רכש ואומדני עלויות AI

## תיאור כללי
מערכת ניהול רכש מתקדמת עם ניתוח מסמכים באמצעות בינה מלאכותית ואומדני עלויות חכמים.

## מבנה התיקיות והקבצים

| נתיב | סוג | תיאור |
|------|-----|--------|
| **/** | תיקיה | שורש הפרויקט |
| /.config | תיקיה | קונפיגורציות סביבת הפיתוח |
| /.config/npm | תיקיה | הגדרות NPM גלובליות |
| /.config/npm/node_global | תיקיה | התקנות Node.js גלובליות |
| /attached_assets | תיקיה | קבצים מצורפים ונכסים |
| /attached_assets/Pasted-*.txt | קבצים | קבצי טקסט מועתקים מההיסטוריה |
| /attached_assets/content-*.md | קבצים | תכנים בפורמט Markdown |
| /attached_assets/image_*.png | קבצים | תמונות ושרטוטים |
| **backup/** | תיקיה | גיבויים של הפרויקט |
| /backup/20250818_092852 | תיקיה | גיבוי מיום 18.08.2025 |
| **client/** | תיקיה | קוד הלקוח (Frontend) |
| /client/src | תיקיה | קוד מקור של הלקוח |
| /client/src/components | תיקיה | רכיבי React |
| /client/src/components/charts | תיקיה | רכיבי גרפים וחיזותים |
| /client/src/components/charts/accuracy-chart.tsx | קובץ | גרף דיוק תחזיות עלויות |
| /client/src/components/charts/cost-trends-chart.tsx | קובץ | גרף מגמות עלויות |
| /client/src/components/charts/price-tracking-chart.tsx | קובץ | גרף מעקב מחירים |
| /client/src/components/charts/supplier-chart.tsx | קובץ | גרף ספקים והשוואות |
| /client/src/components/layout | תיקיה | רכיבי פריסה |
| /client/src/components/layout/header.tsx | קובץ | כותרת עליונה של האפליקציה |
| /client/src/components/layout/sidebar.tsx | קובץ | תפריט צדדי לניווט |
| /client/src/components/procurement | תיקיה | רכיבי רכש |
| /client/src/components/procurement/ai-analysis.tsx | קובץ | רכיב ניתוח AI של מסמכים |
| /client/src/components/procurement/request-form.tsx | קובץ | טופס יצירת בקשת רכש |
| /client/src/components/ui | תיקיה | רכיבי ממשק משתמש בסיסיים |
| /client/src/components/ui/accordion.tsx | קובץ | רכיב אקורדיון |
| /client/src/components/ui/alert-dialog.tsx | קובץ | חלון התראה |
| /client/src/components/ui/alert.tsx | קובץ | רכיב התראה |
| /client/src/components/ui/aspect-ratio.tsx | קובץ | רכיב יחס גובה-רוחב |
| /client/src/components/ui/avatar.tsx | קובץ | תמונת פרופיל |
| /client/src/components/ui/badge.tsx | קובץ | תווית מידע |
| /client/src/components/ui/breadcrumb.tsx | קובץ | ניווט שביל פירורים |
| /client/src/components/ui/button.tsx | קובץ | כפתור |
| /client/src/components/ui/calendar.tsx | קובץ | לוח שנה |
| /client/src/components/ui/card.tsx | קובץ | כרטיס מידע |
| /client/src/components/ui/carousel.tsx | קובץ | קרוסלת תמונות |
| /client/src/components/ui/chart.tsx | קובץ | רכיב גרף בסיסי |
| /client/src/components/ui/checkbox.tsx | קובץ | תיבת סימון |
| /client/src/components/ui/collapsible.tsx | קובץ | רכיב מתקפל |
| /client/src/components/ui/command.tsx | קובץ | רכיב פקודות |
| /client/src/components/ui/context-menu.tsx | קובץ | תפריט הקשר |
| /client/src/components/ui/dialog.tsx | קובץ | חלון דיאלוג |
| /client/src/components/ui/drawer.tsx | קובץ | מגירת ניווט |
| /client/src/components/ui/dropdown-menu.tsx | קובץ | תפריט נפתח |
| /client/src/components/ui/file-upload.tsx | קובץ | העלאת קבצים |
| /client/src/components/ui/form.tsx | קובץ | רכיב טופס |
| /client/src/components/ui/hover-card.tsx | קובץ | כרטיס ריחוף |
| /client/src/components/ui/input-otp.tsx | קובץ | קלט קוד OTP |
| /client/src/components/ui/input.tsx | קובץ | שדה קלט |
| /client/src/components/ui/label.tsx | קובץ | תווית |
| /client/src/components/ui/menubar.tsx | קובץ | פס תפריט |
| /client/src/components/ui/navigation-menu.tsx | קובץ | תפריט ניווט |
| /client/src/components/ui/pagination.tsx | קובץ | רכיב עימוד |
| /client/src/components/ui/popover.tsx | קובץ | חלון קופץ |
| /client/src/components/ui/progress-indicator.tsx | קובץ | מחוון התקדמות |
| /client/src/components/ui/progress.tsx | קובץ | סרגל התקדמות |
| /client/src/components/ui/radio-group.tsx | קובץ | קבוצת כפתורי בחירה |
| /client/src/components/ui/resizable.tsx | קובץ | רכיב בעל גודל משתנה |
| /client/src/components/ui/scroll-area.tsx | קובץ | אזור גלילה |
| /client/src/components/ui/select.tsx | קובץ | רשימת בחירה |
| /client/src/components/ui/separator.tsx | קובץ | קו מפריד |
| /client/src/components/ui/sheet.tsx | קובץ | גיליון צדדי |
| /client/src/components/ui/sidebar.tsx | קובץ | רכיב תפריט צדדי |
| /client/src/components/ui/skeleton.tsx | קובץ | רכיב טעינה |
| /client/src/components/ui/slider.tsx | קובץ | גלילת ערכים |
| /client/src/components/ui/switch.tsx | קובץ | מתג הפעלה |
| /client/src/components/ui/table.tsx | קובץ | טבלה |
| /client/src/components/ui/tabs.tsx | קובץ | לשוניות |
| /client/src/components/ui/textarea.tsx | קובץ | אזור טקסט |
| /client/src/components/ui/toast.tsx | קובץ | הודעה קופצת |
| /client/src/components/ui/toaster.tsx | קובץ | מנהל הודעות |
| /client/src/components/ui/toggle-group.tsx | קובץ | קבוצת מתגים |
| /client/src/components/ui/toggle.tsx | קובץ | מתג |
| /client/src/components/ui/tooltip.tsx | קובץ | רמז כלים |
| /client/src/hooks | תיקיה | React Hooks מותאמים |
| /client/src/hooks/use-mobile.tsx | קובץ | זיהוי מכשיר נייד |
| /client/src/hooks/use-toast.ts | קובץ | ניהול הודעות |
| /client/src/lib | תיקיה | ספריות עזר |
| /client/src/lib/constants.ts | קובץ | קבועים |
| /client/src/lib/queryClient.ts | קובץ | לקוח שאילתות |
| /client/src/lib/utils.ts | קובץ | פונקציות עזר |
| /client/src/pages | תיקיה | דפי האפליקציה |
| /client/src/pages/cost-estimation.tsx | קובץ | דף אומדני עלויות |
| /client/src/pages/dashboard.tsx | קובץ | דף ראשי - לוח מחוונים |
| /client/src/pages/market-research.tsx | קובץ | דף מחקר שוק |
| /client/src/pages/not-found.tsx | קובץ | דף 404 |
| /client/src/pages/procurement-request.tsx | קובץ | דף בקשת רכש |
| /client/src/pages/procurement-requests-list.tsx | קובץ | רשימת בקשות רכש |
| /client/src/App.tsx | קובץ | רכיב האפליקציה הראשי |
| /client/src/index.css | קובץ | עיצוב CSS ראשי |
| /client/src/main.tsx | קובץ | נקודת כניסה לאפליקציה |
| /client/index.html | קובץ | קובץ HTML בסיסי |
| **server/** | תיקיה | קוד השרת (Backend) |
| /server/index.ts | קובץ | נקודת כניסה לשרת |
| /server/routes.ts | קובץ | ניתובי API |
| /server/storage.ts | קובץ | ניהול אחסון נתונים |
| /server/storage.ts.backup | קובץ | גיבוי ניהול אחסון |
| /server/vite.ts | קובץ | הגדרות Vite לשרת |
| **shared/** | תיקיה | קוד משותף |
| /shared/schema.ts | קובץ | סכמות נתונים משותפות |
| **uploads/** | תיקיה | קבצים שהועלו |
| **.CSS** | קובץ | קובץ עיצוב נוסף |
| **.env** | קובץ | משתני סביבה |
| **.gitignore** | קובץ | קבצים שלא יעקבו ב-Git |
| **.replit** | קובץ | הגדרות Replit |
| **ai_service** | קובץ | שירות בינה מלאכותית |
| **components.json** | קובץ | הגדרות רכיבי UI |
| **demo-document-server-procurement.txt** | קובץ | מסמך הדגמה |
| **drizzle.config.ts** | קובץ | הגדרות Drizzle ORM |
| **package-lock.json** | קובץ | נעילת תלויות NPM |
| **package.json** | קובץ | הגדרות הפרויקט ותלויות |
| **postcss.config.js** | קובץ | הגדרות PostCSS |
| **replit.md** | קובץ | תיעוד הפרויקט |
| **tailwind.config.ts** | קובץ | הגדרות Tailwind CSS |
| **theme** | קובץ | הגדרות ערכת נושא |
| **tsconfig.json** | קובץ | הגדרות TypeScript |
| **vite.config.ts** | קובץ | הגדרות Vite |

## ארכיטקטורה כללית

### Frontend (client/)
- **React 18** עם TypeScript
- **Vite** לפיתוח מהיר ובנייה
- **Tailwind CSS** לעיצוב
- **Radix UI** לרכיבי ממשק
- **React Hook Form** לטפסים
- **Recharts** לגרפים וחיזותים

### Backend (server/)
- **Express.js** עם TypeScript
- **Drizzle ORM** לניהול בסיס נתונים
- **PostgreSQL** באמצעות Neon Database
- **Multer** להעלאת קבצים
- **Zod** לוולידציה

### Shared (shared/)
- סכמות TypeScript משותפות
- וולידציה משותפת עם Zod
- הגדרות טיפוסים

### תכונות מרכזיות
1. **ניהול בקשות רכש** - יצירה, עדכון ומעקב
2. **ניתוח מסמכים בAI** - עיבוד אוטומטי של מפרטים
3. **אומדני עלויות חכמים** - חישובים מבוססי AI
4. **מחקר שוק** - השוואת ספקים ומחירים
5. **לוח מחוונים** - סטטיסטיקות ומגמות
6. **העלאת קבצים** - תמיכה במסמכים שונים

