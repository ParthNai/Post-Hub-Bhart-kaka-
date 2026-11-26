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
    const checkExist = await Token.findOne({ token: data.token });
    if (checkExist && checkExist.length > 0) {
      return { status: httpStatus.OK };
    }
    await Token.create(data);
    return { status: httpStatus.OK, message: "Token registered successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const sendNotifications = async ({ title, body, imageUrl }) => {
  try {
    const alltokens = await Token.find();
    const tokens = await Promise.all(
      alltokens.map((t) => {
        return t.token;
      })
    );

    const sendNoti = async (first, second) => {
      const finalTokens = tokens.slice(first, second);
      if (finalTokens.length > 0) {
        const send = await admin.messaging().sendMulticast({
          tokens: finalTokens,
          notification: {
            title,
            body,
            imageUrl,
          },
          topic: "egrampost",

          // data: data
        });
        console.log("send", send);
        if (send.responses[0].success) {
          return {
            status: httpStatus.OK,
            message: "Notification sent successfully",
          };
        } else {
          return {
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: send.responses[0].error || "Failed to send notification",
          };
        }
      }
    };

    let firstSlice = 0;
    let secondSlice = 499;
    const getTokens = async () => {
      if (secondSlice < tokens?.length) {
        await sendNoti(firstSlice, secondSlice);
        firstSlice += 500;
        secondSlice += 500;
        await getTokens();
        console.log("if");
      } else {
        console.log("else");

        if (secondSlice !== tokens?.length) {
          secondSlice = tokens?.length;
          await sendNoti(firstSlice, secondSlice);
        }
      }
    };
    await getTokens();
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to send notification",
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
