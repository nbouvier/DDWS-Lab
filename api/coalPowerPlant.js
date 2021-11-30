import express from 'express'

import middleware from '../src/vendor/middleware.js'
import coalPowerPlant from '../src/services/coalPowerPlant.js'

const router = express.Router()

router.post('/production', (req, res, next) => {
    middleware.admin(req, res, async () => {
        // Data validation
        let from = req.query.from ? parseInt(req.query.from) : null

        let [data, error] = await coalPowerPlant.production(req.query.id, from)

        if(data === false) { res.status(200).json({ error: error }); return }

        data = data.map(entry => [entry.timestamp, entry.production / 3600])

        res.status(200).json({
           result: { production: data },
           message: ''
        })
    }, false)
})

export default router
