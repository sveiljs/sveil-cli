#!/usr/bin/env node
import { input, confirm } from "@inquirer/prompts";
import chalk from "chalk";
import select from "@inquirer/select";
import { Config, ScriptLangs, Structure } from "../model";
import { generateFile, generateInitFolders, getActionError } from "../utils";
import { readdir } from "fs/promises";

export default async function initCommand(this: any) {
  const options = this.opts();
  const rootFiles = await readdir(process.cwd());
  const tsDetected = rootFiles.includes("tsconfig.json");

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

  const DEFAULT_STRUCTURE = Structure.DOMAIN;
  const DEFAULT_ROOT_DIR = "src";
  const DEFAULT_LIB_DIR = "lib";
  const DEFAULT_FEATURES_DIR = "features";
  const DEFAULT_COMPONENTS_DIR = "components";
  const DEFAULT_SERVICES_DIR = "services";
  const DEFAULT_REACTIVE_SERVICES_DIR = "$services";
  const DEFAULT_STATE_DIR = "state";
  const DEFAULT_SHARED_DIR = "shared";

  let err = await getActionError();
  let featuresDir = "";
  let scriptLang = options.scriptLanguage || "";

  if (err) {
    console.log(chalk.red(err));
    return;
  }

  const structure =
    options.structure ||
    (options.skip && DEFAULT_STRUCTURE) ||
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

  const rootDir = await getDirChoice("rootDir", DEFAULT_ROOT_DIR, "root");

  const libDir = await getDirChoice("libDir", DEFAULT_LIB_DIR, "library");

  if (structure === Structure.FEATURE) {
    featuresDir = await getDirChoice(
      "featuresDir",
      DEFAULT_FEATURES_DIR,
      "features"
    );
  }

  const componentsDir = await getDirChoice(
    "componentsDir",
    DEFAULT_COMPONENTS_DIR,
    "components"
  );

  const servicesDir = await getDirChoice(
    "servicesDir",
    DEFAULT_SERVICES_DIR,
    "services"
  );

  const reactiveServicesDir = await getDirChoice(
    "reactiveServicesDir",
    DEFAULT_REACTIVE_SERVICES_DIR,
    "reactive services"
  );

  const stateDir = await getDirChoice("stateDir", DEFAULT_STATE_DIR, "state");

  const sharedDir = await getDirChoice(
    "sharedDir",
    DEFAULT_SHARED_DIR,
    "shared"
  );

  if (tsDetected && !options.scriptLanguage && !options.skip) {
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
    componentsDir,
    servicesDir,
    reactiveServicesDir,
    stateDir,
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
