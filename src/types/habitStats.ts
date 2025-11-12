//(derived state; not user-editable)
export type HabitStats = {
  habitId: string;
  userId: string;

  streakCount: number;
  longestStreak: number;

  lastCompletionDate?: Date | null;
  nextDueDate?: Date | null;

  // (optional) convenience rollups:
  completionsThisWeek?: number;
  completionsThisMonth?: number;
};

