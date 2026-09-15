import { useEffect, useState } from "react";

/**
 * Returns `value` only after it has stopped changing for `delay` ms.
 * Keeps us far under TMDB's 40-requests-per-10-seconds limit while typing.
 */
export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cancel on every keystroke
  }, [value, delay]);

  return debounced;
}
