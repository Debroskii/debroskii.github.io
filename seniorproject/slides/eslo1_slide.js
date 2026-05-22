const ESLO_1_TITLE_POSITION_END = {x: 0, y: -150}
const ESLO_1_TITLE_POSITION_START = {x: 0, y: 0}
const ESLO_1_TITLE_SIZE_END = 75
const ESLO_1_TITLE_SIZE_START = 150

class Eslo1Slide {
    static shouldLoop = true;
    static waiting = true;
    static eslo1TitlePosition = {x: ESLO_1_TITLE_POSITION_START.x, y: ESLO_1_TITLE_POSITION_START.y};
    static eslo1TitleSize = 150;
    static eslo1TitleWaiting = true;
    static eslo1DescriptionWaiting = true;

    static setSlide() {
        this.waiting = true;
        this.eslo1TitleWaiting = true;
        this.eslo1DescriptionWaiting = true;
        setTimeout(() => this.waiting = false, 500)
        setTimeout(() => this.eslo1TitleWaiting = false, 2000)
        setTimeout(() => this.eslo1DescriptionWaiting = false, 3000)
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
        textSize(this.eslo1TitleSize)
        text("FIRST ESLO", this.eslo1TitlePosition.x, this.eslo1TitlePosition.y)

        //Description
        if(!this.eslo1DescriptionWaiting) {
            textFont(KodeMonoRegular)
            textSize(50)
            text("A self-directed and lifelong learner who can apply knowledge to create new ideas.", -500, 50, 1000)
        }
        this.animLoop()
    }

    static animLoop() {
        if(this.eslo1TitleWaiting) return;
        this.eslo1TitlePosition.x = lerp(this.eslo1TitlePosition.x, ESLO_1_TITLE_POSITION_END.x, 0.1);
        this.eslo1TitlePosition.y = lerp(this.eslo1TitlePosition.y, ESLO_1_TITLE_POSITION_END.y, 0.1);
        this.eslo1TitleSize = lerp(this.eslo1TitleSize, ESLO_1_TITLE_SIZE_END, 0.1);
    }

    static forwards() {
        Eslo1Artifact1Slide.setSlide()
    }
    static backwards() {
        TitleSlide.setSlide();
    }
}