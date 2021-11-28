import express from 'express'

import middleware from '../src/vendor/middleware.js'

const router = express.Router()

// ========== Auth views ========== //

router.get('/login', (req, res, next) => {
    middleware.guest(req, res, () => {
        let data = {
            messages: req.session.messages
        }

        req.session.messages = []

        res.render('login', data)
    })
})

router.get('/register', (req, res, next) => { middleware.guest(req, res, () => res.render('register')) })

router.get('/reset-password', (req, res, next) => {
    let data = {
        hash: req.query.hash
    }

    res.render('resetPassword', data)
})

// ========== App views ========== //

router.get('/', async (req, res, next) => {
    middleware.user(req, res, () => {
        let data = {
            user_type: req.session.user_type,
            messages: req.session.messages
        }

        req.session.messages = []

        res.render('home', data)
    })
})

router.get('/profile', (req, res, next) => {
    middleware.user(req, res, () => {
        let data = {
            user_id: req.session.user_id,
            user_type: req.session.user_type
        }

        res.render('profile', data)
    })
})

router.get('/admin', (req, res, next) => {
    middleware.user(req, res, () => {
        let data = {
            user_type: req.session.user_type
        }

        res.render('admin', data)
    })
})

export default router
