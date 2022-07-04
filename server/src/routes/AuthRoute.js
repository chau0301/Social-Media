const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')

router.get('/register', (req,res)=> res.send('ok'))
router.post('/login', AuthController.login)
router.post('/register', AuthController.register)

module.exports = router
