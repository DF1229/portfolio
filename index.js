// Running the app starts here, this file creates the HTTP server and opens the port for the underlying API.
// This file gets called manually.

const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

server.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});