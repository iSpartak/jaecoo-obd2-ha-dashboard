/**
 * Main Entry Point for the Jaecoo OBD2 Home Assistant Dashboard Card.
 * Orchestrates a 4-row layout scheme matching the pixel-perfect wireframe specifications.
 */

import { ConfigParser } from './config-parser.js';

// Import child row components to ensure custom element registration
import { HeaderSection } from './components/HeaderSection.js';
import { TelemetrySection } from './components/TelemetrySection.js';
import { MiddleRowSection } from './components/MiddleRowSection.js';
import { AnalyticsSection } from './components/AnalyticsSection.js';

// Import encapsulated layout styles compiled via Vite
import globalStyles from './styles/global.css?inline';

class JaecooObd2Card extends HTMLElement {
  constructor() {
    super();
    this._config = null;
    this._hass = null;
    this._error = null;

    // References to the modular UI child sections
    this.headerRow = null;
    this.telemetryRow = null;
    this.middleRow = null;
    this.analyticsRow = null;

    // Isolate component context via standard Shadow DOM boundary
    this.attachShadow({ mode: 'open' });
  }

  /**
   * Invoked by Home Assistant whenever card settings change in Lovelace dashboard.
   * @param {Object} config - Raw YAML layout parameters from the frontend editor.
   */
  setConfig(config) {
    try {
      // Validate and package raw parameters via config module engine
      this._config = ConfigParser.parse(config);
      this._error = null;
    } catch (error) {
      // Retain validation exceptions to present within a safe error UI layout
      this._error = error.message;
    }

    // Refresh layout mounting points
    this.initDashboardLayout();
  }

  /**
   * Invoked by Home Assistant automatically on any global state transformation packet.
   * @param {Object} hassInstance - Root Home Assistant sensor state tree.
   */
  set hass(hassInstance) {
    this._hass = hassInstance;

    // Cease state mapping cascades if an invalid config alert state is active
    if (this._error) return;

    // Distribute the global platform instance downwards into the component chain
    if (this.headerRow) this.headerRow.hass = hassInstance;
    if (this.telemetryRow) this.telemetryRow.hass = hassInstance;
    if (this.middleRow) this.middleRow.hass = hassInstance;
    if (this.analyticsRow) this.analyticsRow.hass = hassInstance;
  }

  /**
   * Renders the complete multi-row dashboard layout container based on schematic constraints.
   */
  initDashboardLayout() {
    // Scenario A: Render immediate platform alert wrapper if YAML validation failed
    if (this._error) {
      this.shadowRoot.innerHTML = `
        <ha-alert alert-type="error" title="Jaecoo OBD2 Card Configuration Error">
          ${this._error}
        </ha-alert>
      `;
      return;
    }

    // Scenario B: Abort rendering pipeline if layout skeleton is already present in DOM
    if (this.shadowRoot.querySelector('.jaecoo-dashboard-wrapper')) return;

    // Scenario C: Perform a clean compile mapping exactly to the 4-row schematic layout
    this.shadowRoot.innerHTML = `
      <style>
        ${globalStyles}
      </style>

      <div class="jaecoo-dashboard-wrapper" style="--accent-color: ${this._config.themeColor};">

        <!-- ROW 1: System Title, Plate, Location, Network Status Badges -->
        <header-section></header-section>

        <!-- ROW 2: Primary Telemetry Counters (Speed, RPM, Fuel, Coolant) & Car Photo Metadata -->
        <telemetry-section></telemetry-section>

        <!-- ROW 3: Visual Geographic Trackers (Live Map), Trip Logs & Status Analytics -->
        <middle-row-section></middle-row-section>

        <!-- ROW 4: Longitudinal History Performance Graphs (Fuel Economy & Mileage Run Log) -->
        <analytics-section></analytics-section>

      </div>
    `;

    // Extract DOM binding pointers to newly instantiated nested custom tags
    this.headerRow = this.shadowRoot.querySelector('header-section');
    this.telemetryRow = this.shadowRoot.querySelector('telemetry-section');
    this.middleRow = this.shadowRoot.querySelector('middle-row-section');
    this.analyticsRow = this.shadowRoot.querySelector('analytics-section');

    // Cascade structural configuration settings deep into child scopes immediately
    this.headerRow.config = this._config;
    this.telemetryRow.config = this._config;
    this.middleRow.config = this._config;
    this.analyticsRow.config = this._config;
  }

  /**
   * Instructs the Lovelace layout engine regarding the estimated grid footprint of this component block.
   * @returns {number} Estimated dashboard vertical cell layout rows.
   */
  getCardSize() {
    return 10; // Increased height footprint to account for the maps and analytical graph displays
  }
}

// Global Custom Element Registry Deployment
customElements.define('jaecoo-obd2-card', JaecooObd2Card);

// Lovelace UI Native Visual Card Picker Listing Mapping
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'jaecoo-obd2-card',
  name: 'Jaecoo OBD2 Dashboard Card',
  preview: true,
  description: 'Full schematic telemetry application interface for Jaecoo 7 vehicles including real-time maps, performance analytics, and diagnostic graphs.'
});
