import db from '../database/database.js'

import User from '../class/user.js'

// Get a User given its ID.
export async function get(userID) {
    let user = await db.loadOne(User, userID)

    if(!user) { return [false, 'User does not exists.'] }

    return [user, null]
}

// Get every Users in the database.
export async function getAll() {
    let users = await db.loadAll(User)

    return [users, null]
}

// Get a User given its house id.
export async function getFromHouse(houseID) {
    let user = (await db.loadWhere(User, 'house_id = ?', [ houseID ]))[0]

    if(!user) { return [false, 'User does not exists.'] }

    return [user, null]
}

// Update a User given its ID using newData as data to update.
// newData should be an object with <attribute>: <value> pairs.
export async function update(userID, newData) {
    if(newData.email) {
        let checkMail = await db.loadWhere(User, 'email = ? AND id != ?', [newData.email, userID])

        if(checkMail.length) {
            return [false, 'Email is already used.']
        }

        // SEND EMAIL FOR EMAIL MODIFICATION
    }

    let user = await db.loadOne(User, userID)

    if(!user) { return [false, 'User does not exists.'] }

    Object.entries(newData).forEach(([k, v]) => { user[k] = v })

    if(!(await db.update(User, user))) {
        return [false, 'An error occured while updating the user.']
    }

    return [user, null]
}

// Block a user for a specific period of time.
// timeUnit can either be "m", "h", "d" or "w" for respectively "minutes",
// "hours", "days" and "weeks".
export async function block(userID, time, timeUnit) {
    let user = await db.loadOne(User, userID)

    if(!user) { return [false, 'User does not exists.'] }

    if(user.isAdmin()) { return [false, 'The user can\'t be block.'] }

    switch(timeUnit) {
        case "m": time *= 1000 * 60; break
        case "h": time *= 1000 * 60 * 60; break
        case "d": time *= 1000 * 60 * 60 * 24; break
        case "w": time *= 1000 * 60 * 60 * 24 * 7; break
        default: return [false, 'Invalid time unit value.']
    }

    if(!(await user.block(time))) {
        return [false, 'An error occured while blocking the user.']
    }

    return [true, null]
}

// Delete a user given its ID.
// Admins can't be deleted.
export async function del(userID) {
    let user = await db.loadOne(User, userID)

    if(!user) { return [false, 'User does not exists.'] }

    if(user.isAdmin()) { return [false, 'The user can\'t be delete.'] }

    if(!(await db.del(User, userID))) {
        return [false, 'An error occured while deleting the user.']
    }

    return [true, null]
}

const user = { get, getAll, getFromHouse, update, block, del }

export default user
