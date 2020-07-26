const { Command } = require("@oclif/command");
const prompts = require("prompts");
const shell = require("shelljs");
const pidusage = require("pidusage");
const Table = require("cli-table");
const colors = require("colors");

const listProcesses = list => {
  return prompts({
    type: "autocompleteMultiselect",
    name: "pids",
    message: "Pick a process",
    choices: list.map(ele => ({ title: `${ele.name} (${ele.addr})`, value: ele.pid })),
    min: 1,
  });
};

class Check extends Command {
  async run() {
    const data = this.getListeningPortsData();
    const { pids } = await listProcesses(data);
    if (!pids) {
      console.log(colors.red("No process selected!"));
      process.exit(1);
    }

    const processDetails = await pidusage(pids);
    const table = new Table({ head: Object.keys(Object.values(processDetails)[0]) });
    for (const process in processDetails) {
      table.push(Object.values(processDetails[process]));
    }

    console.log(table.toString());
  }

  getListeningPortsData() {
    /**
     * rapportd 385 *:49213
     * rapportd 385 *:49213
     */
    let data = shell.exec("lsof -nP +c 15 | grep LISTEN | awk '{print($1,$2,$9)}'", { silent: true }).stdout;

    /**
     *  [
     *    'rapportd 385 *:49213',
     *    'rapportd 385 *:49213',
     *    ""
     *  ]
     */
    data = data.split("\n").map(ele => ele);

    /**
     *  [
     *    'rapportd 385 *:49213',
     *    'rapportd 385 *:49213',
     *  ]
     */
    data = data.filter(ele => ele.split(" ").length === 3);

    /**
     *  [
     *    ['rapportd, 385, *:49213'],
     *    ['rapportd, 385, *:49213']
     *  ]
     */
    data = data.map(ele => ele.split(" "));

    /**
     *  [
     *    { name: 'rapportd', pid: '385', addr: '*:49213' },
     *    { name: 'rapportd', pid: '385', addr: '*:49213' }
     *  ]
     */
    data = data.map(ele => ({ name: ele[0], pid: ele[1], addr: ele[2] }));
    return data;
  }
}

module.exports = Check;
