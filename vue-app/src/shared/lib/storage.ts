import { config } from '../config'

export interface StorageItem<T> {
  value: T
  expiration?: number
}

export class LocalStorageService {
  private prefix: string

  constructor(prefix: string = config.storage.prefix) {
    this.prefix = prefix
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  set<T>(key: string, value: T, expiration?: number): void {
    const storageKey = this.getKey(key)
    const item: StorageItem<T> = {
      value,
      expiration: expiration ? Date.now() + expiration : undefined
    }
    window.localStorage.setItem(storageKey, JSON.stringify(item))
  }

  get<T>(key: string): T | null {
    const storageKey = this.getKey(key)
    const itemStr = window.localStorage.getItem(storageKey)
    
    if (!itemStr) return null

    try {
      const item: StorageItem<T> = JSON.parse(itemStr)
      
      if (item.expiration && Date.now() > item.expiration) {
        this.remove(key)
        return null
      }
      
      return item.value
    } catch (error) {
      console.error('Error parsing localStorage item:', error)
      this.remove(key)
      return null
    }
  }

  remove(key: string): void {
    const storageKey = this.getKey(key)
    window.localStorage.removeItem(storageKey)
  }

  clear(): void {
    const keys = Object.keys(window.localStorage)
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        window.localStorage.removeItem(key)
      }
    })
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }
}

export const localStorageService = new LocalStorageService()