class Affector extends Draggable {
    constructor(position) {
        super(position.copy().add(createVector(5, 5)), createVector(10, 10), false)
        this.id = Engine.generateID("A")

        this.registry = new Registry(this.id).registerNumber("force", 0, "Force")
        GlobalRegistry.addRegistry(this.registry)
    }

    update() {
        super.update()
    }

    applyForcesToParticles(particles) {
        for(let particle of particles) {
            let dist = this.position.dist(particle.position)
            let particle_force = max(-2, min(Config.getGravitationalForce(this.registry.get("force").value, particle.mass, dist), 2))
            let angle = this.position.copy().sub(particle.position).heading()
            let force_vec = createVector(-particle_force * cos(angle), -particle_force * sin(angle))

            particle.applyForce(force_vec)
        }
    }

    draw() {
        if(this.draggable()) {
            document.getElementById("UIRoot").style.cursor = "pointer"

            stroke(0, 205)
            strokeWeight(7)
            fill(255, 255)
            textFont("monospace")
            textSize(10)
            text((this.registry.get("force").value < 0 ? `Attractor [${this.id}]` : this.registry.get("force").value > 0 ? `Repeller [${this.id}]` : `UNSIGNED Affector [${this.id}]`), mouseX + 13, mouseY)
        }

        strokeWeight(2)
        if(this.registry.get("force").value < 0) stroke(255, 205)
        else if(this.registry.get("force").value > 0) stroke(0, 205)
        else {
            stroke(255, 0, 0, 255)
            strokeWeight(2)
        }

        fill(this.registry.get("force").value > 0 ? 255 : 0)
            if(this.draggable()) {
                strokeWeight(3)
            }
        circle(this.position.x, this.position.y, 10)
    }

    draggable() {
        return this.position.dist(createVector(mouseX, mouseY)) <= 5
    }
}