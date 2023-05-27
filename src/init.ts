#!/usr/bin/env node
import { input, confirm } from "@inquirer/prompts";
import chalk from "chalk";
import select from "@inquirer/select";
import { Config, ScriptLangs, Structure } from "./model";
import { generateFile, generateInitFolders, getActionError } from "./utils";
import { readdir } from "fs/promises";

export default async function initCommand(this: any) {
  const options = this.opts();
  const rootFiles = await readdir(process.cwd());
  const tsDetected = rootFiles.includes("tsconfig.json");
  let err = await getActionError();
  let featuresDir = "";
  let scriptLang = "";

  if (err) {
    console.log(chalk.red(err));
    return;
  }

  const structure =
    options.structure ||
    (await select({
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
    }));
  const rootDir =
    options.rootDir ||
    (await input({
      message: "Default main directory",
      default: "src",
    }));
  const libDir =
    options.libDir ||
    (await input({
      message: "Default library directory",
      default: "lib",
    }));

  if (structure === Structure.FEATURE) {
    featuresDir =
      options.featuresDir ||
      (await input({
        message: "Default features directory",
        default: "features",
      }));
  }

  const componentssDir =
    options.componentsDir ||
    (await input({
      message: "Default components directory",
      default: "components",
    }));
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

  if (tsDetected) {
    scriptLang = (await confirm({
      message:
        "Typescript config detected. Do you want use ts lang in svelte scripts by default?",
      default: true,
    }))
      ? ScriptLangs.TS
      : "";
  }

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
    defaultScriptLang: scriptLang,
  };

  if (!options.dry) {
    await generateFile("./sveil-cli.json", config);
    await generateInitFolders();
  }

  console.log(chalk.blue("sveil-cli.json created with:"));
  console.log(chalk.blue(JSON.stringify(config, null, 2)));
  console.log(chalk.blue(`In ${process.cwd()}`));
}
