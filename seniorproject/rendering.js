let PIXELATE_SHADER;
let BLOOM_SHADER;
let BLOOM_BUFFER;

function pixelateCallback() {
    const pixelCountX = 1000;
    filterColor.begin();
    const aspectRatio = filterColor.canvasSize.x /
                        filterColor.canvasSize.y;
    const pixelSize = [pixelCountX, pixelCountX / aspectRatio];
    const coord = filterColor.texCoord;
    const modifiedCoord = floor(coord * pixelSize) / 
                            pixelSize;
    const col = getTexture(filterColor.canvasContent,
                            modifiedCoord);
    filterColor.set(col);
    filterColor.end();
}

function bloomCallback() {
    // Receive the original image for use
    // in our shader.
    const preBlur = uniformTexture(BLOOM_BUFFER);
  
    filterColor.begin();
    const blurred = getTexture(filterColor.canvasContent,
                               filterColor.texCoord);
    const original = getTexture(preBlur, 
                                filterColor.texCoord);
    
    const intensity = max(original, 0.2) * 4;
      
    const bloom = original + blurred * intensity;
    filterColor.set([bloom.rgb, 1]);
    filterColor.end();
  }

function scanLines(count) {
    for(let i = 0; i < count; i++) {
        let h = height/count;
        let y = (i * h + (frameCount * 3)) % height;
        fill(0, i % 2 == 0 ? 0 : 0.1);
        rect(-width/2, y - height/2, width, h)
    }
}

function renderPhotoWindow(w, h, title = "", img = null) {
    noStroke()
    rectMode(CENTER)
    fill(FOREGROUND_COLOR)
    rect(0, 0, w + 15, h + 15)
    rect(0, -h/2 - 15, w + 15, 30)
    fill(BACKGROUND_COLOR)
    rect(0, 0, w, h)
    textFont(KodeMonoBold)
    textSize(30)
    textAlign(LEFT, CENTER)
    text(title, -w/2, -h/2 - 15)
    if(img) {
        imageMode(CENTER)
        image(img, 0, 0, w, h)
        fill(0, 105)
        rect(0, 0, w, h)
    }
    stroke(BACKGROUND_COLOR)
    strokeWeight(3)
    push()
    translate(0, -3)
    line(w/2, -h/2 - 20, w/2 - 15, -h/2 - 5)
    line(w/2 - 15, -h/2 - 20, w/2, -h/2 - 5)
    pop()
}