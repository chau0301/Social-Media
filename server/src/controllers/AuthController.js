const express = require('express')
const jwt = require('jsonwebtoken')
const argon2 = require('argon2')
require('dotenv').config()
const User = require('../models/userModel')

class AuthController {
    // [POST]
    // register new account
    // public
    async register(req, res) {
        const {username, password, firstname, lastname} = req.body
        //simple validation
        if (!username || !password || !firstname || !lastname) {
            res.status(400).json({success: false, message: 'Missing information'})
        }
        try {
            const hashedPassword = await argon2.hash(password)
            const newUser = new User({ username, password: hashedPassword, firstname, lastname })
            await newUser.save()
            const accessToken = jwt.sign({userId : newUser._id}, process.env.SECRET_KEY)
            res.status(201).json({success: true, message: 'Register successfully!!', newUser})
        } catch (error) {
            console.log(error)
            res.status(500).json({success: false, message: 'Internal server error'})
        }

    }
    async login(req, res) {
        const {username, password} = req.body
        //simple validation
        if (!username || !password) {
            res.status(400).json({success: false, message: 'Missing information'})
        }
        try {
            const loginUser = await User.findOne({username})
            if (!loginUser) {
                res.status(400).json({success: false, message: 'Username does not exist'})
            }
            const verify = await argon2.verify(loginUser.password, password)
            if (verify) {
                res.json({success: true, message: 'Login successfully!!'})
                const accessToken = jwt.sign({userId: loginUser._id}, process.env.SECRET_KEY)    
                //res.set({'accessToken': accessToken})
            } else res.status(400).json({success: false, message:'The Username or Password is incorrect'})
        } catch (error) {
            console.log(error)
            res.status(500).json({success: false, message: 'Internal server error'})
        }
    }
}

module.exports = new AuthController
