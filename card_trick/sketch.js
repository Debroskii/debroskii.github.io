const CARD_DIMENSIONS = { width: 150, height: 200 };
let SET = [];
let COLUMN1 = [];
let COLUMN2 = [];
let COLUMN3 = [];
let PHASE = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for(let i = 0; i < 21; i++) {
    let rankAndShape = getUniqueRankAndShape();
    SET.push({
      shape: rankAndShape.shape,
      rank: rankAndShape.rank
    });
  }
  distributeCards();
  print(SET);
}

function draw() {
  background(0);
  for(let i = 0; i < COLUMN1.length; i++) {
    drawCard(COLUMN1[i], { x: 10 + (CARD_DIMENSIONS.width/2), y: 10 + ((CARD_DIMENSIONS.height/2) + i * (CARD_DIMENSIONS.height * 0.25)) });
  }
  for(let i = 0; i < COLUMN2.length; i++) {
    drawCard(COLUMN2[i], { x: 20 + (CARD_DIMENSIONS.width/2) + CARD_DIMENSIONS.width, y: 10 + ((CARD_DIMENSIONS.height/2) + i * (CARD_DIMENSIONS.height * 0.25)) });
  }
  for(let i = 0; i < COLUMN3.length; i++) {
    drawCard(COLUMN3[i], { x: 30 + (CARD_DIMENSIONS.width/2) + CARD_DIMENSIONS.width*2, y: 10 + ((CARD_DIMENSIONS.height/2) + i * (CARD_DIMENSIONS.height * 0.25)) });
  }
  getAndHighlightHoveredColumn();
}

function mouseClicked() {
  let hoveredColumn = getAndHighlightHoveredColumn();
  if(!hoveredColumn) return;
  //Reversing columns because of pickup order
  if(hoveredColumn === COLUMN1) {
    SET = [...[...COLUMN2].reverse(), ...[...COLUMN1].reverse(), ...[...COLUMN3].reverse()];
  } else if(hoveredColumn === COLUMN2) {
    SET = [...[...COLUMN1].reverse(), ...[...COLUMN2].reverse(), ...[...COLUMN3].reverse()];
  } else if(hoveredColumn === COLUMN3) {
    SET = [...[...COLUMN1].reverse(), ...[...COLUMN3].reverse(), ...[...COLUMN2].reverse()];
  }
  COLUMN1 = [];
  COLUMN2 = [];
  COLUMN3 = [];
  distributeCards();
}

function getAndHighlightHoveredColumn() {
  let colWidth = CARD_DIMENSIONS.width + 10;
  let colHeight = ((CARD_DIMENSIONS.height/2) + COLUMN1.length * (CARD_DIMENSIONS.height * 0.25) + 50)
  let mouseXRelative = mouseX - 10;
  if(mouseXRelative < colWidth) {
    // Highlight COLUMN1
    fill(255, 255, 0, 50);
    rect(10, 10, colWidth - 10, colHeight, 10);
    return COLUMN1;
  } else if(mouseXRelative < colWidth * 2) {
    // Highlight COLUMN2
    fill(255, 255, 0, 50);
    rect(10 + colWidth, 10, colWidth - 10, colHeight, 10);
    return COLUMN2;
  } else if(mouseXRelative < colWidth * 3) {
    // Highlight COLUMN3
    fill(255, 255, 0, 50);
    rect(10 + colWidth * 2, 10, colWidth - 10, colHeight, 10);
    return COLUMN3;
  }
}

function distributeCards() {
  print(SET);
  PHASE++;
  if(PHASE === 4) {
    print("Your card is:");
    print(SET[10]);
  }
  for(let card of SET) {
    setTimeout(() => {
      let col = SET.indexOf(card) % 3;
      if(col === 0) {
        COLUMN1.push(card);
      } else if(col === 1) {
        COLUMN2.push(card);
      } else {
        COLUMN3.push(card);
      }
    }, SET.indexOf(card) * 50);
  }
}

const SHAPES = ['CIRCLE', 'TRIANGLE', 'SQUARE', 'DIAMOND'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function drawCard(cardInfo, position) {
  stroke(220);
  strokeWeight(2);
  push();
  translate(position.x, position.y);
  rectMode(CENTER);
  fill(255);
  rect(0, 0, CARD_DIMENSIONS.width, CARD_DIMENSIONS.height, 10);
  fill(0);
  textAlign(LEFT, TOP);
  textSize(16);
  text(`${cardInfo.rank}`, -CARD_DIMENSIONS.width / 2 + 10, -CARD_DIMENSIONS.height / 2 + 10);
  push();
  rotate(PI);
  text(`${cardInfo.rank}`, -CARD_DIMENSIONS.width / 2 + 10, -CARD_DIMENSIONS.height / 2 + 10);
  pop();
  
  let centerPos = { x: -CARD_DIMENSIONS.width / 2 + 15.3, y: -CARD_DIMENSIONS.height / 2 + 35};
  let bottomRightPos = { x: CARD_DIMENSIONS.width / 2 - 15.3, y: CARD_DIMENSIONS.height / 2 - 35};
  let scale = 0.3;
  
  noStroke();

  switch(cardInfo.shape) {
    case 'CIRCLE':
      drawCircleIcon(centerPos, scale);
      drawCircleIcon(bottomRightPos, scale);
      break;
    case 'TRIANGLE':
      drawTriangleIcon(centerPos, scale);
      drawTriangleIcon(bottomRightPos, scale);
      break;
    case 'SQUARE':
      drawSquareIcon(centerPos, scale);
      drawSquareIcon(bottomRightPos, scale);
      break;
    case 'DIAMOND':
      drawDiamondIcon(centerPos, scale);
      drawDiamondIcon(bottomRightPos, scale);
      break;
  }

  pop();
}

function drawCircleIcon(position, scale) {
  push();
  translate(position.x, position.y);
  fill(255, 0, 0);
  ellipse(0, 0, 40 * scale, 40 * scale);
  pop();
}

function drawTriangleIcon(position, scale) {
  push();
  translate(position.x, position.y);
  fill(255, 0, 0);
  triangle(-20 * scale, 20 * scale, 20 * scale, 20 * scale, 0, -20 * scale);
  pop();
}

function drawSquareIcon(position, scale) {
  push();
  translate(position.x, position.y);
  fill(0);
  rectMode(CENTER);
  rect(0, 0, 40 * scale, 40 * scale);
  pop();
}

function drawDiamondIcon(position, scale) {
  push();
  translate(position.x, position.y);
  fill(0);
  beginShape();
  vertex(0, -20 * scale);
  vertex(20 * scale, 0);
  vertex(0, 20 * scale);
  vertex(-20 * scale, 0);
  endShape(CLOSE);
  pop();
}

function getUniqueRankAndShape() {
  let shape = random(SHAPES);
  let rank = random(RANKS);
  for(let card of SET) {
    if(card.shape === shape && card.rank === rank) return getUniqueRankAndShape();
  }
  return { shape: shape, rank: rank };
}