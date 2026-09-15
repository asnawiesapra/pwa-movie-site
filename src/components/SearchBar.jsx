// Controlled input: App owns the value, this component reports changes upward.
export default function SearchBar({ value, onChange, onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault(); // stop the browser from reloading the page
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="mx-auto mb-8 max-w-xl animate-[page-enter_600ms_150ms_ease-out_both]"
    >
      <label htmlFor="movie-search" className="sr-only">
        Search movies by title
      </label>

      <div className="flex gap-2">
        <input
          id="movie-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search movies by title..."
          className="min-h-[48px] w-full rounded-lg border border-black bg-black px-4 text-white placeholder:text-slate-500 shadow-sm transition duration-300 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 hover:shadow-[0_6px_18px_rgba(0,0,0,0.18)]"
        />
        <button
          type="submit"
          className="min-h-[48px] rounded-lg bg-accent px-5 font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:brightness-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          Search
        </button>
      </div>
    </form>
  );
}