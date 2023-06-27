#!/usr/bin/env node
import chalk from "chalk";
import { mkdir, readdir, rename, stat } from "fs/promises";
import {
  generateFile,
  getComponentPath,
  getComponentsDir,
  getFileName,
  isTsDetected,
} from "../../utils";
import { select } from "@inquirer/prompts";
import { getComponentStateSchema } from "../../schemas/component/component-state";
import { normalize } from "path";
const prettier = require("prettier");

export const generateComponentState = async (componentName: string) => {
  try {
    const components = await readdir(await getComponentsDir());
    let existedComponent;

    if (componentName) {
      existedComponent = components.find(
        (c) => getFileName(c) === componentName
      );
    } else {
      if (!components.length) throw "No components existed";

      const choices = components.map((c) => ({
        name: getFileName(c),
        value: c,
      }));
      existedComponent = await select({
        message: "Select a component name",
        choices,
      });
    }

    if (!existedComponent) throw `Component ${componentName} does not exists`;

    const existedComponentName = getFileName(existedComponent);
    const componentsDir = await getComponentsDir();
    const isTs = await isTsDetected();
    const componentFileNode = normalize(`${componentsDir}/${existedComponent}`);
    const componentStat = await stat(componentFileNode);
    const componentFullPath = await getComponentPath(existedComponent);
    const newPath = normalize(`${componentsDir}/${existedComponentName}`);
    const newComponentPath = normalize(
      `${newPath}/${existedComponentName}.svelte`
    );
    const companentStatePath = normalize(
      `${newPath}/component.state.${isTs ? "ts" : "js"}`
    );
    const componentStateSchema = prettier.format(
      getComponentStateSchema(existedComponentName),
      {
        parser: isTs ? "typescript" : "babel",
      }
    );

    if (!componentStat.isDirectory()) {
      await mkdir(normalize(`${componentsDir}/${existedComponentName}`));
      await rename(componentFullPath, newComponentPath);
    }

    await generateFile(companentStatePath, componentStateSchema);
  } catch (error) {
    console.log(chalk.red("Can't generate component state: "));
    console.log(chalk.dim(error));
  }
};
