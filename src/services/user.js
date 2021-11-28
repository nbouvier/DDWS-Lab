import db from '../database/database.js'

import User from '../class/user.js'

// Get a User given its ID.
export async function get(userID) {
    let user = await db.loadOne(User, userID)

    // User does not exist
    if(!user) { return [false, 'User does not exists.'] }

    return [user, null]
}

// Get every Users in the database.
export async function getAll() {
    let users = await db.loadAll(User)

    return [users, null]
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

    // User does not exist
    if(!user) { return [false, 'User does not exists.'] }

    Object.entries(newData).forEach(([k, v]) => { user[k] = v })

    if(!(await db.update(User, user))) {
        return [false, 'An error occured while updating the user.']
    }

    return [true, null]
}

const user = { get, getAll, update }

export default user
