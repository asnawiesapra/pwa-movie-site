import MovieCard from "./MovieCard.jsx";

// Maps the movies array into MovieCard components (list rendering with keys).
export default function MovieList({ movies, onSelect }) {
  if (movies.length === 0) {
    return (
      <p className="py-20 text-center text-slate-400">
        No movies found. Try a different title.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 justify-items-center gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {movies.map((movie, index) => (
        <li key={movie.id} className="contents">
          <MovieCard movie={movie} onSelect={onSelect} animationDelay={index * 45} />
        </li>
      ))}
    </ul>
  );
}
