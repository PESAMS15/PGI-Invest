const thriftModel = require("../models/thriftModel");
const transactionModel = require("../models/transactionModel");
const userModel = require("../models/userModel");
const axios = require("axios");
const { processDailyContributions, processWeeklyContributions, processMonthlyContributions } = require("./processTransactions");
// const { verifyUserToken } = require("./userController");


// Controller for creating a thrift
 const createThrift = async (req, res)=> {

    const { thriftName,  subscriptionPlan, thriftAdmin, amount, maxMem  } = req.body;
    // const thriftAdmin = "okna"

    let duration;
    let amt;
    let dur;
    if (subscriptionPlan === 'daily') {
      duration = 7;
      dur = 1
      
    } else if (subscriptionPlan === 'weekly') {
      duration = 30;
      dur = 4
    } else if (subscriptionPlan === 'monthly') {
      duration = 365;
      dur = 12
    }
    else {
      return res.status(400).send({ message: 'Invalid subscription plan' });
    }
    let amountPerUser = amount / maxMem
    amt = amountPerUser / duration
  
    try {
      const existingThrift = await thriftModel.findOne({ thriftName });
      if (existingThrift) {
        return res.status(409).send({ message: 'Thrift already exists' });
      }
  
      const thrift = await thriftModel.create({
        thriftName,
        thriftAdmin,
        thriftMembers: [thriftAdmin],
        subscriptionPlan,
        duration,
        amount,
        amountPerUser,
        amt,
        maxMem,
        
      });
      // const thriftAdminUser = await userModel.findOne({  userName : thriftAdmin });
      // if (!thriftAdminUser) {
      //   return res.status(404).send({ message: 'Thrift admin user not found' });
      // }
      // thriftAdminUser.thrifts.push(thriftName);
      const joinTH =   await userModel.updateOne({userName : thriftAdmin}, {$push: {thrifts: thriftName}})


      res.status(201).send({ message: "Thrift created successfylly",  thrift });

    
      // await thriftAdminUser.save();

    } catch (error) {
      console.log(error)
      res.status(500).send({ message: 'Failed to create thrift' });
      
    }
  }


// Arrow function for joining a thrift
const joinThrift = async (req, res) => {
  // const { } = req.params.id
  const { memberName, thriftId  } = req.body;

  console.log("member:" + memberName)

  try {
    const thrift = await thriftModel.findById({_id: thriftId});
    if (!thrift) {
      return res.status(404).send({ message: 'Thrift not found' });
    }
    console.log("id:" + thriftId)

    // Check if member already exists in the thrift
    // console.log(thrift, 69)
    if (thrift.thriftMembers.includes(memberName)) {
      return res.status(409).send({ message: 'Member already exists in the thrift' });
    }
    if (thrift.thriftMembers.length === thrift.maxMem) {
      return res.status(409).send({ message: 'Thrift is full' });
    }
    else{
      const joinTH =   await thriftModel.updateOne({_id:thriftId}, {$push: {thriftMembers: memberName}})
      thriftStatus()
    }
     
      // console.log(joinTH, 45)
    // thriftModel.thriftMembers.push(memberName);
    // const member = await userModel.findOne({  userName : memberName });
    //   member.thrifts.push(thriftName);
    //   await member.save();

    res.status(200).send({ thrift });
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Failed to join the thrift' });
  }
};

const getUserThrifts = async (req, res) => {
  try {
    const { userName } = req.body // Assuming you have the user's userName stored in req.user.userName

    // Find all the thrifts where the user is a member
    const userThrifts = await thriftModel.find({ thriftMembers: { $in: [userName] } });
    console.log(userName)

    res.status(200).send({ userThrifts });
  } catch (error) {
    res.status(500).send({ message: 'Failed to retrieve user thrifts' });
  }
};

const getThriftById = async (req, res) => {
  try {
    const thriftId = req.params.id; // Assuming the thrift ID is passed as a parameter in the request URL

    const thrift = await thriftModel.findOne({_id: thriftId});

    if (!thrift) {
      return res.status(404).send({ message: 'Thrift not found' });
    }

    res.status(200).send({message: "thrift retrieved successfully", thrift });
    console.log(thrift)
  } catch (error) {
    res.status(500).send({ message: 'Failed to retrieve thrift' });
  }
};

const verifyPayments = async (req, res)=>{
  const {amount, userName} = req.body
  console.log("working")
  console.log(amount)
  console.log(userName)
  try {
    const user = await userModel.updateOne({userName}, {$inc: { wallet: amount}})
    res.status(200).send({message: "balance  successfully added", user});
    const trans = await transactionModel.create({type: "credit", amount: amount, userName, description: "Wallet Funding", status: "successful"})
    
    user.wallet += amount
  } catch (error) {
    const trans = await transactionModel.create({type: "credit", userName: userName, amount: amount, description: "Wallet Funding", status: "failed"})
    
  }
    

}

const getTransactions = async (req, res)=>{
  const {userName} = req.body
  try {
    const transactions = await transactionModel.find({userName: userName })

    res.status(200).send({message: "Transactions retrieved successfully", transactions});

  
  } catch (error) {
    console.log(error)
    res.status(500).send({message: "Failed to retrieve transactions"});
    
  }
}


const thriftStatus = async ()=>{
  const allThrift = await thriftModel.find({thriftStatus: "Not Started"});
  for (const thrift of allThrift) {
      const member = thrift.thriftMembers
      if(member.length === thrift.maxMem){
        const joinTH =   await thriftModel.updateOne({thriftName: thrift.thriftName}, {$set: {thriftStatus: "Ongoing"}})
        console.log(joinTH)
        // console.log()

      }
      else{
        console.log("No thrift full yet")
      }
    
  }
}

const processThrift = async ()=>{
  processDailyContributions()
  processWeeklyContributions()
  processMonthlyContributions()
}






module.exports = { createThrift, joinThrift, getUserThrifts, getThriftById, verifyPayments, thriftStatus, getTransactions,  processThrift };

  