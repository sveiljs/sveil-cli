#!/usr/bin/env node
import chalk from "chalk";
import { getComponentSchema } from "../schemas/component";
import {
  generateFile,
  getComponentPath,
  getConfig,
  isTsDetected,
} from "../utils";
import { Structure } from "../model";
import { mkdir } from "fs/promises";
import { normalize } from "path";
const prettier = require("prettier");

export const generateComponent = async (fileName: string, options: any) => {
  try {
    const { dry, scriptLanguage } = options;

    if (
      !(await isTsDetected()) &&
      scriptLanguage.toLocaleLowerCase() === "ts"
    ) {
      throw "Typescript is not detected, can't set 'ts' as component script language";
    }

    const { structure, defaultScriptLang } = await getConfig();

    const folderPath = await getComponentPath(fileName);

    const fullPath = normalize(`${folderPath}/${fileName}.svelte`);

    const componentBody = prettier.format(
      await getComponentSchema(fileName, {
        scriptLang: scriptLanguage || defaultScriptLang,
      }),
      {
        parser: "svelte",
      }
    );

    if (!dry) {
      if (structure === Structure.DOMAIN) {
        await generateFile(fullPath, componentBody);
      } else {
        await mkdir(folderPath, { recursive: true });
        await generateFile(fullPath, componentBody);
      }
    }

    console.log(
      chalk.blue(`
        svelte component ${fileName}.svelte generated in ${fullPath}
      `)
    );
  } catch (error) {
    console.log(chalk.red("Can't generate component: "));
    console.log(chalk.dim(error));
  }
};
