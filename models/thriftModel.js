const mongoose = require('mongoose');

const thriftSchema = new mongoose.Schema({
  thriftName: {
    type: String,
    required: true,
    trim: true,
  },
  thriftMembers: {
    type: [String],
    default: [],
  },
  thriftAdmin: {
    type: String,
    required: true,
  },
  subscriptionPlan: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily',
  },
  amount: {
    type: Number,
    required: true
  },
  maxMem: {
    type: Number,
    required: true
  },
  amountPerUser: {
    type: Number,
    default: 0
  },
  amt: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  wallet: {
    type: Number,
    default: 0
  },
  thriftStatus:{
    type: String,
    enum: ['Not Started', 'Ongoing', "Failed", 'Completed'],
    default: "Not Started"
  },
  count: {
    type: Number,
    default: 0
  },
  userCount:{
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
});

const Thrift = mongoose.model('Thrift', thriftSchema);

module.exports = Thrift;
