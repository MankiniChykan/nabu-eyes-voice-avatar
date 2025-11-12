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

/**
 * Configuration UI for the Nabu Eyes dashboard card allowing users to map
 * Assist entities, event triggers, and asset preferences.
 */
export class NabuEyesDashboardCardEditor extends LitElement implements LovelaceCardEditor {
  public hass!: HomeAssistant;
  private _config?: NabuEyesDashboardCardConfig;

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
    };
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    const config = this._config;

    return html`
      <div class="form">
        <ha-textfield
          label="Name"
          .value=${config.name ?? ''}
          @input=${this._handleTextValue}
          data-field="name"
        ></ha-textfield>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${config.assist_entities ?? []}
          label="Assist satellite entities"
          .multiple=${true}
          @value-changed=${this._handleAssistEntities}
          allow-custom-entity
        ></ha-entity-picker>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${config.media_player ?? ''}
          label="Media player for equalizer"
          domain="media_player"
          @value-changed=${this._handleMediaPlayer}
          allow-custom-entity
        ></ha-entity-picker>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${config.mute_media_player ?? ''}
          label="Media player for mute state"
          domain="media_player"
          @value-changed=${this._handleMuteMediaPlayer}
          allow-custom-entity
        ></ha-entity-picker>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${config.alarm_entities ?? []}
          label="Alarm / doorbell entities"
          .multiple=${true}
          @value-changed=${this._handleAlarmEntities}
          allow-custom-entity
        ></ha-entity-picker>

        <ha-select
          .value=${config.playing_variant ?? 'nabu_playing_dash.gif'}
          label="Assist playing animation"
          @selected=${this._handlePlayingVariant}
          @closed=${this._stopPropagation}
        >
          ${Object.entries(PLAYING_VARIANTS).map(
            ([key, label]) => html`<mwc-list-item .value=${key}>${label}</mwc-list-item>`,
          )}
        </ha-select>

        <ha-select
          .value=${config.media_player_equalizer ?? 'nabu_equalizer_dash.gif'}
          label="Media player equalizer"
          @selected=${this._handleEqualizerVariant}
          @closed=${this._stopPropagation}
        >
          ${Object.entries(EQUALIZER_VARIANTS).map(
            ([key, label]) => html`<mwc-list-item .value=${key}>${label}</mwc-list-item>`,
          )}
        </ha-select>

        <ha-textfield
          label="Asset path"
          helper="Folder containing GIF assets (defaults to the HACS install path)"
          .value=${config.asset_path ?? DEFAULT_ASSET_PATH}
          @input=${this._handleTextValue}
          data-field="asset_path"
        ></ha-textfield>

        <div class="switch-row">
          <span>Hide when idle</span>
          <ha-switch
            .checked=${config.hide_when_idle ?? true}
            @change=${this._handleHideWhenIdle}
          ></ha-switch>
        </div>

        ${this._renderEventInputs('Countdown events', 'countdown_events', config.countdown_events)}
        ${this._renderEventInputs(
          'Countdown clear events',
          'countdown_clear_events',
          config.countdown_clear_events,
        )}
        ${this._renderEventInputs('Alarm events', 'alarm_events', config.alarm_events)}
        ${this._renderEventInputs(
          'Alarm clear events',
          'alarm_clear_events',
          config.alarm_clear_events,
        )}

        <ha-textfield
          label="Alarm active states"
          helper="Comma separated list of states considered active"
          .value=${(config.alarm_active_states ?? DEFAULT_ALARM_ACTIVE_STATES).join(', ')}
          @input=${this._handleStringArray}
          data-field="alarm_active_states"
        ></ha-textfield>
      </div>
    `;
  }

  private _renderEventInputs(
    label: string,
    field: keyof NabuEyesDashboardCardConfig,
    values?: string[],
  ): TemplateResult {
    return html`
      <ha-textfield
        label=${label}
        helper="Comma separated list of Home Assistant event types"
        .value=${(values ?? []).join(', ')}
        @input=${this._handleStringArray}
        data-field=${field}
      ></ha-textfield>
    `;
  }

  private _handleTextValue(event: Event): void {
    const target = event.currentTarget as HTMLInputElement & { dataset: { field?: string } };
    if (!target?.dataset?.field || !this._config) {
      return;
    }

    const value = target.value;
    this._updateConfig(
      target.dataset.field as keyof NabuEyesDashboardCardConfig,
      value || undefined,
    );
  }

  private _handleStringArray(event: Event): void {
    const target = event.currentTarget as HTMLInputElement & { dataset: { field?: string } };
    if (!target?.dataset?.field || !this._config) {
      return;
    }

    const value = target.value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    this._updateConfig(target.dataset.field as keyof NabuEyesDashboardCardConfig, value);
  }

  private _handleAssistEntities(event: CustomEvent): void {
    const value = Array.isArray(event.detail?.value)
      ? (event.detail.value as string[])
      : event.detail?.value
        ? [event.detail.value]
        : [];
    this._updateConfig('assist_entities', value);
  }

  private _handleMediaPlayer(event: CustomEvent): void {
    this._updateConfig('media_player', event.detail?.value || undefined);
  }

  private _handleMuteMediaPlayer(event: CustomEvent): void {
    this._updateConfig('mute_media_player', event.detail?.value || undefined);
  }

  private _handleAlarmEntities(event: CustomEvent): void {
    const value = Array.isArray(event.detail?.value)
      ? (event.detail.value as string[])
      : event.detail?.value
        ? [event.detail.value]
        : [];
    this._updateConfig('alarm_entities', value);
  }

  private _handlePlayingVariant(event: Event): void {
    const target = event.currentTarget as HaSelectElement;
    const value = target?.value;
    if (value && value in PLAYING_VARIANTS) {
      this._updateConfig('playing_variant', value as keyof typeof PLAYING_VARIANTS);
    }
  }

  private _handleEqualizerVariant(event: Event): void {
    const target = event.currentTarget as HaSelectElement;
    const value = target?.value;
    if (value && value in EQUALIZER_VARIANTS) {
      this._updateConfig('media_player_equalizer', value as keyof typeof EQUALIZER_VARIANTS);
    }
  }

  private _handleHideWhenIdle(event: Event): void {
    const target = event.currentTarget as HaSwitchElement;
    this._updateConfig('hide_when_idle', !!target?.checked);
  }

  private _stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  private _updateConfig<K extends keyof NabuEyesDashboardCardConfig>(
    field: K,
    value: NabuEyesDashboardCardConfig[K],
  ): void {
    if (!this._config) {
      return;
    }

    const newConfig: NabuEyesDashboardCardConfig = {
      ...this._config,
      [field]: value,
    };

    this._config = newConfig;
    fireEvent(this, 'config-changed', { config: newConfig });
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
