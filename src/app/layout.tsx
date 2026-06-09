import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumi — The Ultimate AI Co-Pilot for Windows",
  description:
    "Lumi is a fully local, always-on AI voice assistant for Windows. GPU-accelerated, entirely private, and unrestricted. Zero friction. Just talk.",
  keywords: [
    "AI voice assistant",
    "Windows AI",
    "local AI",
    "voice control",
    "privacy",
    "GPU accelerated",
    "speech to text",
    "Lumi",
  ],
  openGraph: {
    title: "Lumi — The Ultimate AI Co-Pilot for Windows",
    description:
      "A fully local, always-on AI voice assistant. GPU-accelerated, entirely private, and unrestricted.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumi — The Ultimate AI Co-Pilot for Windows",
    description:
      "A fully local, always-on AI voice assistant. GPU-accelerated, entirely private, and unrestricted.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
