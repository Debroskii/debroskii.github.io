class Eslo1Artifact2Slide {
    static waiting = true; 
    static ftcBotModel = null;

    static setSlide() {
        setTimeout(() => this.waiting = false, 500)
        this.bloomBuffer = createFramebuffer();
        angleMode(DEGREES)
        currentSlide = this;
    }

    static async loadAndPrerenderModels() {
        this.ftcBotModel = await loadModel("assets/model/ftc_bot.stl")
        model(this.ftcBotModel)
        console.log(this.ftcBotModel)
    }

    static loop() {
        background(BACKGROUND_COLOR)
        // orbitControl()

        if(this.waiting) return;

        fill(FOREGROUND_COLOR)
        noStroke()
        textFont(KodeMonoBold)
        textAlign(LEFT, TOP)
        textSize(100)
        text("DESIGN", -width/2 + 20, -height/2 + 20)

        textSize(50)
        textFont(KodeMonoSemibold)
        text(
            "From 3D and 2D design, to multimedia editing, to web design, I've fully self taught design principles, applying it to various projects in and outside of school",
            -width/2 + 60,
            -height/2 + 200,
            700
        )

        // stroke(FOREGROUND_COLOR)
        // strokeWeight(3)
        // noFill()
        // rectMode(CENTER)
        // rect(width/2 - 400, 15, 650, 650)
        // fill(FOREGROUND_COLOR)
        // rect(width/2 - 400, -320, 650, 30)
        // noStroke()
        // fill(0)

        // textSize(30)
        // textAlign(CENTER, CENTER)
        // text("x", width/2 - 400 + 310, -320)
        // text("_", width/2 - 400 + 285, -330)

        fill(FOREGROUND_COLOR)
        push()
        translate(width/2 - 300, 50, -350)
        rotateX(60)
        rotateZ(frameCount)
        ambientLight(15, 15, 15)
        // directionalLight(255, 255, 255, 1, 1, -1)
        noStroke()
        pointLight(200, 200, 200, -(width/2 - 300), -100, 100)
        scale(2.5)
        model(this.ftcBotModel)
        pop()
    }

    static forwards() {
        Eslo2Slide.setSlide()
    }
    static backwards() {
        Eslo1Artifact1Slide.setSlide();
    }
}