<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>IAF Tribute — README</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#02060c;--surface:#0a1628;--surface2:#0f1f35;
  --glass:rgba(15,31,53,.65);--border:rgba(255,255,255,.08);
  --saffron:#FF9933;--white:#FFFFFF;--green:#138808;
  --navy:#0A1628;--hud:#7EF7C8;--blue:#5fb8ff;
  --text:#c8d6e5;--text-dim:#6b7f99;--text-bright:#e8f0f8;
}
html{scroll-behavior:smooth}
body{
  background:var(--bg);color:var(--text);
  font-family:'Rajdhani',sans-serif;font-size:17px;line-height:1.7;
  min-height:100vh;
}
::selection{background:var(--saffron);color:var(--bg)}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--saffron);border-radius:3px}

/* ── Hero Banner ── */
.hero{
  position:relative;min-height:60vh;display:flex;align-items:center;justify-content:center;
  text-align:center;overflow:hidden;
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,153,51,.12) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 30% 70%, rgba(19,136,8,.08) 0%, transparent 50%),
    linear-gradient(180deg, var(--bg) 0%, var(--surface) 50%, var(--bg) 100%);
}
.hero::before{
  content:"";position:absolute;inset:0;
  background:repeating-linear-gradient(0deg,transparent,transparent 49px,rgba(255,255,255,.02) 50px);
  pointer-events:none;
}
.hero-content{position:relative;z-index:2;padding:2rem}
.hero-badge{
  display:inline-flex;align-items:center;gap:8px;
  padding:6px 18px;border-radius:100px;
  background:rgba(255,153,51,.1);border:1px solid rgba(255,153,51,.3);
  font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:2px;
  color:var(--saffron);text-transform:uppercase;margin-bottom:1.5rem;
}
.hero-badge .dot{width:6px;height:6px;border-radius:50%;background:var(--saffron);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.hero h1{
  font-family:'Orbitron',sans-serif;font-size:clamp(2.5rem,6vw,5rem);
  font-weight:900;line-height:1.1;margin-bottom:1rem;
  background:linear-gradient(135deg,var(--text-bright) 0%,var(--saffron) 50%,var(--green) 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
}
.hero h1 span{display:block;font-size:.45em;font-weight:400;letter-spacing:6px;
  background:linear-gradient(90deg,var(--text-dim),var(--blue));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.hero-sub{
  max-width:600px;margin:0 auto 2rem;color:var(--text-dim);font-size:1.1rem;
}
.flag-bar{display:flex;height:4px;border-radius:2px;overflow:hidden;max-width:200px;margin:0 auto}
.flag-bar span:nth-child(1){flex:1;background:var(--saffron)}
.flag-bar span:nth-child(2){flex:1;background:var(--white)}
.flag-bar span:nth-child(3){flex:1;background:var(--green)}

/* ── Layout ── */
.container{max-width:960px;margin:0 auto;padding:0 2rem}
section{padding:4rem 0;border-bottom:1px solid var(--border)}
section:last-child{border-bottom:none}

/* ── Section Headers ── */
.section-tag{
  font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:3px;
  color:var(--saffron);text-transform:uppercase;margin-bottom:.75rem;
  display:flex;align-items:center;gap:10px;
}
.section-tag::before{content:"";width:24px;height:1px;background:var(--saffron)}
h2{
  font-family:'Orbitron',sans-serif;font-size:clamp(1.5rem,3vw,2.2rem);
  font-weight:700;color:var(--text-bright);margin-bottom:1.5rem;
}
h2 em{font-style:normal;color:var(--saffron)}
h3{
  font-family:'Orbitron',sans-serif;font-size:1.1rem;font-weight:600;
  color:var(--blue);margin:2rem 0 1rem;
}

/* ── Text ── */
p{margin-bottom:1rem;color:var(--text)}
strong{color:var(--text-bright)}
a{color:var(--saffron);text-decoration:none;transition:color .3s}
a:hover{color:var(--hud)}

/* ── Lists ── */
ul,ol{margin:0 0 1.5rem 1.5rem}
li{margin-bottom:.5rem}
li::marker{color:var(--saffron)}

/* ── Feature Grid ── */
.feature-grid{
  display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem;margin:1.5rem 0;
}
.feature-card{
  padding:1.25rem;border-radius:12px;
  background:var(--glass);border:1px solid var(--border);
  backdrop-filter:blur(10px);transition:transform .3s,border-color .3s;
}
.feature-card:hover{transform:translateY(-3px);border-color:rgba(255,153,51,.3)}
.feature-card .icon{font-size:1.5rem;margin-bottom:.5rem}
.feature-card h4{
  font-family:'Orbitron',sans-serif;font-size:.85rem;font-weight:600;
  color:var(--text-bright);margin-bottom:.4rem;
}
.feature-card p{font-size:.9rem;color:var(--text-dim);margin:0}

/* ── Section List ── */
.section-list{
  display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:.75rem;margin:1.5rem 0;
}
.section-item{
  display:flex;align-items:baseline;gap:10px;padding:.75rem 1rem;
  border-radius:8px;background:rgba(15,31,53,.5);border:1px solid var(--border);
  font-size:.95rem;
}
.section-item .num{
  font-family:'JetBrains Mono',monospace;font-size:.75rem;
  color:var(--saffron);min-width:24px;
}
.section-item .name{color:var(--text-bright);font-weight:600}

/* ── Code Blocks ── */
pre{
  background:var(--surface2);border:1px solid var(--border);border-radius:10px;
  padding:1.25rem 1.5rem;overflow-x:auto;margin:1rem 0 1.5rem;
  font-family:'JetBrains Mono',monospace;font-size:.85rem;line-height:1.8;
  color:var(--hud);position:relative;
}
pre::before{
  content:"";position:absolute;top:12px;left:14px;
  width:8px;height:8px;border-radius:50%;background:#ff5f57;
  box-shadow:16px 0 0 #febc2e,32px 0 0 #28c840;
}
pre{padding-top:2.2rem}
code{
  font-family:'JetBrains Mono',monospace;font-size:.85em;
  background:rgba(126,247,200,.08);color:var(--hud);
  padding:2px 7px;border-radius:4px;
}
pre code{background:none;padding:0;color:inherit}

/* ── Tree ── */
.tree{
  background:var(--surface2);border:1px solid var(--border);border-radius:10px;
  padding:1.5rem;margin:1rem 0 1.5rem;
  font-family:'JetBrains Mono',monospace;font-size:.82rem;line-height:1.9;
  color:var(--text-dim);overflow-x:auto;
}
.tree .folder{color:var(--blue);font-weight:600}
.tree .file{color:var(--text)}
.tree .comment{color:var(--text-dim);font-style:italic}

/* ── Tech Stack Grid ── */
.tech-grid{
  display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;margin:1.5rem 0;
}
.tech-item{
  padding:1rem;border-radius:10px;text-align:center;
  background:var(--glass);border:1px solid var(--border);
  transition:border-color .3s,transform .3s;
}
.tech-item:hover{border-color:rgba(95,184,255,.3);transform:translateY(-2px)}
.tech-item .tech-name{
  font-family:'Orbitron',sans-serif;font-size:.85rem;font-weight:600;
  color:var(--text-bright);margin-bottom:.3rem;
}
.tech-item .tech-desc{font-size:.8rem;color:var(--text-dim)}

/* ── Deployment Cards ── */
.deploy-grid{
  display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem;margin:1.5rem 0;
}
.deploy-card{
  padding:1.25rem;border-radius:12px;
  background:var(--glass);border:1px solid var(--border);
  transition:border-color .3s;
}
.deploy-card:hover{border-color:rgba(255,153,51,.3)}
.deploy-card h4{
  font-family:'Orbitron',sans-serif;font-size:.9rem;
  color:var(--saffron);margin-bottom:.75rem;
}
.deploy-card ol{margin-left:1rem;font-size:.9rem}

/* ── Credits ── */
.credits-list{
  display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.75rem;margin:1rem 0;
}
.credit-item{
  padding:.75rem 1rem;border-radius:8px;
  background:rgba(15,31,53,.4);border:1px solid var(--border);
  font-size:.9rem;
}
.credit-item .model-name{color:var(--text-bright);font-weight:600}
.credit-item .author{color:var(--text-dim);font-size:.8rem}

/* ── Footer ── */
.footer{
  text-align:center;padding:4rem 2rem;
  background:linear-gradient(180deg,var(--bg) 0%,var(--surface) 100%);
}
.footer .motto{
  font-family:'Orbitron',sans-serif;font-size:clamp(1.2rem,3vw,1.8rem);
  font-weight:700;color:var(--saffron);margin-bottom:.5rem;
}
.footer .motto-hindi{
  font-size:1.3rem;color:var(--text-dim);margin-bottom:2rem;
}
.footer .jai-hind{
  font-family:'Orbitron',sans-serif;font-size:1.5rem;font-weight:900;
  color:var(--text-bright);margin-bottom:.5rem;
}
.footer .closing{font-size:.9rem;color:var(--text-dim)}

/* ── Responsive ── */
@media(max-width:640px){
  .container{padding:0 1.25rem}
  section{padding:3rem 0}
  .feature-grid,.section-list,.tech-grid,.deploy-grid,.credits-list{
    grid-template-columns:1fr;
  }
}
</style>
</head>
<body>

<!-- ═══ HERO ═══ -->
<header class="hero">
  <div class="hero-content">
    <div class="hero-badge"><span class="dot"></span> DOCUMENTATION · V1.0</div>
    <h1>
      INDIAN AIR FORCE
      <span>TRIBUTE WEBSITE</span>
    </h1>
    <p class="hero-sub">A cinematic, interactive tribute to the guardians of India's skies — built with modern web technologies for an immersive experience.</p>
    <div class="flag-bar"><span></span><span></span><span></span></div>
  </div>
</header>

<main class="container">

  <!-- ═══ OVERVIEW ═══ -->
  <section>
    <div class="section-tag">// 01 — OVERVIEW</div>
    <h2>A Force Forged in <em>Glory</em></h2>
    <p>This project is a fully responsive, single-page web application that pays homage to the Indian Air Force through interactive 3D aircraft models, a cinematic cockpit HUD experience, a historical timeline of operations, fleet specifications, air base mapping, a curated gallery, and a tribute wall celebrating humanitarian missions.</p>
    <p><strong>Theme:</strong> "Touch The Sky With Glory" — <em>नभः स्पृशं दीप्तम्</em></p>
  </section>

  <!-- ═══ FEATURES ═══ -->
  <section>
    <div class="section-tag">// 02 — FEATURES</div>
    <h2>Core <em>Experience</em></h2>
    <div class="feature-grid">
      <div class="feature-card">
        <div class="icon">◎</div>
        <h4>Smooth Scrolling</h4>
        <p>Lenis-powered buttery smooth navigation throughout the entire site.</p>
      </div>
      <div class="feature-card">
        <div class="icon">✈</div>
        <h4>3D Aircraft Models</h4>
        <p>Interactive Sketchfab embeds with 9 aircraft including dual Su-30 variants.</p>
      </div>
      <div class="feature-card">
        <div class="icon">⊞</div>
        <h4>Cockpit HUD</h4>
        <p>Immersive first-person pilot experience with mouse parallax tracking.</p>
      </div>
      <div class="feature-card">
        <div class="icon">▷</div>
        <h4>GSAP Animations</h4>
        <p>Scroll-triggered cinematic animations and smooth transitions.</p>
      </div>
      <div class="feature-card">
        <div class="icon">◈</div>
        <h4>Responsive Design</h4>
        <p>Optimized for desktop, tablet, and mobile devices.</p>
      </div>
      <div class="feature-card">
        <div class="icon">♫</div>
        <h4>Audio System</h4>
        <p>Web Audio API engine synthesis and initialization jet flyby sound.</p>
      </div>
    </div>
  </section>

  <!-- ═══ SECTIONS ═══ -->
  <section>
    <div class="section-tag">// 03 — SITE SECTIONS</div>
    <h2>16 Immersive <em>Sections</em></h2>
    <div class="section-list">
      <div class="section-item"><span class="num">01</span><span class="name">Hero</span> — Cinematic 3D jet opening</div>
      <div class="section-item"><span class="num">02</span><span class="name">Statistics</span> — IAF by the numbers</div>
      <div class="section-item"><span class="num">03</span><span class="name">Legacy</span> — Evolution from 1932</div>
      <div class="section-item"><span class="num">04</span><span class="name">Active Fleet</span> — 9 aircraft specs</div>
      <div class="section-item"><span class="num">05</span><span class="name">Dashboard</span> — Analytics &amp; readiness</div>
      <div class="section-item"><span class="num">06</span><span class="name">Timeline</span> — 10 major milestones</div>
      <div class="section-item"><span class="num">07</span><span class="name">Air Warriors</span> — Legendary pilots</div>
      <div class="section-item"><span class="num">08</span><span class="name">Squadrons</span> — Elite unit crests</div>
      <div class="section-item"><span class="num">09</span><span class="name">Mission Control</span> — Live radar sim</div>
      <div class="section-item"><span class="num">10</span><span class="name">Air Bases</span> — 14 strategic locations</div>
      <div class="section-item"><span class="num">11</span><span class="name">Comparison</span> — Side-by-side specs</div>
      <div class="section-item"><span class="num">12</span><span class="name">Humanitarian</span> — Relief missions</div>
      <div class="section-item"><span class="num">13</span><span class="name">Virtual Hangar</span> — 3D model viewer</div>
      <div class="section-item"><span class="num">14</span><span class="name">Pilot Experience</span> — Interactive HUD</div>
      <div class="section-item"><span class="num">15</span><span class="name">Gallery</span> — Iconic moments</div>
      <div class="section-item"><span class="num">16</span><span class="name">Tribute Wall</span> — Nation's messages</div>
    </div>
  </section>

  <!-- ═══ TECH STACK ═══ -->
  <section>
    <div class="section-tag">// 04 — TECH STACK</div>
    <h2>Built With <em>Modern</em> Tech</h2>
    <div class="tech-grid">
      <div class="tech-item"><div class="tech-name">Vite</div><div class="tech-desc">Next-gen frontend tooling</div></div>
      <div class="tech-item"><div class="tech-name">TypeScript</div><div class="tech-desc">Type-safe JavaScript</div></div>
      <div class="tech-item"><div class="tech-name">Three.js</div><div class="tech-desc">3D graphics &amp; animations</div></div>
      <div class="tech-item"><div class="tech-name">GSAP</div><div class="tech-desc">Professional animations</div></div>
      <div class="tech-item"><div class="tech-name">Lenis</div><div class="tech-desc">Smooth scrolling</div></div>
      <div class="tech-item"><div class="tech-name">Sketchfab</div><div class="tech-desc">3D model hosting</div></div>
      <div class="tech-item"><div class="tech-name">Web Audio API</div><div class="tech-desc">Sound synthesis</div></div>
      <div class="tech-item"><div class="tech-name">Pure CSS</div><div class="tech-desc">Glassmorphism &amp; tactical UI</div></div>
    </div>
  </section>

  <!-- ═══ INSTALLATION ═══ -->
  <section>
    <div class="section-tag">// 05 — INSTALLATION</div>
    <h2>Getting <em>Started</em></h2>
    <h3>Prerequisites</h3>
    <ul>
      <li>Node.js 18+ and npm installed on your system</li>
    </ul>
    <h3>Setup Steps</h3>
    <p>1. Extract the ZIP file and navigate into the project:</p>
    <pre><code>unzip iaf-tribute-final.zip
cd iaf-tribute</code></pre>
    <p>2. Install dependencies:</p>
    <pre><code>npm install</code></pre>
    <p>3. Start the development server:</p>
    <pre><code>npm run dev</code></pre>
    <p>Open your browser to <code>http://localhost:5173</code></p>
  </section>

  <!-- ═══ COMMANDS ═══ -->
  <section>
    <div class="section-tag">// 06 — COMMANDS</div>
    <h2>Development <em>Commands</em></h2>
    <pre><code># Start development server with hot reload
npm run dev

# Build for production (zero errors)
npm run build

# Preview production build locally
npm run preview

# TypeScript type checking
npx tsc --noEmit</code></pre>
  </section>

  <!-- ═══ PROJECT STRUCTURE ═══ -->
  <section>
    <div class="section-tag">// 07 — STRUCTURE</div>
    <h2>Project <em>Structure</em></h2>
    <div class="tree">
<span class="folder">iaf-tribute/</span>
├── <span class="folder">public/</span>
│   ├── <span class="folder">assets/</span>
│   │   ├── <span class="file">briefing.png</span>        <span class="comment"># Gallery — Pre-flight briefing</span>
│   │   ├── <span class="file">c17.png</span>             <span class="comment"># Gallery — C-17 Globemaster</span>
│   │   ├── <span class="file">cockpit-bg.png</span>      <span class="comment"># Cockpit section background</span>
│   │   ├── <span class="file">heart.png</span>           <span class="comment"># Gallery — Aerobatic heart</span>
│   │   ├── <span class="file">high_alt.png</span>        <span class="comment"># Gallery — High altitude ops</span>
│   │   ├── <span class="file">iaf-crest.png</span>       <span class="comment"># IAF emblem asset</span>
│   │   ├── <span class="file">india-map.png</span>       <span class="comment"># Air bases map outline</span>
│   │   ├── <span class="file">jet-flyby.mp3</span>       <span class="comment"># Initialization audio</span>
│   │   ├── <span class="file">leh.png</span>             <span class="comment"># Gallery — Leh airbase</span>
│   │   ├── <span class="file">rafale.png</span>          <span class="comment"># Gallery — Rafale fighter</span>
│   │   ├── <span class="file">sarang.png</span>          <span class="comment"># Gallery — Sarang team</span>
│   │   ├── <span class="file">shelter.png</span>         <span class="comment"># Gallery — Aircraft shelter</span>
│   │   ├── <span class="file">strike.png</span>          <span class="comment"># Gallery — Strike operations</span>
│   │   ├── <span class="file">su30.png</span>            <span class="comment"># Gallery — Su-30 MKI</span>
│   │   ├── <span class="file">suryakiran.png</span>      <span class="comment"># Gallery — Suryakiran formation</span>
│   │   └── <span class="file">tejas.png</span>           <span class="comment"># Gallery — HAL Tejas</span>
│   └── <span class="file">favicon.ico</span>           <span class="comment"># Browser tab icon</span>
├── <span class="folder">src/</span>
│   ├── <span class="file">data.ts</span>             <span class="comment"># All content data (fleet, timeline, warriors...)</span>
│   ├── <span class="file">main.ts</span>             <span class="comment"># Main application logic &amp; initialization</span>
│   └── <span class="file">style.css</span>           <span class="comment"># Global styles, animations &amp; theming</span>
├── <span class="file">index.html</span>            <span class="comment"># Main HTML entry point</span>
├── <span class="file">package.json</span>          <span class="comment"># Dependencies &amp; scripts</span>
├── <span class="file">tsconfig.json</span>         <span class="comment"># TypeScript configuration</span>
├── <span class="file">vite.config.ts</span>        <span class="comment"># Vite build configuration</span>
└── <span class="file">README.md</span>             <span class="comment"># This documentation</span>
    </div>
  </section>

  <!-- ═══ CUSTOMIZATION ═══ -->
  <section>
    <div class="section-tag">// 08 — CUSTOMIZATION</div>
    <h2>Making It <em>Yours</em></h2>

    <h3>Modifying Content</h3>
    <p>All website content is centralized in <code>src/data.ts</code>. Edit the arrays to update fleet specs, timeline events, warrior profiles, squadron details, air base coordinates, gallery images, and tribute messages.</p>

    <h3>Changing Colors</h3>
    <p>Edit CSS custom properties in <code>src/style.css</code>:</p>
    <pre><code>:root {
  --saffron: #FF9933;
  --white:   #FFFFFF;
  --green:   #138808;
  --navy:    #0A1628;
  --hud:     #7EF7C8;
}</code></pre>

    <h3>Adding New Aircraft</h3>
    <p>Add a new entry to the <code>FLEET</code> array in <code>src/data.ts</code>:</p>
    <pre><code>{
  id: 'new-aircraft',
  name: 'Aircraft Name',
  role: 'Role Description',
  gen: 'Generation',
  speed: 2000,
  range: 3000,
  ceiling: 15000,
  crew: '1-2',
  manufacturer: 'Manufacturer Name',
  weapons: 'Weapons list',
  intro: 'Year',
  color: '#hex',
  accent: '#hex',
  units: 0,
  blurb: 'Description text',
  model: 'sketchfab-model-id',
  modelAuthor: 'Author Name',
  modelAuthorUrl: 'https://sketchfab.com/author',
  modelUrl: 'https://sketchfab.com/3d-models/model-url'
}</code></pre>
  </section>

  <!-- ═══ DEPLOYMENT ═══ -->
  <section>
    <div class="section-tag">// 09 — DEPLOYMENT</div>
    <h2>Going <em>Live</em></h2>
    <p>First, build the production bundle:</p>
    <pre><code>npm run build</code></pre>
    <p>This generates optimized files in the <code>dist/</code> directory. Deploy to any platform:</p>

    <div class="deploy-grid">
      <div class="deploy-card">
        <h4>Vercel</h4>
        <pre style="margin:0;padding-top:1.8rem"><code>npm i -g vercel
vercel</code></pre>
      </div>
      <div class="deploy-card">
        <h4>Netlify</h4>
        <pre style="margin:0;padding-top:1.8rem"><code>npm i -g netlify-cli
netlify deploy --prod</code></pre>
      </div>
      <div class="deploy-card">
        <h4>GitHub Pages</h4>
        <ol>
          <li>Push to GitHub</li>
          <li>Enable Pages in settings</li>
          <li>Set source to <code>dist/</code></li>
        </ol>
      </div>
      <div class="deploy-card">
        <h4>Cloudflare Pages</h4>
        <ol>
          <li>Connect GitHub repo</li>
          <li>Build: <code>npm run build</code></li>
          <li>Output: <code>dist</code></li>
        </ol>
      </div>
    </div>
  </section>

  <!-- ═══ AUDIO ═══ -->
  <section>
    <div class="section-tag">// 10 — AUDIO</div>
    <h2>Sound <em>Design</em></h2>
    <div class="feature-grid">
      <div class="feature-card">
        <h4>Initialization Sound</h4>
        <p>Jet flyby MP3 plays automatically when flight systems finish booting at 50% volume.</p>
      </div>
      <div class="feature-card">
        <h4>Engine Audio Toggle</h4>
        <p>Clean dual-sine wave synthesis — no harsh vibrations. Toggle via the loader button.</p>
      </div>
      <div class="feature-card">
        <h4>Smooth Fade</h4>
        <p>Audio fades in/out over 0.5 seconds for a seamless, professional experience.</p>
      </div>
    </div>
  </section>

  <!-- ═══ PERFORMANCE ═══ -->
  <section>
    <div class="section-tag">// 11 — PERFORMANCE</div>
    <h2>Built for <em>Speed</em></h2>
    <div class="feature-grid">
      <div class="feature-card">
        <h4>Zero Build Errors</h4>
        <p>Strict TypeScript checking with no errors or warnings. Production-ready out of the box.</p>
      </div>
      <div class="feature-card">
        <h4>Optimized Assets</h4>
        <p>Compressed images and lazy-loaded 3D models. Pixel ratio capped at 1.5x for GPU efficiency.</p>
      </div>
      <div class="feature-card">
        <h4>60fps Animations</h4>
        <p>GSAP ScrollTrigger and Three.js rendering optimized for consistent frame rates.</p>
      </div>
      <div class="feature-card">
        <h4>Efficient Bundles</h4>
        <p>Vite's tree-shaking and code splitting keep the initial load minimal.</p>
      </div>
    </div>
  </section>

  <!-- ═══ CREDITS ═══ -->
  <section>
    <div class="section-tag">// 12 — CREDITS</div>
    <h2>3D Model <em>Authors</em></h2>
    <div class="credits-list">
      <div class="credit-item"><div class="model-name">Rafale</div><div class="author">by andertan</div></div>
      <div class="credit-item"><div class="model-name">Su-30 MKI</div><div class="author">by Immersive3D</div></div>
      <div class="credit-item"><div class="model-name">Su-30 MK2</div><div class="author">by Mickel Rusenberg</div></div>
      <div class="credit-item"><div class="model-name">HAL Tejas</div><div class="author">by Sengchor</div></div>
      <div class="credit-item"><div class="model-name">Mirage 2000</div><div class="author">by Jeyhun1985</div></div>
      <div class="credit-item"><div class="model-name">C-17 Globemaster</div><div class="author">by AnirudhRao</div></div>
      <div class="credit-item"><div class="model-name">Apache AH-64E</div><div class="author">by Carbuni</div></div>
      <div class="credit-item"><div class="model-name">Chinook CH-47F</div><div class="author">by Studio Lab</div></div>
      <div class="credit-item"><div class="model-name">HAL AMCA</div><div class="author">by Ankur</div></div>
    </div>
    <h3>Technologies</h3>
    <ul>
      <li><strong>Three.js</strong> — 3D graphics library</li>
      <li><strong>GSAP + ScrollTrigger</strong> — Animation platform</li>
      <li><strong>Lenis</strong> — Smooth scrolling</li>
      <li><strong>Sketchfab</strong> — 3D model hosting &amp; embeds</li>
      <li><strong>Vite</strong> — Build tool &amp; dev server</li>
      <li><strong>TypeScript</strong> — Type safety</li>
    </ul>
  </section>

  <!-- ═══ LICENSE ═══ -->
  <section>
    <div class="section-tag">// 13 — LICENSE</div>
    <h2>Legal <em>Notice</em></h2>
    <p>This is a tribute project created for educational and commemorative purposes. All trademarks, aircraft names, and military insignia belong to their respective owners.</p>
    <p><strong>Indian Air Force Motto:</strong> नभः स्पृशं दीप्तम् (Touch The Sky With Glory)</p>
    <p>For questions about the Indian Air Force, visit the official website: <a href="https://indianairforce.nic.in" target="_blank" rel="noopener">indianairforce.nic.in</a></p>
  </section>

</main>

<!-- ═══ FOOTER ═══ -->
<footer class="footer">
  <div class="flag-bar" style="margin-bottom:2rem"><span></span><span></span><span></span></div>
  <div class="motto">Touch The Sky With Glory</div>
  <div class="motto-hindi">नभः स्पृशं दीप्तम्</div>
  <div class="jai-hind">Jai Hind</div>
  <div class="closing">Built with respect and admiration for the guardians of India's skies.</div>
  <div style="margin-top:2rem">
    <span style="font-family:'JetBrains Mono',monospace;font-size:.75rem;color:var(--text-dim)">
      © 2026 · A cinematic tribute. Kisan's project. All trademarks belong to their respective owners.
    </span>
  </div>
</footer>

<script defer src="https://static.cloudflareinsights.com/beacon.min.js/v833ccba57c9e4d2798f2e76cebdd09a11778172276447" integrity="sha512-57MDmcccJXYtNnH+ZiBwzC4jb2rvgVCEokYN+L/nLlmO8rfYT/gIpW2A569iJ/3b+0UEasghjuZH/ma3wIs/EQ==" data-cf-beacon='{"version":"2024.11.0","token":"75124c326cb447fe934cde04713ae013","r":1,"server_timing":{"name":{"cfCacheStatus":true,"cfEdge":true,"cfExtPri":true,"cfL4":true,"cfOrigin":true,"cfSpeedBrain":true},"location_startswith":null}}' crossorigin="anonymous"></script>
</body>
</html>
