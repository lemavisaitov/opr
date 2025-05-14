import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
  },
  title: "SyberSniffer.",
  description: "Service for checking files for malware.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${pixelifySans.className} min-h-screen antialiased flex flex-col items-center justify-center  select-none`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
