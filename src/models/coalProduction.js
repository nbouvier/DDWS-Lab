import random from '../vendor/random.js'
import db from '../database/database.js'

const REFRESH_FREQUENCY = 10

// Values in W/s
const MIN_COAL = 500
const MAX_COAL = 666

async function setCoalPowerPlantProduction() {
    let coalPowerPlants = await db.query('SELECT cpp.id, cpp.buffer_percentage, b.id AS b_id, b.capacity AS b_capacity, b.ressource AS b_ressource FROM coal_power_plant cpp JOIN buffer b ON cpp.id = b.coal_power_plant_id;')
    coalPowerPlants.forEach(coalPowerPlant => {
        let production = random.randomBM(MIN_COAL, MAX_COAL) * REFRESH_FREQUENCY
        let productionToBuffer = production * coalPowerPlant.buffer_percentage / 100
        productionToBuffer = productionToBuffer + coalPowerPlant.b_ressource > coalPowerPlant.b_capacity ? coalPowerPlant.b_capacity - coalPowerPlant.b_ressource : productionToBuffer
        let bufferRessource = coalPowerPlant.b_ressource + productionToBuffer

        db.query('UPDATE buffer SET ressource = ? WHERE id = ?;', [ bufferRessource, coalPowerPlant.b_id ])
        db.query('INSERT INTO coal_production (coal_power_plant_id, production) VALUES (?, ?);', [ coalPowerPlant.id, production ])
    })
}

export default async function generateData() {
    while(new Date().getSeconds() % REFRESH_FREQUENCY) {}

    setInterval(() => {
        setCoalPowerPlantProduction()
    }, REFRESH_FREQUENCY * 1000)
}
