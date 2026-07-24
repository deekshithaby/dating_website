/**
 * Normalizes Indian mobile input to E.164 (+91…).
 * UI often collects 10 digits; user may paste a value that already includes +91.
 */
export function formatIndiaE164(phoneNumber: string): string {
  const trimmed = phoneNumber.trim();
  if (trimmed.startsWith('+91')) {
    return trimmed;
  }
  return `+91${trimmed}`;
}
