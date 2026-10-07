/**
 * SpeedometerSection Component.
 * Implements high-performance SVG arc animations for Vehicle Speed and Engine RPM.
 */

import { BaseComponent } from './BaseComponent.js';
import speedometerStyles from '../styles/speedometer.css?inline';

// Total pixel circumference of the SVG path circle (2 * PI * r) where r=70
const ARC_CIRCUMFERENCE = 440;
// We leave a gap at the bottom of the gauge, active arc length is 330px
const VISIBLE_ARC_LIMIT = 330;

export class SpeedometerSection extends BaseComponent {

  /**
   * Builds the structure for the dual-gauge cluster layout (RPM + Speed)
   */
  initRender() {
    this.shadowRoot.innerHTML = `
      <style>
        ${speedometerStyles}
      </style>
      <div class="speedo-container">

        <!-- Left Gauge: Tachometer (RPM) -->
        <div class="gauge-box">
          <svg class="gauge-svg" viewBox="0 0 160 160">
            <circle class="gauge-track" cx="80" cy="80" r="70"
                    stroke-dasharray="${VISIBLE_ARC_LIMIT} ${ARC_CIRCUMFERENCE}" stroke-linecap="round"/>
            <circle class="gauge-progress" id="rpm-progress" cx="80" cy="80" r="70"
                    stroke="var(--accent-color)" stroke-dasharray="${VISIBLE_ARC_LIMIT} ${ARC_CIRCUMFERENCE}"
                    stroke-dashoffset="${VISIBLE_ARC_LIMIT}"/>
          </svg>
          <div class="gauge-center-text">
            <span class="digital-value" id="rpm-text">0</span>
            <span class="digital-unit">RPM x1000</span>
            <div class="gear-indicator" id="gear-text">D</div>
          </div>
        </div>

        <!-- Right Gauge: Speedometer (Km/h or Mph) -->
        <div class="gauge-box">
          <svg class="gauge-svg" viewBox="0 0 160 160">
            <circle class="gauge-track" cx="80" cy="80" r="70"
                    stroke-dasharray="${VISIBLE_ARC_LIMIT} ${ARC_CIRCUMFERENCE}" stroke-linecap="round"/>
            <circle class="gauge-progress" id="speed-progress" cx="80" cy="80" r="70"
                    stroke="#06b6d4" stroke-dasharray="${VISIBLE_ARC_LIMIT} ${ARC_CIRCUMFERENCE}"
                    stroke-dashoffset="${VISIBLE_ARC_LIMIT}"/>
          </svg>
          <div class="gauge-center-text">
            <span class="digital-value" id="speed-text">0</span>
            <span class="digital-unit" id="speed-unit-text">${this._config.speedUnit}</span>
          </div>
        </div>

      </div>
    `;
  }

  /**
   * Automatically executes when new parameters arrive via OBD2 streams
   */
  onStateUpdate() {
    // 1. Process Speed Sensor Data
    const speedId = this._config.entities.speed;
    const rawSpeed = parseFloat(this.getEntityState(speedId, '0'));
    const maxSpeedExpected = 240; // Reference maximum ceiling scale for scaling calculations

    this.updateGaugeProgress('speed-progress', rawSpeed, maxSpeedExpected);
    this.shadowRoot.getElementById('speed-text').textContent = Math.round(rawSpeed);

    // 2. Process Engine RPM Sensor Data
    const rpmId = this._config.entities.rpm;
    const rawRpm = parseFloat(this.getEntityState(rpmId, '0'));
    const maxRpmExpected = 7000; // Standard petrol engine scale limit

    this.updateGaugeProgress('rpm-progress', rawRpm, maxRpmExpected);
    // Display in standard 'x1000' auto layout style (e.g. 2.4 for 2400 rpm)
    this.shadowRoot.getElementById('rpm-text').textContent = (rawRpm / 1000).toFixed(1);

    // 3. Process Optional Transmission Gear Data
    if (this._config.entities.gear) {
      const gearId = this._config.entities.gear;
      this.shadowRoot.getElementById('gear-text').textContent = this.getEntityState(gearId, 'P');
    }
  }

  /**
   * Helper mathematical encoder translating absolute values to SVG stroke-dashoffset parameters
   */
  updateGaugeProgress(elementId, currentValue, maxValue) {
    const progressCircle = this.shadowRoot.getElementById(elementId);
    if (!progressCircle) return;

    // Constrain percentage between 0.0 and 1.0 limits
    const percentage = Math.min(Math.max(currentValue / maxValue, 0), 1);

    // Calculate final offset pixels. Total fullness equals 0 offset bytes.
    const targetOffset = VISIBLE_ARC_LIMIT - (percentage * VISIBLE_ARC_LIMIT);
    progressCircle.style.strokeDashoffset = targetOffset;
  }
}

customElements.define('speedometer-section', SpeedometerSection);
