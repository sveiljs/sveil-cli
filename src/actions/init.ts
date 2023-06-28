#!/usr/bin/env node
import { input } from "@inquirer/prompts";
import chalk from "chalk";
// import select from "@inquirer/select";
import { Config, Structure } from "../model";
import { generateFile, generateInitFolders, getActionError } from "../utils";
import { defaultConfig } from "../config";

export default async function initCommand(this: any) {
  const options = this.opts();

  const getDirChoice = async (
    option: string,
    defaultValue: string,
    msg: string
  ) =>
    options[option] ||
    (options.skip && defaultValue) ||
    (await input({
      message: `Default ${msg} directory`,
      default: defaultValue,
    }));

  let err = await getActionError();
  // let featuresDir = "";

  if (err) {
    console.log(chalk.red(err));
    return;
  }

  // const structure =
  //   options.structure ||
  //   (options.skip && DEFAULT_STRUCTURE) ||
  //   (await select({
  //     message: "Select a package manager",
  //     choices: [
  //       {
  //         name: Structure.DOMAIN,
  //         value: Structure.DOMAIN,
  //         description:
  //           "Application structure: domain based. All component based files in lib folder with separate folders",
  //       },
  //       {
  //         name: Structure.FEATURE,
  //         value: Structure.FEATURE,
  //         description:
  //           "Application structure: feature based. All component based files in component folder with separate folders",
  //       },
  //     ],
  //   }));

  // if (structure === Structure.FEATURE) {
  //   featuresDir = await getDirChoice(
  //     "featuresDir",
  //     DEFAULT_FEATURES_DIR,
  //     "features"
  //   );
  // }

  const sourceDir = await getDirChoice(
    "sourceDir",
    defaultConfig.sourceDir,
    "source"
  );

  const libDir = await getDirChoice("libDir", defaultConfig.libDir, "library");

  const componentsDir = await getDirChoice(
    "componentsDir",
    defaultConfig.componentsDir,
    "components"
  );

  // const servicesDir = await getDirChoice(
  //   "servicesDir",
  //   defaultConfig.servicesDir,
  //   "services"
  // );

  // const stateDir = await getDirChoice(
  //   "stateDir",
  //   defaultConfig.stateDir,
  //   "state"
  // );

  // const sharedDir = await getDirChoice(
  //   "sharedDir",
  //   defaultConfig.sharedDir,
  //   "shared"
  // );

  const config: Config = {
    structure: Structure.DOMAIN,
    sourceDir,
    libDir,
    componentsDir,
    // featuresDir,
  };

  if (!options.dry) {
    await generateFile("./sveil-cli.json", config);
    await generateInitFolders();
  }

  console.log(chalk.blue("sveil-cli.json created with:"));
  console.log(chalk.blue(JSON.stringify(config, null, 2)));
  console.log(chalk.blue(`In ${process.cwd()}`));
}
