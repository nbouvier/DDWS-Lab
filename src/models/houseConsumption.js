import random from '../vendor/random.js'
import db from '../database/database.js'

const SECONDS = 86400
const REFRESH_FREQUENCY = 10

// Values in W/s
const AVG_MIN_CONSUMTION = 0.01
const AVG_MAX_CONSUMPTION = 0.5
const AVG_SKEW = 2
const DELTA_CONSUMPTION = 10

const FLAT_ACTIVITY = 4 * SECONDS / 24
const FLAT_SKEW = 1.75

async function setHouseAverageConsumption() {
    let houses = await db.query('SELECT id FROM house WHERE id NOT IN (SELECT DISTINCT(house_id) FROM global_house_consumption);')
    houses.forEach(house => {
        let consumption = random.randomBM(AVG_MIN_CONSUMTION * 100, AVG_MAX_CONSUMPTION * 100, AVG_SKEW) / 100
        let second = random.randomBM(0, SECONDS-1, 1)

        db.query('INSERT INTO global_house_consumption (house_id, average_consumption, average_second) VALUES (?, ?, ?);', [ house.id, consumption, second ])
    });
}

async function setHouseConsumption() {
    let date = new Date()
    let currentSecond = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()

    let houses = await db.query('SELECT h.id, h.from_buffer_percentage, ghp.average_consumption, ghp.average_second, b.id AS b_id, b.resource FROM house h JOIN global_house_consumption ghp ON h.id = ghp.house_id JOIN buffer b ON h.buffer_id = b.id;')
    houses.forEach(async house => {
        let avg_second = house.average_second
        let avg_consumption = house.average_consumption
        let min_second = avg_second > SECONDS / 2 ? avg_second - SECONDS : -FLAT_ACTIVITY / 2
        let max_second = avg_second < SECONDS / 2 ? avg_second + SECONDS : SECONDS + FLAT_ACTIVITY / 2
        let min_consumption = AVG_MIN_CONSUMTION / DELTA_CONSUMPTION
        let max_consumption = 2 * avg_consumption - min_consumption

        let skew = 0
        if (currentSecond < avg_second - SECONDS / 2) {
        	skew = currentSecond < min_second + FLAT_ACTIVITY / 2 ? FLAT_SKEW : 24 * Math.abs(currentSecond - min_second) / SECONDS
        } else if (currentSecond > avg_second + SECONDS / 2) {
        	skew = max_second - FLAT_ACTIVITY / 2 < currentSecond ? FLAT_SKEW : 24 * Math.abs(currentSecond - max_second) / SECONDS
        } else {
        	skew = (avg_second - FLAT_ACTIVITY / 2 < currentSecond && currentSecond < avg_second + FLAT_ACTIVITY / 2) ? FLAT_SKEW : 24 * Math.abs(currentSecond-avg_second) / SECONDS
        }
        let consumption = random.randomBM(min_consumption * 1000, max_consumption * 1000, skew) / 1000 * REFRESH_FREQUENCY

        let removeFromBuffer = house.resource
        let remainingConsumption = consumption
        
        if(house.resource >= consumption * house.from_buffer_percentage / 100) {
            removeFromBuffer = consumption * house.from_buffer_percentage / 100
            remainingConsumption = consumption - removeFromBuffer
            // Prevent float error resulting in really small negative number
            remainingConsumption = remainingConsumption >= 0 ? remainingConsumption : 0
        }

        await db.query('UPDATE buffer SET resource = ? WHERE id = ?;', [ house.resource - removeFromBuffer, house.b_id ])
        await db.query('INSERT INTO house_consumption (house_id, consumption, remaining_consumption) VALUES (?, ?, ?);', [ house.id, consumption, remainingConsumption ])
    });
}

const houseConsumption = { setHouseAverageConsumption, setHouseConsumption }

export default houseConsumption
