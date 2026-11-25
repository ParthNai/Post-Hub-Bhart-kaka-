const httpStatus = require("http-status");
const { User, UserBusiness, Image } = require("../../models");
const { getFilesData, removeFile } = require("../../utils/functions");
const { businessValidation } = require("../../validations/admin");

const all = async (data) => {
  try {
    const userBusiness = await UserBusiness.find({ userId: data }).sort({ _id: -1 });
    return {
      status: httpStatus.OK,
      data: userBusiness,
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const create = async (data, files) => {
  try {
    await Promise.all(files.map(async f => {
      if (f.fieldname === 'businessLogo') {
        data.businessLogo = await getFilesData(f)
      }
      if (f.fieldname === 'businessFrame') {
        const frame = await getFilesData(f)
        await Image.create({ userId: data.userId, userType: data.userType, path: frame })
      }
    }))

    const { error } = businessValidation.create(data)
    if (error) {
      return ({ status: httpStatus.NOT_FOUND, message: error.details[0].message })
    }
    await UserBusiness.create(data)
    return {
      status: httpStatus.OK, message: 'User business added successfully'
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data, files) => {
  try {
    const { error } = businessValidation.create(data)
    if (error) {
      return ({ status: httpStatus.NOT_FOUND, message: error.details[0].message })
    }
    const frames = await Image.find({ userId: data.userId, userType: data.userType })
    if (frames) {
      await Promise.all(frames.map(async fr => {
        removeFile(fr.path)
      }))
      await Image.deleteMany({ userId: data.userId, userType: data.userType })
    }
    await Promise.all(files.map(async f => {
      if (f.fieldname === 'businessLogo') {
        data.businessLogo = await getFilesData(f)
      }
      if (f.fieldname === 'businessFrame') {
        const frame = await getFilesData(f)
        await Image.create({ userId: data.userId, userType: data.userType, path: frame })
      }
    }))
    const update = await UserBusiness.findByIdAndUpdate(data.id || data._id, data)
    removeFile(update.businessLogo)
    return {
      status: httpStatus.OK, message: 'User business added successfully'
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};


const remove = async (data) => {
  try {
    const remove = await UserBusiness.findByIdAndDelete(data.id || data._id)
    removeFile(remove.businessLogo)
    return {
      status: httpStatus.OK, message: 'User business deleted successfully'
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  all,
  create,
  update,
  remove,
};
