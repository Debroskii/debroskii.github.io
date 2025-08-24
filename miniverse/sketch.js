let systems = [];
let cam;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cam = createCamera();
  for(let i = 0; i < 1000; i++) {
    systems.push(new System(
      createVector(randomGaussian(random(-100, 100), 1000), randomGaussian(random(-100, 100), 1000), randomGaussian(random(-100, 100), 1000)),
      random(100, 300)
    ))
  }
}

function draw() {
  background(0);
  orbitControl();
  for(let system of systems) {
    system.display();
  }
}

class System {
  constructor(pos, size) {
    this.pos = pos;
    this.size = size;
    this.rot = createVector(random(TAU), random(TAU), random(TAU));
    this.bodies = [];
    this.createBodies();
    this.graphic = createGraphics(this.size * 2, this.size * 2);
    this.graphic.noFill();
    this.graphic.stroke(255, 105);
    this.graphic.strokeWeight(1);
    this.graphic.push();
    this.graphic.translate(-this.size, -this.size);
    for(let body of this.bodies) {
      this.graphic.circle(this.size * 2, this.size * 2, body.radius * 8);
    }
    this.graphic.pop();
  }

  display() {
    let pos = this.pos
    noStroke();
    push();
    translate(pos.x, pos.y, pos.z);
    rotateX(this.rot.x);
    rotateY(this.rot.y);
    rotateZ(this.rot.z);
    for(let body of this.bodies) {
      push();
      rotateZ(body.angle);
      translate(body.radius, 0, 0);
      fill(body.color);
      sphere(body.size);
      pop();
      body.angle += body.speed;
    }
    fill(255);
    sphere(this.size / 100);
    noFill();
    if(abs(createVector(cam.eyeX, cam.eyeY, cam.eyeZ).sub(pos.copy()).mag()) < 200) texture(this.graphic);
    plane(this.size / 2, this.size / 2);
    pop();
  }

  createBodies() {
    for(let i = 0; i < ceil(this.size / random(25, 100)); i++) {
      this.bodies.push({
        angle: random(TAU),
        radius: random(this.size / 30, this.size / 5),
        size: random(this.size / 500, this.size / 300),
        speed: random(0.002, 0.0025),
        color: color(randomGaussian(150, 100), randomGaussian(210 , 100), randomGaussian(255, 100), 255)
      })
    }
  }
}