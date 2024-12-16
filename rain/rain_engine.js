class RainDrop {
    constructor(position, velocity, mass) {
        this.position = position;
        this.velocity = velocity;
        this.mass = mass
    }

    update(affectorAccel) {
        this.position.add(this.velocity);
        this.velocity.add(affectorAccel.x * this.mass, affectorAccel.y * this.mass)

        if(this.position.y > height) {
            this.position = createVector(width * 1.5 - random(width * 2), 0 - random(height * 3))
            this.velocity = createVector(0, 0)
            this.mass = random(0.65, 2.5)
        }
    }

    draw(color, alpha) {
        let shift = this.velocity.copy().div(random(1, 2))

        let c = color
        c.setAlpha(alpha / this.mass)
        stroke(c);
        strokeWeight(1 * this.mass)
        noFill()
        line(this.position.x, this.position.y, this.position.x + shift.x, this.position.y + shift.y)
    }

    static generate() {
        return new RainDrop(
            createVector(width * 1.5 - random(width * 2), 0 - random(height * 3)),
            createVector(0, 0),
            random(0.65, 2.5)
        )
    }
}

class Engine {
    constructor(dropCount, gravity) {
        this.count = dropCount
        this.drops = []
        this.gravity = createVector(0, gravity)
        this.wind = [-PI / 2, 1, createVector(0, 0)]
        this.next_wind_impulse = 5

        for (var i = 0; i < this.count; i++) {
            this.drops.push(RainDrop.generate())
        }
    }

    loop(rain_color, rain_alpha) {
        for(let drop of this.drops) {

            if (frameCount % (40 * this.next_wind_impulse) == 0) {
                this.wind[0] = -PI / 2 + random(-PI / 6, PI / 6)
                this.wind[1] = random(0.5, 1)
                this.next_wind_impulse = round(random(3, 10))
            }

            this.wind[2].x += ((cos(this.wind[0]) * this.wind[1]) - this.wind[2].x) * 0.00025
            this.wind[2].y += ((sin(this.wind[0]) * this.wind[1] / 2) - this.wind[2].y) * 0.00025

            drop.update(this.gravity.copy().add(this.wind[2]))
            drop.draw(rain_color, rain_alpha)
        }
    }
}