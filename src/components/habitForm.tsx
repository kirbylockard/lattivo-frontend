"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HabitCreate, Habit, HabitUpdate } from "@/types/habit";
import { UnitCategory, defaultUnits } from "@/types/units";
import {
  rollingSentence,
  flexibleSentence,
  specificDaysSentence,
  scheduleToSentence,
} from "@/lib/dateUtils";

/* -------------------------------------------------------------------------- */
/* 🧩 Zod Schemas                                                             */
/* -------------------------------------------------------------------------- */

const customScheduleSchema = z
  .object({
    type: z.enum(["specific-days", "rolling", "flexible-window"]),
  })
  .and(
    z.union([
      z.object({
        type: z.literal("specific-days"),
        daysOfWeek: z
          .array(z.number().min(0).max(6))
          .min(1, "Select at least one day"),
      }),
      z.object({
        type: z.literal("rolling"),
        intervalType: z.enum(["day", "week", "month"]),
        intervalQuantity: z
          .number({ error: "Enter a number" })
          .min(1, "Interval quantity must be at least 1"),
        resetOnMiss: z.boolean(),
      }),
      z.object({
        type: z.literal("flexible-window"),
        windowLength: z
          .number({ error: "Enter a number" })
          .min(1, "Window length must be at least 1"),
        intervalType: z.enum(["day", "week", "month"]),
        resetOnMiss: z.boolean(),
      }),
    ])
  );

const habitSchema = z.object({
  name: z.string().min(1, "Name is required"),
  notes: z.string().optional(),
  color: z.string().optional(),

  // 🔁 Flattened unit fields (no nested object in schema)
  unitKey: z.string().min(1, "Please select a unit of measure"),
  unitIsCustom: z.boolean().optional(),

  // ✅ Accept null from API / DB in edit mode
  unitCustomLabel: z.string().nullable().optional(),

  unitAllowsDecimal: z.boolean().optional(),
  unitCategory: z.string().optional(),

  targetValue: z
    .number({ error: "Enter a number" })
    .min(1, "Target value must be positive"),
  schedule: customScheduleSchema,
  tags: z.array(z.string()).optional(),
});

type HabitFormData = z.infer<typeof habitSchema>;

/* -------------------------------------------------------------------------- */
/* 🪄 Props                                                                    */
/* -------------------------------------------------------------------------- */

type HabitFormProps = {
  mode: "create" | "edit";
  initialData?: Habit;
  userId: string;
  onSave: (payload: HabitCreate | HabitUpdate) => void;
  onCancel: () => void;
};

/* -------------------------------------------------------------------------- */
/* 🎨 Color Swatches                                                           */
/* -------------------------------------------------------------------------- */

const colorOptions = [
  { name: "Hibiscus", class: "bg-hibiscus-7", value: "#D13E78" },
  { name: "Ochre", class: "bg-ochre-7", value: "#D9A72D" },
  { name: "Terracotta", class: "bg-terracotta-7", value: "#B54E37" },
  { name: "Sky", class: "bg-sky-7", value: "#4D87C2" },
  { name: "Fern", class: "bg-fern-7", value: "#4A8C4D" },
  { name: "Plum", class: "bg-plum-7", value: "#874C78" },
];

export default function HabitForm({
  mode,
  initialData,
  userId,
  onSave,
  onCancel,
}: HabitFormProps) {
  const [step, setStep] = useState(1);

  const initialSpecificDays =
    initialData?.schedule.type === "specific-days"
      ? (initialData.schedule.daysOfWeek as number[])
      : [];

  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(initialSpecificDays);

  const methods = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    shouldUnregister: false,
    defaultValues: initialData
      ? {
          name: initialData.name,
          notes: initialData.notes ?? "",
          color: initialData.color ?? colorOptions[0].value,

          // 🔁 Flattened unit defaults from Habit.unit
          unitKey: initialData.unit.unitKey,
          unitIsCustom: initialData.unit.isCustom,
          unitCustomLabel: initialData.unit.customLabel ?? undefined,
          unitAllowsDecimal: initialData.unit.allowsDecimal,
          unitCategory: initialData.unit.category,

          targetValue: initialData.targetValue,
          schedule: initialData.schedule as any,
          tags: initialData.tags ?? [],
        }
      : {
          name: "",
          notes: "",
          tags: [],
          unitKey: "",
          unitIsCustom: false,
          unitCategory: undefined,
          targetValue: 1,
          schedule: {
            type: "rolling",
            intervalType: "day",
            intervalQuantity: 1,
            resetOnMiss: false,
          },
          color: colorOptions[0].value,
        },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const selectedSchedule = watch("schedule.type");

  /* ------------------------------------------------------------------------ */
  /* 🧠 Helpers                                                               */
  /* ------------------------------------------------------------------------ */

  const toggleDay = (day: number) => {
    const updated = daysOfWeek.includes(day)
      ? daysOfWeek.filter((d) => d !== day)
      : [...daysOfWeek, day];

    setDaysOfWeek(updated);
    setValue(
      "schedule",
      { type: "specific-days", daysOfWeek: updated },
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const handleScheduleTypeChange = (t: HabitFormData["schedule"]["type"]) => {
    if (t === "rolling") {
      setValue(
        "schedule",
        {
          type: "rolling",
          intervalType: "day",
          intervalQuantity: 1,
          resetOnMiss: false,
        },
        { shouldDirty: true, shouldValidate: true }
      );
    } else if (t === "specific-days") {
      setValue(
        "schedule",
        {
          type: "specific-days",
          daysOfWeek: daysOfWeek.length ? daysOfWeek : [1, 3, 5],
        },
        { shouldDirty: true, shouldValidate: true }
      );
    } else {
      setValue(
        "schedule",
        {
          type: "flexible-window",
          windowLength: 2,
          intervalType: "week",
          resetOnMiss: false,
        },
        { shouldDirty: true, shouldValidate: true }
      );
    }
  };

  const onSubmit = (data: HabitFormData) => {
    // 🔁 Rebuild the nested `unit` object from flattened fields
    const unit = {
      unitKey: data.unitKey,
      isCustom: data.unitIsCustom ?? false,
      // ✅ Normalize null to undefined
      customLabel: data.unitCustomLabel ?? undefined,
      allowsDecimal: data.unitAllowsDecimal,
      category: data.unitCategory as UnitCategory | undefined,
    };

    const base = {
      name: data.name,
      notes: data.notes,
      color: data.color,
      unit,
      targetValue: data.targetValue,
      schedule: data.schedule,
      tags: data.tags && data.tags.length ? data.tags : undefined,
    };

    if (mode === "create") {
      const newHabit: HabitCreate = {
        ...base,
        userId,
        isActive: true,
        endDate: null,
        isArchived: false,
      };
      onSave(newHabit);
    } else {
      const update: HabitUpdate = {
        ...base,
      };
      onSave(update);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* 🧱 Step 1: Details                                                        */
  /* ------------------------------------------------------------------------ */

  const renderDetailsStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-dark">Habit Details</h2>

      <div>
        <label htmlFor="name" className="block text-dark mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Meditate"
          {...register("name")}
          className="w-full p-2 border rounded bg-foreground1 text-dark"
        />
        {errors.name && (
          <p className="text-error text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-dark mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          placeholder="Practice mindfulness with no distractions"
          {...register("notes")}
          className="w-full p-2 border rounded bg-foreground1 text-dark resize-none"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="tags" className="text-dark mb-1 flex items-center">
          Tags
        </label>

        <input
          id="tags"
          type="text"
          placeholder="Health, Wellness"
          onChange={(e) =>
            setValue(
              "tags",
              e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            )
          }
          defaultValue={initialData?.tags?.join(", ") || ""}
          className="w-full p-2 border rounded bg-foreground1 text-dark"
        />
      </div>
    </div>
  );

  /* ------------------------------------------------------------------------ */
  /* 🧱 Step 2: Structure (Units + Target + Schedule)                          */
  /* ------------------------------------------------------------------------ */

  const renderStructureStep = () => {
    const watchedRollingQuantity = watch("schedule.intervalQuantity");
    const watchedRollingType = watch("schedule.intervalType") as
      | "day"
      | "week"
      | "month"
      | undefined;

    const watchFlexibleLength = watch("schedule.windowLength");
    const watchFlexibleType = watch("schedule.intervalType") as
      | "day"
      | "week"
      | "month"
      | undefined;

    const schedule = watch("schedule");

    const rollingLine =
      schedule?.type === "rolling"
        ? rollingSentence(watchedRollingQuantity, watchedRollingType)
        : "";

    const flexibleLine =
      schedule?.type === "flexible-window"
        ? flexibleSentence(watchFlexibleLength, watchFlexibleType)
        : "";

    const specificDaysLine =
      schedule?.type === "specific-days"
        ? specificDaysSentence(daysOfWeek)
        : "";

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-dark">Structure</h2>

        {/* Unit selector (grouped) */}
        <div>
          <label htmlFor="unit" className="block text-dark mb-1">
            Unit of Measure
          </label>
          <select
            id="unit"
            {...register("unitKey", {
              required: true,
              onChange: (e) => {
                const unitKey = e.target.value;
                const def = defaultUnits.find((u) => u.key === unitKey);
                setValue("unitIsCustom", false, { shouldDirty: true });
                setValue("unitAllowsDecimal", def?.allowsDecimal ?? undefined, {
                  shouldDirty: true,
                });
                setValue("unitCategory", def?.category ?? undefined, {
                  shouldDirty: true,
                });
              },
            })}
            className="w-full p-2 border rounded bg-foreground1 text-dark"
          >
            <option value="" disabled hidden>
              Select unit of measure
            </option>

            {Object.values(UnitCategory).map((category) => (
              <optgroup
                key={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)}
              >
                {defaultUnits
                  .filter((u) => u.category === category)
                  .map((u) => (
                    <option key={u.key} value={u.key}>
                      {u.label}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          {errors.unitKey && (
            <p className="text-error text-sm mt-1">{errors.unitKey.message}</p>
          )}
        </div>

        {/* Target value */}
        <div>
          <label htmlFor="targetValue" className="block text-dark mb-1">
            Target Value
          </label>
          <input
            id="targetValue"
            type="number"
            {...register("targetValue", { valueAsNumber: true })}
            className="w-full p-2 border rounded bg-foreground1 text-dark"
          />
        </div>

        {/* Schedule type */}
        <div>
          <label htmlFor="scheduleType" className="block text-dark mb-1">
            Schedule Type
          </label>
          <select
            id="scheduleType"
            {...register("schedule.type", {
              onChange: (e) =>
                handleScheduleTypeChange(
                  e.target.value as HabitFormData["schedule"]["type"]
                ),
            })}
            className="w-full p-2 border rounded bg-foreground1 text-dark"
          >
            <option value="rolling">Rolling</option>
            <option value="specific-days">Specific Days</option>
            <option value="flexible-window">Flexible Window</option>
          </select>
        </div>

        {/* Specific Days */}
        {selectedSchedule === "specific-days" && (
          <div className="space-y-2">
            <label className="block text-dark">Select Days:</label>
            <div className="flex flex-wrap gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={`px-3 py-1 rounded border ${
                      daysOfWeek.includes(i)
                        ? "bg-accent text-light"
                        : "bg-foreground1 text-dark"
                    }`}
                  >
                    {day}
                  </button>
                )
              )}
            </div>

            <div className="text-dark mt-2">{specificDaysLine}</div>
          </div>
        )}

        {/* Rolling */}
        {selectedSchedule === "rolling" && (
          <>
            <div className="space-y-2 flex direction-row justify-between">
              <div className="flex-1 pr-2">
                <label htmlFor="intervalType" className="block text-dark mb-1">
                  Interval Type
                </label>
                <select
                  id="intervalType"
                  {...register("schedule.intervalType")}
                  className="w-full p-2 border rounded bg-foreground1 text-dark"
                >
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                </select>
              </div>

              <div className="flex-1 pl-2">
                <label htmlFor="intervalQty" className="block text-dark mb-1">
                  Interval Quantity
                </label>
                <input
                  id="intervalQty"
                  type="number"
                  placeholder="Interval Quantity"
                  {...register("schedule.intervalQuantity", {
                    valueAsNumber: true,
                  })}
                  className="w-full p-2 border rounded bg-foreground1 text-dark"
                />
              </div>
            </div>

            <label className="inline-flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("schedule.resetOnMiss")}
                className="w-5 h-5 accent-accent rounded-sm border border-woodland focus:ring-2 focus:ring-accent focus:outline-none"
              />
              <span className="text-dark">
                After habit is missed, restart schedule on next completion?
              </span>
            </label>

            <div className="text-dark mt-2">{rollingLine}</div>
          </>
        )}

        {/* Flexible Window */}
        {selectedSchedule === "flexible-window" && (
          <>
            <div className="space-y-2 flex direction-row justify-between">
              <div className="flex-1 pr-2">
                <label htmlFor="windowType" className="block text-dark mb-1">
                  Window Type
                </label>
                <select
                  id="windowType"
                  {...register("schedule.intervalType")}
                  className="w-full p-2 border rounded bg-foreground1 text-dark"
                >
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                </select>
              </div>

              <div className="flex-1 pl-2">
                <label htmlFor="windowLen" className="block text-dark mb-1">
                  Window Length
                </label>
                <input
                  id="windowLen"
                  type="number"
                  {...register("schedule.windowLength", {
                    valueAsNumber: true,
                  })}
                  className="w-full p-2 border rounded bg-foreground1 text-dark"
                />
              </div>
            </div>

            <label className="inline-flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("schedule.resetOnMiss")}
                className="w-5 h-5 accent-accent rounded-sm border border-woodland focus:ring-2 focus:ring-accent focus:outline-none"
              />
              <span className="text-dark">
                After habit is missed, restart schedule on next completion?
              </span>
            </label>

            <div className="text-dark mt-2">{flexibleLine}</div>
          </>
        )}
      </div>
    );
  };

  /* ------------------------------------------------------------------------ */
  /* 🧱 Step 3: Review + Color                                                 */
  /* ------------------------------------------------------------------------ */

  const renderReviewStep = () => {
    const selectedColor = watch("color");
    const values = methods.getValues();
    const { line: sentence, reset } = scheduleToSentence(
      values.schedule as any
    );

    const hasTags = Array.isArray(values.tags) && values.tags.length > 0;
    const hasNotes = !!values.notes?.trim();

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-dark">Color & Review</h2>

        {/* Keep RHF aware of the field */}
        <input type="hidden" {...register("color")} />

        <div>
          <label className="block text-dark mb-1">Choose Color:</label>
          <div className="flex gap-2 flex-wrap">
            {colorOptions.map((c) => {
              const isActive = selectedColor === c.value;
              return (
                <button
                  type="button"
                  key={c.value}
                  onClick={() =>
                    setValue("color", c.value, { shouldDirty: true })
                  }
                  aria-pressed={isActive}
                  aria-label={c.name}
                  title={c.name}
                  className={[
                    "w-8 h-8 rounded-full",
                    isActive
                      ? "border-2 border-dark ring-2 ring-dark/20"
                      : "border border-transparent",
                    c.class,
                    "transition-shadow focus:outline-none focus:ring-2 focus:ring-accent/60",
                  ].join(" ")}
                />
              );
            })}
          </div>
        </div>

        {/* Preview */}
        <div className="mt-6 p-4 rounded bg-foreground1 text-dark space-y-2">
          <h3 className="font-semibold">Preview Summary</h3>
          <p>
            <strong>Name:</strong> {values.name}
          </p>
          <p>
            <strong>Target:</strong> {values.targetValue} {values.unitKey}
          </p>
          <p>
            <strong>Schedule:</strong> {sentence}
          </p>
          {reset && (
            <p>
              <strong>Reset on miss:</strong>{" "}
              {reset.replace("Resets on miss: ", "")}
            </p>
          )}
          {hasTags && (
            <p>
              <strong>Tags:</strong> {values.tags!.join(", ")}
            </p>
          )}
          {hasNotes && (
            <div>
              <strong>Notes:</strong>
              <p className="mt-1 whitespace-pre-wrap">{values.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ------------------------------------------------------------------------ */
  /* 🚀 Render                                                                 */
  /* ------------------------------------------------------------------------ */

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, (errs) => {
          // just in case something still fails validation
          console.warn("Habit form validation errors", errs);
        })}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onCancel}
        />
        <div className="relative bg-foreground2 p-6 rounded-lg shadow-xl z-10 max-w-md w-full space-y-4 overflow-y-auto max-h-[90vh]">
          {step === 1 && renderDetailsStep()}
          {step === 2 && renderStructureStep()}
          {step === 3 && renderReviewStep()}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-4 py-2 rounded bg-gray-700 text-light"
              >
                Back
              </button>
            )}
            {step < 3 && (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="ml-auto px-4 py-2 rounded bg-accent text-light"
              >
                Next
              </button>
            )}
            {step === 3 && (
              <button
                type="submit"
                className="ml-auto px-4 py-2 rounded bg-accent text-light"
              >
                {mode === "edit" ? "Save Changes" : "Create Habit"}
              </button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
