import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CollabLocal - Hyper-Local Influencer Marketplace",
  description:
    "Connect local brands with nano and micro creators in your city. Escrow-protected deals, verified profiles, and real growth opportunities.",
  keywords: [
    "influencer marketing",
    "local creators",
    "brand collaborations",
    "nano influencers",
    "micro influencers",
  ],
  authors: [{ name: "CollabLocal" }],
  creator: "CollabLocal",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://collablocal.com",
    siteName: "CollabLocal",
    title: "CollabLocal - Hyper-Local Influencer Marketplace",
    description:
      "Connect local brands with nano and micro creators in your city.",
    images: [
      {
        url: "https://collablocal.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CollabLocal",
    description: "Hyper-Local Influencer Marketplace",
    creator: "@collablocal",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
