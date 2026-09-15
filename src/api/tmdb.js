// All TMDB network access lives here so components stay presentational.

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const IMG_BASE = "https://image.tmdb.org/t/p/w500";

/**
 * Fetch popular movies, or search results when a query is given.
 * @param {string} query   Search text ("" = popular movies)
 * @param {AbortSignal} signal  Lets the caller cancel an in-flight request
 * @returns {Promise<Array>} Array of movie objects
 */
export async function fetchMovies(query = "", signal) {
  if (!API_KEY) {
    throw new Error("Missing API key. Copy .env.example to .env and add your TMDB key.");
  }

  const url = query
    ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    : `${BASE_URL}/movie/popular?api_key=${API_KEY}`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status})`);
  }

  const data = await response.json();
  return data.results ?? [];
}
