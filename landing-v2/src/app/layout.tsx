import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Аренда туристического снаряжения — Ташкент",
  description:
    "Снаряжение для гор, которое не нужно покупать. Оплата только при получении — палатки, спальные мешки, рюкзаки и треккинговые палки в аренду в Ташкенте.",
  metadataBase: new URL("https://quechua-lookbook.com"),
  icons: {
    icon: [
      { url: "/seo/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/seo/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/seo/apple-touch-icon.png",
  },
  openGraph: {
    title: "Аренда туристического снаряжения — Ташкент",
    description: "Снаряжение для гор, которое не нужно покупать.",
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
    <html lang="ru" className={`h-full antialiased ${inter.variable}`}>
      <body className="min-h-full bg-cream text-charcoal">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
