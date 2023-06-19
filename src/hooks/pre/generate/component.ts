import { input } from "@inquirer/prompts";
import {
  getComponentsDir,
  isCompoentExisted,
  isTsDetected,
  removeDuplicates,
} from "../../../utils";
import chalk from "chalk";
import { exit } from "node:process";

export const generateComponentHook = async (command, action) => {
  try {
    const { args } = action;
    const componentName = args[0];
    const { scriptLanguage, overwrite } = command.opts();
    const isTsFound = await isTsDetected();
    const isCompoentExist = await isCompoentExisted(componentName);

    if (!isTsFound && scriptLanguage === "ts") {
      throw "Typescript is not detected, can't set 'ts' as component script language";
    }

    if (isCompoentExist) {
      if (!overwrite) {
        throw "Can't rewrite existed component, please, provide '-o, -overwrite' option";
      }

      const confirm = await input({
        message: "WARNING: Please, type component name to owerwrite",
      });

      if (confirm !== componentName) {
        throw `component name and input does not matches: ${componentName} - ${confirm}`;
      }

      await removeDuplicates(await getComponentsDir(), componentName);
      console.log(chalk.redBright("Existed component removed!"));
    }
  } catch (error) {
    console.error(error);
    exit(1);
  }
};
