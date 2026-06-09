import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumi — The Open-Source, Integrated Windows AI",
  description:
    "Lumi is a minimalist, responsive AI voice assistant that understands, thinks, and responds directly from your screen. Built by developers, for developers. Fully local, always-on, GPU-accelerated.",
  keywords: [
    "AI voice assistant",
    "Windows AI",
    "local AI",
    "voice control",
    "privacy",
    "GPU accelerated",
    "speech to text",
    "Lumi",
    "open source",
    "developer tools",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/logo-icon.png",
  },
  openGraph: {
    title: "Lumi — The Open-Source, Integrated Windows AI",
    description:
      "A minimalist, responsive assistant that understands, thinks, and responds directly from your screen. Built by developers, for developers.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumi — The Open-Source, Integrated Windows AI",
    description:
      "A minimalist, responsive assistant that understands, thinks, and responds directly from your screen. Built by developers, for developers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
