import express from 'express'

import middleware from '../src/vendor/middleware.js'
import userService from '../src/services/user.js'

const router = express.Router()

router.post('/get', (req, res, next) => {
    middleware.user(req, res, async () => {
        // Data validation
        let [data, error] = await userService.get(req.session.user.id)

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: { user: await data.serialize() },
           message: ''
        })
    }, false)
})

router.post('/one', (req, res, next) => {
    middleware.user(req, res, async () => {
        // Data validation
        let [data, error] = await userService.get(req.body.id)

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: { user: await data.serialize() },
           message: ''
        })
    }, false)
})

router.post('/all', (req, res, next) => {
    middleware.user(req, res, async () => {
        // Data validation
        let [data, error] = await userService.getAll()

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: { users: await Promise.all(data.map(async user => await user.serialize())) },
           message: ''
        })
    }, false)
})

router.post('/from-house', async (req, res, next) => {
    middleware.admin(req, res, async () => {
        // Data validation
        let [data, error] = await userService.getFromHouse(req.body.id)

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: { user: data },
           message: ''
        })
    })
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

        let [data, error] = await userService.update(req.session.user.id, validatedData)

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: { user: await data.serialize() },
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

        let [data, error] = await userService.update(req.session.user.id, validatedData)

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: { user: await data.serialize() },
           message: 'Your security data have been updated.'
        })
    }, false)
})

router.post('/block', (req, res, next) => {
    middleware.admin(req, res, async () => {
        // Data validation
        let [data, error] = await userService.block(req.body.user_id, req.body.time,req.body.time_unit)

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: true,
           message: 'User has been blocked successfuly.'
        })
    }, false)
})

router.post('/delete', (req, res, next) => {
    middleware.admin(req, res, async () => {
        // Data validation
        let [data, error] = await userService.del(req.body.user_id)

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: true,
           message: 'User has been deleted successfuly.'
        })
    }, false)
})

export default router
