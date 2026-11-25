const httpStatus = require("http-status");
const { FrameField } = require("../../models");
const { getFilesData, removeFile } = require("../../utils/functions");

const DEFAULT_FRAME_FIELDS = [
  { title: 'User Photo', type: 'image', variableName: 'userPhoto', isElection: false, isActive: true },
  { title: 'User Name', type: 'text', variableName: 'userName', isElection: false, isActive: true },
  { title: 'Designation / Post (સરપંચ શ્રી)', type: 'text', variableName: 'designation', isElection: false, isActive: true },
  { title: 'Gram Panchayat / Village', type: 'text', variableName: 'village', isElection: false, isActive: true },
  { title: 'Mobile Number', type: 'text', variableName: 'mobile', isElection: false, isActive: true },
  { title: 'Post Text / Slogan (લખાણ)', type: 'text', variableName: 'postText', isElection: false, isActive: true },
  { title: 'Panchayat Logo / Emblem', type: 'image', variableName: 'panchayatLogo', isElection: false, isActive: true },
  { title: 'Party Symbol / Election Logo', type: 'image', variableName: 'partySymbol', isElection: true, isActive: true },
  { title: 'Email Address', type: 'text', variableName: 'email', isElection: false, isActive: true }
];

const all = async () => {
  try {
    let fields = await FrameField.find().sort({ _id: -1 });
    if (!fields || fields.length === 0) {
      await FrameField.insertMany(DEFAULT_FRAME_FIELDS);
      fields = await FrameField.find().sort({ _id: -1 });
    }
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
