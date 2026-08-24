/** Normalize phone to digits only (US-friendly). Keeps last 10 when longer. */
export function normalizePhone(input?: string | null): string | null {
  if (!input) return null;
  const digits = input.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  if (digits.length > 10) return digits.slice(-10);
  return digits;
}

export function phonesMatch(a?: string | null, b?: string | null): boolean {
  const na = normalizePhone(a);
  const nb = normalizePhone(b);
  if (!na || !nb) return false;
  return na === nb;
}

export function emailsMatch(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function namesMatch(
  aFirst: string,
  aLast: string,
  bFirst: string,
  bLast: string,
): boolean {
  return (
    aFirst.trim().toLowerCase() === bFirst.trim().toLowerCase() &&
    aLast.trim().toLowerCase() === bLast.trim().toLowerCase() &&
    aFirst.trim().length > 0
  );
}

export function formatPhoneDisplay(input?: string | null): string {
  const n = normalizePhone(input);
  if (!n) return input?.trim() || "—";
  if (n.length === 10) {
    return `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}`;
  }
  return input?.trim() || n;
}
