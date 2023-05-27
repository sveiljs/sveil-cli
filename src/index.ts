#!/usr/bin/env node
import { Command, Option } from "commander";
import initCommand from "./init";
import { generateComponent } from "./generate-component";
import { Structure } from "./model";

console.log(Math.random());

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
  .addOption(
    new Option("-rd, --root-dir <dir>", "Set root directory of project")
  )
  .addOption(new Option("-ld, --lib-dir <dir>", "Set lib directory of project"))
  .addOption(
    new Option("-fd, --features-dir <dir>", "Set features directory of project")
  )
  .addOption(
    new Option(
      "-cd, --components-dir <dir>",
      "Set components directory of project"
    )
  )
  .addOption(
    new Option(
      "-srvd, --services-dir <dir>",
      "Set services directory of project"
    )
  )
  .addOption(
    new Option(
      "-rsrvd, --reactive-services-dir <dir>",
      "Set reactive services directory of project"
    )
  )
  .addOption(
    new Option("-std, --state-dir <dir>", "Set state directory of project")
  )
  .addOption(
    new Option("-sd, --shared-dir <dir>", "Set shared directory of project")
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
  .argument("<componentName>")
  .option("-ce, --css-external", "Put component styles out of component")
  .option("-sl, --script-lang", "Set component script lang, e.g. 'ts'")
  .option("-cl, --css-lang", "Set component style lang, e.g. 'scss'")
  .option("-d, --dry", "Run comman dry-run (no changes will be applied)")
  .action(generateComponent);

app.parse(process.argv);
