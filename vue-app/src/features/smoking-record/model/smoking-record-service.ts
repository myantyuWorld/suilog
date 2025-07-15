import type { SmokingRecord, CreateSmokingRecordInput } from './types'

export class SmokingRecordService {
  private static readonly STORAGE_KEY = 'smoking-records'

  static getAll(): SmokingRecord[] {
    const data = localStorage.getItem(this.STORAGE_KEY)
    if (!data) return []
    
    try {
      const records = JSON.parse(data) as SmokingRecord[]
      return records.map(record => ({
        ...record,
        timestamp: new Date(record.timestamp)
      }))
    } catch {
      return []
    }
  }

  static add(input: CreateSmokingRecordInput): SmokingRecord {
    const newRecord: SmokingRecord = {
      ...input,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }
    
    const records = this.getAll()
    records.push(newRecord)
    this.save(records)
    
    return newRecord
  }

  static delete(id: string): boolean {
    const records = this.getAll()
    const filteredRecords = records.filter(record => record.id !== id)
    
    if (filteredRecords.length === records.length) {
      return false
    }
    
    this.save(filteredRecords)
    return true
  }

  static getTodayCount(): number {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const records = this.getAll()
    return records.filter(record => {
      const recordDate = new Date(record.timestamp)
      recordDate.setHours(0, 0, 0, 0)
      return recordDate.getTime() === today.getTime()
    }).length
  }

  private static save(records: SmokingRecord[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records))
  }
}