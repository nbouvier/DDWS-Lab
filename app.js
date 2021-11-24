import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'

import viewsRoutes from './api/views.js'
import authenticationRoutes from './api/authentication.js'
import userRoutes from './api/user.js'
import weatherRoutes from './api/weather.js'
import consumptionRoutes from './api/consumption.js'

const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }))

app.use('/', viewsRoutes)
app.use('/api/auth', authenticationRoutes)
app.use('/api/user', userRoutes)

app.use('/api/weather', weatherRoutes)
app.use('/api/consumption', consumptionRoutes)

export default app
