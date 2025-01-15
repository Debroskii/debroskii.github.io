class Particle {
    constructor(position, velocity, mass, color, trail = false, launched = false) {
        this.lifetime = 0
        this.position = position.copy()
        this.velocity = velocity.copy()
        this.mass = mass
        this.color = color
        this.trail_points = []
        this.trail = trail
        this.launched = launched
    }

    applyAcceleration(acceleration) {
        this.velocity.add(acceleration)
    }

    applyForce(force) {
        let ax = (force.copy().x / this.mass)
        if(ax == Infinity) ax = 0

        let ay = (force.copy().y / this.mass)
        if(ay == Infinity) ay = 0

        this.velocity.add(createVector(ax, ay))
    }

    update() {
        this.lifetime++

        if(this.lifetime % 3 == 0 && this.trail) {
            this.trail_points.push(this.position.copy())
        }

        this.position.add(this.velocity)
    }

    draw(draw_info) {
        let color = this.color
        let size = this.mass
        let alpha = 255

        if(draw_info.gradient.enabled) {
            if(draw_info.gradient.basis === Emitter.EffectBasis.DISTANCE) {
                let dist = draw_info.emitter_position.dist(this.position)
                color = lerpColor(draw_info.gradient.color1, draw_info.gradient.color2, dist / 300)
            } else if (draw_info.gradient.basis === Emitter.EffectBasis.LIFETIME) {
                color = lerpColor(draw_info.gradient.color1, draw_info.gradient.color2, this.lifetime / Config.registry.get("particle_timeout").value)
            }
        }

        if(draw_info.fade.enabled) {
            if(draw_info.fade.basis === Emitter.EffectBasis.DISTANCE) {
                let dist = draw_info.emitter_position.dist(this.position)
                alpha = lerp(255, 0, dist / 300)
            } else if (draw_info.fade.basis === Emitter.EffectBasis.LIFETIME) {
                alpha = lerp(255, 0, this.lifetime / Config.registry.get("particle_timeout").value)
            }
        }

        if(draw_info.shrink.enabled) {
            if(draw_info.shrink.basis === Emitter.EffectBasis.DISTANCE) {
                let dist = draw_info.emitter_position.dist(this.position)
                size = lerp(this.mass, 0, dist / 300)
            } else if (draw_info.shrink.basis === Emitter.EffectBasis.LIFETIME) {
                size = lerp(this.mass, 0, this.lifetime / Config.registry.get("particle_timeout").value)
            }
        }

        if(draw_info.fluctuate) size *= random(0.5, 1.5)
        if(draw_info.twinkle) alpha *= random(0, 1)

        noStroke()
        fill(red(color), green(color), blue(color), alpha)
        circle(this.position.x, this.position.y, size)

        if(this.trail) {
            noFill()
            if(!this.launched) {
                if(draw_info.twinkle) {
                    stroke(red(color), green(color), blue(color), random(0, 255))
                } else {
                    stroke(red(color), green(color), blue(color), alpha)
                }
            } else {
                stroke(red(color), green(color), blue(color), alpha)
            }
            strokeWeight(size)
            beginShape()
            for(const point of this.trail_points) {
                curveVertex(point.x, point.y)
            }
            endShape()
        }
    }
}