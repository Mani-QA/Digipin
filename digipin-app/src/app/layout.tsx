import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DIGIPIN Generator - Create and Share Location Pins",
  description: "Generate unique DIGIPINs for any location in India. Share locations easily with custom named DIGIPINs.",
  keywords: "DIGIPIN, location, coordinates, India Post, location sharing, map pin",
  openGraph: {
    title: "DIGIPIN Generator - Create and Share Location Pins",
    description: "Generate unique DIGIPINs for any location in India. Share locations easily with custom named DIGIPINs.",
    url: "https://digipin.link",
    siteName: "DIGIPIN Generator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DIGIPIN Generator - Create and Share Location Pins",
    description: "Generate unique DIGIPINs for any location in India. Share locations easily with custom named DIGIPINs.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
