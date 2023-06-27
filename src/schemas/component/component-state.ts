import { capitalize } from "../../utils";

export const getComponentStateSchema = (name: string) => {
  const className = capitalize(name);
  return `
    export default class ${className} {
      constructor() {}
    }
  `.trim();
};
