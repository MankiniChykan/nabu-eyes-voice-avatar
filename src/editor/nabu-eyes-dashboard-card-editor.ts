import { css, CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { fireEvent, HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import {
  DEFAULT_ALARM_ACTIVE_STATES,
  DEFAULT_ASSET_PATH,
  DEFAULT_EQUALIZER_VARIANT,
  DEFAULT_PLAYING_VARIANT,
  EQUALIZER_VARIANTS,
  PLAYING_VARIANTS,
  STATE_ASSET_MAP,
  STATE_VARIANTS,
} from '../const';
import { NabuEyesDashboardCardConfig } from '../nabu-eyes-dashboard-card';

// Minimal schema type so we don't depend on HA internals
type HaFormSchema = {
  name: string;
  selector: any;
};

const DEFAULT_GLOW_BLUE = 'rgba(0, 21, 255, 0.5)';
const DEFAULT_GLOW_LIGHT = 'rgba(0, 255, 255, 0.5)';
const DEFAULT_GLOW_PURPLE = 'rgba(255, 0, 255, 0.5)';
const DEFAULT_GLOW_SEPIA = 'rgba(255, 210, 0, 0.5)';

// Prebuild select options from the constant maps
const playingOptions = Object.entries(PLAYING_VARIANTS).map(([value, label]) => ({
  value,
  label,
}));

const equalizerOptions = Object.entries(EQUALIZER_VARIANTS).map(([value, label]) => ({
  value,
  label,
}));

const idleVariantOptions = Object.entries(STATE_VARIANTS.idle).map(([value, label]) => ({
  value,
  label,
}));

const listeningVariantOptions = Object.entries(STATE_VARIANTS.listening).map(([value, label]) => ({
  value,
  label,
}));

const processingVariantOptions = Object.entries(STATE_VARIANTS.processing).map(
  ([value, label]) => ({ value, label }),
);

const respondingVariantOptions = Object.entries(STATE_VARIANTS.responding).map(
  ([value, label]) => ({ value, label }),
);

const alarmVariantOptions = Object.entries(STATE_VARIANTS.alarm).map(([value, label]) => ({
  value,
  label,
}));

const countdownVariantOptions = Object.entries(STATE_VARIANTS.countdown).map(([value, label]) => ({
  value,
  label,
}));

const muteVariantOptions = Object.entries(STATE_VARIANTS.mute).map(([value, label]) => ({
  value,
  label,
}));

// Built-in form schema – HA renders all controls except glow colour pickers
const SCHEMA: HaFormSchema[] = [
  {
    name: 'name',
    selector: { text: {} },
  },
  {
    name: 'assist_entities',
    selector: {
      entity: {
        domain: 'assist_satellite',
        multiple: true, // array of satellites
      },
    },
  },
  {
    name: 'playing_variant',
    selector: {
      select: {
        options: playingOptions,
      },
    },
  },
  {
    name: 'media_player',
    selector: {
      entity: {
        domain: 'media_player',
      },
    },
  },
  {
    name: 'mute_media_player',
    selector: {
      entity: {
        domain: 'media_player',
      },
    },
  },
  {
    name: 'media_player_equalizer',
    selector: {
      select: {
        options: equalizerOptions,
      },
    },
  },
  {
    name: 'asset_path',
    selector: {
      text: {},
    },
  },
  {
    name: 'hide_when_idle',
    selector: {
      boolean: {},
    },
  },
  {
    name: 'idle_dwell_seconds',
    selector: {
      number: {
        min: 0,
        max: 600,
        mode: 'box',
      },
    },
  },
  {
    name: 'fullscreen_overlay',
    selector: {
      boolean: {},
    },
  },
  // Per-state variants
  {
    name: 'state_idle_variant',
    selector: {
      select: {
        options: idleVariantOptions,
      },
    },
  },
  {
    name: 'state_listening_variant',
    selector: {
      select: {
        options: listeningVariantOptions,
      },
    },
  },
  {
    name: 'state_processing_variant',
    selector: {
      select: {
        options: processingVariantOptions,
      },
    },
  },
  {
    name: 'state_responding_variant',
    selector: {
      select: {
        options: respondingVariantOptions,
      },
    },
  },
  {
    name: 'state_countdown_variant',
    selector: {
      select: {
        options: countdownVariantOptions,
      },
    },
  },
  {
    name: 'state_mute_variant',
    selector: {
      select: {
        options: muteVariantOptions,
      },
    },
  },
  // Doorbell → alarm/doorbell variant trigger
  {
    name: 'doorbell_entity',
    selector: {
      entity: {
        domain: ['binary_sensor', 'input_boolean', 'switch', 'button'],
      },
    },
  },
  {
    name: 'state_alarm_variant',
    selector: {
      select: {
        options: alarmVariantOptions,
      },
    },
  },
  // Timer integration
  {
    name: 'timer_mode',
    selector: {
      select: {
        mode: 'list',
        options: [
          { value: 'all', label: 'All timer entities' },
          { value: 'custom', label: 'Custom timer entities' },
          { value: 'off', label: 'Timer integration disabled' },
        ],
      },
    },
  },
  {
    name: 'timer_entities',
    selector: {
      entity: {
        domain: 'timer',
        multiple: true,
      },
    },
  },
  {
    name: 'timer_event_started',
    selector: {
      select: {
        mode: 'list',
        options: [
          { value: 'on', label: 'ON (Countdown)' },
          { value: 'off', label: 'OFF (Idle)' },
        ],
      },
    },
  },
  {
    name: 'timer_event_restarted',
    selector: {
      select: {
        mode: 'list',
        options: [
          { value: 'on', label: 'ON (Countdown)' },
          { value: 'off', label: 'OFF (Idle)' },
        ],
      },
    },
  },
  {
    name: 'timer_event_paused',
    selector: {
      select: {
        mode: 'list',
        options: [
          { value: 'on', label: 'ON (Countdown)' },
          { value: 'off', label: 'OFF (Idle)' },
        ],
      },
    },
  },
  {
    name: 'timer_event_cancelled',
    selector: {
      select: {
        mode: 'list',
        options: [
          { value: 'on', label: 'ON (Countdown)' },
          { value: 'off', label: 'OFF (Idle)' },
        ],
      },
    },
  },
  {
    name: 'timer_event_finished',
    selector: {
      select: {
        mode: 'list',
        options: [
          { value: 'on', label: 'ON (Countdown)' },
          { value: 'off', label: 'OFF (Idle)' },
        ],
      },
    },
  },
  // Events – edited as multiline text, converted to arrays in _valueChanged
  {
    name: 'countdown_events',
    selector: {
      text: { multiline: true },
    },
  },
  {
    name: 'countdown_clear_events',
    selector: {
      text: { multiline: true },
    },
  },
  {
    name: 'alarm_events',
    selector: {
      text: { multiline: true },
    },
  },
  {
    name: 'alarm_clear_events',
    selector: {
      text: { multiline: true },
    },
  },
  {
    name: 'alarm_active_states',
    selector: {
      text: { multiline: true },
    },
  },
  // Glow & layout – radius + padding stay in ha-form; colours handled manually below
  {
    name: 'glow_radius',
    selector: {
      number: {
        min: 0,
        max: 200,
        mode: 'box',
      },
    },
  },
  {
    name: 'avatar_padding_vertical',
    selector: {
      number: {
        min: 0,
        max: 200,
        mode: 'box',
      },
    },
  },
];

export class NabuEyesDashboardCardEditor extends LitElement implements LovelaceCardEditor {
  public hass!: HomeAssistant;
  private _config?: NabuEyesDashboardCardConfig;
  private _bootstrapped = false;

  public static properties = {
    hass: { attribute: false },
    _config: { state: true },
  } as const;

  public setConfig(config: NabuEyesDashboardCardConfig): void {
    this._config = {
      ...config,
      assist_entities: [...(config.assist_entities ?? [])],
      playing_variant: config.playing_variant ?? DEFAULT_PLAYING_VARIANT,
      countdown_events: [...(config.countdown_events ?? [])],
      countdown_clear_events: [...(config.countdown_clear_events ?? [])],
      alarm_events: [...(config.alarm_events ?? [])],
      alarm_clear_events: [...(config.alarm_clear_events ?? [])],
      alarm_entities: [...(config.alarm_entities ?? [])],
      alarm_active_states: [...(config.alarm_active_states ?? DEFAULT_ALARM_ACTIVE_STATES)],
      hide_when_idle: config.hide_when_idle ?? false,
      idle_dwell_seconds: config.idle_dwell_seconds ?? 30,

      glow_radius: config.glow_radius ?? 40,
      avatar_padding_vertical: config.avatar_padding_vertical ?? 0,

      glow_color_blue: config.glow_color_blue ?? DEFAULT_GLOW_BLUE,
      glow_color_light: config.glow_color_light ?? DEFAULT_GLOW_LIGHT,
      glow_color_purple: config.glow_color_purple ?? DEFAULT_GLOW_PURPLE,
      glow_color_sepia: config.glow_color_sepia ?? DEFAULT_GLOW_SEPIA,

      fullscreen_overlay: config.fullscreen_overlay ?? false,
      asset_path: config.asset_path ?? DEFAULT_ASSET_PATH,
      media_player_equalizer: config.media_player_equalizer ?? DEFAULT_EQUALIZER_VARIANT,
      state_idle_variant: config.state_idle_variant ?? STATE_ASSET_MAP.idle,
      state_listening_variant: config.state_listening_variant ?? STATE_ASSET_MAP.listening,
      state_processing_variant: config.state_processing_variant ?? STATE_ASSET_MAP.processing,
      state_responding_variant: config.state_responding_variant ?? STATE_ASSET_MAP.responding,
      state_alarm_variant: config.state_alarm_variant ?? STATE_ASSET_MAP.alarm,
      state_countdown_variant: config.state_countdown_variant ?? STATE_ASSET_MAP.countdown,
      state_mute_variant: config.state_mute_variant ?? STATE_ASSET_MAP.mute,

      // Timer integration defaults
      timer_mode: config.timer_mode ?? 'all',
      timer_entities: [...(config.timer_entities ?? [])],
      timer_event_started: config.timer_event_started ?? 'on',
      timer_event_restarted: config.timer_event_restarted ?? 'on',
      timer_event_paused: config.timer_event_paused ?? 'off',
      timer_event_cancelled: config.timer_event_cancelled ?? 'off',
      timer_event_finished: config.timer_event_finished ?? 'off',
    };
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) return html``;

    if (!this._bootstrapped) {
      this._bootstrapped = true;
      const patch: Partial<NabuEyesDashboardCardConfig> = {};

      if (!this._config.assist_entities?.length) {
        const discovered = Object.keys(this.hass.states).filter((e) =>
          e.startsWith('assist_satellite.'),
        );
        if (discovered.length) patch.assist_entities = discovered;
      }

      const firstMP =
        this._config.media_player ??
        Object.keys(this.hass.states).find((e) => e.startsWith('media_player.'));

      if (!this._config.media_player && firstMP) patch.media_player = firstMP;
      if (!this._config.mute_media_player && firstMP) patch.mute_media_player = firstMP;

      // Auto-populate custom timers list if empty
      if (!this._config.timer_entities?.length) {
        const timers = Object.keys(this.hass.states).filter((e) => e.startsWith('timer.'));
        if (timers.length) patch.timer_entities = timers;
      }

      if (Object.keys(patch).length) {
        const merged = { ...this._config, ...patch };
        this._config = merged;
        fireEvent(this, 'config-changed', { config: merged });
      }
    }

    const cfg = this._config;

    const blue = this._rgbaToHexAlpha(cfg.glow_color_blue ?? DEFAULT_GLOW_BLUE, DEFAULT_GLOW_BLUE);
    const light = this._rgbaToHexAlpha(
      cfg.glow_color_light ?? DEFAULT_GLOW_LIGHT,
      DEFAULT_GLOW_LIGHT,
    );
    const purple = this._rgbaToHexAlpha(
      cfg.glow_color_purple ?? DEFAULT_GLOW_PURPLE,
      DEFAULT_GLOW_PURPLE,
    );
    const sepia = this._rgbaToHexAlpha(
      cfg.glow_color_sepia ?? DEFAULT_GLOW_SEPIA,
      DEFAULT_GLOW_SEPIA,
    );

    return html`
      <div class="form">
        <ha-form
          .hass=${this.hass}
          .data=${cfg}
          .schema=${SCHEMA}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._valueChanged}
        ></ha-form>

        <!-- Legacy RGBA colour pickers with alpha channel -->
        <h3 class="section-heading">Variant Glow Colours (RGBA)</h3>

        ${this._glowRow('Blue Glow', 'glow_color_blue', blue.hex, blue.alpha, DEFAULT_GLOW_BLUE)}
        ${this._glowRow(
          'Light Glow',
          'glow_color_light',
          light.hex,
          light.alpha,
          DEFAULT_GLOW_LIGHT,
        )}
        ${this._glowRow(
          'Purple Glow',
          'glow_color_purple',
          purple.hex,
          purple.alpha,
          DEFAULT_GLOW_PURPLE,
        )}
        ${this._glowRow(
          'Sepia Glow',
          'glow_color_sepia',
          sepia.hex,
          sepia.alpha,
          DEFAULT_GLOW_SEPIA,
        )}

        <div class="glow-reset-row">
          <span class="glow-reset-heading">Reset Glow Colours</span>
          <mwc-button class="glow-reset-button" raised @click=${this._resetGlowColours}>
            Reset glow colours
          </mwc-button>
        </div>
      </div>
    `;
  }

  private _valueChanged(ev: CustomEvent<{ value: any }>): void {
    if (!ev.detail?.value) return;

    const raw = ev.detail.value as NabuEyesDashboardCardConfig & Record<string, any>;

    const normalizeListField = (field: keyof NabuEyesDashboardCardConfig) => {
      const v = raw[field] as any;
      if (Array.isArray(v)) return;
      if (typeof v === 'string') {
        raw[field] = v
          .split(/[\n,]/)
          .map((s) => s.trim())
          .filter(Boolean) as any;
      }
    };

    normalizeListField('countdown_events');
    normalizeListField('countdown_clear_events');
    normalizeListField('alarm_events');
    normalizeListField('alarm_clear_events');
    normalizeListField('alarm_active_states');

    // Also normalise entity lists when they happen to be provided as strings
    normalizeListField('assist_entities');
    normalizeListField('timer_entities');
    normalizeListField('alarm_entities');

    this._config = raw;
    fireEvent(this, 'config-changed', { config: raw });
  }

  private _resetGlowColours = (): void => {
    if (!this._config) return;

    const next: NabuEyesDashboardCardConfig = {
      ...this._config,
      glow_color_blue: DEFAULT_GLOW_BLUE,
      glow_color_light: DEFAULT_GLOW_LIGHT,
      glow_color_purple: DEFAULT_GLOW_PURPLE,
      glow_color_sepia: DEFAULT_GLOW_SEPIA,
    };

    this._config = next;
    fireEvent(this, 'config-changed', { config: next });
  };

  private _glowRow(
    label: string,
    field: 'glow_color_blue' | 'glow_color_light' | 'glow_color_purple' | 'glow_color_sepia',
    hex: string,
    alpha: number,
    fallback: string,
  ): TemplateResult {
    return html`
      <div class="color-row">
        <div class="color-label">${label}</div>
        <input
          type="color"
          class="color-input"
          .value=${hex}
          @input=${(e: Event) => {
            const target = e.currentTarget as HTMLInputElement;
            const current = (this._config && (this._config as any)[field]) || fallback;
            const parsed = this._rgbaToHexAlpha(current as string, fallback);
            const rgba = this._rgbaFromHexAlpha(target.value, parsed.alpha);
            this._update(field, rgba as any);
          }}
        />
        <ha-textfield
          class="alpha-input"
          label="α"
          type="number"
          min="0"
          max="1"
          step="0.05"
          .value=${String(alpha)}
          @input=${(e: Event) => {
            const t = e.currentTarget as HTMLInputElement;
            const val = Number(t.value);
            if (Number.isNaN(val)) return;
            const clamped = Math.min(1, Math.max(0, val));
            const current = (this._config && (this._config as any)[field]) || fallback;
            const parsed = this._rgbaToHexAlpha(current as string, fallback);
            const rgba = this._rgbaFromHexAlpha(parsed.hex, clamped);
            this._update(field, rgba as any);
          }}
        ></ha-textfield>
      </div>
    `;
  }

  // ---- Helpers for RGBA <-> hex+alpha ----
  private _rgbaToHexAlpha(value: string, fallback: string): { hex: string; alpha: number } {
    const src = (value || fallback).trim();
    const rgbaMatch = src.match(
      /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([0-9.]+))?\s*\)$/i,
    );
    if (rgbaMatch) {
      const r = Number(rgbaMatch[1]);
      const g = Number(rgbaMatch[2]);
      const b = Number(rgbaMatch[3]);
      const a = rgbaMatch[4] !== undefined ? Number(rgbaMatch[4]) : 1;
      const hex =
        '#' +
        [r, g, b]
          .map((n) => {
            const clamped = Math.min(255, Math.max(0, Math.round(n)));
            const s = clamped.toString(16);
            return s.length === 1 ? `0${s}` : s;
          })
          .join('');
      return { hex, alpha: Math.min(1, Math.max(0, isNaN(a) ? 1 : a)) };
    }

    if (src.startsWith('#')) {
      let hex = src;
      if (hex.length === 4) {
        const r = hex[1];
        const g = hex[2];
        const b = hex[3];
        hex = `#${r}${r}${g}${g}${b}${b}`;
      }
      if (hex.length === 7) {
        return { hex, alpha: 1 };
      }
    }

    // Fallback to default
    return this._rgbaToHexAlpha(fallback, fallback);
  }

  private _rgbaFromHexAlpha(hex: string, alpha: number): string {
    let h = hex.trim();
    if (!h.startsWith('#')) h = `#${h}`;
    if (h.length === 4) {
      const r = h[1];
      const g = h[2];
      const b = h[3];
      h = `#${r}${r}${g}${g}${b}${b}`;
    }
    if (h.length !== 7) return DEFAULT_GLOW_BLUE;

    const r = parseInt(h.slice(1, 3), 16);
    const g = parseInt(h.slice(3, 5), 16);
    const b = parseInt(h.slice(5, 7), 16);
    const a = Math.min(1, Math.max(0, alpha));
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  private _update<K extends keyof NabuEyesDashboardCardConfig>(
    field: K,
    value: NabuEyesDashboardCardConfig[K],
  ): void {
    if (!this._config) return;
    const next: NabuEyesDashboardCardConfig = { ...this._config, [field]: value };
    this._config = next;
    fireEvent(this, 'config-changed', { config: next });
  }

  private _computeLabel = (schema: HaFormSchema): string => {
    switch (schema.name) {
      case 'name':
        return 'Name';
      case 'assist_entities':
        return 'Assist satellite entities';
      case 'playing_variant':
        return 'Assist playing animation';
      case 'media_player':
        return 'Media player for equalizer';
      case 'mute_media_player':
        return 'Media player for mute state';
      case 'media_player_equalizer':
        return 'Media player equalizer';
      case 'asset_path':
        return 'Asset path';
      case 'hide_when_idle':
        return 'Hide when idle';
      case 'idle_dwell_seconds':
        return 'Idle dwell time (seconds)';
      case 'fullscreen_overlay':
        return 'Overlay on top (centered)';
      case 'state_idle_variant':
        return 'Idle state variant';
      case 'state_listening_variant':
        return 'Listening state variant';
      case 'state_processing_variant':
        return 'Processing state variant';
      case 'state_responding_variant':
        return 'Responding state variant';
      case 'state_countdown_variant':
        return 'Countdown state variant';
      case 'state_mute_variant':
        return 'Mute state variant';
      case 'doorbell_entity':
        return 'Doorbell entity (triggers Alarm/Doorbell variant)';
      case 'state_alarm_variant':
        return 'Alarm/Doorbell state variant';
      case 'timer_mode':
        return 'Timer integration mode';
      case 'timer_entities':
        return 'Custom timer entities';
      case 'timer_event_started':
        return 'timer.started';
      case 'timer_event_restarted':
        return 'timer.restarted';
      case 'timer_event_paused':
        return 'timer.paused';
      case 'timer_event_cancelled':
        return 'timer.cancelled';
      case 'timer_event_finished':
        return 'timer.finished';
      case 'countdown_events':
        return 'Countdown events';
      case 'countdown_clear_events':
        return 'Countdown clear events';
      case 'alarm_events':
        return 'Alarm events';
      case 'alarm_clear_events':
        return 'Alarm clear events';
      case 'alarm_active_states':
        return 'Alarm active states';
      case 'glow_radius':
        return 'Glow radius (px)';
      case 'avatar_padding_vertical':
        return 'Vertical padding (px)';
      default:
        return schema.name;
    }
  };

  private _computeHelper = (schema: HaFormSchema): string | undefined => {
    switch (schema.name) {
      case 'asset_path':
        return 'Folder containing GIF assets (defaults to HACS path)';
      case 'doorbell_entity':
        return 'Binary_sensor / input_boolean / switch / button used as doorbell; when it enters an alarm-active state, the Alarm/Doorbell animation is shown';
      case 'timer_mode':
        return 'Choose whether any timer.* event or only specific timer entities will drive the Nabu countdown';
      case 'timer_entities':
        return 'Used when Timer mode is set to Custom';
      case 'timer_event_started':
      case 'timer_event_restarted':
      case 'timer_event_paused':
      case 'timer_event_cancelled':
      case 'timer_event_finished':
        return 'ON = show Countdown variant, OFF = return to Idle';
      case 'countdown_events':
      case 'countdown_clear_events':
      case 'alarm_events':
      case 'alarm_clear_events':
        return 'One event type per line or comma separated';
      case 'alarm_active_states':
        return 'One state per line or comma separated';
      case 'idle_dwell_seconds':
        return "How long to keep idle visible before hiding when 'Hide when idle' is enabled";
      default:
        return undefined;
    }
  };

  static get styles(): CSSResultGroup {
    return css`
      .form {
        display: block;
      }

      ha-form {
        --ha-form-label-width: 180px;
      }

      .section-heading {
        margin-top: 16px;
        font-size: 14px;
        font-weight: 500;
        opacity: 0.8;
      }

      .color-row {
        display: grid;
        grid-template-columns: 2fr auto 80px;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
      }

      .color-label {
        font-size: 13px;
      }

      .color-input {
        width: 40px;
        height: 24px;
        padding: 0;
        border: none;
        background: transparent;
      }

      .alpha-input {
        --mdc-text-field-outlined-hover-border-color: transparent;
      }

      .glow-reset-row {
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .glow-reset-heading {
        font-size: 13px;
        opacity: 0.8;
      }

      .glow-reset-button {
        --mdc-theme-primary: #f44336;
        --mdc-theme-on-primary: #ffffff;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nabu-eyes-dashboard-card-editor': NabuEyesDashboardCardEditor;
  }
}

if (!customElements.get('nabu-eyes-dashboard-card-editor')) {
  customElements.define('nabu-eyes-dashboard-card-editor', NabuEyesDashboardCardEditor);
}
