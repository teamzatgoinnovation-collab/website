/** The creation steps shown in the hero slideshow. Titles and captions are editable per language; screenshots are uploaded in the admin. */
export const SPACE_STEP_COUNT = 3;

export type SpaceStep = { n: number; title: string; caption: string; image: string | null };

/**
 * Builds the slides from the editable texts and uploaded images. A slide appears when it has a title; its picture is optional,
 * so a step without an uploaded screenshot is shown as a plain numbered card rather than with an invented image.
 */
export function buildSteps(t: (key: string) => string, images: Record<string, string | undefined>): SpaceStep[] {
  const steps: SpaceStep[] = [];
  for (let n = 1; n <= SPACE_STEP_COUNT; n++) {
    const title = t(`spaceStep${n}Title`).trim();
    if (!title) continue;
    steps.push({ n, title, caption: t(`spaceStep${n}Caption`).trim(), image: images[`spaceStep${n}Image`] ?? null });
  }
  return steps;
}
