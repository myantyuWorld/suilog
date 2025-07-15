import { reactive, computed } from 'vue'
import { settingsService } from '../model/settings-service'
import type { SettingsData, SettingsState } from '../model/types'

export function useSettings() {
  const state = reactive<SettingsState>({
    data: settingsService.loadSettings(),
    errors: {},
    isLoading: false,
    isSaved: false
  })

  const savedData = computed(() => {
    const saved = settingsService.loadSettings()
    return saved
  })

  const updateField = <K extends keyof SettingsData>(field: K, value: SettingsData[K]) => {
    state.data[field] = value
    
    // リアルタイムバリデーション
    const fieldErrors = settingsService.validateSettings({ [field]: value })
    if (fieldErrors[field]) {
      state.errors[field] = fieldErrors[field]
    } else {
      delete state.errors[field]
    }
    
    state.isSaved = false
  }

  const handleSubmit = async () => {
    state.isLoading = true
    state.errors = {}

    // 全体バリデーション
    const validationErrors = settingsService.validateSettings(state.data)
    
    if (Object.keys(validationErrors).length > 0) {
      state.errors = validationErrors
      state.isLoading = false
      return
    }

    try {
      // 設定を保存
      settingsService.saveSettings(state.data)
      state.isSaved = true
      
      // 成功メッセージを一定時間後に非表示
      setTimeout(() => {
        state.isSaved = false
      }, 3000)
      
    } catch (error) {
      console.error('Settings save error:', error)
    } finally {
      state.isLoading = false
    }
  }

  const resetToDefaults = () => {
    state.data = settingsService.getDefaultSettings()
    state.errors = {}
    state.isSaved = false
  }

  const clearData = () => {
    settingsService.clearSettings()
    state.data = settingsService.getDefaultSettings()
    state.errors = {}
    state.isSaved = false
  }

  return {
    state,
    savedData,
    updateField,
    handleSubmit,
    resetToDefaults,
    clearData
  }
}