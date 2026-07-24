/**
 * 🔒 VALIDATION HELPERS FOR REACT NATIVE APP
 * Email, Mobile, Password, Name validation
 */

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

// ✅ EMAIL VALIDATION
export const validateEmail = (email: string): ValidationResult => {
  if (!email || typeof email !== "string") {
    return { valid: false, message: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { valid: false, message: "Please enter a valid email address" };
  }

  if (email.length > 254) {
    return { valid: false, message: "Email is too long" };
  }

  return { valid: true };
};

// ✅ MOBILE VALIDATION
export const validateMobile = (mobile: string): ValidationResult => {
  if (!mobile || typeof mobile !== "string") {
    return { valid: false, message: "Mobile number is required" };
  }

  // Remove all non-numeric characters for length check
  const cleanMobile = mobile.replace(/\D/g, "");

  if (cleanMobile.length < 10) {
    return {
      valid: false,
      message: "Mobile number must be at least 10 digits",
    };
  }

  if (cleanMobile.length > 15) {
    return { valid: false, message: "Mobile number must not exceed 15 digits" };
  }

  // Allow digits, +, -, (, ), and spaces
  const mobileRegex = /^[0-9+\-\(\)\s]{10,15}$/;
  if (!mobileRegex.test(mobile)) {
    return {
      valid: false,
      message: "Mobile number contains invalid characters",
    };
  }

  return { valid: true };
};

// ✅ NAME VALIDATION
export const validateName = (name: string): ValidationResult => {
  if (!name || typeof name !== "string") {
    return { valid: false, message: "Name is required" };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return { valid: false, message: "Name must be at least 2 characters" };
  }

  if (trimmedName.length > 50) {
    return { valid: false, message: "Name must not exceed 50 characters" };
  }

  // Only letters and spaces allowed
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(trimmedName)) {
    return {
      valid: false,
      message: "Name can only contain letters and spaces",
    };
  }

  return { valid: true };
};

// ✅ PASSWORD VALIDATION
export const validatePassword = (password: string): ValidationResult => {
  if (!password || typeof password !== "string") {
    return { valid: false, message: "Password is required" };
  }

  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }

  if (password.length > 50) {
    return { valid: false, message: "Password must not exceed 50 characters" };
  }

  return { valid: true };
};

// ✅ PASSWORD STRENGTH CHECK
export interface PasswordStrength {
  score: number; // 0-4
  strength: "weak" | "fair" | "good" | "strong";
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  suggestions: string[];
}

export const checkPasswordStrength = (password: string): PasswordStrength => {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&]/.test(password);

  let score = 0;
  const suggestions: string[] = [];

  if (hasUppercase) score++;
  else suggestions.push("Add uppercase letters (A-Z)");

  if (hasLowercase) score++;
  else suggestions.push("Add lowercase letters (a-z)");

  if (hasNumber) score++;
  else suggestions.push("Add numbers (0-9)");

  if (hasSpecial) score++;
  else suggestions.push("Add special characters (@$!%*?&)");

  let strength: "weak" | "fair" | "good" | "strong" = "weak";
  if (score === 2) strength = "fair";
  else if (score === 3) strength = "good";
  else if (score === 4) strength = "strong";

  return {
    score,
    strength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
    suggestions,
  };
};

// ✅ CONFIRM PASSWORD VALIDATION
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): ValidationResult => {
  if (!confirmPassword || typeof confirmPassword !== "string") {
    return { valid: false, message: "Please confirm your password" };
  }

  if (password !== confirmPassword) {
    return { valid: false, message: "Passwords do not match" };
  }

  return { valid: true };
};

// ✅ LOGIN INPUT VALIDATION (Email OR Mobile)
export const validateLoginInput = (input: string): ValidationResult => {
  if (!input || typeof input !== "string") {
    return { valid: false, message: "Email or mobile is required" };
  }

  const isEmail = input.includes("@");

  if (isEmail) {
    return validateEmail(input);
  } else {
    return validateMobile(input);
  }
};

// ✅ COMPANY ID VALIDATION (Optional)
export const validateCompanyId = (
  companyId: string | null,
): ValidationResult => {
  if (!companyId) {
    return { valid: true }; // Optional field
  }

  if (typeof companyId !== "string") {
    return { valid: false, message: "Invalid company ID format" };
  }

  const id = parseInt(companyId, 10);

  if (isNaN(id) || id <= 0) {
    return { valid: false, message: "Company ID must be a valid number" };
  }

  return { valid: true };
};

// ✅ FORM VALIDATION HELPER
export interface SignupFormData {
  name: string;
  emailOrMobile: string;
  password: string;
  confirmPassword: string;
  companyId?: string;
}

export const validateSignupForm = (data: SignupFormData): ValidationResult => {
  // Validate name
  const nameValidation = validateName(data.name);
  if (!nameValidation.valid) {
    return nameValidation;
  }

  // Validate email/mobile
  const loginValidation = validateLoginInput(data.emailOrMobile);
  if (!loginValidation.valid) {
    return loginValidation;
  }

  // Validate password
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }

  // Validate confirm password
  const confirmValidation = validateConfirmPassword(
    data.password,
    data.confirmPassword,
  );
  if (!confirmValidation.valid) {
    return confirmValidation;
  }

  // Validate company ID if provided
  const companyValidation = validateCompanyId(data.companyId || null);
  if (!companyValidation.valid) {
    return companyValidation;
  }

  return { valid: true };
};

// ✅ LOGIN FORM VALIDATION
export interface LoginFormData {
  login: string;
  password: string;
}

export const validateLoginForm = (data: LoginFormData): ValidationResult => {
  // Validate login input
  const loginValidation = validateLoginInput(data.login);
  if (!loginValidation.valid) {
    return loginValidation;
  }

  // Validate password
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }

  return { valid: true };
};
