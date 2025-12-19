import type { FormData, ValidationResult, ValidationError } from "./types";

// ==============================================
// VALIDATION RULES
// ==============================================

const PHONE_REGEX = /^[\d\s+\-().]{7,20}$/;

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 100;
const MIN_SCHOOL_LENGTH = 3;
const MAX_SCHOOL_LENGTH = 150;

// ==============================================
// FIELD VALIDATORS
// ==============================================

function validateFullName(name: string): string | null {
  const trimmed = name.trim();

  if (!trimmed) {
    return "Full name is required";
  }

  if (trimmed.length < MIN_NAME_LENGTH) {
    return `Name must be at least ${MIN_NAME_LENGTH} characters`;
  }

  if (trimmed.length > MAX_NAME_LENGTH) {
    return `Name must be less than ${MAX_NAME_LENGTH} characters`;
  }

  return null;
}

function validatePhone(phone: string): string | null {
  const trimmed = phone.trim();

  if (!trimmed) {
    return "Phone number is required";
  }

  if (!PHONE_REGEX.test(trimmed)) {
    return "Please enter a valid phone number";
  }

  return null;
}

function validateSchool(school: string): string | null {
  const trimmed = school.trim();

  if (!trimmed) {
    return "School name is required";
  }

  if (trimmed.length < MIN_SCHOOL_LENGTH) {
    return `School name must be at least ${MIN_SCHOOL_LENGTH} characters`;
  }

  if (trimmed.length > MAX_SCHOOL_LENGTH) {
    return `School name must be less than ${MAX_SCHOOL_LENGTH} characters`;
  }

  return null;
}

// ==============================================
// MAIN VALIDATION FUNCTIONS
// ==============================================

/**
 * Validates entire form
 * @returns ValidationResult with isValid and errors array
 */
export function validateForm(data: FormData): ValidationResult {
  const errors: ValidationError[] = [];

  const nameError = validateFullName(data.fullName);
  if (nameError) {
    errors.push({ field: "fullName", message: nameError });
  }

  const phoneError = validatePhone(data.phone);
  if (phoneError) {
    errors.push({ field: "phone", message: phoneError });
  }

  const schoolError = validateSchool(data.school);
  if (schoolError) {
    errors.push({ field: "school", message: schoolError });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a single field (for real-time validation)
 * @returns Error message or null if valid
 */
export function validateField(
  field: keyof FormData,
  value: string
): string | null {
  switch (field) {
    case "fullName":
      return validateFullName(value);
    case "phone":
      return validatePhone(value);
    case "school":
      return validateSchool(value);
    default:
      return null;
  }
}
