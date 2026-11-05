/**
 * Homepage section data. English copy; other locales fall back to it until translated.
 */
export type Accent = "primary" | "cyan" | "teal" | "purple";

export const whyTiles: { icon: string; title: string; body: string }[] = [
  { icon: "Layers", title: "Cross-platform software", body: "Web, desktop and mobile clients on one backend." },
  { icon: "Download", title: "Downloadable applications", body: "Installers and APKs from our download center." },
  { icon: "Cloud", title: "Cloud or on-premise", body: "Host it with us or run it on your own servers." },
  { icon: "WifiOff", title: "Offline where supported", body: "Selected mobile apps keep working without a connection." },
  { icon: "Plug", title: "API integrations", body: "A documented API for connecting other systems." },
  { icon: "ShieldCheck", title: "Enterprise security", body: "Role-based access and server-side validation." },
];
