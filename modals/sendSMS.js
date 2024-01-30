const {
  TWILIO_NUMBER,
  TWILIO_TOKEN,
  TWILIO_SID,
  RECEIPTENT_NUMBER,
} = require("../constants");
const client = require("twilio")(TWILIO_SID, TWILIO_TOKEN);

const sendSMS = async () => {
  const messageObj = {
    from: TWILIO_NUMBER,
    to: RECEIPTENT_NUMBER,
    body: "Hello Ts! This is Friday",
  };
  try {
    const response = await client.messages.create(messageObj);
    console.log("Response : ", response.sid);
  } catch (error) {
    console.log("Error : ", error);
  }
};

module.exports = { sendSMS };
