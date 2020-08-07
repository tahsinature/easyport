const { Command } = require("@oclif/command");
const prompts = require("prompts");
const colors = require("colors");
const Docker = require("dockerode");

const askOperation = () => {
  return prompts(
    {
      type: "autocomplete",
      name: "operation",
      message: "Select an operation",
      choices: [
        { title: "Select containers", value: "select-containers", description: "List, view & take action" },
        { title: "Remove all containers", value: "remove-all-containers", description: "Both running & stopped" },
        { title: "Get my docker info", value: "get-my-docker-info", description: "Details of running docker instance" },
      ],
    },
    { onCancel: process.exit }
  );
};

/**
 * @param {Docker.ContainerInfo[]} containers
 */
const pickContaniers = containers => {
  return prompts(
    {
      type: "autocompleteMultiselect",
      name: "selectedContainers",
      hint: "green names are running containers",
      message: "Select the containers you wanna deal with",
      min: 1,
      choices: containers.map(container => ({
        title: `${colors[container.State === "running" ? "green" : "red"](container.Names[0])}`,
        value: container,
        message: "test",
        description: "test desc",
      })),
    },
    { onCancel: process.exit }
  );
};

const askContainersAction = () => {
  return prompts(
    {
      type: "autocomplete",
      name: "containerAction",
      message: "Select an action",
      choices: [
        { title: "Start", value: "start", description: "Start selected containers. (already running containrs will be skipped)" },
        { title: "Stop", value: "stop", description: "Stop selected containers. (already stopped containrs will be skipped)" },
        { title: "Remove", value: "remove", description: "Remove (forced) selected containers" },
      ],
    },
    { onCancel: process.exit }
  );
};

class KillPort extends Command {
  docker = new Docker();
  async run() {
    const isDockerRunning = await this.getDockerInfo();
    if (!isDockerRunning) return console.log(colors.red("Docker is not running."));

    const { operation } = await askOperation();

    const containers = await this.docker.listContainers({ all: true });
    switch (operation) {
      case "select-containers":
        if (!containers.length) return console.log(colors.red("No containers found"));

        /**
         * @type {Docker.ContainerInfo[]}
         */
        const selectedContainers = (await pickContaniers(containers)).selectedContainers;
        if (!selectedContainers) {
          console.log(colors.red("No containers selected"));
          process.exit(1);
        }

        const { containerAction } = await askContainersAction();
        this.execContainersAction(selectedContainers, containerAction);
        break;

      case "remove-all-containers":
        if (!containers.length) return console.log(colors.red("No containers found"));
        await this.execContainersAction(containers, "remove");
        break;

      case "get-my-docker-info":
        const info = await this.getDockerInfo();
        console.log(info);
        break;

      default:
        break;
    }
  }

  /**
   * @param {Docker.ContainerInfo[]} containers
   * @param {"remove" | "stop" | "start"} action
   */
  async execContainersAction(containers, action) {
    for (const container of containers) {
      switch (action) {
        case "remove":
          await this.docker.getContainer(container.Id).remove({ force: true });
          break;
        case "start":
          await this.docker.getContainer(container.Id).start();
          break;
        case "stop":
          await this.docker.getContainer(container.Id).stop();
          break;

        default:
          console.log(colors.red("container action not supported"));
      }
    }
  }

  async getDockerInfo() {
    return new Promise(res => {
      this.docker
        .info()
        .then(res)
        .catch(() => res(false));
    });
  }
}

module.exports = KillPort;
