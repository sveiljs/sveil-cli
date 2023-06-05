#!/usr/bin/env node
import { Command, Option } from "commander";
import initCommand from "./actions/init";
import { generateComponent } from "./actions/generate-component";
import { Structure } from "./model";
import { toLowerCase } from "./utils";

const app = new Command();

app
  .command("init")
  .alias("i")
  .description("Init sveil and create sveil config")
  .option("-d, --dry", "Run comman dry-run(no changes will be applied)")
  .option("-y, --skip", "Skip interactive tour and init with default values")
  .addOption(
    new Option(
      "-s, --structure <structure>",
      "Set structure of project"
    ).choices(Object.values(Structure))
  )
  .option("-rd, --root-dir <dir>", "Set root directory of project")
  .option("-ld, --lib-dir <dir>", "Set lib directory of project")
  .option("-fd, --features-dir <dir>", "Set features directory of project")
  .option("-cd, --components-dir <dir>", "Set components directory of project")
  .option("-srvd, --services-dir <dir>", "Set services directory of project")
  .option(
    "-rsrvd, --reactive-services-dir <dir>",
    "Set reactive services directory of project"
  )
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
  .command("component")
  .alias("c")
  // Made argument optional and add question to interactive tour
  // remove existed component before regeneration
  // warning when creating compoent with existed name (add override option)
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
  .action(generateComponent);

app.parse(process.argv);
