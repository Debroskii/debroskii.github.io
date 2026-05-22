class FuturePlansSlide {
    static waiting = true; 
    static ucdLogo = null;
    static cpsloLogo = null;

    static setSlide() {
        setTimeout(() => this.waiting = false, 500)
        angleMode(DEGREES)
        currentSlide = this;
    }

    static async loadImages() {
        this.ucdLogo = await loadImage("assets/images/ucdavis_logo.png")
        this.cpsloLogo = await loadImage("assets/images/calpoly_logo.png")
    }
    
    static loop() {
        background(BACKGROUND_COLOR)
        if(this.waiting) return;

        fill(FOREGROUND_COLOR)
        noStroke()
        // textFont(KodeMonoBold)
        // textAlign(LEFT, TOP)
        // textSize(100)
        // text("FUTURE PLANS", -width/2 + 20, -height/2 + 20)

        push()
        translate(85, 0)
        imageMode(CENTER)
        image(this.cpsloLogo, -400, -150, 300, 300)
        image(this.ucdLogo, -400, 150, 300, 300)
        fill(0, 105)
        rectMode(CENTER)
        rect(-400, 0, 300, 600)
        fill(FOREGROUND_COLOR)
        textAlign(LEFT, CENTER)
        textFont(KodeMonoBold)
        textSize(75)
        text("CAL POLY SLO", -150, -180)
        text("UC DAVIS", -150, 115)
        textSize(40)
        text("Applied Mathematics BS", -150, -115)
        text("Physics PhD", -150, 180)
        pop()
    }

    static forwards() {
        RosemontSlide.setSlide()
    }
    static backwards() {
        Eslo3Artifact2Slide.setSlide()
    }
}