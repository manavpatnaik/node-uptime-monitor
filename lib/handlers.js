// These are the request handlers

// Dependencies
const _data = require("./data");
const helpers = require("./helpers");

// Define handlers
const handlers = {};

// Users
handlers.users = (data, callback) => {
  const acceptableMethods = ["post", "get", "put", "delete"];

  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for user submethods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: None
handlers._users.post = async (data, callback) => {
  // Check that all required fields are filled out
  const firstName =
    typeof data.payload.firstName === "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;

  const lastName =
    typeof data.payload.lastName === "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;

  const phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone.trim()
      : false;

  const password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  const tosAgreement =
    typeof data.payload.tosAgreement === "boolean" &&
    data.payload.tosAgreement == true
      ? true
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    // Make sure user doesnt already exist
    _data.read("users", phone, async (err, data) => {
      if (err) {
        // Hash the passwords
        const hashedPassword = helpers.hash(password);

        if (hashedPassword) {
          // Create the user object
          const userObject = {
            firstName,
            lastName,
            phone,
            password: hashedPassword,
            tosAgreement,
          };

          await _data.create("users", phone, userObject, (err) => {
            if (!err) {
              callback(200, { Success: "Created user" });
            } else {
              console.log(err);
              callback(500, { Error: "Could not create the new user" });
            }
          });
        } else {
          callback(400, { Error: "User with that Phone already exists" });
        }
      } else {
        callback(500, { Error: "Could not hash the user's password." });
      }
    });
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};

// Users - get
// Required phone: phone
// Optional data: None
// @TODO only let authenticated users access their object, not any one else's object
handlers._users.get = (data, callback) => {
  // Check that the phone number is valid
  const phone =
    typeof data.queryStringObject.phone === "string" &&
    data.queryStringObject.phone.trim().length === 10
      ? data.queryStringObject.phone.trim()
      : false;

  if (phone) {
    _data.read("users", phone, (err, data) => {
      if (!err && data) {
        // Remove hashed password from user object
        delete data.password;
        callback(200, data);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};

// Users - put
// Required data: phone
// Optional data: firstName, lastName, password (atleast one must be given)
// @TODO only let authenticated users update their own data alone.
handlers._users.put = (data, callback) => {
  // Check for the required field
  const phone =
    typeof data.payload.phone === "string" &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone.trim()
      : false;

  // Check for optional fields
  const firstName =
    typeof data.payload.firstName === "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;

  const lastName =
    typeof data.payload.lastName === "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;

  const password =
    typeof data.payload.password === "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  if (phone) {
    // Error if nothing is sent to update
    if (firstName || lastName || password) {
      // Lookup user
      _data.read("users", phone, (err, userData) => {
        if (!err && data) {
          // Update necessary fields
          if (firstName) {
            userData.firstName = firstName;
          }
          if (lastName) {
            userData.lastName = lastName;
          }
          if (password) {
            userData.password = helpers.hash(password);
          }
          // Store the new updates
          _data.update("users", phone, userData, (err) => {
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, { Error: "Could not update the user" });
            }
          });
        } else {
          callback(400, { Error: "The specified user does not exist" });
        }
      });
    } else {
      callback(400, { Error: "Missing fields to update" });
    }
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};

// Users - delete
handlers._users.delete = (data, callback) => {
  const phone =
    typeof data.queryStringObject.phone === "string" &&
    data.queryStringObject.phone.trim().length === 10
      ? data.queryStringObject.phone.trim()
      : false;

  if (phone) {
    _data.delete("users", phone, (err) => {
      if (!err) {
        callback(200);
      } else {
        callback(500, { Error: "Could not delete specified user" });
      }
    });
  } else {
    callback(404, { Error: "Could not find specified user" });
  }
};

// Users
handlers.users = (data, callback) => {
  const acceptableMethods = ["post", "get", "put", "delete"];

  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for token submethods
handlers._tokens = {};

// Tokens - post
handlers._tokens.post = (data, callback) => {
  
};

// Tokens - get
handlers._tokens.get = (data, callback) => {};

// Tokens - put
handlers._tokens.put = (data, callback) => {};

// Tokens - delete
handlers._tokens.delete = (data, callback) => {};

// Ping handler
handlers.ping = (data, callback) => {
  callback(200);
};

// Not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

module.exports = handlers;
