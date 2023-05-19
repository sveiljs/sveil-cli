#!/usr/bin/env node
import { fork } from "child_process";

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
