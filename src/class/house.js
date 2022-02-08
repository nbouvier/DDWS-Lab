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

    async blackoutLevel() {
        let blackout = await db.query('SELECT blackout FROM house_need WHERE house_id = ? ORDER BY timestamp DESC LIMIT 1;', [ this.id ])

        if(!blackout.length) { return false }

        return blackout[0].blackout
    }

    async actualProduction() {
        let production = await db.query('SELECT production FROM house_production WHERE house_id = ? ORDER BY timestamp DESC LIMIT 1;', [ this.id ])

        if(!production.length) { production = 0 }
        else { production = production[0].production }

        return production
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

        return await db.query(`SELECT production, timestamp FROM (SELECT production, UNIX_TIMESTAMP(timestamp) * 1000 AS timestamp FROM house_production WHERE house_id = ? ${additionalConditions} ORDER BY 2 DESC LIMIT 8640) t ORDER BY 2;`, [ this.id, ...additionalConditionsArgs ])
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

        return await db.query(`SELECT consumption, timestamp FROM (SELECT consumption, UNIX_TIMESTAMP(timestamp) * 1000 AS timestamp FROM house_consumption WHERE house_id = ? ${additionalConditions} ORDER BY 2 DESC LIMIT 8640) t ORDER BY 2;`, [ this.id, ...additionalConditionsArgs ])
    }

    async serialize() {
        return {
            id: this.id,
            production: await this.actualProduction(),
            consumption: await this.actualConsumption(),
            to_buffer_percentage: this.to_buffer_percentage,
            from_buffer_percentage: this.from_buffer_percentage,
            buffer: (await this.buffer()).serialize(),
            blackout: await this.blackoutLevel()
        }
    }
}
