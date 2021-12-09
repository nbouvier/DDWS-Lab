import db from '../database/database.js'

export default class Buffer {

    static table = 'buffer'
    static fields = [ 'house_id', 'coal_power_plant_id', 'capacity', 'resource' ]

    constructor(house_id, coal_power_plant_id, capacity, resource) {
        this.house_id = house_id
        this.coal_power_plant_id = coal_power_plant_id
        this.capacity = capacity
        this.resource = resource
    }

    serialize() {
        return {
            id: this.id,
            capacity: this.capacity,
            resource: this.resource
        }
    }
}
