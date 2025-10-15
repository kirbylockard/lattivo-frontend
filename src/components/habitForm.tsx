'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  HabitCreate,
  Habit,
} from '@/types/habit';
import {
  UnitCategory,
  defaultUnits,
  HabitUnit,
} from '@/types/units';
import { getNumberSuffix } from '@/lib/dateUtils';
import {
  ScheduleType,
  IntervalType,
  HabitSchedule,
  RollingSchedule,
} from '@/types/scheduling';

/* -------------------------------------------------------------------------- */
/* 🧩 Zod Schema                                                              */
/* -------------------------------------------------------------------------- */

const customScheduleSchema = z.object({
  type: z.enum(['specific-days', 'rolling', 'flexible-window']),
}).and(z.union([
  z.object({
    type: z.literal('specific-days'),
    daysOfWeek: z.array(z.number().min(0).max(6)).min(1, "Select at least one day"),
  }),
  z.object({
    type: z.literal('rolling'),
    intervalType: z.enum(['day', 'week', 'month']),
    intervalQuantity: z.number().min(1, "Interval quantity must be at least 1"),
    resetOnMiss: z.boolean(),
  }),
  z.object({
    type: z.literal('flexible-window'),
    windowLength: z.number().min(1, "Occurrences must be at least 1"),
    intervalType: z.enum(['day', 'week', 'month']),
    resetOnMiss: z.boolean(),
  }),
]));

const habitSchema = z.object({
  name: z.string().min(1, "Name is required"),
  notes: z.string().optional(),
  color: z.string().optional(), // 👈 this line fixes the mismatch
  unit: z.object({
    unitKey: z.string(),
    isCustom: z.boolean(),
    customLabel: z.string().optional(),
    allowsDecimal: z.boolean().optional(),
    category: z.string().optional(),
  }),
  targetValue: z.number().min(1, "Target value must be positive"),
  schedule: customScheduleSchema,
  tags: z.array(z.string()).optional(),
});

type HabitFormData = z.infer<typeof habitSchema>;

/* -------------------------------------------------------------------------- */
/* 🪄 Component Types                                                         */
/* -------------------------------------------------------------------------- */

type HabitFormProps = {
  mode: 'create' | 'edit';
  initialData?: Habit;
  onSave: (habit: HabitCreate) => void;
  onCancel: () => void;
};

/* -------------------------------------------------------------------------- */
/* 🎨 Color Swatches                                                          */
/* -------------------------------------------------------------------------- */

const colorOptions = [
  { name: 'Hibiscus', class: 'bg-hibiscus-7', value: '#D13E78' },
  { name: 'Ochre', class: 'bg-ochre-7', value: '#D9A72D' },
  { name: 'Terracotta', class: 'bg-terracotta-7', value: '#B54E37' },
  { name: 'Sky', class: 'bg-sky-7', value: '#4D87C2' },
  { name: 'Fern', class: 'bg-fern-7', value: '#4A8C4D' },
  { name: 'Plum', class: 'bg-plum-7', value: '#874C78' },
];

/* -------------------------------------------------------------------------- */
/* 🌱 Main Component                                                         */
/* -------------------------------------------------------------------------- */

export default function HabitForm({
  mode,
  initialData,
  onSave,
  onCancel,
}: HabitFormProps) {
  const [step, setStep] = useState(mode === 'edit' ? 3 : 1);
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory | ''>(
    initialData?.unit?.category || ''
  );
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(
    (initialData?.schedule.type === 'specific-days'
      ? initialData.schedule.daysOfWeek
      : []) || []
  );

  const methods = useForm<HabitFormData>({
  resolver: zodResolver(habitSchema),
  defaultValues: {
    name: '',
    notes: '',
    tags: [],
    unit: {
      unitKey: '',
      isCustom: false,
      category: undefined,
    },
    targetValue: 1,
    schedule: {
      type: 'rolling',
      intervalType: 'day',
      intervalQuantity: 1,
      resetOnMiss: false,
    },
    color: colorOptions[0].value,
  },
});

const onSubmit = (data: HabitFormData) => {
  // Convert HabitFormData → HabitCreate
  const newHabit: HabitCreate = {
  ...data,
  unit: {
    ...data.unit,
    category: data.unit.category as UnitCategory | undefined, // ✅ cast to enum
  },
  isActive: true,
  endDate: null,
  streakCount: 0,
  longestStreak: 0,
  lastCompletionDate: null,
  nextDueDate: null,
  isArchived: false,
};

  onSave(newHabit);
};


  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const selectedSchedule = watch('schedule.type');

  /* -------------------------------------------------------------------------- */
  /* 🧠 Logic                                                                  */
  /* -------------------------------------------------------------------------- */

  const toggleDay = (day: number) => {
    const updatedDays = daysOfWeek.includes(day)
      ? daysOfWeek.filter((d) => d !== day)
      : [...daysOfWeek, day];
    setDaysOfWeek(updatedDays);
    setValue('schedule', { type: 'specific-days', daysOfWeek: updatedDays });
  };

 
  /* -------------------------------------------------------------------------- */
  /* 🧱 UI Sections                                                            */
  /* -------------------------------------------------------------------------- */

  const renderDetailsStep = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-dark">Habit Details</h2>

      <div>
        <label htmlFor='name' className="block text-dark mb-1">Name</label>
        <input
          type="text"
          placeholder="Meditate"
          {...register('name')}
          className="w-full p-2 border rounded bg-foreground1 text-dark"
        />
        {errors.name && <p className="text-error text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor='notes' className="block text-dark mb-1">Notes</label>
        <textarea
          placeholder="Practice mindfulness with no destractions"
          {...register('notes')}
          className="w-full p-2 border rounded bg-foreground1 text-dark resize-none"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor='tags' className="block text-dark mb-1">Tags</label>
        <input
          type="text"
          placeholder="Health, Wellness"
          onChange={(e) =>
            setValue(
              'tags',
              e.target.value
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            )
          }
          defaultValue={initialData?.tags?.join(', ') || ''}
          className="w-full p-2 border rounded bg-foreground1 text-dark"
        />
      </div>
    </div>
  );
  

  const renderStructureStep = () => {
    const watchedRollingQuantity = watch('schedule.intervalQuantity');
  const watchedRollingType = watch('schedule.intervalType');
  const watchFlexibleQuantity = watch('schedule.windowLength');
  const watchFlexibleType = watch('schedule.intervalType');

    return (
  
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-dark">Structure</h2>

      {/* Units */}
      <div>
  <label className="block text-dark mb-1">Unit of Measure</label>
  <select
    id="unit"
    defaultValue={""}
    {...register('unit.unitKey', { required: true })}
    required
    
    className="w-full p-2 border rounded bg-foreground1 text-dark"
  >
    {/* ✅ Placeholder Option (light gray text only for itself) */}
    <option value=""  disabled hidden className="text-gray-400">
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

  {errors.unit?.unitKey && (
    <p className="text-error text-sm mt-1">
      {errors.unit.unitKey.message}
    </p>
  )}
</div>

      {/* Target Value */}
      <div>
        <label htmlFor='targetValue' className="block text-dark mb-1">Target Value</label>
        <input
          type="number"
          {...register('targetValue', { valueAsNumber: true })}
          className="w-full p-2 border rounded bg-foreground1 text-dark"
        />
        {errors.targetValue && (
          <p className="text-error text-sm">{errors.targetValue.message}</p>
        )}
      </div>

      {/* Schedule Type */}
      <div>
        <label className="block text-dark mb-1">Schedule Type</label>
      <select
        {...register('schedule.type')}
        className="w-full p-2 border rounded bg-foreground1 text-dark"
      >
        <option value="" disabled hidden className="text-gray-400">
          Select schedule type
        </option>
        <option value="rolling">Rolling</option>
        <option value="specific-days">Specific Days</option>
        <option value="flexible-window">Flexible Window</option>
      </select>
      </div>

      {/* Schedule Details */}
      {selectedSchedule === 'specific-days' && (
        <div className="space-y-2">
          <label className="block text-dark">Select Days:</label>
          <div className="flex flex-wrap gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
              (day, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={`px-3 py-1 rounded border ${
                    daysOfWeek.includes(i)
                      ? 'bg-accent text-light'
                      : 'bg-foreground1 text-dark'
                  }`}
                >
                  {day}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {selectedSchedule === 'rolling' && (
        <>
        <div className="space-y-2 justify-between direction-row flex">
        <div className='flex-1 pr-2'>
        <label className="block text-dark mb-1">Interval Type</label>
          <select
            {...register('schedule.intervalType')}
            className="w-full p-2 border rounded bg-foreground1 text-dark"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
          </div>
          <div className='flex-1 pl-2'>
          <label className="block text-dark mb-1">Interval Quantity</label>
          <input
            type="number"
            placeholder="Interval Quantity"
            {...register('schedule.intervalQuantity', { valueAsNumber: true })}
            className="w-full p-2 border rounded bg-foreground1 text-dark"
          />
          </div>
          
          </div>
          <div className="text-dark mt-2">
      Complete habit every {watchedRollingQuantity === 1 ? '': watchedRollingQuantity + getNumberSuffix(watchedRollingQuantity) + ' '} {watchedRollingType || 'day'}
      
    </div>
        </>
      )}

      {selectedSchedule === 'flexible-window' && (
        <>
        <div className="space-y-2 justify-between direction-row flex">
          <div className='flex-1 pr-2'>
          <label className="block text-dark mb-1">Window Type</label>
          <select
            {...register('schedule.intervalType')}
            className="w-full p-2 border rounded bg-foreground1 text-dark"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
          </div>
          <div className='flex-1 pl-2'>
            <label className="block text-dark mb-1">Window Length</label>
          <input
            type="number"
            defaultValue={1}
            {...register('schedule.windowLength', { valueAsNumber: true })}
            className="flex-1 p-2 border rounded bg-foreground1 text-dark"
          />
          </div>
          </div>
          <div className="text-dark mt-2">
      Complete habit within {watchFlexibleQuantity || 1} {' '}
       {watchFlexibleType || 'day'}
      {watchFlexibleQuantity > 1 ? 's' : ''}
    </div>
        </>
      )}
    </div>
  );
}

  const renderReviewStep = () => {
    const values = methods.getValues();

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-dark">Color & Review</h2>

        <div>
          <label className="block text-dark mb-1">Choose Color:</label>
          <div className="flex gap-2 flex-wrap">
            {colorOptions.map((c) => (
              <button
                type="button"
                key={c.value}
                onClick={() => setValue('color', c.value)}
                className={`w-8 h-8 rounded-full border-2 ${
                  values.color === c.value ? 'border-dark' : 'border-transparent'
                } ${c.class}`}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="mt-6 p-4 rounded bg-foreground1 text-dark space-y-2">
          <h3 className="font-semibold">Preview Summary</h3>
          <p><strong>Name:</strong> {values.name}</p>
          <p><strong>Target:</strong> {values.targetValue} {values.unit?.unitKey}</p>
          <p><strong>Schedule:</strong> {values.schedule.type}</p>
        </div>
      </div>
    );
  };

  /* -------------------------------------------------------------------------- */
  /* 🚀 Render                                                                 */
  /* -------------------------------------------------------------------------- */

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
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
                {mode === 'edit' ? 'Save Changes' : 'Create Habit'}
              </button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
