import type { ImageAsset } from "./types";

const avatar = (name: string, alt: string): ImageAsset => ({
  src: `/images/avatars/${name}.jpg`,
  alt,
  width: 80,
  height: 80,
});

export const avatars = {
  maya: avatar("maya", "Smiling learner with her hair in a bun"),
  daniel: avatar("daniel", "Learner in a grey sweater"),
  arjun: avatar("arjun", "Learner in a dark suit"),
  sofia: avatar("sofia", "Smiling learner with long dark hair"),
} satisfies Record<string, ImageAsset>;
