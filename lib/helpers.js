// Helpers for various tasks

// Dependencies
const crypto = require("crypto");
const config = require("./config");

// Conatiner for helpers
const helpers = {};

// Create a SHA256 hash
helpers.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", config.hashingSecret)
      .update(str)
      .digest("hex");

    return hash;
  } else {
    return false;
  }
};

// JSON string to Object
helpers.parseJsonToObject = (data) => {
  try {
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch (error) {
    return {};
  }
};

module.exports = helpers;
