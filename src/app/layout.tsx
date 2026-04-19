import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexttask.ai | Shaping the Future of AI",
  description: "Nexttask connects the world's top AI professionals with leading AI labs and enterprises. Find top-tier, remote AI roles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased font-manrope`}
    >
      <body className="min-h-full flex flex-col font-manrope">{children}</body>
    </html>
  );
}
