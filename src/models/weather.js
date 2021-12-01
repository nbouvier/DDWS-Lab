import random from '../vendor/random.js'
import db from '../database/database.js'

const REFRESH_FREQUENCY = 10

// Values in m/s
const MIN_WIND = 0
const MAX_WIND = 75
const SKEW = .5

const DAILY_DELTA = 15
const REAL_TIME_DELTA = 3

async function setDailyWind() {
    let speed = random.randomBM(MIN_WIND, MAX_WIND, SKEW)

    await db.query('INSERT INTO daily_wind (speed) VALUES (?);', [ speed ])
}

async function setRealTimeWind() {
    let day = new Date().toISOString().slice(0, 10)
    let dailySpeed = (await db.query('SELECT speed FROM daily_wind WHERE DATE(day) = ?;', [ day ]))[0].speed
    let previousSpeed = await db.query('SELECT speed FROM realtime_wind ORDER BY id DESC LIMIT 1;')
    previousSpeed = previousSpeed.length ? previousSpeed[0].speed : dailySpeed

    let dailyMin = dailySpeed - DAILY_DELTA < MIN_WIND ? MIN_WIND : dailySpeed - DAILY_DELTA
    let dailyMax = dailySpeed + DAILY_DELTA > MAX_WIND ? MAX_WIND : dailySpeed + DAILY_DELTA

    let realTimeMin = previousSpeed - REAL_TIME_DELTA < dailyMin ? dailyMin : previousSpeed - REAL_TIME_DELTA
    let realTimeMax = previousSpeed + REAL_TIME_DELTA < dailyMax ? dailyMax : previousSpeed + REAL_TIME_DELTA

    let speed = random.randomBM(realTimeMin, realTimeMax)

    db.query('INSERT INTO realtime_wind (speed) VALUES (?);', [ speed ])
}

export default async function generateData() {
    let lastDay = await db.query('SELECT DATE(day) AS day FROM daily_wind ORDER BY id DESC LIMIT 1;')
    if(!lastDay.length) {
        await setDailyWind()
    } else {
        let currentDay = new Date().toISOString().slice(0, 10)
        lastDay = lastDay[0].day
        if(lastDay != currentDay) {
            await setDailyWind()
        }
    }

    while(new Date().getSeconds() % REFRESH_FREQUENCY) {}

    setInterval(async () => {
        let date = new Date()
        if(!date.getHours() && !date.getMinutes() && date.getSeconds() < 10) {
            await setDailyWind()
        }
        setRealTimeWind()
    }, REFRESH_FREQUENCY * 1000)
}
