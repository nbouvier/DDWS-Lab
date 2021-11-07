require('dotenv').config()

const http = require('http')
const app = require('./app')
const port = process.env.PORT || 3000
const server = http.createServer(app)

server.listen(port)




// Code below simulates data gathering

const weather = require('./src/models/weather')
const consumption = require('./src/models/consumption')

weather.generateData()
consumption.generateData()
