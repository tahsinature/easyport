const { Command } = require("@oclif/command");
const prompts = require("prompts");
const Server = require("./operations/server");
const Check = require("./operations/check");
const Kill = require("./operations/kill");
const colors = require("colors");

const promptOpt = {
  type: "select",
  name: "operation",
  message: "Select an operation",
  choices: [
    { title: "Port Killer", value: "kill" },
    { title: "Port Checker", description: "This option has a description", value: "check" },
    { title: "Port Listener", value: "listen" },
  ],
  initial: 0,
};

const ask = async () => {
  const response = await prompts(promptOpt);
  return response;
};

class Main extends Command {
  async run() {
    const { operation } = await ask();

    process.on("SIGINT", () => {
      process.exit(1);
    });

    switch (operation) {
      case "listen":
        await Server.run();
        break;
      case "check":
        await Check.run();
        break;
      case "kill":
        await Kill.run();
        break;
      default:
        console.log(colors.cyan("Oops. Hopefully next time 👋"));
        break;
    }
  }
}

module.exports = Main;
