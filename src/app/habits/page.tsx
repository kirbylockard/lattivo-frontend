// app/habits/page.tsx
"use client";

import { useEffect, useState } from "react";
import HabitForm from "@/components/habitForm";
import HabitCard from "@/components/habitCard";
import { Habit, HabitCreate, HabitUpdate } from "@/types/habit";
import {
  fetchHabitsForUser,
  createHabitForUser,
  deleteHabitById,
  updateHabitById,
} from "@/lib/habitsApi";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function HabitDashboard() {
  const [userId, setUserId] = useState<string | null>(null);

  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addHabitFormOpen, setAddHabitFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Load Supabase user + habits
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const supabase = getSupabaseBrowserClient();

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) {
          if (!cancelled) {
            setError("Not logged in");
          }
          return;
        }

        const uid = user.id;
        if (!cancelled) {
          setUserId(uid);
        }

        const data = await fetchHabitsForUser(uid);
        if (!cancelled) {
          setHabits(data);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error("Failed to load habits", err);
          setError(err.message ?? "Failed to load habits");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // Handlers
  const handleCreateHabit = async (habitData: HabitCreate) => {
    if (!userId) return;

    try {
      const created = await createHabitForUser(habitData);
      setHabits((prev) => [...prev, created]);
      setAddHabitFormOpen(false);
    } catch (err: any) {
      console.error("Failed to create habit", err);
      alert(err.message ?? "Failed to create habit");
    }
  };

  const handleDeleteHabit = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this habit?"
    );
    if (!confirmDelete) return;

    try {
      await deleteHabitById(id);
      setHabits((prev) => prev.filter((h) => h.id !== id));
    } catch (err: any) {
      console.error("Failed to delete habit", err);
      alert(err.message ?? "Failed to delete habit");
    }
  };

  const handleUpdateHabit = async (id: string, update: HabitUpdate) => {
    try {
      const updated = await updateHabitById(id, update);
      setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
      setEditingHabit(null);
    } catch (err: any) {
      console.error("Failed to update habit", err);
      alert(err.message ?? "Failed to update habit");
    }
  };

  // Render
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
          className="shrink-0 rounded-lg bg-sky-3 text-light px-6 py-3 hover:bg-sky-6 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={() => {
            setEditingHabit(null);
            setAddHabitFormOpen(true);
          }}
          disabled={!userId}
        >
          Add New Habit
        </button>
      </div>

      {loading && <p>Loading habits…</p>}
      {error && <p className="text-error text-sm mt-2">{error}</p>}

      <div className="grid gap-4 py-4 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((h) => (
          <HabitCard
            key={h.id}
            habit={h}
            onDelete={(id) => handleDeleteHabit(id)}
            onEdit={(habit) => {
              setAddHabitFormOpen(false);
              setEditingHabit(habit);
            }}
          />
        ))}
      </div>

      {/* Create modal */}
      {addHabitFormOpen && userId && !editingHabit && (
        <HabitForm
          mode="create"
          userId={userId}
          onCancel={() => setAddHabitFormOpen(false)}
          onSave={(payload) => handleCreateHabit(payload as HabitCreate)}
        />
      )}

      {editingHabit && userId && (
        <HabitForm
          mode="edit"
          initialData={editingHabit}
          userId={userId}
          onCancel={() => setEditingHabit(null)}
          onSave={(payload) =>
            handleUpdateHabit(editingHabit.id, payload as HabitUpdate)
          }
        />
      )}
    </div>
  );
}
