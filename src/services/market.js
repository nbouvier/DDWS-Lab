import db from '../database/database.js'

// Get the wind speed given a from value.
export async function modeledPrice(from = null) {
    if(from) {
        let date = new Date(from).toISOString().slice(0, 10)
        let hour = new Date(from).toLocaleString().slice(11, 20)

        from = date + hour
    }

    let modeled_price = await db.query(`SELECT price, UNIX_TIMESTAMP(timestamp) * 1000 AS timestamp FROM modeled_electricity_price ${from ? 'WHERE timestamp > ?' : ''};`, from ? [ from ] : [])

    return [modeled_price, null]
}

const market = { modeledPrice }

export default market
