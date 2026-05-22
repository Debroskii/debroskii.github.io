//Fonts
let KodeMonoSemibold = null
let KodeMonoRegular = null
let KodeMonoBold = null
let CAMERA = null;
let CAMERA_EYE_TARGET = null;
let CAMERA_FOCUS_TARGET = null;
let GLOBAL_SLIDE_INFORMATION = {
    state: "DISPLAYING_SLIDE"
}
let FULLSCREEN_LOCKOUT_ENABLED = true;

let FOREGROUND_COLOR = null;
let BACKGROUND_COLOR = null;

let currentSlide = {
    loop: () => {},
    forwards: () => {},
    backwards: () => {}
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight, false)
    PIXELATE_SHADER = buildFilterShader(pixelateCallback)

    CAMERA = createCamera();
    CAMERA.perspective(2 * atan(height / 2 / 800), width / height, 0.1, 1500)
    setCamera(CAMERA)

    BLOOM_BUFFER = createFramebuffer();
    BLOOM_SHADER = buildFilterShader(bloomCallback)
}


async function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    PIXELATE_SHADER = buildFilterShader(pixelateCallback)

    KodeMonoSemibold = await loadFont("assets/KodeMono-SemiBold.ttf")
    KodeMonoRegular = await loadFont("assets/KodeMono-Regular.ttf")
    KodeMonoBold = await loadFont("assets/KodeMono-Bold.ttf")

    frameRate(60)

    Eslo1Artifact1Slide.loadPhotos()
    Eslo1Artifact2Slide.loadAndPrerenderModels()
    FuturePlansSlide.loadImages()
    Eslo2Artifact2Slide.loadAndPrerenderModels()
    Eslo2Artifact1Slide.loadPhotos()
    Eslo3Artifact1Slide.loadPhotos()
    Eslo3Artifact2Slide.loadVideo()

    CAMERA = createCamera();
    CAMERA.perspective(2 * atan(height / 2 / 800), width / height, 0.1, 1500)
    setCamera(CAMERA)

    BLOOM_BUFFER = createFramebuffer();
    BLOOM_SHADER = buildFilterShader(bloomCallback)

    TitleSlide.setSlide()
    FOREGROUND_COLOR = color(0, 255, 25)
    BACKGROUND_COLOR = color(0)
    // Eslo3Artifact2Slide.setSlide()
}

function draw() {
    if(CAMERA_EYE_TARGET) {
        let newEyeX = lerp(CAMERA.eyeX, CAMERA_EYE_TARGET.x, 0.1);
        let newEyeY = lerp(CAMERA.eyeY, CAMERA_EYE_TARGET.y, 0.1);
        let newEyeZ = lerp(CAMERA.eyeZ, CAMERA_EYE_TARGET.z, 0.1);
        CAMERA.setPosition(newEyeX, newEyeY, newEyeZ)
    }
    if(CAMERA_FOCUS_TARGET) {
        let newFocusX = lerp(CAMERA.centerX, CAMERA_FOCUS_TARGET.x, 0.1);
        let newFocusY = lerp(CAMERA.centerY, CAMERA_FOCUS_TARGET.y, 0.1);
        let newFocusZ = lerp(CAMERA.centerZ, CAMERA_FOCUS_TARGET.z, 0.1);
        CAMERA.lookAt(newFocusX, newFocusY, newFocusZ)
    }
    Timing.loop()
    if(!document.fullscreenElement && FULLSCREEN_LOCKOUT_ENABLED) {
        background(0, 255, 0)
        fill(0)
        textFont(KodeMonoBold)
        textAlign(CENTER, CENTER)
        textSize(50)
        text("CLICK TO ENTER FULLSCREEN", 0, 0)
        return;
    }
    BLOOM_BUFFER.begin()
    background(BACKGROUND_COLOR)
    currentSlide.loop()
    BLOOM_BUFFER.end()

    imageMode(CENTER)
    image(BLOOM_BUFFER, 0, 0)

    filter(BLUR, 20)
    filter(BLOOM_SHADER)
    scanLines(300)
    filter(PIXELATE_SHADER)
}

function mousePressed() {
    if(!document.fullscreenElement && FULLSCREEN_LOCKOUT_ENABLED) {
        openFullscreen()
    }
}

function keyPressed() {
    if(keyCode == 37 || keyCode == 33) currentSlide.backwards();
    if(keyCode == 39 || keyCode == 34) currentSlide.forwards();
}

function openFullscreen() {
    const elem = document.documentElement; // Selects the entire page
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    }
}