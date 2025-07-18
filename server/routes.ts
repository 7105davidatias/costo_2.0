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
