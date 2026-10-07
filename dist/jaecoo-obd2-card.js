(function(){"use strict";const l=["speed","rpm"],d=["fuel_level","battery_voltage","engine_temp","odometer","gear","gps","license_plate","outside_temp","weather_condition","car_status_binary","ignition_binary"];class c{static parse(t){if(!t||!t.entities)throw new Error("Missing 'entities' object in card configuration.");const e=t.entities,i={};for(const o of l){if(!e[o])throw new Error(`Required entity '${o}' is missing in configuration under 'entities:'.`);i[o]=e[o]}for(const o of d)i[o]=e[o]||null;const a=t.title||"Jaecoo 7",s=t.theme_color||"#a855f7",w=t.speed_unit||"km/h";return{title:a,themeColor:s,speedUnit:w,entities:i,raw:t}}}class n extends HTMLElement{constructor(){super(),this._hass=null,this._config=null,this.attachShadow({mode:"open"})}set hass(t){this._hass=t,this._config&&this.onStateUpdate()}set config(t){this._config=t,this.initRender()}initRender(){throw new Error("The initRender() method must be implemented by the child component subclass.")}onStateUpdate(){throw new Error("The onStateUpdate() method must be implemented by the child component subclass.")}getEntityState(t,e="0"){if(!this._hass||!t)return e;const i=this._hass.states[t];return i?i.state:e}}const p=".header-container{display:flex;justify-content:space-between;align-items:center;width:100%;padding-bottom:12px;border-bottom:1px solid var(--border-color, #232742)}.car-identity{display:flex;flex-direction:column;gap:4px}.car-title{margin:0;font-size:20px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text-primary, #ffffff)}.system-status-pill{font-size:11px;color:var(--accent-color, #a855f7);font-weight:600;text-transform:uppercase;letter-spacing:.5px}.telemetry-group{display:flex;align-items:center;gap:20px}.telemetry-item{display:flex;flex-direction:column;align-items:flex-end;gap:2px}.telemetry-label{font-size:11px;color:var(--text-muted, #707593);text-transform:uppercase}.telemetry-value{font-size:16px;font-weight:600;font-variant-numeric:tabular-nums;color:var(--text-primary, #ffffff)}.voltage-alert{color:#ef4444!important;animation:pulse-neon 1.5s infinite}";class h extends n{constructor(){super(),this._timerInterval=null}initRender(){this.shadowRoot.innerHTML=`
      <style>
        ${p}
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
    `,this.startClock()}onStateUpdate(){const t=this._config.entities.battery_voltage,e=this.getEntityState(t,"12.6"),i=parseFloat(e),a=this.shadowRoot.getElementById("voltage-readout");a&&(a.textContent=`${i.toFixed(1)} V`,i<11.8?a.classList.add("voltage-alert"):a.classList.remove("voltage-alert"))}startClock(){const t=this.shadowRoot.getElementById("live-clock"),e=()=>{const i=new Date,a=String(i.getHours()).padStart(2,"0"),s=String(i.getMinutes()).padStart(2,"0");t&&(t.textContent=`${a}:${s}`)};e(),this._timerInterval=setInterval(e,1e3)}disconnectedCallback(){this._timerInterval&&clearInterval(this._timerInterval)}}customElements.define("header-section",h);const m=".telemetry-grid{display:grid;grid-template-columns:1.2fr repeat(4,1fr) 2fr;gap:12px;width:100%}.tel-block{background-color:var(--bg-dark-secondary, #181b2c);border:1px solid var(--border-color, #232742);border-radius:8px;padding:12px;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:110px;text-align:center;box-sizing:border-box}.brand-title{font-size:16px;font-weight:700;letter-spacing:1px;color:var(--text-primary);text-transform:uppercase}.tel-label{font-size:11px;color:var(--text-muted, #707593);text-transform:uppercase;margin-bottom:6px}.tel-value{font-size:24px;font-weight:700;color:var(--text-primary);font-variant-numeric:tabular-nums}.tel-unit{font-size:11px;color:var(--text-muted);margin-top:2px}.car-image-block{align-items:flex-start;justify-content:space-between;padding:12px 16px}.car-placeholder{font-size:13px;font-weight:600;display:flex;align-items:center;gap:6px}.weather-info{display:flex;flex-direction:column;gap:2px;margin-top:auto;text-align:left}.weather-temp{font-size:18px;font-weight:700}.weather-cond{font-size:12px;color:var(--text-muted)}";class g extends n{initRender(){this.shadowRoot.innerHTML=`
      <style>${m}</style>
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
    `}onStateUpdate(){const t=this.getEntityState(this._config.entities.speed,"0"),e=this.getEntityState(this._config.entities.rpm,"0"),i=this.getEntityState(this._config.entities.fuel_level,"--"),a=this.getEntityState(this._config.entities.engine_temp,"--");if(this.shadowRoot.getElementById("speed-val").textContent=Math.round(parseFloat(t)),this.shadowRoot.getElementById("rpm-val").textContent=Math.round(parseFloat(e)),this.shadowRoot.getElementById("fuel-val").textContent=i!=="--"?`${Math.round(parseFloat(i))}%`:"--%",this.shadowRoot.getElementById("temp-val").textContent=a!=="--"?`${Math.round(parseFloat(a))}°C`:"--°C",this._config.entities.outside_temp){const s=this.getEntityState(this._config.entities.outside_temp,"14.3");this.shadowRoot.getElementById("weather-temp-val").textContent=`${parseFloat(s).toFixed(1)}°C`}if(this._config.entities.weather_condition){const s=this.getEntityState(this._config.entities.weather_condition,"Partly cloudy");this.shadowRoot.getElementById("weather-cond-val").textContent=s}}}customElements.define("telemetry-section",g);const u=".middle-grid{display:grid;grid-template-columns:2fr 1.5fr 1.5fr;gap:12px;width:100%}.mid-block{background-color:var(--bg-dark-secondary, #181b2c);border:1px solid var(--border-color, #232742);border-radius:8px;padding:16px;min-height:160px;display:flex;flex-direction:column;box-sizing:border-box}.block-header{font-size:12px;font-weight:700;color:var(--text-muted, #707593);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px}.map-viewport{width:100%;height:100%;background-color:#111422;border-radius:6px;display:flex;justify-content:center;align-items:center;color:var(--text-muted);font-size:13px;border:1px dashed var(--border-color)}.data-list{display:flex;flex-direction:column;gap:8px;font-size:13px}.data-row{display:flex;justify-content:space-between;border-bottom:1px dotted #1f233a;padding-bottom:4px}.data-value{font-weight:600;color:var(--text-primary)}";class v extends n{initRender(){this.shadowRoot.innerHTML=`
      <style>${u}</style>
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
    `}onStateUpdate(){const t=this.getEntityState(this._config.entities.odometer,"--"),e=this.getEntityState(this._config.entities.battery_voltage,"--"),i=parseFloat(this.getEntityState(this._config.entities.rpm,"0"));if(this.shadowRoot.getElementById("status-odo").textContent=t!=="--"?`${Math.round(parseFloat(t)).toLocaleString()} km`:"-- km",this.shadowRoot.getElementById("status-volts").textContent=e!=="--"?`${parseFloat(e).toFixed(1)} V`:"-- V",this.shadowRoot.getElementById("status-engine").textContent=i>400?"RUNNING":"OFF",this._config.entities.gps){const a=this._hass.states[this._config.entities.gps];a&&a.attributes.latitude&&(this.shadowRoot.getElementById("map-frame").textContent=`Lat: ${a.attributes.latitude.toFixed(4)}, Lon: ${a.attributes.longitude.toFixed(4)}`)}}}customElements.define("middle-row-section",v);const f=".analytics-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%}.chart-block{background-color:var(--bg-dark-secondary, #181b2c);border:1px solid var(--border-color, #232742);border-radius:8px;padding:16px;min-height:150px;display:flex;flex-direction:column;box-sizing:border-box}.chart-title{font-size:12px;font-weight:700;color:var(--text-muted, #707593);text-transform:uppercase;letter-spacing:.5px;margin-bottom:16px}.chart-canvas-mock{width:100%;height:100%;display:flex;align-items:flex-end;gap:8px;padding-top:10px;border-left:2px solid #1f233a;border-bottom:2px solid #1f233a;box-sizing:border-box}.mock-bar{flex:1;background:linear-gradient(0deg,var(--accent-color, #a855f7) 0%,#06b6d4 100%);border-radius:4px 4px 0 0;opacity:.85;transition:height .5s ease-out}";class y extends n{initRender(){this.shadowRoot.innerHTML=`
      <style>${f}</style>
      <div class="analytics-grid">

        <!-- Fuel Economy Analytics Block -->
        <div class="chart-block">
          <div class="chart-title">Fuel Economy</div>
          <div class="chart-canvas-mock">
            <div class="mock-bar" style="height: 65%;"></div>
            <div class="mock-bar" style="height: 45%;"></div>
            <div class="mock-bar" style="height: 75%;"></div>
            <div class="mock-bar" style="height: 55%;"></div>
            <div class="mock-bar" style="height: 80%;"></div>
          </div>
        </div>

        <!-- Mileage History Analytics Block -->
        <div class="chart-block">
          <div class="chart-title">Mileage History</div>
          <div class="chart-canvas-mock">
            <div class="mock-bar" style="height: 30%; background: #06b6d4;"></div>
            <div class="mock-bar" style="height: 50%; background: #06b6d4;"></div>
            <div class="mock-bar" style="height: 45%; background: #06b6d4;"></div>
            <div class="mock-bar" style="height: 70%; background: #06b6d4;"></div>
            <div class="mock-bar" style="height: 90%; background: #06b6d4;"></div>
          </div>
        </div>

      </div>
    `}onStateUpdate(){}}customElements.define("analytics-section",y);const x=".jaecoo-dashboard-wrapper{--bg-dark-primary: #111422;--bg-dark-secondary: #181b2c;--border-color: #232742;--text-primary: #ffffff;--text-muted: #707593;--accent-color: #a855f7;display:flex;flex-direction:column;gap:16px;width:100%;padding:20px;background-color:var(--bg-dark-primary);color:var(--text-primary);border-radius:16px;font-family:monospace;box-sizing:border-box}.telemetry-row-grid{display:grid;grid-template-columns:1.2fr repeat(4,1fr) 2fr;gap:12px;width:100%}.middle-row-grid{display:grid;grid-template-columns:2fr 1.5fr 1.5fr;gap:12px;width:100%}.bottom-charts-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%}.dashboard-block{background-color:var(--bg-dark-secondary);border:1px dashed var(--border-color);border-radius:8px;padding:12px;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:100px}";class b extends HTMLElement{constructor(){super(),this._config=null,this._hass=null,this._error=null,this.headerRow=null,this.telemetryRow=null,this.middleRow=null,this.analyticsRow=null,this.attachShadow({mode:"open"})}setConfig(t){try{this._config=c.parse(t),this._error=null}catch(e){this._error=e.message}this.initDashboardLayout()}set hass(t){this._hass=t,!this._error&&(this.headerRow&&(this.headerRow.hass=t),this.telemetryRow&&(this.telemetryRow.hass=t),this.middleRow&&(this.middleRow.hass=t),this.analyticsRow&&(this.analyticsRow.hass=t))}initDashboardLayout(){if(this._error){this.shadowRoot.innerHTML=`
        <ha-alert alert-type="error" title="Jaecoo OBD2 Card Configuration Error">
          ${this._error}
        </ha-alert>
      `;return}this.shadowRoot.querySelector(".jaecoo-dashboard-wrapper")||(this.shadowRoot.innerHTML=`
      <style>
        ${x}
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
    `,this.headerRow=this.shadowRoot.querySelector("header-section"),this.telemetryRow=this.shadowRoot.querySelector("telemetry-section"),this.middleRow=this.shadowRoot.querySelector("middle-row-section"),this.analyticsRow=this.shadowRoot.querySelector("analytics-section"),this.headerRow.config=this._config,this.telemetryRow.config=this._config,this.middleRow.config=this._config,this.analyticsRow.config=this._config)}getCardSize(){return 10}}customElements.define("jaecoo-obd2-card",b),window.customCards=window.customCards||[],window.customCards.push({type:"jaecoo-obd2-card",name:"Jaecoo OBD2 Dashboard Card",preview:!0,description:"Full schematic telemetry application interface for Jaecoo 7 vehicles including real-time maps, performance analytics, and diagnostic graphs."})})();
