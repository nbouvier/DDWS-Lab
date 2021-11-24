import express from 'express'

import middleware from '../src/vendor/middleware.js'
import user from '../src/services/user.js'

const router = express.Router()

router.post('/:user_id', (req, res, next) => {
    middleware.user(req, res, async () => {
        // Data validation
        res.status(200).json({
           user: (await user.get(req.params.user_id)).serialize()
        })
    }, () => res.status(401).json({ error: 'Need to log in.' }))
})

export default router
