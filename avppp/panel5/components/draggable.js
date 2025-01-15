/**
 * A class representing a draggable element.
 */
class Draggable {
    /**
     * Creates a new Draggable object.
     * @param {*} position the position of the draggable element
     * @param {*} size the size of the draggable element
     */
    constructor(position, size, snap_to_grid = true) {
        this.position = position
        this.size = size
        
        this.dragging = false
        this.locked = false
        this.offset = createVector(0, 0)
        this.snap_to_grid = snap_to_grid
    }

    /**
     * Updates the position of the draggable element.
     * @param {*} additional_height the additional height to consider when dragging
     */
    update(additional_height = 0) {
        if(this.dragging && !this.locked) {
            if(this.withinX()) {
                if(this.snap_to_grid) this.position.x -= (this.position.x - ceil((mouseX + this.offset.x) / 20) * 20) * 0.9
                else this.position.x = mouseX + this.offset.x
            }
            if(this.withinY(additional_height)) {
                if(this.snap_to_grid) this.position.y -= (this.position.y - ceil((mouseY + this.offset.y) / 20) * 20) * 0.9
                else this.position.y = mouseY + this.offset.y
            }
        }
    }

    /**
     * Handles the mouse pressed event.
     */
    pressed() {
        if(this.draggable()) {
            this.dragging = true
            this.offset.set(this.position.x - mouseX, this.position.y - mouseY)
        }
    }

    /**
     * Handles the mouse released event.
     */
    released() {
        this.dragging = false
    }

    /**
     * Checks if the mouse is within the draggable element.
     * @returns true if the draggable element is able to be dragged
     */
    draggable() {
        return (mouseX > this.position.x && mouseX < this.position.x + this.size.x && mouseY > this.position.y && mouseY < this.position.y + this.size.y)
    }

    /**
     * Checks if the draggable element is within the x bounds of the window.
     * @returns true if the draggable element is within the x bounds of the window
     */
    withinX() {
        return (mouseX + this.offset.x < windowWidth - this.size.x && mouseX + this.offset.x > 0)
    }

    /**
     * Checks if the draggable element is within the y bounds of the window.
     * @param {*} additional_height the additional height to consider when dragging
     * @returns true if the draggable element is within the y bounds of the window
     */
    withinY(additional_height = 0) {
        return (mouseY + this.offset.y < windowHeight - this.size.y - additional_height && mouseY + this.offset.y > 0)
    }
}