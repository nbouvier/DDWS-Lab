import express from 'express'

import middleware from '../src/vendor/middleware.js'
import houseService from '../src/services/house.js'

const router = express.Router()

router.post('/one', (req, res, next) => {
    middleware.user(req, res, async () => {
        // Data validation
        let [data, error] = await houseService.get(req.body.id)

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: { house: await data.serialize() },
           message: ''
        })
    }, false)
})

router.post('/production', (req, res, next) => {
    middleware.user(req, res, async () => {
        // Data validation
        let from = req.body.from ? parseInt(req.body.from) : null

        let [data, error] = await houseService.production(req.body.id, from)

        if(error !== null) { res.status(200).json({ error: error }); return }

        data = data.map(entry => [ entry.timestamp, entry.production ])

        res.status(200).json({
           result: { production: data },
           message: ''
        })
    }, false)
})

router.post('/consumption', (req, res, next) => {
    middleware.user(req, res, async () => {
        // Data validation
        let from = req.body.from ? parseInt(req.body.from) : null

        let [data, error] = await houseService.consumption(req.body.id, from)

        if(error !== null) { res.status(200).json({ error: error }); return }

        data = data.map(entry => [ entry.timestamp, entry.consumption ])

        res.status(200).json({
           result: { consumption: data },
           message: ''
        })
    }, false)
})

router.post('/update-excessive-production', (req, res, next) => {
    middleware.user(req, res, async () => {
        // Data validation
        let validatedData = {
            to_buffer_percentage: req.body.to_buffer_percentage
        }

        let [data, error] = await houseService.update(req.body.id, validatedData)

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: { house: await data.serialize() },
           message: 'Excessive production data has been updated.'
        })
    }, false)
})

router.post('/update-under-production', (req, res, next) => {
    middleware.user(req, res, async () => {
        // Data validation
        let validatedData = {
            from_buffer_percentage: req.body.from_buffer_percentage
        }

        let [data, error] = await houseService.update(req.body.id, validatedData)

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: { house: await data.serialize() },
           message: 'Under-production data has been updated.'
        })
    }, false)
})

router.post('/fill-buffer', async (req, res, next) => {
    // Data validation
    let amount = parseFloat(req.body.amount)

    let [data, error] = await houseService.fillBuffer(req.body.id, amount)

    if(error !== null) { res.status(200).json({ error: error }); return }

    res.status(200).json({
       result: { filled_amount: data },
       message: 'Buffer has been filled.'
    })
})

router.post('/empty-buffer', async (req, res, next) => {
    // Data validation
    let amount = parseFloat(req.body.amount)

    let [data, error] = await houseService.emptyBuffer(req.body.id, amount)

    if(error !== null) { res.status(200).json({ error: error }); return }

    res.status(200).json({
       result: { emptied_amount: data },
       message: 'Buffer has been emptied.'
    })
})

export default router
