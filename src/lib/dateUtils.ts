import { Habit } from "@/types/habit";
import {
  HabitSchedule,
  SpecificDaysSchedule,
  RollingSchedule,
  FlexibleWindowSchedule,
  IntervalType,
} from "@/types/scheduling";
import { defaultUnits } from "@/types/units";

/* ------------------------------------------------------------- */
/* Number suffix                                                  */
/* ------------------------------------------------------------- */
export const getNumberSuffix = (n: number): string => {
  const suffixes = ["th", "st", "nd", "rd"] as const;
  const v = n % 100;
  return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
};

/* ------------------------------------------------------------- */
/* 📅 Human-friendly schedule helpers                            */
/* ------------------------------------------------------------- */

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function oxfordList(items: string[]) {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function rollingSentence(qty?: number, unit?: IntervalType): string {
  const n = qty && qty > 0 ? qty : 1;
  const u: IntervalType = unit ?? "day";
  return n === 1
    ? `Complete habit every ${u}`
    : `Complete habit every ${n}${getNumberSuffix(n)} ${u}`;
}

export function flexibleSentence(
  windowLength?: number,
  intervalType?: IntervalType
): string {
  const len = Math.max(1, Number(windowLength ?? 1));
  const u: IntervalType = intervalType ?? "day";
  return `Complete habit within ${len} ${u}${len > 1 ? "s" : ""}`;
}

export function specificDaysSentence(days: number[]): string {
  const labels = days
    .slice()
    .sort((a, b) => a - b)
    .map((i) => DAY_LABELS[i] ?? "");
  return labels.length
    ? `Complete habit every ${oxfordList(labels)}`
    : "Complete habit on selected days";
}

/** Turn a HabitSchedule into sentences for UI (typed, no any). */
export function scheduleToSentence(schedule: HabitSchedule): {
  line: string;
  reset?: string;
} {
  switch (schedule.type) {
    case "rolling": {
      const s: RollingSchedule = schedule;
      return {
        line: rollingSentence(s.intervalQuantity, s.intervalType),
        reset: `Resets on miss: ${s.resetOnMiss ? "Yes" : "No"}`,
      };
    }
    case "flexible-window": {
      const s: FlexibleWindowSchedule = schedule;
      return {
        line: flexibleSentence(s.windowLength, s.intervalType),
        reset: `Resets on miss: ${s.resetOnMiss ? "Yes" : "No"}`,
      };
    }
    case "specific-days": {
      const s: SpecificDaysSchedule = schedule;
      return { line: specificDaysSentence(s.daysOfWeek) };
    }
  }
}

/* ------------------------------------------------------------- */
/* 🔤 Format helpers                                             */
/* ------------------------------------------------------------- */

export function formatDate(d?: Date | string | null) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function resolveUnitLabel(habit: Habit) {
  if (habit.unit.isCustom && habit.unit.customLabel)
    return habit.unit.customLabel;
  const def = defaultUnits.find((u) => u.key === habit.unit.unitKey);
  return def?.label ?? habit.unit.unitKey;
}
