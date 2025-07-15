import { localStorageService } from '../../../shared/lib/storage'
import type { SettingsData } from './types'

export class SettingsService {
  private readonly STORAGE_KEY = 'settings'

  getDefaultSettings(): SettingsData {
    return {
      dailyGoal: 20, // デフォルト：一日20本
      monthlyBudgetGoal: 15000 // デフォルト：一ヶ月15,000円
    }
  }

  saveSettings(settings: SettingsData): void {
    localStorageService.set(this.STORAGE_KEY, settings)
  }

  loadSettings(): SettingsData {
    const savedSettings = localStorageService.get<SettingsData>(this.STORAGE_KEY)
    return savedSettings || this.getDefaultSettings()
  }

  clearSettings(): void {
    localStorageService.remove(this.STORAGE_KEY)
  }

  validateSettings(settings: Partial<SettingsData>): Partial<Record<keyof SettingsData, string>> {
    const errors: Partial<Record<keyof SettingsData, string>> = {}

    if (settings.dailyGoal !== undefined) {
      if (settings.dailyGoal <= 0) {
        errors.dailyGoal = '一日の目標本数は1本以上で入力してください'
      } else if (settings.dailyGoal > 100) {
        errors.dailyGoal = '一日の目標本数は100本以下で入力してください'
      }
    }

    if (settings.monthlyBudgetGoal !== undefined) {
      if (settings.monthlyBudgetGoal <= 0) {
        errors.monthlyBudgetGoal = '月間予算は1円以上で入力してください'
      } else if (settings.monthlyBudgetGoal > 1000000) {
        errors.monthlyBudgetGoal = '月間予算は100万円以下で入力してください'
      }
    }

    return errors
  }
}

export const settingsService = new SettingsService()