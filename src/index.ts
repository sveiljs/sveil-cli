#!/usr/bin/env node
import { Command, Option } from "commander";
import initCommand from "./actions/init";
// import { Structure } from "./model";
import { toLowerCase } from "./utils";
import { generateComponentAction } from "./actions/generate/component";
import { generateComponentState } from "./actions/generate/component-state";
import { generateComponentHook } from "./hooks/pre/generate/component";
import { generateInitialStructureAction } from "./actions/generate/structure";

const main = async () => {
  const app = new Command();

  app
    // add option for global config (is it possible?)
    .command("init")
    .alias("i")
    .description("Init sveil and create sveil config")
    .option("-d, --dry", "Run comman dry-run(no changes will be applied)")
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
    .option("-srvd, --services-dir <dir>", "Set services directory of project")
    .option("-std, --state-dir <dir>", "Set state directory of project")
    .option("-sd, --shared-dir <dir>", "Set shared directory of project")
    .addOption(
      new Option(
        "-sl, --script-language <language>",
        "Set default script language"
      ).choices(["ts"])
    )
    .action(initCommand);

  const generate = app
    .command("generate")
    .alias("g")
    .description("Genearate sveil resource");

  generate
    .command("structure")
    .alias("s")
    .action(generateInitialStructureAction);

  generate
    .command("component")
    .alias("c")
    .argument("<componentName>", "Component name", toLowerCase)
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
    .option("-o, --overwrite", "WARNING: Overwriting existed component")
    .option("-s, --separate", "Generate component in separate folder")
    .option("-d, --dry", "Run comman dry-run (no changes will be applied)")
    .hook("preAction", generateComponentHook)
    .action(generateComponentAction);

  generate
    .command("component-state")
    .alias("cs")
    .argument("[componentName]", "Target component name")
    .action(generateComponentState);

  await app.parseAsync(process.argv);
};

try {
  main();
} catch (e) {
  console.log(e);
}
