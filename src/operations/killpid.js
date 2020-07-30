const { Command } = require("@oclif/command");
const prompts = require("prompts");
const Check = require("./check");
const kill = require("tree-kill");
const colors = require("colors");

const askPid = list => {
  return prompts({
    type: "number",
    name: "pid",
    message: "Type the pid you wanna kill",
    style: "default",
    min: 1,
  });
};

class KillPort extends Command {
  async run() {
    const { pid } = await askPid();
    if (!pid) {
      console.log(colors.red("No process selected!"));
      process.exit(1);
    }

    try {
      process.kill(pid);
      console.log(colors.cyan("Process killed"));
    } catch (error) {
      console.log(`Failed to kill - ${colors.red(error.message)}`);
    }
  }

  async killAsync(pid) {
    return new Promise((res, rej) => {
      kill(pid, err => (err ? rej(err) : res()));
    });
  }
}

module.exports = KillPort;
