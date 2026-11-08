/** The creation steps shown in the hero slideshow. Titles and captions are editable per language; screenshots are uploaded in the admin. */
export const SPACE_STEP_COUNT = 3;

export type SpaceStep = {
  /** Unique within the slideshow. For a step it is the step number; a video slide's number is not shown. */
  n: number;
  kind: "step" | "video";
  title: string;
  caption: string;
  image: string | null;
  /** YouTube video id of a video slide. */
  video: string | null;
};

/** A YouTube id is 11 characters of letters, digits, `-` and `_`; anything else is never put into an embed URL. */
export function isYouTubeId(id: string): boolean {
  return /^[A-Za-z0-9_-]{11}$/.test(id);
}

/**
 * Builds the slides from the editable texts and uploaded images. A slide appears when it has a title; its picture is optional,
 * so a step without an uploaded screenshot is shown as a plain numbered card rather than with an invented image.
 */
export function buildSteps(
  t: (key: string) => string,
  images: Record<string, string | undefined>,
  videos: ReadonlyArray<{ id: string }> = [],
): SpaceStep[] {
  const steps: SpaceStep[] = [];
  // Videos come first; the numbered steps follow unchanged.
  videos.filter((v) => isYouTubeId(v.id)).forEach((v, i) => {
    steps.push({ n: -(i + 1), kind: "video", title: t("spaceVideoTitle").trim(), caption: t("spaceVideoCaption").trim(), image: null, video: v.id });
  });
  for (let n = 1; n <= SPACE_STEP_COUNT; n++) {
    const title = t(`spaceStep${n}Title`).trim();
    if (!title) continue;
    steps.push({ n, kind: "step", title, caption: t(`spaceStep${n}Caption`).trim(), image: images[`spaceStep${n}Image`] ?? null, video: null });
  }
  return steps;
}
