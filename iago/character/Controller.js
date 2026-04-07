class Controller {
    constructor(motionGetter) {
        this.motionGetter = motionGetter;
    }
}

class PlayerController extends Controller {
    constructor() {
        super(() => {
            let motion = createVector(0, 0);
            if(keyIsDown(LEFT_ARROW)) motion.x -= 1;
            if(keyIsDown(RIGHT_ARROW)) motion.x += 1;
            if(keyIsDown(UP_ARROW)) motion.y -= 1;
            if(keyIsDown(DOWN_ARROW)) motion.y += 1;
            return motion;
        });
    }
}

class RandomMotionController extends Controller {
    constructor() {
        let seed = random(1000);
        super(() => {
            let angle = noise(frameCount / 500 + seed) * TWO_PI;
            let speed = constrain(sin(frameCount / 100 + seed) * noise(frameCount / 500 + seed), 0, 0.5);
            return createVector(cos(angle), sin(angle)).mult(speed);
        });
    }
}

class FollowerController extends Controller {
    constructor(target) {
        super((position) => {
            if(!this.originalPosition) this.originalPosition = position.copy();
            if(!this.originalOffset) this.originalOffset = p5.Vector.sub(target.position.copy(), this.originalPosition.copy());
            let desired = p5.Vector.sub(target.position, position.copy().add(this.originalOffset.copy()));
            desired.setMag(0.9);
            return desired;
        });
        this.originalPosition = null;
        this.originalOffset = null
    }
}