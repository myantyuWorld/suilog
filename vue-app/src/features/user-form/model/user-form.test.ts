import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UserFormService } from './user-form-service'
import type { UserFormData, CreateUserFormInput } from './types'

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

describe('UserFormService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('save', () => {
    it('should save user form data with timestamp', () => {
      const input: CreateUserFormInput = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello world'
      }

      const result = UserFormService.save(input)

      expect(result).toMatchObject({
        name: input.name,
        email: input.email,
        message: input.message,
        createdAt: expect.any(Date)
      })
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user-form',
        JSON.stringify({
          ...input,
          createdAt: result.createdAt.toISOString()
        })
      )
    })

    it('should handle empty form data', () => {
      const input: CreateUserFormInput = {
        name: '',
        email: '',
        message: ''
      }

      const result = UserFormService.save(input)

      expect(result).toMatchObject(input)
      expect(result.createdAt).toBeInstanceOf(Date)
    })
  })

  describe('load', () => {
    it('should return null when no data exists', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const result = UserFormService.load()

      expect(result).toBeNull()
      expect(localStorageMock.getItem).toHaveBeenCalledWith('user-form')
    })

    it('should load and parse saved data', () => {
      const mockData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Test message',
        createdAt: '2023-01-01T12:00:00Z'
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData))

      const result = UserFormService.load()

      expect(result).toMatchObject({
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Test message',
        createdAt: new Date('2023-01-01T12:00:00Z')
      })
    })

    it('should handle corrupted data gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')

      const result = UserFormService.load()

      expect(result).toBeNull()
    })
  })

  describe('clear', () => {
    it('should remove data from localStorage', () => {
      UserFormService.clear()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user-form')
    })
  })

  describe('validate', () => {
    it('should return no errors for valid data', () => {
      const validData: CreateUserFormInput = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello world'
      }

      const errors = UserFormService.validate(validData)

      expect(errors).toEqual({})
    })

    it('should return error for missing name', () => {
      const invalidData: CreateUserFormInput = {
        name: '',
        email: 'john@example.com',
        message: 'Hello world'
      }

      const errors = UserFormService.validate(invalidData)

      expect(errors.name).toBe('名前は必須です')
    })

    it('should return error for invalid email format', () => {
      const invalidData: CreateUserFormInput = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Hello world'
      }

      const errors = UserFormService.validate(invalidData)

      expect(errors.email).toBe('有効なメールアドレスを入力してください')
    })

    it('should return error for missing email', () => {
      const invalidData: CreateUserFormInput = {
        name: 'John Doe',
        email: '',
        message: 'Hello world'
      }

      const errors = UserFormService.validate(invalidData)

      expect(errors.email).toBe('メールアドレスは必須です')
    })

    it('should return error for missing message', () => {
      const invalidData: CreateUserFormInput = {
        name: 'John Doe',
        email: 'john@example.com',
        message: ''
      }

      const errors = UserFormService.validate(invalidData)

      expect(errors.message).toBe('メッセージは必須です')
    })

    it('should return multiple errors', () => {
      const invalidData: CreateUserFormInput = {
        name: '',
        email: 'invalid',
        message: ''
      }

      const errors = UserFormService.validate(invalidData)

      expect(errors.name).toBe('名前は必須です')
      expect(errors.email).toBe('有効なメールアドレスを入力してください')
      expect(errors.message).toBe('メッセージは必須です')
    })
  })
})