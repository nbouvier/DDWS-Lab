import db from '../database/database.js'

import Buffer from './buffer.js'

export default class CoalPowerPlant {

    static table = 'coal_power_plant'
    static fields = [ 'running', 'buffer_percentage' ]

    constructor(running, buffer_percentage) {
        this.running = running
        this.buffer_percentage = buffer_percentage
    }

    async buffer() {
        return (await db.loadWhere(Buffer, 'coal_power_plant_id = ?', [ this.id ]))[0]
    }

    async actualProduction() {
        let production = 0
        let productions = await db.query(`SELECT production FROM coal_production WHERE coal_power_plant_id = ? ORDER BY timestamp DESC LIMIT 100;`, [ this.id ])

        productions.forEach(e => production += e.production)

        return production / productions.length
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

        return await db.query(`SELECT production, timestamp FROM coal_production WHERE coal_power_plant_id = ? ${additionalConditions};`, [ this.id, ...additionalConditionsArgs ])
    }

    async serialize() {
        return {
            running: this.running,
            production: await this.actualProduction(),
            buffer_percentage: this.buffer_percentage,
            buffer: (await this.buffer()).serialize()
        }
    }
}
