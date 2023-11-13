const express = require("express");
require("dotenv").config()
const mongoose = require("mongoose");
const cors = require("cors")
const socketio = require("socket.io")
const userRouter = require("./routes/userRoute");
const { errorHandler } = require("./middlewares/errorHandler");
const bodyParser = require("body-parser");
const thriftRouter = require("./routes/thriftRoute");
const { thriftStatus } = require("./controllers/thriftControllers");
const { processDailyContributions, processWeeklyContributions, processMonthlyContributions } = require("./controllers/processTransactions");

const app = express();
app.use(express.json({limit:"100mb"}));
app.use(express.urlencoded({ extended: true, limit:"100mb" }));

app.use(cors({origin:"*"})) //CORS allows us to make requests from an origin different from the one the server is running on

app.use("/users", userRouter)
app.use("/thrifts", thriftRouter)
let time = 1000 * 60 * 60 * 24

setInterval(() => {
    thriftStatus()
    processDailyContributions()
    processWeeklyContributions()
processMonthlyContributions()
// 
}, time);





const uri = process.env.MONGODB_URI
const connect = () => {
    mongoose.set("strictQuery", false)
    mongoose.connect(uri).then(() => {
        console.log("Connected to mongoDB")
    }).catch((error) => {
        console.log(error)
    })
}
connect()

app.use(errorHandler)
 
let server = app.listen("6650", () => {
    console.log("Server started")
})

let io = socketio(server, {
    cors: {
        origin: "*"
    }
})


io.on("message", (socket)=>{
    console.log(socket.id)

    socket.on("message", (data)=>{
        console.log(data, socket.id)
        io.emit("broadcast", data)
    })

    socket.on("disconnect", ()=>{
        console.log(`User ${socket.id} has disconnected`)
    })
})