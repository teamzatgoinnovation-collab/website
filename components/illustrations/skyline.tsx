/** Soft city skyline that sits along the bottom edge of the hero. */
export function Skyline({ className }: { className?: string }) {
  const b = [
    [0, 60, 34], [34, 96, 28], [62, 74, 30], [92, 130, 24], [116, 88, 34], [150, 150, 22], [172, 104, 30], [202, 70, 36],
    [238, 118, 26], [264, 168, 20], [284, 92, 34], [318, 126, 28], [346, 78, 32], [378, 110, 30], [408, 64, 36], [444, 138, 24],
  ];
  return (
    <svg viewBox="0 0 470 180" className={className} aria-hidden preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="sky-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2952E3" stopOpacity="0.28" />
          <stop offset="1" stopColor="#16B8E8" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {b.map(([x, h, w], i) => (
        <g key={i}>
          <rect x={x} y={180 - h} width={w} height={h} fill="url(#sky-a)" />
          {i % 3 === 0 ? <rect x={x + w / 2 - 1} y={180 - h - 18} width="2" height="18" fill="#2952E3" opacity="0.2" /> : null}
        </g>
      ))}
    </svg>
  );
}
