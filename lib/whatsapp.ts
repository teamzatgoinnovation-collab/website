/** Builds a click-to-chat link (wa.me) for a phone number. Returns null when there is no usable number, so callers can skip the button. */
export function waLink(number: string | undefined | null, text?: string): string | null {
  const digits = (number ?? "").replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
