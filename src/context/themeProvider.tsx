// src/context/ThemeProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "lattivo-theme";

function applyThemeClass(mode: ThemeMode) {
  if (typeof document === "undefined") return;

  // 🌐 Put the class on <html> so it wraps the whole app
  const root = document.documentElement;
  root.classList.remove("theme-light", "theme-dark");
  root.classList.add(`theme-${mode}`);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");

  // Initialize from localStorage or system preference
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const systemPrefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initial: ThemeMode = stored ?? (systemPrefersDark ? "dark" : "light");

    setThemeState(initial);
    applyThemeClass(initial);
  }, []);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, mode);
    }
    applyThemeClass(mode);
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within <ThemeProvider>");
  }
  return ctx;
}
