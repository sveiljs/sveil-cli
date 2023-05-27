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
  .addOption(
    new Option(
      "-s, --structure <structure>",
      "Set structure of project"
    ).choices(Object.values(Structure))
  )
  .addOption(
    new Option("-r, --root-dir <dir>", "Set root directory of project")
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
