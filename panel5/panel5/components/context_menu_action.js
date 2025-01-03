/**
 * A class representing an action in a context menu.
 */
class ContextMenuAction {
    /**
     * Create a new ContextMenuAction.
     * @param {*} name the name/label of the action
     * @param {*} action the action to perform when the action is clicked
     * @param {*} shortcut the shortcut key to trigger the action
     */
    constructor(name, action, shortcut = "") {
        this.name = name
        this.action = action
        this.shortcut = shortcut
    }

    /**
     * Get the HTML element representing the action.
     * @returns the HTML element representing the action
     */
    elt() {
        let button = createButton("").class("ContextMenuAction").html(`<span class="ContextMenuActionLabel">${this.name}</span><span class="ContextMenuActionShortcut">${this.shortcut}</span>`)
        button.mousePressed(this.action)
        return button.elt
    }
}