import { useEffect, useRef, useState } from "react";
import { IMG_BASE } from "../api/tmdb.js";

// NOTE on the trailer/details feature:
// This calls the TMDB "movie details" endpoint with append_to_response=videos,
// which returns runtime, genres, tagline AND trailer videos in one request.
// It assumes the same env var your api/tmdb.js already uses for the API key
// (Vite convention: import.meta.env.VITE_TMDB_API_KEY). If your api/tmdb.js
// stores the key or base URL differently, swap the two constants below (or,
// better, move fetchMovieExtras into api/tmdb.js and import it from there
// so there's a single source of truth for API access).
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

async function fetchMovieExtras(movieId, signal) {
  const url = `${TMDB_BASE}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=videos&language=en-US`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Failed to fetch movie details.");
  const data = await res.json();

  const trailer =
    data.videos?.results?.find(
      (v) => v.site === "YouTube" && v.type === "Trailer"
    ) ||
    data.videos?.results?.find((v) => v.site === "YouTube") ||
    null;

  return {
    runtime: data.runtime ?? null,
    genres: data.genres ?? [],
    tagline: data.tagline || "",
    trailerKey: trailer?.key || null,
  };
}

function formatRuntime(minutes) {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// Modal shown when a card is clicked. Closes on backdrop click or Escape.
export default function MovieDetail({ movie, onClose }) {
  const panelRef = useRef(null);
  const [extras, setExtras] = useState(null);
  const [extrasLoading, setExtrasLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden"; // lock background scroll
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Fetch runtime/genres/tagline/trailer whenever a new movie is opened.
  useEffect(() => {
    const controller = new AbortController();
    if (panelRef.current) panelRef.current.scrollTop = 0;
    setExtras(null);
    setExtrasLoading(true);
    setShowTrailer(false);

    fetchMovieExtras(movie.id, controller.signal)
      .then(setExtras)
      .catch((err) => {
        if (err.name !== "AbortError") setExtras({ runtime: null, genres: [], tagline: "", trailerKey: null });
      })
      .finally(() => setExtrasLoading(false));

    return () => controller.abort();
  }, [movie.id]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="movie-detail-title"
      onClick={onClose}
      className="modal-backdrop fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4"
    >
      <div
        ref={panelRef}
        onClick={(event) => event.stopPropagation()} // keep clicks inside from closing
        className="detail-panel my-auto min-h-0 max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#fffaf5] p-6 text-left shadow-2xl ring-1 ring-orange-100 sm:p-8"
      >
        <div className="flex flex-col items-start gap-5 sm:flex-row">
          {movie.poster_path && (
            <img
              src={`${IMG_BASE}${movie.poster_path}`}
              alt={`Poster for ${movie.title}`}
              width="500"
              height="750"
              className="w-36 shrink-0 rounded-xl object-cover shadow-lg shadow-slate-900/20 ring-4 ring-white transition-transform duration-300 hover:scale-[1.03]"
            />
          )}

          <div className="w-full min-w-0">
            <h2 id="movie-detail-title" className="text-2xl font-bold tracking-tight text-slate-900">
              {movie.title}
            </h2>

            {!extrasLoading && extras?.tagline && (
              <p className="mt-1 text-sm italic text-accent">{extras.tagline}</p>
            )}

            <p className="mt-3 inline-flex flex-wrap justify-start gap-x-1.5 rounded-full bg-white px-4 py-2 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
              {movie.release_date || "Release date unknown"} ·{" "}
              <span className="text-accent">
                ★ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </span>{" "}
              ({movie.vote_count ?? 0} votes)
              {!extrasLoading && extras?.runtime && <> · {formatRuntime(extras.runtime)}</>}
            </p>

            {!extrasLoading && extras?.genres?.length > 0 && (
              <div className="mt-2 flex flex-wrap justify-start gap-1.5">
                {extras.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-600 transition-colors duration-300 hover:border-accent hover:text-accent"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-700">
              {movie.overview || "No overview available for this title."}
            </p>
          </div>
        </div>

        {/* Trailer feature: shows a "Watch Trailer" toggle when TMDB has a YouTube trailer. */}
        <div className="mt-5">
          {extrasLoading && (
            <p className="text-sm text-slate-500">Checking for a trailer…</p>
          )}

          {!extrasLoading && extras?.trailerKey && !showTrailer && (
            <button
              onClick={() => setShowTrailer(true)}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-accent/60 bg-transparent font-semibold text-accent transition duration-300 hover:-translate-y-0.5 hover:bg-accent hover:text-white"
            >
              <span aria-hidden="true">▶</span> Watch Trailer
            </button>
          )}

          {!extrasLoading && extras?.trailerKey && showTrailer && (
            <div className="aspect-video w-full overflow-hidden rounded-lg ring-1 ring-slate-200">
              <iframe
                src={`https://www.youtube.com/embed/${extras.trailerKey}?autoplay=1`}
                title={`${movie.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          )}

          {!extrasLoading && !extras?.trailerKey && (
            <p className="text-sm text-slate-500">No trailer available for this title.</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-5 min-h-[44px] w-full rounded-lg bg-accent font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
        >
          Close
        </button>
      </div>
    </div>
  );
}