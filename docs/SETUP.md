# הקמת סביבת פיתוח

## דרישות מקדימות
- Node.js 20+
- PostgreSQL 16+
- Git

## התקנה מהירה

1. **Clone הפרויקט:**
```bash
git clone [your-repo-url]
cd ai-procurement-system
```

2. **התקנת dependencies:**
```bash
npm install
```

3. **הגדרת environment variables:**
```bash
cp .env.example .env
# ערוך את .env עם הערכים שלך
```

4. **הכנת database:**
```bash
npm run db:push
```

5. **הרצת הפרויקט:**
```bash
npm run dev
```

## Scripts זמינים
- `npm run dev` - הרצה בפיתוח
- `npm run build` - build לפרודקשן
- `npm run start` - הרצה בפרודקשן  
- `npm run check` - בדיקת TypeScript
- `npm run db:push` - עדכון database schema