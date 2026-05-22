class Eslo2Artifact1Slide {
    static waiting = true; 
    static cccPhoto = null;
    static elevatorPhoto = null
    static revengePhoto = null

    static setSlide() {
        setTimeout(() => this.waiting = false, 500)
        angleMode(DEGREES)
        currentSlide = this;
    }

    static async loadPhotos() {
        this.cccPhoto = await loadImage("assets/images/ccc.jpg")
        this.elevatorPhoto = await loadImage("assets/images/elevator.jpeg")
        this.revengePhoto = await loadImage("assets/images/revenge.jpeg")
    }
    
    static loop() {
        background(BACKGROUND_COLOR)
        if(this.waiting) return;

        fill(FOREGROUND_COLOR)
        noStroke()
        textFont(KodeMonoBold)
        textAlign(LEFT, TOP)
        textSize(100)
        text("ROBOTICS", -width/2 + 20, -height/2 + 20)

        textSize(50)
        textFont(KodeMonoSemibold)
        text(
            "Six years of robotics has been filled with collaboration and hard work towards creating together, forming community bonds, and developing lasting impact",
            -width/2 + 60,
            -height/2 + 200,
            700
        )

        push()
        translate(200, -200)
        rotateZ(-10)
        renderPhotoWindow(300, 300, "WORLDS 2023", this.elevatorPhoto)
        pop()

        push()
        translate(475, 0)
        rotateZ(2)  
        renderPhotoWindow(300, 300, "CCC 2025", this.cccPhoto)
        pop()

        push()
        translate(200, 200)
        rotateZ(-2)
        renderPhotoWindow(300, 300, "SHOP 2024", this.revengePhoto)
        pop()
    }

    static forwards() {
        Eslo2Artifact2Slide.setSlide()
    }
    static backwards() {
        Eslo2Slide.setSlide()
    }
}