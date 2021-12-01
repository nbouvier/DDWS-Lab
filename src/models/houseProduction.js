import random from '../vendor/random.js'
import db from '../database/database.js'

const REFRESH_FREQUENCY = 10

// Values in W/s
const AVG_MIN_PRODUCTION = 0.012
const AVG_MAX_PRODUCTION = 0.23
const AVG_SKEW = 2
const DELTA_PRODUCTION = 1.1

const MAX_WIND = 75
const WIND_BOOST = MAX_WIND * 0.75

async function setHouseAverageProduction() {
    let houses = await db.query('SELECT id FROM house WHERE id NOT IN (SELECT DISTINCT(house_id) FROM global_house_production);')
    houses.forEach(house => {
        let production = random.randomBM(AVG_MIN_PRODUCTION * 100, AVG_MAX_PRODUCTION * 100, AVG_SKEW) / 100

        db.query('INSERT INTO global_house_production (house_id, average_production) VALUES (?, ?);', [ house.id, production ])
    });
}

async function setHouseProduction() {
    let wind = await db.query('SELECT speed FROM realtime_wind ORDER BY timestamp DESC LIMIT 1;')
    if(!wind.length) { return }
    wind = wind[0].speed
    let wind_ratio = wind / WIND_BOOST

    let houses = await db.query('SELECT h.id, h.to_buffer_percentage, ghp.average_production, b.id AS b_id, b.capacity AS b_capacity, b.ressource AS b_ressource FROM house h JOIN buffer b ON h.id = b.house_id JOIN global_house_production ghp ON h.id = ghp.house_id;')
    houses.forEach(house => {
        let min_production = house.average_production / DELTA_PRODUCTION
        let max_production = (2 * house.average_production - min_production) * wind_ratio
        min_production *= wind_ratio
        let production = random.randomBM(min_production * 100, max_production * 100) / 100 * REFRESH_FREQUENCY
        let productionToBuffer = production * house.to_buffer_percentage / 100
        productionToBuffer = productionToBuffer + house.b_ressource > house.b_capacity ? house.b_capacity - house.b_ressource : productionToBuffer
        let bufferRessource = house.b_ressource + productionToBuffer

        db.query('UPDATE buffer SET ressource = ? WHERE id = ?;', [ bufferRessource, house.b_id ])
        db.query('INSERT INTO house_production (house_id, production) VALUES (?, ?);', [ house.id, production ])
    })
}

export default async function generateData() {
    while(new Date().getSeconds() % REFRESH_FREQUENCY) {}

    setInterval(() => {
        setHouseAverageProduction()
        setHouseProduction()
    }, REFRESH_FREQUENCY * 1000)
}
