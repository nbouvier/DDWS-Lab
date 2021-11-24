import { randn_bm } from './utils.js'
import db from '../database/database.js'

const SECONDS = 86400
const REFRESH_FREQUENCY = 10

// Values in w/h
const AVG_MIN_CONSUMTION = 0.01
const AVG_MAX_CONSUMPTION = 0.5
const AVG_SKEW = 3
const DELTA_CONSUMPTION = 10

const FLAT_ACTIVITY = 4*SECONDS/24
const FLAT_SKEW = 1.75

async function setHouseAverageConsumption() {
    // Use House Services
    let houses = await db.query(`SELECT id FROM house WHERE id NOT IN (SELECT DISTINCT(house_id) FROM house_consumption);`)
    houses.forEach(house => {
        let consumption = randn_bm(AVG_MIN_CONSUMTION*100, AVG_MAX_CONSUMPTION*100, AVG_SKEW) / 100
        let second = randn_bm(0, SECONDS-1, 1)
        db.query(`INSERT INTO house_consumption (house_id, average_consumption, average_second) VALUES (${house.id}, ${consumption}, ${second});`)
    });
}

async function setProsumerConsumption() {
    let date = new Date()
    let currentSecond = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()

    // Use House Services getAll()
    let houses = await db.query(`SELECT house_id AS id, average_consumption, average_second FROM house_consumption;`)
    houses.forEach(async house => {
        let avg_second = house.average_second
        let avg_consumption = house.average_consumption
        let min_second = avg_second > SECONDS/2 ? avg_second-SECONDS : -FLAT_ACTIVITY/2
        let max_second = avg_second < SECONDS/2 ? avg_second+SECONDS : SECONDS+FLAT_ACTIVITY/2
        let min_consumption = AVG_MIN_CONSUMTION / DELTA_CONSUMPTION
        let max_consumption = 2 * avg_consumption - min_consumption

        let skew = 0
        if (currentSecond < avg_second-SECONDS/2) {
        	skew = currentSecond < min_second+FLAT_ACTIVITY/2 ? FLAT_SKEW : 24 * Math.abs(currentSecond-min_second) / SECONDS
        } else if (currentSecond > avg_second+SECONDS/2) {
        	skew = max_second-FLAT_ACTIVITY/2 < currentSecond ? FLAT_SKEW : 24 * Math.abs(currentSecond-max_second) / SECONDS
        } else {
        	skew = (avg_second-FLAT_ACTIVITY/2 < currentSecond && currentSecond < avg_second+FLAT_ACTIVITY/2) ? FLAT_SKEW : 24 * Math.abs(currentSecond-avg_second) / SECONDS
        }
        let consumption = randn_bm(min_consumption*1000, max_consumption*1000, skew) / 1000 * REFRESH_FREQUENCY

        db.query(`INSERT INTO consumption (house_id, consumption) VALUES (${house.id}, ${consumption});`)
    });
}

export default async function generateData() {
    while (new Date().getSeconds() % REFRESH_FREQUENCY) {}

    setInterval(() => {
        setHouseAverageConsumption()
        setProsumerConsumption()
    }, REFRESH_FREQUENCY * 1000)
}
