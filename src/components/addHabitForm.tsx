import { useState } from 'react';
import { GoalType, Scheduletype, Unit, Habit, Frequency } from '@/types'; 

type Props = {
  onClose: () => void;
  onSave: (habit: Habit) => void;
};

export default function AddHabitForm ({ onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [goalType, setGoalType] = useState<GoalType>(GoalType.Comlpletion);
  const [targetValue, setTargetValue] = useState<number | null>(null);
  const [unit, setUnit] = useState<Unit>(null);
  const [scheduleType, setScheduleType] = useState<Scheduletype>('daily');
  const [icon, setIcon] = useState('🏃‍♂️');

  const handleSubmit = () => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      creationDate: new Date(),
      goalType,
      targetValue,
      unit,
      frequency: {
        scheduleType,
      },
      icon,
      isArchived: false,
    };

    onSave(newHabit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-foreground2 p-6 rounded-lg shadow-xl z-10 max-w-md w-full space-y-4">
        <h2 className="text-lg font-semibold text-dark">Add New Habit</h2>

        <input
          type="text"
          placeholder="Habit Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded bg-foreground1 text-dark"
        />

        <select value={goalType} onChange={(e) => setGoalType(e.target.value as GoalType)} className="w-full p-2 rounded border bg-foreground1 text-dark">
          {Object.values(GoalType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {(goalType === GoalType.Quantity || goalType === GoalType.Duration) && (
          <>
            <input
              type="number"
              placeholder="Target Value"
              value={targetValue || ''}
              onChange={(e) => setTargetValue(Number(e.target.value))}
              className="w-full p-2 border rounded bg-foreground1 text-dark"
            />
            <select value={unit ?? ''} onChange={(e) => setUnit(e.target.value as Unit)} className="w-full p-2 rounded border bg-foreground1 text-dark">
              <option value="">Select Unit</option>
              <option value="minutes">Minutes</option>
              <option value="reps">Reps</option>
              <option value="glasses">Glasses</option>
            </select>
          </>
        )}

        <select value={scheduleType} onChange={(e) => setScheduleType(e.target.value as Scheduletype)} className="w-full p-2 rounded border bg-foreground1 text-dark">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="custom">Custom</option>
        </select>

        <input
          type="text"
          placeholder="Emoji Icon"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="w-full p-2 border rounded bg-foreground1 text-dark"
        />

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-700 text-light">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded bg-accent text-light">Save</button>
        </div>
      </div>
    </div>
  );
}
