import db from '../database/database.js'

// Get the wind speed given a from value.
export async function wind(houseID, from = null) {
    if(from) {
        let date = new Date(from).toISOString().slice(0, 10)
        let hour = new Date(from).toLocaleString().slice(11, 20)

        from = date + hour
    }

    let wind = await db.query(`SELECT speed, UNIX_TIMESTAMP(timestamp) * 1000 AS timestamp FROM wind ${from ? 'WHERE timestamp > ?' : ''};`, from ? [ from ] : [])

    return [wind, null]
}

const weather = { wind }

export default weather
