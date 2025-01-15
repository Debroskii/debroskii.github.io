/**
 * A global keybind registry that holds all keybinds and thier actions in the project
 */
class KeybindRegistry {
    static entries = [];

    /**
     * Adds a keybind entry to the registry
     * @param {*} keys an array of key codes
     * @param {*} action the action to be executed when the keybind is pressed
     */
    static addEntry(keys, action) {
        this.entries.push({keys: keys, action: action});
    }

    /**
     * Iterates through all keybinds and executes the action of the keybind that is pressed
     */
    static pressed() {
        for(let keybind of KeybindRegistry.entries) {
            let allPressed = true;
            for(let key = 0; key < keybind.keys.length - 1; key++) {
                allPressed = allPressed && keyIsDown(keybind.keys[key])
            }

            if(allPressed && keyCode === keybind.keys[keybind.keys.length - 1]) {
                keybind.action();
            }
        }
    }
}