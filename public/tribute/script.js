/* ============================================================
   IAF TRIBUTE — script
   PATCHED FOR PERFORMANCE — see PATCH_NOTES.md for full rationale
   ============================================================ */

// ----- helpers -----
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (n) => n.toLocaleString("en-IN");
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Tiny script loader used to lazy-load heavy third-party libs (Three.js)
// only when the section that needs them is about to enter the viewport.
function loadScriptOnce(src) {
  if (loadScriptOnce._cache && loadScriptOnce._cache[src]) return loadScriptOnce._cache[src];
  loadScriptOnce._cache = loadScriptOnce._cache || {};
  const p = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
  loadScriptOnce._cache[src] = p;
  return p;
}

// ============= GLOBAL 3D / WEBGL CONTEXT BUDGET =============
//
// Browsers cap the number of simultaneous live WebGL contexts a single
// page may hold (Chrome ~16, Firefox/Safari often lower in practice).
// Each embedded Sketchfab iframe is its own full page with its own WebGL
// context, and the hangar section also runs a Three.js canvas — all of
// these draw from the SAME shared browser-wide budget, not independent
// per-section budgets. If the page ever approaches that ceiling, the
// browser silently force-loses the oldest context(s): the model just goes
// blank/grey with no catchable error, which looks identical to "stuck
// loading".
//
// This registry tracks every live 3D surface on the page (fleet card
// iframes, hero iframe, hangar Sketchfab iframe / Three.js canvas, modal
// iframe) under one shared cap, well under the browser ceiling, so we
// proactively free contexts before the browser ever has to.
const GLOBAL_3D_BUDGET = 6; // stay comfortably under typical browser caps (8-16)
const live3DSurfaces = new Map(); // id -> { kind, priority, release: fn, slot }

function register3DSurface(id, { kind, priority = 0, release, slot } = {}) {
  live3DSurfaces.set(id, { kind, priority, release, slot });
  enforceGlobal3DBudget();
}

function unregister3DSurface(id) {
  live3DSurfaces.delete(id);
}

// priority: higher = more important to keep alive (e.g. an open modal or
// the hangar showcase outrank background fleet-grid cards). Lower-priority,
// currently off-screen surfaces are evicted first when over budget.
function enforceGlobal3DBudget() {
  if (live3DSurfaces.size <= GLOBAL_3D_BUDGET) return;
  const candidates = [...live3DSurfaces.entries()]
    // never evict a surface whose slot is currently on-screen
    .filter(([, v]) => !(v.slot && v.slot.dataset && v.slot.dataset.onscreen === "1"))
    .sort((a, b) => a[1].priority - b[1].priority); // lowest priority first

  let over = live3DSurfaces.size - GLOBAL_3D_BUDGET;
  for (const [id, v] of candidates) {
    if (over <= 0) break;
    v.release && v.release();
    live3DSurfaces.delete(id);
    over--;
  }
  // If still over budget, every remaining surface is on-screen — leave
  // them; correctness (don't break what's visible) wins over the soft cap.
}

// ============= LOADER =============
let loaderSkipped = false;
async function runLoader() {
  const fill = $("#loaderBar");
  const pct = $("#loaderPct");
  const loader = $("#loader");
  const skipBtn = $("#loaderSkip");

  const finish = () => {
    if (loaderSkipped) return;
    loaderSkipped = true;
    if (fill) fill.style.width = "100%";
    if (pct) pct.textContent = "100%";
    loader && loader.classList.add("is-done");
  };

  skipBtn && skipBtn.addEventListener("click", finish, { once: true });
  // Safety: auto-skip if anything stalls the boot animation
  const watchdog = setTimeout(finish, 6000);

  let v = 0;
  while (v < 100 && !loaderSkipped) {
    v += Math.random() * 7 + 3;
    if (v > 100) v = 100;
    if (fill) fill.style.width = v + "%";
    if (pct) pct.textContent = Math.round(v) + "%";
    await wait(45);
  }
  await wait(250);
  clearTimeout(watchdog);
  finish();
}

// ============= LENIS SMOOTH SCROLL =============
let lenis;
function initLenis() {
  if (typeof Lenis === "undefined") return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return; // Honour the user's OS-level preference.
  lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
  function raf(t) {
    lenis.raf(t);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  if (window.ScrollTrigger) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Intercept in-page hash links so Lenis owns the easing + nav offset
  const NAV_OFFSET = -88;
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: NAV_OFFSET, duration: 1.2 });
  });
}

// ============= SCROLL-TO-TOP =============
function initScrollTop() {
  const btn = $("#scrollTop");
  if (!btn) return;
  let visible = false;
  const onScroll = () => {
    const should = window.scrollY > 600;
    if (should !== visible) {
      visible = should;
      btn.classList.toggle("is-visible", visible);
    }
  };
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    },
    { passive: true },
  );
  btn.addEventListener("click", () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });
  onScroll();
}

// ============= LAZY IMAGES (gallery / dynamically-rendered) =============
function applyLazyToImages(root = document) {
  root.querySelectorAll("img:not([loading])").forEach((img) => {
    img.loading = "lazy";
    img.decoding = "async";
  });
}

// ============= NAV STATE =============
function initNav() {
  const nav = $("#nav");
  const onScroll = () => {
    if (window.scrollY > 60) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ============= INTERSECTION FADE-INS =============
function initReveal() {
  const els = $$(
    ".fade-up, .fade-left, .fade-right, [data-tilt], .stat-card, .fleet-card, .w-card, .sq-card, .h-card, .tr-card, .t-card, .g-item",
  );
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );
  els.forEach((el, i) => {
    if (
      !el.classList.contains("fade-up") &&
      !el.classList.contains("fade-left") &&
      !el.classList.contains("fade-right")
    ) {
      el.classList.add("fade-up");
    }
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
    io.observe(el);
  });
}

// ============= COUNTERS =============
function initCounters() {
  $$(".counter").forEach((el) => {
    const to = +el.dataset.to;
    const suf = el.dataset.suffix || "";
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            let v = 0,
              start = performance.now(),
              dur = 1800;
            const step = (t) => {
              const p = clamp((t - start) / dur, 0, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              v = Math.floor(to * eased);
              el.textContent = fmt(v) + suf;
              if (p < 1) requestAnimationFrame(step);
              else el.textContent = fmt(to) + suf;
            };
            requestAnimationFrame(step);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
  });
}

// ============= TILT (subtle 3D card tilt) =============
function initTilt() {
  $$("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

// ============= FLEET CARDS · LIVE 3D (PATCHED v3) =============
//
// v1 PROBLEM: every fleet card with a model loaded its own live Sketchfab
// iframe near-instantly on scroll (rootMargin 200px) — up to 6+ concurrent
// WebGL contexts from the fleet grid alone.
//
// v2 PROBLEM (regression): a strict "cap at 2, evict oldest" policy could
// evict a card that was still on screen, and since IntersectionObserver
// only fires on visibility CHANGES, that card never got a signal to
// remount — it stayed stuck on "LOADING 3D" forever.
//
// v3 (this version): fleet cards now register with the page-wide
// GLOBAL_3D_BUDGET registry (see top of file) instead of managing their
// own private cap. This matters because the real constraint is the
// BROWSER's per-page WebGL context limit (Chrome ~16, others often lower),
// shared across the hero iframe, every fleet card, the hangar iframe/canvas,
// and the modal iframe combined — not just the fleet grid in isolation.
// Each fleet-card surface is registered at LOW priority (0) so it's the
// first to be sacrificed if the hangar or modal (HIGH priority) need
// headroom, but — critically — a slot is NEVER evicted while its
// data-onscreen flag is set, so a card the user can currently see always
// keeps its model.
let intersectingSlots = new Set(); // slots currently in viewport (per IO)

function buildSketchfabIframe(id) {
  const ifr = document.createElement("iframe");
  ifr.loading = "lazy";
  ifr.src = `https://sketchfab.com/models/${id}/embed?autospin=0.2&autostart=1&preload=1&transparent=1&ui_theme=dark&ui_infos=0&ui_controls=0&ui_inspector=0&ui_stop=0&ui_watermark_link=0&ui_watermark=0&ui_hint=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_animations=0&dnt=1`;
  ifr.title = "3D model";
  ifr.allow = "autoplay; fullscreen; xr-spatial-tracking";
  ifr.setAttribute("allowfullscreen", "true");
  ifr.setAttribute("mozallowfullscreen", "true");
  ifr.setAttribute("webkitallowfullscreen", "true");
  ifr.setAttribute("execution-while-out-of-viewport", "");
  ifr.setAttribute("execution-while-not-rendered", "");
  ifr.setAttribute("web-share", "");
  return ifr;
}

function mountModel(slot) {
  if (slot.dataset.loaded) return;
  slot.dataset.loaded = "1";
  const ifr = buildSketchfabIframe(slot.dataset.model);
  ifr.addEventListener("load", () => slot.classList.add("is-loaded"));
  slot.appendChild(ifr);

  const surfaceId = "fleet:" + slot.dataset.model + ":" + (slot.dataset.id || Math.random());
  slot.dataset.surfaceId = surfaceId;
  register3DSurface(surfaceId, {
    kind: "fleet-card",
    priority: 0, // lowest priority — sacrificed first under global pressure
    slot,
    release: () => unmountModel(slot),
  });
}

function unmountModel(slot) {
  const ifr = slot.querySelector("iframe");
  if (ifr) ifr.remove();
  slot.classList.remove("is-loaded");
  delete slot.dataset.loaded;
  if (slot.dataset.surfaceId) {
    unregister3DSurface(slot.dataset.surfaceId);
    delete slot.dataset.surfaceId;
  }
}

function renderFleet() {
  const grid = $("#fleetGrid");
  grid.innerHTML = FLEET.map((a) => {
    const has3D = !!a.model;
    const visual = has3D
      ? `<div class="fleet-card__model" data-model="${a.model}">
           <div class="fleet-card__model-loading">
             <span class="loading-radar"></span>
             <span>LOADING 3D · ${a.name.toUpperCase()}</span>
           </div>
         </div>
         <div class="fleet-card__credit">
           <a href="${a.modelUrl}" target="_blank" rel="nofollow noopener">${a.name}</a>
           · by <a href="${a.modelAuthorUrl}" target="_blank" rel="nofollow noopener">${a.modelAuthor}</a> · Sketchfab
         </div>`
      : `<div class="fleet-card__contrail"></div>
         <div class="fleet-card__jet" style="--c1:${a.color};--c2:${a.accent}"></div>`;

    return `
    <article class="fleet-card ${has3D ? "fleet-card--3d" : ""}" data-id="${a.id}" style="--c1:${a.color}40;--c2:${a.accent};--c2-alpha:${a.accent}40">
      <div class="fleet-card__visual">
        <span class="fleet-card__tag">${a.gen}</span>
        <span class="fleet-card__units">${a.units}<small>UNITS</small></span>
        ${visual}
      </div>
      <div class="fleet-card__body">
        <h3 class="fleet-card__name">${a.name}</h3>
        <div class="fleet-card__role">${a.role}</div>
        <div class="fleet-card__specs">
          <div class="fleet-card__spec"><span>Speed</span><strong>${fmt(a.speed)} kmh</strong></div>
          <div class="fleet-card__spec"><span>Range</span><strong>${fmt(a.range)} km</strong></div>
          <div class="fleet-card__spec"><span>Ceiling</span><strong>${fmt(a.ceiling)} m</strong></div>
        </div>
      </div>
    </article>`;
  }).join("");

  // Mount when a card is genuinely about to be seen; unmount (free the
  // WebGL context) once it's confirmed off-screen. data-onscreen is the
  // flag the global budget registry checks before ever evicting a slot,
  // so a card actually in view is never broken out from under the user.
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const slot = e.target;
        if (e.isIntersecting) {
          slot.dataset.onscreen = "1";
          intersectingSlots.add(slot);
          mountModel(slot);
        } else {
          delete slot.dataset.onscreen;
          intersectingSlots.delete(slot);
          if (slot.dataset.loaded) unmountModel(slot);
        }
      });
    },
    { rootMargin: "150px", threshold: 0.01 },
  );

  $$(".fleet-card__model").forEach((el) => io.observe(el));

  grid.addEventListener("click", (e) => {
    // don't open modal when interacting with the embedded 3D viewer or credit
    if (
      e.target.closest("iframe") ||
      e.target.closest(".fleet-card__credit") ||
      e.target.closest(".fleet-card__model")
    )
      return;
    const card = e.target.closest(".fleet-card");
    if (!card) return;
    openFleetModal(card.dataset.id);
  });
}

function openFleetModal(id) {
  const a = FLEET.find((x) => x.id === id);
  if (!a) return;
  const body = $("#modalBody");
  body.className = "modal-body";

  // Real 3D Sketchfab embed for aircraft that have a model id
  const visual = a.model
    ? `<div class="mb-visual mb-visual--3d">
         <iframe
           title="${a.name} · 3D Model"
           src="https://sketchfab.com/models/${a.model}/embed?autospin=0.3&autostart=1&preload=1&transparent=1&ui_theme=dark&ui_infos=0&ui_watermark_link=0&ui_watermark=0&ui_hint=0&dnt=1"
           frameborder="0"
           allow="autoplay; fullscreen; xr-spatial-tracking"
           allowfullscreen
           mozallowfullscreen="true"
           webkitallowfullscreen="true"
           execution-while-out-of-viewport
           execution-while-not-rendered
           web-share
         ></iframe>
         <div class="mb-visual__credit">
           <a href="${a.modelUrl}" target="_blank" rel="nofollow noopener">${a.name}</a>
           by <a href="${a.modelAuthorUrl}" target="_blank" rel="nofollow noopener">${a.modelAuthor}</a>
           on Sketchfab
         </div>
       </div>`
    : `<div class="mb-visual" style="--c1:${a.color};--c2:${a.accent}"></div>`;

  body.innerHTML = `
    <div class="mb-role">${a.gen} · ${a.role}</div>
    <h3>${a.name}</h3>
    ${visual}
    <p>${a.blurb}</p>
    <div class="mb-grid">
      <div><span>Top Speed</span><strong>${fmt(a.speed)} km/h</strong></div>
      <div><span>Range</span><strong>${fmt(a.range)} km</strong></div>
      <div><span>Ceiling</span><strong>${fmt(a.ceiling)} m</strong></div>
      <div><span>Crew</span><strong>${a.crew}</strong></div>
      <div><span>Inducted</span><strong>${a.intro}</strong></div>
      <div><span>Units · IAF</span><strong>${a.units}</strong></div>
      <div style="grid-column:1 / -1"><span>Manufacturer</span><strong>${a.manufacturer}</strong></div>
      <div style="grid-column:1 / -1"><span>Primary Armament</span><strong>${a.weapons}</strong></div>
    </div>
  `;
  $("#modal").classList.add("is-open");
  document.body.style.overflow = "hidden";

  // The modal's 3D viewer is the most important surface on screen right
  // now — register it at HIGH priority so it's never sacrificed, and free
  // up budget by unmounting every background fleet-card surface (they're
  // covered by the modal anyway, so there's nothing lost visually).
  if (a.model) {
    register3DSurface("modal:" + a.id, { kind: "modal", priority: 10 });
  }
  [...live3DSurfaces.entries()]
    .filter(([id, v]) => v.kind === "fleet-card")
    .forEach(([, v]) => v.release && v.release());
}
$("#modal").addEventListener("click", (e) => {
  if (e.target.dataset.close !== undefined || e.target.closest("[data-close]")) {
    $("#modal").classList.remove("is-open");
    document.body.style.overflow = "";
    // Free the modal's own surface slot now that it's closed.
    [...live3DSurfaces.keys()]
      .filter((id) => id.startsWith("modal:"))
      .forEach((id) => unregister3DSurface(id));
    // Re-mount any fleet cards that are currently visible but were force-
    // unmounted while the modal was open — the IntersectionObserver won't
    // refire for them since their visibility never actually changed.
    intersectingSlots.forEach((slot) => mountModel(slot));
  }
});

// ============= DASHBOARD =============
function renderDash() {
  const bars = $("#dashBars");
  const rows = [
    { label: "Fighters", v: 540, max: 600, c: "#ff9933" },
    { label: "Transport", v: 250, max: 600, c: "#5fb8ff" },
    { label: "Helicopters", v: 360, max: 600, c: "#138808" },
    { label: "Trainers", v: 220, max: 600, c: "#ffd166" },
    { label: "Special Ops/EW", v: 95, max: 600, c: "#c9a7ff" },
  ];
  bars.innerHTML = rows
    .map(
      (r) => `
    <div class="bar">
      <span class="bar__label">${r.label}</span>
      <div class="bar__track"><div class="bar__fill" data-w="${((r.v / r.max) * 100).toFixed(0)}" style="background:linear-gradient(90deg,${r.c}, ${r.c}99)"></div></div>
      <span class="bar__val">${r.v}</span>
    </div>
  `,
    )
    .join("");

  // gradient defs for ring
  const svg = $(".ring svg");
  if (svg && !svg.querySelector("defs")) {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `<linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ff9933"/><stop offset="50%" stop-color="#ffd166"/><stop offset="100%" stop-color="#138808"/>
    </linearGradient>`;
    svg.prepend(defs);
  }

  // line chart with gradient
  const data = [
    42, 58, 51, 70, 65, 82, 88, 72, 91, 86, 95, 89, 102, 98, 108, 112, 105, 118, 124, 119, 132, 128,
    140, 136, 148, 152, 144, 159, 162, 168,
  ];
  const w = 400,
    h = 160,
    pad = 10;
  const min = Math.min(...data),
    max = Math.max(...data);
  const px = (i) => pad + (i / (data.length - 1)) * (w - 2 * pad);
  const py = (v) => h - pad - ((v - min) / (max - min)) * (h - 2 * pad);
  const pts = data.map((v, i) => `${px(i)},${py(v)}`).join(" ");
  const line = $("#lineChart");
  line.innerHTML = `
    <defs>
      <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ff9933" stop-opacity=".7"/>
        <stop offset="100%" stop-color="#ff9933" stop-opacity="0"/>
      </linearGradient>
    </defs>
    ${[0, 40, 80, 120].map((y) => `<line class="grid" x1="0" y1="${y}" x2="${w}" y2="${y}"/>`).join("")}
    <polygon class="area" points="${pad},${h - pad} ${pts} ${w - pad},${h - pad}"/>
    <polyline class="stroke" points="${pts}"/>
    ${data
      .filter((_, i) => i % 4 === 0)
      .map((v, i) => `<circle class="pt" cx="${px(i * 4)}" cy="${py(v)}" r="3"/>`)
      .join("")}
  `;

  // animate when in view
  const io = new IntersectionObserver(
    (es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        $$(".bar__fill").forEach((b) => (b.style.width = b.dataset.w + "%"));
        const fg = $("#ringFg");
        if (fg) fg.style.strokeDashoffset = 314 * (1 - 0.91);
        const v = $("#ringVal");
        let p = 0;
        const target = 91;
        const tick = () => {
          p += 2;
          if (p > target) p = target;
          v.textContent = p + "%";
          if (p < target) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      });
    },
    { threshold: 0.3 },
  );
  io.observe($("#dash"));
}

// ============= TIMELINE =============
function renderTimeline() {
  $("#timelineTrack").innerHTML = TIMELINE.map(
    (t) => `
    <article class="t-card">
      <div class="t-card__year">${t.year}</div>
      <span class="t-card__tag">${t.tag}</span>
      <h3 class="t-card__title">${t.title}</h3>
      <p class="t-card__body">${t.body}</p>
      <div class="t-card__corner"></div>
    </article>
  `,
  ).join("");
}

// ============= WARRIORS =============
function renderWarriors() {
  $("#warriorsGrid").innerHTML = WARRIORS.map(
    (w) => `
    <article class="w-card" style="--wc:${w.color}">
      <div class="w-card__medal">
        <div class="w-card__medal-icon"></div>
        <span>${w.medal.split(" ")[0]}</span>
      </div>
      <div class="w-card__portrait">${w.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)}</div>
      <h3 class="w-card__name">${w.name}</h3>
      <div class="w-card__rank">${w.rank}</div>
      <div class="w-card__years">${w.years}</div>
      <p class="w-card__bio">${w.bio}</p>
    </article>
  `,
  ).join("");
}

// ============= SQUADRONS =============
function renderSquadrons() {
  $("#squadronsGrid").innerHTML = SQUADRONS.map(
    (s) => `
    <article class="sq-card" style="--sc:${s.color}">
      <div class="sq-card__num">${s.num}</div>
      <div class="sq-emblem">${s.num}</div>
      <h3 class="sq-card__name">${s.name}</h3>
      <div class="sq-card__motto">"${s.motto}"</div>
      <div class="sq-card__meta">
        <div><span>BASE</span><strong>${s.base}</strong></div>
        <div><span>AIRCRAFT</span><strong>${s.aircraft}</strong></div>
      </div>
    </article>
  `,
  ).join("");
}

// ============= MISSION CONTROL FEED =============
function initMissionFeed() {
  const ul = $("#commFeed");
  let i = 0;
  const push = () => {
    const line = COMM_LINES[i++ % COMM_LINES.length];
    const li = document.createElement("li");
    const t = new Date();
    const hh = String(t.getHours()).padStart(2, "0"),
      mm = String(t.getMinutes()).padStart(2, "0"),
      ss = String(t.getSeconds()).padStart(2, "0");
    li.innerHTML = `<time>${hh}:${mm}:${ss}</time><span>${line}</span>`;
    ul.prepend(li);
    while (ul.children.length > 7) ul.lastChild.remove();
  };
  for (let n = 0; n < 5; n++) push();
  setInterval(push, 2400);

  const a = $("#msA"),
    b = $("#msB"),
    c = $("#msC");
  setInterval(() => {
    a.textContent = 38 + Math.floor(Math.random() * 6);
    b.textContent = 12 + Math.floor(Math.random() * 8);
    c.textContent = 4 + Math.floor(Math.random() * 3);
  }, 1800);
}

// ============= BASES MAP =============
function renderBases() {
  const map = $("#basesMap");
  // Use the uploaded minimalist map design, styled with CSS to glow tactically
  map.insertAdjacentHTML(
    "beforeend",
    `
    <img src="/tribute/assets/india-map.png" class="india-map-img" alt="India Map Outline" loading="lazy" decoding="async" />
    <div class="bases__radar"></div>
  `,
  );

  BASES.forEach((b, i) => {
    const el = document.createElement("button");
    el.className = "base-marker";
    el.style.left = b.lon + "%";
    el.style.top = b.lat + "%";
    el.dataset.i = i;
    el.title = b.name;
    map.appendChild(el);
  });

  const detail = $("#baseDetail");
  const setBase = (b) => {
    detail.innerHTML = `
      <span class="section-eyebrow">// ${b.cmd.toUpperCase()} COMMAND</span>
      <h3>${b.name}</h3>
      <p>${b.role}. Forward operating station integrated with the IAF's integrated air command and control system (IACCS).</p>
      <div class="bd-row"><span>COMMAND</span><strong>${b.cmd}</strong></div>
      <div class="bd-row"><span>PRIMARY PLATFORM</span><strong>${b.acft}</strong></div>
      <div class="bd-row"><span>STATUS</span><strong style="color:var(--india-green-soft)">ACTIVE</strong></div>
      <div class="bd-row"><span>READINESS</span><strong style="color:var(--hud)">GREEN · OPS</strong></div>
    `;
  };

  map.addEventListener("mouseover", (e) => {
    const m = e.target.closest(".base-marker");
    if (!m) return;
    $$(".base-marker", map).forEach((x) => x.classList.remove("active"));
    m.classList.add("active");
    setBase(BASES[+m.dataset.i]);
  });
  map.addEventListener("click", (e) => {
    const m = e.target.closest(".base-marker");
    if (!m) return;
    $$(".base-marker", map).forEach((x) => x.classList.remove("active"));
    m.classList.add("active");
    setBase(BASES[+m.dataset.i]);
  });
}

// ============= COMPARE =============
function renderCompare() {
  const A = $("#cmpA"),
    B = $("#cmpB");
  const opts = FLEET.map((a, i) => `<option value="${i}">${a.name}</option>`).join("");
  A.innerHTML = opts;
  B.innerHTML = opts;
  A.value = 0;
  B.value = 1;
  const render = () => {
    const a = FLEET[+A.value],
      b = FLEET[+B.value];
    const card = (x) => `
      <h4>${x.name}</h4>
      <small>${x.role} · ${x.gen}</small>
      <p>${x.blurb}</p>
    `;
    $("#cardA").innerHTML = card(a);
    $("#cardA").style.borderTop = `3px solid ${a.accent}`;
    $("#cardB").innerHTML = card(b);
    $("#cardB").style.borderTop = `3px solid ${b.accent}`;

    const rows = [
      ["Speed (km/h)", a.speed, b.speed, 2500],
      ["Range (km)", a.range, b.range, 11000],
      ["Ceiling (m)", a.ceiling, b.ceiling, 18000],
      ["IAF Units", a.units, b.units, 300],
    ];
    $("#compareBars").innerHTML = rows
      .map(
        ([label, va, vb, mx]) => `
      <div class="cbar">
        <span style="text-align:right;color:#fff;font-family:'Orbitron',sans-serif">${fmt(va)}</span>
        <div class="cbar__l"><i style="width:${((va / mx) * 100).toFixed(1)}%"></i></div>
        <div class="cbar__r"><i style="width:${((vb / mx) * 100).toFixed(1)}%"></i></div>
        <span style="color:#fff;font-family:'Orbitron',sans-serif">${fmt(vb)}</span>
      </div>
      <div class="cbar__label" style="grid-column:1/-1;text-align:center;margin-top:-8px;margin-bottom:8px">${label}</div>
    `,
      )
      .join("");
  };
  A.addEventListener("change", render);
  B.addEventListener("change", render);
  render();
}

// ============= HUMANITARIAN =============
function renderHumanitarian() {
  $("#humanitarianGrid").innerHTML = HUMANITARIAN.map(
    (h) => `
    <article class="h-card">
      <div class="h-card__year">${h.year}</div>
      <h3 class="h-card__name">${h.name}</h3>
      <div class="h-card__loc">${h.loc}</div>
      <p class="h-card__body">${h.body}</p>
      <span class="h-card__stat">${h.stat}</span>
    </article>
  `,
  ).join("");
}

// ============= HANGAR 3D (PATCHED) =============
//
// PROBLEM: this section ran its own Three.js renderer raf loop forever,
// even while:
//   a) a Sketchfab iframe was shown on top of it (canvas hidden but still
//      rendering every frame underneath), and
//   b) the section had scrolled completely off screen.
// Also, three.js (~600KB) was loaded eagerly on first paint even for
// visitors who never scroll this far.
//
// FIX:
//   1. three.js is now lazy-loaded only when #hangar nears the viewport.
//   2. The Three.js raf loop is paused whenever a Sketchfab iframe is shown,
//      and resumed only for fallback (non-Sketchfab) aircraft.
//   3. The raf loop is paused entirely when #hangar scrolls off screen, and
//      resumed when it scrolls back in — regardless of which visual (canvas
//      or iframe) is active.
let hangarInitialized = false;

function initHangarLazyLoader() {
  const section = $("#hangar");
  if (!section) return;
  const io = new IntersectionObserver(
    async (entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      try {
        if (typeof THREE === "undefined") {
          await loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js");
        }
        initHangar();
      } catch (err) {
        console.warn("Hangar 3D failed to initialize", err);
      }
    },
    { rootMargin: "300px" },
  );
  io.observe(section);
}

function initHangar() {
  if (hangarInitialized) return;
  hangarInitialized = true;

  const canvas = $("#hangarCanvas");
  if (!canvas || typeof THREE === "undefined") return;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  };

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07182f, 0.06);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 1.5, 7);

  scene.add(new THREE.HemisphereLight(0xff9933, 0x07182f, 0.6));
  const spot = new THREE.SpotLight(0xffffff, 1.5, 30, Math.PI / 6, 0.4);
  spot.position.set(0, 6, 4);
  scene.add(spot);
  const fill = new THREE.DirectionalLight(0x5fb8ff, 0.5);
  fill.position.set(-5, 2, -3);
  scene.add(fill);

  // floor (reflective-ish)
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ color: 0x0a1628, metalness: 0.7, roughness: 0.3 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.8;
  scene.add(floor);

  // single re-usable jet model
  const colors = [0x5fb8ff, 0xff7a59, 0xffb43d, 0xffd166];
  const jets = colors.map((c) => buildJet(c));
  jets.forEach((j, i) => {
    j.visible = i === 0;
    scene.add(j);
  });

  function buildJet(c) {
    const g = new THREE.Group();
    const body = new THREE.MeshStandardMaterial({ color: c, metalness: 0.8, roughness: 0.35 });
    const dark = new THREE.MeshStandardMaterial({
      color: 0x101820,
      metalness: 0.9,
      roughness: 0.2,
    });
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, 4, 18), body);
    f.rotation.z = Math.PI / 2;
    g.add(f);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1, 16), body);
    nose.rotation.z = -Math.PI / 2;
    nose.position.x = 2.5;
    g.add(nose);
    const can = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      dark,
    );
    can.position.set(1.2, 0.2, 0);
    can.scale.set(2, 0.6, 1);
    g.add(can);
    // wings
    const wShape = new THREE.Shape();
    wShape.moveTo(0, 0);
    wShape.lineTo(0, 0.4);
    wShape.lineTo(2.6, 1.6);
    wShape.lineTo(2.8, 1.6);
    wShape.lineTo(0.4, 0);
    wShape.lineTo(0, 0);
    const wGeo = new THREE.ExtrudeGeometry(wShape, { depth: 0.07, bevelEnabled: false });
    const wL = new THREE.Mesh(wGeo, body);
    wL.rotation.x = -Math.PI / 2;
    wL.position.set(-0.4, 0, 0.04);
    const wR = wL.clone();
    wR.scale.z = -1;
    wR.position.z = -0.04;
    g.add(wL, wR);
    const tShape = new THREE.Shape();
    tShape.moveTo(0, 0);
    tShape.lineTo(0, 1);
    tShape.lineTo(0.7, 1);
    tShape.lineTo(1, 0);
    tShape.lineTo(0, 0);
    const tGeo = new THREE.ExtrudeGeometry(tShape, { depth: 0.06, bevelEnabled: false });
    const tail = new THREE.Mesh(tGeo, body);
    tail.rotation.y = Math.PI / 2;
    tail.position.set(-1.8, 0.05, 0.03);
    g.add(tail);
    // exhaust
    const ex = new THREE.Mesh(
      new THREE.CircleGeometry(0.16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff9933 }),
    );
    ex.position.set(-2.05, 0, 0);
    ex.rotation.y = -Math.PI / 2;
    g.add(ex);
    g.scale.setScalar(0.7);
    return g;
  }

  let current = 0;
  const canvasEl = canvas;
  const sf = document.getElementById("hangarSketchfab");
  const sfCredit = document.getElementById("hangarCredit");
  const labels = [
    "RAFALE · OMNIROLE",
    "SU-30 MKI · AIR DOMINANCE",
    "TEJAS · INDIGENOUS LCA",
    "MIRAGE 2000 · VAJRA",
  ];

  // --- raf loop control (patched) ---
  let rafId = null;
  let sectionVisible = true; // visibility observer below keeps this in sync
  let canvasActive = true; // false while a Sketchfab iframe is shown instead

  function loop(now) {
    const t = now * 0.001;
    jets.forEach((j) => {
      j.rotation.y = t * 0.4;
      j.position.y = Math.sin(t) * 0.15;
    });
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(loop);
  }
  function startLoop() {
    if (rafId === null && sectionVisible && canvasActive) {
      rafId = requestAnimationFrame(loop);
    }
  }
  function stopLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  const showSketchfab = (acft) => {
    // Free the previous hangar surface registration before switching models.
    unregister3DSurface("hangar:active");

    if (!sf || !acft || !acft.model) {
      // No model id available — fall back to the procedural Three.js jet.
      canvasActive = true;
      canvasEl.style.visibility = "visible";
      if (sf) sf.hidden = true;
      if (sfCredit) sfCredit.hidden = true;
      startLoop();
      return false;
    }
    const url = `https://sketchfab.com/models/${acft.model}/embed?autospin=0.3&autostart=1&preload=1&transparent=1&ui_theme=dark&ui_infos=0&ui_watermark_link=0&ui_watermark=0&ui_hint=0&dnt=1`;
    if (sf.src !== url) sf.src = url;
    sf.hidden = false;
    sfCredit.innerHTML = `
      <a href="${acft.modelUrl}" target="_blank" rel="nofollow noopener">${acft.name}</a>
      by <a href="${acft.modelAuthorUrl}" target="_blank" rel="nofollow noopener">${acft.modelAuthor}</a> · Sketchfab`;
    sfCredit.hidden = false;
    canvasEl.style.visibility = "hidden";
    // The Sketchfab iframe handles its own rendering — stop burning frames
    // on the hidden Three.js canvas underneath it.
    canvasActive = false;
    stopLoop();

    // The hangar is a primary interactive showcase — register it HIGH
    // priority on the shared global budget so background fleet-grid cards
    // get sacrificed first if the page is near the browser's WebGL limit.
    register3DSurface("hangar:active", {
      kind: "hangar",
      priority: 8,
      release: () => {
        sf.hidden = true;
        sfCredit.hidden = true;
      },
    });
    return true;
  };

  // Map rail index -> FLEET id
  const byId = (id) => FLEET.find((x) => x.id === id);
  const buttons = $$(".hangar__rail button");

  // Boot in the active state
  const bootBtn = buttons.find((b) => b.classList.contains("active")) || buttons[0];
  showSketchfab(byId(bootBtn.dataset.model));
  $("#hangarLabel").textContent = labels[+bootBtn.dataset.h] || "";

  buttons.forEach((b) => {
    b.addEventListener("click", () => {
      buttons.forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      const next = +b.dataset.h;
      $("#hangarLabel").textContent = labels[next];
      const acft = byId(b.dataset.model);
      showSketchfab(acft);
    });
  });

  // Pause everything when the hangar section is off-screen, resume when
  // it's back — saves GPU work while users browse other sections.
  const visIo = new IntersectionObserver(
    ([entry]) => {
      sectionVisible = entry.isIntersecting;
      if (sectionVisible) startLoop();
      else stopLoop();
    },
    { threshold: 0.05 },
  );
  visIo.observe($("#hangar"));

  resize();
  window.addEventListener("resize", resize);
}

// ============= COCKPIT HUD =============
function initCockpit() {
  const stage = $(".cockpit__stage");
  const compass = $("#hudCompass");
  if (!compass || !stage) return;

  const dirs = ["N", "30", "60", "E", "120", "150", "S", "210", "240", "W", "300", "330"];
  compass.innerHTML = dirs
    .concat(dirs)
    .map((d) => `<span style="display:inline-block;padding:0 22px">${d}</span>`)
    .join("");

  const knots = $("#hudKnots"),
    alt = $("#hudAlt2"),
    horizon = $("#hudHorizon");
  const hud = $(".cockpit__hud");
  const frame = $(".cockpit__frame");

  let h = 90,
    k = 820,
    a = 38420,
    roll = 0,
    pitch = 0;
  let mouseX = 0,
    mouseY = 0,
    targetX = 0,
    targetY = 0;

  // Mouse tracking for parallax and HUD control
  stage.addEventListener("mousemove", (e) => {
    const rect = stage.getBoundingClientRect();
    targetX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    targetY = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
  });

  stage.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
  });

  // Add dynamic background image (dramatic first-person cockpit dogfight view from uploaded asset)
  stage.style.backgroundImage = `url('/tribute/assets/cockpit-bg.png')`;
  stage.style.backgroundSize = "cover";
  stage.style.backgroundPosition = "center 30%";
  stage.style.backgroundBlendMode = "normal";

  // Add subtle grain/noise overlay for realism
  const grain = document.createElement("div");
  grain.className = "cockpit__grain";
  stage.appendChild(grain);

  // PATCHED: pause the interval-driven HUD updates when this section is
  // off-screen instead of letting setInterval tick forever in the background.
  let updateInterval = null;
  const tick = () => {
    // Smooth interpolation for mouse position
    mouseX = lerp(mouseX, targetX, 0.08);
    mouseY = lerp(mouseY, targetY, 0.08);

    // Update HUD values based on mouse position for interactive feel
    h = (90 + mouseX * 60 + (Math.random() - 0.5) * 2 + 360) % 360;
    k = clamp(820 + mouseX * 200 + (Math.random() - 0.5) * 10, 720, 1180);
    a = clamp(38420 - mouseY * 5000 + (Math.random() - 0.5) * 80, 30000, 45000);

    roll = Math.sin(performance.now() * 0.0008) * 12 + mouseX * 8;
    pitch = Math.sin(performance.now() * 0.0006) * 6 + mouseY * 4;

    knots.textContent = Math.round(k);
    alt.textContent = Math.round(a);
    compass.style.transform = `translateX(${-h * 1.8}px)`;
    horizon.style.transform = `rotate(${-roll}deg) translateY(${pitch}px)`;

    // Parallax effect on HUD elements
    if (hud) {
      hud.style.transform = `translate(${mouseX * -15}px, ${mouseY * -15}px)`;
    }
    if (frame) {
      frame.style.transform = `translate(${mouseX * 8}px, ${mouseY * 8}px) scale(1.02)`;
    }
  };

  const startTicking = () => {
    if (!updateInterval) updateInterval = setInterval(tick, 100);
  };
  const stopTicking = () => {
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) startTicking();
      else stopTicking();
    },
    { threshold: 0.05 },
  );
  io.observe(stage);
}

// ============= GALLERY =============
function renderGallery() {
  const tabs = $("#galleryTabs");
  const grid = $("#galleryGrid");
  const cats = ["All", ...new Set(GALLERY.map((g) => g.cat))];
  tabs.innerHTML = cats
    .map((c, i) => `<button class="${i === 0 ? "active" : ""}" data-cat="${c}">${c}</button>`)
    .join("");
  const draw = (cat) => {
    const items = cat === "All" ? GALLERY : GALLERY.filter((g) => g.cat === cat);
    grid.innerHTML = items
      .map(
        (g, i) => `
      <figure class="g-item" style="--c1:${g.tint[0]};--c2:${g.tint[1]};--ar:${[3 / 4, 4 / 3, 1, 5 / 4, 4 / 5][i % 5]}">
        <div class="g-item__visual" style="background-image: url('${g.image}')"></div>
        <figcaption class="g-item__overlay"><span>${g.cat}</span><strong>${g.label}</strong></figcaption>
      </figure>
    `,
      )
      .join("");
  };
  draw("All");
  tabs.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    $$("button", tabs).forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    draw(b.dataset.cat);
  });
}

// ============= TRIBUTE WALL =============
function renderTributes() {
  $("#tributeGrid").innerHTML = TRIBUTES.map(
    (t) => `
    <article class="tr-card">
      <p class="tr-card__msg">${t.msg}</p>
      <div class="tr-card__name">${t.name}</div>
    </article>
  `,
  ).join("");
}

// ============= SECTION TITLE FADE WRAPPING =============
function tagFadeUp() {
  $$(".section-head, .about__copy, .about__visual").forEach((el) => el.classList.add("fade-up"));
}

// ============= GSAP PARALLAX =============
function initGsap() {
  if (typeof gsap === "undefined" || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // hero subtle parallax
  gsap.to(".hero__clouds", {
    yPercent: 30,
    ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero__content", {
    yPercent: 25,
    opacity: 0.6,
    ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
  });

  // quote parallax
  gsap.to(".quote__formation", {
    yPercent: -40,
    ease: "none",
    scrollTrigger: { trigger: "#quote", start: "top bottom", end: "bottom top", scrub: true },
  });
}

// ============= BOOT =============
window.addEventListener("DOMContentLoaded", async () => {
  // The hero's Sketchfab iframe is present in the static HTML from the
  // moment the page loads and is never removed — register it so the
  // global budget accounts for it from the start, the same as any other
  // 3D surface on the page.
  register3DSurface("hero:static", { kind: "hero", priority: 10 });

  renderFleet();
  renderDash();
  renderTimeline();
  renderWarriors();
  renderSquadrons();
  renderHumanitarian();
  renderGallery();
  renderTributes();
  renderBases();
  renderCompare();

  tagFadeUp();
  initNav();
  initReveal();
  initCounters();
  initTilt();
  initMissionFeed();
  initCockpit();

  // PATCHED:
  // - initHero3D() removed entirely. The hero already shows a live Sketchfab
  //   iframe (see .hero__model in index.html); the old custom Three.js scene
  //   targeted a #heroCanvas element that doesn't exist in the current markup,
  //   so it was pure wasted GPU/CPU work running an extra render loop with
  //   400 particles for nothing visible.
  // - initHangar() is no longer called eagerly. It's lazy-loaded (along with
  //   three.js itself) only once the hangar section nears the viewport.
  initHangarLazyLoader();

  initLenis();
  initGsap();
  initScrollTop();
  applyLazyToImages();

  await runLoader();
});
