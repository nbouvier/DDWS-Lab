import express from 'express'

import middleware from '../src/vendor/middleware.js'
import authService from '../src/services/authentication.js'

const router = express.Router()

router.post('/login', (req, res, next) => {
    middleware.guest(req, res, async () => {
        // Data validation
        let [data, error] = await authService.login(req.body.email, req.body.password)

        if(error !== null) { res.status(200).json({ error: error }); return }

        req.session.user_id = data.id
        req.session.user_type = data.type

        res.status(200).json({
            result: true,
            message: 'Login succeed.'
        })
    }, false)
})

router.post('/register', (req, res, next) => {
    middleware.guest(req, res, async () => {
        // Data validation
        let [data, error] = await authService.register(req.body.first_name, req.body.last_name, req.body.email, req.body.password)

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
            result: true,
            message: 'Registration succeed.'
        })
    }, false)
})

router.get('/register', (req, res, next) => {
    middleware.guest(req, res, async () => {
        // Data validation
        let [data, error] = await authService.verifyEmail(req.query.hash)

        if(error !== null) { res.status(200).json({ error: error }); return }

        req.session.messages = [
            { message: 'You registered successfuly.', type: 'success' }
        ]

        res.redirect(`/login`)
    })
})

router.post('/init-reset-password', async (req, res, next) => {
    // Data validation
    let validatedData = {
        user_id: req.session.user_id ? req.session.user_id : null,
        email: req.body.email ? req.body.email : null
    }

    let [data, error] = await authService.initResetPassword(validatedData)

    if(error !== null) { res.status(200).json({ error: error }); return }

    res.status(200).json({
        result: true,
        message: 'You will receive an email to change your password.'
    })
})

router.post('/reset-password', async (req, res, next) => {
    // Data validation
    // req.body.password == req.body.password_confirmation ?

    let [data, error] = await authService.resetPassword(req.body.hash, req.body.password)

    if(error !== null) { res.status(200).json({ error: error }); return }

    res.status(200).json({
        result: true,
        message: 'Your password has been changed.'
    })
})

router.post('/logout', (req, res, next) => {
    middleware.user(req, res, () => {
        req.session.destroy(() => {
            res.redirect('/login')
        })
    }, false)
})

export default router
