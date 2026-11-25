const httpStatus = require("http-status");
const { Customcategory, Image } = require("../../models");
const { getFilesData, removeFile } = require("../../utils/functions");
const { sendNotifications } = require("../user/notification.service");

const all = async (data) => {
  try {
    const subcategory = await Customcategory.find().sort({ _id: -1 });
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

    const checkPriority = await Customcategory.findOne({ priority: data.priority })
    if (checkPriority) {
      return { status: httpStatus.INTERNAL_SERVER_ERROR, message: "Priority exist" };
    }
    await Customcategory.create(data);
    return { status: httpStatus.OK, message: "Custom category Added Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data) => {
  try {
    // data.subcategoryImage = await getFilesData(files[0])

    const checkPriority = await Customcategory.findOne({ priority: data.priority })
    if (checkPriority) {
      const check = await Customcategory.findOne({ priority: data.priority, _id: data.id || data.id })
      if (!check) {
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Priority already exist!" })
      }
    }

    const update = await Customcategory.findByIdAndUpdate(
      data._id || data.id,
      data
    );
    removeFile(update.subcategoryImage)
    return { status: httpStatus.OK, message: "Custom category Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const getImages = async (data) => {
  try {
    let customImg = []
    const images = await Image.find({ customcategoryId: data }).sort({ _id: -1 });
    await Promise.all(images.map(img => {
      customImg.push(img.path)
    }))
    return {
      status: httpStatus.OK,
      data: customImg,
    };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }

};

const uploadImages = async (data, files) => {
  try {
    const myImages = await getFilesData(files)
    if (myImages && myImages.length > 0) {
      const images = await Image.find({ customcategoryId: data.id })
      if (images && images.length > 0) {
        let subcategoryImages = []
        await Promise.all(images.map(i => {
          subcategoryImages.push(i)
        }))
        await Image.deleteMany({ customcategoryId: data.id })
        removeFile(subcategoryImages)
      }
    }
    await Promise.all(myImages.map(async a => {
      await Image.create({ ...a, path: a, customcategoryId: data.id, })
    }))
    return { status: httpStatus.OK, message: "Custom category Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    const remove = await Customcategory.findByIdAndDelete(data._id || data.id);
    removeFile(remove.subcategoryImage)
    return { status: httpStatus.OK, message: "Custom category Deleted Successfully" };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const notify = async (data) => {
  try {
    const title = data.subcategoryName
    const image = await Image.findOne({ customcategoryId: data.id })
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
