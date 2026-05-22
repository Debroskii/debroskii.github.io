class Timer {
    constructor(onDone = () => {}, duration = 100, start = false) {
        this.duration = duration;
        this.startTime = millis();
        this.isStarted = start;
        this.onDone = onDone;
        Timing.timers.push(this)
    }

    isDone() {
        return !this.isStarted && millis() > this.startTime + this.duration
    }

    start() {
        this.isStarted = true;
        this.startTime = millis();
    }

    stop() {
        this.isStarted = false;
        this.onDone();
    }

    loop() {
        if(!this.isStarted) return;
        // console.log((this.startTime + this.duration) - millis())
        if(millis() > this.startTime + this.duration) this.stop();
    }
}

class Timing {
    static timers = [];

    static loop() {
        for(let timer of this.timers) {
            timer.loop()
        }
    }
}