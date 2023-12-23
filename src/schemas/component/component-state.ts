import { StoreRef } from "../../model";
import { capitalize } from "../../utils";

const getComments = (isTs = false) => {
  if (isTs) {
    return `
      /* eslint-disable @typescript-eslint/no-empty-interface */
    `;
  }
  return "";
};

const getImports = (isTs = false, stores: StoreRef[]) => {
  const storeImports = stores?.reduce(
    (prev, cur) =>
      cur.genTypePath
        ? prev + `import type { ${cur.storeType} } from '${cur.genTypePath}';`
        : prev,
    ""
  );

  if (isTs) {
    return `
      import { type SubscribitionsBase, Subscribitions, type SvelteStore, type SvelteComponentState } from '@sveil/core';
      ${storeImports}
    `;
  }
  return `
    import { Subscribitions } from '@sveil/core';
  `;
};

const getTypes = (className: string, stores: StoreRef[], isTs = false) => {
  if (isTs) {
    return `
      interface State extends SvelteComponentState {
        ${
          stores.length
            ? stores.map((s) => `${s.storeName}: SvelteStore<${s.storeType}>`)
            : "storeName: SvelteStore<any>"
        }
      }
      
      export interface ${className} extends SubscribitionsBase<State> {}
    `;
  }
  return "";
};

export const getComponentStateSchema = (
  name: string,
  stores: StoreRef[],
  fileName: string,
  isTs = false
) => {
  const className = `${capitalize(fileName || name)}State`;
  const comments = getComments(isTs);
  const imports = getImports(isTs, stores);
  const types = getTypes(className, stores, isTs);
  const body = `
      export class ${className} extends Subscribitions {
      constructor(state: State) {
        super(state);
      }
    }
  `;
  return `
    ${comments}
    ${imports}
    ${types}
    ${body}
  `.trim();
};
