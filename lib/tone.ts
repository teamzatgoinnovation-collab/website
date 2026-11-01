/** Brand colour tones for page heroes, card accents and icon chips (CSS classes `tone-<name>` in globals.css). */
export const TONES = ["blue", "violet", "teal", "amber", "cyan", "rose"] as const;
export type Tone = (typeof TONES)[number];
export const toneAt = (i: number): Tone => TONES[((i % TONES.length) + TONES.length) % TONES.length];
