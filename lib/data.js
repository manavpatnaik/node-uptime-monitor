// Library for storing and editing data

// Dependencies
const fs = require("fs");
const path = require("path");
const helpers = require("./helpers");

// Container for this module
const lib = {};

// Base dir of the data folder
lib.baseDir = path.join(__dirname, "/../.data/");

// Write data into the file
lib.create = async (dir, file, data, callback) => {
  // Open the file for writing
  await fs.open(
    path.join(lib.baseDir, dir, file + ".json"),
    "wx",
    (err, fileDescriptor) => {
      if (!err) {
        // Convert data to string
        let stringData = JSON.stringify(data);

        // Write to file and close it
        fs.writeFile(
          path.join(lib.baseDir, dir, file + ".json"),
          stringData,
          (err) => {
            if (!err) {
              // Closing the file
              fs.close(fileDescriptor, (err) => {
                if (err) {
                  callback("Error closing file");
                } else {
                  callback(false);
                }
              });
            } else {
              callback("Error writing to file");
            }
          }
        );
      } else {
        callback("Could not create new file, it may already exist");
      }
    }
  );
};

// Reading from a file
lib.read = async (dir, file, callback) => {
  await fs.readFile(
    path.join(lib.baseDir, dir, file + ".json"),
    "utf8",
    (err, data) => {
      if (!err && data) {
        callback(false, helpers.parseJsonToObject(data));
      } else {
        callback(err, data);
      }
    }
  );
};

// Update data within a file
lib.update = (dir, file, data, callback) => {
  // Open the file
  fs.open(path.join(lib.baseDir, dir, file + ".json"), (err, fd) => {
    if (!err && fd) {
      let stringData = JSON.stringify(data);

      // Truncate contents of file
      fs.truncate(path.join(lib.baseDir, dir, file + ".json"), (err) => {
        if (!err) {
          // Writing into the file
          fs.writeFile(
            path.join(lib.baseDir, dir, file + ".json"),
            stringData,
            (err) => {
              if (err) callback("Error updating the file");
              else callback(false);
            }
          );
        } else {
          callback("Error truncating the file");
        }
      });
    } else {
      callback("Could not open file for update");
    }
  });
};

lib.delete = (dir, file, callback) => {
  fs.unlink(path.join(lib.baseDir, dir, file + ".json"), (err) => {
    if (err) callback("Error deleting the file");
    else callback(false);
  });
};

module.exports = lib;
