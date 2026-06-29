let photos = [];
let photoCopy = [];
let photoCount = 132;
let cursor = null;

let activeFilter = "";

function setup() {
    for(let i = 0; i < photoCount; i++) {
        photos.push(`images/${i}.jpeg`)
        photoCopy.push(`images/${i}.jpeg`)
    }
    select("#banner").style("background", `url('assets/banner.jpeg') center/cover`);
    genPhotos();
    cursor = createDiv("").id("custom-cursor")
}

function genPhotos(filter = null) {
    photos = photoCopy.slice();
    selectAll(".r").forEach(r => r.remove());
    while(photos.length > 5) {
        createAndPolulateRandomRow(filter);
    }
    createAndPolulateRandomRow(filter, photos.length);
}

function draw() {
    cursor.position(mouseX - 10, mouseY + window.scrollY - 10);
}

function toggleShotByEli() {
    if(activeFilter == "eli") {
        activeFilter = "";
        select("#sbEliBtn").removeClass("active");
    } else {
        activeFilter = "eli";
        selectAll("button").forEach(s => s.removeClass("active"))
        select("#sbEliBtn").addClass("active");
    }
    genPhotos(activeFilter == "eli" ? "eli" : null);
}

function toggleShotByJen() {
    if(activeFilter == "jen") {
        activeFilter = "";
        select("#sbJenBtn").removeClass("active");
    } else {
        activeFilter = "jen";
        selectAll("button").forEach(s => s.removeClass("active"))
        select("#sbJenBtn").addClass("active");
    }
    genPhotos(activeFilter == "jen" ? "jen" : null);
}

function toggleShotByCam() {
    if(activeFilter == "cam") {
        activeFilter = "";
        select("#sbCamBtn").removeClass("active");
    } else {
        activeFilter = "cam";
        selectAll("button").forEach(s => s.removeClass("active"))
        select("#sbCamBtn").addClass("active");
    }
    genPhotos(activeFilter == "cam" ? "cam" : null);
}

function createAndPolulateRandomRow(filter = null, count = null) {
    let row = createDiv("").addClass("r");
    let photoCount = count ? count : min(5, max(2, ceil(randomGaussian(3, 1))));
    for(let i = 0; i < photoCount; i++) {
        let ph = random(photos)
        let cameraModel = Registry.registryObj[ph.split("/").slice(-2).join("/")]["cameraModel"]
        let shotBy = "";

        if(cameraModel.includes("R50") || cameraModel.includes("iPhone 13")) {
            shotBy = "Shot By Eli"
        } else if(filter == "eli") {
            i--;
            photos.splice(photos.indexOf(ph), 1);
            continue;
        }

        if(cameraModel.includes("iPhone 17 Pro Max")) {
            shotBy = "Shot By Jen"
        } else if(filter == "jen") {
            i--;
            photos.splice(photos.indexOf(ph), 1);
            continue;
        }

        if(cameraModel.includes("iPhone 14")) {
            shotBy = "Shot By Cam"
        } else if(filter == "cam") {
            i--;
            photos.splice(photos.indexOf(ph), 1);
            continue;
        }

        let img = createImg(`${ph}_small.jpeg`).addClass("ph");
        img.elt.onload = () => {
            const ratio = img.elt.naturalWidth / img.elt.naturalHeight;
            img.style("flex", `${ratio} 1 0`);
            img.elt.addEventListener("click", () => {
                const embedWindow = createDiv().addClass("embed-window");
                if(innerWidth < innerHeight) {
                    //height: 90%;
                    //width: auto;
                    embedWindow.style("width", "90%");
                    embedWindow.style("height", "auto");
                }
                embedWindow.style("flex", `${ratio} 1 0`);
                const embedImg = createImg(ph).addClass("embed-img");
                embedWindow.child(embedImg);
                
                let info = createDiv().addClass("embed-info");
                info.child(createP(`${shotBy}`).addClass("img-info").style("color", "white").style("font-weight", "bold"))
                let lens = !Registry.registryObj[ph]["cameraModel"].includes("iPhone") ? `: ${Registry.registryObj[ph]["lensModel"]}` : ""
                info.child(createP(`${Registry.registryObj[ph]["cameraModel"]}${lens}`).addClass("img-info").style("font-size", "1rem"))
                embedWindow.child(info)

                select("#window-container").child(embedWindow)
                select("#window-container").style("display", "flex")
                select("#window-container").mousePressed(() => {
                    select("#window-container").style("display", "none")
                    select("#window-container").html("")
                })
            });
        };
        img.elt.addEventListener("mouseover", e => {
            cursor.style("transform", "scale(150%)");
        })
        img.elt.addEventListener("mouseout", e => {
            cursor.style("transform", "scale(100%)");
        })
        row.child(img);
        
        photos.splice(photos.indexOf(ph), 1);
    }
}

function keyPressed() {
    if(keyCode == 27) {
        select("#window-container").style("display", "none")
        select("#window-container").html("")
    }
}