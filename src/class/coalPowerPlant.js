import db from '../database/database.js'

import Buffer from './buffer.js'

export default class CoalPowerPlant {

    static table = 'coal_power_plant'
    static fields = [ 'running', 'buffer_percentage', 'buffer_id' ]

    constructor(running, buffer_percentage, buffer_id) {
        this.running = running
        this.buffer_percentage = buffer_percentage
        this.buffer_id = buffer_id
    }

    async buffer() {
        return await db.loadOne(Buffer, this.buffer_id)
    }

    async actualProduction() {
        let production = await db.query('SELECT production FROM coal_production WHERE coal_power_plant_id = ? ORDER BY timestamp DESC LIMIT 1;', [ this.id ])

        if(!production.length) { production = 0 }
        else { production = production[0].production }

        return production
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

        return await db.query(`SELECT production, timestamp FROM (SELECT production, UNIX_TIMESTAMP(timestamp) * 1000 AS timestamp FROM coal_production WHERE coal_power_plant_id = ? ${additionalConditions} ORDER BY 2 DESC LIMIT 8640) t ORDER BY 2;`, [ this.id, ...additionalConditionsArgs ])
    }

    async serialize() {
        return {
            id: this.id,
            running: this.running,
            production: await this.actualProduction(),
            buffer_percentage: this.buffer_percentage,
            buffer: (await this.buffer()).serialize()
        }
    }
}
