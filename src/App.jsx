import { useCallback, useEffect, useRef, useState } from "react";
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import MovieList from "./components/MovieList.jsx";
import MovieDetail from "./components/MovieDetail.jsx";
import Loader from "./components/Loader.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";
import { fetchMovies } from "./api/tmdb.js";
import { useDebounce } from "./hooks/useDebounce.js";

export default function App() {
  // --- State ---------------------------------------------------------------
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const requestIdRef = useRef(0);

  // Search only fires 500ms after typing stops.
  const debouncedSearch = useDebounce(search, 500);

  // --- Data fetching -------------------------------------------------------
  const loadMovies = useCallback((query, signal) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    fetchMovies(query, signal)
      .then((results) => {
        if (requestId === requestIdRef.current) setMovies(results);
      })
      .catch((err) => {
        if (err.name === "AbortError" || requestId !== requestIdRef.current) return;
        setError(err.message || "Failed to fetch movies. Check your connection.");
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setLoading(false);
      });
  }, []);

  // Runs on mount and whenever the debounced search term changes.
  useEffect(() => {
    const controller = new AbortController();
    loadMovies(debouncedSearch, controller.signal);
    return () => controller.abort(); // cleanup cancels the stale request
  }, [debouncedSearch, loadMovies]);

  // --- Online / offline events --------------------------------------------
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // --- Render --------------------------------------------------------------
  return (
    <div className="page-shell min-h-screen bg-white">
      <Header isOnline={isOnline} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Curated by Asnawie Sapra
        </p>
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          {debouncedSearch ? `Results for "${debouncedSearch}"` : "Popular Movies"}
        </h1>

        <SearchBar
          value={search}
          onChange={setSearch}
          onSubmit={() => loadMovies(search)}
        />

        {loading && <Loader />}

        {!loading && error && (
          <ErrorMessage message={error} onRetry={() => loadMovies(debouncedSearch)} />
        )}

        {!loading && !error && <MovieList movies={movies} onSelect={setSelected} />}
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        Data from The Movie Database (TMDB) · Created by Asnawie Sapra
      </footer>

      {/* Conditional rendering: the modal only mounts when a movie is selected. */}
      {selected && <MovieDetail movie={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}