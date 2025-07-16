
export type GoalType = 'completion' | 'quantity' | 'duration' | 'check-in'

export type Scheduletype = 'daily' | 'weekly' | 'custom'

export type Unit = 'minutes' | 'reps' | 'glasses' | null

export type Frequency = {
    daysOfWeek?: number[]  // 0 (Sun) to 6 (Sat)
    interval?: number      // e.g., every 2 days
    timesPerWeek?: number  // goal e.g., 3x/week
}

export type Habit = {
    id: string;
    name: string
    creationDate: Date
    endDate?: Date | null
    goalType: GoalType
    targetValue?: number | null     //applies to quantity or duration types
    unit: Unit
    frequency: Frequency
    icon: string
    isArchived: boolean
}