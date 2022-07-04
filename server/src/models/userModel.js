const express = require('express')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
    profilePicture: {type: String},
    coverPicture: {type: String},
    about: {type: String},
    livesin: {type: String},
    worksAt: {type: String},
    relationship: {type: String},
    followers: [],
    followings: [],
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)
