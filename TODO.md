# Jaecoo OBD2 HA Dashboard - Development Roadmap & Context

This file serves as a persistent context anchor for future AI-assisted development sessions. It outlines the current codebase state, architectural patterns, and upcoming milestones.

---

## 🛠️ Current Project Context (Read First)

* **Architecture:** Vanilla JavaScript written as modern Web Components (ES6 Modules) using Shadow DOM encapsulation.
* **Shared Logic:** All child row sections extend a custom `BaseComponent.js` which abstracts the global Home Assistant `hass` state updates, verified `_config` pipelines, and provides the `getEntityState()` utility.
* **Orchestration:** `main.js` is the root Lovelace card element (`custom:jaecoo-obd2-card`). It validates input via `config-parser.js` and mounts a strict 4-row system flex/grid layout mapped inside `src/styles/global.css`.
* **Build System:** Compiled into a single distributed production module (`dist/jaecoo-obd2-card.js`) via **Vite** using the `iife` library format. Runs flawlessly on Node.js v24+.

---

## 📋 High-Priority Backlog (Next Steps)

### Task 1: Integrate Leaflet/OpenStreetMap inside `MiddleRowSection.js`
* **Objective:** Replace the string wrapper placeholder `#map-frame` with an active visual tracking map.
* **Requirements:**
    * Load the lightweight **Leaflet.js** script and its stylesheet inside the component scope dynamically.
    * Listen for GPS coordinates via `this._config.entities.gps` (`device_tracker` integration).
    * Smoothly update the map viewport view center and marker vector positions without triggering standard component layout re-renders.

### Task 2: Inject Dynamic Historical Graphs into `AnalyticsSection.js`
* **Objective:** Power up the `Fuel Economy` and `Mileage History` dashboard sections using historical platform telemetry data.
* **Requirements:**
    * Integrate **ApexCharts** or basic scalable native SVGs capable of parsing state collection history.
    * Fetch historical data arrays directly using Home Assistant WebSockets or REST API endpoints via the global `this._hass` engine object.
    * Map dynamic purple and cyan color profiles based on `var(--accent-color)` hooks.

### Task 3: Implement Vehicle Mode Triggers (Driving vs. Parked)
* **Objective:** Change dashboard visual states when the car changes state.
* **Requirements:**
    * Hook structural animation properties or block overlays based on `ignition_binary` or engine RPM markers.
    * Optimize rendering pipelines during high-frequency OBD2 data ingestion loops to avoid layout shifting on wall tablets.

---

## 🔮 Future Session System Prompt
*When starting a new session to resume work on this card, copy and paste the following prompt to prime the AI assistant instantly:*

> **Prompt:** "I am developing a custom Home Assistant Lovelace card called `jaecoo-obd2-card`. The project is fully modular, uses standard Web Components with Shadow DOM, and is bundled via Vite. I have a `TODO.md` file in my root workspace containing the exact architectural details and backlogs. Let's look at Task 1 (Leaflet Map Integration) and write the production JavaScript implementation for `src/components/MiddleRowSection.js`."
