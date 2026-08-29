/**
 * Live password strength calculator
 * Returns { score: 0..4, label: 'Weak' | 'Fair' | 'Good' | 'Strong' }
 */
export function getPasswordStrength(password = "") {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const labels = ["Weak", "Weak", "Fair", "Good", "Strong"];
  return {
    score,
    label: labels[score] || "Weak",
  };
}

export function isValidEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone = "") {
  return /^[+()0-9\s-]{6,20}$/.test(phone);
}