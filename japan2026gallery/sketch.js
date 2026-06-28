let photos = [];
let photoCount = 35;

function setup() {
    for(let i = 0; i < photoCount; i++) {
        photos.push(`images/${i}.jpeg`)
    }
    select("#banner").style("background", `url(${random(photos)}) center/cover`);
    while(photos.length > 5) {
        createAndPolulateRandomRow();
    }
    createAndPolulateRandomRow(photos.length);
}

function createAndPolulateRandomRow(count = null) {
    let row = createDiv("").addClass("r");
    let photoCount = count ? count : floor(random(3, 6));
    for(let i = 0; i < photoCount; i++) {
        let ph = random(photos)
        let img = createImg(ph).addClass("ph");
        img.elt.onload = () => {
            const ratio = img.elt.naturalWidth / img.elt.naturalHeight;
            img.style("flex", `${ratio} 1 0`);
        };
        img.elt.addEventListener("click", () => {
            const downloadLink = document.createElement('a');
            downloadLink.href = ph;
            
            // Define the default filename for the download prompt
            downloadLink.download = ph;
            
            // Append, trigger click, and cleanup the DOM
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            // Free up resource memory
            URL.revokeObjectURL(ph);
        });
        row.child(img);
        
        photos.splice(photos.indexOf(ph), 1);
    }
}