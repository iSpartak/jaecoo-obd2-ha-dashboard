/**
 * HeaderSection Component.
 * Renders the top status row containing car title, active time, and battery voltage.
 */

import { BaseComponent } from './BaseComponent.js';
import headerStyles from '../styles/header.css?inline';

export class HeaderSection extends BaseComponent {
  constructor() {
    super();
    this._timerInterval = null;
  }

  /**
   * Executed once configuration is available.
   * Generates the raw shell layout and embeds styles.
   */
  initRender() {
    this.shadowRoot.innerHTML = `
      <style>
        ${headerStyles}
      </style>
      <div class="header-container">

          <h2 class="car-title">${this._config.title}</h2>
          <div class="system-status-pill">OBD2 Link Active</div>
        </div>

        <div class="telemetry-group">
          <!-- Live Local Clock Node -->
          <div class="telemetry-item">
            <span class="telemetry-label">Time</span>
            <span class="telemetry-value" id="live-clock">--:--</span>
          </div>

          <!-- Battery Voltage Node -->
          <div class="telemetry-item">
            <span class="telemetry-label">Battery</span>
            <span class="telemetry-value" id="voltage-readout">--.- V</span>
          </div>
        </div>
      </div>
    `;

    // Start local background clock updates
    this.startClock();
  }

  /**
   * Executed automatically on every state push from Home Assistant.
   * Extracts and updates only the battery voltage element.
   */
  onStateUpdate() {
    const batteryEntityId = this._config.entities.battery_voltage;

    // Fallback to '12.6' if sensor is not configured or unavailable
    const rawVoltage = this.getEntityState(batteryEntityId, '12.6');
    const voltageValue = parseFloat(rawVoltage);

    const voltageReadout = this.shadowRoot.getElementById('voltage-readout');
    if (voltageReadout) {
      voltageReadout.textContent = `${voltageValue.toFixed(1)} V`;

      // Visual warning indicator if voltage drops below 11.8 Volts
      if (voltageValue < 11.8) {
        voltageReadout.classList.add('voltage-alert');
      } else {
        voltageReadout.classList.remove('voltage-alert');
      }
    }
  }

  /**
   * Runs an independent interval looping every second to update UI clock time.
   */
  startClock() {
    const clockNode = this.shadowRoot.getElementById('live-clock');

    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      if (clockNode) {
        clockNode.textContent = `${hours}:${minutes}`;
      }
    };

    updateTime(); // Run immediate execution once
    this._timerInterval = setInterval(updateTime, 1000);
  }

  /**
   * Standard Web Component lifecycle teardown.
   * Memory management: stops intervals if the card is destroyed.
   */
  disconnectedCallback() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
    }
  }
}

// Register the element tag name
customElements.define('header-section', HeaderSection);
