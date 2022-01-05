import express from 'express'

import middleware from '../src/vendor/middleware.js'
import userService from '../src/services/user.js'

const router = express.Router()

// ========== Auth views ========== //

router.get('/login', (req, res, next) => {
    middleware.guest(req, res, () => {
        let messages = req.session.messages
        req.session.messages = []

        res.render('login', {
            messages: messages
        })
    })
})

router.get('/register', (req, res, next) => {
    middleware.guest(req, res, () => {
        res.render('register')
    })
})

router.get('/init-reset-password', (req, res, next) => {
    res.render('initResetPassword')
})

router.get('/reset-password', (req, res, next) => {
    res.render('resetPassword', {
        hash: req.query.hash
    })
})

// ========== App views ========== //

router.get('/', (req, res, next) => {
    middleware.user(req, res, async () => {
        let messages = req.session.messages
        req.session.messages = []

        let [user, error] = await userService.get(req.session.user.id)

        let asset = {}
        if(error !== null) { messages.push({ message: error, type: 'danger' }) }
        else { asset = user.getAssetID() }

        res.render('home', {
            user: req.session.user,
            messages: messages,
            ...asset
        })
    })
})

router.get('/electricity-managment', (req, res, next) => {
    middleware.user(req, res, async () => {
        let messages = req.session.messages
        req.session.messages = []

        let [user, error] = await userService.get(req.session.user.id)

        let asset = {}
        if(error !== null) { messages.push({ message: error, type: 'danger' }) }
        else { asset = user.getAssetID() }

        res.render(`electricityManagment-${req.session.user.type}`, {
            user: req.session.user,
            messages: messages,
            ...asset
        })
    })
})

router.get('/electricity-managment/:user_id', (req, res, next) => {
    middleware.user(req, res, async () => {
        let messages = req.session.messages
        req.session.messages = []

        let [user, error] = await userService.get(req.params.user_id)

        let asset = {}
        if(error !== null) { messages.push({ message: error, type: 'danger' }) }
        else { asset = user.getAssetID() }

        res.render('electricityManagment-prosumer', {
            user: req.session.user,
            preview_user: user.id,
            messages: messages,
            ...asset
        })
    })
})

router.get('/market', (req, res, next) => {
    middleware.user(req, res, async () => {
        let messages = req.session.messages
        req.session.messages = []

        let [user, error] = await userService.get(req.session.user.id)

        let asset = {}
        if(error !== null) { messages.push({ message: error, type: 'danger' }) }
        else { asset = user.getAssetID() }

        res.render(`market-${req.session.user.type}`, {
            user: req.session.user,
            messages: messages,
            ...asset
        })
    })
})

router.get('/profile', (req, res, next) => {
    middleware.user(req, res, () => {
        res.render('profile', {
            user: req.session.user
        })
    })
})

router.get('/profile/:user_id', (req, res, next) => {
    middleware.admin(req, res, async () => {
        let [user, error] = await userService.get(req.params.user_id)

        if(error !== null) {
            req.session.messages.push({ message: error, type: 'danger' })
            res.redirect('/admin')
            return
        }

        res.render('profile', {
            user: req.session.user,
            preview_user: user
        })
    })
})

router.get('/admin', (req, res, next) => {
    middleware.user(req, res, () => {
        res.render('admin', {
            user: req.session.user
        })
    })
})

export default router
