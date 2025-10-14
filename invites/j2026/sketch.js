let colors;
let petals = [];
let numPetals = 75;
let petalVelocityMeanDirection;
let petalVelocityDirectionSD;
let petalVelocityMeanMagnitude = 2;
let petalVelocityMagnitudeSD = 0.4;
let petalWidthMean = 30;
let petalHeightMean = 25;
let petalWidthSD = 5;
let petalHeightSD = 5;
let initialCanvasSize;
let slowFrame = 60 * 10; //10
let freezeFrame = 60 * 12; //12
let resizeFrameStart = 60 * 11; //11
let resizeFrameEnd = 60 * 13; //13
let ticketBaseFadeInFrame = 60 * 0.1;
let whiteSectionHeightStart = 0.5;
let backgroundSplotches = [];
let DokiDokiFont;
let ChewyFont;
let ReceiptFont;
let DotoFont;
let yoshino;
let started = false;
let datesLabel = {
  display: "",
  target: "日付"
}
let dates = {
  display: "",
  target: "Dates TBD"
}
let admitOne = {
  display: "",
  target: "一つ認める",
  displayEnglish: "",
  targetEnglish: ">>>>> ADMIT ONE <<<<<"
}
let nameLabel = {
  display: "",
  target: "名前"
}
let name = {
  display: "",
  target: ""
};
let estimatedPriceLabel = {
  display: "",
  target: "推定価格"
}
let estimatedPrice = {
  display: "",
  target: "$2200–$2600"
}
let message = {
  display: "",
  target: "Let's go to Japan!"
}
let callToAction = {
  display: "",
  target: "Shoot me a message if you are interested or have any questions and we can get a meeting set up with everyone to talk and plan!"
}
let pixelScale = 1;

function preload() {
  DokiDokiFont = loadFont('DokiDoki.otf');
  ChewyFont = loadFont('Chewy.ttf');
  ReceiptFont = loadFont('receipt.ttf');
  DotoFont = loadFont('doto.ttf');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  initialCanvasSize = createVector(width, height);
  pixelScale = window.innerHeight / 860;
  frameRate(60);
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
    let position = createVector(randomGaussian(-200, 100), randomGaussian(-300, 200));
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
  // orbitControl();
  if(frameCount > resizeFrameStart && frameCount < resizeFrameEnd) {
    resizeCanvas(lerp(width, initialCanvasSize.x * 0.85, (frameCount - resizeFrameStart) / (resizeFrameEnd - resizeFrameStart)), lerp(height, initialCanvasSize.y * 0.95, (frameCount - resizeFrameStart) / (resizeFrameEnd - resizeFrameStart)));
  }
  background(colors.background);
  for(let splotch of backgroundSplotches) {
    push();
    noStroke();
    fill(splotch.c);
    translate(-width/2, -height/2);
    ellipse(splotch.position.x, splotch.position.y, splotch.size);
    pop();
  }
  if(!started) {
    fill(0, 55);
    rect(width/-2, height/-2, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textFont(DotoFont);
    textSize(16 * pixelScale);
    text("Click to see some nice floating petals", -150, -30, 300, 50);
    frameCount = 0;
    return;
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
      // petal.rotation += petal.rotationSpeed;
      drawBigPetal(petal, min((frameCount - resizeFrameEnd) / ticketBaseFadeInFrame, 1));
      if(petal.position.x > width + petal.size.x) {
        petal.position.x = -petal.size.x;
      }
      if(petal.position.y > height/2 + petal.size.y) {
        petal.position.y = -petal.size.y;
      }
    }
    push();
    translate(-width/2, -height/2);
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
    for(let i = 0; i < 60; i++) {
      let perfHoleSize = width / 60;
      fill(0, lerp(0, 255, (frameCount - resizeFrameEnd) / ticketBaseFadeInFrame));
      ellipse(i * perfHoleSize + perfHoleSize / 2, height * whiteSectionHeightStart + 12, perfHoleSize * 0.65, perfHoleSize * 0.65);
    }

    fill(255, lerp(0, 255, (frameCount - resizeFrameEnd) / ticketBaseFadeInFrame));
    textAlign(CENTER, CENTER);
    textFont(DokiDokiFont);
    textSize(132 * pixelScale);
    text("日本", width/2, height * 0.25 - 25 * pixelScale);
    textFont(ChewyFont);
    textSize(24 * pixelScale);
    text("JAPAN 2026", width/2, height * 0.25 + 55 * pixelScale);

    fill(0, lerp(0, 255, (frameCount - resizeFrameEnd) / ticketBaseFadeInFrame));
    textFont(ReceiptFont);
    textSize(13 * pixelScale);
    textAlign(LEFT, TOP);
    if(frameCount % 3 == 0 && nameLabel.display.length < nameLabel.target.length) {
      nameLabel.display += nameLabel.target[nameLabel.display.length];
    }
    text(nameLabel.display, 25, height * whiteSectionHeightStart + 40 * pixelScale);
    textFont(DotoFont);
    textSize(28 * pixelScale);
    if(frameCount % 2 == 0 && name.display.length < name.target.length) {
      name.display += name.target[name.display.length];
    }
    text(name.display, 25, height * whiteSectionHeightStart + 53 * pixelScale);
    fill(199 * 0.75, 21 * 0.75, 133 * 0.75, lerp(0, 255, (frameCount - resizeFrameEnd) / ticketBaseFadeInFrame));
    textFont(ReceiptFont);
    textSize(13 * pixelScale);
    if(frameCount % 3 == 0 && datesLabel.display.length < datesLabel.target.length) {
      datesLabel.display += datesLabel.target[datesLabel.display.length];
    }
    textAlign(RIGHT, TOP);
    text(datesLabel.display, width - 25, height * whiteSectionHeightStart + 95 * pixelScale);
    textFont(DotoFont);
    textSize(20 * pixelScale);
    if(frameCount % 2 == 0 && dates.display.length < dates.target.length) {
      dates.display += dates.target[dates.display.length];
    }
    text(dates.display, width - 25, height * whiteSectionHeightStart + 108 * pixelScale);

    textFont(ReceiptFont);
    textSize(13 * pixelScale);
    textAlign(LEFT, TOP);
    if(frameCount % 3 == 0 && estimatedPriceLabel.display.length < estimatedPriceLabel.target.length) {
      estimatedPriceLabel.display += estimatedPriceLabel.target[estimatedPriceLabel.display.length];
    }
    text(estimatedPriceLabel.display, 25, height * whiteSectionHeightStart + 95 * pixelScale);
    textFont(DotoFont);
    textSize(20 * pixelScale);
    if(frameCount % 2 == 0 && estimatedPrice.display.length < estimatedPrice.target.length) {
      estimatedPrice.display += estimatedPrice.target[estimatedPrice.display.length];
    }
    text(estimatedPrice.display, 25, height * whiteSectionHeightStart + 108 * pixelScale);

    fill(0, lerp(0, 255, (frameCount - resizeFrameEnd) / ticketBaseFadeInFrame));
    textFont(DotoFont);
    textSize(18 * pixelScale);
    textAlign(CENTER, TOP);
    if(frameCount % 2 == 0 && message.display.length < message.target.length) {
      message.display += message.target[message.display.length];
    }
    text(message.display, width/2, height * whiteSectionHeightStart + 150 * pixelScale);

    textSize(13 * pixelScale);
    if(callToAction.display.length < callToAction.target.length) {
      callToAction.display += callToAction.target[callToAction.display.length];
    }
    text(callToAction.display, 10, height * whiteSectionHeightStart + 175 * pixelScale, width - 20, height * (1 - whiteSectionHeightStart) - 95 * pixelScale);

    fill(199 * 0.75, 21 * 0.75, 133 * 0.75, lerp(0, 255, (frameCount - resizeFrameEnd) / ticketBaseFadeInFrame));
    rectMode(CORNER)
    rect(0, height - 150 * pixelScale, width, 150 * pixelScale);

    fill(255, lerp(0, 255, (frameCount - resizeFrameEnd) / ticketBaseFadeInFrame));
    textFont(ReceiptFont);
    textSize(64 * pixelScale);
    textAlign(CENTER, CENTER);
    if(frameCount % 3 == 0 && admitOne.display.length < admitOne.target.length) {
      admitOne.display += admitOne.target[admitOne.display.length];
    }
    if(frameCount % 3 == 0 && admitOne.displayEnglish.length < admitOne.targetEnglish.length) {
      admitOne.displayEnglish += admitOne.targetEnglish[admitOne.displayEnglish.length];
    }
    text(admitOne.display, width/2, height - 90 * pixelScale);
    textSize(24 * pixelScale)
    textFont(DotoFont);
    text(admitOne.displayEnglish, width/2, height - 40 * pixelScale);
    pop();
  }
}

function BlossomPetal(position, velocity, rotation, rotationSpeed, size) {
  let petalGraphics = createGraphics(size.x, size.y);
  petalGraphics.noStroke();
  petalGraphics.fill(random(colors.pinkPetals));

  petalGraphics.beginShape();
  // Assumes petal.size is a p5.Vector (width = petal.size.x, height = petal.size.y)

  // Start at bottom center
  petalGraphics.vertex(0, 0);

  // Right edge of petal
  petalGraphics.bezierVertex(
    size.x * 0.2, -size.y * 0.1,  // subtle bulge near base
    size.x * 0.6, -size.y * 0.5,  // mid-curve outward
    size.x * 0.1, -size.y * 1.0   // tip approaching top
  );

  petalGraphics.bezierVertex(
    size.x * 0.05, -size.y * 1.05, // slight taper at tip
    0, -size.y * 0.95,                  // bring back toward center top
    0, -size.y                             // exact top tip
  );

  // Left edge, mirroring right
  petalGraphics.bezierVertex(
    0, -size.y * 0.95,                  // slight taper from tip
    -size.x * 0.05, -size.y * 1.05, // left tip curve
    -size.x * 0.1, -size.y * 1.0     // curve back toward base
  );

  petalGraphics.bezierVertex(
    -size.x * 0.6, -size.y * 0.5, // mid-curve inward
    -size.x * 0.2, -size.y * 0.1, // subtle bulge near base
    0, 0                                       // back to bottom center
  );


  petalGraphics.endShape(CLOSE);

  return {
    position: position,
    velocity: velocity,
    rotation: rotation,
    rotationSpeed: rotationSpeed,
    petal: petalGraphics,
    c: random(colors.pinkPetals),
    size: size
  }
}

function drawPetal(petal) {
  push();
  translate(-width/2, -height/2);
  translate(petal.position.x - petal.size.x/2, petal.position.y - petal.size.y/2);
  rotate(petal.rotation);
  fill(petal.c)
  noStroke();

  // image(petal.petal, 0, 0);

  // Petal shape not heart, almost like a leaf
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
  let size = petal.size.copy().mult(1 + 6 * progress);
  push();
  translate(-width/2, -height/2);
  translate(petal.position.x - petal.size.x/2, abs((petal.position.y - height/2  - petal.size.y/2) * noise(petal.size.y)));
  rotate(petal.rotation);
  noStroke();
  fill(red(petal.c), green(petal.c), blue(petal.c), 100);
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

function touchStarted() {
  started = true;
}
