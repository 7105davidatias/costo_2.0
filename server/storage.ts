import { 
  users, suppliers, procurementRequests, costEstimations, 
  supplierQuotes, documents, marketInsights,
  type User, type InsertUser, type ProcurementRequest, type InsertProcurementRequest,
  type Supplier, type InsertSupplier, type CostEstimation, type InsertCostEstimation,
  type SupplierQuote, type InsertSupplierQuote, type Document, type InsertDocument,
  type MarketInsight, type InsertMarketInsight
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Procurement Requests
  getProcurementRequests(): Promise<ProcurementRequest[]>;
  getProcurementRequest(id: number): Promise<ProcurementRequest | undefined>;
  createProcurementRequest(request: InsertProcurementRequest): Promise<ProcurementRequest>;
  updateProcurementRequest(id: number, request: Partial<InsertProcurementRequest>): Promise<ProcurementRequest | undefined>;

  // Suppliers
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;

  // Cost Estimations
  getCostEstimations(): Promise<CostEstimation[]>;
  getCostEstimation(id: number): Promise<CostEstimation | undefined>;
  getCostEstimationByRequestId(requestId: number): Promise<CostEstimation | undefined>;
  createCostEstimation(estimation: InsertCostEstimation): Promise<CostEstimation>;

  // Supplier Quotes
  getSupplierQuotes(): Promise<SupplierQuote[]>;
  getSupplierQuotesByRequestId(requestId: number): Promise<SupplierQuote[]>;
  createSupplierQuote(quote: InsertSupplierQuote): Promise<SupplierQuote>;

  // Documents
  getDocumentsByRequestId(requestId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;

  // Market Insights
  getMarketInsights(): Promise<MarketInsight[]>;
  getMarketInsightByCategory(category: string): Promise<MarketInsight | undefined>;
  createMarketInsight(insight: InsertMarketInsight): Promise<MarketInsight>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private procurementRequests: Map<number, ProcurementRequest>;
  private suppliers: Map<number, Supplier>;
  private costEstimations: Map<number, CostEstimation>;
  private supplierQuotes: Map<number, SupplierQuote>;
  private documents: Map<number, Document>;
  private marketInsights: Map<number, MarketInsight>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.procurementRequests = new Map();
    this.suppliers = new Map();
    this.costEstimations = new Map();
    this.supplierQuotes = new Map();
    this.documents = new Map();
    this.marketInsights = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Create default user
    const defaultUser: User = {
      id: this.currentId++,
      username: "admin",
      password: "password",
      displayName: "אהרון כהן",
      role: "admin",
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Create suppliers
    const suppliers: Supplier[] = [
      {
        id: this.currentId++,
        name: "TechSource Ltd",
        code: "TS",
        rating: "4.8",
        reliability: 98,
        deliveryTime: 10,
        discountPolicy: "5% מעל ₪150K",
        warrantyTerms: "3 שנים + תמיכה",
        isPreferred: true,
        contactInfo: { email: "sales@techsource.co.il", phone: "03-1234567" },
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        name: "Dell Technologies",
        code: "DT",
        rating: "4.9",
        reliability: 99,
        deliveryTime: 14,
        discountPolicy: "3% סטנדרט",
        warrantyTerms: "3 שנים",
        isPreferred: false,
        contactInfo: { email: "sales@dell.co.il", phone: "03-9876543" },
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        name: "CompuTrade",
        code: "CT",
        rating: "4.6",
        reliability: 85,
        deliveryTime: 12,
        discountPolicy: "2% סטנדרט",
        warrantyTerms: "2 שנים",
        isPreferred: false,
        contactInfo: { email: "info@computrade.co.il", phone: "03-5555555" },
        createdAt: new Date(),
      },
    ];

    suppliers.forEach(supplier => this.suppliers.set(supplier.id, supplier));

    // Create procurement requests
    const requests: ProcurementRequest[] = [
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-001",
        itemName: "מחשבים ניידים Dell Latitude 5520",
        description: "מחשבים ניידים לעובדי המשרד",
        category: "חומרה - מחשבים",
        quantity: 25,
        priority: "medium",
        targetDate: new Date("2024-03-15"),
        requestedBy: "שרה לוי",
        department: "IT",
        status: "completed",
        estimatedCost: "125000",
        specifications: {
          processor: "Intel Core i5",
          memory: "16GB DDR4",
          storage: "512GB SSD",
          display: "15.6 FHD"
        },
        userId: defaultUser.id,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-002",
        itemName: "כסאות משרד ארגונומיים",
        description: "כסאות משרד איכותיים לעובדים",
        category: "ריהוט משרדי",
        quantity: 50,
        priority: "low",
        targetDate: new Date("2024-04-01"),
        requestedBy: "מיכל כהן",
        department: "משאבי אנוש",
        status: "processing",
        estimatedCost: "75000",
        specifications: {
          type: "ארגונומי",
          material: "בד נושם",
          adjustable: true,
          warranty: "5 שנים"
        },
        userId: defaultUser.id,
        createdAt: new Date("2024-01-18"),
        updatedAt: new Date("2024-01-18"),
      },
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-003",
        itemName: "שרתי Dell PowerEdge R750",
        description: "שרתים עבור מרכז הנתונים",
        category: "חומרה - שרתים",
        quantity: 3,
        priority: "high",
        targetDate: new Date("2024-03-15"),
        requestedBy: "דוד לוי",
        department: "IT",
        status: "new",
        estimatedCost: "180000",
        specifications: {
          processor: "Intel Xeon Silver 4314 (16 cores)",
          memory: "64GB DDR4 ECC",
          storage: "2x 1TB NVMe SSD",
          network: "4x 1GbE + 2x 10GbE"
        },
        userId: defaultUser.id,
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
      },
    ];

    requests.forEach(request => this.procurementRequests.set(request.id, request));

    // Create cost estimation
    const costEstimation: CostEstimation = {
      id: this.currentId++,
      procurementRequestId: 3,
      totalCost: "180000",
      basePrice: "165000",
      tax: "25800",
      shippingCost: "2400",
      discountAmount: "13200",
      confidenceLevel: 94,
      marketPrice: "205000",
      potentialSavings: "25000",
      justifications: [
        {
          variable: "מחיר יחידה בסיסי",
          value: "₪55,000",
          source: "מחירון Dell רשמי",
          confidence: 98,
          impact: "+₪165,000"
        },
        {
          variable: "הנחת כמות (3+ יחידות)",
          value: "8%",
          source: "מדיניות ספק",
          confidence: 85,
          impact: "-₪13,200"
        },
        {
          variable: "מע\"ם (17%)",
          value: "₪25,800",
          source: "חוק מע\"ם ישראל",
          confidence: 100,
          impact: "+₪25,800"
        },
        {
          variable: "עלויות הובלה והתקנה",
          value: "₪2,400",
          source: "אומדן על בסיס מרחק",
          confidence: 75,
          impact: "+₪2,400"
        }
      ],
      recommendedSupplierId: 1,
      aiAnalysisResults: {
        priceStability: 87,
        supplierReliability: 92,
        marketPosition: 78,
        savingsOpportunities: [
          "שקול רכישה בחודש מרץ - צפויה הנחה נוספת של 3-5%",
          "ספק מומלץ: TechSource - 98% דירוג שירות, 5% הנחה נוספת"
        ],
        riskAssessment: [
          "מחסור חזוי בשבבים ברבעון השני - מומלץ להזמין בהקדם"
        ]
      },
      createdAt: new Date(),
    };

    this.costEstimations.set(costEstimation.id, costEstimation);

    // Add more cost estimations for all requests
    const moreEstimations: CostEstimation[] = [
      // For REQ-2024-001 (Dell Laptops)
      {
        id: this.currentId++,
        procurementRequestId: 1,
        totalCost: "125000",
        basePrice: "106800",
        tax: "18156",
        shippingCost: "0",
        discountAmount: "0",
        confidenceLevel: 96,
        marketPrice: "135000",
        potentialSavings: "10000",
        estimatedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        aiAnalysisResults: {
          reasoning: [
            { factor: "מחיר יחידה", impact: "סטנדרט", description: "₪4,272 ליחידה - תחרותי" },
            { factor: "זמינות", impact: "מעולה", description: "במלאי, משלוח מיידי" },
            { factor: "איכות ספק", impact: "גבוהה", description: "Dell - ספק מהימן" }
          ],
          sources: [
            { name: "מחירון Dell Israel", price: "₪125,000", date: "2024-01-15" },
            { name: "השוואת מחירים", price: "₪120,000-₪130,000", date: "2024-01-10" }
          ]
        },
        createdAt: new Date(),
      },
      // For REQ-2024-002 (Office Chairs)
      {
        id: this.currentId++,
        procurementRequestId: 2,
        totalCost: "75000",
        basePrice: "64100",
        tax: "10897",
        shippingCost: "103",
        discountAmount: "0",
        confidenceLevel: 89,
        marketPrice: "82000",
        potentialSavings: "7000",
        estimatedDelivery: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        aiAnalysisResults: {
          reasoning: [
            { factor: "מחיר יחידה", impact: "תחרותי", description: "₪1,282 ליחידה - מתחת לממוצע שוק" },
            { factor: "איכות", impact: "גבוהה", description: "כסאות ארגונומיים עם אחריות 5 שנים" },
            { factor: "זמן משלוח", impact: "ארוך", description: "4 שבועות - ייצור לפי הזמנה" }
          ],
          sources: [
            { name: "ספק ריהוט משרדי", price: "₪75,000", date: "2024-01-18" },
            { name: "מחקר שוק", price: "₪70,000-₪85,000", date: "2024-01-15" }
          ]
        },
        createdAt: new Date(),
      }
    ];

    moreEstimations.forEach(estimation => this.costEstimations.set(estimation.id, estimation));

    // Create supplier quotes
    const quotes: SupplierQuote[] = [
      {
        id: this.currentId++,
        supplierId: 1,
        procurementRequestId: 3,
        unitPrice: "60500",
        totalPrice: "181500",
        deliveryTime: 10,
        validUntil: new Date("2024-02-28"),
        terms: "תשלום 30 יום נטו",
        discounts: { volumeDiscount: 5, earlyPayment: 2 },
        createdAt: new Date(),
      },
      {
        id: this.currentId++,
        supplierId: 2,
        procurementRequestId: 3,
        unitPrice: "65000",
        totalPrice: "195000",
        deliveryTime: 14,
        validUntil: new Date("2024-02-28"),
        terms: "תשלום 45 יום נטו",
        discounts: { volumeDiscount: 3 },
        createdAt: new Date(),
      },
    ];

    quotes.forEach(quote => this.supplierQuotes.set(quote.id, quote));

    // Create market insight
    const marketInsight: MarketInsight = {
      id: this.currentId++,
      category: "חומרה - שרתים",
      averagePrice: "68300",
      priceStability: 87,
      supplierCount: 15,
      minPrice: "61500",
      maxPrice: "75000",
      riskAssessment: {
        supplyRisk: "low",
        priceVolatility: "medium",
        qualityRisk: "low",
        marketCompetition: "high"
      },
      priceHistory: [
        { month: "אוגוסט", price: 70000 },
        { month: "ספטמבר", price: 69500 },
        { month: "אוקטובר", price: 68800 },
        { month: "נובמבר", price: 68300 },
        { month: "דצמבר", price: 67900 },
        { month: "ינואר", price: 68300 }
      ],
      updatedAt: new Date(),
    };

    this.marketInsights.set(marketInsight.id, marketInsight);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Procurement Requests
  async getProcurementRequests(): Promise<ProcurementRequest[]> {
    return Array.from(this.procurementRequests.values());
  }

  async getProcurementRequest(id: number): Promise<ProcurementRequest | undefined> {
    return this.procurementRequests.get(id);
  }

  async createProcurementRequest(insertRequest: InsertProcurementRequest): Promise<ProcurementRequest> {
    const id = this.currentId++;
    const now = new Date();
    const request: ProcurementRequest = { 
      ...insertRequest, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.procurementRequests.set(id, request);
    return request;
  }

  async updateProcurementRequest(id: number, updateData: Partial<InsertProcurementRequest>): Promise<ProcurementRequest | undefined> {
    const existing = this.procurementRequests.get(id);
    if (!existing) return undefined;
    
    const updated: ProcurementRequest = { 
      ...existing, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.procurementRequests.set(id, updated);
    return updated;
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: number): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = this.currentId++;
    const supplier: Supplier = { ...insertSupplier, id, createdAt: new Date() };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  // Cost Estimations
  async getCostEstimations(): Promise<CostEstimation[]> {
    return Array.from(this.costEstimations.values());
  }

  async getCostEstimation(id: number): Promise<CostEstimation | undefined> {
    return this.costEstimations.get(id);
  }

  async getCostEstimationByRequestId(requestId: number): Promise<CostEstimation | undefined> {
    return Array.from(this.costEstimations.values()).find(
      estimation => estimation.procurementRequestId === requestId
    );
  }

  async createCostEstimation(insertEstimation: InsertCostEstimation): Promise<CostEstimation> {
    const id = this.currentId++;
    const estimation: CostEstimation = { ...insertEstimation, id, createdAt: new Date() };
    this.costEstimations.set(id, estimation);
    return estimation;
  }

  // Supplier Quotes
  async getSupplierQuotes(): Promise<SupplierQuote[]> {
    return Array.from(this.supplierQuotes.values());
  }

  async getSupplierQuotesByRequestId(requestId: number): Promise<SupplierQuote[]> {
    return Array.from(this.supplierQuotes.values()).filter(
      quote => quote.procurementRequestId === requestId
    );
  }

  async createSupplierQuote(insertQuote: InsertSupplierQuote): Promise<SupplierQuote> {
    const id = this.currentId++;
    const quote: SupplierQuote = { ...insertQuote, id, createdAt: new Date() };
    this.supplierQuotes.set(id, quote);
    return quote;
  }

  // Documents
  async getDocumentsByRequestId(requestId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      doc => doc.procurementRequestId === requestId
    );
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.currentId++;
    const document: Document = { ...insertDocument, id, uploadedAt: new Date() };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: number, updateData: Partial<InsertDocument>): Promise<Document | undefined> {
    const existing = this.documents.get(id);
    if (!existing) return undefined;
    
    const updated: Document = { ...existing, ...updateData };
    this.documents.set(id, updated);
    return updated;
  }

  // Market Insights
  async getMarketInsights(): Promise<MarketInsight[]> {
    return Array.from(this.marketInsights.values());
  }

  async getMarketInsightByCategory(category: string): Promise<MarketInsight | undefined> {
    return Array.from(this.marketInsights.values()).find(
      insight => insight.category === category
    );
  }

  async createMarketInsight(insertInsight: InsertMarketInsight): Promise<MarketInsight> {
    const id = this.currentId++;
    const insight: MarketInsight = { ...insertInsight, id, updatedAt: new Date() };
    this.marketInsights.set(id, insight);
    return insight;
  }
}

export const storage = new MemStorage();
