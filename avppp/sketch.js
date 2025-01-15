const FRAME_RATE = 60

function setup() {
  frameRate(FRAME_RATE)
  createCanvas(windowWidth, windowHeight);

  KeybindRegistry.addEntry([17, 65], () => { Engine.addAffector(new Affector(createVector(mouseX, mouseY))) })

  Config.init()
  UI.initialize()
}

function draw() {
  background(0)
  drawGrid()
  
  UI.updatePanels()
  Engine.loop()
}

function mousePressed() {
  UI.handleMousePress()
  Engine.handleMousePress()
}

function mouseReleased() {
  UI.handleMouseRelease()
  Engine.handleMouseRelease()
}

function keyPressed() {
  KeybindRegistry.pressed()
}

function drawGrid() {
  let rows = ceil(windowHeight / 40)
  let cols = ceil(windowWidth / 40)

  for(var row = 0; row < rows; row++) {
    let row_y = row * (windowHeight / rows)
    for(var col = 0; col < cols; col++) {
      let col_x = col * (windowWidth / cols)
      fill(255, 25)
      noStroke()
      let size = max(2, min(3, 150/createVector(col_x, row_y).dist(createVector(mouseX, mouseY))))
      ellipse(col_x, row_y, size, size)
    }
  }
}