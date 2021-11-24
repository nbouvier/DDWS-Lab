import express from 'express'

import middleware from '../src/vendor/middleware.js'
import auth from '../src/services/authentication.js'

const router = express.Router()

router.post('/login', (req, res, next) => {
    middleware.guest(req, res, async () => {
        // Data validation
        let [data, error] = await auth.login(req.body.email, req.body.password)

        if(data === false) { res.status(200).json({ error: error }); return }

        req.session.user_id = data.id
        req.session.user_type = data.type

        res.status(200).json({
            result: true,
            message: 'Login succeed.'
        })
    }, () => res.status(401).json({ error: 'Already logged in.' }))
})

router.post('/register', (req, res, next) => {
    middleware.guest(req, res, async () => {
        // Data validation
        let [data, error] = await auth.register(req.body.first_name, req.body.last_name, req.body.email, req.body.password)

        if(data === false) { res.status(200).json({ error: error }); return }

        res.status(200).json({
            result: true,
            message: 'Registration succeed.'
        })
    }, () => res.status(401).json({ error: 'Need to logout.' }))
})

router.get('/register/:hash', (req, res, next) => {
    middleware.guest(req, res, async () => {
        // Data validation
        let [data, error] = await auth.verifyEmail(req.params.hash)
        // Redirect with error message
        if(data === false) { res.redirect('/login'); return }
        // Redirect with success message
        res.redirect('/login')
    })
})

router.post('/initResetPassword', async (req, res, next) => {
    // Data validation
    let [data, error] = await auth.initResetPassword(req.query.email)

    if(data === false) { res.status(200).json({ error: error }); return }

    res.status(200).json({
        result: true,
        message: 'You will receive an email to change your password.'
    })
})

router.post('/resetPassword', async (req, res, next) => {
    // Data validation
    let [data, error] = await auth.resetPassword(req.body.hash, req.body.old_password, req.body.new_password)

    if(data === false) { res.status(200).json({ error: error }); return }

    res.status(200).json({
        result: true,
        message: 'Your password have been changed.'
    })
})

router.post('/logout', (req, res, next) => {
    middleware.user(req, res, () => {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    }, () => res.status(401).json({ error: 'Already logged out.' }))
})

export default router
