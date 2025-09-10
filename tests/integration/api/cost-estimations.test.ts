import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { MemStorage } from '../../../server/storage.js'

function createTestApp() {
  const app = express()
  app.use(express.json())
  
  const storage = new MemStorage()

  const asyncRoute = (handler: Function) => async (req: any, res: any) => {
    try {
      await handler(req, res)
    } catch (error: any) {
      const status = error?.status || 500
      const message = error?.message || 'Internal server error'
      res.status(status).json({ success: false, message })
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

  // Setup cost estimation routes
  app.get('/api/cost-estimations', asyncRoute(async (req: any, res: any) => {
    const estimations = await storage.getCostEstimations()
    res.json(estimations)
  }))

  app.get('/api/cost-estimations/:id', asyncRoute(async (req: any, res: any) => {
    const id = parseId(req.params.id)
    const estimation = await storage.getCostEstimation(id)
    if (!estimation) {
      return res.status(404).json({ message: "Cost estimation not found" })
    }
    res.json(estimation)
  }))

  app.post('/api/cost-estimations', asyncRoute(async (req: any, res: any) => {
    const estimationData = {
      ...req.body,
      id: Math.floor(Math.random() * 1000) + 1,
      createdAt: new Date()
    }
    const estimation = await storage.createCostEstimation(estimationData)
    res.status(201).json(estimation)
  }))

  return { app, storage }
}

describe('Cost Estimations API Integration', () => {
  let app: express.Application
  let storage: MemStorage

  beforeAll(() => {
    const testSetup = createTestApp()
    app = testSetup.app
    storage = testSetup.storage
  })

  beforeEach(async () => {
    // Note: MemStorage doesn't have reset method, data is isolated per test
  })

  describe('GET /api/cost-estimations', () => {
    it('should return empty array when no estimations exist', async () => {
      const response = await request(app)
        .get('/api/cost-estimations')
        .expect(200)

      expect(response.body).toEqual([])
    })

    it('should return all cost estimations', async () => {
      // Arrange
      const testEstimation = {
        procurementRequestId: 1,
        totalCost: '15000',
        estimatedDeliveryTime: '2-3 שבועות',
        confidenceLevel: 85
      }
      await storage.createCostEstimation(testEstimation)

      // Act
      const response = await request(app)
        .get('/api/cost-estimations')
        .expect(200)

      // Assert
      expect(response.body).toHaveLength(1)
      expect(response.body[0]).toMatchObject({
        procurementRequestId: 1,
        totalCost: '15000',
        confidenceLevel: 85
      })
    })
  })

  describe('GET /api/cost-estimations/:id', () => {
    it('should return specific cost estimation', async () => {
      // Arrange
      const testEstimation = {
        procurementRequestId: 1,
        totalCost: '25000',
        estimatedDeliveryTime: '1-2 שבועות',
        confidenceLevel: 90
      }
      const created = await storage.createCostEstimation(testEstimation)

      // Act
      const response = await request(app)
        .get(`/api/cost-estimations/${created.id}`)
        .expect(200)

      // Assert
      expect(response.body).toMatchObject({
        id: created.id,
        procurementRequestId: 1,
        totalCost: '25000'
      })
    })

    it('should return 404 for non-existent estimation', async () => {
      const response = await request(app)
        .get('/api/cost-estimations/999')
        .expect(404)

      expect(response.body.message).toBe('Cost estimation not found')
    })

    it('should return 400 for invalid ID', async () => {
      const response = await request(app)
        .get('/api/cost-estimations/abc')
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Invalid ID provided')
    })
  })

  describe('POST /api/cost-estimations', () => {
    it('should create new cost estimation', async () => {
      // Arrange
      const newEstimation = {
        procurementRequestId: 1,
        totalCost: '50000',
        estimatedDeliveryTime: '3-4 שבועות',
        confidenceLevel: 75,
        methodology: 'אומדן מבוסס היסטוריה',
        breakdown: [
          { item: 'עלות יחידה', amount: 45000 },
          { item: 'משלוח', amount: 3000 },
          { item: 'מס', amount: 2000 }
        ]
      }

      // Act
      const response = await request(app)
        .post('/api/cost-estimations')
        .send(newEstimation)
        .expect(201)

      // Assert
      expect(response.body).toMatchObject({
        procurementRequestId: 1,
        totalCost: '50000',
        confidenceLevel: 75
      })
      expect(response.body.id).toBeDefined()
      expect(response.body.createdAt).toBeDefined()
    })

    it('should handle complex estimation data', async () => {
      // Arrange
      const complexEstimation = {
        procurementRequestId: 2,
        totalCost: '120000',
        estimatedDeliveryTime: '4-6 שבועות',
        confidenceLevel: 95,
        methodology: 'אומדן מבוסס ספקים',
        marketPrice: '130000',
        potentialSavings: '10000',
        riskFactors: ['זמינות מוגבלת', 'תלות ברגולציה'],
        recommendations: ['בדיקת ספקים נוספים', 'הזמנה מוקדמת']
      }

      // Act
      const response = await request(app)
        .post('/api/cost-estimations')
        .send(complexEstimation)
        .expect(201)

      // Assert
      expect(response.body.totalCost).toBe('120000')
      expect(response.body.riskFactors).toEqual(['זמינות מוגבלת', 'תלות ברגולציה'])
      expect(response.body.recommendations).toEqual(['בדיקת ספקים נוספים', 'הזמנה מוקדמת'])
    })
  })
})