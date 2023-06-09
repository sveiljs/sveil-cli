#!/usr/bin/env node
import chalk from "chalk";
import { fork } from "child_process";
import { writeFile } from "fs";
import { mkdir, readFile, readdir, rm, stat, unlink } from "fs/promises";
import { Config, Structure } from "./model";
import { normalize } from "path";

export const runScript = async (
  scriptPath: string,
  callback: (err: any) => void
) => {
  // keep track of whether callback has been invoked to prevent multiple invocations
  let invoked = false;

  const process = fork(scriptPath);

  // listen for errors as they may prevent the exit event from firing
  process.on("error", (err) => {
    if (invoked) return;
    invoked = true;
    callback(err);
  });

  // execute the callback once the process has finished running
  process.on("exit", async (code) => {
    if (invoked) return;
    invoked = true;
    var err = code === 0 ? null : new Error("exit code " + code);
    callback(err);
  });
};

// runScript("./init.js", (err) => {
//   if (err) throw err;
//   console.log("finished running some-script.js ");
// });

export const getActionError = async () => {
  const files = await readdir(process.cwd());
  const noPackage = !files.includes("package.json")
    ? "No package.json detected. Are you sure npm was init?"
    : "";
  const noSvelte = !files.includes("svelte.config.js")
    ? "No svelte.config.js detected. Are you sure svelte was init?"
    : "";
  return noPackage || noSvelte;
};

export const generateFile = async (filePath: string, content: any) => {
  const fileContent =
    typeof content === "string" ? content : JSON.stringify(content, null, 2);
  writeFile(normalize(filePath), fileContent, (err) => {
    if (err) {
      console.error(chalk.red(`File generate error: ${err}`));
    }
  });
};

export const generateInitFolders = async () => {
  const {
    structure,
    libDir,
    sourceDir,
    defaultCssLang,
    defaultScriptLang,
    ...config
  } = await getConfig();
  if (structure === Structure.DOMAIN) {
    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        const dir = config[key];
        await mkdir(normalize(`./${sourceDir}/${libDir}/${dir}`), {
          recursive: true,
        });
      }
    }
  } else {
    const { sharedDir, stateDir, featuresDir } = config;
    [stateDir, sharedDir, featuresDir].forEach(async (dir) => {
      await mkdir(normalize(`./${sourceDir}/${libDir}/${dir}`), {
        recursive: true,
      });
    });
  }
};

export const getConfig = async () => {
  const json = await readFile(process.cwd() + "/sveil-cli.json", {
    encoding: "utf8",
  });
  return JSON.parse(json) as Config;
};

export const getComponentsDir = async () => {
  const { sourceDir, libDir, componentsDir } = await getConfig();
  return normalize(`${process.cwd()}/${sourceDir}/${libDir}/${componentsDir}`);
};

export const getComponentPath = async (
  fileName: string,
  extraFolder = false
) => {
  const { structure, sourceDir, libDir, componentsDir, featuresDir } =
    await getConfig();

  if (structure === Structure.DOMAIN) {
    if (!extraFolder) {
      return await getComponentsDir();
    }
    return normalize(`${await getComponentsDir()}/${fileName}`);
  }
  return normalize(
    `${process.cwd()}/${sourceDir}/${libDir}/${featuresDir}/${fileName}/${componentsDir}`
  );
};

export const isTsDetected = async () => {
  const rootFiles = await readdir(process.cwd());
  return rootFiles.includes("tsconfig.json");
};

export const isCompoentExisted = async (componentName: string) => {
  const files = await readdir(await getComponentsDir());
  return (
    files.includes(componentName) || files.includes(`${componentName}.svelte`)
  );
};

export const removeDuplicates = async (folder: string, name: string) => {
  if (!name || !folder) return;

  const files = await readdir(normalize(folder));

  for (const f of files) {
    const entityName = f.split(".")[0];
    if (entityName === name) {
      const filePath = normalize(`${folder}/${f}`);
      const stats = await stat(filePath);
      if (stats.isDirectory()) {
        await rm(filePath, {
          recursive: true,
          force: true,
        });
      } else {
        await unlink(filePath);
      }
    }
  }
};

export const toLowerCase = (str: string) => str.toLocaleLowerCase();

export const logGeneratedFile = (fileName: string, fullPath: string) =>
  console.log(chalk.blue(`- file ${fileName} generated in ${fullPath}`.trim()));
