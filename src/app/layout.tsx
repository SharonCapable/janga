import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Janga — Autonomous Video Generation",
  description: "Generate and post high-retention faceless videos to TikTok and YouTube on autopilot.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-background text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
