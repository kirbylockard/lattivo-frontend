import { HabitUnit } from "./units";
import { HabitSchedule } from "./scheduling";


export type Habit = {
  id: string;
  name: string;
  creationDate: Date;
  endDate?: Date | null;
  isActive: boolean;
  unit: HabitUnit;
  targetValue: number;
  schedule: HabitSchedule;
  notes?: string;
  color?: string;
  streakCount: number;
  longestStreak: number;
  lastCompletionDate?: Date | null;
  nextDueDate?: Date | null;
  isArchived: boolean;
  tags?: string[];
};

//omit id and date on creation to be created server-side
export type HabitCreate = Omit<Habit, 'id' | 'creationDate'>;
export type HabitUpdate = Partial<HabitCreate>;