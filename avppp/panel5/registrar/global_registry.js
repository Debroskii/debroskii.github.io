/**
 * A global registry that holds all registries in the project
 */
class GlobalRegistry {
    /**
     * A collection of all registries in the project
     * @type {Registry[]}
     */
    static registries = [];

    static addRegistry(registry) {
        this.registries.push(registry);
    }

    /**
     * Get a registry by its id
     * @param {*} id the id of the registry
     * @returns {Registry} the registry with the given id
     */
    static getRegistry(id) {
        return this.registries.find(registry => registry.id === id);
    }
}