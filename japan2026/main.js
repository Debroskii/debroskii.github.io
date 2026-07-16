let isLoading = true;
let imageCount = Object.keys(Registry.registryObj).length
let ownerCounts = getAmountForOwners();
let remainingImageCount = imageCount;
let loadedImageCount = 0;
let offscreenBufferContainer;
let loadingScreen;
let framesSinceStart = 0;
let banner;
let featuredShooter;
let galleryContainer;
let imageRatios = {};
let alreadyLoaded = [];
let framesSinceExitedHighRes = 0;
let hasFinishedLoadingAll = false;
let filteredOwner = null;

function setup() {
    frameRate(60);
    console.log(imageCount)

    loadingScreen = createDiv().id("loading-screen").hide();
    loadingScreen.child(createDiv().id("loading-pinwheel"));
    loadingScreen.child(createP("Loading").id("loading-text"))

    offscreenBufferContainer = createDiv().id("offscreen-buffer-container");
    for(let key of Object.keys(Registry.registryObj)) {
        let path = `data/thumbnails/${key}`;
        let img = createImg(path, key);
        offscreenBufferContainer.child(img);
        img.elt.addEventListener("load", () => {
            imageRatios[key] = img.elt.naturalWidth / img.elt.naturalHeight;
            loadedImageCount++;
            if(loadedImageCount === imageCount) {
                console.log(loadedImageCount)
                offscreenBufferContainer.remove();
            }
        })
    }

    banner = createDiv().id("banner");
    banner.style("background-image", `url(data/${selectRandomImageWithOwner("Elijah")})`);
    featuredShooter = createP("Captured By: Elijah").id("featured-shooter");
    banner.child(featuredShooter);
    let filterContainer = createDiv().id("filter-container");
    for(let owner of Object.keys(ownerCounts)) {
        let button = createButton(owner).class("filter-button");
        button.mousePressed(() => {
            setOwnerFilter(owner);
            button.addClass("selected")
            if(filteredOwner == null) select(".selected")?.removeClass("selected");
        });
        filterContainer.child(button);
    }   
}

function draw() {
    framesSinceStart++;
    framesSinceExitedHighRes++;
    if(loadedImageCount === imageCount && framesSinceStart > 120) {
        isLoading = false;
        if(galleryContainer == null) galleryContainer = createDiv().id("gallery-container");
        generateAndPopulateRandomRowRecursive();
    }
    if(isLoading) {
        loadingScreen.show();
        loadingScreen.style("display", "flex");
    } else {
        loadingScreen.hide();
    }
    if(frameCount % 300 == 0) {
        let randomOwner = random(Object.values(Registry.registryObj).map(obj => obj.owner));
        banner.style("background-image", `url(data/${selectRandomImageWithOwner(randomOwner)})`);
        featuredShooter.html(`Captured By: ${randomOwner}`);
    }
}

function setOwnerFilter(owner = null) {
    if(filteredOwner === owner) {
        setOwnerFilter(null);
        return;
    }
    filteredOwner = owner;
    select(".selected")?.removeClass("selected");
    galleryContainer.remove();
    galleryContainer = createDiv().id("gallery-container");
    alreadyLoaded = [];
    remainingImageCount = ownerCounts[owner] || imageCount;
    hasFinishedLoadingAll = false;
    generateAndPopulateRandomRowRecursive(owner);
}

function getAmountForOwners() {
    let ownerCounts = {};
    for (let key of Object.keys(Registry.registryObj)) {
        let owner = Registry.registryObj[key].owner;
        if (ownerCounts[owner]) {
            ownerCounts[owner]++;
        } else {
            ownerCounts[owner] = 1;
        }
    }
    return ownerCounts;
}

function generateAndPopulateRandomRowRecursive(owner = null) {
    if(hasFinishedLoadingAll) return;
    let row = createDiv().class("gallery-row");
    let imagesInRow = innerWidth > 768 ? random(2, 5) : random(1, 3);
    if(remainingImageCount < imagesInRow) {
        imagesInRow = remainingImageCount;
    }
    for(let i = 0; i < imagesInRow; i++) {
        let randomImageKey = getRandomNotLoaded(owner);
        let imageData = Registry.registryObj[randomImageKey];
        let imagePath = `data/thumbnails/${randomImageKey}`;
        let imageElement = createImg(imagePath, randomImageKey).class("gallery-image");
        imageElement.mouseClicked(() => {
            if(framesSinceExitedHighRes > 10) showHighResImageDisplay(randomImageKey);
        });
        const ratio = imageRatios[randomImageKey];
        imageElement.style("flex", `${ratio} 1 0`);
        row.child(imageElement);
        remainingImageCount--;
        if(remainingImageCount <= 0) hasFinishedLoadingAll = true;
    }
    galleryContainer.child(row);
    if(!hasFinishedLoadingAll) generateAndPopulateRandomRowRecursive(owner)
}

function showHighResImageDisplay(imageKey) {
    let imageData = Registry.registryObj[imageKey];
    let imagePath = `data/${imageKey}`;
    let highResImageElement = createImg(imagePath, imageKey).id("high-res-image");
    highResImageElement.elt.addEventListener("load", () => {
        if(highResImageElement.elt.naturalWidth > highResImageElement.elt.naturalHeight) {
            highResImageElement.style("width", innerWidth > 786 ? "60%" : "90%");
            highResImageElement.style("height", "auto");
        } else {
            highResImageElement.style("width", "auto");
            highResImageElement.style("height", innerWidth > 786 ? "80%" : "70%");
        }
        infobar.style("width", highResImageElement.style("width"))
    })
    setupImageRetry(highResImageElement.elt)
    let infobar = createDiv().id("high-res-infobar");
    let infoBlock = createDiv().id("high-res-info-block");
    let ownerInfo = createP(`Captured By: ${imageData.owner}`).id("high-res-owner");
    let isIphone = imageData.cameraModel.includes("iPhone");
    let cameraInfoText = `${imageData.cameraModel}${isIphone ? "" : `: ${imageData.lensModel}`}`;
    let cameraInfo = createP(cameraInfoText).id("high-res-camera");
    infoBlock.child(ownerInfo);
    infoBlock.child(cameraInfo);
    let highResImageContainer = createDiv().id("high-res-image-container");
    highResImageContainer.child(highResImageElement);
    let closeButton = createButton(`<span class="material-symbols-outlined">close</span>`).id("close-button");
    closeButton.mousePressed(() => {
        highResImageContainer.remove();
        galleryContainer.style("pointer-events", "all");
        framesSinceExitedHighRes = 0;
        closeButton.remove();
    });
    let saveButton = createButton(`<span class="material-symbols-outlined">download</span>`).id("save-button");
    saveButton.mousePressed(() => {
        downloadImage(imageKey);
    });
    infobar.child(infoBlock);
    infobar.child(saveButton);
    highResImageContainer.child(infobar);
    galleryContainer.style("pointer-events", "none");
    document.body.appendChild(highResImageContainer.elt);
}

function getRandomNotLoaded(owner) {
    let randomKey = selectRandomImageWithOwner(owner);
    while(alreadyLoaded.includes(randomKey)) {
        randomKey = selectRandomImageWithOwner(owner);
    }
    alreadyLoaded.push(randomKey);
    return randomKey;
}

function selectRandomImageWithOwner(owner) {
    let images = []
    for(let key of Object.keys(Registry.registryObj)) {
        if(Registry.registryObj[key].owner === owner || owner == null) {
            images.push(key);
        }
    }
    return random(images)
}

async function downloadImage(fileName) {
    const link = document.createElement('a');
    link.href = `data/${fileName}`;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    
    // Clean up the DOM and memory
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  }

  function setupImageRetry(imgElement, maxRetries = 3, delayMs = 500) {
    let attempts = 0;
    const originalSrc = imgElement.src.split('?')[0]; 

    imgElement.addEventListener('error', function handleImageError() {
        attempts++;
        
        if (attempts <= maxRetries) {
            console.log(`Load failed. Attempt ${attempts} of ${maxRetries}. Retrying in ${delayMs}ms...`);
            
            // Wait before trying again
            setTimeout(() => {
                // Force a fresh network request using a timestamp
                imgElement.src = `${originalSrc}?retry=${attempts}&t=${Date.now()}`;
            }, delayMs);
        } else {
            console.error(`Image failed to load after ${maxRetries} attempts. Swapping to fallback.`);
            imgElement.removeEventListener('error', handleImageError);
            imgElement.src = 'fallback-placeholder.png'; // Final fallback
        }
    });
}