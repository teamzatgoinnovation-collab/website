/** Decorative hub: ZatGo at the centre, planned integrations around it. CSS-only animation. */
export function IntegrationHub({ names, centerLabel, plannedLabel }: { names: string[]; centerLabel: string; plannedLabel: string }) {
  const cx = 300;
  const cy = 190;
  const rx = 205;
  const ry = 135;
  const nodes = names.map((name, i) => {
    const a = (i / names.length) * Math.PI * 2 - Math.PI / 2;
    return { name, x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
  });
  return (
    <svg viewBox="0 0 600 380" role="img" aria-label={`${centerLabel}: ${names.join(", ")} (${plannedLabel})`} className="mx-auto h-auto w-full max-w-2xl">
      {nodes.map((n) => (
        <line key={n.name} x1={cx} y1={cy} x2={n.x} y2={n.y} className="zg-flow" stroke="var(--m-cyan)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      ))}
      <circle cx={cx} cy={cy} r="38" fill="var(--m-accent)" />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--m-accent-foreground)">ZatGo</text>
      {nodes.map((n) => (
        <g key={n.name}>
          <rect x={n.x - 58} y={n.y - 14} width="116" height="28" rx="14" fill="var(--m-surface-elevated)" stroke="var(--m-line)" strokeDasharray="3 3" />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--m-ink)">{n.name.length > 21 ? `${n.name.slice(0, 20)}…` : n.name}</text>
        </g>
      ))}
    </svg>
  );
}
