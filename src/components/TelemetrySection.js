/**
 * TelemetrySection Component.
 * Controls Row 2 displaying individual OBD metric blocks and the integrated Car Image/Weather box.
 */

import { BaseComponent } from './BaseComponent.js';
import telemetryStyles from '../styles/telemetry.css?inline';

export class TelemetrySection extends BaseComponent {

  initRender() {
    this.shadowRoot.innerHTML = `
      <style>${telemetryStyles}</style>
      <div class="telemetry-grid">

        <!-- Brand Block -->
        <div class="tel-block">
          <span class="brand-title">JAECOO 7</span>
        </div>

        <!-- Speed Block -->
        <div class="tel-block">
          <span class="tel-label">Speed</span>
          <span class="tel-value" id="speed-val">--</span>
          <span class="tel-unit">${this._config.speedUnit}</span>
        </div>

        <!-- RPM Block -->
        <div class="tel-block">
          <span class="tel-label">RPM</span>
          <span class="tel-value" id="rpm-val">--</span>
        </div>

        <!-- Fuel Block -->
        <div class="tel-block">
          <span class="tel-label">Fuel</span>
          <span class="tel-value" id="fuel-val">--%</span>
        </div>

        <!-- Coolant Temp Block -->
        <div class="tel-block">
          <span class="tel-label">Coolant</span>
          <span class="tel-value" id="temp-val">--°C</span>
        </div>

        <!-- Car Image & Weather Summary Block -->
        <div class="tel-block car-image-block">
          <div class="car-placeholder">🚗 CAR IMAGE</div>
          <div class="weather-info">
            <span class="weather-temp" id="weather-temp-val">--.-°C</span>
            <span class="weather-cond" id="weather-cond-val">Loading...</span>
          </div>
        </div>

      </div>
    `;
  }

  onStateUpdate() {
    // 1. Map core sensors
    const speed = this.getEntityState(this._config.entities.speed, '0');
    const rpm = this.getEntityState(this._config.entities.rpm, '0');
    const fuel = this.getEntityState(this._config.entities.fuel_level, '--');
    const temp = this.getEntityState(this._config.entities.engine_temp, '--');

    this.shadowRoot.getElementById('speed-val').textContent = Math.round(parseFloat(speed));
    this.shadowRoot.getElementById('rpm-val').textContent = Math.round(parseFloat(rpm));
    this.shadowRoot.getElementById('fuel-val').textContent = fuel !== '--' ? `${Math.round(parseFloat(fuel))}%` : '--%';
    this.shadowRoot.getElementById('temp-val').textContent = temp !== '--' ? `${Math.round(parseFloat(temp))}°C` : '--°C';

    // 2. Map optional weather metrics if present
    if (this._config.entities.outside_temp) {
      const outTemp = this.getEntityState(this._config.entities.outside_temp, '14.3');
      this.shadowRoot.getElementById('weather-temp-val').textContent = `${parseFloat(outTemp).toFixed(1)}°C`;
    }
    if (this._config.entities.weather_condition) {
      const cond = this.getEntityState(this._config.entities.weather_condition, 'Partly cloudy');
      this.shadowRoot.getElementById('weather-cond-val').textContent = cond;
    }
  }
}

customElements.define('telemetry-section', TelemetrySection);
