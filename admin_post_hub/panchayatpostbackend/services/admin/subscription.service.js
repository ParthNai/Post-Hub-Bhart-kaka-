const httpStatus = require("http-status");
const { Subscription } = require("../../models");

const all = async () => {
  try {
    const subscriptions = await Subscription.find();
    return {
      status: httpStatus.OK,
      data: subscriptions,
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }

};

const create = async (data) => {
  try {
    await Subscription.create(data);
    return { status: httpStatus.OK, message: "Subscription Added Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data) => {
  try {
    await Subscription.findByIdAndUpdate(
      data._id || data.id,
      data
    );
    return { status: httpStatus.OK, message: "Subscription Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    await Subscription.findByIdAndDelete(data._id || data.id);
    return { status: httpStatus.OK, message: "Subscription Deleted Successfully" };
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
