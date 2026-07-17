import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "The New Quechua Collection - SS25 Lookbook",
  description:
    "Feel alive in every footstep. Discover the new Quechua SS25 hiking collection — jackets, shoes and backpacks crafted in the heart of the French Alps.",
  metadataBase: new URL("https://quechua-lookbook.com"),
  icons: {
    icon: [
      { url: "/seo/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/seo/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/seo/apple-touch-icon.png",
  },
  openGraph: {
    title: "The New Quechua Collection - SS25 Lookbook",
    description: "Feel alive in every footstep.",
    images: ["/seo/og.jpg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-cream text-charcoal">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
