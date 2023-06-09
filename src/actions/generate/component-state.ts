#!/usr/bin/env node
import chalk from "chalk";
import { readdir, stat } from "fs/promises";
import { getComponentsDir } from "../../utils";
import { normalize } from "path";
// import { mkdir } from "fs/promises";
// const prettier = require("prettier");

export const generateComponentState = async (
  componentName: string
  // options: any
) => {
  try {
    const components = await readdir(await getComponentsDir());
    const existedComponent = components.find(
      (c) => c.split(".")[0] === componentName
    );

    if (!existedComponent) throw `Component ${componentName} is not exists`;

    const componentState = await stat(
      normalize(`${await getComponentsDir()}/${existedComponent}`)
    );
    console.log("componentState", componentState.isDirectory());

    // const {
    //   dry,
    // } = options;
  } catch (error) {
    console.log(chalk.red("Can't generate component state: "));
    console.log(chalk.dim(error));
  }
};
