const { Command } = require("@oclif/command");
const prompts = require("prompts");
const Check = require("./check");
const kill = require("tree-kill");
const colors = require("colors");

const listProcesses = list => {
  return prompts({
    type: "autocompleteMultiselect",
    name: "pids",
    message: "Pick the processes you wanna kill",
    choices: list.map(ele => ({ title: `${ele.name} (${ele.addr})`, value: ele.pid })),
    hint: "If you want to kill by PID, don't select any process from suggestion and type the pid",
    min: 1,
  });
};

class Kill extends Command {
  async run() {
    const check = new Check();
    const data = check.getListeningPortsData();
    const { pids } = await listProcesses(data);
    if (!pids) {
      console.log(colors.red("No process selected!"));
      process.exit(1);
    }

    const success = [];
    const failed = [];
    for (const pid of pids) {
      await this.killAsync(pid)
        .then(() => {
          success.push(pid);
        })
        .catch(() => {
          failed.push(pid);
        });
    }

    let msg = "";
    if (success.length) msg += `${colors.green(`killed (${success.length}):`)} ${success.join(", ")}\n`;
    if (failed.length) msg += `${colors.red(`failed (${failed.length}):`)} ${failed.join(", ")}`;
    console.log(msg);
  }

  async killAsync(pid) {
    return new Promise((res, rej) => {
      kill(pid, err => (err ? rej(err) : res()));
    });
  }
}

module.exports = Kill;
