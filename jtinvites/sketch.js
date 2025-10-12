let colors;
let petals = [];
let numPetals = 150;
let petalVelocityMeanDirection;
let petalVelocityDirectionSD;
let petalVelocityMeanMagnitude = 2;
let petalVelocityMagnitudeSD = 0.4;
let petalWidthMean = 30;
let petalHeightMean = 25;
let petalWidthSD = 5;
let petalHeightSD = 5;
let initialCanvasSize;
let slowFrame = 60 * 1;
let freezeFrame = 60 * 5;
let resizeFrameStart = 60 * 2;
let resizeFrameEnd = 60 * 3;
let ticketBaseFadeInFrame = 60 * 1;
let whiteSectionHeightStart = 0.5;
let backgroundSplotches = [];
let DokiDokiFont;
let ChewyFont;

function preload() {
  DokiDokiFont = loadFont('/DokiDoki.otf');
  ChewyFont = loadFont('/Chewy.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  initialCanvasSize = createVector(width, height);
  colors = {
    background: color(155, 229, 255),
    pinkPetals: [
      color(255, 182, 193),
      color(255, 105, 180),
      color(255, 20, 147),
      color(199, 21, 133),
      color(255, 192, 203)
    ]
  };
  petalVelocityMeanDirection = QUARTER_PI * 0.75;
  petalVelocityDirectionSD = PI / 12;
  for(let i = 0; i < numPetals; i++) {
    let position = createVector(randomGaussian(-100, 100), randomGaussian(-200, 200));
    let angle = randomGaussian(petalVelocityMeanDirection, petalVelocityDirectionSD);
    let magnitude = max(0, randomGaussian(petalVelocityMeanMagnitude, petalVelocityMagnitudeSD));
    let velocity = p5.Vector.fromAngle(angle).mult(magnitude);
    let rotation = 0;
    let size = createVector(max(5, randomGaussian(petalWidthMean, petalWidthSD)), max(5, randomGaussian(petalHeightMean, petalHeightSD)));
    petals.push(BlossomPetal(position, velocity, rotation, randomGaussian(0.02, 0.015), size));
  }
  for(let i = 0; i < 200; i++) {
    let position = createVector(random(width), random(height));
    let size = random(10, 70);
    let c = color(255, 255, 255, random(5, 30));
    backgroundSplotches.push({position, size, c});
  }
}

function draw() {
  if(frameCount > resizeFrameStart && frameCount < resizeFrameEnd) {
    resizeCanvas(lerp(width, initialCanvasSize.x * 0.75, (frameCount - resizeFrameStart) / (resizeFrameEnd - resizeFrameStart)), lerp(height, initialCanvasSize.y * 0.9, (frameCount - resizeFrameStart) / (resizeFrameEnd - resizeFrameStart)));
  }
  background(colors.background);
  for(let splotch of backgroundSplotches) {
    noStroke();
    fill(splotch.c);
    ellipse(splotch.position.x, splotch.position.y, splotch.size);
  }
  for(let petal of petals) {
    if(frameCount > resizeFrameEnd) break;
    if(frameCount == slowFrame) {
      petal.velocity.mult(0.75);
      petal.rotationSpeed *= 0.75;
    }
    if(frameCount == freezeFrame) {
      petal.velocity.mult(0.01);
      petal.rotationSpeed *= 0.01;
    }
    petal.position.add(petal.velocity);
    petal.rotation += petal.rotationSpeed;
    drawPetal(petal);
    if(petal.position.x > width + petal.size.x) {
      petal.position.x = -petal.size.x;
    }
    if(petal.position.y > height + petal.size.y) {
      petal.position.y = -petal.size.y;
    }
  }
  if(frameCount > resizeFrameEnd) {
    if(frameCount < resizeFrameEnd + ticketBaseFadeInFrame) {
      document.getElementById("defaultCanvas0").style.borderRadius = `${lerp(0, 20, (frameCount - resizeFrameEnd) / ticketBaseFadeInFrame)}px`;
    }
    for(let petal of petals) {
      if(frameCount > freezeFrame) {
        if(petal.velocity.mag() > 0.01) petal.velocity.mult(0.9);
        if(abs(petal.rotationSpeed) > 0.0001) petal.rotationSpeed *= 0.9;
      }
      petal.position.add(petal.velocity);
      petal.rotation += petal.rotationSpeed;
      drawBigPetal(petal, min((frameCount - resizeFrameEnd) / ticketBaseFadeInFrame, 1));
      if(petal.position.x > width + petal.size.x) {
        petal.position.x = -petal.size.x;
      }
      if(petal.position.y > height + petal.size.y) {
        petal.position.y = -petal.size.y;
      }
    }
    noStroke();
    fill(255, lerp(0, 255, (frameCount - resizeFrameEnd) / ticketBaseFadeInFrame));
    rect(0, height * whiteSectionHeightStart + 12, width, height * (1 - whiteSectionHeightStart) - 12);
    fill(0, lerp(0, 255, (frameCount - resizeFrameEnd) / ticketBaseFadeInFrame));
    beginShape();
    vertex(0, height * whiteSectionHeightStart);
    vertex(15, height * whiteSectionHeightStart + 12);
    vertex(0, height * whiteSectionHeightStart + 25);
    endShape(CLOSE);
    beginShape();
    vertex(width, height * whiteSectionHeightStart);
    vertex(width - 15, height * whiteSectionHeightStart + 12);
    vertex(width, height * whiteSectionHeightStart + 25);
    endShape(CLOSE);
    for(let i = 0; i < 30; i++) {
      let perfHoleSize = width / 30;
      fill(0, lerp(0, 255, (frameCount - resizeFrameEnd) / ticketBaseFadeInFrame));
      ellipse(i * perfHoleSize + perfHoleSize / 2, height * whiteSectionHeightStart + 12, perfHoleSize * 0.65, perfHoleSize * 0.65);
    }
    fill(255, lerp(0, 255, (frameCount - resizeFrameEnd) / ticketBaseFadeInFrame));
    textAlign(CENTER, CENTER);
    textFont(DokiDokiFont);
    textSize(132);
    text("日本", width/2, height * 0.25 - 25);
    textFont(ChewyFont);
    textSize(24);
    text("JAPAN 2026", width/2, height * 0.25 + 55);
  }
}

function BlossomPetal(position, velocity, rotation, rotationSpeed, size) {
  return {
    position: position,
    velocity: velocity,
    rotation: rotation,
    rotationSpeed: rotationSpeed,
    size: size,
    color: random(colors.pinkPetals)
  }
}

function drawPetal(petal) {
  push();
  translate(petal.position.x - petal.size.x/2, petal.position.y - petal.size.y/2);
  rotate(petal.rotation);
  noStroke();
  fill(petal.color);
  //Petal shape not heart, almost like a leaf
  beginShape();
  // Assumes petal.size is a p5.Vector (width = petal.size.x, height = petal.size.y)

  // Start at bottom center
  vertex(0, 0);

  // Right edge of petal
  bezierVertex(
    petal.size.x * 0.2, -petal.size.y * 0.1,  // subtle bulge near base
    petal.size.x * 0.6, -petal.size.y * 0.5,  // mid-curve outward
    petal.size.x * 0.1, -petal.size.y * 1.0   // tip approaching top
  );

  bezierVertex(
    petal.size.x * 0.05, -petal.size.y * 1.05, // slight taper at tip
    0, -petal.size.y * 0.95,                  // bring back toward center top
    0, -petal.size.y                             // exact top tip
  );

  // Left edge, mirroring right
  bezierVertex(
    0, -petal.size.y * 0.95,                  // slight taper from tip
    -petal.size.x * 0.05, -petal.size.y * 1.05, // left tip curve
    -petal.size.x * 0.1, -petal.size.y * 1.0     // curve back toward base
  );

  bezierVertex(
    -petal.size.x * 0.6, -petal.size.y * 0.5, // mid-curve inward
    -petal.size.x * 0.2, -petal.size.y * 0.1, // subtle bulge near base
    0, 0                                       // back to bottom center
  );


  endShape(CLOSE);
  pop();
}

function drawBigPetal(petal, progress) {
  let size = petal.size.copy().mult(1 + 3 * progress);
  push();
  translate(petal.position.x - petal.size.x/2, petal.position.y - petal.size.y/2);
  rotate(petal.rotation);
  noStroke();
  fill(red(petal.color), green(petal.color), blue(petal.color), 100);
  //Petal shape not heart, almost like a leaf
  beginShape();
  // Assumes petal.size is a p5.Vector (width = petal.size.x, height = petal.size.y)

  // Start at bottom center
  vertex(0, 0);

  // Right edge of petal
  bezierVertex(
    size.x * 0.2, -size.y * 0.1,  // subtle bulge near base
    size.x * 0.6, -size.y * 0.5,  // mid-curve outward
    size.x * 0.1, -size.y * 1.0   // tip approaching top
  );

  bezierVertex(
    size.x * 0.05, -size.y * 1.05, // slight taper at tip
    0, -size.y * 0.95,                  // bring back toward center top
    0, -size.y                             // exact top tip
  );

  // Left edge, mirroring right
  bezierVertex(
    0, -size.y * 0.95,                  // slight taper from tip
    -size.x * 0.05, -size.y * 1.05, // left tip curve
    -size.x * 0.1, -size.y * 1.0     // curve back toward base
  );

  bezierVertex(
    -size.x * 0.6, -size.y * 0.5, // mid-curve inward
    -size.x * 0.2, -size.y * 0.1, // subtle bulge near base
    0, 0                                       // back to bottom center
  );


  endShape(CLOSE);
  pop();
}
