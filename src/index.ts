#!/usr/bin/env node
import { Command } from "commander";
import initCommand from "./init";

console.log(Math.random());

const app = new Command();

app
  .command("init")
  .alias("i")
  .description("Init sveil and create sveil config")
  .option("-d, --dry", "Run comman dry-run(no changes will be applied)")
  .action(initCommand);

const generate = app
  .command("generate")
  .alias("g")
  .description("Genearate sveil resource");

generate
  .command("component")
  .alias("c")
  .argument("<componentName>")
  .action((a) => {
    console.log("args - ", a);
  });

app.parse(process.argv);
