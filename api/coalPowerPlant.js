import express from 'express'

import middleware from '../src/vendor/middleware.js'
import coalPowerPlant from '../src/services/coalPowerPlant.js'

const router = express.Router()

router.post('/one', (req, res, next) => {
    middleware.admin(req, res, async () => {
        // Data validation
        let [data, error] = await coalPowerPlant.get(req.body.id)

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: { coal_power_plant: await data.serialize() },
           message: ''
        })
    }, false)
})

router.post('/production', (req, res, next) => {
    middleware.admin(req, res, async () => {
        // Data validation
        let from = req.body.from ? parseInt(req.body.from) : null

        let [data, error] = await coalPowerPlant.production(req.body.id, from)

        if(error !== null) { res.status(200).json({ error: error }); return }

        data = data.map(entry => [ entry.timestamp, entry.production ])

        res.status(200).json({
           result: { production: data },
           message: ''
        })
    }, false)
})

router.post('/update-production', (req, res, next) => {
    middleware.admin(req, res, async () => {
        // Data validation
        let validatedData = {
            buffer_percentage: req.body.buffer_percentage
        }

        let [data, error] = await coalPowerPlant.update(req.body.id, validatedData)

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: { coal_power_plant: await data.serialize() },
           message: 'Production data has been updated.'
        })
    }, false)
})

export default router
