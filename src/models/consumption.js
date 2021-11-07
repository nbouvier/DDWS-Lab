const utils = require('./utils')
const db = require('../database/database')

const SECONDS = 86400
const REFRESH_FREQUENCY = 10
const PERIODS = SECONDS / REFRESH_FREQUENCY

// Values in w/h
const MIN_CONSUMTION = 0.01 * REFRESH_FREQUENCY
const MAX_CONSUMPTION = 0.13 * REFRESH_FREQUENCY

const setProsumerConsumption = async () => {
    date = new Date()
    currentPeriod = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / REFRESH_FREQUENCY

    skew = ((30*PERIODS/70 < currentPeriod && currentPeriod < 40*PERIODS/70) ? PERIODS/10 : Math.abs(currentPeriod - PERIODS/2)) / (PERIODS/15)

    // Use House Services getAll()
    houses = await db.query(`SELECT id FROM house;`)
    houses.forEach(house => {
        consumption = utils.randn_bm(MIN_CONSUMTION, MAX_CONSUMPTION, skew)
        db.query(`INSERT INTO electricity_consumption (house_id, consumption) VALUES (${house.id}, '${consumption}');`)
    });
}

exports.generateData = async () => {
    while (new Date().getSeconds() % 10) {}

    setInterval(() => {
        setProsumerConsumption()
    }, 10000)
}
