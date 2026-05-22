class RosemontSlide {
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
        textAlign(CENTER, TOP)
        textSize(100)
        text("ROSEMONT", 0, -height/2 + 50)

        textSize(50)
        textFont(KodeMonoSemibold)
        textAlign(CENTER, CENTER)
        text(
            "Rosemont has inspired me, challenged me, and supported me in ways I couldn't have imagined. The unconditional support from staff has encouraged me to pursue my own ideas, my own learning, and now influenced the career I want to pursue.",
            -(width - 200)/2,
            0,
            width - 200
        )
    }

    static forwards() {
        EndSlide.setSlide()
    }
    static backwards() {
        FuturePlansSlide.setSlide()
    }
}