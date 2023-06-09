import { ComponentSchemaOptions } from "../../model";
import { getCssimport, getCssTemplate } from "../style";

export const getComponentSchema = async (
  fileName: string,
  { scriptLanguage, cssLanguage, cssExternal }: ComponentSchemaOptions = {}
) => {
  const scriptLangTemplate =
    scriptLanguage && scriptLanguage.toLocaleLowerCase() !== "js"
      ? `lang='${scriptLanguage}'`
      : "";

  const script = `
    <script ${scriptLangTemplate}>
      ${cssExternal ? getCssimport() : ""}
      let name = "${fileName}";
    </script>
  `.trim();

  const template = `
      <div class=${fileName}>
        {name}
      </div>
  `.trim();

  const css = cssExternal ? "" : getCssTemplate(fileName, cssLanguage);

  return script + template + css;
};
