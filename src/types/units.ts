// 🧭 Unit Categories
export enum UnitCategory {
  Distance = 'distance',
  Weight = 'weight',
  Volume = 'volume',
  Time = 'time',
  Count = 'count',
  Reading = 'reading',
  Exercise = 'exercise',
  Custom = 'custom',
}

// ⚙️ Base Unit Type
export type UnitDefinition = {
  key: string;              // e.g. 'miles', 'kilometers'
  label: string;            // e.g. 'Miles'
  category: UnitCategory;   // e.g. UnitCategory.Distance
  allowsDecimal: boolean;   // e.g. true for miles, false for pages
  abbreviation?: string;    // e.g. 'mi'
  conversionFactor?: number; // optional future-proofing for conversions
  isCustom?: boolean;       // true if user-created
};

// 🧾 Default Unit Definitions
export const defaultUnits: UnitDefinition[] = [
  // Distance
  { key: 'miles', label: 'Miles', category: UnitCategory.Distance, allowsDecimal: true, abbreviation: 'mi' },
  { key: 'kilometers', label: 'Kilometers', category: UnitCategory.Distance, allowsDecimal: true, abbreviation: 'km' },
  { key: 'meters', label: 'Meters', category: UnitCategory.Distance, allowsDecimal: true, abbreviation: 'm' },

  // Weight
  { key: 'pounds', label: 'Pounds', category: UnitCategory.Weight, allowsDecimal: true, abbreviation: 'lb' },
  { key: 'ounces', label: 'Ounces', category: UnitCategory.Weight, allowsDecimal: true, abbreviation: 'oz' },
  { key: 'kilograms', label: 'Kilograms', category: UnitCategory.Weight, allowsDecimal: true, abbreviation: 'kg' },

  // Volume
  { key: 'liters', label: 'Liters', category: UnitCategory.Volume, allowsDecimal: true, abbreviation: 'L' },
  { key: 'milliliters', label: 'Milliliters', category: UnitCategory.Volume, allowsDecimal: true, abbreviation: 'mL' },
  { key: 'ounces_fluid', label: 'Fluid Ounces', category: UnitCategory.Volume, allowsDecimal: true, abbreviation: 'fl oz' },
  { key: 'cups', label: 'Cups', category: UnitCategory.Volume, allowsDecimal: false },

  // Time (no need for enum here, user sets duration)
  { key: 'minutes', label: 'Minutes', category: UnitCategory.Time, allowsDecimal: false, abbreviation: 'min' },
  { key: 'hours', label: 'Hours', category: UnitCategory.Time, allowsDecimal: true, abbreviation: 'hr' },

  // Reading / Count-based
  { key: 'pages', label: 'Pages', category: UnitCategory.Reading, allowsDecimal: false },
  { key: 'books', label: 'Books', category: UnitCategory.Reading, allowsDecimal: false },
  { key: 'count', label: 'Count', category: UnitCategory.Count, allowsDecimal: false },
  { key: 'reps', label: 'Reps', category: UnitCategory.Exercise, allowsDecimal: false },
  { key: 'sets', label: 'Sets', category: UnitCategory.Exercise, allowsDecimal: false },
  { key: 'steps', label: 'Steps', category: UnitCategory.Exercise, allowsDecimal: false },
];

// 🧩 Habit Unit Type (used in your Habit object)
export type HabitUnit = {
  unitKey: string;               // must match UnitDefinition.key OR custom
  isCustom: boolean;             // distinguishes default vs user-created
  customLabel?: string;          // e.g. "pushups", "yoga sessions"
  allowsDecimal?: boolean;       // override or inherit from default
  category?: UnitCategory;       // optional convenience for filtering
};
