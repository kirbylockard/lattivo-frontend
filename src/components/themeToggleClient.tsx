// src/components/ThemeToggleClient.tsx
"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/themeToggle";

export default function ThemeToggleClient() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // hydrate from localStorage
  useEffect(() => {
    const stored = (localStorage.getItem("theme") as "light" | "dark" | null) ?? "light";
    setTheme(stored);
  }, []);

  // write to DOM + localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return <ThemeToggle theme={theme} setTheme={setTheme} />;
}
