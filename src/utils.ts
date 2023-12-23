#!/usr/bin/env node
import chalk from "chalk";
import { fork } from "child_process";
import {
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  unlink,
  writeFile,
} from "fs/promises";
import { Config, ScriptLangs, StoreRef, Structure } from "./model";
import { normalize } from "path";
import { defaultConfig } from "./config";
import { Project } from "ts-morph";

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

export const createDir = async (path: string) => {
  await mkdir(normalize(path), {
    recursive: true,
  });
};

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

  await writeFile(normalize(filePath), fileContent).catch((err) => {
    if (err) {
      console.error(chalk.red(`File generate error: ${err}`));
    }
  });
};

export const generateInitFolders = async () => {
  const { structure, libDir, sourceDir, ...config } = await getConfig();
  if (structure === Structure.DOMAIN) {
    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        const dir = config[key];
        await createDir(`./${sourceDir}/${libDir}/${dir}`);
      }
    }
  } else {
    const { sharedDir, stateDir, featuresDir } = config;
    [stateDir, sharedDir, featuresDir].forEach(async (dir) => {
      await createDir(`./${sourceDir}/${libDir}/${dir}`);
    });
  }
};

export const getConfig = async (): Promise<Config> => {
  try {
    const json = await readFile(process.cwd() + "/sveil-cli.json", {
      encoding: "utf8",
    });
    return JSON.parse(json) as Config;
  } catch (error) {
    return {
      ...defaultConfig,
    } as Config;
  }
};

export const getScriptLang = async () =>
  (await isTsDetected()) ? ScriptLangs.TS : "";

export const getComponentsDir = async () => {
  const { sourceDir, libDir, componentsDir } = await getConfig();
  return normalize(`${process.cwd()}/${sourceDir}/${libDir}/${componentsDir}`);
};

export const generateCompotentPath = async (
  componentName: string,
  extraFolder = false
) => {
  const { structure, sourceDir, libDir, componentsDir, featuresDir } =
    await getConfig();

  if (structure === Structure.DOMAIN) {
    if (!extraFolder) {
      return await getComponentsDir();
    }
    return normalize(`${await getComponentsDir()}/${componentName}`);
  }
  return normalize(
    `${process.cwd()}/${sourceDir}/${libDir}/${featuresDir}/${componentName}/${componentsDir}`
  );
};

export const getComponentPath = async (componentName: string) => {
  const componentsDir = await getComponentsDir();
  const componentPath = `${componentsDir}/${componentName}`;
  const componentState = await stat(componentPath);
  const fullComponentPath = componentState.isDirectory()
    ? `${componentPath}/${componentName}.svelte`
    : componentPath;
  return normalize(fullComponentPath);
};

export const isTsDetected = async () => {
  const rootFiles = await readdir(process.cwd());
  return rootFiles.includes("tsconfig.json");
};

export const isCompoentExisted = async (componentName: string) => {
  try {
    const files = await readdir(await getComponentsDir());
    return (
      files.includes(componentName) || files.includes(`${componentName}.svelte`)
    );
  } catch (error) {
    return false;
  }
};

export const removeDuplicates = async (folder: string, name: string) => {
  if (!name || !folder) return;

  const nodes = await readdir(normalize(folder));

  for (const node of nodes) {
    const entityName = getFileName(node);
    if (entityName === name) {
      const path = normalize(`${folder}/${node}`);
      const pathStats = await stat(path);
      if (pathStats.isDirectory()) {
        await rm(path, {
          recursive: true,
          force: true,
        });
      } else {
        await unlink(path);
      }
    }
  }
};

export const toLowerCase = (str: string) => str?.toLocaleLowerCase?.();

export const logGeneratedFile = (fileName: string, fullPath: string) =>
  console.log(chalk.blue(`- file ${fileName} generated in ${fullPath}`.trim()));

export const capitalize = (str: string) =>
  str[0].toLocaleUpperCase() + str.slice(1);

export const getFileNameExtension = (str: string) => str.split(".");

export const getFileName = (str) => getFileNameExtension(str)[0];

export const getStateDir = async () => {
  const { sourceDir, libDir, stateDir } = await getConfig();
  return normalize(`${process.cwd()}/${sourceDir}/${libDir}/${stateDir}`);
};

export const getStores = async () => {
  try {
    const stateDir = await getStateDir();

    const project = new Project();

    project.addSourceFilesAtPaths([`${stateDir}/*.ts`]);

    return project
      .getSourceFiles()
      .map((file) =>
        Array.from(file.getExportedDeclarations().entries())
          .filter(([key, [val]]) => {
            const type = val.getType().getText();
            return (
              type.includes('import("svelte/store").Writable') ||
              type.includes('import("svelte/store").Readable')
            );
          })
          .map(([key, [val]]) => {
            const genType = val.getType().getTypeArguments()?.[0];

            const baseType = genType.getText();

            const hasImport = !!baseType.match(/import\(/g)?.length;

            const type = hasImport
              ? genType?.getSymbolOrThrow()?.getName()
              : baseType;

            let genTypePath = hasImport
              ? genType
                  ?.getSymbol()
                  ?.getDeclarations()
                  ?.map((d) => d.getSourceFile().getFilePath() as string)
                  ?.at(0) || ""
              : "";

            genTypePath = genTypePath.match(/lib.+/g)?.at(0) as string;

            genTypePath = genTypePath ? `$${genTypePath}` : "";

            return new StoreRef(key, type, file.getBaseName(), genTypePath);
          })
          .flat()
      )
      .flat();
  } catch (err) {
    console.error(chalk.red(`Cannot get stores: ${err}`));
  }
};
