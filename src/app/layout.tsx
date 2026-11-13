import type { Metadata, Viewport } from "next";
import { inter, jakarta } from "@/lib/fonts";
import "./globals.css";

const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
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
      <body>{children}</body>
    </html>
  );
}
