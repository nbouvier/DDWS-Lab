import express from 'express'

import middleware from '../src/vendor/middleware.js'
import weather from '../src/services/weather.js'

const router = express.Router()

router.post('/wind', async (req, res, next) => {
    middleware.admin(req, res, async () => {
        // Data validation
        let from = req.body.from ? parseInt(req.body.from) : null

        let [data, error] = await weather.wind(req.body.id, from)

        if(error !== null) { res.status(200).json({ error: error }); return }

        data = data.map(entry => [ entry.timestamp, entry.speed ])

        res.status(200).json({
           result: { wind: data },
           message: ''
        })
    }, false)
})

export default router
