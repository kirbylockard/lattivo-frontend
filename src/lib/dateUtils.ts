import { Habit } from "@/types/habit";
import { defaultUnits, UnitCategory } from "@/types/units";

//calculating next due date or streak calculaltions
export const getNumberSuffix = (n: number): string => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/* ------------------------------------------------------------- */
/* 📅 Human-friendly schedule helpers                            */
/* ------------------------------------------------------------- */

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function oxfordList(items: string[]) {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function rollingSentence(qty?: number, unit?: "day" | "week" | "month") {
  const n = qty && qty > 0 ? qty : 1;
  const u = unit ?? "day";
  return n === 1
    ? `Complete habit every ${u}`
    : `Complete habit every ${n}${getNumberSuffix(n)} ${u}`;
}
/** Support both shapes of “flexible” from your project history:
 *  - old: { occurrencesPerWindow: number; intervalDays: number; resetOnMiss: boolean }
 *  - new: { windowLength: number; intervalType: 'day'|'week'|'month'; resetOnMiss: boolean }
 */
export function flexibleSentence(schedule: any) {
  // New shape first
  if ("windowLength" in schedule) {
    const len = Math.max(1, Number(schedule.windowLength ?? 1));
    const u = (schedule.intervalType ?? "day") as "day" | "week" | "month";
    return `Complete habit within ${len} ${u}${len > 1 ? "s" : ""}`;
  }
  // Old shape fallback
  if ("intervalDays" in schedule) {
    const len = Math.max(1, Number(schedule.intervalDays ?? 1));
    // Express in days (you can later convert 7→week, 30→month if you want)
    return `Complete habit within ${len} day${len > 1 ? "s" : ""}`;
  }
  return "Complete within set window";
}

export function specificDaysSentence(days: number[]) {
  const labels = days
    .slice()
    .sort((a, b) => a - b)
    .map((i) => DAY_LABELS[i] ?? "");
  return labels.length
    ? `Complete habit every ${oxfordList(labels)}`
    : "Complete habit on selected days";
}

export function scheduleToSentence(schedule: Habit["schedule"] | any): {
  line: string;
  reset?: string;
} {
  if (schedule?.type === "rolling") {
    return {
      line: rollingSentence(schedule.intervalQuantity, schedule.intervalType),
      reset: `Resets on miss: ${schedule.resetOnMiss ? "Yes" : "No"}`,
    };
  }
  if (schedule?.type === "flexible-window") {
    const line = flexibleSentence(schedule);
    const reset = `Resets on miss: ${schedule.resetOnMiss ? "Yes" : "No"}`;
    return { line, reset };
  }
  // specific-days
  return {
    line: specificDaysSentence(schedule?.daysOfWeek ?? []),
  };
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
  // If custom, prefer customLabel; else look up default label
  if (habit.unit.isCustom && habit.unit.customLabel)
    return habit.unit.customLabel;
  const def = defaultUnits.find((u) => u.key === habit.unit.unitKey);
  return def?.label ?? habit.unit.unitKey;
}