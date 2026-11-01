import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import type { Tone } from "@/lib/tone";

type CompanyPageShellProps = {
  eyebrow: string;
  heading: string;
  description?: string;
  tone?: Tone;
  icon?: LucideIcon;
  icons?: LucideIcon[];
  image?: string;
  /** Closing call-to-action band (off for legal pages). */
  cta?: boolean;
  children: ReactNode;
};

export async function CompanyPageShell({ eyebrow, heading, description, tone, icon, icons, image, cta = true, children }: CompanyPageShellProps) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={heading} description={description} tone={tone} icon={icon} icons={icons} image={image} />
      <div className="mx-auto max-w-6xl px-5 py-8 md:py-10">{children}</div>
      {cta ? <CtaBand /> : null}
    </>
  );
}
