import type { Channel } from "@/content/products";

export function getProductImage(slug: string): string {
  return `/images/products/${slug}.svg`;
}

export function getChannelImage(channel: Channel): string {
  return `/images/channels/${channel}.svg`;
}
