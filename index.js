// Primary file for API

// Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./lib/config");
const fs = require("fs");
const handlers = require("./lib/handlers");
const helpers = require("./lib/helpers");

// Instantiating http server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

// Start the http server
const httpPORT = config.httpPort;
httpServer.listen(httpPORT, () => console.log(`Listening on PORT ${httpPORT}`));

// Instatiating https server
const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem"),
};
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

// Start https server
const httpsPORT = config.httpsPort;
httpsServer.listen(httpsPORT, () =>
  console.log(`Listening on PORT ${httpsPORT}`)
);

// Unified server - listens to both http and https requests
const unifiedServer = function (req, res) {
  // Get URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get path from URL
  const path = parsedUrl.pathname;
  const trimmedPath = path.trim().replace(/^\/+|\/+$/g, "");

  // Get query string as object
  const queryStringObject = parsedUrl.query;

  // Get HTTP method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });
  req.on("end", () => {
    buffer += decoder.end();

    // Choose the handler the request should go to
    const chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send to handler
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    // Router the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by handler or default to 200
      statusCode = typeof statusCode === "number" ? statusCode : 200;

      // Use the payload called back by handler, or default to empty object
      payload = typeof payload === "object" ? payload : {};

      // Convert the payload to a string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      console.log("Returning this response:", statusCode, payloadString);
    });
  });
};

// Define a request router
const router = {
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens,
};
