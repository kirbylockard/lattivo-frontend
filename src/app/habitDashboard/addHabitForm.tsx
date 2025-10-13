'use client';

import { useState } from 'react';
import { HabitCreate } from '@/types';
import { HabitUnit, defaultUnits, UnitCategory } from '@/types/units';
import { HabitSchedule } from '@/types/scheduling';

type Props = {
  onClose: () => void;
  onSave: (habit: HabitCreate) => void;
};

export default function AddHabitForm({ onClose, onSave }: Props) {
  // 🔹 Form state
  const [name, setName] = useState('');
  const [targetValue, setTargetValue] = useState<number>(1);
  const [unit, setUnit] = useState<HabitUnit | null>(null);
  const [isCustomUnit, setIsCustomUnit] = useState(false);
  const [customUnitLabel, setCustomUnitLabel] = useState('');
  const [color, setColor] = useState('#C46D5E');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [scheduleType, setScheduleType] = useState<'rolling' | 'specific-days' | 'flexible-window'>('rolling');

  // 🧠 Example default schedule (you can expand this later)
  const defaultSchedule: HabitSchedule = {
    type: 'rolling',
    intervalType: 'day',
    intervalQuantity: 1,
    resetOnMiss: false,
  };

  // 🔹 Handle unit selection
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKey = e.target.value;

    if (selectedKey === 'custom') {
      setIsCustomUnit(true);
      setUnit({
        unitKey: 'custom',
        isCustom: true,
        customLabel: '',
        allowsDecimal: false,
      });
      return;
    }

    setIsCustomUnit(false);
    const selectedDef = defaultUnits.find((u) => u.key === selectedKey);
    if (selectedDef) {
      setUnit({
        unitKey: selectedDef.key,
        isCustom: false,
        allowsDecimal: selectedDef.allowsDecimal,
        category: selectedDef.category,
      });
    } else {
      setUnit(null);
    }
  };

  // 🔹 Handle form submission
  const handleSubmit = () => {
    if (!name.trim() || !unit) {
      alert('Please enter a name and select a unit.');
      return;
    }

    const habit: HabitCreate = {
      name,
      endDate: null,
      isActive: true,
      unit: {
        ...unit,
        ...(isCustomUnit && customUnitLabel
          ? { customLabel: customUnitLabel, unitKey: customUnitLabel.toLowerCase() }
          : {}),
      },
      targetValue,
      schedule: defaultSchedule,
      notes,
      color,
      streakCount: 0,
      longestStreak: 0,
      lastCompletionDate: null,
      nextDueDate: null,
      isArchived: false,
      tags,
    };

    onSave(habit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-foreground2 p-6 rounded-lg shadow-xl z-10 max-w-md w-full space-y-4">
        <h2 className="text-lg font-semibold text-dark">Add New Habit</h2>

        {/* 🏷️ Habit Name */}
        <input
          type="text"
          placeholder="Habit Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded bg-foreground1 text-dark"
        />

        {/* 🎯 Target Value */}
        <input
          type="number"
          placeholder="Target Value"
          value={targetValue}
          onChange={(e) => setTargetValue(Number(e.target.value))}
          className="w-full p-2 border rounded bg-foreground1 text-dark"
        />

        {/* 📏 Unit Selection */}
        <select
          value={unit?.unitKey ?? ''}
          onChange={handleUnitChange}
          className="w-full p-2 rounded border bg-foreground1 text-dark"
        >
          <option value="">Select Unit</option>
          {defaultUnits.map((u) => (
            <option key={u.key} value={u.key}>
              {u.label}
            </option>
          ))}
          <option value="custom">Custom Unit...</option>
        </select>

        {/* 🧩 Custom Unit Input */}
        {isCustomUnit && (
          <input
            type="text"
            placeholder="Enter custom unit (e.g., pushups)"
            value={customUnitLabel}
            onChange={(e) => setCustomUnitLabel(e.target.value)}
            className="w-full p-2 border rounded bg-foreground1 text-dark"
          />
        )}

        {/* 🎨 Color Picker */}
        <div>
          <label className="text-sm text-dark mb-1 block">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 p-1 border rounded bg-foreground1"
          />
        </div>

        {/* 📝 Notes */}
        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded bg-foreground1 text-dark resize-none"
          rows={3}
        />

        {/* 🏷️ Tags (simple comma-separated input for now) */}
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags.join(', ')}
          onChange={(e) => setTags(e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
          className="w-full p-2 border rounded bg-foreground1 text-dark"
        />

        {/* 🗓️ Schedule Type (placeholder) */}
        <select
          value={scheduleType}
          onChange={(e) => setScheduleType(e.target.value as typeof scheduleType)}
          className="w-full p-2 rounded border bg-foreground1 text-dark"
        >
          <option value="rolling">Rolling (every X days)</option>
          <option value="specific-days">Specific Days</option>
          <option value="flexible-window">Flexible Window</option>
        </select>

        {/* 🧭 Buttons */}
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-700 text-light">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded bg-accent text-light">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
