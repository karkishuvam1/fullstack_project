export function isEmailValid(email) {
  // Good enough for client-side checking — the backend should still
  // validate/verify the email properly.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Scores a password from 0-4 based on simple rules and returns a
// human-readable label. Used for the live strength meter on Register.
export function getPasswordStrength(password) {
  if (!password) {
    return { label: "", score: 0 };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Weak", score };
  if (score <= 3) return { label: "Medium", score };
  return { label: "Strong", score };
}