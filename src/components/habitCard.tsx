"use client";

import { Habit } from "@/types/habit";
import { useMemo } from "react";
import {
  scheduleToSentence,
  resolveUnitLabel,
  formatDate,
} from "@/lib/dateUtils";

type HabitCardProps = {
  habit: Habit;
  onEdit?: (habit: Habit) => void;
  onDelete?: (id: string) => void;
  onComplete?: (id: string) => void;
};

export default function HabitCard({
  habit,
  onEdit,
  onDelete,
  onComplete,
}: HabitCardProps) {
  const unitLabel = useMemo(() => resolveUnitLabel(habit), [habit]);
  const { line: scheduleLine, reset: resetLine } = useMemo(
    () => scheduleToSentence(habit.schedule),
    [habit.schedule]
  );

  return (
    <article
      className="rounded-xl shadow-sm border border-foreground3/50 bg-foreground2 text-dark overflow-hidden"
      aria-label={`Habit card for ${habit.name}`}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-foreground3/40">
        <div className="flex items-center gap-3 min-w-0">
          {/* Color swatch (falls back to theme if missing) */}
          <span
            className="inline-block w-4 h-4 rounded-full ring-2 ring-woodland/20 shrink-0"
            style={{ backgroundColor: habit.color || "#D13E78" }}
            aria-hidden="true"
          />
          <h3 className="font-semibold truncate">{habit.name}</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onComplete?.(habit.id)}
            className="px-3 py-1 rounded bg-fern-6 text-light hover:opacity-95 transition"
            title="Mark as complete"
          >
            Complete
          </button>
          <button
            type="button"
            onClick={() => onEdit?.(habit)}
            className="px-3 py-1 rounded bg-sky-6 text-light hover:opacity-95 transition"
            title="Edit habit"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(habit.id)}
            className="px-3 py-1 rounded bg-ember text-light hover:opacity-95 transition"
            title="Delete habit"
          >
            Delete
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="px-4 py-4 grid gap-3">
        {/* Target + Unit */}
        <div className="flex items-baseline gap-2">
          <span className="text-sm opacity-80">Target:</span>
          <span className="text-lg font-medium">
            {habit.targetValue} {unitLabel}
          </span>
        </div>

        {/* Schedule sentence */}
        <div className="space-y-1">
          <div className="text-sm opacity-80">Schedule:</div>
          <div className="text-base">{scheduleLine}</div>
          {resetLine && <div className="text-sm opacity-80">{resetLine}</div>}
        </div>

        {/* Will reincorporate streaks when logging habits is figured out */}
        {/* Dates */}
        {/* <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-0.5">
            <div className="opacity-80">Next due</div>
            <div className="font-medium">{formatDate(habit.nextDueDate)}</div>
          </div>
          <div className="space-y-0.5">
            <div className="opacity-80">Last completion</div>
            <div className="font-medium">
              {formatDate(habit.lastCompletionDate)}
            </div>
          </div>
        </div> */}

        {/* Streaks */}
        {/* <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-0.5">
            <div className="opacity-80">Current streak</div>
            <div className="font-medium">{habit.streakCount ?? 0}</div>
          </div>
          <div className="space-y-0.5">
            <div className="opacity-80">Best streak</div>
            <div className="font-medium">{habit.longestStreak ?? 0}</div>
          </div>
        </div> */}

        {/* Tags */}
        {!!habit.tags?.length && (
          <div className="flex flex-wrap gap-2 mt-1">
            {habit.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full text-xs bg-foreground1"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Notes */}
        {habit.notes && habit.notes.trim() && (
          <div className="mt-1">
            <div className="text-sm opacity-80 mb-1">Notes</div>
            <p className="whitespace-pre-wrap">{habit.notes}</p>
          </div>
        )}
      </div>

      {/* Footer / status */}
      <footer className="px-4 py-3 bg-foreground3/30 text-sm flex items-center justify-between">
        <div className="opacity-80">
          {habit.isActive ? "Active" : "Inactive"}{" "}
          {habit.isArchived ? "(Archived)" : ""}
        </div>
        {habit.unit.isCustom && habit.unit.customLabel && (
          <div className="opacity-80">
            Custom unit: {habit.unit.customLabel}
          </div>
        )}
      </footer>
    </article>
  );
}
