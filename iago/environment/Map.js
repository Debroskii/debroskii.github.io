class LoadedMap {
    constructor(
        image,
        backgroundBuilder = () => {},
        foregroundBuilder = () => {}
    ) {
        this.image = image;
        this.backgroundBuilder = backgroundBuilder;
        this.foregroundBuilder = foregroundBuilder;
        this.spawnUnits = []
        
        this.chunks = [];
        this.grid = [];
        image.loadPixels();
        for (let y = 0; y < image.height; y++) {
            this.grid.push([]);
            for (let x = 0; x < image.width; x++) {
            
                let index = (x + y * image.width) * 4;
            
                let r = image.pixels[index + 0]; // Red
                let g = image.pixels[index + 1]; // Green
                let b = image.pixels[index + 2]; // Blue

                if (r == 255 && g == 35 && b == 35) this.spawnUnits.push({pos: createVector(x, y), name: "Red"});
                if (r == 93 && g == 0 && b == 255) this.spawnUnits.push({pos: createVector(x, y), name: "Purple"});
                if (r == 0 && g == 13 && b == 255) this.spawnUnits.push({pos: createVector(x, y), name: "Blue"});
                if (r == 245 && g == 255 && b == 0) this.spawnUnits.push({pos: createVector(x, y), name: "White"});
                if (r == 85 && g == 255 && b == 0) this.spawnUnits.push({pos: createVector(x, y), name: "Green"});
                if(r == 0 && g == 0 && b == 0) this.grid[y].push(1)
                if(r == 255 && g == 255 && b == 255) this.grid[y].push(0)
                if(r == 154 && g == 248 && b == 150) this.grid[y].push(-1)
                if(r == 51 && g == 125 && b == 219) this.grid[y].push(-2)
                if(r == 240 && g == 103 && b == 103) this.grid[y].push(-3)
                if(r == 101 && g == 234 && b == 255) this.grid[y].push(-4)
                if(r == 101 && g == 143 && b == 255) this.grid[y].push(-5)
                if(r == 253 && g == 101 && b == 255) this.grid[y].push(-6)
            }
        }
    }

    draw() {
        for(let y = 0; y < this.grid.length; y++) {
            for(let x = 0; x < this.grid[y].length; x++) {
                let pos = createVector(x, y);
                if(this.grid[y][x] == 1) this.backgroundBuilder(pos, createVector(windowWidth / this.image.width, windowHeight / this.image.height));
                else this.foregroundBuilder(pos, createVector(windowWidth / this.image.width, windowHeight / this.image.height));
            }
        }
    }

    getSpawn(name) {
        let spawnUnit = this.spawnUnits.find(s => s.name == name) || this.spawnUnits[0];
        return createVector(spawnUnit.pos.x * windowWidth / this.image.width, spawnUnit.pos.y * windowHeight / this.image.height);
    }

    getRandomSpawnInsideBounds() {
        let x = floor(random(this.grid[0].length));
        let y = floor(random(this.grid.length));
        while(this.grid[y][x]) {
            x = floor(random(this.grid[0].length));
            y = floor(random(this.grid.length));
        }
        return createVector(x * windowWidth / this.image.width, y * windowHeight / this.image.height);
    }

    isCollidingWithWall(entityPosition, radius) {
        let scaleX = this.image.width / windowWidth;
        let scaleY = this.image.height / windowHeight;
    
        let pos = createVector(
            entityPosition.x * scaleX,
            entityPosition.y * scaleY
        );
    
        let radiusX = radius * scaleX;
        let radiusY = radius * scaleY;
    
        let minX = floor(pos.x - radiusX);
        let maxX = ceil(pos.x + radiusX);
        let minY = floor(pos.y - radiusY);
        let maxY = ceil(pos.y + radiusY);
    
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
    
                if (!this.grid[y] || this.grid[y][x] != 1) continue;
    
                let closestX = constrain(pos.x, x, x + 1);
                let closestY = constrain(pos.y, y, y + 1);
    
                let dx = pos.x - closestX;
                let dy = pos.y - closestY;
    
                // Normalize by ellipse radii
                let normX = dx / radiusX;
                let normY = dy / radiusY;
    
                if (normX * normX + normY * normY < 1) {
                    return true;
                }
            }
        }
    
        return false;
    }

    getTileValue(position) {
        let scaleX = this.image.width / windowWidth;
        let scaleY = this.image.height / windowHeight;
    
        let pos = createVector(
            floor(position.x * scaleX),
            floor(position.y * scaleY)
        );
    
        if (!this.grid[pos.y] || this.grid[pos.y][pos.x] === undefined) return null;
        return this.grid[pos.y][pos.x];
    }

    makePositionNotCollide(entityPosition, radius) {
        let scaleX = this.image.width / windowWidth;
        let scaleY = this.image.height / windowHeight;
    
        let pos = createVector(
            entityPosition.x * scaleX,
            entityPosition.y * scaleY
        );
    
        let radiusX = radius * scaleX;
        let radiusY = radius * scaleY;
    
        let minX = floor(pos.x - radiusX);
        let maxX = ceil(pos.x + radiusX);
        let minY = floor(pos.y - radiusY);
        let maxY = ceil(pos.y + radiusY);
    
        let correction = createVector(0, 0);
    
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
    
                if (!this.grid[y] || this.grid[y][x] != 1) continue;
    
                let closestX = constrain(pos.x, x, x + 1);
                let closestY = constrain(pos.y, y, y + 1);
    
                let dx = pos.x - closestX;
                let dy = pos.y - closestY;
    
                let normX = dx / radiusX;
                let normY = dy / radiusY;
    
                let distSq = normX * normX + normY * normY;
    
                if (distSq < 1) {
                    let dist = sqrt(distSq) || 0.0001;
    
                    let overlap = 1 - dist;
    
                    // Push direction in ellipse space → convert back
                    let pushX = (normX / dist) * overlap * radiusX;
                    let pushY = (normY / dist) * overlap * radiusY;
    
                    correction.add(createVector(pushX, pushY));
                }
            }
        }
    
        pos.add(correction);
    
        return createVector(
            pos.x / scaleX,
            pos.y / scaleY
        );
    }
}