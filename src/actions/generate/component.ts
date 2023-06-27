#!/usr/bin/env node
import chalk from "chalk";
import { getComponentSchema } from "../../schemas/component/component";
import {
  createDir,
  generateFile,
  generateCompotentPath,
  getConfig,
  logGeneratedFile,
} from "../../utils";
import { normalize } from "path";
import { getCssMainRule } from "../../schemas/style";
const prettier = require("prettier");

export const generateComponentAction = async (
  componentName: string,
  options: any
) => {
  try {
    const { dry, scriptLanguage, cssLanguage, cssExternal, separate } = options;
    const { sourceDir, libDir, componentsDir, ...config } = await getConfig();
    const defaultScriptLang = scriptLanguage || config.defaultScriptLang;
    const folderPath = await generateCompotentPath(
      componentName,
      cssExternal || separate
    );
    const fullPath = normalize(`${folderPath}/${componentName}.svelte`);
    const componentBody = prettier.format(
      await getComponentSchema(componentName, {
        scriptLanguage: defaultScriptLang,
        cssExternal,
        cssLanguage,
      }),
      {
        parser: "svelte",
      }
    );

    if (!dry) {
      await createDir(folderPath);
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
