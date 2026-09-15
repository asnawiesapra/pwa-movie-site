# PWA Movie Site

A Progressive Web App built with **React + Vite + Tailwind CSS** that browses and searches
movies using the **TMDB API**. Installable, and the last-loaded results stay available offline.

IT ELEC 1 — Mobile Application Development · Laboratory Exam · Section 80144

---

## Features

| Feature | Where it lives |
|---|---|
| Responsive movie grid | `MovieList.jsx` + `MovieCard.jsx` |
| Search by title (debounced, 500ms) | `SearchBar.jsx` + `useDebounce.js` |
| Movie detail modal (overview, rating, release date) | `MovieDetail.jsx` |
| Loading state | `Loader.jsx` |
| Error handling with retry | `ErrorMessage.jsx` |
| Online/offline indicator | `Header.jsx` + `online`/`offline` events in `App.jsx` |
| PWA: manifest, service worker, offline fallback | `public/manifest.json`, `public/sw.js`, `public/offline.html` |

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Add your TMDB API key
cp .env.example .env
#    then edit .env and paste your key:
#    VITE_TMDB_API_KEY=your_key_here

# 3. Run in development
npm run dev

# 4. Production build + preview (use this one for Lighthouse)
npm run build
npm run preview
```

### Getting a TMDB API key

1. Sign up at <https://www.themoviedb.org/>
2. Settings → API → Create → Developer
3. Copy the **API Key (v3 auth)** into `.env`

Free tier: 40 requests / 10 seconds, 1000 / day.

---

## Project structure

```
public/
├── manifest.json        PWA manifest (name, icons, theme, standalone display)
├── sw.js                Service worker (app shell, API, and image caching)
├── offline.html         Fallback page when nothing is cached
└── icon-192/512/maskable-512.png
src/
├── main.jsx             Entry point + service worker registration
├── App.jsx              All state lives here; passes data down as props
├── index.css            Tailwind directives
├── api/tmdb.js          Every TMDB call (popular + search)
├── hooks/useDebounce.js Custom hook — delays search until typing stops
└── components/
    ├── Header.jsx       Title + online/offline badge
    ├── SearchBar.jsx    Controlled input, onChange + onSubmit
    ├── MovieList.jsx    Maps movies -> MovieCard
    ├── MovieCard.jsx    One movie: poster, title, year, rating
    ├── MovieDetail.jsx  Modal with full overview
    ├── Loader.jsx       Spinner
    └── ErrorMessage.jsx Error + retry button
```

Data flows **down** as props; events flow **up** as callbacks. `App.jsx` is the single
source of truth for `movies`, `search`, `loading`, `error`, and `selected`.

---

## Caching strategy (`public/sw.js`)

| Request | Strategy | Why |
|---|---|---|
| Page navigation | Network-first → cached shell → `offline.html` | Always fresh, never a dead page |
| `api.themoviedb.org` | Network-first, cache as backup | Fresh data online, last results offline |
| `image.tmdb.org` posters | Cache-first | A poster URL never changes |
| JS / CSS / icons | Cache-first | Instant repeat loads |

---

## Testing the PWA

1. `npm run build && npm run preview`
2. DevTools → **Application** → Manifest (check icons/name) and Service Workers (check "activated")
3. DevTools → **Network** → set to **Offline** → reload. Cached movies still render.
4. DevTools → **Lighthouse** → run on the preview build (not `npm run dev`).

---

## Notes

- `.env` is gitignored; `.env.example` is committed so the key is never pushed.
- `node_modules/` is gitignored.
- Movie data and images courtesy of [TMDB](https://www.themoviedb.org/). This product uses
  the TMDB API but is not endorsed or certified by TMDB.
