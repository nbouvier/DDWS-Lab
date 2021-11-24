import db from '../database/database.js'

import User from '../class/user.js'

export async function get(userID) {
    let user = await db.loadOne(User, userID)

    // User does not exist
    if(!user) { return false }

    return user
}

const user = { get }

export default user
