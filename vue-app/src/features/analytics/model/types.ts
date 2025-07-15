import type { SmokingRecord } from '../../smoking-record'

export interface AnalyticsStats {
  todayCount: number
  weekCount: number
  monthCount: number
}

export interface DailyData {
  date: string
  count: number
}

export interface HourlyData {
  hour: number
  count: number
}

export interface MonthlyData {
  month: string
  count: number
}

export interface ChartDataset {
  label: string
  data: number[]
  borderColor?: string
  backgroundColor?: string
  tension?: number
  fill?: boolean
  borderWidth?: number
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface AnalyticsService {
  getStats(): AnalyticsStats
  getDailyData(days: number): DailyData[]
  getHourlyData(): HourlyData[]
  getMonthlyData(months: number): MonthlyData[]
}