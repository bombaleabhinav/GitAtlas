import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitAtlas",
  description: "Visualize GitHub commit history as an interactive flow of checkpoints.",
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
