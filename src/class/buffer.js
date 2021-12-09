import db from '../database/database.js'

export default class Buffer {

    static table = 'buffer'
    static fields = [ 'capacity', 'resource' ]

    constructor(capacity, resource) {
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
