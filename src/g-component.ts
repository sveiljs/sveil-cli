#!/usr/bin/env node
import chalk from "chalk";
import { getComponentSchema } from "./schemas/generate";
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
    let componentPath = await getComponentPath(fileName);
    const showPath = normalize(`${componentPath}/${fileName}.svelte`);

    if (!options.dry) {
      if (structure === Structure.DOMAIN) {
        await generateFile(showPath, componentBody);
      } else {
        await mkdir(componentPath, { recursive: true });
        await generateFile(
          normalize(`${componentPath}/${fileName}.svelte`),
          componentBody
        );
      }
    }
    console.log(
      chalk.blue(`
    svelte component ${fileName}.svelte generated in ${showPath}
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
