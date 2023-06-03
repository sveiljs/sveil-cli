#!/usr/bin/env node
import chalk from "chalk";
import { getComponentSchema } from "../schemas/component";
import {
  generateFile,
  getComponentPath,
  getConfig,
  isTsDetected,
  logGeneratedFile,
} from "../utils";
import { mkdir } from "fs/promises";
import { normalize } from "path";
import { getCssMainRule } from "../schemas/style";
const prettier = require("prettier");

export const generateComponent = async (
  componentName: string,
  options: any
) => {
  try {
    const { dry, scriptLanguage, cssLanguage, cssExternal } = options;

    if (
      !(await isTsDetected()) &&
      scriptLanguage.toLocaleLowerCase() === "ts"
    ) {
      throw "Typescript is not detected, can't set 'ts' as component script language";
    }

    const { defaultScriptLang } = await getConfig();

    const folderPath = await getComponentPath(componentName, cssExternal);

    const fullPath = normalize(`${folderPath}/${componentName}.svelte`);

    const componentBody = prettier.format(
      await getComponentSchema(componentName, {
        scriptLanguage: scriptLanguage || defaultScriptLang,
        cssExternal,
        cssLanguage,
      }),
      {
        parser: "svelte",
      }
    );

    if (!dry) {
      await mkdir(folderPath, { recursive: true });

      if (cssExternal) {
        const styleFileName = "style.css";
        const cssFilePath = normalize(`${folderPath}/${styleFileName}`);
        await generateFile(cssFilePath, getCssMainRule(componentName));
        logGeneratedFile(`${styleFileName}`, cssFilePath);
      }

      await generateFile(fullPath, componentBody);
    }

    logGeneratedFile(`${componentName}.svelte`, fullPath);
  } catch (error) {
    console.log(chalk.red("Can't generate component: "));
    console.log(chalk.dim(error));
  }
};
