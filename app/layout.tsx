import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navbar";
import { MenuProvider } from "@/components/menu-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DazzledFangs | Tooth Gems",
  description: "Premium tooth gems and grill designs by DazzledFangs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-screen antialiased`}
    >
      <head>
        {/* Preload mobile hero image */}
        <link rel="preload" as="image" href="/hero-mobile.webp" media="(max-width: 767px)" />
        {/* Preload desktop hero image */}
        <link rel="preload" as="image" href="/hero-desktop.webp" media="(min-width: 768px)" />
      </head>
      <body className="flex flex-col min-h-screen">
        <MenuProvider>
          <NavBar />
          {children}
        </MenuProvider>
      </body>
    </html>
  );
}
