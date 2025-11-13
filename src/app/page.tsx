// src/app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl sm:text-5xl font-serif mb-4">
        Welcome to Lattivo
      </h1>

      <p className="text-primary/80 max-w-xl mb-8 text-base sm:text-lg">
        A personal habit tracker to help you stay consistent and grow—one day at a time.
      </p>

      <Link
        href="/habits"
        className="rounded-lg bg-sky-3 text-light px-6 py-3 text-sm sm:text-base hover:bg-sky-6 transition-colors"
      >
        Go to Habit Dashboard
      </Link>
    </div>
  );
}
