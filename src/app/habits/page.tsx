"use client";
import { useState } from "react";
import HabitForm from "@/components/habitForm";
import { useHabitsStore } from "@/context/useHabitsStore"; // ✅ import store

export default function HabitDashboard() {
  const { addHabit } = useHabitsStore();  // ✅ get from context
  const [addHabitFormOpen, setAddHabitFormOpen] = useState(false);

  return (
    <main className="min-h-screen px-6 py-10 bg-background text-primary">
      <h1 className="text-3xl font-serif">Habit Dashboard</h1>
      <p className="mt-2">Here’s where you’ll track and manage your habits.</p>

      <button
        className="max-w-md mx-auto rounded-lg bg-sky-3 text-light px-6 py-4 hover:bg-sky-6 transition-colors"
        onClick={() => setAddHabitFormOpen(!addHabitFormOpen)}
      >
        Add New Habit
      </button>

      {addHabitFormOpen && (
        <HabitForm
          mode="create"
          onCancel={() => setAddHabitFormOpen(false)}
          onSave={(habit) => {
            addHabit(habit);
            setAddHabitFormOpen(false);
          }}
        />
      )}
    </main>
  );
}
