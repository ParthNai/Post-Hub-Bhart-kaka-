const httpStatus = require("http-status");
const { Greeting, Image } = require("../../models");
const { getFilesData, removeFile } = require("../../utils/functions");

const all = async (data) => {
  try {
    const greetings = await Greeting.find({ categoryId: data }).sort({ _id: -1 });
    return {
      status: httpStatus.OK,
      data: greetings,
    };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }

};

const create = async (data) => {
  try {
    await Greeting.create(data);
    return { status: httpStatus.OK, message: "Greeting Added Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data) => {
  try {
    await Greeting.findByIdAndUpdate(
      data._id || data.id,
      data
    );
    return { status: httpStatus.OK, message: "Greeting Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const getImages = async (data) => {
  try {
    let greetImg = []
    const images = await Image.find({ greetingId: data }).sort({ _id: -1 });
    await Promise.all(images.map(img => {
      greetImg.push(img.path)
    }))
    return {
      status: httpStatus.OK,
      data: greetImg,
    };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }

};

const uploadImages = async (data, files) => {
  try {
    const myImages = await getFilesData(files)
    if (myImages && myImages.length > 0) {
      const images = await Image.find({ greetingId: data.id })
      if (images && images.length > 0) {
        let greetingImages = []
        await Promise.all(images.map(i => {
          greetingImages.push(i)
        }))
        await Image.deleteMany({ greetingId: data.id })
        removeFile(greetingImages)
      }
    }

    await Promise.all(myImages.map(async a => {
      await Image.create({ ...a, path: a, greetingId: data.id })
    }))
    return { status: httpStatus.OK, message: "Greeting Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    const remove = await Greeting.findByIdAndDelete(data._id || data.id);
    removeFile(remove.greetingImages)
    return { status: httpStatus.OK, message: "Greeting Deleted Successfully" };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  all,
  create,
  update,
  remove,
  uploadImages,
  getImages
};
