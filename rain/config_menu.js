class ConfigMenu {
    constructor() {
        this.menu = createDiv("")
        this.menu.id("config-menu")

        this.drop_count_div = createDiv("")
        this.drop_count_div.addClass("config-obj")
        this.drop_count_label = createElement("p", "Drop Count")
        this.drop_count_number_field = createInput(5000)
        this.drop_count_number_field.attribute("type", "number")
        this.drop_count_div.child(this.drop_count_label)
        this.drop_count_div.child(this.drop_count_number_field)

        this.grav_accel_div = createDiv("")
        this.grav_accel_div.addClass("config-obj")
        this.grav_accel_label = createElement("p", "Grav. Acceleration")
        this.grav_accel_number_field = createInput(9.8)
        this.grav_accel_number_field.attribute("type", "number")
        this.grav_accel_div.child(this.grav_accel_label)
        this.grav_accel_div.child(this.grav_accel_number_field)

        this.background_color_div = createDiv("")
        this.background_color_div.addClass("config-obj")
        this.background_color_label = createElement("p", "Background Color")
        this.background_color_field = createColorPicker(color(0, 0, 0))
        this.background_color_div.child(this.background_color_label)
        this.background_color_div.child(this.background_color_field)
        
        this.rain_color_div = createDiv("")
        this.rain_color_div.addClass("config-obj")
        this.rain_color_label = createElement("p", "Rain Color")
        this.rain_color_field = createColorPicker(color(255, 255, 255))
        this.rain_color_div.child(this.rain_color_label)
        this.rain_color_div.child(this.rain_color_field)

        this.rain_alpha_div = createDiv("")
        this.rain_alpha_div.addClass("config-obj")
        this.rain_alpha_label = createElement("p", "Rain Alpha")
        this.rain_alpha_slider = createSlider(0, 255, 55, 1)
        this.rain_alpha_div.child(this.rain_alpha_label)
        this.rain_alpha_div.child(this.rain_alpha_slider)

        this.menu.child(this.drop_count_div)
        this.menu.child(this.grav_accel_div)
        this.menu.child(this.background_color_div)
        this.menu.child(this.rain_color_div)
        this.menu.child(this.rain_alpha_div)
    }

    getDropCount() {
        return this.drop_count_number_field.value()
    }

    getGravityAccel() {
        return this.grav_accel_number_field.value()
    }

    getBackgroundColor() {
        return this.background_color_field.color()
    }

    getRainColor() {
        return this.rain_color_field.color()
    }

    getRainAlpha() {
        return this.rain_alpha_slider.value()
    }
}