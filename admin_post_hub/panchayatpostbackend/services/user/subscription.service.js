const httpStatus = require("http-status");
const razorpay = require('../../razorpay')
const { Subscription, User, UserSubscription } = require("../../models");
const moment = require('moment');

const all = async (userId) => {
  try {
    const user = await User.findById(userId)
    const subscription = await Subscription.find()
    return {
      status: httpStatus.OK,
      data: subscription
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }

};

const createOrder = async (data) => {
  try {
    // if (config.razorpay.key_id.includes('test')) {
    //   return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to intialized" })
    // }
    const options = {
      amount: data.amount * 100,  // amount in the smallest currency unit
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`
    }
    const response = await razorpay.orders.create(options)
    return ({ status: httpStatus.OK, message: "Payment intialized", data: response })
  } catch (error) {
    console.log(error);
    return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to intialized" })
  }
}



const purchase = async ({ userId, data }) => {
  try {
    const checkSubscription = await UserSubscription.findOne({ userId: userId, subscriptionId: data.subscriptionId })
    if (checkSubscription) {
      if (moment(checkSubscription.endDate).isAfter(moment())) {
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Subscription already exist!" });
      }
    }
    const subscription = await Subscription.findById(data.subscriptionId)

    const startDate = moment()
    const endDate = moment().add(subscription.subscriptionDuration, 'months').endOf("day")
    data.startDate = startDate
    data.endDate = endDate
    const subscriptionData = { ...data, ...subscription._doc }
    const updateUserPayment = await User.findByIdAndUpdate(userId, { userType: subscription.subscriptionType, subscription: subscriptionData }, {
      new: false
    })

    const addPayment = await UserSubscription.create({ ...data, userId: userId })
    if (updateUserPayment && addPayment) {
      try {
        await razorpay.payments.capture(data.paymentId, data.amount, data.currency)
      } catch (error) {
        console.log(error);
        return ({ status: httpStatus.OK, data: subscriptionData, message: 'Payment Successfully' });
      }
    }
    return ({ status: httpStatus.OK, data: subscriptionData, message: 'Payment Successfully' });

  } catch (error) {
    console.log(error);
    return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to buy package" });
  }
}

module.exports = {
  all, createOrder, purchase
};
