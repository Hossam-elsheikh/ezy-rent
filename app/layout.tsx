import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { LanguageProvider } from "@/context/language-context";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "EzyRent – Find Your Perfect Rental",
  description: "Browse, search and rent units across countries, cities and districts. EzyRent makes finding your next home effortless.",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased text-gray-900 dark:text-gray-100`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <Suspense>
              {children}
            </Suspense>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
