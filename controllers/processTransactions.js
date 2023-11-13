const userModel = require('../models/userModel')
const thriftModel = require("../models/thriftModel");
const transactionModel = require('../models/transactionModel');


const processDailyContributions = async ()=>{
    const DailyThrifts = await thriftModel.find({ subscriptionPlan: "daily", thriftStatus: "Ongoing" })
    if(DailyThrifts.length === 0){
      console.log("No thrifts yet")
    }

    // console.log(DailyThrifts)
    else{
      for (let index = 0; index < DailyThrifts.length; index++) {
        const element = DailyThrifts[index];
        
        // console.log(element)
        // console.log(element.thriftMembers)
       
        for (const members of element.thriftMembers) {
          // const member = await userModel.findOne({userName: members})
          // console.log(member)
          const process = await thriftModel.updateOne({thriftMembers: members}, {$inc: {wallet: element.amountPerUser}})
          const remove = await userModel.updateOne({userName: members}, {$inc: {wallet: -element.amountPerUser}})
          if(process && remove){
            console.log("Transaction successful")
            const trans = await transactionModel.create({type: "debit", amount: element.amountPerUser, userName: members, description: "Daily Thrift Contribution", thriftName: element.thriftName, status: "successful"})
          }
          else{
            console.log("Transaction not Successful")
            const trans = await transactionModel.create({type: "debit", amount: element.amountPerUser, userName: members, description: "Daily Thrift Contribution", thriftName: element.thriftName, status: "failed"})
          }
       
         
      }
      const user = element.thriftMembers[element.userCount]
      console.log(user)
              
      const updat = await thriftModel.updateOne({thriftName: element.thriftName}, {$inc: {wallet: -element.amount}} )
      const up = await userModel.updateOne({userName: user}, {$inc: {wallet: element.amount}})
      const trans = await transactionModel.create({type: "credit", amount: element.amount, userName: user, description: "Daily Thrift Contribution", thriftName: element.thriftName, status: "successful"})
      console.log(trans)
      const addCount = await thriftModel.updateOne({thriftName: element.thriftName}, {$inc: {userCount: 1}})
      
      const members = element.thriftMembers
      if (members.length === element.userCount + 1){
        const completeThrift = await thriftModel.updateOne({thriftName: element.thriftName}, {$set: {thriftStatus: "Completed"}})
        console.log(completeThrift)
      }
    
  
        
      }
    }

    // Iterate through each thrift to process contributions
    

}

const processWeeklyContributions = async ()=>{
    const WeeklyThrifts = await thriftModel.find({ subscriptionPlan: "weekly", thriftStatus: "Ongoing" })
    if (!WeeklyThrifts){
      console.log("No weekly thrifts yet")
    }
    else{
      for (let index = 0; index < WeeklyThrifts.length; index++) {
        const element = WeeklyThrifts[index];
        console.log(element)
        if(element.count <= 7){
          const update = await thriftModel.updateOne({thriftName: element.thriftName}, {$inc: {count: 1}})
          console.log(update)

        }
        else if (element.userCount === element.thriftMembers.length){
          const completeThrift = await thriftModel.updateOne({thriftName: element.thriftName}, {$set: {thriftStatus: "Completed"}})
        }
        else{
          for (const members of element.thriftMembers) {
            const process = await thriftModel.updateOne({thriftMembers: members}, {$inc: {wallet: element.amountPerUser}})
            const remove = await userModel.updateOne({userName: members}, {$inc: {wallet: -element.amountPerUser}})
            if(process && remove){
              console.log("Transaction successful")
              const trans = await transactionModel.create({type: "debit", userName: members, amount: element.amountPerUser, description: "Weekly Thrift Contribution", thriftName: element.thriftName, status: "successful"})
            }
            else{
              console.log("Transaction not Successful")
              const trans = await transactionModel.create({type: "debit", userName: members, amount: element.amountPerUser, description: "Weekly Thrift Contribution", thriftName: element.thriftName, status: "failed"})
            }
            
            
          }
          const user = element.thriftMembers[element.userCount]
              
          const updat = await thriftModel.updateOne({thriftName: element.thriftName}, {$inc: {wallet: -element.amount}} )
          const up = await userModel.updateOne({userName: user}, {$inc: {wallet: element.amount}})
          const trans = await transactionModel.create({type: "credit", amount: element.amount, userName: user, description: "Weekly Thrift Contribution", thriftName: element.thriftName, status: "successful"})
          const addCount = await thriftModel.updateOne({thriftName: element.thriftName}, {$inc: {userCount: 1}})

          const update = await thriftModel.updateOne({thriftName: element.thriftName}, {$set: {count: 0}})
          const members = element.thriftMembers
          if (members.length === element.userCount + 1){
            const completeThrift = await thriftModel.updateOne({thriftName: element.thriftName}, {$set: {thriftStatus: "Completed"}})
            console.log(completeThrift)
          }
          // console.log(update)
        }

       

        
      }
    }


    // Iterate through each thrift to process contributions


}

const processMonthlyContributions = async ()=>{
    const MonthlyThrifts = await thriftModel.find({ subscriptionPlan: "monthly", thriftStatus: "Ongoing"})
    // Iterate through each thrift to process contribut
    console.log(MonthlyThrifts) 
    if (!MonthlyThrifts){
      console.log("No monthly thrifts yet")
    }
    else{
      for (let index = 0; index < MonthlyThrifts.length; index++) {
        const element = MonthlyThrifts[index];
        console.log(element)
        if(element.count < 30){
          const update = await thriftModel.updateOne({thriftName: element.thriftName}, {$inc: {count: 1}})
          console.log(update)

        }
        else if (element.userCount === element.thriftMembers.length){
          const completeThrift = await thriftModel.updateOne({thriftName: element.thriftName}, {$set: {thriftStatus: "Completed"}})
        }
        else{
          for (const members of element.thriftMembers) {
            const process = await thriftModel.updateOne({thriftMembers: members}, {$inc: {wallet: element.amountPerUser}})
            const remove = await userModel.updateOne({userName: members}, {$inc: {wallet: -element.amountPerUser}})
            if(process && remove){
              console.log("Transaction successful")
              const trans = await transactionModel.create({type: "debit", amount: element.amountPerUser, userName: members, description: "Monthly Thrift Contribution", thriftName: element.thriftName, status: "successful"})

            }
            else{
              console.log("Transaction not Successful")
              const trans = await transactionModel.create({type: "debit", amount: element.amountPerUser, description: "Monthly Thrift Contribution", thriftName: element.thriftName, status: "failed"})
            }
            
            
          }
  
              const user = element.thriftMembers[element.userCount]
              
              const updat = await thriftModel.updateOne({thriftName: element.thriftName}, {$inc: {wallet: -element.amount}} )
              const up = await userModel.updateOne({userName: user}, {$inc: {wallet: element.amount}})
              const trans = await transactionModel.create({type: "credit", amount: element.amount, userName: user, description: "Monthly Thrift Contribution", thriftName: element.thriftName, status: "successful"})
              const addCount = await thriftModel.updateOne({thriftName: element.thriftName}, {$inc: {userCount: 1}})
          

          const update = await thriftModel.updateOne({thriftName: element.thriftName}, {$set: {count: 0}})
          const members = element.thriftMembers
          if (members.length === element.userCount + 1){
            const completeThrift = await thriftModel.updateOne({thriftName: element.thriftName}, {$set: {thriftStatus: "Completed"}})
            console.log(completeThrift)
          }
          // console.log(update)
        }

       

        
      }


    }
}


module.exports = {processDailyContributions, processWeeklyContributions, processMonthlyContributions}


