import db from '../database/database.js'

import House from '../class/house.js'
import Buffer from '../class/buffer.js'

// Get a House given its ID.
export async function get(houseID) {
    let house = await db.loadOne(House, houseID)

    if(!house) { return [false, 'House does not exists.'] }

    return [house, null]
}

// Update a House given its ID using newData as data to update.
// newData should be an object with <attribute>: <value> pairs.
export async function update(houseID, newData) {
    let house = await db.loadOne(House, houseID)

    if(!house) { return [false, 'House does not exists.'] }

    Object.entries(newData).forEach(([k, v]) => { house[k] = v })

    if(!(await db.update(House, house))) {
        return [false, 'An error occured while updating the house.']
    }

    return [house, null]
}

// Get a house production given its ID and a from value.
export async function production(houseID, from = null) {
    let house = await db.loadOne(House, houseID)

    if(!house) { return [false, 'House does not exists.'] }

    if(from) {
        let date = new Date(from).toISOString().slice(0, 10)
        let hour = new Date(from).toLocaleString().slice(11, 20)

        from = date + hour
    }

    return [await house.production(from), null]
}

// Get a house consumption given its ID and a from value.
export async function consumption(houseID, from = null) {
    let house = await db.loadOne(House, houseID)

    if(!house) { return [false, 'House does not exists.'] }

    if(from) {
        let date = new Date(from).toISOString().slice(0, 10)
        let hour = new Date(from).toLocaleString().slice(11, 20)

        from = date + hour
    }

    return [await house.consumption(from), null]
}

// Fill a buffer given its ID and a filling amount
export async function fillBuffer(bufferID, amount) {
    let buffer = await db.loadOne(Buffer, bufferID)

    if(!buffer) { return [false, 'Buffer does not exists.'] }

    let filledAmount = buffer.fill(amount)

    if(!(await db.update(Buffer, buffer))) {
        return [false, 'An error occured while updating the buffer.']
    }

    return [filledAmount, null]
}

// Empty a buffer given its ID and an emptying amount
export async function emptyBuffer(bufferID, amount) {
    let buffer = await db.loadOne(Buffer, bufferID)

    if(!buffer) { return [false, 'Buffer does not exists.'] }

    let emptiedAmount = buffer.empty(amount)

    if(!(await db.update(Buffer, buffer))) {
        return [false, 'An error occured while updating the buffer.']
    }

    return [emptiedAmount, null]
}

const house = { get, update, production, consumption, fillBuffer, emptyBuffer }

export default house
