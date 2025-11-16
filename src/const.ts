export const DEFAULT_ASSET_PATH = '/hacsfiles/nabu-eyes-voice-avatar';

export const DEFAULT_PLAYING_VARIANT = 'nabu_playing_dash_blue.gif';
export const DEFAULT_EQUALIZER_VARIANT = '1px_equalizer_dash.gif';

export const PLAYING_VARIANTS = {
  'nabu_playing_dash_blue.gif': 'Nabu Playing Blue (default)',
  'nabu_playing_dash_light.gif': 'Nabu Playing Light',
  'nabu_playing_dash_purple.gif': 'Nabu Playing Purple',
  'nabu_playing_dash_sepia.gif': 'Nabu Playing Sepia',
} as const satisfies Record<string, string>;

export const EQUALIZER_VARIANTS = {
  // Stand-alone equalizer strip set
  '1px_equalizer_dash.gif': '1px Equalizer',
  '1px_equalizer_fader_dash.gif': '1px Equalizer Fader',
  '1px_equalizer_fader_2_dash.gif': '1px Equalizer Fader 2',
  '1px_equalizer_bottom_dash.gif': '1px Equalizer Bottom',
  '2px_equalizer_dash.gif': '2px Equalizer',
  '2px_equalizer_fader_dash.gif': '2px Equalizer Fader',
  '2px_equalizer_fader_2_dash.gif': '2px Equalizer Fader 2',
  '2px_equalizer_bottom_dash.gif': '2px Equalizer Bottom',
  // you also have this odd hyphen variant – expose it too if you want it selectable
  '2px_equalizer_fader-dash.gif': '2px Equalizer Fader (alt)',

  // Embedded Nabu EQ variants per palette
  'nabu_eq_dash_blue.gif': 'Nabu EQ Blue',
  'nabu_eq2_dash_blue.gif': 'Nabu EQ2 Blue',
  'nabu_eq3_dash_blue.gif': 'Nabu EQ3 Blue',

  'nabu_eq_dash_light.gif': 'Nabu EQ Light',
  'nabu_eq2_dash_light.gif': 'Nabu EQ2 Light',
  'nabu_eq3_dash_light.gif': 'Nabu EQ3 Light',

  'nabu_eq_dash_purple.gif': 'Nabu EQ Purple',
  'nabu_eq2_dash_purple.gif': 'Nabu EQ2 Purple',
  'nabu_eq3_dash_purple.gif': 'Nabu EQ3 Purple',

  'nabu_eq_dash_sepia.gif': 'Nabu EQ Sepia',
  'nabu_eq2_dash_sepia.gif': 'Nabu EQ2 Sepia',
  'nabu_eq3_dash_sepia.gif': 'Nabu EQ3 Sepia',
} as const satisfies Record<string, string>;

export const STATE_ASSET_MAP = {
  // defaulting to blue palette for state-driven assets
  idle: 'nabu_idle_dash_blue.gif',
  listening: 'nabu_listening_dash_blue.gif',
  processing: 'nabu_processing_dash_blue.gif',
  responding: 'nabu_responding_dash_blue.gif',
  playing: 'nabu_playing_dash_blue.gif',
  alarm: 'nabu_alarm_dash_blue.gif',
  countdown: 'nabu_countdown_dash_blue.gif',
  mute: 'nabu_mute_dash_blue.gif',
} as const;

export type DefaultAlarmActiveState = 'on' | 'detected' | 'unavailable';
export const DEFAULT_ALARM_ACTIVE_STATES: ReadonlyArray<DefaultAlarmActiveState> = [
  'on',
  'detected',
  'unavailable',
];
