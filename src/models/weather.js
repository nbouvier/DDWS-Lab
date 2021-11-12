const utils = require('./utils')
const db = require('../database/database')

// Values in m/s
const MIN_WIND = 0
const MAX_WIND = 75
const SKEW = .5

const DAILY_DELTA = 15
const REAL_TIME_DELTA = 3

exports.getWind = () => {
    return db.query(`SELECT * FROM daily_wind;`)
}

const setDailyWind = async () => {
    speed = utils.randn_bm(MIN_WIND, MAX_WIND, SKEW)

    await db.query(`INSERT INTO daily_wind (speed) VALUES (${speed});`)
}

const setRealTimeWind = async () => {
    day = new Date().toISOString().slice(0, 10)
    dailySpeed = (await db.query(`SELECT speed FROM daily_wind WHERE DATE(day) = '${day}';`))[0].speed
    previousSpeed = (await db.query(`SELECT speed FROM realtime_wind WHERE timestamps > '${day}' ORDER BY id DESC LIMIT 1;`))
    previousSpeed = previousSpeed.length ? previousSpeed[0].speed : dailySpeed

    dailyMin = dailySpeed - DAILY_DELTA < MIN_WIND ? MIN_WIND : dailySpeed - DAILY_DELTA
    dailyMax = dailySpeed + DAILY_DELTA > MAX_WIND ? MAX_WIND : dailySpeed + DAILY_DELTA

    realTimeMin = previousSpeed - REAL_TIME_DELTA < dailyMin ? dailyMin : previousSpeed - REAL_TIME_DELTA
    realTimeMax = previousSpeed + REAL_TIME_DELTA < dailyMax ? dailyMax : previousSpeed + REAL_TIME_DELTA

    speed = utils.randn_bm(realTimeMin, realTimeMax)

    db.query(`INSERT INTO realtime_wind (speed) VALUES (${speed});`)
}

exports.generateData = async () => {
    lastDay = await db.query(`SELECT DATE(day) AS day FROM daily_wind ORDER BY id DESC LIMIT 1;`)
    if(!lastDay.length) {
        await setDailyWind()
    } else {
        lastDay = lastDay[0].day
        currentDay = new Date().toISOString().slice(0, 10)
        if(lastDay != currentDay) {
            await setDailyWind()
        }
    }

    while(new Date().getSeconds() % 10) {}

    setInterval(async () => {
        date = new Date()
        if(!date.getHours() && !date.getMinutes() && date.getSeconds() < 10) {
            await setDailyWind()
        }
        setRealTimeWind()
    }, 10000)
}
