const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["credit", "debit"],
    },

    amount: {
        type: Number,
        required: true
    },
    
    description: {
        type: String,
        trim: true
    },
    userName: {
        type: String,
        required: true,
    },
    thriftName: {
        type: String,
        
        trim: true
    },

    
    status: {
        type: String,
        enum: ["successful", "failed"]
    },
    date: {
        type: Date,
        default: Date.now
    },


    
   

    
    
})

const transactionModel = mongoose.model("transactions", transactionSchema)

module.exports = transactionModel
