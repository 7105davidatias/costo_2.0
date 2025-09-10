# API Reference מלא
## מערכת ניהול אומדני עלויות רכש - תיעוד API

---

## 📋 סקירה כללית

מערכת ה-API בנויה על ארכיטקטורת REST עם תמיכה מלאה ב-JSON, validation מקיף עם Zod, ו-error handling מתקדם. כל ה-endpoints כוללים type safety מלא מקצה לקצה.

### 🔧 פורמט התגובות הסטנדרטי

```json
{
  "success": true,
  "data": { /* הנתונים המבוקשים */ },
  "message": "הודעת הצלחה או שגיאה",
  "pagination": { /* עבור רשימות בלבד */
    "page": 1,
    "limit": 20, 
    "total": 150,
    "totalPages": 8
  }
}
```

### 🚨 קודי שגיאה

| קוד | משמעות | תיאור |
|-----|---------|--------|
| 200 | OK | בקשה הושלמה בהצלחה |
| 201 | Created | משאב נוצר בהצלחה |
| 400 | Bad Request | נתונים לא תקינים או validation נכשל |
| 401 | Unauthorized | נדרש אימות משתמש |
| 403 | Forbidden | אין הרשאה לפעולה |
| 404 | Not Found | משאב לא נמצא |
| 500 | Internal Error | שגיאה פנימית בשרת |

---

## 🔐 Authentication & Authorization

### POST `/api/auth/login`
כניסה למערכת עם username ו-password.

**Request Body:**
```json
{
  "username": "yossi.cohen",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "yossi.cohen", 
      "name": "יוסי כהן",
      "role": "manager",
      "department": "רכש"
    },
    "session": {
      "expires": "2024-09-11T10:30:00Z"
    }
  },
  "message": "התחברות הושלמה בהצלחה"
}
```

**שגיאות נפוצות:**
```json
{
  "success": false,
  "message": "שם משתמש או סיסמה שגויים",
  "error": "INVALID_CREDENTIALS"
}
```

### POST `/api/auth/logout`
יציאה מהמערכת וביטול session.

**Response:**
```json
{
  "success": true,
  "message": "התנתקת בהצלחה מהמערכת"
}
```

### GET `/api/auth/me`
קבלת מידע על המשתמש הנוכחי.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "yossi.cohen",
    "name": "יוסי כהן", 
    "role": "manager",
    "department": "רכש",
    "lastLogin": "2024-09-10T14:20:00Z",
    "permissions": ["read", "write", "approve"]
  }
}
```

---

## 📋 Procurement Requests Management

### GET `/api/procurement-requests`
קבלת רשימת כל בקשות הרכש (עם pagination).

**Query Parameters:**
```
?page=1          # מספר עמוד (ברירת מחדל: 1)
&limit=20        # פריטים לעמוד (ברירת מחדל: 20, מקסימום: 100)
&status=pending  # סינון לפי סטטוס
&category=טכנולוגיה  # סינון לפי קטגוריה
&sort=createdAt  # מיון (createdAt, updatedAt, itemName)
&order=desc      # כיוון מיון (asc/desc)
&search=מחשב    # חיפוש טקסט חופשי
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "requestNumber": "REQ-2024-0847",
      "itemName": "מחשב נייד HP EliteBook",
      "category": "טכנולוגיה",
      "quantity": 5,
      "description": "מחשבים ניידים לצוות הפיתוח החדש",
      "status": "pending",
      "urgency": "גבוהה",
      "requestedBy": "יוסי כהן",
      "department": "פיתוח",
      "budgetRange": "40,000-60,000",
      "createdAt": "2024-09-10T10:30:00Z",
      "updatedAt": "2024-09-10T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 47,
    "totalPages": 3
  }
}
```

### POST `/api/procurement-requests`
יצירת בקשת רכש חדשה.

**Request Body:**
```json
{
  "itemName": "מחשב נייד Dell Latitude",
  "category": "טכנולוגיה",
  "quantity": 3,
  "description": "מחשבים ניידים לצוות המכירות",
  "urgency": "בינונית",
  "requestedBy": "שרה לוי",
  "department": "מכירות",
  "budgetRange": "30,000-45,000",
  "justification": "החלפת מחשבים ישנים לשיפור הפרודוקטיביות"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 48,
    "requestNumber": "REQ-2024-0848", // נוצר אוטומטית
    "itemName": "מחשב נייד Dell Latitude",
    "category": "טכנולוגיה", 
    "quantity": 3,
    "description": "מחשבים ניידים לצוות המכירות",
    "status": "pending", // סטטוס ראשוני
    "urgency": "בינונית",
    "requestedBy": "שרה לוי",
    "department": "מכירות", 
    "budgetRange": "30,000-45,000",
    "justification": "החלפת מחשבים ישנים לשיפור הפרודוקטיביות",
    "createdAt": "2024-09-10T15:45:00Z",
    "updatedAt": "2024-09-10T15:45:00Z"
  },
  "message": "בקשת רכש נוצרה בהצלחה"
}
```

**Validation שגיאות:**
```json
{
  "success": false,
  "message": "נתוני הבקשה לא תקינים",
  "errors": [
    {
      "field": "quantity",
      "message": "כמות חייבת להיות מספר חיובי"
    },
    {
      "field": "itemName", 
      "message": "שם פריט הוא שדה חובה"
    }
  ]
}
```

### GET `/api/procurement-requests/:id`
קבלת בקשת רכש ספציפית לפי ID.

**Path Parameters:**
- `id`: מספר זיהוי הבקשה

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "requestNumber": "REQ-2024-0847",
    "itemName": "מחשב נייד HP EliteBook",
    "category": "טכנולוגיה",
    "quantity": 5,
    "description": "מחשבים ניידים לצוות הפיתוח החדש",
    "status": "pending",
    "urgency": "גבוהה", 
    "requestedBy": "יוסי כהן",
    "department": "פיתוח",
    "budgetRange": "40,000-60,000",
    "justification": "הרחבת צוות הפיתוח דורשת ציוד מתקדם",
    "createdAt": "2024-09-10T10:30:00Z",
    "updatedAt": "2024-09-10T10:30:00Z",
    // נתונים נוספים אם קיימים
    "costEstimation": {
      "id": 12,
      "totalCost": "47,250",
      "confidenceLevel": 87
    },
    "documentsCount": 2,
    "extractedDataExists": true
  }
}
```

### PATCH `/api/procurement-requests/:id`
עדכון בקשת רכש קיימת (עדכון חלקי).

**Request Body (שדות אופציונליים):**
```json
{
  "status": "approved",
  "urgency": "קריטית",
  "description": "תיאור מעודכן עם פרטים נוספים",
  "budgetRange": "45,000-55,000"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "requestNumber": "REQ-2024-0847",
    "status": "approved", // עודכן
    "urgency": "קריטית", // עודכן
    // שאר הנתונים
    "updatedAt": "2024-09-10T16:20:00Z" // זמן העדכון
  },
  "message": "בקשת רכש עודכנה בהצלחה"
}
```

### DELETE `/api/procurement-requests/:id`
מחיקת בקשת רכש (רק למשתמשים מורשים).

**Response:**
```json
{
  "success": true,
  "message": "בקשת רכש נמחקה בהצלחה"
}
```

**שגיאת הרשאה:**
```json
{
  "success": false,
  "message": "אין לך הרשאה למחוק בקשה זו",
  "error": "INSUFFICIENT_PERMISSIONS"
}
```

---

## 💰 Cost Estimations API

### GET `/api/cost-estimations`
קבלת רשימת כל האומדנים במערכת.

**Query Parameters:**
```
?procurementRequestId=5  # אומדנים לבקשה ספציפית
&confidenceMin=80        # רמת ביטחון מינימלית
&totalCostMin=1000       # עלות מינימלית
&totalCostMax=100000     # עלות מקסימלית
```

**Response:**
```json
{
  "success": true, 
  "data": [
    {
      "id": 12,
      "procurementRequestId": 5,
      "totalCost": "47,250",
      "estimatedDeliveryTime": "2-3 שבועות",
      "confidenceLevel": 87,
      "methodology": "אומדן מבוסס היסטוריה + מחקר שוק עכשווי",
      "marketPrice": "49,800",
      "potentialSavings": "2,550",
      "recommendations": [
        "שקול רכישה בכמות גדולה יותר",
        "בדוק זמינות אצל ספק נוסף"
      ],
      "createdAt": "2024-09-10T11:15:00Z"
    }
  ]
}
```

### POST `/api/cost-estimations`
יצירת אומדן עלויות חדש.

**Request Body:**
```json
{
  "procurementRequestId": 5,
  "methodology": "AI analysis + market research",
  "totalCost": "47250",
  "confidenceLevel": 87,
  "estimatedDeliveryTime": "2-3 שבועות",
  "marketPrice": "49800",
  "potentialSavings": "2550",
  "recommendations": [
    "שקול רכישה בכמות גדולה יותר",
    "בדוק זמינות אצל ספק נוסף"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 13,
    "procurementRequestId": 5,
    "totalCost": "47,250", 
    "confidenceLevel": 87,
    "methodology": "AI analysis + market research",
    "estimatedDeliveryTime": "2-3 שבועות",
    "marketPrice": "49,800",
    "potentialSavings": "2,550",
    "recommendations": [
      "שקול רכישה בכמות גדולה יותר",
      "בדוק זמינות אצל ספק נוסף"
    ],
    "createdAt": "2024-09-10T16:30:00Z"
  },
  "message": "אומדן עלויות נוצר בהצלחה"
}
```

### GET `/api/cost-estimations/:id`
קבלת אומדן עלויות ספציפי.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 12,
    "procurementRequestId": 5,
    "procurementRequest": {
      "requestNumber": "REQ-2024-0847",
      "itemName": "מחשב נייד HP EliteBook",
      "quantity": 5
    },
    "totalCost": "47,250",
    "costBreakdown": {
      "unitCost": "9,450",
      "totalUnits": "47,250",
      "additionalCosts": "1,500",
      "taxes": "8,288",
      "grandTotal": "57,038"
    },
    "estimatedDeliveryTime": "2-3 שבועות",
    "confidenceLevel": 87,
    "methodology": "אומדן מבוסס היסטוריה + מחקר שוק עכשווי",
    "marketPrice": "49,800",
    "potentialSavings": "2,550",
    "savingsPercentage": 5.1,
    "recommendations": [
      "שקול רכישה בכמות גדולה יותר להנחה",
      "בדוק זמינות אצל ספק נוסף",
      "הזמן בזמן לקראת תקציב חדש"
    ],
    "riskFactors": [
      "עלייה במחירי חומרי גלם",
      "מחסור גלובלי בשבבים"
    ],
    "supplierOptions": [
      {
        "name": "ספק א'", 
        "price": "48,900",
        "deliveryTime": "2 שבועות",
        "reliability": 4.2
      }
    ],
    "createdAt": "2024-09-10T11:15:00Z"
  }
}
```

### POST `/api/cost-estimations/approve`
אישור אומדן עלויות (למנהלים).

**Request Body:**
```json
{
  "estimationId": 12,
  "approvedBy": "דני מנהל פיתוח",
  "comments": "האומדן נראה סביר ומאושר לביצוע",
  "budgetAllocated": "57,000"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "estimationId": 12,
    "status": "approved",
    "approvedBy": "דני מנהל פיתוח",
    "approvedAt": "2024-09-10T17:00:00Z",
    "comments": "האומדן נראה סביר ומאושר לביצוע",
    "budgetAllocated": "57,000"
  },
  "message": "אומדן אושר בהצלחה"
}
```

### POST `/api/calculate-estimate`
חישוב אומדן מתקדם עם בחירת שיטות.

**Request Body:**
```json
{
  "requestId": 5,
  "selectedMethods": [
    "historical", 
    "market_based",
    "ai_analysis"
  ],
  "methodWeights": {
    "historical": 40,
    "market_based": 35, 
    "ai_analysis": 25
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "requestId": 5,
    "methodResults": [
      {
        "method": "historical",
        "estimate": 45000,
        "confidence": 92,
        "weight": 40,
        "details": "מבוסס על 8 רכישות דומות בשנה האחרונה"
      },
      {
        "method": "market_based", 
        "estimate": 48500,
        "confidence": 78,
        "weight": 35,
        "details": "מחקר שוק עכשווי מ-5 ספקים מובילים"
      },
      {
        "method": "ai_analysis",
        "estimate": 49200,
        "confidence": 85,
        "weight": 25,
        "details": "ניתוח AI של מפרטים טכניים והתאמה לשוק"
      }
    ],
    "finalEstimate": {
      "amount": 47250,
      "confidence": 87,
      "methodology": "ממוצע משוקלל של 3 שיטות אומדן"
    },
    "breakdown": {
      "historicalContribution": 18000,
      "marketBasedContribution": 16975, 
      "aiAnalysisContribution": 12300
    },
    "recommendations": [
      "שיטת האומדן ההיסטורי נותנת תוצאות מהימנות ביותר",
      "שקול להעלות משקל השיטה ההיסטורית ל-50%",
      "מומלץ לבצע אומדן נוסף בעוד שבועיים"
    ]
  }
}
```

---

## 📁 Documents & File Management

### POST `/api/documents/upload/:requestId`
העלאת מסמך לבקשת רכש ספציפית.

**Path Parameters:**
- `requestId`: מספר זיהוי בקשת הרכש

**Request (multipart/form-data):**
```
document: [File] - הקובץ להעלאה
description: [String] (אופציונלי) - תיאור המסמך
```

**File Types מותרים:**
- PDF: `.pdf`
- Microsoft Word: `.doc`, `.docx`
- Microsoft Excel: `.xls`, `.xlsx`
- Images: `.jpg`, `.jpeg`, `.png`

**File Size Limit:** 10MB

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 16,
    "procurementRequestId": 5,
    "fileName": "מפרט_מחשבים_HP.pdf",
    "fileType": "application/pdf",
    "fileSize": 245760, // bytes
    "filePath": "/uploads/doc-1726849200123-456789.pdf",
    "isAnalyzed": false, // יעודכן אחרי ניתוח
    "uploadedAt": "2024-09-10T17:30:00Z"
  },
  "message": "המסמך הועלה בהצלחה, ניתוח AI יתחיל בקרוב"
}
```

**שגיאות העלאה:**
```json
{
  "success": false,
  "message": "סוג קובץ לא נתמך", 
  "error": "UNSUPPORTED_FILE_TYPE",
  "supportedTypes": ["pdf", "doc", "docx", "xls", "xlsx", "jpg", "png"]
}
```

### GET `/api/documents/request/:requestId`
קבלת כל המסמכים של בקשת רכש ספציפית.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 16,
      "procurementRequestId": 5,
      "fileName": "מפרט_מחשבים_HP.pdf",
      "fileType": "application/pdf", 
      "fileSize": 245760,
      "isAnalyzed": true,
      "analysisResults": {
        "status": "completed",
        "confidence": 94,
        "extractedText": "מחשב נייד HP EliteBook 850 G9...",
        "documentType": "technical_specification"
      },
      "extractedSpecs": {
        "processor": "Intel Core i7-1255U",
        "memory": "16GB DDR4",
        "storage": "512GB NVMe SSD",
        "display": "15.6\" Full HD"
      },
      "uploadedAt": "2024-09-10T17:30:00Z"
    },
    {
      "id": 17,
      "procurementRequestId": 5, 
      "fileName": "אישור_תקציב_מנהל.pdf",
      "fileType": "application/pdf",
      "fileSize": 128340,
      "isAnalyzed": true,
      "analysisResults": {
        "status": "completed", 
        "confidence": 88,
        "extractedText": "אישור תקציב לרכישת 5 מחשבים...",
        "documentType": "budget_approval"
      },
      "uploadedAt": "2024-09-10T17:35:00Z"
    }
  ]
}
```

### GET `/api/documents/:id/analysis`
קבלת תוצאות ניתוח AI למסמך ספציפי.

**Response:**
```json
{
  "success": true,
  "data": {
    "documentId": 16,
    "analysisStatus": "completed",
    "confidence": 94,
    "processingTime": "2.3 שניות",
    "documentType": "technical_specification",
    "extractedData": {
      "text": "מחשב נייד HP EliteBook 850 G9 עם מעבד Intel Core i7-1255U...",
      "specifications": {
        "brand": "HP",
        "model": "EliteBook 850 G9", 
        "processor": "Intel Core i7-1255U",
        "memory": "16GB DDR4",
        "storage": "512GB NVMe SSD",
        "display": "15.6\" Full HD",
        "os": "Windows 11 Pro",
        "warranty": "3 שנים"
      },
      "pricing_hints": {
        "estimated_unit_cost": "8500-9500",
        "market_availability": "זמין",
        "supplier_recommendations": ["HP Israel", "מחשבים וטכנולוגיה"]
      }
    },
    "qualityMetrics": {
      "textClarity": 97,
      "structureRecognition": 91, 
      "specsExtraction": 94,
      "overallQuality": 94
    },
    "warnings": [],
    "suggestions": [
      "המסמך כולל מפרטים מפורטים ומתאים לאומדן מדויק",
      "מומלץ לבדוק זמינות המודל הספציפי"
    ]
  }
}
```

### POST `/api/ai-analysis/:requestId`
הפעלת ניתוח AI ידני לכל מסמכי בקשת הרכש.

**Response:**
```json
{
  "success": true,
  "data": {
    "requestId": 5,
    "status": "processing",
    "estimatedTime": "3-5 דקות",
    "documentsInQueue": 2,
    "jobId": "ai-job-1726849800456"
  },
  "message": "ניתוח AI החל, תוצאות יהיו זמינות בקרוב"
}
```

### GET `/api/procurement-requests/:id/extracted-data`
קבלת הנתונים המחולצים מניתוח AI לבקשת רכש.

**Response:**
```json
{
  "success": true,
  "data": {
    "requestId": 5,
    "hasExtractedData": true,
    "extractionDate": "2024-09-10T17:32:00Z",
    "status": "completed",
    "combinedSpecs": {
      "itemName": "מחשב נייד HP EliteBook 850 G9",
      "brand": "HP",
      "model": "EliteBook 850 G9",
      "processor": "Intel Core i7-1255U",
      "memory": "16GB DDR4", 
      "storage": "512GB NVMe SSD",
      "display": "15.6\" Full HD",
      "os": "Windows 11 Pro",
      "warranty": "3 שנים"
    },
    "budgetInfo": {
      "approved": true,
      "maxAmount": "60,000",
      "approvedBy": "דני מנהל פיתוח"
    },
    "marketAnalysis": {
      "currentMarketPrice": "9,200-9,800",
      "availability": "זמין מספקים מרובים", 
      "competitiveAlternatives": [
        "Dell Latitude 5530",
        "Lenovo ThinkPad T15"
      ]
    },
    "aiRecommendations": [
      "המפרטים ברורים ומתאימים לאומדן מדויק",
      "התקציב המאושר מספיק לרכישה",
      "מומלץ להשוות מחירים מ-3 ספקים לפחות"
    ]
  }
}
```

---

## 🔍 Market Research & Insights

### GET `/api/market-research/:requestId`
מחקר שוק מתקדם לבקשת רכש ספציפית.

**Response:**
```json
{
  "success": true,
  "data": {
    "requestId": 5,
    "marketAnalysis": {
      "category": "מחשבים ניידים עסקיים",
      "marketTrends": {
        "priceDirection": "עליה קלה", 
        "changePercent": 2.3,
        "lastQuarter": "Q3 2024",
        "forecast": "יציבות במחירים הבאים 6 חודשים"
      },
      "competitorProducts": [
        {
          "brand": "Dell",
          "model": "Latitude 5530",
          "estimatedPrice": "8,900",
          "marketShare": 23
        },
        {
          "brand": "Lenovo", 
          "model": "ThinkPad T15",
          "estimatedPrice": "9,400",
          "marketShare": 19
        },
        {
          "brand": "HP",
          "model": "EliteBook 850",
          "estimatedPrice": "9,200", 
          "marketShare": 18
        }
      ],
      "supplierLandscape": {
        "totalSuppliers": 12,
        "preferredSuppliers": 5,
        "averageDeliveryTime": "2.1 שבועות",
        "paymentTerms": "30 ימים ממוצע"
      }
    },
    "riskAssessment": {
      "supplyRisk": "נמוך",
      "priceVolatility": "נמוך-בינוני", 
      "qualityRisk": "נמוך",
      "deliveryRisk": "נמוך",
      "overallRisk": "נמוך"
    },
    "opportunities": [
      "הנחת כמות אפשרית מעל 10 יחידות",
      "מחירים תחרותיים בסוף הרבעון",
      "חבילות שירות מורחבות זמינות"
    ]
  }
}
```

### GET `/api/market-insights`
תובנות שוק כלליות בכל הקטגוריות.

**Query Parameters:**
```
?category=טכנולוגיה    # סינון לפי קטגוריה
&timeframe=3months     # נקודת זמן (1month, 3months, 6months, 1year)
&metric=price          # מדד (price, availability, risk)
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "category": "טכנולוגיה",
      "subcategory": "מחשבים ניידים",
      "insights": {
        "averagePrice": "8,750",
        "priceChange": "+2.1%",
        "availability": "גבוהה",
        "leadTime": "1-3 שבועות",
        "topBrands": ["HP", "Dell", "Lenovo"],
        "marketLeader": "HP (23% נתח שוק)"
      },
      "trends": {
        "last6Months": [
          {"month": "2024-04", "avgPrice": 8400},
          {"month": "2024-05", "avgPrice": 8520},
          {"month": "2024-06", "avgPrice": 8630},
          {"month": "2024-07", "avgPrice": 8720},
          {"month": "2024-08", "avgPrice": 8750},
          {"month": "2024-09", "avgPrice": 8750}
        ]
      },
      "recommendations": [
        "מחירים יציבים - זמן טוב לרכישה",
        "זמינות גבוהה מספקים מרובים",
        "שקול רכישת דור קודם בהנחה"
      ],
      "updatedAt": "2024-09-10T12:00:00Z"
    }
  ]
}
```

### GET `/api/market-insights/:category`
תובנות שוק לקטגוריה ספציפית.

**Response:**
```json
{
  "success": true,
  "data": {
    "category": "טכנולוגיה",
    "overview": {
      "totalProducts": 247,
      "averagePrice": "12,340",
      "priceRange": "800-85,000", 
      "volatilityIndex": 2.3,
      "demandLevel": "גבוה"
    },
    "subcategories": [
      {
        "name": "מחשבים ניידים",
        "count": 89,
        "avgPrice": "8,750",
        "trend": "יציב"
      },
      {
        "name": "שרתים",
        "count": 34,
        "avgPrice": "45,200", 
        "trend": "עליה"
      },
      {
        "name": "ציוד רשת",
        "count": 67,
        "avgPrice": "3,400",
        "trend": "ירידה"
      }
    ],
    "keyInsights": [
      "עליה של 3.2% במחירי השרתים בגלל מחסור בשבבים",
      "ירידה של 1.8% בציוד רשת בגלל תחרות מוגברת",
      "מחשבים ניידים - מחירים יציבים, זמינות טובה"
    ],
    "forecast": {
      "nextQuarter": "יציבות במחירי מחשבים, עליה קלה בשרתים",
      "confidence": 78
    }
  }
}
```

### GET `/api/suppliers`
רשימת כל הספקים במערכת עם דירוגים.

**Query Parameters:**
```
?category=טכנולוגיה      # סינון לפי קטגוריה
&rating=4              # דירוג מינימלי (1-5)
&reliability=80        # אמינות מינימלית (0-100)
&location=תל-אביב       # מיקום גיאוגרפי
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "טכנולוגיות מתקדמות בע\"מ",
      "category": "טכנולוגיה",
      "contactEmail": "sales@tech-advanced.co.il",
      "phone": "03-1234567",
      "website": "https://tech-advanced.co.il",
      "rating": 4.2,
      "reliabilityScore": 89,
      "specialties": [
        "מחשבים ניידים",
        "שרתים", 
        "ציוד רשת"
      ],
      "businessTerms": {
        "paymentTerms": "30 ימים",
        "deliveryTime": "1-2 שבועות",
        "warranty": "3 שנים סטנדרט",
        "minimumOrder": "5,000"
      },
      "performance": {
        "onTimeDelivery": 94,
        "qualityRating": 4.1,
        "customerService": 4.3,
        "priceCompetitiveness": 3.8
      },
      "recentOrders": 23,
      "totalValue": "₪1,245,000",
      "lastOrderDate": "2024-09-08T10:00:00Z",
      "createdAt": "2023-01-15T08:00:00Z"
    }
  ]
}
```

### GET `/api/supplier-quotes/:requestId`
קבלת הצעות מחיר מספקים לבקשת רכש.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 8,
      "supplierId": 1,
      "supplierName": "טכנולוגיות מתקדמות בע\"מ",
      "procurementRequestId": 5,
      "quotedPrice": "48,900",
      "unitPrice": "9,780",
      "quantity": 5,
      "deliveryTime": "2 שבועות",
      "validUntil": "2024-09-24T23:59:59Z",
      "terms": [
        "30 ימי תשלום",
        "אחריות 3 שנים",
        "התקנה חינם",
        "הדרכת משתמשים כלולה"
      ],
      "additionalServices": [
        "תמיכה טכנית 24/7",
        "גיבוי מידע חינם לשנה ראשונה"
      ],
      "notes": "מחיר מיוחד לכמות, זמין למשלוח מיידי",
      "createdAt": "2024-09-10T14:20:00Z"
    },
    {
      "id": 9,
      "supplierId": 2, 
      "supplierName": "מחשבים ישראל",
      "procurementRequestId": 5,
      "quotedPrice": "46,750",
      "unitPrice": "9,350", 
      "quantity": 5,
      "deliveryTime": "3 שבועות",
      "validUntil": "2024-09-20T23:59:59Z",
      "terms": [
        "45 ימי תשלום",
        "אחריות שנתיים",
        "משלוח חינם"
      ],
      "notes": "מחיר תחרותי, זמני אספקה גמישים",
      "createdAt": "2024-09-10T15:10:00Z"
    }
  ]
}
```

---

## 📊 Dashboard & Analytics

### GET `/api/dashboard/stats`
סטטיסטיקות מרכזיות לדשבורד.

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRequests": 47,
      "activeRequests": 12,
      "completedRequests": 31,
      "totalEstimatedValue": "₪2,847,500",
      "totalActualSavings": "₪284,750",
      "averageProcessingTime": "3.2 ימים"
    },
    "trends": {
      "requestsThisMonth": 8,
      "requestsLastMonth": 12,
      "monthlyChange": -33.3,
      "averageEstimateAccuracy": 89.2,
      "topCategories": [
        {"name": "טכנולוגיה", "count": 18, "percentage": 38.3},
        {"name": "ריהוט", "count": 12, "percentage": 25.5}, 
        {"name": "ציוד משרדי", "count": 9, "percentage": 19.1},
        {"name": "שירותים", "count": 8, "percentage": 17.0}
      ]
    },
    "performance": {
      "estimationAccuracy": {
        "thisQuarter": 89.2,
        "lastQuarter": 86.7,
        "improvement": 2.5
      },
      "timeToEstimate": {
        "average": "2.1 שעות",
        "target": "4 שעות", 
        "performance": "excellent"
      },
      "userSatisfaction": 4.2,
      "systemUptime": 99.8
    },
    "alerts": [
      {
        "type": "warning",
        "message": "3 בקשות ממתינות לאישור מעל 5 ימים", 
        "count": 3
      },
      {
        "type": "info",
        "message": "מחירי טכנולוגיה עלו ב-2.3% החודש",
        "category": "market_update"
      }
    ]
  }
}
```

### GET `/api/reports/savings`
דוח חיסכונים מפורט.

**Query Parameters:**
```
?period=3months        # תקופה (1month, 3months, 6months, 1year)
&category=טכנולוגיה    # קטגוריה ספציפית
&department=פיתוח      # מחלקה ספציפית
```

**Response:**
```json
{
  "success": true,
  "data": {
    "period": "3 חודשים אחרונים",
    "totalSavings": "₪284,750",
    "savingsBreakdown": [
      {
        "category": "טכנולוגיה",
        "savings": "₪125,400",
        "percentage": 44.1,
        "requestsCount": 18
      },
      {
        "category": "ריהוט", 
        "savings": "₪89,200",
        "percentage": 31.3,
        "requestsCount": 12
      },
      {
        "category": "ציוד משרדי",
        "savings": "₪47,650", 
        "percentage": 16.7,
        "requestsCount": 9
      },
      {
        "category": "שירותים",
        "savings": "₪22,500",
        "percentage": 7.9,
        "requestsCount": 8
      }
    ],
    "departmentBreakdown": [
      {
        "department": "פיתוח",
        "savings": "₪156,300",
        "requestsCount": 22
      },
      {
        "department": "מכירות",
        "savings": "₪78,450",
        "requestsCount": 14
      }
    ],
    "monthlyTrend": [
      {"month": "2024-07", "savings": "₪98,200"},
      {"month": "2024-08", "savings": "₪87,550"},
      {"month": "2024-09", "savings": "₪99,000"}
    ],
    "topSavingsOpportunities": [
      {
        "requestId": 42,
        "itemName": "שולחנות משרד",
        "originalEstimate": "₪45,000",
        "finalCost": "₪32,800",
        "savings": "₪12,200", 
        "savingsPercent": 27.1
      }
    ],
    "projectedSavings": {
      "nextQuarter": "₪320,000",
      "confidence": 82
    }
  }
}
```

### GET `/api/reports/performance`
דוח ביצועי מערכת ודיוק אומדנים.

**Response:**
```json
{
  "success": true,
  "data": {
    "systemPerformance": {
      "uptime": 99.8,
      "averageResponseTime": "45ms",
      "errorRate": 0.2,
      "activeUsers": 23,
      "peakUsers": 45
    },
    "estimationAccuracy": {
      "overall": 89.2,
      "byCategory": [
        {
          "category": "טכנולוגיה",
          "accuracy": 91.5,
          "requestsCount": 18
        },
        {
          "category": "ריהוט", 
          "accuracy": 87.8,
          "requestsCount": 12
        }
      ],
      "byMethod": [
        {
          "method": "historical",
          "accuracy": 92.3
        },
        {
          "method": "ai_analysis",
          "accuracy": 86.7
        },
        {
          "method": "market_based", 
          "accuracy": 84.1
        }
      ]
    },
    "processingMetrics": {
      "averageEstimationTime": "2.1 שעות",
      "averageDocumentAnalysis": "45 שניות",
      "aiAnalysisSuccessRate": 96.8,
      "userSatisfactionScore": 4.2
    },
    "usagePatterns": {
      "peakHours": ["09:00-11:00", "14:00-16:00"],
      "mostActiveDay": "רביעי",
      "averageRequestsPerDay": 2.3,
      "topFeatures": [
        {"feature": "אומדן עלויות", "usage": 89.2},
        {"feature": "העלאת מסמכים", "usage": 76.4},
        {"feature": "מחקר שוק", "usage": 62.1}
      ]
    }
  }
}
```

---

## 🛠️ Admin & System Management

### GET `/api/admin/users`
ניהול משתמשים (רק למנהלי מערכת).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "yossi.cohen",
      "name": "יוסי כהן",
      "email": "yossi@company.co.il",
      "role": "manager", 
      "department": "רכש",
      "isActive": true,
      "lastLogin": "2024-09-10T16:45:00Z",
      "createdAt": "2024-01-15T08:00:00Z",
      "requestsCount": 23,
      "totalEstimatedValue": "₪567,800"
    }
  ]
}
```

### POST `/api/admin/reset-demo`
איפוס מצב ההדגמה (למנהלי מערכת).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRequests": 47,
    "updatedRequests": 12,
    "resetActions": [
      "סטטוס כל הבקשות הוחזר ל'pending'",
      "נתוני ההדגמה נטענו מחדש",
      "cache נוקה בהצלחה"
    ]
  },
  "message": "מצב ההדגמה אופס בהצלחה"
}
```

### GET `/api/system/health`
בדיקת תקינות המערכת.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-09-10T18:00:00Z",
    "uptime": "7 days 14 hours",
    "services": {
      "database": {
        "status": "connected",
        "responseTime": "12ms"
      },
      "fileSystem": {
        "status": "healthy",
        "freeSpace": "85.2 GB"
      },
      "aiService": {
        "status": "operational", 
        "lastProcessed": "2024-09-10T17:58:00Z"
      }
    },
    "metrics": {
      "memoryUsage": "67.2%",
      "cpuUsage": "23.1%",
      "activeConnections": 12,
      "requestsToday": 89
    }
  }
}
```

---

## 🔍 Search & Filtering

### GET `/api/search`
חיפוש אוניברסלי בכל המערכת.

**Query Parameters:**
```
?q=מחשב               # מילת החיפוש
&type=all             # סוג (all, requests, estimations, documents)
&limit=50             # מספר תוצאות מקסימלי
```

**Response:**
```json
{
  "success": true,
  "data": {
    "query": "מחשב",
    "totalResults": 15,
    "results": [
      {
        "type": "procurement_request",
        "id": 5,
        "title": "מחשב נייד HP EliteBook",
        "description": "מחשבים ניידים לצוות הפיתוח",
        "relevanceScore": 95,
        "url": "/procurement-requests/5"
      },
      {
        "type": "document", 
        "id": 16,
        "title": "מפרט_מחשבים_HP.pdf",
        "description": "מפרט טכני למחשבים ניידים",
        "relevanceScore": 87,
        "url": "/documents/16"
      },
      {
        "type": "cost_estimation",
        "id": 12,
        "title": "אומדן עלויות למחשבים ניידים",
        "description": "אומדן מפורט עם רמת ביטחון 87%",
        "relevanceScore": 82,
        "url": "/cost-estimations/12" 
      }
    ],
    "suggestions": [
      "מחשבים ניידים",
      "מחשב שולחני",
      "ציוד מחשוב"
    ]
  }
}
```

---

## 📝 Error Handling Reference

### שגיאות Validation
```json
{
  "success": false,
  "message": "נתונים לא תקינים",
  "error": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "quantity",
      "message": "כמות חייבת להיות מספר חיובי",
      "code": "INVALID_NUMBER"
    },
    {
      "field": "itemName",
      "message": "שם פריט הוא שדה חובה",
      "code": "REQUIRED_FIELD"
    }
  ]
}
```

### שגיאות Authentication
```json
{
  "success": false,
  "message": "נדרש אימות משתמש",
  "error": "UNAUTHORIZED", 
  "code": 401
}
```

### שגיאות הרשאות
```json
{
  "success": false,
  "message": "אין לך הרשאה לבצע פעולה זו",
  "error": "INSUFFICIENT_PERMISSIONS",
  "requiredRole": "manager",
  "currentRole": "user",
  "code": 403
}
```

### שגיאות שרת פנימיות
```json
{
  "success": false,
  "message": "שגיאה פנימית בשרת",
  "error": "INTERNAL_SERVER_ERROR",
  "requestId": "req_1726849800456",
  "code": 500
}
```

---

## 🧪 Testing & Development

### Environment Variables נדרשים
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/procurement_db
NODE_ENV=development
PORT=5000
SESSION_SECRET=your-secure-session-secret
UPLOAD_PATH=./uploads
```

### Rate Limiting
```
חיפוש: 100 בקשות לדקה למשתמש
העלאת קבצים: 10 קבצים לדקה למשתמש  
API כללי: 1000 בקשות לשעה למשתמש
```

### Pagination Default Values
```
page: 1 (מינימום)
limit: 20 (ברירת מחדל), 100 (מקסימום)
sort: createdAt (ברירת מחדל)
order: desc (ברירת מחדל)
```

---

**מסמך זה מתעדכן באופן קבוע עם הוספת תכונות חדשות**  
**גרסה נוכחית**: v1.0.0  
**עדכון אחרון**: ספטמבר 2025

---

💻 **להורדת Postman Collection**: [API Collection Download](./postman-collection.json)  
📋 **API Changelog**: [CHANGELOG.md](../CHANGELOG.md)  
🔧 **Development Setup**: [DEVELOPMENT.md](../DEVELOPMENT.md)