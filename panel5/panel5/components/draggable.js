/**
 * A class representing a draggable element.
 */
class Draggable {
    /**
     * Creates a new Draggable object.
     * @param {*} position the position of the draggable element
     * @param {*} size the size of the draggable element
     */
    constructor(position, size) {
        this.position = position
        this.size = size
        
        this.dragging = false
        this.locked = false
        this.offset = createVector(0, 0)
    }

    /**
     * Updates the position of the draggable element.
     * @param {*} additional_height the additional height to consider when dragging
     */
    update(additional_height = 0) {
        if(this.dragging && !this.locked) {
            if(this.withinX()) {
                this.position.x -= (this.position.x - ceil((mouseX + this.offset.x) / UI.panel5Config.get("grid_unit_size").value) * UI.panel5Config.get("grid_unit_size").value) * 0.9
            }
            if(this.withinY(additional_height)) {
                this.position.y -= (this.position.y - ceil((mouseY + this.offset.y) / UI.panel5Config.get("grid_unit_size").value) * UI.panel5Config.get("grid_unit_size").value) * 0.9
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
    withinY(additional_height) {
        return (mouseY + this.offset.y < windowHeight - this.size.y - additional_height && mouseY + this.offset.y > 0)
    }
}