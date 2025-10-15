export type IntervalType = 'day' | 'week' | 'month';

export enum ScheduleType {
  SpecificDays = 'specific-days',   // e.g., Mon/Wed/Fri
  Interval = 'interval',            // e.g., every 2 days
  Rolling = 'rolling',              // e.g., every 3 days since last completion
  FlexibleWindow = 'flexible-window', // e.g., "3x per week, anytime"
}

// Specific days of the week schedule
export type SpecificDaysSchedule = {
  type: 'specific-days';
  daysOfWeek: number[]; // required
};

// Rolling schedule (every X days since last completion, on every 3rd day)
export type RollingSchedule = {
  type: 'rolling';
  intervalType: IntervalType
  intervalQuantity: number;
  resetOnMiss: boolean; // if true, missing a day resets the schedule
};

// Flexible window (X completions per window, e.g., 3x per week)
export type FlexibleWindowSchedule = {
  type: 'flexible-window';
  windowLength: number;
  intervalType: IntervalType; 
  resetOnMiss: boolean; // if true, missing the target resets the schedule
};

// Union type of all schedules
export type HabitSchedule =
  | SpecificDaysSchedule
  | RollingSchedule
  | FlexibleWindowSchedule;