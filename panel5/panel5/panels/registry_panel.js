/**
 * A class that represents a panel that is bound and displays a registry.
 * @extends Panel
 */
class RegistryPanel extends Panel {
    /**
     * Creates a new RegistryPanel.
     * @param {*} registry the registry to be bound to the panel
     * @param {*} position the position of the panel
     * @param {*} dimensions the dimensions of the panel
     * @param {*} title the title of the panel
     */
    constructor(registry, position, dimensions, title = registry.id) {
        super(registry.id, position, dimensions, title)
        
        this.element.child(createDiv("").addClass("RegistryPanelContent"))

        GlobalRegistry.getRegistry(this.id).entries.forEach(entry => {
            if(entry.add_divider_before) {
                document.getElementById(this.id).children[1].appendChild(createDivider(entry.divider_title).elt)
            }
            document.getElementById(this.id).children[1].appendChild(createRegistryEntryDisplay(this.id, entry).elt)
        })
    }

    /**
     * Updates the panel and syncronizes the registry with the DOM.
     */
    update() {
        GlobalRegistry.getRegistry(this.id).syncronizeWithDOM()
        super.update()
    }
}