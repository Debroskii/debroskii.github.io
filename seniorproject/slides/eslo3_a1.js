class Eslo3Artifact1Slide {
    static waiting = true; 
    static fieldTripPhoto = null;

    static setSlide() {
        setTimeout(() => this.waiting = false, 500)
        angleMode(DEGREES)
        currentSlide = this;
    }

    static async loadPhotos() {
        this.fieldTripPhoto = await loadImage("assets/images/lc_fieldtrip.png")
    }
    
    static loop() {
        background(BACKGROUND_COLOR)
        if(this.waiting) return;

        fill(FOREGROUND_COLOR)
        noStroke()
        textFont(KodeMonoBold)
        textAlign(LEFT, TOP)
        textSize(100)
        text("LINK CREW", -width/2 + 20, -height/2 + 20)

        textSize(50)
        textFont(KodeMonoSemibold)
        text(
            "Gave oppurtunities to step into leadership and and it prepared me to facilitate conversation that strengthens the group by considering the diversity of everyone's perspectives.",
            -width/2 + 60,
            -height/2 + 200,
            700
        )

        push()
        translate(360, 0)
        rotateZ(-3)
        renderPhotoWindow(500, 500, "CONFERENCE 2025", this.fieldTripPhoto)
        pop()
    }

    static forwards() {
        Eslo3Artifact2Slide.setSlide()
    }
    static backwards() {
        Eslo3Slide.setSlide()
    }
}