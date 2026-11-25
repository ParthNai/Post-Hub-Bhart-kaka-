const axios = require("axios");
const httpStatus = require("http-status");
const config = require('../config/config')

const SMS_SENDER_ID = config.sms.senderId;
const SMS_USERNAME = config.sms.username;
const SMS_PASSWORD = config.sms.password;
const SMS_DLTTEMPLATE_ID = config.sms.DLTTemplateId;
const SMS_ENTITYID = config.sms.entityId

const sendSms = async (mobile, message) => {
    try {
        await axios.get(
            `http://temp.91bulksms.com/submitsms.jsp?user=${SMS_USERNAME}&key=${SMS_PASSWORD}&mobile=${mobile}&message=${message}&senderid=${SMS_SENDER_ID}&accusage=1&entityid=${SMS_ENTITYID}&tempid=${SMS_DLTTEMPLATE_ID}`
        );
        // console.log(response);
        return ({ status: httpStatus.OK, message: "OTP sent successfully" });
    } catch (e) {
        console.log(e);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to send OTP" });
    }
};
module.exports = sendSms;
