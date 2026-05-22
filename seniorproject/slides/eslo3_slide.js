const ESLO_3_TITLE_POSITION_END = {x: 0, y: -150}
const ESLO_3_TITLE_POSITION_START = {x: 0, y: 0}
const ESLO_3_TITLE_SIZE_END = 75
const ESLO_3_TITLE_SIZE_START = 150

class Eslo3Slide {
    static shouldLoop = true;
    static waiting = true;
    static eslo3TitlePosition = {x: ESLO_3_TITLE_POSITION_START.x, y: ESLO_3_TITLE_POSITION_START.y};
    static eslo3TitleSize = 150;
    static eslo3TitleWaiting = true;
    static eslo3DescriptionWaiting = true;

    static setSlide() {
        this.waiting = true;
        this.eslo3TitleWaiting = true;
        this.eslo3DescriptionWaiting = true;
        setTimeout(() => this.waiting = false, 500)
        setTimeout(() => this.eslo3TitleWaiting = false, 2000)
        setTimeout(() => this.eslo3DescriptionWaiting = false, 3000)
        currentSlide = this;
    }

    static loop() {
        if(!this.shouldLoop) return;

        //Setup
        background(BACKGROUND_COLOR);
        fill(BACKGROUND_COLOR)
        rect(-width/2, -height/2, width, height)

        if(this.waiting) return;
        
        //Text
        fill(FOREGROUND_COLOR)
        noStroke()
        textFont(KodeMonoBold)
        textAlign(CENTER, CENTER)
        textSize(this.eslo3TitleSize)
        text("THIRD ESLO", this.eslo3TitlePosition.x, this.eslo3TitlePosition.y)

        //Description
        if(!this.eslo3DescriptionWaiting) {
            textFont(KodeMonoRegular)
            textSize(50)
            text("A culturally aware and empathetic individual who can embrace diversity.", -500, 50, 1000)
        }
        this.animLoop()
    }

    static animLoop() {
        if(this.eslo3TitleWaiting) return;
        this.eslo3TitlePosition.x = lerp(this.eslo3TitlePosition.x, ESLO_3_TITLE_POSITION_END.x, 0.1);
        this.eslo3TitlePosition.y = lerp(this.eslo3TitlePosition.y, ESLO_3_TITLE_POSITION_END.y, 0.1);
        this.eslo3TitleSize = lerp(this.eslo3TitleSize, ESLO_3_TITLE_SIZE_END, 0.1);
    }

    static forwards() {
        Eslo3Artifact1Slide.setSlide()
    }
    static backwards() {
        Eslo2Artifact2Slide.setSlide()
    }
}