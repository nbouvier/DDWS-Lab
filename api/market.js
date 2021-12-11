import express from 'express'

import middleware from '../src/vendor/middleware.js'
import market from '../src/services/market.js'

const router = express.Router()

router.post('/set-price', async (req, res, next) => {
    middleware.user(req, res, async () => {
        // Data validation
        let [data, error] = await market.setPrice(req.body.price)

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: { price: data },
           message: 'Price has been updated.'
        })
    }, false)
})

router.post('/price', async (req, res, next) => {
    middleware.user(req, res, async () => {
        // Data validation
        let from = req.body.from ? parseInt(req.body.from) : null

        let [data, error] = await market.price(from)

        if(error !== null) { res.status(200).json({ error: error }); return }

        data = data.map(entry => [ entry.timestamp, entry.price ])

        res.status(200).json({
           result: { price: data },
           message: ''
        })
    }, false)
})

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

router.post('/orders', async (req, res, next) => {
    middleware.admin(req, res, async () => {
        // Data validation
        let [data, error] = await market.orders()

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: { orders: data },
           message: ''
        })
    }, false)
})

router.post('/sell', async (req, res, next) => {
    middleware.prosumer(req, res, async () => {
        // Data validation
        let [data, error] = await market.sell(req.body.amount, req.body.house_id)

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: { amount: data },
           message: `Transaction succeed for an amount of ${data} kW.`
        })
    }, false)
})

router.post('/buy', async (req, res, next) => {
    middleware.prosumer(req, res, async () => {
        // Data validation
        let [data, error] = await market.buy(req.body.amount, req.body.house_id)

        if(error !== null) { res.status(200).json({ error: error }); return }

        res.status(200).json({
           result: { amount: data },
           message: `Transaction succeed for an amount of ${data} kW.`
        })
    }, false)
})

export default router
