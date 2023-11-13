const userModel = require('../models/userModel')
const bcryptjs = require("bcryptjs");
const { cloudinary } = require("../utils/cloudinaryConfig")
const { generateToken, verifyToken } = require('../services/sessionService');
const { sendMail } = require("../utils/mailer")


const signup = async (req, res, next) => {
    try {
        const { userName, email, password } = req.body;
        if (userName === "" || email === "" || password === "") {
            return res.status(400).send({ message: "Username, email and password must not be empty", status: false })
        }
        const checkExistingDetails = await userModel.findOne({
            $or:[{email: email} , { userName: userName }]

        })
        if (checkExistingDetails) {
            return res.status(409).send({ message: "Email or username already in use", status: false })
        }
        const result = await userModel.create({ userName, email, password })
        if (!result) {
            return res.status(500).send({ message: "Error creating your account, please try again" })
        }
        console.log(result)
       if(!checkExistingDetails){
        sendMail(email, userName)
        return res.status(201).send({ message: "Account created successfully", status: true })
       }
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const signIn = async (req, res, next) => {
    try {
        const { userName, email, password } = req.body;
        const result = await userModel.findOne({
            $or: [{ email: email }, { userName: userName },]
        })
        console.log(result, 33)
        if (!result) {
            return res.status(404).send({ message: "Account does not exist, try creating one", status: false })
        }
        const compare = await bcryptjs.compare(password, result.password)
        console.log(compare)
        if (!compare) {
            return res.status(409).send({ message: "Invalid password", status: false })
        }
        const email2 = result.email
        const token = generateToken(email2)
        return res.status(200).send({ message: `Welcome ${result.userName}`, status: true, token })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

const verifyUserToken = async (req, res, next) => {
    try {
        const auth = req.headers.authorization
        const token = auth.split(' ')[1]
        if (!token) {
            return res.status(401).send({ message: "Unauthorized", status: false })
        }
        const userEmail = verifyToken(token)
        const checkUser = await userModel.findOne({ email: userEmail })
        console.log(checkUser)
        if (checkUser){
            const username = checkUser.userName
            return res.status(200).send({ message: "Verification successful", checkUser,  status: true })
            req.user = checkUser

        }
        if (!checkUser) {
            return res.status(401).send({ message: "unauthorized", status: false })
        }
        
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const imageUpload = async (req, res, next) => {
    const { files } = req.body
    try {
        console.log(files)
        const result = await cloudinary.uploader.upload(files)
        console.log(result)
        const image_url = result.secure_url
        const public_id = result.public_id
        return res.status(200).send({message:"Upload successful", status:true, secure_url: image_url})
    } catch (error) {
        console.log(error)
        next(error)
    }
}


module.exports = { signup, signIn, verifyUserToken, imageUpload }