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

router.post('/sell', async (req, res, next) => {
    middleware.prosumer(req, res, async () => {
        // Data validation
        let [data, error] = await market.sell(req.body.amount, req.session.user_id)

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: true,
           message: ''
        })
    }, false)
})

router.post('/buy', async (req, res, next) => {
    middleware.prosumer(req, res, async () => {
        // Data validation
        let [data, error] = await market.buy(req.body.amount, req.session.user_id)

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: true,
           message: ''
        })
    }, false)
})

export default router
