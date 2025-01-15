class Emitter extends Draggable {
    static EffectBasis = Object.freeze({
        LIFETIME: "Lifetime",
        DISTANCE: "Distance"
    })

    constructor(position) {
        super(position, createVector(0, 0), false)
        this.particles = []
        this.id = "E" + round(random(0, 10000))
        this.position = position

        this.dragging = false
        this.offset = createVector(0, 0)

        this.registry = new Registry(this.id)

        // Physics
        this.registry.registerNumber("pps", 1, "Particles Per Second")
        this.registry.registerNumber("force", 0.5, "Force")
        this.registry.registerNumber("force_variation", 0.0, "Force Variation")
        this.registry.registerNumber("min_mass", 1, "Minimum Mass")
        this.registry.registerNumber("max_mass", 3, "Maximum Mass")
        this.registry.registerNumber("min_angle", -180, "Minimum Angle")
        this.registry.registerNumber("max_angle", 180, "Maximum Angle")

        this.registry.registerColor("color", color(255, 255, 255), "Color", true, "Simple Styling")
        this.registry.registerBoolean("trail", false, "Particle Trail")
        this.registry.registerBoolean("twinkle", false, "Twinkle")

        this.registry.registerBoolean("gradient_effect", false, "Color Gradient", true, "Gradient Styling")
        this.registry.registerDropdown(
            "gradient_basis", 
            Emitter.EffectBasis.LIFETIME, 
            [Emitter.EffectBasis.LIFETIME, Emitter.EffectBasis.DISTANCE],
            "Gradient Basis"
        )
        this.registry.registerColor("gradient_color_1", color(255, 255, 255), "1st Gradient Color")
        this.registry.registerColor("gradient_color_2", color(255, 255, 255), "2nd Gradient Color")

        this.registry.registerBoolean("fade_out", false, "Fade Out", true, "Fade Styling")
        this.registry.registerDropdown("fade_out_basis", Emitter.EffectBasis.LIFETIME, [Emitter.EffectBasis.LIFETIME, Emitter.EffectBasis.DISTANCE], "Fade Out Basis")

        this.registry.registerBoolean("shrink", false, "Shrink", true, "Size Styling")
        this.registry.registerDropdown("shrink_basis", Emitter.EffectBasis.LIFETIME, [Emitter.EffectBasis.LIFETIME, Emitter.EffectBasis.DISTANCE], "Shrinking Basis")
        this.registry.registerBoolean("fluctuate", false, "Fluctuate")

        GlobalRegistry.addRegistry(this.registry)
        
        let angle = random(this.registry.get("min_angle").value * PI/180, this.registry.get("max_angle").value * PI/180)
        let mass = random(this.registry.get("min_mass").value, this.registry.get("max_mass").value)
        let speed = (
            (this.registry.get("force").value + random(-this.registry.get("force_variation").value, this.registry.get("force_variation").value)
        ) / mass)
        if(speed == Infinity) speed = 1

        let velocity = createVector(speed * sin(angle), speed * cos(angle))

        this.particles.push(new Particle(this.position, velocity, mass, this.registry.get("color").value, this.registry.get("trail").value))
    }

    spawn() {
        if(this.registry.get("pps") < 1) {
            if(round(frameCount / 60 % (1 / this.registry.get("pps").value)) == 0) {
                let angle = random(this.registry.get("min_angle").value * PI/180, this.registry.get("max_angle").value * PI/180)
                let mass = random(this.registry.get("min_mass").value, this.registry.get("max_mass").value)
                let speed = (
                    (this.registry.get("force").value + random(-this.registry.get("force_variation").value, this.registry.get("force_variation").value)
                ) / mass)
                if(speed == Infinity) speed = 1

                let velocity = createVector(speed * sin(angle), speed * cos(angle))

                this.particles.push(new Particle(this.position, velocity, mass, this.registry.get("color").value, this.registry.get("trail").value))
            }
        } else {
            for(var i = 0; i < this.registry.get("pps").value; i++) {
                let angle = random(this.registry.get("min_angle").value * PI/180, this.registry.get("max_angle").value * PI/180)
                let mass = random(this.registry.get("min_mass").value, this.registry.get("max_mass").value)
                let speed = (
                    (this.registry.get("force").value + random(-this.registry.get("force_variation").value, this.registry.get("force_variation").value)
                ) / mass)
                if(speed == Infinity) speed = 1

                let velocity = createVector(speed * sin(angle), speed * cos(angle))

                this.particles.push(new Particle(this.position, velocity, mass, this.registry.get("color").value, this.registry.get("trail").value))
            }
        }
    }

    update() {
        super.update()

        for(const particle of this.particles) {
            particle.applyAcceleration(Config.getGravityVector())
            particle.update()

            if(Util.out_of_bounds(particle.position) || particle.lifetime >= Config.registry.get("particle_timeout").value) {
                this.particles.splice(this.particles.indexOf(particle), 1)
            }
        }
    }

    draw() {
        for(const particle of this.particles) {
            let info = {
                emitter_position: this.position,
                gradient: {
                    enabled: this.registry.get("gradient_effect").value,
                    basis: this.registry.get("gradient_basis").value,
                    color1: this.registry.get('gradient_color_1').value,
                    color2: this.registry.get('gradient_color_2').value
                },
                twinkle: this.registry.get("twinkle").value,
                fade: {
                    enabled: this.registry.get("fade_out").value,
                    basis: this.registry.get("fade_out_basis").value
                },
                shrink: {
                    enabled: this.registry.get("shrink").value,
                    basis: this.registry.get("shrink_basis").value
                },
                fluctuate: this.registry.get("fluctuate").value
            }
            particle.draw(info)
        }
        fill(this.registry.get("color").value)
        stroke(0, 155)
        strokeWeight(2)
        if(this.draggable()) {
            strokeWeight(3)
        }
        circle(this.position.x, this.position.y, 10)

        if(this.draggable()) {
            document.getElementById("UIRoot").style.cursor = "pointer"
            
            stroke(0, 205)
            strokeWeight(7)
            fill(255, 255)
            textFont("monospace")
            textSize(10)
            text(`Emitter [${this.id}]`, mouseX + 13, mouseY)
        }
    }

    delete() {
        if(this.draggable()) {
            Engine.sources.splice(Engine.sources.indexOf(this), 1)
        }
    }

    draggable() {
        return this.position.dist(createVector(mouseX, mouseY)) <= 5
    }
}

class LaunchEmitter {
    constructor(position) {
        this.particles = []
        this.id = "LE" + round(random(0, 10000))
        this.position = position
        this.angle = 0
        this.mag = 0
        this.count = 1
        this.launched = false

        this.dragging = true
    }

    launch() {
        if(this.launched) return
        for(var i = 0; i < this.count; i++) {
            let angle = this.angle + random(-i, i)
            let vel = createVector(this.mag * cos(angle), this.mag * sin(angle))
            this.particles.push(new Particle(this.position, vel, random(1, 3), color(255, 255, 255), Config.registry.get("launch_particle_trail"), true))
        }
        this.launched = true
    }

    update() {
        if(this.dragging) {
            this.angle = atan2(mouseY - this.position.y, mouseX - this.position.x)
            this.mag = sqrt(((mouseY - this.position.y) ** 2) + ((mouseX - this.position.x) ** 2)) * 0.1
            document.getElementById("ui").style.cursor = "pointer"
        } else {
            for(const particle of this.particles) {
                particle.applyAcceleration(Config.getGravityVector())
                particle.update()
    
                if(Util.out_of_bounds(particle.position) || particle.lifetime >= Config.registry.get("launch_particle_timeout")) {
                    this.particles.splice(this.particles.indexOf(particle), 1)
                }
            }
            if(this.particles.length == 0) {
                Engine.launch_sources.splice(Engine.launch_sources.indexOf(this), 1)
            }
        }
    }

    draw() {
        if(this.dragging) {
            fill(255)
            circle(this.position.x, this.position.y, 5)
            stroke(255)
            let vel = createVector(this.mag * cos(this.angle), this.mag * sin(this.angle))
            line(this.position.x, this.position.y, this.position.x + vel.x * 10, this.position.y + vel.y * 10)

            let left_vert = createVector(this.mag * 8.5 * cos(this.angle - 0.1), this.mag * 8.5 * sin(this.angle - 0.1))
            let right_vert = createVector(this.mag * 8.5 * cos(this.angle + 0.1), this.mag * 8.5 * sin(this.angle + 0.1))

            beginShape()
            vertex(this.position.x + vel.x * 10, this.position.y + vel.y * 10)
            vertex(this.position.x + left_vert.x, this.position.y + left_vert.y)
            vertex(this.position.x + right_vert.x, this.position.y + right_vert.y)
            endShape()

        } else {
            for(const particle of this.particles) {
                particle.draw()
            }
        }
    }

    pressed() {}
    spawn() {}

    released() {
        this.dragging = false
        this.launch()
        console.log("he")
    }
}