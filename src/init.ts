#!/usr/bin/env node
import { input } from "@inquirer/prompts";
import chalk from "chalk";
import select from "@inquirer/select";
import { Config, Structure } from "./model";
import { generateFile, generateInitFolders, getActionError } from "./utils";

export default async function initCommand(this: any) {
  const options = this.opts();
  let err = await getActionError();
  let featuresDir = "";

  if (err) {
    console.log(chalk.red(err));
    return;
  }

  const structure = await select({
    message: "Select a package manager",
    choices: [
      {
        name: Structure.DOMAIN,
        value: Structure.DOMAIN,
        description:
          "Application structure: domain based. All component based files in lib folder with separate folders",
      },
      {
        name: Structure.FEATURE,
        value: Structure.FEATURE,
        description:
          "Application structure: feature based. All component based files in component folder with separate folders",
      },
    ],
  });

  if (structure === Structure.FEATURE) {
    featuresDir = await input({
      message: "Default features directory",
      default: "features",
    });
  }

  const rootDir = await input({
    message: "Default main directory",
    default: "src",
  });
  const libDir = await input({
    message: "Default library directory",
    default: "lib",
  });
  const componentssDir = await input({
    message: "Default components directory",
    default: "components",
  });
  const servicessDir = await input({
    message: "Default services directory",
    default: "services",
  });
  const reactiveServicessDir = await input({
    message: "Default reactive services directory",
    default: "$services",
  });
  const statesDir = await input({
    message: "Default state directory",
    default: "state",
  });
  const sharedDir = await input({
    message: "Default shared directory",
    default: "shared",
  });

  const config: Config = {
    structure,
    rootDir,
    libDir,
    componentssDir,
    servicessDir,
    reactiveServicessDir,
    statesDir,
    sharedDir,
    featuresDir,
    defaultCssLang: "",
    defaultScriptLang: "",
  };

  if (!options.dry) {
    await generateFile("./sveil-cli.json", config);
    await generateInitFolders();
  }

  console.log(
    chalk.blue(`
        sveil-cli.json created with:
          rootDir: ${rootDir},
          libDir: ${libDir},
          componentssDir: ${componentssDir},
          servicessDir: ${servicessDir},
          reactiveServicessDir: ${reactiveServicessDir},
          statesDir: ${statesDir},
          structure: ${structure}
        In ${process.cwd()}  
      `)
  );
}
