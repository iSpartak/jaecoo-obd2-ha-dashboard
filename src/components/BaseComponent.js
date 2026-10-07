/**
 * Abstract base class for all Jaecoo OBD2 dashboard components.
 * Provides shared utilities for Shadow DOM initialisation, style injection, and lifecycle management.
 */
export class BaseComponent extends HTMLElement {
  constructor() {
    super();
    // Allocate private state storage
    this._hass = null;
    this._config = null;

    // Create an isolated Shadow DOM container
    this.attachShadow({ mode: 'open' });
  }

  /**
   * Centralised setter to inject the Home Assistant global state context.
   * Automatically triggers a re-render if the state changes.
   * @param {Object} hassInstance - The global Home Assistant state object.
   */
  set hass(hassInstance) {
    this._hass = hassInstance;
    if (this._config) {
      this.onStateUpdate();
    }
  }

  /**
   * Centralised setter to inject the validated component configuration.
   * @param {Object} configInstance - Structured configuration object.
   */
  set config(configInstance) {
    this._config = configInstance;
    // Initialise rendering once the component configuration is loaded
    this.initRender();
  }

  /**
   * Life-cycle hook: Triggered immediately after the component configuration is set.
   * Intended to build the layout structure and inject styles. Must be overridden in child classes.
   * @abstract
   */
  initRender() {
    throw new Error("The initRender() method must be implemented by the child component subclass.");
  }

  /**
   * Life-cycle hook: Triggered every time Home Assistant pushes a new state update.
   * Intended to update specific DOM elements or triggers animations. Must be overridden in child classes.
   * @abstract
   */
  onStateUpdate() {
    throw new Error("The onStateUpdate() method must be implemented by the child component subclass.");
  }

  /**
   * Helper utility to quickly extract a state value or return a default fallback.
   * @param {string} entityId - The Home Assistant sensor entity ID.
   * @param {string|number} fallback - The value returned if the entity or state is unavailable.
   * @returns {string|number} Current state string or fallback value.
   */
  getEntityState(entityId, fallback = '0') {
    if (!this._hass || !entityId) return fallback;
    const stateObj = this._hass.states[entityId];
    return stateObj ? stateObj.state : fallback;
  }
}
