import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { MemStorage } from '../../../server/storage.js'

// Create test app setup
function createTestApp() {
  const app = express()
  app.use(express.json())
  
  // Mock storage
  const storage = new MemStorage()
  
  // Import and setup routes (simplified version for testing)
  // Note: In a real implementation, we'd extract route logic to separate modules
  const API_MESSAGES = {
    PROCUREMENT_NOT_FOUND: 'דרישת רכש לא נמצאה',
    INVALID_REQUEST_DATA: 'נתונים לא תקינים'
  }

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

  // Setup basic routes for testing
  app.get('/api/procurement-requests', asyncRoute(async (req: any, res: any) => {
    const requests = await storage.getProcurementRequests()
    res.json(requests)
  }))

  app.get('/api/procurement-requests/:id', asyncRoute(async (req: any, res: any) => {
    const id = parseId(req.params.id)
    const request = await storage.getProcurementRequest(id)
    if (!request) {
      return res.status(404).json({ message: API_MESSAGES.PROCUREMENT_NOT_FOUND })
    }
    res.json(request)
  }))

  app.post('/api/procurement-requests', asyncRoute(async (req: any, res: any) => {
    const requestData = {
      ...req.body,
      id: Math.floor(Math.random() * 1000) + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const request = await storage.createProcurementRequest(requestData)
    res.status(201).json(request)
  }))

  return { app, storage }
}

describe('Procurement Requests API Integration', () => {
  let app: express.Application
  let storage: MemStorage

  beforeAll(() => {
    const testSetup = createTestApp()
    app = testSetup.app
    storage = testSetup.storage
  })

  beforeEach(async () => {
    // Clear storage before each test
    await storage.reset?.()
  })

  describe('GET /api/procurement-requests', () => {
    it('should return empty array when no requests exist', async () => {
      // Arrange & Act
      const response = await request(app)
        .get('/api/procurement-requests')
        .expect(200)

      // Assert
      expect(response.body).toEqual([])
    })

    it('should return all procurement requests', async () => {
      // Arrange
      const testRequest = {
        itemName: 'מחשב נייד',
        category: 'טכנולוגיה',
        quantity: 5,
        description: 'מחשבים ניידים לעובדים'
      }
      await storage.createProcurementRequest(testRequest)

      // Act
      const response = await request(app)
        .get('/api/procurement-requests')
        .expect(200)

      // Assert
      expect(response.body).toHaveLength(1)
      expect(response.body[0]).toMatchObject({
        itemName: 'מחשב נייד',
        category: 'טכנולוגיה',
        quantity: 5
      })
    })
  })

  describe('GET /api/procurement-requests/:id', () => {
    it('should return specific procurement request', async () => {
      // Arrange
      const testRequest = {
        itemName: 'מחשב נייד',
        category: 'טכנולוגיה',
        quantity: 5,
        description: 'מחשבים ניידים לעובדים'
      }
      const createdRequest = await storage.createProcurementRequest(testRequest)

      // Act
      const response = await request(app)
        .get(`/api/procurement-requests/${createdRequest.id}`)
        .expect(200)

      // Assert
      expect(response.body).toMatchObject({
        id: createdRequest.id,
        itemName: 'מחשב נייד',
        category: 'טכנולוגיה'
      })
    })

    it('should return 404 for non-existent request', async () => {
      // Arrange & Act
      const response = await request(app)
        .get('/api/procurement-requests/999')
        .expect(404)

      // Assert
      expect(response.body.message).toBe('דרישת רכש לא נמצאה')
    })

    it('should return 400 for invalid ID format', async () => {
      // Arrange & Act
      const response = await request(app)
        .get('/api/procurement-requests/invalid-id')
        .expect(400)

      // Assert
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Invalid ID provided')
    })

    it('should return 400 for negative ID', async () => {
      // Arrange & Act
      const response = await request(app)
        .get('/api/procurement-requests/-1')
        .expect(400)

      // Assert
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Invalid ID provided')
    })

    it('should return 400 for zero ID', async () => {
      // Arrange & Act
      const response = await request(app)
        .get('/api/procurement-requests/0')
        .expect(400)

      // Assert
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Invalid ID provided')
    })
  })

  describe('POST /api/procurement-requests', () => {
    it('should create new procurement request', async () => {
      // Arrange
      const newRequest = {
        itemName: 'מחשב נייד HP',
        category: 'טכנולוגיה',
        quantity: 3,
        description: 'מחשבים ניידים למחלקת הפיתוח',
        urgency: 'גבוהה'
      }

      // Act
      const response = await request(app)
        .post('/api/procurement-requests')
        .send(newRequest)
        .expect(201)

      // Assert
      expect(response.body).toMatchObject({
        itemName: 'מחשב נייד HP',
        category: 'טכנולוגיה',
        quantity: 3
      })
      expect(response.body.id).toBeDefined()
      expect(response.body.createdAt).toBeDefined()
    })

    it('should handle Hebrew content correctly', async () => {
      // Arrange
      const hebrewRequest = {
        itemName: 'כיסאות משרד',
        category: 'ריהוט',
        quantity: 10,
        description: 'כיסאות ארגונומיים למשרד החדש'
      }

      // Act
      const response = await request(app)
        .post('/api/procurement-requests')
        .send(hebrewRequest)
        .expect(201)

      // Assert
      expect(response.body.itemName).toBe('כיסאות משרד')
      expect(response.body.description).toBe('כיסאות ארגונומיים למשרד החדש')
    })
  })
})