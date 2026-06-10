/* ============================================================
   IAF TRIBUTE — script
   ============================================================ */

// ----- helpers -----
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const fmt = (n) => n.toLocaleString('en-IN');
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ============= LOADER =============
let loaderSkipped = false;
async function runLoader() {
  const fill = $('#loaderBar');
  const pct  = $('#loaderPct');
  const loader = $('#loader');
  const skipBtn = $('#loaderSkip');

  const finish = () => {
    if (loaderSkipped) return;
    loaderSkipped = true;
    if (fill) fill.style.width = '100%';
    if (pct) pct.textContent = '100%';
    // Lazy-bind audio src + play on the first user gesture only
    const jetAudio = $('#jetAudio');
    if (jetAudio && jetAudio.dataset.src && !jetAudio.src) {
      jetAudio.src = jetAudio.dataset.src;
      jetAudio.volume = 0.45;
    }
    const tryPlay = () => { jetAudio && jetAudio.play().catch(() => {}); };
    document.addEventListener('pointerdown', tryPlay, { once: true });
    document.addEventListener('keydown', tryPlay, { once: true });
    loader && loader.classList.add('is-done');
  };

  skipBtn && skipBtn.addEventListener('click', finish, { once: true });
  // Safety: auto-skip if anything stalls the boot animation
  const watchdog = setTimeout(finish, 6000);

  let v = 0;
  while (v < 100 && !loaderSkipped) {
    v += Math.random() * 7 + 3;
    if (v > 100) v = 100;
    if (fill) fill.style.width = v + '%';
    if (pct) pct.textContent = Math.round(v) + '%';
    await wait(45);
  }
  await wait(250);
  clearTimeout(watchdog);
  finish();
}


// engine audio toggle (clean synthesized tone - no vibration)
(function engineAudio(){
  const btn = $('#soundToggle');
  let ctx, osc1, osc2, gain, on = false;
  btn?.addEventListener('click', () => {
    on = !on;
    btn.style.background = on ? 'rgba(126,247,200,.2)' : 'transparent';
    btn.style.boxShadow  = on ? '0 0 18px rgba(126,247,200,.5)' : 'none';
    if (on) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create a smooth, clean engine drone (two sine waves for richness)
      gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);
      
      // Base frequency - smooth sine
      osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 80;
      osc1.connect(gain);
      osc1.start();
      
      // Slightly higher harmonic for depth
      osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 120;
      const gain2 = ctx.createGain();
      gain2.gain.value = 0.5;
      osc2.connect(gain2);
      gain2.connect(gain);
      osc2.start();
      
      // Smooth fade in
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.5);
    } else if (ctx) {
      // Smooth fade out
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      setTimeout(() => {
        osc1.stop();
        osc2.stop();
        ctx.close();
      }, 600);
    }
  });
})();

// ============= LENIS SMOOTH SCROLL =============
let lenis;
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  if (window.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}

// ============= HERO 3D SCENE (Three.js) =============
function initHero3D() {
  const canvas = $('#heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a1628, 0.02);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 1.2, 8);
  camera.lookAt(0, 0, 0);

  // lights
  scene.add(new THREE.HemisphereLight(0xffd1a4, 0x0a1628, 0.7));
  const key = new THREE.DirectionalLight(0xffd1a4, 1.4); key.position.set(5, 4, 3); scene.add(key);
  const rim = new THREE.DirectionalLight(0x5fb8ff, 0.8); rim.position.set(-5, 2, -3); scene.add(rim);

  // Aircraft (procedural fighter jet — fuselage, wings, tail, engines)
  const jet = new THREE.Group();
  const matBody = new THREE.MeshStandardMaterial({ color: 0xb6c5d4, metalness: 0.85, roughness: 0.3 });
  const matDark = new THREE.MeshStandardMaterial({ color: 0x2a3a4a, metalness: 0.9, roughness: 0.25 });
  const matCanopy = new THREE.MeshStandardMaterial({ color: 0x0a1628, metalness: 0.95, roughness: 0.05, emissive: 0x113355, emissiveIntensity: 0.6 });
  const matGlow = new THREE.MeshBasicMaterial({ color: 0xff9933 });

  // fuselage
  const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 3.8, 18), matBody);
  fuselage.rotation.z = Math.PI / 2;
  jet.add(fuselage);
  // nose cone
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.9, 16), matBody);
  nose.rotation.z = -Math.PI / 2; nose.position.x = 2.35; jet.add(nose);
  // canopy
  const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12, 0, Math.PI*2, 0, Math.PI/2), matCanopy);
  canopy.position.set(1.1, 0.18, 0); canopy.scale.set(1.8, 0.6, 0.9); jet.add(canopy);
  // main wings (delta)
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0); wingShape.lineTo(0, 0.3); wingShape.lineTo(2.4, 1.5); wingShape.lineTo(2.6, 1.5); wingShape.lineTo(0.4, 0); wingShape.lineTo(0, 0);
  const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.06, bevelEnabled: false });
  const wingL = new THREE.Mesh(wingGeo, matBody); wingL.rotation.x = -Math.PI / 2; wingL.position.set(-0.6, 0, 0.04); wingL.scale.z = 1;
  const wingR = wingL.clone(); wingR.scale.z = -1; wingR.position.z = -0.04;
  jet.add(wingL, wingR);
  // tail fin
  const tailShape = new THREE.Shape();
  tailShape.moveTo(0,0); tailShape.lineTo(0,0.9); tailShape.lineTo(0.7,0.9); tailShape.lineTo(1,0); tailShape.lineTo(0,0);
  const tailGeo = new THREE.ExtrudeGeometry(tailShape, { depth: 0.05, bevelEnabled: false });
  const tail = new THREE.Mesh(tailGeo, matBody); tail.rotation.y = Math.PI/2; tail.position.set(-1.7, 0.05, 0.025); jet.add(tail);
  // horizontal stabilizers
  const hsShape = new THREE.Shape();
  hsShape.moveTo(0,0); hsShape.lineTo(0,0.2); hsShape.lineTo(0.7,0.6); hsShape.lineTo(0.8,0.6); hsShape.lineTo(0.25,0); hsShape.lineTo(0,0);
  const hsGeo = new THREE.ExtrudeGeometry(hsShape, { depth: 0.05, bevelEnabled: false });
  const hsL = new THREE.Mesh(hsGeo, matBody); hsL.rotation.x = -Math.PI/2; hsL.position.set(-1.7, 0, 0.04);
  const hsR = hsL.clone(); hsR.scale.z = -1; hsR.position.z = -0.04;
  jet.add(hsL, hsR);
  // engine glows
  const exhaustL = new THREE.Mesh(new THREE.CircleGeometry(0.14, 16), matGlow);
  exhaustL.position.set(-1.92, 0, 0.15); exhaustL.rotation.y = -Math.PI/2;
  const exhaustR = exhaustL.clone(); exhaustR.position.z = -0.15;
  jet.add(exhaustL, exhaustR);

  jet.scale.setScalar(0.65);
  jet.position.set(0, 0.2, 0);
  jet.rotation.y = -0.25;
  scene.add(jet);

  // Particles — atmospheric dust
  const pGeo = new THREE.BufferGeometry();
  const pCnt = 400;
  const pPos = new Float32Array(pCnt * 3);
  for (let i = 0; i < pCnt; i++) {
    pPos[i*3+0] = (Math.random() - 0.5) * 40;
    pPos[i*3+1] = (Math.random() - 0.5) * 20;
    pPos[i*3+2] = (Math.random() - 0.5) * 20 - 5;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.6, sizeAttenuation: true });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Contrail (line trail behind jet)
  const trailMax = 60;
  const trailGeo = new THREE.BufferGeometry();
  const trailPos = new Float32Array(trailMax * 3);
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
  const trailMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
  const trail = new THREE.Line(trailGeo, trailMat);
  scene.add(trail);
  const trailPts = [];

  // mouse parallax
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('mousemove', e => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5);
    mouse.ty = (e.clientY / window.innerHeight - 0.5);
  });
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  let t0 = performance.now();
  function loop(now) {
    const dt = Math.min(33, now - t0) / 1000; t0 = now;
    const t = now * 0.001;

    // Jet path — figure-eight flight
    jet.position.x = Math.sin(t * 0.3) * 1.8;
    jet.position.y = 0.2 + Math.sin(t * 0.45) * 0.35;
    jet.rotation.y = -0.25 + Math.sin(t * 0.3) * 0.35;
    jet.rotation.z = Math.sin(t * 0.45) * 0.15;
    jet.rotation.x = Math.cos(t * 0.6) * 0.05;

    // exhaust pulse
    const pulse = 0.7 + Math.sin(t * 18) * 0.3;
    exhaustL.scale.setScalar(pulse); exhaustR.scale.setScalar(pulse);

    // contrail
    trailPts.unshift([jet.position.x - 1.5, jet.position.y, jet.position.z]);
    if (trailPts.length > trailMax) trailPts.pop();
    for (let i = 0; i < trailMax; i++) {
      const p = trailPts[i] || trailPts[trailPts.length - 1] || [0,0,0];
      trailPos[i*3+0] = p[0]; trailPos[i*3+1] = p[1]; trailPos[i*3+2] = p[2];
    }
    trailGeo.attributes.position.needsUpdate = true;

    // particles drift
    particles.position.x -= dt * 1.5;
    if (particles.position.x < -10) particles.position.x = 0;

    // mouse parallax
    mouse.x = lerp(mouse.x, mouse.tx, 0.04);
    mouse.y = lerp(mouse.y, mouse.ty, 0.04);
    camera.position.x = mouse.x * 0.8;
    camera.position.y = 1.2 - mouse.y * 0.4;
    camera.lookAt(jet.position.x * 0.3, jet.position.y, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // HUD live numbers
  const hudAlt = $('#hudAlt'), hudMach = $('#hudMach');
  setInterval(() => {
    if (hudAlt)  hudAlt.textContent  = (38000 + Math.floor(Math.random()*900)) + ' ft';
    if (hudMach) hudMach.textContent = (1.6 + Math.random()*0.6).toFixed(2);
  }, 1400);
}

// ============= NAV STATE =============
function initNav() {
  const nav = $('#nav');
  const onScroll = () => {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ============= INTERSECTION FADE-INS =============
function initReveal() {
  const els = $$('.fade-up, .fade-left, .fade-right, [data-tilt], .stat-card, .fleet-card, .w-card, .sq-card, .h-card, .tr-card, .t-card, .g-item');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  els.forEach((el, i) => {
    if (!el.classList.contains('fade-up') && !el.classList.contains('fade-left') && !el.classList.contains('fade-right')) {
      el.classList.add('fade-up');
    }
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
    io.observe(el);
  });
}

// ============= COUNTERS =============
function initCounters() {
  $$('.counter').forEach(el => {
    const to = +el.dataset.to;
    const suf = el.dataset.suffix || '';
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          let v = 0, start = performance.now(), dur = 1800;
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
    }, { threshold: 0.4 });
    io.observe(el);
  });
}

// ============= TILT (subtle 3D card tilt) =============
function initTilt() {
  $$('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-4px) perspective(1000px) rotateX(${-y*6}deg) rotateY(${x*6}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// ============= FLEET CARDS =============
function renderFleet() {
  const grid = $('#fleetGrid');
  grid.innerHTML = FLEET.map(a => {
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
    <article class="fleet-card ${has3D ? 'fleet-card--3d' : ''}" data-id="${a.id}" style="--c1:${a.color}40;--c2:${a.accent};--c2-alpha:${a.accent}40">
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
  }).join('');

  // lazy-load iframes when the card scrolls into view
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const slot = e.target;
      if (slot.dataset.loaded) return;
      slot.dataset.loaded = '1';
      const id = slot.dataset.model;
      const ifr = document.createElement('iframe');
      ifr.src = `https://sketchfab.com/models/${id}/embed?autospin=0.2&autostart=1&preload=1&transparent=1&ui_theme=dark&ui_infos=0&ui_controls=0&ui_inspector=0&ui_stop=0&ui_watermark_link=0&ui_watermark=0&ui_hint=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_animations=0&dnt=1`;
      ifr.title = '3D model';
      ifr.allow = 'autoplay; fullscreen; xr-spatial-tracking';
      ifr.setAttribute('allowfullscreen', 'true');
      ifr.setAttribute('mozallowfullscreen', 'true');
      ifr.setAttribute('webkitallowfullscreen', 'true');
      ifr.setAttribute('execution-while-out-of-viewport', '');
      ifr.setAttribute('execution-while-not-rendered', '');
      ifr.setAttribute('web-share', '');
      ifr.addEventListener('load', () => slot.classList.add('is-loaded'));
      slot.appendChild(ifr);
      io.unobserve(slot);
    });
  }, { rootMargin: '200px' });
  $$('.fleet-card__model').forEach(el => io.observe(el));

  grid.addEventListener('click', e => {
    // don't open modal when interacting with the embedded 3D viewer or credit
    if (e.target.closest('iframe') || e.target.closest('.fleet-card__credit') || e.target.closest('.fleet-card__model')) return;
    const card = e.target.closest('.fleet-card');
    if (!card) return;
    openFleetModal(card.dataset.id);
  });
}

function openFleetModal(id) {
  const a = FLEET.find(x => x.id === id); if (!a) return;
  const body = $('#modalBody');
  body.className = 'modal-body';

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
  $('#modal').classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
$('#modal').addEventListener('click', e => {
  if (e.target.dataset.close !== undefined || e.target.closest('[data-close]')) {
    $('#modal').classList.remove('is-open');
    document.body.style.overflow = '';
  }
});

// ============= DASHBOARD =============
function renderDash() {
  const bars = $('#dashBars');
  const rows = [
    { label: 'Fighters',        v: 540, max: 600, c: '#ff9933' },
    { label: 'Transport',       v: 250, max: 600, c: '#5fb8ff' },
    { label: 'Helicopters',     v: 360, max: 600, c: '#138808' },
    { label: 'Trainers',        v: 220, max: 600, c: '#ffd166' },
    { label: 'Special Ops/EW',  v: 95,  max: 600, c: '#c9a7ff' }
  ];
  bars.innerHTML = rows.map(r => `
    <div class="bar">
      <span class="bar__label">${r.label}</span>
      <div class="bar__track"><div class="bar__fill" data-w="${(r.v/r.max*100).toFixed(0)}" style="background:linear-gradient(90deg,${r.c}, ${r.c}99)"></div></div>
      <span class="bar__val">${r.v}</span>
    </div>
  `).join('');

  // gradient defs for ring
  const svg = $('.ring svg');
  if (svg && !svg.querySelector('defs')) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
    defs.innerHTML = `<linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ff9933"/><stop offset="50%" stop-color="#ffd166"/><stop offset="100%" stop-color="#138808"/>
    </linearGradient>`;
    svg.prepend(defs);
  }

  // line chart with gradient
  const data = [42, 58, 51, 70, 65, 82, 88, 72, 91, 86, 95, 89, 102, 98, 108, 112, 105, 118, 124, 119, 132, 128, 140, 136, 148, 152, 144, 159, 162, 168];
  const w = 400, h = 160, pad = 10;
  const min = Math.min(...data), max = Math.max(...data);
  const px = (i) => pad + (i / (data.length-1)) * (w - 2*pad);
  const py = (v) => h - pad - ((v - min) / (max - min)) * (h - 2*pad);
  const pts = data.map((v,i) => `${px(i)},${py(v)}`).join(' ');
  const line = $('#lineChart');
  line.innerHTML = `
    <defs>
      <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ff9933" stop-opacity=".7"/>
        <stop offset="100%" stop-color="#ff9933" stop-opacity="0"/>
      </linearGradient>
    </defs>
    ${[0,40,80,120].map(y => `<line class="grid" x1="0" y1="${y}" x2="${w}" y2="${y}"/>`).join('')}
    <polygon class="area" points="${pad},${h-pad} ${pts} ${w-pad},${h-pad}"/>
    <polyline class="stroke" points="${pts}"/>
    ${data.filter((_,i)=> i % 4 === 0).map((v,i) => `<circle class="pt" cx="${px(i*4)}" cy="${py(v)}" r="3"/>`).join('')}
  `;

  // animate when in view
  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      $$('.bar__fill').forEach(b => b.style.width = b.dataset.w + '%');
      const fg = $('#ringFg'); if (fg) fg.style.strokeDashoffset = 314 * (1 - 0.91);
      const v = $('#ringVal');
      let p = 0; const target = 91;
      const tick = () => { p += 2; if (p > target) p = target; v.textContent = p + '%'; if (p < target) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
      io.disconnect();
    });
  }, { threshold: 0.3 });
  io.observe($('#dash'));
}

// ============= TIMELINE =============
function renderTimeline() {
  $('#timelineTrack').innerHTML = TIMELINE.map(t => `
    <article class="t-card">
      <div class="t-card__year">${t.year}</div>
      <span class="t-card__tag">${t.tag}</span>
      <h3 class="t-card__title">${t.title}</h3>
      <p class="t-card__body">${t.body}</p>
      <div class="t-card__corner"></div>
    </article>
  `).join('');
}

// ============= WARRIORS =============
function renderWarriors() {
  $('#warriorsGrid').innerHTML = WARRIORS.map(w => `
    <article class="w-card" style="--wc:${w.color}">
      <div class="w-card__medal">
        <div class="w-card__medal-icon"></div>
        <span>${w.medal.split(' ')[0]}</span>
      </div>
      <div class="w-card__portrait">${w.name.split(' ').map(p => p[0]).join('').slice(0,2)}</div>
      <h3 class="w-card__name">${w.name}</h3>
      <div class="w-card__rank">${w.rank}</div>
      <div class="w-card__years">${w.years}</div>
      <p class="w-card__bio">${w.bio}</p>
    </article>
  `).join('');
}

// ============= SQUADRONS =============
function renderSquadrons() {
  $('#squadronsGrid').innerHTML = SQUADRONS.map(s => `
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
  `).join('');
}

// ============= MISSION CONTROL FEED =============
function initMissionFeed() {
  const ul = $('#commFeed');
  let i = 0;
  const push = () => {
    const line = COMM_LINES[i++ % COMM_LINES.length];
    const li = document.createElement('li');
    const t  = new Date();
    const hh = String(t.getHours()).padStart(2,'0'), mm = String(t.getMinutes()).padStart(2,'0'), ss = String(t.getSeconds()).padStart(2,'0');
    li.innerHTML = `<time>${hh}:${mm}:${ss}</time><span>${line}</span>`;
    ul.prepend(li);
    while (ul.children.length > 7) ul.lastChild.remove();
  };
  for (let n = 0; n < 5; n++) push();
  setInterval(push, 2400);

  const a = $('#msA'), b = $('#msB'), c = $('#msC');
  setInterval(() => {
    a.textContent = (38 + Math.floor(Math.random()*6));
    b.textContent = (12 + Math.floor(Math.random()*8));
    c.textContent = (4 + Math.floor(Math.random()*3));
  }, 1800);
}

// ============= BASES MAP =============
function renderBases() {
  const map = $('#basesMap');
  // Use the uploaded minimalist map design, styled with CSS to glow tactically
  map.insertAdjacentHTML('beforeend', `
    <img src="india-map.png" class="india-map-img" alt="India Map Outline" />
    <div class="bases__radar"></div>
  `);

  BASES.forEach((b, i) => {
    const el = document.createElement('button');
    el.className = 'base-marker';
    el.style.left = b.lon + '%';
    el.style.top  = b.lat + '%';
    el.dataset.i = i;
    el.title = b.name;
    map.appendChild(el);
  });

  const detail = $('#baseDetail');
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

  map.addEventListener('mouseover', e => {
    const m = e.target.closest('.base-marker'); if (!m) return;
    $$('.base-marker', map).forEach(x => x.classList.remove('active'));
    m.classList.add('active');
    setBase(BASES[+m.dataset.i]);
  });
  map.addEventListener('click', e => {
    const m = e.target.closest('.base-marker'); if (!m) return;
    $$('.base-marker', map).forEach(x => x.classList.remove('active'));
    m.classList.add('active');
    setBase(BASES[+m.dataset.i]);
  });
}

// ============= COMPARE =============
function renderCompare() {
  const A = $('#cmpA'), B = $('#cmpB');
  const opts = FLEET.map((a,i) => `<option value="${i}">${a.name}</option>`).join('');
  A.innerHTML = opts; B.innerHTML = opts;
  A.value = 0; B.value = 1;
  const render = () => {
    const a = FLEET[+A.value], b = FLEET[+B.value];
    const card = (x) => `
      <h4>${x.name}</h4>
      <small>${x.role} · ${x.gen}</small>
      <p>${x.blurb}</p>
    `;
    $('#cardA').innerHTML = card(a);
    $('#cardA').style.borderTop = `3px solid ${a.accent}`;
    $('#cardB').innerHTML = card(b);
    $('#cardB').style.borderTop = `3px solid ${b.accent}`;

    const rows = [
      ['Speed (km/h)', a.speed, b.speed, 2500],
      ['Range (km)',   a.range, b.range, 11000],
      ['Ceiling (m)',  a.ceiling, b.ceiling, 18000],
      ['IAF Units',    a.units, b.units, 300]
    ];
    $('#compareBars').innerHTML = rows.map(([label, va, vb, mx]) => `
      <div class="cbar">
        <span style="text-align:right;color:#fff;font-family:'Orbitron',sans-serif">${fmt(va)}</span>
        <div class="cbar__l"><i style="width:${(va/mx*100).toFixed(1)}%"></i></div>
        <div class="cbar__r"><i style="width:${(vb/mx*100).toFixed(1)}%"></i></div>
        <span style="color:#fff;font-family:'Orbitron',sans-serif">${fmt(vb)}</span>
      </div>
      <div class="cbar__label" style="grid-column:1/-1;text-align:center;margin-top:-8px;margin-bottom:8px">${label}</div>
    `).join('');
  };
  A.addEventListener('change', render); B.addEventListener('change', render);
  render();
}

// ============= HUMANITARIAN =============
function renderHumanitarian() {
  $('#humanitarianGrid').innerHTML = HUMANITARIAN.map(h => `
    <article class="h-card">
      <div class="h-card__year">${h.year}</div>
      <h3 class="h-card__name">${h.name}</h3>
      <div class="h-card__loc">${h.loc}</div>
      <p class="h-card__body">${h.body}</p>
      <span class="h-card__stat">${h.stat}</span>
    </article>
  `).join('');
}

// ============= HANGAR 3D =============
function initHangar() {
  const canvas = $('#hangarCanvas');
  if (!canvas || typeof THREE === 'undefined') return;
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
  const spot = new THREE.SpotLight(0xffffff, 1.5, 30, Math.PI/6, 0.4); spot.position.set(0,6,4); scene.add(spot);
  const fill = new THREE.DirectionalLight(0x5fb8ff, 0.5); fill.position.set(-5,2,-3); scene.add(fill);

  // floor (reflective-ish)
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30,30), new THREE.MeshStandardMaterial({ color: 0x0a1628, metalness: 0.7, roughness: 0.3 }));
  floor.rotation.x = -Math.PI/2; floor.position.y = -0.8; scene.add(floor);

  // single re-usable jet model
  const colors = [0x5fb8ff, 0xff7a59, 0xffb43d, 0xffd166];
  const jets = colors.map(c => buildJet(c));
  jets.forEach((j,i) => { j.visible = i === 0; scene.add(j); });

  function buildJet(c) {
    const g = new THREE.Group();
    const body = new THREE.MeshStandardMaterial({ color: c, metalness: 0.8, roughness: 0.35 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x101820, metalness: 0.9, roughness: 0.2 });
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, 4, 18), body);
    f.rotation.z = Math.PI/2; g.add(f);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1, 16), body);
    nose.rotation.z = -Math.PI/2; nose.position.x = 2.5; g.add(nose);
    const can = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 12, 0, Math.PI*2, 0, Math.PI/2), dark);
    can.position.set(1.2, 0.2, 0); can.scale.set(2, 0.6, 1); g.add(can);
    // wings
    const wShape = new THREE.Shape();
    wShape.moveTo(0,0); wShape.lineTo(0,0.4); wShape.lineTo(2.6,1.6); wShape.lineTo(2.8,1.6); wShape.lineTo(0.4,0); wShape.lineTo(0,0);
    const wGeo = new THREE.ExtrudeGeometry(wShape,{depth:.07,bevelEnabled:false});
    const wL = new THREE.Mesh(wGeo, body); wL.rotation.x = -Math.PI/2; wL.position.set(-0.4,0,0.04);
    const wR = wL.clone(); wR.scale.z = -1; wR.position.z = -0.04;
    g.add(wL, wR);
    const tShape = new THREE.Shape();
    tShape.moveTo(0,0); tShape.lineTo(0,1); tShape.lineTo(0.7,1); tShape.lineTo(1,0); tShape.lineTo(0,0);
    const tGeo = new THREE.ExtrudeGeometry(tShape,{depth:.06,bevelEnabled:false});
    const tail = new THREE.Mesh(tGeo, body); tail.rotation.y = Math.PI/2; tail.position.set(-1.8,0.05,0.03); g.add(tail);
    // exhaust
    const ex = new THREE.Mesh(new THREE.CircleGeometry(0.16,16), new THREE.MeshBasicMaterial({color:0xff9933}));
    ex.position.set(-2.05, 0, 0); ex.rotation.y = -Math.PI/2; g.add(ex);
    g.scale.setScalar(0.7);
    return g;
  }

  let current = 0;
  const canvasEl = canvas;
  const sf = document.getElementById('hangarSketchfab');
  const sfCredit = document.getElementById('hangarCredit');
  const labels = ['RAFALE · OMNIROLE','SU-30 MKI · AIR DOMINANCE','TEJAS · INDIGENOUS LCA','MIRAGE 2000 · VAJRA'];
  const showSketchfab = (acft) => {
    if (!sf || !acft || !acft.model) return false;
    const url = `https://sketchfab.com/models/${acft.model}/embed?autospin=0.3&autostart=1&preload=1&transparent=1&ui_theme=dark&ui_infos=0&ui_watermark_link=0&ui_watermark=0&ui_hint=0&dnt=1`;
    if (sf.src !== url) sf.src = url;
    sf.hidden = false;
    sfCredit.innerHTML = `
      <a href="${acft.modelUrl}" target="_blank" rel="nofollow noopener">${acft.name}</a>
      by <a href="${acft.modelAuthorUrl}" target="_blank" rel="nofollow noopener">${acft.modelAuthor}</a> · Sketchfab`;
    sfCredit.hidden = false;
    canvasEl.style.visibility = 'hidden';
    return true;
  };

  // Map rail index -> FLEET id
  const byId = id => FLEET.find(x => x.id === id);
  const buttons = $$('.hangar__rail button');

  // Boot in the active state
  const bootBtn = buttons.find(b => b.classList.contains('active')) || buttons[0];
  showSketchfab(byId(bootBtn.dataset.model));
  $('#hangarLabel').textContent = labels[+bootBtn.dataset.h] || '';

  buttons.forEach(b => {
    b.addEventListener('click', () => {
      buttons.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      const next = +b.dataset.h;
      $('#hangarLabel').textContent = labels[next];
      const acft = byId(b.dataset.model);
      showSketchfab(acft);
    });
  });

  let t0 = performance.now();
  function loop(now) {
    const t = now * 0.001;
    jets.forEach(j => { j.rotation.y = t * 0.4; j.position.y = Math.sin(t) * 0.15; });
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(loop);
}

// ============= COCKPIT HUD =============
function initCockpit() {
  const stage = $('.cockpit__stage');
  const compass = $('#hudCompass');
  if (!compass || !stage) return;
  
  const dirs = ['N','30','60','E','120','150','S','210','240','W','300','330'];
  compass.innerHTML = (dirs.concat(dirs)).map(d => `<span style="display:inline-block;padding:0 22px">${d}</span>`).join('');
  
  const knots = $('#hudKnots'), alt = $('#hudAlt2'), horizon = $('#hudHorizon');
  const hud = $('.cockpit__hud');
  const frame = $('.cockpit__frame');
  
  let h = 90, k = 820, a = 38420, roll = 0, pitch = 0;
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  
  // Mouse tracking for parallax and HUD control
  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    targetX = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
    targetY = (e.clientY - rect.top) / rect.height - 0.5;  // -0.5 to 0.5
  });
  
  stage.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });
  
  // Add dynamic background image (dramatic first-person cockpit dogfight view from uploaded asset)
  stage.style.backgroundImage = `url('/__l5e/assets-v1/9967b7fc-ad3b-46c2-b117-ffcf1bb8993a/cockpit-bg.png')`;
  stage.style.backgroundSize = 'cover';
  stage.style.backgroundPosition = 'center 30%';
  stage.style.backgroundBlendMode = 'normal';
  
  // Add subtle grain/noise overlay for realism
  const grain = document.createElement('div');
  grain.className = 'cockpit__grain';
  stage.appendChild(grain);
  
  const updateInterval = setInterval(() => {
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
  }, 100);
}

// ============= GALLERY =============
function renderGallery() {
  const tabs = $('#galleryTabs');
  const grid = $('#galleryGrid');
  const cats = ['All', ...new Set(GALLERY.map(g => g.cat))];
  tabs.innerHTML = cats.map((c,i) => `<button class="${i===0?'active':''}" data-cat="${c}">${c}</button>`).join('');
  const draw = (cat) => {
    const items = cat === 'All' ? GALLERY : GALLERY.filter(g => g.cat === cat);
    grid.innerHTML = items.map((g, i) => `
      <figure class="g-item" style="--c1:${g.tint[0]};--c2:${g.tint[1]};--ar:${[3/4, 4/3, 1, 5/4, 4/5][i % 5]}">
        <div class="g-item__visual" style="background-image: url('${g.image}')"></div>
        <figcaption class="g-item__overlay"><span>${g.cat}</span><strong>${g.label}</strong></figcaption>
      </figure>
    `).join('');
  };
  draw('All');
  tabs.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', tabs).forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    draw(b.dataset.cat);
  });
}

// ============= TRIBUTE WALL =============
function renderTributes() {
  $('#tributeGrid').innerHTML = TRIBUTES.map(t => `
    <article class="tr-card">
      <p class="tr-card__msg">${t.msg}</p>
      <div class="tr-card__name">${t.name}</div>
    </article>
  `).join('');
}

// ============= SECTION TITLE FADE WRAPPING =============
function tagFadeUp() {
  $$('.section-head, .about__copy, .about__visual').forEach(el => el.classList.add('fade-up'));
}

// ============= GSAP PARALLAX =============
function initGsap() {
  if (typeof gsap === 'undefined' || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // hero subtle parallax
  gsap.to('.hero__clouds', { yPercent: 30, ease: 'none', scrollTrigger: { trigger:'#hero', start:'top top', end:'bottom top', scrub:true }});
  gsap.to('.hero__content', { yPercent: 25, opacity: 0.6, ease:'none', scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:true }});

  // quote parallax
  gsap.to('.quote__formation', { yPercent: -40, ease:'none', scrollTrigger:{ trigger:'#quote', start:'top bottom', end:'bottom top', scrub:true }});
}

// ============= BOOT =============
window.addEventListener('DOMContentLoaded', async () => {
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

  initHero3D();
  initHangar();

  initLenis();
  initGsap();

  await runLoader();
});
