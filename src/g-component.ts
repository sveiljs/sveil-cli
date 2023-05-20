import chalk from "chalk";
import { getComponentSchema } from "./schemas/generate";
import { generateFile } from "./utils";
const prettier = require("prettier");

export const generateComponent = async (fileName: string, options: any) => {
  const componentBody = prettier.format(await getComponentSchema(fileName), {
    parser: "svelte",
  });
  if (!options.dry) {
    await generateFile(`${fileName}.svelte`, componentBody);
  }
  console.log(
    chalk.blue(`
    svelte component ${fileName}.svelte generated in ${""}
  `)
  );
};
