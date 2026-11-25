const httpStatus = require("http-status");
const { FrameField } = require("../../models");
const { getFilesData, removeFile } = require("../../utils/functions");

const all = async () => {
  try {
    const fields = await FrameField.find().sort({ _id: -1 });
    return {
      status: httpStatus.OK,
      data: fields,
    };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }

};

const create = async (data, files) => {
  try {
    data.image = await getFilesData(files[0])
    data.isElection = data.isElection === 'true' ? true : false
    if (data.type !== 'image') {
      data.image = null
    }
    await FrameField.create(data);
    return { status: httpStatus.OK, message: "Frame Added Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data, files) => {
  try {
    data.image = await getFilesData(files[0])
    data.isElection = data.isElection === 'true' ? true : false
    if (data.type !== 'image') {
      data.image = null
    }
    await FrameField.findByIdAndUpdate(
      data._id || data.id,
      data
    );
    return { status: httpStatus.OK, message: "Frame Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    await FrameField.findByIdAndDelete(data._id || data.id);
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
};
