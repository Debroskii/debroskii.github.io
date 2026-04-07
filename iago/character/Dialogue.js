const framesBetweenAddingWord = 5;
const framesBetweenLines = 120 * 0.5;

class Conversation {
    static activeMembers = [];
    static loadedDialogue = null;
    static lineIndex = 0;
    static timeSinceLastWord = 0;
    static timeSinceLineEnd = 0;
    static currentDisplayedText = "";

    static loop(camera, zoom, entities) {
        if(this.activeMembers.length > 0) {
            this.positionCamera(camera, zoom, entities)
        }

        if(this.loadedDialogue) {
            let line = this.loadedDialogue[this.lineIndex];
            if(line) {
                if(this.timeSinceLastWord >= framesBetweenAddingWord) {
                    this.timeSinceLastWord = 0;
                    this.currentDisplayedText = line.text.substring(0, this.currentDisplayedText.length + 1);
                } else {
                    this.timeSinceLastWord++;
                }

                if(this.currentDisplayedText === line.text) {
                    if(this.timeSinceLineEnd >= framesBetweenLines) {
                        this.timeSinceLineEnd = 0;
                        this.currentDisplayedText = "";
                        this.lineIndex++;
                    } else {
                        this.timeSinceLineEnd++;
                    }
                }

                console.log(this.currentDisplayedText)

                let entity = entities.find(e => e.name == line.name);

                push();
                translate(-windowWidth / 2, -windowHeight/2);
                fill(entity.artist.color);
                noStroke();
                textSize(5);
                textAlign(LEFT, CENTER);
                text(this.currentDisplayedText, entity.position.x + 15, entity.position.y);
                pop();
            }
        }
    }
    
    static positionCamera(camera, zoom, entities = []) {
        if(this.activeMembers.length > 0) {
            let avgPos = createVector(0, 0);
            let members = entities.filter(e => this.activeMembers.includes(e.name))
            for(let member of members) {
                avgPos.add(member.position);
            }
            avgPos.div(this.activeMembers.length);

            //Lerp position
            let currentPos = createVector(camera.eyeX, camera.eyeY);
            let desiredPos = createVector(avgPos.x - windowWidth / 2, avgPos.y - windowHeight / 2);
            let newPos = p5.Vector.lerp(currentPos, desiredPos, 0.1);
            camera.setPosition(newPos.x, newPos.y, 250 * zoom);
        }
    }
}