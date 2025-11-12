import { HabitUnit } from "./units";
import { HabitSchedule } from "./scheduling";
import { HabitStats } from "./habitStats";

export type Habit = {
  id: string;
  userId: string; // add owner at the type level to match DB & RLS
  name: string;
  creationDate: Date;
  endDate?: Date | null;
  isActive: boolean;
  unit: HabitUnit;
  targetValue: number;
  schedule: HabitSchedule;
  notes?: string;
  color?: string;
  isArchived: boolean;
  tags?: string[];
};

//omit id and date on creation to be created server-side
export type HabitCreate = Omit<Habit, "id" | "creationDate">;
export type HabitUpdate = Partial<HabitCreate>;

// Convenience composite type returned by API for dashboards
export type HabitWithStats = Habit & { stats: HabitStats };