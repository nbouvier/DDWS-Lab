import fetcher from '../vendor/fetcher.js'

import db from '../database/database.js'

import houseService from './house.js'

// Get the price of electricity.
export async function setPrice(price) {
    // Should create an "insert" function in db
    try {
        await db.query('INSERT INTO electricity_price (price) VALUES (?);', [ price ])
    } catch(error) {
        console.log(error)
        return [false, 'An error occured.']
    }

    return [price, null]
}

// Get the price of electricity.
export async function price(from = null) {
    if(from) {
        let date = new Date(from).toISOString().slice(0, 10)
        let hour = new Date(from).toLocaleString().slice(11, 20)

        from = date + hour
    }

    let price = await db.query(`SELECT price, UNIX_TIMESTAMP(timestamp) * 1000 AS timestamp FROM electricity_price ${from ? 'WHERE timestamp > ?' : ''};`, from ? [ from ] : [])

    return [price, null]
}

// Get the modeled price of electricity.
export async function modeledPrice(from = null) {
    if(from) {
        let date = new Date(from).toISOString().slice(0, 10)
        let hour = new Date(from).toLocaleString().slice(11, 20)

        from = date + hour
    }

    let modeledPrice = await db.query(`SELECT price, UNIX_TIMESTAMP(timestamp) * 1000 AS timestamp FROM modeled_electricity_price ${from ? 'WHERE timestamp > ?' : ''};`, from ? [ from ] : [])

    return [modeledPrice, null]
}

// Get market orders.
export async function orders(from = null) {
    let orders = await db.query('SELECT action, house_id, amount, price, timestamp FROM market_transaction ORDER BY timestamp DESC;')
    for(let i=0; i<orders.length; i++) {
        let data = await fetcher.fetchFromService('/api/user/from-house', { id: orders[i].house_id })
        delete orders[i].house_id

        if(data.error) { continue }

        orders[i].user = data.result.user.email
    }
    
    return [orders, null]
}

// Sell a specific amount of kW from the house's buffer at current market price.
export async function sell(amount, houseID) {
    let [data, error] = await fetcher.fetchFromService('/api/house/one', { id: houseID })

    if(error !== null) { return [false, error] }

    let bufferID = data.result.house.buffer.id
    [data, error] = await fetcher.fetchFromService('/api/house/empty-buffer', { id: bufferID })

    if(error !== null) { return [false, error] }

    amount = data.result.emptied_amount
    let price = (await db.query('SELECT price FROM electricity_price ORDER BY timestamp DESC LIMIT 1;'))[0].price
    price = price * amount

    db.query('INSERT INTO market_transaction (action, house_id, amount, price) VALUES (\'Sell\', ?, ?, ?);', [ houseID, amount, price ])

    return [data.result.emptied_amount, null]
}

// Buy a specific amount of kW at current market price and send it to the house's buffer.
export async function buy(amount, houseID) {
    let [data, error] = await fetcher.fetchFromService('/api/house/one', { id: houseID })

    if(error !== null) { return [false, error] }

    let bufferID = data.result.house.buffer.id
    [data, error] = await fetcher.fetchFromService('/api/house/fill-buffer', { id: bufferID })

    if(error !== null) { return [false, error] }

    amount = data.result.filled_amount
    let price = (await db.query('SELECT price FROM electricity_price ORDER BY timestamp DESC LIMIT 1;'))[0].price
    price = price * amount

    db.query('INSERT INTO market_transaction (action, house_id, amount, price) VALUES (\'Buy\', ?, ?, ?);', [ houseID, amount, price ])

    return [data.result.filled_amount, null]
}

const market = { setPrice, price, modeledPrice, orders, sell, buy }

export default market
