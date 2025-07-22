'use client';

type Props = {
  theme: 'light' | 'dark';
  setTheme: (val: 'light' | 'dark') => void;
};

export function ThemeToggle({ theme, setTheme }: Props) {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="bg-clay text-canvas px-4 py-2 rounded font-semibold mx-auto block transition-colors duration-200"
    >
      {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  );
}
