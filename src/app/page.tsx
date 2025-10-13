'use client';

import { useState, useEffect } from 'react';
import { ThemeToggle } from "../components/themeToggle";

import Link from 'next/link';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.remove('theme-light');
      root.classList.add('theme-dark');
    } else {
      root.classList.remove('theme-dark');
      root.classList.add('theme-light');
    }
  }, [theme]);

  return (
<main className="min-h-screen font-sans px-6 py-10 flex flex-col gap-6 transition-colors duration-300 bg-background text-primary">
  {/* if the colors break all  of a sudden switch to bg-[var(--color-background) for bg- and text-primary] */}
      <ThemeToggle theme={theme} setTheme={setTheme} />

      {/* Title Section */}
      <section className="text-center">
        <h1 className="text-4xl font-serif tracking-tight text-primary">
          Welcome to Lattivo 🌱
        </h1>
        <p className="text-lg mt-2 text-primary">
          Your personal performance dashboard for habit tracking, time management, and growth.
        </p>
      </section>

            
        <Link
  href="/habitDashboard"
  className="max-w-md mx-auto block rounded-lg bg-sky-3 text-light px-6 py-4 text-center hover:bg-sky-6 transition-colors"
>
  Go to Habit Dashboard
</Link>

       
    </main>
  );
}
