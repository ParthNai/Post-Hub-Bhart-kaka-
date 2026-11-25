const httpStatus = require("http-status");
const {
  User,
  Subscription,
  UserPanchayat,
  UserElection,
  Image,
  UserSubscription,
  UserBusiness,
} = require("../../models");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { getFilesData, removeFile } = require("../../utils/functions");
const getUserData = require("../../middlewares/userData");
const ExcelJS = require("exceljs");
const appUsers = async (data) => {
  try {
    let returnData = {
      data: [],

      page: Number(data.page) + 1,
      pageSize: Number(data.limit),
      totalCount: 0,
    };
    let aggregationPipeline = [];
    const pipeLines = [
      {
        $match: {
          role: "user",
        },
      },

      {
        $lookup: {
          from: "userbusinesses",
          localField: "_id",
          foreignField: "userId",
          as: "businesses",
        },
      },
      {
        $addFields: {
          totalBusinesses: { $size: "$businesses" },
          pin: { $ifNull: ["$pin", "1234"] },
        },
      },
      {
        $project: {
          otp: 0,
          password: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ];

    const searchPipeLine = data?.query
      ? [
          {
            // 7867689686
            // 7667666968
            // $match: {
            //   $expr: { $or: [{ mobile: data.mobile }, { name: data.name }] },
            // },
            // {
            $match: {
               $expr: {
        $or: [
          {
            $regexMatch: {
              input: { $toString: "$mobile" },
              regex: data.query,
              options: "i",
            },
          },
          {
            $regexMatch: {
              input: "$name",
              regex: data.query,
              options: "i",
            },
          },
        ],
      },
              // },
              // { $eq: ['$studentId', '$$studentId'] },
              // ],
              // },
            },
            // },
          },
        ]
      : [];

    if (searchPipeLine.length > 0) {
      aggregationPipeline = aggregationPipeline.concat(searchPipeLine);
      // const aggsearch = await User.aggregate(searchPipeLine);
      // console.log("aggsearch", aggsearch);
    }
    aggregationPipeline = aggregationPipeline.concat(pipeLines);

    aggregationPipeline = aggregationPipeline.concat([
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          data: [
            { $skip: (returnData.page - 1) * returnData.pageSize },
            { $limit: returnData.pageSize },
          ],
        },
      },
    ]);



    const dataFacet = await User.aggregate(aggregationPipeline);

    console.log('data',JSON.stringify(dataFacet))

    // console.log('[dataFacet, totalDocs]', dataFacet[0].metadata);

    returnData.data = dataFacet[0]?.data  // Access data from facet
    returnData.totalCount = dataFacet[0]?.metadata[0]?.totalCount || 0; // Access count from facet

    console.log('return data',returnData)
    // const page = parseInt(data.page);
    // const limit = parseInt(data.limit) || 10;
    // const skip = page * limit;
    // try {
    //   const appuser = await User.aggregate([
    //     { $match: { role: "user", subscription: { $eq: null } } },

    //     {
    //       $lookup: {
    //         from: "userbusinesses",
    //         localField: "_id",
    //         foreignField: "userId",
    //         as: "businesses",
    //       },
    //     },
    //     {
    //       $addFields: {
    //         totalBusinesses: { $size: "$businesses" },
    //       },
    //     },
    //     {
    //       $sort: { createdAt: -1 },
    //     },
    //     { $skip: skip },
    //     { $limit: limit },
    //   ]);
    //   let newAppUser = [];
    //   await Promise.all(
    //     appuser.map(async (user) => {
    //       const data = await getUserData(user);
    //       newAppUser.push(data);
    //     })
    //   );
    //   const totalLength = await User.count({ role: "user", subscription: null });
    //   return {
    //     status: httpStatus.OK,
    //     page,
    //     limit,
    //     totalPages:
    //     data: {
    //       users: newAppUser.sort(
    //         (a, b) => moment(b.createdAt).toDate() - moment(a.createdAt).toDate()
    //       ),
    //       totalLength: totalLength,
    //     },
    //   };
    return {
      data: returnData,
      status: httpStatus.OK,
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const appUserExcel = async (req,res) => {
    try {
    const users = await User.find({role:{$ne:"superadmin"}}).sort({createdAt:-1}).lean(); // use lean() for better performance

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    // Add header row
    worksheet.columns = [
      { header: "Name", key: "name", width: 20 },
      { header: "Mobile", key: "mobile", width: 15 },
      { header: "Occupation", key: "occupation", width: 25 },
      { header: "Village", key: "village", width: 15 },
      { header: "Taluka", key: "taluka", width: 15 },
      { header: "District", key: "district", width: 15 },
      { header: "Type", key: "userType", width: 15 },
      { header: "Daily Download Limit", key: "downloadLimit", width: 20 },
      { header: "Status", key: "status", width: 10 },
    ];

    // Add rows
    users.forEach((user) => {
      worksheet.addRow({
        name: user.name,
        mobile: user.mobile,
        occupation: user.occupation,
        village: user.village,
        taluka: user.taluka,
        district: user.district,
        userType: user.userType,
        downloadLimit: user.downloadLimit,
        status: user.status ? "Active" : "Inactive",
      });
    });

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=users_export.xlsx"
    );

    // Stream the file
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Excel export error:", err);
    res.status(500).json({ message: "Failed to export users" });
  }

};



const getAppUserInfo = async (userId) => {
  try {
    const panchayat = (await UserPanchayat.findOne({ userId: userId })) || {
      _doc: {},
    };
    const panchayatImages = await Image.find({
      userId: userId,
      userType: "panchayat",
    });

    let newPanchayatImages = [];
    panchayatImages.map((img) => {
      newPanchayatImages.push(img.path);
    });

    const election = await UserElection.findOne({ userId:userId }) || { _doc: {} }
    const electionImages = await Image.find({ userId:userId ,userType:"election"})
    let newElectionImages = []
    electionImages.map(img => {
        newElectionImages.push(img.path)
    })
 
    const panchayatData = {
      ...panchayat._doc,
      panchayatFrame: newPanchayatImages,
      candidateFrame: newElectionImages,
      userId: userId,
    };
    // return panchayatData;

    return {
      data: panchayatData,
      status: httpStatus.OK,
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const adminUsers = async (data) => {
  const page = parseInt(data.page);
  const limit = parseInt(data.limit) || 10;

  const skip = page * limit;
  try {
    const adminuser = await User.aggregate([
      {
        $match: {
          $and: [{ role: { $ne: "user" } }, { role: { $ne: "superadmin" } }],
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalLength = await User.count({
      $and: [{ role: { $ne: "user" } }, { role: { $ne: "superadmin" } }],
    });
    return {
      status: httpStatus.OK,

      data: { users: adminuser, totalLength: totalLength },
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const subscribedUsers = async (data) => {
  const page = parseInt(data.page);
  const limit = parseInt(data.limit) || 10;

  const skip = page * limit;
  try {
    const subscribedusers = await User.find({
      role: "user",
      subscription: { $ne: null },
    })
      .skip(skip)
      .limit(limit);
    let newsubscribedusers = [];
    await Promise.all(
      subscribedusers.map(async (user) => {
        const data = await getUserData(user);
        newsubscribedusers.push(data);
      })
    );
    const totalLength = await User.count({
      role: "user",
      subscription: { $ne: null },
    });
    return {
      status: httpStatus.OK,
      data: {
        users: newsubscribedusers,
        totalLength: totalLength,
      },
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const create = async (data) => {
  try {
    if (data.mobile) {
      const checkMobile = await User.find({ mobile: data.mobile });
      if (checkMobile.length > 0) {
        return {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Mobile number is already exist!, Please try another one",
        };
      }
    }
    if (data.email) {
      const checkEmail = await User.find({ email: data.email });
      if (checkEmail.length > 0) {
        return {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Email address is already exist!, Please try another one",
        };
      }
    }
    let hashPassword;
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(data.password, salt);
    }
    await User.create({
      status: true,
      ...data,
      password: data.password ? hashPassword : undefined,
    });

    return { status: httpStatus.OK, message: "User Added Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (data) => {
  try {
    const checkMobile = await User.find({ mobile: data.mobile });
    if (checkMobile.length > 0) {
      const checkuser = await User.find({
        mobile: data.mobile,
      });

      if (checkuser.length <= 0) {
        return {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message:
            "Mobile address already exist!, Please try another mobile number",
        };
      }
    }

    const userData = { ...data };
    if (
      userData.pin == null ||
      (typeof userData.pin === "string" && userData.pin.trim() === "")
    ) {
      delete userData.pin;
    }

    await User.findByIdAndUpdate(data._id || data.id, userData);
    return { status: httpStatus.OK, message: "User Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (data) => {
  try {
    await User.findByIdAndDelete(data._id || data.id);
    return { status: httpStatus.OK, message: "User Deleted Successfully" };
  } catch (error) {
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const assignSubscription = async (data) => {
  try {
    const subscription = await Subscription.findById(data.subscriptionId);
    const user = await User.findById(data.userId);
    if (user.subscription != undefined) {
      const startDate =
        user.subscription.endDate < new Date()
          ? moment()
          : user.subscription.startDate;
      await User.findByIdAndUpdate(data.userId, {
        $set: {
          subscription: {
            ...subscription._doc,
            subscriptionId: data.subscriptionId,
            startDate: startDate,
            endDate: moment(user.subscription.endDate)
              .add(parseInt(subscription.subscriptionDuration), "months")
              .endOf("day"),
          },
        },
      });
    } else {
      await User.findByIdAndUpdate(data.userId, {
        $set: {
          subscription: {
            ...subscription._doc,
            subscriptionId: data.subscriptionId,
            startDate: moment(),
            endDate: moment()
              .add(subscription.subscriptionDuration, "months")
              .endOf("day"),
          },
        },
      });
    }
    return {
      status: httpStatus.OK,
      message: "Subscription Added Successfully",
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const deleteSubscription = async (data) => {
  try {
    await UserSubscription.findOneAndDelete({
      userId: data.userId,
      subscriptionId: data.subscriptionId,
    });
    await User.findByIdAndUpdate(data.userId, { subscription: null });
    return {
      status: httpStatus.OK,
      message: "Subscription Deleted Successfully",
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const addBusiness = async (data, files) => {
  try {
    const frames = await Image.find({
      userId: data.userId,
      userType: "business",
    });
    if (frames) {
      await Promise.all(
        frames.map(async (fr) => {
          removeFile(fr.path);
        })
      );
      await Image.deleteMany({ userId: data.userId, userType: "business" });
    }
    await Promise.all(
      files.map(async (f) => {
        if (f.fieldname === "businessLogo") {
          data.businessLogo = await getFilesData(f);
        }
        if (f.fieldname === "businessFrame") {
          const frame = await getFilesData(f);
          await Image.create({
            userId: data.userId,
            userType: "business",
            path: frame,
          });
        }
      })
    );
    const checkGram = await UserBusiness.findOne({ userId: data.userId });
    if (checkGram) {
      await UserBusiness.findOneAndUpdate({ userId: data.userId }, data);
    } else {
      await UserBusiness.create(data);
    }
    return {
      status: httpStatus.OK,
      message: "Business details Updated Successfully",
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const addGrampanchayat = async (data, files) => {
  console.log("data", data);
  try {
    const frames = await Image.find({
      userId: data.userId,
      userType: "panchayat",
    });
    if (frames) {
      await Promise.all(
        frames.map(async (fr) => {
          removeFile(fr.path);
        })
      );
      await Image.deleteMany({ userId: data.userId, userType: "panchayat" });
    }
    await Promise.all(
      files.map(async (f) => {
        if (f.fieldname === "panchayatLogo") {
          data.panchayatLogo = await getFilesData(f);
        }
        if (f.fieldname === "personImage") {
          data.personImage = await getFilesData(f);
        }
        if (f.fieldname === "panchayatFrame") {
          const frame = await getFilesData(f);
          await Image.create({
            userId: data.userId,
            userType: "panchayat",
            path: frame,
          });
        }
      })
    );
    const checkGram = await UserPanchayat.findOne({ userId: data.userId });
    if (checkGram) {
      await UserPanchayat.findOneAndUpdate({ userId: data.userId }, data);
    } else {
      await UserPanchayat.create(data);
    }
    return {
      status: httpStatus.OK,
      message: "Subcategory Updated Successfully",
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const addElection = async (data, files) => {
  try {
    const frames = await Image.find({
      userId: data.userId,
      userType: data.userType,
    });
    if (frames) {
      await Promise.all(
        frames.map(async (fr) => {
          removeFile(fr.path);
        })
      );
      await Image.deleteMany({ userId: data.userId, userType: data.userType });
    }

    await Promise.all(
      files.map(async (f) => {
        if (f.fieldname === "candidateSymbol") {
          data.candidateSymbol = await getFilesData(f);
        }
        if (f.fieldname === "candidateImage") {
          data.candidateImage = await getFilesData(f);
        }

        if (f.fieldname === "candidateFrame") {
          const frame = await getFilesData(f);
          await Image.create({
            userId: data.userId,
            userType: data.userType,
            path: frame,
          });
        }
      })
    );
    const checkGram = await UserElection.findOne({ userId: data.userId });
    if (checkGram) {
      delete data._id
      await UserElection.findOneAndUpdate({ userId: data.userId }, data);
    } else {
      await UserElection.create(data);
    }

    return {
      status: httpStatus.OK,
      message: "Election Details Submitted Successfully",
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const getUserPin = async (userId) => {
  try {
    const user = await User.findById(userId).select('pin name mobile').lean();
    if (!user) {
      return { status: httpStatus.NOT_FOUND, message: 'User not found' };
    }
    return {
      status: httpStatus.OK,
      data: {
        userId: user._id,
        name: user.name,
        mobile: user.mobile,
        pin: user.pin || null,
      },
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  appUsers,
  adminUsers,
  subscribedUsers,
  create,
  update,
  remove,
  assignSubscription,
  deleteSubscription,
  addBusiness,
  addGrampanchayat,
  addElection,
  getAppUserInfo,
  appUserExcel,
  getUserPin,
};
