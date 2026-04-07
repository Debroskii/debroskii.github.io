class Environment {
    constructor(mapImg) {
        this.camera = createCamera();
        this.cameraTarget = "Iago";
        this.cameraZoom = 0.75;

        this.map = new LoadedMap(mapImg, (pos, pixelSize) => {
            noStroke();
            fill((pos.x + pos.y) % 2 == 0 ? 5 : 10),
            rect(pos.x * pixelSize.x, pos.y * pixelSize.y, pixelSize.x, pixelSize.y);
        }, (pos, pixelSize) => {
            noStroke();
            fill((pos.x + pos.y) % 2 == 0 ? 75 : 80),
            rect(pos.x * pixelSize.x, pos.y * pixelSize.y, pixelSize.x, pixelSize.y);
        });

        this.player = new Character("Red", this.map.getSpawn("Red"), new Artist((pos) => {
            rectMode(CENTER);
            fill(255, 0, 0);
            rect(pos.x, pos.y, 20, 20);
        }, 10, color(255, 0, 0)), new Controller(() => {return createVector(0.3, 0)}), null, true);

        this.entities = [
            this.player,
            new Character("Purple", this.map.getSpawn("Purple"), new Artist((pos) => {
                rectMode(CENTER);
                fill(255, 0, 255);
                rect(pos.x, pos.y, 20, 20);
            }, 10, color(255, 0, 255)), new FollowerController(this.player)),
            new Character("Blue", this.map.getSpawn("Blue"), new Artist((pos) => {
                rectMode(CENTER);
                fill(0, 0, 255);
                rect(pos.x, pos.y, 20, 20);
            }, 10, color(0, 0, 255)), new Controller(() => createVector(0, 0)))
        ];

        this.entities.push(new Character("White", this.map.getSpawn("White"), new Artist((pos) => {
            rectMode(CENTER);
            fill(255, 255, 255);
            rect(pos.x, pos.y, 20, 20);
        }, 10, color(255, 255, 255)), new FollowerController(this.entities[2])))

        this.entities.push(new Character("Green", this.map.getSpawn("Green"), new Artist((pos) => {
            rectMode(CENTER);
            fill(0, 255, 55);
            rect(pos.x, pos.y, 20, 20);
        }, 10, color(0, 255, 55)), new Controller(() => createVector())))

        Conversation.activeMembers = ["Red", "Purple"];
        Conversation.loadedDialogue = A1S1;
    }

    loop() {
        this.timingLoop();
        push();
        translate(-windowWidth/2, -windowHeight/2);
        this.map.draw();
        for(let entity of this.entities) {
            entity.loop(this.map);
        }
        pop();
        if(this.cameraTarget == "Red") {
            push();
            this.camera.setPosition(this.player.position.x - windowWidth / 2, this.player.position.y - windowHeight / 2, 250 * this.cameraZoom);
            pop();
        }
        Conversation.loop(this.camera, this.cameraZoom, this.entities);
    }

    timingLoop() {
        if(this.map.getTileValue(this.player.position) != -1) {
            this.player.controller = new PlayerController();
            this.cameraZoom = lerp(this.cameraZoom, 1, 0.01);
        }

        if(this.map.getTileValue(this.entities.find(e => e.name == "Purple").position) == -2) {
            this.entities.find(e => e.name == "Purple").controller = new Controller(() => createVector(0, 1));
            Conversation.activeMembers = ["Red"];
            this.cameraZoom = lerp(this.cameraZoom, 1, 0.01);
        }

        if(this.map.getTileValue(this.player.position) == -3) {
            this.player.controller = new Controller(() => createVector(0, 0));
            if(Conversation.activeMembers.find(e => e == "Red") != null && Conversation.activeMembers.find(e => e == "Blue") == null) {
                Conversation.activeMembers = ["Blue", "White"]
                this.entities[2].controller = new Controller(() => createVector(-0.3, 0));
            }
            if(Conversation.loadedDialogue == A1S1) {
                Conversation.loadedDialogue = A1S2;
                Conversation.lineIndex = 0;
                Conversation.timeSinceLastWord = 0;
                Conversation.timeSinceLineEnd = 0;
                Conversation.currentDisplayedText = "";
            }
            this.cameraZoom = lerp(this.cameraZoom, 0.5, 0.01);
        }

        if(this.map.getTileValue(this.entities.find(e => e.name == "Blue").position) == -4) {
            this.entities.find(e => e.name == "White").controller = new Controller(() => createVector(0, 0));
            this.entities.find(e => e.name == "Blue").controller = new Controller(() => createVector(-1, 0.15));
            this.entities.find(e => e.name == "Green").controller = new Controller(() => createVector(0, 1));
            Conversation.activeMembers = ["Green", "Blue"];
            this.cameraZoom = lerp(this.cameraZoom, 0.75, 0.01);
        }

        if(this.map.getTileValue(this.entities.find(e => e.name == "Green").position) == -6) {
            this.entities.find(e => e.name == "Green").controller = new Controller(() => createVector(0, 0));
            this.cameraZoom = lerp(this.cameraZoom, 0.75, 0.01);
        }

        if(this.map.getTileValue(this.entities.find(e => e.name == "Blue").position) == -5) {
            this.entities.find(e => e.name == "Blue").controller = new Controller(() => createVector(0, 0));
            this.cameraZoom = lerp(this.cameraZoom, 0.75, 0.01);
        }

        if(this.map.getTileValue(this.entities.find(e => e.name == "Blue").position) == -5 && this.map.getTileValue(this.entities.find(e => e.name == "Green").position) == -6) {
            if(Conversation.loadedDialogue == A1S2) {
                Conversation.loadedDialogue = A1S3;
                Conversation.lineIndex = 0;
                Conversation.timeSinceLastWord = 0;
                Conversation.timeSinceLineEnd = 0;
                Conversation.currentDisplayedText = "";
            }
            this.cameraZoom = lerp(this.cameraZoom, 0.75, 0.01);
        }

        if(Conversation.loadedDialogue == A1S3 && Conversation.lineIndex >= Conversation.loadedDialogue.length) {
            Conversation.activeMembers = ["Green", "White"]
            this.entities.find(e => e.name == "Blue").controller = new Controller(() => createVector(-0.5, 0.0));
            this.player.controller = new FollowerController(this.entities.find(e => e.name == "Blue"));
            this.entities.find(e => e.name == "Green").controller = new Controller(() => createVector(0.75, 0.0));
        }

        if(this.map.getTileValue(this.entities.find(e => e.name == "Green").position) == -4) {
            this.entities.find(e => e.name == "Green").controller = new Controller(() => createVector(0, 0));
            Conversation.activeMembers = ["Red", "Blue"]
            if(Conversation.loadedDialogue == A1S3) {
                Conversation.loadedDialogue = A1S4;
                Conversation.lineIndex = 0;
                Conversation.timeSinceLastWord = 0;
                Conversation.timeSinceLineEnd = 0;
                Conversation.currentDisplayedText = "";
            }
        }

        if(Conversation.loadedDialogue == A1S4 && Conversation.lineIndex >= Conversation.loadedDialogue.length) {
            Conversation.activeMembers = ["White", "Green"]
            this.cameraZoom = lerp(this.cameraZoom, 3, 0.0001);
        }
    }
}