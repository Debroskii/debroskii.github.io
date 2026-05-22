class Eslo3Artifact2Slide {
    static waiting = true; 
    static video = null;

    static setSlide() {
        setTimeout(() => this.waiting = false, 500)
        angleMode(DEGREES)
        currentSlide = this;
    }

    static async loadVideo() {
        this.video = createVideo("assets/images/rollers.MOV")
        this.video.hide()
        this.video.volume(0)
        this.video.loop()
    }
    
    static loop() {
        background(BACKGROUND_COLOR)
        if(this.waiting) return;

        fill(FOREGROUND_COLOR)
        noStroke()
        textFont(KodeMonoBold)
        textAlign(LEFT, TOP)
        textSize(100)
        text("MENTORING", -width/2 + 20, -height/2 + 20)

        textSize(50)
        textFont(KodeMonoSemibold)
        text(
            "Volunteered in an environment for 3 years where diversity is the core of learning, making me more aware of different cultures and amplifying my ability to guide them through challenges",
            -width/2 + 60,
            -height/2 + 200,
            700
        )

        push()
        translate(360, 0)
        rotateZ(7)
        renderPhotoWindow(500, 500, "ROLLER PARTY 2024", this.video)
        pop()
    }

    static forwards() {
        FuturePlansSlide.setSlide()
    }
    static backwards() {
        Eslo3Artifact1Slide.setSlide()
    }
}