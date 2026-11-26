const httpStatus = require("http-status");
const { FestivalPost, Festival, Image } = require("../../models");
const moment = require("moment");
const { Token } = require("../../models");

const admin = require("firebase-admin");
const config = require("../../config/config");

try {
  const serviceAccount = require("../../firebase.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.mongoose.url,
  });
} catch (e) {
  console.log("[Notice] Firebase admin not initialized:", e.message);
}

const register = async (data) => {
  try {
    if (!data || typeof data.token !== "string" || !data.token.trim()) {
      return {
        status: httpStatus.BAD_REQUEST,
        message: "A non-empty device token is required",
      };
    }

    await Token.findOneAndUpdate(
      { token: data.token.trim() },
      { $set: { token: data.token.trim() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return { status: httpStatus.OK, message: "Token registered successfully" };
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to register device token",
    };
  }
};

const sendNotifications = async ({ title, body, imageUrl }) => {
  try {
    if (admin.apps.length === 0) {
      return {
        status: httpStatus.SERVICE_UNAVAILABLE,
        message: "Firebase Admin is not initialized",
      };
    }

    const tokenDocs = await Token.find().select("token").lean();
    const tokens = Array.from(
      new Set(tokenDocs.map((tokenDoc) => tokenDoc.token).filter(Boolean))
    );
    if (tokens.length === 0) {
      return {
        status: httpStatus.NOT_FOUND,
        message: "No device tokens are registered",
      };
    }

    let successCount = 0;
    let failureCount = 0;
    const failureCodes = new Set();
    for (let offset = 0; offset < tokens.length; offset += 500) {
      const response = await admin.messaging().sendMulticast({
        tokens: tokens.slice(offset, offset + 500),
        notification: {
          title,
          body,
          imageUrl,
        },
      });

      successCount += response.successCount;
      failureCount += response.failureCount;
      response.responses.forEach((result) => {
        if (!result.success && result.error) {
          failureCodes.add(result.error.code);
        }
      });
    }

    return {
      status: failureCount === 0
        ? httpStatus.OK
        : successCount === 0
        ? httpStatus.INTERNAL_SERVER_ERROR
        : 207,
      message: `Notification sent to ${successCount} of ${tokens.length} devices`,
      successCount,
      failureCount,
      failureCodes: Array.from(failureCodes),
    };
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || "Failed to send notification",
    };
  }
};

const sendFestivalNotification = async (data) => {
  try {
    const currentStart = moment().startOf("day").toDate();
    const currentEnd = moment().endOf("day").toDate();
    const getTodayFestival = await FestivalPost.find({
      postStartDate: {
        $gte: currentStart,
        $lte: currentEnd,
      },
      status: true,
    });
    await Promise.all(
      getTodayFestival.map(async (f) => {
        const festival = await Festival.findById(f.festivalId);
        const title = festival.festivalName;
        const body = festival.festivalDescription;
        // const data = {
        //   festivalId: f.festivalId,
        //   festivalName: festival.festivalName
        // }
        const image = await Image.findOne({ festivalId: f.festivalId });
        const imageUrl = `https://egrampost.com/${image.path}`;
        await sendNotifications({
          title: title,
          body: body,
          imageUrl: imageUrl,
        });
      })
    );
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to send notification",
    };
  }
};

module.exports = {
  register,
  sendNotifications,
  sendFestivalNotification,
};
