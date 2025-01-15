class Config {
    static registry

    static init() {
        Config.registry = new Registry("config");

        // Gravity strength and direction for the engine
        Config.registry.registerNumber("gravity_mag", 0.0, "Gravity Magnitude")
        Config.registry.registerNumber("gravity_angle", 0.0, "Gravity Angle")

        // Affector Gravitational constant
        Config.registry.registerNumber("gravitational_constant", 6.67, "Grav. Constant")

        // How long the particle should be alive and ticking
        Config.registry.registerNumber("particle_timeout", 255, "Particle Timeout")
        Config.registry.registerNumber("launch_particle_timeout", 755, "Launched Particle Timeout")
        Config.registry.registerBoolean("launch_particle_trail", false, "Launched Particle Trail")

        GlobalRegistry.addRegistry(Config.registry)
    }

    // Returns a vector of gravity to directly apply to each particle
    static getGravityVector() {
        return createVector(Config.registry.get("gravity_mag") * sin(Config.registry.get("gravity_angle") * PI/180), Config.registry.get("gravity_mag") * cos(Config.registry.get("gravity_angle") * PI/180))
    }

    static getGravitationalForce(m1, m2, distance) {
        return Config.registry.get("gravitational_constant").value * ((m1 * m2) / ((distance) ** 2))
    }
}