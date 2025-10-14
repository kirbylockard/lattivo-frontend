'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Habit, HabitCreate } from '@/types/habit';

type HabitsContextType = {
  habits: Habit[];
  addHabit: (habitData: HabitCreate) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  getHabitById: (id: string) => Habit | undefined;
};

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export const HabitsProvider = ({ children }: { children: ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  const addHabit = (habitData: HabitCreate) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      creationDate: new Date(),
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const getHabitById = (id: string) => habits.find((h) => h.id === id);

  return (
    <HabitsContext.Provider
      value={{ habits, addHabit, updateHabit, deleteHabit, getHabitById }}
    >
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabitsStore = (): HabitsContextType => {
  const context = useContext(HabitsContext);
  if (!context) throw new Error('useHabitsStore must be used within a HabitsProvider');
  return context;
};