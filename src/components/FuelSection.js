/**
 * FuelSection Component.
 * Controls the fuel tank status bar and supplementary widgets like range and coolant temperature.
 */

import { BaseComponent } from './BaseComponent.js';
import fuelStyles from '../styles/fuel.css?inline';

export class FuelSection extends BaseComponent {

  /**
   * Builds the structure for the fuel tank track and secondary vehicle metrics
   */
  initRender() {
    this.shadowRoot.innerHTML = `
      <style>
        ${fuelStyles}
      </style>
      <div class="fuel-container">

        <!-- Top: Horizontal Fuel Gauge Card -->
        <div class="fuel-gauge-card">
          <div class="fuel-gauge-label-row">
            <span>Fuel Tank Level</span>
            <span id="fuel-percentage-text">--%</span>
          </div>
          <div class="fuel-bar-track">
            <div class="fuel-bar-fill" id="fuel-progress-bar"></div>
          </div>
        </div>

        <!-- Bottom: Secondary Metric Grid Row -->
        <div class="metrics-grid">

          <!-- Widget 1: Engine Coolant Temperature -->
          <div class="metric-widget">
            <span class="metric-title">Engine Temp</span>
            <div class="metric-value-wrapper">
              <span class="metric-number" id="temp-text">--</span>
              <span class="metric-unit">°C</span>
            </div>
          </div>

          <!-- Widget 2: Total Odometer Mileage -->
          <div class="metric-widget">
            <span class="metric-title">Odometer</span>
            <div class="metric-value-wrapper">
              <span class="metric-number" id="odo-text">--</span>
              <span class="metric-unit">km</span>
            </div>
          </div>

          <!-- Widget 3: Instant/Average Battery Voltage Check Alternative -->
          <div class="metric-widget">
            <span class="metric-title">Range Est.</span>
            <div class="metric-value-wrapper">
              <span class="metric-number" id="range-text">--</span>
              <span class="metric-unit">km</span>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  /**
   * Triggered on every state packet push. Handles optional OBD2 variables safely.
   */
  onStateUpdate() {
    // 1. Calculate and update Fuel Level ProgressBar width variable
    const fuelEntityId = this._config.entities.fuel_level;
    const fuelLevel = parseFloat(this.getEntityState(fuelEntityId, '0'));

    const progressBar = this.shadowRoot.getElementById('fuel-progress-bar');
    const progressText = this.shadowRoot.getElementById('fuel-percentage-text');

    if (progressBar && progressText) {
      const safeFuel = Math.min(Math.max(fuelLevel, 0), 100); // Clamp 0-100%
      progressBar.style.setProperty('--fuel-level-width', `${safeFuel}%`);
      progressText.textContent = `${Math.round(safeFuel)}%`;
    }

    // 2. Update Engine Coolant Temperature
    const tempEntityId = this._config.entities.engine_temp;
    const rawTemp = this.getEntityState(tempEntityId, null);
    const tempNode = this.shadowRoot.getElementById('temp-text');

    if (tempNode && rawTemp !== null) {
      const tempVal = Math.round(parseFloat(rawTemp));
      tempNode.textContent = tempVal;

      // Visual indicator if engine temperature crosses severe threshold (105°C)
      if (tempVal > 105) {
        tempNode.classList.add('temp-alert');
      } else {
        tempNode.classList.remove('temp-alert');
      }
    }

    // 3. Update Vehicle Odometer
    const odoEntityId = this._config.entities.odometer;
    const rawOdo = this.getEntityState(odoEntityId, null);
    const odoNode = this.shadowRoot.getElementById('odo-text');

    if (odoNode && rawOdo !== null) {
      // Formats long metrics beautifully (e.g., 12450.4 to 12 450)
      odoNode.textContent = Math.round(parseFloat(rawOdo)).toLocaleString();
    }

    // 4. Update Range Estimate (If your tracker maps remaining range, else calculate basic mock)
    const rangeNode = this.shadowRoot.getElementById('range-text');
    if (rangeNode && fuelEntityId) {
      // Simple logic framework: assume full tank equals 650km maximum range
      const calculatedRange = Math.round((fuelLevel / 100) * 650);
      rangeNode.textContent = fuelLevel > 0 ? calculatedRange : '0';
    }
  }
}

customElements.define('fuel-section', FuelSection);
