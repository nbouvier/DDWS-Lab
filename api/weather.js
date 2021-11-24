import express from 'express'

const router = express.Router()

router.get('/', async (req, res, next) => {
    res.status(200).json({
        wind_speed: ''
    })
})

export default router
