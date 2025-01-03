/**
 * A class representing the custom context menu.
 */
class ContextMenu {
    /**
     * Create a new ContextMenu.
     */
    constructor() {
        this.is_open = false

        this.element = createDiv("").id("ContextMenu")
    }

    /**
     * Open the context menu at the mouse position.
     * @param {*} actions the actions to display in the context menu
     */
    open(actions = []) {      
        this.close()
          
        for(let action of actions) {
            this.element.child(action.elt())
        }

        document.getElementById("ContextMenu").appendChild(new ContextMenuAction("Arrange Panels", UI.autoAlignAllPanels, "Shift + A").elt())
        document.getElementById("ContextMenu").appendChild(new ContextMenuAction("Clear Panels", () => { UI.removeAllPanels() }, "Shift + C").elt())

        this.element.style("top", mouseY + "px").style("left", mouseX + "px")
        this.element.style("opacity", "100%")
        this.is_open = true
    }

    /**
     * Close the context menu.
     */
    close() {
        for(let action of document.getElementById("ContextMenu").children) {
            action.remove()
        }

        this.element.style("top", "-1000px").style("left", "-1000px")
        this.element.style("opacity", "0%")
        this.is_open = false
    }
}