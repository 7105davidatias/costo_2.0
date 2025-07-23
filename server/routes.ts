import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProcurementRequestSchema, insertCostEstimationSchema, insertDocumentSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure multer for file uploads
const upload = multer({
  dest: path.join(__dirname, '../uploads/'),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and XLS files are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Procurement Requests
  app.get("/api/procurement-requests", async (req, res) => {
    try {
      const requests = await storage.getProcurementRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch procurement requests" });
    }
  });

  app.get("/api/procurement-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.getProcurementRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Procurement request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch procurement request" });
    }
  });

  app.post("/api/procurement-requests", async (req, res) => {
    try {
      const validatedData = insertProcurementRequestSchema.parse(req.body);
      const request = await storage.createProcurementRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data", error });
    }
  });

  app.patch("/api/procurement-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.updateProcurementRequest(id, req.body);
      if (!request) {
        return res.status(404).json({ message: "Procurement request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to update procurement request" });
    }
  });

  // Suppliers
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  // Cost Estimations
  app.get("/api/cost-estimations", async (req, res) => {
    try {
      const estimations = await storage.getCostEstimations();
      res.json(estimations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cost estimations" });
    }
  });

  app.get("/api/cost-estimations/request/:requestId", async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      const estimation = await storage.getCostEstimationByRequestId(requestId);
      if (!estimation) {
        return res.status(404).json({ message: "Cost estimation not found" });
      }
      res.json(estimation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cost estimation" });
    }
  });

  // Get specific cost estimation by ID
  app.get("/api/cost-estimates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const estimation = await storage.getCostEstimation(id);
      if (!estimation) {
        return res.status(404).json({ message: "Cost estimation not found" });
      }
      res.json(estimation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cost estimation" });
    }
  });

  // Get cost estimation by procurement request ID  
  app.get("/api/cost-estimates/request/:requestId", async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      const estimation = await storage.getCostEstimationByRequestId(requestId);
      if (!estimation) {
        return res.status(404).json({ message: "Cost estimation not found" });
      }
      res.json(estimation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cost estimation" });
    }
  });

  // Create cost estimation for specific procurement request
  app.post("/api/procurement-requests/:id/cost-estimate", async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const request = await storage.getProcurementRequest(requestId);
      if (!request) {
        return res.status(404).json({ message: "Procurement request not found" });
      }

      // Create a realistic cost estimation
      const estimation = await storage.createCostEstimation({
        procurementRequestId: requestId,
        totalCost: "45000",
        basePrice: "38000",
        tax: "6460",
        shippingCost: "540",
        discountAmount: "0",
        confidenceLevel: 92,
        estimatedDelivery: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        marketPrice: "52000",
        aiAnalysisResults: {
          reasoning: [
            { factor: "סיכון טכנולוגי", impact: "נמוך", description: "מוצר בוגר בשוק" },
            { factor: "זמינות ספקים", impact: "טוב", description: "3-4 ספקים מהימנים" },
            { factor: "תנודתיות מחיר", impact: "יציב", description: "מחירים יציבים ב-6 חודשים האחרונים" }
          ],
          sources: [
            { name: "מחירון ספק מוביל", price: "₪46,000", date: "2024-01-15" },
            { name: "מחקר שוק", price: "₪43,500-₪48,000", date: "2024-01-10" },
            { name: "ניתוח היסטורי", price: "₪44,200", date: "2024-01-08" }
          ]
        }
      });
      
      res.status(201).json(estimation);
    } catch (error) {
      res.status(400).json({ message: "Invalid estimation data", error });
    }
  });

  app.post("/api/cost-estimations", async (req, res) => {
    try {
      const validatedData = insertCostEstimationSchema.parse(req.body);
      const estimation = await storage.createCostEstimation(validatedData);
      res.status(201).json(estimation);
    } catch (error) {
      res.status(400).json({ message: "Invalid estimation data", error });
    }
  });

  // Supplier Quotes
  app.get("/api/supplier-quotes/request/:requestId", async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      const quotes = await storage.getSupplierQuotesByRequestId(requestId);
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supplier quotes" });
    }
  });

  // Get estimation methods for a request
  app.get("/api/estimation-methods/:id", async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const request = await storage.getProcurementRequest(requestId);
      
      if (!request) {
        return res.status(404).json({ message: 'Procurement request not found' });
      }
      
      // Helper function to determine request type
      const determineRequestType = (request: any) => {
        const description = request.itemName?.toLowerCase() || '';
        const category = request.category?.toLowerCase() || '';
        
        // Check if it's services based on keywords
        if (description.includes('שירות') || description.includes('יעוץ') || 
            description.includes('תמיכה') || description.includes('פיתוח') ||
            category.includes('שירות') || category.includes('יעוץ')) {
          return 'services';
        }
        
        return 'products';
      };

      // Helper functions for AI analysis
      const getComplexityScore = (request: any) => {
        const quantity = parseInt(request.quantity) || 1;
        const descLength = request.itemName?.length || 0;
        
        if (quantity > 100 || descLength > 100) return 'high';
        if (quantity > 10 || descLength > 50) return 'medium';
        return 'low';
      };

      const getUncertaintyLevel = (request: any) => {
        const hasSpecs = request.specifications && request.specifications.length > 0;
        return hasSpecs ? 'low' : 'medium';
      };

      const getDataAvailability = (request: any) => {
        const hasCategory = request.category && request.category.length > 0;
        const hasSpecs = request.specifications && request.specifications.length > 0;
        
        if (hasCategory && hasSpecs) return 'high';
        if (hasCategory || hasSpecs) return 'medium';
        return 'low';
      };

      // Determine request type based on category or item description
      const requestType = determineRequestType(request);
      
      let methods = [];
      
      if (requestType === 'services') {
        methods = [
          {
            id: 'time_based',
            method: 'אומדן מבוסס זמן עבודה',
            suitability: 85,
            description: 'מתאים לשירותים עם הגדרה ברורה של שעות עבודה',
            explanation: 'שיטה זו מתבססת על הערכת כמות שעות העבודה הנדרשות וכפלתן בתעריף שעתי'
          },
          {
            id: 'deliverable_based',
            method: 'אומדן מבוסס תוצרים',
            suitability: 70,
            description: 'מתאים לשירותים עם תוצרים מוגדרים בבירור',
            explanation: 'שיטה זו מתבססת על הגדרת תוצרים ספציפיים ותמחור כל תוצר בנפרד'
          },
          {
            id: 'value_based',
            method: 'אומדן מבוסס ערך',
            suitability: 60,
            description: 'מתאים לשירותים אסטרטגיים בעלי ערך עסקי גבוה',
            explanation: 'שיטה זו מתבססת על הערך העסקי הצפוי מהשירות'
          },
          {
            id: 'three_point',
            method: 'אומדן שלוש נקודות',
            suitability: 92,
            description: 'מתאים לשירותים מורכבים עם רמת אי-ודאות גבוהה',
            explanation: 'שיטה זו משתמשת בשלושה אומדנים: אופטימי, פסימי וסביר ביותר'
          }
        ];
      } else {
        methods = [
          {
            id: 'analogous',
            method: 'אומדן אנלוגי',
            suitability: 85,
            description: 'מתאים לרכש דומה שבוצע בעבר',
            explanation: 'שיטה זו מתבססת על נתוני עלות מרכישות דומות שבוצעו בעבר'
          },
          {
            id: 'parametric',
            method: 'אומדן פרמטרי',
            suitability: 70,
            description: 'מתאים לרכש עם פרמטרים מדידים וקשר סטטיסטי ידוע',
            explanation: 'שיטה זו משתמשת במודלים מתמטיים המבוססים על פרמטרים מדידים'
          },
          {
            id: 'bottom_up',
            method: 'אומדן מלמטה למעלה',
            suitability: 78,
            description: 'מתאים לרכש מורכב הניתן לפירוק לרכיבים',
            explanation: 'שיטה זו מפרקת את הרכש לרכיבים קטנים ומעריכה כל רכיב בנפרד'
          },
          {
            id: 'market_based',
            method: 'אומדן מבוסס מחיר שוק',
            suitability: 88,
            description: 'מתאים לרכש סטנדרטי עם מחירי שוק זמינים',
            explanation: 'שיטה זו מתבססת על מחירי שוק נוכחיים ומגמות מחירים'
          }
        ];
      }
      
      res.json({
        requestId: requestId,
        requestType: requestType,
        recommendedMethods: methods,
        aiAnalysis: {
          complexity: getComplexityScore(request),
          uncertainty: getUncertaintyLevel(request),
          dataAvailability: getDataAvailability(request)
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch estimation methods" });
    }
  });

  // Documents
  app.get("/api/documents/request/:requestId", async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      const documents = await storage.getDocumentsByRequestId(requestId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents/upload/:requestId", upload.single('document'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const requestId = parseInt(req.params.requestId);
      const documentData = {
        procurementRequestId: requestId,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        filePath: req.file.path,
        isAnalyzed: false,
      };

      const document = await storage.createDocument(documentData);
      
      // Simulate AI analysis after a delay
      setTimeout(async () => {
        await storage.updateDocument(document.id, {
          isAnalyzed: true,
          analysisResults: {
            status: "completed",
            confidence: 95,
            extractedText: "מפרטים טכניים זוהו בהצלחה",
            processingTime: "2.3 seconds",
            documentType: "technical_specifications",
          },
          extractedSpecs: {
            processor: "Intel Xeon Silver 4314 (16 cores)",
            memory: "64GB DDR4 ECC",
            storage: "2x 1TB NVMe SSD",
            network: "4x 1GbE + 2x 10GbE",
            powerSupply: "750W Redundant",
            rackUnit: "2U",
            warrantyPeriod: "3 years",
          }
        });
      }, 3000);

      res.status(201).json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload document", error });
    }
  });

  // Market Insights
  app.get("/api/market-insights", async (req, res) => {
    try {
      const insights = await storage.getMarketInsights();
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market insights" });
    }
  });

  app.get("/api/market-insights/:category", async (req, res) => {
    try {
      const category = decodeURIComponent(req.params.category);
      const insight = await storage.getMarketInsightByCategory(category);
      if (!insight) {
        return res.status(404).json({ message: "Market insight not found" });
      }
      res.json(insight);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market insight" });
    }
  });

  // AI Analysis simulation
  app.post("/api/ai-analysis/:requestId", async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysisResults = {
        status: "completed",
        confidence: 94,
        processingTime: "8.7 seconds",
        extractedSpecs: {
          processor: "Intel Xeon Silver 4314 (16 cores)",
          memory: "64GB DDR4 ECC",
          storage: "2x 1TB NVMe SSD",
          network: "4x 1GbE + 2x 10GbE",
          powerSupply: "750W Redundant",
          rackUnit: "2U",
          warrantyPeriod: "3 years",
          operatingSystem: "Windows Server 2022 / Linux",
        },
        recommendations: [
          "מחיר תחרותי זוהה בהשוואה לשוק",
          "מפרטים תואמים לדרישות הטכניות",
          "ספק מומלץ זמין עם מלאי מיידי",
          "שקול שדרוג זיכרון ל-128GB לביצועים מיטביים"
        ],
        marketAnalysis: {
          averagePrice: 68300,
          pricePosition: "12% מתחת לממוצע השוק",
          competitionLevel: "גבוה",
          availableSuppliers: 15,
        },
        riskAssessment: {
          overall: "נמוך",
          supplyChain: "יציב",
          priceVolatility: "נמוכה",
          qualityRisk: "נמוך",
        }
      };

      // Update the request status to processing
      await storage.updateProcurementRequest(requestId, { status: 'processing' });

      res.json(analysisResults);
    } catch (error) {
      res.status(500).json({ message: "Failed to process AI analysis" });
    }
  });

  // Dashboard statistics
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const requests = await storage.getProcurementRequests();
      const estimations = await storage.getCostEstimations();
      
      const totalEstimatedCosts = estimations.reduce((sum, est) => sum + parseFloat(est.totalCost), 0);
      const totalSavings = estimations.reduce((sum, est) => sum + (est.potentialSavings ? parseFloat(est.potentialSavings) : 0), 0);
      const avgConfidence = estimations.length > 0 ? 
        estimations.reduce((sum, est) => sum + est.confidenceLevel, 0) / estimations.length : 0;

      const risingCosts = estimations.filter(est => 
        est.marketPrice && parseFloat(est.totalCost) > parseFloat(est.marketPrice) * 0.9
      ).length;

      const stats = {
        totalEstimatedCosts,
        totalSavings,
        risingCosts: risingCosts * 25000, // Mock calculation
        accuracyScore: avgConfidence,
        recentRequests: requests.slice(-5),
        costTrends: [
          { month: "ינואר", cost: 1800000 },
          { month: "פברואר", cost: 2100000 },
          { month: "מרץ", cost: 2300000 },
          { month: "אפריל", cost: 2200000 },
          { month: "מאי", cost: 2450000 },
          { month: "יוני", cost: 2650000 }
        ],
        accuracyBreakdown: [
          { label: "דיוק גבוה (90%+)", value: 75 },
          { label: "דיוק בינוני (70-90%)", value: 20 },
          { label: "דיוק נמוך (<70%)", value: 5 }
        ]
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });

  // Generate cost estimation endpoint
  app.post("/api/generate-cost-estimation/:requestId", async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      const request = await storage.getProcurementRequest(requestId);
      
      if (!request) {
        return res.status(404).json({ message: "Procurement request not found" });
      }

      // Simulate AI cost estimation calculation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const basePrice = request.quantity * 55000; // Base price per unit
      const tax = Math.round(basePrice * 0.17); // 17% VAT
      const shippingCost = 2400;
      const discountAmount = Math.round(basePrice * 0.08); // 8% volume discount
      const totalCost = basePrice + tax + shippingCost - discountAmount;
      
      const estimationData = {
        procurementRequestId: requestId,
        totalCost: totalCost.toString(),
        basePrice: basePrice.toString(),
        tax: tax.toString(),
        shippingCost: shippingCost.toString(),
        discountAmount: discountAmount.toString(),
        confidenceLevel: 94,
        marketPrice: (totalCost * 1.15).toString(), // 15% above our estimate
        potentialSavings: Math.round(totalCost * 0.15).toString(),
        recommendedSupplierId: 1,
        justifications: [
          {
            variable: "מחיר יחידה בסיסי",
            value: "₪55,000",
            source: "מחירון Dell רשמי",
            confidence: 98,
            impact: `+₪${basePrice.toLocaleString()}`
          },
          {
            variable: "הנחת כמות (3+ יחידות)",
            value: "8%",
            source: "מדיניות ספק",
            confidence: 85,
            impact: `-₪${discountAmount.toLocaleString()}`
          },
          {
            variable: "מע\"ם (17%)",
            value: `₪${tax.toLocaleString()}`,
            source: "חוק מע\"ם ישראל",
            confidence: 100,
            impact: `+₪${tax.toLocaleString()}`
          },
          {
            variable: "עלויות הובלה והתקנה",
            value: `₪${shippingCost.toLocaleString()}`,
            source: "אומדן על בסיס מרחק",
            confidence: 75,
            impact: `+₪${shippingCost.toLocaleString()}`
          }
        ],
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
        }
      };

      const estimation = await storage.createCostEstimation(estimationData);
      
      // Update request with estimated cost
      await storage.updateProcurementRequest(requestId, {
        estimatedCost: totalCost.toString(),
        status: 'completed'
      });

      res.json(estimation);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate cost estimation", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
