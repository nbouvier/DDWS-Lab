import express from 'express'

import middleware from '../src/vendor/middleware.js'
import coalPowerPlantService from '../src/services/coalPowerPlant.js'

const router = express.Router()

router.post('/one', (req, res, next) => {
    middleware.admin(req, res, async () => {
        // Data validation
        let [data, error] = await coalPowerPlantService.get(req.body.id)

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

        let [data, error] = await coalPowerPlantService.production(req.body.id, from)

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

        let [data, error] = await coalPowerPlantService.update(req.body.id, validatedData)

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: { coal_power_plant: await data.serialize() },
           message: 'Production data has been updated.'
        })
    }, false)
})

router.post('/stop', (req, res, next) => {
    middleware.admin(req, res, async () => {
        // Data validation
        let [data, error] = await coalPowerPlantService.update(req.body.id, { running: 0 })

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: true,
           message: 'Stopped coal power plant.'
        })
    }, false)
})

router.post('/start', (req, res, next) => {
    middleware.admin(req, res, async () => {
        // Data validation
        let [data, error] = await coalPowerPlantService.update(req.body.id, { running: 1 })

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: true,
           message: 'Started coal power plant.'
        })
    }, false)
})

export default router
