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
  /**
   * https://pubs.opengroup.org/onlinepubs/9699919799/functions/kill.html
   */
  errorCodes = {
    EINVAL: "The value of the sig argument is an invalid or unsupported signal number.",
    EPERM: "The process does not have permission to send the signal to any receiving process.",
    ESRCH: "No process or process group can be found corresponding to that specified by pid.",
  };

  async run() {
    const { pid } = await askPid();
    if (!pid) {
      console.log(colors.red("No pid given!"));
      process.exit(1);
    }

    try {
      process.kill(pid);
      console.log(colors.cyan("Process killed"));
    } catch (error) {
      console.log(colors.red(this.errorCodes[error.code]));
    }
  }

  async killAsync(pid) {
    return new Promise((res, rej) => {
      kill(pid, err => (err ? rej(err) : res()));
    });
  }
}

module.exports = KillPort;
