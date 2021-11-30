import db from '../database/database.js'

export default class CoalPowerPlant {

    static table = 'coal_power_plant'
    static fields = [ 'buffer_percentage' ]

    constructor(bufferPercentage) {
        this.bufferPercentage = bufferPercentage
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

    serialize() {
        return {
            bufferPercentage: this.bufferPercentage
        }
    }
}
