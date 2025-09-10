import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

// Extract parseId function from routes.ts
const routesContent = readFileSync(join(process.cwd(), 'server/routes.ts'), 'utf-8')
const parseIdMatch = routesContent.match(/const parseId = \([^}]+}\s*;/s)
if (!parseIdMatch) throw new Error('Could not extract parseId function')

// Create parseId function for testing
const parseId = new Function(`
  ${parseIdMatch[0]}
  return parseId;
`)()

describe('parseId helper', () => {
  it('should parse valid positive integer string', () => {
    // Arrange & Act & Assert
    expect(parseId('1')).toBe(1)
    expect(parseId('123')).toBe(123)
    expect(parseId('999')).toBe(999)
  })

  it('should parse valid integer with leading zeros', () => {
    // Arrange & Act & Assert
    expect(parseId('01')).toBe(1)
    expect(parseId('007')).toBe(7)
    expect(parseId('0123')).toBe(123)
  })

  it('should throw error for non-numeric strings', () => {
    // Arrange & Act & Assert
    expect(() => parseId('abc')).toThrow('Invalid ID provided')
    expect(() => parseId('12a')).toThrow('Invalid ID provided')
    expect(() => parseId('a12')).toThrow('Invalid ID provided')
    expect(() => parseId('')).toThrow('Invalid ID provided')
  })

  it('should throw error for zero', () => {
    // Arrange & Act & Assert
    expect(() => parseId('0')).toThrow('Invalid ID provided')
    expect(() => parseId('00')).toThrow('Invalid ID provided')
  })

  it('should throw error for negative numbers', () => {
    // Arrange & Act & Assert
    expect(() => parseId('-1')).toThrow('Invalid ID provided')
    expect(() => parseId('-123')).toThrow('Invalid ID provided')
  })

  it('should throw error for decimal numbers', () => {
    // Arrange & Act & Assert
    expect(() => parseId('1.5')).toThrow('Invalid ID provided')
    expect(() => parseId('12.34')).toThrow('Invalid ID provided')
    expect(() => parseId('0.1')).toThrow('Invalid ID provided')
  })

  it('should throw error for special values', () => {
    // Arrange & Act & Assert
    expect(() => parseId('Infinity')).toThrow('Invalid ID provided')
    expect(() => parseId('NaN')).toThrow('Invalid ID provided')
    expect(() => parseId('null')).toThrow('Invalid ID provided')
    expect(() => parseId('undefined')).toThrow('Invalid ID provided')
  })

  it('should throw error with correct status code', () => {
    // Arrange & Act
    try {
      parseId('invalid')
    } catch (error: any) {
      // Assert
      expect(error.status).toBe(400)
      expect(error.message).toBe('Invalid ID provided')
    }
  })

  it('should handle whitespace strings', () => {
    // Arrange & Act & Assert
    expect(() => parseId(' ')).toThrow('Invalid ID provided')
    expect(() => parseId('  ')).toThrow('Invalid ID provided')
    expect(() => parseId('\n')).toThrow('Invalid ID provided')
    expect(() => parseId('\t')).toThrow('Invalid ID provided')
  })

  it('should handle edge case large numbers', () => {
    // Arrange & Act & Assert
    expect(parseId('999999')).toBe(999999)
    expect(parseId('2147483647')).toBe(2147483647) // Max safe int
  })

  it('should handle numbers with plus sign', () => {
    // Arrange & Act & Assert
    expect(parseId('+1')).toBe(1)
    expect(parseId('+123')).toBe(123)
  })
})