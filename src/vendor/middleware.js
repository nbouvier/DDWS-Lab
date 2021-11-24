export function guest(req, res, callbackSuccess, callbackFailed = null) {
    if(req.session.user_id) {
        if(callbackFailed) { callbackFailed() }
        else { res.redirect('/') }
    } else {
        callbackSuccess()
    }
}

export function user(req, res, callbackSuccess, callbackFailed = null) {
    if(!req.session.user_id) {
        if(callbackFailed) { callbackFailed() }
        else { res.redirect('/login') }
    } else {
        callbackSuccess()
    }
}

const middleware = { guest, user }

export default middleware
