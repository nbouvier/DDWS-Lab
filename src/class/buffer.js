import db from '../database/database.js'

export default class Buffer {

    static table = 'buffer'
    static fields = [ 'house_id', 'coal_power_plant_id', 'capacity', 'ressource' ]

    constructor(house_id, coal_power_plant_id, capacity, ressource) {
        this.house_id = house_id
        this.coal_power_plant_id = coal_power_plant_id
        this.capacity = capacity
        this.ressource = ressource
    }

    serialize() {
        return {
            capacity: this.capacity,
            ressource: this.ressource
        }
    }
}
