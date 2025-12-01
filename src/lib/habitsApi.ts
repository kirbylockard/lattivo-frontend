// src/lib/habitsApi.ts
import { apiFetch } from "@/lib/apiClient";
import { Habit, HabitCreate, HabitUpdate } from "@/types/habit";

// Adjust this if your router is mounted as /api/habits instead:
const HABITS_PREFIX = "/habits";

// Shape of what FastAPI returns (from HabitRead / HabitList)
type HabitApiPayload = {
  id: string;
  userId: string;
  name: string;
  unit: Habit["unit"];
  targetValue: number;
  schedule: Habit["schedule"];
  notes?: string | null;
  color?: string | null;
  isActive: boolean;
  isArchived: boolean;
  endDate?: string | null;
  tags?: string[] | null;
  creationDate: string;
  updatedAt: string;
};

type HabitListResponse = {
  items: HabitApiPayload[];
};

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

function mapHabitFromApi(h: HabitApiPayload): Habit {
  return {
    id: h.id,
    userId: h.userId,
    name: h.name,
    unit: h.unit,
    targetValue: h.targetValue,
    schedule: h.schedule,
    notes: h.notes ?? undefined,
    color: h.color ?? undefined,
    isActive: h.isActive,
    isArchived: h.isArchived,
    endDate: h.endDate ? new Date(h.endDate) : null,
    tags: h.tags ?? undefined,
    creationDate: new Date(h.creationDate),
  };
}

// We only send what the backend knows about; strip any frontend-only fields
function mapHabitCreateToApi(h: HabitCreate) {
  return {
    userId: h.userId,
    name: h.name,
    unit: h.unit,
    targetValue: h.targetValue,
    schedule: h.schedule,
    notes: h.notes ?? null,
    color: h.color ?? null,
    isActive: h.isActive,
    isArchived: h.isArchived,
    endDate: h.endDate ? h.endDate.toISOString().slice(0, 10) : null, // YYYY-MM-DD
    tags: h.tags ?? null,
  };
}

function mapHabitUpdateToApi(update: HabitUpdate) {
  const body: any = {};

  if (update.name !== undefined) body.name = update.name;
  if (update.unit !== undefined) body.unit = update.unit;
  if (update.schedule !== undefined) body.schedule = update.schedule;
  if (update.notes !== undefined) body.notes = update.notes;
  if (update.color !== undefined) body.color = update.color;
  if (update.targetValue !== undefined) body.targetValue = update.targetValue;
  if (update.isActive !== undefined) body.isActive = update.isActive;
  if (update.isArchived !== undefined) body.isArchived = update.isArchived;
  if (update.endDate !== undefined)
    body.endDate = update.endDate
      ? update.endDate.toISOString().slice(0, 10)
      : null;
  if (update.tags !== undefined) body.tags = update.tags;

  return body;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function fetchHabitsForUser(userId: string): Promise<Habit[]> {
  const res = await apiFetch<HabitListResponse>(
    `${HABITS_PREFIX}?userId=${encodeURIComponent(userId)}`
  );
  return res.items.map(mapHabitFromApi);
}

export async function createHabitForUser(habit: HabitCreate): Promise<Habit> {
  const payload = mapHabitCreateToApi(habit);
  const res = await apiFetch<HabitApiPayload>(`${HABITS_PREFIX}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return mapHabitFromApi(res);
}

export async function updateHabitById(
  id: string,
  update: HabitUpdate
): Promise<Habit> {
  const payload = mapHabitUpdateToApi(update);
  const res = await apiFetch<HabitApiPayload>(`${HABITS_PREFIX}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return mapHabitFromApi(res);
}

export async function deleteHabitById(id: string): Promise<void> {
  await apiFetch<undefined>(`${HABITS_PREFIX}/${id}`, {
    method: "DELETE",
  });
}
