const express = require('express')
const User = require('../models/userModel')
const argon2 = require('argon2')
require('dotenv').config()

class UserController {
    // [GET] /api/user/:username
    // get info
    //  public
    async getUser(req,res) {
        const id = req.params.id
        try {
            // { $or:[{'_id':id}, {'username':id}]}
            const user = await User.findOne({'_id':id})
            if (user) {
                const {password, isAdmin, createAt , __v, ...otherDetails} = user._doc
                res.json({success: true, message: 'get a user\'s information success', otherDetails})
            } else res.status(400).json({success: false, message: 'user\'s id not found'})
        } catch (error) {
            console.log(error)
            res.status(500).json({success: false, message: 'Internal server error'})
        }
    }

    // [PUT] /api/user/:id 
    // change information or/and password
    //  private
    async updateUser(req,res) {
        const id = req.params.id
        const {currentUserId, currentUserAdminStatus, password} = req.body
        if (id === currentUserId || currentUserAdminStatus ){
            try {
                if (password) {
                    const hashedPassword = await argon2.hash(password, process.env.SECRET_KEY)
                    req.body.password = hashedPassword
                    console.log(hashedPassword)
                }
                const updatedUser = await User.findOneAndUpdate({'_id':id}, req.body, {new: true})
                res.json({success: true, message: 'updated user', updatedUser})
            } catch (error) {
                console.log(error)
                res.status(500).json({success: false, message: 'Internal server error'})
            }
        }
        else {
            res.status(400).json({success: false, message: 'update user unsuccessfully'})
        }
    }
    // [DELETE] /api/user/:id 
    // delete user
    //  private
    async deleteUser(req,res) {
        const {currentUserId, currentUserAdminStatus} = req.body
        if (currentUserAdminStatus) {
            try {
                deleteUser = await User.remove({'_id':currentUserId})
                res.json({success: true, message: 'deleted user', deleteUser})
            } catch (error) {
                console.log(error)
                res.status(500).json({success: false, message: 'Internal server error'})
            }
        }
        else {
            res.status(400).json({success: false, message: 'have no permission'})
        }
    }
 
    // [PUT] /api/:id/follow
    // follower a user 
    // private
    async followUser(req, res) {
        const id = req.params.id
        const {currentUserId} = req.body
        if (currentUserId === id) {
            res.status(403).json("Action forbidden")
        }
        else {
            try {
                const followingUser = await User.findById(currentUserId) //user
                const followedUser = await User.findById(id) //target
                // const followed = followingUser.followings.includes(id)
                if (!followingUser.followings.includes(id)) {
                    await followingUser.updateOne({$push : {followings : id}})
                    await followedUser.updateOne({$push : {followers : currentUserId}})
                    res.status(201).json({success: true, message: 'follow successfully'})
                }
                else {
                    res.status(403).json({success: false, message: 'already followed by current user'})
                }
            } catch (error) {
                console.log(error)
                res.status(500).json({success: false, message: 'Internal server error'})
            }
        }
    }

    // [PUT] /api/:id/unFollow
    // unFollower a user 
    // private
    async unFollowUser(req, res) {
        const id = req.params.id
        const {currentUserId} = req.body
        if (currentUserId === id) {
            res.status(403).json("Action forbidden")
        }
        else {
            try {
                const followingUser = await User.findById(currentUserId) //user
                const followedUser = await User.findById(id) //target
                // const followed = followingUser.followings.includes(id)
                if (followingUser.followings.includes(id)) {
                    await followingUser.updateOne({$pull : {followings : id}})
                    await followedUser.updateOne({$pull : {followers : currentUserId}})
                    res.status(201).json({success: true, message: 'unFollow successfully'})
                }
                else {
                    res.status(403).json({success: false, message: 'not follow this user'})
                }
            } catch (error) {
                console.log(error)
                res.status(500).json({success: false, message: 'Internal server error'})
            }
        }
    }
}
module.exports = new UserController
