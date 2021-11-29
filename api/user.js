import express from 'express'

import middleware from '../src/vendor/middleware.js'
import user from '../src/services/user.js'

const router = express.Router()

router.post('/get', (req, res, next) => {
    middleware.user(req, res, async () => {
        // Data validation
        let [data, error] = await user.get(req.session.user_id)

        if(data === false) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: { user: data.serialize() },
           message: ''
        })
    }, false)
})

router.post('/one/:user_id', (req, res, next) => {
    middleware.user(req, res, async () => {
        // Data validation
        let [data, error] = await user.get(req.params.user_id)

        if(data === false) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: { user: data.serialize() },
           message: ''
        })
    }, false)
})

router.post('/all', (req, res, next) => {
    middleware.user(req, res, async () => {
        // Data validation
        let [data, error] = await user.getAll()

        if(data === false) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: { users: data.map(user => user.serialize()) },
           message: ''
        })
    }, false)
})

router.post('/update-profile', (req, res, next) => {
    middleware.user(req, res, async () => {
        // Data validation
        let validatedData = {
            name: req.body.name,
            forename: req.body.forename,
            address: req.body.address,
            additional_address: req.body.additional_address,
            city: req.body.city,
            zip_code: req.body.zip_code
        }

        let [data, error] = await user.update(req.session.user_id, validatedData)

        if(data === false) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: true,
           message: 'Your profile data have been updated.'
        })
    }, false)
})

router.post('/update-security', (req, res, next) => {
    middleware.user(req, res, async () => {
        // Data validation
        let validatedData = {
            email: req.body.email
        }

        let [data, error] = await user.update(req.session.user_id, validatedData)

        if(data === false) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: true,
           message: 'Your security data have been updated.'
        })
    }, false)
})

router.post('/block', (req, res, next) => {
    middleware.admin(req, res, async () => {
        // Data validation
        let [data, error] = await user.block(req.body.user_id, req.body.time,req.body.time_unit)

        if(data === false) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: true,
           message: 'User has been blocked successfuly.'
        })
    }, false)
})

router.post('/delete', (req, res, next) => {
    middleware.admin(req, res, async () => {
        // Data validation
        let [data, error] = await user.del(req.body.user_id)

        if(data === false) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: true,
           message: 'User has been deleted successfuly.'
        })
    }, false)
})

export default router
