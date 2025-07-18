export enum HabitLogStatus {
    InProgress = 'in-progress',
    Completed = 'completed',
    Partial = 'partial',
    Missed = 'missed',
    Skipped = 'skipped'
}

export type HabitLog = {
    id: string
    habitId: string
    date: Date
    status: HabitLogStatus
    value?: number; // if 'quantity' or 'duration'
    note?: string;  // optional user comment
}