import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import { MemStorage } from '../../server/storage.js'

// Performance test configuration
const PERFORMANCE_THRESHOLDS = {
  SIMPLE_GET: 50, // milliseconds
  COMPLEX_GET: 100,
  POST_CREATE: 150,
  BULK_OPERATIONS: 500
}

function createTestApp() {
  const app = express()
  app.use(express.json())
  
  const storage = new MemStorage()

  const asyncRoute = (handler: Function) => async (req: any, res: any) => {
    try {
      await handler(req, res)
    } catch (error: any) {
      const status = error?.status || 500
      res.status(status).json({ success: false, message: error.message })
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

  // Setup routes
  app.get('/api/procurement-requests', asyncRoute(async (req: any, res: any) => {
    const requests = await storage.getProcurementRequests()
    res.json(requests)
  }))

  app.get('/api/procurement-requests/:id', asyncRoute(async (req: any, res: any) => {
    const id = parseId(req.params.id)
    const request = await storage.getProcurementRequest(id)
    if (!request) {
      return res.status(404).json({ message: 'Not found' })
    }
    res.json(request)
  }))

  app.post('/api/procurement-requests', asyncRoute(async (req: any, res: any) => {
    const requestData = {
      ...req.body,
      id: Math.floor(Math.random() * 1000000) + 1,
      createdAt: new Date()
    }
    const request = await storage.createProcurementRequest(requestData)
    res.status(201).json(request)
  }))

  app.get('/api/cost-estimations', asyncRoute(async (req: any, res: any) => {
    const estimations = await storage.getCostEstimations()
    res.json(estimations)
  }))

  return { app, storage }
}

describe('API Performance Tests', () => {
  let app: express.Application
  let storage: MemStorage

  beforeAll(async () => {
    const testSetup = createTestApp()
    app = testSetup.app
    storage = testSetup.storage

    // Pre-populate with test data
    for (let i = 1; i <= 100; i++) {
      await storage.createProcurementRequest({
        itemName: `פריט ${i}`,
        category: 'קטגוריה בדיקה',
        quantity: i,
        description: `תיאור פריט ${i}`,
        urgency: 'בינונית'
      })
    }

    for (let i = 1; i <= 50; i++) {
      await storage.createCostEstimation({
        procurementRequestId: i,
        totalCost: (i * 1000).toString(),
        confidenceLevel: 80 + (i % 20)
      })
    }
  })

  describe('GET endpoint performance', () => {
    it('should respond to /api/procurement-requests within threshold', async () => {
      const startTime = Date.now()
      
      const response = await request(app)
        .get('/api/procurement-requests')
        .expect(200)
      
      const responseTime = Date.now() - startTime
      
      expect(response.body).toHaveLength(100)
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.COMPLEX_GET)
    })

    it('should respond to individual request lookup within threshold', async () => {
      const startTime = Date.now()
      
      const response = await request(app)
        .get('/api/procurement-requests/1')
        .expect(200)
      
      const responseTime = Date.now() - startTime
      
      expect(response.body.itemName).toBe('פריט 1')
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SIMPLE_GET)
    })

    it('should handle parseId efficiently for valid inputs', async () => {
      const iterations = 1000
      const startTime = Date.now()
      
      for (let i = 1; i <= iterations; i++) {
        await request(app)
          .get(`/api/procurement-requests/${i % 100 + 1}`)
      }
      
      const totalTime = Date.now() - startTime
      const averageTime = totalTime / iterations
      
      expect(averageTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SIMPLE_GET)
    })

    it('should handle invalid IDs quickly', async () => {
      const startTime = Date.now()
      
      await request(app)
        .get('/api/procurement-requests/invalid-id')
        .expect(400)
      
      const responseTime = Date.now() - startTime
      
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SIMPLE_GET)
    })
  })

  describe('POST endpoint performance', () => {
    it('should create new requests within threshold', async () => {
      const startTime = Date.now()
      
      const newRequest = {
        itemName: 'פריט ביצועים',
        category: 'בדיקת ביצועים',
        quantity: 5,
        description: 'בדיקת יצירת פריט חדש'
      }
      
      const response = await request(app)
        .post('/api/procurement-requests')
        .send(newRequest)
        .expect(201)
      
      const responseTime = Date.now() - startTime
      
      expect(response.body.itemName).toBe('פריט ביצועים')
      expect(responseTime).toBeLessThan(PERFORMANCE_THRESHOLDS.POST_CREATE)
    })
  })

  describe('Concurrent request handling', () => {
    it('should handle multiple concurrent requests efficiently', async () => {
      const concurrentRequests = 20
      const startTime = Date.now()
      
      const promises = Array.from({ length: concurrentRequests }, (_, i) =>
        request(app)
          .get(`/api/procurement-requests/${(i % 50) + 1}`)
          .expect(200)
      )
      
      const responses = await Promise.all(promises)
      
      const totalTime = Date.now() - startTime
      
      expect(responses).toHaveLength(concurrentRequests)
      expect(totalTime).toBeLessThan(PERFORMANCE_THRESHOLDS.BULK_OPERATIONS)
    })

    it('should handle mixed operation types concurrently', async () => {
      const startTime = Date.now()
      
      const promises = [
        // GET operations
        request(app).get('/api/procurement-requests').expect(200),
        request(app).get('/api/cost-estimations').expect(200),
        request(app).get('/api/procurement-requests/1').expect(200),
        
        // POST operations
        request(app)
          .post('/api/procurement-requests')
          .send({
            itemName: 'פריט קונקורנטי',
            category: 'בדיקה',
            quantity: 1
          })
          .expect(201),
        
        // Error cases
        request(app).get('/api/procurement-requests/999999').expect(404),
        request(app).get('/api/procurement-requests/invalid').expect(400)
      ]
      
      const responses = await Promise.all(promises)
      const totalTime = Date.now() - startTime
      
      expect(responses).toHaveLength(6)
      expect(totalTime).toBeLessThan(PERFORMANCE_THRESHOLDS.BULK_OPERATIONS)
    })
  })

  describe('Memory usage stability', () => {
    it('should not leak memory during repeated operations', async () => {
      const initialMemory = process.memoryUsage().heapUsed
      
      // Perform many operations
      for (let i = 0; i < 100; i++) {
        await request(app)
          .get('/api/procurement-requests')
          .expect(200)
          
        // Occasionally force garbage collection if available
        if (global.gc && i % 10 === 0) {
          global.gc()
        }
      }
      
      const finalMemory = process.memoryUsage().heapUsed
      const memoryIncrease = finalMemory - initialMemory
      
      // Memory increase should be minimal (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
    })
  })

  describe('Error handling performance', () => {
    it('should handle validation errors quickly', async () => {
      const startTime = Date.now()
      
      // Test various invalid ID formats
      const invalidIds = ['abc', '-1', '0', '1.5', 'null', '']
      
      const promises = invalidIds.map(id =>
        request(app)
          .get(`/api/procurement-requests/${id}`)
          .expect(400)
      )
      
      await Promise.all(promises)
      
      const totalTime = Date.now() - startTime
      const averageTime = totalTime / invalidIds.length
      
      expect(averageTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SIMPLE_GET)
    })
  })
})