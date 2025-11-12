// src/components/Header.tsx
import Link from "next/link";
import UserMenu from "@/components/userMenu"; // server component
import ThemeToggleClient from "@/components/themeToggleClient"; // client wrapper

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--color-foreground2)] text-[var(--color-primary)] shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* 🪶 Logo / App Name */}
        <Link
          href="/"
          className="font-serif text-2xl font-semibold tracking-wide hover:text-[var(--color-accent)] transition-colors"
        >
          Lattivo
        </Link>

        {/* 🌗 Theme + User Menu */}
        <div className="flex items-center gap-4">
          <ThemeToggleClient />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
