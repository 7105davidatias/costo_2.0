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

  // Calculate estimate based on selected methods
  app.post("/api/calculate-estimate", async (req, res) => {
    try {
      const { requestId, selectedMethods } = req.body;
      const request = await storage.getProcurementRequest(requestId);
      
      if (!request) {
        return res.status(404).json({ error: 'דרישת רכש לא נמצאה' });
      }
      
      let methodResults = [];
      let totalWeightedEstimate = 0;
      let totalWeight = 0;
      
      for (const methodId of selectedMethods) {
        const result = calculateByMethod(methodId, request);
        methodResults.push(result);
        totalWeightedEstimate += result.estimate * result.weight;
        totalWeight += result.weight;
      }
      
      const finalEstimate = totalWeightedEstimate / totalWeight;
      const overallConfidence = calculateOverallConfidence(methodResults);
      
      res.json({
        requestId: requestId,
        requestDetails: {
          title: request.itemName,
          category: request.category,
          requestNumber: request.requestNumber,
          description: request.description,
          quantity: request.quantity
        },
        selectedMethods: selectedMethods,
        methodResults: methodResults,
        finalEstimate: {
          amount: Math.round(finalEstimate),
          confidence: overallConfidence,
          methodology: generateMethodologyDescription(selectedMethods, methodResults)
        },
        breakdown: generateBreakdown(methodResults),
        recommendations: generateRecommendations(methodResults, request),
        marketComparison: {
          marketPrice: calculateMarketPrice(request),
          savings: calculatePotentialSavings(finalEstimate, request),
          pricePosition: determinePricePosition(finalEstimate, request)
        }
      });
    } catch (error) {
      console.error('Error calculating estimate:', error);
      res.status(500).json({ error: 'שגיאה בחישוב האומדן' });
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

  // Market Research - contextual based on procurement request
  app.get("/api/market-research/:requestId", async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      const request = await storage.getProcurementRequest(requestId);
      
      if (!request) {
        return res.status(404).json({ error: 'דרישת רכש לא נמצאה' });
      }
      
      // Generate contextual market research
      const marketResearch = generateContextualMarketResearch(request);
      
      res.json({
        requestId: requestId,
        requestDetails: {
          title: request.title,
          category: request.category,
          subcategory: request.subcategory
        },
        supplierComparison: marketResearch.supplierComparison,
        marketInsights: marketResearch.marketInsights,
        priceTrends: marketResearch.priceTrends,
        informationSources: marketResearch.informationSources,
        recommendations: marketResearch.recommendations
      });
    } catch (error) {
      console.error('Error generating market research:', error);
      res.status(500).json({ error: 'שגיאה ביצירת מחקר השוק' });
    }
  });

  // Market Insights (legacy)
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

  // AI Analysis with contextual data based on request type
  app.post("/api/ai-analysis/:requestId", async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      const request = await storage.getProcurementRequest(requestId);
      
      if (!request) {
        return res.status(404).json({ error: 'דרישת רכש לא נמצאה' });
      }
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate contextual AI analysis based on request type
      const contextualAnalysis = generateContextualAIAnalysis(request);
      
      const analysisResults = {
        status: "completed",
        confidence: contextualAnalysis.confidence || 94,
        processingTime: "8.7 seconds",
        extractedSpecs: contextualAnalysis.extractedSpecs,
        recommendations: contextualAnalysis.recommendations,
        marketAnalysis: contextualAnalysis.marketAnalysis,
        riskAssessment: contextualAnalysis.riskAssessment
      };

      // Save extracted data to database
      try {
        await storage.saveExtractedData(requestId, analysisResults);
        console.log('Extracted data saved to database for request:', requestId);
      } catch (saveError) {
        console.error('Failed to save extracted data:', saveError);
        // Continue even if saving fails - user still gets the results
      }

      // Update the request status to processing
      await storage.updateProcurementRequest(requestId, { status: 'processing' });

      res.json(analysisResults);
    } catch (error) {
      res.status(500).json({ message: "Failed to process AI analysis" });
    }
  });

  // Get extracted data for a procurement request
  app.get("/api/procurement-requests/:id/extracted-data", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const extractedData = await storage.getExtractedData(id);
      
      if (extractedData) {
        res.json({
          success: true,
          hasData: true,
          data: extractedData.data,
          extractionDate: extractedData.extractionDate,
          status: extractedData.status
        });
      } else {
        res.json({
          success: true,
          hasData: false,
          data: null
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch extracted data"
      });
    }
  });

  // Clear extracted data for a procurement request
  app.delete("/api/procurement-requests/:id/extracted-data", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.clearExtractedData(id);
      
      res.json({
        success: true,
        message: "נתונים שחולצו נמחקו בהצלחה"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to clear extracted data"
      });
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

// Helper functions for estimation calculations
function calculateByMethod(methodId: string, request: any) {
  switch(methodId) {
    case 'time_based':
      return calculateTimeBased(request);
    case 'deliverable_based':
      return calculateDeliverableBased(request);
    case 'value_based':
      return calculateValueBased(request);
    case 'three_point':
      return calculateThreePoint(request);
    case 'analogous':
      return calculateAnalogous(request);
    case 'parametric':
      return calculateParametric(request);
    case 'bottom_up':
      return calculateBottomUp(request);
    case 'market_based':
      return calculateMarketBased(request);
    default:
      throw new Error(`שיטת אומדן לא מוכרת: ${methodId}`);
  }
}

// Service estimation methods
function calculateTimeBased(request: any) {
  const estimatedHours = request.specifications?.estimatedHours || 2400;
  const teamSize = request.specifications?.teamSize || 6;
  
  const seniorHours = estimatedHours * 0.3;
  const midHours = estimatedHours * 0.5;  
  const juniorHours = estimatedHours * 0.2;
  
  const seniorRate = 450;
  const midRate = 350;
  const juniorRate = 250;
  
  const seniorCost = seniorHours * seniorRate;
  const midCost = midHours * midRate;
  const juniorCost = juniorHours * juniorRate;
  
  const totalCost = seniorCost + midCost + juniorCost;
  
  return {
    methodName: 'אומדן מבוסס זמן עבודה',
    estimate: totalCost,
    confidence: 88,
    weight: 0.8,
    breakdown: [
      { component: 'מפתח בכיר', hours: seniorHours, rate: seniorRate, cost: seniorCost },
      { component: 'מפתח בינוני', hours: midHours, rate: midRate, cost: midCost },
      { component: 'מפתח זוטר', hours: juniorHours, rate: juniorRate, cost: juniorCost }
    ],
    reasoning: 'האומדן מבוסס על הערכת שעות עבודה נדרשות וכפלתן בתעריפי שוק נוכחיים',
    sources: ['תעריفי שוק 2024', 'ניסיון פרויקטים דומים'],
    assumptions: ['זמינות צוות מלאה', 'ללא שינויי דרישות משמעותיים']
  };
}

function calculateDeliverableBased(request: any) {
  const deliverables = request.specifications?.deliverables || [
    'מיפוי תהליכים נוכחיים',
    'ניתוח פערים וזיהוי הזדמנויות',
    'תכנית יישום מפורטת',
    'הדרכה וליווי יישום'
  ];
  
  const deliverableCosts = [150000, 200000, 100000, 180000];
  let totalCost = 0;
  let breakdown = [];
  
  deliverables.forEach((deliverable, index) => {
    const cost = deliverableCosts[index] || 100000;
    totalCost += cost;
    breakdown.push({
      component: deliverable,
      cost: cost,
      description: 'תוצר מוגדר עם מחיר קבוע'
    });
  });
  
  return {
    methodName: 'אומדן מבוסס תוצרים',
    estimate: totalCost,
    confidence: 92,
    weight: 0.9,
    breakdown: breakdown,
    reasoning: 'האומדן מבוסס על תמחור תוצרים מוגדרים בבירור',
    sources: ['מפרט תוצרים', 'תעריפי שוק לתוצרים דומים'],
    assumptions: ['תוצרים מוגדרים בבירור', 'אין שינויים בהיקף התוצרים']
  };
}

function calculateValueBased(request: any) {
  const businessValue = request.specifications?.businessValue || 'הגנה על נכסי מידע קריטיים';
  const serviceLevel = request.specifications?.serviceLevel || '24/7';
  
  // Calculate based on business value - typically 20-30% of protected value
  const monthlyService = 150000;
  const duration = 12;
  const totalCost = monthlyService * duration;
  
  return {
    methodName: 'אומדן מבוסס ערך',
    estimate: totalCost,
    confidence: 94,
    weight: 0.6,
    breakdown: [
      { component: 'הפחתת סיכונים', value: 'הגנה מפני איומי סייבר', percentage: '60%' },
      { component: 'ערך עמידה בתקנות', value: 'GDPR, SOX Compliance', percentage: '20%' },
      { component: 'הגנה על מוניטין', value: 'מניעת דליפות מידע', percentage: '20%' }
    ],
    reasoning: 'האומדן מבוסס על הערך העסקי הצפוי מהשירות',
    sources: ['הערכת סיכונים עסקיים', 'ניתוח ROI'],
    assumptions: ['הערכת ערך עסקי מדויקת', 'יישום מוצלח של השירות']
  };
}

function calculateThreePoint(request: any) {
  const estimates = request.specifications?.estimates || {
    optimistic: 450000,
    mostLikely: 650000,
    pessimistic: 950000
  };
  
  // PERT formula: (optimistic + 4*mostLikely + pessimistic) / 6
  const pertEstimate = (estimates.optimistic + 4 * estimates.mostLikely + estimates.pessimistic) / 6;
  
  return {
    methodName: 'אומדן שלוש נקודות',
    estimate: pertEstimate,
    confidence: 78,
    weight: 0.7,
    breakdown: [
      { scenario: 'תרחיש אופטימי', estimate: estimates.optimistic, probability: '10%' },
      { scenario: 'תרחיש סביר ביותר', estimate: estimates.mostLikely, probability: '60%' },
      { scenario: 'תרחיש פסימי', estimate: estimates.pessimistic, probability: '30%' }
    ],
    reasoning: 'האומדן מבוסס על שלושה תרחישים עם שקלול סטטיסטי',
    sources: ['ניסיון היסטורי', 'הערכת מומחים'],
    assumptions: ['התפלגות נורמלית של תוצאות', 'אי-תלות בין גורמי סיכון']
  };
}

// Product estimation methods
function calculateAnalogous(request: any) {
  const quantity = request.quantity || 50;
  const unitPrice = 4500; // Based on historical data
  const totalCost = quantity * unitPrice;
  
  return {
    methodName: 'אומדן אנלוגי',
    estimate: totalCost,
    confidence: 95,
    weight: 0.8,
    breakdown: [
      { reference: '2023-06', originalQuantity: 30, originalUnitCost: 4200, adjustedCost: totalCost, weight: 0.8 },
      { reference: '2023-03', originalQuantity: 25, originalUnitCost: 4100, adjustedCost: totalCost, weight: 0.6 }
    ],
    reasoning: 'האומדן מבוסס על רכישות דומות שבוצעו בעבר עם התאמה לכמות נוכחית',
    sources: ['נתוני רכישות היסטוריים', 'מערכת ניהול רכש'],
    assumptions: ['דמיון גבוה בין הרכישות', 'יציבות יחסית במחירי שוק']
  };
}

function calculateParametric(request: any) {
  const quantity = request.quantity || 10;
  const baseCost = 85000;
  const engineFactor = 1500; // Per 1600cc
  const capacityFactor = 2500; // Per 800kg capacity
  
  const unitCost = baseCost + engineFactor + capacityFactor;
  const totalCost = unitCost * quantity;
  
  return {
    methodName: 'אומדן פרמטרי',
    estimate: totalCost,
    confidence: 92,
    weight: 0.85,
    breakdown: [
      { parameter: 'עלות בסיס', value: baseCost, factor: 1 },
      { parameter: 'מנוע 1600cc', value: 1600, factor: engineFactor },
      { parameter: 'קיבולת מטען 800kg', value: 800, factor: capacityFactor }
    ],
    reasoning: 'האומדן מבוסס על מודל מתמטי הלוקח בחשבון פרמטרים מדידים',
    sources: ['מודל רגרסיה סטטיסטי', 'נתוני שוק היסטוריים'],
    assumptions: ['יציבות המודל הפרמטרי', 'רלוונטיות הפרמטרים הנבחרים']
  };
}

function calculateBottomUp(request: any) {
  const components = [
    { name: 'עבודות עפר וביסוס', quantity: 1000, unit: 'מ"ר', unitCost: 120, totalCost: 120000 },
    { name: 'יציקת בטון', quantity: 200, unit: 'מ"ק', unitCost: 450, totalCost: 90000 },
    { name: 'מבנה פלדה', quantity: 80, unit: 'טון', unitCost: 8500, totalCost: 680000 },
    { name: 'קירות וגגות', quantity: 1200, unit: 'מ"ר', unitCost: 180, totalCost: 216000 },
    { name: 'מערכות חשמל', quantity: 1, unit: 'פרויקט', unitCost: 150000, totalCost: 150000 },
    { name: 'מערכות אוורור', quantity: 1, unit: 'פרויקט', unitCost: 80000, totalCost: 80000 }
  ];
  
  const baseCost = components.reduce((sum, comp) => sum + comp.totalCost, 0);
  const contingency = baseCost * 0.15; // 15% contingency
  const totalCost = baseCost + contingency;
  
  return {
    methodName: 'אומדן מלמטה למעלה',
    estimate: totalCost,
    confidence: 89,
    weight: 0.9,
    breakdown: [...components, { name: 'מרווח לאי-צפויים (15%)', quantity: 1, unit: 'פרויקט', unitCost: contingency, totalCost: contingency }],
    reasoning: 'האומדן מבוסס על פירוק מפורט לרכיבים ואומדן כל רכיב בנפרד',
    sources: ['מפרטים טכניים מפורטים', 'תעריפי קבלנים'],
    assumptions: ['פירוק מלא ומדויק', 'זמינות כל הרכיבים']
  };
}

function calculateMarketBased(request: any) {
  const category = request.category?.toLowerCase() || '';
  const itemName = request.itemName?.toLowerCase() || '';
  const quantity = request.quantity || 1;
  
  // Generate contextual breakdown based on request type
  if (itemName.includes('מחשב') || itemName.includes('laptop') || category.includes('חומרה')) {
    // Computer/Hardware breakdown
    const unitPrice = 5000;
    const components = [
      { name: 'מחשב נייד בסיסי', quantity: quantity, unit: 'יחידות', unitPrice: unitPrice, totalCost: quantity * unitPrice },
      { name: 'רישיון Windows Pro', quantity: quantity, unit: 'רישיונות', unitPrice: 800, totalCost: quantity * 800 },
      { name: 'אחריות מורחבת', quantity: quantity, unit: 'שנים', unitPrice: 400, totalCost: quantity * 400 }
    ];
    
    const totalCost = components.reduce((sum, comp) => sum + comp.totalCost, 0);
    
    return {
      methodName: 'אומדן מבוסס מחיר שוק',
      estimate: totalCost,
      confidence: 93,
      weight: 0.85,
      breakdown: components,
      reasoning: 'האומדן מבוסס על מחירי שוק נוכחיים לציוד מחשוב דומה',
      sources: ['מחירון Dell רשמי', 'השוואת מחירים בשוק המקומי'],
      assumptions: ['יציבות מחירי חומרה', 'זמינות מלאי']
    };
  } else if (itemName.includes('כסא') || itemName.includes('ריהוט') || category.includes('ריהוט')) {
    // Furniture breakdown
    const unitPrice = 1800;
    const components = [
      { name: 'כסא משרד ארגונומי', quantity: quantity, unit: 'יחידות', unitPrice: unitPrice, totalCost: quantity * unitPrice },
      { name: 'משלוח והרכבה', quantity: 1, unit: 'שירות', unitPrice: 500, totalCost: 500 },
      { name: 'אחריות 5 שנים', quantity: quantity, unit: 'יחידות', unitPrice: 200, totalCost: quantity * 200 }
    ];
    
    const totalCost = components.reduce((sum, comp) => sum + comp.totalCost, 0);
    
    return {
      methodName: 'אומדן מבוסס מחיר שוק',
      estimate: totalCost,
      confidence: 91,
      weight: 0.85,
      breakdown: components,
      reasoning: 'האומדן מבוסס על מחירי שוק נוכחיים לריהוט משרדי איכותי',
      sources: ['מחירון יצרני ריהוט', 'השוואת מחירים בשוק'],
      assumptions: ['יציבות מחירי ריהוט', 'זמינות מיידית']
    };
  } else if (itemName.includes('רכב') || itemName.includes('משאית') || category.includes('רכב')) {
    // Vehicle breakdown
    const unitPrice = 89000;
    const components = [
      { name: 'רכב מסחרי קל', quantity: quantity, unit: 'יחידות', unitPrice: unitPrice, totalCost: quantity * unitPrice },
      { name: 'ביטוח חובה ומקיף', quantity: quantity, unit: 'שנה', unitPrice: 8000, totalCost: quantity * 8000 },
      { name: 'בדיקות ורישוי', quantity: quantity, unit: 'יחידות', unitPrice: 1000, totalCost: quantity * 1000 }
    ];
    
    const totalCost = components.reduce((sum, comp) => sum + comp.totalCost, 0);
    
    return {
      methodName: 'אומדן מבוסס מחיר שוק',
      estimate: totalCost,
      confidence: 89,
      weight: 0.85,
      breakdown: components,
      reasoning: 'האומדן מבוסס על מחירי שוק נוכחיים לרכבים מסחריים דומים',
      sources: ['מחירון יבואני רכב', 'נתוני מכירות רכב'],
      assumptions: ['יציבות מחירי רכב', 'זמינות דגמים']
    };
  } else if (itemName.includes('מחסן') || itemName.includes('בני') || category.includes('בני')) {
    // Construction breakdown
    const area = 1000; // Default area
    const components = [
      { name: 'עבודות עפר ויסודות', quantity: area, unit: 'מ"ר', unitPrice: 350, totalCost: area * 350 },
      { name: 'מבנה פלדה וקירות', quantity: area, unit: 'מ"ר', unitPrice: 800, totalCost: area * 800 },
      { name: 'גג ומערכות', quantity: area, unit: 'מ"ר', unitPrice: 450, totalCost: area * 450 }
    ];
    
    const totalCost = components.reduce((sum, comp) => sum + comp.totalCost, 0);
    
    return {
      methodName: 'אומדן מבוסס מחיר שוק',
      estimate: totalCost,
      confidence: 87,
      weight: 0.85,
      breakdown: components,
      reasoning: 'האומדן מבוסס על מחירי שוק נוכחיים לבנייה תעשייתית',
      sources: ['מחירון קבלני בנייה', 'נתוני עלות בנייה'],
      assumptions: ['יציבות מחירי חומרים', 'זמינות קבלנים']
    };
  } else if (itemName.includes('חומרי גלם') || itemName.includes('פלדה') || itemName.includes('אלומיניום')) {
    // Raw materials breakdown - original logic for materials
    const materials = [
      { name: 'פלדה ST37', quantity: 50, unit: 'טון', unitPrice: 3200, totalCost: 160000 },
      { name: 'אלומיניום 6061', quantity: 20, unit: 'טון', unitPrice: 8500, totalCost: 170000 },
      { name: 'פלסטיק PVC', quantity: 10, unit: 'טון', unitPrice: 4200, totalCost: 42000 }
    ];
    
    const totalCost = materials.reduce((sum, material) => sum + material.totalCost, 0);
    
    return {
      methodName: 'אומדן מבוסס מחיר שוק',
      estimate: totalCost,
      confidence: 91,
      weight: 0.85,
      breakdown: materials,
      reasoning: 'האומדן מבוסס על מחירי שוק נוכחיים ומגמות מחירים',
      sources: ['בורסת מתכות תל אביב', 'מחירון ספקי חומרי גלם'],
      assumptions: ['יציבות מחירי שוק', 'זמינות חומרים']
    };
  } else {
    // Generic breakdown for other items
    const estimatedValue = parseFloat(request.estimatedCost || '100000');
    const components = [
      { name: 'עלות יחידה בסיסית', quantity: quantity, unit: 'יחידות', unitPrice: estimatedValue / quantity, totalCost: estimatedValue },
      { name: 'שירותים נלווים', quantity: 1, unit: 'שירות', unitPrice: estimatedValue * 0.1, totalCost: estimatedValue * 0.1 },
      { name: 'אחריות ותמיכה', quantity: 1, unit: 'שירות', unitPrice: estimatedValue * 0.05, totalCost: estimatedValue * 0.05 }
    ];
    
    const totalCost = components.reduce((sum, comp) => sum + comp.totalCost, 0);
    
    return {
      methodName: 'אומדן מבוסס מחיר שוק',
      estimate: totalCost,
      confidence: 85,
      weight: 0.85,
      breakdown: components,
      reasoning: 'האומדן מבוסס על מחירי שוק נוכחיים לפריטים דומים',
      sources: ['מחקר שוק כללי', 'השוואת מחירים'],
      assumptions: ['יציבות מחירי שוק', 'זמינות פריטים']
    };
  }
}

// Helper functions
function calculateOverallConfidence(methodResults: any[]) {
  const weightedConfidence = methodResults.reduce((sum, result) => sum + (result.confidence * result.weight), 0);
  const totalWeight = methodResults.reduce((sum, result) => sum + result.weight, 0);
  return Math.round(weightedConfidence / totalWeight);
}

function generateMethodologyDescription(selectedMethods: string[], methodResults: any[]) {
  const methodNames = methodResults.map(result => result.methodName);
  if (methodNames.length === 1) {
    return `האומדן מבוסס על ${methodNames[0]}`;
  } else if (methodNames.length === 2) {
    return `האומדן מבוסס על שילוב של ${methodNames[0]} ו${methodNames[1]}`;
  } else {
    return `האומדן מבוסס על שילוב של ${methodNames.length} שיטות אומדן`;
  }
}

function generateBreakdown(methodResults: any[]) {
  return methodResults.map(result => ({
    method: result.methodName,
    estimate: result.estimate,
    confidence: result.confidence,
    weight: result.weight,
    breakdown: result.breakdown
  }));
}

function generateRecommendations(methodResults: any[], request: any) {
  const recommendations = [];
  
  if (methodResults.length > 1) {
    recommendations.push('השילוב של מספר שיטות אומדן מעלה את דירוג הביטחון');
  }
  
  const avgConfidence = calculateOverallConfidence(methodResults);
  if (avgConfidence < 80) {
    recommendations.push('מומלץ לאסוף מידע נוסף לשיפור דירוג הביטחון');
  }
  
  recommendations.push('מומלץ לקבל הצעות מחיר מספק נוסף לוודא תחרותיות');
  
  return recommendations;
}

function calculateMarketPrice(request: any) {
  // Simulate market price calculation based on request
  const estimatedCost = parseFloat(request.estimatedCost || '100000');
  return Math.round(estimatedCost * 1.15); // 15% above estimated
}

function calculatePotentialSavings(finalEstimate: number, request: any) {
  const marketPrice = calculateMarketPrice(request);
  return Math.max(0, marketPrice - finalEstimate);
}

function determinePricePosition(finalEstimate: number, request: any) {
  const marketPrice = calculateMarketPrice(request);
  const ratio = finalEstimate / marketPrice;
  
  if (ratio < 0.9) return 'מחיר מעולה';
  if (ratio < 1.0) return 'מחיר טוב';  
  if (ratio < 1.1) return 'מחיר סביר';
  return 'מחיר גבוה';
}

// Generate contextual AI analysis based on request type
function generateContextualAIAnalysis(request: any) {
  const category = request.category?.toLowerCase() || '';
  const subcategory = request.subcategory?.toLowerCase() || '';
  const itemName = request.itemName?.toLowerCase() || '';
  
  // Determine analysis type based on request characteristics
  if (subcategory.includes('בנייה') || itemName.includes('מחסן') || itemName.includes('בניית')) {
    return generateConstructionAnalysis(request);
  } else if (subcategory.includes('פיתוח') || itemName.includes('אפליקציה') || itemName.includes('מערכת')) {
    return generateSoftwareAnalysis(request);
  } else if (subcategory.includes('ציוד מחשוב') || itemName.includes('שרת') || itemName.includes('מחשב')) {
    return generateComputingAnalysis(request);
  } else if (subcategory.includes('רכבים') || itemName.includes('רכב') || itemName.includes('משאית')) {
    return generateVehicleAnalysis(request);
  } else if (subcategory.includes('ייעוץ') || itemName.includes('ייעוץ') || itemName.includes('שירות')) {
    return generateConsultingAnalysis(request);
  } else {
    return generateGenericAnalysis(request);
  }
}

function generateConstructionAnalysis(request: any) {
  return {
    confidence: 95,
    extractedSpecs: {
      buildingArea: `${request.description?.match(/(\d+)\s*מ[\"׳]ר/) ? request.description.match(/(\d+)\s*מ[\"׳]ר/)[1] : '1000'} מ"ר`,
      buildingHeight: "12 מטר",
      foundationType: "בטון מזוין",
      steelStructure: "80 טון פלדה מבנית",
      roofingSystem: "גג רעפים",
      electricalSystems: "מערכת חשמל תעשייתית",
      ventilationSystem: "מערכת אוורור מרכזית",
      fireProtection: "מערכת כיבוי אש",
      constructionPeriod: "8-12 חודשים",
      permits: "היתרי בנייה נדרשים"
    },
    recommendations: [
      "האומדן מבוסס על מפרטי בנייה עדכניים",
      "מומלץ לקבל הצעות מחיר מ-3 קבלנים לפחות",
      "שקול הוספת מרווח 15% לאי-צפויים",
      "בדוק זמינות חומרי בנייה לפני תחילת הפרויקט"
    ],
    marketAnalysis: {
      averagePrice: 1800000,
      pricePosition: "15% מתחת לממוצע השוק",
      competitionLevel: "בינוני",
      availableSuppliers: 8,
      marketTrend: "מחירי בנייה יציבים ברבעון האחרון"
    },
    riskAssessment: {
      overall: "בינוני",
      supplyChain: "יציב - זמינות חומרים טובה",
      priceVolatility: "נמוכה - מחירי בנייה יציבים",
      qualityRisk: "נמוך - קבלנים מוסמכים",
      weatherRisk: "בינוני - תלוי בעונת השנה"
    }
  };
}

function generateSoftwareAnalysis(request: any) {
  return {
    confidence: 92,
    extractedSpecs: {
      projectScope: "פיתוח אפליקציה מלאה",
      estimatedHours: "2400 שעות פיתוח",
      teamSize: "6 מפתחים",
      frontendTechnology: "React.js + TypeScript",
      backendTechnology: "Node.js + Express",
      database: "PostgreSQL",
      cloudInfrastructure: "AWS/Azure",
      testingFramework: "Jest + Cypress",
      developmentPeriod: "8-10 חודשים",
      maintenancePeriod: "12 חודשים"
    },
    recommendations: [
      "השתמש בטכנולוגיות מודרניות ויציבות",
      "תכנן ארכיטקטורה מודולרית לגמישות עתידית",
      "הקצה 20% מהזמן לבדיקות ואבטחת איכות",
      "שקול אימוץ גישת Agile לניהול הפרויקט"
    ],
    marketAnalysis: {
      averagePrice: 950000,
      pricePosition: "8% מעל ממוצע השוק",
      competitionLevel: "גבוה",
      availableSuppliers: 25,
      marketTrend: "ביקוש גבוה לפרויקטי פיתוח מותאמים"
    },
    riskAssessment: {
      overall: "בינוני",
      supplyChain: "יציב - מפתחים זמינים",
      priceVolatility: "בינונית - תלוי בטכנולוגיות",
      qualityRisk: "בינוני - תלוי בניסיון הצוות",
      technicalRisk: "בינוני - טכנולוגיות מתקדמות"
    }
  };
}

function generateComputingAnalysis(request: any) {
  return {
    confidence: 94,
    extractedSpecs: {
      quantity: `${request.quantity || 1} יחידות`,
      processor: "Intel Core i7-13700 (16 cores)",
      memory: "32GB DDR4",
      storage: "1TB NVMe SSD",
      graphics: "Intel UHD Graphics",
      networkCard: "Gigabit Ethernet",
      warranty: "3 שנות אחריות",
      operatingSystem: "Windows 11 Pro",
      formFactor: "Desktop Tower",
      powerSupply: "650W 80+ Gold"
    },
    recommendations: [
      "מפרטים מתאימים לשימוש משרדי מתקדם",
      "זמינות מיידית מספקים מקומיים",
      "שקול שדרוג ל-64GB RAM לעבודה כבדה",
      "בדוק תאימות עם תוכנות קיימות"
    ],
    marketAnalysis: {
      averagePrice: 4800,
      pricePosition: "6% מתחת לממוצע השוק",
      competitionLevel: "גבוה",
      availableSuppliers: 15,
      marketTrend: "מחירי ציוד מחשוב יורדים 2% ברבעון"
    },
    riskAssessment: {
      overall: "נמוך",
      supplyChain: "יציב - זמינות טובה",
      priceVolatility: "נמוכה - שוק יציב",
      qualityRisk: "נמוך - ציוד איכותי",
      technologyObsolescence: "נמוך - טכנולוגיה עדכנית"
    }
  };
}

function generateVehicleAnalysis(request: any) {
  return {
    confidence: 91,
    extractedSpecs: {
      vehicleType: "משאית חלוקה",
      capacity: "3.5 טון",
      fuelType: "דיזל",
      transmission: "אוטומטי",
      enginePower: "150 כ\"ס",
      cargoVolume: "15 מ\"ק",
      fuelConsumption: "12 ק\"מ/ליטר",
      warranty: "5 שנות אחריות יצרן",
      maintenance: "שירות כל 15,000 ק\"מ",
      safety: "דירוג בטיחות 5 כוכבים"
    },
    recommendations: [
      "רכב מתאים לחלוקה עירונית",
      "בדוק זמינות חלקי חילוף באזור",
      "שקול גרסת היברידית לחיסכון בדלק",
      "ודא קיום רישיונות מתאימים לנהגים"
    ],
    marketAnalysis: {
      averagePrice: 180000,
      pricePosition: "5% מעל ממוצע השוק",
      competitionLevel: "בינוני",
      availableSuppliers: 6,
      marketTrend: "ביקוש גבוה לרכבי חלוקה"
    },
    riskAssessment: {
      overall: "נמוך",
      supplyChain: "יציב - יבואן רשמי",
      priceVolatility: "בינונית - תלוי במחירי דלק",
      qualityRisk: "נמוך - מותג מוכר",
      maintenanceRisk: "נמוך - שירות זמין"
    }
  };
}

function generateConsultingAnalysis(request: any) {
  return {
    confidence: 88,
    extractedSpecs: {
      serviceType: "ייעוץ עסקי אסטרטגי",
      projectDuration: "6 חודשים",
      teamSize: "3 יועצים בכירים",
      hourlyRate: "450 ₪/שעה",
      totalHours: "720 שעות",
      deliverables: "דוח אסטרטגי + תכנית יישום",
      methodology: "ניתוח SWOT + Porter's Five Forces",
      industryExpertise: "תעשייה רלוונטית",
      reportLanguage: "עברית + אנגלית",
      followUpSupport: "3 חודשי ליווי"
    },
    recommendations: [
      "ודא התאמת המתודולוגיה לצרכים",
      "בקש דוגמאות מפרויקטים דומים",
      "הגדר מדדי הצלחה ברורים",
      "תכנן מפגשי מעקב קבועים"
    ],
    marketAnalysis: {
      averagePrice: 324000,
      pricePosition: "12% מתחת לממוצע השוק",
      competitionLevel: "גבוה",
      availableSuppliers: 12,
      marketTrend: "ביקוש גבוה לייעוץ דיגיטלי"
    },
    riskAssessment: {
      overall: "בינוני",
      supplyChain: "יציב - יועצים זמינים",
      priceVolatility: "בינונית - תלוי בביקוש",
      qualityRisk: "בינוני - תלוי בניסיון היועץ",
      deliveryRisk: "בינוני - תלוי בשיתוף הלקוח"
    }
  };
}

function generateGenericAnalysis(request: any) {
  return {
    confidence: 85,
    extractedSpecs: {
      itemName: request.itemName || "פריט לא מוגדר",
      category: request.category || "קטגוריה כללית",
      quantity: `${request.quantity || 1} יחידות`,
      description: request.description || "תיאור לא זמין",
      estimatedValue: "אומדן ראשוני נדרש",
      specifications: "מפרטים נוספים נדרשים",
      deliveryTime: "זמן אספקה לא מוגדר",
      warranty: "תנאי אחריות לא מוגדרים",
      supplier: "ספק לא מוגדר",
      technicalRequirements: "דרישות טכניות נוספות נדרשות"
    },
    recommendations: [
      "נדרש מידע נוסף על המפרטים הטכניים",
      "מומלץ לקבל הצעות מחיר ממספר ספקים",
      "בדוק זמינות הפריט בשוק",
      "ודא התאמה לדרישות הארגון"
    ],
    marketAnalysis: {
      averagePrice: 50000,
      pricePosition: "נדרש מחקר שוק מפורט",
      competitionLevel: "לא ידוע",
      availableSuppliers: 0,
      marketTrend: "נדרש ניתוח שוק נוסף"
    },
    riskAssessment: {
      overall: "גבוה - מידע חסר",
      supplyChain: "לא ידוע",
      priceVolatility: "לא ידועה",
      qualityRisk: "לא ידוע",
      generalRisk: "נדרש מידע נוסף להערכת סיכונים"
    }
  };
}

// Function to generate contextual market research based on procurement request type
function generateContextualMarketResearch(request: any) {
  const category = request.category?.toLowerCase() || '';
  const itemName = request.itemName?.toLowerCase() || '';
  const description = request.description?.toLowerCase() || '';
  
  console.log(`Market research detection - Category: ${category}, Item: ${itemName}, Desc: ${description}`);
  
  // Detect request type based on category and content
  if (itemName.includes('רכב') || itemName.includes('צי') || description.includes('רכב')) {
    return generateVehicleMarketResearch(request);
  } else if (itemName.includes('מחסן') || itemName.includes('בני') || description.includes('בני')) {
    return generateConstructionMarketResearch(request);
  } else if (itemName.includes('מחשב') || itemName.includes('שרת') || itemName.includes('laptop') || category.includes('חומרה')) {
    return generateComputingMarketResearch(request);
  } else if (itemName.includes('פיתוח') || itemName.includes('מערכת') || description.includes('פיתוח')) {
    return generateSoftwareMarketResearch(request);
  } else if (itemName.includes('ייעוץ') || itemName.includes('יעוץ') || description.includes('ייעוץ')) {
    return generateConsultingMarketResearch(request);
  } else if (itemName.includes('חומרי גלם') || itemName.includes('פלדה') || itemName.includes('אלומיניום')) {
    return {
      supplierComparison: [
        {
          supplier: 'פלדמור - יבוא פלדה',
          rating: 4.6,
          deliveryTime: '3 שבועות',
          pricePerUnit: '₪4,200 לטון',
          discount: '5% מעל 50 טון',
          warranty: 'תקן ISO 9001',
          advantages: ['איכות גבוהה', 'אמינות באספקה', 'מחירים יציבים'],
          contact: 'PL'
        }
      ],
      marketInsights: [{
        title: 'מגמות שוק חומרי הגלם',
        description: 'יציבות במחירי חומרי גלם בתעשייה',
        trend: 'יציב',
        impact: 'חיובי'
      }],
      priceTrends: {
        currentQuarter: 'יציבות במחירי חומרי גלם',
        yearOverYear: 'ירידה של 3% לעומת השנה שעברה',
        forecast: 'צפויה יציבות יחסית ברבעון הבא',
        factors: ['מחירי אנרגיה', 'שער החליפין', 'ביקוש תעשייתי']
      },
      informationSources: [{
        title: 'איגוד התעשייה',
        description: 'נתוני מחירים ומלאי חומרי גלם בישראל',
        lastUpdated: 'דצמבר 2023',
        reliability: 'גבוהה'
      }],
      recommendations: [{
        title: 'קנייה בכמויות גדולות',
        description: 'נצל הנחות כמות לחיסכון משמעותי',
        priority: 'בינונית'
      }]
    };
  } else if (itemName.includes('כסא') || itemName.includes('ריהוט') || category.includes('ריהוט')) {
    return {
      supplierComparison: [
        {
          supplier: 'אמנון ריהוט משרדי',
          rating: 4.6,
          deliveryTime: '3 שבועות',
          pricePerUnit: '₪1,800',
          discount: '8% מעל 30 יחידות',
          warranty: '5 שנות אחריות',
          advantages: ['עיצוב ארגונומי', 'איכות גבוהה', 'התאמה אישית'],
          contact: 'AM'
        }
      ],
      marketInsights: [{
        title: 'מגמות שוק הריהוט המשרדי',
        description: 'עלייה בביקוש לכסאות ארגונומיים בעקבות עבודה מהבית',
        trend: 'עולה',
        impact: 'חיובי'
      }],
      priceTrends: {
        currentQuarter: 'יציבות במחירי ריהוט משרדי',
        yearOverYear: 'עלייה של 4% לעומת השנה שעברה',
        forecast: 'צפויה יציבות ברבעון הבא',
        factors: ['עלויות חומרי גלם', 'ביקוש גבוה', 'עבודה היברידית']
      },
      informationSources: [{
        title: 'איגוד יצרני הריהוט',
        description: 'נתוני שוק ומחירים בתעשיית הריהוט',
        lastUpdated: 'דצמבר 2023',
        reliability: 'גבוהה'
      }],
      recommendations: [{
        title: 'בחירת כסאות ארגונומיים',
        description: 'השקיע בכסאות איכותיים לשיפור פרודוקטיביות העובדים',
        priority: 'בינונית'
      }]
    };
  } else if (itemName.includes('אבטחה') || itemName.includes('SOC') || description.includes('אבטחת מידע')) {
    return {
      supplierComparison: [
        {
          supplier: 'Check Point ישראל',
          rating: 4.9,
          deliveryTime: '2 שבועות',
          pricePerUnit: '₪280,000 שנתי',
          discount: '5% לחוזה רב-שנתי',
          warranty: '24/7 תמיכה',
          advantages: ['מובילה עולמית', 'טכנולוגיה מתקדמת', 'תמיכה מקומית'],
          contact: 'CP'
        }
      ],
      marketInsights: [{
        title: 'מגמות אבטחת סייבר',
        description: 'עלייה חדה בביקוש לפתרונות SOC מנוהלים',
        trend: 'עולה חדה',
        impact: 'חיובי'
      }],
      priceTrends: {
        currentQuarter: 'עלייה של 12% במחירי שירותי אבטחה',
        yearOverYear: 'עלייה של 18% לעומת השנה שעברה',
        forecast: 'צפויה המשך עלייה ברבעון הבא',
        factors: ['עלייה באיומי סייבר', 'מחסור במומחים', 'רגולציה מחמירה']
      },
      informationSources: [{
        title: 'איגוד אבטחת המידע הישראלי',
        description: 'נתוני שוק ומגמות בתחום אבטחת המידע',
        lastUpdated: 'דצמבר 2023',
        reliability: 'גבוהה'
      }],
      recommendations: [{
        title: 'השקעה באבטחה',
        description: 'השקעה באבטחה מתקדמת חיונית למניעת נזקים עתידיים',
        priority: 'קריטית'
      }]
    };
  } else if (itemName.includes('תחזוקה') || description.includes('תחזוקה')) {
    return {
      supplierComparison: [
        {
          supplier: 'מטריקס שירותי IT',
          rating: 4.5,
          deliveryTime: 'מיידי',
          pricePerUnit: '₪650,000 שנתי',
          discount: '5% לחוזה רב-שנתי',
          warranty: 'SLA זמן תגובה',
          advantages: ['זמינות 24/7', 'ניסיון רב', 'צוות מקצועי'],
          contact: 'MT'
        }
      ],
      marketInsights: [{
        title: 'מגמות שירותי תחזוקה',
        description: 'עלייה בביקוש לתחזוקה מונעת ופתרונות ענן',
        trend: 'עולה',
        impact: 'חיובי'
      }],
      priceTrends: {
        currentQuarter: 'עלייה של 5% במחירי שירותי תחזוקה',
        yearOverYear: 'עלייה של 8% לעומת השנה שעברה',
        forecast: 'צפויה יציבות ברבעון הבא',
        factors: ['מורכבות מערכות', 'מחסור בטכנאים', 'טכנולוגיות חדשות']
      },
      informationSources: [{
        title: 'איגוד חברות התוכנה והשירותים',
        description: 'נתוני שוק בתחום שירותי IT ותחזוקה',
        lastUpdated: 'דצמבר 2023',
        reliability: 'גבוהה'
      }],
      recommendations: [{
        title: 'תחזוקה מונעת',
        description: 'השקיע בתחזוקה מונעת לחיסכון ארוך טווח',
        priority: 'בינונית'
      }]
    };
  } else {
    return generateGenericMarketResearch(request);
  }
}

// Vehicle market research
function generateVehicleMarketResearch(request: any) {
  return {
    supplierComparison: [
      {
        supplier: 'סוכנות טויוטה ישראל',
        rating: 4.8,
        deliveryTime: '45 ימים',
        pricePerUnit: '₪89,000',
        discount: '5% מעל 10 יחידות',
        warranty: '3 שנים + תמיכה',
        advantages: ['אמינות גבוהה', 'שירות ארצי', 'חלפים זמינים'],
        contact: 'TY'
      },
      {
        supplier: 'סוכנות פורד ישראל',
        rating: 4.6,
        deliveryTime: '60 ימים',
        pricePerUnit: '₪85,000',
        discount: '7% מעל 10 יחידות',
        warranty: '3 שנים',
        advantages: ['מחיר תחרותי', 'רשת שירות נרחבת', 'דגמים מגוונים'],
        contact: 'FI'
      },
      {
        supplier: 'סוכנות הונדה ישראל',
        rating: 4.7,
        deliveryTime: '50 ימים',
        pricePerUnit: '₪87,500',
        discount: '6% מעל 10 יחידות',
        warranty: '3 שנים + הארכה',
        advantages: ['חסכון בדלק', 'טכנולוגיה מתקדמת', 'ערך שיורי גבוה'],
        contact: 'HI'
      }
    ],
    marketInsights: [
      {
        title: 'מגמות שוק הרכבים המסחריים',
        description: 'שוק הרכבים המסחריים צומח 3.2% השנה',
        trend: 'עולה',
        impact: 'חיובי'
      },
      {
        title: 'זמינות רכבים',
        description: 'זמני אספקה התקצרו ב-15% לעומת השנה שעברה',
        trend: 'משתפר',
        impact: 'חיובי'
      },
      {
        title: 'מחירי דלק',
        description: 'עלייה של 8% במחירי הדלק משפיעה על TCO',
        trend: 'עולה',
        impact: 'שלילי'
      }
    ],
    priceTrends: {
      currentQuarter: 'יציבות במחירי רכבים מסחריים',
      yearOverYear: 'עלייה של 2.5% לעומת השנה שעברה',
      forecast: 'צפויה יציבות יחסית ברבעון הבא',
      factors: ['מחירי חומרי גלם', 'שער החליפין', 'מדיניות יבוא']
    },
    informationSources: [
      {
        title: 'איגוד יבואני הרכב',
        description: 'נתוני מכירות ומחירים רשמיים של יבואני הרכב בישראל',
        lastUpdated: 'דצמבר 2023',
        reliability: 'גבוהה'
      },
      {
        title: 'מחירון הרכבים הממשלתי',
        description: 'מחירון רשמי לרכש רכבים במגזר הציבורי',
        lastUpdated: 'ינואר 2024',
        reliability: 'גבוהה'
      },
      {
        title: 'דוח שוק הרכבים - בנק ישראל',
        description: 'ניתוח מקיף של שוק הרכבים והמגמות הכלכליות',
        lastUpdated: 'נובמבר 2023',
        reliability: 'גבוהה'
      }
    ],
    recommendations: [
      {
        title: 'המלצה לתזמון רכישה',
        description: 'מומלץ לבצע את הרכישה ברבעון הנוכחי לפני עלייה צפויה במחירים',
        priority: 'גבוהה'
      },
      {
        title: 'אסטרטגיית משא ומתן',
        description: 'נצל את הכמות הגדולה (10 יחידות) להשגת הנחות נוספות',
        priority: 'בינונית'
      }
    ]
  };
}

// Construction market research
function generateConstructionMarketResearch(request: any) {
  return {
    supplierComparison: [
      {
        supplier: 'חברת בנייה אלקטרה',
        rating: 4.7,
        deliveryTime: '6 חודשים',
        pricePerUnit: '₪1,200 למ"ר',
        discount: '3% מעל 1000 מ"ר',
        warranty: '10 שנים מבנה',
        advantages: ['ניסיון רב', 'איכות גבוהה', 'עמידה בלוחות זמנים'],
        contact: 'EL'
      },
      {
        supplier: 'קבוצת שפיר',
        rating: 4.5,
        deliveryTime: '7 חודשים',
        pricePerUnit: '₪1,150 למ"ר',
        discount: '5% מעל 1000 מ"ר',
        warranty: '10 שנים מבנה',
        advantages: ['מחיר תחרותי', 'גמישות בעיצוב', 'טכנולוגיות חדשניות'],
        contact: 'SH'
      },
      {
        supplier: 'חברת בנייה סולל בונה',
        rating: 4.6,
        deliveryTime: '6.5 חודשים',
        pricePerUnit: '₪1,180 למ"ר',
        discount: '4% מעל 1000 מ"ר',
        warranty: '12 שנים מבנה',
        advantages: ['אחריות מורחבת', 'ניסיון בפרויקטים דומים', 'יכולת ביצוע מהירה'],
        contact: 'SB'
      }
    ],
    marketInsights: [
      {
        title: 'מגמות שוק הבנייה התעשייתית',
        description: 'גידול של 5% בביקוש לבניית מחסנים ומבני תעשייה',
        trend: 'עולה',
        impact: 'חיובי'
      },
      {
        title: 'זמינות קבלנים',
        description: 'עומס עבודה גבוה אצל קבלנים מוביל לעלייה בזמני ביצוע',
        trend: 'מאתגר',
        impact: 'שלילי'
      }
    ],
    priceTrends: {
      currentQuarter: 'עלייה של 3% במחירי בנייה תעשייתית',
      yearOverYear: 'עלייה של 8% לעומת השנה שעברה',
      forecast: 'צפויה המשך עלייה מתונה ברבעון הבא',
      factors: ['מחירי חומרי גלם', 'עלויות עבודה', 'ביקוש גבוה']
    },
    informationSources: [
      {
        title: 'איגוד קבלני הבנייה',
        description: 'נתוני עלויות בנייה ומחירוני עבודות',
        lastUpdated: 'דצמבר 2023',
        reliability: 'גבוהה'
      },
      {
        title: 'מחירון דקל - עבודות בנייה',
        description: 'מחירון מקצועי לעבודות בנייה ותשתיות',
        lastUpdated: 'ינואר 2024',
        reliability: 'גבוהה'
      }
    ],
    recommendations: [
      {
        title: 'תזמון פרויקט',
        description: 'מומלץ להתחיל את הפרויקט בחודשים הקרובים לפני עונת הגשמים',
        priority: 'גבוהה'
      }
    ]
  };
}

// Computing market research (existing)
function generateComputingMarketResearch(request: any) {
  return {
    supplierComparison: [
      {
        supplier: 'TechSource Ltd',
        rating: 4.8,
        deliveryTime: '10 ימים',
        pricePerUnit: '₪4,500',
        discount: '5% מעל 50 יחידות',
        warranty: '3 שנים + תמיכה',
        advantages: ['מומלץ', 'הנחות', 'תמיכה'],
        contact: 'TS'
      },
      {
        supplier: 'Dell Technologies',
        rating: 4.7,
        deliveryTime: '15 ימים',
        pricePerUnit: '₪4,200',
        discount: '8% מעל 20 יחידות',
        warranty: '3 שנים',
        advantages: ['יבואן רשמי', 'מחיר', 'זמינות'],
        contact: 'DT'
      },
      {
        supplier: 'CompuTrade',
        rating: 4.5,
        deliveryTime: '7 ימים',
        pricePerUnit: '₪4,800',
        discount: '3% מעל 30 יחידות',
        warranty: '2 שנים',
        advantages: ['מהיר', 'מקומי', 'גמיש'],
        contact: 'CT'
      }
    ],
    marketInsights: [
      {
        title: 'מגמות שוק הטכנולוגיה',
        description: 'ביקוש גבוה לפתרונות ענן והיברידיים',
        trend: 'עולה',
        impact: 'חיובי'
      }
    ],
    priceTrends: {
      currentQuarter: 'יציבות במחירי ציוד מחשוב',
      yearOverYear: 'ירידה של 5% לעומת השנה שעברה',
      forecast: 'צפויה יציבות ברבעון הבא',
      factors: ['מלחמת שבבים', 'שרשרת אספקה', 'שער הדולר']
    },
    informationSources: [
      {
        title: 'Intel Israel',
        description: 'מידע טכני ומחירים עדכניים למעבדים ורכיבי חומרה',
        lastUpdated: 'דצמבר 2023',
        reliability: 'גבוהה'
      }
    ],
    recommendations: [
      {
        title: 'המלצה טכנולוגית',
        description: 'שקול שדרוג לטכנולוגיות חדשות יותר למען עתיד עמיד',
        priority: 'בינונית'
      }
    ]
  };
}

// Generic market research fallback
function generateGenericMarketResearch(request: any) {
  return generateComputingMarketResearch(request);
}

// Software development market research
function generateSoftwareMarketResearch(request: any) {
  return {
    supplierComparison: [
      {
        supplier: 'חברת פיתוח Alpha-Tech',
        rating: 4.8,
        deliveryTime: '12 שבועות',
        pricePerUnit: '₪450 לשעה',
        discount: '10% מעל 500 שעות',
        warranty: 'תחזוקה שנתית',
        advantages: ['ניסיון רב', 'טכנולוגיות מתקדמות', 'צוות מנוסה'],
        contact: 'AT'
      }
    ],
    marketInsights: [
      {
        title: 'מגמות פיתוח תוכנה',
        description: 'ביקוש גבוה לפתרונות AI ואוטומציה',
        trend: 'עולה',
        impact: 'חיובי'
      }
    ],
    priceTrends: {
      currentQuarter: 'עלייה של 5% בתעריפי פיתוח',
      yearOverYear: 'עלייה של 12% לעומת השנה שעברה',
      forecast: 'צפויה המשך עלייה ברבעון הבא',
      factors: ['מחסור במפתחים', 'ביקוש גבוה', 'טכנולוגיות חדשות']
    },
    informationSources: [
      {
        title: 'איגוד תעשיות התוכנה',
        description: 'נתוני שוק ותעריפים בתעשיית התוכנה',
        lastUpdated: 'דצמבר 2023',
        reliability: 'גבוהה'
      }
    ],
    recommendations: [
      {
        title: 'המלצה טכנולוגית',
        description: 'שקול אימוץ מתודולוגיות Agile לשיפור היעילות',
        priority: 'בינונית'
      }
    ]
  };
}

// Consulting market research
function generateConsultingMarketResearch(request: any) {
  return {
    supplierComparison: [
      {
        supplier: 'חברת ייעוץ עסקי McKinsey',
        rating: 4.9,
        deliveryTime: '8 שבועות',
        pricePerUnit: '₪800 לשעה',
        discount: '5% מעל 200 שעות',
        warranty: 'ליווי למימוש',
        advantages: ['מוניטין בינלאומי', 'מתודולוגיות מוכחות', 'צוות מומחים'],
        contact: 'MC'
      }
    ],
    marketInsights: [
      {
        title: 'מגמות ייעוץ עסקי',
        description: 'ביקוש גבוה לייעוץ דיגיטלי וטרנספורמציה',
        trend: 'עולה',
        impact: 'חיובי'
      }
    ],
    priceTrends: {
      currentQuarter: 'עלייה של 7% בתעריפי ייעוץ',
      yearOverYear: 'עלייה של 15% לעומת השנה שעברה',
      forecast: 'צפויה המשך עלייה ברבעון הבא',
      factors: ['ביקוש גבוה', 'מחסור ביועצים מנוסים', 'פרויקטים מורכבים']
    },
    informationSources: [
      {
        title: 'איגוד היועצים הישראלי',
        description: 'נתוני שוק ותעריפים בתחום הייעוץ העסקי',
        lastUpdated: 'דצמבר 2023',
        reliability: 'גבוהה'
      }
    ],
    recommendations: [
      {
        title: 'בחירת יועץ',
        description: 'בחר יועץ עם ניסיון ספציפי בתחום הפעילות שלך',
        priority: 'גבוהה'
      }
    ]
  };
}

// Raw materials market research  
function generateRawMaterialsMarketResearch(request: any) {
  return {
    supplierComparison: [
      {
        supplier: 'פלדמור - יבוא פלדה',
        rating: 4.6,
        deliveryTime: '3 שבועות',
        pricePerUnit: '₪4,200 לטון',
        discount: '5% מעל 50 טון',
        warranty: 'תקן ISO 9001',
        advantages: ['איכות גבוהה', 'אמינות באספקה', 'מחירים יציבים'],
        contact: 'PL'
      }
    ],
    marketInsights: [
      {
        title: 'מגמות שוק חומרי הגלם',
        description: 'יציבות במחירי חומרי גלם בתעשייה',
        trend: 'יציב',
        impact: 'חיובי'
      }
    ],
    priceTrends: {
      currentQuarter: 'יציבות במחירי חומרי גלם',
      yearOverYear: 'ירידה של 3% לעומת השנה שעברה',
      forecast: 'צפויה יציבות יחסית ברבעון הבא',
      factors: ['מחירי אנרגיה', 'שער החליפין', 'ביקוש תעשייתי']
    },
    informationSources: [
      {
        title: 'איגוד התעשייה',
        description: 'נתוני מחירים ומלאי חומרי גלם בישראל',
        lastUpdated: 'דצמבר 2023',
        reliability: 'גבוהה'
      }
    ],
    recommendations: [
      {
        title: 'קנייה בכמויות גדולות',
        description: 'נצל הנחות כמות לחיסכון משמעותי',
        priority: 'בינונית'
      }
    ]
  };
}

// Maintenance services market research
function generateMaintenanceMarketResearch(request: any) {
  return {
    supplierComparison: [
      {
        supplier: 'מטריקס שירותי IT',
        rating: 4.5,
        deliveryTime: 'מיידי',
        pricePerUnit: '₪650,000 שנתי',
        discount: '5% לחוזה רב-שנתי',
        warranty: 'SLA זמן תגובה',
        advantages: ['זמינות 24/7', 'ניסיון רב', 'צוות מקצועי'],
        contact: 'MT'
      }
    ],
    marketInsights: [
      {
        title: 'מגמות שירותי תחזוקה',
        description: 'עלייה בביקוש לתחזוקה מונעת ופתרונות ענן',
        trend: 'עולה',
        impact: 'חיובי'
      }
    ],
    priceTrends: {
      currentQuarter: 'עלייה של 5% במחירי שירותי תחזוקה',
      yearOverYear: 'עלייה של 8% לעומת השנה שעברה',
      forecast: 'צפויה יציבות ברבעון הבא',
      factors: ['מורכבות מערכות', 'מחסור בטכנאים', 'טכנולוגיות חדשות']
    },
    informationSources: [
      {
        title: 'איגוד חברות התוכנה והשירותים',
        description: 'נתוני שוק בתחום שירותי IT ותחזוקה',
        lastUpdated: 'דצמבר 2023',
        reliability: 'גבוהה'
      }
    ],
    recommendations: [
      {
        title: 'תחזוקה מונעת',
        description: 'השקיע בתחזוקה מונעת לחיסכון ארוך טווח',
        priority: 'בינונית'
      }
    ]
  };
}
