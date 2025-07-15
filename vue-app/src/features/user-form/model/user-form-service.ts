import type { UserFormData, CreateUserFormInput, UserFormValidationErrors } from './types'

export class UserFormService {
  private static readonly STORAGE_KEY = 'user-form'

  static save(input: CreateUserFormInput): UserFormData {
    const data: UserFormData = {
      ...input,
      createdAt: new Date()
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      ...data,
      createdAt: data.createdAt.toISOString()
    }))
    
    return data
  }

  static load(): UserFormData | null {
    const data = localStorage.getItem(this.STORAGE_KEY)
    if (!data) return null
    
    try {
      const parsed = JSON.parse(data)
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt)
      }
    } catch {
      return null
    }
  }

  static clear(): void {
    localStorage.removeItem(this.STORAGE_KEY)
  }

  static validate(input: CreateUserFormInput): UserFormValidationErrors {
    const errors: UserFormValidationErrors = {}

    if (!input.name || input.name.trim() === '') {
      errors.name = '名前は必須です'
    }

    if (!input.email || input.email.trim() === '') {
      errors.email = 'メールアドレスは必須です'
    } else if (!this.isValidEmail(input.email)) {
      errors.email = '有効なメールアドレスを入力してください'
    }

    if (!input.message || input.message.trim() === '') {
      errors.message = 'メッセージは必須です'
    }

    return errors
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}