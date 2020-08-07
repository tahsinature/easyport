const { Command } = require("@oclif/command");

// get your ip details
// ssh
class Network extends Command {
  async run() {
    console.log("network tools");
  }
}

module.exports = Network;
