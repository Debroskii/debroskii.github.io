let cardWidth = 120;
let cardHeight = 90;
let cam;
let lastMouseX, lastMouseY;
let dragging = false;
let zoomFactor = 0.375;
let font;

let data = [
  {
    category: "Main Navigation",
    content: [
      {name: "Homepage", type: 0},
      {name: "Campus Clubs", type: 0},
      {name: "Athletics", type: 0},
      {name: "Events", type: 0},
      {name: "Class Pages", type: 0},
      {name: "Resources", type: 0},
      {name: "Media Gallery", type: 0},
      {name: "5-Star Portal", type: 2}
    ]
  },
  {
    category: "Homepage",
    content: [
      {name: "Quicklinks/News", type: 1},
      {name: "Short Resource Pointers", type: 2},
      {name: "5-Star Portal Link", type: 2},
      {name: "Class Pages", type: 0}
    ]
  },
  {
    category: "Campus Clubs",
    content: [
      {name: "Campus Club Description", type: 1},
      {name: "Club List", type: 1},
      {name: "LatinX Club Info", type: 1}
    ]
  },
  {
    category: "Athletics",
    content: [
      {name: "Athletics Page", type: 0},
      {name: "Sports Schedules", type: 1},
      {name: "Sports Registration Info", type: 1},
      {name: "Athletic Forms", type: 1},
    ]
  },
  {
    category: "Events",
    content: [
      {name: "Homecoming Page", type: 0},
      {name: "Homecoming Posts", type: 1},
      {name: "Homecoming Description", type: 1},
      {name: "HOCO Links", type: 2},
      {name: "HOCO Guest Info", type: 1}
    ]
  },
  {
    category: "Class Pages",
    content: [
      {name: "Class of 2025", type: 0},
      {name: "Class of 2026", type: 0},
      {name: "Class of 2027", type: 0},
      {name: "Class of 2028", type: 0},
      {name: "Word of the Wolverine Codes", type: 1},
    ]
  },
  {
    category: "Resources",
    content: [
      {name: "Misc Resource Grid", type: 1},
      {name: "External Resource Section", type: 2},
      {name: "5-Star Portal Link", type: 2},
      {name: "Tertiary Resource Section", type: 1},
      {name: "Athletics Page", type: 0},
      {name: "GPA Calculator", type: 1},
      {name: "Activities Documents", type: 1},
      {name: "Canva Guides", type: 2}
    ]
  },
  {
    category: "Media Gallery",
    content: [
      {name: "Instagram Pages", type: 2},
      {name: "YouTube Videos", type: 2},
      {name: "Photo Gallery", type: 1}
    ]
  }
];

function preload() {
  font = loadFont("PlayfairDisplay.ttf")
}


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cam = createCamera();
  cam.setPosition(0, 0, 100);
  cam.lookAt(0, 0, 0);
}

function draw() {
  background(241);
  fill(0);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textFont(font);
  
  for(let cat of data) {
    let index = data.indexOf(cat);
    let catX = (cardWidth + 50) * (index - data.length / 2 + 0.5);
    let catY = -450;
    // Draw category card
    push();
    translate(catX, catY, 0);
    stroke(0);
    strokeWeight(1);
    fill(200, 220, 255);
    box(cardWidth, cardHeight, 2);
    translate(0, 0, 2.01);
    fill(0);
    text(cat.category, 0, 0, cardWidth - 10, cardHeight - 10);
    pop();

    for(let content of cat.content) {
      let contentIndex = cat.content.indexOf(content);
      let contentX = catX;
      let contentY = catY + 110 * (contentIndex + 1);

      // Draw content card
      push();
      translate(contentX, contentY, 0);
      stroke(0);
      strokeWeight(1);
      if(content.type === 0) {
        fill(255, 200, 200);
      } else if(content.type === 1) {
        fill(200, 255, 200);
      } else {
        fill(200, 200, 255);
      }
      box(cardWidth, cardHeight, 2);
      translate(0, 0, 2.01);
      fill(0);
      text(content.name, 0, 0, cardWidth - 10, cardHeight - 10);
      pop();
    }
  }

  perspective(PI / 3 / zoomFactor, width / height, cam.near, cam.far);
}

function mousePressed() {
  dragging = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseDragged() {
  if (dragging) {
    // Horizontal movement (left/right)
    let dx = (mouseX - lastMouseX) * 0.85;
    // Vertical movement (up/down)
    let dy = (mouseY - lastMouseY) * 0.85;
    cam.move(-dx, -dy, 0);
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mouseReleased() {
  dragging = false;
}

function mouseWheel(event) {
  // Zoom in/out (adjust perspective field of view)
  zoomFactor -= event.delta * 0.001;
  zoomFactor = constrain(zoomFactor, 0.375, 3);
}