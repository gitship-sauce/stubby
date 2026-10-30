import type { Metadata, Viewport } from "next";
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
  title: "Stubby: long link in, short link out",
  description: "A link shortener that gets broken by famous real failures, then fixed, on Gitship Sauce.",
  // What a chat app or social site shows when someone shares Stubby's home page.
  openGraph: {
    title: "Stubby: long link in, short link out",
    description: "A link shortener that gets broken by famous real failures, then fixed, on Gitship Sauce.",
    siteName: "Stubby",
    type: "website",
  },
};

// Phone browsers tint their bars with the page colour (--color-paper in globals.css).
export const viewport: Viewport = { themeColor: "#fff6e9" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
