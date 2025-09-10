import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'

// Import the actual functions from routes.ts
import { readFileSync } from 'fs'
import { join } from 'path'

// Extract asyncRoute function from routes.ts
const routesContent = readFileSync(join(process.cwd(), 'server/routes.ts'), 'utf-8')
const asyncRouteMatch = routesContent.match(/const asyncRoute = \(handler[^}]+}\s*}\s*;/s)
if (!asyncRouteMatch) throw new Error('Could not extract asyncRoute function')

// Create asyncRoute function for testing
const asyncRoute = new Function('API_MESSAGES', `
  const API_MESSAGES = { INVALID_REQUEST_DATA: 'Invalid request data' };
  ${asyncRouteMatch[0]}
  return asyncRoute;
`)({ INVALID_REQUEST_DATA: 'Invalid request data' })

describe('asyncRoute wrapper', () => {
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockJson: any
  let mockStatus: any

  beforeEach(() => {
    mockJson = vi.fn().mockReturnThis()
    mockStatus = vi.fn().mockReturnThis()
    
    mockReq = {
      params: {},
      body: {},
      query: {}
    }
    
    mockRes = {
      json: mockJson,
      status: mockStatus
    }
  })

  it('should execute handler successfully when no errors occur', async () => {
    // Arrange
    const mockHandler = vi.fn().mockResolvedValue(undefined)
    const wrappedHandler = asyncRoute(mockHandler)
    
    // Act
    await wrappedHandler(mockReq, mockRes)
    
    // Assert
    expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes)
    expect(mockStatus).not.toHaveBeenCalled()
    expect(mockJson).not.toHaveBeenCalled()
  })

  it('should handle generic errors with 500 status', async () => {
    // Arrange
    const testError = new Error('Test error')
    const mockHandler = vi.fn().mockRejectedValue(testError)
    const wrappedHandler = asyncRoute(mockHandler)
    
    // Act
    await wrappedHandler(mockReq, mockRes)
    
    // Assert
    expect(mockStatus).toHaveBeenCalledWith(500)
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      message: 'Test error'
    })
  })

  it('should handle Zod validation errors with 400 status', async () => {
    // Arrange
    const zodError = {
      name: 'ZodError',
      issues: [{ message: 'Invalid field', path: ['field'] }]
    }
    const mockHandler = vi.fn().mockRejectedValue(zodError)
    const wrappedHandler = asyncRoute(mockHandler)
    
    // Act
    await wrappedHandler(mockReq, mockRes)
    
    // Assert
    expect(mockStatus).toHaveBeenCalledWith(400)
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid request data',
      errors: zodError.issues
    })
  })

  it('should handle errors with custom status codes', async () => {
    // Arrange
    const customError = new Error('Not found') as any
    customError.status = 404
    const mockHandler = vi.fn().mockRejectedValue(customError)
    const wrappedHandler = asyncRoute(mockHandler)
    
    // Act
    await wrappedHandler(mockReq, mockRes)
    
    // Assert
    expect(mockStatus).toHaveBeenCalledWith(404)
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      message: 'Not found'
    })
  })

  it('should handle errors with statusCode property', async () => {
    // Arrange
    const customError = new Error('Unauthorized') as any
    customError.statusCode = 401
    const mockHandler = vi.fn().mockRejectedValue(customError)
    const wrappedHandler = asyncRoute(mockHandler)
    
    // Act
    await wrappedHandler(mockReq, mockRes)
    
    // Assert
    expect(mockStatus).toHaveBeenCalledWith(401)
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      message: 'Unauthorized'
    })
  })

  it('should handle null errors gracefully', async () => {
    // Arrange
    const mockHandler = vi.fn().mockRejectedValue(null)
    const wrappedHandler = asyncRoute(mockHandler)
    
    // Act
    await wrappedHandler(mockReq, mockRes)
    
    // Assert
    expect(mockStatus).toHaveBeenCalledWith(500)
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      message: 'Internal server error'
    })
  })

  it('should log errors to console', async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const testError = new Error('Test error')
    const mockHandler = vi.fn().mockRejectedValue(testError)
    const wrappedHandler = asyncRoute(mockHandler)
    
    // Act
    await wrappedHandler(mockReq, mockRes)
    
    // Assert
    expect(consoleSpy).toHaveBeenCalledWith('Route error:', testError)
    
    // Cleanup
    consoleSpy.mockRestore()
  })
})