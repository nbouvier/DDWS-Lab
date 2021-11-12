const utils = require('./utils')
const db = require('../database/database')

const SECONDS = 86400
const REFRESH_FREQUENCY = 10

// Values in w/h
const AVG_MIN_CONSUMTION = 0.01
const AVG_MAX_CONSUMPTION = 0.5
const AVG_SKEW = 3
const DELTA_CONSUMPTION = 10

const FLAT_ACTIVITY = 4*SECONDS/24
const FLAT_SKEW = 1.75

const setHouseAverageConsumption = async () => {
    // Use House Services
    houses = await db.query(`SELECT id FROM house WHERE id NOT IN (SELECT DISTINCT(house_id) FROM house_consumption);`)
    houses.forEach(house => {
        consumption = utils.randn_bm(AVG_MIN_CONSUMTION*100, AVG_MAX_CONSUMPTION*100, AVG_SKEW) / 100
        second = utils.randn_bm(0, SECONDS-1, 1)
        db.query(`INSERT INTO house_consumption (house_id, average_consumption, average_second) VALUES (${house.id}, ${consumption}, ${second});`)
    });
}

const setProsumerConsumption = async () => {
    date = new Date()
    currentSecond = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()

    // Use House Services getAll()
    houses = await db.query(`SELECT house_id AS id, average_consumption, average_second FROM house_consumption;`)
    houses.forEach(async house => {
        avg_second = house.average_second
        avg_consumption = house.average_consumption
        min_second = avg_second > SECONDS/2 ? avg_second-SECONDS : -FLAT_ACTIVITY/2
        max_second = avg_second < SECONDS/2 ? avg_second+SECONDS : SECONDS+FLAT_ACTIVITY/2
        min_consumption = AVG_MIN_CONSUMTION / DELTA_CONSUMPTION
        max_consumption = 2 * avg_consumption - min_consumption

        skew = 0
        if (currentSecond < avg_second-SECONDS/2) {
        	skew = currentSecond < min_second+FLAT_ACTIVITY/2 ? FLAT_SKEW : 24 * Math.abs(currentSecond-min_second) / SECONDS
        } else if (currentSecond > avg_second+SECONDS/2) {
        	skew = max_second-FLAT_ACTIVITY/2 < currentSecond ? FLAT_SKEW : 24 * Math.abs(currentSecond-max_second) / SECONDS
        } else {
        	skew = (avg_second-FLAT_ACTIVITY/2 < currentSecond && currentSecond < avg_second+FLAT_ACTIVITY/2) ? FLAT_SKEW : 24 * Math.abs(currentSecond-avg_second) / SECONDS
        }
        consumption = utils.randn_bm(min_consumption*1000, max_consumption*1000, skew) / 1000 * REFRESH_FREQUENCY
        console.log({avg_second, min_second, max_second, avg_consumption, min_consumption, max_consumption, skew, consumption})
        db.query(`INSERT INTO consumption (house_id, consumption) VALUES (${house.id}, ${consumption});`)
    });
}

exports.generateData = async () => {
    while (new Date().getSeconds() % REFRESH_FREQUENCY) {}

    setInterval(() => {
        setHouseAverageConsumption()
        setProsumerConsumption()
    }, REFRESH_FREQUENCY * 1000)
}
