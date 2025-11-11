export const DEFAULT_ASSET_PATH = '/local/nabu_eyes_dashboard';

export const PLAYING_VARIANTS = {
  'nabu_playing_dash.gif': 'Nabu Playing',
  'nabu_equalizer_dash.gif': 'Nabu Equalizer',
  'nabu_equalizer_2_dash.gif': 'Nabu Equalizer 2'
} as const satisfies Record<string, string>;

export const EQUALIZER_VARIANTS = {
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
} as const satisfies Record<string, string>;

export const STATE_ASSET_MAP = {
  idle: 'nabu_idle_preview_dash.gif',
  listening: 'nabu_listening_dash.gif',
  processing: 'nabu_processing_dash.gif',
  responding: 'nabu_responding_dash.gif',
  playing: 'nabu_playing_dash.gif',
  alarm: 'nabu_alarm_dash.gif',
  countdown: 'nabu_countdown_dash.gif',
  mute: 'nabu_mute_dash.gif'
} as const;

export const DEFAULT_ALARM_ACTIVE_STATES = ['on', 'detected', 'unavailable'] as const;
export type DefaultAlarmActiveState = (typeof DEFAULT_ALARM_ACTIVE_STATES)[number];
