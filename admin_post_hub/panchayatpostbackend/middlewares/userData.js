const { UserBusiness, UserElection, UserPanchayat, Subscription, User, Image, Frame } = require("../models");
const moment = require('moment');
const config = require("../config/config");

const getUserData = async (user) => {
    const business = await UserBusiness.findOne({ userId: user._id || user.id }) || { _doc: {} }
    const businessImages = await Image.find({ userId: user._id || user.id, userType: 'business' })
    let newBusinessImages = []
    businessImages.map(img => {
        newBusinessImages.push(img.path)
    })
    const businessData = {
        ...business._doc,
        businessFrame: newBusinessImages
    }

    const panchayat = await UserPanchayat.findOne({ userId: user._id || user.id }) || { _doc: {} }
    const panchayatImages = await Image.find({ userId: user._id || user.id, userType: user.userType })

    let newPanchayatImages = []
    panchayatImages.map(img => {
        newPanchayatImages.push(img.path)
    })
    const panchayatData = {
        ...panchayat._doc,
        panchayatFrame: newPanchayatImages
    }
    const election = await UserElection.findOne({ userId: user._id || user.id }) || { _doc: {} }
    const electionImages = await Image.find({ userId: user._id || user.id, userType: user.userType })
    let newElectionImages = []
    electionImages.map(img => {
        newElectionImages.push(img.path)
    })
    const electionData = {
        ...election._doc,
        candidateFrame: newElectionImages
    }

    // const remainingDays = moment().diff(moment(user.createdAt), 'days')
    // const freeDays = process.env.FREE_DAYS
    // if (!user.subscription && remainingDays <= freeDays) {
    //     const newuser = await User.findByIdAndUpdate(user._id || user.id, { subscription: { subscriptionName: `Free trial for ${freeDays} Days`, endDate: moment(user.createdAt).add(freeDays, 'days').toDate() } }, { new: true })
    //     return { ...newuser._doc || newuser, razorPayKey: config.razorpay.key_id, profileData: { ...business._doc, ...panchayat._doc, ...electionData } };
    // }

    const userData = { razorPayKey: config.razorpay.key_id, appVersion: config.appVersion.version, profileData: { ...businessData, ...panchayatData, ...electionData } }
    if (user.subscription && user.subscription.endDate) {
        if (!moment(user.subscription.endDate).isAfter(moment().endOf('day'))) {
            const newuser = await User.findByIdAndUpdate(user._id || user.id, { subscription: null }, { new: true })
            return { ...newuser._doc || newuser, ...userData };
        }
    }

    const checkLastLoginDate = await User.findById(user._id || user.id)
    if (moment(checkLastLoginDate.lastLoginDate).startOf('day').isBefore(moment().startOf('day'))) {
        await User.findByIdAndUpdate({ todayDownloadCount: 0 })
    }

    return { ...user._doc || user, ...userData, };
};

module.exports = getUserData;
