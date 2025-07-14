export interface SmokingRecord {
  id: string
  timestamp: Date
  location?: string
  notes?: string
}

export class SmokingRecordManager {
  private static readonly STORAGE_KEY = 'smoking-records'

  static getAll(): SmokingRecord[] {
    const data = localStorage.getItem(this.STORAGE_KEY)
    if (!data) return []
    
    const records = JSON.parse(data) as SmokingRecord[]
    return records.map(record => ({
      ...record,
      timestamp: new Date(record.timestamp)
    }))
  }

  static add(record: Omit<SmokingRecord, 'id'>): SmokingRecord {
    const newRecord: SmokingRecord = {
      ...record,
      id: Date.now().toString()
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