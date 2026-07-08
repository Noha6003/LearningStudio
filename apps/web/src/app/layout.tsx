import type { Metadata } from "next";
import "./globals.css";
import { ThemeModeProvider } from "@/components/providers/theme-mode-provider";
import { SessionProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "LearningMa | The Operating System for Education",
  description: "An AI-powered, highly gamified and professional online learning platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <ThemeModeProvider>
            {children}
          </ThemeModeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
