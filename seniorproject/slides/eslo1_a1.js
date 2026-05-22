class Eslo1Artifact1Slide {
    static waiting = true; 
    static images = [];
    static leftImageCarousel = [];
    static rightImageCarousel = [];
    static carouselOffset = 0;

    static setSlide() {
        setTimeout(() => this.waiting = false, 500)
        for(let image of this.images) {
            if(this.images.indexOf(image) > 7) {
                this.rightImageCarousel.push(image)
                continue;
            }
            this.leftImageCarousel.push(image)
        }
        currentSlide = this;
    }

    static async loadPhotos() {
        this.images = [
            await loadImage("assets/images/a1/1.png"),
            await loadImage("assets/images/a1/2.png"),
            await loadImage("assets/images/a1/3.png"),
            await loadImage("assets/images/a1/4.png"),
            await loadImage("assets/images/a1/5.png"),
            await loadImage("assets/images/a1/6.png"),
            await loadImage("assets/images/a1/7.png"),
            await loadImage("assets/images/a1/8.png"),
            await loadImage("assets/images/a1/9.png"),
            await loadImage("assets/images/a1/10.png"),
            await loadImage("assets/images/a1/11.png"),
            await loadImage("assets/images/a1/12.png"),
            await loadImage("assets/images/a1/13.png"),
        ]
    }

    static loop() {
        background(BACKGROUND_COLOR)
        // orbitControl()
        fill(BACKGROUND_COLOR)
        rect(-width/2, -height/2, width, height)

        if(this.waiting) return;

        fill(FOREGROUND_COLOR)
        noStroke()
        textFont(KodeMonoBold)
        textAlign(LEFT, TOP)
        textSize(100)
        text("PROGRAMING", -width/2 + 20, -height/2 + 20)

        textSize(50)
        textFont(KodeMonoSemibold)
        text(
            "For 8 years, I've self taught and developed my skills in 9 different programming languages. Using them to log over 40 projects and 331 hours in just the past 18 months.",
            -width/2 + 60,
            -height/2 + 200,
            700
        )

        push()
        translate(0, 300, 0)
        this.carouselOffset++;
        for(let img of this.rightImageCarousel) {
            let i = this.rightImageCarousel.indexOf(img)
            let y = (height + 300) - (i*300) - this.carouselOffset;
            image(img, 300 + 200, y - width/2, 300, 300)
        }
        for(let img of this.leftImageCarousel) {
            let i = this.leftImageCarousel.indexOf(img)
            let y = (i*300) - 300 + this.carouselOffset;
            image(img, 200, y - width/2, 300, 300)
        }
        if(this.carouselOffset > 300) {
            this.carouselOffset = 0;
            let lImage = this.leftImageCarousel[this.leftImageCarousel.length - 1]
            let rImage = this.rightImageCarousel[this.rightImageCarousel.length - 1]
            this.leftImageCarousel.splice(this.leftImageCarousel.length - 1, 1)
            this.rightImageCarousel.splice(this.rightImageCarousel.length - 1, 1)
            this.leftImageCarousel.unshift(rImage)
            this.rightImageCarousel.unshift(lImage)
        }
        pop()
        fill(0, 105)
        rectMode(CORNER)
        rect(50, -height/2, 600, height)
    }

    static forwards() {
        Eslo1Artifact2Slide.setSlide()
    }
    static backwards() {
        Eslo1Slide.setSlide();
    }
}