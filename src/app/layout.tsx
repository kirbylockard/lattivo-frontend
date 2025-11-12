// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { HabitsProvider } from "@/context/useHabitsStore";
import Header from "@/components/header";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lattivo | Habit Tracker",
  description:
    "Your personal performance dashboard for growth and consistency.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--color-background)] text-[var(--color-primary)] transition-colors duration-300`}
      >
        <HabitsProvider>
          <Header />
          <main>{children}</main>
        </HabitsProvider>
      </body>
    </html>
  );
}
