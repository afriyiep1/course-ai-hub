import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Course AI Hub",
  description: "Course-grounded student learning support and a private TA copilot.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
