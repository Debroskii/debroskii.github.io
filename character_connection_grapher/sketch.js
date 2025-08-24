let string = ``;
let letters = [];
let connections = [];
let font = null;
let input = null;

function preload() {
  font = loadFont('https://github.com/Debroskii/debroskii.github.io/raw/refs/heads/main/character_connection_grapher/assets/SourceCodePro-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cam = createCamera()
  textFont(font);
  input = createInput(string).id("inputString");
  document.getElementById("inputString").addEventListener("keypress", (e) => {
    string = e.target.value;
    regen();
  })
  regen();
  print(string)
  print("Letters", letters)
  print("Connections", connections)
}

function draw() {
  background(0);
  orbitControl();
  let pan = atan2(cam.eyeZ - cam.centerZ, cam.eyeX - cam.centerX)
  let tilt = atan2(cam.eyeY - cam.centerY, dist(cam.centerX, cam.centerZ, cam.eyeX, cam.eyeZ))
  let eye = createVector(cam.eyeX, cam.eyeY, cam.eyeZ);
  for(let letter of letters) {
    push();
    translate(letter.position.x, letter.position.y, letter.position.z);
    let camToSphere = p5.Vector.sub(letter.position, eye);  // direction from camera to sphere
    camToSphere.setMag(-30);
    fill(255, 255);
    noStroke();
    sphere(20);
    pop();

    push();
    fill(100, 100, 255)
    let textOffset = p5.Vector.add(letter.position, camToSphere);
    translate(textOffset);
    rotateY(-pan)
    rotateZ(tilt + PI)
    rotateY(-PI/2)
    rotateZ(PI)
    textSize(25);
    textAlign(CENTER, CENTER);
    text(letter.char, 0, 0)
    pop();
  }
  
  for(let connection of connections) {
    let firstChar = letters.find(letter => letter.char === connection.firstChar);
    let nextChar = letters.find(letter => letter.char === connection.nextChar);
    if(firstChar && nextChar) {
      push();
      stroke(255, 100);
      strokeWeight(2);
      line(firstChar.position.x, firstChar.position.y, firstChar.position.z,
        nextChar.position.x, nextChar.position.y, nextChar.position.z);
      pop();
    }
  }
}

function getUniquePosition() {
  let position;
  let isUnique = false;
  while(!isUnique) {
    position = createVector(randomGaussian(0, 200), randomGaussian(0, 200), randomGaussian(0, 200));
    isUnique = !letters.some(letter => p5.Vector.dist(letter.position, position) < 50);
  }
  return position;
}

function regen() {
  //Remove letters that are not in the string
  string = string.replace(/ /g,'')
  letters = letters.filter(letter => string.includes(letter.char));
  for(let char of string) {
    if(!letters.find(letter => letter.char === char)) letters.push({
      char: char,
      position: getUniquePosition()
    });
    let forward = {
      firstChar: char,
      nextChar: string[string.indexOf(char) + 1],
    }

    let backward = {
      firstChar: string[string.indexOf(char) - 1],
      nextChar: char,
    }
    if(forward.nextChar && !connections.find(conn => conn.firstChar === forward.firstChar && conn.nextChar === forward.nextChar)) connections.push(forward);
    if(backward.firstChar && !connections.find(conn => conn.firstChar === backward.firstChar && conn.nextChar === backward.nextChar)) connections.push(backward);
  }
}
