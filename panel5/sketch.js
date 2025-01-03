let test_registry

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);

  test_registry = new Registry("test_registry")
  test_registry.registerString("title", "PANEL5", "Title", true, "ENV SETTINGS")
  test_registry.registerColor("background", color(0, 0, 0), "Background Color")
  test_registry.registerBoolean("show_shape", false, "Show Shape", true, "SHAPE")
  test_registry.registerNumber("shape_size", 10.0, "Shape Size")
  test_registry.registerColor("shape_color", color(255, 0, 255), "Shape Color")
  test_registry.registerDropdown("shape", "circle", ["circle", "square"], "Shape")

  GlobalRegistry.addRegistry(test_registry)

  KeybindRegistry.addEntry([SHIFT, 65], UI.autoAlignAllPanels)
  KeybindRegistry.addEntry([SHIFT, 80], () => { UI.addPanel(new Panel(ceil(random(0, 100000)), createVector(0, 0), createVector(180, 220), "Blank Panel")) })
  KeybindRegistry.addEntry([SHIFT, 67], () => { UI.removeAllPanels() })

  UI.initialize()

  UI.addPanel(new RegistryPanel(test_registry, createVector(0, 0), createVector(180, 280), "Test Registry"))
}

function draw() {
  background(test_registry.get("background").value);
  UI.updatePanels();

  fill(test_registry.get("shape_color").value)
  noStroke()
  if(test_registry.get("show_shape").value) {
    if(test_registry.get("shape").value == "circle") {
      ellipse(windowWidth/2, windowHeight/2, test_registry.get("shape_size").value, test_registry.get("shape_size").value)
    } else if(test_registry.get("shape").value == "square") {
      rect(windowWidth/2 - test_registry.get("shape_size").value/2, windowHeight/2 - test_registry.get("shape_size").value/2, test_registry.get("shape_size").value, test_registry.get("shape_size").value)
    }
  }
}

function mousePressed() {
  UI.handleMousePress()
}

function mouseReleased() {
  UI.handleMouseRelease()
}

function keyPressed() {
  KeybindRegistry.pressed()
}