const { Command, flags } = require("@oclif/command");
const { listenToPort } = require("./server");
const prompts = require("prompts");

const questions = [
  {
    type: "text",
    name: "username",
    message: "What is your GitHub username?",
  },
  {
    type: "number",
    name: "age",
    message: "How old are you?",
  },
  {
    type: "text",
    name: "about",
    message: "Tell something about yourself",
    initial: "Why should I?",
  },
];

const promptOpt = {
  type: "select",
  name: "operation",
  message: "Pick a color",
  choices: [
    { title: "Port Killer", value: "kill" },
    { title: "Port Checker", description: "This option has a description", value: "check" },
    { title: "Port Viewer", value: "view" },
    { title: "Port Listener", value: "listen" },
  ],
  initial: 1,
};

const ask = async () => {
  const response = await prompts(promptOpt);
  return response;

  // => response => { username, age, about }
};

class EasyportCommand extends Command {
  async run() {
    const response = await ask();
    console.log(response);
    // const { flags } = this.parse(EasyportCommand);
    // listenToPort(flags.port);
  }
}

EasyportCommand.description = `Describe the command here
...
Extra documentation goes here
`;

EasyportCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({ char: "v" }),
  // add --help flag to show CLI version
  help: flags.help({ char: "h" }),
  port: flags.integer({ char: "p", description: "port to listen", required: true }),
};

module.exports = EasyportCommand;
