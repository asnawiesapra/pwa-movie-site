export default function ErrorMessage({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center"
    >
      <p className="mb-4 font-medium text-red-700">{message}</p>
      <button
        onClick={onRetry}
        className="min-h-[44px] rounded-lg bg-accent px-5 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
      >
        Try again
      </button>
    </div>
  );
}