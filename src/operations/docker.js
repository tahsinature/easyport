const { Command } = require("@oclif/command");
const prompts = require("prompts");
const kill = require("tree-kill");
const colors = require("colors");
const shell = require("shelljs");
const cliParser = require("../util/cliParser");

const askOperation = list => {
  return prompts({
    type: "autocomplete",
    name: "operation",
    message: "Pick the processes you wanna kill",
    choices: [
      { title: "Stop all containers", value: "stopallcontainers", description: "Stop all running containrs" },
      { title: "Remove all containers", value: "removecontainers", description: "Remove all running & stopped containrs" },
    ],
  });
};

const askForContaniers = async () => {
  const output = shell.exec("docker ps -a", { silent: true }).stdout.trim();
  const data = cliParser(output);
  if (!data.length) return [];

  const selected = await prompts({
    type: "multiselect",
    name: "ids",
    message: "Pick the processes you wanna kill",
    choices: data.map(ele => ({ title: ele.NAMES, value: ele.CONTAINER, description: ele.STATUS })),
  });

  return selected.ids;
};

class KillPort extends Command {
  async run() {
    const dockerVersion = shell.exec("docker --version", { silent: true }).stdout.trim();
    if (!dockerVersion) console.log(colors.red("Docker is not installed."));
    const { operation } = await askOperation();

    switch (operation) {
      case "removecontainers":
        const ids = await askForContaniers();
        if (!ids.length) console.log(colors.red("No containers found"));
        shell.exec(`docker rm -f ${ids.join(" ")}`);
        break;

      default:
        break;
    }
  }
}

module.exports = KillPort;
