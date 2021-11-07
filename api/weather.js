const weather = require('../src/models/weather')

const express = require('express')
const router = express.Router()

router.get('/', async (req, res, next) => {
       res.status(200).json({
           wind_speed: await weather.getWind()
       })
})

module.exports = router
