import { ref, reactive, computed } from 'vue'
import { UserFormService } from '../model/user-form-service'
import type { UserFormData, CreateUserFormInput, UserFormState } from '../model/types'

export function useUserForm() {
  const state = reactive<UserFormState>({
    data: {
      name: '',
      email: '',
      message: ''
    },
    errors: {},
    isSubmitting: false,
    isDirty: false
  })

  const savedData = ref<UserFormData | null>(null)

  const isValid = computed(() => {
    const errors = UserFormService.validate(state.data)
    return Object.keys(errors).length === 0
  })

  const loadSavedData = async () => {
    try {
      savedData.value = UserFormService.load()
    } catch (error) {
      console.error('Failed to load saved data:', error)
      savedData.value = null
    }
  }

  const submitForm = async () => {
    state.errors = UserFormService.validate(state.data)
    
    if (!isValid.value) {
      return false
    }

    state.isSubmitting = true
    try {
      const result = UserFormService.save(state.data)
      savedData.value = result
      
      // Reset form
      state.data = {
        name: '',
        email: '',
        message: ''
      }
      state.isDirty = false
      
      return true
    } catch (error) {
      console.error('Failed to save form data:', error)
      return false
    } finally {
      state.isSubmitting = false
    }
  }

  const clearSavedData = async () => {
    try {
      UserFormService.clear()
      savedData.value = null
      return true
    } catch (error) {
      console.error('Failed to clear saved data:', error)
      return false
    }
  }

  const updateField = (field: keyof CreateUserFormInput, value: string) => {
    state.data[field] = value
    state.isDirty = true
    
    // Clear field error when user starts typing
    if (state.errors[field]) {
      delete state.errors[field]
    }
  }

  const validateField = (field: keyof CreateUserFormInput) => {
    const errors = UserFormService.validate(state.data)
    if (errors[field]) {
      state.errors[field] = errors[field]
    } else {
      delete state.errors[field]
    }
  }

  return {
    state,
    savedData,
    isValid,
    loadSavedData,
    submitForm,
    clearSavedData,
    updateField,
    validateField
  }
}