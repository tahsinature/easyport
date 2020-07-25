const http = require("http");

const server = http.createServer(function (req, res) {
  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
  console.log(ip);
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Hello World!");
  res.end();
});

module.exports.listenToPort = (port) => {
  server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};
