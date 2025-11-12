// src/app/login/page.tsx
import { Suspense } from "react";
import LoginClient from "./loginClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background text-primary">
          <p>Loading…</p>
        </main>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
