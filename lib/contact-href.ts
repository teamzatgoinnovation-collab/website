/** Build `/contact` deep links that prefill the demo form. */
export function contactHref(opts?: {
  type?: string;
  interest?: string;
  tier?: string;
}): string {
  const params = new URLSearchParams();
  if (opts?.type) params.set("type", opts.type);
  if (opts?.interest) params.set("interest", opts.interest);
  if (opts?.tier) params.set("tier", opts.tier);
  const qs = params.toString();
  return qs ? `/contact?${qs}` : "/contact";
}
