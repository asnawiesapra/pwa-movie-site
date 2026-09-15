export default function Loader() {
  return (
    <div className="flex flex-col items-center gap-3 py-20" role="status" aria-live="polite">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-accent" />
      <p className="text-slate-600">Loading movies...</p>
    </div>
  );
}