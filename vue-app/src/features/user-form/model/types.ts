export interface UserFormData {
  name: string
  email: string
  message: string
  createdAt: Date
}

export interface CreateUserFormInput {
  name: string
  email: string
  message: string
}

export interface UserFormValidationErrors {
  name?: string
  email?: string
  message?: string
}

export interface UserFormState {
  data: CreateUserFormInput
  errors: UserFormValidationErrors
  isSubmitting: boolean
  isDirty: boolean
}