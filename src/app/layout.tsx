import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Git Name Generator",
  description: "AIでブランチ名とコミットメッセージを簡単生成",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "AI Git Name Generator",
    description: "AIでブランチ名とコミットメッセージを簡単生成",
    url: "https://ai-git-name-generator.vercel.app/",
    siteName: "AI Git Name Generator",
    images: [
      {
        url: "https://ai-git-name-generator.vercel.app/favicon.png",
        width: 1200,
        height: 630,
        alt: "AI Git Name Generator",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Git Name Generator",
    description: "AIでブランチ名とコミットメッセージを簡単生成",
    images: ["https://ai-git-name-generator.vercel.app/favicon.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
