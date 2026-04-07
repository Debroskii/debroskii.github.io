let testMap;
let testEnvironment;
let font;

function preload() {
  testMap = loadImage("assets/maps/test_map.png")
  font = loadFont("assets/fonts/EBGaramond-VariableFont_wght.ttf")
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(120);
  testEnvironment = new Environment(testMap);
  textFont(font);
}

function draw() {
  background(0);
  testEnvironment.loop();
}