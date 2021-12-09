import fetcher from '../vendor/fetcher.js'

import db from '../database/database.js'

import houseService from './house.js'

// Get the modeled price of electricity.
export async function modeledPrice(from = null) {
    if(from) {
        let date = new Date(from).toISOString().slice(0, 10)
        let hour = new Date(from).toLocaleString().slice(11, 20)

        from = date + hour
    }

    let modeled_price = await db.query(`SELECT price, UNIX_TIMESTAMP(timestamp) * 1000 AS timestamp FROM modeled_electricity_price ${from ? 'WHERE timestamp > ?' : ''};`, from ? [ from ] : [])

    return [modeled_price, null]
}

// Sell a specific amount of kW from the house's buffer at current market price.
export async function sell(amount, houseID) {
    let [data, error] = await fetcher.fetchFromService('api/house/get', { id: houseID })

    if(error !== null) { return [false, error] }

    let bufferID = data.result.house.buffer.id
    [data, error] = await fetcher.fetchFromService('api/house/empty-buffer', { id: bufferID })

    if(error !== null) { return [false, error] }

    amount = data.result.emptied_amount
    let price = (await db.query('SELECT price FROM electricity_price ORDER BY timestamp DESC LIMIT 1;'))[0].price
    price = price * amount

    db.query('INSERT INTO market_transaction (buffer_id, amount, price) VALUES (?, ?, ?);', [ bufferID, amount, price ])

    return [data.result.emptied_amount, null]
}

// Buy a specific amount of kW at current market price and send it to the house's buffer.
export async function buy(amount, houseID) {
    let [data, error] = await fetcher.fetchFromService('api/house/get', { id: houseID })

    if(error !== null) { return [false, error] }

    let bufferID = data.result.house.buffer.id
    [data, error] = await fetcher.fetchFromService('api/house/fill-buffer', { id: bufferID })

    if(error !== null) { return [false, error] }

    amount = data.result.filled_amount
    let price = (await db.query('SELECT price FROM electricity_price ORDER BY timestamp DESC LIMIT 1;'))[0].price
    price = price * amount

    db.query('INSERT INTO market_transaction (buffer_id, amount, price) VALUES (?, ?, ?);', [ bufferID, amount, price ])

    return [data.result.filled_amount, null]
}

const market = { modeledPrice }

export default market
