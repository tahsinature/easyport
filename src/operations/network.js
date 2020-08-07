const { Command } = require("@oclif/command");
const internalIp = require("internal-ip");
const publicIp = require("public-ip");

internalIp.v4().then(console.log);
publicIp.v4().then(console.log);

// get your ip details
// ssh
class Network extends Command {
  async run() {
    console.log("network tools");
  }
}

module.exports = Network;
