import type { Metadata, Viewport } from "next";
import "./globals.css";

// Separate viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "V-bot",
  description: "V-bot | Personalised Learning for Everyone",
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
