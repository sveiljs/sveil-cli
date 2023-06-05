#!/usr/bin/env node
import chalk from "chalk";
import { getComponentSchema } from "../schemas/component";
import {
  generateFile,
  getComponentPath,
  getComponentsDir,
  getConfig,
  isCompoentExisted,
  isTsDetected,
  logGeneratedFile,
  removeDuplicates,
} from "../utils";
import { mkdir } from "fs/promises";
import { normalize } from "path";
import { getCssMainRule } from "../schemas/style";
import { input } from "@inquirer/prompts";
const prettier = require("prettier");

export const generateComponent = async (
  componentName: string,
  options: any
) => {
  try {
    const { dry, scriptLanguage, cssLanguage, cssExternal, overwrite } =
      options;

    if (
      !(await isTsDetected()) &&
      scriptLanguage.toLocaleLowerCase() === "ts"
    ) {
      throw "Typescript is not detected, can't set 'ts' as component script language";
    }

    const { defaultScriptLang } = await getConfig();

    if (await isCompoentExisted(componentName)) {
      const msg =
        "Can't rewrite existed component, please, provide '-o, -overwrite' option";
      if (!overwrite) throw msg;
      const confirm = await input({
        message: "WARNING: Please, type component name to owerwrite",
      });
      if (confirm !== componentName) throw msg;
      await removeDuplicates(await getComponentsDir(), componentName);
      console.log(chalk.redBright("Existed component removed!"));
    }

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
