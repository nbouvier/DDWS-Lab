const express = require('express')
const app = express()
const weatherRoutes = require('./api/weather')
const consumptionRoutes = require('./api/consumption')

app.use('/weather', weatherRoutes)
app.use('/consumption', consumptionRoutes)

module.exports = app
