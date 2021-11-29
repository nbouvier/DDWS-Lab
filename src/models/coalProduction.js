import { randn_bm } from './utils.js'
import db from '../database/database.js'

const REFRESH_FREQUENCY = 10

// Values in W/s
const MIN_COAL = 500
const MAX_COAL = 666
const DELTA_COAL = 0.05

async function setRealTimeProduction() {
    let coalPowerPlants = await db.query(`SELECT cpp.id AS cpp_id, cpp.buffer_percentage, b.id AS b_id, b.capacity, b.ressource FROM coal_power_plant cpp JOIN buffer b ON cpp.id = b.coal_power_plant_id;`)
    coalPowerPlants.forEach(coalPowerPlant => {
        let production = randn_bm(MIN_COAL, MAX_COAL) * REFRESH_FREQUENCY
        let productionToBuffer = production * coalPowerPlant.buffer_percentage / 100
        productionToBuffer = productionToBuffer + coalPowerPlant.ressource > coalPowerPlant.capacity ? coalPowerPlant.capacity - coalPowerPlant.ressource : productionToBuffer
        let bufferRessource = coalPowerPlant.ressource + productionToBuffer

        db.query(`UPDATE buffer SET ressource = ${bufferRessource} WHERE id = ${coalPowerPlant.b_id};`)
        db.query(`INSERT INTO coal_production (coal_power_plant_id, production) VALUES (${coalPowerPlant.cpp_id}, ${production});`)
    })
}

export default async function generateData() {
    while(new Date().getSeconds() % 10) {}

    setInterval(() => {
        setRealTimeProduction()
    }, REFRESH_FREQUENCY * 1000)
}
