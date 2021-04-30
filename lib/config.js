// Create and Export configuration variables

// Container for all the environments
const environments = {};

// Staging (default) environment
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging",
  hashingSecret: "MySecret",
};

// Production environment
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production",
  hashingSecret: "MySecret",
};

// Determine which environment was passed as cli agrument
const currentEnv =
  typeof process.env.NODE_ENV === "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

const envToExport =
  typeof environments[currentEnv] !== "undefined"
    ? environments[currentEnv]
    : environments.staging;

module.exports = envToExport;
