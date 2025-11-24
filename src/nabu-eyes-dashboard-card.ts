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

  // Dedicated doorbell → alarm/doorbell variant trigger
  doorbell_entity?: string;

  // Timer integration
  timer_mode?: 'all' | 'custom' | 'off'; // All timers, only selected timers, or disabled
  timer_entities?: string[];

  // Per-event behaviour: ON = Nabu Countdown, OFF = Nabu Idle
  timer_event_started?: 'on' | 'off';
  timer_event_restarted?: 'on' | 'off';
  timer_event_paused?: 'on' | 'off';
  timer_event_cancelled?: 'on' | 'off';
  timer_event_finished?: 'on' | 'off';

  // Glow controls (one radius, four colour variants)
  glow_radius?: number; // px
  glow_color_blue?: string;
  glow_color_light?: string;
  glow_color_purple?: string;
  glow_color_sepia?: string;

  // Vertical padding around the avatar (top/bottom)
  avatar_padding_vertical?: number; // px

  // Overlay mode: show centered over rest of dashboard
  fullscreen_overlay?: boolean;

  // Idle dwell: keep idle visible before hiding when hide_when_idle is true
  idle_dwell_seconds?: number;
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

type AssetDescriptor = {
  src: string;
  glowClass: string;
};

export class NabuEyesDashboardCard extends LitElement implements LovelaceCard {
  public hass!: HomeAssistant;
  private _config?: NabuEyesDashboardCardConfig;
  private _countdownActive = false;
  private _alarmActive = false;

  private _lastAssistState?: NabuEyesAssistState;
  private _idleDwellUntil: number | null = null;
  private _idleDwellTimeout?: number;

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
      idle_dwell_seconds: 30,
      playing_variant: DEFAULT_PLAYING_VARIANT,
      media_player_equalizer: DEFAULT_EQUALIZER_VARIANT,
      countdown_events: [],
      countdown_clear_events: [],
      alarm_events: [],
      alarm_clear_events: [],
      alarm_active_states: DEFAULT_ALARM_ACTIVE_STATES,

      // Glow defaults (shared radius, per-variant colours)
      glow_radius: 40,
      glow_color_blue: 'rgba(0, 21, 255, 0.5)',
      glow_color_light: 'rgba(0, 255, 255, 0.5)',
      glow_color_purple: 'rgba(255, 0, 255, 0.5)',
      glow_color_sepia: 'rgba(255, 210, 0, 0.5)',

      // Vertical padding default
      avatar_padding_vertical: 0,

      // Overlay off by default
      fullscreen_overlay: false,

      // Timer defaults
      timer_mode: 'all',
      timer_event_started: 'on',
      timer_event_restarted: 'on',
      timer_event_paused: 'off',
      timer_event_cancelled: 'off',
      timer_event_finished: 'off',

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
    normalizedConfig.timer_entities = this._normalizeStringArray(
      normalizedConfig.timer_entities ?? [],
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
    this._resetIdleDwell();
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

    // Timer integration – subscribe to core timer events when not disabled
    if (this._config.timer_mode && this._config.timer_mode !== 'off') {
      eventTypes.add('timer.started');
      eventTypes.add('timer.restarted');
      eventTypes.add('timer.paused');
      eventTypes.add('timer.cancelled');
      eventTypes.add('timer.finished');
    }

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
        this._logError(`nabu-eyes-dashboard-card: failed to subscribe to event ${type}`, err);
      }
    }
  }

  private _unsubscribeFromEvents(): void {
    while (this._eventUnsubscribes.length) {
      const unsub = this._eventUnsubscribes.pop();
      if (unsub) unsub();
    }
  }

  private _isRelevantTimerEvent(eventType: string, data: Record<string, unknown>): boolean {
    if (!this._config || !this.hass) return false;
    if (!eventType.startsWith('timer.')) return false;

    const mode = this._config.timer_mode ?? 'all';
    if (mode === 'off') return false;

    const entityId = (data.entity_id as string | undefined) ?? '';
    if (!entityId.startsWith('timer.')) return false;

    if (mode === 'all') {
      return true;
    }

    const timers = this._config.timer_entities ?? [];
    if (!timers.length) return true; // treat as "all" if custom list empty
    return timers.includes(entityId);
  }

  private _handleEvent(
    expectedType: string,
    eventType: string,
    eventData: Record<string, unknown>,
  ): void {
    if (!this._config || eventType !== expectedType) return;

    // Timer events → Nabu countdown vs idle
    if (eventType.startsWith('timer.') && this._isRelevantTimerEvent(eventType, eventData)) {
      const cfg = this._config;

      const setFrom = (flag: 'on' | 'off' | undefined) => {
        if (!flag) return;
        this._countdownActive = flag === 'on';
      };

      switch (eventType) {
        case 'timer.started':
          setFrom(cfg.timer_event_started ?? 'on');
          break;
        case 'timer.restarted':
          setFrom(cfg.timer_event_restarted ?? 'on');
          break;
        case 'timer.paused':
          setFrom(cfg.timer_event_paused ?? 'off');
          break;
        case 'timer.cancelled':
          setFrom(cfg.timer_event_cancelled ?? 'off');
          break;
        case 'timer.finished':
          setFrom(cfg.timer_event_finished ?? 'off');
          break;
        default:
          break;
      }

      this.requestUpdate();
      return;
    }

    // Custom countdown / alarm events (existing logic)
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

  /** Map asset filename to a soft glow colour class */
  private _inferGlowClass(filename: string): string {
    const lower = filename.toLowerCase();

    if (lower.includes('_dash_light')) return 'glow-light';
    if (lower.includes('_dash_purple')) return 'glow-purple';
    if (lower.includes('_dash_sepia')) return 'glow-sepia';

    // Default blue theme
    return 'glow-blue';
  }

  protected render(): TemplateResult {
    if (!this._config) return html``;

    // Sync countdownActive with current timer states as a backstop (state.active / idle / paused)
    this._updateCountdownFromTimers();

    const asset = this._determineAsset();
    if (!asset) return html``;

    const { src, glowClass } = asset;

    const radius = this._config.glow_radius ?? 40;
    const padding = this._config.avatar_padding_vertical ?? 0;
    const overlay = this._config.fullscreen_overlay ?? false;

    const {
      glow_color_blue = 'rgba(0, 21, 255, 0.5)',
      glow_color_light = 'rgba(0, 255, 255, 0.5)',
      glow_color_purple = 'rgba(255, 0, 255, 0.5)',
      glow_color_sepia = 'rgba(255, 210, 0, 0.5)',
    } = this._config;

    const styleVars = [
      `--nabu-eyes-glow-radius: ${radius}px`,
      `--nabu-eyes-glow-color-blue: ${glow_color_blue}`,
      `--nabu-eyes-glow-color-light: ${glow_color_light}`,
      `--nabu-eyes-glow-color-purple: ${glow_color_purple}`,
      `--nabu-eyes-glow-color-sepia: ${glow_color_sepia}`,
      `--nabu-eyes-padding-vertical: ${padding}px`,
    ].join('; ');

    const containerClass = overlay ? 'avatar-container overlay' : 'avatar-container';

    const countdownLabel =
      this._countdownActive && (this._config.timer_mode ?? 'all') !== 'off'
        ? this._computeTimerCountdown()
        : null;

    return html`
      <div class="${containerClass}" style=${styleVars}>
        <img class="avatar ${glowClass}" src="${src}" alt="Nabu Eyes state" />
        ${countdownLabel ? html`<div class="countdown-overlay">${countdownLabel}</div>` : null}
      </div>
    `;
  }

  private _determineAsset(): AssetDescriptor | undefined {
    if (!this._config) return undefined;

    const basePath =
      this._config.asset_path && this._config.asset_path.trim().length > 0
        ? this._config.asset_path
        : DEFAULT_ASSET_PATH;

    const choose = (state: NabuEyesAssistState | NabuEyesPseudoState): AssetDescriptor => {
      const filename = this._resolveStateFilename(state);
      return {
        src: this._composeAssetPath(basePath, filename),
        glowClass: this._inferGlowClass(filename),
      };
    };

    const assistState = this._computeAssistState();
    const now = Date.now();
    const dwellSeconds = this._config.idle_dwell_seconds ?? 30;
    const prevAssist = this._lastAssistState;
    this._lastAssistState = assistState;

    // Maintain idle dwell window based on assist state transitions
    if (assistState && assistState !== 'idle') {
      // Any active state cancels idle dwell
      this._resetIdleDwell();
    } else if (assistState === 'idle' && this._config.hide_when_idle && dwellSeconds > 0) {
      if (prevAssist && prevAssist !== 'idle' && this._idleDwellUntil === null) {
        // Just transitioned active → idle: start dwell window
        const until = now + dwellSeconds * 1000;
        this._idleDwellUntil = until;
        this._scheduleIdleDwellTimeout(dwellSeconds * 1000);
      } else if (this._idleDwellUntil !== null && now >= this._idleDwellUntil) {
        // Dwell window expired
        this._idleDwellUntil = null;
      }
    } else if (!assistState) {
      // No assist state at all – reset dwell
      this._resetIdleDwell();
    }

    const inIdleDwell =
      assistState === 'idle' &&
      this._config.hide_when_idle &&
      dwellSeconds > 0 &&
      this._idleDwellUntil !== null &&
      now < this._idleDwellUntil;

    const alarmActive = this._alarmActive || this._isAlarmEntityActive();
    if (alarmActive) {
      return choose('alarm');
    }

    if (this._countdownActive) {
      return choose('countdown');
    }

    if (assistState === 'playing') {
      return choose('playing');
    }

    if (assistState && assistState !== 'idle') {
      return choose(assistState);
    }

    const mediaPlayerAsset = this._determineMediaPlayerAsset(basePath);
    if (mediaPlayerAsset) return mediaPlayerAsset;

    const muteAsset = this._determineMuteAsset(basePath);
    if (muteAsset) return muteAsset;

    // Idle / fallback idle (with glow + dwell)
    if (assistState === 'idle') {
      if (this._config.hide_when_idle && !inIdleDwell) return undefined;
      return choose('idle');
    }

    if (this._config.hide_when_idle) return undefined;
    return choose('idle');
  }

  private _scheduleIdleDwellTimeout(durationMs: number): void {
    if (this._idleDwellTimeout) {
      window.clearTimeout(this._idleDwellTimeout);
      this._idleDwellTimeout = undefined;
    }
    if (durationMs <= 0) return;
    this._idleDwellTimeout = window.setTimeout(() => {
      this._idleDwellTimeout = undefined;
      this.requestUpdate();
    }, durationMs);
  }

  private _determineMediaPlayerAsset(basePath: string): AssetDescriptor | undefined {
    if (!this._config?.media_player || !this.hass) return undefined;

    const mediaState = this.hass.states[this._config.media_player];
    if (!mediaState) return undefined;

    if (mediaState.state === 'playing') {
      const variant = this._config.media_player_equalizer ?? DEFAULT_EQUALIZER_VARIANT;
      const filename = EQUALIZER_VARIANTS[variant] ? variant : DEFAULT_EQUALIZER_VARIANT;
      const src = this._composeAssetPath(basePath, filename);
      return {
        src,
        glowClass: this._inferGlowClass(filename),
      };
    }

    return undefined;
  }

  private _determineMuteAsset(basePath: string): AssetDescriptor | undefined {
    const target = this._config?.mute_media_player ?? this._config?.media_player;
    if (!target || !this.hass) return undefined;

    const stateObj = this.hass.states[target];
    if (!stateObj) return undefined;

    const isMuted = !!stateObj.attributes?.is_volume_muted;
    if (!isMuted) return undefined;

    const filename = this._resolveStateFilename('mute');
    return {
      src: this._composeAssetPath(basePath, filename),
      glowClass: this._inferGlowClass(filename),
    };
  }

  private _isAlarmEntityActive(): boolean {
    if (!this.hass || !this._config) return false;

    const activeStates: ReadonlyArray<string> =
      this._config.alarm_active_states ?? DEFAULT_ALARM_ACTIVE_STATES;

    const sources: string[] = [
      ...(this._config.alarm_entities ?? []),
      ...(this._config.doorbell_entity ? [this._config.doorbell_entity] : []),
    ];

    if (!sources.length) return false;

    return sources.some((entityId) => {
      const stateObj = this.hass!.states[entityId];
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

    if (sourceIds.length === 0) {
      return undefined;
    }

    const states = sourceIds
      .map((entityId) => this.hass.states[entityId]?.state)
      .filter((state): state is string => typeof state === 'string');

    for (const desired of ASSIST_STATE_PRIORITY) {
      if (states.includes(desired)) {
        return desired;
      }
    }
    return undefined;
  }

  private _updateCountdownFromTimers(): void {
    if (!this.hass || !this._config) return;
    const mode = this._config.timer_mode ?? 'all';
    if (mode === 'off') return;

    const candidateIds =
      mode === 'custom' && (this._config.timer_entities?.length ?? 0) > 0
        ? this._config.timer_entities!
        : Object.keys(this.hass.states).filter((id) => id.startsWith('timer.'));

    if (!candidateIds.length) return;

    const states = candidateIds
      .map((id) => this.hass!.states[id])
      .filter((s): s is (typeof this.hass.states)[string] => !!s);

    if (!states.length) return;

    const hasActive = states.some((s) => s.state === 'active');
    if (hasActive) {
      this._countdownActive = true;
      return;
    }

    // OFF side: idle / paused mapped to Idle
    const hasIdleOrPaused = states.some((s) => s.state === 'idle' || s.state === 'paused');
    if (hasIdleOrPaused) {
      this._countdownActive = false;
    }
  }

  private _computeTimerCountdown(): string | null {
    if (!this.hass || !this._config) return null;
    const mode = this._config.timer_mode ?? 'all';
    if (mode === 'off') return null;

    const candidateIds =
      mode === 'custom' && (this._config.timer_entities?.length ?? 0) > 0
        ? this._config.timer_entities!
        : Object.keys(this.hass.states).filter((id) => id.startsWith('timer.'));

    if (!candidateIds.length) return null;

    // Prefer an active timer
    const activeState = candidateIds
      .map((id) => this.hass!.states[id])
      .find((s) => s && s.state === 'active');

    const timerState = activeState ?? null;
    if (!timerState) return null;

    const remaining = timerState.attributes?.remaining as string | undefined;
    if (!remaining) return null;

    const totalSeconds = this._parseDurationToSeconds(remaining);
    if (totalSeconds <= 0) return '00:00:00';

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  private _parseDurationToSeconds(value: string): number {
    const parts = value.split(':').map((p) => parseInt(p, 10));
    if (parts.some((n) => Number.isNaN(n))) return 0;

    let h = 0;
    let m = 0;
    let s = 0;

    if (parts.length === 3) {
      [h, m, s] = parts;
    } else if (parts.length === 2) {
      [m, s] = parts;
    } else if (parts.length === 1) {
      [s] = parts;
    }

    return h * 3600 + m * 60 + s;
  }

  private _resetIdleDwell(): void {
    this._idleDwellUntil = null;
    if (this._idleDwellTimeout) {
      window.clearTimeout(this._idleDwellTimeout);
      this._idleDwellTimeout = undefined;
    }
  }

  /** Centralised logging so all errors are easy to grep in the console */
  private _logError(message: string, error?: unknown): void {
    // eslint-disable-next-line no-console
    console.error('nabu-eyes-dashboard-card:', message, error ?? '');
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
        /* default radius + border colour */
        --nabu-eyes-glow-radius: 40px;
        --nabu-eyes-border-color: #000;
      }

      .avatar-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--nabu-eyes-padding-vertical, 0px) 0;
        box-sizing: border-box;
      }

      .avatar-container.overlay {
        position: fixed;
        inset: 0;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        pointer-events: none; /* let clicks pass through to dashboard */
      }

      .avatar {
        display: block;
        max-width: 100%;
        height: auto;
      }

      .countdown-overlay {
        position: absolute;
        right: 12px;
        bottom: 8px;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-family: monospace;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
      }

      /* One tight black halo around non-transparent pixels + single colour glow per palette */

      .glow-blue {
        filter: drop-shadow(0 0 12px var(--nabu-eyes-border-color))
          drop-shadow(
            0 0 var(--nabu-eyes-glow-radius) var(--nabu-eyes-glow-color-blue, rgba(0, 21, 255, 0.5))
          );
      }

      .glow-light {
        filter: drop-shadow(0 0 12px var(--nabu-eyes-border-color))
          drop-shadow(
            0 0 var(--nabu-eyes-glow-radius)
              var(--nabu-eyes-glow-color-light, rgba(0, 255, 255, 0.5))
          );
      }

      .glow-purple {
        filter: drop-shadow(0 0 12px var(--nabu-eyes-border-color))
          drop-shadow(
            0 0 var(--nabu-eyes-glow-radius)
              var(--nabu-eyes-glow-color-purple, rgba(255, 0, 255, 0.5))
          );
      }

      .glow-sepia {
        filter: drop-shadow(0 0 12px var(--nabu-eyes-border-color))
          drop-shadow(
            0 0 var(--nabu-eyes-glow-radius)
              var(--nabu-eyes-glow-color-sepia, rgba(255, 208, 0, 0.5))
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
    __NABU_EYES_DASHBOARD_CARD_VERSION__?: string;
  }
}

const CARD_TAG = 'nabu-eyes-dashboard-card';

const CARD_VERSION =
  typeof window !== 'undefined' && window.__NABU_EYES_DASHBOARD_CARD_VERSION__
    ? window.__NABU_EYES_DASHBOARD_CARD_VERSION__
    : 'dev';

if (!customElements.get(CARD_TAG)) {
  customElements.define(CARD_TAG, NabuEyesDashboardCard);

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.info(
      '%cNABU-EYES-DASHBOARD-CARD%c ' + CARD_VERSION + ' %cIS INSTALLED',
      'color:#03a9f4;font-weight:bold;',
      'color:#e0e0e0;font-weight:bold;',
      'color:#4caf50;font-weight:bold;',
    );
  }
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
