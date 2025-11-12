export enum HabitLogStatus {
  InProgress = "in-progress",
  Completed = "completed",
  Partial = "partial",
  Missed = "missed",
  Skipped = "skipped",
}

export type HabitLog = {
  id: string;
  habitId: string;
  userId: string; // include for RLS and owner checks
  date: Date; // when it “counts” toward schedule (not just createdAt)
  status: HabitLogStatus;
  value?: number; // if 'quantity' or 'duration'
  note?: string; // optional user comment
  createdAt: Date;
};
