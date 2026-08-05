/**
 * Masks an email for the "we sent a code to …" line: `sarah@gmail.com` → `s•••@gmail.com`.
 * Anything that isn't a plausible address comes back as a generic stand-in rather than
 * leaking a half-typed value onto the screen.
 */
export function maskEmail(email: string): string {
  const at = email.indexOf('@');
  if (at < 1 || at === email.length - 1) return 'your email address';

  const local = email.slice(0, at);
  const domain = email.slice(at);
  return `${local[0]}•••${domain}`;
}
