import { AppleIPhoneFrame } from "./iphone-frame";
import { BrowserFrame } from "./macbook-frame";
import { ScreenshotSlot } from "./screenshot-slot";

export function ProductDesktopPreview({ src, name, url = "zatgoinnovation.com", className }: { src: string; name: string; url?: string; className?: string }) {
  return (
    <BrowserFrame url={url} className={className}>
      <ScreenshotSlot src={src} alt={`${name} desktop`} />
    </BrowserFrame>
  );
}

export function ProductMobilePreview({ src, name, className }: { src: string; name: string; className?: string }) {
  return (
    <AppleIPhoneFrame className={className}>
      <ScreenshotSlot src={src} alt={`${name} mobile`} />
    </AppleIPhoneFrame>
  );
}
