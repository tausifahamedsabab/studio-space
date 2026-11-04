export class ApiError extends Error {
  status: number
  fieldErrors?: Record<string, string>

  constructor(
    message: string,
    status = 500,
    fieldErrors?: Record<string, string>
  ) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function errorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return "Something went wrong. Please try again."
}
