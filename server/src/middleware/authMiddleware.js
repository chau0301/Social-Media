const jwt = require('jsonwebtoken')
require('dotenv').config

const secret_key = process.env.SECRET_KEY 
const authMiddleware =  async(req, res, next) => {
    try {
        const token = req.header.authorization.split(' ')[1]
        // console.log(token)
        if (token) {
            const decoded = jwt.verify(token, secret_key)
            console.log(decoded)
            req.body._id = decoded?.id
        }
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}

module.exports = authMiddleware
