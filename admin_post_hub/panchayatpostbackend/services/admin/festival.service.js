const httpStatus = require("http-status");
const { Festival, FestivalPost, Image } = require("../../models");
const { getFilesData, removeFile } = require("../../utils/functions");
const { festivalValidation } = require("../../validations/admin");
const moment = require("moment");
const { sendNotifications } = require("../user/notification.service");

const all = async () => {
  try {
    const festivals = await Festival.find().sort({ _id: -1 });
    const newFestivals = await Promise.all(
      festivals.map(async (f) => {
        const images = await Image.find({ festivalId: f._id });
        let festivalImages = [];
        await Promise.all(
          images.map((i) => {
            festivalImages.push(i.path);
          })
        );
        return { ...f._doc, festivalImages: festivalImages };
      })
    );
    return {
      status: httpStatus.OK,
      data: newFestivals,
    };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const create = async (data, files) => {
  try {
    const { error } = festivalValidation.create(data);
    if (error) {
      return {
        status: httpStatus.NOT_FOUND,
        message: error.details[0].message,
      };
    }
    const isFixedDate = data.isFixedDate === "true" ? true : false;
    const created = await Festival.create({
      ...data,
      festivalDate:
        data.festivalDate !== "undefined" ? data.festivalDate : undefined,
      isFixedDate: isFixedDate,
    });
    const myImages = await getFilesData(files);
    await Promise.all(
      myImages.map(async (a) => {
        await Image.create({ festivalId: created._id || created.id, path: a });
      })
    );

    if (isFixedDate) {
      await FestivalPost.create({
        ...data,
        postName: data.festivalName,
        festivalId: created._id || created.id,
        postStartDate: moment(data.festivalDate).startOf("day"),
        postEndDate: moment(data.festivalDate).endOf("day"),
        postImages: data.festivalImages,
      });
    }

    return { status: httpStatus.OK, message: "Festival Added Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data, files) => {
  try {
    const myImages = await getFilesData(files);
    if (myImages && myImages.length > 0) {
      const images = await Image.find({ festivalId: data._id || data.id });
      if (images && images.length > 0) {
        let festivalImages = [];
        await Promise.all(
          images.map((i) => {
            festivalImages.push(i.path);
          })
        );
        await Image.deleteMany({ festivalId: data._id || data.id });
        removeFile(festivalImages);
      }
    }
    await Promise.all(
      myImages.map(async (a) => {
        await Image.create({ festivalId: data._id || data.id, path: a });
      })
    );
    const { error } = festivalValidation.create(data);
    if (error) {
      return {
        status: httpStatus.NOT_FOUND,
        message: error.details[0].message,
      };
    }
    const isFixedDate = data.isFixedDate === "true" ? true : false;
    const update = await Festival.findByIdAndUpdate(data._id || data.id, {
      ...data,
      festivalDate:
        data.festivalDate !== "undefined" ? data.festivalDate : undefined,
      isFixedDate: isFixedDate,
      ...(!isFixedDate && { festivalDate: undefined }),
    });
    const checkIfExistPost = await FestivalPost.findOne(
     {festivalId: update._id || update.id}
    );
    if (isFixedDate) {
      if (checkIfExistPost) {
        delete data._id
        await FestivalPost.findByIdAndUpdate(checkIfExistPost._id, {
          ...data,
          postName: data.festivalName,
          festivalId: update._id || update.id,
          postStartDate: moment(data.festivalDate).startOf("day"),
          postEndDate: moment(data.festivalDate).endOf("day"),
          postImages: data.festivalImages,
        });
      } else {
        await FestivalPost.create({
          ...data,
          postName: data.festivalName,
          festivalId: update._id || update.id,
          postStartDate: moment(data.festivalDate).startOf("day"),
          postEndDate: moment(data.festivalDate).endOf("day"),
          postImages: data.festivalImages,
        });
      }
    } else {
      if (checkIfExistPost) {
        await FestivalPost.findByIdAndDelete(
          checkIfExistPost._id || checkIfExistPost.id
        );
      }
    }

    return { status: httpStatus.OK, message: "Festival Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    const remove = await Festival.findByIdAndDelete(data._id || data.id);
    removeFile(remove.festivalImages);
    return { status: httpStatus.OK, message: "Festival Deleted Successfully" };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const notify = async (data, files) => {
  try {
    const title = data.festivalName;
    const body = data.festivalDescription;
    const image = await Image.findOne({ festivalId: data._id });
    const imageUrl = `https://egrampost.com/${image.path}`;
    await sendNotifications({
      title: title,
      body: body,
      imageUrl: imageUrl,
    });
    return { status: httpStatus.OK, message: "Notification sent successfully" };
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Error Sending Notification",
    };
  }
};

module.exports = {
  all,
  create,
  update,
  remove,
  notify,
};
