class EndSlide {
    static waiting = true; 

    static setSlide() {
        setTimeout(() => this.waiting = false, 500)
        angleMode(DEGREES)
        currentSlide = this;
    }

    static loop() {
        background(BACKGROUND_COLOR)
        if(this.waiting) return;

        fill(FOREGROUND_COLOR)
        noStroke()
        textFont(KodeMonoBold)
        textAlign(CENTER, CENTER)
        textSize(200)
        text("THANK YOU", 0, 0)
    }

    static forwards() {}
    static backwards() {
        RosemontSlide.setSlide()
    }
}