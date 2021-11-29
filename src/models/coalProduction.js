import { randn_bm } from './utils.js'
import db from '../database/database.js'

const REFRESH_FREQUENCY = 10

// Values in MWh
const MIN_COAL = 18
const MAX_COAL = 24
const DELTA_COAL = 0.05

async function setInitialProduction() {
    let production = randn_bm(MIN_COAL, MAX_COAL)

    await db.query(`INSERT INTO coal_production (production) VALUES (${production});`)
}

async function setRealTimeProduction() {
    let previousProduction = (await db.query(`SELECT production FROM coal_production ORDER BY id DESC LIMIT 1;`))[0].production

    let min = previousProduction - DELTA_COAL < MIN_COAL ? MIN_COAL : previousProduction - DELTA_COAL
    let max = previousProduction + DELTA_COAL > MAX_COAL ? MAX_COAL : previousProduction + DELTA_COAL

    let production = randn_bm(min, max)

    db.query(`INSERT INTO coal_production (production) VALUES (${production});`)
}

export default async function generateData() {
    let lastProduction = await db.query(`SELECT * FROM coal_production;`)
    if(!lastProduction.length) {
        await setInitialProduction()
    }

    while(new Date().getSeconds() % 10) {}

    setInterval(() => {
        setRealTimeProduction()
    }, REFRESH_FREQUENCY * 1000)
}
