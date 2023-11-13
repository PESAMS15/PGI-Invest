const mongoose = require("mongoose")
const bcryptjs = require("bcryptjs")

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, trim: true, unique:true },
    email: { type: String, required: true, trim: true, unique:true },
    password: { type: String, required: true, trim: true }, 
    thrifts: [String],
    lastProcessedContributionDate: {
        type: Date,
        default: null, // Initialize it as null for new users
      },
    wallet: {type:Number, default:0}

}, {timestamps:true})

userSchema.pre("save", function(next){
    let saltRound = 10
    if(this.password !== undefined){
        bcryptjs.hash(this.password, saltRound).then((hashedPassword)=>{
            this.password = hashedPassword
            next()
        }).catch((err)=>{
            console.log(err)
        })
    }
})

const userModel = mongoose.models.user_tbs || mongoose.model("user_tbs", userSchema)

module.exports = userModel