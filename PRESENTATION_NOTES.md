# Presentation Notes — 50 out of 100 points

The rubric gives half the score to how you explain this, not to the code. Do not read from
the screen. Practice the walkthrough below twice out loud before the demo.

---

## 1. Demo order (about 3 minutes)

Run `npm run build && npm run preview` first — never demo the dev server.

1. Open the app — popular movies load in a grid.
2. Type a title in the search box. Point out it waits half a second before firing.
3. Click a movie — the detail modal opens. Press Escape to close.
4. DevTools → Application → Manifest. Show name, icons, standalone display.
5. DevTools → Application → Service Workers. Show it "activated and running".
6. DevTools → Network → **Offline** → reload. Movies still render from cache, badge flips to Offline.
7. Address bar → install icon → install the app. Show it opening in its own window.
8. DevTools → Lighthouse → run it live.

---

## 2. Component walkthrough (the part they grade)

Say it like this:

> "`App.jsx` holds all the state. It passes data down as props and receives events back as
> callbacks. The child components are presentational — they don't fetch anything themselves."

Then go component by component:

- **App.jsx** — five pieces of state: `movies`, `search`, `loading`, `error`, `selected`.
  One `useEffect` fetches whenever the debounced search term changes.
- **Header.jsx** — takes `isOnline` as a prop, renders the status badge.
- **SearchBar.jsx** — a *controlled input*: React owns the value, `onChange` sends every
  keystroke up to `App`.
- **MovieList.jsx** — maps the `movies` array into `MovieCard`s, each with a `key` so React
  can track them between renders.
- **MovieCard.jsx** — one movie. Clicking calls `onSelect(movie)`, which sets `selected` in App.
- **MovieDetail.jsx** — renders only when `selected` is not null (conditional rendering).
- **api/tmdb.js** — all network code in one file, so components never touch `fetch`.
- **hooks/useDebounce.js** — my custom hook.

---

## 3. Design decisions to volunteer (this is what earns "Excellent")

The rubric rewards *explaining design decisions*. Bring these up without being asked:

**Why debounce the search?**
> "TMDB's free tier allows 40 requests per 10 seconds. Fetching on every keystroke would
> burn through that and hammer the API. `useDebounce` waits 500ms after typing stops, so
> typing 'inception' is one request instead of nine."

**Why AbortController in the useEffect cleanup?**
> "If a slow request for 'in' finishes after a fast request for 'inception', the old results
> would overwrite the new ones — a race condition. The cleanup function aborts the previous
> request before starting the next one."

**Why put all fetching in `api/tmdb.js`?**
> "Separation of concerns. If the API changes, I edit one file. Components stay presentational
> and would be easy to test."

**Why network-first for the API but cache-first for images?**
> "Movie data changes — popular lists update daily — so I want fresh data with the cache as a
> backup. A poster image at a given URL never changes, so serving it from cache is always correct
> and saves bandwidth."

**Why is the key in `.env` and not in the code?**
> "It would be in the public GitHub repo otherwise. `.env` is gitignored and I committed
> `.env.example` so anyone cloning knows what to fill in."

**Why `width` and `height` on the poster images?**
> "Without them the browser doesn't know how tall the image will be, so the layout jumps when
> it loads. That's Cumulative Layout Shift and it costs Lighthouse points."

---

## 4. Questions the instructor will probably ask

**"What is the difference between props and state?"**
> State is data a component owns and can change. Props are data passed down from a parent —
> the child can read them but not modify them. `movies` is state in App; it's a prop in MovieList.

**"Why do you need `key` in a list?"**
> React uses it to match elements between renders so it only updates what changed instead of
> re-rendering the whole list. I use `movie.id` because it's unique and stable.

**"What does `useEffect` do, and what is the return function?"**
> It runs side effects after render — things outside React like fetching or event listeners.
> The returned function is cleanup; React runs it before the next effect and on unmount. I use
> it to abort the fetch and remove event listeners.

**"What is the dependency array for?"**
> It tells React when to re-run the effect. `[debouncedSearch, loadMovies]` means it re-runs
> only when the search term changes, not on every render.

**"What makes an app a PWA?"**
> Three things: served over HTTPS, a web app manifest with icons and a display mode, and a
> registered service worker that handles fetch events. That's what makes it installable and
> lets it work offline.

**"What is a service worker?"**
> A script that runs in its own thread, separate from the page, and sits between the app and the
> network as a programmable proxy. It has no DOM access. It intercepts every fetch and decides
> whether to answer from cache or from the network.

**"Why `skipWaiting()` and `clients.claim()`?"**
> By default a new service worker waits until all old tabs close. Those two make the new version
> take control immediately, so the user isn't stuck on a stale cache.

**"What happens if the API call fails?"**
> The catch block sets `error` state, and the UI swaps the grid for `ErrorMessage` with a retry
> button. I also check `response.ok`, because `fetch` doesn't throw on a 401 or 404 — it only
> throws on a network failure.

**"Why Vite instead of Create React App?"**
> Faster dev server (native ES modules, no bundling in dev) and CRA is deprecated. Vite also
> handles the `.env` loading with the `VITE_` prefix.

---

## 5. Before you present — checklist

- [ ] `.env` created with a working key (it is gitignored — it will NOT be in the repo)
- [ ] `npm run build` completes with no errors
- [ ] Repo is public, has the README, has `.env.example`, no `node_modules/`
- [ ] Lighthouse run on `npm run preview`, screenshot the score
- [ ] Practiced the offline demo once so you don't fumble the DevTools toggle
