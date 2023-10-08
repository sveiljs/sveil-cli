import chalk from "chalk";
import { readFile } from "node:fs/promises";
import { exit } from "node:process";

export const generateComponentStateHook = async () => {
  try {
    const content = await readFile(process.cwd() + "/package.json", {
      encoding: "utf8",
    });
    const json = JSON.parse(content);
    if (
      !json.dependencies["@sveil/core"] &&
      !json.devDependencies["@sveil/core"]
    ) {
      throw "@sveil/core is required for this command. Please run: 'npm install @sveil/core' and try again.";
    }
  } catch (error) {
    console.log(chalk.redBright(error));
    exit(1);
  }
};
