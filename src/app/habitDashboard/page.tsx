"use client";
import { useState } from 'react';
import AddHabitForm from './addHabitForm';

export default function HabitDashboard() {

    const [addHabitFormOpen, setAddHabitFormOpen] = useState(false);
    
  return (
    <main className="min-h-screen px-6 py-10 bg-background text-primary">
      <h1 className="text-3xl font-serif">Habit Dashboard</h1>
      <p className="mt-2">Here’s where you’ll track and manage your habits.</p>

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