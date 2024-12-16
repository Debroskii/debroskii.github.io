var RAIN_COUNT = 5000
var GRAVITY_ACCEL = 0.98

var SHOW_UI = true
var RAIN_SOUND = true
var CONFIG = false

let ui;
let action_bar;
let config_bar;

let toggle_config_icon;
let toggle_config_button;

let toggle_ui_icon;
let toggle_ui_button;

let toggle_sound_icon;
let toggle_sound_button;

var engine;
var config_menu;
let rain_loop_audio;

function toggleConfig() {
  CONFIG = !CONFIG
  if(CONFIG) {
    config_menu.menu.show()
  } else {
    config_menu.menu.hide()
  }
}

function toggleSound() {
  RAIN_SOUND = !RAIN_SOUND
  if(RAIN_SOUND) {
    toggle_sound_icon.attribute("src", "assets/volume.png")
  } else {
    toggle_sound_icon.attribute("src", "assets/mute.png")
  }
}

function toggleUI() {
  SHOW_UI = !SHOW_UI
  if(SHOW_UI) {
    action_bar.attribute("style", "backdrop-filter: blur(1px);")

    toggle_ui_icon.attribute("src", "assets/shown.png")
    toggle_ui_icon.attribute("style", "opacity: 100%;")

    toggle_sound_button.show()
    toggle_config_button.show()
    if(CONFIG) {
      config_menu.menu.show()
    }
  } else {
    action_bar.attribute("style", "backdrop-filter: none")

    toggle_ui_icon.attribute("src", "assets/hidden.png")
    toggle_ui_icon.attribute("style", "opacity: 35%;")

    toggle_sound_button.hide()
    toggle_config_button.hide()
    config_menu.menu.hide()
  }
}

function preload() {
  rain_loop_audio = loadSound('assets/rain_loop.mp3')
  rain_loop_audio.setVolume(0.25)
  rain_loop_audio.setLoop(true)
}

function setup() {
  frameRate(60)
  createCanvas(1100, 700);

  ui = createDiv("")
  ui.id("ui")

  // Action Bar
  action_bar = createDiv("")
  action_bar.id("action-bar")
  ui.child(action_bar)

  // Toggle UI
  toggle_ui_icon = createElement("img", "")
  toggle_ui_icon.addClass("ui-button-icon")
  toggle_ui_icon.id('ui_visible_icon')
  toggle_ui_icon.attribute("src", "assets/shown.png")

  toggle_ui_button = createButton("")
  toggle_ui_button.addClass("ui-button")
  toggle_ui_button.id('ui-visible-button')
  toggle_ui_button.mouseClicked(toggleUI)
  toggle_ui_button.child(toggle_ui_icon)

  // Toggle Sound
  toggle_sound_icon = createElement("img", "")
  toggle_sound_icon.addClass("ui-button-icon")
  toggle_sound_icon.id('volume-button-icon')
  toggle_sound_icon.attribute("src", "assets/volume.png")

  toggle_sound_button = createButton("")
  toggle_sound_button.addClass("ui-button")
  toggle_sound_button.id("toggle_rain_sound_button")
  toggle_sound_button.mouseClicked(toggleSound)
  toggle_sound_button.child(toggle_sound_icon)

  // Toggle Config
  toggle_config_icon = createElement("img", "")
  toggle_config_icon.addClass("ui-button-icon")
  toggle_config_icon.id('config-button-icon')
  toggle_config_icon.attribute("src", "assets/config.png")

  toggle_config_button = createButton("")
  toggle_config_button.addClass("ui-button")
  toggle_config_button.id("toggle_config_button")
  toggle_config_button.mouseClicked(toggleConfig)
  toggle_config_button.child(toggle_config_icon)

  action_bar.child(toggle_ui_button)
  action_bar.child(toggle_sound_button)
  action_bar.child(toggle_config_button)

  config_menu = new ConfigMenu()
  if(!CONFIG) {
    config_menu.menu.hide()
  }
  ui.child(config_menu.menu)

  RAIN_COUNT = config_menu.getDropCount()
  GRAVITY_ACCEL = config_menu.getGravityAccel() / 10

  engine = new Engine(RAIN_COUNT, GRAVITY_ACCEL);
}

function draw() {
  background(config_menu.getBackgroundColor());
  engine.loop(config_menu.getRainColor(), config_menu.getRainAlpha())

  if(SHOW_UI) {
    fill(0, 255, 0);
    textSize(8)
    text("FPS: " + round(frameRate()), 10, 690)
  }

  if(RAIN_SOUND) {
    if(!rain_loop_audio.isPlaying()) {
      rain_loop_audio.play()
    }
  } else {
    rain_loop_audio.stop()
  }

  if(RAIN_COUNT != config_menu.getDropCount()) {
    RAIN_COUNT = config_menu.getDropCount()
    engine = new Engine(RAIN_COUNT, GRAVITY_ACCEL);
  }

  if(GRAVITY_ACCEL * 10 != config_menu.getGravityAccel()) {
    GRAVITY_ACCEL = config_menu.getGravityAccel() / 10
    engine = new Engine(RAIN_COUNT, GRAVITY_ACCEL);
  }
}
