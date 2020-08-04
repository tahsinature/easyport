const { Command } = require("@oclif/command");
const prompts = require("prompts");
const Server = require("./operations/server");
const Check = require("./operations/check");
const KillPort = require("./operations/killport");
const KillPid = require("./operations/killpid");
const Docker = require("./operations/docker");
const colors = require("colors");

const promptOpt = {
  type: "select",
  name: "operation",
  message: "Select an operation",
  choices: [
    { title: "Process Killer (By Port)", value: "killport", description: "Select and kill processes that listening to port" },
    { title: "Process Killer (By Pid)", value: "killpid", description: "Input a pid and kill the process" },
    { title: "Port Checker", value: "check", description: "List all the listening ports" },
    { title: "Port Listener", value: "listen", description: "Listen to a port by creating a small server" },
    { title: "Docker Tools", value: "docker", description: "Some handy tools for docker" },
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
      case "killport":
        await KillPort.run();
        break;
      case "killpid":
        await KillPid.run();
        break;
      case "docker":
        await Docker.run();
        break;
      default:
        console.log(colors.cyan("Oops. Hopefully next time 👋"));
        break;
    }
  }
}

module.exports = Main;
