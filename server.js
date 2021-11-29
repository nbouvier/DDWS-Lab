import dotenv from 'dotenv'
import http from 'http'
import app from './app.js'

dotenv.config()

const port = process.env.PORT || 3000
const server = http.createServer(app)

server.listen(port)




// Code below simulates data gathering

import generateWeather from './src/models/weather.js'
import generateConsumption from './src/models/consumption.js'
import generateCoalProduction from './src/models/coalProduction.js'

generateWeather()
generateConsumption()
generateCoalProduction()
