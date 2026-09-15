// Presentational component: receives the online/offline flag as a prop.
export default function Header({ isOnline }) {
  return (
    <header className="sticky top-0 z-20 border-b border-black bg-black/95 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4">
        <a
          href="/"
          className="group flex items-center gap-2 transition-transform duration-300 hover:scale-[1.03]"
        >
          <span
            aria-hidden="true"
            className="text-2xl transition-transform duration-300 group-hover:-rotate-6"
          >
            🎬
          </span>
          <span className="text-lg font-bold text-white sm:text-xl">
            PWA Movie<span className="text-accent"> Site</span>
          </span>
        </a>

        <span className="hidden text-sm font-medium text-slate-400 sm:inline">Asnawie Sapra</span>

        <nav aria-label="Status" className="justify-self-end">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-300 ${
              isOnline ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            {isOnline ? "Online" : "Offline — showing cached results"}
          </span>
        </nav>
      </div>
    </header>
  );
} 