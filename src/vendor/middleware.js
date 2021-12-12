import { ADMIN, PROSUMER } from '../class/user.js'

// req.body.source == 'server' is used as a bypass for services to communicate
// this should be improved using cryptography

export function guest(req, res, callbackSuccess, callbackFail = true) {
    if(req.session.user) {
        if(typeof callbackFail == 'function') { callbackFail() }
        else if(!callbackFail) {
            res.status(401).json({ error: 'You cannot access this page as a logged user.' })
        } else {
            req.session.messages = [
                { message: 'You cannot access this page as a logged user.', type: 'danger' }
            ]

            res.redirect(`/`)
        }
    } else { callbackSuccess() }
}

export function user(req, res, callbackSuccess, callbackFail = true) {
    if(!req.session.user && req.body.source != 'server') {
        if(typeof callbackFail == 'function') { callbackFail() }
        else if(!callbackFail) {
            res.status(401).json({ error: 'You cannot access this page as a guest.' })
        } else {
            req.session.messages = [
                { message: 'You cannot access this page as a guest.', type: 'danger' }
            ]

            res.redirect(`/login`) }
    } else { callbackSuccess() }
}

export function admin(req, res, callbackSuccess, callbackFail = true) {
    if((!req.session.user || req.session.user.type != ADMIN) && req.body.source != 'server') {
        if(typeof callbackFail == 'function') { callbackFail() }
        else if(!callbackFail) {
            res.status(401).json({ error: 'You do not have permission to access this page.' })
        } else {
            req.session.messages = [
                { message: 'You do not have permission to access this page.', type: 'danger' }
            ]

            res.redirect(`/profile`) }
    } else { callbackSuccess() }
}

export function prosumer(req, res, callbackSuccess, callbackFail = true) {
    if((!req.session.user || req.session.user.type != PROSUMER) && req.body.source != 'server') {
        if(typeof callbackFail == 'function') { callbackFail() }
        else if(!callbackFail) {
            res.status(401).json({ error: 'You do not have permission to access this page.' })
        } else {
            req.session.messages = [
                { message: 'You do not have permission to access this page.', type: 'danger' }
            ]

            res.redirect(`/profile`) }
    } else { callbackSuccess() }
}

const middleware = { guest, user, admin, prosumer }

export default middleware
