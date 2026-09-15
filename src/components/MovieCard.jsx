import { IMG_BASE } from "../api/tmdb.js";

export default function MovieCard({ movie, onSelect, animationDelay = 0 }) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  return (
    <button
      onClick={() => onSelect(movie)}
      style={{ animationDelay: `${animationDelay}ms` }}
      className="movie-card group w-full max-w-[220px] overflow-hidden rounded-xl bg-black text-left shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-black transition duration-300 hover:-translate-y-2 hover:shadow-[0_18px_34px_rgba(0,0,0,0.28)] hover:ring-accent/70 focus:outline-none focus:ring-2 focus:ring-accent"
    >
      {/* Fixed aspect ratio + width/height stop layout shift (helps Lighthouse CLS). */}
      <div className="aspect-[2/3] w-full overflow-hidden bg-slate-900">
        {movie.poster_path ? (
          <img
            src={`${IMG_BASE}${movie.poster_path}`}
            alt={`Poster for ${movie.title}`}
            width="500"
            height="750"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl" aria-hidden="true">
            🎞️
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="line-clamp-2 font-semibold text-white transition-colors duration-300 group-hover:text-accent">
          {movie.title}
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          {year} · <span className="text-accent">★ {rating}</span>
        </p>
      </div>
    </button>
  );
}