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

// This is the built-in form schema – Home Assistant renders all controls
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
        multiple: true, // this is the important part – array of satellites
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
    name: 'playing_variant',
    selector: {
      select: {
        options: playingOptions,
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
    name: 'state_alarm_variant',
    selector: {
      select: {
        options: alarmVariantOptions,
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
  // Glow & layout
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
  {
    name: 'glow_color_blue',
    selector: {
      text: {},
    },
  },
  {
    name: 'glow_color_light',
    selector: {
      text: {},
    },
  },
  {
    name: 'glow_color_purple',
    selector: {
      text: {},
    },
  },
  {
    name: 'glow_color_sepia',
    selector: {
      text: {},
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
      countdown_events: [...(config.countdown_events ?? [])],
      countdown_clear_events: [...(config.countdown_clear_events ?? [])],
      alarm_events: [...(config.alarm_events ?? [])],
      alarm_clear_events: [...(config.alarm_clear_events ?? [])],
      alarm_entities: [...(config.alarm_entities ?? [])],
      alarm_active_states: [...(config.alarm_active_states ?? DEFAULT_ALARM_ACTIVE_STATES)],
      hide_when_idle: config.hide_when_idle ?? false,

      glow_radius: config.glow_radius ?? 40,
      avatar_padding_vertical: config.avatar_padding_vertical ?? 0,

      glow_color_blue: config.glow_color_blue ?? DEFAULT_GLOW_BLUE,
      glow_color_light: config.glow_color_light ?? DEFAULT_GLOW_LIGHT,
      glow_color_purple: config.glow_color_purple ?? DEFAULT_GLOW_PURPLE,
      glow_color_sepia: config.glow_color_sepia ?? DEFAULT_GLOW_SEPIA,

      fullscreen_overlay: config.fullscreen_overlay ?? false,
      asset_path: config.asset_path ?? DEFAULT_ASSET_PATH,
      playing_variant: config.playing_variant ?? DEFAULT_PLAYING_VARIANT,
      media_player_equalizer: config.media_player_equalizer ?? DEFAULT_EQUALIZER_VARIANT,
      state_idle_variant: config.state_idle_variant ?? STATE_ASSET_MAP.idle,
      state_listening_variant: config.state_listening_variant ?? STATE_ASSET_MAP.listening,
      state_processing_variant: config.state_processing_variant ?? STATE_ASSET_MAP.processing,
      state_responding_variant: config.state_responding_variant ?? STATE_ASSET_MAP.responding,
      state_alarm_variant: config.state_alarm_variant ?? STATE_ASSET_MAP.alarm,
      state_countdown_variant: config.state_countdown_variant ?? STATE_ASSET_MAP.countdown,
      state_mute_variant: config.state_mute_variant ?? STATE_ASSET_MAP.mute,
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

      if (Object.keys(patch).length) {
        const merged = { ...this._config, ...patch };
        this._config = merged;
        fireEvent(this, 'config-changed', { config: merged });
      }
    }

    return html`
      <div class="form">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${SCHEMA}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._valueChanged}
        ></ha-form>
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

    this._config = raw;
    fireEvent(this, 'config-changed', { config: raw });
  }

  private _computeLabel = (schema: HaFormSchema): string => {
    switch (schema.name) {
      case 'name':
        return 'Name';
      case 'assist_entities':
        return 'Assist satellite entities';
      case 'media_player':
        return 'Media player for equalizer';
      case 'mute_media_player':
        return 'Media player for mute state';
      case 'playing_variant':
        return 'Assist playing animation';
      case 'media_player_equalizer':
        return 'Media player equalizer';
      case 'asset_path':
        return 'Asset path';
      case 'hide_when_idle':
        return 'Hide when idle';
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
      case 'state_alarm_variant':
        return 'Alarm state variant';
      case 'state_countdown_variant':
        return 'Countdown state variant';
      case 'state_mute_variant':
        return 'Mute state variant';
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
      case 'glow_color_blue':
        return 'Blue glow colour (rgba)';
      case 'glow_color_light':
        return 'Light glow colour (rgba)';
      case 'glow_color_purple':
        return 'Purple glow colour (rgba)';
      case 'glow_color_sepia':
        return 'Sepia glow colour (rgba)';
      default:
        return schema.name;
    }
  };

  private _computeHelper = (schema: HaFormSchema): string | undefined => {
    switch (schema.name) {
      case 'asset_path':
        return 'Folder containing GIF assets (defaults to HACS path)';
      case 'countdown_events':
      case 'countdown_clear_events':
      case 'alarm_events':
      case 'alarm_clear_events':
        return 'One event type per line or comma separated';
      case 'alarm_active_states':
        return 'One state per line or comma separated';
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
