const Razorpay = require('razorpay')
const config = require('../config/config')

const instance = new Razorpay(config.razorpay)

module.exports = instance