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

type HaSelectElement = HTMLElement & { value?: string };
type HaSwitchElement = HTMLElement & { checked?: boolean };

const DEFAULT_GLOW_BLUE = 'rgba(0, 21, 255, 0.5)';
const DEFAULT_GLOW_LIGHT = 'rgba(0, 255, 255, 0.5)';
const DEFAULT_GLOW_PURPLE = 'rgba(255, 0, 255, 0.5)';
const DEFAULT_GLOW_SEPIA = 'rgba(255, 210, 0, 0.5)';

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
      countdown_events: [...(config.countdown_events ?? [])],
      countdown_clear_events: [...(config.countdown_clear_events ?? [])],
      alarm_events: [...(config.alarm_events ?? [])],
      alarm_clear_events: [...(config.alarm_clear_events ?? [])],
      alarm_entities: [...(config.alarm_entities ?? [])],
      alarm_active_states: [...(config.alarm_active_states ?? DEFAULT_ALARM_ACTIVE_STATES)],
      hide_when_idle: config.hide_when_idle ?? false,

      // Ensure numeric controls have stable defaults in the editor
      glow_radius: config.glow_radius ?? 40,
      avatar_padding_vertical: config.avatar_padding_vertical ?? 0,

      // Per-variant glow colours (rgba strings)
      glow_color_blue: config.glow_color_blue ?? DEFAULT_GLOW_BLUE,
      glow_color_light: config.glow_color_light ?? DEFAULT_GLOW_LIGHT,
      glow_color_purple: config.glow_color_purple ?? DEFAULT_GLOW_PURPLE,
      glow_color_sepia: config.glow_color_sepia ?? DEFAULT_GLOW_SEPIA,

      // Overlay toggle default
      fullscreen_overlay: config.fullscreen_overlay ?? false,
    };
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) return html``;

    // One-time bootstrap of sensible defaults so editor opens populated
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

      if (Object.keys(patch).length) {
        const merged = { ...this._config, ...patch };
        this._config = merged;
        fireEvent(this, 'config-changed', { config: merged });
      }
    }

    const cfg = this._config;

    const blue = this._rgbaToHexAlpha(cfg.glow_color_blue, DEFAULT_GLOW_BLUE);
    const light = this._rgbaToHexAlpha(cfg.glow_color_light, DEFAULT_GLOW_LIGHT);
    const purple = this._rgbaToHexAlpha(cfg.glow_color_purple, DEFAULT_GLOW_PURPLE);
    const sepia = this._rgbaToHexAlpha(cfg.glow_color_sepia, DEFAULT_GLOW_SEPIA);

    return html`
      <div class="form">
        <ha-textfield
          label="Name"
          .value=${cfg.name ?? ''}
          @input=${this._handleText}
          data-field="name"
        ></ha-textfield>

        <!-- Assist satellites (multi-entity chips picker) -->
        <ha-entities-picker
          .hass=${this.hass}
          .value=${cfg.assist_entities ?? []}
          label="Assist satellite entities"
          allow-custom-entity
          @value-changed=${(e: CustomEvent) =>
            this._update(
              'assist_entities',
              Array.isArray(e.detail?.value)
                ? (e.detail.value as string[])
                : e.detail?.value
                  ? [e.detail.value as string]
                  : [],
            )}
        ></ha-entities-picker>

        <!-- Equalizer media player -->
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.media_player ?? ''}
          label="Media player for equalizer"
          domain="media_player"
          allow-custom-entity
          @value-changed=${(e: CustomEvent) =>
            this._update('media_player', (e.detail?.value as string) || undefined)}
        ></ha-entity-picker>

        <!-- Mute source media player -->
        <ha-entity-picker
          .hass=${this.hass}
          .value=${cfg.mute_media_player ?? cfg.media_player ?? ''}
          label="Media player for mute state"
          domain="media_player"
          allow-custom-entity
          @value-changed=${(e: CustomEvent) =>
            this._update('mute_media_player', (e.detail?.value as string) || undefined)}
        ></ha-entity-picker>

        <ha-select
          .value=${cfg.playing_variant ?? DEFAULT_PLAYING_VARIANT}
          label="Assist playing animation"
          @selected=${this._handlePlaying}
          @closed=${this._stop}
        >
          ${Object.entries(PLAYING_VARIANTS).map(
            ([k, label]) => html`<mwc-list-item .value=${k}>${label}</mwc-list-item>`,
          )}
        </ha-select>

        <ha-select
          .value=${cfg.media_player_equalizer ?? DEFAULT_EQUALIZER_VARIANT}
          label="Media player equalizer"
          @selected=${this._handleEqualizer}
          @closed=${this._stop}
        >
          ${Object.entries(EQUALIZER_VARIANTS).map(
            ([k, label]) => html`<mwc-list-item .value=${k}>${label}</mwc-list-item>`,
          )}
        </ha-select>

        <ha-textfield
          label="Asset path"
          helper="Folder containing GIF assets (defaults to HACS path)"
          .value=${cfg.asset_path ?? DEFAULT_ASSET_PATH}
          @input=${this._handleText}
          data-field="asset_path"
        ></ha-textfield>

        <div class="switch-row">
          <span>Hide when idle</span>
          <ha-switch
            .checked=${cfg.hide_when_idle ?? false}
            @change=${this._handleHide}
          ></ha-switch>
        </div>

        <div class="switch-row">
          <span>Overlay on top (centered)</span>
          <ha-switch
            .checked=${cfg.fullscreen_overlay ?? false}
            @change=${this._handleOverlay}
          ></ha-switch>
        </div>

        <!-- Per-state variants -->
        <ha-select
          .value=${cfg.state_idle_variant ?? STATE_ASSET_MAP.idle}
          label="Idle state variant"
          @selected=${this._handleStateVariant('state_idle_variant')}
          @closed=${this._stop}
        >
          ${Object.entries(STATE_VARIANTS.idle).map(
            ([k, label]) => html`<mwc-list-item .value=${k}>${label}</mwc-list-item>`,
          )}
        </ha-select>

        <ha-select
          .value=${cfg.state_listening_variant ?? STATE_ASSET_MAP.listening}
          label="Listening state variant"
          @selected=${this._handleStateVariant('state_listening_variant')}
          @closed=${this._stop}
        >
          ${Object.entries(STATE_VARIANTS.listening).map(
            ([k, label]) => html`<mwc-list-item .value=${k}>${label}</mwc-list-item>`,
          )}
        </ha-select>

        <ha-select
          .value=${cfg.state_processing_variant ?? STATE_ASSET_MAP.processing}
          label="Processing state variant"
          @selected=${this._handleStateVariant('state_processing_variant')}
          @closed=${this._stop}
        >
          ${Object.entries(STATE_VARIANTS.processing).map(
            ([k, label]) => html`<mwc-list-item .value=${k}>${label}</mwc-list-item>`,
          )}
        </ha-select>

        <ha-select
          .value=${cfg.state_responding_variant ?? STATE_ASSET_MAP.responding}
          label="Responding state variant"
          @selected=${this._handleStateVariant('state_responding_variant')}
          @closed=${this._stop}
        >
          ${Object.entries(STATE_VARIANTS.responding).map(
            ([k, label]) => html`<mwc-list-item .value=${k}>${label}</mwc-list-item>`,
          )}
        </ha-select>

        <ha-select
          .value=${cfg.state_alarm_variant ?? STATE_ASSET_MAP.alarm}
          label="Alarm state variant"
          @selected=${this._handleStateVariant('state_alarm_variant')}
          @closed=${this._stop}
        >
          ${Object.entries(STATE_VARIANTS.alarm).map(
            ([k, label]) => html`<mwc-list-item .value=${k}>${label}</mwc-list-item>`,
          )}
        </ha-select>

        <ha-select
          .value=${cfg.state_countdown_variant ?? STATE_ASSET_MAP.countdown}
          label="Countdown state variant"
          @selected=${this._handleStateVariant('state_countdown_variant')}
          @closed=${this._stop}
        >
          ${Object.entries(STATE_VARIANTS.countdown).map(
            ([k, label]) => html`<mwc-list-item .value=${k}>${label}</mwc-list-item>`,
          )}
        </ha-select>

        <ha-select
          .value=${cfg.state_mute_variant ?? STATE_ASSET_MAP.mute}
          label="Mute state variant"
          @selected=${this._handleStateVariant('state_mute_variant')}
          @closed=${this._stop}
        >
          ${Object.entries(STATE_VARIANTS.mute).map(
            ([k, label]) => html`<mwc-list-item .value=${k}>${label}</mwc-list-item>`,
          )}
        </ha-select>

        ${this._eventsInput('Countdown events', 'countdown_events', cfg.countdown_events)}
        ${this._eventsInput(
          'Countdown clear events',
          'countdown_clear_events',
          cfg.countdown_clear_events,
        )}
        ${this._eventsInput('Alarm events', 'alarm_events', cfg.alarm_events)}
        ${this._eventsInput('Alarm clear events', 'alarm_clear_events', cfg.alarm_clear_events)}

        <ha-textfield
          label="Alarm active states"
          helper="Comma separated list of states considered active"
          .value=${(cfg.alarm_active_states ?? DEFAULT_ALARM_ACTIVE_STATES).join(', ')}
          @input=${this._handleCSV}
          data-field="alarm_active_states"
        ></ha-textfield>

        <!-- Glow & layout numeric controls -->
        <h3 class="section-heading">Glow & layout</h3>

        <ha-textfield
          label="Glow radius (px)"
          type="number"
          min="0"
          max="200"
          .value=${String(cfg.glow_radius ?? 40)}
          @input=${this._handleNumber}
          data-field="glow_radius"
        ></ha-textfield>

        <ha-textfield
          label="Vertical padding (px)"
          type="number"
          min="0"
          max="200"
          .value=${String(cfg.avatar_padding_vertical ?? 0)}
          @input=${this._handleNumber}
          data-field="avatar_padding_vertical"
        ></ha-textfield>

        <!-- Per-variant glow colours -->
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
          <mwc-button class="glow-reset-button" @click=${this._resetGlowColours}>
            Reset glow colours
          </mwc-button>
        </div>
      </div>
    `;
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

  private _eventsInput(label: string, field: keyof NabuEyesDashboardCardConfig, values?: string[]) {
    return html`
      <ha-textfield
        label=${label}
        helper="Comma separated Home Assistant event types"
        .value=${(values ?? []).join(', ')}
        @input=${this._handleCSV}
        data-field=${field}
      ></ha-textfield>
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

  // ---- Handlers ----
  private _handleText = (e: Event) => {
    const t = e.currentTarget as HTMLInputElement & { dataset: { field?: string } };
    if (!t?.dataset?.field || !this._config) return;
    this._update(t.dataset.field as keyof NabuEyesDashboardCardConfig, t.value || undefined);
  };

  private _handleNumber = (e: Event) => {
    const t = e.currentTarget as HTMLInputElement & { dataset: { field?: string } };
    if (!t?.dataset?.field || !this._config) return;
    const num = Number(t.value);
    if (Number.isNaN(num)) return;
    this._update(t.dataset.field as keyof NabuEyesDashboardCardConfig, num as any);
  };

  private _handleCSV = (e: Event) => {
    const t = e.currentTarget as HTMLInputElement & { dataset: { field?: string } };
    if (!t?.dataset?.field || !this._config) return;
    const arr = t.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    this._update(t.dataset.field as keyof NabuEyesDashboardCardConfig, arr as any);
  };

  private _handleHide = (e: Event) => {
    const t = e.currentTarget as HaSwitchElement;
    this._update('hide_when_idle', !!t?.checked);
  };

  private _handleOverlay = (e: Event) => {
    const t = e.currentTarget as HaSwitchElement;
    this._update('fullscreen_overlay', !!t?.checked);
  };

  private _handlePlaying = (e: Event) => {
    const v = (e.currentTarget as HaSelectElement)?.value;
    if (v && v in PLAYING_VARIANTS) this._update('playing_variant', v as any);
  };

  private _handleEqualizer = (e: Event) => {
    const v = (e.currentTarget as HaSelectElement)?.value;
    if (v && v in EQUALIZER_VARIANTS) this._update('media_player_equalizer', v as any);
  };

  private _handleStateVariant =
    (field: keyof NabuEyesDashboardCardConfig) =>
    (e: Event): void => {
      const v = (e.currentTarget as HaSelectElement)?.value;
      if (v) this._update(field, v as any);
    };

  private _stop(e: Event) {
    e.stopPropagation();
  }

  private _update<K extends keyof NabuEyesDashboardCardConfig>(
    field: K,
    value: NabuEyesDashboardCardConfig[K],
  ) {
    if (!this._config) return;
    const next = { ...this._config, [field]: value };
    this._config = next;
    fireEvent(this, 'config-changed', { config: next });
  }

  static get styles(): CSSResultGroup {
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
