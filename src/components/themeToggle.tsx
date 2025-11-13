// src/components/themeToggle.tsx
"use client";

import { useTheme } from "@/context/themeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="bg-[var(--color-clay)] text-[var(--color-light)] px-4 py-2 rounded font-semibold inline-flex items-center gap-2 transition-colors duration-200 hover:bg-[color-mix(in_lab,var(--color-clay)_80%,black)]"
    >
      {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </button>
  );
}
