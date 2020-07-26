const { Command } = require("@oclif/command");
const http = require("http");
const prompts = require("prompts");
const os = require("os");
const colors = require("colors");
const detect = require("detect-port");

const askPort = () => {
  return prompts({
    name: "port",
    type: "number",
    min: 1,
    max: 65535,
    message: "Enter port that you want to listen to (1 - 65535)",
    validate: async port => {
      const suggestion = await detect(port);
      return suggestion === port || `Port is busy or should not use, suggested: ${colors.cyan(suggestion)}`;
    },
  });
};

const askName = () => {
  return prompts({
    name: "name",
    type: "text",
    initial: os.userInfo().username,
    message: "Enter a name to say hello",
  });
};

class ServerCommand extends Command {
  async run() {
    const { port } = await askPort();
    if (!port) {
      console.log(colors.red("No port chosen!"));
      process.exit(1);
    }
    const { name } = await askName();
    const server = this.getServer(name);
    server.listen(port, () => {
      console.log(`Listening on port ${colors.green(port)}
${colors.gray(`http://0.0.0.0:${port}`)}
${colors.gray(`http://localhost:${port}`)}
`);
    });
  }

  getServer(name) {
    return http.createServer(function (req, res) {
      var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
      // console.log(ip);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write(`Hello ${name}!`);
      res.end();
    });
  }
}

ServerCommand.description = `Describe the command here
...
Extra documentation goes here
`;

// ServerCommand.flags = {
//   // add --version flag to show CLI version
//   version: flags.version({ char: "v" }),
//   // add --help flag to show CLI version
//   help: flags.help({ char: "h" }),
//   port: flags.integer({ char: "p", description: "port to listen", required: true }),
// };

// module.exports.listenToPort = (port) => {

// };

module.exports = ServerCommand;
