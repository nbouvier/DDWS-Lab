import express from 'express'

import middleware from '../src/vendor/middleware.js'

const router = express.Router()

// ========== Auth views ========== //

router.get('/login', (req, res, next) => { middleware.guest(req, res, () => res.render('login')) })
router.get('/register', (req, res, next) => { middleware.guest(req, res, () => res.render('register')) })
router.get('/resetPassword/:hash', (req, res, next) => { middleware.guest(req, res, () => res.render('resetPassword')) })

// ========== App views ========== //

router.get('/', async (req, res, next) => { middleware.user(req, res, () => res.render('home')) })

router.get('/profile', (req, res, next) => {
    middleware.user(req, res, () => {
        let data = { user_id: req.session.user_id }
        res.render('profile', data)
    })
})

export default router
