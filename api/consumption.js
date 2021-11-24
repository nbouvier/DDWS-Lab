import express from 'express'

const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).json({
       message: 'Handling GET requests to /consumption'
    })
})

//Get details of a single product using product id
router.get('/:houseId', (req, res, next) => {
    const id = req.params.houseId

    if(id === 'special') {
         res.status(200).json({
             message: 'You discovered the special ID',
             id: id
         })
    } else {
         res.status(200).json({
             message: 'You passed an ID'
         })
    }
})

export default router
