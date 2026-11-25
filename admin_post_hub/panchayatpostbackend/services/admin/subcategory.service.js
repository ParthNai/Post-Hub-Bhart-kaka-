const httpStatus = require("http-status");
const { Subcategory, Image } = require("../../models");
const { getFilesData, removeFile } = require("../../utils/functions");
const { subcategoryValidation } = require("../../validations/admin");
const { sendNotifications } = require("../user/notification.service");

const all = async (data) => {
  try {
    const subcategory = await Subcategory.find({ categoryId: data }).sort({ _id: -1 });
    return {
      status: httpStatus.OK,
      data: subcategory,
    };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }

};

const create = async (data) => {
  try {
    // data.subcategoryImage = await getFilesData(files[0])
    const { error } = await subcategoryValidation.create(data)
    if (error) {
      return ({ status: httpStatus.NOT_FOUND, message: error.details[0].message })
    }
    const checkPriority = await Subcategory.findOne({ priority: data.priority })
    if (checkPriority) {
      return { status: httpStatus.INTERNAL_SERVER_ERROR, message: "Priority exist" };
    }
    await Subcategory.create(data);
    return { status: httpStatus.OK, message: "Subcategory Added Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data) => {
  try {
    // data.subcategoryImage = await getFilesData(files[0])
    const { error } = subcategoryValidation.create(data)
    if (error) {
      return ({ status: httpStatus.NOT_FOUND, message: error.details[0].message })
    }
    const checkPriority = await Subcategory.findOne({ priority: data.priority })
    if (checkPriority) {
      const check = await Subcategory.findOne({ priority: data.priority, _id: data.id || data.id })
      if (!check) {
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Priority already exist!" })
      }
    }

    const update = await Subcategory.findByIdAndUpdate(
      data._id || data.id,
      data
    );
    removeFile(update.subcategoryImage)
    return { status: httpStatus.OK, message: "Subcategory Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const getImages = async (data) => {
  try {
    let subImg = []
    const images = await Image.find({ subcategoryId: data }).sort({ _id: -1 });
    await Promise.all(images.map(img => {
      subImg.push(img.path)
    }))
    return {
      status: httpStatus.OK,
      data: subImg,
    };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }

};

const uploadImages = async (data, files) => {
  try {
    const myImages = await getFilesData(files)
    if (myImages && myImages.length > 0) {
      const images = await Image.find({ subcategoryId: data.id, categoryId: data.categoryId })
      if (images && images.length > 0) {
        let subcategoryImages = []
        await Promise.all(images.map(i => {
          subcategoryImages.push(i)
        }))
        await Image.deleteMany({ subcategoryId: data.id, categoryId: data.categoryId })
        removeFile(subcategoryImages)
      }
    }
    await Promise.all(myImages.map(async a => {
      await Image.create({ ...a, path: a, subcategoryId: data.id, categoryId: data.categoryId, })
    }))
    return { status: httpStatus.OK, message: "Subcategory Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    const remove = await Subcategory.findByIdAndDelete(data._id || data.id);
    removeFile(remove.subcategoryImage)
    return { status: httpStatus.OK, message: "Subcategory Deleted Successfully" };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const notify = async (data) => {
  try {
    const title = data.subcategoryName
    const image = await Image.findOne({ subcategoryId: data.id })
    const imageUrl = `https://egrampost.com/${image.path}`
    await sendNotifications({
      title: title, imageUrl: imageUrl
    })
    return { status: httpStatus.OK, message: "Notification sent successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Error Sending Notification' };
  }
};

module.exports = {
  all,
  create,
  update,
  remove,
  uploadImages,
  getImages,
  notify
};
