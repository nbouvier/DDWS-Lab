import dotenv from 'dotenv'
import http from 'http'
import app from './app.js'

dotenv.config()

const port = process.env.PORT || 3000
const server = http.createServer(app)

server.listen(port)




// Code below simulates data gathering

import generateWeather from './src/models/weather.js'
import generateElectricityProductionConsumption from './src/models/electricityProductionConsumption.js'
import generateElectricityPrice from './src/models/electricityPrice.js'

generateWeather()
generateElectricityProductionConsumption()
generateElectricityPrice()
