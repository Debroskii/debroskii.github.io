class Character {
    constructor(name, position, artist, controller, dialogue = null, isPlayer = false) {
        this.name = name;
        this.position = position;
        this.artist = artist;
        this.controller = controller;
        this.isPlayer = isPlayer;
        this.dialogue = dialogue;
    }

    loop(map) {
        this.position.add(this.controller.motionGetter(this.position).mult(0.5));
        this.position = map.makePositionNotCollide(this.position, this.artist.size);
        this.artist.draw(this.position);
    }
}