import { randn_bm } from './utils.js'
import db from '../database/database.js'

const REFRESH_FREQUENCY = 10

// Values in W/s
const MIN_COAL = 500
const MAX_COAL = 666
const DELTA_COAL = 0.05

async function setRealTimeProduction() {
    let coalPowerPlants = await db.query(`SELECT id FROM coal_power_plant;`)
    coalPowerPlants.forEach(async coalPowerPlant => {
        let production = randn_bm(MIN_COAL, MAX_COAL) * REFRESH_FREQUENCY
        await db.query(`INSERT INTO coal_production (coal_power_plant_id, production) VALUES (${coalPowerPlant.id}, ${production});`)
    })
}

export default async function generateData() {
    while(new Date().getSeconds() % 10) {}

    setInterval(() => {
        setRealTimeProduction()
    }, REFRESH_FREQUENCY * 1000)
}
