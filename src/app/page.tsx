

export default function Home() {
  return (
    <main className="min-h-screen text-woodland bg-canvas font-sans px-6 py-10 flex flex-col gap-6">
      {/* Title Section */}
      <section className="text-center">
        <h1 className="text-4xl font-serif  tracking-tight">
          Welcome to Lattivo 🌱
        </h1>
        <p className="text-lg text-woodland mt-2">
          Your personal performance dashboard for habit tracking, time management, and growth.
        </p>
      </section>

      {/* Highlight Section */}
      <section className="max-w-md mx-auto bg-foreground1 rounded-lg p-6 shadow-md text-woodland">
        <h2 className="text-xl font-semibold mb-3 ">
          Today's Focus
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>🌿 Complete your morning routine</li>
          <li>📊 Log your working hours</li>
          <li>🧠 Review habit streak progress</li>
        </ul>
      </section>
     

      {/* Habit Grid Demo */}
      <section className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
        <div className="p-4 rounded-lg text-center text-canvas bg-hibiscus-6">Hibiscus Streak</div>
        <div className="p-4 rounded-lg text-center text-canvas bg-fern-6">Fern Streak</div>
        <div className="p-4 rounded-lg text-center text-canvas bg-plum-6">Plum Streak</div>
        <div className="p-4 rounded-lg text-center text-canvas bg-sky-6">Sky Streak</div>
        <div className="p-4 rounded-lg text-center text-canvas bg-ochre-6">Ochre Streak</div>
        <div className="p-4 rounded-lg text-center text-canvas bg-terracotta-6">Terracotta Streak</div>
      </section>
    </main>
  );
}
