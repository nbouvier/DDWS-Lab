import db from '../database/database.js'

import Buffer from './buffer.js'

export default class House {

    static table = 'house'
    static fields = [ 'to_buffer_percentage', 'from_buffer_percentage', 'buffer_id' ]

    constructor(to_buffer_percentage, from_buffer_percentage, buffer_id) {
        this.to_buffer_percentage = to_buffer_percentage
        this.from_buffer_percentage = from_buffer_percentage
        this.buffer_id = buffer_id
    }

    async buffer() {
        return await db.loadOne(Buffer, this.buffer_id)
    }

    async actualProduction() {
        let production = 0
        let productions = await db.query(`SELECT production FROM house_production WHERE house_id = ? ORDER BY timestamp DESC LIMIT 100;`, [ this.id ])

        productions.forEach(e => production += e.production)

        return production / productions.length
    }

    async actualConsumption() {
        let consumption = 0
        let consumptions = await db.query(`SELECT consumption FROM house_consumption WHERE house_id = ? ORDER BY timestamp DESC LIMIT 100;`, [ this.id ])

        consumptions.forEach(e => consumption += e.consumption)

        return consumption / consumptions.length
    }

    async production(from = null, to = null) {
        let additionalConditions = ''
        let additionalConditionsArgs = []

        if(from) {
            additionalConditions += ` AND timestamp >= ?`
            additionalConditionsArgs.push(from)
        }

        if(to) {
            additionalConditions += ` AND timestamp <= ?`
            additionalConditionsArgs.push(to)
        }

        return await db.query(`SELECT production, UNIX_TIMESTAMP(timestamp) * 1000 AS timestamp FROM house_production WHERE house_id = ? ${additionalConditions};`, [ this.id, ...additionalConditionsArgs ])
    }

    async consumption(from = null, to = null) {
        let additionalConditions = ''
        let additionalConditionsArgs = []

        if(from) {
            additionalConditions += ` AND timestamp >= ?`
            additionalConditionsArgs.push(from)
        }

        if(to) {
            additionalConditions += ` AND timestamp <= ?`
            additionalConditionsArgs.push(to)
        }

        return await db.query(`SELECT consumption, UNIX_TIMESTAMP(timestamp) * 1000 AS timestamp FROM house_consumption WHERE house_id = ? ${additionalConditions};`, [ this.id, ...additionalConditionsArgs ])
    }

    async serialize() {
        return {
            id: this.id,
            production: await this.actualProduction(),
            consumption: await this.actualConsumption(),
            to_buffer_percentage: this.to_buffer_percentage,
            from_buffer_percentage: this.from_buffer_percentage,
            buffer: (await this.buffer()).serialize()
        }
    }
}
