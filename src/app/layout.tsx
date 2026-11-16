import type { Metadata, Viewport } from "next";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { inter, jakarta } from "@/lib/fonts";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const title = "Luma — Build skills that actually move you forward";
const description =
  "Practical courses taught by people who do the work every day. Learn design, technology, business and more — one focused lesson at a time.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "Luma",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Luma",
    title,
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#3157f6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-primary-blue px-4 py-3 text-sm font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
        >
          Skip to content
        </a>
        {children}
        <SmoothScroll />
      </body>
    </html>
  );
}
