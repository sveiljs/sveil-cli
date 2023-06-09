export const getComponentStateSchema = (
  name: string,
  expressions: string[]
) => {
  const className = name[0].toLocaleUpperCase + name.slice(1);
  return `
    export default class ${className} {
      constructor() {}
    }
  `.trim();
};
