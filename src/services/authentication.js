import mailer from '../vendor/mailer.js'
import crypto from '../vendor/crypto.js'

import db from '../database/database.js'

import User, { PROSUMER } from '../class/user.js'

// Duration of hash validity in minutes
const hashDuration = 30

// Check if the login details match a user.
export async function login(email, password) {
    password = crypto.encrypt(password)
    let user = await db.loadWhere(User, 'email = ? AND password = ?', [email, password])

    if(!user.length) {
        return [false, 'Wrongs ids.']
    }

    return [user[0], null]
}

// Create the user and add a new line in the registration table.
// Send an email.
export async function register(name, forename, email, password) {
    let checkMail = await db.loadWhere(User, 'email = ?', [email])

    if(checkMail.length) {
        return [false, 'Email is already used.']
    }

    password = crypto.encrypt(password)
    let user = new User(PROSUMER, name, forename, email, password)
    user = await db.create(User, user)

    let hash = crypto.encrypt(email, 'sha1')
    db.query(`INSERT INTO registration (user_id, hash) VALUES (${user.id}, '${hash}');`)

    mailer.sendMail(user.email, 'Registration', `Hash: ${hash}`)

    return [true, null]
}

// Check if the registration is still valid.
// In case it is, delete the registration line to give access to the user.
export async function verifyEmail(hash) {
    let registerEntry = await db.query('SELECT * FROM registration WHERE hash = ?;', [hash])
    if(!registerEntry.length) {
        return [false, 'No registration request found. Request might have expire.']
    }

    db.query(`DELETE FROM registration WHERE hash = ?;`, [hash])

    return [true, null]
}

// Create a line in the reset_password table.
// Send an email
export async function initResetPassword(data) {
    let user
    if(data.user_id) {
        user = await db.loadOne(User, data.user_id)
    } else {
        user = (await db.loadWhere(User, 'email = ?', [email]))[0]
    }

    let randomString = Math.random().toString(36).replace(/[^a-z]+/g, '')
    let hash = crypto.encrypt(randomString, 'sha1')
    db.query(`INSERT INTO reset_password (user_id, hash) VALUES (${user.id}, '${hash}');`)

    mailer.sendMail(user.email, 'Reset password', `Hash: ${hash}`)

    return [true, null]
}

// Change the user's password and delete the reset_password line if the oldPassword
// matches the current password and if the password reset is still pending.
// Send an email.
export async function resetPassword(hash, password) {
    let resetPasswordEntry = await db.query('SELECT * FROM reset_password WHERE hash = ?;', [hash])
    if(!resetPasswordEntry.length) {
        return [false, 'No reset password request found. Request might have expire.']
    }

    let userID = (await db.query('SELECT user_id FROM reset_password WHERE hash = ?;', [hash]))[0].user_id
    let user = await db.loadOne(User, userID)

    if(!user) {
        return [false, 'User does not exists.']
    }

    user.password = crypto.encrypt(password)
    db.update(User, user)

    db.query(`DELETE FROM reset_password WHERE hash = ?;`, [hash])

    mailer.sendMail(user.email, 'Password changed', 'Your password have been changed.')

    return [true, null]
}

const auth = { login, register, verifyEmail, initResetPassword, resetPassword }

export default auth
