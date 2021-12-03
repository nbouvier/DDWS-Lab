import express from 'express'

import middleware from '../src/vendor/middleware.js'
import market from '../src/services/market.js'

const router = express.Router()

router.post('/modeled-price', async (req, res, next) => {
    middleware.admin(req, res, async () => {
        // Data validation
        let from = req.body.from ? parseInt(req.body.from) : null

        let [data, error] = await market.modeledPrice(from)

        if(error !== null) { res.status(200).json({ error: error }); return }

        data = data.map(entry => [ entry.timestamp, entry.price ])

        res.status(200).json({
           result: { modeled_price: data },
           message: ''
        })
    }, false)
})

export default router
