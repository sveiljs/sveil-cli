#!/usr/bin/env node
import chalk from "chalk";
import { getComponentSchema } from "./schemas/component";
import { generateFile, getComponentPath, getConfig } from "./utils";
import { Structure } from "./model";
import { mkdir } from "fs/promises";
import { normalize } from "path";
const prettier = require("prettier");

export const generateComponent = async (fileName: string, options: any) => {
  try {
    const { structure } = await getConfig();
    const componentBody = prettier.format(await getComponentSchema(fileName), {
      parser: "svelte",
    });
    const folderPath = await getComponentPath(fileName);
    const fullPath = normalize(`${folderPath}/${fileName}.svelte`);

    if (!options.dry) {
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
    console.log(
      chalk.red(
        `
        Can't generate component. 
        Are you sure sveil was init in root project directory (sveil init)? 
        Are you sure you run command from project root directory?
      `
      )
    );
    console.log(chalk.dim(error));
  }
};
