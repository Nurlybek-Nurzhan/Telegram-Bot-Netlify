// ==============================================
// TYPE DEFINITIONS - Premium Request Form
// ==============================================

/**
 * Form data structure
 */
export interface FormData {
  fullName: string;
  phone: string;
  school: string;
}

/**
 * Validation error for a single field
 */
export interface ValidationError {
  field: keyof FormData;
  message: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * API Response from serverless function
 */
export interface ApiResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Form element references
 */
export interface FormElements {
  form: HTMLFormElement;
  submitBtn: HTMLButtonElement;
  statusDiv: HTMLElement;
  inputs: {
    fullName: HTMLInputElement;
    phone: HTMLInputElement;
    school: HTMLInputElement;
  };
  errors: {
    fullName: HTMLElement;
    phone: HTMLElement;
    school: HTMLElement;
  };
}
