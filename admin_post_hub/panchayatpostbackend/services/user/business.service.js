const httpStatus = require("http-status");
const { UserBusiness } = require("../../models");
const User = require("../../models/user.model");
const { getFilesData } = require("../../utils/functions");

const all = async (data) => {
  try {
    const userBusiness = await UserBusiness.find({ userId: data }).sort({ _id: -1 });
    const user = await User.findById(data)
    return {
      status: httpStatus.OK,
      data: { activeBusiness: user.activeBusinessId, businesses: userBusiness },
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const activate = async (userId, data) => {
  try {
    await User.findByIdAndUpdate(userId, { activeBusinessId: data.id })
    return {
      status: httpStatus.OK,
      message: `Business activated successfully`
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const getSingleBusiness = async (data) => {
  try {
    const userBusiness = await UserBusiness.findById(data);
    return {
      status: httpStatus.OK,
      data: userBusiness
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};


const uploadLogo = async (data, files) => {
  try {
    data.businessLogo = getFilesData(files[0])
    await UserBusiness.findByIdAndUpdate(data._id || data.id, data);
    return {
      status: httpStatus.OK,
      message: 'Business logo uploaded successfully'
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  all,
  activate,
  getSingleBusiness,
  uploadLogo
};
