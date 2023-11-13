const express = require("express")
const { signup, signIn, verifyUserToken, imageUpload } = require("../controllers/userController")
const { validate } = require("../middlewares/validator")
const { userValidationSchema } = require("../middlewares/userValidationSchema")
const userRouter = express.Router()

userRouter.post("/signup", validate(userValidationSchema), signup)
userRouter.post("/login", signIn)
userRouter.get("/verify", verifyUserToken)
userRouter.post("/upload", imageUpload)


module.exports = userRouter