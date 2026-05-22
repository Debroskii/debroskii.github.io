const ESLO_2_TITLE_POSITION_END = {x: 0, y: -150}
const ESLO_2_TITLE_POSITION_START = {x: 0, y: 0}
const ESLO_2_TITLE_SIZE_END = 75
const ESLO_2_TITLE_SIZE_START = 150

class Eslo2Slide {
    static shouldLoop = true;
    static waiting = true;
    static eslo2TitlePosition = {x: ESLO_2_TITLE_POSITION_START.x, y: ESLO_2_TITLE_POSITION_START.y};
    static eslo2TitleSize = 150;
    static eslo2TitleWaiting = true;
    static eslo2DescriptionWaiting = true;

    static setSlide() {
        this.waiting = true;
        this.eslo2TitleWaiting = true;
        this.eslo2DescriptionWaiting = true;
        setTimeout(() => this.waiting = false, 500)
        setTimeout(() => this.eslo2TitleWaiting = false, 2000)
        setTimeout(() => this.eslo2DescriptionWaiting = false, 3000)
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
        textSize(this.eslo2TitleSize)
        text("SECOND ESLO", this.eslo2TitlePosition.x, this.eslo2TitlePosition.y)

        //Description
        if(!this.eslo2DescriptionWaiting) {
            textFont(KodeMonoRegular)
            textSize(50)
            text("A productive, hard-working, collaborative person who can contribute positively to the community and the world.", -500, 50, 1000)
        }
        this.animLoop()
    }

    static animLoop() {
        if(this.eslo2TitleWaiting) return;
        this.eslo2TitlePosition.x = lerp(this.eslo2TitlePosition.x, ESLO_2_TITLE_POSITION_END.x, 0.1);
        this.eslo2TitlePosition.y = lerp(this.eslo2TitlePosition.y, ESLO_2_TITLE_POSITION_END.y, 0.1);
        this.eslo2TitleSize = lerp(this.eslo2TitleSize, ESLO_2_TITLE_SIZE_END, 0.1);
    }

    static forwards() {
        Eslo2Artifact1Slide.setSlide()
    }
    static backwards() {
        Eslo1Artifact2Slide.setSlide()
    }
}