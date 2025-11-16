export const DEFAULT_ASSET_PATH = '/hacsfiles/nabu-eyes-voice-avatar/nabu_eyes_dashboard';

// Default palette/variants to use in the card logic
export const DEFAULT_PLAYING_VARIANT = 'nabu_eyes_dash_blue/nabu_playing_dash_blue.gif';

export const DEFAULT_EQUALIZER_VARIANT = 'equalizer_dash/1px_equalizer_dash.gif';

export const PLAYING_VARIANTS = {
  'nabu_eyes_dash_blue/nabu_playing_dash_blue.gif': 'Nabu Playing Blue (default)',
  'nabu_eyes_dash_light/nabu_playing_dash_light.gif': 'Nabu Playing Light',
  'nabu_eyes_dash_purple/nabu_playing_dash_purple.gif': 'Nabu Playing Purple',
  'nabu_eyes_dash_sepia/nabu_playing_dash_sepia.gif': 'Nabu Playing Sepia',
} as const satisfies Record<string, string>;

export const EQUALIZER_VARIANTS = {
  // Stand-alone equalizer strip set
  'equalizer_dash/1px_equalizer_dash.gif': '1px Equalizer',
  'equalizer_dash/1px_equalizer_fader_dash.gif': '1px Equalizer Fader',
  'equalizer_dash/1px_equalizer_fader_2_dash.gif': '1px Equalizer Fader 2',
  'equalizer_dash/1px_equalizer_bottom_dash.gif': '1px Equalizer Bottom',
  'equalizer_dash/2px_equalizer_dash.gif': '2px Equalizer',
  'equalizer_dash/2px_equalizer_fader_dash.gif': '2px Equalizer Fader',
  'equalizer_dash/2px_equalizer_fader_2_dash.gif': '2px Equalizer Fader 2',
  'equalizer_dash/2px_equalizer_bottom_dash.gif': '2px Equalizer Bottom',

  // Embedded Nabu EQ variants per palette
  'nabu_eyes_dash_blue/nabu_eq_dash_blue.gif': 'Nabu EQ Blue',
  'nabu_eyes_dash_blue/nabu_eq2_dash_blue.gif': 'Nabu EQ2 Blue',
  'nabu_eyes_dash_blue/nabu_eq3_dash_blue.gif': 'Nabu EQ3 Blue',

  'nabu_eyes_dash_light/nabu_eq_dash_light.gif': 'Nabu EQ Light',
  'nabu_eyes_dash_light/nabu_eq2_dash_light.gif': 'Nabu EQ2 Light',
  'nabu_eyes_dash_light/nabu_eq3_dash_light.gif': 'Nabu EQ3 Light',

  'nabu_eyes_dash_purple/nabu_eq_dash_purple.gif': 'Nabu EQ Purple',
  'nabu_eyes_dash_purple/nabu_eq2_dash_purple.gif': 'Nabu EQ2 Purple',
  'nabu_eyes_dash_purple/nabu_eq3_dash_purple.gif': 'Nabu EQ3 Purple',

  'nabu_eyes_dash_sepia/nabu_eq_dash_sepia.gif': 'Nabu EQ Sepia',
  'nabu_eyes_dash_sepia/nabu_eq2_dash_sepia.gif': 'Nabu EQ2 Sepia',
  'nabu_eyes_dash_sepia/nabu_eq3_dash_sepia.gif': 'Nabu EQ3 Sepia',
} as const satisfies Record<string, string>;

export const STATE_ASSET_MAP = {
  idle: 'nabu_eyes_dash_blue/nabu_idle_dash_blue.gif',
  listening: 'nabu_eyes_dash_blue/nabu_listening_dash_blue.gif',
  processing: 'nabu_eyes_dash_blue/nabu_processing_dash_blue.gif',
  responding: 'nabu_eyes_dash_blue/nabu_responding_dash_blue.gif',
  playing: 'nabu_eyes_dash_blue/nabu_playing_dash_blue.gif',
  alarm: 'nabu_eyes_dash_blue/nabu_alarm_dash_blue.gif',
  countdown: 'nabu_eyes_dash_blue/nabu_countdown_dash_blue.gif',
  mute: 'nabu_eyes_dash_blue/nabu_mute_dash_blue.gif',
} as const;

export type DefaultAlarmActiveState = 'on' | 'detected' | 'unavailable';
export const DEFAULT_ALARM_ACTIVE_STATES: ReadonlyArray<DefaultAlarmActiveState> = [
  'on',
  'detected',
  'unavailable',
];
