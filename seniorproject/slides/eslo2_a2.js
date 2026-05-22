class Eslo2Artifact2Slide {
    static waiting = true; 
    static shedModel = null;

    static setSlide() {
        setTimeout(() => this.waiting = false, 500)
        angleMode(DEGREES)
        currentSlide = this;
    }

    static async loadAndPrerenderModels() {
        this.shedModel = await loadModel("assets/model/shed.stl")
        model(this.shedModel)
    }
    
    static loop() {
        background(BACKGROUND_COLOR)
        if(this.waiting) return;

        fill(FOREGROUND_COLOR)
        noStroke()
        textFont(KodeMonoBold)
        textAlign(LEFT, TOP)
        textSize(100)
        text("ECD", -width/2 + 20, -height/2 + 20)

        textSize(50)
        textFont(KodeMonoSemibold)
        text(
            "The five primary pathway classes I was in are collaboration based, and ECD gave me oppurtunities to work with people I didn't know, and explore topics I wasn't familiar with",
            -width/2 + 60,
            -height/2 + 200,
            700
        )

        push()
        translate(width/2 - 350, 150, -350)
        rotateX(60)
        rotateZ(160)
        ambientLight(15, 15, 15)
        pointLight(200, 200, 200, -(width/2 - 300), -100, 100)
        scale(0.15)
        fill(FOREGROUND_COLOR)
        model(this.shedModel)
        pop()
    }

    static forwards() {
        Eslo3Slide.setSlide()
    }
    static backwards() {
        Eslo2Artifact1Slide.setSlide()
    }
}