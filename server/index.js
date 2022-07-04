const express = require('express')
require('dotenv').config()
const db = require('./config/db.js')
const AuthRoute = require('./src/routes/AuthRoute')
const UserRoute = require('./src/routes/UserRoute')
const PostRoute = require('./src/routes/PostRoute')

const app = express()
const port = process.env.PORT

//connect DB
db.connect()

//middleware
app.use(express.urlencoded())
app.use(express.json())

//routes
app.use('/api/auth', AuthRoute)
app.use('/api/user', UserRoute)
app.use('/api/post', PostRoute)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))