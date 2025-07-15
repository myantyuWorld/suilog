export interface SmokingRecord {
  id: string
  timestamp: Date
  location?: string
  notes?: string
}

export interface CreateSmokingRecordInput {
  timestamp: Date
  location?: string
  notes?: string
}

export interface SmokingRecordFilters {
  fromDate?: Date
  toDate?: Date
  location?: string
}

export interface SmokingRecordStats {
  totalCount: number
  todayCount: number
  weeklyAverage: number
  monthlyCount: number
}