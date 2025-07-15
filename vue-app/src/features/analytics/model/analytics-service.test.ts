import { describe, test, expect, beforeEach } from 'vitest'
import { AnalyticsService } from './analytics-service'
import type { SmokingRecord } from '../../smoking-record'

describe('AnalyticsService', () => {
  let service: AnalyticsService
  let mockRecords: SmokingRecord[]

  beforeEach(() => {
    const now = new Date('2024-01-15T12:00:00Z')
    mockRecords = [
      { id: '1', timestamp: new Date('2024-01-15T10:00:00Z') }, // 今日
      { id: '2', timestamp: new Date('2024-01-15T14:00:00Z') }, // 今日
      { id: '3', timestamp: new Date('2024-01-14T10:00:00Z') }, // 昨日 (1日前)
      { id: '4', timestamp: new Date('2024-01-10T10:00:00Z') }, // 5日前
      { id: '5', timestamp: new Date('2023-12-15T10:00:00Z') }, // 1ヶ月前 (31日前)
    ]
    service = new AnalyticsService(mockRecords, now)
  })

  describe('getStats', () => {
    test('今日、今週、今月の統計を正しく計算する', () => {
      const stats = service.getStats()
      
      expect(stats.todayCount).toBe(2) // 今日の記録: 2件
      expect(stats.weekCount).toBe(4) // 今週の記録: 4件（今日2件 + 昨日1件 + 5日前1件）
      expect(stats.monthCount).toBe(4) // 今月の記録: 4件（1ヶ月前を除く）
    })
  })

  describe('getDailyData', () => {
    test('指定日数分の日別データを生成する', () => {
      const dailyData = service.getDailyData(3)
      
      expect(dailyData).toHaveLength(3)
      expect(dailyData[0].date).toBe('2024-01-13')
      expect(dailyData[0].count).toBe(0)
      expect(dailyData[1].date).toBe('2024-01-14')
      expect(dailyData[1].count).toBe(1)
      expect(dailyData[2].date).toBe('2024-01-15')
      expect(dailyData[2].count).toBe(2)
    })

    test('記録がない日は0を返す', () => {
      const dailyData = service.getDailyData(3)
      const noRecordDay = dailyData.find(d => d.date === '2024-01-13')
      
      expect(noRecordDay).toBeDefined()
      expect(noRecordDay!.count).toBe(0)
    })
  })

  describe('getHourlyData', () => {
    test('24時間分の時間別データを生成する', () => {
      const hourlyData = service.getHourlyData()
      
      expect(hourlyData).toHaveLength(24)
      
      // 実際の時間データを確認
      const totalCount = hourlyData.reduce((sum, h) => sum + h.count, 0)
      expect(totalCount).toBe(mockRecords.length)
      
      // 19時台（UTC10時→JST19時）に記録があることを確認
      expect(hourlyData[19].count).toBe(4)
      // 23時台（UTC14時→JST23時）に記録があることを確認
      expect(hourlyData[23].count).toBe(1)
      // 0時台は記録なし
      expect(hourlyData[0].count).toBe(0)
    })
  })

  describe('getMonthlyData', () => {
    test('指定月数分の月別データを生成する', () => {
      const monthlyData = service.getMonthlyData(2)
      
      expect(monthlyData).toHaveLength(2)
      expect(monthlyData[0].month).toBe('2023-12')
      expect(monthlyData[0].count).toBe(1)
      expect(monthlyData[1].month).toBe('2024-01')
      expect(monthlyData[1].count).toBe(4)
    })
  })
})