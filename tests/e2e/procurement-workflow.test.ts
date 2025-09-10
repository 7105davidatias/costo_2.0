import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import { MemStorage } from '../../server/storage.js'

// End-to-end workflow tests
describe('Complete Procurement Workflow E2E', () => {
  let app: express.Application
  let storage: MemStorage

  beforeAll(() => {
    // Setup complete test app with all routes
    app = express()
    app.use(express.json())
    storage = new MemStorage()

    // Minimal route setup for E2E testing
    const asyncRoute = (handler: Function) => async (req: any, res: any) => {
      try {
        await handler(req, res)
      } catch (error: any) {
        res.status(error.status || 500).json({ success: false, message: error.message })
      }
    }

    const parseId = (idStr: string) => {
      const id = parseInt(idStr)
      if (isNaN(id) || id <= 0) {
        const error = new Error('Invalid ID provided') as any
        error.status = 400
        throw error
      }
      return id
    }

    // Essential routes for complete workflow
    app.post('/api/procurement-requests', asyncRoute(async (req: any, res: any) => {
      const request = await storage.createProcurementRequest({
        ...req.body,
        id: Math.floor(Math.random() * 1000) + 1,
        status: 'pending',
        createdAt: new Date()
      })
      res.status(201).json(request)
    }))

    app.get('/api/procurement-requests/:id', asyncRoute(async (req: any, res: any) => {
      const id = parseId(req.params.id)
      const request = await storage.getProcurementRequest(id)
      if (!request) {
        return res.status(404).json({ message: 'Request not found' })
      }
      res.json(request)
    }))

    app.post('/api/cost-estimations', asyncRoute(async (req: any, res: any) => {
      const estimation = await storage.createCostEstimation({
        ...req.body,
        id: Math.floor(Math.random() * 1000) + 1,
        createdAt: new Date()
      })
      res.status(201).json(estimation)
    }))

    app.post('/api/cost-estimations/approve', asyncRoute(async (req: any, res: any) => {
      const { estimationId, approvedBy } = req.body
      // Mock approval logic
      const approval = {
        id: Math.floor(Math.random() * 1000) + 1,
        estimationId,
        approvedBy,
        approvedAt: new Date(),
        status: 'approved'
      }
      res.json(approval)
    }))

    app.post('/api/documents/upload/:requestId', asyncRoute(async (req: any, res: any) => {
      const requestId = parseId(req.params.requestId)
      const document = {
        id: Math.floor(Math.random() * 1000) + 1,
        procurementRequestId: requestId,
        fileName: req.body.fileName || 'test-document.pdf',
        uploadedAt: new Date(),
        isAnalyzed: false
      }
      res.status(201).json(document)
    }))
  })

  describe('Complete procurement workflow', () => {
    it('should handle full procurement lifecycle', async () => {
      // Step 1: Create procurement request
      const procurementRequest = {
        itemName: 'מחשב נייד לעובד חדש',
        category: 'טכנולוגיה',
        quantity: 1,
        description: 'מחשב נייד לעובד חדש במחלקת הפיתוח',
        urgency: 'גבוהה',
        requestedBy: 'מנהל הפיתוח',
        department: 'פיתוח'
      }

      const createResponse = await request(app)
        .post('/api/procurement-requests')
        .send(procurementRequest)
        .expect(201)

      const requestId = createResponse.body.id
      expect(createResponse.body.itemName).toBe('מחשב נייד לעובד חדש')
      expect(createResponse.body.status).toBe('pending')

      // Step 2: Verify request was created
      const getResponse = await request(app)
        .get(`/api/procurement-requests/${requestId}`)
        .expect(200)

      expect(getResponse.body.id).toBe(requestId)
      expect(getResponse.body.itemName).toBe('מחשב נייד לעובד חדש')

      // Step 3: Upload supporting document
      const documentUpload = {
        fileName: 'מפרט_מחשב_נייד.pdf'
      }

      const uploadResponse = await request(app)
        .post(`/api/documents/upload/${requestId}`)
        .send(documentUpload)
        .expect(201)

      expect(uploadResponse.body.procurementRequestId).toBe(requestId)
      expect(uploadResponse.body.fileName).toBe('מפרט_מחשב_נייד.pdf')

      // Step 4: Create cost estimation
      const costEstimation = {
        procurementRequestId: requestId,
        totalCost: '8500',
        estimatedDeliveryTime: '1-2 שבועות',
        confidenceLevel: 90,
        methodology: 'מחירון ספק מאושר',
        breakdown: [
          { item: 'מחשב נייד HP EliteBook', amount: 7200 },
          { item: 'אחריות מורחבת', amount: 800 },
          { item: 'משלוח', amount: 300 },
          { item: 'מע״ם', amount: 200 }
        ]
      }

      const estimationResponse = await request(app)
        .post('/api/cost-estimations')
        .send(costEstimation)
        .expect(201)

      const estimationId = estimationResponse.body.id
      expect(estimationResponse.body.totalCost).toBe('8500')
      expect(estimationResponse.body.procurementRequestId).toBe(requestId)

      // Step 5: Approve cost estimation
      const approval = {
        estimationId: estimationId,
        approvedBy: 'מנהל כספים',
        comments: 'מאושר לרכישה מיידית'
      }

      const approvalResponse = await request(app)
        .post('/api/cost-estimations/approve')
        .send(approval)
        .expect(200)

      expect(approvalResponse.body.estimationId).toBe(estimationId)
      expect(approvalResponse.body.status).toBe('approved')
      expect(approvalResponse.body.approvedBy).toBe('מנהל כספים')

      // Verify complete workflow data consistency
      const finalCheck = await request(app)
        .get(`/api/procurement-requests/${requestId}`)
        .expect(200)

      expect(finalCheck.body.id).toBe(requestId)
      expect(finalCheck.body.itemName).toBe('מחשב נייד לעובד חדש')
    })

    it('should handle workflow with multiple cost estimations', async () => {
      // Create base request
      const requestData = {
        itemName: 'פרויקטור לחדר ישיבות',
        category: 'ציוד אודיו ויזואלי',
        quantity: 1,
        description: 'פרויקטור 4K לחדר הישיבות הגדול'
      }

      const createResponse = await request(app)
        .post('/api/procurement-requests')
        .send(requestData)
        .expect(201)

      const requestId = createResponse.body.id

      // Create multiple cost estimations from different sources
      const estimations = [
        {
          procurementRequestId: requestId,
          totalCost: '12000',
          methodology: 'הצעה מספק א',
          confidenceLevel: 85
        },
        {
          procurementRequestId: requestId,
          totalCost: '11500',
          methodology: 'הצעה מספק ב',
          confidenceLevel: 88
        },
        {
          procurementRequestId: requestId,
          totalCost: '13200',
          methodology: 'הצעה מספק ג',
          confidenceLevel: 92
        }
      ]

      const estimationPromises = estimations.map(est =>
        request(app)
          .post('/api/cost-estimations')
          .send(est)
          .expect(201)
      )

      const estimationResponses = await Promise.all(estimationPromises)

      // Verify all estimations were created
      expect(estimationResponses).toHaveLength(3)
      estimationResponses.forEach((response, index) => {
        expect(response.body.procurementRequestId).toBe(requestId)
        expect(response.body.totalCost).toBe(estimations[index].totalCost)
      })

      // Choose best estimation (lowest cost with good confidence)
      const bestEstimation = estimationResponses[1] // ספק ב - 11500 עם confidence 88

      const approval = await request(app)
        .post('/api/cost-estimations/approve')
        .send({
          estimationId: bestEstimation.body.id,
          approvedBy: 'ועדת רכש',
          comments: 'נבחרה ההצעה הטובה ביותר מבחינת יחס מחיר-איכות'
        })
        .expect(200)

      expect(approval.body.estimationId).toBe(bestEstimation.body.id)
      expect(approval.body.status).toBe('approved')
    })

    it('should handle error scenarios gracefully', async () => {
      // Try to get non-existent request
      await request(app)
        .get('/api/procurement-requests/999999')
        .expect(404)

      // Try to upload document for non-existent request
      await request(app)
        .post('/api/documents/upload/999999')
        .send({ fileName: 'test.pdf' })
        .expect(404)

      // Try to create estimation for non-existent request
      await request(app)
        .post('/api/cost-estimations')
        .send({
          procurementRequestId: 999999,
          totalCost: '1000'
        })
        .expect(400) // Should fail validation or storage

      // Try to approve non-existent estimation
      await request(app)
        .post('/api/cost-estimations/approve')
        .send({
          estimationId: 999999,
          approvedBy: 'tester'
        })
        .expect(400)
    })

    it('should validate Hebrew content throughout workflow', async () => {
      const hebrewRequest = {
        itemName: 'כיסאות משרד ארגונומיים',
        category: 'ריהוט משרדי',
        quantity: 15,
        description: 'כיסאות ארגונומיים איכותיים למשרד החדש ברמת גן, עם תמיכה לומבארית ומנגנון הגבהה',
        urgency: 'בינונית',
        requestedBy: 'שרה כהן-לוי',
        department: 'משאבי אנוש',
        justification: 'שיפור תנאי העבודה ומניעת בעיות בריאותיות'
      }

      const response = await request(app)
        .post('/api/procurement-requests')
        .send(hebrewRequest)
        .expect(201)

      // Verify Hebrew content preserved correctly
      expect(response.body.itemName).toBe('כיסאות משרד ארגונומיים')
      expect(response.body.requestedBy).toBe('שרה כהן-לוי')
      expect(response.body.description).toContain('ארגונומיים איכותיים')
      expect(response.body.department).toBe('משאבי אנוש')

      // Test Hebrew in cost estimation
      const hebrewEstimation = {
        procurementRequestId: response.body.id,
        totalCost: '22500',
        estimatedDeliveryTime: '3-4 שבועות',
        methodology: 'אומדן מבוסס קטלוג ספק מקומי',
        confidenceLevel: 87,
        recommendations: [
          'בדיקת אפשרות להנחה בכמות',
          'וודא התאמה לתקן הישראלי',
          'שקול רכישה פרוסה לפני הקמת המשרד'
        ]
      }

      const estimationResponse = await request(app)
        .post('/api/cost-estimations')
        .send(hebrewEstimation)
        .expect(201)

      expect(estimationResponse.body.methodology).toBe('אומדן מבוסס קטלוג ספק מקומי')
      expect(estimationResponse.body.estimatedDeliveryTime).toBe('3-4 שבועות')
    })
  })

  describe('Workflow performance under load', () => {
    it('should handle multiple concurrent workflows', async () => {
      const workflowPromises = Array.from({ length: 5 }, (_, i) =>
        executeCompleteWorkflow(app, i + 1)
      )

      const results = await Promise.all(workflowPromises)

      results.forEach(result => {
        expect(result.success).toBe(true)
        expect(result.requestId).toBeDefined()
        expect(result.estimationId).toBeDefined()
        expect(result.approvalId).toBeDefined()
      })
    })
  })
})

// Helper function for complete workflow execution
async function executeCompleteWorkflow(app: express.Application, index: number) {
  try {
    // Create request
    const requestResponse = await request(app)
      .post('/api/procurement-requests')
      .send({
        itemName: `מוצר בדיקה ${index}`,
        category: 'בדיקות',
        quantity: index,
        description: `תיאור מוצר בדיקה ${index}`
      })

    const requestId = requestResponse.body.id

    // Create estimation
    const estimationResponse = await request(app)
      .post('/api/cost-estimations')
      .send({
        procurementRequestId: requestId,
        totalCost: (index * 1000).toString(),
        confidenceLevel: 80 + index
      })

    const estimationId = estimationResponse.body.id

    // Approve estimation
    const approvalResponse = await request(app)
      .post('/api/cost-estimations/approve')
      .send({
        estimationId,
        approvedBy: `מאשר ${index}`
      })

    return {
      success: true,
      requestId,
      estimationId,
      approvalId: approvalResponse.body.id
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}