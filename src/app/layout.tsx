import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Onionlabel.ai | Shaping the Future of AI",
  description: "Onionlabel connects the world's top AI professionals with leading AI labs and enterprises. Find top-tier, remote AI roles.",
  icons: {
    icon: "/iconmark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col font-sans select-none">{children}</body>
    </html>
  );
}

