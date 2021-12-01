import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'

import viewsRoutes from './api/views.js'
import authenticationRoutes from './api/authentication.js'
import userRoutes from './api/user.js'
import house from './api/house.js'
import coalPowerPlant from './api/coalPowerPlant.js'
import weatherRoutes from './api/weather.js'

const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// If there are some session problems, it might come from "resave: false"
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))

app.use('/', viewsRoutes)
app.use('/api/auth', authenticationRoutes)
app.use('/api/user', userRoutes)
app.use('/api/house', house)
app.use('/api/coal-power-plant', coalPowerPlant)
app.use('/api/weather', weatherRoutes)

export default app
