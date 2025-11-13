"use client";

import { useState } from "react";
import HabitForm from "@/components/habitForm";
import HabitCard from "@/components/habitCard";
import { useHabitsStore } from "@/context/useHabitsStore";

export default function HabitDashboard() {
  const { habits, addHabit, deleteHabit } = useHabitsStore();
  const [addHabitFormOpen, setAddHabitFormOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-serif">Habit Dashboard</h1>
          <p className="mt-2 text-sm sm:text-base">
            Here’s where you’ll track and manage your habits.
          </p>
        </div>

        <button
          className="shrink-0 rounded-lg bg-sky-3 text-light px-6 py-3 hover:bg-sky-6 transition-colors"
          onClick={() => setAddHabitFormOpen(true)}
        >
          Add New Habit
        </button>
      </div>

      <div className="grid gap-4 py-4 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((h) => (
          <HabitCard key={h.id} habit={h} onDelete={(id) => deleteHabit(id)} />
        ))}
      </div>

      {/* Modal form */}
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
    </div>
  );
}
