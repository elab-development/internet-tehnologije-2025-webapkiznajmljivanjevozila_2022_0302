const SecurityLog = require("../models/SecurityLog");

const logSecurityEvent = async ({
  event,
  userId = null,
  email = null,
  req = null,
  status = null,
  details = null
}) => {

  try {

    await SecurityLog.create({
      event,
      userId,
      email,
      ip: req?.ip,
      endpoint: req?.originalUrl,
      method: req?.method,
      status,
      details
    });

  } catch (error) {

    console.error("Security log error:", error);

  }

};

module.exports = logSecurityEvent;