const httpStatus = require("http-status");
const { ThemeSample } = require("../../models");
const { getFilesData } = require("../../utils/functions");

const all = async () => {
  try {
    const themeSamples = await ThemeSample.find();
    return {
      status: httpStatus.OK,
      data: themeSamples,
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }

};

const create = async (data, files) => {
  try {
    data.themeSampleImage = await getFilesData(files[0])
    await ThemeSample.create(data);
    return { status: httpStatus.OK, message: "Theme Sample Added Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data, files) => {
  try {
    data.themeSampleImage = await getFilesData(files[0])
    await ThemeSample.findByIdAndUpdate(
      data._id || data.id,
      data
    );
    return { status: httpStatus.OK, message: "Theme Sample Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    await ThemeSample.findByIdAndDelete(data._id || data.id);
    return { status: httpStatus.OK, message: "Theme Sample Deleted Successfully" };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  all,
  create,
  update,
  remove
};
