#!/usr/bin/env node
import chalk from "chalk";
import { generateInitFolders } from "../../utils";

export const generateInitialStructureAction = async () => {
  try {
    await generateInitFolders();
  } catch (error) {
    console.log(chalk.red("Can't generate component: "));
    console.log(chalk.dim(error));
  }
};
