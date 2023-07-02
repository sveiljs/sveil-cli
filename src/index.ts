#!/usr/bin/env node
import { Command, Option } from "commander";
import initCommand from "./actions/init";
// import { Structure } from "./model";
import { toLowerCase } from "./utils";
import { generateComponentAction } from "./actions/generate/component";
// import { generateComponentState } from "./actions/generate/component-state";
import { generateComponentHook } from "./hooks/pre/generate/component";
// import { generateInitialStructureAction } from "./actions/generate/structure";

const main = async () => {
  const app = new Command();

  app
    .name("sveil")
    .command("init")
    .description("Init sveil and create sveil config")
    .alias("i")
    .option("-d, --dry", "Run command dry-run(no changes will be applied)")
    .option("-y, --skip", "Skip interactive tour and init with default values")
    // need investigate use cases for feature structure
    // .addOption(
    //   new Option(
    //     "-s, --structure <structure>",
    //     "Set structure of project"
    //   ).choices(Object.values(Structure))
    // )
    // .option("-fd, --features-dir <dir>", "Set features directory of project")
    .option("-srcd, --source-dir <dir>", "Set source directory of project")
    .option("-ld, --lib-dir <dir>", "Set lib directory of project")
    .option(
      "-cd, --components-dir <dir>",
      "Set components directory of project"
    )
    // redundant for now
    // .option("-srvd, --services-dir <dir>", "Set services directory of project")
    // .option("-std, --state-dir <dir>", "Set state directory of project")
    // .option("-sd, --shared-dir <dir>", "Set shared directory of project")
    .action(initCommand);

  const generate = app
    .command("generate")
    .description("Generate sveil resource")
    .alias("g");

  // redundant for now
  // generate
  //   .command("structure")
  //   .description("Generate initial folders structure")
  //   .alias("s")
  //   .action(generateInitialStructureAction);

  generate
    .command("component")
    .description("Generate svelte component")
    .alias("c")
    .argument("<componentName>", "Component name", toLowerCase)
    .option("-d, --dry", "Run command dry-run (no changes will be applied)")
    .addOption(
      new Option(
        "-sl, --script-language <language>",
        "Set component script language"
      ).choices(["ts", "js"])
    )
    .option("-ce, --css-external", "Put component styles out of component")
    .addOption(
      new Option(
        "-cl, --css-language <language>",
        "Set component style language, e.g. 'scss'"
      )
        .choices(["scss", "postcss"])
        .conflicts(["cssExternal"])
    )
    .option("-o, --overwrite", "WARNING: Overwriting existing component")
    .option("-s, --separate", "Generate component in separate folder")
    .hook("preAction", generateComponentHook)
    .action(generateComponentAction);

  // in develop
  // generate
  //   .command("component-state")
  //   .description("Generate component state")
  //   .alias("cs")
  //   .argument("[componentName]", "Target component name")
  //   .action(generateComponentState);

  await app.parseAsync(process.argv);
};

try {
  main();
} catch (e) {
  console.log(e);
}
