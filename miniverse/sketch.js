let FONT = null;
let CAMERA = null;
let REGIONS = [];
let SCALE = 25;
let SYSTEM_DIRECTORY = [];
let FOCUSED_SYSTEM = "";
let SMALL_SYSTEMS = [];
let MEDIUM_SYSTEMS = [];
let LARGE_SYSTEMS = [];
let TOTAL_SYSTEMS = 0;
let SHOW_REGIONS = false;
let TARGET_EYE_POSITION;
let TARGET_CENTER_POSITION;
let AUTOMOVE_CAMERA = false;
let OMIT_ORBIT = false;
let geo;
let cloud_geo;
let loading = true;
let loadProgress = 0;
let loadStep = 0;
let totalSteps = 0;
let font;

function preload() {
    font = loadFont("assets/Doto_Rounded-Medium.ttf");
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    textFont(font);
    CAMERA = createCamera();
    CAMERA.perspective(2 * atan(height / 2 / 800), width / height, 0.01, (windowWidth / windowHeight > 0.9 ? 10000 : 20000));
    TARGET_EYE_POSITION = createVector(0, 0, 0);
    TARGET_CENTER_POSITION = createVector(0, 0, 0);
    frameRate(120);
    totalSteps = (windowWidth / windowHeight > 0.9 ? 100 : 25) * SCALE;
}

function gen() {
    if(windowWidth / windowHeight > 0.9) {
        for(let i = 0; i < 100 * SCALE; i++) {
            let regionPosition = createVector(randomGaussian(0, 1000 + 50 * SCALE), randomGaussian(0, 1000 + 50 * SCALE), randomGaussian(0, 1000 + 50 * SCALE));
            let regionSize = createVector(random(100, 400), random(100, 400), random(100, 400));
            REGIONS.push(createRegion(regionPosition, regionSize));
            TOTAL_SYSTEMS += REGIONS[REGIONS.length - 1].systems.length;
        }
    } else {
        for(let i = 0; i < 25 * SCALE; i++) {
            let regionPosition = createVector(randomGaussian(0, 1000 + 10 * SCALE), randomGaussian(0, 1000 + 10 * SCALE), randomGaussian(0, 1000 + 10 * SCALE));
            let regionSize = createVector(random(100, 400), random(100, 400), random(100, 400));
            REGIONS.push(createRegion(regionPosition, regionSize));
            TOTAL_SYSTEMS += REGIONS[REGIONS.length - 1].systems.length;
        }
    }
}

function draw() {
    if (loading) {
        drawLoadingScreen();
        runGenerationStep();
        return;
    }

    background(0);
    if (!OMIT_ORBIT) orbitControl();
    moveCameraToTarget();

    noStroke();

    for (let region of REGIONS) {
        for (let system of region.systems) {
            displayPlanets(system);
        }
    }

    model(geo);
    model(cloud_geo);
}

function displayPlanets(system) {
    let eyeDistance = dist(CAMERA.eyeX, CAMERA.eyeY, CAMERA.eyeZ, system.position.x, system.position.y, system.position.z);
    if(eyeDistance > 1500) return;
    push();
    translate(system.position.x, system.position.y, system.position.z);
    fill(255)
    noStroke();
    rotateX(system.rotation.x);
    rotateY(system.rotation.y);
    rotateZ(system.rotation.z);
    for(let planet of system.planets) {
        push();
        rotateY(planet.orbitPosition + frameCount * planet.orbitSpeed);
        translate(planet.orbitDistance, 0, 0);
        fill(planet.color);
        noStroke();
        sphere(planet.size, 4, 4);
        pop();
    }
    if(FOCUSED_SYSTEM === system.name) {
        rotateX(PI/2)
        noFill();
        stroke(255, 155);
        strokeWeight(0.1);
        for(let planet of system.planets) {
            circle(0, 0, planet.orbitDistance * 2);
        }
    }
    pop();
}

function displayRegion(region) {
    //Standard draw
    push();
    translate(region.position.x, region.position.y, region.position.z);
    noFill();
    if(SHOW_REGIONS) {
        stroke(100, 100, 255);
        box(region.size.x, region.size.y, region.size.z);
    }
    pop();
    for(let system of region.systems) {
        displaySystem(system);
    }
}

function displaySystem(system) {
    push();
    translate(system.position.x, system.position.y, system.position.z);
    fill(255)
    noStroke();
    sphere(system.starSize, 4, 4);
    pop();
}

function displayCloud(region) {
    colorMode(HSB)
    for(let cloud of region.clouds) {
        push();
        translate(cloud.position.x, cloud.position.y, cloud.position.z);
        fill(cloud.color);
        noStroke();
        ellipsoid(cloud.size.x, cloud.size.y, cloud.size.z, 4, 4);
        pop();
    }
    colorMode(RGB)
}

function createRegion(position, size) {
    let reg = new Region(position, size);
    for(let i = 0; i < ceil(random(2, 5)); i++) {
        reg.systems.push(createSystem(reg));
    }
    colorMode(HSB)
    for(let i = 0; i < ceil(random(2, 5)); i++) {
        reg.clouds.push({
            position: createVector(
                reg.position.x - (reg.size.x / 2) + random(0, reg.size.x),
                reg.position.y - (reg.size.y / 2) + random(0, reg.size.y),
                reg.position.z - (reg.size.z / 2) + random(0, reg.size.z)
            ),
            size: createVector(random(100, 500), random(100, 500), random(100, 500)),
            color: color(
                noise(reg.position.x * 1e-4, reg.position.y * 1e-4, reg.position.z * 1e-4) * 600 % 360,
                100,
                100,
                0.015
            )
        })
    }
    colorMode(RGB)
    return reg;
}

function runGenerationStep() {
    const batchSize = 1; // tweak this

    for (let i = 0; i < batchSize; i++) {
        if (loadStep >= totalSteps) {
            finishLoading();
            return;
        }

        generateOneUnit(); // <- we define this
        loadStep++;
    }

    loadProgress = loadStep / totalSteps;
}

function generateOneUnit() {
    let regionPosition = createVector(
        randomGaussian(0, 1000 + 50 * SCALE),
        randomGaussian(0, 1000 + 50 * SCALE),
        randomGaussian(0, 1000 + 50 * SCALE)
    );

    let regionSize = createVector(
        random(100, 400),
        random(100, 400),
        random(100, 400)
    );

    let region = createRegion(regionPosition, regionSize);
    REGIONS.push(region);

    TOTAL_SYSTEMS += region.systems.length;
}

function drawLoadingScreen() {
    background(0);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(loadProgress >= 0.99 ? "Baking Static Geometry..." : "Generating...", 0, loadProgress >= 0.99 ? 0 : -30);

    // bar
    if(loadProgress >= 0.99) return;
    let w = 400;
    let h = 10;

    noStroke();
    fill(50);
    rect(-w / 2, 0, w, h);

    fill(255, 255, 255);
    rect(- w / 2, 0, w * loadProgress, h);
}

function finishLoading() {
    loading = false;

    geo = buildGeometry(() => {
        for (let region of REGIONS) {
            displayRegion(region);
        }
    });

    cloud_geo = buildGeometry(() => {
        for (let region of REGIONS) {
            displayCloud(region);
        }
    });

    initUI();
    SIDEBAR.elt.addEventListener("mouseover", () => {
        OMIT_ORBIT = true;
    })
    SIDEBAR.elt.addEventListener("mouseout", () => {
        OMIT_ORBIT = false;
    })

    console.log("Total systems: " + TOTAL_SYSTEMS)
    console.log("Small systems: " + SMALL_SYSTEMS.length);
    console.log("Medium systems: " + MEDIUM_SYSTEMS.length);
    console.log("Large systems: " + LARGE_SYSTEMS.length);
}

function createSystem(region) { 
    let sys = new System(createVector(
        region.position.x - (region.size.x / 2) + random(0, region.size.x),
        region.position.y - (region.size.y / 2) + random(0, region.size.y),
        region.position.z - (region.size.z / 2) + random(0, region.size.z)
    ), random(50, 150) * sqrt(region.size.x ** 2 + region.size.y ** 2 + region.size.z ** 2) / 500);
    for(let i = 0; i < round(sys.size / 60); i++) {
        sys.planets.push(new Planet(random(sys.size * 0.005, sys.size * 0.01), color(random(100, 255), random(100, 255), random(100, 255)), random(sys.size / 4, sys.size)));
    }
    if(sys.planets.length <= 1) SMALL_SYSTEMS.push(sys.name);
    if(sys.planets.length > 1 && sys.planets.length <= 2) MEDIUM_SYSTEMS.push(sys.name);
    if(sys.planets.length > 2) LARGE_SYSTEMS.push(sys.name);
    return sys;
}

function Region(position, size) {
    return {
        position: position,
        size: size,
        systems: [],
        clouds: []
    };
}

function System(position, size) {
    let name = generateName();
    SYSTEM_DIRECTORY.push({name: name, position: position});
    return {
        position: position,
        rotation: createVector(random(TAU), random(TAU), random(TAU)),
        size: size,
        starSize: size * 0.02,
        name: name,
        planets: []
    };
}

function Planet(size, color, orbitDistance) {
    return {
        size: size,
        color: color,
        orbitDistance: orbitDistance,
        orbitPosition: random(TAU),
        orbitSpeed: random(0.0002, 0.001)
    };
}

function insideWhichRegion() {
    for(let region of REGIONS) {
        if(
            CAMERA.eyeX > region.position.x - (region.size.x / 2) &&
            CAMERA.eyeX < region.position.x + (region.size.x / 2) &&
            CAMERA.eyeY > region.position.y - (region.size.y / 2) &&
            CAMERA.eyeY < region.position.y + (region.size.y / 2) &&
            CAMERA.eyeZ > region.position.z - (region.size.z / 2) &&
            CAMERA.eyeZ < region.position.z + (region.size.z / 2)
        ) {
            return region;
        }
    }
    return null;
}

function findSuitableRegionPosition(scale = 500) {
    let pos = createVector(
        round(random(-scale, scale)),
        round(random(-scale, scale)),
        round(random(random(-scale, scale)))
    );
    for(let region of REGIONS) {
        if(
            pos.x > region.position.x - (region.size.x / 2) - scale &&
            pos.x < region.position.x + (region.size.x / 2) + scale &&
            pos.y > region.position.y - (region.size.y / 2) - scale &&
            pos.y < region.position.y + (region.size.y / 2) + scale &&
            pos.z > region.position.z - (region.size.z / 2) - scale &&
            pos.z < region.position.z + (region.size.z / 2) + scale
        ) {
            return findSuitableRegionPosition();
        }
    }
    return pos;
}

const NAMEPREFIXES = ['Zor', 'Xan', 'Prox', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Tau', 'Sigma', 'Omicron', 'Kappa', 'Lambda', 'Theta', 'Iota', 'Nu', 'Mu', 'Rho', 'Pi', 'Chi', 'Upsilon', 'Vega', 'Siri', 'Altair', 'Deneb', 'Rigel', 'Betelgeuse', 'Aldebaran', 'Capella', 'Arcturus', 'Spica', 'Antares', 'Fomalhaut', 'Pollux', 'Castor', 'Vulcan', 'Krypton', 'Erebus', 'Nyx', 'Orion', 'Draco', 'Phoenix', 'Hydra', 'Pegasus', 'Andromeda', 'Cassiopeia', 'Perseus', 'Cepheus', 'Lyra', 'Cygnus', 'Taurus', 'Scorpius', 'Libra', 'Aquarius', 'Pisces', 'Cancer', 'Leo', 'Virgo', 'Sagittarius', 'Capricorn', 'Aries', 'Gemini', 'Ophiuchus', 'Corona', 'Crux', 'Centauri', 'Proxima', 'Barnard', 'Wolf', 'Luyten', 'Ross', 'Groombridge', 'Lalande', 'Gliese', 'Hipparcos', 'Kepler', 'Hubble', 'Newton', 'Einstein', 'Curie', 'Feynman', 'Hawking', 'Sagan', 'Tycho', 'Galileo', 'Copernicus', 'Keplerian', 'Ptolemy', 'Halley', 'Caldwell', 'Messier', 'Hercules', 'Orpheus', 'Theseus', 'Achilles', 'Hector', 'Persephone', 'Athena', 'Zeus', 'Hades', 'Poseidon', 'Ares', 'Hermes', 'Apollo', 'Dionysus', 'Artemis', 'Demeter', 'Hephaestus', 'Janus', 'Nemesis', 'Nike', 'Eros', 'Gaia', 'Uranus', 'Cronus', 'Rhea', 'Hyperion'];
const NAMESUFFIXES = ['on', 'ar', 'us', 'is', 'ea', 'ion', 'os', 'ax', 'ex', 'ix', 'or', 'um', 'en', 'an', 'in', 'es', 'as', 'ys', 'ea', 'ia', 'ea', 'oa', 'ua', 'ae', 'oe', 'ue', 'yus', 'ius', 'eus', 'ous', 'ius', 'eon', 'ion', 'eron', 'aron', 'uron', 'ylon', 'ylon', 'athon', 'ethon', 'ithon', 'othon', 'uthon', 'athon', 'ethon', 'ithon', 'othon', 'uthon', 'nova', "gerbil"];
const NAMEALPHANUMERICALADDITION = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
function generateName() {
    let name = random(NAMEPREFIXES) + random(NAMESUFFIXES) + (floor(random(0, 100)) > 50 ? '-' + floor(random(1, 1000)) + (random(0, 100) > 50 ? random(NAMEALPHANUMERICALADDITION) : "") : '');
    if(name.includes("sex")) return generateName();
    return name;
}

function mouseDragged() {
    if(AUTOMOVE_CAMERA) AUTOMOVE_CAMERA = false;
}

function keyPressed() {
    if(keyCode === 72) {
        if(CONTEXT == UIContext.DESKTOP) {
            if(SIDEBAR_STATE == 1) {
                closeSidebarDesktop();
                SIDEBAR_STATE = 0;
                return;
            }
            openSidebarDesktop();
            SIDEBAR_STATE = 1;
            return;
        }
    } else if (keyCode === 83) {
        SHOW_REGIONS = !SHOW_REGIONS;
    }
}

function moveCameraToTarget() {
    if(AUTOMOVE_CAMERA == false) return;
    let eye = createVector(CAMERA.eyeX, CAMERA.eyeY, CAMERA.eyeZ);
    let center = createVector(CAMERA.centerX, CAMERA.centerY, CAMERA.centerZ);
    let targetDistEye = dist(eye.x, eye.y, eye.z, TARGET_EYE_POSITION.x, TARGET_EYE_POSITION.y, TARGET_EYE_POSITION.z);
    let targetDistCenter = dist(center.x, center.y, center.z, TARGET_CENTER_POSITION.x, TARGET_CENTER_POSITION.y, TARGET_CENTER_POSITION.z);
    if((eye == TARGET_EYE_POSITION && center == TARGET_CENTER_POSITION) || (targetDistEye < 5 && targetDistCenter < 5)) { AUTOMOVE_CAMERA = false; return; };
    let newEye = p5.Vector.lerp(eye, TARGET_EYE_POSITION, 0.05);
    let newCenter = p5.Vector.lerp(center, TARGET_CENTER_POSITION, 0.05);
    CAMERA.setPosition(newEye.x, newEye.y, newEye.z);
    CAMERA.lookAt(newCenter.x, newCenter.y, newCenter.z);
}
