const express = require("express")
const { createThrift, getThriftById, getUserThrifts, joinThrift, verifyPayments, getTransactions, processThrift } = require("../controllers/thriftControllers")

const thriftRouter = express.Router()

thriftRouter.post("/create", createThrift)
thriftRouter.post("/join", joinThrift)
thriftRouter.get("/thrift/:id", getThriftById)
thriftRouter.post("/allthrifts", getUserThrifts)
thriftRouter.post("/add", verifyPayments)
thriftRouter.post("/transactions", getTransactions)
thriftRouter.post("/process", processThrift)

module.exports = thriftRouter
