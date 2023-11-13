const errorHandler = (error, req, res, next) => {
    if(error.name === "MongoError"){
        if(error.code === 11000){
            return res.status(400).send({message:"Duplicate key error. A value is already in use in our database", status:false})
        }
        if(error.message === `E11000 duplicate key error collection: PGI.user_tbs index: userName_1 dup key: { userName: "pesams" }`){
            return res.status(400).send({message:"Duplicate key error. A value is already in use in our database", status:false})
        }
        
    }else if(error.name === "Authentication error"){
        return res.status(401).send({message: error.message || "Authentication error", status:false})
    }else if(error.name === "Authorization error"){
        return res.status(403).send({message:error.message || "Authorization error", status:false})
    }else{
        return res.status(500).send({message:error.message || "Internal server error", status:false})
    }
}

module.exports = {errorHandler}