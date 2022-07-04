const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')

router.get('/:id', UserController.getUser)
router.put('/:id', UserController.updateUser)
router.delete('/:id', UserController.deleteUser)
router.put('/:id/follow', UserController.followUser)
router.put('/:id/unfollow', UserController.unFollowUser)


module.exports = router
