import { css, CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from 'custom-card-helpers';
import type { HassEvent } from 'home-assistant-js-websocket';
import {
  DEFAULT_ALARM_ACTIVE_STATES,
  DEFAULT_ASSET_PATH,
  DEFAULT_EQUALIZER_VARIANT,
  DEFAULT_PLAYING_VARIANT,
  EQUALIZER_VARIANTS,
  PLAYING_VARIANTS,
  STATE_ASSET_MAP,
} from './const';
import './editor/nabu-eyes-dashboard-card-editor';

export interface NabuEyesDashboardCardConfig extends LovelaceCardConfig {
  name?: string;
  assist_entities?: string[];
  media_player?: string;
  mute_media_player?: string;
  hide_when_idle?: boolean;
  playing_variant?: keyof typeof PLAYING_VARIANTS;
  media_player_equalizer?: keyof typeof EQUALIZER_VARIANTS;
  asset_path?: string;
  countdown_events?: string[];
  countdown_clear_events?: string[];
  alarm_events?: string[];
  alarm_clear_events?: string[];
  alarm_entities?: string[];
  alarm_active_states?: readonly string[];
  state_idle_variant?: string;
  state_listening_variant?: string;
  state_processing_variant?: string;
  state_responding_variant?: string;
  state_alarm_variant?: string;
  state_countdown_variant?: string;
  state_mute_variant?: string;
}

type NabuEyesAssistState = 'idle' | 'listening' | 'processing' | 'responding' | 'playing';
type NabuEyesPseudoState = 'alarm' | 'countdown' | 'mute';
type UnsubscribeFunc = () => void;

const STATE_ASSET_MAP_TYPED: Record<NabuEyesAssistState | NabuEyesPseudoState, string> =
  STATE_ASSET_MAP;

const ASSIST_STATE_PRIORITY: ReadonlyArray<NabuEyesAssistState> = [
  'responding',
  'playing',
  'processing',
  'listening',
  'idle',
];

export class NabuEyesDashboardCard extends LitElement implements LovelaceCard {
  public hass!: HomeAssistant;
  private _config?: NabuEyesDashboardCardConfig;
  private _countdownActive = false;
  private _alarmActive = false;

  public static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _countdownActive: { state: true },
    _alarmActive: { state: true },
  } as const;

  private _eventUnsubscribes: UnsubscribeFunc[] = [];

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('nabu-eyes-dashboard-card-editor');
  }

  public static getStubConfig(): NabuEyesDashboardCardConfig {
    return {
      type: 'custom:nabu-eyes-dashboard-card',
      name: 'Nabu Eyes',
      assist_entities: [],
      asset_path: DEFAULT_ASSET_PATH,
    };
  }

  public setConfig(config: LovelaceCardConfig): void {
    if (!config) throw new Error('Invalid configuration.');

    const normalizedConfig: NabuEyesDashboardCardConfig = {
      hide_when_idle: false,
      playing_variant: DEFAULT_PLAYING_VARIANT,
      media_player_equalizer: DEFAULT_EQUALIZER_VARIANT,
      countdown_events: [],
      countdown_clear_events: [],
      alarm_events: [],
      alarm_clear_events: [],
      alarm_active_states: DEFAULT_ALARM_ACTIVE_STATES,
      ...config,
      assist_entities: Array.isArray((config as NabuEyesDashboardCardConfig).assist_entities)
        ? [...((config as NabuEyesDashboardCardConfig).assist_entities ?? [])]
        : [],
    };

    normalizedConfig.assist_entities = this._normalizeStringArray(normalizedConfig.assist_entities);
    normalizedConfig.countdown_events = this._normalizeStringArray(
      normalizedConfig.countdown_events,
    );
    normalizedConfig.countdown_clear_events = this._normalizeStringArray(
      normalizedConfig.countdown_clear_events,
    );
    normalizedConfig.alarm_events = this._normalizeStringArray(normalizedConfig.alarm_events);
    normalizedConfig.alarm_clear_events = this._normalizeStringArray(
      normalizedConfig.alarm_clear_events,
    );
    normalizedConfig.alarm_entities = this._normalizeStringArray(normalizedConfig.alarm_entities);
    normalizedConfig.alarm_active_states = this._normalizeStringArray(
      normalizedConfig.alarm_active_states?.length
        ? normalizedConfig.alarm_active_states
        : [...DEFAULT_ALARM_ACTIVE_STATES],
    );

    const assetPath = normalizedConfig.asset_path?.trim();
    normalizedConfig.asset_path =
      assetPath && assetPath.length > 0 ? assetPath : DEFAULT_ASSET_PATH;

    if (
      !normalizedConfig.playing_variant ||
      !(normalizedConfig.playing_variant in PLAYING_VARIANTS)
    ) {
      normalizedConfig.playing_variant = DEFAULT_PLAYING_VARIANT;
    }
    if (
      normalizedConfig.media_player_equalizer &&
      !(normalizedConfig.media_player_equalizer in EQUALIZER_VARIANTS)
    ) {
      normalizedConfig.media_player_equalizer = DEFAULT_EQUALIZER_VARIANT;
    }

    this._config = normalizedConfig;
    this._subscribeToEvents();
  }

  private _normalizeStringArray(values?: readonly string[] | null): string[] {
    return Array.from(
      new Set((values ?? []).map((v) => v?.trim()).filter((v): v is string => !!v?.length)),
    );
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribeFromEvents();
  }

  protected updated(changedProps: Map<string | number | symbol, unknown>): void {
    if (changedProps.has('hass')) this._subscribeToEvents();
  }

  private async _subscribeToEvents(): Promise<void> {
    this._unsubscribeFromEvents();
    if (!this.hass?.connection || !this._config) return;

    const eventTypes = new Set<string>([
      ...(this._config.countdown_events ?? []),
      ...(this._config.countdown_clear_events ?? []),
      ...(this._config.alarm_events ?? []),
      ...(this._config.alarm_clear_events ?? []),
    ]);
    if (eventTypes.size === 0) return;

    for (const type of eventTypes) {
      if (!type) continue;
      try {
        const unsubscribe = await this.hass.connection.subscribeEvents<HassEvent>((event) => {
          this._handleEvent(type, event.event_type, event.data as Record<string, unknown>);
        }, type);
        this._eventUnsubscribes.push(unsubscribe);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`nabu-eyes-dashboard-card: failed to subscribe to event ${type}`, err);
      }
    }
  }

  private _unsubscribeFromEvents(): void {
    while (this._eventUnsubscribes.length) {
      const unsub = this._eventUnsubscribes.pop();
      if (unsub) unsub();
    }
  }

  private _handleEvent(
    expectedType: string,
    eventType: string,
    eventData: Record<string, unknown>,
  ): void {
    if (!this._config || eventType !== expectedType) return;

    const {
      countdown_events = [],
      countdown_clear_events = [],
      alarm_events = [],
      alarm_clear_events = [],
    } = this._config;

    if (countdown_events.includes(eventType)) this._countdownActive = true;
    if (countdown_clear_events.includes(eventType)) this._countdownActive = false;
    if (alarm_events.includes(eventType)) this._alarmActive = true;
    if (alarm_clear_events.includes(eventType)) this._alarmActive = false;

    if (
      eventData &&
      Object.prototype.hasOwnProperty.call(eventData, 'active') &&
      typeof (eventData as any).active === 'boolean'
    ) {
      const active = !!(eventData as any).active;
      if (countdown_events.includes(eventType) || countdown_clear_events.includes(eventType)) {
        this._countdownActive = active;
      }
      if (alarm_events.includes(eventType) || alarm_clear_events.includes(eventType)) {
        this._alarmActive = active;
      }
    }
  }

  public getCardSize(): number {
    return 3;
  }

  private _resolveStateFilename(state: NabuEyesAssistState | NabuEyesPseudoState): string {
    if (!this._config) return STATE_ASSET_MAP_TYPED[state];

    switch (state) {
      case 'idle':
        return this._config.state_idle_variant || STATE_ASSET_MAP_TYPED.idle;
      case 'listening':
        return this._config.state_listening_variant || STATE_ASSET_MAP_TYPED.listening;
      case 'processing':
        return this._config.state_processing_variant || STATE_ASSET_MAP_TYPED.processing;
      case 'responding':
        return this._config.state_responding_variant || STATE_ASSET_MAP_TYPED.responding;
      case 'playing':
        return this._config.playing_variant || STATE_ASSET_MAP_TYPED.playing;
      case 'alarm':
        return this._config.state_alarm_variant || STATE_ASSET_MAP_TYPED.alarm;
      case 'countdown':
        return this._config.state_countdown_variant || STATE_ASSET_MAP_TYPED.countdown;
      case 'mute':
        return this._config.state_mute_variant || STATE_ASSET_MAP_TYPED.mute;
      default:
        return STATE_ASSET_MAP_TYPED[state];
    }
  }

  protected render(): TemplateResult {
    if (!this._config) return html``;

    const asset = this._determineAsset();
    if (!asset) return html``;

    return html`
      <ha-card>
        <div class="avatar-container">
          <img src="${asset}" alt="Nabu Eyes state" />
        </div>
      </ha-card>
    `;
  }

  private _determineAsset(): string | undefined {
    if (!this._config) return undefined;

    const basePath =
      this._config.asset_path && this._config.asset_path.trim().length > 0
        ? this._config.asset_path
        : DEFAULT_ASSET_PATH;

    const alarmActive = this._alarmActive || this._isAlarmEntityActive();
    if (alarmActive) {
      const filename = this._resolveStateFilename('alarm');
      return this._composeAssetPath(basePath, filename);
    }

    if (this._countdownActive) {
      const filename = this._resolveStateFilename('countdown');
      return this._composeAssetPath(basePath, filename);
    }

    const assistState = this._computeAssistState();

    if (assistState === 'playing') {
      const playingVariant = this._config.playing_variant ?? DEFAULT_PLAYING_VARIANT;
      return this._composeAssetPath(basePath, playingVariant);
    }

    if (assistState && assistState !== 'idle') {
      const filename = this._resolveStateFilename(assistState);
      return this._composeAssetPath(basePath, filename);
    }

    const mediaPlayerAsset = this._determineMediaPlayerAsset(basePath);
    if (mediaPlayerAsset) return mediaPlayerAsset;

    const muteAsset = this._determineMuteAsset(basePath);
    if (muteAsset) return muteAsset;

    if (assistState === 'idle') {
      if (this._config.hide_when_idle) return undefined;
      const filename = this._resolveStateFilename('idle');
      return this._composeAssetPath(basePath, filename);
    }

    if (this._config.hide_when_idle) return undefined;
    const fallbackIdle = this._resolveStateFilename('idle');
    return this._composeAssetPath(basePath, fallbackIdle);
  }

  private _determineMediaPlayerAsset(basePath: string): string | undefined {
    if (!this._config?.media_player || !this.hass) return undefined;
    const mediaState = this.hass.states[this._config.media_player];
    if (!mediaState) return undefined;

    if (mediaState.state === 'playing') {
      const variant = this._config.media_player_equalizer ?? DEFAULT_EQUALIZER_VARIANT;
      const filename = EQUALIZER_VARIANTS[variant] ? variant : DEFAULT_EQUALIZER_VARIANT;
      return this._composeAssetPath(basePath, filename);
    }
    return undefined;
  }

  private _determineMuteAsset(basePath: string): string | undefined {
    const target = this._config?.mute_media_player ?? this._config?.media_player;
    if (!target || !this.hass) return undefined;

    const stateObj = this.hass.states[target];
    if (!stateObj) return undefined;

    const isMuted = !!stateObj.attributes?.is_volume_muted;
    if (!isMuted) return undefined;

    const filename = this._resolveStateFilename('mute');
    return this._composeAssetPath(basePath, filename);
  }

  private _isAlarmEntityActive(): boolean {
    if (!this._config?.alarm_entities?.length || !this.hass) return false;

    const activeStates: ReadonlyArray<string> =
      this._config.alarm_active_states ?? DEFAULT_ALARM_ACTIVE_STATES;

    return this._config.alarm_entities.some((entityId) => {
      const stateObj = this.hass.states[entityId];
      if (!stateObj) return false;
      return activeStates.includes(stateObj.state);
    });
  }

  private _composeAssetPath(basePath: string, filename: string): string {
    if (!basePath.endsWith('/')) return `${basePath}/${filename}`;
    return `${basePath}${filename}`;
  }

  /** Auto-discover assist_satellite.* if none configured so the card works on first load */
  private _computeAssistState(): NabuEyesAssistState | undefined {
    if (!this.hass) return undefined;

    const configured = this._config?.assist_entities ?? [];
    const sourceIds =
      configured.length > 0
        ? configured
        : Object.keys(this.hass.states).filter((eid) => eid.startsWith('assist_satellite.'));

    if (sourceIds.length === 0) return undefined;

    const states = sourceIds
      .map((entityId) => this.hass.states[entityId]?.state)
      .filter((state): state is string => typeof state === 'string');

    for (const desired of ASSIST_STATE_PRIORITY) {
      if (states.includes(desired)) return desired;
    }
    return undefined;
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
        --ha-card-background: transparent;
        --ha-card-box-shadow: none;
      }

      ha-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0;
        box-sizing: border-box;
        background: transparent !important;
        box-shadow: none !important;
        border-radius: 0;
        border: none;
      }

      .avatar-container {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .avatar-container img {
        max-width: 100%;
        height: auto;
        filter: drop-shadow(
          0 0 10px var(--nabu-eyes-glow-color, rgba(0, 255, 255, 0.9))
        );
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nabu-eyes-dashboard-card': NabuEyesDashboardCard;
  }
}

type CustomCardDefinition = {
  type: string;
  name: string;
  description: string;
  preview?: boolean;
};

declare global {
  interface Window {
    customCards?: CustomCardDefinition[];
  }
}

const CARD_TAG = 'nabu-eyes-dashboard-card';

if (!customElements.get(CARD_TAG)) {
  customElements.define(CARD_TAG, NabuEyesDashboardCard);
}

if (typeof window !== 'undefined') {
  window.customCards = window.customCards ?? [];
  const hasDefinition = window.customCards.some((card) => card.type === CARD_TAG);
  if (!hasDefinition) {
    window.customCards.push({
      type: CARD_TAG,
      name: 'Nabu Eyes Dashboard',
      description: 'Animated Assist avatar with media and alarm indicators.',
      preview: true,
    });
  }
}
