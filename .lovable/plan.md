## Goal
Port the uploaded IAF tribute site into this TanStack project as the home route, then layer in smoothness improvements across scrolling, animations, performance, and navigation.

## Steps

1. **Bring assets into the project**
   - Upload large media (`cockpit-bg.png`, `iaf-crest.png`, `india-map.png`, `jet-flyby.mp3`) via Lovable Assets so they stream from CDN instead of bloating the bundle.
   - Drop `styles.css` content into `src/styles.css` (scoped under a wrapper class to avoid clashing with shadcn tokens).

2. **Port markup to a React route**
   - Replace `src/routes/index.tsx` with the tribute page: convert `index.html` body into JSX components (Loader, Nav, Hero, Timeline, Aircraft, Operations, Tributes, Footer), pulling content from a ported `data.ts`.
   - Update `__root.tsx` `head()` with the tribute meta (title, description, OG, theme color, Google Fonts preconnect + Orbitron/Rajdhani/JetBrains Mono).

3. **Rewrite `script.js` as React hooks**
   - `useLoader` (progress + skip after load)
   - `useScrollProgress` (nav shadow + progress bar)
   - `useReveal` (IntersectionObserver for section reveals)
   - `useActiveSection` (highlights nav link of current section)
   - Sound toggle, timeline interactions, aircraft tabs as local component state.

4. **Smoothness layer**
   - **Scroll**: add `lenis` for inertial smooth scroll; respect `prefers-reduced-motion`; anchor offsets sized to the sticky nav so jumps land cleanly.
   - **Animations**: standardize easings/durations via CSS custom props; promote transforms with `will-change`; debounce scroll handlers via `requestAnimationFrame`.
   - **Performance**: `loading="lazy"` + `decoding="async"` on non-hero images; `<img fetchpriority="high">` + route `head` preload for the hero; defer audio until first user gesture; convert PNGs to WebP/AVIF via `vite-imagetools` for bundled images.
   - **Navigation**: sticky nav with active link highlight, smooth scrollIntoView with offset, mobile hamburger, "Skip intro" button on the loader, scroll-to-top button.

5. **Polish & verify**
   - Check the preview, fix layout/console issues, verify the loader exits, audio gating works, and reveals fire once.

## Technical notes
- New deps: `lenis`, `vite-imagetools`.
- Keep all colors in `src/styles.css` as CSS variables; do not introduce ad-hoc Tailwind color classes.
- Single route (`/`) — this is a one-page tribute, hash anchors are appropriate per the routing guidance for ToC-style nav.
- `jet-flyby.mp3` stays muted until the user toggles sound (autoplay policy + smoother first paint).

## Out of scope
- Backend / Cloud (no data persistence needed).
- Redesign of visual direction — keeping the existing cinematic IAF aesthetic.
