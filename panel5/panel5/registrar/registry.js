/**
 * A class that holds a collection of key-value pairs
 */
class Registry {
    /**
     * Creates a new registry with the given id
     * @param {*} id the id of the registry
     */
    constructor(id) {
        this.id = id
        this.entries = []
    }

    /**
     * Registers a string entry
     * @param {*} key the key of the entry
     * @param {*} value the value of the entry
     * @param {*} label the label of the entry
     * @param {*} add_divider_before whether to place a divider before the entry
     * @param {*} divider_title the title of the divider
     */
    registerString(key, value, label = key, add_divider_before = false, divider_title = "") {
        this.entries.push({
            key: key,
            value: value,
            label: label,
            add_divider_before: add_divider_before,
            divider_title: divider_title,
            type: EntryType.STRING
        })
    }

/**
     * Registers a number entry
     * @param {*} key the key of the entry
     * @param {*} value the value of the entry
     * @param {*} label the label of the entry
     * @param {*} add_divider_before whether to place a divider before the entry
     * @param {*} divider_title the title of the divider
     */
    registerNumber(key, value, label = key, add_divider_before = false, divider_title = "") {
        this.entries.push({
            key: key,
            value: value,
            label: label,
            add_divider_before: add_divider_before,
            divider_title: divider_title,
            type: EntryType.NUMBER
        })
    }

    /**
     * Registers a boolean entry
     * @param {*} key the key of the entry
     * @param {*} value the value of the entry
     * @param {*} label the label of the entry
     * @param {*} add_divider_before whether to place a divider before the entry
     * @param {*} divider_title the title of the divider
     */
    registerBoolean(key, value, label = key, add_divider_before = false, divider_title = "") {
        this.entries.push({
            key: key,
            value: value,
            label: label,
            add_divider_before: add_divider_before,
            divider_title: divider_title,
            type: EntryType.BOOLEAN
        })
    }

    /**
     * Registers a color entry
     * @param {*} key the key of the entry
     * @param {*} value the value of the entry
     * @param {*} label the label of the entry
     * @param {*} add_divider_before whether to place a divider before the entry
     * @param {*} divider_title the title of the divider
     */
    registerColor(key, value, label = key, add_divider_before = false, divider_title = "") {
        this.entries.push({
            key: key,
            value: value,
            label: label,
            add_divider_before: add_divider_before,
            divider_title: divider_title,
            type: EntryType.COLOR
        })
    }

    /**
     * Registers a dropdown entry
     * @param {*} key the key of the entry
     * @param {*} value the value of the entry
     * @param {*} options the array options of the dropdown
     * @param {*} label the label of the entry
     * @param {*} add_divider_before whether to place a divider before the entry
     * @param {*} divider_title the title of the divider
     */
    registerDropdown(key, value, options, label = key, add_divider_before = false, divider_title = "") {
        this.entries.push({
            key: key,
            value: value,
            options: options,
            label: label,
            add_divider_before: add_divider_before,
            divider_title: divider_title,
            type: EntryType.DROPDOWN
        })
    }

    /**
     * Gets an entry by its key
     * @param {*} key the key of the entry
     * @returns {Object} the entry with the given key
     */
    get(key) {
        return this.entries.find(entry => entry.key === key)
    }

    /**
     * Syncronizes each entry with its corresponding DOM element
     */
    syncronizeWithDOM() {
        this.entries.forEach(entry => {
            let element = document.getElementById(`${this.id}-${entry.key}`)
            if (element) {
                switch (entry.type) {
                    case EntryType.STRING:
                        entry.value = element.value
                        break
                    case EntryType.NUMBER:
                        entry.value = parseFloat(element.value)
                        break
                    case EntryType.BOOLEAN:
                        entry.value = element.checked
                        break
                    case EntryType.COLOR:
                        entry.value = color(element.value)
                        break
                    case EntryType.DROPDOWN:
                        entry.value = element.value
                        break
                }
            }
        })
    }
}

/**
 * An enum that holds the types of entries
 */
const EntryType = Object.freeze({
    STRING: 1,
    NUMBER: 2,
    BOOLEAN: 3,
    COLOR: 4,
    DROPDOWN: 5
})