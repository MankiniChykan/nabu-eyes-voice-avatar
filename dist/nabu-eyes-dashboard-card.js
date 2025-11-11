import { css, html, LitElement } from 'lit';
import { fireEvent } from 'custom-card-helpers';

const DEFAULT_ASSET_PATH = '/local/nabu_eyes_dashboard';

const PLAYING_VARIANTS = {
  'nabu_playing_dash.gif': 'Nabu Playing',
  'nabu_equalizer_dash.gif': 'Nabu Equalizer',
  'nabu_equalizer_2_dash.gif': 'Nabu Equalizer 2'
};

const EQUALIZER_VARIANTS = {
  'nabu_equalizer_dash.gif': 'Nabu Equalizer',
  'nabu_equalizer_2_dash.gif': 'Nabu Equalizer 2',
  '1px_equalizer_dash.gif': '1px Equalizer',
  '1px_equalizer_fader_dash.gif': '1px Equalizer Fader',
  '1px_equalizer_fader_2_dash.gif': '1px Equalizer Fader 2',
  '2px_equalizer_dash.gif': '2px Equalizer',
  '2px_equalizer_fader_dash.gif': '2px Equalizer Fader',
  '2px_equalizer_fader_2_dash.gif': '2px Equalizer Fader 2',
  '2px_equalizer_bottom_dash.gif': '2px Bottom Equalizer',
  'nabu_music_dash.gif': 'Nabu Music'
};

const STATE_ASSET_MAP = {
  idle: 'nabu_idle_preview_dash.gif',
  listening: 'nabu_listening_dash.gif',
  processing: 'nabu_processing_dash.gif',
  responding: 'nabu_responding_dash.gif',
  playing: 'nabu_playing_dash.gif',
  alarm: 'nabu_alarm_dash.gif',
  countdown: 'nabu_countdown_dash.gif',
  mute: 'nabu_mute_dash.gif'
};

const DEFAULT_ALARM_ACTIVE_STATES = ['on', 'detected', 'unavailable'];

class NabuEyesDashboardCard extends LitElement {
  constructor() {
    super();
    this.hass = undefined;
    this._config = undefined;
    this._countdownActive = false;
    this._alarmActive = false;
    this._eventUnsubscribes = [];
  }

  static get properties() {
    return {
      hass: { attribute: false },
      _config: { state: true },
      _countdownActive: { state: true },
      _alarmActive: { state: true }
    };
  }

  static async getConfigElement() {
    return document.createElement('nabu-eyes-dashboard-card-editor');
  }

  static getStubConfig() {
    return {
      type: 'custom:nabu-eyes-dashboard-card',
      name: 'Nabu Eyes',
      assist_entities: []
    };
  }

  setConfig(config) {
    if (!config) {
      throw new Error('Invalid configuration.');
    }

    const normalizedConfig = {
      hide_when_idle: true,
      playing_variant: 'nabu_playing_dash.gif',
      media_player_equalizer: 'nabu_equalizer_dash.gif',
      countdown_events: [],
      countdown_clear_events: [],
      alarm_events: [],
      alarm_clear_events: [],
      alarm_active_states: DEFAULT_ALARM_ACTIVE_STATES.slice(),
      ...config,
      assist_entities: Array.isArray(config.assist_entities) ? [...config.assist_entities] : []
    };

    normalizedConfig.countdown_events = [...(normalizedConfig.countdown_events || [])];
    normalizedConfig.countdown_clear_events = [
      ...(normalizedConfig.countdown_clear_events || [])
    ];
    normalizedConfig.alarm_events = [...(normalizedConfig.alarm_events || [])];
    normalizedConfig.alarm_clear_events = [...(normalizedConfig.alarm_clear_events || [])];
    normalizedConfig.alarm_entities = [...(normalizedConfig.alarm_entities || [])];
    normalizedConfig.alarm_active_states = [...(normalizedConfig.alarm_active_states || [])];

    this._config = normalizedConfig;
    this._subscribeToEvents();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsubscribeFromEvents();
  }

  updated(changedProps) {
    if (changedProps.has('hass')) {
      this._subscribeToEvents();
    }
  }

  async _subscribeToEvents() {
    this._unsubscribeFromEvents();

    if (!this.hass || !this.hass.connection || !this._config) {
      return;
    }

    const eventTypes = new Set([
      ...(this._config.countdown_events || []),
      ...(this._config.countdown_clear_events || []),
      ...(this._config.alarm_events || []),
      ...(this._config.alarm_clear_events || [])
    ]);

    if (eventTypes.size === 0) {
      return;
    }

    for (const type of eventTypes) {
      if (!type) {
        continue;
      }
      try {
        const unsubscribe = await this.hass.connection.subscribeEvents((event) => {
          this._handleEvent(type, event.type, event.data || {});
        }, type);
        this._eventUnsubscribes.push(unsubscribe);
      } catch (err) {
        console.warn(`nabu-eyes-dashboard-card: failed to subscribe to event ${type}`, err);
      }
    }
  }

  _unsubscribeFromEvents() {
    while (this._eventUnsubscribes.length) {
      const unsubscribe = this._eventUnsubscribes.pop();
      if (unsubscribe) {
        unsubscribe();
      }
    }
  }

  _handleEvent(expectedType, eventType, eventData) {
    if (!this._config || eventType !== expectedType) {
      return;
    }

    const { countdown_events = [], countdown_clear_events = [], alarm_events = [], alarm_clear_events = [] } = this._config;

    if (countdown_events.includes(eventType)) {
      this._countdownActive = true;
    }

    if (countdown_clear_events.includes(eventType)) {
      this._countdownActive = false;
    }

    if (alarm_events.includes(eventType)) {
      this._alarmActive = true;
    }

    if (alarm_clear_events.includes(eventType)) {
      this._alarmActive = false;
    }

    if (Object.prototype.hasOwnProperty.call(eventData, 'active')) {
      if (countdown_events.includes(eventType) || countdown_clear_events.includes(eventType)) {
        this._countdownActive = !!eventData.active;
      }
      if (alarm_events.includes(eventType) || alarm_clear_events.includes(eventType)) {
        this._alarmActive = !!eventData.active;
      }
    }

    this.requestUpdate();
  }

  getCardSize() {
    return 3;
  }

  render() {
    if (!this._config) {
      return html``;
    }

    const asset = this._determineAsset();

    if (!asset) {
      return html``;
    }

    return html`
      <ha-card>
        ${this._config.name ? html`<div class="card-header">${this._config.name}</div>` : null}
        <div class="avatar-container">
          <img src="${asset}" alt="Nabu Eyes state" />
        </div>
      </ha-card>
    `;
  }

  _determineAsset() {
    if (!this._config) {
      return undefined;
    }

    const basePath = this._config.asset_path && this._config.asset_path.trim().length > 0
      ? this._config.asset_path
      : DEFAULT_ASSET_PATH;

    const alarmActive = this._alarmActive || this._isAlarmEntityActive();
    if (alarmActive) {
      return this._composeAssetPath(basePath, STATE_ASSET_MAP.alarm);
    }

    if (this._countdownActive) {
      return this._composeAssetPath(basePath, STATE_ASSET_MAP.countdown);
    }

    const assistState = this._computeAssistState();

    if (assistState === 'playing') {
      const playingVariant = this._config.playing_variant || 'nabu_playing_dash.gif';
      return this._composeAssetPath(basePath, PLAYING_VARIANTS[playingVariant] ? playingVariant : 'nabu_playing_dash.gif');
    }

    if (assistState && assistState !== 'idle') {
      const filename = STATE_ASSET_MAP[assistState];
      if (filename) {
        return this._composeAssetPath(basePath, filename);
      }
    }

    const mediaPlayerAsset = this._determineMediaPlayerAsset(basePath);
    if (mediaPlayerAsset) {
      return mediaPlayerAsset;
    }

    const muteAsset = this._determineMuteAsset(basePath);
    if (muteAsset) {
      return muteAsset;
    }

    if (assistState === 'idle') {
      if (this._config.hide_when_idle) {
        return undefined;
      }
      return this._composeAssetPath(basePath, STATE_ASSET_MAP.idle);
    }

    if (this._config.hide_when_idle) {
      return undefined;
    }

    return this._composeAssetPath(basePath, STATE_ASSET_MAP.idle);
  }

  _determineMediaPlayerAsset(basePath) {
    if (!this._config || !this._config.media_player || !this.hass) {
      return undefined;
    }
    const mediaState = this.hass.states[this._config.media_player];
    if (!mediaState) {
      return undefined;
    }

    if (mediaState.state === 'playing') {
      const variant = this._config.media_player_equalizer || 'nabu_equalizer_dash.gif';
      const filename = EQUALIZER_VARIANTS[variant] ? variant : 'nabu_equalizer_dash.gif';
      return this._composeAssetPath(basePath, filename);
    }
    return undefined;
  }

  _determineMuteAsset(basePath) {
    const target = (this._config && (this._config.mute_media_player || this._config.media_player)) || undefined;
    if (!target || !this.hass) {
      return undefined;
    }
    const stateObj = this.hass.states[target];
    if (!stateObj) {
      return undefined;
    }

    const isMuted = !!(stateObj.attributes && stateObj.attributes.is_volume_muted);
    if (!isMuted) {
      return undefined;
    }

    const filename = stateObj.state === 'off' ? 'nabu_mute_dash.gif' : 'nabu_mute_red_dash.gif';
    return this._composeAssetPath(basePath, filename);
  }

  _isAlarmEntityActive() {
    if (!this._config || !this._config.alarm_entities || this._config.alarm_entities.length === 0 || !this.hass) {
      return false;
    }

    const activeStates = this._config.alarm_active_states || DEFAULT_ALARM_ACTIVE_STATES;

    return this._config.alarm_entities.some((entityId) => {
      const stateObj = this.hass.states[entityId];
      if (!stateObj) {
        return false;
      }
      return activeStates.includes(stateObj.state);
    });
  }

  _composeAssetPath(basePath, filename) {
    if (!basePath.endsWith('/')) {
      return `${basePath}/${filename}`;
    }
    return `${basePath}${filename}`;
  }

  _computeAssistState() {
    if (!this._config || !this._config.assist_entities || this._config.assist_entities.length === 0 || !this.hass) {
      return undefined;
    }

    const priority = ['responding', 'processing', 'listening', 'playing', 'idle'];

    const states = this._config.assist_entities
      .map((entityId) => {
        const stateObj = this.hass.states[entityId];
        return stateObj ? stateObj.state : undefined;
      })
      .filter((state) => typeof state === 'string');

    for (const desired of priority) {
      if (states.includes(desired)) {
        return desired;
      }
    }

    return states.length > 0 ? states[0] : undefined;
  }

  static get styles() {
    return css`
      ha-card {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        padding: 12px;
        box-sizing: border-box;
      }

      .card-header {
        font-size: 20px;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .avatar-container {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      img {
        max-width: 100%;
        height: auto;
      }
    `;
  }
}

if (!customElements.get('nabu-eyes-dashboard-card')) {
  customElements.define('nabu-eyes-dashboard-card', NabuEyesDashboardCard);
}

class NabuEyesDashboardCardEditor extends LitElement {
  constructor() {
    super();
    this.hass = undefined;
    this._config = undefined;
  }

  static get properties() {
    return {
      hass: { attribute: false },
      _config: { state: true }
    };
  }

  setConfig(config) {
    this._config = {
      ...config,
      assist_entities: [...(config.assist_entities || [])],
      countdown_events: [...(config.countdown_events || [])],
      countdown_clear_events: [...(config.countdown_clear_events || [])],
      alarm_events: [...(config.alarm_events || [])],
      alarm_clear_events: [...(config.alarm_clear_events || [])],
      alarm_entities: [...(config.alarm_entities || [])],
      alarm_active_states: [...(config.alarm_active_states || DEFAULT_ALARM_ACTIVE_STATES)]
    };
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    const config = this._config;

    return html`
      <div class="form">
        <ha-textfield
          label="Name"
          .value=${config.name || ''}
          @input=${this._handleTextValue}
          data-field="name"
        ></ha-textfield>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${config.assist_entities || []}
          label="Assist satellite entities"
          .multiple=${true}
          @value-changed=${this._handleAssistEntities}
          allow-custom-entity
        ></ha-entity-picker>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${config.media_player || ''}
          label="Media player for equalizer"
          domain="media_player"
          @value-changed=${this._handleMediaPlayer}
          allow-custom-entity
        ></ha-entity-picker>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${config.mute_media_player || ''}
          label="Media player for mute state"
          domain="media_player"
          @value-changed=${this._handleMuteMediaPlayer}
          allow-custom-entity
        ></ha-entity-picker>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${config.alarm_entities || []}
          label="Alarm / doorbell entities"
          .multiple=${true}
          @value-changed=${this._handleAlarmEntities}
          allow-custom-entity
        ></ha-entity-picker>

        <ha-select
          .value=${config.playing_variant || 'nabu_playing_dash.gif'}
          label="Assist playing animation"
          @selected=${this._handlePlayingVariant}
          @closed=${this._stopPropagation}
        >
          ${Object.entries(PLAYING_VARIANTS).map(
            ([key, label]) => html`<mwc-list-item .value=${key}>${label}</mwc-list-item>`
          )}
        </ha-select>

        <ha-select
          .value=${config.media_player_equalizer || 'nabu_equalizer_dash.gif'}
          label="Media player equalizer"
          @selected=${this._handleEqualizerVariant}
          @closed=${this._stopPropagation}
        >
          ${Object.entries(EQUALIZER_VARIANTS).map(
            ([key, label]) => html`<mwc-list-item .value=${key}>${label}</mwc-list-item>`
          )}
        </ha-select>

        <ha-textfield
          label="Asset path"
          helper="Folder within /local containing GIF assets"
          .value=${config.asset_path || ''}
          @input=${this._handleTextValue}
          data-field="asset_path"
        ></ha-textfield>

        <div class="switch-row">
          <span>Hide when idle</span>
          <ha-switch
            .checked=${config.hide_when_idle !== false}
            @change=${this._handleHideWhenIdle}
          ></ha-switch>
        </div>

        ${this._renderEventInputs('Countdown events', 'countdown_events', config.countdown_events)}
        ${this._renderEventInputs(
          'Countdown clear events',
          'countdown_clear_events',
          config.countdown_clear_events
        )}
        ${this._renderEventInputs('Alarm events', 'alarm_events', config.alarm_events)}
        ${this._renderEventInputs(
          'Alarm clear events',
          'alarm_clear_events',
          config.alarm_clear_events
        )}

        <ha-textfield
          label="Alarm active states"
          helper="Comma separated list of states considered active"
          .value=${(config.alarm_active_states || DEFAULT_ALARM_ACTIVE_STATES).join(', ')}
          @input=${this._handleStringArray}
          data-field="alarm_active_states"
        ></ha-textfield>
      </div>
    `;
  }

  _renderEventInputs(label, field, values) {
    return html`
      <ha-textfield
        label=${label}
        helper="Comma separated list of Home Assistant event types"
        .value=${(values || []).join(', ')}
        @input=${this._handleStringArray}
        data-field=${field}
      ></ha-textfield>
    `;
  }

  _handleTextValue(event) {
    const target = event.currentTarget;
    if (!target || !target.dataset || !target.dataset.field || !this._config) {
      return;
    }

    const value = target.value;
    this._updateConfig(target.dataset.field, value || undefined);
  }

  _handleStringArray(event) {
    const target = event.currentTarget;
    if (!target || !target.dataset || !target.dataset.field || !this._config) {
      return;
    }

    const value = target.value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    this._updateConfig(target.dataset.field, value);
  }

  _handleAssistEntities(event) {
    const detail = event.detail || {};
    const value = Array.isArray(detail.value)
      ? detail.value
      : detail.value
      ? [detail.value]
      : [];
    this._updateConfig('assist_entities', value);
  }

  _handleMediaPlayer(event) {
    const detail = event.detail || {};
    this._updateConfig('media_player', detail.value || undefined);
  }

  _handleMuteMediaPlayer(event) {
    const detail = event.detail || {};
    this._updateConfig('mute_media_player', detail.value || undefined);
  }

  _handleAlarmEntities(event) {
    const detail = event.detail || {};
    const value = Array.isArray(detail.value)
      ? detail.value
      : detail.value
      ? [detail.value]
      : [];
    this._updateConfig('alarm_entities', value);
  }

  _handlePlayingVariant(event) {
    const select = event.currentTarget;
    const value = select && select.value;
    if (value) {
      this._updateConfig('playing_variant', value);
    }
  }

  _handleEqualizerVariant(event) {
    const select = event.currentTarget;
    const value = select && select.value;
    if (value) {
      this._updateConfig('media_player_equalizer', value);
    }
  }

  _handleHideWhenIdle(event) {
    const target = event.currentTarget;
    this._updateConfig('hide_when_idle', !!(target && target.checked));
  }

  _stopPropagation(event) {
    event.stopPropagation();
  }

  _updateConfig(field, value) {
    if (!this._config) {
      return;
    }

    const newConfig = {
      ...this._config,
      [field]: value
    };

    this._config = newConfig;
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  static get styles() {
    return css`
      .form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .switch-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `;
  }
}

if (!customElements.get('nabu-eyes-dashboard-card-editor')) {
  customElements.define('nabu-eyes-dashboard-card-editor', NabuEyesDashboardCardEditor);
}

export { NabuEyesDashboardCardEditor, NabuEyesDashboardCard };
