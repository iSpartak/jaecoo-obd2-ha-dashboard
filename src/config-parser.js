/**
 * Module for parsing and validating the Jaecoo OBD2 dashboard card configuration.
 */

// List of mandatory entities required for the dashboard to function properly
const REQUIRED_ENTITIES = [
  'speed',       // Vehicle speed
  'rpm'          // Engine RPM
];

// List of optional entities that will fall back to default values if not provided
// Add these to the existing OPTIONAL_ENTITIES array in src/config-parser.js
const OPTIONAL_ENTITIES = [
  'fuel_level',
  'battery_voltage',
  'engine_temp',
  'odometer',
  'gear',
  'gps',
  // New entities from the visual mock:
  'license_plate',       // To display 'Plate number: ABC1234'
  'outside_temp',        // To display '14.3°C'
  'weather_condition',   // To display 'Partly cloudy'
  'car_status_binary',   // To determine 'ONLINE' / 'OFFLINE'
  'ignition_binary'      // To determine 'DRIVING' / 'PARKED'
];

export class ConfigParser {
  /**
   * Validates and parses the raw configuration object passed from Home Assistant.
   * @param {Object} rawConfig - Raw configuration object from Lovelace YAML.
   * @returns {Object} Cleaned, validated, and structured configuration object.
   * @throws {Error} Error if any mandatory field is missing.
   */
  static parse(rawConfig) {
    // 1. Verify the existence of the root 'entities' object
    if (!rawConfig || !rawConfig.entities) {
      throw new Error("Missing 'entities' object in card configuration.");
    }

    const entities = rawConfig.entities;
    const parsedEntities = {};

    // 2. Validate and map required sensors
    for (const key of REQUIRED_ENTITIES) {
      if (!entities[key]) {
        throw new Error(`Required entity '${key}' is missing in configuration under 'entities:'.`);
      }
      parsedEntities[key] = entities[key];
    }

    // 3. Map optional sensors (default to null if omitted)
    for (const key of OPTIONAL_ENTITIES) {
      parsedEntities[key] = entities[key] || null;
    }

    // 4. Parse layout and theme customisation options
    const cardTitle = rawConfig.title || 'Jaecoo 7';
    const themeColor = rawConfig.theme_color || '#a855f7'; // Default violet accent color
    const speedUnit = rawConfig.speed_unit || 'km/h';

    // Return the sanitized, structured configuration package
    return {
      title: cardTitle,
      themeColor: themeColor,
      speedUnit: speedUnit,
      entities: parsedEntities,
      raw: rawConfig // Preserve raw configuration for edge-case fallbacks
    };
  }
}
