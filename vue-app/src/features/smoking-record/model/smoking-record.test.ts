import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SmokingRecordService } from './smoking-record-service'
import type { SmokingRecord, CreateSmokingRecordInput } from './types'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('SmokingRecordService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('add', () => {
    it('should add a new smoking record', () => {
      const input: CreateSmokingRecordInput = {
        timestamp: new Date('2023-01-01T12:00:00Z'),
        location: 'Home',
        notes: 'After lunch'
      }

      const result = SmokingRecordService.add(input)

      expect(result).toMatchObject({
        id: expect.any(String),
        timestamp: input.timestamp,
        location: input.location,
        notes: input.notes
      })
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('should add a record without optional fields', () => {
      const input: CreateSmokingRecordInput = {
        timestamp: new Date('2023-01-01T12:00:00Z')
      }

      const result = SmokingRecordService.add(input)

      expect(result).toMatchObject({
        id: expect.any(String),
        timestamp: input.timestamp
      })
      expect(result.location).toBeUndefined()
      expect(result.notes).toBeUndefined()
    })

    it('should generate unique IDs for different records', () => {
      const input1: CreateSmokingRecordInput = {
        timestamp: new Date('2023-01-01T12:00:00Z')
      }
      const input2: CreateSmokingRecordInput = {
        timestamp: new Date('2023-01-01T13:00:00Z')
      }

      const result1 = SmokingRecordService.add(input1)
      const result2 = SmokingRecordService.add(input2)

      expect(result1.id).not.toBe(result2.id)
    })
  })

  describe('getAll', () => {
    it('should return empty array when no records exist', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const result = SmokingRecordService.getAll()

      expect(result).toEqual([])
      expect(localStorageMock.getItem).toHaveBeenCalledWith('smoking-records')
    })

    it('should return all records from localStorage', () => {
      const mockRecords = [
        {
          id: '1',
          timestamp: '2023-01-01T12:00:00Z',
          location: 'Home'
        },
        {
          id: '2',  
          timestamp: '2023-01-01T15:00:00Z',
          notes: 'Stressful day'
        }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockRecords))

      const result = SmokingRecordService.getAll()

      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        id: '1',
        timestamp: new Date('2023-01-01T12:00:00Z'),
        location: 'Home'
      })
      expect(result[1]).toMatchObject({
        id: '2',
        timestamp: new Date('2023-01-01T15:00:00Z'),
        notes: 'Stressful day'
      })
    })
  })

  describe('delete', () => {
    it('should delete an existing record', () => {
      const mockRecords = [
        {
          id: '1',
          timestamp: '2023-01-01T12:00:00Z'
        },
        {
          id: '2',  
          timestamp: '2023-01-01T15:00:00Z'
        }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockRecords))

      const result = SmokingRecordService.delete('1')

      expect(result).toBe(true)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'smoking-records',
        expect.stringContaining('"id":"2"')
      )
    })

    it('should return false when record does not exist', () => {
      const mockRecords = [
        {
          id: '1',
          timestamp: '2023-01-01T12:00:00Z'
        }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockRecords))

      const result = SmokingRecordService.delete('999')

      expect(result).toBe(false)
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })
  })

  describe('getTodayCount', () => {
    it('should return 0 when no records exist', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const result = SmokingRecordService.getTodayCount()

      expect(result).toBe(0)
    })

    it('should count only today records', () => {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)

      const mockRecords = [
        {
          id: '1',
          timestamp: today.toISOString()
        },
        {
          id: '2',
          timestamp: today.toISOString()
        },
        {
          id: '3',
          timestamp: yesterday.toISOString()
        },
        {
          id: '4',
          timestamp: tomorrow.toISOString()
        }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockRecords))

      const result = SmokingRecordService.getTodayCount()

      expect(result).toBe(2)
    })

    it('should handle different times within the same day', () => {
      const today = new Date()
      const morning = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0, 0)
      const afternoon = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30, 0)
      const evening = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 22, 45, 0)

      const mockRecords = [
        {
          id: '1',
          timestamp: morning.toISOString()
        },
        {
          id: '2',
          timestamp: afternoon.toISOString()
        },
        {
          id: '3',
          timestamp: evening.toISOString()
        }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockRecords))

      const result = SmokingRecordService.getTodayCount()

      expect(result).toBe(3)
    })
  })
})