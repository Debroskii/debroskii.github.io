const MILLIS_BETWEEN_WRITE = 50;
const MILLIS_BETWEEN_DELETE = 100;
const MILLIS_WAIT_TO_DELETE = 1500;
const MILLIS_WAIT_TO_WRITE = 2000;

class TitleSlide {
    static currentTextSelection = 2;
    static currentAnimationState = "WRITE";
    static animStates = ["Programming", "Robotics", "Mentoring", "Design", "Link Crew"]
    static currentAnimProgress = {
        lastCharIndex: -1,
        chars: ""
    }
    static timer;
    static shouldLoop = true;
    
    static setSlide() {
        setTimeout(() => {
            this.timer = new Timer(() => {
                this.currentAnimProgress.chars = this.currentAnimProgress.chars + this.animStates[this.currentTextSelection][this.currentAnimProgress.lastCharIndex + 1]
                if(this.currentAnimProgress.lastCharIndex > this.animStates[this.currentTextSelection].length - 3) { this.currentAnimationState = "HIGH_WAIT"; return; };
                this.currentAnimProgress.lastCharIndex++;
                this.timer.start()
            }, MILLIS_BETWEEN_WRITE, true)
        }, 500)

        currentSlide = this;
    }

    static loop() {
        if(!this.shouldLoop) return;
        background(BACKGROUND_COLOR)
        fill(FOREGROUND_COLOR)
        noStroke()
        textFont(KodeMonoBold)
        textAlign(CENTER, CENTER)
        textSize(150)
        text("Senior Project", 0, -25)
        textFont(KodeMonoRegular)
        textSize(50)
        text(this.currentAnimProgress.chars + (frameCount % 60 <= 30 ? "|" : " "), 0, 70)
        textSize(30)
        textAlign(RIGHT, BOTTOM)
        text("Elijah DeBusk", width/2 - 15, height/2 - 20)
        textAlign(LEFT, BOTTOM)
        text(new Date().toDateString(), -width/2 + 15, height/2 - 20)
        this.animLoop()
    }

    static animLoop() {
        if(!this.timer) return;
        if(this.currentAnimationState == "HIGH_WAIT" && this.timer.isDone()) {
            this.timer = new Timer(() => {
                this.currentAnimationState = "DELETE";
            }, MILLIS_WAIT_TO_DELETE, true)
        }
        if(this.currentAnimationState == "DELETE" && this.timer.isDone()) {
            this.timer = new Timer(() => {
                this.currentAnimProgress.chars = this.currentAnimProgress.chars.slice(0, -1)
                if(this.currentAnimProgress.chars.length == 0) { this.currentAnimationState = "LOW_WAIT"; return; }
                this.timer.start()
            }, MILLIS_BETWEEN_DELETE, true) 
        }
        if(this.currentAnimationState == "LOW_WAIT" && this.timer.isDone()) {
            this.timer = new Timer(() => {
                this.currentAnimationState = "WRITE";
                this.currentTextSelection++;
                if(this.currentTextSelection > this.animStates.length - 1) this.currentTextSelection = 0;
                this.currentAnimProgress.lastCharIndex = -1
            }, MILLIS_WAIT_TO_WRITE, true)
        }
        if(this.currentAnimationState == "WRITE" && this.timer.isDone()) {
            this.timer = new Timer(() => {
                this.currentAnimProgress.chars = this.currentAnimProgress.chars + this.animStates[this.currentTextSelection][this.currentAnimProgress.lastCharIndex + 1]
                if(this.currentAnimProgress.lastCharIndex > this.animStates[this.currentTextSelection].length - 3) { this.currentAnimationState = "HIGH_WAIT"; return; };
                this.currentAnimProgress.lastCharIndex++;
                this.timer.start()
            }, MILLIS_BETWEEN_WRITE, true)
        }
    }

    static forwards() {
        Eslo1Slide.setSlide();
    }
    static backwards() {}
}