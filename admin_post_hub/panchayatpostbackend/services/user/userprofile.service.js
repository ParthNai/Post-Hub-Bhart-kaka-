const httpStatus = require("http-status");
const {
  User,
  UserSubscription,
  UserBusiness,
  UserPanchayat,
  UserElection,
} = require("../../models");
const bcrypt = require("bcryptjs");
var ObjectId = require("mongodb").ObjectID;
const { getFilesData } = require("../../utils/functions");
const { businessValidation } = require("../../validations/admin");

const updateProfile = async (userId, data) => {
  // try {
  //     if (data.formType === 'business') {
  //         // if (files[0]) {
  //         //     data.businessLogo = await getFilesData(files[0])
  //         // }
  //         // const { error } = businessValidation.create(data);
  //         // if (error) {
  //         //     return {
  //         //         status: httpStatus.INTERNAL_SERVER_ERROR,
  //         //         message: error.details[0].message,
  //         //     };
  //         // }
  //         const checkBusiness = await UserBusiness.findOne({ userId: userId })
  //         if (checkBusiness) {
  //             delete data._id
  //             delete data.id
  //             await UserBusiness.findOneAndUpdate({ userId: userId }, data)
  //         } else {
  //             await UserBusiness.create({ ...data, userId: userId })
  //         }
  //     } else if (data.formType === 'panchayat') {
  //         // await Promise.all(files.map(async f => {
  //         //     if (f.fieldname === 'panchayatLogo') {
  //         //         data.panchayatLogo = await getFilesData(f)
  //         //     }
  //         //     if (f.fieldname === 'personImage') {
  //         //         data.personImage = await getFilesData(f)
  //         //     }
  //         // }))
  //         const checkPanchayat = await UserPanchayat.findOne({ userId: userId })
  //         if (checkPanchayat) {
  //             await UserPanchayat.findOneAndUpdate({ userId: userId }, data)
  //         } else {
  //             await UserPanchayat.create({ ...data, userId: userId })
  //         }
  //     }
  //     else if (data.formType === 'election') {
  //         // await Promise.all(files.map(async f => {
  //         //     if (f.fieldname === 'candidateSymbol') {
  //         //         data.candidateSymbol = await getFilesData(f)
  //         //     }
  //         //     if (f.fieldname === 'candidateImage') {
  //         //         data.candidateImage = await getFilesData(f)
  //         //     }
  //         // }))
  //         const checkElection = await UserElection.findOne({ userId: userId })
  //         if (checkElection) {
  //             await UserElection.findOneAndUpdate({ userId: userId }, data)
  //         } else {
  //             await UserElection.create({ ...data, userId: userId })
  //         }
  //     }
  //     return ({ status: httpStatus.OK, message: 'Profile updated successfully' });
  // }

  try {
    await User.findByIdAndUpdate(userId, data);
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to update profile",
    };
  }
};

const verifyDownload = async (id) => {
  try {
    const checkDownload = await User.findById(id);

    if (checkDownload.todayDownloadCount >= checkDownload.downloadLimit) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "You can't download this image, please try again tomorrow!",
      };
    }
    return { status: httpStatus.OK };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: err };
  }
};

const incrementDownload = async (id) => {
  try {
    await User.findByIdAndUpdate(id, { $inc: { todayDownloadCount: 1 } });
    return { status: httpStatus.OK };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: err };
  }
};

module.exports = {
  updateProfile,
  verifyDownload,
  incrementDownload,
};
