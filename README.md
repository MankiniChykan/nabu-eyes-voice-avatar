# nabu-eyes-voice-avatar
Voice Avatar for Home Assistant and Awtrix3 (Ulanzi Clock)

## Nabu Eyes Dashboard Card

The repository provides a Home Assistant Lovelace card that displays the animated Nabu Eyes
dashboard GIFs depending on the state of one or more Assist Satellite entities. The card also
supports media-player driven equalizer animations, mute overlays, and reacting to timer or alarm
events published on the Home Assistant event bus.

![nabu_idle_dash_blue](https://github.com/user-attachments/assets/911539ad-0ddc-4c87-87ba-889d9bfbb29b)

![nabu_responding_dash_blue](https://github.com/user-attachments/assets/15889ba7-5f24-4425-8fe1-7bb11df8455f)

### Features

- Monitor multiple `assist_satellite` entities and switch the animation through the states `idle`,
  `listening`, `processing`, `responding`, and `playing`.
- Optional hiding of the card while every tracked satellite is idle.
- Media player integrations for equalizer animations and mute overlays.
- Subscribe to Home Assistant events to represent countdown or alarm activity.
- Alarm state can additionally follow binary entities such as doorbells or switches.
- GUI editor with support for selecting multiple satellites, alarm entities, and event lists.

### Installation

1. Install the card through HACS or copy the built file from `dist/nabu-eyes-dashboard-card.js` into
   your Home Assistant `www/` directory (typically `/config/www/`).
2. When installing manually, copy the animated GIF assets from `dist/nabu_eyes_dashboard` into the
   same folder (for example `/config/www/nabu_eyes_dashboard`). HACS installations bundle these
   assets automatically under `/hacsfiles/nabu-eyes-voice-avatar/nabu_eyes_dashboard`.
3. Add the resource reference to Home Assistant:

   ```yaml
   url: /local/nabu-eyes-dashboard-card.js
   type: module
   ```

   When installed through HACS the resource is exposed automatically at
   `/hacsfiles/nabu-eyes-voice-avatar/nabu-eyes-dashboard-card.js`, so you can
   reference that URL instead of copying the build output manually.

### Example Lovelace Configuration

```yaml
type: custom:nabu-eyes-dashboard-card
name: Nabu Eyes
assist_entities:
  - assist_satellite.home_assistant_voice_0a54e5_assist_satellite
  - assist_satellite.home_assistant_voice_0a50d7_assist_satellite
  - assist_satellite.home_assistant_voice_0a219c_assist_satellite
countdown_events: []
countdown_clear_events: []
alarm_events: []
alarm_clear_events: []
alarm_entities: []
alarm_active_states:
  - "on"
  - detected
  - unavailable
hide_when_idle: false
glow_radius: 30
avatar_padding_vertical: 0
glow_color_blue: rgba(0, 21, 255, 0.5)
glow_color_light: rgba(0, 255, 255, 0.4)
glow_color_purple: rgba(255, 0, 255, 0.38)
glow_color_sepia: rgba(255, 210, 0, 0.35)
media_player: media_player.speaker_group_ma
mute_media_player: media_player.speaker_group_ma
playing_variant: nabu_playing_dash_blue.gif
media_player_equalizer: nabu_eq_dash_purple.gif
state_idle_variant: nabu_idle_dash_blue.gif
state_listening_variant: nabu_listening_dash_blue.gif
state_processing_variant: nabu_processing_dash_blue.gif
state_responding_variant: nabu_responding_dash_blue.gif
state_alarm_variant: nabu_alarm_dash_blue.gif
state_countdown_variant: nabu_countdown_dash_blue.gif
state_mute_variant: nabu_mute_dash_blue.gif
idle_dwell_seconds: 30
fullscreen_overlay: false
asset_path: /hacsfiles/nabu-eyes-voice-avatar
timer_mode: all
timer_entities:
  - timer.10s
timer_event_started: "on"
timer_event_restarted: "on"
timer_event_paused: "off"
timer_event_cancelled: "off"
timer_event_finished: "off"
doorbell_entity: binary_sensor.aarlo_ding_red_doorbell
```

### Configuration Options

- **assist_entities** (required): One or more Assist Satellite entities that drive the base
  animation state of the card. The card hides itself when every satellite reports `idle` if
  `hide_when_idle` is enabled.
  <img width="567" height="447" alt="image" src="https://github.com/user-attachments/assets/49302703-c302-4030-ba7d-cc3459592652" />

- **hide_when_idle**: When `true`, the card disappears if all tracked satellites are idle. Set to
  `false` to always show the idle animation.
  <img width="577" height="247" alt="image" src="https://github.com/user-attachments/assets/63141f2b-8a5d-4f5d-9901-69fb4a1f33f8" />

- **Overlay on top (centered)** When `true`, the card appears center overlay ontp of dashboard. Set to
  `false` to appear as a card inline with dashboard.
  <img width="572" height="57" alt="image" src="https://github.com/user-attachments/assets/1240338f-58b1-40e8-9176-b0a0d2cc7ef6" />

- **media_player**: Media player entity that controls the equalizer animation while it is playing.
  <img width="577" height="111" alt="image" src="https://github.com/user-attachments/assets/41b29da6-f0e6-4e68-8f80-a0597006c4d9" />

- **mute_media_player**: Media player entity that controls the mute overlay. Defaults to the same
  entity as `media_player`.
  <img width="575" height="311" alt="image" src="https://github.com/user-attachments/assets/7da333d7-1aac-4e1d-b9f6-b7308889e906" />

- **asset_path**: Path to the folder that contains the GIF assets. Defaults to
  `/hacsfiles/nabu-eyes-voice-avatar/nabu_eyes_dashboard` (the location used by HACS). For manual
  installations keep the assets under `/local/nabu_eyes_dashboard` and update this value.

  **Variants**:
  <img width="477" height="497" alt="image" src="https://github.com/user-attachments/assets/386fba73-9c89-4cf9-84b4-071562b3232f" />
  <img width="480" height="500" alt="image" src="https://github.com/user-attachments/assets/be2e3ccc-40c7-45ce-be1d-53f80e541345" />
  <img width="472" height="494" alt="image" src="https://github.com/user-attachments/assets/372d6b5a-a824-49d4-b1e2-841ce982fece" />

- **countdown_events** / **countdown_clear_events**: Home Assistant event types that toggle the
  countdown animation on or off.
  <img width="573" height="675" alt="image" src="https://github.com/user-attachments/assets/267cbde9-2d69-45a5-8842-a550fbb3733f" />
  <img width="481" height="509" alt="image" src="https://github.com/user-attachments/assets/a8796735-b26e-4926-bb6a-061d2c7f5c64" />

- **alarm_events** / **alarm_clear_events**: Event types that toggle the alarm animation.
  <img width="560" height="400" alt="image" src="https://github.com/user-attachments/assets/96b67dde-ba53-43d5-8672-cfc4141b2638" />

- **alarm_entities**: Binary entities (doorbells, switches, etc.) that can also activate the alarm
  animation when their state matches `alarm_active_states`.
  <img width="581" height="665" alt="image" src="https://github.com/user-attachments/assets/a4183ba1-b187-46c2-bd95-07be0e33f1ce" />

- **glow_radius**: Glow Radius behind Nabu Eyes.
  <img width="576" height="84" alt="image" src="https://github.com/user-attachments/assets/b7eb322c-18ca-477c-b918-6fcc5147d153" />

- **vertical_padding**: Vertical padding above and below card
  <img width="575" height="91" alt="image" src="https://github.com/user-attachments/assets/3c470e30-1516-44d7-9683-36bef3ca6784" />

- **variant glow colours**: Colour of glow behind variants
  <img width="572" height="372" alt="image" src="https://github.com/user-attachments/assets/fb002792-5bbd-4798-8ed0-d9367435de31" />

### Development

Install dependencies and build the card with:

```bash
npm install
npm run build
```

The compiled file is emitted into the `dist/` directory alongside source maps for debugging.
