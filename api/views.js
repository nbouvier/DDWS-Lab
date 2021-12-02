import express from 'express'

import middleware from '../src/vendor/middleware.js'
import user from '../src/services/user.js'
import coalPowerPlant from '../src/services/coalPowerPlant.js'

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

        let [data, error] = await user.get(req.session.user_id)

        let asset = {}
        if(error === null) {
            if(data.isAdmin()) {
                let [data, error] = await coalPowerPlant.get(1)

                if(error === null) { asset.coal_power_plant_id = data.id }
                else { messages.push({ message: error, type: 'danger' }) }
            } else { asset.house_id = (await data.houses())[0] }
        } else { messages.push({ message: error, type: 'danger' }) }

        res.render('home', {
            user_type: req.session.user_type,
            messages: messages,
            ...asset
        })
    })
})

router.get('/electricity-managment', (req, res, next) => {
    middleware.user(req, res, async () => {
        let [data, error] = await user.get(req.session.user_id)

        let asset = {}
        if(error === null) {
            if(data.isAdmin()) {
                let [data, error] = await coalPowerPlant.get(1)

                if(error === null) { asset.coal_power_plant_id = data.id }
                else { messages.push({ message: error, type: 'danger' }) }
            } else { asset.house_id = (await data.houses())[0] }
        } else { messages.push({ message: error, type: 'danger' }) }

        res.render(`electricityManagment-${req.session.user_type}`, {
            user_id: req.session.user_id,
            user_type: req.session.user_type,
            ...asset
        })
    })
})

router.get('/profile', (req, res, next) => {
    middleware.user(req, res, () => {
        res.render('profile', {
            user_id: req.session.user_id,
            user_type: req.session.user_type
        })
    })
})

router.get('/admin', (req, res, next) => {
    middleware.user(req, res, () => {
        res.render('admin', {
            user_type: req.session.user_type
        })
    })
})

export default router
