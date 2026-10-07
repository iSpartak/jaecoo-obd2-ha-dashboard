/**
 * MiddleRowSection Component.
 * Mounts Row 3 containing Map frames, trip computation lists, and structural car analytics.
 */

import { BaseComponent } from './BaseComponent.js';
import middleRowStyles from '../styles/middle-row.css?inline';

export class MiddleRowSection extends BaseComponent {

  initRender() {
    this.shadowRoot.innerHTML = `
      <style>${middleRowStyles}</style>
      <div class="middle-grid">

        <!-- Live Map Block -->
        <div class="mid-block">
          <div class="block-header">Live Map</div>
          <div class="map-viewport" id="map-frame">Interactive Map Viewport</div>
        </div>

        <!-- Current Trip Block -->
        <div class="mid-block">
          <div class="block-header">Current Trip</div>
          <div class="data-list">
            <div class="data-row"><span>Distance</span><span class="data-value" id="trip-dist">-- km</span></div>
            <div class="data-row"><span>Duration</span><span class="data-value" id="trip-time">-- min</span></div>
            <div class="data-row"><span>Avg Speed</span><span class="data-value" id="trip-avg-speed">-- km/h</span></div>
          </div>
        </div>

        <!-- Vehicle Status Block -->
        <div class="mid-block">
          <div class="block-header">Vehicle Status</div>
          <div class="data-list">
            <div class="data-row"><span>Engine</span><span class="data-value" id="status-engine">OFF</span></div>
            <div class="data-row"><span>Odometer</span><span class="data-value" id="status-odo">-- km</span></div>
            <div class="data-row"><span>Battery Volts</span><span class="data-value" id="status-volts">-- V</span></div>
          </div>
        </div>

      </div>
    `;
  }

  onStateUpdate() {
    // 1. Process Status Data Points
    const odo = this.getEntityState(this._config.entities.odometer, '--');
    const volts = this.getEntityState(this._config.entities.battery_voltage, '--');
    const rpm = parseFloat(this.getEntityState(this._config.entities.rpm, '0'));

    this.shadowRoot.getElementById('status-odo').textContent = odo !== '--' ? `${Math.round(parseFloat(odo)).toLocaleString()} km` : '-- km';
    this.shadowRoot.getElementById('status-volts').textContent = volts !== '--' ? `${parseFloat(volts).toFixed(1)} V` : '-- V';
    this.shadowRoot.getElementById('status-engine').textContent = rpm > 400 ? 'RUNNING' : 'OFF';

    // 2. Map coordinates metadata text onto Map placeholder as test confirmation
    if (this._config.entities.gps) {
      const gpsState = this._hass.states[this._config.entities.gps];
      if (gpsState && gpsState.attributes.latitude) {
        this.shadowRoot.getElementById('map-frame').textContent =
          `Lat: ${gpsState.attributes.latitude.toFixed(4)}, Lon: ${gpsState.attributes.longitude.toFixed(4)}`;
      }
    }
  }
}

customElements.define('middle-row-section', MiddleRowSection);
