#!/usr/bin/env node
import { input } from "@inquirer/prompts";
import chalk from "chalk";
import select from "@inquirer/select";
import { Structure } from "./model";
import { writeFile } from "fs";

export default async function initCommand() {
  const rootDir = await input({
    message: "Default main directory",
    default: "src",
  });
  const libDir = await input({
    message: "Default lib directory",
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
  const structure = await select({
    message: "Select a package manager",
    choices: [
      {
        name: Structure.DOMAIN,
        value: Structure.DOMAIN,
        description:
          "Application structure domain based, all component based files in lib folder separate folders",
      },
      {
        name: Structure.FEATURE,
        value: Structure.FEATURE,
        description:
          "Application structure feature based, all component based files in component folder",
      },
    ],
  });

  const config = {
    rootDir,
    libDir,
    componentssDir,
    servicessDir,
    reactiveServicessDir,
    statesDir,
    structure,
  };

  writeFile("./sveil-cli.json", JSON.stringify(config, null, 2), (err) => {
    if (err) {
      console.error(err);
    }
  });

  console.log(
    chalk.blue(`
      rootDir: ${rootDir},
      libDir: ${libDir},
      componentssDir: ${componentssDir},
      servicessDir: ${servicessDir},
      reactiveServicessDir: ${reactiveServicessDir},
      statesDir: ${statesDir},
      structure: ${structure}
    `)
  );
}
