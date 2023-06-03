export const getCssMainRule = (name: string) =>
  `
  .${name} {
    margin: 0;
    padding: 0;
  }
`.trim();

export const getCssTemplate = (fileName: string, cssLang?: string) => {
  const cssLangTemplate = cssLang ? `lang='${cssLang}'` : "";
  return `<style ${cssLangTemplate}>
      ${getCssMainRule(fileName)}
    </style>
  `.trim();
};

export const getCssimport = (cssFileName = "style.css") =>
  `import './${cssFileName}'`.trim();
