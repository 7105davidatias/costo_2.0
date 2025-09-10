# Controllers

מכיל את ה-HTTP request handlers. הControllers אחראים רק על:
- קבלת HTTP requests
- Validation של input (עם middleware)
- קריאה ל-Services
- החזרת HTTP responses

**קבצים מתוכננים:**
- auth.controller.ts
- procurement.controller.ts  
- suppliers.controller.ts
- documents.controller.ts
- cost-estimation.controller.ts