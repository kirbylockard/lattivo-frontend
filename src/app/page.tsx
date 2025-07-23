'use client';

import { useState, useEffect } from 'react';
import { ThemeToggle } from "../components/themeToggle";
import AddHabitForm from '../components/addHabitForm';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [addHabitFormOpen, setAddHabitFormOpen] = useState(false);

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
      <section className="text-center text-primary">
        <h1 className="text-4xl font-serif tracking-tight">
          Welcome to Lattivo 🌱
        </h1>
        <p className="text-lg mt-2">
          Your personal performance dashboard for habit tracking, time management, and growth.
        </p>
      </section>

      {/* Highlight Section */}
      <section className="max-w-md mx-auto rounded-lg p-6 shadow-md text-dark bg-foreground1">
        <h2 className="text-xl font-semibold mb-3">Today's Focus</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>🌿 Complete your morning routine</li>
          <li>📊 Log your working hours</li>
          <li>🧠 Review habit streak progress</li>
        </ul>
      </section>

      {/* Habit Grid Demo */}
      <section className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
        {['hibiscus', 'fern', 'plum', 'sky', 'ochre', 'terracotta'].map((color) => (
          <div key={color} className={`p-4 rounded-lg text-center bg-${color}-7 text-light`}>
            {`${color.charAt(0).toUpperCase() + color.slice(1)} Streak`}
          </div>
        ))}
      </section>

            
        <button className="max-w-md mx-auto rounded-lg bg-sky-3 text-light px-6 py-4 hover:bg-sky-6 transition-colors" onClick={()=>setAddHabitFormOpen(!addHabitFormOpen)}>
          Add New Habit
        </button>

{addHabitFormOpen && (
        <AddHabitForm
          onClose={() => setAddHabitFormOpen(false) }
          onSave={(habit) => {
            console.log('New Habit:', habit);
            setAddHabitFormOpen(false);
          }}
          />
)}
       
    </main>
  );
}
