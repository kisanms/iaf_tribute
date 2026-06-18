# Indian Air Force Tribute Website

A cinematic, interactive tribute to the Indian Air Force - celebrating 90+ years of valor, precision, and aerial supremacy. Built with modern web technologies to deliver an immersive experience showcasing the IAF's legacy, fleet, and mission.

<img width="1900" height="860" alt="image" src="https://github.com/user-attachments/assets/2653c474-75c3-4047-b11b-bd40e8e8a3f0" />


## 🎯 Overview

This project is a fully responsive, single-page web application that pays homage to the Indian Air Force through:
- Interactive 3D aircraft models
- Cinematic cockpit HUD experience
- Historical timeline of IAF operations
- Fleet specifications and comparisons
- Air base mapping system
- Gallery of iconic moments
- Tribute wall and humanitarian operations showcase

**Theme:** "Touch The Sky With Glory" - नभः स्पृशं दीप्तम्

## ✨ Features

### Core Experience
- **Smooth Scrolling** - Lenis-powered buttery smooth navigation
- **3D Aircraft Models** - Interactive Sketchfab embeds with 8+ aircraft
- **Cockpit HUD** - Immersive first-person pilot experience with mouse parallax
- **GSAP Animations** - Scroll-triggered animations and transitions
- **Responsive Design** - Optimized for desktop, tablet, and mobile

### Sections
1. **Hero** - Cinematic opening with 3D jet animation
2. **Statistics** - IAF by the numbers
3. **Legacy** - Historical evolution from 1932 to present
4. **Active Fleet** - 8 aircraft with detailed specifications
5. **Fleet Dashboard** - Visual analytics and readiness metrics
6. **Timeline** - 10 major milestones in IAF history
7. **Air Warriors** - Profiles of legendary pilots and heroes
8. **Squadrons** - Elite units and their crests
9. **Mission Control** - Live radar simulation and comms feed
10. **Air Bases** - Interactive map with 14 strategic locations
11. **Comparison Tool** - Side-by-side aircraft specs
12. **Humanitarian Ops** - Relief missions and disaster response
13. **Virtual Hangar** - 3D model viewer with 8 aircraft
14. **Pilot Experience** - Interactive cockpit HUD
15. **Gallery** - Curated images of IAF operations
16. **Tribute Wall** - Messages from the nation

## 🛠️ Tech Stack

### Frontend Framework
- **Vite** - Next-generation frontend tooling
- **TypeScript** - Type-safe JavaScript
- **Three.js** - 3D graphics and animations
- **GSAP** - Professional-grade animations
- **Lenis** - Smooth scrolling library

### Styling
- Pure CSS with custom properties
- CSS Grid and Flexbox layouts
- Advanced animations and transitions
- Glassmorphism and tactical UI design

### 3D Models
- Sketchfab embeds for interactive 3D viewing
- Custom Three.js scenes for hero and hangar sections

### Audio
- Web Audio API for engine sound synthesis
- MP3 audio for initialization sequence

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm

### Setup Steps

1. **Extract the ZIP file**
   ```bash
   unzip iaf-tribute-final.zip
   cd iaf-tribute
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:5173`

## 🚀 Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

## 📁 Project Structure

```
iaf-tribute/
├── public/
│   ├── assets/
│   │   ├── briefing.png
│   │   ├── c17.png
│   │   ├── cockpit-bg.png
│   │   ├── heart.png
│   │   ├── high_alt.png
│   │   ├── iaf-crest.png
│   │   ├── india-map.png
│   │   ├── jet-flyby.mp3
│   │   ├── leh.png
│   │   ├── rafale.png
│   │   ├── sarang.png
│   │   ├── shelter.png
│   │   ├── strike.png
│   │   ├── su30.png
│   │   ├── suryakiran.png
│   │   └── tejas.png
│   └── favicon.ico
├── src/
│   ├── data.ts          # All content data (fleet, timeline, warriors, etc.)
│   ├── main.ts          # Main application logic
│   └── style.css        # Global styles and animations
├── index.html           # Main HTML entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Customization

### Modifying Content
All website content is centralized in `src/data.ts`:
- Fleet aircraft specifications
- Timeline events
- Warrior profiles
- Squadron details
- Air base coordinates
- Gallery images
- Tribute messages

### Changing Colors
Edit CSS custom properties in `src/style.css`:
```css
:root {
  --saffron: #FF9933;
  --white: #FFFFFF;
  --green: #138808;
  --navy: #0A1628;
  --hud: #7EF7C8;
}
```

### Adding New Aircraft
Add a new entry to the `FLEET` array in `src/data.ts`:
```typescript
{
  id: 'new-aircraft',
  name: 'Aircraft Name',
  role: 'Role Description',
  gen: 'Generation',
  speed: 2000,
  range: 3000,
  ceiling: 15000,
  crew: '1-2',
  manufacturer: 'Manufacturer',
  weapons: 'Weapons list',
  intro: 'Year',
  color: '#hex',
  accent: '#hex',
  units: 0,
  blurb: 'Description',
  model: 'sketchfab-model-id',
  modelAuthor: 'Author Name',
  modelAuthorUrl: 'https://sketchfab.com/author',
  modelUrl: 'https://sketchfab.com/3d-models/model-url'
}
```

## 🌐 Deployment

### Build for Production
```bash
npm run build
```
This generates optimized files in the `dist/` directory.

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Deploy to GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to `dist/` folder

### Deploy to Cloudflare Pages
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`

## 🎵 Audio Features

- **Initialization Sound** - Jet flyby audio plays on page load
- **Engine Audio Toggle** - Synthesized engine drone (click "Engine Audio" button)
- **Smooth Synthesis** - Clean dual-sine wave generation without harsh vibrations

## 🖼️ Image Assets

All gallery images are locally stored in `public/assets/`:
- Fighter jets (Rafale, Su-30 MKI, Tejas, C-17)
- Pilot operations (Sarang team, briefings)
- Combat operations (strike missions, high altitude)
- Air shows (Suryakiran formation, aerobatics)
- Infrastructure (Leh airbase, shelters)

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Optimized Assets**: Compressed images and lazy-loaded 3D models
- **Code Splitting**: Efficient bundle sizes
- **Smooth Animations**: 60fps GSAP and Three.js rendering

## 🏆 Credits

### Aircraft 3D Models
- Rafale by andertan
- Su-30 MKI by Immersive3D
- Su-30 MK2 by Mickel Rusenberg
- Tejas by Sengchor
- Mirage 2000 by Jeyhun1985
- C-17 by AnirudhRao
- Apache by Carbuni
- Chinook by Studio Lab
- AMCA by Ankur

### Technologies
- Three.js - 3D graphics library
- GSAP - Animation platform
- Lenis - Smooth scrolling
- Sketchfab - 3D model hosting
- Vite - Build tool
- TypeScript - Type safety

## 📄 License

This is a tribute project created for educational and commemorative purposes. All trademarks, aircraft names, and military insignia belong to their respective owners.

**Indian Air Force Motto:** नभः स्पृशं दीप्तम् (Touch The Sky With Glory)

## 🤝 Contributing

This is a personal tribute project. For suggestions or improvements, feel free to fork and modify.

## 📞 Support

For questions about the Indian Air Force, visit the official website: [indianairforce.nic.in](https://indianairforce.nic.in)

---

**Jai Hind! 🇮🇳**

*Built with respect and admiration for the guardians of India's skies.*
