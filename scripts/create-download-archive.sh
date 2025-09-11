
#!/bin/bash

# מערכת יצירת ארכיון להורדה
PROJECT_NAME="procurement-system"
ARCHIVE_NAME="${PROJECT_NAME}-$(date +%Y%m%d_%H%M%S).zip"
TEMP_DIR="/tmp/${PROJECT_NAME}_archive"

echo "🚀 יוצר ארכיון פרויקט..."

# יצירת תיקייה זמנית
mkdir -p "$TEMP_DIR"

# העתקת קבצים חיוניים (מיעוט גודל הארכיון)
echo "📦 מעתיק קבצים חיוניים..."

# Frontend files
cp -r client "$TEMP_DIR/"
cp -r server "$TEMP_DIR/"
cp -r shared "$TEMP_DIR/"
cp -r docs "$TEMP_DIR/"
cp -r public "$TEMP_DIR/"
cp -r scripts "$TEMP_DIR/"

# Configuration files
cp package.json "$TEMP_DIR/"
cp package-lock.json "$TEMP_DIR/"
cp tsconfig.json "$TEMP_DIR/"
cp vite.config.ts "$TEMP_DIR/"
cp vitest.config.ts "$TEMP_DIR/"
cp tailwind.config.ts "$TEMP_DIR/"
cp postcss.config.js "$TEMP_DIR/"
cp components.json "$TEMP_DIR/"
cp drizzle.config.ts "$TEMP_DIR/"

# Documentation
cp README.md "$TEMP_DIR/"
cp .env.example "$TEMP_DIR/"
cp .env.production.example "$TEMP_DIR/"
cp DEPLOYMENT_READINESS_REPORT.md "$TEMP_DIR/"
cp REFACTORING_DOCUMENTATION.md "$TEMP_DIR/"

# Docker files
cp Dockerfile.production "$TEMP_DIR/"
cp docker-compose.production.yml "$TEMP_DIR/"
cp docker-compose.minimal.yml "$TEMP_DIR/"

# Git files (important for deployment)
cp -r .github "$TEMP_DIR/"
cp .gitignore "$TEMP_DIR/"

# יצירת README להתקנה
cat > "$TEMP_DIR/QUICK_START.md" << 'EOF'
# התקנה מהירה - מערכת ניהול רכש

## צעדי התקנה:

1. פתח terminal בתיקיית הפרויקت
2. הרץ: `npm install`
3. העתק: `cp .env.example .env`
4. הרץ: `npm run dev`
5. פתח דפדפן: http://localhost:5000

## פריסה לרפליט:
1. צור Repl חדש ב-Replit
2. העלה את כל הקבצים
3. הרץ `npm install`
4. לחץ על Run

הפרויקט מוכן לשימוש מיידי!
EOF

# יצירת הארכיון
echo "🗜️ יוצר קובץ ZIP..."
cd /tmp
zip -r "$ARCHIVE_NAME" "${PROJECT_NAME}_archive" -x "*/node_modules/*" "*/.git/*" "*/dist/*" "*/build/*"

# העברת הארכיון לתיקיית הפרויקט
mv "$ARCHIVE_NAME" "/home/runner/$PROJECT_NAME/"

# ניקוי
rm -rf "$TEMP_DIR"

echo "✅ ארכיון נוצר בהצלחה: $ARCHIVE_NAME"
echo "📁 מיקום הקובץ: /home/runner/$PROJECT_NAME/$ARCHIVE_NAME"
echo ""
echo "💡 כדי להוריד את הקובץ:"
echo "   1. לך לתיקיית הפרויקט"
echo "   2. לחץ ימין על $ARCHIVE_NAME"
echo "   3. בחר 'Download'"

# הצגת גודל הקובץ
if [ -f "/home/runner/$PROJECT_NAME/$ARCHIVE_NAME" ]; then
    SIZE=$(du -h "/home/runner/$PROJECT_NAME/$ARCHIVE_NAME" | cut -f1)
    echo "📊 גודל הארכיון: $SIZE"
fi
