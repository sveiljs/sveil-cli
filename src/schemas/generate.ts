import { readdir } from "fs/promises";

export const getComponentSchema = async (fileName: string) => {
  const isTypescript = (await readdir(process.cwd())).includes("tsconfig.json");
  return `
    <script ${isTypescript ? "lang='ts'" : ""}>
      let componentName = "${fileName}";
    </script> 
    <div class=${fileName}>
      {componentName}
    </div>
    <style>
      .${fileName} {
        margin: 0;
        padding: 0;
      }
    </style>
  `.trim();
};
