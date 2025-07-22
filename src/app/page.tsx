

export default function Home() {
  return (
    <main className="min-h-screen text-woodland font-sans px-6 py-10 flex flex-col gap-6">
      {/* Title Section */}
      <section className="text-center">
        <h1 className="text-4xl font-serif text-clay tracking-tight">
          Welcome to Lattivo 🌱
        </h1>
        <p className="text-lg text-woodland mt-2">
          Your personal performance dashboard for habit tracking, time management, and growth.
        </p>
      </section>

      {/* Highlight Section */}
      <section className="max-w-md mx-auto bg-clay rounded-lg p-6 shadow-md text-woodland">
        <h2 className="text-xl font-semibold mb-3 text-terracotta">
          Today's Focus
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>🌿 Complete your morning routine</li>
          <li>📊 Log your working hours</li>
          <li>🧠 Review habit streak progress</li>
        </ul>
      </section>
     <section className="w-full max-w-2xl mx-auto my-8">
  <div className="bg-moss text-clay font-sans p-6 rounded-lg shadow-md">
    Tailwind colors, no CSS variables here.
  </div>
  <div className="text-moss">Test text color</div>
</section>

      {/* Habit Grid Demo */}
      <section className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
        <div className="p-4 rounded-lg text-center text-white bg-hibiscus-6">Hibiscus Streak</div>
        <div className="p-4 rounded-lg text-center text-white bg-fern-6">Fern Streak</div>
        <div className="p-4 rounded-lg text-center text-white bg-plum-6">Plum Streak</div>
        <div className="p-4 rounded-lg text-center text-white bg-sky-6">Sky Streak</div>
        <div className="p-4 rounded-lg text-center text-white bg-ochre-6">Ochre Streak</div>
        <div className="p-4 rounded-lg text-center text-accent bg-terracotta-6">Terracotta Streak</div>
      </section>
    </main>
  );
}
