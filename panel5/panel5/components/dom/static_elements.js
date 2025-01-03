/**
 * Creates a div element with a leading, trailing and title element
 * @param {*} title the title of the title bar
 * @param {*} leading a collection of element to be placed on the left side of the title
 * @param {*} trailing a collection of element to be placed on the right side of the title
 * @returns a div element with the title bar structure
 */
function createTitleBar(title, leading = [], trailing = []) {
    let root = createDiv("").addClass("TitleBar")
    
    let leading_element = createDiv("").addClass("TitleBarActionGroup")
    for(const action of leading) {
        action.addClass("TitleBarAction")
        leading_element.child(action)
    }
    root.child(leading_element)

    let title_element = createP(title).addClass("TitleBarTitle").addClass("NonSelectable")
    root.child(title_element)

    let trailing_element = createDiv("").addClass("TitleBarActionGroup")
    for(const action of trailing) {
        action.addClass("TitleBarAction")
        trailing_element.child(action)
    }
    root.child(trailing_element)

    return root
}

/**
 * Creates a button element with a specified icon
 * @param {*} icon the path to the icon image
 * @param {*} onclick the function to be called when the button is clicked
 * @param {*} width the width of the button
 * @param {*} height the height of the button
 * @returns a button element with the specified icon
 */
function createIconButton(icon, onclick, width, height = width) {
    let root = createButton("")
    root.mouseClicked(onclick)
    root.style("width", width + "px").style("height", height + "px")
    root.attribute("tabindex", "-1")

    let icon_element = createImg(icon).addClass("ButtonIcon").addClass("NonSelectable")
    icon_element.style("width", (width * 0.75) + "px").style("height", (height * 0.75) + "px")
    root.child(icon_element)

    return root
}

/**
 * Creates a text input element with a default value
 * @param {*} default_value the default value of the text input
 * @returns a text input element with the specified default value
 */
function createTextInput(default_value) {
    return createInput(default_value).attribute("type", "text").addClass("StringInput")
}

/**
 * Creates a number input element with a default value
 * @param {*} default_value the default value of the number input
 * @returns a number input element with the specified default value
 */
function createNumberInput(default_value) {
    return createInput(default_value).attribute("type", "number").addClass("NumberInput")
}

/**
 * Creates a boolean input element with a default value
 * @param {*} default_value the default value of the boolean input
 * @returns a boolean input element with the specified default value
 */
function createBooleanInput(default_value) {
    return createInput(default_value).attribute("type", "checkbox").addClass("BooleanInput").attribute("checked", default_value).attribute("value", default_value)
}

/**
 * Creates a color input element with a default value
 * @param {*} default_value the default value of the color input
 * @returns a color input element with the specified default value
 */
function createColorInput(default_value) {
    return createColorPicker(default_value).addClass("ColorInput")
}

/**
 * Creates a dropdown input element with a list of options and a default value
 * @param {*} options the list of options for the dropdown input
 * @param {*} default_value the default value of the dropdown input
 * @returns a dropdown input element with the specified options and default value
 */
function createDropdownInput(options, default_value) {
    let root = createSelect("").addClass("DropdownInput")
    for(const option of options) {
        root.option(option)
    }
    root.value(default_value)
    return root
}

/**
 * Creates a divider element with a label
 * @param {*} label the label of the divider
 * @returns a divider element with the specified label
 */
function createDivider(label = "") {
    let root = createDiv("").addClass("Divider")
    if(label != "") {
        let label_element = createP(label).addClass("DividerLabel").addClass("NonSelectable")
        root.child(label_element)
    } else {
        let line_element = createDiv("").addClass("DividerLine")
        root.child(line_element)
    }
    return root
}

/**
 * Creates a registry entry display element with a label and an input element
 * @param {*} reg_id the id of the registry entry
 * @param {*} entry the registry entry object
 * @returns a registry entry display element with the specified label and input element
 */
function createRegistryEntryDisplay(reg_id, entry) {
    let root = createDiv("").addClass("RegistryEntryDisplay")
    let key = createP(entry.label).addClass("RegistryEntryLabel").addClass("NonSelectable")
    let value
    switch(entry.type) {
        case EntryType.STRING:
            value =  createTextInput(entry.value).id(`${reg_id}-${entry.key}`)
            break;
        case EntryType.NUMBER:
            value = createNumberInput(entry.value).id(`${reg_id}-${entry.key}`)
            break;
        case EntryType.BOOLEAN:
            value = createBooleanInput(entry.value).id(`${reg_id}-${entry.key}`)
            break;
        case EntryType.COLOR:
            value = createColorInput(entry.value).id(`${reg_id}-${entry.key}`)
            break;
        case EntryType.DROPDOWN:
            value = createDropdownInput(entry.options, entry.value).id(`${reg_id}-${entry.key}`)
            break;
    }
    root.child(key).child(value)
    return root
}