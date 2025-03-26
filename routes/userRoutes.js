const express = require('express')
const UserController = require('../controllers/userController')
const userRoute = express.Router()

userRoute.post("/", UserController.createUser)
userRoute.get("/:id", UserController.retrieveUserById)
userRoute.put("/:id", UserController.updateUser)
userRoute.delete("/:id", UserController.deleteUser)

module.exports = userRoute