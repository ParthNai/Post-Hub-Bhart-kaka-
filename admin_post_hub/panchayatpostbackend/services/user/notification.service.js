const httpStatus = require("http-status");
const { FestivalPost, Festival, Image } = require("../../models");
const moment = require("moment");
const axios = require("axios");
const config = require("../../config/config");

const sendNotifications = async ({ title, body, imageUrl }) => {
  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof body !== "string" ||
    !body.trim()
  ) {
    return {
      status: httpStatus.BAD_REQUEST,
      message: "Notification title and body are required",
    };
  }

  const { appId, restApiKey } = config.onesignal;
  if (!appId || !restApiKey) {
    return {
      status: httpStatus.SERVICE_UNAVAILABLE,
      message: "OneSignal App ID and REST API key are not configured",
    };
  }

  const payload = {
    app_id: appId,
    target_channel: "push",
    included_segments: ["Subscribed Users"],
    headings: { en: title.trim() },
    contents: { en: body.trim() },
  };
  if (typeof imageUrl === "string" && imageUrl.trim()) {
    payload.big_picture = imageUrl.trim();
    payload.ios_attachments = { poster: imageUrl.trim() };
  }

  try {
    const response = await axios.post(
      "https://api.onesignal.com/notifications",
      payload,
      {
        headers: {
          Authorization: `Key ${restApiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    const result = response.data || {};
    const recipients = Number.isFinite(result.recipients)
      ? result.recipients
      : null;
    return {
      status: recipients === 0 ? httpStatus.NOT_FOUND : httpStatus.OK,
      message:
        recipients === 0
          ? "OneSignal accepted the notification, but no subscribed devices were found"
          : `Notification submitted to OneSignal${recipients === null ? "" : ` for ${recipients} devices`}`,
      notificationId: result.id || null,
      recipients,
    };
  } catch (error) {
    const responseData = error.response && error.response.data;
    const apiErrors = responseData && responseData.errors;
    const details = Array.isArray(apiErrors)
      ? apiErrors.join("; ")
      : typeof apiErrors === "string"
      ? apiErrors
      : null;
    console.error("[OneSignal] Notification request failed:", error.message);
    return {
      status: httpStatus.BAD_GATEWAY,
      message: details || "OneSignal could not accept the notification",
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
  sendNotifications,
  sendFestivalNotification,
};
