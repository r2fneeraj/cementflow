/**
 * Validates Indian vehicle registration number format.
 * Examples of valid numbers:
 * MH18FG1234, MH16AB4521, MH12CD7890, DL01AB1234, GJ06BB5678, HR26DQ5551
 * Accepts with or without spaces/hyphens and standardizes to uppercase.
 */
export function validateIndianTruckNumber(input: string): { isValid: boolean; formatted: string; error?: string } {
  if (!input || !input.trim()) {
    return { isValid: false, formatted: '', error: 'Truck number is required' };
  }

  // Remove spaces, hyphens, and dots, then uppercase
  const cleaned = input.replace(/[\s\-\.]/g, '').toUpperCase();

  // Pattern 1: Standard Indian Registration (e.g., MH18FG1234, MH04A1234, DL1C1234, KA011234)
  const standardPattern = /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{1,4}$/;

  // Pattern 2: Bharat (BH) series (e.g., 22BH1234AA)
  const bhPattern = /^[0-9]{2}BH[0-9]{4}[A-Z]{1,2}$/;

  if (standardPattern.test(cleaned) || bhPattern.test(cleaned)) {
    return { isValid: true, formatted: cleaned };
  }

  return {
    isValid: false,
    formatted: cleaned,
    error: 'Enter a valid vehicle number (e.g., MH18FG1234)',
  };
}

export function validatePhoneNumber(phone: string): { isValid: boolean; error?: string } {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }
  const digitsOnly = phone.replace(/[\s\-\+\(\)]/g, '');
  if (/^[6-9]\d{9}$/.test(digitsOnly) || digitsOnly.length === 10) {
    return { isValid: true };
  }
  return { isValid: false, error: 'Enter a valid 10-digit mobile number' };
}
