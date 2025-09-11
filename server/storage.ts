import { 
  users, suppliers, procurementRequests, costEstimations, 
  supplierQuotes, documents, marketInsights, buildInfo,
  type User, type InsertUser, type ProcurementRequest, type InsertProcurementRequest,
  type Supplier, type InsertSupplier, type CostEstimation, type InsertCostEstimation,
  type SupplierQuote, type InsertSupplierQuote, type Document, type InsertDocument,
  type MarketInsight, type InsertMarketInsight, type BuildInfo, type InsertBuildInfo
} from "@shared/schema";
import { detectCurrentEnvironment } from "@shared/environment";

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

  // Extracted Data Management
  saveExtractedData(requestId: number, data: any): Promise<void>;
  getExtractedData(requestId: number): Promise<{ data: any; extractionDate: Date; status: string } | null>;
  clearExtractedData(requestId: number): Promise<void>;

  // Admin functions for demo reset
  resetAllRequestsStatus(): Promise<{ totalRequests: number; updatedRequests: number }>;

  // Historical data access
  getHistoricalData(): Promise<any[]>;

  // Build Info
  getCurrentBuildInfo(): Promise<BuildInfo | undefined>;
  getBuildInfo(): Promise<BuildInfo[]>;
  createBuildInfo(buildInfo: InsertBuildInfo): Promise<BuildInfo>;
  getBuildInfoByEnvironment(environment: string): Promise<BuildInfo | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private procurementRequests: Map<number, ProcurementRequest>;
  private suppliers: Map<number, Supplier>;
  private costEstimations: Map<number, CostEstimation>;
  private supplierQuotes: Map<number, SupplierQuote>;
  private documents: Map<number, Document>;
  private marketInsights: Map<number, MarketInsight>;
  private buildInfoRecords: Map<number, BuildInfo>;
  private historicalData: any[];
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.procurementRequests = new Map();
    this.suppliers = new Map();
    this.costEstimations = new Map();
    this.supplierQuotes = new Map();
    this.documents = new Map();
    this.marketInsights = new Map();
    this.buildInfoRecords = new Map();
    this.historicalData = [];
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

    // Create comprehensive procurement requests for demo
    const requests: ProcurementRequest[] = [
      // 1. חומרה טכנולוגית - מחשבים ניידים Dell Latitude 5520 (בעיבוד)
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-001",
        itemName: "מחשבים ניידים Dell Latitude 5520",
        description: "רכש 25 מחשבים ניידים למשרדי פיתוח החדשים",
        category: "חומרה",
        quantity: 25,
        priority: "medium",
        targetDate: new Date("2024-03-15"),
        requestedBy: "שרה לוי",
        department: "IT",
        status: "new",
        emf: "130000",
        estimatedCost: null,
        specifications: {
          processor: "Intel Core i7-1165G7",
          memory: "16GB DDR4",
          storage: "512GB SSD",
          display: "15.6 FHD",
          warranty: "3 שנים"
        },
        extractedData: null,
        extractionDate: null,
        extractionStatus: "not_extracted",
        userId: defaultUser.id,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-20"),
      },
      // 2. ריהוט משרדי - כסאות משרד ארגונומיים (הושלם)
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-002",
        itemName: "כסאות משרד ארגונומיים",
        description: "כסאות משרד איכותיים עם תמיכה ארגונומית מלאה",
        category: "ריהוט",
        quantity: 50,
        priority: "low",
        targetDate: new Date("2024-04-01"),
        requestedBy: "מיכל כהן",
        department: "משאבי אנוש",
        status: "new",
        emf: "80000",
        estimatedCost: null,
        specifications: {
          type: "ארגונומי מתכוונן",
          material: "בד נושם",
          adjustable: true,
          warranty: "5 שנים"
        },
        extractedData: null,
        extractionDate: null,
        extractionStatus: "not_extracted",
        userId: defaultUser.id,
        createdAt: new Date("2024-01-18"),
        updatedAt: new Date("2024-02-10"),
      },
      // 3. חומרה - שרתי Dell PowerEdge R750 (חדש)
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-003",
        itemName: "שרתי Dell PowerEdge R750",
        description: "שרתים עבור הרחבת מרכז הנתונים",
        category: "חומרה",
        quantity: 3,
        priority: "high",
        targetDate: new Date("2024-03-15"),
        requestedBy: "דוד לוי",
        department: "IT",
        status: "new",
        emf: "200000",
        estimatedCost: null,
        specifications: {
          processor: "Intel Xeon Silver 4314 (16 cores)",
          memory: "64GB DDR4 ECC",
          storage: "2x 1TB NVMe SSD",
          network: "4x 1GbE + 2x 10GbE"
        },
        extractedData: null,
        extractionDate: null,
        extractionStatus: "not_extracted",
        userId: defaultUser.id,
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20"),
      },
      // 4. שירותים - פיתוח מערכת ניהול משאבי אנוש (בעיבוד)
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-010",
        itemName: "פיתוח מערכת ניהול משאבי אנוש",
        description: "פיתוח מערכת HR מקיפה הכוללת ניהול עובדים, נוכחות, שכר וגיוס",
        category: "שירותים",
        quantity: 1,
        priority: "medium",
        targetDate: new Date("2024-10-15"),
        requestedBy: "דני כהן",
        department: "משאבי אנוש",
        status: "new",
        emf: "1000000",
        estimatedCost: null,
        specifications: {
          estimatedHours: 2400,
          teamSize: 6,
          duration: "8 חודשים",
          technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
          complexity: "גבוהה"
        },
        extractedData: null,
        extractionDate: null,
        extractionStatus: "not_extracted",
        userId: defaultUser.id,
        createdAt: new Date("2024-01-25"),
        updatedAt: new Date("2024-02-01"),
      },
      // 5. שירותים - ייעוץ אסטרטגי (הושלם)
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-011",
        itemName: "ייעוץ אסטרטגי לשיפור תהליכים",
        description: "ייעוץ מקצועי לשיפור תהליכים עסקיים ויעילות ארגונית",
        category: "שירותים",
        quantity: 1,
        priority: "high",
        targetDate: new Date("2024-08-15"),
        requestedBy: "מיכל לוי",
        department: "הנהלה",
        status: "new",
        emf: "650000",
        estimatedCost: null,
        specifications: {
          deliverables: [
            "מיפוי תהליכים נוכחיים",
            "ניתוח פערים וזיהוי הזדמנויות",
            "תכנית יישום מפורטת",
            "הדרכה וליווי יישום"
          ],
          duration: "6 חודשים",
          consultantLevel: "senior"
        },
        extractedData: null,
        extractionDate: null,
        extractionStatus: "not_extracted",
        userId: defaultUser.id,
        createdAt: new Date("2024-01-26"),
        updatedAt: new Date("2024-02-15"),
      },
      // 6. שירותים - אבטחת מידע ו-SOC (בעיבוד)
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-012",
        itemName: "שירותי אבטחת מידע ו-SOC",
        description: "שירותי ניטור אבטחה 24/7, ניהול אירועי אבטחה ותגובה מהירה",
        category: "שירותים",
        quantity: 1,
        priority: "high",
        targetDate: new Date("2024-12-31"),
        requestedBy: "אבי רוזן",
        department: "IT",
        status: "new",
        emf: "2500000",
        estimatedCost: null,
        specifications: {
          serviceLevel: "24/7",
          coverage: "מלא",
          responseTime: "15 דקות",
          duration: "12 חודשים"
        },
        extractedData: null,
        extractionDate: null,
        extractionStatus: "not_extracted",
        userId: defaultUser.id,
        createdAt: new Date("2024-01-27"),
        updatedAt: new Date("2024-02-05"),
      },
      // 7. שירותים - תחזוקה שנתית IT (חדש)
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-013",
        itemName: "תחזוקה שנתית למערכות IT",
        description: "תחזוקה מונעת ותיקונית למערכות IT, שרתים, רשת ותוכנות",
        category: "שירותים",
        quantity: 1,
        priority: "medium",
        targetDate: new Date("2024-12-31"),
        requestedBy: "רונית ברק",
        department: "IT",
        status: "new",
        emf: "700000",
        estimatedCost: null,
        specifications: {
          systemsCount: 45,
          uncertainty: "גבוהה",
          duration: "12 חודשים",
          coverage: "מערכות קריטיות"
        },
        extractedData: null,
        extractionDate: null,
        extractionStatus: "not_extracted",
        userId: defaultUser.id,
        createdAt: new Date("2024-01-28"),
        updatedAt: new Date("2024-01-28"),
      },
      // 8. חומרה - מחשבי עבודה (בעיבוד)
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-014",
        itemName: "רכש 50 מחשבי עבודה",
        description: "מחשבי עבודה חדשים למשרדי החברה החדשים ברמת גן",
        category: "חומרה",
        quantity: 50,
        priority: "medium",
        targetDate: new Date("2024-06-15"),
        requestedBy: "יוסי אברהם",
        department: "משאבי אנוש",
        status: "new",
        emf: "250000",
        estimatedCost: null,
        specifications: {
          processor: "Intel i7 או AMD Ryzen 7",
          ram: "16GB",
          storage: "512GB SSD",
          graphics: "מובנה",
          warranty: "3 שנים"
        },
        extractedData: null,
        extractionDate: null,
        extractionStatus: "not_extracted",
        userId: defaultUser.id,
        createdAt: new Date("2024-01-29"),
        updatedAt: new Date("2024-02-03"),
      },
      // 9. רכבים - רכש צי רכבים (חדש)
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-015",
        itemName: "רכש 10 רכבי צי",
        description: "רכש 10 רכבים מסחריים קלים להרחבת צי החברה",
        category: "רכבים",
        quantity: 10,
        priority: "medium",
        targetDate: new Date("2024-09-15"),
        requestedBy: "עמית שמעון",
        department: "לוגיסטיקה",
        status: "new",
        emf: "950000",
        estimatedCost: null,
        specifications: {
          vehicleType: "מסחרי קל",
          engineSize: 1600,
          fuelType: "בנזין",
          cargoCapacity: 800,
          seatingCapacity: 2
        },
        extractedData: null,
        extractionDate: null,
        extractionStatus: "not_extracted",
        userId: defaultUser.id,
        createdAt: new Date("2024-01-30"),
        updatedAt: new Date("2024-01-30"),
      },
      // 10. בנייה - בניית מחסן (הושלם)
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-016",
        itemName: "בניית מחסן חדש",
        description: "בניית מחסן לוגיסטי חדש בשטח 1000 מ\"ר באזור התעשייה",
        category: "בנייה",
        quantity: 1,
        priority: "high",
        targetDate: new Date("2024-12-15"),
        requestedBy: "שלמה כהן",
        department: "תפעול",
        status: "new",
        emf: "1400000",
        estimatedCost: null,
        specifications: {
          area: 1000,
          height: 8,
          components: "עבודות עפר, יציקת בטון, מבנה פלדה, קירות וגגות",
          contingency: "15%"
        },
        extractedData: null,
        extractionDate: null,
        extractionStatus: "not_extracted",
        userId: defaultUser.id,
        createdAt: new Date("2024-01-31"),
        updatedAt: new Date("2024-02-20"),
      },
      // 11. חומרי גלם - רכש לייצור (בעיבוד)
      {
        id: this.currentId++,
        requestNumber: "REQ-2024-017",
        itemName: "רכש חומרי גלם לייצור",
        description: "רכש חומרי גלם לייצור רבעוני: פלדה, אלומיניום, פלסטיק",
        category: "חומרי גלם",
        quantity: 80,
        priority: "medium",
        targetDate: new Date("2024-07-15"),
        requestedBy: "נועה גולד",
        department: "ייצור",
        status: "new",
        emf: "350000",
        estimatedCost: null,
        specifications: {
          materials: [
            { name: "פלדה", quantity: 50, unit: "טון", grade: "ST37" },
            { name: "אלומיניום", quantity: 20, unit: "טון", grade: "6061" },
            { name: "פלסטיק PVC", quantity: 10, unit: "טון", grade: "רגיל" }
          ]
        },
        extractedData: null,
        extractionDate: null,
        extractionStatus: "not_extracted",
        userId: defaultUser.id,
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-07"),
      },
    ];

    requests.forEach(request => this.procurementRequests.set(request.id, request));

    // Clean start - no cost estimations for demo
    // Cost estimations will be created during the demo

    // Create technical documents for each request (not analyzed yet)
    const documents: Document[] = [
      // REQ-2024-001 - Dell Laptops
      {
        id: this.currentId++,
        procurementRequestId: 5,
        fileName: "מפרט טכני Dell Latitude 5520.pdf",
        fileType: "pdf",
        fileSize: 2457600,
        filePath: "/documents/dell_latitude_5520_spec.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-15"),
      },
      {
        id: this.currentId++,
        procurementRequestId: 5,
        fileName: "דרישות אבטחה ותוכנה.pdf",
        fileType: "pdf",
        fileSize: 1834567,
        filePath: "/documents/security_software_requirements.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-15"),
      },
      {
        id: this.currentId++,
        procurementRequestId: 5,
        fileName: "תכנית פריסה ותמיכה.pdf",
        fileType: "pdf",
        fileSize: 1567890,
        filePath: "/documents/deployment_support_plan.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-15"),
      },
      // REQ-2024-002 - Office Chairs
      {
        id: this.currentId++,
        procurementRequestId: 6,
        fileName: "מפרט ארגונומי ואיכות.pdf",
        fileType: "pdf",
        fileSize: 1923456,
        filePath: "/documents/ergonomic_quality_spec.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-18"),
      },
      {
        id: this.currentId++,
        procurementRequestId: 6,
        fileName: "דרישות עמידות ואחריות.pdf",
        fileType: "pdf",
        fileSize: 1234567,
        filePath: "/documents/durability_warranty_req.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-18"),
      },
      // REQ-2024-003 - Dell Servers
      {
        id: this.currentId++,
        procurementRequestId: 7,
        fileName: "מפרט שרתי PowerEdge R750.pdf",
        fileType: "pdf",
        fileSize: 3145728,
        filePath: "/documents/poweredge_r750_spec.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-20"),
      },
      {
        id: this.currentId++,
        procurementRequestId: 7,
        fileName: "דרישות מרכז נתונים ותשתיות.pdf",
        fileType: "pdf",
        fileSize: 2678901,
        filePath: "/documents/datacenter_infrastructure_req.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-20"),
      },
      {
        id: this.currentId++,
        procurementRequestId: 7,
        fileName: "תרשים רשת ואבטחה.pdf",
        fileType: "pdf",
        fileSize: 2345678,
        filePath: "/documents/network_security_diagram.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-20"),
      },
      // REQ-2024-010 - HR System
      {
        id: this.currentId++,
        procurementRequestId: 8,
        fileName: "SOW פיתוח מערכת HR.pdf",
        fileType: "pdf",
        fileSize: 4567890,
        filePath: "/documents/hr_system_sow.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-25"),
      },
      {
        id: this.currentId++,
        procurementRequestId: 8,
        fileName: "דרישות פונקציונליות מפורטות.pdf",
        fileType: "pdf",
        fileSize: 3456789,
        filePath: "/documents/functional_requirements_detailed.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-25"),
      },
      {
        id: this.currentId++,
        procurementRequestId: 8,
        fileName: "מפרט טכני ואינטגרציה.pdf",
        fileType: "pdf",
        fileSize: 2789012,
        filePath: "/documents/technical_integration_spec.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-25"),
      },
      // REQ-2024-011 - Strategic Consulting
      {
        id: this.currentId++,
        procurementRequestId: 9,
        fileName: "SOW ייעוץ ושיפור תהליכים.pdf",
        fileType: "pdf",
        fileSize: 3890123,
        filePath: "/documents/consulting_improvement_sow.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-26"),
      },
      {
        id: this.currentId++,
        procurementRequestId: 9,
        fileName: "תחומי עבודה ותוצרים.pdf",
        fileType: "pdf",
        fileSize: 2456789,
        filePath: "/documents/work_areas_deliverables.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-26"),
      },
      // REQ-2024-012 - Security Services
      {
        id: this.currentId++,
        procurementRequestId: 10,
        fileName: "SOW שירותי אבטחה 24-7.pdf",
        fileType: "pdf",
        fileSize: 4123456,
        filePath: "/documents/security_services_24_7_sow.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-27"),
      },
      {
        id: this.currentId++,
        procurementRequestId: 10,
        fileName: "דרישות SOC וניטור.pdf",
        fileType: "pdf",
        fileSize: 3567890,
        filePath: "/documents/soc_monitoring_requirements.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-27"),
      },
      {
        id: this.currentId++,
        procurementRequestId: 10,
        fileName: "מפרט ציוד ומערכות.pdf",
        fileType: "pdf",
        fileSize: 2789123,
        filePath: "/documents/equipment_systems_spec.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-27"),
      },
      // REQ-2024-013 - IT Maintenance
      {
        id: this.currentId++,
        procurementRequestId: 11,
        fileName: "SOW תחזוקה שנתית.pdf",
        fileType: "pdf",
        fileSize: 3234567,
        filePath: "/documents/annual_maintenance_sow.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-28"),
      },
      {
        id: this.currentId++,
        procurementRequestId: 11,
        fileName: "רשימת מערכות ומדריכים.pdf",
        fileType: "pdf",
        fileSize: 2678912,
        filePath: "/documents/systems_list_guides.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-28"),
      },
      // REQ-2024-014 - Workstations
      {
        id: this.currentId++,
        procurementRequestId: 12,
        fileName: "מפרט תחנות עבודה סטנדרטיות.pdf",
        fileType: "pdf",
        fileSize: 2345678,
        filePath: "/documents/standard_workstations_spec.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-29"),
      },
      {
        id: this.currentId++,
        procurementRequestId: 12,
        fileName: "דרישות תוכנה ורשיונות.pdf",
        fileType: "pdf",
        fileSize: 1890123,
        filePath: "/documents/software_licenses_requirements.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-29"),
      },
      // REQ-2024-015 - Vehicles
      {
        id: this.currentId++,
        procurementRequestId: 13,
        fileName: "מפרט רכבים מסחריים.pdf",
        fileType: "pdf",
        fileSize: 2567890,
        filePath: "/documents/commercial_vehicles_spec.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-30"),
      },
      {
        id: this.currentId++,
        procurementRequestId: 13,
        fileName: "דרישות ביטוח ותחזוקה.pdf",
        fileType: "pdf",
        fileSize: 1789123,
        filePath: "/documents/insurance_maintenance_requirements.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-30"),
      },
      // REQ-2024-016 - Warehouse Construction
      {
        id: this.currentId++,
        procurementRequestId: 14,
        fileName: "כתב כמויות מפורט.pdf",
        fileType: "pdf",
        fileSize: 4567890,
        filePath: "/documents/detailed_quantities_list.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-31"),
      },
      {
        id: this.currentId++,
        procurementRequestId: 14,
        fileName: "תוכניות בנייה ומפרטים.pdf",
        fileType: "pdf",
        fileSize: 5123456,
        filePath: "/documents/building_plans_specifications.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-31"),
      },
      {
        id: this.currentId++,
        procurementRequestId: 14,
        fileName: "דרישות איכות ובטיחות.pdf",
        fileType: "pdf",
        fileSize: 3456789,
        filePath: "/documents/quality_safety_requirements.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-01-31"),
      },
      // REQ-2024-017 - Raw Materials
      {
        id: this.currentId++,
        procurementRequestId: 15,
        fileName: "רשימת חומרים ומפרטים.pdf",
        fileType: "pdf",
        fileSize: 2890123,
        filePath: "/documents/materials_list_specifications.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-02-01"),
      },
      {
        id: this.currentId++,
        procurementRequestId: 15,
        fileName: "דרישות איכות ותקנים.pdf",
        fileType: "pdf",
        fileSize: 2123456,
        filePath: "/documents/quality_standards_requirements.pdf",
        isAnalyzed: false,
        analysisResults: null,
        extractedSpecs: null,
        uploadedAt: new Date("2024-02-01"),
      }
    ];

    documents.forEach(doc => this.documents.set(doc.id, doc));

    // Historical procurement data for analogical estimation
    const historicalProcurements = [
      // Laptops history
      { year: 2023, item: "Dell Latitude 5420", quantity: 30, unitPrice: 3850, totalCost: 115500 },
      { year: 2022, item: "Dell Latitude 5410", quantity: 15, unitPrice: 3650, totalCost: 54750 },
      { year: 2021, item: "HP EliteBook 840", quantity: 20, unitPrice: 3900, totalCost: 78000 },
      // Servers history
      { year: 2023, item: "Dell PowerEdge R740", quantity: 2, unitPrice: 62000, totalCost: 124000 },
      { year: 2022, item: "HPE ProLiant DL380", quantity: 1, unitPrice: 58500, totalCost: 58500 },
      { year: 2021, item: "Dell PowerEdge R630", quantity: 3, unitPrice: 55000, totalCost: 165000 },
      // Workstations history
      { year: 2023, item: "HP ProDesk 600", quantity: 25, unitPrice: 3200, totalCost: 80000 },
      { year: 2022, item: "Dell OptiPlex 7090", quantity: 40, unitPrice: 3400, totalCost: 136000 },
      { year: 2021, item: "Lenovo ThinkCentre", quantity: 35, unitPrice: 3100, totalCost: 108500 },
      // Office chairs history
      { year: 2023, item: "כסאות ארגונומיים", quantity: 60, unitPrice: 1150, totalCost: 69000 },
      { year: 2022, item: "כסאות מנהלים", quantity: 25, unitPrice: 1350, totalCost: 33750 },
      { year: 2020, item: "ריהוט משרדי מלא", quantity: 100, unitPrice: 950, totalCost: 95000 },
      // Vehicles history
      { year: 2022, item: "סוזוקי קארי", quantity: 5, unitPrice: 85000, totalCost: 425000 },
      { year: 2021, item: "פיאט דובלו קארגו", quantity: 8, unitPrice: 75000, totalCost: 600000 },
      { year: 2020, item: "פורד טרנזיט", quantity: 3, unitPrice: 95000, totalCost: 285000 },
    ];

    // Store historical data for AI analysis
    this.historicalData = historicalProcurements;
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
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "user",
      createdAt: new Date() 
    };
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
      status: insertRequest.status ?? "new",
      priority: insertRequest.priority ?? "medium",
      id,
      description: insertRequest.description ?? null,
      targetDate: insertRequest.targetDate ?? null,
      emf: insertRequest.emf ?? null,
      estimatedCost: insertRequest.estimatedCost ?? null,
      specifications: insertRequest.specifications || null,
      extractedData: insertRequest.extractedData || null,
      extractionDate: insertRequest.extractionDate || null,
      extractionStatus: insertRequest.extractionStatus || "not_extracted",
      userId: insertRequest.userId || null,
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
    const supplier: Supplier = { 
      ...insertSupplier, 
      id, 
      rating: insertSupplier.rating || null,
      reliability: insertSupplier.reliability || null,
      deliveryTime: insertSupplier.deliveryTime || null,
      discountPolicy: insertSupplier.discountPolicy || null,
      warrantyTerms: insertSupplier.warrantyTerms || null,
      isPreferred: insertSupplier.isPreferred || false,
      contactInfo: insertSupplier.contactInfo || null,
      createdAt: new Date() 
    };
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
    const estimation: CostEstimation = { 
      ...insertEstimation, 
      id, 
      procurementRequestId: insertEstimation.procurementRequestId || null,
      shippingCost: insertEstimation.shippingCost || null,
      discountAmount: insertEstimation.discountAmount || null,
      marketPrice: insertEstimation.marketPrice || null,
      potentialSavings: insertEstimation.potentialSavings || null,
      justifications: insertEstimation.justifications || null,
      recommendedSupplierId: insertEstimation.recommendedSupplierId || null,
      aiAnalysisResults: insertEstimation.aiAnalysisResults || null,
      createdAt: new Date() 
    };
    this.costEstimations.set(id, estimation);
    return estimation;
  }

  // Documents
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocumentsByRequestId(requestId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      doc => doc.procurementRequestId === requestId
    );
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.currentId++;
    const document: Document = { 
      ...insertDocument, 
      id,
      procurementRequestId: insertDocument.procurementRequestId || null,
      fileSize: insertDocument.fileSize || null,
      filePath: insertDocument.filePath || null,
      isAnalyzed: insertDocument.isAnalyzed || false,
      analysisResults: insertDocument.analysisResults || null,
      extractedSpecs: insertDocument.extractedSpecs || null,
      uploadedAt: new Date() 
    };
    this.documents.set(id, document);
    return document;
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

  async getMarketInsightsByCategory(category: string): Promise<MarketInsight[]> {
    return Array.from(this.marketInsights.values()).filter(
      insight => insight.category === category
    );
  }

  async createMarketInsight(insertInsight: InsertMarketInsight): Promise<MarketInsight> {
    const id = this.currentId++;
    const insight: MarketInsight = { 
      ...insertInsight, 
      id,
      averagePrice: insertInsight.averagePrice || null,
      priceStability: insertInsight.priceStability || null,
      supplierCount: insertInsight.supplierCount || null,
      minPrice: insertInsight.minPrice || null,
      maxPrice: insertInsight.maxPrice || null,
      riskAssessment: insertInsight.riskAssessment || null,
      priceHistory: insertInsight.priceHistory || null,
      updatedAt: new Date() 
    };
    this.marketInsights.set(id, insight);
    return insight;
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

  async getQuotesByRequestId(requestId: number): Promise<SupplierQuote[]> {
    return this.getSupplierQuotesByRequestId(requestId);
  }

  async createSupplierQuote(insertQuote: InsertSupplierQuote): Promise<SupplierQuote> {
    const id = this.currentId++;
    const quote: SupplierQuote = { 
      ...insertQuote, 
      id,
      supplierId: insertQuote.supplierId || null,
      procurementRequestId: insertQuote.procurementRequestId || null,
      deliveryTime: insertQuote.deliveryTime || null,
      validUntil: insertQuote.validUntil || null,
      terms: insertQuote.terms || null,
      discounts: insertQuote.discounts || null,
      createdAt: new Date() 
    };
    this.supplierQuotes.set(id, quote);
    return quote;
  }

  async resetAllRequestsStatus(): Promise<{ totalRequests: number; updatedRequests: number }> {
    const requests = Array.from(this.procurementRequests.values());
    let updatedCount = 0;
    
    for (const request of requests) {
      if (request.status !== 'new') {
        const updated = { ...request, status: 'new' as const, updatedAt: new Date() };
        this.procurementRequests.set(request.id, updated);
        updatedCount++;
      }
    }
    
    return { totalRequests: requests.length, updatedRequests: updatedCount };
  }

  // Extracted Data
  private extractedData = new Map<number, any>();

  async getExtractedData(requestId: number): Promise<any> {
    return this.extractedData.get(requestId);
  }

  async saveExtractedData(requestId: number, data: any): Promise<void> {
    this.extractedData.set(requestId, {
      data,
      extractionDate: new Date(),
      status: 'completed'
    });
  }

  async clearExtractedData(requestId: number): Promise<void> {
    this.extractedData.delete(requestId);
  }

  async updateDocument(id: number, updateData: any): Promise<Document | undefined> {
    const existing = this.documents.get(id);
    if (!existing) return undefined;
    
    const updated: Document = { ...existing, ...updateData };
    this.documents.set(id, updated);
    return updated;
  }

  async resetAllCostEstimations(): Promise<{ totalEstimations: number; clearedEstimations: number }> {
    const totalBefore = this.costEstimations.size;
    this.costEstimations.clear();
    return { totalEstimations: totalBefore, clearedEstimations: totalBefore };
  }

  // Historical data access
  async getHistoricalData(): Promise<any[]> {
    return this.historicalData;
  }

  // Build Info
  async getCurrentBuildInfo(): Promise<BuildInfo | undefined> {
    // החזר את ה-build הנוכחי של הסביבה הנוכחית
    const environment = detectCurrentEnvironment();
    const builds = Array.from(this.buildInfoRecords.values())
      .filter(build => build.environment === environment)
      .sort((a, b) => new Date(b.buildDate).getTime() - new Date(a.buildDate).getTime());
    
    return builds[0];
  }

  async getBuildInfo(): Promise<BuildInfo[]> {
    // החזר רשימה ממוינת לפי תאריך בניה (החדשים ראשונים)
    return Array.from(this.buildInfoRecords.values())
      .sort((a, b) => new Date(b.buildDate).getTime() - new Date(a.buildDate).getTime());
  }

  async createBuildInfo(buildInfoData: InsertBuildInfo): Promise<BuildInfo> {
    // בדיקת uniqueness של buildNumber (כמו בבסיס הנתונים)
    const existingBuildNumber = Array.from(this.buildInfoRecords.values())
      .find(build => build.buildNumber === buildInfoData.buildNumber);
    
    if (existingBuildNumber) {
      throw new Error(`Build number ${buildInfoData.buildNumber} already exists`);
    }

    const buildInfo: BuildInfo = {
      id: this.currentId++,
      ...buildInfoData,
      deploymentDate: buildInfoData.deploymentDate || null,
      sapDataVersion: buildInfoData.sapDataVersion || null,
      metadata: buildInfoData.metadata || null,
      createdAt: new Date(),
    };
    this.buildInfoRecords.set(buildInfo.id, buildInfo);
    return buildInfo;
  }

  async getBuildInfoByEnvironment(environment: string): Promise<BuildInfo | undefined> {
    return Array.from(this.buildInfoRecords.values())
      .filter(build => build.environment === environment)
      .sort((a, b) => new Date(b.buildDate).getTime() - new Date(a.buildDate).getTime())[0];
  }
}

// Create and export the storage instance
export const storage = new MemStorage();
