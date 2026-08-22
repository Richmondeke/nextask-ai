import type { Metadata } from "next";
import "./globals.css";

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
      className="h-full antialiased font-sans"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700,800,900&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans select-none" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

