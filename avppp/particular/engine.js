class Engine {
    static emitters = []
    static launch_sources = []
    static affectors = []

    static loop() {
        for(let emitter of Engine.emitters) {
            emitter.spawn()
            emitter.update()
            emitter.draw()
            
            for(let affector of Engine.affectors) {
                affector.applyForcesToParticles(emitter.particles)
            }
        }

        for(let affector of Engine.affectors) {
            affector.update()
            affector.draw()
        }
    }

    static addEmitter(emitter) {
        Engine.emitters.push(emitter)
    }

    static removeEmitter(emitter) {
        Engine.emitters.splice(Engine.emitters.indexOf(emitter), 1)
    }

    static addAffector(affector) {
        Engine.affectors.push(affector)
    }

    static removeAffector(affector) {
        Engine.affectors.splice(Engine.affectors.indexOf(affector), 1)
    }

    static handleMousePress() {
        if(mouseButton === LEFT) {
            for(let affector of Engine.affectors) {
                affector.pressed()
            }
            for(let emitter of Engine.emitters) {
                emitter.pressed()
            }
        } else if(mouseButton === RIGHT) {
            UI.contextMenu.close()
            if(Engine.notOverClickable() && !UI.mouseInPanel()) UI.contextMenu.open([
                new ContextMenuAction(
                    "Create Emitter",
                    () => { Engine.addEmitter(new Emitter(UI.contextMenu.getPosition())); console.log(UI.contextMenu.getPosition()) },
                    "CTRL + E"
                ),
                new ContextMenuAction(
                    "Create Affector",
                    () => { Engine.addAffector(new Affector(UI.contextMenu.getPosition())); console.log(this.affectors) },
                    "CTRL + A"
                )
            ])
            else {
                for(let affector of Engine.affectors) {
                    if(affector.draggable()) {
                        UI.contextMenu.open(
                            [
                                new ContextMenuAction("Edit", () => { UI.addPanel(new RegistryPanel(affector.registry, createVector(180, 50), "Edit " + affector.id)) }, ""),
                                new ContextMenuAction("Delete", () => { Engine.removeAffector(affector) }, ""),
                            ],
                            true
                        )
                    }
                }
                for(let emitter of Engine.emitters) {
                    if(emitter.draggable()) {
                        UI.contextMenu.open(
                            [
                                new ContextMenuAction("Edit", () => { UI.addPanel(new RegistryPanel(emitter.registry, createVector(180, 380), "Edit " + emitter.id)) }, ""),
                                new ContextMenuAction("Delete", () => { Engine.removeEmitter(emitter) }, ""),
                            ],
                            true
                        )
                    }
                }
            }
        }
    }

    static handleMouseRelease() {
        if(mouseButton === LEFT) {
            for(let affector of Engine.affectors) {
                affector.released()
            }
            for(let emitter of Engine.emitters) {
                emitter.released()
            }
        }
    }

    static generateID(prefix) {
        let new_id = prefix + round(random(0, 100))
        while(Engine.affectors.find(affector => affector.id == new_id)) {
            new_id = prefix + round(random(0, 100))
        }
        while(Engine.emitters.find(emitter => emitter.id == new_id)) {
            new_id = prefix + round(random(0, 100))
        }
        while(Engine.launch_sources.find(source => source.id == new_id)) {
            new_id = prefix + round(random(0, 100))
        }
        return new_id
    }

    static reset() {
        if(!confirm("Are you sure you want to clear the engine?")) return
        Engine.emitters = []
        Engine.affectors = []
    }

    static notOverClickable() {
        let over = false
        for(let emitter of Engine.emitters) {
            if(emitter.draggable()) over = true
        }
        for(let affector of Engine.affectors) {
            if(affector.draggable()) over = true
        }
        return !over
    }
}