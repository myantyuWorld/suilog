export interface SettingsData {
  dailyGoal: number // 一日の目標本数
  monthlyBudgetGoal: number // 一ヶ月の目標金額（円）
}

export interface SettingsState {
  data: SettingsData
  errors: Partial<Record<keyof SettingsData, string>>
  isLoading: boolean
  isSaved: boolean
}