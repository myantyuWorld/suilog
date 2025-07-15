import type { SmokingRecord } from '../../smoking-record'
import type { AnalyticsStats, DailyData, HourlyData, MonthlyData, AnalyticsService as IAnalyticsService } from './types'

export class AnalyticsService implements IAnalyticsService {
  constructor(
    private records: SmokingRecord[],
    private currentDate: Date = new Date()
  ) {}

  getStats(): AnalyticsStats {
    const today = new Date(this.currentDate)
    today.setHours(0, 0, 0, 0)
    
    const weekAgo = new Date(this.currentDate)
    weekAgo.setDate(weekAgo.getDate() - 7)
    weekAgo.setHours(0, 0, 0, 0)
    
    const monthAgo = new Date(this.currentDate)
    monthAgo.setDate(monthAgo.getDate() - 30)
    monthAgo.setHours(0, 0, 0, 0)

    const todayCount = this.records.filter(record => {
      const recordDate = new Date(record.timestamp)
      recordDate.setHours(0, 0, 0, 0)
      return recordDate.getTime() === today.getTime()
    }).length

    const weekCount = this.records.filter(record => 
      record.timestamp >= weekAgo
    ).length

    const monthCount = this.records.filter(record => 
      record.timestamp >= monthAgo
    ).length

    return { todayCount, weekCount, monthCount }
  }

  getDailyData(days: number): DailyData[] {
    const daily = new Map<string, number>()
    const result: DailyData[] = []
    
    // 指定日数分の日付を生成
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(this.currentDate)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      daily.set(dateStr, 0)
      result.push({ date: dateStr, count: 0 })
    }
    
    // 記録をカウント
    this.records.forEach(record => {
      const dateStr = record.timestamp.toISOString().split('T')[0]
      if (daily.has(dateStr)) {
        daily.set(dateStr, daily.get(dateStr)! + 1)
      }
    })
    
    // カウントを反映
    result.forEach((item, index) => {
      item.count = daily.get(item.date) || 0
    })
    
    return result
  }

  getHourlyData(): HourlyData[] {
    const hourly = new Array(24).fill(0)
    
    this.records.forEach(record => {
      const hour = record.timestamp.getHours()
      hourly[hour]++
    })
    
    return hourly.map((count, hour) => ({ hour, count }))
  }

  getMonthlyData(months: number): MonthlyData[] {
    const monthly = new Map<string, number>()
    const result: MonthlyData[] = []
    
    // 指定月数分の月を生成
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(this.currentDate)
      date.setMonth(date.getMonth() - i)
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthly.set(monthStr, 0)
      result.push({ month: monthStr, count: 0 })
    }
    
    // 記録をカウント
    this.records.forEach(record => {
      const monthStr = `${record.timestamp.getFullYear()}-${String(record.timestamp.getMonth() + 1).padStart(2, '0')}`
      if (monthly.has(monthStr)) {
        monthly.set(monthStr, monthly.get(monthStr)! + 1)
      }
    })
    
    // カウントを反映
    result.forEach((item, index) => {
      item.count = monthly.get(item.month) || 0
    })
    
    return result
  }
}