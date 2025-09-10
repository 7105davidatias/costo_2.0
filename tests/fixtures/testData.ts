// Test data fixtures for comprehensive testing

export const procurementRequestFixtures = {
  basic: {
    itemName: 'מחשב נייד',
    category: 'טכנולוגיה',
    quantity: 5,
    description: 'מחשבים ניידים לצוות הפיתוח',
    urgency: 'גבוהה',
    requestedBy: 'יוסי כהן',
    department: 'פיתוח'
  },
  
  minimal: {
    itemName: 'עט',
    category: 'משרד',
    quantity: 10
  },
  
  complex: {
    itemName: 'שרת Dell PowerEdge R750',
    category: 'תשתיות IT',
    quantity: 2,
    description: 'שרתים לסביבת הפרודקציה החדשה',
    technicalSpecs: {
      processor: 'Intel Xeon Silver 4314',
      memory: '64GB DDR4',
      storage: '2TB NVMe SSD',
      network: '4x 1GbE + 2x 10GbE'
    },
    urgency: 'קריטית',
    budgetRange: '50000-80000',
    expectedDelivery: '2024-02-15',
    requestedBy: 'רחל לוי',
    department: 'תשתיות',
    justification: 'החלפת שרתים ישנים שמגיעים לסוף החיים',
    approvalRequired: true,
    vendor_preferences: ['Dell', 'HP', 'Lenovo'],
    compliance_requirements: ['ISO 27001', 'אבטחת מידע']
  },
  
  hebrew_heavy: {
    itemName: 'כיסאות ארגונומיים מתקדמים',
    category: 'ריהוט וציוד משרדי',
    quantity: 25,
    description: 'כיסאות ארגונומיים איכותיים למשרד החדש בתל אביב, הכולל תמיכה לומבארית מתכווננת ומנגנון הטיה מתקדם',
    technicalSpecs: {
      material: 'רשת אוורורית',
      adjustments: 'גובה, זווית, תמיכה לומבארית',
      warranty: '5 שנים',
      certification: 'תקן ישראלי 1144'
    },
    urgency: 'בינונית',
    requestedBy: 'שרה אברהמי',
    department: 'משאבי אנוש',
    justification: 'שיפור תנאי העבודה ומניעת פגיעות גב'
  },
  
  edge_cases: {
    itemName: 'A'.repeat(200), // Long name
    category: 'בדיקות',
    quantity: 1,
    description: 'ב'.repeat(1000), // Very long description
    specialCharacters: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    unicode: '🔧⚡💻📊',
    numbers: '1234567890',
    mixed: 'Mixed עברית English 123'
  }
}

export const costEstimationFixtures = {
  basic: {
    procurementRequestId: 1,
    totalCost: '15000',
    estimatedDeliveryTime: '2-3 שבועות',
    confidenceLevel: 85,
    methodology: 'אומדן מבוסס היסטוריה'
  },
  
  detailed: {
    procurementRequestId: 1,
    totalCost: '125000',
    estimatedDeliveryTime: '4-6 שבועות',
    confidenceLevel: 92,
    methodology: 'אומדן מבוסס הצעות ספקים',
    breakdown: [
      { item: 'עלות יחידה', amount: 45000, description: 'מחיר לשרת יחיד' },
      { item: 'התקנה והגדרה', amount: 15000, description: 'שירותי מומחה' },
      { item: 'אחריות מורחבת', amount: 8000, description: '3 שנות אחריות' },
      { item: 'שילוח וביטוח', amount: 4500, description: 'משלוח מהיצרן' },
      { item: 'מס ערך מוסף', amount: 12500, description: '17% מע״ם' }
    ],
    marketPrice: '135000',
    potentialSavings: '10000',
    riskFactors: [
      'זמינות מוגבלת בשוק',
      'עלייה צפויה במחירי חומרי גלם',
      'תלות ברגולציה חדשה'
    ],
    alternatives: [
      {
        name: 'שרת HP ProLiant',
        cost: '118000',
        pros: ['זמינות מיידית', 'מחיר נמוך יותר'],
        cons: ['ביצועים מעט נמוכים יותר', 'אחריות סטנדרטית']
      }
    ],
    recommendations: [
      'בדיקת הצעות מספקים נוספים',
      'שקילת רכישה בכמויות גדולות יותר',
      'הזמנה מוקדמת למניעת עיכובים'
    ]
  },
  
  high_confidence: {
    procurementRequestId: 2,
    totalCost: '850',
    estimatedDeliveryTime: '3-5 ימים',
    confidenceLevel: 98,
    methodology: 'מחירון מאושר ספק',
    marketPrice: '900',
    potentialSavings: '50'
  },
  
  low_confidence: {
    procurementRequestId: 3,
    totalCost: '45000',
    estimatedDeliveryTime: '8-12 שבועות',
    confidenceLevel: 65,
    methodology: 'אומדן ראשוני',
    uncertaintyFactors: [
      'מפרט לא סופי',
      'תלות בתקנים עתידיים',
      'חוסר ודאות בזמינות ספקים'
    ],
    recommendedActions: [
      'בירור מפרט מדויק',
      'בדיקת חלופות',
      'תיאום עם ספקים פוטנציאליים'
    ]
  }
}

export const supplierFixtures = {
  basic: {
    name: 'טכנולוגיות מתקדמות בע״מ',
    category: 'טכנולוגיה',
    contactEmail: 'sales@tech-advanced.co.il',
    phone: '03-1234567',
    rating: 4.5
  },
  
  detailed: {
    name: 'פתרונות IT ישראל',
    category: 'תשתיות IT',
    contactEmail: 'info@it-solutions.co.il',
    phone: '08-9876543',
    website: 'https://www.it-solutions.co.il',
    address: {
      street: 'רחוב הטכנולוגיה 15',
      city: 'הרצליה',
      zipCode: '4673304',
      country: 'ישראל'
    },
    rating: 4.8,
    certifications: ['ISO 9001', 'ISO 27001', 'Microsoft Gold Partner'],
    specialties: ['שרתים', 'אבטחת מידע', 'ענן היברידי'],
    paymentTerms: 'שוטף + 30',
    deliveryTime: '5-7 ימי עבודה',
    minimumOrder: 5000,
    discountTiers: [
      { threshold: 50000, discount: 5 },
      { threshold: 100000, discount: 10 },
      { threshold: 250000, discount: 15 }
    ]
  }
}

export const documentFixtures = {
  basic: {
    fileName: 'מפרט_טכני.pdf',
    fileType: 'application/pdf',
    fileSize: 245760, // ~240KB
    isAnalyzed: false
  },
  
  analyzed: {
    fileName: 'הצעת_מחיר_ספק_א.pdf',
    fileType: 'application/pdf',
    fileSize: 156789,
    isAnalyzed: true,
    analysisResults: {
      status: 'completed',
      confidence: 94,
      extractedText: 'הצעת מחיר לרכישת 5 מחשבים ניידים',
      processingTime: '2.3 seconds',
      documentType: 'price_quote'
    },
    extractedSpecs: {
      totalPrice: 45000,
      unitPrice: 9000,
      quantity: 5,
      deliveryTime: '2 weeks',
      validityPeriod: '30 days'
    }
  }
}

export const marketInsightFixtures = {
  technology: {
    category: 'טכנולוגיה',
    trends: [
      'מעבר לעבודה היברידית מגביר את הביקוש למחשבים ניידים',
      'מחירי זיכרון יציבים ברבעון האחרון',
      'עלייה של 15% במחירי מסכים בגלל מחסור בשבבים'
    ],
    averagePrices: {
      laptop: { min: 3500, max: 8500, average: 5200 },
      desktop: { min: 2800, max: 6500, average: 4100 },
      monitor: { min: 800, max: 2200, average: 1300 }
    },
    suppliers: ['Dell', 'HP', 'Lenovo', 'Asus'],
    marketConditions: 'יציב עם מגמת עלייה קלה'
  }
}

export const invalidDataFixtures = {
  malformedIds: ['abc', '-1', '0', '1.5', '', null, undefined, 'null'],
  oversizedStrings: {
    name: 'A'.repeat(1000),
    description: 'B'.repeat(10000)
  },
  invalidNumbers: [-1, 0, 'abc', null, undefined, Infinity, NaN],
  invalidDates: ['not-a-date', '2024-13-45', 'yesterday'],
  sqlInjection: [
    "'; DROP TABLE procurement_requests; --",
    '1 OR 1=1',
    '<script>alert("xss")</script>'
  ],
  specialCharacters: ['🔧⚡💻', '!@#$%^&*()', '\\n\\r\\t', '\x00\x01\x02']
}

// Helper functions for generating test data
export function generateMockRequests(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    ...procurementRequestFixtures.basic,
    id: i + 1,
    itemName: `${procurementRequestFixtures.basic.itemName} ${i + 1}`,
    quantity: (i % 10) + 1,
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000) // Spread over days
  }))
}

export function generateMockEstimations(requestIds: number[]) {
  return requestIds.map((requestId, i) => ({
    ...costEstimationFixtures.basic,
    id: i + 1,
    procurementRequestId: requestId,
    totalCost: ((i + 1) * 1000).toString(),
    confidenceLevel: 70 + (i % 30),
    createdAt: new Date()
  }))
}