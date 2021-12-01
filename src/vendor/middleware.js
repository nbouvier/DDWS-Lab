import { ADMIN, PROSUMER } from '../class/user.js'

export function guest(req, res, callbackSuccess, callbackFail = true) {
    if(req.session.user_id) {
        if(typeof callbackFail == 'function') { callbackFail() }
        else if(!callbackFail) {
            res.status(401).json({ error: 'You cannot access this page as a logged user.' })
        } else {
            req.session.messages = [
                { message: 'You cannot access this page as a logged user.', alert: 'danger' }
            ]

            res.redirect(`/`)
        }
    } else {
        callbackSuccess()
    }
}

export function user(req, res, callbackSuccess, callbackFail = true) {
    if(!req.session.user_id) {
        if(typeof callbackFail == 'function') { callbackFail() }
        else if(!callbackFail) {
            res.status(401).json({ error: 'You cannot access this page as a guest.' })
        } else {
            req.session.messages = [
                { message: 'You cannot access this page as a guest.', alert: 'danger' }
            ]

            res.redirect(`/login`) }
    } else {
        callbackSuccess()
    }
}

export function admin(req, res, callbackSuccess, callbackFail = true) {
    if(!req.session.user_type == ADMIN) {
        if(typeof callbackFail == 'function') { callbackFail() }
        else if(!callbackFail) {
            res.status(401).json({ error: 'You do not have permission to access this page.' })
        } else {
            req.session.messages = [
                { message: 'You do not have permission to access this page.', alert: 'danger' }
            ]

            res.redirect(`/profile`) }
    } else {
        callbackSuccess()
    }
}

export function prosumer(req, res, callbackSuccess, callbackFail = true) {
    if(!req.session.user_type == PROSUMER) {
        if(typeof callbackFail == 'function') { callbackFail() }
        else if(!callbackFail) {
            res.status(401).json({ error: 'You do not have permission to access this page.' })
        } else {
            req.session.messages = [
                { message: 'You do not have permission to access this page.', alert: 'danger' }
            ]

            res.redirect(`/profile`) }
    } else {
        callbackSuccess()
    }
}

const middleware = { guest, user, admin, prosumer }

export default middleware
