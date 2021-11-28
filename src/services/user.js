import db from '../database/database.js'

import User from '../class/user.js'

export async function get(userID) {
    let user = await db.loadOne(User, userID)

    // User does not exist
    if(!user) { return [false, 'User does not exists.'] }

    return [user, null]
}

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

const user = { get, update }

export default user
