import Image from "next/image";
import type { ImageAsset } from "@/content";
import { cx } from "@/lib/cx";

type AvatarStackProps = {
  avatars: ImageAsset[];
  /** Rendered diameter in px. */
  size?: number;
  /** Ring color matches the section background so the overlap reads as a cut-out. */
  ring?: "light-yellow" | "yellow";
  className?: string;
};

const rings = {
  "light-yellow": "border-background-light-yellow",
  yellow: "border-secondary-yellow",
} as const;

export function AvatarStack({
  avatars,
  size = 32,
  ring = "light-yellow",
  className,
}: AvatarStackProps) {
  return (
    <ul className={cx("flex items-center", className)} aria-label="Learners">
      {avatars.map((avatar, index) => (
        <li key={avatar.src} className={cx(index > 0 && "-ml-2")}>
          <Image
            src={avatar.src}
            alt={avatar.alt}
            width={size}
            height={size}
            sizes={`${size}px`}
            className={cx("rounded-full border-2 bg-primary-blue-light object-cover", rings[ring])}
            style={{ width: size, height: size }}
          />
        </li>
      ))}
    </ul>
  );
}
