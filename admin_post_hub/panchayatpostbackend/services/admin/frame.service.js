const httpStatus = require("http-status");
const { Frame } = require("../../models");
const { getFilesData, removeFile } = require("../../utils/functions");

const all = async () => {
  try {
    const frames = await Frame.find().sort({ _id: -1 });
    return {
      status: httpStatus.OK,
      data: frames,
    };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const uploadframe = async (data, files) => {
  try {
    data.path = await getFilesData(files[0]);
    return { status: httpStatus.OK, data: data.path };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const create = async (data) => {
  try {
    await Frame.create({ ...data, path: data.frameImage });
    return { status: httpStatus.OK, message: "Frame Added Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data) => {
  try {
    await Frame.findByIdAndUpdate(data._id || data.id, {
      ...data,
      path: data.frameImage,
    });
    return { status: httpStatus.OK, message: "Frame Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    const remove = await Frame.findByIdAndDelete(data._id || data.id);
    removeFile(remove.frame);
    return { status: httpStatus.OK, message: "Frame Deleted Successfully" };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  all,
  create,
  update,
  remove,
  uploadframe,
};
