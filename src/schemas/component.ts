import { ComponentSchemaOptions } from "../model";

export const getComponentSchema = async (
  fileName: string,
  { externalCss, scriptLang, CssLang }: ComponentSchemaOptions = {}
) => {
  const scriptLangTemplate = scriptLang ? `lang='${scriptLang}'` : "";
  const cssLangTemplate = CssLang ? `lang='${CssLang}'` : "";

  const script = `
    <script ${scriptLangTemplate}>
      let componentName = "${fileName}";
    </script>
  `.trim();

  const template = `
      <div class=${fileName}>
        {componentName}
      </div>
  `.trim();

  const css = externalCss
    ? ""
    : `<style ${cssLangTemplate}>
      .${fileName} {
        margin: 0;
        padding: 0;
      }
    </style>
  `.trim();

  return script + template + css;
};
