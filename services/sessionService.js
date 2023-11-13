const jsonwebtoken = require("jsonwebtoken")
const secretKey = process.env.JWT_SECRET

const generateToken = (email) => {
    try {
        return jsonwebtoken.sign({ email }, secretKey, { expiresIn: '24h' })
    } catch (error) {
        console.log(error)
        throw new Error({ name: "Authentication error", message:"Error generating token" })
    }
}


const verifyToken = (token) => {
    try {
        if (!token) {
            throw new Error({name: "Authentication error", message: "Invalid token"})
        }
        const decodedToken = jsonwebtoken.verify(token, secretKey)
        console.log(decodedToken)
        const email = decodedToken.email
        return email
    } catch (error) {
        // console.log(error)
        if(error.name === "TokenExpiredError"){
            throw new Error("Session expired please Login again")
        }
        throw new Error("Please login to continue" )
    }
}


module.exports = { generateToken, verifyToken }