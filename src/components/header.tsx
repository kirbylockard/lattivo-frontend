// src/components/header.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./themeToggle";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHabits = pathname.startsWith("/habits");

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // 🔐 Load current user + subscribe to auth changes
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let isMounted = true;

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!isMounted) return;
        setUserEmail(data.user?.email ?? null);
      })
      .finally(() => {
        if (isMounted) setLoadingUser(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return;
        setUserEmail(session?.user?.email ?? null);
      }
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUserEmail(null);
    router.push("/login");
  };

  // 🧩 Derive username + initial from email
  const username =
    userEmail?.split("@")[0] && userEmail.split("@")[0].length > 0
      ? userEmail.split("@")[0]
      : null;

  const initial = username ? username[0].toUpperCase() : null;

  return (
    <header className="border-b border-foreground1/40 bg-foreground2/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
        {/* Left: Logo / App name */}
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-serif tracking-wide">Lattivo</span>
          <span className="text-xs uppercase tracking-[0.15em] opacity-80">
            Habit Tracker
          </span>
        </Link>

        {/* Middle: nav */}
        <nav className="hidden sm:flex items-center gap-4 text-sm">
          <Link
            href="/"
            className={`hover:underline underline-offset-4 ${
              pathname === "/" ? "font-semibold" : ""
            }`}
          >
            Landing
          </Link>
          <Link
            href="/habits"
            className={`hover:underline underline-offset-4 ${
              isHabits ? "font-semibold" : ""
            }`}
          >
            Habits
          </Link>
        </nav>

        {/* Right: theme + user area */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Only show user badge if logged in */}
          {!loadingUser && userEmail && username && initial && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm bg-foreground1 px-3 py-1.5 rounded-full">
                <span className="w-6 h-6 rounded-full bg-clay text-light text-[10px] flex items-center justify-center">
                  {initial}
                </span>
                <span className="hidden sm:inline">{username}</span>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-foreground1/60 hover:bg-foreground1/60 transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
