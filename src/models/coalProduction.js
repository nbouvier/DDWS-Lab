import random from '../vendor/random.js'
import db from '../database/database.js'

const REFRESH_FREQUENCY = 10

// Values in W/s
const MIN_COAL = 500
const MAX_COAL = 666

async function setCoalPowerPlantProduction() {
    let coalPowerPlants = await db.query('SELECT cpp.id, cpp.buffer_percentage, cpp.running, b.id AS b_id, b.capacity AS b_capacity, b.resource AS b_resource FROM coal_power_plant cpp JOIN buffer b ON cpp.buffer_id = b.id;')
    coalPowerPlants.forEach(coalPowerPlant => {
        let production = 0
        let remainingProduction = 0

        if(coalPowerPlant.running == '1') {
            production = random.randomBM(MIN_COAL, MAX_COAL) * REFRESH_FREQUENCY
            let productionToBuffer = production * coalPowerPlant.buffer_percentage / 100
            productionToBuffer = productionToBuffer + coalPowerPlant.b_resource > coalPowerPlant.b_capacity ? coalPowerPlant.b_capacity - coalPowerPlant.b_resource : productionToBuffer
            let bufferResource = coalPowerPlant.b_resource + productionToBuffer
            remainingProduction = production - productionToBuffer

            db.query('UPDATE buffer SET resource = ? WHERE id = ?;', [ bufferResource, coalPowerPlant.b_id ])
        }

        db.query('INSERT INTO coal_production (coal_power_plant_id, production, remaining_production) VALUES (?, ?, ?);', [ coalPowerPlant.id, production, remainingProduction ])
    })
}

const coalProduction = { setCoalPowerPlantProduction }

export default coalProduction
