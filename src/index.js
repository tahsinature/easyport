const colors = require("colors");
const { Command } = require("@oclif/command");
const prompts = require("prompts");
const Check = require("./operations/check");
const ProcessAndPorts = require("./operations/processAndPorts");
const Docker = require("./operations/docker");
const Network = require("./operations/network");
const fuzzy = require("fuzzy");

const choices = [
  { title: "Process & Port Tools", value: "process-and-ports", description: "Tools related to port and process" },
  { title: "Docker Tools", value: "docker", description: "Some handy tools for docker" },
  { title: "Network Tools", value: "network", description: "Network related handy tools" },
];

const titles = choices.map(ele => ele.title);

/**
 * @type {prompts.Options}
 */
const promptOpt = {
  type: "autocomplete",
  name: "operation",
  message: "Where do you wanna go?",
  suggest(input, choicesState) {
    const results = fuzzy.filter(input, titles);
    const filteredIndices = results.map(ele => ele.index);
    return choices.filter((choice, index) => filteredIndices.includes(index));
  },
  choices,
};

const ask = async () => {
  const response = await prompts(promptOpt, { onCancel: process.exit });
  return response;
};

class Main extends Command {
  async run() {
    process.on("exit", () => {
      console.log(colors.cyan("Bye 👋"));
    });

    const { operation } = await ask();

    switch (operation) {
      case "process-and-ports":
        await ProcessAndPorts.run();
        break;
      case "docker":
        await Docker.run();
        break;
      case "network":
        await Network.run();
        break;
      default:
        console.log(colors.cyan("Oops. Hopefully next time"));
        break;
    }
  }
}

module.exports = Main;
