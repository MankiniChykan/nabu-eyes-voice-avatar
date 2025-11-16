import { css, CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { fireEvent, HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import {
  DEFAULT_ALARM_ACTIVE_STATES,
  DEFAULT_ASSET_PATH,
  EQUALIZER_VARIANTS,
  PLAYING_VARIANTS,
} from '../const';
import { NabuEyesDashboardCardConfig } from '../nabu-eyes-dashboard-card';

type HaSelectElement = HTMLElement & { value?: string };
type HaSwitchElement = HTMLElement & { checked?: boolean };

const hasEntitiesPicker = () => !!customElements.get('ha-entities-picker');
const hasEntityPicker = () => !!customElements.get('ha-entity-picker');

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

    // Build suggestion lists for fallbacks
    const assistOptions = Object.keys(this.hass.states).filter((e) =>
      e.startsWith('assist_satellite.'),
    );
    const mediaOptions = Object.keys(this.hass.states).filter((e) => e.startsWith('media_player.'));

    return html`
      <div class="form">
        <ha-textfield
          label="Name"
          .value=${cfg.name ?? ''}
          @input=${this._handleText}
          data-field="name"
        ></ha-textfield>

        <!-- Assist satellites -->
        ${hasEntitiesPicker()
          ? html`
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
            `
          : this._fallbackMulti(
              'Assist satellite entities (comma separated)',
              'assist_entities',
              cfg.assist_entities ?? [],
              assistOptions,
            )}

        <!-- Equalizer media player -->
        ${hasEntityPicker()
          ? html`
              <ha-entity-picker
                .hass=${this.hass}
                .value=${cfg.media_player ?? ''}
                label="Media player for equalizer"
                domain="media_player"
                allow-custom-entity
                @value-changed=${(e: CustomEvent) =>
                  this._update('media_player', (e.detail?.value as string) || undefined)}
              ></ha-entity-picker>
            `
          : this._fallbackSingle(
              'Media player for equalizer',
              'media_player',
              cfg.media_player ?? '',
              mediaOptions,
            )}

        <!-- Mute source media player -->
        ${hasEntityPicker()
          ? html`
              <ha-entity-picker
                .hass=${this.hass}
                .value=${cfg.mute_media_player ?? cfg.media_player ?? ''}
                label="Media player for mute state"
                domain="media_player"
                allow-custom-entity
                @value-changed=${(e: CustomEvent) =>
                  this._update('mute_media_player', (e.detail?.value as string) || undefined)}
              ></ha-entity-picker>
            `
          : this._fallbackSingle(
              'Media player for mute state',
              'mute_media_player',
              cfg.mute_media_player ?? cfg.media_player ?? '',
              mediaOptions,
            )}

        <ha-select
          .value=${cfg.playing_variant ?? 'nabu_playing_dash.gif'}
          label="Assist playing animation"
          @selected=${this._handlePlaying}
          @closed=${this._stop}
        >
          ${Object.entries(PLAYING_VARIANTS).map(
            ([k, label]) => html`<mwc-list-item .value=${k}>${label}</mwc-list-item>`,
          )}
        </ha-select>

        <ha-select
          .value=${cfg.media_player_equalizer ?? 'nabu_equalizer_dash.gif'}
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

  // ---- Fallback renderers ----
  private _fallbackSingle(
    label: string,
    field: keyof NabuEyesDashboardCardConfig,
    value: string,
    options: string[],
  ) {
    const listId = `list-${field}`;
    return html`
      <ha-textfield
        label=${label}
        .value=${value ?? ''}
        @input=${this._handleText}
        data-field=${field}
        list=${listId}
      ></ha-textfield>
      <datalist id=${listId}>${options.map((o) => html`<option value=${o}></option>`)}</datalist>
    `;
  }

  private _fallbackMulti(
    label: string,
    field: keyof NabuEyesDashboardCardConfig,
    values: string[],
    options: string[],
  ) {
    const listId = `list-${field}`;
    return html`
      <ha-textfield
        label=${label}
        helper="Comma separated"
        .value=${(values ?? []).join(', ')}
        @input=${this._handleCSV}
        data-field=${field}
        list=${listId}
      ></ha-textfield>
      <datalist id=${listId}>${options.map((o) => html`<option value=${o}></option>`)}</datalist>
    `;
  }

  // ---- Handlers ----
  private _handleText = (e: Event) => {
    const t = e.currentTarget as HTMLInputElement & { dataset: { field?: string } };
    if (!t?.dataset?.field || !this._config) return;
    this._update(t.dataset.field as keyof NabuEyesDashboardCardConfig, t.value || undefined);
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

  private _handlePlaying = (e: Event) => {
    const v = (e.currentTarget as HaSelectElement)?.value;
    if (v && v in PLAYING_VARIANTS) this._update('playing_variant', v as any);
  };

  private _handleEqualizer = (e: Event) => {
    const v = (e.currentTarget as HaSelectElement)?.value;
    if (v && v in EQUALIZER_VARIANTS) this._update('media_player_equalizer', v as any);
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
