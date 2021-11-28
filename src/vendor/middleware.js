export function guest(req, res, callbackSuccess, callbackFailed = null) {
    if(req.session.user_id) {
        if(callbackFailed) { callbackFailed() }
        else {
            req.session.messages = [
                { message: 'You cannot access this page as a logged user.', alert: 'danger' }
            ]

            res.redirect(`/`)
        }
    } else {
        callbackSuccess()
    }
}

export function user(req, res, callbackSuccess, callbackFailed = null) {
    if(!req.session.user_id) {
        if(callbackFailed) { callbackFailed() }
        else {
            req.session.messages = [
                { message: 'You cannot access this page as a guest.', alert: 'danger' }
            ]

            res.redirect(`/login`) }
    } else {
        callbackSuccess()
    }
}

const middleware = { guest, user }

export default middleware
