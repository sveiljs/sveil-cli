import { capitalize } from "../../utils";

export const getComponentStateSchema = (name: string) => {
  const className = `${capitalize(name)}State`;
  return `
    /* eslint-disable @typescript-eslint/no-empty-interface */
    import { type SubscribitionsBase, Subscribitions } from '@sveil/core';
    import type { State } from './model';

    export interface ${className} extends SubscribitionsBase<State> {}

    export class ${className} extends Subscribitions {
      constructor(state: State) {
        super(state);
      }
    }
  `.trim();
};
