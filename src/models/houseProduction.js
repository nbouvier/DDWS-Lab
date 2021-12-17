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
    let wind = await db.query('SELECT speed FROM wind ORDER BY timestamp DESC LIMIT 1;')
    if(!wind.length) { return }
    wind = wind[0].speed
    let wind_ratio = wind / WIND_BOOST

    let houses = await db.query('SELECT h.id, h.to_buffer_percentage, ghp.average_production, b.id AS b_id, b.capacity AS b_capacity, b.resource AS b_resource FROM house h JOIN buffer b ON h.buffer_id = b.id JOIN global_house_production ghp ON h.id = ghp.house_id;')
    houses.forEach(async house => {
        let min_production = house.average_production / DELTA_PRODUCTION
        let max_production = (2 * house.average_production - min_production) * wind_ratio
        min_production *= wind_ratio
        let production = random.randomBM(min_production * 100, max_production * 100) / 100 * REFRESH_FREQUENCY
        let productionToBuffer = production * house.to_buffer_percentage / 100
        productionToBuffer = productionToBuffer + house.b_resource > house.b_capacity ? house.b_capacity - house.b_resource : productionToBuffer
        let bufferResource = house.b_resource + productionToBuffer
        let remainingProduction = production - productionToBuffer

        await db.query('UPDATE buffer SET resource = ? WHERE id = ?;', [ bufferResource, house.b_id ])
        await db.query('INSERT INTO house_production (house_id, production, remaining_production) VALUES (?, ?, ?);', [ house.id, production, remainingProduction ])
    })
}

const houseProduction = { setHouseAverageProduction, setHouseProduction }

export default houseProduction
