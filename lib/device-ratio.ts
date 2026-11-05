/** Shape rules for the phone mockup: the screen follows the screenshot's own shape within realistic limits. */
export const PHONE_RATIO_MIN = 9 / 21; // tallest modern phones
export const PHONE_RATIO_MAX = 9 / 16; // widest we draw before it stops looking like a phone
export const PHONE_RATIO_DEFAULT = 9 / 20;

/** Screen width/height for a screenshot of the given size; unknown or broken sizes fall back to the default. */
export function phoneRatio(width?: number | null, height?: number | null): number {
  if (!width || !height || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return PHONE_RATIO_DEFAULT;
  return Math.min(PHONE_RATIO_MAX, Math.max(PHONE_RATIO_MIN, width / height));
}

/** True when covering the screen would cut real content, so the whole image should be shown instead. */
export function needsContain(screenRatio: number, imageRatio: number, tolerance = 0.03): boolean {
  return Math.abs(imageRatio / screenRatio - 1) > tolerance;
}
