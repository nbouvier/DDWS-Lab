import db from '../database/database.js'

export default class Buffer {

    static table = 'buffer'
    static fields = [ 'capacity', 'resource' ]

    constructor(capacity, resource) {
        this.capacity = capacity
        this.resource = resource
    }

    fill(amount) {
        let maxAmount = this.capacity - this.resource
        let filledAmount = amount > maxAmount ? maxAmount : amount

        this.resource = this.resource + filledAmount

        return filledAmount
    }

    empty(amount) {
        let maxAmount = this.resource
        let emptiedAmount = amount > maxAmount ? maxAmount : amount

        this.resource = this.resource - emptiedAmount

        return emptiedAmount
    }

    serialize() {
        return {
            id: this.id,
            capacity: this.capacity,
            resource: this.resource
        }
    }
}
